import { useState } from "react"
import ParticleText from "./components/ParticleText"
import ASMRStaticBackground from "./components/ui/ASMRStaticBackground"
import SplineScene from "./components/ui/SplineScene"

const robotScene = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="9" y="9" width="10" height="10" rx="1" />
    <path d="M15 9V5H5v10h4" />
  </svg>
)

const projects = [
  {
    name: "Metricflow",
    type: "SaaS dashboard",
    description: "Métricas, assinaturas e decisões de produto em um painel direto.",
    stack: "React · TypeScript",
  },
  {
    name: "Nexo Portal",
    type: "Client portal",
    description: "Área do cliente para organizar entregas, arquivos e comunicação.",
    stack: "Next.js · Supabase",
  },
  {
    name: "Luma Launch",
    type: "Marketing site",
    description: "Site de lançamento rápido, responsivo e orientado à conversão.",
    stack: "Vite · Motion",
  },
]

const stack = ["React", "TypeScript", "Next.js", "Node.js", "Supabase", "PostgreSQL", "Tailwind", "Vite"]

function App() {
  const [copied, setCopied] = useState(false)

  const copyEmail = async () => {
    await navigator.clipboard.writeText("contato@toneto.dev")
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <>
      <div className="site-background" aria-hidden="true">
        <ASMRStaticBackground />
        <div className="background-veil" />
      </div>

      <div className="shell">
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>

        <header className="topbar">
          <a className="identity" href="#conteudo" aria-label="TONETO — início">
            <span className="terminal-mark" aria-hidden="true">&gt;_</span>
            <span><strong>TONETO</strong><small>/ PORTFOLIO</small></span>
          </a>
          <div className="topbar-center">SAAS · SITES · PRODUTO DIGITAL</div>
          <div className="availability"><i /> DISPONÍVEL PARA PROJETOS</div>
        </header>

        <main id="conteudo">
          <section className="hero-entrance" aria-labelledby="intro-title">
            <div className="hero-copy">
              <div className="card-label">~/portfolio/intro</div>
              <h1 id="intro-title" className="sr-only">Toneto — desenvolvedor de SaaS e sites</h1>
              <ParticleText text="TONETO" className="hero-name" />
              <p className="role-line"><span>&gt;</span> SaaS &amp; Web Developer<span className="cursor" aria-hidden="true">_</span></p>
              <p className="intro-copy">Desenvolvo SaaS, dashboards e sites rápidos com uma experiência clara do primeiro clique até a entrega.</p>
              <div className="intro-actions">
                <button className="command" type="button" onClick={copyEmail} aria-live="polite">
                  <span>{copied ? "email copiado" : "contato@toneto.dev"}</span>
                  <CopyIcon />
                </button>
                <a className="icon-link" href="#projetos" aria-label="Ver projetos"><ArrowUpRight /></a>
              </div>
            </div>

            <div className="hero-robot" aria-label="Robô 3D interativo">
              <div className="robot-label"><span>[ 3D_UNIT ]</span><span>ARRASTE PARA INTERAGIR</span></div>
              <SplineScene scene={robotScene} className="robot-scene" />
            </div>
          </section>

          <section className="dashboard" aria-label="Informações, serviços e projetos">
            <aside className="card profile-card" aria-labelledby="profile-title">
              <div className="card-heading">
                <h2 id="profile-title">STATUS</h2>
                <span className="signal">ONLINE</span>
              </div>
              <dl className="facts">
                <div><dt>Base</dt><dd>Brasil · BRT</dd></div>
                <div><dt>Foco</dt><dd>SaaS &amp; websites</dd></div>
                <div><dt>Entrega</dt><dd>Design + código</dd></div>
                <div><dt>Agenda</dt><dd>Projetos selecionados</dd></div>
              </dl>
              <a className="full-link" href="mailto:contato@toneto.dev">Iniciar um projeto <ArrowUpRight /></a>
            </aside>

            <section className="card services-card" aria-labelledby="services-title">
              <div className="card-heading">
                <h2 id="services-title">O QUE EU FAÇO</h2>
                <span>03 serviços</span>
              </div>
              <ol className="service-list">
                <li><span>01</span><strong>SaaS &amp; MVPs</strong></li>
                <li><span>02</span><strong>Sites &amp; landing pages</strong></li>
                <li><span>03</span><strong>Dashboards &amp; portais</strong></li>
              </ol>
            </section>

            <section className="card projects-card" id="projetos" aria-labelledby="projects-title">
              <div className="card-heading">
                <h2 id="projects-title">PROJETOS</h2>
                <span>Selecionados / 2026</span>
              </div>
              <div className="project-grid">
                {projects.map((project, index) => (
                  <article className="project-item" key={project.name}>
                    <div className="project-top"><span>0{index + 1}</span><span>{project.type}</span></div>
                    <h3>{project.name}</h3>
                    <p>{project.description}</p>
                    <small>{project.stack}</small>
                  </article>
                ))}
              </div>
            </section>

            <section className="card stack-card" aria-labelledby="stack-title">
              <div className="card-heading">
                <h2 id="stack-title">STACK</h2>
                <span>Ferramentas atuais</span>
              </div>
              <ul className="stack-list">
                {stack.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </section>

            <section className="card contact-card" aria-labelledby="contact-title">
              <div className="card-label">[ open_channel ]</div>
              <h2 id="contact-title">Tem uma ideia?</h2>
              <p>Vamos transformar em produto.</p>
              <a className="contact-cta" href="mailto:contato@toneto.dev">Falar comigo <ArrowUpRight /></a>
            </section>
          </section>
        </main>

        <footer className="footer">
          <span>© 2026 TONETO</span>
          <span className="footer-path">/home/toneto/portfolio</span>
          <a href="#conteudo">TOP ↑</a>
        </footer>
      </div>
    </>
  )
}

export default App
