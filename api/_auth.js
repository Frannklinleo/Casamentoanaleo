import crypto from 'node:crypto'
const hmac = p => crypto.createHmac('sha256', process.env.SESSION_SECRET).update(p).digest('base64url')
export function assinar(email) {
  const p = Buffer.from(JSON.stringify({ email, exp: Date.now() + 12 * 3600e3 })).toString('base64url')
  return p + '.' + hmac(p)
}
export function verificar(tk) {
  const [p, s] = (tk || '').split('.')
  if (!p || !s) return null
  const a = Buffer.from(s), b = Buffer.from(hmac(p))
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  const d = JSON.parse(Buffer.from(p, 'base64url'))
  return d.exp > Date.now() ? d : null
}
export const igual = (a, b) =>
  crypto.timingSafeEqual(crypto.createHash('sha256').update(a).digest(), crypto.createHash('sha256').update(b).digest())
