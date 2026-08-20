import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  alpha: number
  color: string
  rotation: number
  rotationSpeed: number
  frictionGlow: number
}

export default function ASMRStaticBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d", { alpha: true })
    if (!canvas || !ctx) return

    let width = 0
    let height = 0
    let dpr = 1
    let frame = 0
    let particles: Particle[] = []
    const mouse = { x: -1000, y: -1000 }
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const magneticRadius = 280
    const vortexStrength = 0.07
    const pullStrength = 0.12

    const createParticle = (): Particle => {
      const isGlass = Math.random() > 0.7
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        color: isGlass ? "240, 245, 255" : "80, 80, 85",
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        frictionGlow: 0,
      }
    }

    const drawParticle = (particle: Particle) => {
      ctx.save()
      ctx.translate(particle.x, particle.y)
      ctx.rotate(particle.rotation)

      const finalAlpha = Math.min(particle.alpha + particle.frictionGlow, 0.9)
      ctx.fillStyle = `rgba(${particle.color}, ${finalAlpha})`
      if (particle.frictionGlow > 0.3) {
        ctx.shadowBlur = 8 * particle.frictionGlow
        ctx.shadowColor = `rgba(180, 220, 255, ${particle.frictionGlow})`
      }

      ctx.beginPath()
      ctx.moveTo(0, -particle.size * 2.5)
      ctx.lineTo(particle.size, 0)
      ctx.lineTo(0, particle.size * 2.5)
      ctx.lineTo(-particle.size, 0)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const updateParticle = (particle: Particle) => {
      const dx = mouse.x - particle.x
      const dy = mouse.y - particle.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < magneticRadius) {
        const safeDistance = Math.max(distance, 0.001)
        const force = (magneticRadius - distance) / magneticRadius
        particle.vx += (dx / safeDistance) * force * pullStrength
        particle.vy += (dy / safeDistance) * force * pullStrength
        particle.vx += (dy / safeDistance) * force * vortexStrength * 10
        particle.vy -= (dx / safeDistance) * force * vortexStrength * 10
        particle.frictionGlow = force * 0.7
      } else {
        particle.frictionGlow *= 0.92
      }

      particle.x += particle.vx
      particle.y += particle.vy
      particle.vx *= 0.95
      particle.vy *= 0.95
      particle.vx += (Math.random() - 0.5) * 0.04
      particle.vy += (Math.random() - 0.5) * 0.04
      particle.rotation += particle.rotationSpeed + (Math.abs(particle.vx) + Math.abs(particle.vy)) * 0.05

      if (particle.x < -20) particle.x = width + 20
      if (particle.x > width + 20) particle.x = -20
      if (particle.y < -20) particle.y = height + 20
      if (particle.y > height + 20) particle.y = -20
    }

    const render = () => {
      ctx.fillStyle = "rgba(10, 10, 12, 0.2)"
      ctx.fillRect(0, 0, width, height)
      for (const particle of particles) {
        updateParticle(particle)
        drawParticle(particle)
      }
      frame = requestAnimationFrame(render)
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.floor(width * dpr)
      canvas.height = Math.floor(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const particleCount = width < 620 ? 420 : width < 1000 ? 650 : 1000
      particles = Array.from({ length: particleCount }, createParticle)

      if (reducedMotion) {
        ctx.fillStyle = "#0a0a0c"
        ctx.fillRect(0, 0, width, height)
        particles.forEach(drawParticle)
      }
    }

    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX
      mouse.y = event.clientY
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }
    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]
      if (touch) {
        mouse.x = touch.clientX
        mouse.y = touch.clientY
      }
    }

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)
    document.documentElement.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("touchmove", handleTouchMove, { passive: true })
    resize()
    if (!reducedMotion) frame = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="asmr-canvas" />
}
