#!/usr/bin/env bash
# audit-security.sh
# Run from the repository root.
# Audits the Hamro3D codebase for auth and security issues.
# Exit 1 if any check fails.

set -uo pipefail

PASS=0
FAIL=0

check() {
  local label="$1"
  local result="$2"   # "ok" | "fail"
  local detail="${3:-}"
  if [[ "$result" == "ok" ]]; then
    echo "  ✓  $label"
    (( PASS++ )) || true
  else
    echo "  ✗  $label${detail:+$'\n'     → '$detail'}"
    (( FAIL++ )) || true
  fi
}

echo ""
echo "============================================================"
echo "  Hamro3D Security Audit"
echo "============================================================"
echo ""

# ── 1. Upload endpoint must call requireAdmin ─────────────────────────────────
echo "── Auth guards ──"
UPLOAD="server/api/upload/image.post.ts"
if [[ -f "$UPLOAD" ]]; then
  # requireAdmin must appear BEFORE readMultipartFormData
  UPLOAD_LINES=$(grep -n "requireAdmin\|readMultipartFormData" "$UPLOAD" 2>/dev/null || true)
  REQUIRE_LINE=$(echo "$UPLOAD_LINES" | grep "requireAdmin" | head -1 | cut -d: -f1)
  MULTI_LINE=$(echo "$UPLOAD_LINES"   | grep "readMultipartFormData" | head -1 | cut -d: -f1)

  if [[ -z "$REQUIRE_LINE" ]]; then
    check "Upload endpoint has requireAdmin guard" "fail" "$UPLOAD — missing requireAdmin"
  elif [[ -n "$MULTI_LINE" && "$REQUIRE_LINE" -lt "$MULTI_LINE" ]]; then
    check "Upload endpoint has requireAdmin guard" "ok"
  else
    check "Upload endpoint has requireAdmin guard" "fail" "$UPLOAD — requireAdmin must come before readMultipartFormData"
  fi
else
  check "Upload endpoint exists" "fail" "$UPLOAD not found"
fi

# Check all mutating routes for requireAdmin.
# Routes may delegate to server/middleware/admin-api.ts (Nitro server middleware).
# A route is considered guarded if EITHER:
#   (a) it calls requireAdmin/getSessionUser directly, OR
#   (b) server/middleware/admin-api.ts covers its path pattern
HAS_SERVER_MIDDLEWARE=false
if [[ -f "server/middleware/admin-api.ts" ]]; then
  HAS_SERVER_MIDDLEWARE=true
fi

MUTATING_ROUTES=$(find server/api -name "*.post.ts" -o -name "*.put.ts" -o -name "*.delete.ts" 2>/dev/null \
  | grep -v "server/api/auth/" \
  | sort)

UNGUARDED=""
for route in $MUTATING_ROUTES; do
  # Guarded directly in the file
  if grep -q "requireAdmin\|getSessionUser" "$route" 2>/dev/null; then
    continue
  fi
  # Guarded by server middleware (only if admin-api.ts exists and covers the path)
  if [[ "$HAS_SERVER_MIDDLEWARE" == "true" ]]; then
    # Derive the API path covered by this file for a rough match
    api_path=$(echo "$route" | sed 's|server/api||' | sed 's|\[id\]|:id|g' | sed 's|\..*||')
    if grep -q "${api_path%%/*}" server/middleware/admin-api.ts 2>/dev/null; then
      continue
    fi
  fi
  UNGUARDED="$UNGUARDED\n     $route"
done

if [[ -z "$UNGUARDED" ]]; then
  check "All mutating routes guarded (direct or via server middleware)" "ok"
else
  check "All mutating routes guarded (direct or via server middleware)" "fail" "$(echo -e "$UNGUARDED")"
fi

echo ""

# ── 2. Hardcoded credentials in .vue and .ts files ───────────────────────────
echo "── Hardcoded credentials ──"
CRED_PATTERNS=("admin@gmail.com" "admin@hamro3d" "ref('admin')" 'ref("admin")' "password = ref(" "email = ref(")
CRED_FOUND=""
for pattern in "${CRED_PATTERNS[@]}"; do
  matches=$(grep -rn "$pattern" --include="*.vue" --include="*.ts" app/ 2>/dev/null \
    | grep -v node_modules | grep -v ".cursor" || true)
  if [[ -n "$matches" ]]; then
    CRED_FOUND="$CRED_FOUND\n$matches"
  fi
done

if [[ -z "$CRED_FOUND" ]]; then
  check "No hardcoded credentials in source" "ok"
else
  check "No hardcoded credentials in source" "fail" "$(echo -e "$CRED_FOUND")"
fi

# Check that login.vue is deleted
if [[ -f "app/pages/login.vue" ]]; then
  check "app/pages/login.vue deleted (broken duplicate)" "fail" "File still exists — delete it, use auth.vue"
