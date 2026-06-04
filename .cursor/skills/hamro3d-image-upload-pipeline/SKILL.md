---
name: hamro3d-image-upload-pipeline
description: >-
  Defines the correct image upload and storage pipeline for the Hamro3D Nitro
  backend. Covers Phase 0 local filesystem upload (dev only), Phase 1 Cloudflare
  R2 migration path, admin auth guard on upload, file size and MIME limits,
  multi-image array convention for products, and how Nuxt Image serves uploads.
  Triggers on: image upload, file upload, R2, CDN, upload endpoint, product image,
  multipart, public/images, storage, uploads, image.post.ts, NuxtPicture, ipx.
---

# Hamro3D — Image Upload Pipeline

The upload system has two phases. Phase 0 is local-dev-only filesystem storage.
Phase 1 is Cloudflare R2 (or equivalent object store). Never ship Phase 0 to
production Vercel/Cloudflare Pages — the filesystem is ephemeral.

---

## Upload route contract (both phases)

`server/api/upload/image.post.ts` always:

1. Calls `await requireAdmin(event)` as the **first line** — no exceptions
2. Reads multipart form data (`readMultipartFormData`)
3. Validates MIME type against the allowlist
4. Rejects files over 5 MB
5. Generates a `randomUUID()` filename to prevent path traversal
6. Returns `{ url: string }` — a public-accessible URL

---

## Phase 0 — local filesystem (dev only)

```typescript
import { readMultipartFormData, createError } from 'h3'
import { writeFile, mkdir }                   from 'node:fs/promises'
import { join, extname }                      from 'node:path'
import { randomUUID }                         from 'node:crypto'

const ALLOWED_MIME  = ['image/jpeg', 'image/png', 'image/webp', 'image/avif']
const MAX_BYTES     = 5 * 1024 * 1024   // 5 MB

export default defineEventHandler(async (event) => {
  await requireAdmin(event)   // ← MUST be first

  if (process.env.NODE_ENV === 'production') {
    throw createError({ statusCode: 503, message: 'File upload not configured for production' })
  }

  const parts = await readMultipartFormData(event)
  const file  = parts?.find(p => p.name === 'image' || p.filename)
  if (!file?.data || !file.filename) {
    throw createError({ statusCode: 400, message: 'Missing image file' })
  }

  if (!ALLOWED_MIME.includes(file.type ?? '')) {
    throw createError({ statusCode: 415, message: `Unsupported file type: ${file.type}` })
  }
  if (file.data.byteLength > MAX_BYTES) {
    throw createError({ statusCode: 413, message: 'Image must be under 5 MB' })
  }

  const ext       = extname(file.filename) || '.jpg'
  const filename  = `${randomUUID()}${ext}`
  const uploadDir = join(process.cwd(), 'public', 'images', 'products', 'uploads')
  await mkdir(uploadDir, { recursive: true })
  await writeFile(join(uploadDir, filename), file.data)

  return { url: `/images/products/uploads/${filename}` }
})
```

---

## Phase 1 — Cloudflare R2 (production target)

### Required env vars (add to `.env.example` and `runtimeConfig`)

```bash
# .env.example
NUXT_R2_ACCOUNT_ID=your-cloudflare-account-id
NUXT_R2_ACCESS_KEY=your-r2-access-key-id
NUXT_R2_SECRET_KEY=your-r2-secret-access-key
NUXT_R2_BUCKET=hamro3d-uploads
NUXT_R2_PUBLIC_URL=https://uploads.hamro3d.com
```

```typescript
// nuxt.config.ts runtimeConfig (server-only — no public exposure)
runtimeConfig: {
  r2AccountId: process.env.NUXT_R2_ACCOUNT_ID || '',
  r2AccessKey: process.env.NUXT_R2_ACCESS_KEY || '',
  r2SecretKey: process.env.NUXT_R2_SECRET_KEY || '',
  r2Bucket:    process.env.NUXT_R2_BUCKET     || 'hamro3d-uploads',
  r2PublicUrl: process.env.NUXT_R2_PUBLIC_URL  || '',
}
```

### Phase 1 upload handler shape

```typescript
// Install: npm install @aws-sdk/client-s3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

export default defineEventHandler(async (event) => {
  await requireAdmin(event)

  const config = useRuntimeConfig()
  const client = new S3Client({
    region: 'auto',
    endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     config.r2AccessKey as string,
      secretAccessKey: config.r2SecretKey as string,
    },
  })

  // ... read, validate file (same as Phase 0) ...

  const key = `products/${randomUUID()}${ext}`
  await client.send(new PutObjectCommand({
    Bucket:      config.r2Bucket as string,
    Key:         key,
    Body:        file.data,
    ContentType: file.type,
  }))

  return { url: `${config.r2PublicUrl}/${key}` }
})
```

---

## Product image array convention

`products.images` is a `TEXT` column storing a JSON array of URL strings.
The upload route returns **one URL per call**. The admin form manages the array.

### Admin form pattern (multiple images)

```typescript
const imageUrls = ref<string[]>(form.images ?? [])
const uploading = ref(false)

async function uploadImage(event: Event) {
  const input = event.target as HTMLInputElement
  const file  = input.files?.[0]
  if (!file) return

  uploading.value = true
  const fd = new FormData()
  fd.append('image', file)

  const res = await fetch('/api/upload/image', {
    method: 'POST',
    credentials: 'include',
    body: fd,
  })
  const { url } = await res.json()
  imageUrls.value.push(url)
  uploading.value = false
}

function removeImage(index: number) {
  imageUrls.value.splice(index, 1)
}
```

```vue
<!-- Image list with remove -->
<div v-for="(url, i) in imageUrls" :key="url" class="relative">
  <NuxtImg :src="url" width="80" height="80" class="object-cover" />
  <button
    type="button"
    class="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-h3d-error text-white text-2xs"
    @click="removeImage(i)"
  >✕</button>
</div>

<!-- Upload trigger -->
<label class="cursor-pointer border border-dashed border-h3d-border p-4 text-h3d-muted text-sm hover:border-h3d-accent">
  <input type="file" accept="image/*" class="sr-only" @change="uploadImage" />
  <span v-if="uploading">Uploading…</span>
  <span v-else>+ Add image</span>
</label>
```

---

## How Nuxt Image serves uploads

### Phase 0 — local `ipx` provider

`nuxt.config.ts` sets `image.provider: 'ipx'` and `image.dir` to the absolute
`public/` path. Local uploads at `/images/products/uploads/<uuid>.jpg` are
served directly by Nitro and optimised on-the-fly by ipx.

```vue
<!-- Use NuxtImg for all product images -->
<NuxtImg
  :src="product.images[0]"
  width="400"
  height="400"
  format="webp"
  quality="80"
  loading="lazy"
  class="w-full object-cover"
/>
```

### Phase 1 — R2 CDN

Set `image.provider: 'none'` (bypass ipx) and use the R2 public URL directly.
Cloudflare handles image optimisation at the CDN edge.

---

## File size and MIME — hard limits

| Limit | Value |
|-------|-------|
| Max file size | 5 MB |
| Allowed MIME types | `image/jpeg`, `image/png`, `image/webp`, `image/avif` |
| Filename | UUID only — never use the original filename |
| Storage path (Phase 0) | `public/images/products/uploads/<uuid>.<ext>` |
| Storage key (Phase 1) | `products/<uuid>.<ext>` |
