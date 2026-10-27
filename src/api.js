const demo = () => typeof window !== 'undefined' && window.__DEMO__
const j = async (u, o) => {
  const r = await fetch(u, o)
  const d = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(d.erro || 'Falha na conexão')
  return d
}
const H = { 'Content-Type': 'application/json' }
export const getContent = () => demo() ? Promise.resolve(null) : j('/api/content')
export const login = (email, senha) => demo() ? Promise.resolve({ token: 'demo' })
  : j('/api/login', { method: 'POST', headers: H, body: JSON.stringify({ email, senha }) })
export const saveContent = (c, token) => demo() ? Promise.resolve({ ok: true })
  : j('/api/content', { method: 'PUT', headers: { ...H, Authorization: 'Bearer ' + token }, body: JSON.stringify(c) })
