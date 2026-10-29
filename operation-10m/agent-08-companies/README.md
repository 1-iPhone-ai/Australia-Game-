# Agent 08 — Companies, Industries & Production

Operation 10M module root for **V10.14 private sector simulation**: regional firms, supply-chain exposure, production capacity signals, and **tax/labor overlay** links to V10.12 / V10.10.

## Layout

| Path | Role |
|------|------|
| `v1014-private-sector-core.tsx` | Firms, catalogs, supply chains, `computeNationalPrivateSector`, self-tests |
| `tax-labor-capacity-linkage.ts` | Read-only fiscal + workforce → capacity interpretation |
| `supply-chain-firm-depth.ts` | Firm supply profiles, regional depth, single-source hotspots |
| `sector-production-depth.ts` | Sector mix alignment (LR vs firms) + V10.1 capacity overload detection |
| `upstream-stubs.ts` | Standalone types until Agent 25 inline merge |
| `scripts/extract-from-v94.py` | Re-sync core slice from `(V9.4) australia-game-with-ai.tsx` SECTION 20AI |
| `tests/run-agent-08-tests.mts` | Node test runner |

## Tests

```bash
npm run test:agent08
```

## Assembly chunk (Agent 25)

```bash
npm run build:agent08-chunk
```

Output: `operation-10m/modules/agent-08-companies/chunk.tsx` (`OP10M_MODULE_BEGIN agent-08-companies`).

## Merge

See [INTEGRATION.md](./INTEGRATION.md). **Do not edit V9.4 on this branch.**
