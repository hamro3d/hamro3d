#!/usr/bin/env bash
# analyze-conflict.sh
# Usage: bash analyze-conflict.sh <priority-branch> <secondary-branch>
# Prints a structured conflict analysis before any files are touched.

set -euo pipefail

PRIORITY="${1:-}"
SECONDARY="${2:-}"

if [[ -z "$PRIORITY" || -z "$SECONDARY" ]]; then
  echo "Usage: analyze-conflict.sh <priority-branch> <secondary-branch>" >&2
  exit 1
fi

MERGE_BASE=$(git merge-base "$PRIORITY" "$SECONDARY" 2>/dev/null || true)

echo "============================================================"
echo "  Hamro3D Merge Conflict Analyzer"
echo "  Priority  : $PRIORITY"
echo "  Secondary : $SECONDARY"
echo "  Merge base: ${MERGE_BASE:-(none — no common ancestor found)}"
echo "============================================================"
echo ""

# --- Files changed only in priority branch ---
echo "── Changed only in PRIORITY branch ($PRIORITY) ──"
if [[ -n "$MERGE_BASE" ]]; then
  git diff --name-only "$MERGE_BASE" "$PRIORITY" > /tmp/h3d_priority_files.txt
  git diff --name-only "$MERGE_BASE" "$SECONDARY" > /tmp/h3d_secondary_files.txt
  comm -23 <(sort /tmp/h3d_priority_files.txt) <(sort /tmp/h3d_secondary_files.txt) \
    | sed 's/^/  /' || echo "  (none)"
else
  git diff --name-only "$SECONDARY" "$PRIORITY" | sed 's/^/  /' || echo "  (none)"
fi
echo ""

# --- Files changed only in secondary branch ---
echo "── Changed only in SECONDARY branch ($SECONDARY) ──"
if [[ -n "$MERGE_BASE" ]]; then
  comm -13 <(sort /tmp/h3d_priority_files.txt) <(sort /tmp/h3d_secondary_files.txt) \
    | sed 's/^/  /' || echo "  (none)"
else
  echo "  (run with a shared ancestor for accurate diff)"
fi
echo ""

# --- Files changed in BOTH branches (potential conflicts) ---
echo "── Changed in BOTH branches (resolve carefully) ──"
if [[ -n "$MERGE_BASE" ]]; then
  comm -12 <(sort /tmp/h3d_priority_files.txt) <(sort /tmp/h3d_secondary_files.txt) \
    | sed 's/^/  /' || echo "  (none)"
fi
echo ""

# --- Current working-tree conflict markers (if merge already started) ---
echo "── Files currently containing conflict markers ──"
CONFLICTS=$(git diff --name-only --diff-filter=U 2>/dev/null || true)
if [[ -z "$CONFLICTS" ]]; then
  # Fallback: grep the working tree
  CONFLICTS=$(grep -rl "<<<<<<< " --include="*.vue" --include="*.ts" \
    --include="*.css" --include="*.json" --include="*.md" . \
    2>/dev/null | grep -v node_modules | grep -v ".git" | sort || true)
fi
if [[ -n "$CONFLICTS" ]]; then
  echo "$CONFLICTS" | sed 's/^/  /'
else
  echo "  (none — merge may not have started yet)"
fi
echo ""

# --- Commit summary: priority branch ---
echo "── Commits on PRIORITY ($PRIORITY) not on SECONDARY ──"
if [[ -n "$MERGE_BASE" ]]; then
  git log --oneline "$MERGE_BASE".."$PRIORITY" | head -20 | sed 's/^/  /'
else
  git log --oneline "$SECONDARY".."$PRIORITY" | head -20 | sed 's/^/  /'
fi
echo ""

# --- Commit summary: secondary branch ---
echo "── Commits on SECONDARY ($SECONDARY) not on PRIORITY ──"
if [[ -n "$MERGE_BASE" ]]; then
  git log --oneline "$MERGE_BASE".."$SECONDARY" | head -20 | sed 's/^/  /'
else
  git log --oneline "$PRIORITY".."$SECONDARY" | head -20 | sed 's/^/  /'
fi
echo ""

echo "============================================================"
echo "  Analysis complete. Review above before editing any file."
echo "============================================================"
