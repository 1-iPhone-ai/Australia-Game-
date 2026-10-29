# Agent 21 integration contract (Operation 10M)

## Anchor

- **Symbol:** `O10M_AGENT21_INTEGRATION_ANCHOR`
- **Canonical target:** `(V9.4) australia-game-with-ai.tsx` (existing inline block `SECTION 20AQ` from Operation 600K tranche 4)

## Module identity

- `O10M_AGENT21_MODULE_ID` = `forecasting_policy_lab`
- `O10M_AGENT21_MODULE_VERSION` = `1.7.0`

## Assembly chunk

- **Path:** `operation-10m/modules/agent-21-forecasting/chunk.tsx`
- **Markers:** `OP10M_MODULE_BEGIN agent-21-forecasting` … `OP10M_MODULE_END agent-21-forecasting`
- **Regenerate:** `npm run bundle:agent-21-chunk`
- **Manifest:** `operation-10m/modules/agent-21-forecasting/module.manifest.json`

## Primary exports (Agent 25 wiring)

| Export | Purpose |
|--------|---------|
| `runAg21StrategicForecastBundle` | Run balance/workforce/resilience + counterfactual experiments |
| `runAg21CounterfactualPolicyExperiment` | Counterfactual fork matrix on forecast context |
| `runAg21CounterfactualFork` | Generic counterfactual branches on arbitrary snapshots |
| `runAg21StrategicForecastSelfTests` | In-game self-test battery |
| `Ag21StrategicForecastLabStrip` | Dashboard UI strip (`data-testid="ag21-forecast-lab"`) |
| `AG21_FORECAST_SCENARIO_CATALOG` / `lookupAg21Scenario` | Scenario library |
| `evaluateAg21ForecastRun` / `compareAg21Scenarios` | Forecast evaluation metrics |
| `Ag21ScenarioComparisonStrip` | Scenario comparison UI (`data-testid="ag21-scenario-comparison"`) |
| `runAgent21ForecastingChunkSelfTests` | Bundled chunk smoke tests (Agent 25) |
| `buildAg21MultiHorizonProjection` / `runAg21ScenarioBatchComparison` | Multi-horizon ladder + batch scenario review |
| `summarizeAg21ForecastBundleDepth` / `runAg21CounterfactualStressLadder` | Bundle depth rollup + stress ladder |
| `Ag21ForecastDepthPanel` | Depth dashboard (`data-testid="ag21-forecast-depth-panel"`) |
| `runAg21PolicySensitivitySweep` / `buildAg21DomainStressMatrix` | Round 2 policy sensitivity + domain stress matrix |
| `appendAg21ForecastAuditEntry` / `summarizeAg21ForecastAuditLedger` | In-memory lab audit ledger |
| `Ag21ForecastRound2Console` | Round 2 UI (`data-testid="ag21-round2-console"`) |
| `buildAg21EnsembleProjection` / `measureAg21CalibrationDrift` | Round 3 ensemble bands + drift diagnostics |
| `fuseAg21ScenarioTrajectories` | Scenario trajectory fusion report |
| `Ag21ForecastRound3Console` | Round 3 UI (`data-testid="ag21-round3-console"`) |
| `runAg21EnsembleResidualBacktest` / `rankAg21PolicyRegret` | Round 4 residual backtest + policy regret ranking |
| `evaluateAg21ReliabilityGates` | Round 4 composite reliability gates |
| `Ag21ForecastRound4Console` | Round 4 UI (`data-testid="ag21-round4-console"`) |
| `measureAg21HorizonVolatility` / `buildAg21LeverAttributionReport` | Round 5 horizon volatility + lever attribution |
| `buildAg21SurfacingScorecard` | Round 5 composite surfacing scorecard |
| `Ag21ForecastRound5Console` | Round 5 UI (`data-testid="ag21-round5-console"`) |

## Upstream dependencies (canonical only)

- V9.1 balance lab: `runBalancePolicyMatrix`, `BalancePolicyId`, `BalancePolicyRow`
- V10.10 workforce: `createWorkforceFixture`, `computeNationalWorkforce`, `simulateWorkforceWhatIf`
- V10.6 systemic risk: `createSystemicRiskFixture`, `runSystemicStressTest`, `StrategicStressTest`
- Shared: `V9SelfTestResult`, React hooks

## Assembly notes

1. Inline module files at anchor (Agent 25 may flatten imports).
2. Register `runAg21StrategicForecastSelfTests` in the master dev self-test aggregator if not already present.
3. Mount `Ag21StrategicForecastLabStrip` in the strategic / AI dashboard region per UI map (Agent 22/23 coordination).
