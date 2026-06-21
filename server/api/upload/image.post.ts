import { readMultipartFormData, createError } from 'h3'
import { writeFile, mkdir } from 'node:fs/promises'
import { join, extname } from 'node:path'
import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
// Upload endpoint accessible without admin authentication


  const parts = await readMultipartFormData(event)
  if (!parts || parts.length === 0) {
    throw createError({ statusCode: 400, message: 'No file received' })
  }

  const filePart = parts.find((p) => p.name === 'image' || p.filename)
  if (!filePart || !filePart.data || !filePart.filename) {
    throw createError({ statusCode: 400, message: 'Missing image part' })
  }

  // Validate MIME type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  const mime = filePart.type ?? ''
  if (!allowedTypes.includes(mime)) {
    throw createError({ statusCode: 415, message: `Unsupported file type: ${mime}` })
  }

  const ext = extname(filePart.filename) || '.jpg'
  const filename = `${randomUUID()}${ext}`

  // Save to public/images/products/uploads/
  const uploadDir = join(process.cwd(), 'public', 'images', 'products', 'uploads')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), filePart.data)

  return { url: `/images/products/uploads/${filename}` }
})
