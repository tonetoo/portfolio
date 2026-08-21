import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion"
import type { Transition } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { CSSProperties, ReactNode } from "react"

const RANGE_PER_POINT = 18
const MAX_PULL = 0.5

type MagneticButtonProps = {
  children: ReactNode
  onClick: () => void
  className?: string
  ariaLabel?: string
  fill?: string
  textColor?: string
  sweepColor?: string
  sweepTextColor?: string
  radius?: number
  magnet?: number
  paddingX?: number
  paddingY?: number
  transition?: Transition
  borderColor?: string
  style?: CSSProperties
}

export default function MagneticButton({
  children,
  onClick,
  className,
  ariaLabel,
  fill = "#f3f3f0",
  textColor = "#0b0b0b",
  sweepColor = "#242422",
  sweepTextColor = "#f3f3f0",
  paddingX = 18,
  paddingY = 12,
  radius = 7,
  magnet = 7,
  transition = { duration: 0.28, ease: "easeInOut" },
  borderColor = "#f3f3f0",
  style,
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const [hover, setHover] = useState(false)
  const [origin, setOrigin] = useState({ x: 0, y: 0, d: 0 })
  const hoverRef = useRef(false)
  const reduceMotion = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 260, damping: 18, mass: 0.4 })

  useEffect(() => {
    const node = ref.current
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches
    if (!node || reduceMotion || coarsePointer) return

    const pull = (magnet / 20) * MAX_PULL
    const reach = magnet * RANGE_PER_POINT

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2 - sx.get()
      const centerY = rect.top + rect.height / 2 - sy.get()
      const deltaX = event.clientX - centerX
      const deltaY = event.clientY - centerY
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom
      const edgeX = Math.max(0, Math.abs(deltaX) - rect.width / 2)
      const edgeY = Math.max(0, Math.abs(deltaY) - rect.height / 2)
      const gap = Math.hypot(edgeX, edgeY)

      if (inside !== hoverRef.current) {
        const localX = Math.max(0, Math.min(rect.width, event.clientX - rect.left))
        const localY = Math.max(0, Math.min(rect.height, event.clientY - rect.top))
        setOrigin({ x: localX, y: localY, d: 2 * Math.hypot(rect.width, rect.height) })
        hoverRef.current = inside
        setHover(inside)
      }

      if (gap > reach) {
        x.set(0)
        y.set(0)
        return
      }

      const falloff = reach === 0 ? 0 : 1 - gap / reach
      x.set(deltaX * pull * falloff)
      y.set(deltaY * pull * falloff)
    }

    const onLeave = () => {
      x.set(0)
      y.set(0)
      hoverRef.current = false
      setHover(false)
    }

    window.addEventListener("pointermove", onMove)
    document.addEventListener("pointerleave", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      document.removeEventListener("pointerleave", onLeave)
    }
  }, [magnet, reduceMotion, sx, sy, x, y])

  return (
    <motion.button
      ref={ref}
      type="button"
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: `${paddingY}px ${paddingX}px`,
        borderRadius: radius,
        background: fill,
        border: `1px solid ${borderColor}`,
        color: hover ? sweepTextColor : textColor,
        cursor: "pointer",
        overflow: "hidden",
        whiteSpace: "nowrap",
        x: sx,
        y: sy,
        boxShadow: hover ? "0 14px 34px rgba(0,0,0,.42)" : "0 7px 20px rgba(0,0,0,.24)",
        ...style,
      }}
    >
      <motion.span
        aria-hidden="true"
        initial={false}
        animate={{ scale: hover && !reduceMotion ? 1 : 0 }}
        transition={transition}
        style={{
          position: "absolute",
          top: origin.y,
          left: origin.x,
          width: origin.d,
          height: origin.d,
          marginLeft: -origin.d / 2,
          marginTop: -origin.d / 2,
          borderRadius: "50%",
          background: sweepColor,
          transformOrigin: "center",
          pointerEvents: "none",
        }}
      />
      <span className="magnetic-button-content">{children}</span>
    </motion.button>
  )
}
