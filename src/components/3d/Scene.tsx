import { Canvas } from '@react-three/fiber'
import { CardRing } from './CardRing'
import { forwardRef, ForwardRefRenderFunction, useRef, useEffect } from 'react'
import { Html } from '@react-three/drei'

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
          position: [0, 5, 65],
          fov: 60,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true }}
        onCreated={() => {
          onLoaded()
        }}
      >
        <color attach="background" args={['#000000']} />
        <ambientLight intensity={2.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />
        <pointLight position={[10, -10, 10]} intensity={0.8} />
        <pointLight position={[-10, 10, -10]} intensity={0.8} />
        <CardRing ref={cardRingRef} />
        <Html center>
          <div className="flex justify-center items-center">
            <img 
              src="/preloader.gif" 
              alt="Loading..."
              className="w-[100px] h-[100px]"
            />
          </div>
        </Html>
      </Canvas>
    </div>
  )
}

export const Scene = forwardRef(SceneComponent) 