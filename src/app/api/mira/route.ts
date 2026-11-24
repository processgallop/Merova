import { NextResponse } from "next/server";
import { aiEnabled, miraAI, miraGuided, type MiraMessage } from "@/lib/mira";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit(`mira:${ip}`, Number(process.env.MIRA_RATE_LIMIT ?? 20), 60_000)) return NextResponse.json({ error: "You're sending messages quickly. Please wait a moment." }, { status: 429 });
  let body: { messages?: MiraMessage[] };
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const messages = (body.messages ?? []).filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string").map((m) => ({ role: m.role, content: m.content.slice(0, 2000) })).slice(-12);
  if (!messages.length || messages[messages.length - 1].role !== "user") return NextResponse.json({ error: "No question received." }, { status: 400 });
  if (aiEnabled()) {
    try { return NextResponse.json(await miraAI(messages)); }
    catch (e) { console.error("[mira] AI error, falling back to guided mode", e); return NextResponse.json({ ...miraGuided(messages), degraded: true }); }
  }
  return NextResponse.json(miraGuided(messages));
}

export async function GET() { return NextResponse.json({ mode: aiEnabled() ? "ai" : "guided" }); }
