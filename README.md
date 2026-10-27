# Site de casamento (Fase 2: Vercel + Neon)
1. Suba esta pasta para o GitHub e importe o repositório na Vercel (framework Vite, detectado sozinho).
2. Na Vercel: Storage > Neon Postgres > Connect ao projeto (cria `DATABASE_URL` sozinho).
3. Em Settings > Environment Variables, crie: `SESSION_SECRET` (texto longo e aleatório), `ADMIN1_EMAIL`, `ADMIN1_SENHA`, `ADMIN2_EMAIL`, `ADMIN2_SENHA`. Faça um novo deploy.
4. Acesse `/admin`, entre e edite o site. Foto do casal: `public/foto-casal.jpg`.
Local com funções: `npm i -g vercel`, `vercel env pull`, `vercel dev`.
