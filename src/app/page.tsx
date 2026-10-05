"use client";
import { useState } from "react";

export default function Home() {
  const [message,setMessage]=useState(""); const [reply,setReply]=useState(""); const [loading,setLoading]=useState(false);
  async function send(){ if(!message.trim()) return; setLoading(true); setReply(""); const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message})}); const d=await r.json(); setReply(d.reply||d.error); setLoading(false); }
  return <main style={{maxWidth:900,margin:"0 auto",padding:40,fontFamily:"Arial"}}><h1>VendaIA</h1><p>IA para atendimento, vendas e automação.</p><textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Digite uma mensagem para o agente VendaIA" style={{width:"100%",minHeight:140,padding:16}}/><button onClick={send} disabled={loading} style={{marginTop:12,padding:"12px 24px"}}>{loading?"Pensando...":"Enviar"}</button>{reply&&<section style={{marginTop:30,padding:20,border:"1px solid #ddd"}}><strong>Agente VendaIA</strong><p>{reply}</p></section>}</main>
}