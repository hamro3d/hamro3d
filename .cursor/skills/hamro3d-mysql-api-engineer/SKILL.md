---
name: hamro3d-mysql-api-engineer
description: >-
  Governs how Nitro server routes in the Hamro3D repo query MySQL via
  mysql2/promise. Enforces typed row interfaces, parameterised queries,
  Zod validation, proper JSON column handling, and safe error responses.
  Use when writing or reviewing any file in server/api/, server/utils/,
  or server/middleware/. Triggers on: server route, api route, mysql,
  db query, database, nitro api, server/api, JSON column, parameterised,
  sql, useDb, defineEventHandler, readBody, getQuery.
---

# Hamro3D — MySQL API Engineer

You write typed, safe Nitro server routes that query MySQL via `mysql2/promise`.
Every route must be readable, injection-proof, and return brand-consistent errors.

## Quick start checklist

Before writing any server route:

- [ ] Import `useDb` from `~/server/utils/db` (auto-imported in Nitro)
- [ ] Define a `Row` interface for every query result
- [ ] Use `?` placeholders — never string interpolation in SQL
- [ ] Validate POST/PUT bodies with Zod before the DB call
- [ ] Parse/stringify JSON columns on every read/write
- [ ] Catch DB errors and throw `createError` — never leak raw MySQL messages
- [ ] Return the correct HTTP status code

---

## 1. Getting the database pool

`useDb()` returns a singleton `mysql2` pool. It is auto-imported inside Nitro.

```typescript
// server/api/products/index.get.ts
export default defineEventHandler(async (event) => {
  const db = useDb()
  // ...
})
```

Never create a new pool in a route file. Never import `mysql2` directly in routes.

---

## 2. Typing query results — never use `any`

Always define a `Row` interface and cast the destructured result:

```typescript
import type { RowDataPacket, FieldPacket } from 'mysql2'

interface ProductRow extends RowDataPacket {
  id: number
  title: string
  price: number
  images: string        // raw JSON string from MySQL
  status: 'Active' | 'Draft' | 'Archived'
  category_name: string | null
}

const [rows] = await db.query<ProductRow[]>(
  'SELECT id, title, price, images, status FROM products WHERE id = ?',
  [id]
)

const product = rows[0]
if (!product) throw createError({ statusCode: 404, message: 'Piece not found' })
```

For aggregate / non-SELECT queries use `ResultSetHeader`:

```typescript
import type { ResultSetHeader } from 'mysql2'

const [result] = await db.query<ResultSetHeader>(
  'INSERT INTO categories (name, slug) VALUES (?, ?)',
  [name, slug]
)
const newId = result.insertId
```

---

## 3. Parameterised queries — mandatory

```typescript
// ✓ Safe
db.query('SELECT * FROM users WHERE email = ?', [email])

// ✗ Never do this
db.query(`SELECT * FROM users WHERE email = '${email}'`)
```

For dynamic `IN (...)` clauses:

```typescript
const statuses = ['Active', 'Draft']
const placeholders = statuses.map(() => '?').join(',')
db.query(`SELECT * FROM products WHERE status IN (${placeholders})`, statuses)
```

---

## 4. Zod validation on all POST and PUT bodies

```typescript
import { z } from 'zod'

const createCategorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: z.string().min(2).max(100).regex(/^[a-z0-9-]+$/),
  description: z.string().max(500).optional(),
})

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const parsed = createCategorySchema.safeParse(body)

  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      message: parsed.error.errors[0]?.message ?? 'Invalid request body',
    })
  }

  const { name, slug, description } = parsed.data
  // ...proceed to DB
})
```

---

## 5. JSON column convention

MySQL stores `images`, `timeline`, `lines`, `descriptions`, `processes`,
`care`, `related_product_ids` as TEXT containing JSON. Always transform:

```typescript
// On READ — parse JSON columns before returning
function parseProductRow(row: ProductRow) {
  return {
    ...row,
    images: safeJsonParse<string[]>(row.images, []),
    descriptions: safeJsonParse<string[]>(row.descriptions, []),
    processes: safeJsonParse<string[]>(row.processes, []),
    related_product_ids: safeJsonParse<number[]>(row.related_product_ids, []),
  }
}

function safeJsonParse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback
  try { return JSON.parse(raw) as T } catch { return fallback }
}

// On WRITE — stringify before INSERT/UPDATE
await db.query(
  'INSERT INTO products (title, images) VALUES (?, ?)',
  [title, JSON.stringify(images)]
)
```

---

## 6. Pagination convention

All list endpoints accept `limit` and `offset`. Always return the envelope:

```typescript
const query = getQuery(event)
const limit  = Math.min(Number(query.limit  ?? 20), 100)
const offset = Number(query.offset ?? 0)

const [rows]    = await db.query<ProductRow[]>(sql + ' LIMIT ? OFFSET ?', [...params, limit, offset])
const [[count]] = await db.query<(RowDataPacket & { total: number })[]>(countSql, params)

return { data: rows.map(parseProductRow), total: count.total, limit, offset }
```

---

## 7. Error handling — never leak raw MySQL messages

```typescript
try {
  const [result] = await db.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id])
  if (result.affectedRows === 0) {
    throw createError({ statusCode: 404, message: 'Piece not found' })
  }
  return { message: 'Piece removed' }
} catch (err: unknown) {
  // Re-throw H3 errors as-is
  if ((err as { statusCode?: number }).statusCode) throw err

  // Log internally, return generic message
  console.error('[DB] delete product', err)
  throw createError({ statusCode: 500, message: 'Something went wrong. Please try again.' })
}
```

---

## 8. Route file naming

| File name | HTTP method |
|-----------|-------------|
| `index.get.ts` | GET /resource |
| `index.post.ts` | POST /resource |
| `[id].get.ts` | GET /resource/:id |
| `[id].put.ts` | PUT /resource/:id |
| `[id].delete.ts` | DELETE /resource/:id |

Route param: `const id = getRouterParam(event, 'id')`

---

## 9. Auth guard — every mutating route

Every POST, PUT, DELETE (and sensitive GET) must begin with:

```typescript
await requireAdmin(event)  // throws 401 if not admin session
```

For user-scoped routes:
```typescript
const user = getSessionUser(event)
if (!user) throw createError({ statusCode: 401, message: 'Please sign in' })
```

---

## 10. Brand-consistent error copy

| Instead of... | Write... |
|---------------|----------|
| "Not Found" | "Piece not found" |
| "Unauthorized" | "Please sign in to continue" |
| "Forbidden" | "You don't have access to this" |
| "Bad Request" | Use the Zod validation message directly |
| "Internal Server Error" | "Something went wrong. Please try again." |
