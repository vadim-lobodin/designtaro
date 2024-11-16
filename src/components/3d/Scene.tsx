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
    <div className="relative w-full h-full">
      <Canvas
        camera={{
          position: [0, 5, 60],
          fov: 75,
          near: 0.1,
          far: 1000,
        }}
      >
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />
        <pointLight position={[10, -10, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.8} />
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