#!/usr/bin/env bash
# verify-merge.sh  — run from repo root after resolving all conflicts
set -uo pipefail
PASS=0; FAIL=0
ok()   { echo "  ✔  $1"; ((PASS++)) || true; }
fail() { echo "  ✘  $1"; ((FAIL++)) || true; }

echo "============================================================"
echo "  Hamro3D — Post-Merge Verification"
echo "============================================================"

echo ""
echo "── 1. No leftover conflict markers ──"
CONFLICTS=$(grep -rn "<<<<<<< \|>>>>>>> " --include="*.vue" --include="*.ts" --include="*.css" --include="*.json" . --exclude-dir=node_modules --exclude-dir=.git 2>/dev/null | grep -v "Binary" | head -5)
if [[ -z "$CONFLICTS" ]]; then ok "No conflict markers found"; else fail "Conflict markers remain:$CONFLICTS"; fi

echo ""
echo "── 2. Core H3d components present ──"
for comp in H3dNavbar H3dProductCard H3dMemoryCard; do
  if find app/components -name "${comp}.vue" 2>/dev/null | grep -q .; then ok "$comp.vue"; else fail "$comp.vue missing"; fi
done

echo ""
echo "── 3. Tailwind h3d tokens defined ──"
if grep -rq "h3d-accent\|h3d-base\|h3d-text" tailwind.config.ts tailwind.config.js app/assets/css/ 2>/dev/null; then ok "h3d- tokens found in tailwind config / css"; else fail "h3d- tokens not found"; fi

echo ""
echo "── 4. SEO meta on key pages ──"
for page in app/pages/index.vue "app/pages/products/index.vue" "app/pages/products/[id].vue"; do
  if grep -q "useSeoMeta" "$page" 2>/dev/null; then ok "$page has useSeoMeta"; else fail "$page missing useSeoMeta"; fi
done

echo ""
echo "── 5. Real API in product pages (no mockProducts import) ──"
for page in "app/pages/products/index.vue" "app/pages/products/[id].vue"; do
  if grep -q "mockProducts\|getMockProductById" "$page" 2>/dev/null; then fail "$page still imports mock data"; else ok "$page uses real API"; fi
done

echo ""
echo "── 6. Admin routes intact ──"
for route in server/api/products server/api/categories server/api/orders server/api/auth; do
  if [ -d "$route" ]; then ok "$route/ present"; else fail "$route/ missing"; fi
done

echo ""
echo "── 7. No duplicate npm dependencies ──"
python3 -c "
import json
with open('package.json') as f: p = json.load(f)
deps = {**p.get('dependencies',{}), **p.get('devDependencies',{})}
dupes = [k for k in p.get('dependencies',{}) if k in p.get('devDependencies',{})]
if dupes: print('FAIL: duplicates:', dupes)
else: print('OK: no duplicates')
" 2>/dev/null | { read out; if [[ "$out" == OK* ]]; then ok "No duplicate deps"; else fail "$out"; fi; }

echo ""
echo "============================================================"
echo "  Results: ${PASS} passed, ${FAIL} failed"
echo "============================================================"
[[ $FAIL -eq 0 ]] && exit 0 || exit 1
