# Agent 09 scale wave — round 18 handoff (O10-166)

## Base / outcome

| Item | Value |
| --- | --- |
| Branch | `op10m/agent-09-population` |
| Base commit | `6ffc47b` — round 17 (retention-reliability, upskilling velocity, subject readiness, sustainment) |
| Round 18 subject | Sustainment–retention coupling, onboarding velocity, **subject** assembly continuity, workforce continuity index |
| Self-tests | **330** cases (`npm run test:agent09`) |
| Chunk lines | **10138** (`operation-10m/modules/agent-09-population/chunk.tsx`) |
| V9.4 / promote | **Out of scope** — do not edit `(V9.4) australia-game-with-ai.tsx` |

## What landed in round 18

1. **`sustainment-retention-coupling-brief.ts`** — sustainment index × retention-reliability coupling
2. **`onboarding-velocity-outlook.ts`** — onboarding levers × upskilling velocity outlook
3. **`subject-assembly-continuity-brief.ts`** — assembly-facing subject continuity (readiness × sustainment)
4. **`national-workforce-continuity-index.ts`** — capstone synthesizing sustainment-retention, onboarding, subject assembly
5. **Wire-up** — `compute.ts`, steward hints, GI topics, self-tests `R1801`–`R1816`
6. **Chunk** — `npm run build:agent09-chunk`

## Verify

From repo root:

```bash
npm run test:agent09
npm run build:agent09-chunk
npm run test:agent09
```

Expect: all tests pass; chunk markers `OP10M_MODULE_BEGIN/END agent-09-population` intact.

## Round 19 prep (not in scope)

- Continue scale wave on `op10m/agent-09-population` only; Agent 25 merges chunk when tranche allows.
- No V9.4 inline or promote flows on worker branches.

## Prior waves

- [agent-09-scale-wave-round17.md](./agent-09-scale-wave-round17.md)
