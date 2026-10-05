import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    if (!(await getCurrentUser())) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    const { text, from, to } = await req.json();
    if (!String(text || "").trim() || !String(to || "").trim()) return NextResponse.json({ error: "Texto e idioma de destino são obrigatórios." }, { status: 400 });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      instructions: "Você é um tradutor profissional. Traduza preservando significado, tom, nomes, números e formatação. Não explique a tradução. Retorne apenas o texto traduzido.",
      input: `Idioma de origem: ${from || "detetar automaticamente"}\nIdioma de destino: ${to}\n\nTexto:\n${text}`
    });
    return NextResponse.json({ translation: response.output_text || "" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Serviço de tradução indisponível." }, { status: 500 });
  }
}
