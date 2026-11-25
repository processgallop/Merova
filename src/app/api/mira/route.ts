import { NextResponse } from "next/server";
import { aiEnabled, askClaude, guided, type MiraMessage } from "@/lib/mira";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`mira:${ip}`, 20, 60_000)) return NextResponse.json({ error: "Too many messages. Please wait a moment." }, { status: 429 });
  let body: { messages?: unknown; page?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const raw = Array.isArray(body.messages) ? body.messages.slice(-16) : [];
  const messages: MiraMessage[] = raw
    .filter((m): m is MiraMessage => !!m && typeof m === "object" && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, 800) }));
  while (messages.length && messages[0].role !== "user") messages.shift();
  if (!messages.length || messages[messages.length - 1].role !== "user") return NextResponse.json({ error: "No question received" }, { status: 400 });
  const page = typeof body.page === "string" && body.page.startsWith("/") ? body.page.slice(0, 200) : undefined;
  if (aiEnabled()) {
    try {
      return NextResponse.json(await askClaude(messages, page));
    } catch (e) {
      console.error("[mira] AI unavailable, using guided mode:", e instanceof Error ? e.message : e);
    }
  }
  return NextResponse.json(await guided(messages));
}
