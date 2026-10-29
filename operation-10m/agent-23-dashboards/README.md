# Agent 23 — Dashboards, maps, and data visualization (Operation 10M)

Read-only national and regional dashboards sourced **only** from authoritative game state:

- **Living Regions 2.0** — regional economy, momentum history, needs, risks
- **V10 National Systems** — network utilization, bottlenecks, dependencies, resilience

No recomputation of LR/NS engines inside this module; snapshots and charts bind to existing state views.

## Layout

| Path | Role |
|------|------|
| `core/auth-snapshot.ts` | `nrDashBuildAuthSnapshot` |
| `core/heat-matrix.ts` | Region × network condition matrix |
| `core/region-map-model.ts` | Strategic SVG map nodes from snapshot + canonical positions |
| `ui/dashboard-modal.tsx` | Full-screen modal (overview, regions, networks, trends, map) |
| `tests/agent23-self-tests.ts` | Branch self-tests with fixtures |
| `verify/run.mts` | CI entrypoint |
| `merge/INTEGRATION.md` | Agent 25 splice order |

## Verify

```bash
npx tsx operation-10m/agent-23-dashboards/verify/run.mts
npm run bundle:agent-23-chunk
```

Assembly artifact: `operation-10m/modules/agent-23-dashboards/chunk.tsx` (`OP10M_MODULE_BEGIN agent-23-dashboards`).

Set `CANONICAL_SMOKE=0` to skip optional V9.4 export check pre-merge.

## Metrics policy

All displayed numbers are **state-derived**: fields already on `LivingRegionsWorldView`, `NationalSystemsState`, or `NationalSystemsWorldView.regionOwners`. Map node sizing uses momentum **history span** from LR state, not simulated futures.
