import { neon } from '@neondatabase/serverless'
const sql = neon(process.env.DATABASE_URL)
const criar = () => sql`create table if not exists site (chave text primary key, valor jsonb not null)`
export async function lerConteudo() {
  await criar()
  const r = await sql`select valor from site where chave = 'conteudo'`
  return r[0]?.valor ?? null
}
export async function gravarConteudo(v) {
  await criar()
  await sql`insert into site (chave, valor) values ('conteudo', ${JSON.stringify(v)}::jsonb)
            on conflict (chave) do update set valor = excluded.valor`
}
