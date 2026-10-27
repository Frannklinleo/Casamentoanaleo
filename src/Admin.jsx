import { useState, useEffect } from 'react'
import { content as DEF } from './content.js'
import { getContent, login, saveContent, adminPag, salvarPix, marcar, brl } from './api.js'

const guarda = { get: () => { try { return sessionStorage.getItem('tk') || '' } catch { return '' } },
  set: v => { try { v ? sessionStorage.setItem('tk', v) : sessionStorage.removeItem('tk') } catch {} } }

function Campo({ rotulo, valor, onChange, tipo = 'text', area }) {
  return <label className="campo"><span>{rotulo}</span>
    {area ? <textarea rows="3" value={valor} onChange={e => onChange(e.target.value)} />
      : <input type={tipo} value={valor} onChange={e => onChange(e.target.value)} />}</label>
}

// Lista editável: campos = [[chave, rótulo, tipo]] ; tipo 'area' = texto longo, 'linhas' = uma pessoa por linha
function Lista({ titulo, itens, onChange, campos, novo }) {
  const set = (i, k, v) => onChange(itens.map((it, n) => n === i ? { ...it, [k]: v } : it))
  return <fieldset><legend>{titulo}</legend>
    {itens.map((it, i) => <div className="item" key={i}>
      {campos.map(([k, r, t]) => t === 'linhas'
        ? <Campo key={k} rotulo={r + ' (um por linha)'} area valor={it[k].join('\n')} onChange={v => set(i, k, v.split('\n'))} />
        : <Campo key={k} rotulo={r} area={t === 'area'} valor={it[k]} onChange={v => set(i, k, v)} />)}
      <button type="button" className="sec-btn" onClick={() => onChange(itens.filter((_, n) => n !== i))}>Remover</button>
    </div>)}
    <button type="button" className="sec-btn" onClick={() => onChange([...itens, novo])}>Adicionar</button>
  </fieldset>
}

function Pagamentos({ tk, presentes }) {
  const [d, setD] = useState({ pagamentos: [], pix: { nome: '', chave: '', cidade: '' } })
  const [msg, setMsg] = useState('')
  const carregar = () => adminPag(tk).then(setD).catch(e => setMsg(e.message))
  useEffect(() => { carregar() }, [])
  const up = (k, v) => setD(x => ({ ...x, pix: { ...x.pix, [k]: v } }))
  const salvar = async () => { setMsg('Salvando…'); try { await salvarPix(d.pix, tk); setMsg('Pix salvo.') } catch (e) { setMsg(e.message) } }
  const marca = async (id, s) => { try { await marcar(id, s, tk); carregar() } catch (e) { setMsg(e.message) } }
  const total = d.pagamentos.filter(p => p.status === 'confirmado').reduce((a, p) => a + p.valor, 0)
  const nomeDe = id => presentes.find(x => x.id === id)?.nome || 'Valor livre'
  return <fieldset><legend>Pix e presentes recebidos</legend>
    <p className="mudo">Use o nome exatamente como aparece no seu banco. A chave fica só no servidor e é mostrada ao convidado de forma parcial.</p>
    <Campo rotulo="Nome do titular da conta Pix" valor={d.pix.nome} onChange={v => up('nome', v)} />
    <Campo rotulo="Chave Pix (CPF só números, telefone com +55, e-mail ou chave aleatória)" valor={d.pix.chave} onChange={v => up('chave', v)} />
    <Campo rotulo="Cidade do titular" valor={d.pix.cidade} onChange={v => up('cidade', v)} />
    <button type="button" className="sec-btn" onClick={salvar}>Salvar Pix</button> {msg && <span role="status" className="msg">{msg}</span>}
    <h3 style={{ margin: '22px 0 6px' }}>Recebimentos ({brl(total)} confirmados)</h3>
    {d.pagamentos.length === 0 && <p className="mudo">Nenhum pagamento informado ainda.</p>}
    {d.pagamentos.map(p => <div className="pg" key={p.id}>
      <span><b>{p.nome}</b> · {brl(p.valor)} · {nomeDe(p.presente_id)}{p.mensagem ? <><br />“{p.mensagem}”</> : null}</span>
      <span>{p.status === 'aguardando' ? <><button type="button" className="sec-btn" onClick={() => marca(p.id, 'confirmado')}>Confirmar</button> <button type="button" className="sec-btn" onClick={() => marca(p.id, 'recusado')}>Recusar</button></> : p.status}</span>
    </div>)}
  </fieldset>
}