else
  check "app/pages/login.vue deleted (broken duplicate)" "ok"
fi

echo ""

# ── 3. Session cookie settings ────────────────────────────────────────────────
echo "── Session cookie ──"
AUTH_UTIL="server/utils/auth.ts"
if [[ -f "$AUTH_UTIL" ]]; then
  grep -q "httpOnly: true" "$AUTH_UTIL" \
    && check "Cookie: httpOnly: true" "ok" \
    || check "Cookie: httpOnly: true" "fail" "$AUTH_UTIL missing httpOnly: true"

  grep -q "sameSite: 'lax'" "$AUTH_UTIL" \
    && check "Cookie: sameSite: 'lax'" "ok" \
    || check "Cookie: sameSite: 'lax'" "fail" "$AUTH_UTIL missing sameSite: 'lax'"

  grep -q "secure: process.env.NODE_ENV" "$AUTH_UTIL" \
    && check "Cookie: secure tied to NODE_ENV" "ok" \
    || check "Cookie: secure tied to NODE_ENV" "fail" "$AUTH_UTIL — secure should be conditional on NODE_ENV"
else
  check "server/utils/auth.ts exists" "fail"
fi

echo ""

# ── 4. Zod validation on POST and PUT bodies ─────────────────────────────────
echo "── Zod validation ──"
MISSING_ZOD=""
for route in $(find server/api -name "*.post.ts" -o -name "*.put.ts" 2>/dev/null | sort); do
  has_body=$(grep -l "readBody" "$route" 2>/dev/null || true)
  if [[ -n "$has_body" ]]; then
    has_zod=$(grep -l "safeParse\|z\.object\|z\.string" "$route" 2>/dev/null || true)
    if [[ -z "$has_zod" ]]; then
      MISSING_ZOD="$MISSING_ZOD\n     $route"
    fi
  fi
done

if [[ -z "$MISSING_ZOD" ]]; then
  check "All POST/PUT routes with readBody use Zod" "ok"
else
  check "All POST/PUT routes with readBody use Zod" "fail" "$(echo -e "$MISSING_ZOD")"
fi

echo ""

# ── 5. .env.example in sync with runtimeConfig ───────────────────────────────
echo "── Environment variables ──"
if [[ ! -f ".env.example" ]]; then
  check ".env.example exists" "fail" "Create .env.example documenting all NUXT_* vars"
else
  check ".env.example exists" "ok"

  # Extract keys from runtimeConfig in nuxt.config.ts
  RUNTIME_KEYS=$(grep -oE "NUXT_[A-Z0-9_]+" nuxt.config.ts 2>/dev/null | sort -u || true)
  MISSING_KEYS=""
  for key in $RUNTIME_KEYS; do
    if ! grep -q "$key" .env.example 2>/dev/null; then
      MISSING_KEYS="$MISSING_KEYS $key"
    fi
  done

  if [[ -z "$MISSING_KEYS" ]]; then
    check ".env.example covers all runtimeConfig NUXT_ vars" "ok"
  else
    check ".env.example covers all runtimeConfig NUXT_ vars" "fail" "Missing:$MISSING_KEYS"
  fi
fi

# .env should not be committed
if git ls-files --error-unmatch .env > /dev/null 2>&1; then
  check ".env is NOT tracked by git" "fail" ".env is committed — add it to .gitignore immediately"
else
  check ".env is NOT tracked by git" "ok"
fi

echo ""

# ── 6. No console.log in production source ───────────────────────────────────
echo "── Debug artifacts ──"
CONSOLE_LOGS=$(grep -rn "console\.log" --include="*.ts" --include="*.vue" \
  server/ app/ 2>/dev/null | grep -v node_modules || true)
if [[ -z "$CONSOLE_LOGS" ]]; then
  check "No console.log statements in source" "ok"
else
  # Count lines
  COUNT=$(echo "$CONSOLE_LOGS" | wc -l | tr -d ' ')
  check "No console.log statements in source" "fail" "$COUNT occurrence(s) found — wrap in NODE_ENV check or remove"
fi

echo ""

# ── 7. db-init.js has production guard ───────────────────────────────────────
echo "── DB safety ──"
if [[ -f "scripts/db-init.js" ]]; then
  if grep -q "NODE_ENV.*production\|production.*NODE_ENV" scripts/db-init.js 2>/dev/null; then
    check "db-init.js has production environment guard" "ok"
  else
    check "db-init.js has production environment guard" "fail" \
      "Add: if (process.env.NODE_ENV === 'production') { process.exit(1) }"
  fi
fi

echo ""
echo "============================================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "============================================================"
echo ""

[[ "$FAIL" -eq 0 ]] || exit 1
