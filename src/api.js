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
export const brl = n => Number(n).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const auth = tk => ({ ...H, Authorization: 'Bearer ' + tk })
export const getPix = () => demo() ? Promise.resolve({ reservados: ['p2'], recebedor: { nome: 'Nome do Titular da Conta', chave: 'an•••@exemplo.com' } }) : j('/api/pix')
export const gerarPix = b => demo() ? Promise.resolve({ id: 1, copia: '00020126EXEMPLO-DE-CODIGO-PIX-DEMONSTRACAO6304ABCD' })
  : j('/api/pix', { method: 'POST', headers: H, body: JSON.stringify({ acao: 'gerar', ...b }) })
export const paguei = id => demo() ? Promise.resolve({ ok: true }) : j('/api/pix', { method: 'POST', headers: H, body: JSON.stringify({ acao: 'paguei', id }) })
export const adminPag = tk => demo() ? Promise.resolve({ pagamentos: [{ id: 1, presente_id: 'p2', valor: 180, nome: 'Maria Souza', mensagem: 'Felicidades!', status: 'aguardando' }], pix: { nome: '', chave: '', cidade: '' } })
  : j('/api/pagamentos', { headers: auth(tk) })
export const salvarPix = (pix, tk) => demo() ? Promise.resolve({ ok: true }) : j('/api/pagamentos', { method: 'POST', headers: auth(tk), body: JSON.stringify(pix) })
export const marcar = (id, status, tk) => demo() ? Promise.resolve({ ok: true }) : j('/api/pagamentos', { method: 'PUT', headers: auth(tk), body: JSON.stringify({ id, status }) })
export const qrDataUrl = async t => { if (demo()) return ''; const m = await import('qrcode'); return (m.default || m).toDataURL(t, { margin: 1, width: 260 }) }
