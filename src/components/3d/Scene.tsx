import { Canvas } from '@react-three/fiber'
import { CardRing } from './CardRing'
import { forwardRef, ForwardRefRenderFunction, useRef, useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface SceneRef {
  selectRandomCard: () => void
}

interface SceneProps {
  onLoaded: () => void
}

const SceneComponent: ForwardRefRenderFunction<SceneRef, SceneProps> = ({ onLoaded }, ref) => {
  const cardRingRef = useRef<{ selectRandomCard: () => void }>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVisible, setIsVisible] = useState(false)

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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <img 
            src="/preloader.gif" 
            alt="Loading..."
            className="w-[80px] h-[80px] md:w-[100px] md:h-[100px]"
          />
        </div>
      )}
      <div 
        className={cn(
          "absolute inset-0 transition-opacity duration-1000",
          isVisible ? "opacity-100" : "opacity-0"
        )}
      >
        <Canvas
          camera={{
            position: [0, 5, 65],
            fov: 60,
            near: 0.1,
            far: 1000,
          }}
          gl={{ antialias: true }}
          onCreated={() => {
            setIsLoading(false)
            setIsVisible(true)
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
        </Canvas>
      </div>
    </div>
  )
}

export const Scene = forwardRef(SceneComponent) 