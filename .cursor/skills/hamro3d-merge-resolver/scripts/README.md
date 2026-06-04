# Merge Resolver Scripts

Two Bash utilities that support the `hamro3d-merge-resolver` skill. Run both
scripts from the **repository root** — never from inside the `scripts/` folder.

---

## `analyze-conflict.sh`

Pre-merge analysis tool. Maps every changed file across both branches and
summarises commit history **before** any file is touched.

### Usage

```bash
bash .cursor/skills/hamro3d-merge-resolver/scripts/analyze-conflict.sh \
  <priority-branch> <secondary-branch>
```

### Arguments

| Argument | Required | Description |
|----------|----------|-------------|
| `priority-branch` | Yes | The branch whose intent wins on any direct clash |
| `secondary-branch` | Yes | The branch being merged in |

### Example

```bash
bash .cursor/skills/hamro3d-merge-resolver/scripts/analyze-conflict.sh \
  feat/memories-page feat/navbar-revamp
```

### Output sections

| Section | What it shows |
|---------|--------------|
| **Merge base** | The common ancestor commit shared by both branches |
| **Changed only in priority branch** | Files safe to keep as-is — no secondary touch |
| **Changed only in secondary branch** | Files safe to apply from secondary — no priority touch |
| **Changed in both branches** | Files that need careful conflict resolution |
| **Files with active conflict markers** | Files already mid-merge with `<<<<<<<` markers |
| **Commits on priority not on secondary** | Up to 20 commits unique to the priority branch |
| **Commits on secondary not on priority** | Up to 20 commits unique to the secondary branch |

### How it works

1. Finds the merge base with `git merge-base`.
2. Diffs each branch against the merge base to produce two file lists.
3. Uses `comm` to split files into: priority-only, secondary-only, and shared.
4. Scans the working tree for live `<<<<<<<` conflict markers as a fallback
   if the merge has already started.
5. Prints commit summaries via `git log --oneline`.

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | Analysis completed successfully |
| `1` | Missing arguments |

> **Always run this script first.** The agent reads its full output before
> editing a single file.

---

## `verify-merge.sh`

Post-merge integrity checker. Runs eight automated checks across the
Hamro3D codebase to confirm no feature, token, or convention was lost
during conflict resolution.

### Usage

```bash
bash .cursor/skills/hamro3d-merge-resolver/scripts/verify-merge.sh
```

No arguments required. Always run from the repository root.

### Example

```bash
bash .cursor/skills/hamro3d-merge-resolver/scripts/verify-merge.sh
```

### Checks performed

| # | Check | What it looks for |
|---|-------|--------------------|
| 1 | **No conflict markers** | Scans `.vue`, `.ts`, `.css`, `.json` for leftover `<<<<<<<` markers |
| 2 | **Core H3d components** | Confirms `H3dNavbar`, `H3dButton`, `H3dCard` are still referenced in `.vue` files |
| 3 | **Tailwind tokens** | Confirms `--h3d-base`, `--h3d-accent`, `--h3d-text`, `--h3d-muted`, `--h3d-border` exist in `app/assets/css/main.css` |
| 4 | **SEO meta on all pages** | Checks every `.vue` in `app/pages/` for `useSeoMeta` |
| 5 | **Mock data lookup helpers** | Confirms every `app/data/mock-*.ts` exports a `get…` function |
| 6 | **No duplicate Nuxt modules** | Looks for repeated module strings in `nuxt.config.ts` |
| 7 | **No duplicate npm dependencies** | Uses Python to detect the same package in both `dependencies` and `devDependencies` in `package.json` |
| 8 | **No debug artifacts** | Scans `.ts` and `.vue` source files for `console.log` statements |

### Output format

Each check prints a pass or fail line:

```
  ✓  No conflict markers remain
  ✓  Component H3dNavbar referenced in codebase
  ✗  Token --h3d-accent present in main.css
  ...

  Results: 7 passed, 1 failed
```

### Exit codes

| Code | Meaning |
|------|---------|
| `0` | All checks passed — safe to commit |
| `1` | One or more checks failed — do not commit until resolved |

> **Run this after every conflict resolution session.** A non-zero exit code
> means the merge is not complete.

---

## Typical workflow

```bash
# 1. Analyse before merging
bash .cursor/skills/hamro3d-merge-resolver/scripts/analyze-conflict.sh \
  feat/memories-page feat/navbar-revamp

# 2. Start the merge (or let the agent resolve conflicts)
git merge feat/navbar-revamp

# 3. Verify after all conflicts are resolved
bash .cursor/skills/hamro3d-merge-resolver/scripts/verify-merge.sh

# 4. Commit only when verify-merge exits 0
git add -A && git commit -m "merge: combine feat/navbar-revamp into feat/memories-page"
```

---

## Requirements

- **Git** — available on `$PATH`
- **Bash 3.2+** — ships with macOS, pre-installed on Linux
- **Python 3** — used only by `verify-merge.sh` for the `package.json` duplicate check; gracefully skipped if unavailable
- Run from the **repository root** so all relative paths resolve correctly
