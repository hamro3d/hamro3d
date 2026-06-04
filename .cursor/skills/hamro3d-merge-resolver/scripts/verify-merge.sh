#!/usr/bin/env bash
# verify-merge.sh
# Usage: bash .cursor/skills/hamro3d-merge-resolver/scripts/verify-merge.sh
# Run from the repository root after all conflict resolutions are applied.

set -uo pipefail

PASS=0
FAIL=0

check() {
  local label="$1"
  local result="$2"  # "ok" | "fail"
  local detail="${3:-}"
  if [[ "$result" == "ok" ]]; then
    echo "  ✓  $label"
    (( PASS++ )) || true
  else
    echo "  ✗  $label${detail:+: $detail}"
    (( FAIL++ )) || true
  fi
}

echo ""
echo "============================================================"
echo "  Hamro3D Post-Merge Verification"
echo "============================================================"
echo ""

# 1. No conflict markers remain
MARKER_FILES=$(grep -rl "<<<<<<< " --include="*.vue" --include="*.ts" \
  --include="*.css" --include="*.json" . \
  2>/dev/null | grep -v node_modules | grep -v ".git" || true)
if [[ -z "$MARKER_FILES" ]]; then
  check "No conflict markers remain" "ok"
else
  check "No conflict markers remain" "fail" "$MARKER_FILES"
fi

# 2. All H3d* components still exist (at least the core ones)
CORE_COMPONENTS=("H3dNavbar" "H3dButton" "H3dCard")
for comp in "${CORE_COMPONENTS[@]}"; do
  found=$(grep -rl "$comp" --include="*.vue" . 2>/dev/null | grep -v node_modules || true)
  if [[ -n "$found" ]]; then
    check "Component $comp referenced in codebase" "ok"
  else
    check "Component $comp referenced in codebase" "fail" "not found in any .vue file"
  fi
done

# 3. Tailwind h3d- tokens still in main.css
CSS_FILE="app/assets/css/main.css"
REQUIRED_TOKENS=("--h3d-base" "--h3d-accent" "--h3d-text" "--h3d-muted" "--h3d-border")
for token in "${REQUIRED_TOKENS[@]}"; do
  if [[ -f "$CSS_FILE" ]] && grep -q "$token" "$CSS_FILE"; then
    check "Token $token present in main.css" "ok"
  else
    check "Token $token present in main.css" "fail"
  fi
done

# 4. All pages still have useSeoMeta
PAGES_WITHOUT_SEO=$(grep -rL "useSeoMeta" app/pages/ --include="*.vue" 2>/dev/null || true)
if [[ -z "$PAGES_WITHOUT_SEO" ]]; then
  check "All pages have useSeoMeta" "ok"
else
  check "All pages have useSeoMeta" "fail" "$PAGES_WITHOUT_SEO"
fi

# 5. Mock data files export required lookup helpers
MOCK_FILES=$(find app/data -name "mock-*.ts" 2>/dev/null || true)
for f in $MOCK_FILES; do
  if grep -q "export function get" "$f"; then
    check "Mock file $f has lookup helper" "ok"
  else
    check "Mock file $f has lookup helper" "fail"
  fi
done

# 6. nuxt.config.ts has no duplicate module entries
if [[ -f "nuxt.config.ts" ]]; then
  DUP_MODULES=$(grep -oE "'@[^']+'" nuxt.config.ts | sort | uniq -d || true)
  if [[ -z "$DUP_MODULES" ]]; then
    check "nuxt.config.ts has no duplicate modules" "ok"
  else
    check "nuxt.config.ts has no duplicate modules" "fail" "$DUP_MODULES"
  fi
fi

# 7. package.json has no duplicate dependency keys (basic check)
if [[ -f "package.json" ]]; then
  DUP_DEPS=$(python3 -c "
import json, sys, collections
d = json.load(open('package.json'))
all_deps = list(d.get('dependencies', {}).keys()) + list(d.get('devDependencies', {}).keys())
counts = collections.Counter(all_deps)
dups = [k for k, v in counts.items() if v > 1]
print(' '.join(dups))
" 2>/dev/null || true)
  if [[ -z "$DUP_DEPS" ]]; then
    check "package.json has no duplicate dependency keys" "ok"
  else
    check "package.json has no duplicate dependency keys" "fail" "$DUP_DEPS"
  fi
fi

# 8. No console.log left in .ts or .vue files (except node_modules)
CONSOLE_LOGS=$(grep -rl "console\.log" --include="*.ts" --include="*.vue" . \
  2>/dev/null | grep -v node_modules || true)
if [[ -z "$CONSOLE_LOGS" ]]; then
  check "No console.log statements in source" "ok"
else
  check "No console.log statements in source" "fail" "$CONSOLE_LOGS"
fi

echo ""
echo "============================================================"
echo "  Results: $PASS passed, $FAIL failed"
echo "============================================================"
echo ""

if [[ "$FAIL" -gt 0 ]]; then
  exit 1
fi
