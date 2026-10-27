import { assinar, igual } from './_auth.js'
export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método inválido' })
  const { email = '', senha = '' } = req.body || {}
  const contas = [[process.env.ADMIN1_EMAIL, process.env.ADMIN1_SENHA], [process.env.ADMIN2_EMAIL, process.env.ADMIN2_SENHA]]
  const ok = contas.some(([e, s]) => e && s && igual(email.trim().toLowerCase(), e.toLowerCase()) && igual(senha, s))
  if (!ok) return res.status(401).json({ erro: 'E-mail ou senha incorretos' })
  res.json({ token: assinar(email.trim().toLowerCase()) })
}
