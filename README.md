# VendaIA

Plataforma de inteligência artificial para atendimento, vendas e automação de empresas.

## V2
- Next.js + React
- PostgreSQL + Prisma
- Registo, login e logout
- Sessões seguras em cookie HttpOnly
- Passwords com scrypt + salt
- Agente de IA com OpenAI
- Conversas persistentes por utilizador
- Rotas de IA protegidas por autenticação

## Configuração
1. Copie `.env.example` para `.env`.
2. Preencha `DATABASE_URL` e `OPENAI_API_KEY`.
3. Execute `npm install`.
4. Execute `npm run db:push` para criar/atualizar as tabelas.
5. Execute `npm run build` e `npm start`.

Nunca publique as chaves reais no GitHub. Em produção, configure as variáveis de ambiente no provedor de hospedagem.