import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: "Você é o agente VendaIA. Ajude empresas a vender mais, atender clientes e automatizar processos. Responda em português de forma objetiva e comercial.",
      input: message
    });
    return NextResponse.json({ reply: response.output_text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}
