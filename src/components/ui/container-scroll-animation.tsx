import React, { useEffect, useRef, useState } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import type { MotionValue } from "framer-motion"

export const ContainerScroll = ({
  titleComponent,
  children,
}: {
  titleComponent: string | React.ReactNode
  children: React.ReactNode
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const rotate = useTransform(scrollYProgress, [0, 1], [20, 0])
  const scale = useTransform(scrollYProgress, [0, 1], isMobile ? [0.7, 0.9] : [1.05, 1])
  const translate = useTransform(scrollYProgress, [0, 1], [0, -100])

  return (
    <div className="container-scroll" ref={containerRef}>
      <div className="container-scroll-stage">
        <Header translate={translate} titleComponent={titleComponent} />
        <Card rotate={rotate} translate={translate} scale={scale}>{children}</Card>
      </div>
    </div>
  )
}

export const Header = ({
  translate,
  titleComponent,
}: {
  translate: MotionValue<number>
  titleComponent: string | React.ReactNode
}) => (
  <motion.div style={{ translateY: translate }} className="container-scroll-header">
    {titleComponent}
  </motion.div>
)

export const Card = ({
  rotate,
  scale,
  children,
}: {
  rotate: MotionValue<number>
  scale: MotionValue<number>
  translate: MotionValue<number>
  children: React.ReactNode
}) => (
  <motion.div
    style={{
      rotateX: rotate,
      scale,
      boxShadow: "0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026",
    }}
    className="container-scroll-card"
  >
    <div className="container-scroll-screen">{children}</div>
  </motion.div>
)

type TerminalScreenProps = {
  session: number
  onClose: () => void
  onOpenContact: () => void
}

const command = "npx hello-tonetoo"
const availableCommands = ["help", "about", "projects", "stack", "contact", "github", "whoami", "pwd", "ls", "date", "clear"]

type TerminalEntry = {
  command: string
  output: string[]
}

export function TerminalScreen({ session, onClose, onOpenContact }: TerminalScreenProps) {
  const reduceMotion = useReducedMotion()
  const [typedCommand, setTypedCommand] = useState("")
  const [finished, setFinished] = useState(false)
  const [input, setInput] = useState("")
  const [entries, setEntries] = useState<TerminalEntry[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTypedCommand("")
    setFinished(false)

    if (reduceMotion) {
      setTypedCommand(command)
      setFinished(true)
      return
    }

    let index = 0
    let outputTimer: number | undefined
    const typingTimer = window.setInterval(() => {
      index += 1
      setTypedCommand(command.slice(0, index))
      if (index === command.length) {
        window.clearInterval(typingTimer)
        outputTimer = window.setTimeout(() => setFinished(true), 380)
      }
    }, 54)

    return () => {
      window.clearInterval(typingTimer)
      if (outputTimer) window.clearTimeout(outputTimer)
    }
  }, [reduceMotion, session])

  useEffect(() => {
    if (!finished) return
    inputRef.current?.focus()
  }, [finished, session])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: reduceMotion ? "auto" : "smooth" })
  }, [entries, finished, reduceMotion])

  const getOutput = (value: string) => {
    const normalized = value.trim().toLowerCase()

    switch (normalized) {
      case "help":
        return [
          "Comandos disponíveis:",
          "about · projects · stack · contact · github",
          "whoami · pwd · ls · date · clear",
          "Use ↑ e ↓ para navegar pelo histórico.",
        ]
      case "about":
      case "npx hello-tonetoo":
        return ["TONETO — SaaS & Web Developer", "Desenvolvo SaaS, sites e produtos digitais."]
      case "projects":
        return ["01  la-fontilla   github.com/tonetinn/la-fontilla", "02  portfolio     github.com/tonetinn/portfolio"]
      case "stack":
        return ["React · TypeScript · Next.js · Node.js", "MongoDB · PostgreSQL · Tailwind · Vite"]
      case "contact":
        return ["Abrindo os canais de contato..."]
      case "github":
        return ["github.com/tonetinn"]
      case "whoami":
        return ["visitor"]
      case "pwd":
        return ["/home/visitor/portfolio"]
      case "ls":
        return ["about  projects  stack  contact  github"]
      case "date":
        return [new Intl.DateTimeFormat("pt-BR", { dateStyle: "full", timeStyle: "medium" }).format(new Date())]
      default:
        return [`shell: comando não encontrado: ${value}`, "Digite 'help' para ver os comandos disponíveis."]
    }
  }

  const executeCommand = () => {
    const value = input.trim()
    if (!value) return

    setInput("")
    setHistoryIndex(-1)
    setCommandHistory((current) => [...current, value])

    if (value.toLowerCase() === "clear") {
      setEntries([])
      return
    }

    setEntries((current) => [...current, { command: value, output: getOutput(value) }])
    if (value.toLowerCase() === "contact") window.setTimeout(onOpenContact, 260)
  }

  const runCommand = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    executeCommand()
  }

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      executeCommand()
      return
    }

    if (event.key === "ArrowUp" && commandHistory.length) {
      event.preventDefault()
      const nextIndex = Math.min(historyIndex + 1, commandHistory.length - 1)
      setHistoryIndex(nextIndex)
      setInput(commandHistory[commandHistory.length - 1 - nextIndex])
    }

    if (event.key === "ArrowDown" && historyIndex >= 0) {
      event.preventDefault()
      const nextIndex = historyIndex - 1
      setHistoryIndex(nextIndex)
      setInput(nextIndex < 0 ? "" : commandHistory[commandHistory.length - 1 - nextIndex])
    }

    if (event.key === "Tab" && input) {
      const match = availableCommands.find((item) => item.startsWith(input.toLowerCase()))
      if (match) {
        event.preventDefault()
        setInput(match)
      }
    }
  }

  return (
    <motion.div
      className="terminal-device"
      initial={reduceMotion ? false : { opacity: 0, rotateX: 14, y: 34, scale: 0.94 }}
      animate={{ opacity: 1, rotateX: 0, y: 0, scale: 1 }}
      transition={{ duration: 0.46, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="terminal-window-bar">
        <div className="terminal-window-title">
          <span aria-hidden="true">&gt;_</span>
          <span>toneto@portfolio: ~</span>
        </div>
        <button type="button" onClick={onClose} aria-label="Fechar terminal">×</button>
      </div>

      <div className="terminal-window-body" ref={scrollRef} onClick={() => inputRef.current?.focus()}>
        <div className="terminal-session-meta">
          <span>TONETO_OS / WEB SHELL</span>
          <span><i aria-hidden="true" /> SESSION ACTIVE</span>
        </div>

        <div className="terminal-command" aria-label={`Comando: ${command}`}>
          <span className="terminal-prompt" aria-hidden="true">visitor@toneto:~$</span>
          <span aria-hidden="true">{typedCommand}</span>
          {!finished && <span className="terminal-block-cursor" aria-hidden="true" />}
        </div>

        {finished && (
          <motion.div
            className="terminal-result"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            aria-live="polite"
          >
            <div className="terminal-ascii" aria-hidden="true">{`┌──────────────────────────────┐\n│  HELLO, I'M TONETO          │\n└──────────────────────────────┘`}</div>
            <dl>
              <div><dt>role</dt><dd>SaaS &amp; Web Developer</dd></div>
              <div><dt>builds</dt><dd>SaaS, sites e produtos digitais</dd></div>
              <div><dt>github</dt><dd>github.com/tonetinn</dd></div>
              <div><dt>status</dt><dd>disponível para projetos</dd></div>
            </dl>
            <p className="terminal-hint">Digite <strong>help</strong> para ver os comandos disponíveis.</p>
          </motion.div>
        )}

        {finished && (
          <div className="terminal-shell" aria-live="polite">
            {entries.map((entry, index) => (
              <div className="terminal-history-entry" key={`${entry.command}-${index}`}>
                <div><span className="terminal-prompt">visitor@toneto:~$</span> {entry.command}</div>
                {entry.output.map((line, lineIndex) => <p key={`${line}-${lineIndex}`}>{line}</p>)}
              </div>
            ))}

            <form className="terminal-input-row" onSubmit={runCommand}>
              <label className="sr-only" htmlFor={`terminal-input-${session}`}>Digite um comando</label>
              <span className="terminal-prompt" aria-hidden="true">visitor@toneto:~$</span>
              <input
                id={`terminal-input-${session}`}
                ref={inputRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleInputKeyDown}
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                enterKeyHint="send"
                aria-describedby={`terminal-help-${session}`}
              />
            </form>
            <span className="sr-only" id={`terminal-help-${session}`}>Pressione Enter para executar. Use as setas para acessar o histórico.</span>
          </div>
        )}
      </div>
    </motion.div>
  )
}
