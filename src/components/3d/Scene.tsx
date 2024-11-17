import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { CardRing } from './CardRing'
import { forwardRef, ForwardRefRenderFunction, useRef, useEffect } from 'react'

interface SceneRef {
  selectRandomCard: () => void
}

const SceneComponent: ForwardRefRenderFunction<SceneRef, {}> = (props, ref) => {
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
    <div className="relative w-full h-full bg-background">
      <Canvas
        camera={{
          position: [0, 5, 58],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={3} />
        <OrbitControls 
          enableZoom={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
          enablePan={false}
        />
        <CardRing ref={cardRingRef} />
      </Canvas>
    </div>
  )
}

export const Scene = forwardRef(SceneComponent) 