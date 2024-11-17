import { Canvas } from '@react-three/fiber'
import { CardRing } from './CardRing'
import { forwardRef, ForwardRefRenderFunction, useRef, useEffect } from 'react'
import { Loader } from '@react-three/drei'

interface SceneRef {
  selectRandomCard: () => void
}

interface SceneProps {
  onLoaded: () => void
}

const SceneComponent: ForwardRefRenderFunction<SceneRef, SceneProps> = ({ onLoaded }, ref) => {
  const cardRingRef = useRef<{ selectRandomCard: () => void }>(null)

  useEffect(() => {
    if (ref) {
      (ref as any).current = {
        selectRandomCard: () => {
          cardRingRef.current?.selectRandomCard()
        }
      }
    }
  }, [ref])

  return (
    <div className="relative w-full h-full bg-black">
      <Canvas
        camera={{
          position: [0, 5, 58],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true }}
        onCreated={() => {
          // Call onLoaded when the Canvas is ready
          onLoaded()
        }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />
        <pointLight position={[10, -10, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.8} />
        <CardRing ref={cardRingRef} />
      </Canvas>
      <Loader />
    </div>
  )
}

export const Scene = forwardRef(SceneComponent) 