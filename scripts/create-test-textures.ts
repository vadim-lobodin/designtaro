import { createCanvas } from 'canvas'
import * as fs from 'fs'
import * as path from 'path'

const createTestTexture = (text: string, color: string) => {
  const canvas = createCanvas(512, 512)
  const ctx = canvas.getContext('2d')

  // Fill background
  ctx.fillStyle = color
  ctx.fillRect(0, 0, 512, 512)

  // Add text
  ctx.fillStyle = 'white'
  ctx.font = '48px Arial'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 256, 256)

  return canvas.toBuffer()
}

// Updated path to public/content folder
const contentDir = path.join(process.cwd(), 'public', 'content')

// Create content directory if it doesn't exist
if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true })
}

// Create test textures for all 14 cards
for (let i = 1; i <= 14; i++) {
  const frontBuffer = createTestTexture(`Front ${i}`, '#4a90e2')
  const backBuffer = createTestTexture(`Back ${i}`, '#e24a4a')

  fs.writeFileSync(path.join(contentDir, `${i}-f.png`), frontBuffer)
  fs.writeFileSync(path.join(contentDir, `${i}-b.png`), backBuffer)
}

console.log('Test textures created successfully!') 