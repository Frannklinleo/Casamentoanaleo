import { useState, useEffect } from 'react'
import { content as c } from './content.js'

const NAV = [['convite','Convite'],['historia','História'],['local','Local e horário'],['padrinhos','Padrinhos'],['familias','Famílias'],['presentes','Presentes'],['presenca','Presença']]

function diasRestantes() {
  const d = Math.ceil((new Date(c.data) - new Date()) / 86400000)
  return d > 0 ? d : 0
}
function Pessoa({ nome }) {
  const ini = nome.split(' ').map(p => p[0]).slice(0, 2).join('')
  return <li className="pessoa"><span className="avatar" aria-hidden="true">{ini}</span>{nome}</li>
}

export default function App() {
  const [dias, setDias] = useState(diasRestantes())
  useEffect(() => { const t = setInterval(() => setDias(diasRestantes()), 60000); return () => clearInterval(t) }, [])
  return (<>
    <header className="topo"><nav aria-label="Seções">
      {NAV.map(([id, t]) => <a key={id} href={'#' + id}>{t}</a>)}
    </nav></header>

    <section className="hero" style={{ backgroundImage: `linear-gradient(180deg, rgba(14,38,32,.45), rgba(14,38,32,.8)), url(./${c.foto})` }}>
      <div className="hero-in">
        <p className="hero-data">{c.dataTexto} · {c.cidade}</p>
        <h1><span>{c.noiva}</span><i>&</i><span>{c.noivo}</span></h1>
        <p className="hero-dias">{dias > 0 ? `Faltam ${dias} dias` : 'É hoje!'}</p>
        <a className="btn" href="#presenca">Confirmar presença</a>
      </div>
    </section>

    <main>
      <section id="convite" className="sec centro">
        <h2>Convite</h2>
        <p className="lead">{c.convite}</p>
      </section>

      <section id="historia" className="sec fundo">
        <h2>Nossa história</h2>
        <ol className="linha">
          {c.historia.map(h => <li key={h.quando}><b>{h.quando}</b><div><h3>{h.titulo}</h3><p>{h.texto}</p></div></li>)}
        </ol>
      </section>

      <section id="local" className="sec">
        <h2>Local e horário</h2>
        <div className="eventos">
          {c.eventos.map(e => (
            <article key={e.titulo} className="evento">
              <p className="hora">{e.hora}</p><h3>{e.titulo}</h3>
              <p>{e.local}</p><p className="mudo">{e.endereco}</p>
              <a href={e.mapa} className="link">Abrir no mapa</a>
            </article>))}
        </div>
      </section>

      <section id="padrinhos" className="sec fundo">
        <h2>Quem está com a gente</h2>
        <div className="grupos">
          {c.grupos.map(g => <div key={g.id}><h3>{g.titulo}</h3><ul>{g.pessoas.map(p => <Pessoa key={p} nome={p} />)}</ul></div>)}
        </div>
      </section>

      <section id="familias" className="sec">
        <h2>Nossas famílias</h2>
        <div className="grupos">
          {c.familias.map(f => <div key={f.titulo}><h3>{f.titulo}</h3><ul>{f.pessoas.map(p => <Pessoa key={p} nome={p} />)}</ul></div>)}
        </div>
      </section>

      <section id="presentes" className="sec fundo centro">
        <h2>Lista de presentes</h2>
        <p className="lead">Em breve: escolha um presente ou contribua com o valor que preferir, via Pix.</p>
      </section>

      <section id="presenca" className="sec centro">
        <h2>Confirme sua presença</h2>
        <p className="lead">Em breve: o link do seu convite abrirá aqui o formulário com o seu nome.</p>
      </section>
    </main>
    <footer className="rodape">{c.noiva} & {c.noivo} · {c.dataTexto}</footer>
  </>)
}
