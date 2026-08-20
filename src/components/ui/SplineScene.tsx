import { Suspense, lazy } from "react"

const Spline = lazy(() => import("@splinetool/react-spline"))

type SplineSceneProps = {
  scene: string
  className?: string
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
      <Spline scene={scene} className={className} />
    </Suspense>
  )
}
