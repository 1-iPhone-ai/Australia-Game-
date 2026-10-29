# Agent 09 scale wave — round 41 handoff (O10-213)

## Base / outcome

| Item | Value |
| --- | --- |
| Branch | `op10m/agent-09-population` |
| Base commit | `90e95b8` — wave **40** / round 40 advocacy stack |
| Origin (round 41 feat) | **`9225f05`** — pushed first |
| Wave baseline | **`875d6f3`** projected (O10-213) |
| Round **41** / wave **41** | Advocacy-inclusion coupling, inclusion equity, subject inclusion, workforce inclusion |
| Self-tests | **698** cases (`npm run test:agent09`) |
| Chunk lines | **21460** (`operation-10m/modules/agent-09-population/chunk.tsx`) |
| V9.4 / promote | **Out of scope** |

## What landed in round 41

1. **`advocacy-inclusion-coupling-brief.ts`**
2. **`inclusion-equity-outlook.ts`**
3. **`subject-inclusion-readiness-brief.ts`**
4. **`national-workforce-inclusion-index.ts`**
5. Wire-up — `compute.ts`, steward, GI, **R4101–R4116** (GI: `inclusion equity` no longer aliases `participation_equity`)
6. Chunk — `npm run build:agent09-chunk`

## Next stack anchor

- Capstone: **`nationalWorkforceInclusionIndex`**

## Verify

```bash
npm run test:agent09
npm run build:agent09-chunk
```

## Prior

- [agent-09-scale-wave-round40.md](./agent-09-scale-wave-round40.md)
