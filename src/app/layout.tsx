import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "VendaIA — AI Sales Agent", description: "Agente de IA para vendas, atendimento, tradução e automação." };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="pt"><body>{children}</body></html>; }
