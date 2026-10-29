# Agent 21 integration contract (Operation 10M)

## Anchor

- **Symbol:** `O10M_AGENT21_INTEGRATION_ANCHOR`
- **Canonical target:** `(V9.4) australia-game-with-ai.tsx` (existing inline block `SECTION 20AQ` from Operation 600K tranche 4)

## Module identity

- `O10M_AGENT21_MODULE_ID` = `forecasting_policy_lab`
- `O10M_AGENT21_MODULE_VERSION` = `1.2.0`

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

## Upstream dependencies (canonical only)

- V9.1 balance lab: `runBalancePolicyMatrix`, `BalancePolicyId`, `BalancePolicyRow`
- V10.10 workforce: `createWorkforceFixture`, `computeNationalWorkforce`, `simulateWorkforceWhatIf`
- V10.6 systemic risk: `createSystemicRiskFixture`, `runSystemicStressTest`, `StrategicStressTest`
- Shared: `V9SelfTestResult`, React hooks

## Assembly notes

1. Inline module files at anchor (Agent 25 may flatten imports).
2. Register `runAg21StrategicForecastSelfTests` in the master dev self-test aggregator if not already present.
3. Mount `Ag21StrategicForecastLabStrip` in the strategic / AI dashboard region per UI map (Agent 22/23 coordination).
