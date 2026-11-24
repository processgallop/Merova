import { NextResponse } from "next/server";
import { deliverLead, deliveryConfigured, EnquiryError, parseEnquiry, verifyTurnstile } from "@/lib/enquiry";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Enquiry endpoint for quotes, custom requirements and contact forms.
 * It only reports success once a delivery channel (team email, CRM webhook or
 * lead store) has accepted the lead. It never fakes success.
 */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`enquiry:${ip}`, Number(process.env.ENQUIRY_RATE_LIMIT ?? 6), 60_000)) {
    return NextResponse.json({ ok: false, code: "rate_limited", error: "Too many submissions. Please wait a minute and try again." }, { status: 429 });
  }

  if (!deliveryConfigured()) {
    console.error("[enquiry] No delivery channel configured (RESEND_API_KEY+LEAD_EMAIL_FROM+LEAD_EMAIL_DEFAULT, CRM_WEBHOOK_URL or LEAD_STORE_DIR)");
    return NextResponse.json(
      { ok: false, code: "not_configured", error: "Online enquiries are not yet connected. Please contact Merova directly using the options below." },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, code: "bad_request", error: "The submission could not be read. If you attached large files, please try without them." }, { status: 400 });
  }

  try {
    const { lead, files, token } = await parseEnquiry(form);
    if (!(await verifyTurnstile(token, ip))) throw new EnquiryError(400, "captcha", "Please complete the verification and try again.");

    const result = await deliverLead(lead, files);
    if (result.failed.length) console.error(`[enquiry] ${lead.ref} channel failures:`, result.failed);
    if (!result.ok.some((c) => c === "crm" || c === "team_email" || c === "store")) {
      return NextResponse.json({ ok: false, code: "delivery_failed", error: "We couldn't submit your enquiry just now. Please try again, or contact us directly." }, { status: 502 });
    }
    console.info(`[enquiry] ${lead.ref} accepted via ${result.ok.join(", ")} → ${lead.team}`);
    return NextResponse.json({ ok: true, ref: lead.ref, team: lead.team, acknowledged: result.ok.includes("ack_email") });
  } catch (e) {
    if (e instanceof EnquiryError) return NextResponse.json({ ok: false, code: e.code, error: e.message, fields: e.fields }, { status: e.status });
    console.error("[enquiry] unexpected error", e);
    return NextResponse.json({ ok: false, code: "server_error", error: "Something went wrong. Please try again, or contact us directly." }, { status: 500 });
  }
}
