# VendaIA

Plataforma global de IA para vendas, atendimento, tradução e gestão de leads.

## O que já está incluído
- Next.js + React + TypeScript
- PostgreSQL + Prisma
- Registo, login, logout e sessões HttpOnly
- Agente de vendas com OpenAI
- Conversas persistentes por utilizador
- Tradutor IA multilíngue
- Transcrição de voz
- Texto para voz
- CRM simples de leads
- Dashboard responsivo para telemóvel e desktop
- Planos e estrutura de produto internacional

## Configuração local
1. Copie `.env.example` para `.env`.
2. Preencha `DATABASE_URL` e `OPENAI_API_KEY`.
3. Execute `npm install`.
4. Execute `npm run db:push`.
5. Execute `npm run build`.
6. Execute `npm start`.

## Produção
Configure as mesmas variáveis no provedor de hospedagem. Nunca coloque chaves reais no GitHub.

Para ativar cobrança real, configure as variáveis Stripe e ligue o fluxo de checkout/webhook a um provedor de pagamentos compatível com o país do cliente.
