# Agent 09 scale wave — round 19 handoff (O10-168)

## Base / outcome

| Item | Value |
| --- | --- |
| Branch | `op10m/agent-09-population` |
| Base commit | `18b7e4a` — round 18 (sustainment-retention, onboarding, subject assembly, continuity) |
| Wave baseline | **`7bd7b1f3`** (O10-167 program anchor — not reset on worker branch) |
| Round 19 subject | Continuity–coordination coupling, reengagement momentum, subject wave assembly, durability index |
| Self-tests | **346** cases (`npm run test:agent09`) |
| Chunk lines | **10629** (`operation-10m/modules/agent-09-population/chunk.tsx`) |
| V9.4 / promote-tranche | **Out of scope** |

## What landed in round 19

1. **`continuity-coordination-coupling-brief.ts`** — workforce continuity × coordination levers
2. **`reengagement-momentum-outlook.ts`** — reengagement levers × onboarding velocity
3. **`subject-wave-assembly-brief.ts`** — subject wave assembly gate (subject continuity × workforce continuity)
4. **`national-workforce-durability-index.ts`** — capstone: coordination coupling + reengagement + subject wave
5. **Wire-up** — `compute.ts`, steward hints, GI topics, self-tests `R1901`–`R1916`
6. **Chunk** — `npm run build:agent09-chunk`

## Verify

```bash
npm run test:agent09
npm run build:agent09-chunk
npm run test:agent09
```

## Prior waves

- [agent-09-scale-wave-round18.md](./agent-09-scale-wave-round18.md)
