# Agent 21 — Forecasting & Policy Laboratory

Non-authoritative strategic forecasts and **counterfactual policy forks** for the Australia Game Operation 10M program.

## Invariants

1. **No authoritative mutation** — `ag21VerifyIsolatedExperiment` fingerprints the live subject before/after; experiments run on deep copies.
2. **Provenance** — every experiment sets `authoritative: false` and `isolatedCopyVerified`.
3. **Uncertainty** — all player-facing strings include `(Non-authoritative forecast.)`.

## Layout

| File | Role |
|------|------|
| `isolation-core.ts` | Fingerprints, cloning, uncertainty labels |
| `counterfactual-experiments.ts` | Multi-branch counterfactual fork matrix |
| `scenario-catalog.ts` | 120+ exploratory scenario narratives |
| `strategic-forecast-policy-lab.tsx` | Policy experiments, bundle, self-tests, UI strip |
| `forecast-lab-depth.ts` | Multi-horizon projections, batch comparisons, bundle depth summaries |
| `forecast-depth-panel.tsx` | Depth dashboard strip |
| `scenario-comparison-ui.tsx` | Side-by-side scenario comparison strip |
| `tests/` | Node test runner coverage for modular slices |

## Tests

```bash
npm run test:ag21
npm run bundle:agent-21-chunk
```

Assembly-ready output: `operation-10m/modules/agent-21-forecasting/chunk.tsx` (`OP10M_MODULE_BEGIN agent-21-forecasting`).

Game-coupled self-tests (`runAg21StrategicForecastSelfTests`) execute inside canonical V9.4 after Agent 25 assembly.
