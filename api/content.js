import { lerConteudo, gravarConteudo } from './_db.js'
import { verificar } from './_auth.js'
export default async function handler(req, res) {
  try {
    if (req.method === 'GET') { res.setHeader('Cache-Control', 'no-store'); return res.json(await lerConteudo()) }
    if (req.method === 'PUT') {
      if (!verificar((req.headers.authorization || '').replace('Bearer ', ''))) return res.status(401).json({ erro: 'Sessão expirada. Entre de novo.' })
      const b = req.body
      if (!b || typeof b !== 'object' || JSON.stringify(b).length > 100000) return res.status(400).json({ erro: 'Conteúdo inválido' })
      await gravarConteudo(b)
      return res.json({ ok: true })
    }
    res.status(405).json({ erro: 'Método inválido' })
  } catch (e) { res.status(500).json({ erro: 'Erro no servidor' }) }
}
