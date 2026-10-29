# Agent 21 integration contract (Operation 10M)

## Anchor

- **Symbol:** `O10M_AGENT21_INTEGRATION_ANCHOR`
- **Canonical target:** `(V9.4) australia-game-with-ai.tsx` (existing inline block `SECTION 20AQ` from Operation 600K tranche 4)

## Module identity

- `O10M_AGENT21_MODULE_ID` = `forecasting_policy_lab`
- `O10M_AGENT21_MODULE_VERSION` = `2.42.0`

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
| `syncAg21Wave28ProjectionBaseline` | Round 28 wave-28 projection sync tags (O10-187) |
| `handoffAg21IntegrationWave28OriginGate` | Round 28 origin handoff for O10-188 dry-run |
| `Ag21ForecastRound28Console` | Round 28 UI (`data-testid="ag21-round28-console"`) |
| `syncAg21Wave29ProjectionBaseline` | Round 29 wave-29 projection sync tags (O10-189) |
| `handoffAg21IntegrationWave29OriginGate` | Round 29 origin handoff for O10-190 dry-run |
| `Ag21ForecastRound29Console` | Round 29 UI (`data-testid="ag21-round29-console"`) |
| `syncAg21Wave30ProjectionBaseline` | Round 30 wave-30 projection sync tags (O10-191) |
| `handoffAg21IntegrationWave30OriginGate` | Round 30 origin handoff for O10-192 dry-run |
| `Ag21ForecastRound30Console` | Round 30 UI (`data-testid="ag21-round30-console"`) |
| `syncAg21Wave31ProjectionBaseline` | Round 31 wave-31 projection sync tags (O10-193) |
| `handoffAg21IntegrationWave31OriginGate` | Round 31 origin handoff for O10-194 dry-run |
| `Ag21ForecastRound31Console` | Round 31 UI (`data-testid="ag21-round31-console"`) |
| `syncAg21Wave32ProjectionBaseline` | Round 32 wave-32 projection sync tags (O10-195) |
| `handoffAg21IntegrationWave32OriginGate` | Round 32 origin handoff for O10-196 dry-run |
| `Ag21ForecastRound32Console` | Round 32 UI (`data-testid="ag21-round32-console"`) |
| `syncAg21Wave33ProjectionBaseline` | Round 33 wave-33 projection sync tags (O10-197) |
| `handoffAg21IntegrationWave33OriginGate` | Round 33 origin handoff for O10-198 dry-run |
| `Ag21ForecastRound33Console` | Round 33 UI (`data-testid="ag21-round33-console"`) |
| `syncAg21Wave34ProjectionBaseline` | Round 34 wave-34 projection sync tags (O10-199) |
| `handoffAg21IntegrationWave34OriginGate` | Round 34 origin handoff for O10-200 dry-run |
| `Ag21ForecastRound34Console` | Round 34 UI (`data-testid="ag21-round34-console"`) |
| `syncAg21Wave35ProjectionBaseline` | Round 35 wave-35 projection sync tags (O10-201) |
| `handoffAg21IntegrationWave35OriginGate` | Round 35 origin handoff for O10-202 dry-run |
| `Ag21ForecastRound35Console` | Round 35 UI (`data-testid="ag21-round35-console"`) |
| `syncAg21Wave36ProjectionBaseline` | Round 36 wave-36 projection sync tags (O10-203) |
| `handoffAg21IntegrationWave36OriginGate` | Round 36 origin handoff for O10-204 dry-run |
| `Ag21ForecastRound36Console` | Round 36 UI (`data-testid="ag21-round36-console"`) |
| `syncAg21Wave37ProjectionBaseline` | Round 37 wave-37 projection sync tags (O10-205) |
| `handoffAg21IntegrationWave37OriginGate` | Round 37 origin handoff for O10-206 dry-run |
| `Ag21ForecastRound37Console` | Round 37 UI (`data-testid="ag21-round37-console"`) |
| `syncAg21Wave38ProjectionBaseline` | Round 38 wave-38 projection sync tags (O10-207) |
| `handoffAg21IntegrationWave38OriginGate` | Round 38 origin handoff for O10-208 dry-run |
| `Ag21ForecastRound38Console` | Round 38 UI (`data-testid="ag21-round38-console"`) |
| `syncAg21Wave39ProjectionBaseline` | Round 39 wave-39 projection sync tags (O10-209) |
| `handoffAg21IntegrationWave39OriginGate` | Round 39 origin handoff for O10-210 dry-run |
| `Ag21ForecastRound39Console` | Round 39 UI (`data-testid="ag21-round39-console"`) |
| `syncAg21Wave40ProjectionBaseline` | Round 40 wave-40 projection sync tags (O10-211) |
| `handoffAg21IntegrationWave40OriginGate` | Round 40 origin handoff for O10-212 dry-run |
| `Ag21ForecastRound40Console` | Round 40 UI (`data-testid="ag21-round40-console"`) |
| `syncAg21Wave41ProjectionBaseline` | Round 41 wave-41 projection sync tags (O10-213) |
| `handoffAg21IntegrationWave41OriginGate` | Round 41 origin handoff for O10-214 dry-run |
| `Ag21ForecastRound41Console` | Round 41 UI (`data-testid="ag21-round41-console"`) |
| `syncAg21Wave42ProjectionBaseline` | Round 42 wave-42 projection sync tags (O10-215) |
| `handoffAg21IntegrationWave42OriginGate` | Round 42 origin handoff for O10-216 dry-run |
| `Ag21ForecastRound42Console` | Round 42 UI (`data-testid="ag21-round42-console"`) |
| `syncAg21Wave43ProjectionBaseline` | Round 43 wave-43 projection sync tags (O10-217) |
| `handoffAg21IntegrationWave43OriginGate` | Round 43 origin handoff for O10-218 dry-run |
| `Ag21ForecastRound43Console` | Round 43 UI (`data-testid="ag21-round43-console"`) |
| `syncAg21Wave44ProjectionBaseline` | Round 44 wave-44 projection sync tags (O10-219) |
| `handoffAg21IntegrationWave44OriginGate` | Round 44 origin handoff for O10-220 dry-run |
| `Ag21ForecastRound44Console` | Round 44 UI (`data-testid="ag21-round44-console"`) |
| `syncAg21Wave45ProjectionBaseline` | Round 45 wave-45 projection sync tags (O10-221) |
| `handoffAg21IntegrationWave45OriginGate` | Round 45 origin handoff for O10-222 dry-run |
| `Ag21ForecastRound45Console` | Round 45 UI (`data-testid="ag21-round45-console"`) |
| `syncAg21Wave46ProjectionBaseline` | Round 46 wave-46 projection sync tags (O10-223) |
| `handoffAg21IntegrationWave46OriginGate` | Round 46 origin handoff for O10-224 dry-run |
| `Ag21ForecastRound46Console` | Round 46 UI (`data-testid="ag21-round46-console"`) |
| `syncAg21Wave47ProjectionBaseline` | Round 47 wave-47 projection sync tags (O10-225) |
| `handoffAg21IntegrationWave47OriginGate` | Round 47 origin handoff for O10-226 dry-run |
| `Ag21ForecastRound47Console` | Round 47 UI (`data-testid="ag21-round47-console"`) |
| `syncAg21Wave48ProjectionBaseline` | Round 48 wave-48 projection sync tags (O10-227) |
| `handoffAg21IntegrationWave48OriginGate` | Round 48 origin handoff for O10-228 dry-run |
| `Ag21ForecastRound48Console` | Round 48 UI (`data-testid="ag21-round48-console"`) |
| `syncAg21Wave49ProjectionBaseline` | Round 49 wave-49 projection sync tags (O10-229) |
| `handoffAg21IntegrationWave49OriginGate` | Round 49 origin handoff for O10-230 dry-run |
| `Ag21ForecastRound49Console` | Round 49 UI (`data-testid="ag21-round49-console"`) |

## Upstream dependencies (canonical only)

- V9.1 balance lab: `runBalancePolicyMatrix`, `BalancePolicyId`, `BalancePolicyRow`
- V10.10 workforce: `createWorkforceFixture`, `computeNationalWorkforce`, `simulateWorkforceWhatIf`
- V10.6 systemic risk: `createSystemicRiskFixture`, `runSystemicStressTest`, `StrategicStressTest`
- Shared: `V9SelfTestResult`, React hooks

## Assembly notes

1. Inline module files at anchor (Agent 25 may flatten imports).
2. Register `runAg21StrategicForecastSelfTests` in the master dev self-test aggregator if not already present.
3. Mount `Ag21StrategicForecastLabStrip` in the strategic / AI dashboard region per UI map (Agent 22/23 coordination).