export default function Admin() {
  const [tk, setTk] = useState(guarda.get())
  const [c, setC] = useState(DEF)
  const [f, setF] = useState({ email: '', senha: '' })
  const [msg, setMsg] = useState('')
  useEffect(() => { if (tk) getContent().then(d => d && setC({ ...DEF, ...d })).catch(() => {}) }, [tk])
  const up = (k, v) => setC(x => ({ ...x, [k]: v }))
  const entrar = async e => {
    e.preventDefault(); setMsg('')
    try { const r = await login(f.email, f.senha); guarda.set(r.token); setTk(r.token) } catch (er) { setMsg(er.message) }
  }
  const salvar = async () => {
    setMsg('Salvando…')
    const limpo = { ...c, galeria: (c.galeria || []).filter(g => g.trim()), livreMin: Number(c.livreMin) || 20,
      presentes: c.presentes.map(p => ({ ...p, valor: Number(String(p.valor).replace(',', '.')) || 0 })), grupos: c.grupos.map(g => ({ ...g, pessoas: g.pessoas.filter(p => p.trim()) })),
      familias: c.familias.map(g => ({ ...g, pessoas: g.pessoas.filter(p => p.trim()) })) }
    try { await saveContent(limpo, tk); setC(limpo); setMsg('Alterações salvas. O site já está atualizado.') }
    catch (er) { setMsg(er.message); if (/Sessão/.test(er.message)) { guarda.set(''); setTk('') } }
  }
  const home = typeof window !== 'undefined' && window.__DEMO__ ? '#' : '/'

  if (!tk) return <main className="adm"><form onSubmit={entrar} className="login">
    <h1>Área dos noivos</h1>
    <Campo rotulo="E-mail" tipo="email" valor={f.email} onChange={v => setF({ ...f, email: v })} />
    <Campo rotulo="Senha" tipo="password" valor={f.senha} onChange={v => setF({ ...f, senha: v })} />
    <button className="btn" type="submit">Entrar</button>
    {msg && <p role="alert" className="msg">{msg}</p>}
    <a href={home} className="link">Voltar ao site</a></form></main>

  return <main className="adm"><header><h1>Editar o site</h1>
    <div><a href={home} className="link">Ver site</a> <button className="sec-btn" onClick={() => { guarda.set(''); setTk('') }}>Sair</button></div></header>
    <fieldset><legend>Casal e data</legend>
      <Campo rotulo="Nome da noiva" valor={c.noiva} onChange={v => up('noiva', v)} />
      <Campo rotulo="Nome do noivo" valor={c.noivo} onChange={v => up('noivo', v)} />
      <Campo rotulo="Data e hora" tipo="datetime-local" valor={c.data.slice(0, 16)} onChange={v => v && up('data', v + ':00-03:00')} />
      <Campo rotulo="Cidade" valor={c.cidade} onChange={v => up('cidade', v)} />
      <Campo rotulo="Foto de fundo (arquivo em public/ ou endereço https)" valor={c.foto} onChange={v => up('foto', v)} />
    </fieldset>
    <fieldset><legend>Convite</legend><Campo rotulo="Texto do convite" area valor={c.convite} onChange={v => up('convite', v)} /></fieldset>
    <Lista titulo="Nossa história" itens={c.historia} onChange={v => up('historia', v)} novo={{ quando: '', titulo: '', texto: '' }}
      campos={[['quando', 'Ano ou data'], ['titulo', 'Título'], ['texto', 'Texto', 'area']]} />
    <Lista titulo="Local e horário" itens={c.eventos} onChange={v => up('eventos', v)} novo={{ titulo: '', hora: '', local: '', endereco: '', mapa: '' }}
      campos={[['titulo', 'Evento'], ['hora', 'Horário'], ['local', 'Local'], ['endereco', 'Endereço'], ['mapa', 'Link do mapa']]} />
    <Lista titulo="Padrinhos, madrinhas e cortejo" itens={c.grupos} onChange={v => up('grupos', v)} novo={{ id: 'g' + Date.now(), titulo: '', pessoas: [''] }}
      campos={[['titulo', 'Nome do grupo'], ['pessoas', 'Pessoas', 'linhas']]} />
    <Lista titulo="Famílias" itens={c.familias} onChange={v => up('familias', v)} novo={{ titulo: '', pessoas: [''] }}
      campos={[['titulo', 'Nome do grupo'], ['pessoas', 'Pessoas', 'linhas']]} />
    <fieldset><legend>Galeria de fotos</legend>
      <Campo rotulo="Fotos (um endereço por linha: arquivo em public/ ou link https)" area valor={(c.galeria || []).join('\n')} onChange={v => up('galeria', v.split('\n'))} /></fieldset>
    <Lista titulo="Lista de presentes" itens={c.presentes} onChange={v => up('presentes', v)} novo={{ id: 'p' + Date.now(), nome: '', valor: '', descricao: '' }}
      campos={[['nome', 'Presente'], ['valor', 'Valor em R$ (só número)'], ['descricao', 'Descrição', 'area']]} />
    <fieldset><legend>Presente com valor livre</legend>
      <Campo rotulo="Valor mínimo em R$" valor={c.livreMin} onChange={v => up('livreMin', v)} /></fieldset>
    <Pagamentos tk={tk} presentes={c.presentes} />
    <div className="barra"><button className="btn" onClick={salvar}>Salvar alterações</button>{msg && <span role="status" className="msg">{msg}</span>}</div>
  </main>
}
