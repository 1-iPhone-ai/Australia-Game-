# Agent 23 merge — National & regional dashboards / strategic map

## Splice order (Agent 25)

1. **Types** — ensure `NrDash*` / map types exist or merge from this tree’s `types.ts` into canonical section **O10-A23** (after Living Regions + National Systems type blocks).
2. **Constants** — `AGENT23_REGION_MAP_LAYOUT` must match canonical `REGIONS[].position` for COMM_REGION_CODES; do not duplicate divergent coordinates.
3. **Core** — `nrDashBuildAuthSnapshot`, `nrDashBuildHeatCells`, `nrDashBuildRegionMapNodes`, utilities.
4. **UI** — `NrDashSparkline`, `NrDashBarChart`, `NrDashHeatMatrix`, `RegionPositionMap`, `NationalRegionalDashboardModal`, tab panels.
5. **Self-tests** — export `runAgent23NationalRegionalDashboardSelfTests` into V9 regression registry (tier: full, section: System Regression).

## Wiring (GI / play shell)

- Open modal from tier-6 dashboard entry or Living Regions inspector action.
- Props: `turn`, `lrView`, `nsState`, `nsView`, optional `focusRegionId`, callbacks `onFocusRegion`, `onAsk`, `onMapNetwork`.
- `onMapNetwork` should reuse existing `NationalNetworkMapLinks` overlay (same network kind).

## Invariants

- **Read-only** — no writes to LR, NS, cash, inventory, or region control.
- **No synthetic metrics** — prohibited: random fills, hard-coded KPIs, or recomputing NS/LR inside dashboard code paths.
- **Provenance strip** must list LR/NS revision ids present on the passed views.

## Post-merge verification

```bash
npx tsx operation-10m/agent-23-dashboards/verify/run.mts
# Quick regression tier in canonical game should include agent 23 id when registered
```

Compare branch self-test ids with canonical export after merge (`nr_dash_*` / `a23_*` naming normalized in assembly).
