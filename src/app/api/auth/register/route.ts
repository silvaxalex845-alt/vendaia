import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    const normalized = String(email || "").trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(normalized)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    if (String(password || "").length < 8) return NextResponse.json({ error: "A palavra-passe deve ter pelo menos 8 caracteres." }, { status: 400 });
    const exists = await db.user.findUnique({ where: { email: normalized } });
    if (exists) return NextResponse.json({ error: "Este email já está registado." }, { status: 409 });
    const user = await db.user.create({ data: { name: String(name || "").trim() || null, email: normalized, passwordHash: hashPassword(password) } });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Não foi possível criar a conta." }, { status: 500 });
  }
}