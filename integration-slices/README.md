# Operation 600K — integration slices

Feature workers (Agents 01–24) land **self-contained TSX slices** here. Agent 25 inlines them into `(V9.4) australia-game-with-ai.tsx` (single runtime file).

## Agent 14 — V10.14 public services

| File | Purpose |
|------|---------|
| `agent-14-v1014-public-services-wellbeing.tsx` | Housing, healthcare, education measurable outcomes |
| `build-agent-14-v1014.mjs` | Regenerates the slice from structured catalogs |

**Merge anchor:** immediately before `SECTION 21B` in V9.4.

**Tests:** `runV1014PublicServicesWellbeingSelfTests()` (52 cases).

See Project store: `/cursor/stores/self/internal/agents/agent-14-integration-contract.md`.
