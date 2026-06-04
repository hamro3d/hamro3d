---
name: hamro3d-auth-security-auditor
description: >-
  Audits and enforces auth/security conventions across the Hamro3D Nitro +
  Nuxt 3 codebase. Checks every server route for auth guards, validates
  session cookie settings, finds hardcoded credentials, enforces Zod on all
  mutations, and keeps .env.example in sync with runtimeConfig. Includes a
  runnable shell audit script. Triggers on: security, auth guard, upload,
  hardcoded, credentials, env, session, cookie, requireAdmin, audit,
  vulnerability, unprotected route, .env.example, runtimeConfig.
---

# Hamro3D — Auth & Security Auditor

Run this skill whenever you add a server route, change auth logic, add an env
var to `runtimeConfig`, or are asked to do a security review.

## Quick audit — run first

```bash
bash .cursor/skills/hamro3d-auth-security-auditor/scripts/audit-security.sh
```

Review every line marked `✗` before merging to `main`.

---

## Rule 1 — Every mutating route must be guarded

All `POST`, `PUT`, and `DELETE` handlers in `server/api/` must be protected by
**one of two mechanisms**:

**Option A — Direct call in the route file:**
```typescript
await requireAdmin(event)
```

**Option B — Covered by `server/middleware/admin-api.ts`** (the current approach).
The Nitro server middleware runs before every matching route and calls
`requireAdmin` for write operations on `/api/products`, `/api/categories`,
`/api/users`, and `/api/orders`. If a new resource route is added, its path
must be explicitly added to `admin-api.ts`.

Exceptions (public by design, document why in a comment):
- `server/api/auth/login.post.ts` — unauthenticated by definition
- `server/api/auth/register.post.ts` — unauthenticated by definition
- `server/api/orders/index.post.ts` — customer checkout (uses `getSessionUser` instead)

For customer-scoped routes use:
```typescript
const user = getSessionUser(event)
if (!user) throw createError({ statusCode: 401, message: 'Please sign in to continue' })
```

---

## Rule 2 — Upload endpoint must be guarded

`server/api/upload/image.post.ts` MUST call `requireAdmin(event)` as its first
line. The comment `// Upload endpoint accessible without admin authentication`
must be removed. Unauthenticated upload = arbitrary file write to `public/`.

Correct implementation:

```typescript
export default defineEventHandler(async (event) => {
  await requireAdmin(event)  // ← must be first

  const parts = await readMultipartFormData(event)
  // ...rest of handler
})
```

---

## Rule 3 — No hardcoded credentials in source

Scan for and remove any pre-filled credential refs in `.vue` or `.ts` files:

```typescript
// ✗ Never commit this
const email    = ref('admin@gmail.com')
const password = ref('admin')

// ✓ Always empty
const email    = ref('')
const password = ref('')
```

Use the audit script to detect these automatically.

---

## Rule 4 — Session cookie settings

`server/utils/auth.ts` `setSessionCookie` must always set:

```typescript
setCookie(event, SESSION_COOKIE, token, {
  httpOnly: true,                                    // ← no JS access
  secure: process.env.NODE_ENV === 'production',    // ← HTTPS only in prod
  sameSite: 'lax',                                  // ← CSRF protection
  path: '/',
  maxAge: SESSION_MAX_AGE_SEC,
})
```

Never remove `httpOnly`. Never set `sameSite: 'none'` without `secure: true`.

---

## Rule 5 — Zod validation on all POST and PUT bodies

Every route that calls `readBody(event)` must also call `schema.safeParse()`.
Routes that read body without Zod are flagged by the audit script.

```typescript
// ✗ Missing Zod
const body = await readBody(event)
const { name } = body

// ✓ With Zod
const body = await readBody(event)
const parsed = schema.safeParse(body)
if (!parsed.success) throw createError({ statusCode: 400, message: parsed.error.errors[0]?.message })
const { name } = parsed.data
```

---

## Rule 6 — `.env.example` must stay in sync with `runtimeConfig`

Whenever a new key is added to `runtimeConfig` in `nuxt.config.ts`, immediately
add a matching entry to `.env.example` at the repo root with a safe placeholder:

```bash
# nuxt.config.ts runtimeConfig key added:
#   myNewSecret: process.env.NUXT_MY_NEW_SECRET || ''

# .env.example entry to add:
NUXT_MY_NEW_SECRET=change-me-in-production
```

The audit script diffs `runtimeConfig` keys against `.env.example` and flags
any key that has no corresponding line.

---

## Rule 7 — No `console.log` in production source

Debug statements must not be committed. Use the audit script to detect them.
If logging is genuinely needed, use a conditional:

```typescript
if (process.env.NODE_ENV !== 'production') {
  console.log('[debug]', payload)
}
```

---

## Rule 8 — `login.vue` must be deleted

`app/pages/login.vue` is a broken duplicate of `app/pages/auth.vue`. It
pre-fills credentials and uses `$fetch` with a wrong response shape check
(`res?.success` does not exist). Delete the file and ensure all admin login
links point to `/auth`.

---

## Applying fixes — standard order

1. Run `audit-security.sh` and note all `✗` lines.
2. Fix in this order: upload guard → hardcoded creds → missing Zod → .env.example.
3. Delete `app/pages/login.vue`.
4. Re-run `audit-security.sh` — all checks must pass before committing.
