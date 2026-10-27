import { useState, useEffect } from 'react'
import { content as DEF } from './content.js'
import { getContent } from './api.js'
import Admin from './Admin.jsx'
import Presentes from './Presentes.jsx'

const NAV = [['convite','Convite'],['historia','História'],['local','Local'],['padrinhos','Padrinhos'],['familias','Famílias'],['presentes','Presentes'],['presenca','Presença']]
const ehDemo = () => typeof window !== 'undefined' && window.__DEMO__
const dataTexto = c => new Date(c.data).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Sao_Paulo' })
const rota = () => location.pathname.endsWith('/admin') || location.hash === '#admin'
const urlFoto = u => u.startsWith('http') ? u : '/' + u.replace(/^\//, '')

function Pessoa({ nome }) {
  const ini = nome.split(' ').map(p => p[0]).slice(0, 2).join('')
  return <li className="pessoa"><span className="avatar" aria-hidden="true">{ini}</span>{nome}</li>
}
function Contagem({ alvo }) {
  const [t, setT] = useState(Date.now())
  useEffect(() => { const i = setInterval(() => setT(Date.now()), 1000); return () => clearInterval(i) }, [])
  const s = Math.max(0, Math.floor((new Date(alvo) - t) / 1000))
  const u = [[Math.floor(s / 86400), 'dias'], [Math.floor(s % 86400 / 3600), 'horas'], [Math.floor(s % 3600 / 60), 'min'], [s % 60, 'seg']]
  return s === 0 ? <p className="hero-dias">Nosso grande dia chegou</p>
    : <div className="cont" role="timer" aria-label="Contagem regressiva">{u.map(([n, l]) => <div key={l}><b>{String(n).padStart(2, '0')}</b><span>{l}</span></div>)}</div>
}

export default function App() {
  const [adm, setAdm] = useState(rota())
  useEffect(() => { const f = () => setAdm(rota()); addEventListener('hashchange', f); addEventListener('popstate', f)
    return () => { removeEventListener('hashchange', f); removeEventListener('popstate', f) } }, [])
  return adm ? <Admin /> : <Site />
}

function Site() {
  const [c, setC] = useState(DEF)
  const [sol, setSol] = useState(false)
  const [lb, setLb] = useState('')
  useEffect(() => { getContent().then(d => d && setC({ ...DEF, ...d })).catch(() => {}) }, [])
  useEffect(() => { const f = () => setSol(scrollY > 60); f(); addEventListener('scroll', f, { passive: true }); return () => removeEventListener('scroll', f) }, [])
  useEffect(() => {
    document.documentElement.classList.add('js')
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }), { threshold: .12 })
    document.querySelectorAll('.rev').forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [c])
  useEffect(() => { if (!lb) return; const f = e => e.key === 'Escape' && setLb(''); addEventListener('keydown', f); return () => removeEventListener('keydown', f) }, [lb])
  const dt = dataTexto(c)
  const fotos = c.galeria || []
  return (<>
    <header className={'topo' + (sol ? ' solido' : '')}><nav aria-label="Seções">
      {NAV.map(([id, t]) => <a key={id} href={'#' + id}>{t}</a>)}
    </nav></header>

    <section className="hero">
      <div className="hero-bg" style={{ backgroundImage: `url(${urlFoto(c.foto)})` }} />
      <div className="hero-in">
        <div className="mono" aria-hidden="true">{c.noiva[0]}<i>&</i>{c.noivo[0]}</div>
        <p className="hero-data">{dt} · {c.cidade}</p>
        <h1><span>{c.noiva}</span><i>&</i><span>{c.noivo}</span></h1>
        <Contagem alvo={c.data} />
        <a className="btn" href="#presenca">Confirmar presença</a>
      </div>
    </section>

    <main>
      <section id="convite" className="sec centro"><div className="rev">
        <h2>Convite</h2><p className="lead">{c.convite}</p></div></section>

      <section id="historia" className="sec fundo"><div className="rev">
        <h2>Nossa história</h2>
        <ol className="linha">
          {c.historia.map((h, i) => <li key={i}><b>{h.quando}</b><div><h3>{h.titulo}</h3><p>{h.texto}</p></div></li>)}
        </ol></div></section>

      {(fotos.some(Boolean) || ehDemo()) && <section id="galeria" className="sec"><div className="rev">
        <h2>Nossos momentos</h2>
        <div className="galeria">
          {fotos.map((f, i) => f ? <button key={i} onClick={() => setLb(urlFoto(f))} aria-label="Ampliar foto"><img src={urlFoto(f)} alt="" loading="lazy" /></button> : <div key={i} className="ph" />)}
        </div></div></section>}

      <section id="local" className="sec"><div className="rev">
        <h2>Local e horário</h2>
        <div className="eventos">
          {c.eventos.map((e, i) => (
            <article key={i} className="evento">
              <p className="hora">{e.hora}</p><h3>{e.titulo}</h3>
              <p>{e.local}</p><p className="mudo">{e.endereco}</p>
              <a href={e.mapa} className="link">Abrir no mapa</a>
            </article>))}
        </div></div></section>

      <section id="padrinhos" className="sec fundo"><div className="rev">
        <h2>Quem está com a gente</h2>
        <div className="grupos">
          {c.grupos.map(g => <div key={g.id}><h3>{g.titulo}</h3><ul>{g.pessoas.map((p, i) => <Pessoa key={i} nome={p} />)}</ul></div>)}
        </div></div></section>

      <section id="familias" className="sec"><div className="rev">
        <h2>Nossas famílias</h2>
        <div className="grupos">
          {c.familias.map(f => <div key={f.titulo}><h3>{f.titulo}</h3><ul>{f.pessoas.map((p, i) => <Pessoa key={i} nome={p} />)}</ul></div>)}
        </div></div></section>

      <Presentes c={c} />

      <section id="presenca" className="sec centro"><div className="rev">
        <h2>Confirme sua presença</h2>
        <p className="lead">Em breve: o link do seu convite abrirá aqui o formulário com o seu nome.</p></div></section>
    </main>
    <footer className="rodape">{c.noiva} & {c.noivo} · {dt} · <a href={ehDemo() ? '#admin' : '/admin'}>Área dos noivos</a></footer>
    {lb && <div className="lb" role="dialog" aria-modal="true" onClick={() => setLb('')}><img src={lb} alt="" /></div>}
  </>)
}
