# Agent 05 scale wave — round 17 handoff

## Base / outcome

| Item | Value |
| --- | --- |
| Branch | `op10m/agent-05-events` |
| Base commit | `5e58afdb` — round 16 @ **5640** chains |
| Round 17 target | **5960** chains in `chunk.tsx` / `module.manifest.json` |
| Bundle sha256 prefix | see `module.manifest.json` after `npm run bundle:agent05` |

## What landed in round 17

1. **Scale wave catalog commit coordinator** — `src/compute-turn-scale-wave-catalog-commit-coordinator.ts`
   - Flags: `op10m_scale_wave_catalog_commit`, `op10m_agent25_bundle_catalog_sealed`
   - Runs after scale-wave bundle latch on the compute-turn hook
   - Telemetry: `scaleWaveCatalogCommits`, `agent25BundleCatalogSealedPasses`
2. **Tranche 18 catalog** — 320 scale-wave-catalog-commit lattice chains (`op10m_t18_*`)
   - Generator: `scripts/generate-catalog-tranche18.py`
   - Output: `generated/chain-catalog-tranche18.ts`
3. **Aggregate + tests** — catalog stats and lattice tests updated to **5960** unique `chainId`s
4. **Agent 25 bundle** — `npm run bundle:agent05` refreshes `chunk.tsx` and manifest

## Verify

From repo root:

```bash
npm run test:agent05
npm run bundle:agent05
npm run test:agent05
```

Expect: all tests pass; `OP10M_AGENT05_CHAIN_CATALOG.length === 5960`; manifest `chainCount: 5960`.

## Round 18 prep (not in scope)

- Do **not** touch `(V9.4) australia-game-with-ai.tsx` or promote flows.
- Next scale wave likely adds tranche **19** (+320 → **6280**) with a coordinator gated on `scale_wave_catalog_commit` / `agent25_bundle_catalog_sealed`.

## Commands reference

```bash
python3 operation-10m/agent-05-events/scripts/generate-catalog-tranche18.py
npm run generate:agent05   # includes tranche18
npm run test:agent05
npm run bundle:agent05
```
