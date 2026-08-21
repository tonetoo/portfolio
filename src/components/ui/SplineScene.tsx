import { Suspense, lazy } from "react"
import type { Application } from "@splinetool/runtime"

const Spline = lazy(() => import("@splinetool/react-spline"))

type SplineSceneProps = {
  scene: string
  className?: string
}

const enableGlobalPointerTracking = (app: Application) => {
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches
  app.setGlobalEvents(supportsHover)
}

export default function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <Suspense
      fallback={
        <div className="spline-fallback" aria-label="Carregando visual 3D">
          <span />
        </div>
      }
    >
      <Spline scene={scene} className={className} onLoad={enableGlobalPointerTracking} />
    </Suspense>
  )
}
