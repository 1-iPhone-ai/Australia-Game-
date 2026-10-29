# Agent 09 scale wave — round 17 handoff (O10-163)

## Base / outcome

| Item | Value |
| --- | --- |
| Branch | `op10m/agent-09-population` |
| Base commit | `4402625b` — round 16 (scheduling, seasonal swing, cohesion-corridor, reliability) |
| Round 17 subject | Retention–reliability coupling, upskilling velocity, **subject** workforce readiness, sustainment index |
| Self-tests | **314** cases (`npm run test:agent09`) |
| V9.4 / promote | **Out of scope** — do not edit `(V9.4) australia-game-with-ai.tsx` |

## What landed in round 17

1. **`retention-reliability-coupling-brief.ts`** — retention levers × workforce reliability index
2. **`upskilling-velocity-outlook.ts`** — upskilling program levers × skills tightness coherence
3. **`subject-workforce-readiness-brief.ts`** — assembly-facing subject readiness (retention coupling + integrated readiness)
4. **`national-workforce-sustainment-index.ts`** — capstone synthesizing reliability, upskilling velocity, subject readiness
5. **Wire-up** — `compute.ts`, steward hints, GI topics, self-tests `R1701`–`R1716`
6. **Chunk** — `npm run build:agent09-chunk` → `operation-10m/modules/agent-09-population/chunk.tsx`

## Verify

From repo root:

```bash
npm run test:agent09
npm run build:agent09-chunk
npm run test:agent09
```

Expect: all tests pass; chunk markers `OP10M_MODULE_BEGIN/END agent-09-population` intact.

## Round 18 prep (not in scope)

- Continue scale wave on `op10m/agent-09-population` only; Agent 25 merges chunk when tranche allows.
- No V9.4 inline or promote flows on worker branches.

## Commands reference

```bash
npm run test:agent09
npm run build:agent09-chunk
```
