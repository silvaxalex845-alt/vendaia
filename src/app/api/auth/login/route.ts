import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { createSession } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const normalized = String(email || "").trim().toLowerCase();
    const user = await db.user.findUnique({ where: { email: normalized } });
    if (!user || !verifyPassword(String(password || ""), user.passwordHash)) return NextResponse.json({ error: "Email ou palavra-passe incorretos." }, { status: 401 });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Não foi possível iniciar sessão." }, { status: 500 });
  }
}