import { useRef, useState, useEffect, forwardRef, ForwardRefRenderFunction } from 'react'
import { useFrame } from '@react-three/fiber'
import { Group, Mesh, TextureLoader, Texture, FrontSide, Shape, ExtrudeGeometry, Vector2, Vector3 } from 'three'
import { useLoader } from '@react-three/fiber'
import gsap from 'gsap'

interface CardProps {
  position: [number, number, number]
  rotation: [number, number, number]
  index: number
  isSelected: boolean
  onClick: () => void
  originalPosition?: Vector3
}

interface CardRingRef {
  selectRandomCard: () => void
}

const Card = ({ position, rotation, index, isSelected, onClick, originalPosition }: CardProps) => {
  const cardRef = useRef<Group>(null)
  const [frontTexture, backTexture] = useLoader(TextureLoader, [
    `/content/${index + 1}-f.png`,
    `/content/${index + 1}-b.png`
  ])

  // Create rounded rectangle shape
  const createRoundedRectShape = () => {
    const width = 10;
    const height = 16;
    const radius = 0.8;

    const shape = new Shape();
    shape.moveTo(-width / 2 + radius, -height / 2);
    shape.lineTo(width / 2 - radius, -height / 2);
    shape.quadraticCurveTo(width / 2, -height / 2, width / 2, -height / 2 + radius);
    shape.lineTo(width / 2, height / 2 - radius);
    shape.quadraticCurveTo(width / 2, height / 2, width / 2 - radius, height / 2);
    shape.lineTo(-width / 2 + radius, height / 2);
    shape.quadraticCurveTo(-width / 2, height / 2, -width / 2, height / 2 - radius);
    shape.lineTo(-width / 2, -height / 2 + radius);
    shape.quadraticCurveTo(-width / 2, -height / 2, -width / 2 + radius, -height / 2);

    return shape;
  }

  const roundedRectShape = createRoundedRectShape();
  const extrudeSettings = {
    steps: 1,
    depth: 0.1,
    bevelEnabled: false,
    UVGenerator: {
      generateTopUV: function(geometry: ExtrudeGeometry, vertices: number[], indexA: number, indexB: number, indexC: number) {
        const width = 10;
        const height = 16;
        
        const ax = (vertices[indexA * 3] + width/2) / width;
        const ay = (vertices[indexA * 3 + 1] + height/2) / height;
        const bx = (vertices[indexB * 3] + width/2) / width;
        const by = (vertices[indexB * 3 + 1] + height/2) / height;
        const cx = (vertices[indexC * 3] + width/2) / width;
        const cy = (vertices[indexC * 3 + 1] + height/2) / height;

        return [
          new Vector2(ax, ay),
          new Vector2(bx, by),
          new Vector2(cx, cy)
        ];
      },
      generateSideWallUV: function(geometry: ExtrudeGeometry, vertices: number[], indexA: number, indexB: number, indexC: number, indexD: number) {
        return [
          new Vector2(0, 0),
          new Vector2(0, 1),
          new Vector2(1, 1),
          new Vector2(1, 0)
        ];
      }
    }
  };

  useEffect(() => {
    if (frontTexture && backTexture) {
      frontTexture.flipY = true;
      backTexture.flipY = true;
      frontTexture.needsUpdate = true;
      backTexture.needsUpdate = true;
    }
  }, [frontTexture, backTexture])

  useEffect(() => {
    if (cardRef.current && isSelected) {
      // Calculate the direction vector from the center to the card
      const directionX = cardRef.current.position.x
      const directionZ = cardRef.current.position.z
      const length = Math.sqrt(directionX * directionX + directionZ * directionZ)
      const normalizedX = directionX / length
      const normalizedZ = directionZ / length

      // Move card towards the user's point of view
      gsap.to(cardRef.current.position, {
        x: normalizedX * 40,
        y: 5,
        z: normalizedZ * 40,
        duration: 1,
        ease: 'power2.out'
      })
      
      // Rotate card to face the camera without flipping
      const targetRotationY = Math.atan2(normalizedX, normalizedZ)
      gsap.to(cardRef.current.rotation, {
        x: 0,
        y: targetRotationY, // Removed Math.PI to not flip the card
        z: 0,
        duration: 1,
        ease: 'power2.out'
      })
    } else if (cardRef.current && originalPosition) {
      // Return to original position when deselected
      gsap.to(cardRef.current.position, {
        x: originalPosition.x,
        y: originalPosition.y,
        z: originalPosition.z,
        duration: 1,
        ease: 'power2.inOut'
      })
      gsap.to(cardRef.current.rotation, {
        x: rotation[0],
        y: rotation[1] + Math.PI, // Add Math.PI to show back face in ring
        z: rotation[2],
        duration: 1,
        ease: 'power2.inOut'
      })
    }
  }, [isSelected, originalPosition, rotation])

  return (
    <group
      ref={cardRef}
      position={position}
      rotation={[rotation[0], rotation[1] + Math.PI, rotation[2]]} // Add Math.PI to initial rotation
      onClick={onClick}
      scale={isSelected ? 1.2 : 1}
    >
      {/* Front face */}
      <mesh position={[0, 0, 0.05]}>
        <extrudeGeometry args={[roundedRectShape, extrudeSettings]} />
        <meshStandardMaterial 
          map={frontTexture}
          side={FrontSide}
          transparent={true}
          opacity={1}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
      {/* Back face */}
      <mesh position={[0, 0, -0.05]}>
        <extrudeGeometry args={[roundedRectShape, extrudeSettings]} />
        <meshStandardMaterial 
          map={backTexture}
          side={FrontSide}
          transparent={true}
          opacity={1}
          metalness={0.1}
          roughness={0.5}
        />
      </mesh>
    </group>
  )
}

