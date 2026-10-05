import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    if (!(await getCurrentUser())) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    const form = await req.formData();
    const audio = form.get("audio");
    if (!(audio instanceof File)) return NextResponse.json({ error: "Áudio obrigatório." }, { status: 400 });
    const result = await client.audio.transcriptions.create({ model: "gpt-4o-mini-transcribe", file: audio });
    return NextResponse.json({ text: result.text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível transcrever o áudio." }, { status: 500 });
  }
}
