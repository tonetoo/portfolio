import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion"
import { useEffect, useRef, useState } from "react"
import type { FocusEvent, PointerEvent, ReactNode } from "react"
import { createPortal } from "react-dom"

type LinkPreviewProps = {
  title: string
  href: string
  previewUrl?: string
  previewImageSrc?: string
  className?: string
  children: ReactNode
  previewWidth?: number
  previewHeight?: number
}

const previewImage = (href: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(href)}&embed=image.url`

export default function LinkPreview({
  title,
  href,
  previewUrl,
  previewImageSrc,
  className,
  children,
  previewWidth = 280,
  previewHeight = 174,
}: LinkPreviewProps) {
  const anchorRef = useRef<HTMLAnchorElement>(null)
  const [visible, setVisible] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0, width: previewWidth, height: previewHeight })
  const cursorRatio = useMotionValue(0.5)
  const springRatio = useSpring(cursorRatio, { stiffness: 120, damping: 16, mass: 0.6 })
  const translateX = useTransform(springRatio, [0, 1], [-18, 18])
  const rotate = useTransform(springRatio, [0, 1], [-1.4, 1.4])
  const reduceMotion = useReducedMotion()
  const previewTarget = previewUrl ?? href
  const imageSrc = previewImageSrc ?? previewImage(previewTarget)

  useEffect(() => setImageFailed(false), [imageSrc])

  const updatePosition = (clientX?: number) => {
    const anchor = anchorRef.current
    if (!anchor) return

    const rect = anchor.getBoundingClientRect()
    const width = Math.min(previewWidth, window.innerWidth - 24)
    const height = width * (previewHeight / previewWidth)
    const centerX = clientX ?? rect.left + rect.width / 2
    const left = Math.max(12, Math.min(window.innerWidth - width - 12, centerX - width / 2))
    const above = rect.top - height - 14
    const top = above >= 12 ? above : Math.min(window.innerHeight - height - 12, rect.bottom + 14)
    setPosition({ left, top: Math.max(12, top), width, height })
  }

  const showFromPointer = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return
    const rect = event.currentTarget.getBoundingClientRect()
    cursorRatio.set((event.clientX - rect.left) / Math.max(1, rect.width))
    updatePosition(event.clientX)
    setVisible(true)
  }

  const movePreview = (event: PointerEvent<HTMLAnchorElement>) => {
    if (!visible) return
    const rect = event.currentTarget.getBoundingClientRect()
    cursorRatio.set(Math.max(0, Math.min(1, (event.clientX - rect.left) / Math.max(1, rect.width))))
  }

  const showFromFocus = (event: FocusEvent<HTMLAnchorElement>) => {
    if (event.currentTarget.matches(":focus-visible")) {
      cursorRatio.set(0.5)
      updatePosition()
      setVisible(true)
    }
  }

  const preview = (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="project-link-preview"
          aria-hidden="true"
          initial={reduceMotion ? false : { opacity: 0, y: 14, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.96 }}
          transition={reduceMotion ? { duration: 0.01 } : { type: "spring", stiffness: 260, damping: 22 }}
          style={{
            position: "fixed",
            left: position.left,
            top: position.top,
            width: position.width,
            height: position.height,
            x: reduceMotion ? 0 : translateX,
            rotateZ: reduceMotion ? 0 : rotate,
          }}
        >
          {!imageFailed ? (
            <img src={imageSrc} alt="" draggable={false} onError={() => setImageFailed(true)} />
          ) : (
            <div className="project-preview-fallback">
              <span>[ preview_unavailable ]</span>
              <strong>{title}</strong>
              <small>{new URL(previewTarget, window.location.origin).hostname}</small>
            </div>
          )}
          <div className="project-preview-caption"><span>{title}</span><span>ABRIR ↗</span></div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <a
        ref={anchorRef}
        className={className}
        href={href}
        target="_blank"
        rel="noreferrer"
        onPointerEnter={showFromPointer}
        onPointerMove={movePreview}
        onPointerLeave={() => setVisible(false)}
        onFocus={showFromFocus}
        onBlur={() => setVisible(false)}
      >
        {children}
      </a>
      {typeof document !== "undefined" && createPortal(preview, document.body)}
    </>
  )
}
