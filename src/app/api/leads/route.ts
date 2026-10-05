import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const leads = await db.lead.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ leads });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  const body = await req.json();
  const name = String(body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Nome obrigatório." }, { status: 400 });
  const lead = await db.lead.create({ data: { userId: user.id, name, email: String(body.email || "").trim() || null, phone: String(body.phone || "").trim() || null, company: String(body.company || "").trim() || null, notes: String(body.notes || "").trim() || null } });
  return NextResponse.json({ lead }, { status: 201 });
}
