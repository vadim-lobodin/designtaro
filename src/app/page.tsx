'use client'

import { Scene } from '@/components/3d/Scene'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'

export default function Home() {
  const [showFuture, setShowFuture] = useState(false)
  const [isSceneLoaded, setIsSceneLoaded] = useState(false)
  const sceneRef = useRef<{ selectRandomCard: () => void }>(null)

  const handleFutureClick = () => {
    setShowFuture(true)
    sceneRef.current?.selectRandomCard()
  }

  return (
    <main className="relative h-screen w-full bg-background text-foreground">
      <div className="absolute inset-0">
        <Scene 
          ref={sceneRef} 
          onLoaded={() => setIsSceneLoaded(true)} 
        />
      </div>
      {isSceneLoaded && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <Button
            onClick={handleFutureClick}
            disabled={showFuture}
            className="text-lg bg-primary hover:bg-primary/90"
          >
            Show me my future
          </Button>
        </div>
      )}
    </main>
  )
}
