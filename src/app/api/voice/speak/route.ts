import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    if (!(await getCurrentUser())) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    const { text, voice } = await req.json();
    if (!String(text || "").trim()) return NextResponse.json({ error: "Texto obrigatório." }, { status: 400 });
    const audio = await client.audio.speech.create({ model: "gpt-4o-mini-tts", voice: voice || "alloy", input: String(text), response_format: "mp3" });
    const buffer = Buffer.from(await audio.arrayBuffer());
    return new NextResponse(buffer, { headers: { "Content-Type": "audio/mpeg", "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível gerar a voz." }, { status: 500 });
  }
}
