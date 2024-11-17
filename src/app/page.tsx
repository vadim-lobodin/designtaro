'use client'

import { Scene } from '@/components/3d/Scene'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'

export default function Home() {
  const [isSceneLoaded, setIsSceneLoaded] = useState(false)
  const sceneRef = useRef<{ selectRandomCard: () => void }>(null)

  const handleFutureClick = () => {
    sceneRef.current?.selectRandomCard()
  }

  return (
    <main className="relative h-[100dvh] w-full bg-background text-foreground overflow-hidden">
      <div className="absolute inset-0">
        <Scene 
          ref={sceneRef} 
          onLoaded={() => setIsSceneLoaded(true)} 
        />
      </div>
      {isSceneLoaded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full px-4 sm:px-0 sm:w-auto">
          <Button
            onClick={handleFutureClick}
            variant="secondary"
            className="w-full sm:w-auto text-base sm:text-lg transition-colors"
          >
            Show me my future
          </Button>
        </div>
      )}
    </main>
  )
}
