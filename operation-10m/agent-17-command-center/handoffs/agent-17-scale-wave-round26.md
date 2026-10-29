# Agent 17 — scale wave round 26 (O10-183)

Branch: `op10m/agent-17-command-center` · PR [#316](https://github.com/1-iPhone-ai/Australia-Game-/pull/316) open · no V9.4 · no promote.

Wave baseline: **`de3079f9`** · projected **1,563,481**. Integration gate **holdout** — **push-first** (wave 26 depth landed before full gate).

Round 25 parent on branch: **`c0008123`**.

## Implementation commit (origin)

| Field | Value |
|-------|-------|
| Subject | `feat(op10m): O10-183 scale wave round 26 throne depth` |
| SHA | **`a327dff1`** (`a327dff14c2875d6b3ded6ff6a172829fdde4459`) |

## Chunk

| Metric | Value |
|--------|------:|
| Round 25 baseline | 23881 lines |
| Round 26 | **25501** lines (`wc -l`) |
| Path | `operation-10m/modules/agent-17-command-center/chunk.tsx` |
| Regenerate | `npm run build:agent17-chunk` |

## Tests (`npm run test:agent17`)

| Harness | Result |
|---------|--------|
| Throne depth (new) | 71/71 |
| **Combined harness** | **625/625** |
| Goals `G17-001`–`G17-093` | **93/93** |
| Exit code | **0** |

## Round 26 additions

- `planning/throne-index.ts` — imperial/crown/coalition regalia, throne band
- `planning/dynasty-accord.ts` — throne + imperial seals, dynasty band
- `planningDepth`: `throneIndex`, `dynastyAccord`
- `imperialAccordBlocksThrone` on imperial accord
- Goals **G17-091**–**G17-093**
- Harness `run-throne-depth-tests.ts`

Project store mirror: `internal/operation-10m/agent-17-scale-wave-round26.md` (agent run store).

## Handoff document (this file)

| Field | Value |
|-------|-------|
| Commit | **`623b8496`** (`623b8496…` on `op10m/agent-17-command-center`) |
| Subject | `docs(op10m): O10-183 scale wave round 26 origin handoff` |
