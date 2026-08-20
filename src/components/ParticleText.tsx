import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  homeX: number
  homeY: number
  startX: number
  startY: number
  vx: number
  vy: number
}

type Props = { text?: string; className?: string }

export default function ParticleText({ text = "TONETO", className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const frameRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const host = canvas?.parentElement
    const ctx = canvas?.getContext("2d", { alpha: true })
    if (!canvas || !host || !ctx) return

    let particles: Particle[] = []
    let width = 0
    let height = 0
    let dpr = 1
    let formed = 0
    let previous = performance.now()
    const pointer = { x: -9999, y: -9999, active: false }
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const sampleText = () => {
      const buffer = document.createElement("canvas")
      buffer.width = Math.max(1, Math.floor(width * dpr))
      buffer.height = Math.max(1, Math.floor(height * dpr))
      const btx = buffer.getContext("2d", { willReadFrequently: true })
      if (!btx) return

      const fontSize = Math.min(width * 0.245, height * 0.68)
      btx.scale(dpr, dpr)
      btx.clearRect(0, 0, width, height)
      btx.fillStyle = "#fff"
      btx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`
      btx.textAlign = "center"
      btx.textBaseline = "middle"
      btx.fillText(text, width / 2, height / 2)

      const image = btx.getImageData(0, 0, buffer.width, buffer.height)
      const step = width < 600 ? 5 : 6
      const next: Particle[] = []
      const seedRadius = Math.max(width, height) * 0.68

      for (let y = 0; y < height; y += step) {
        for (let x = 0; x < width; x += step) {
          const px = Math.min(buffer.width - 1, Math.floor(x * dpr))
          const py = Math.min(buffer.height - 1, Math.floor(y * dpr))
          const alpha = image.data[(py * buffer.width + px) * 4 + 3]
          if (alpha < 150) continue
          const angle = Math.random() * Math.PI * 2
          const radius = seedRadius * (0.72 + Math.random() * 0.45)
          const startX = width / 2 + Math.cos(angle) * radius
          const startY = height / 2 + Math.sin(angle) * radius
          next.push({ x: startX, y: startY, homeX: x, homeY: y, startX, startY, vx: 0, vy: 0 })
        }
      }
      particles = next.slice(0, 11000)
      formed = reduceMotion ? 1 : 0
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()
      width = Math.max(1, rect.width)
      height = Math.max(1, rect.height)
      dpr = Math.min(2, window.devicePixelRatio || 1)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      sampleText()
    }

    const draw = (now: number) => {
      const dt = Math.min(32, now - previous)
      previous = now
      formed = reduceMotion ? 1 : Math.min(1, formed + dt / 1200)
      const eased = 1 - Math.pow(1 - formed, 3)
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = "#f4f4f4"

      for (const p of particles) {
        const baseX = p.startX + (p.homeX - p.startX) * eased
        const baseY = p.startY + (p.homeY - p.startY) * eased
        if (formed >= 0.98 && pointer.active) {
          const dx = baseX - pointer.x
          const dy = baseY - pointer.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const radius = Math.min(92, width * 0.12)
          if (distance > 0 && distance < radius) {
            const force = (1 - distance / radius) * 2.4
            p.vx += (dx / distance) * force
            p.vy += (dy / distance) * force
          }
        }
        p.vx += (baseX - p.x) * 0.055
        p.vy += (baseY - p.y) * 0.055
        p.vx *= 0.86
        p.vy *= 0.86
        p.x += p.vx
        p.y += p.vy
        ctx.globalAlpha = Math.max(0.06, eased)
        const size = width < 600 ? 1.3 : 1.65
        ctx.fillRect(p.x, p.y, size, size)
      }
      ctx.globalAlpha = 1
      frameRef.current = requestAnimationFrame(draw)
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top
      pointer.active = true
    }
    const onPointerLeave = () => { pointer.active = false }

    const observer = new ResizeObserver(resize)
    observer.observe(host)
    canvas.addEventListener("pointermove", onPointerMove)
    canvas.addEventListener("pointerleave", onPointerLeave)
    resize()
    frameRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frameRef.current)
      observer.disconnect()
      canvas.removeEventListener("pointermove", onPointerMove)
      canvas.removeEventListener("pointerleave", onPointerLeave)
    }
  }, [text])

  return <div className={`particle-text ${className}`} role="img" aria-label={text}><canvas ref={canvasRef} aria-hidden="true" /></div>
}
