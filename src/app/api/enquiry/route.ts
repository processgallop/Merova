import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { EnquiryError, handleEnquiry } from "@/lib/enquiry";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`enquiry:${ip}`, Number(process.env.ENQUIRY_RATE_LIMIT ?? 6), 60_000)) {
    return NextResponse.json({ ok: false, message: "Too many submissions. Please wait a minute and try again." }, { status: 429 });
  }
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.headers.get("host")) {
    return NextResponse.json({ ok: false, message: "Invalid origin." }, { status: 403 });
  }
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, message: "The submission could not be read. If you attached large files, please try with smaller ones." }, { status: 400 });
  }
  try {
    const { ref } = await handleEnquiry(form, ip);
    revalidatePath("/admin", "layout");
    return NextResponse.json({ ok: true, ref });
  } catch (e) {
    if (e instanceof EnquiryError) return NextResponse.json({ ok: false, code: e.code, message: e.message, fields: e.fields }, { status: e.status });
    console.error("[enquiry] failed", e);
    return NextResponse.json({ ok: false, message: "We could not save your enquiry due to a server error. Please try again or contact us directly." }, { status: 500 });
  }
}