const CardRingComponent: ForwardRefRenderFunction<CardRingRef, {}> = (props, ref) => {
  const groupRef = useRef<Group>(null)
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [isRotating, setIsRotating] = useState(true)
  const [cardPositions, setCardPositions] = useState<Vector3[]>([])

  useEffect(() => {
    // Store original positions of all cards
    const positions: Vector3[] = Array.from({ length: 14 }, (_, i) => {
      const angle = (i / 14) * Math.PI * 2
      const radius = 30
      const x = Math.sin(angle) * radius
      const z = Math.cos(angle) * radius
      return new Vector3(x, 0, z)
    })
    setCardPositions(positions)
  }, [])

  const rotateToCard = (index: number) => {
    if (groupRef.current) {
      const targetAngle = -(index / 14) * Math.PI * 2
      gsap.to(groupRef.current.rotation, {
        y: targetAngle,
        duration: 1,
        ease: 'power2.inOut'
      })
    }
  }

  const handleCardClick = (index: number) => {
    setSelectedCard(index)
    setIsRotating(false)
    rotateToCard(index)
  }

  // Add method to select random card
  const selectRandomCard = () => {
    const randomIndex = Math.floor(Math.random() * 14)
    handleCardClick(randomIndex)
  }

  useFrame((state, delta) => {
    if (groupRef.current && isRotating) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  const cards = Array.from({ length: 14 }, (_, i) => {
    const angle = (i / 14) * Math.PI * 2
    const radius = 30
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    
    // Calculate rotation to make cards face outward
    const rotationY = Math.atan2(x, z)
    
    return (
      <Card
        key={i}
        position={[x, 0, z]}
        rotation={[0, rotationY, 0]}
        index={i}
        isSelected={selectedCard === i}
        onClick={() => handleCardClick(i)}
        originalPosition={cardPositions[i]}
      />
    )
  })

  // Expose the selectRandomCard method via ref
  useEffect(() => {
    if (ref) {
      (ref as any).current = {
        selectRandomCard: () => {
          const randomIndex = Math.floor(Math.random() * 14)
          handleCardClick(randomIndex)
        }
      }
    }
  }, [ref])

  return (
    <>
      <group ref={groupRef}>{cards}</group>
    </>
  )
}

export const CardRing = forwardRef(CardRingComponent) 