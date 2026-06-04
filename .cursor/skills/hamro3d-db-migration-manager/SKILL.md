---
name: hamro3d-db-migration-manager
description: >-
  Defines how database schema changes are made safely in the Hamro3D MySQL
  codebase. Covers the two-script convention (destructive init vs additive
  migration), production safety guards, JSON column handling in ALTER TABLE,
  .env.example maintenance, schema documentation, and npm script naming.
  Triggers on: migration, database schema, db-init, ALTER TABLE, schema change,
  mysql migration, drop table, seed data, db:init, db:migrate, scripts/db-,
  CREATE TABLE, INSERT seed.
---

# Hamro3D — DB Migration Manager

Schema changes are irreversible in production. Every migration must be additive,
documented, and safe to re-run.

---

## Two-script convention

| Script | Purpose | Safe in production? |
|--------|---------|---------------------|
| `scripts/db-init.js` | Full destructive reset — drops and recreates all tables, seeds mock data | **Never** |
| `scripts/db-migrate-<feature>.js` | Additive only — ALTER TABLE, CREATE TABLE, INSERT. Never DROP | Yes |

---

## `db-init.js` — production guard (mandatory)

The first lines of `db-init.js` must refuse to run outside a dev environment:

```javascript
if (process.env.NODE_ENV === 'production') {
  console.error('ERROR: db-init.js must not run in production. Use db:migrate scripts.')
  process.exit(1)
}
```

The npm script must also encode this:

```json
{
  "scripts": {
    "db:init": "NODE_ENV=development node scripts/db-init.js"
  }
}
```

---

## `db-migrate-<feature>.js` — structure template

Every migration script follows this pattern:

```javascript
import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'

// Load .env manually (no dotenv dependency)
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) return {}
  return Object.fromEntries(
    fs.readFileSync(envPath, 'utf-8')
      .split('\n')
      .filter(l => /^\s*[\w.-]+=/.test(l))
      .map(l => {
        const [k, ...rest] = l.split('=')
        let v = rest.join('=').trim()
        if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
          v = v.slice(1, -1)
        }
        return [k.trim(), v]
      })
  )
}

async function main() {
  const env = loadEnv()
  const conn = await mysql.createConnection({
    host:     env.NUXT_DB_HOST     || '127.0.0.1',
    port:     Number(env.NUXT_DB_PORT || 3306),
    user:     env.NUXT_DB_USER     || 'root',
    password: env.NUXT_DB_PASSWORD || '',
    database: env.NUXT_DB_NAME     || 'hamro3d',
  })

  console.log('Connected. Running migration: <feature-name>')

  // ── ADDITIVE CHANGES ONLY BELOW ──────────────────────────────────────
  await conn.query(`
    ALTER TABLE products
    ADD COLUMN IF NOT EXISTS seo_title VARCHAR(70) NULL,
    ADD COLUMN IF NOT EXISTS seo_description VARCHAR(160) NULL
  `)
  console.log('✓ Added seo_title, seo_description to products')

  // ── SEED DATA (only INSERT, never UPDATE existing rows) ───────────────
  await conn.query(`
    INSERT IGNORE INTO categories (name, slug, description) VALUES
    ('Keychains', 'keychains', 'Personalised 3D-printed keychains'),
    ('Lamps', 'lamps', 'Litholamps and moon lamps')
  `)
  console.log('✓ Seeded default categories')

  await conn.end()
  console.log('Migration complete.')
}

main().catch(err => { console.error(err); process.exit(1) })
```

---

## npm script naming convention

```json
{
  "scripts": {
    "db:init":                    "NODE_ENV=development node scripts/db-init.js",
    "db:migrate:categories":      "node scripts/db-migrate-categories.js",
    "db:migrate:seo-fields":      "node scripts/db-migrate-seo-fields.js"
  }
}
```

Pattern: `db:migrate:<feature-slug>` — always kebab-case.

---

## JSON column convention in migrations

When adding a new JSON column:

```javascript
await conn.query(`
  ALTER TABLE products
  ADD COLUMN IF NOT EXISTS tags TEXT NULL COMMENT 'JSON array of tag strings'
`)
```

Always add the `COMMENT 'JSON ...'` annotation so the column purpose is
self-documenting in the MySQL schema.

When reading JSON columns in a migration seed, always stringify:

```javascript
await conn.query(
  'INSERT INTO products (title, images) VALUES (?, ?)',
  ['Keychain', JSON.stringify(['/images/keychain-1.jpg'])]
)
```

---

## `.env.example` — keep in sync

When `nuxt.config.ts` `runtimeConfig` gains a new key, add a matching line
to `.env.example` in the same commit:

```bash
# .env.example
NUXT_DB_HOST=127.0.0.1
NUXT_DB_PORT=3306
NUXT_DB_USER=root
NUXT_DB_PASSWORD=
NUXT_DB_NAME=hamro3d
NUXT_SESSION_SECRET=change-me-in-production-use-32-chars-minimum
```

Never commit `.env`. Never set a real secret in `.env.example`.

---

## Schema documentation — `scripts/schema.md`

After every migration, update `scripts/schema.md` to reflect the current
table structures. Minimum required per table:

```markdown
## `products`
| Column | Type | Nullable | Notes |
|--------|------|----------|-------|
| id | INT AUTO_INCREMENT | No | PK |
| title | VARCHAR(255) | No | |
| images | TEXT | Yes | JSON array of URL strings |
| status | VARCHAR(20) | No | Active \| Draft \| Archived |
| category_id | INT | Yes | FK → categories.id |
```

---

## What to never do in a migration script

- Never `DROP TABLE` — use `ALTER TABLE ... DROP COLUMN IF EXISTS` for columns
- Never `UPDATE` existing user/product rows — preserve production data
- Never hard-code passwords or secrets
- Never run without testing on a local clone first
- Never add a `NOT NULL` column without a `DEFAULT` value to an existing table
  (this will fail if the table has rows)

When removing a column is truly necessary, do it in two steps:
1. Migration 1: stop writing to the column in application code
2. Migration 2 (next release): `ALTER TABLE ... DROP COLUMN`
