# Agent 21 integration contract (Operation 10M)

## Anchor

- **Symbol:** `O10M_AGENT21_INTEGRATION_ANCHOR`
- **Canonical target:** `(V9.4) australia-game-with-ai.tsx` (existing inline block `SECTION 20AQ` from Operation 600K tranche 4)

## Module identity

- `O10M_AGENT21_MODULE_ID` = `forecasting_policy_lab`
- `O10M_AGENT21_MODULE_VERSION` = `2.19.0`

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
| `measureAg21EnsembleConvergence` / `assembleAg21PlayerForecastBrief` | Round 6 convergence + player brief |
| `buildAg21LabPlaybook` | Round 6 operator playbook hints |
| `Ag21ForecastRound6Console` | Round 6 UI (`data-testid="ag21-round6-console"`) |
| `resolveAg21SurfaceDecision` / `collectAg21LabTelemetry` | Round 7 surface decision + lab telemetry rollup |
| `buildAg21CrosslinkPacket` | Round 7 dashboard crosslink handoff packet |
| `Ag21ForecastRound7Console` | Round 7 UI (`data-testid="ag21-round7-console"`) |
| `validateAg21CrosslinkHandoff` | Round 8 crosslink vs telemetry validation |
| `resolveAg21OperatorEscalation` | Round 8 operator escalation ladder |
| `buildAg21LabReplaySeed` | Round 8 replay seed for history modules |
| `Ag21ForecastRound8Console` | Round 8 UI (`data-testid="ag21-round8-console"`) |
| `assessAg21ReplayCoherence` | Round 9 replay seed vs validation coherence |
| `buildAg21EscalationRunbook` | Round 9 operator runbook steps from escalation tier |
| `buildAg21LabIntegrationHandoff` | Round 9 assembly handoff bundle for Agent 24/25 |
| `Ag21ForecastRound9Console` | Round 9 UI (`data-testid="ag21-round9-console"`) |
| `evaluateAg21HandoffReadiness` | Round 10 handoff readiness gate |
| `buildAg21OperatorSignoffRecord` | Round 10 operator signoff checklist |
| `buildAg21LabStagingPacket` | Round 10 pre-assembly staging packet |
| `Ag21ForecastRound10Console` | Round 10 UI (`data-testid="ag21-round10-console"`) |
| `verifyAg21StagingIntegrity` | Round 11 staging packet verification |
| `buildAg21ExportClearance` | Round 11 history export clearance |
| `summarizeAg21LabCycleCloseout` | Round 11 lab cycle closeout rollup |
| `Ag21ForecastRound11Console` | Round 11 UI (`data-testid="ag21-round11-console"`) |
| `attestAg21LabCloseout` | Round 12 closeout attestation |
| `buildAg21ExportManifest` | Round 12 history export manifest |
| `sealAg21LabArchiveRecord` | Round 12 archive seal |
| `Ag21ForecastRound12Console` | Round 12 UI (`data-testid="ag21-round12-console"`) |
| `confirmAg21ExportManifest` | Round 13 manifest confirmation |
| `buildAg21ArchiveAuditTrail` | Round 13 archive audit trail |
| `resolveAg21LabRetentionPolicy` | Round 13 retention disposition |
| `Ag21ForecastRound13Console` | Round 13 UI (`data-testid="ag21-round13-console"`) |
| `assessAg21RetentionCompliance` | Round 14 retention compliance |
| `rollupAg21ArchiveAuditSummary` | Round 14 audit rollup headline |
| `runAg21LabGovernanceCheckpoint` | Round 14 governance checkpoint |
| `Ag21ForecastRound14Console` | Round 14 UI (`data-testid="ag21-round14-console"`) |
| `buildAg21GovernanceRemediationPlan` | Round 15 governance remediation plan |
| `attestAg21OriginGateReadiness` | Round 15 origin gate attestation |
| `resolveAg21LabContinuityVerdict` | Round 15 lab continuity verdict |
| `Ag21ForecastRound15Console` | Round 15 UI (`data-testid="ag21-round15-console"`) |
| `evaluateAg21FullChunksDryRunReadiness` | Round 16 full-chunks dry-run readiness |
| `syncAg21Wave16ProjectionBaseline` | Round 16 wave-16 projection sync tags |
| `attestAg21IntegrationDryRunReadiness` | Round 16 integration dry-run attestation (O10-161) |
| `Ag21ForecastRound16Console` | Round 16 UI (`data-testid="ag21-round16-console"`) |
| `recordAg21FullChunksDryRunExecution` | Round 17 full-chunks dry-run execution record (O10-163) |
| `syncAg21Wave17ProjectionBaseline` | Round 17 wave-17 projection sync tags |
| `closeAg21IntegrationDryRunCycle` | Round 17 integration dry-run closure (O10-164 unblock) |
| `Ag21ForecastRound17Console` | Round 17 UI (`data-testid="ag21-round17-console"`) |
| `syncAg21Wave18ProjectionBaseline` | Round 18 wave-18 projection sync tags (O10-166) |
| `handoffAg21IntegrationWave18OriginGate` | Round 18 origin handoff for O10-167 dry-run |
| `Ag21ForecastRound18Console` | Round 18 UI (`data-testid="ag21-round18-console"`) |
| `syncAg21Wave19ProjectionBaseline` | Round 19 wave-19 projection sync tags (O10-168) |
| `handoffAg21IntegrationWave19OriginGate` | Round 19 origin handoff for O10-169 dry-run |
| `Ag21ForecastRound19Console` | Round 19 UI (`data-testid="ag21-round19-console"`) |
| `syncAg21Wave20ProjectionBaseline` | Round 20 wave-20 projection sync tags (O10-170) |
| `handoffAg21IntegrationWave20OriginGate` | Round 20 origin handoff for O10-171 dry-run |
| `Ag21ForecastRound20Console` | Round 20 UI (`data-testid="ag21-round20-console"`) |
| `syncAg21Wave21ProjectionBaseline` | Round 21 wave-21 projection sync tags (O10-173) |
| `handoffAg21IntegrationWave21OriginGate` | Round 21 origin handoff for O10-174 dry-run |
| `Ag21ForecastRound21Console` | Round 21 UI (`data-testid="ag21-round21-console"`) |
| `syncAg21Wave22ProjectionBaseline` | Round 22 wave-22 projection sync tags (O10-175) |
| `handoffAg21IntegrationWave22OriginGate` | Round 22 origin handoff for O10-176 dry-run |
| `Ag21ForecastRound22Console` | Round 22 UI (`data-testid="ag21-round22-console"`) |
| `syncAg21Wave23ProjectionBaseline` | Round 23 wave-23 projection sync tags (O10-177) |
| `handoffAg21IntegrationWave23OriginGate` | Round 23 origin handoff for O10-178 dry-run |
| `Ag21ForecastRound23Console` | Round 23 UI (`data-testid="ag21-round23-console"`) |
| `syncAg21Wave24ProjectionBaseline` | Round 24 wave-24 projection sync tags (O10-179) |
| `handoffAg21IntegrationWave24OriginGate` | Round 24 origin handoff for O10-180 dry-run |
| `Ag21ForecastRound24Console` | Round 24 UI (`data-testid="ag21-round24-console"`) |
| `syncAg21Wave25ProjectionBaseline` | Round 25 wave-25 projection sync tags (O10-181) |
| `handoffAg21IntegrationWave25OriginGate` | Round 25 origin handoff for O10-182 dry-run |
| `Ag21ForecastRound25Console` | Round 25 UI (`data-testid="ag21-round25-console"`) |
| `syncAg21Wave26ProjectionBaseline` | Round 26 wave-26 projection sync tags (O10-183) |
| `handoffAg21IntegrationWave26OriginGate` | Round 26 origin handoff for O10-184 dry-run |
| `Ag21ForecastRound26Console` | Round 26 UI (`data-testid="ag21-round26-console"`) |
| `syncAg21Wave27ProjectionBaseline` | Round 27 wave-27 projection sync tags (O10-185) |
| `handoffAg21IntegrationWave27OriginGate` | Round 27 origin handoff for O10-186 dry-run |
| `Ag21ForecastRound27Console` | Round 27 UI (`data-testid="ag21-round27-console"`) |

## Upstream dependencies (canonical only)

- V9.1 balance lab: `runBalancePolicyMatrix`, `BalancePolicyId`, `BalancePolicyRow`
- V10.10 workforce: `createWorkforceFixture`, `computeNationalWorkforce`, `simulateWorkforceWhatIf`
- V10.6 systemic risk: `createSystemicRiskFixture`, `runSystemicStressTest`, `StrategicStressTest`
- Shared: `V9SelfTestResult`, React hooks

## Assembly notes

1. Inline module files at anchor (Agent 25 may flatten imports).
2. Register `runAg21StrategicForecastSelfTests` in the master dev self-test aggregator if not already present.
3. Mount `Ag21StrategicForecastLabStrip` in the strategic / AI dashboard region per UI map (Agent 22/23 coordination).
