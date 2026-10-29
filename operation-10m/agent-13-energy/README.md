# Agent 13 — Energy, Resources & Environment (Operation 10M)

Modular **V10.14 SECTION 20AL** slice: extraction sites, renewable assets, environmental rules, grid coupling, climate-hazard pressure, and read-only household↔industry hints.

| Artifact | Path |
|----------|------|
| Agent 25 chunk | `chunk.tsx` (run `npm run build:agent-13-chunk`) |
| Core module | `modules/industrial-energy-environmental.tsx` |
| Grid coupling | `modules/grid-coupling.ts` |
| Grid recovery & extraction efficiency (slice 2) | `modules/grid-recovery-extraction-efficiency.ts` |
| Regional grid scenarios & climate transition (scale wave) | `modules/regional-grid-scenarios-climate-transition.ts` |
| Climate hazards | `modules/climate-hazards.ts` |
| Household links | `modules/household-industry-links.ts` |
| Generator (catalog) | `../../scripts/generate-v1014-agent13.py` |
| Integration | `INTEGRATION.md` |
| Self-tests | `tests/run-self-tests.mts` |

**Branch:** `op10m/agent-13-energy`

**Merge owner:** Agent 25 — inline before `// SECTION 21B:` as SECTION 20AL; strip `./` imports and type stubs.

**Tests:** `npm run test:agent-13`
