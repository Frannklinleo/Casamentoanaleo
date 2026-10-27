import { useState, useEffect } from 'react'
import { getPix, gerarPix, paguei, qrDataUrl, brl } from './api.js'

function Modal({ sel, px, min, fechar }) {
  const [nome, setNome] = useState(''), [msg, setMsg] = useState(''), [valor, setValor] = useState('')
  const [ck1, setCk1] = useState(false), [ck2, setCk2] = useState(false)
  const [passo, setPasso] = useState(1), [dados, setDados] = useState(null), [qr, setQr] = useState('')
  const [erro, setErro] = useState(''), [ocup, setOcup] = useState(false), [cop, setCop] = useState(false)
  useEffect(() => { const f = e => e.key === 'Escape' && fechar(); addEventListener('keydown', f); return () => removeEventListener('keydown', f) }, [])
  const rec = px.recebedor
  const v = sel.livre ? Number(String(valor).replace(',', '.')) : Number(sel.valor)
  const pode = rec && ck1 && nome.trim().length >= 3 && v >= (sel.livre ? min : 0.01)
  const gerar = async () => {
    setErro(''); setOcup(true)
    try {
      const d = await gerarPix({ presenteId: sel.livre ? undefined : sel.id, valor: v, nome, mensagem: msg })
      setDados(d); setQr(await qrDataUrl(d.copia).catch(() => '')); setPasso(2)
    } catch (e) { setErro(e.message) }
    setOcup(false)
  }
  const confirmar = async () => { setErro(''); setOcup(true); try { await paguei(dados.id); setPasso(3) } catch (e) { setErro(e.message) } setOcup(false) }
  const copiar = async () => { try { await navigator.clipboard.writeText(dados.copia); setCop(true) } catch { setErro('Não foi possível copiar. Selecione o texto e copie.') } }
  return <div className="modal" onClick={fechar}><div className="caixa" role="dialog" aria-modal="true" aria-label={sel.nome} onClick={e => e.stopPropagation()}>
    {passo === 1 && <>
      <h3>{sel.nome}</h3>
      {!sel.livre && <p><b>{brl(sel.valor)}</b></p>}
      <label className="campo"><span>Seu nome</span><input value={nome} onChange={e => setNome(e.target.value)} autoFocus /></label>
      {sel.livre && <label className="campo"><span>Valor (mínimo {brl(min)})</span><input inputMode="decimal" value={valor} onChange={e => setValor(e.target.value)} placeholder="Ex.: 100" /></label>}
      <label className="campo"><span>Recado para os noivos (opcional)</span><textarea rows="2" value={msg} onChange={e => setMsg(e.target.value)} /></label>
      {rec ? <div className="rec"><small>Recebedor do Pix</small><b>{rec.nome}</b><small>Chave: {rec.chave}</small></div>
        : <p className="erro">O Pix será liberado em breve. Volte mais tarde.</p>}
      <label className="ck"><input type="checkbox" checked={ck1} onChange={e => setCk1(e.target.checked)} />Conferi que o recebedor é {rec ? rec.nome : 'o casal'}.</label>
      {erro && <p role="alert" className="erro">{erro}</p>}
      <button className="btn" disabled={!pode || ocup} onClick={gerar}>{ocup ? 'Gerando…' : 'Gerar Pix'}</button>
    </>}
    {passo === 2 && <>
      <h3>Pague com Pix</h3>
      <p><b>{brl(v)}</b> para {rec.nome}</p>
      {qr && <img className="qr" src={qr} alt="QR Code do Pix" />}
      <div className="copia">{dados.copia}</div>
      <button className="sec-btn" onClick={copiar}>{cop ? 'Código copiado' : 'Copiar código Pix'}</button>
      <p>No app do seu banco, use Pix &gt; Copia e Cola (ou leia o QR Code). Antes de confirmar, o banco mostra o nome do recebedor.</p>
      <label className="ck"><input type="checkbox" checked={ck2} onChange={e => setCk2(e.target.checked)} />O meu banco mostrou o recebedor {rec.nome}.</label>
      {erro && <p role="alert" className="erro">{erro}</p>}
      <button className="btn" disabled={!ck2 || ocup} onClick={confirmar}>Já paguei</button>
    </>}
    {passo === 3 && <>
      <h3>Muito obrigado, {nome.split(' ')[0]}! 💚</h3>
      <p>Assim que os noivos confirmarem o recebimento, o seu presente fica registrado.</p>
      <button className="btn" onClick={fechar}>Fechar</button>
    </>}
  </div></div>
}

export default function Presentes({ c }) {
  const [px, setPx] = useState({ reservados: [], recebedor: null })
  const [sel, setSel] = useState(null)
  useEffect(() => {
    let on = true
    const l = () => getPix().then(d => on && setPx(d)).catch(() => {})
    l(); const t = setInterval(l, 8000)
    return () => { on = false; clearInterval(t) }
  }, [])
  const min = Number(c.livreMin) || 20
  return <section id="presentes" className="sec fundo centro"><div className="rev">
    <h2>Lista de presentes</h2>
    <p className="lead peq">O maior presente é a sua presença. Se quiser nos presentear, escolha um item ou contribua com o valor que preferir, via Pix.</p>
    <div className="presentes">
      <button className="pres livre" onClick={() => setSel({ id: 'livre', nome: 'Presente com valor livre', livre: true })}>
        <h3>Valor livre</h3><p>Você escolhe quanto quer contribuir.</p><b>a partir de {brl(min)}</b></button>
      {c.presentes.map(p => {
        const res = px.reservados.includes(p.id)
        return <button key={p.id} className="pres" disabled={res} onClick={() => setSel(p)}>
          <h3>{p.nome}</h3>{p.descricao && <p>{p.descricao}</p>}<b>{res ? 'Já escolhido' : brl(p.valor)}</b></button>
      })}
    </div>
  </div>
    {sel && <Modal sel={sel} px={px} min={min} fechar={() => setSel(null)} />}
  </section>
}
