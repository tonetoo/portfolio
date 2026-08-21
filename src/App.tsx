import { useRef, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import type { IconType } from "react-icons"
import {
  SiDiscord,
  SiInstagram,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiVite,
  SiWhatsapp,
} from "react-icons/si"
import ParticleText from "./components/ParticleText"
import ASMRStaticBackground from "./components/ui/ASMRStaticBackground"
import LinkPreview from "./components/ui/LinkPreview"
import MagneticButton from "./components/ui/MagneticButton"
import SplineScene from "./components/ui/SplineScene"
import { TerminalScreen } from "./components/ui/container-scroll-animation"

const robotScene = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"

const ArrowUpRight = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
)

const TerminalIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="m7 9 3 3-3 3M13 15h4" />
  </svg>
)

const projects = [
  {
    name: "La Fontilla",
    type: "Aplicação web",
    description: "Projeto web publicado na Vercel e desenvolvido com uma stack moderna.",
    stack: "Next.js · React · TypeScript",
    href: "https://github.com/tonetinn/la-fontilla",
    previewUrl: "https://la-fontilla.vercel.app",
    previewImage: "/project-previews/la-fontilla.png",
  },
  {
    name: "Portfolio",
    type: "Portfólio pessoal",
    description: "Este portfólio: interface autoral, fundo interativo e experiência 3D.",
    stack: "React · Vite · Spline",
    href: "https://github.com/tonetinn/portfolio",
    previewImage: "/project-previews/portfolio.png",
  },
]

const stack: { name: string; Icon: IconType }[] = [
  { name: "React", Icon: SiReact },
  { name: "TypeScript", Icon: SiTypescript },
  { name: "Next.js", Icon: SiNextdotjs },
  { name: "Node.js", Icon: SiNodedotjs },
  { name: "MongoDB", Icon: SiMongodb },
  { name: "PostgreSQL", Icon: SiPostgresql },
  { name: "Tailwind", Icon: SiTailwindcss },
  { name: "Vite", Icon: SiVite },
]

const contactOptions = [
  { name: "WhatsApp", detail: "+55 43 99905-0089", href: "https://wa.me/5543999050089", Icon: SiWhatsapp },
  { name: "Instagram", detail: "@jg.toneto", href: "https://instagram.com/jg.toneto", Icon: SiInstagram },
  { name: "Discord", detail: "778805593049006101", href: "https://discord.com/users/778805593049006101", Icon: SiDiscord },
]

