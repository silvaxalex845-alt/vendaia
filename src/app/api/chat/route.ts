import OpenAI from "openai";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { db } from "@/lib/prisma";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    const { message, conversationId } = await req.json();
    if (!String(message || "").trim()) return NextResponse.json({ error: "message is required" }, { status: 400 });
    let conversation = conversationId ? await db.conversation.findFirst({ where: { id: conversationId, userId: user.id } }) : null;
    if (!conversation) conversation = await db.conversation.create({ data: { userId: user.id, title: String(message).slice(0, 80) } });
    await db.message.create({ data: { conversationId: conversation.id, role: "user", content: message } });
    const history = await db.message.findMany({ where: { conversationId: conversation.id }, orderBy: { createdAt: "asc" }, take: 30 });
    const response = await client.responses.create({ model: process.env.OPENAI_MODEL || "gpt-5-mini", instructions: "Você é o agente VendaIA. Ajude empresas a vender mais, atender clientes e automatizar processos. Responda em português de forma objetiva, útil e comercial.", input: history.map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content })) });
    const reply = response.output_text || "Não consegui gerar uma resposta.";
    await db.message.create({ data: { conversationId: conversation.id, role: "assistant", content: reply } });
    return NextResponse.json({ reply, conversationId: conversation.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI service unavailable" }, { status: 500 });
  }
}