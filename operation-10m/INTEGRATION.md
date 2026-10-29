<<<<<<< HEAD
# Operation 10M — integration index

| Agent | Domain | Module root | V9.4 section |
|-------|--------|-------------|--------------|
| 13 | Energy / resources / environment | `operation-10m/agent-13-energy/` | 20AL |

Agent 25 merges module trees into `(V9.4) australia-game-with-ai.tsx` using per-agent `INTEGRATION.md` contracts.
=======
# Operation 10M — Integration contracts

**Canonical artifact:** `(V9.4) australia-game-with-ai.tsx` on branch `australia-game-upgrade`.

**Only Agent 25** (Build Integration / Release) may modify the canonical TSX, and only via the controlled assembly pipeline on integration branches (`op10m/agent-25-integration`, `op10m/integration/*`). Module workers must not edit the canonical file.

## Audited functional LOC

- **Metric:** cloc **code** lines, languages `TypeScript` + `TSX` only.
- **Tool:** `node scripts/measure-loc.mjs` (wraps `cloc@2.11.0`).
- **Baseline (2026-10-29):** 217,173 audited functional; 241,579 physical lines.
- **Gate:** 10,000,000 audited functional in the single self-contained TSX (no local module imports in the shipped artifact).

## Worker module layout

Each agent owns a directory under `operation-10m/modules/agent-NN-<slug>/`:

```
operation-10m/modules/agent-07-public-finance/
  module.manifest.json    # slot id, dependencies, content hash
  chunk.tsx               # TSX body only (no duplicate React import)
  tests.fixture.json      # optional save/replay fixtures for Agent 25 validation
```

### Module file rules

1. **No** top-level `import` from npm or local paths except types inlined in the chunk (the assembled file keeps **one** React import block in SECTION 1).
2. Wrap contributed code in markers:

```tsx
// OP10M_MODULE_BEGIN agent-07-public-finance
// ... exports and functions ...
// OP10M_MODULE_END agent-07-public-finance
```

3. Export names must be **globally unique** in the assembled file (assembly fails on collision).
4. Do not copy-paste existing canonical sections; extend via new symbols wired from SECTION 7+ hooks documented in your agent brief.
5. Register the module in `operation-10m/assembly/manifest.json` (Agent 25 merges manifest updates on integration branch only).

## Assembly slots

Insertion uses stable **section anchors** parsed from canonical comments (`// SECTION …`). Default expansion region for new national-system modules:

| Slot ID | Insert after section | Before section |
|---------|----------------------|----------------|
| `post-v10z` | `20Z: V10.7 DYNAMIC NATIONAL PRIORITIES` | `20AA: V10.8 REGIONAL COMPETITION` |
| `pre-final-export` | `21B: RELIABILITY UPGRADE` | `22: FINAL EXPORT` |
| `append-only-self-tests` | `21B: RELIABILITY UPGRADE` | `22: FINAL EXPORT` |

Custom slots require Agent 25 approval and a manifest schema update.

## Deterministic assembly (no double-count)

```bash
node operation-10m/assembly/assemble.mjs --dry-run
node operation-10m/assembly/assemble.mjs --out build/australia-game-assembled.tsx
```

Pipeline guarantees:

1. Modules sorted by `moduleId` in manifest (stable order).
2. Each module’s SHA-256 content hash recorded; **duplicate hash rejected**.
3. Canonical base read once; modules spliced at anchors; **no second paste** of the same `moduleId`.
4. Post-merge audits: `audit-duplication.mjs`, `validate-manifest.mjs`, `measure-loc.mjs`.

Agent 25 copies assembled output to canonical only after audits pass on `op10m/agent-25-integration`.

## Save / migration validation

Before promoting assembly:

```bash
node operation-10m/assembly/audit-save-migrations.mjs
```

Checks:

- Every `export function migrate*` in canonical has bounded complexity markers (returns typed result, no unbounded loops on raw save objects).
- Module manifests listing `touchesSaveFormat: true` must include a fixture under `tests.fixture.json`.
- Agent 25 runs fixture dry-runs (static parse + symbol presence) until a headless save harness lands.

## Conflict resolution

- Module workers branch: `op10m/agent-NN-<slug>` off `australia-game-upgrade`.
- Integration merges happen **only** on Agent 25 branches; conflicts in `operation-10m/modules/**` resolve in worker PRs; conflicts in canonical resolve only via re-assembly from manifest, never manual edits in worker PRs.

## Scale benchmarks

```bash
node operation-10m/assembly/benchmark-scale.mjs
```

Records read/hash/line-scan timings for the canonical file to track feasibility toward multi-million-line assembly.

## PR policy

No worker or coordinator **closes or triages** PRs. Agent 25 opens integration PRs ready for review; merges require explicit user authorization.

## Related paths

| Path | Purpose |
|------|---------|
| `scripts/measure-loc.mjs` | cloc gate measurement |
| `operation-10m/assembly/manifest.json` | module registry |
| `operation-10m/assembly/assemble.mjs` | deterministic merge |
| `operation-10m/assembly/audit-duplication.mjs` | baseline / CI duplication audit |
| Project store `internal/source-map/` | section map and ownership (Agent 25) |
>>>>>>> 456efb92205c558a33ca9d8851a1cb5c1a05e0e0