function App() {
  const [terminalSession, setTerminalSession] = useState(0)
  const [contactSession, setContactSession] = useState(0)
  const contactDialogRef = useRef<HTMLDialogElement>(null)
  const terminalDialogRef = useRef<HTMLDialogElement>(null)
  const reduceMotion = useReducedMotion()

  const openContactDialog = () => {
    setContactSession((current) => current + 1)
    contactDialogRef.current?.showModal()
  }
  const closeContactDialog = () => contactDialogRef.current?.close()
  const openTerminalDialog = () => {
    setTerminalSession((current) => current + 1)
    terminalDialogRef.current?.showModal()
  }
  const closeTerminalDialog = () => terminalDialogRef.current?.close()
  const openContactFromTerminal = () => {
    closeTerminalDialog()
    window.setTimeout(openContactDialog, 120)
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

        <nav className="mobile-nav" aria-label="Navegação rápida">
          <a href="#projetos">Projetos</a>
          <a href="#stack">Stack</a>
          <button type="button" onClick={openContactDialog}>Contato</button>
        </nav>

        <main id="conteudo">
          <section className="hero-entrance" aria-labelledby="intro-title">
            <div className="hero-copy">
              <div className="card-label">~/portfolio/intro</div>
              <h1 id="intro-title" className="sr-only">Toneto — desenvolvedor de SaaS e sites</h1>
              <ParticleText text="TONETO" className="hero-name" />
              <p className="role-line"><span>&gt;</span> SaaS &amp; Web Developer<span className="cursor" aria-hidden="true">_</span></p>
              <p className="intro-copy">Desenvolvo SaaS, dashboards e sites rápidos com uma experiência clara do primeiro clique até a entrega.</p>
              <div className="intro-actions">
                <button
                  className="command"
                  type="button"
                  onClick={openTerminalDialog}
                  aria-haspopup="dialog"
                  aria-controls="terminal-dialog"
                >
                  <span>contato@toneto.dev</span>
                  <TerminalIcon />
                </button>
                <a className="icon-link" href="#projetos" aria-label="Ver projetos"><ArrowUpRight /></a>
              </div>
            </div>

            <div className="hero-robot" role="img" aria-label="Robô 3D interativo">
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
              </dl>
              <MagneticButton className="magnetic-project-button" onClick={openContactDialog} ariaLabel="Iniciar um projeto">
                <span>Iniciar um projeto</span><ArrowUpRight />
              </MagneticButton>
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
                  <LinkPreview
                    className="project-item"
                    href={project.href}
                    previewUrl={project.previewUrl}
                    previewImageSrc={project.previewImage}
                    title={project.name}
                    key={project.name}
                  >
                    <div className="project-top"><span>0{index + 1}</span><span>{project.type}</span></div>
                    <h3>{project.name} <ArrowUpRight /></h3>
                    <p>{project.description}</p>
                    <small>{project.stack}</small>
                  </LinkPreview>
                ))}
              </div>
            </section>

            <section className="card stack-card" id="stack" aria-labelledby="stack-title">
              <div className="card-heading">
                <h2 id="stack-title">STACK</h2>
                <span>Ferramentas atuais</span>
              </div>
              <ul className="stack-list">
                {stack.map(({ name, Icon }) => <li key={name}><Icon aria-hidden="true" /><span>{name}</span></li>)}
              </ul>
            </section>

            <section className="card contact-card" id="contato" aria-labelledby="contact-title">
              <div className="card-label">[ open_channel ]</div>
              <h2 id="contact-title">Tem uma ideia?</h2>
              <p>Vamos transformar em produto.</p>
              <div className="contact-cta">
                <MagneticButton className="magnetic-contact-button" onClick={openContactDialog} ariaLabel="Falar comigo">
                  <span>Falar comigo</span><ArrowUpRight />
                </MagneticButton>
              </div>
            </section>
          </section>
        </main>

        <footer className="footer">
          <span>© 2026 TONETO</span>
          <span className="footer-path">/home/toneto/portfolio</span>
          <a href="#conteudo">TOP ↑</a>
        </footer>
      </div>

      <dialog
        id="terminal-dialog"
        className="terminal-dialog"
        ref={terminalDialogRef}
        aria-label="Terminal do Toneto"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeTerminalDialog()
        }}
      >
        <TerminalScreen
          key={terminalSession}
          session={terminalSession}
          onClose={closeTerminalDialog}
          onOpenContact={openContactFromTerminal}
        />
      </dialog>

      <dialog
        className="contact-dialog"
        ref={contactDialogRef}
        aria-labelledby="contact-dialog-title"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeContactDialog()
        }}
      >
        <motion.div
          key={contactSession}
          className="contact-dialog-inner"
          initial={reduceMotion ? false : { opacity: 0, rotateX: 10, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
          transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="contact-dialog-heading">
            <div>
              <span className="card-label">[ open_channel ]</span>
              <h2 id="contact-dialog-title">Como prefere conversar?</h2>
            </div>
            <button className="dialog-close" type="button" onClick={closeContactDialog} aria-label="Fechar">×</button>
          </div>
          <p>Escolha um canal para abrir seu contato.</p>
          <div className="contact-options">
            {contactOptions.map(({ name, detail, href, Icon }) => (
              <a href={href} target="_blank" rel="noreferrer" key={name}>
                <Icon aria-hidden="true" />
                <span><strong>{name}</strong><small>{detail}</small></span>
                <ArrowUpRight />
              </a>
            ))}
          </div>
        </motion.div>
      </dialog>
    </>
  )
}

export default App
