"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter(); const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [error,setError]=useState(""); const [loading,setLoading]=useState(false);
  async function submit(e:FormEvent){e.preventDefault();setLoading(true);setError("");const r=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();setLoading(false);if(!r.ok){setError(d.error||"Erro");return}router.push("/");router.refresh()}
  return <main className="auth"><form className="card" onSubmit={submit}><h1>Entrar no VendaIA</h1><p>Use a sua conta para aceder ao agente.</p><input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} required/><input type="password" placeholder="Palavra-passe" value={password} onChange={e=>setPassword(e.target.value)} required/><button disabled={loading}>{loading?"A entrar...":"Entrar"}</button>{error&&<div className="error">{error}</div>}<a href="/register">Criar uma conta</a></form></main>;
}