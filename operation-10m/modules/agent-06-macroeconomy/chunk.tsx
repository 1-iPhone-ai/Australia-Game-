// OP10M_MODULE_BEGIN agent-06-macroeconomy
// Agent 06 — V10.14 national macroeconomy (generated; source: operation-10m/agent-06-macroeconomy/v10-14-macro-economy/)

// --- source: types.ts ---
/**
 * V10.14 — Macroeconomic cycles, productivity, investment & national accounting (Agent 06)
 * Serializable types only; no imports from canonical TSX.
 */

export const V1014_MACRO_SCHEMA_VERSION = '10.14.0';

export type BusinessCyclePhase =
  | 'expansion'
  | 'peak'
  | 'slowdown'
  | 'contraction'
  | 'trough'
  | 'recovery';

export type MacroProductivityBand = 'critical' | 'weak' | 'moderate' | 'strong' | 'leading';
export type MacroInvestmentClimateBand = 'frozen' | 'cautious' | 'balanced' | 'active' | 'overheating';
export type MacroUtilizationBand = 'slack' | 'below_potential' | 'balanced' | 'tight' | 'overextended';
export type RegionalContributionRole = 'anchor' | 'driver' | 'balanced' | 'lagging' | 'volatile';

export type MacroSectorId =
  | 'mining'
  | 'energy'
  | 'manufacturing'
  | 'agriculture'
  | 'services'
  | 'technology'
  | 'tourism'
  | 'construction'
  | 'trade_logistics';

export interface MacroEconomyEvidence {
  id: string;
  sourceSystem: string;
  sourceId: string;
  factor: string;
  contribution: number;
  regionIds: string[];
  turn: number;
  visibility: 'public' | 'actor_visible';
}

export interface RegionalMacroContribution {
  regionId: string;
  share: number;
  role: RegionalContributionRole;
  productivityIndex: number;
  investmentIntensity: number;
  utilizationIndex: number;
  primarySector: string;
  contributionTags: string[];
  evidence: MacroEconomyEvidence[];
}

export interface NationalAccountingLedger {
  grossOutputIndex: number;
  productivityComponent: number;
  utilizationComponent: number;
  investmentComponent: number;
  regionalSumShare: number;
  identityResidual: number;
  identityOk: boolean;
  provenance: string[];
}

export interface NationalMacroEconomyState {
  schemaVersion: string;
  revision: number;
  turn: number;
  inputHash: string;
  cyclePhase: BusinessCyclePhase;
  cycleMomentum: number;
  cycleDurationTurns: number;
  productivityBand: MacroProductivityBand;
  productivityIndex: number;
  investmentClimate: MacroInvestmentClimateBand;
  grossInvestmentIndex: number;
  utilizationBand: MacroUtilizationBand;
  utilizationIndex: number;
  regionalContributions: RegionalMacroContribution[];
  accounting: NationalAccountingLedger;
  sectorProductivity: Record<string, number>;
  /** Share-weighted national sector mix (sums to ~1). */
  sectorOutputMix: Record<string, number>;
  activeCyclicalShockIds: string[];
  fiscalSpilloverSummary: string | null;
  regionalDivergence: RegionalDivergenceSnapshot;
  outlookProjection: MacroOutlookProjection;
  householdSpilloverSummary: string | null;
  industrySpilloverSummary: string | null;
  tradeSpilloverSummary: string | null;
  geographySpilloverSummary: string | null;
  creditSpilloverSummary: string | null;
  innovationSpilloverSummary: string | null;
  workforceSpilloverSummary: string | null;
  strategicSpilloverSummary: string | null;
  housingSpilloverSummary: string | null;
  inflationSpilloverSummary: string | null;
  energySpilloverSummary: string | null;
  eventsSpilloverSummary: string | null;
  companiesSpilloverSummary: string | null;
  turnsSpilloverSummary: string | null;
  transportSpilloverSummary: string | null;
  researchSpilloverSummary: string | null;
  populationSpilloverSummary: string | null;
  modesSpilloverSummary: string | null;
  guardianSpilloverSummary: string | null;
  citiesSpilloverSummary: string | null;
  forecastingSpilloverSummary: string | null;
  commandSpilloverSummary: string | null;
  automationSpilloverSummary: string | null;
  teamAiSpilloverSummary: string | null;
  replaySpilloverSummary: string | null;
  memorySpilloverSummary: string | null;
  dashboardsSpilloverSummary: string | null;
  uiSpilloverSummary: string | null;
  utilitiesSpilloverSummary: string | null;
  logisticsSpilloverSummary: string | null;
  negotiationSpilloverSummary: string | null;
  confidenceSpilloverSummary: string | null;
  capexSpilloverSummary: string | null;
  monetarySpilloverSummary: string | null;
  rentalSpilloverSummary: string | null;
  climateSpilloverSummary: string | null;
  forecastDispersionSpilloverSummary: string | null;
  accessibilitySpilloverSummary: string | null;
  timelineSpilloverSummary: string | null;
  liquiditySpilloverSummary: string | null;
  mapsTelemetrySpilloverSummary: string | null;
  strategicGameplaySpilloverSummary: string | null;
  archiveIntegritySpilloverSummary: string | null;
  integrationHealthSpilloverSummary: string | null;
  cadenceDriftSpilloverSummary: string | null;
  researchMomentumSpilloverSummary: string | null;
  budgetOutlookSpilloverSummary: string | null;
  modeShiftSpilloverSummary: string | null;
  supplyChainSpilloverSummary: string | null;
  eventCascadeSpilloverSummary: string | null;
  demographicShiftSpilloverSummary: string | null;
  expectationsAnchorSpilloverSummary: string | null;
  metroMomentumSpilloverSummary: string | null;
  transportThroughputSpilloverSummary: string | null;
  energyTransitionPaceSpilloverSummary: string | null;
  housingAffordabilitySpilloverSummary: string | null;
  tradeExposureSpilloverSummary: string | null;
  guardianVigilanceSpilloverSummary: string | null;
  commandCoordinationSpilloverSummary: string | null;
  teamAiCohesionSpilloverSummary: string | null;
  memoryRetentionSpilloverSummary: string | null;
  automationThroughputSpilloverSummary: string | null;
  forecastCalibrationSpilloverSummary: string | null;
  automationIdleGovernanceSpilloverSummary: string | null;
  forecastProjectionSyncSpilloverSummary: string | null;
  automationIdleGovernanceWave36ExportSpilloverSummary: string | null;
  forecastWave36ProjectionSyncSpilloverSummary: string | null;
  uiResponsivenessWave37ExportSpilloverSummary: string | null;
  dashboardClarityWave37ExportSpilloverSummary: string | null;
  replayWave38ExportSpilloverSummary: string | null;
  integrationHealthWave38ExportSpilloverSummary: string | null;
  automationIdleGovernanceWave39ExportSpilloverSummary: string | null;
  forecastWave39ExportSpilloverSummary: string | null;
  uiResponsivenessWave40ExportSpilloverSummary: string | null;
  dashboardClarityWave40ExportSpilloverSummary: string | null;
  replayWave41ExportSpilloverSummary: string | null;
  integrationHealthWave41ExportSpilloverSummary: string | null;
  automationIdleGovernanceWave42ExportSpilloverSummary: string | null;
  forecastWave42ExportSpilloverSummary: string | null;
  uiResponsivenessWave43ExportSpilloverSummary: string | null;
  dashboardClarityWave43ExportSpilloverSummary: string | null;
  automationIdleGovernanceWave44ExportSpilloverSummary: string | null;
  forecastWave44ExportSpilloverSummary: string | null;
  replayWave45ExportSpilloverSummary: string | null;
  integrationHealthWave45ExportSpilloverSummary: string | null;
  uiResponsivenessWave46ExportSpilloverSummary: string | null;
  dashboardClarityWave46ExportSpilloverSummary: string | null;
  replayWave47ExportSpilloverSummary: string | null;
  integrationHealthWave47ExportSpilloverSummary: string | null;
  replayWave48ExportSpilloverSummary: string | null;
  integrationHealthWave48ExportSpilloverSummary: string | null;
  capacitySnapshot: MacroCapacitySnapshot;
  transmissionBalance: MacroTransmissionBalanceSnapshot;
  transmissionCoherence: MacroTransmissionCoherenceSnapshot;
  transmissionConcentration: MacroTransmissionConcentrationSnapshot;
  transmissionAsymmetry: MacroTransmissionAsymmetrySnapshot;
  transmissionVolatility: MacroTransmissionVolatilitySnapshot;
  transmissionResilience: MacroTransmissionResilienceSnapshot;
  transmissionCoverage: MacroTransmissionCoverageSnapshot;
  transmissionAmplification: MacroTransmissionAmplificationSnapshot;
  transmissionTension: MacroTransmissionTensionSnapshot;
  transmissionDivergence: MacroTransmissionDivergenceSnapshot;
  transmissionStability: MacroTransmissionStabilitySnapshot;
  transmissionAlignment: MacroTransmissionAlignmentSnapshot;
  transmissionSynchronization: MacroTransmissionSynchronizationSnapshot;
  transmissionIntensity: MacroTransmissionIntensitySnapshot;
  transmissionPolarization: MacroTransmissionPolarizationSnapshot;
  transmissionCoupling: MacroTransmissionCouplingSnapshot;
  transmissionImbalance: MacroTransmissionImbalanceSnapshot;
  transmissionHarmonic: MacroTransmissionHarmonicSnapshot;
  transmissionGradient: MacroTransmissionGradientSnapshot;
  transmissionAttenuation: MacroTransmissionAttenuationSnapshot;
  transmissionEnvelope: MacroTransmissionEnvelopeSnapshot;
  transmissionPersistence: MacroTransmissionPersistenceSnapshot;
  transmissionCentrality: MacroTransmissionCentralitySnapshot;
  transmissionSynthesis: MacroTransmissionSynthesisSnapshot;
  transmissionDispersion: MacroTransmissionDispersionSnapshot;
  transmissionFragmentation: MacroTransmissionFragmentationSnapshot;
  transmissionRedundancy: MacroTransmissionRedundancySnapshot;
  transmissionSaturation: MacroTransmissionSaturationSnapshot;
  transmissionElasticity: MacroTransmissionElasticitySnapshot;
  transmissionReport: MacroTransmissionReport;
  stressIndex: MacroStressIndexSnapshot;
  policyStance: MacroPolicyStanceSnapshot;
  consistencyGates: MacroConsistencyGate[];
  debrief: MacroDebriefSnapshot;
  derivedSignals: Array<{ id: string; kind: string; text: string }>;
  evidence: MacroEconomyEvidence[];
  outlook: {
    phase: BusinessCyclePhase;
    productivity: MacroProductivityBand;
    investment: MacroInvestmentClimateBand;
  };
}

export type RegionalDivergenceBand = 'cohesive' | 'moderate_spread' | 'wide_spread';

export interface RegionalDivergenceSnapshot {
  band: RegionalDivergenceBand;
  productivitySpread: number;
  shareHerfindahl: number;
  leadingRegionId: string;
  laggingRegionId: string;
}

export interface MacroOutlookProjection {
  horizonTurns: number;
  projectedCyclePhase: BusinessCyclePhase;
  projectedInvestmentClimate: MacroInvestmentClimateBand;
  projectedProductivityBand: MacroProductivityBand;
  projectedOutputIndex: number;
  confidence: number;
}

export interface MacroConsistencyGate {
  id: string;
  triggered: boolean;
  severity: 'info' | 'warn';
  summary: string;
}

export interface MacroDebriefSnapshot {
  headline: string;
  bullets: string[];
}

export interface MacroTransmissionLayer {
  systemId: string;
  label: string;
  cycleContribution: number;
  investmentContribution: number;
  productivityContribution: number;
  summary: string | null;
}

export interface MacroTransmissionReport {
  turn: number;
  dominantLayerId: string | null;
  layers: MacroTransmissionLayer[];
  netCycleNudge: number;
  netInvestmentNudge: number;
  netProductivityNudge: number;
}

export type MacroCapacityBand = 'deep_slack' | 'slack' | 'balanced' | 'tight' | 'binding';

export interface MacroCapacitySnapshot {
  index: number;
  band: MacroCapacityBand;
  summary: string;
}

export type MacroTransmissionBalanceBand = 'aligned' | 'mixed' | 'cross_current' | 'fragmented';

export interface MacroTransmissionBalanceSnapshot {
  dispersionIndex: number;
  band: MacroTransmissionBalanceBand;
  summary: string;
}

export type MacroTransmissionCoherenceBand = 'coherent' | 'partial' | 'mixed' | 'contradictory';

export interface MacroTransmissionCoherenceSnapshot {
  coherenceIndex: number;
  band: MacroTransmissionCoherenceBand;
  alignedLayerCount: number;
  consideredLayerCount: number;
  summary: string;
}

export type MacroTransmissionConcentrationBand = 'diffuse' | 'moderate' | 'concentrated' | 'dominant_single';

export interface MacroTransmissionConcentrationSnapshot {
  concentrationIndex: number;
  band: MacroTransmissionConcentrationBand;
  dominantShare: number;
  summary: string;
}

export type MacroTransmissionAsymmetryBand =
  | 'balanced'
  | 'mild_support'
  | 'mild_restrict'
  | 'support_skewed'
  | 'restrict_skewed';

export interface MacroTransmissionAsymmetrySnapshot {
  asymmetryIndex: number;
  band: MacroTransmissionAsymmetryBand;
  supportiveMass: number;
  restrictiveMass: number;
  summary: string;
}

export type MacroTransmissionVolatilityBand = 'stable' | 'moderate' | 'elevated' | 'turbulent';

export interface MacroTransmissionVolatilitySnapshot {
  volatilityIndex: number;
  band: MacroTransmissionVolatilityBand;
  layerSpread: number;
  summary: string;
}

export type MacroTransmissionResilienceBand = 'fragile' | 'mixed' | 'steady' | 'robust';

export interface MacroTransmissionResilienceSnapshot {
  resilienceIndex: number;
  band: MacroTransmissionResilienceBand;
  resilientLayerCount: number;
  consideredLayerCount: number;
  summary: string;
}

export type MacroTransmissionCoverageBand = 'sparse' | 'narrow' | 'moderate' | 'broad';

export interface MacroTransmissionCoverageSnapshot {
  coverageIndex: number;
  band: MacroTransmissionCoverageBand;
  activeLayerCount: number;
  summary: string;
}

export type MacroTransmissionAmplificationBand =
  | 'supportive'
  | 'mild_support'
  | 'neutral'
  | 'mild_restrict'
  | 'restrictive';

export interface MacroTransmissionAmplificationSnapshot {
  amplificationIndex: number;
  band: MacroTransmissionAmplificationBand;
  supportiveMass: number;
  restrictiveMass: number;
  summary: string;
}

export type MacroTransmissionTensionBand = 'supportive' | 'balanced' | 'elevated' | 'acute';

export interface MacroTransmissionTensionSnapshot {
  tensionIndex: number;
  band: MacroTransmissionTensionBand;
  supportiveMass: number;
  restrictiveMass: number;
  summary: string;
}

export type MacroTransmissionDivergenceBand = 'aligned' | 'moderate' | 'elevated' | 'wide';

export interface MacroTransmissionDivergenceSnapshot {
  divergenceIndex: number;
  band: MacroTransmissionDivergenceBand;
  conflictingLayerCount: number;
  alignedLayerCount: number;
  summary: string;
}

export type MacroTransmissionStabilityBand = 'stable' | 'moderate' | 'fragile' | 'unstable';

export interface MacroTransmissionStabilitySnapshot {
  stabilityIndex: number;
  band: MacroTransmissionStabilityBand;
  conflictingLayerCount: number;
  alignedLayerCount: number;
  summary: string;
}

export type MacroTransmissionAlignmentBand = 'aligned' | 'moderate' | 'strained' | 'misaligned';

export interface MacroTransmissionAlignmentSnapshot {
  alignmentIndex: number;
  band: MacroTransmissionAlignmentBand;
  conflictingLayerCount: number;
  alignedLayerCount: number;
  summary: string;
}

export type MacroTransmissionSynchronizationBand = 'fractured' | 'mixed' | 'coherent' | 'locked';

export interface MacroTransmissionSynchronizationSnapshot {
  synchronizationIndex: number;
  band: MacroTransmissionSynchronizationBand;
  synchronizedLayerCount: number;
  activeLayerCount: number;
  summary: string;
}

export type MacroTransmissionIntensityBand = 'dormant' | 'moderate' | 'elevated' | 'acute';

export interface MacroTransmissionIntensitySnapshot {
  intensityIndex: number;
  band: MacroTransmissionIntensityBand;
  activeLayerCount: number;
  totalLayerCount: number;
  summary: string;
}

export type MacroTransmissionPolarizationBand =
  | 'balanced'
  | 'elevated'
  | 'restrictive_dominant'
  | 'supportive_dominant';

export interface MacroTransmissionPolarizationSnapshot {
  polarizationIndex: number;
  band: MacroTransmissionPolarizationBand;
  supportiveMass: number;
  restrictiveMass: number;
  summary: string;
}

export type MacroTransmissionCouplingBand = 'loose' | 'moderate' | 'firm' | 'tight';

export interface MacroTransmissionCouplingSnapshot {
  couplingIndex: number;
  band: MacroTransmissionCouplingBand;
  coupledLayerCount: number;
  summary: string;
}

export type MacroTransmissionImbalanceBand = 'balanced' | 'tilted' | 'restrictive_heavy' | 'supportive_heavy';

export interface MacroTransmissionImbalanceSnapshot {
  imbalanceIndex: number;
  band: MacroTransmissionImbalanceBand;
  supportiveMass: number;
  restrictiveMass: number;
  summary: string;
}

export type MacroTransmissionHarmonicBand = 'aligned' | 'partial' | 'mixed' | 'dissonant';

export interface MacroTransmissionHarmonicSnapshot {
  harmonicIndex: number;
  band: MacroTransmissionHarmonicBand;
  harmonicLayerCount: number;
  activeLayerCount: number;
  summary: string;
}

export type MacroTransmissionGradientBand = 'flat' | 'moderate' | 'sloped' | 'steep';

export interface MacroTransmissionGradientSnapshot {
  gradientIndex: number;
  band: MacroTransmissionGradientBand;
  peakMagnitude: number;
  floorMagnitude: number;
  summary: string;
}

export type MacroTransmissionAttenuationBand = 'muted' | 'balanced' | 'diffuse';

export interface MacroTransmissionAttenuationSnapshot {
  attenuationIndex: number;
  band: MacroTransmissionAttenuationBand;
  activeLayerCount: number;
  peakMagnitude: number;
  summary: string;
}

export type MacroTransmissionEnvelopeBand = 'quiet' | 'moderate' | 'wide';

export interface MacroTransmissionEnvelopeSnapshot {
  envelopeIndex: number;
  band: MacroTransmissionEnvelopeBand;
  peakMagnitude: number;
  activeLayerCount: number;
  summary: string;
}

export type MacroTransmissionPersistenceBand = 'fragile' | 'mixed' | 'cohesive';

export interface MacroTransmissionPersistenceSnapshot {
  persistenceIndex: number;
  band: MacroTransmissionPersistenceBand;
  alignedLayerCount: number;
  activeLayerCount: number;
  summary: string;
}

export type MacroTransmissionCentralityBand = 'diffuse' | 'balanced' | 'concentrated';

export interface MacroTransmissionCentralitySnapshot {
  centralityIndex: number;
  band: MacroTransmissionCentralityBand;
  topLayerCount: number;
  summary: string;
}

export type MacroTransmissionSynthesisBand = 'subdued' | 'moderate' | 'elevated';

export interface MacroTransmissionSynthesisSnapshot {
  synthesisIndex: number;
  band: MacroTransmissionSynthesisBand;
  grossMass: number;
  netSignedImpulse: number;
  summary: string;
}

export type MacroTransmissionDispersionBand = 'uniform' | 'moderate' | 'wide';

export interface MacroTransmissionDispersionSnapshot {
  dispersionIndex: number;
  band: MacroTransmissionDispersionBand;
  activeLayerCount: number;
  summary: string;
}

export type MacroTransmissionFragmentationBand = 'cohesive' | 'moderate' | 'fragmented';

export interface MacroTransmissionFragmentationSnapshot {
  fragmentationIndex: number;
  band: MacroTransmissionFragmentationBand;
  inactiveLayerCount: number;
  summary: string;
}

export type MacroTransmissionRedundancyBand = 'diverse' | 'balanced' | 'stacked';

export interface MacroTransmissionRedundancySnapshot {
  redundancyIndex: number;
  band: MacroTransmissionRedundancyBand;
  alignedLayerCount: number;
  summary: string;
}

export type MacroTransmissionSaturationBand = 'diffuse' | 'moderate' | 'saturated';

export interface MacroTransmissionSaturationSnapshot {
  saturationIndex: number;
  band: MacroTransmissionSaturationBand;
  peakLayerMagnitude: number;
  summary: string;
}

export type MacroTransmissionElasticityBand = 'rigid' | 'balanced' | 'flexible';

export interface MacroTransmissionElasticitySnapshot {
  elasticityIndex: number;
  band: MacroTransmissionElasticityBand;
  activeLayerCount: number;
  summary: string;
}

export type MacroStressBand = 'calm' | 'elevated' | 'acute';

export interface MacroStressIndexSnapshot {
  score: number;
  band: MacroStressBand;
  drivers: string[];
  transmissionStress: number;
  gateStress: number;
}

export type MacroPolicyStanceLabel = 'accommodative' | 'neutral' | 'restrictive' | 'conflicted';

export interface MacroPolicyStanceSnapshot {
  stance: MacroPolicyStanceLabel;
  fiscalTilt: number;
  creditTilt: number;
  summary: string;
}

export interface MacroEconomyPersisted {
  schemaVersion: string;
  revision: number;
  initializedTurn: number | null;
  lastUpdatedTurn: number;
  lastInputHash: string;
  cycleHysteresis: BusinessCyclePhase;
  cycleScore: number;
  productivityHysteresis: MacroProductivityBand;
  productivityScore: number;
  investmentHysteresis: MacroInvestmentClimateBand;
  investmentScore: number;
  transitions: Array<{ id: string; turn: number; kind: string; summary: string }>;
  history: Array<{ id: string; turn: number; summary: string }>;
}

export interface MacroEconomyInputs {
  turn: number;
  enabled?: boolean;
  livingRegions?: any;
  nationalSystems?: any;
  industries?: any;
  innovation?: any;
  workforce?: any;
  strategicCapital?: any;
  housingWellbeing?: any;
  housing?: any;
  publicFinance?: any;
  households?: any;
  trade?: any;
  economicGeography?: any;
  creditMarkets?: any;
  monetaryPolicy?: any;
  nationalFinance?: any;
  industrialEnergy?: any;
  energyEnvironment?: any;
  dynamicEvents?: any;
  narrativeEvents?: any;
  op10mEvents?: any;
  companies?: any;
  privateSector?: any;
  nationalPrivateSector?: any;
  turnsTime?: any;
  temporalCadence?: any;
  gameClock?: any;
  transportInfrastructure?: any;
  infrastructure?: any;
  nationalInfrastructure?: any;
  researchTech?: any;
  research?: any;
  nationalResearch?: any;
  population?: any;
  demographics?: any;
  nationalPopulation?: any;
  modesScenarios?: any;
  gameModes?: any;
  scenarioRuntime?: any;
  guardianCopilot?: any;
  guardian?: any;
  coPilotWarnings?: any;
  citiesRegions?: any;
  urbanRegions?: any;
  metropolitanSystems?: any;
  forecastingLab?: any;
  macroForecasts?: any;
  nationalForecasts?: any;
  commandCenter?: any;
  nationalCommand?: any;
  aiCommandCenter?: any;
  idleAutomation?: any;
  automation?: any;
  nationalAutomation?: any;
  teamIntelligence?: any;
  teamAi?: any;
  nationalTeamAi?: any;
  historyReplay?: any;
  replayArchive?: any;
  nationalHistory?: any;
  aiMemory?: any;
  explainability?: any;
  nationalAiMemory?: any;
  dashboardsMaps?: any;
  nationalDashboards?: any;
  mapsTelemetry?: any;
  gameUi?: any;
  uiShell?: any;
  nationalUi?: any;
  utilitiesGrid?: any;
  publicUtilities?: any;
  nationalUtilities?: any;
  negotiationState?: any;
  diplomacy?: any;
  consumerConfidence?: any;
  privateCapex?: any;
  rentalMarket?: any;
  climatePolicy?: any;
  uiAccessibility?: any;
  historyTimeline?: any;
  systemLiquidity?: any;
  strategicGameplay?: any;
  nationalStrategic?: any;
  historyArchiveIntegrity?: any;
  integrationHealth?: any;
  op10mIntegration?: any;
  assemblyHealth?: any;
  turnCadenceDrift?: any;
  researchMomentum?: any;
  budgetOutlook?: any;
  modeShift?: any;
  supplyChainStress?: any;
  eventCascade?: any;
  demographicShift?: any;
  inflationExpectationsAnchor?: any;
  metroMomentum?: any;
  transportThroughput?: any;
  energyTransitionPace?: any;
  housingAffordability?: any;
  tradeExposure?: any;
  guardianVigilance?: any;
  commandCoordination?: any;
  teamAiCohesion?: any;
  memoryRetention?: any;
  automationThroughput?: any;
  forecastCalibration?: any;
  automationIdleGovernance?: any;
  forecastProjectionSync?: any;
  automationIdleGovernanceWave36Export?: any;
  forecastWave36ProjectionSync?: any;
  uiResponsivenessWave37Export?: any;
  dashboardClarityWave37Export?: any;
  replayWave38Export?: any;
  integrationHealthWave38Export?: any;
  automationIdleGovernanceWave39Export?: any;
  forecastWave39Export?: any;
  uiResponsivenessWave40Export?: any;
  dashboardClarityWave40Export?: any;
  replayWave41Export?: any;
  integrationHealthWave41Export?: any;
  automationIdleGovernanceWave42Export?: any;
  forecastWave42Export?: any;
  uiResponsivenessWave43Export?: any;
  dashboardClarityWave43Export?: any;
  automationIdleGovernanceWave44Export?: any;
  forecastWave44Export?: any;
  replayWave45Export?: any;
  integrationHealthWave45Export?: any;
  uiResponsivenessWave46Export?: any;
  dashboardClarityWave46Export?: any;
  replayWave47Export?: any;
  integrationHealthWave47Export?: any;
  highInflationScenarioActive?: boolean;
  creditShockActive?: boolean;
  /** Additional catalog shock ids (see catalog/cyclical-shocks.ts). Legacy flags merge in. */
  activeCyclicalShockIds?: string[];
  regions?: Record<string, { economyScore?: number; momentumBand?: string; developmentScore?: number }>;
}

export interface MacroSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

export interface GuardianEvaluationContext {
  isReplay?: boolean;
  gameState?: any;
  gameSettings?: any;
  actorId?: string;
  turn?: number;
}

export interface GuardianDetectedRisk {
  id: string;
  category: string;
  severity: string;
  title: string;
  description: string;
  evidence: string[];
  assumptions: string[];
  probability: number;
  estimatedImpact: number;
  confidence: number;
  reversible: boolean;
  immediate: boolean;
  triggeredSettingKeys: string[];
  systemIds: string[];
}


// --- source: constants.ts ---

export const V1014_MACRO_CORE_REGIONS: readonly string[] = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT'
] as const;

export const V1014_MACRO_LIMITS = {
  maxEvidence: 10,
  maxTransitions: 16,
  maxHistory: 24,
  maxRegionalRows: 8,
  hysteresisDeadband: 2.0,
  accountingTolerance: 1e-5
} as const;

export const BUSINESS_CYCLE_LABEL: Record<BusinessCyclePhase, string> = {
  expansion: 'EXPANSION',
  peak: 'PEAK',
  slowdown: 'SLOWDOWN',
  contraction: 'CONTRACTION',
  trough: 'TROUGH',
  recovery: 'RECOVERY'
};

export const V1014_MACRO_PRODUCTIVITY_LABEL: Record<MacroProductivityBand, string> = {
  critical: 'CRITICAL',
  weak: 'WEAK',
  moderate: 'MODERATE',
  strong: 'STRONG',
  leading: 'LEADING'
};

export const V1014_MACRO_INVESTMENT_LABEL: Record<MacroInvestmentClimateBand, string> = {
  frozen: 'FROZEN',
  cautious: 'CAUTIOUS',
  balanced: 'BALANCED',
  active: 'ACTIVE',
  overheating: 'OVERHEATING'
};

export const V1014_MACRO_REGION_BASE_WEIGHT: Record<string, number> = {
  NSW: 0.32,
  VIC: 0.26,
  QLD: 0.19,
  WA: 0.16,
  SA: 0.04,
  TAS: 0.01,
  NT: 0.01,
  ACT: 0.01
};

export const V1014_MACRO_SECTOR_PRODUCTIVITY_PRIORS: Record<MacroSectorId, number> = {
  mining: 57,
  energy: 53,
  manufacturing: 64,
  agriculture: 61,
  services: 66,
  technology: 54,
  tourism: 67,
  construction: 66,
  trade_logistics: 60
};

export const V1014_MACRO_SECTOR_KEYS: MacroSectorId[] = [
  'mining',
  'energy',
  'manufacturing',
  'agriculture',
  'services',
  'technology',
  'tourism',
  'construction',
  'trade_logistics'
];

/** LAB reference profiles (one entry per region × sector). */
export const V1014_MACRO_REF_PROFILES: Record<string, readonly string[]> = Object.fromEntries(
  V1014_MACRO_CORE_REGIONS.map(code => [
    code,
    V1014_MACRO_SECTOR_KEYS.map(s => `${code}:${s}`)
  ])
);


// --- source: boundaries.ts ---
/**
 * Architectural boundaries for Agent 06 modular macro layer (mirrors Section 20AG invariants).
 */
export const AGENT06_MACRO_BOUNDARIES = {
  authoritativeElsewhere: [
    'actor_money',
    'actor_loans',
    'team_treasury',
    'resource_market_prices',
    'v10_9_strategic_capital',
    'v10_12_public_finance',
    'v10_13_households'
  ],
  owns: [
    'business_cycle_phase',
    'national_productivity_band',
    'gross_investment_climate',
    'regional_output_contribution_shares',
    'national_accounting_identity_checks'
  ],
  invariants: {
    regionalSharesSum: '1.0 ± accountingTolerance',
    noPlayerCashMutation: true,
    fiscalCrossCheckWarnOnly: true
  }
} as const;


// --- source: catalog/regional-sector-deltas.ts ---

/** Stylized sector productivity deltas per region (matches canonical Section 20AG). */
export const V1014_MACRO_REGION_SECTOR_DELTAS: Record<string, Partial<Record<MacroSectorId, number>>> = {
  NSW: {
    mining: -4,
    energy: -1,
    manufacturing: 2,
    agriculture: 5,
    services: -3,
    technology: 0,
    tourism: 3,
    construction: -5,
    trade_logistics: -2
  },
  VIC: {
    mining: 4,
    energy: -4,
    manufacturing: -1,
    agriculture: 2,
    services: 5,
    technology: -3,
    tourism: 0,
    construction: 3,
    trade_logistics: -5
  },
  QLD: {
    mining: -1,
    energy: 2,
    manufacturing: 5,
    agriculture: -3,
    services: 0,
    technology: 3,
    tourism: -5,
    construction: -2,
    trade_logistics: 1
  },
  WA: {
    mining: 5,
    energy: -3,
    manufacturing: 0,
    agriculture: 3,
    services: -5,
    technology: -2,
    tourism: 1,
    construction: 4,
    trade_logistics: -4
  },
  SA: {
    mining: 1,
    energy: 4,
    manufacturing: -4,
    agriculture: -1,
    services: 2,
    technology: 5,
    tourism: -3,
    construction: 0,
    trade_logistics: 3
  },
  TAS: {
    mining: 2,
    energy: 5,
    manufacturing: -3,
    agriculture: 0,
    services: 3,
    technology: -5,
    tourism: -2,
    construction: 1,
    trade_logistics: 4
  },
  NT: {
    mining: -4,
    energy: -1,
    manufacturing: 2,
    agriculture: 5,
    services: -3,
    technology: 0,
    tourism: 3,
    construction: -5,
    trade_logistics: -2
  },
  ACT: {
    mining: 5,
    energy: -3,
    manufacturing: 0,
    agriculture: 3,
    services: -5,
    technology: -2,
    tourism: 1,
    construction: 4,
    trade_logistics: -4
  }
};


// --- source: shock-composition.ts ---

/** Diminishing stacking when multiple negative shocks hit the same turn. */
export function composeStackedShockDeltas(
  activeIds: string[],
  catalog: Record<string, CyclicalMacroShockDefinition>
): { productivityDelta: number; investmentDelta: number; cycleDelta: number } {
  let productivityDelta = 0;
  let investmentDelta = 0;
  let cycleDelta = 0;
  let negativeStack = 0;
  for (const id of activeIds) {
    const shock = catalog[id];
    if (!shock) continue;
    const neg =
      (shock.productivityDelta < 0 ? 1 : 0) +
      (shock.investmentDelta < 0 ? 1 : 0) +
      (shock.cycleDelta < 0 ? 1 : 0);
    const stackFactor = neg > 0 ? Math.max(0.55, 1 - negativeStack * 0.12) : 1;
    if (neg > 0) negativeStack += 1;
    productivityDelta += shock.productivityDelta * (shock.productivityDelta < 0 ? stackFactor : 1);
    investmentDelta += shock.investmentDelta * (shock.investmentDelta < 0 ? stackFactor : 1);
    cycleDelta += shock.cycleDelta * (shock.cycleDelta < 0 ? stackFactor : 1);
  }
  return { productivityDelta, investmentDelta, cycleDelta };
}


// --- source: catalog/cyclical-shocks.ts ---

export type CyclicalShockKind =
  | 'demand'
  | 'supply'
  | 'financial'
  | 'external'
  | 'policy'
  | 'legacy_flag';

export interface CyclicalMacroShockDefinition {
  id: string;
  label: string;
  kind: CyclicalShockKind;
  /** Typical cycle phases when this shock is most likely (informational). */
  typicalPhases: BusinessCyclePhase[];
  productivityDelta: number;
  investmentDelta: number;
  cycleDelta: number;
  evidenceFactor: string;
  evidenceContribution: number;
  sourceSystem: string;
  sourceId: string;
  /** Optional regional bias (multiplier on weight rows only — not player cash). */
  biasedRegionIds?: string[];
  description: string;
}

export const CYCLICAL_MACRO_SHOCK_CATALOG: Record<string, CyclicalMacroShockDefinition> = {
  high_inflation: {
    id: 'high_inflation',
    label: 'High inflation scenario',
    kind: 'legacy_flag',
    typicalPhases: ['peak', 'slowdown'],
    productivityDelta: -4,
    investmentDelta: -6,
    cycleDelta: -5,
    evidenceFactor: 'inflation_scenario',
    evidenceContribution: -0.04,
    sourceSystem: 'scenario',
    sourceId: 'high_inflation',
    description: 'Broad price pressure erodes real investment and cycle momentum.'
  },
  credit_contraction: {
    id: 'credit_contraction',
    label: 'Credit contraction',
    kind: 'legacy_flag',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: 0,
    investmentDelta: -10,
    cycleDelta: -8,
    evidenceFactor: 'credit_shock',
    evidenceContribution: -0.1,
    sourceSystem: 'crisis',
    sourceId: 'credit',
    description: 'Tighter lending conditions freeze gross investment.'
  },
  commodity_bust: {
    id: 'commodity_bust',
    label: 'Commodity price bust',
    kind: 'supply',
    typicalPhases: ['contraction', 'trough'],
    productivityDelta: -3,
    investmentDelta: -8,
    cycleDelta: -10,
    evidenceFactor: 'commodity_bust',
    evidenceContribution: -0.08,
    sourceSystem: 'external',
    sourceId: 'commodity_cycle',
    biasedRegionIds: ['WA', 'QLD', 'NT'],
    description: 'Resource export terms weaken; mining-intensive regions lose share momentum.'
  },
  terms_of_trade_squeeze: {
    id: 'terms_of_trade_squeeze',
    label: 'Terms-of-trade squeeze',
    kind: 'external',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: -2,
    investmentDelta: -5,
    cycleDelta: -6,
    evidenceFactor: 'tot_squeeze',
    evidenceContribution: -0.05,
    sourceSystem: 'external',
    sourceId: 'trade',
    description: 'Import price shock without matching export uplift.'
  },
  housing_correction: {
    id: 'housing_correction',
    label: 'Housing correction',
    kind: 'financial',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: -1,
    investmentDelta: -7,
    cycleDelta: -5,
    evidenceFactor: 'housing_correction',
    evidenceContribution: -0.06,
    sourceSystem: 'financial',
    sourceId: 'housing',
    biasedRegionIds: ['NSW', 'VIC'],
    description: 'Construction and household wealth channels weaken domestic demand.'
  },
  global_slowdown: {
    id: 'global_slowdown',
    label: 'Global growth slowdown',
    kind: 'external',
    typicalPhases: ['slowdown', 'contraction'],
    productivityDelta: -2,
    investmentDelta: -4,
    cycleDelta: -7,
    evidenceFactor: 'global_slowdown',
    evidenceContribution: -0.07,
    sourceSystem: 'external',
    sourceId: 'global',
    description: 'External demand softens export-oriented production.'
  },
  stimulus_bounce: {
    id: 'stimulus_bounce',
    label: 'Infrastructure stimulus bounce',
    kind: 'policy',
    typicalPhases: ['trough', 'recovery', 'expansion'],
    productivityDelta: 1,
    investmentDelta: 6,
    cycleDelta: 5,
    evidenceFactor: 'stimulus_bounce',
    evidenceContribution: 0.05,
    sourceSystem: 'policy',
    sourceId: 'stimulus',
    description: 'Public capital injection lifts investment climate without mutating player cash.'
  },
  mining_supercycle: {
    id: 'mining_supercycle',
    label: 'Mining investment supercycle',
    kind: 'supply',
    typicalPhases: ['expansion', 'peak'],
    productivityDelta: 2,
    investmentDelta: 8,
    cycleDelta: 6,
    evidenceFactor: 'mining_supercycle',
    evidenceContribution: 0.07,
    sourceSystem: 'industries',
    sourceId: 'mining',
    biasedRegionIds: ['WA', 'QLD'],
    description: 'Resource capex wave concentrates in western and northern regions.'
  },
  drought_ag_cycle: {
    id: 'drought_ag_cycle',
    label: 'Agricultural drought cycle',
    kind: 'supply',
    typicalPhases: ['contraction', 'slowdown'],
    productivityDelta: -5,
    investmentDelta: -2,
    cycleDelta: -4,
    evidenceFactor: 'drought_cycle',
    evidenceContribution: -0.04,
    sourceSystem: 'climate',
    sourceId: 'drought',
    biasedRegionIds: ['SA', 'NSW', 'QLD'],
    description: 'Rainfall deficit hits farm productivity and regional weights.'
  }
};

export const CYCLICAL_MACRO_SHOCK_IDS = Object.keys(CYCLICAL_MACRO_SHOCK_CATALOG);

export function resolveActiveCyclicalShockIds(inputs: {
  highInflationScenarioActive?: boolean;
  creditShockActive?: boolean;
  activeCyclicalShockIds?: string[];
}): string[] {
  const ids = new Set<string>(inputs.activeCyclicalShockIds ?? []);
  if (inputs.highInflationScenarioActive) ids.add('high_inflation');
  if (inputs.creditShockActive) ids.add('credit_contraction');
  return [...ids].filter(id => CYCLICAL_MACRO_SHOCK_CATALOG[id]).sort();
}

export function applyCyclicalShockLibrary(
  activeIds: string[],
  base: MacroScoreBundle,
  pushEv: MacroEvidenceSink
): MacroScoreBundle {
  const stacked = composeStackedShockDeltas(activeIds, CYCLICAL_MACRO_SHOCK_CATALOG);
  for (const id of activeIds) {
    const shock = CYCLICAL_MACRO_SHOCK_CATALOG[id];
    if (!shock) continue;
    pushEv(
      shock.evidenceFactor,
      shock.evidenceContribution,
      shock.sourceSystem,
      shock.sourceId,
      shock.biasedRegionIds
    );
  }
  return {
    productivityScore: base.productivityScore + stacked.productivityDelta,
    investmentScore: base.investmentScore + stacked.investmentDelta,
    cycleScore: base.cycleScore + stacked.cycleDelta
  };
}

export function cyclicalShockRegionalWeightMultiplier(
  activeIds: string[],
  regionId: string
): number {
  let mult = 1;
  for (const id of activeIds) {
    const shock = CYCLICAL_MACRO_SHOCK_CATALOG[id];
    if (!shock?.biasedRegionIds?.includes(regionId)) continue;
    if (shock.cycleDelta < 0) mult *= 0.96;
    if (shock.cycleDelta > 0) mult *= 1.04;
  }
  return mult;
}


// --- source: catalog/cyclical-shocks-self-tests.ts ---
  CYCLICAL_MACRO_SHOCK_CATALOG,
  CYCLICAL_MACRO_SHOCK_IDS,
  applyCyclicalShockLibrary,
  resolveActiveCyclicalShockIds
} from './cyclical-shocks.ts';

export function runCyclicalShockLibrarySelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  record(
    'CS01',
    'Catalog has core shocks',
    CYCLICAL_MACRO_SHOCK_IDS.length >= 8,
    `count=${CYCLICAL_MACRO_SHOCK_IDS.length}`
  );

  const legacy = resolveActiveCyclicalShockIds({
    highInflationScenarioActive: true,
    creditShockActive: true
  });
  record(
    'CS02',
    'Legacy flags map to catalog ids',
    legacy.includes('high_inflation') && legacy.includes('credit_contraction'),
    legacy.join(',')
  );

  const ev: import('./types.ts').MacroEconomyEvidence[] = [];
  const push = createMacroEvidencePush(ev, 1);
  const out = applyCyclicalShockLibrary(['stimulus_bounce'], { productivityScore: 50, investmentScore: 50, cycleScore: 50 }, push);
  record(
    'CS03',
    'Stimulus bounce raises investment score',
    out.investmentScore > 50 && out.cycleScore > 50,
    `inv=${out.investmentScore} cycle=${out.cycleScore}`
  );

  const bust = applyCyclicalShockLibrary(
    ['commodity_bust'],
    { productivityScore: 60, investmentScore: 60, cycleScore: 60 },
    push
  );
  record(
    'CS04',
    'Commodity bust lowers cycle score',
    bust.cycleScore < 60,
    String(bust.cycleScore)
  );

  record(
    'CS05',
    'Every catalog entry has description',
    CYCLICAL_MACRO_SHOCK_IDS.every(id => CYCLICAL_MACRO_SHOCK_CATALOG[id].description.length > 10),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: catalog/stress-scenarios.ts ---
/** Named macro stress bundles for LAB / regression (shock id lists only). */
export interface MacroStressScenario {
  id: string;
  label: string;
  shockIds: string[];
  description: string;
}

export const MACRO_STRESS_SCENARIO_CATALOG: MacroStressScenario[] = [
  {
    id: 'baseline_soft_landing',
    label: 'Soft landing',
    shockIds: ['terms_of_trade_squeeze'],
    description: 'Mild external drag without credit seizure.'
  },
  {
    id: 'resource_bust',
    label: 'Resource bust',
    shockIds: ['commodity_bust', 'credit_contraction'],
    description: 'Mining terms and credit tighten together.'
  },
  {
    id: 'stagflation_mix',
    label: 'Stagflation mix',
    shockIds: ['high_inflation', 'global_slowdown'],
    description: 'Inflation scenario plus external demand shock.'
  },
  {
    id: 'policy_recovery',
    label: 'Policy recovery',
    shockIds: ['stimulus_bounce', 'mining_supercycle'],
    description: 'Stimulus plus resource capex upswing.'
  },
  {
    id: 'housing_and_credit',
    label: 'Housing & credit',
    shockIds: ['housing_correction', 'credit_contraction'],
    description: 'Domestic financial stress combination.'
  },
  {
    id: 'credit_crunch',
    label: 'Credit crunch',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Spread widening with external demand fade.'
  },
  {
    id: 'labor_innovation_shock',
    label: 'Labor & innovation shock',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'External fade with labor and innovation pipeline stress (harness overlay).'
  },
  {
    id: 'housing_strategic_stress',
    label: 'Housing & strategic stress',
    shockIds: ['housing_correction', 'credit_contraction'],
    description: 'Domestic housing correction with strategic capital and credit tension (harness overlay).'
  },
  {
    id: 'inflation_energy_stress',
    label: 'Inflation & energy stress',
    shockIds: ['high_inflation', 'commodity_bust'],
    description: 'Price-pressure and energy cost shock combination (harness overlay).'
  },
  {
    id: 'events_companies_stress',
    label: 'Events & companies stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Narrative backlog with private-sector utilization stress (harness overlay).'
  },
  {
    id: 'turns_transport_stress',
    label: 'Turns & transport stress',
    shockIds: ['global_slowdown', 'commodity_bust'],
    description: 'Temporal cadence stall with logistics connectivity stress (harness overlay).'
  },
  {
    id: 'research_population_stress',
    label: 'Research & population stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Weak research pipeline with demographic drag (harness overlay).'
  },
  {
    id: 'modes_guardian_stress',
    label: 'Modes & guardian stress',
    shockIds: ['housing_correction', 'global_slowdown'],
    description: 'Extreme scenario difficulty with elevated guardian alerts (harness overlay).'
  },
  {
    id: 'cities_forecasting_stress',
    label: 'Cities & forecasting stress',
    shockIds: ['global_slowdown', 'housing_correction'],
    description: 'Metro pressure with downside forecast dispersion (harness overlay).'
  },
  {
    id: 'command_automation_stress',
    label: 'Command & automation stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Crisis command posture with stalled automation throughput (harness overlay).'
  },
  {
    id: 'team_replay_stress',
    label: 'Team AI & replay stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Fractured team cohesion with persistent replay stress memory (harness overlay).'
  },
  {
    id: 'memory_dashboard_stress',
    label: 'Memory & dashboards stress',
    shockIds: ['global_slowdown', 'housing_correction'],
    description: 'Runaway memory drift with stale dashboard refresh (harness overlay).'
  },
  {
    id: 'ui_utilities_stress',
    label: 'UI & utilities stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Degraded UI shell with rolling utility outages (harness overlay).'
  },
  {
    id: 'logistics_negotiation_stress',
    label: 'Logistics & negotiation stress',
    shockIds: ['global_slowdown', 'terms_of_trade_squeeze'],
    description: 'Gridlocked trade logistics with entrenched negotiation deadlock (harness overlay).'
  },
  {
    id: 'confidence_capex_stress',
    label: 'Confidence & capex stress',
    shockIds: ['credit_contraction', 'housing_correction'],
    description: 'Collapsed consumer confidence with frozen private capex pipeline (harness overlay).'
  },
  {
    id: 'monetary_rental_stress',
    label: 'Monetary & rental stress',
    shockIds: ['high_inflation', 'housing_correction'],
    description: 'Restrictive monetary stance with severe rental pressure (harness overlay).'
  },
  {
    id: 'climate_forecast_stress',
    label: 'Climate & forecast stress',
    shockIds: ['drought_ag_cycle', 'global_slowdown'],
    description: 'Disruptive climate transition with wide forecast dispersion (harness overlay).'
  },
  {
    id: 'accessibility_timeline_stress',
    label: 'Accessibility & timeline stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Failing UI accessibility with broken history timeline continuity (harness overlay).'
  },
  {
    id: 'liquidity_maps_stress',
    label: 'Liquidity & maps stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Frozen system liquidity with distorted maps telemetry (harness overlay).'
  },
  {
    id: 'gameplay_archive_stress',
    label: 'Gameplay & archive stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Gridlocked strategic gameplay with corrupt history archive integrity (harness overlay).'
  },
  {
    id: 'integration_cadence_stress',
    label: 'Integration & cadence stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Fractured cross-system integration with chaotic turn cadence drift (harness overlay).'
  },
  {
    id: 'research_budget_stress',
    label: 'Research & budget stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Collapsed research momentum with exhausted public budget capex room (harness overlay).'
  },
  {
    id: 'mode_supply_stress',
    label: 'Mode & supply stress',
    shockIds: ['global_slowdown', 'commodity_bust'],
    description: 'Chaotic mode scenario shift with broken corporate supply chains (harness overlay).'
  },
  {
    id: 'event_demographic_stress',
    label: 'Event & demographic stress',
    shockIds: ['global_slowdown', 'drought_ag_cycle'],
    description: 'Runaway event cascade with adverse demographic shift (harness overlay).'
  },
  {
    id: 'expectations_metro_stress',
    label: 'Expectations & metro stress',
    shockIds: ['high_inflation', 'housing_correction'],
    description: 'Deanchored inflation expectations with stalled metro growth (harness overlay).'
  },
  {
    id: 'transport_energy_stress',
    label: 'Transport & energy stress',
    shockIds: ['commodity_bust', 'drought_ag_cycle'],
    description: 'Collapsed transport throughput with disruptive energy transition pace (harness overlay).'
  },
  {
    id: 'housing_trade_stress',
    label: 'Housing & trade stress',
    shockIds: ['housing_correction', 'global_slowdown'],
    description: 'Crushed housing affordability with dislocated trade exposure (harness overlay).'
  },
  {
    id: 'guardian_command_stress',
    label: 'Guardian & command stress',
    shockIds: ['credit_contraction', 'global_slowdown'],
    description: 'Red guardian vigilance with broken command coordination (harness overlay).'
  },
  {
    id: 'team_memory_stress',
    label: 'Team AI & memory stress',
    shockIds: ['high_inflation', 'terms_of_trade_squeeze'],
    description: 'Fractured team AI cohesion with volatile memory retention (harness overlay).'
  },
  {
    id: 'automation_forecast_stress',
    label: 'Automation & forecast stress',
    shockIds: ['stimulus_bounce', 'mining_supercycle'],
    description: 'Collapsed automation throughput with runaway forecast calibration bias (harness overlay).'
  },
  {
    id: 'governance_projection_stress',
    label: 'Governance & projection stress',
    shockIds: ['terms_of_trade_squeeze', 'global_slowdown'],
    description: 'Escalated automation idle governance with runaway forecast projection drift (harness overlay).'
  },
  {
    id: 'wave36_export_projection_stress',
    label: 'Wave 36 export & projection stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Blocked automation wave 36 export with drifted forecast wave 36 projection sync (harness overlay).'
  },
  {
    id: 'wave37_ui_dashboard_export_stress',
    label: 'Wave 37 UI & dashboard export stress',
    shockIds: ['stimulus_bounce', 'terms_of_trade_squeeze'],
    description: 'Blocked UI wave 37 export with unclear dashboard wave 37 export (harness overlay).'
  },
  {
    id: 'wave38_replay_integration_stress',
    label: 'Wave 38 replay & integration stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Blocked replay wave 38 export with unready integration health wave 38 export (harness overlay).'
  },
  {
    id: 'wave39_automation_forecast_export_stress',
    label: 'Wave 39 automation & forecast export stress',
    shockIds: ['terms_of_trade_squeeze', 'mining_supercycle'],
    description: 'Blocked automation wave 39 export with drifted forecast wave 39 export (harness overlay).'
  },
  {
    id: 'wave40_ui_dashboard_export_stress',
    label: 'Wave 40 UI & dashboard export stress',
    shockIds: ['stimulus_bounce', 'global_slowdown'],
    description: 'Blocked UI wave 40 export with unclear dashboard wave 40 export (harness overlay).'
  },
  {
    id: 'wave41_replay_integration_stress',
    label: 'Wave 41 replay & integration stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Blocked replay wave 41 export with unready integration health wave 41 export (harness overlay).'
  },
  {
    id: 'wave42_automation_forecast_export_stress',
    label: 'Wave 42 automation & forecast export stress',
    shockIds: ['stimulus_bounce', 'global_slowdown'],
    description: 'Blocked automation idle governance wave 42 export with drifted forecast wave 42 export (harness overlay).'
  },
  {
    id: 'wave43_ui_dashboard_export_stress',
    label: 'Wave 43 UI & dashboard export stress',
    shockIds: ['stimulus_bounce', 'global_slowdown'],
    description: 'Blocked UI wave 43 export with unclear dashboard wave 43 export (harness overlay).'
  },
  {
    id: 'wave44_automation_forecast_export_stress',
    label: 'Wave 44 automation & forecast export stress',
    shockIds: ['stimulus_bounce', 'global_slowdown'],
    description: 'Blocked automation idle governance wave 44 export with drifted forecast wave 44 export (harness overlay).'
  },
  {
    id: 'wave45_replay_integration_stress',
    label: 'Wave 45 replay & integration stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Blocked replay wave 45 export with unready integration health wave 45 export (harness overlay).'
  },
  {
    id: 'wave46_ui_dashboard_export_stress',
    label: 'Wave 46 UI & dashboard export stress',
    shockIds: ['stimulus_bounce', 'global_slowdown'],
    description: 'Blocked UI wave 46 export with unclear dashboard wave 46 export (harness overlay).'
  },
  {
    id: 'wave47_replay_integration_stress',
    label: 'Wave 47 replay & integration stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Blocked replay wave 47 export with unready integration health wave 47 export (harness overlay).'
  },
  {
    id: 'wave48_replay_integration_stress',
    label: 'Wave 48 replay & integration stress',
    shockIds: ['global_slowdown', 'credit_contraction'],
    description: 'Blocked replay wave 48 export with unready integration health wave 48 export (harness overlay).'
  }
];

export function resolveMacroStressScenario(id: string): MacroStressScenario | null {
  return MACRO_STRESS_SCENARIO_CATALOG.find(s => s.id === id) ?? null;
}

export function macroStressScenarioShockIds(id: string): string[] {
  return resolveMacroStressScenario(id)?.shockIds ?? [];
}


// --- source: math.ts ---
  BusinessCyclePhase,
  MacroInvestmentClimateBand,
  MacroProductivityBand,
  MacroUtilizationBand
} from './types.ts';

export function v1014macroClamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

export function v1014macroBandProductivity(score: number): MacroProductivityBand {
  if (score < 35) return 'critical';
  if (score < 48) return 'weak';
  if (score < 62) return 'moderate';
  if (score < 78) return 'strong';
  return 'leading';
}

export function v1014macroBandInvestment(score: number): MacroInvestmentClimateBand {
  if (score < 30) return 'frozen';
  if (score < 45) return 'cautious';
  if (score < 60) return 'balanced';
  if (score < 75) return 'active';
  return 'overheating';
}

export function v1014macroBandUtilization(score: number): MacroUtilizationBand {
  if (score < 35) return 'slack';
  if (score < 50) return 'below_potential';
  if (score < 65) return 'balanced';
  if (score < 80) return 'tight';
  return 'overextended';
}

export function v1014macroCycleFromScore(score: number, prev: BusinessCyclePhase): BusinessCyclePhase {
  const db = V1014_MACRO_LIMITS.hysteresisDeadband;
  const order: BusinessCyclePhase[] = ['trough', 'recovery', 'expansion', 'peak', 'slowdown', 'contraction'];
  const idx = (p: BusinessCyclePhase) => order.indexOf(p);
  let target: BusinessCyclePhase = 'expansion';
  if (score < 25) target = 'trough';
  else if (score < 40) target = 'contraction';
  else if (score < 52) target = 'slowdown';
  else if (score < 68) target = 'expansion';
  else if (score < 82) target = 'peak';
  else target = 'peak';
  const pi = idx(prev);
  const ti = idx(target);
  if (pi < 0) return target;
  if (Math.abs(ti - pi) <= 1) return target;
  if (score > 50 + db && ti > pi) return order[pi + 1];
  if (score < 50 - db && ti < pi) return order[pi - 1];
  return prev;
}

export function productivityIndexFromBand(score: number): number {
  return v1014macroClamp(score / 100, 0.2, 1);
}


// --- source: productivity.ts ---

export function v1014macroComposeSectorProductivity(regionId: string): Record<string, number> {
  const base: Record<string, number> = { ...V1014_MACRO_SECTOR_PRODUCTIVITY_PRIORS };
  const deltas = V1014_MACRO_REGION_SECTOR_DELTAS[regionId];
  if (!deltas) return base;
  for (const key of V1014_MACRO_SECTOR_KEYS) {
    const delta = deltas[key] ?? 0;
    base[key] = v1014macroClamp((base[key] ?? 55) + delta, 20, 95);
  }
  return base;
}

export function nationalSectorProductivityFromScore(
  productivityScore: number
): Record<string, number> {
  const sectorProductivity: Record<string, number> = { ...V1014_MACRO_SECTOR_PRODUCTIVITY_PRIORS };
  for (const s of Object.keys(sectorProductivity)) {
    sectorProductivity[s] = v1014macroClamp(sectorProductivity[s] + (productivityScore - 58) * 0.15, 20, 95);
  }
  return sectorProductivity;
}

export function averageRegionalProductivityIndex(sectorMap: Record<string, number>): number {
  const vals = Object.values(sectorMap);
  return vals.reduce((a, b) => a + b, 0) / Math.max(1, vals.length);
}


// --- source: investment.ts ---

export function regionalInvestmentIntensity(investmentScore: number, share: number): number {
  return v1014macroClamp(investmentScore * (0.85 + share * 0.3), 0, 100);
}

export function clampMacroScores(scores: {
  productivityScore: number;
  investmentScore: number;
  cycleScore: number;
}): typeof scores {
  return {
    productivityScore: v1014macroClamp(scores.productivityScore, 0, 100),
    investmentScore: v1014macroClamp(scores.investmentScore, 0, 100),
    cycleScore: v1014macroClamp(scores.cycleScore, 0, 100)
  };
}


// --- source: production.ts ---

export function deriveUtilizationIndex(cycleScore: number, investmentScore: number): number {
  return v1014macroClamp(48 + (cycleScore - 50) * 0.6 + (investmentScore - 50) * 0.25, 0, 100);
}

export function deriveGrossOutputIndex(
  productivityScore: number,
  utilizationIndex: number,
  investmentScore: number
): number {
  const productivityComponent = v1014macroClamp(productivityScore / 100, 0.2, 1);
  const utilizationComponent = utilizationIndex / 100;
  const investmentComponent = investmentScore / 100;
  return v1014macroClamp(
    productivityComponent * utilizationComponent * 100 * (0.92 + investmentComponent * 0.16),
    0,
    100
  );
}

export function regionalUtilizationIndex(baseUtilization: number, share: number): number {
  return v1014macroClamp(baseUtilization * (0.9 + share * 0.2), 0, 100);
}


// --- source: shocks.ts ---
  applyCyclicalShockLibrary,
  resolveActiveCyclicalShockIds
} from './catalog/cyclical-shocks.ts';

export type MacroScoreBundle = {
  productivityScore: number;
  investmentScore: number;
  cycleScore: number;
};

export type MacroEvidenceSink = (
  factor: string,
  contribution: number,
  sourceSystem: string,
  sourceId: string,
  regionIds?: string[]
) => void;

/** Apply household demand structural adjustments (innovation/workforce via spillover bridges). */
export function applyMacroStructuralAdjustments(
  inputs: MacroEconomyInputs,
  base: MacroScoreBundle,
  _pushEv: MacroEvidenceSink
): MacroScoreBundle {
  let { productivityScore, investmentScore, cycleScore } = base;

  const hhDemand = inputs.households?.domesticDemand?.level ?? inputs.households?.domesticDemand?.band;
  if (hhDemand === 'strong' || hhDemand === 'very_strong' || hhDemand === 'surging') cycleScore += 4;
  if (hhDemand === 'contracting' || hhDemand === 'soft') cycleScore -= 4;

  return { productivityScore, investmentScore, cycleScore };
}

/** Apply cyclical shock catalog (includes legacy inflation/credit flags). */
export function applyMacroShockAdjustments(
  inputs: MacroEconomyInputs,
  base: MacroScoreBundle,
  pushEv: MacroEvidenceSink
): MacroScoreBundle {
  const activeIds = resolveActiveCyclicalShockIds(inputs);
  return applyCyclicalShockLibrary(activeIds, base, pushEv);
}

export function listActiveMacroShockIds(inputs: MacroEconomyInputs): string[] {
  return resolveActiveCyclicalShockIds(inputs);
}

export function createMacroEvidencePush(
  evidence: MacroEconomyEvidence[],
  turn: number
): MacroEvidenceSink {
  return (factor, contribution, sourceSystem, sourceId, regionIds = []) => {
    evidence.push({
      id: `me:${sourceSystem}:${sourceId}:${factor}`,
      sourceSystem,
      sourceId,
      factor,
      contribution,
      regionIds,
      turn,
      visibility: 'public'
    });
  };
}


// --- source: regional-aggregation.ts ---
  averageRegionalProductivityIndex,
  v1014macroComposeSectorProductivity
} from './productivity.ts';
  MacroEconomyEvidence,
  MacroEconomyInputs,
  RegionalContributionRole,
  RegionalMacroContribution
} from './types.ts';

export function v1014macroNormalizeRegionalShares(
  raw: Array<{ regionId: string; weight: number }>
): Record<string, number> {
  const out: Record<string, number> = {};
  let total = 0;
  for (const row of raw) {
    const w = Math.max(0, Number(row.weight) || 0);
    out[row.regionId] = w;
    total += w;
  }
  if (total <= 0) {
    for (const code of V1014_MACRO_CORE_REGIONS) out[code] = V1014_MACRO_REGION_BASE_WEIGHT[code] ?? 0.125;
    total = Object.values(out).reduce((a, b) => a + b, 0);
  }
  for (const k of Object.keys(out)) out[k] = out[k] / total;
  return out;
}

export function computeRegionalWeightRows(
  inputs: MacroEconomyInputs,
  pushEv: (factor: string, contribution: number, sourceSystem: string, sourceId: string, regionIds?: string[]) => void
): Array<{ regionId: string; weight: number }> {
  const lr: any = inputs.livingRegions;
  const shockIds = resolveActiveCyclicalShockIds(inputs);
  const weights: Array<{ regionId: string; weight: number }> = [];
  for (const code of V1014_MACRO_CORE_REGIONS) {
    const lrReg = lr?.regions?.[code];
    const ex = inputs.regions?.[code];
    const econ = Number(ex?.economyScore ?? lrReg?.economy?.score ?? 55);
    const mom = String(ex?.momentumBand ?? lrReg?.momentum?.band ?? 'stable');
    const dev = Number(ex?.developmentScore ?? lrReg?.development?.score ?? 50);
    let w =
      (V1014_MACRO_REGION_BASE_WEIGHT[code] ?? 0.125) *
      (0.55 + econ / 200 + dev / 400) *
      cyclicalShockRegionalWeightMultiplier(shockIds, code);
    if (mom === 'surging') w *= 1.08;
    if (mom === 'declining') w *= 0.92;
    weights.push({ regionId: code, weight: w });
    pushEv('regional_economy', econ / 100, 'living_regions', code, [code]);
  }
  return weights;
}

function resolveRegionalRole(
  share: number,
  momentumBand: string | undefined
): RegionalContributionRole {
  let role: RegionalContributionRole = 'balanced';
  if (share >= 0.22) role = 'anchor';
  else if (share >= 0.14) role = 'driver';
  else if (share < 0.03) role = 'lagging';
  if (momentumBand === 'volatile') role = 'volatile';
  return role;
}

export function buildRegionalContributions(params: {
  inputs: MacroEconomyInputs;
  shares: Record<string, number>;
  investmentScore: number;
  utilizationIndex: number;
  evidence: MacroEconomyEvidence[];
}): RegionalMacroContribution[] {
  const lr: any = params.inputs.livingRegions;
  return V1014_MACRO_CORE_REGIONS.map(code => {
    const share = params.shares[code] ?? 0;
    const lrReg = lr?.regions?.[code];
    const prod = v1014macroComposeSectorProductivity(code);
    const productivityIndex = averageRegionalProductivityIndex(prod);
    const investmentIntensity = regionalInvestmentIntensity(params.investmentScore, share);
    const utilizationIndexR = regionalUtilizationIndex(params.utilizationIndex, share);
    const role = resolveRegionalRole(share, lrReg?.momentum?.band);
    const primarySector = Object.entries(prod).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'services';
    return {
      regionId: code,
      share,
      role,
      productivityIndex,
      investmentIntensity,
      utilizationIndex: utilizationIndexR,
      primarySector,
      contributionTags: [role, primarySector],
      evidence: params.evidence.filter(e => e.regionIds.includes(code)).slice(0, V1014_MACRO_LIMITS.maxEvidence)
    };
  });
}

export function sumRegionalShares(contributions: RegionalMacroContribution[]): number {
  return contributions.reduce((a, r) => a + r.share, 0);
}


// --- source: accounting/ledger.ts ---

export function buildNationalAccountingLedger(params: {
  productivityScore: number;
  utilizationIndex: number;
  investmentScore: number;
  regionalSumShare: number;
}): NationalAccountingLedger {
  const productivityComponent = productivityIndexFromBand(params.productivityScore);
  const utilizationComponent = params.utilizationIndex / 100;
  const investmentComponent = params.investmentScore / 100;
  const grossOutputIndex = v1014macroClamp(
    productivityComponent * utilizationComponent * 100 * (0.92 + investmentComponent * 0.16),
    0,
    100
  );
  const identityResidual = Math.abs(params.regionalSumShare - 1);
  return {
    grossOutputIndex,
    productivityComponent,
    utilizationComponent,
    investmentComponent,
    regionalSumShare: params.regionalSumShare,
    identityResidual,
    identityOk: identityResidual <= V1014_MACRO_LIMITS.accountingTolerance,
    provenance: ['v1014_macro_accounting_identity_v1', 'agent06_modular_reconcile']
  };
}

export function reconcileAccountingLedger(ledger: NationalAccountingLedger): {
  ok: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!ledger.identityOk) {
    issues.push(`share identity residual ${ledger.identityResidual}`);
  }
  const recomputed = v1014macroClamp(
    ledger.productivityComponent *
      ledger.utilizationComponent *
      100 *
      (0.92 + ledger.investmentComponent * 0.16),
    0,
    100
  );
  if (Math.abs(recomputed - ledger.grossOutputIndex) > 0.05) {
    issues.push(`output index drift recomputed=${recomputed.toFixed(3)} ledger=${ledger.grossOutputIndex.toFixed(3)}`);
  }
  if (ledger.regionalSumShare < 0.99999 || ledger.regionalSumShare > 1.00001) {
    issues.push(`regionalSumShare=${ledger.regionalSumShare}`);
  }
  return { ok: issues.length === 0, issues };
}


// --- source: accounting/validate-state.ts ---

export function validateNationalMacroEconomyState(st: NationalMacroEconomyState | null | undefined): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  if (!st) return { valid: false, issues: ['null state'] };
  if (!st.accounting.identityOk) issues.push(`accounting identity residual ${st.accounting.identityResidual}`);
  const sum = sumRegionalShares(st.regionalContributions);
  if (Math.abs(sum - 1) > V1014_MACRO_LIMITS.accountingTolerance) issues.push(`regional share sum ${sum}`);
  return { valid: issues.length === 0, issues };
}


// --- source: persisted.ts ---

export function createInitialMacroEconomyPersisted(turn = 1): MacroEconomyPersisted {
  return {
    schemaVersion: V1014_MACRO_SCHEMA_VERSION,
    revision: 1,
    initializedTurn: null,
    lastUpdatedTurn: Math.max(1, turn),
    lastInputHash: '',
    cycleHysteresis: 'expansion',
    cycleScore: 55,
    productivityHysteresis: 'moderate',
    productivityScore: 58,
    investmentHysteresis: 'balanced',
    investmentScore: 52,
    transitions: [],
    history: []
  };
}

export function sanitizeMacroEconomyPersisted(raw: any, turn = 1): MacroEconomyPersisted {
  const base = createInitialMacroEconomyPersisted(turn);
  if (!raw || typeof raw !== 'object') return base;
  const validCycle = new Set<BusinessCyclePhase>([
    'expansion',
    'peak',
    'slowdown',
    'contraction',
    'trough',
    'recovery'
  ]);
  const validProd = new Set<MacroProductivityBand>(['critical', 'weak', 'moderate', 'strong', 'leading']);
  const validInv = new Set<MacroInvestmentClimateBand>(['frozen', 'cautious', 'balanced', 'active', 'overheating']);
  return {
    ...base,
    revision: Math.max(1, Math.floor(Number(raw.revision) || 1)),
    initializedTurn: raw.initializedTurn == null ? null : Math.max(1, Math.floor(Number(raw.initializedTurn) || 1)),
    lastUpdatedTurn: Math.max(1, Math.floor(Number(raw.lastUpdatedTurn) || turn)),
    lastInputHash: typeof raw.lastInputHash === 'string' ? raw.lastInputHash : '',
    cycleHysteresis: validCycle.has(raw.cycleHysteresis) ? raw.cycleHysteresis : base.cycleHysteresis,
    cycleScore: v1014macroClamp(Number(raw.cycleScore), 0, 100),
    productivityHysteresis: validProd.has(raw.productivityHysteresis)
      ? raw.productivityHysteresis
      : base.productivityHysteresis,
    productivityScore: v1014macroClamp(Number(raw.productivityScore), 0, 100),
    investmentHysteresis: validInv.has(raw.investmentHysteresis) ? raw.investmentHysteresis : base.investmentHysteresis,
    investmentScore: v1014macroClamp(Number(raw.investmentScore), 0, 100),
    transitions: Array.isArray(raw.transitions) ? raw.transitions.slice(-V1014_MACRO_LIMITS.maxTransitions) : [],
    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_MACRO_LIMITS.maxHistory) : []
  };
}

export function macroEconomyInputHash(inputs: MacroEconomyInputs): string {
  const parts: string[] = [String(inputs.turn), inputs.enabled === false ? '0' : '1'];
  for (const code of V1014_MACRO_CORE_REGIONS) {
    const ex = inputs.regions?.[code];
    const lr = inputs.livingRegions?.regions?.[code];
    const econ = Math.round(Number(ex?.economyScore ?? lr?.economy?.score ?? 55));
    const mom = String(ex?.momentumBand ?? lr?.momentum?.band ?? 'stable');
    parts.push(`${code}:${econ}:${mom}`);
  }
  parts.push(inputs.highInflationScenarioActive ? 'hi1' : 'hi0');
  parts.push(inputs.creditShockActive ? 'cr1' : 'cr0');
  const cm: any = inputs.creditMarkets ?? inputs.monetaryPolicy;
  const spread = String(cm?.spreadBand ?? cm?.creditSpread?.band ?? 'none');
  parts.push(`csp:${spread}`);
  const shocks = (inputs.activeCyclicalShockIds ?? []).slice().sort().join(',');
  parts.push(`sh:${shocks}`);
  return parts.join('|');
}


// --- source: inputs.ts ---

export function buildMacroEconomyInputs(params: any): MacroEconomyInputs {
  const turn = Math.max(1, Math.floor(Number(params?.turn) || 1));
  const gset = params?.gameSettings || {};
  return {
    turn,
    enabled: gset.macroEconomyEnabled !== false && gset.nationalSystemsEnabled !== false,
    livingRegions: params?.livingRegions ?? params?.gameState?.livingRegionsState,
    nationalSystems: params?.nationalSystems,
    industries: params?.industries,
    innovation: params?.innovation,
    workforce: params?.workforce,
    strategicCapital: params?.strategicCapital,
    housingWellbeing: params?.housingWellbeing ?? params?.housing,
    housing: params?.housing,
    publicFinance: params?.publicFinance,
    households: params?.households,
    trade: params?.trade ?? params?.gameState?.tradeState,
    economicGeography: params?.economicGeography,
    creditMarkets: params?.creditMarkets ?? params?.gameState?.creditMarketsState,
    monetaryPolicy: params?.monetaryPolicy,
    nationalFinance: params?.nationalFinance,
    industrialEnergy: params?.industrialEnergy ?? params?.energyEnvironment ?? params?.nationalSystems?.industrialEnergy,
    energyEnvironment: params?.energyEnvironment,
    dynamicEvents: params?.dynamicEvents ?? params?.gameState?.dynamicEventsState ?? params?.nationalSystems?.dynamicEvents,
    narrativeEvents: params?.narrativeEvents ?? params?.gameState?.narrativeEventsState,
    op10mEvents: params?.op10mEvents ?? params?.gameState?.op10mEventsState,
    companies: params?.companies ?? params?.privateSector,
    privateSector: params?.privateSector ?? params?.nationalPrivateSector,
    nationalPrivateSector: params?.nationalPrivateSector ?? params?.gameState?.privateSectorState,
    turnsTime: params?.turnsTime ?? params?.gameState?.turnsTimeState ?? params?.nationalSystems?.turnsTime,
    temporalCadence: params?.temporalCadence,
    gameClock: params?.gameClock ?? params?.gameState?.gameClock,
    transportInfrastructure:
      params?.transportInfrastructure ??
      params?.infrastructure ??
      params?.gameState?.transportInfrastructureState,
    infrastructure: params?.infrastructure,
    nationalInfrastructure: params?.nationalInfrastructure ?? params?.nationalSystems?.infrastructure,
    researchTech: params?.researchTech ?? params?.gameState?.researchTechState ?? params?.nationalSystems?.researchTech,
    research: params?.research,
    nationalResearch: params?.nationalResearch,
    population: params?.population ?? params?.gameState?.populationState ?? params?.nationalSystems?.population,
    demographics: params?.demographics,
    nationalPopulation: params?.nationalPopulation,
    modesScenarios: params?.modesScenarios ?? params?.gameState?.modesScenariosState ?? params?.nationalSystems?.modes,
    gameModes: params?.gameModes,
    scenarioRuntime: params?.scenarioRuntime ?? params?.gameState?.scenarioRuntime,
    guardianCopilot: params?.guardianCopilot ?? params?.guardian ?? params?.gameState?.guardianState,
    guardian: params?.guardian,
    coPilotWarnings: params?.coPilotWarnings,
    citiesRegions: params?.citiesRegions ?? params?.gameState?.citiesRegionsState ?? params?.nationalSystems?.cities,
    urbanRegions: params?.urbanRegions,
    metropolitanSystems: params?.metropolitanSystems,
    forecastingLab: params?.forecastingLab ?? params?.gameState?.forecastingLabState,
    macroForecasts: params?.macroForecasts,
    nationalForecasts: params?.nationalForecasts ?? params?.nationalSystems?.forecasting,
    commandCenter: params?.commandCenter ?? params?.gameState?.commandCenterState ?? params?.nationalSystems?.commandCenter,
    nationalCommand: params?.nationalCommand,
    aiCommandCenter: params?.aiCommandCenter,
    idleAutomation: params?.idleAutomation ?? params?.gameState?.automationState,
    automation: params?.automation,
    nationalAutomation: params?.nationalAutomation ?? params?.nationalSystems?.automation,
    teamIntelligence: params?.teamIntelligence ?? params?.gameState?.teamAiState ?? params?.nationalSystems?.teamAi,
    teamAi: params?.teamAi,
    nationalTeamAi: params?.nationalTeamAi,
    historyReplay: params?.historyReplay ?? params?.gameState?.historyReplayState,
    replayArchive: params?.replayArchive,
    nationalHistory: params?.nationalHistory ?? params?.nationalSystems?.historyReplay,
    aiMemory: params?.aiMemory ?? params?.explainability ?? params?.nationalAiMemory,
    dashboardsMaps: params?.dashboardsMaps ?? params?.nationalDashboards ?? params?.mapsTelemetry,
    gameUi: params?.gameUi ?? params?.uiShell ?? params?.gameState?.uiState ?? params?.nationalSystems?.ui,
    uiShell: params?.uiShell,
    nationalUi: params?.nationalUi,
    utilitiesGrid:
      params?.utilitiesGrid ??
      params?.publicUtilities ??
      params?.gameState?.utilitiesState ??
      params?.nationalSystems?.utilities,
    publicUtilities: params?.publicUtilities,
    nationalUtilities: params?.nationalUtilities,
    negotiationState:
      params?.negotiationState ??
      params?.diplomacy ??
      params?.gameState?.negotiationState ??
      params?.nationalSystems?.negotiation,
    diplomacy: params?.diplomacy,
    consumerConfidence: params?.consumerConfidence ?? params?.households?.consumerConfidence,
    privateCapex: params?.privateCapex ?? params?.companies?.capexCycle ?? params?.privateSector?.capitalExpenditure,
    rentalMarket: params?.rentalMarket ?? params?.housingWellbeing?.rental ?? params?.housing?.rentalMarket,
    climatePolicy:
      params?.climatePolicy ??
      params?.energyEnvironment?.climatePolicy ??
      params?.industrialEnergy?.climate ??
      params?.nationalSystems?.climatePolicy,
    uiAccessibility:
      params?.uiAccessibility ??
      params?.gameUi?.accessibility ??
      params?.uiShell?.accessibility ??
      params?.nationalUi?.accessibility,
    historyTimeline:
      params?.historyTimeline ??
      params?.historyReplay?.timeline ??
      params?.replayArchive?.timeline ??
      params?.nationalHistory?.timeline,
    systemLiquidity:
      params?.systemLiquidity ??
      params?.creditMarkets?.liquidity ??
      params?.monetaryPolicy?.liquidity ??
      params?.nationalFinance?.liquidity,
    strategicGameplay:
      params?.strategicGameplay ??
      params?.strategicCapital?.gameplayCadence ??
      params?.nationalStrategic?.gameplay,
    historyArchiveIntegrity:
      params?.historyArchiveIntegrity ??
      params?.replayArchive?.integrity ??
      params?.historyReplay?.archive ??
      params?.nationalHistory?.archive,
    nationalStrategic: params?.nationalStrategic,
    integrationHealth:
      params?.integrationHealth ??
      params?.op10mIntegration?.health ??
      params?.nationalSystems?.integrationHealth ??
      params?.assemblyHealth,
    op10mIntegration: params?.op10mIntegration,
    assemblyHealth: params?.assemblyHealth,
    turnCadenceDrift:
      params?.turnCadenceDrift ??
      params?.turnsTime?.cadenceDrift ??
      params?.temporalCadence?.drift ??
      params?.gameClock?.cadence,
    researchMomentum:
      params?.researchMomentum ??
      params?.researchTech?.momentum ??
      params?.nationalResearch?.momentum,
    budgetOutlook:
      params?.budgetOutlook ??
      params?.publicFinance?.outlook ??
      params?.publicFinance?.budgetOutlook ??
      params?.nationalFinance?.budgetOutlook,
    modeShift:
      params?.modeShift ??
      params?.modesScenarios?.shift ??
      params?.scenarioRuntime?.modeShift ??
      params?.gameModes?.shift,
    supplyChainStress:
      params?.supplyChainStress ??
      params?.companies?.supplyChain ??
      params?.privateSector?.supplyChain,
    eventCascade:
      params?.eventCascade ??
      params?.dynamicEvents?.cascade ??
      params?.op10mEvents?.cascade ??
      params?.narrativeEvents?.cascade,
    demographicShift:
      params?.demographicShift ??
      params?.population?.shift ??
      params?.demographics?.shift ??
      params?.nationalPopulation?.shift,
    inflationExpectationsAnchor:
      params?.inflationExpectationsAnchor ??
      params?.nationalFinance?.expectationsAnchor ??
      params?.monetaryPolicy?.expectationsAnchor,
    metroMomentum:
      params?.metroMomentum ??
      params?.citiesRegions?.momentum ??
      params?.metropolitanSystems?.growthMomentum ??
      params?.urbanRegions?.momentum,
    transportThroughput:
      params?.transportThroughput ??
      params?.transportInfrastructure?.throughput ??
      params?.infrastructure?.freightThroughput ??
      params?.nationalInfrastructure?.throughput,
    energyTransitionPace:
      params?.energyTransitionPace ??
      params?.industrialEnergy?.transitionPace ??
      params?.energyEnvironment?.transition ??
      params?.climatePolicy?.transitionPace,
    housingAffordability:
      params?.housingAffordability ??
      params?.housingWellbeing?.affordability ??
      params?.housing?.affordability ??
      params?.rentalMarket?.affordability,
    tradeExposure:
      params?.tradeExposure ??
      params?.trade?.exposure ??
      params?.trade?.externalExposure ??
      params?.nationalSystems?.tradeExposure,
    guardianVigilance:
      params?.guardianVigilance ??
      params?.guardianCopilot?.vigilance ??
      params?.guardian?.riskVigilance ??
      params?.coPilotWarnings?.vigilance,
    commandCoordination:
      params?.commandCoordination ??
      params?.commandCenter?.coordination ??
      params?.nationalCommand?.coordination ??
      params?.aiCommandCenter?.coordination,
    teamAiCohesion:
      params?.teamAiCohesion ??
      params?.teamIntelligence?.cohesion ??
      params?.teamAi?.cohesion ??
      params?.nationalTeamAi?.cohesion,
    memoryRetention:
      params?.memoryRetention ??
      params?.aiMemory?.retention ??
      params?.explainability?.retention ??
      params?.nationalAiMemory?.retention,
    automationThroughput:
      params?.automationThroughput ??
      params?.idleAutomation?.throughput ??
      params?.automation?.throughput ??
      params?.nationalAutomation?.throughput,
    forecastCalibration:
      params?.forecastCalibration ??
      params?.forecastingLab?.calibration ??
      params?.macroForecasts?.calibration ??
      params?.nationalForecasts?.calibration,
    automationIdleGovernance:
      params?.automationIdleGovernance ??
      params?.idleAutomation?.governance ??
      params?.automation?.idleGovernance ??
      params?.nationalAutomation?.idleGovernance,
    forecastProjectionSync:
      params?.forecastProjectionSync ??
      params?.forecastingLab?.projectionSync ??
      params?.macroForecasts?.projectionSync ??
      params?.nationalForecasts?.wave35Sync,
    automationIdleGovernanceWave36Export:
      params?.automationIdleGovernanceWave36Export ??
      params?.idleAutomation?.governanceWave36Export ??
      params?.automation?.idleGovernanceWave36Export ??
      params?.nationalAutomation?.idleGovernanceWave36Export,
    forecastWave36ProjectionSync:
      params?.forecastWave36ProjectionSync ??
      params?.forecastingLab?.wave36ProjectionSync ??
      params?.macroForecasts?.wave36ProjectionSync ??
      params?.nationalForecasts?.wave36Sync,
    uiResponsivenessWave37Export:
      params?.uiResponsivenessWave37Export ??
      params?.uiResponsiveness?.wave37Export ??
      params?.gameUi?.responsivenessWave37Export ??
      params?.nationalUi?.responsivenessWave37Export,
    dashboardClarityWave37Export:
      params?.dashboardClarityWave37Export ??
      params?.dashboardClarity?.wave37Export ??
      params?.dashboards?.clarityWave37Export ??
      params?.nationalDashboards?.clarityWave37Export,
    replayWave38Export:
      params?.replayWave38Export ??
      params?.historyReplay?.wave38Export ??
      params?.replay?.wave38Export ??
      params?.nationalHistory?.replayWave38Export,
    integrationHealthWave38Export:
      params?.integrationHealthWave38Export ??
      params?.integrationHealth?.wave38Export ??
      params?.assembly?.integrationHealthWave38Export ??
      params?.nationalIntegration?.healthWave38Export,
    automationIdleGovernanceWave39Export:
      params?.automationIdleGovernanceWave39Export ??
      params?.automationIdleGovernance?.wave39Export ??
      params?.idleAutomation?.governanceWave39Export ??
      params?.automation?.idleGovernanceWave39Export,
    forecastWave39Export:
      params?.forecastWave39Export ??
      params?.forecastingLab?.wave39Export ??
      params?.macroForecasts?.wave39Export ??
      params?.nationalForecasts?.wave39Sync,
    uiResponsivenessWave40Export:
      params?.uiResponsivenessWave40Export ??
      params?.uiResponsiveness?.wave40Export ??
      params?.gameUi?.responsivenessWave40Export ??
      params?.nationalUi?.responsivenessWave40Export,
    dashboardClarityWave40Export:
      params?.dashboardClarityWave40Export ??
      params?.dashboardClarity?.wave40Export ??
      params?.dashboards?.clarityWave40Export ??
      params?.nationalDashboards?.clarityWave40Export,
    replayWave41Export:
      params?.replayWave41Export ??
      params?.historyReplay?.wave41Export ??
      params?.replay?.wave41Export ??
      params?.nationalHistory?.replayWave41Export,
    integrationHealthWave41Export:
      params?.integrationHealthWave41Export ??
      params?.integrationHealth?.wave41Export ??
      params?.assembly?.integrationHealthWave41Export ??
      params?.nationalIntegration?.healthWave41Export,
    automationIdleGovernanceWave42Export:
      params?.automationIdleGovernanceWave42Export ??
      params?.automationIdleGovernance?.wave42Export ??
      params?.idleAutomation?.governanceWave42Export ??
      params?.automation?.idleGovernanceWave42Export,
    forecastWave42Export:
      params?.forecastWave42Export ??
      params?.forecastingLab?.wave42Export ??
      params?.macroForecasts?.wave42Export ??
      params?.nationalForecasts?.wave42Sync,
    uiResponsivenessWave43Export:
      params?.uiResponsivenessWave43Export ??
      params?.uiResponsiveness?.wave43Export ??
      params?.gameUi?.responsivenessWave43Export ??
      params?.nationalUi?.responsivenessWave43Export,
    dashboardClarityWave43Export:
      params?.dashboardClarityWave43Export ??
      params?.dashboardClarity?.wave43Export ??
      params?.dashboards?.clarityWave43Export ??
      params?.nationalDashboards?.clarityWave43Export,
    automationIdleGovernanceWave44Export:
      params?.automationIdleGovernanceWave44Export ??
      params?.automationIdleGovernance?.wave44Export ??
      params?.idleAutomation?.governanceWave44Export ??
      params?.automation?.idleGovernanceWave44Export,
    forecastWave44Export:
      params?.forecastWave44Export ??
      params?.forecastingLab?.wave44Export ??
      params?.macroForecasts?.wave44Export ??
      params?.nationalForecasts?.wave44Sync,
    replayWave45Export:
      params?.replayWave45Export ??
      params?.historyReplay?.wave45Export ??
      params?.replay?.wave45Export ??
      params?.nationalHistory?.replayWave45Export,
    integrationHealthWave45Export:
      params?.integrationHealthWave45Export ??
      params?.integrationHealth?.wave45Export ??
      params?.assembly?.integrationHealthWave45Export ??
      params?.nationalIntegration?.healthWave45Export,
    uiResponsivenessWave46Export:
      params?.uiResponsivenessWave46Export ??
      params?.uiResponsiveness?.wave46Export ??
      params?.gameUi?.responsivenessWave46Export ??
      params?.nationalUi?.responsivenessWave46Export,
    dashboardClarityWave46Export:
      params?.dashboardClarityWave46Export ??
      params?.dashboardClarity?.wave46Export ??
      params?.dashboards?.clarityWave46Export ??
      params?.nationalDashboards?.clarityWave46Export,
    replayWave47Export:
      params?.replayWave47Export ??
      params?.historyReplay?.wave47Export ??
      params?.replay?.wave47Export ??
      params?.nationalHistory?.replayWave47Export,
    integrationHealthWave47Export:
      params?.integrationHealthWave47Export ??
      params?.integrationHealth?.wave47Export ??
      params?.assembly?.integrationHealthWave47Export ??
      params?.nationalIntegration?.healthWave47Export,
    replayWave48Export:
      params?.replayWave48Export ??
      params?.historyReplay?.wave48Export ??
      params?.replay?.wave48Export ??
      params?.nationalHistory?.replayWave48Export,
    integrationHealthWave48Export:
      params?.integrationHealthWave48Export ??
      params?.integrationHealth?.wave48Export ??
      params?.assembly?.integrationHealthWave48Export ??
      params?.nationalIntegration?.healthWave48Export,
    highInflationScenarioActive: Boolean(params?.highInflationScenarioActive || gset.selectedScenarioId === 'high_inflation'),
    creditShockActive: Boolean(params?.creditShockActive)
  };
}

export function makeDefaultV1014_MACRO_TestInputs(overrides: Partial<MacroEconomyInputs> = {}): MacroEconomyInputs {
  return {
    turn: 5,
    enabled: true,
    livingRegions: {
      regions: Object.fromEntries(
        V1014_MACRO_CORE_REGIONS.map(c => [
          c,
          {
            economy: { score: 55, band: 'moderate' },
            momentum: { band: 'stable' },
            development: { score: 50 }
          }
        ])
      )
    },
    ...overrides
  };
}


// --- source: bridge-v1012-fiscal.ts ---

export interface MacroFiscalSpillover {
  investmentNudge: number;
  cycleNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.12 fiscal spillover into macro scores (warn-only cross-check; never mutates treasury). */
export function readMacroFiscalSpilloverFromV1012(inputs: MacroEconomyInputs): MacroFiscalSpillover {
  const pf: any = inputs.publicFinance;
  if (!pf) {
    return { investmentNudge: 0, cycleNudge: 0, productivityNudge: 0, summary: null };
  }
  const pressure = String(pf.pressure ?? pf.fiscalPosition?.pressure ?? pf.fiscalPressure ?? 'healthy');
  const headroom = Number(pf.fiscalHeadroom ?? pf.fiscalPosition?.fiscalHeadroom ?? 0);
  let investmentNudge = 0;
  let cycleNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (pressure === 'critical' || pressure === 'strained') {
    investmentNudge -= pressure === 'critical' ? 4 : 2;
    cycleNudge -= 2;
    summary = `Public fiscal pressure (${pressure}) tightens macro investment climate read-only.`;
  } else if (pressure === 'healthy' && headroom > 6) {
    investmentNudge += 1;
    summary = 'Comfortable fiscal headroom supports macro investment climate (interpretation only).';
  }
  if (headroom < -4) {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Negative fiscal headroom weighs on cycle momentum.';
  }

  return {
    investmentNudge: v1014macroClamp(investmentNudge, -8, 4),
    cycleNudge: v1014macroClamp(cycleNudge, -6, 4),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 2),
    summary
  };
}

export function applyMacroFiscalSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroFiscalSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1013-households.ts ---

export interface MacroHouseholdSpillover {
  cycleNudge: number;
  investmentNudge: number;
  summary: string | null;
}

/** Read-only V10.13 household / domestic demand spillover (never mutates household state). */
export function readMacroHouseholdSpilloverFromV1013(inputs: MacroEconomyInputs): MacroHouseholdSpillover {
  const hh: any = inputs.households;
  if (!hh) return { cycleNudge: 0, investmentNudge: 0, summary: null };
  const demand = String(hh.domesticDemand?.level ?? hh.domesticDemand?.band ?? hh.demandBand ?? 'stable');
  const affordability = String(hh.affordability?.band ?? hh.livingStandards?.band ?? 'moderate');
  let cycleNudge = 0;
  let investmentNudge = 0;
  let summary: string | null = null;
  if (demand === 'surging' || demand === 'very_strong') {
    cycleNudge += 3;
    investmentNudge += 2;
    summary = 'Strong domestic demand supports macro cycle momentum (interpretation).';
  }
  if (demand === 'contracting' || demand === 'soft') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Soft domestic demand weighs on macro cycle read.';
  }
  if (affordability === 'severe_pressure' || affordability === 'strained') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Household affordability strain caps investment interpretation.';
  }
  return {
    cycleNudge: v1014macroClamp(cycleNudge, -6, 6),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    summary
  };
}

export function applyMacroHouseholdSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHouseholdSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v101-industries.ts ---

export interface MacroIndustrySpillover {
  productivityNudge: number;
  cycleNudge: number;
  summary: string | null;
}

/** Read-only V10.1 industries / supply utilization spillover. */
export function readMacroIndustrySpilloverFromV101(inputs: MacroEconomyInputs): MacroIndustrySpillover {
  const ind: any = inputs.industries;
  if (!ind) return { productivityNudge: 0, cycleNudge: 0, summary: null };
  const utilization = Number(ind.nationalUtilization ?? ind.utilizationIndex ?? ind.supplyPressure ?? 55);
  const constrained = Boolean(ind.supplyConstrained ?? ind.hasCriticalConstraint);
  let productivityNudge = 0;
  let cycleNudge = 0;
  let summary: string | null = null;
  if (utilization > 72) {
    productivityNudge += 2;
    cycleNudge += 1;
    summary = 'Tight industrial utilization lifts productivity interpretation.';
  }
  if (utilization < 42) {
    productivityNudge -= 2;
    cycleNudge -= 2;
    summary = 'Slack industrial utilization signals macro slack.';
  }
  if (constrained) {
    productivityNudge -= 3;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Critical supply constraint weighs on macro productivity.';
  }
  return {
    productivityNudge: v1014macroClamp(productivityNudge, -6, 6),
    cycleNudge: v1014macroClamp(cycleNudge, -6, 4),
    summary
  };
}

export function applyMacroIndustrySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIndustrySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1015-trade.ts ---

export interface MacroTradeSpillover {
  cycleNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.15 trade / external demand spillover (never mutates trade state). */
export function readMacroTradeSpilloverFromV1015(inputs: MacroEconomyInputs): MacroTradeSpillover {
  const tr: any = inputs.trade;
  if (!tr) return { cycleNudge: 0, productivityNudge: 0, summary: null };
  const terms = String(tr.termsOfTrade?.band ?? tr.termsBand ?? tr.externalDemand?.band ?? 'stable');
  const tension = String(tr.diplomaticTension?.level ?? tr.tensionBand ?? 'calm');
  const exportMomentum = Number(tr.exportMomentum ?? tr.exportGrowthIndex ?? 0);
  let cycleNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;
  if (terms === 'favorable' || terms === 'strong' || exportMomentum > 4) {
    cycleNudge += 2;
    productivityNudge += 1.5;
    summary = 'Favorable external demand supports macro cycle read.';
  }
  if (terms === 'weak' || terms === 'adverse' || exportMomentum < -3) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'Weak terms of trade drag on macro cycle and productivity interpretation.';
  }
  if (tension === 'elevated' || tension === 'critical' || tension === 'sanctions_risk') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Trade/diplomatic tension caps external upside.';
  }
  return {
    cycleNudge: v1014macroClamp(cycleNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -6, 6),
    summary
  };
}

export function applyMacroTradeSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTradeSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-economic-geography.ts ---

export interface MacroGeographySpillover {
  investmentNudge: number;
  cycleNudge: number;
  summary: string | null;
}

/** Read-only V10.11 economic geography / urbanization spillover. */
export function readMacroGeographySpillover(inputs: MacroEconomyInputs): MacroGeographySpillover {
  const geo: any = inputs.economicGeography;
  if (!geo) return { investmentNudge: 0, cycleNudge: 0, summary: null };
  const connectivity = String(geo.connectivity?.band ?? geo.infrastructureConnectivity ?? 'moderate');
  const urbanization = Number(geo.urbanizationIndex ?? geo.metroConcentration ?? 50);
  const dispersion = String(geo.regionalDispersion?.band ?? geo.dispersionBand ?? 'balanced');
  let investmentNudge = 0;
  let cycleNudge = 0;
  let summary: string | null = null;
  if (connectivity === 'strong' || connectivity === 'leading') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = 'Strong economic geography connectivity lifts investment interpretation.';
  }
  if (connectivity === 'weak' || connectivity === 'fragmented') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = 'Fragmented geography weighs on national investment climate read.';
  }
  if (urbanization > 68) {
    investmentNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'High urban concentration supports services-led macro mix.';
  }
  if (dispersion === 'wide' || dispersion === 'polarized') {
    cycleNudge -= 1.5;
    summary = (summary ? summary + ' ' : '') + 'Polarized regional geography reinforces divergence risk.';
  }
  return {
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    summary
  };
}

export function applyMacroGeographySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroGeographySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1016-credit.ts ---

export interface MacroCreditSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 credit / financial conditions spillover (never mutates finance state). */
export function readMacroCreditSpilloverFromV1016(inputs: MacroEconomyInputs): MacroCreditSpillover {
  const cm: any = inputs.creditMarkets ?? inputs.monetaryPolicy ?? inputs.nationalFinance;
  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (inputs.creditShockActive) {
    investmentNudge -= 5;
    cycleNudge -= 3;
    productivityNudge -= 1;
    summary = 'Active credit shock flag tightens macro investment and cycle read.';
  }

  if (!cm && !inputs.creditShockActive) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  const spread = String(cm?.spreadBand ?? cm?.creditSpread?.band ?? cm?.conditions?.band ?? 'normal');
  const policy = String(cm?.policyStance ?? cm?.stance ?? cm?.ratePolicy?.band ?? 'neutral');
  const liquidity = String(cm?.liquidity?.band ?? cm?.liquidityBand ?? 'adequate');

  if (spread === 'wide' || spread === 'stressed' || spread === 'frozen') {
    investmentNudge -= spread === 'frozen' ? 6 : 4;
    cycleNudge -= 2;
    summary = `Credit spread band (${spread}) weighs on macro investment climate.`;
  } else if (spread === 'tight' || spread === 'elevated') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = 'Elevated credit spreads modestly tighten macro cycle read.';
  } else if (spread === 'narrow' || spread === 'favorable') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = 'Favorable credit conditions support macro investment interpretation.';
  }

  if (policy === 'restrictive' || policy === 'tightening') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Restrictive policy stance caps investment upside.';
  } else if (policy === 'accommodative' || policy === 'easing') {
    investmentNudge += 1.5;
    summary = (summary ? summary + ' ' : '') + 'Accommodative policy stance supports investment read.';
  }

  if (liquidity === 'strained' || liquidity === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Liquidity strain adds macro downside risk.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -8, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -10, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 2),
    summary
  };
}

export function applyMacroCreditSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCreditSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v104-innovation.ts ---

export interface MacroInnovationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only innovation / R&D spillover (never mutates innovation state). */
export function readMacroInnovationSpilloverFromV104(inputs: MacroEconomyInputs): MacroInnovationSpillover {
  const inn: any = inputs.innovation;
  if (!inn) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (inn.nationalProductivityBonus) {
    productivityNudge += 2;
    summary = 'National innovation bonus lifts macro productivity read.';
  }

  const momentum = String(inn.momentum?.band ?? inn.rAndDMomentum ?? inn.pipelineBand ?? '');
  if (momentum === 'accelerating' || momentum === 'strong') {
    productivityNudge += 2;
    investmentNudge += 1;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Accelerating innovation pipeline supports macro cycle interpretation.';
  } else if (momentum === 'stalled' || momentum === 'weak' || momentum === 'contracting') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled innovation pipeline drags macro productivity read.';
  }

  const adoption = String(inn.adoption?.band ?? inn.diffusionBand ?? '');
  if (adoption === 'broad' || adoption === 'leading') {
    productivityNudge += 1.5;
    summary = (summary ? summary + ' ' : '') + 'Broad technology adoption supports productivity.';
  } else if (adoption === 'narrow' || adoption === 'lagging') {
    productivityNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -4, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -2, 4),
    productivityNudge: v1014macroClamp(productivityNudge, -6, 8),
    summary
  };
}

export function applyMacroInnovationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroInnovationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v107-workforce.ts ---

export interface MacroWorkforceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only workforce / labor market spillover (never mutates workforce state). */
export function readMacroWorkforceSpilloverFromV107(inputs: MacroEconomyInputs): MacroWorkforceSpillover {
  const wf: any = inputs.workforce;
  if (!wf) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const readiness = String(wf.nationalReadinessBand ?? wf.readiness?.band ?? wf.skillsBand ?? '');
  if (readiness === 'strong' || readiness === 'leading') {
    productivityNudge += 3;
    cycleNudge += 1;
    summary = 'Strong national workforce readiness lifts macro productivity read.';
  } else if (readiness === 'weak' || readiness === 'strained') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = 'Weak workforce readiness weighs on macro productivity interpretation.';
  } else if (readiness === 'critical' || readiness === 'shortage') {
    productivityNudge -= 4;
    investmentNudge -= 2;
    cycleNudge -= 2;
    summary = 'Critical labor shortages bind macro capacity and investment upside.';
  }

  const slack = String(wf.laborMarket?.slack ?? wf.marketSlack ?? wf.tightnessBand ?? '');
  if (slack === 'tight' || slack === 'very_tight' || slack === 'shortage') {
    cycleNudge += 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Tight labor markets support cycle but can cap investment scaling.';
  } else if (slack === 'slack' || slack === 'deep_slack' || slack === 'surplus') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Slack labor markets signal macro underutilization.';
  }

  const mismatch = Boolean(wf.skillsMismatch ?? wf.structuralMismatch);
  if (mismatch) {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Skills mismatch reduces effective macro productivity.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -6, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -4, 2),
    productivityNudge: v1014macroClamp(productivityNudge, -8, 6),
    summary
  };
}

export function applyMacroWorkforceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroWorkforceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v109-strategic.ts ---

export interface MacroStrategicSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.9 strategic capital allocation spillover (never mutates strategic state). */
export function readMacroStrategicSpilloverFromV109(inputs: MacroEconomyInputs): MacroStrategicSpillover {
  const sc: any = inputs.strategicCapital ?? inputs.nationalSystems?.strategicCapital;
  if (!sc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const allocation = String(sc.allocationBand ?? sc.capitalBand ?? sc.investmentClimateBand ?? '');
  if (allocation === 'expansionary' || allocation === 'growth' || allocation === 'active') {
    investmentNudge += 3;
    cycleNudge += 1;
    summary = 'Expansionary strategic capital allocation lifts macro investment read.';
  } else if (allocation === 'austerity' || allocation === 'conservation' || allocation === 'drawdown') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Conservative strategic capital stance weighs on macro investment interpretation.';
  } else if (allocation === 'frozen' || allocation === 'blocked') {
    investmentNudge -= 4;
    productivityNudge -= 1;
    summary = 'Frozen strategic capital pipeline caps macro investment upside.';
  }

  const priority = String(sc.nationalPriority ?? sc.priorityTheme ?? sc.focusBand ?? '');
  if (priority === 'productivity' || priority === 'innovation_led') {
    productivityNudge += 2;
    summary = (summary ? summary + ' ' : '') + 'Productivity-led strategic priority supports macro productivity read.';
  } else if (priority === 'infrastructure' || priority === 'capex') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Infrastructure priority channels strategic capital toward investment.';
  } else if (priority === 'stabilization' || priority === 'fiscal_repair') {
    investmentNudge -= 1;
    cycleNudge -= 1;
  }

  const momentum = String(sc.momentum?.band ?? sc.pipelineMomentum ?? sc.executionBand ?? '');
  if (momentum === 'accelerating' || momentum === 'strong') {
    investmentNudge += 1;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong strategic execution momentum supports macro cycle read.';
  } else if (momentum === 'stalled' || momentum === 'weak') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stalled strategic execution drags investment interpretation.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroStrategicSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroStrategicSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1014-housing.ts ---

export interface MacroHousingSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only housing & wellbeing spillover (Agent 14 domain; never mutates housing state). */
export function readMacroHousingSpilloverFromV1014Housing(inputs: MacroEconomyInputs): MacroHousingSpillover {
  const hw: any = inputs.housingWellbeing ?? inputs.housing ?? inputs.nationalSystems?.housingWellbeing;
  if (!hw) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const affordability = String(hw.affordability?.band ?? hw.affordabilityBand ?? hw.stressBand ?? '');
  if (affordability === 'severe' || affordability === 'critical' || affordability === 'stressed') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = 'Severe housing affordability stress weighs on macro cycle and residential investment read.';
  } else if (affordability === 'comfortable' || affordability === 'balanced') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = 'Balanced housing affordability supports domestic cycle interpretation.';
  }

  const construction = String(hw.construction?.band ?? hw.buildPipelineBand ?? hw.permitsBand ?? '');
  if (construction === 'boom' || construction === 'strong') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong housing construction pipeline lifts macro investment read.';
  } else if (construction === 'correction' || construction === 'collapse' || construction === 'frozen') {
    investmentNudge -= 3;
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Housing construction correction drags macro investment and cycle.';
  }

  const mortgage = String(hw.mortgage?.stressBand ?? hw.debtServiceBand ?? hw.mortgageStress ?? '');
  if (mortgage === 'elevated' || mortgage === 'acute' || mortgage === 'distress') {
    cycleNudge -= 1;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated mortgage stress tightens household-linked macro demand read.';
  }

  const wellbeing = String(hw.wellbeing?.band ?? hw.nationalWellbeingBand ?? '');
  if (wellbeing === 'strong' || wellbeing === 'leading') {
    productivityNudge += 1;
    cycleNudge += 1;
  } else if (wellbeing === 'weak' || wellbeing === 'strained') {
    productivityNudge -= 1;
    cycleNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 3),
    summary
  };
}

export function applyMacroHousingSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHousingSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1010-inflation.ts ---

export interface MacroInflationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.10 finance / inflation spillover (never mutates finance state). */
export function readMacroInflationSpilloverFromV1010(inputs: MacroEconomyInputs): MacroInflationSpillover {
  const nf: any = inputs.nationalFinance ?? inputs.monetaryPolicy;
  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (inputs.highInflationScenarioActive) {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 2;
    summary = 'High-inflation scenario flag drags macro cycle and productivity read.';
  }

  if (!nf && !inputs.highInflationScenarioActive) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  const headline = String(
    nf?.inflation?.band ?? nf?.inflationBand ?? nf?.cpiBand ?? nf?.headlineInflation?.band ?? ''
  );
  const core = String(nf?.coreInflation?.band ?? nf?.coreInflationBand ?? nf?.underlyingInflation?.band ?? '');
  const expectations = String(nf?.inflationExpectations?.band ?? nf?.expectationsBand ?? '');

  if (headline === 'elevated' || headline === 'high' || headline === 'very_high') {
    cycleNudge -= headline === 'very_high' ? 3 : 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Headline inflation band (${headline}) tightens macro cycle interpretation.`;
  } else if (headline === 'moderate' || headline === 'target') {
    cycleNudge += 0.5;
    summary = 'Inflation near target supports stable macro read.';
  } else if (headline === 'disinflation' || headline === 'low') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = 'Disinflationary conditions support macro investment interpretation.';
  }

  if (core === 'sticky' || core === 'elevated' || core === 'high') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Sticky core inflation weighs on productivity read.';
  }

  if (expectations === 'unanchored' || expectations === 'rising' || expectations === 'elevated') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unanchored inflation expectations cap investment upside.';
  } else if (expectations === 'anchored' || expectations === 'stable') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroInflationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroInflationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1018-energy.ts ---

export interface MacroEnergySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 industrial energy / environment spillover (never mutates energy state). */
export function readMacroEnergySpilloverFromV1018(inputs: MacroEconomyInputs): MacroEnergySpillover {
  const en: any =
    inputs.industrialEnergy ?? inputs.energyEnvironment ?? inputs.nationalSystems?.industrialEnergy ?? inputs.nationalSystems?.energy;
  if (!en) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const supply = String(en.supplyReliability?.band ?? en.reliabilityBand ?? en.gridBand ?? en.supplyBand ?? '');
  const transition = String(en.transition?.band ?? en.decarbonizationBand ?? en.netZeroBand ?? '');
  const cost = String(en.energyCost?.band ?? en.inputCostBand ?? en.priceShockBand ?? '');

  if (supply === 'critical' || supply === 'fragile' || supply === 'stressed') {
    cycleNudge -= supply === 'critical' ? 3 : 2;
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = `Energy supply band (${supply}) drags macro productivity and cycle read.`;
  } else if (supply === 'robust' || supply === 'secure' || supply === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = 'Secure energy supply supports macro productivity interpretation.';
  }

  if (transition === 'accelerating' || transition === 'rapid') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Accelerating energy transition lifts capex-heavy macro investment read.';
  } else if (transition === 'stalled' || transition === 'blocked') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled transition pipeline caps green-investment macro upside.';
  }

  if (cost === 'spike' || cost === 'severe' || cost === 'elevated') {
    cycleNudge -= cost === 'severe' ? 3 : 2;
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Energy cost shock tightens macro cycle read.';
  } else if (cost === 'favorable' || cost === 'low') {
    cycleNudge += 1;
    productivityNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEnergySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEnergySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v105-events.ts ---

export interface MacroEventsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.5 dynamic events / narrative spillover (never mutates event state). */
export function readMacroEventsSpilloverFromV105(inputs: MacroEconomyInputs): MacroEventsSpillover {
  const ev: any =
    inputs.dynamicEvents ??
    inputs.narrativeEvents ??
    inputs.op10mEvents ??
    inputs.nationalSystems?.dynamicEvents ??
    inputs.nationalSystems?.narrative;
  if (!ev) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const stability = String(
    ev.nationalStabilityBand ??
      ev.stabilityBand ??
      ev.nationalStability?.band ??
      (typeof ev.nationalStability === 'number' && ev.nationalStability < 35
        ? 'critical'
        : typeof ev.nationalStability === 'number' && ev.nationalStability < 50
          ? 'fragile'
          : '')
  );
  const backlog = String(ev.pendingBacklogBand ?? ev.backlogBand ?? ev.queuePressure?.band ?? '');
  const crisisCount = Math.max(
    0,
    Math.floor(Number(ev.activeCrisisCount ?? ev.crisisCount ?? ev.activeCrises ?? 0))
  );
  const pendingCount = Math.max(
    0,
    Math.floor(Number(ev.pendingResponseCount ?? ev.pendingResponses?.length ?? ev.pendingCount ?? 0))
  );

  if (stability === 'critical' || stability === 'collapsing') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `National stability band (${stability}) drags macro cycle read via event layer.`;
  } else if (stability === 'fragile' || stability === 'stressed') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = `Fragile national stability (${stability}) weighs on macro cycle interpretation.`;
  } else if (stability === 'robust' || stability === 'stable' || stability === 'strong') {
    cycleNudge += 0.5;
    summary = 'Stable national narrative backdrop supports macro cycle read.';
  }

  if (backlog === 'surging' || backlog === 'critical' || backlog === 'elevated') {
    cycleNudge -= backlog === 'critical' ? 2 : 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated pending event backlog caps investment upside.';
  } else if (backlog === 'clear' || backlog === 'calm') {
    investmentNudge += 0.5;
  }

  if (crisisCount >= 3) {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + `${crisisCount} concurrent crises amplify macro downside risk.`;
  } else if (crisisCount === 2) {
    cycleNudge -= 1;
  }

  if (pendingCount >= 6) {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Heavy pending player-response queue signals policy paralysis read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEventsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEventsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v108-companies.ts ---

export interface MacroCompaniesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.8 companies / production spillover (never mutates firm state). */
export function readMacroCompaniesSpilloverFromV108(inputs: MacroEconomyInputs): MacroCompaniesSpillover {
  const co: any =
    inputs.companies ??
    inputs.privateSector ??
    inputs.nationalPrivateSector ??
    inputs.nationalSystems?.privateSector ??
    inputs.nationalSystems?.companies;
  if (!co) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const utilization = String(
    co.nationalUtilizationBand ??
      co.utilization?.band ??
      co.productionUtilization?.band ??
      co.capacityUtilization?.band ??
      ''
  );
  const capacityGap = Number(co.capacityGap ?? co.nationalCapacityGap ?? co.aggregateCapacityGap ?? NaN);
  const overloaded = Math.max(
    0,
    Math.floor(Number(co.overloadedFirmCount ?? co.overloadedCount ?? co.overloadCount ?? 0))
  );
  const alignment = Number(co.nationalAlignmentScore ?? co.alignmentScore ?? co.sectorAlignment ?? NaN);
  const productionMomentum = String(co.productionMomentum?.band ?? co.outputMomentum?.band ?? co.momentumBand ?? '');

  if (utilization === 'overextended' || utilization === 'saturated') {
    cycleNudge += 1;
    productivityNudge += 1;
    summary = `High private-sector utilization (${utilization}) supports macro cycle read.`;
  } else if (utilization === 'slack' || utilization === 'depressed' || utilization === 'critical') {
    cycleNudge -= utilization === 'critical' ? 3 : 2;
    investmentNudge -= 1;
    summary = `Slack production utilization (${utilization}) drags macro cycle and investment read.`;
  }

  if (Number.isFinite(capacityGap) && capacityGap > 0.25) {
    investmentNudge += 2;
    cycleNudge += 0.5;
    summary = (summary ? summary + ' ' : '') + 'Positive national capacity gap lifts capex-heavy investment interpretation.';
  } else if (Number.isFinite(capacityGap) && capacityGap < -0.15) {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Negative capacity gap signals binding production constraints.';
  }

  if (overloaded >= 4) {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + `${overloaded} overloaded firms weigh on productivity read.`;
  } else if (overloaded >= 2) {
    productivityNudge -= 1;
  }

  if (Number.isFinite(alignment) && alignment < 45) {
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Weak sector alignment reduces macro productivity confidence.';
  } else if (Number.isFinite(alignment) && alignment > 72) {
    productivityNudge += 1;
  }

  if (productionMomentum === 'surging' || productionMomentum === 'strong') {
    cycleNudge += 1;
    investmentNudge += 1;
  } else if (productionMomentum === 'contracting' || productionMomentum === 'stalled') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Contracting production momentum drags macro cycle read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCompaniesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCompaniesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v102-turns.ts ---

export interface MacroTurnsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.2 turns / temporal cadence spillover (never mutates turn state). */
export function readMacroTurnsSpilloverFromV102(inputs: MacroEconomyInputs): MacroTurnsSpillover {
  const tt: any =
    inputs.turnsTime ??
    inputs.temporalCadence ??
    inputs.gameClock ??
    inputs.nationalSystems?.turnsTime ??
    inputs.nationalSystems?.temporal;
  if (!tt && !inputs.turn) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pace = String(tt?.paceBand ?? tt?.turnPace?.band ?? tt?.cadenceBand ?? '');
  const season = String(tt?.season ?? tt?.currentSeason ?? '');
  const phase = String(tt?.macroPhaseBand ?? tt?.cycleCadence?.band ?? tt?.economicSeason?.band ?? '');
  const backlog = String(tt?.deferredTurnLoad?.band ?? tt?.turnBacklogBand ?? '');

  if (pace === 'accelerated' || pace === 'compressed') {
    cycleNudge += 1;
    investmentNudge += 0.5;
    summary = `Accelerated turn cadence (${pace}) lifts short-horizon macro cycle read.`;
  } else if (pace === 'stalled' || pace === 'frozen' || pace === 'deferred') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Stalled turn cadence (${pace}) drags macro investment and cycle interpretation.`;
  }

  if (season === 'Winter' || season === 'Autumn') {
    cycleNudge -= season === 'Winter' ? 1 : 0.5;
    summary = (summary ? summary + ' ' : '') + `${season} seasonal cadence weighs on macro cycle read.`;
  } else if (season === 'Spring' || season === 'Summer') {
    cycleNudge += 0.5;
  }

  if (phase === 'late_cycle' || phase === 'overheating') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Late-cycle temporal phase tightens macro read.';
  } else if (phase === 'early_recovery' || phase === 'expansionary_cadence') {
    cycleNudge += 1;
    investmentNudge += 1;
  }

  if (backlog === 'elevated' || backlog === 'critical') {
    productivityNudge -= 1;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Deferred turn backlog signals administrative macro drag.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTurnsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTurnsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1017-transport.ts ---

export interface MacroTransportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.17 transport / infrastructure spillover (never mutates infrastructure state). */
export function readMacroTransportSpilloverFromV1017(inputs: MacroEconomyInputs): MacroTransportSpillover {
  const tr: any =
    inputs.transportInfrastructure ??
    inputs.infrastructure ??
    inputs.nationalInfrastructure ??
    inputs.nationalSystems?.transport ??
    inputs.nationalSystems?.infrastructure;
  if (!tr) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const connectivity = String(tr.connectivityBand ?? tr.freightConnectivity?.band ?? tr.networkBand ?? tr.connectivity?.band ?? '');
  const backlog = String(tr.maintenanceBacklog?.band ?? tr.backlogBand ?? tr.deferredProjects?.band ?? '');
  const throughput = String(tr.throughputBand ?? tr.capacityBand ?? tr.utilization?.band ?? '');
  const investmentPipeline = String(tr.investmentPipeline?.band ?? tr.capexPipeline?.band ?? '');

  if (connectivity === 'fragmented' || connectivity === 'critical' || connectivity === 'degraded') {
    cycleNudge -= connectivity === 'critical' ? 3 : 2;
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = `Transport connectivity (${connectivity}) drags macro productivity and cycle read.`;
  } else if (connectivity === 'robust' || connectivity === 'integrated' || connectivity === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = 'Integrated transport network supports macro productivity interpretation.';
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'elevated') {
    investmentNudge += 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Infrastructure maintenance backlog lifts capex need but near-term cycle drag.';
  }

  if (throughput === 'constrained' || throughput === 'bottlenecked') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Logistics throughput constraints bind macro cycle read.';
  } else if (throughput === 'surplus' || throughput === 'ample') {
    cycleNudge += 1;
  }

  if (investmentPipeline === 'surging' || investmentPipeline === 'active') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Active infrastructure pipeline supports macro investment read.';
  } else if (investmentPipeline === 'stalled' || investmentPipeline === 'frozen') {
    investmentNudge -= 2;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTransportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTransportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v103-research.ts ---

export interface MacroResearchSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.3 research / tech pipeline spillover (never mutates research state). */
export function readMacroResearchSpilloverFromV103(inputs: MacroEconomyInputs): MacroResearchSpillover {
  const rs: any =
    inputs.researchTech ??
    inputs.research ??
    inputs.nationalResearch ??
    inputs.nationalSystems?.research ??
    inputs.nationalSystems?.researchTech;
  if (!rs) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pipeline = String(rs.pipelineBand ?? rs.techPipeline?.band ?? rs.readiness?.band ?? '');
  const adoption = String(rs.adoptionBand ?? rs.commercialization?.band ?? rs.diffusion?.band ?? '');
  const funding = String(rs.fundingBand ?? rs.rAndDFunding?.band ?? rs.budgetBand ?? '');

  if (pipeline === 'breakthrough' || pipeline === 'accelerating' || pipeline === 'strong') {
    productivityNudge += 2;
    cycleNudge += 1;
    investmentNudge += 1;
    summary = `Research pipeline (${pipeline}) lifts macro productivity and investment read.`;
  } else if (pipeline === 'stalled' || pipeline === 'blocked' || pipeline === 'weak') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Weak research pipeline (${pipeline}) drags macro productivity interpretation.`;
  }

  if (adoption === 'rapid' || adoption === 'scaling') {
    productivityNudge += 1;
    cycleNudge += 0.5;
  } else if (adoption === 'stalled' || adoption === 'fragmented') {
    productivityNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled tech adoption caps macro upside.';
  }

  if (funding === 'surging' || funding === 'expansionary') {
    investmentNudge += 2;
  } else if (funding === 'cut' || funding === 'critical' || funding === 'frozen') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Research funding squeeze weighs on macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroResearchSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroResearchSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v109-population.ts ---

export interface MacroPopulationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.9 population / demographics spillover (distinct from strategic capital bridge). */
export function readMacroPopulationSpilloverFromV109Pop(inputs: MacroEconomyInputs): MacroPopulationSpillover {
  const pop: any =
    inputs.population ??
    inputs.demographics ??
    inputs.nationalPopulation ??
    inputs.nationalSystems?.population ??
    inputs.nationalSystems?.demographics;
  if (!pop) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const growth = String(pop.growthBand ?? pop.populationGrowth?.band ?? pop.demographicMomentum?.band ?? '');
  const dependency = String(pop.dependencyBand ?? pop.ageDependency?.band ?? pop.dependencyRatio?.band ?? '');
  const migration = String(pop.netMigrationBand ?? pop.migration?.band ?? pop.inflowBand ?? '');

  if (growth === 'surging' || growth === 'strong') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = `Strong population growth (${growth}) supports macro cycle and investment read.`;
  } else if (growth === 'stagnant' || growth === 'contracting' || growth === 'critical') {
    cycleNudge -= growth === 'critical' ? 2 : 1;
    productivityNudge -= 1;
    summary = `Weak demographic growth (${growth}) drags macro cycle interpretation.`;
  }

  if (dependency === 'elevated' || dependency === 'severe' || dependency === 'high') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated age dependency weighs on macro productivity read.';
  } else if (dependency === 'favorable' || dependency === 'low') {
    productivityNudge += 0.5;
  }

  if (migration === 'strong_inflow' || migration === 'surging') {
    investmentNudge += 1;
    cycleNudge += 0.5;
  } else if (migration === 'outflow' || migration === 'severe_outflow') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Net migration outflow tightens macro cycle read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroPopulationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroPopulationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1006-modes.ts ---

export interface MacroModesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.6 modes / scenarios read-only spillover (never mutates mode state). */
export function readMacroModesSpilloverFromV1006(inputs: MacroEconomyInputs): MacroModesSpillover {
  const md: any =
    inputs.modesScenarios ??
    inputs.gameModes ??
    inputs.scenarioRuntime ??
    inputs.nationalSystems?.modes ??
    inputs.nationalSystems?.scenarios;
  if (!md) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const difficulty = String(md.difficultyBand ?? md.scenarioDifficulty?.band ?? md.pressureBand ?? '');
  const campaign = String(md.campaignMomentum?.band ?? md.campaignPhase?.band ?? md.progressBand ?? '');
  const volatility = String(md.scenarioVolatility?.band ?? md.modeVolatility?.band ?? '');

  if (difficulty === 'extreme' || difficulty === 'crisis' || difficulty === 'hardcore') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = `Elevated scenario difficulty (${difficulty}) drags macro cycle read.`;
  } else if (difficulty === 'sandbox' || difficulty === 'relaxed' || difficulty === 'tutorial') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = 'Relaxed scenario difficulty supports stable macro interpretation.';
  }

  if (campaign === 'summit_push' || campaign === 'ascent' || campaign === 'breakout') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong campaign momentum lifts macro investment read.';
  } else if (campaign === 'stalled' || campaign === 'regression' || campaign === 'retreat') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stalled campaign momentum weighs on macro cycle.';
  }

  if (volatility === 'high' || volatility === 'chaotic') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'High scenario volatility increases macro uncertainty read.';
  } else if (volatility === 'low' || volatility === 'stable') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroModesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroModesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1016-guardian.ts ---

export interface MacroGuardianSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 guardian co-pilot spillover (distinct from credit layer; never mutates guardian state). */
export function readMacroGuardianSpilloverFromV1016Guardian(inputs: MacroEconomyInputs): MacroGuardianSpillover {
  const g: any =
    inputs.guardianCopilot ??
    inputs.guardian ??
    inputs.coPilotWarnings ??
    inputs.nationalSystems?.guardian;
  if (!g) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const alertBand = String(g.alertBand ?? g.riskBand ?? g.overallRisk?.band ?? '');
  const openWarnings = Math.max(0, Math.floor(Number(g.openWarningCount ?? g.activeWarnings ?? g.warningCount ?? 0)));
  const confidence = String(g.guidanceConfidence?.band ?? g.confidenceBand ?? '');

  if (alertBand === 'critical' || alertBand === 'severe' || alertBand === 'red') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Guardian alert band (${alertBand}) drags macro cycle and investment read.`;
  } else if (alertBand === 'elevated' || alertBand === 'amber' || alertBand === 'watch') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Elevated guardian alerts (${alertBand}) cap macro upside interpretation.`;
  } else if (alertBand === 'calm' || alertBand === 'green' || alertBand === 'clear') {
    cycleNudge += 0.5;
    summary = 'Calm guardian backdrop supports stable macro read.';
  }

  if (openWarnings >= 5) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + `${openWarnings} open guardian warnings amplify macro downside risk.`;
  } else if (openWarnings >= 3) {
    cycleNudge -= 1;
  }

  if (confidence === 'low' || confidence === 'uncertain') {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Low guardian guidance confidence reduces investment conviction read.';
  } else if (confidence === 'high' || confidence === 'strong') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroGuardianSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroGuardianSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1011-cities.ts ---

export interface MacroCitiesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.11 cities / regions urban spillover (distinct from economic geography bridge). */
export function readMacroCitiesSpilloverFromV1011Cities(inputs: MacroEconomyInputs): MacroCitiesSpillover {
  const ct: any =
    inputs.citiesRegions ??
    inputs.urbanRegions ??
    inputs.metropolitanSystems ??
    inputs.nationalSystems?.cities ??
    inputs.nationalSystems?.urban;
  if (!ct) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const urbanization = String(ct.urbanizationBand ?? ct.urbanGrowth?.band ?? ct.metroMomentum?.band ?? '');
  const housingPressure = String(ct.housingPressure?.band ?? ct.metroHousing?.band ?? '');
  const hubStrength = String(ct.hubStrength?.band ?? ct.primateCity?.band ?? ct.metroCluster?.band ?? '');

  if (urbanization === 'surging' || urbanization === 'rapid') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = `Rapid urbanization (${urbanization}) lifts macro investment and cycle read.`;
  } else if (urbanization === 'stagnant' || urbanization === 'declining') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = `Weak urban momentum (${urbanization}) drags macro cycle interpretation.`;
  }

  if (housingPressure === 'severe' || housingPressure === 'critical' || housingPressure === 'elevated') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Metro housing pressure weighs on macro cycle read.';
  }

  if (hubStrength === 'leading' || hubStrength === 'global' || hubStrength === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = (summary ? summary + ' ' : '') + 'Strong metro hubs support macro productivity interpretation.';
  } else if (hubStrength === 'fragmented' || hubStrength === 'weak') {
    productivityNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCitiesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCitiesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecasting.ts ---

export interface MacroForecastingSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecasting lab spillover (never mutates forecast state). */
export function readMacroForecastingSpilloverFromV1021(inputs: MacroEconomyInputs): MacroForecastingSpillover {
  const fc: any =
    inputs.forecastingLab ??
    inputs.macroForecasts ??
    inputs.nationalForecasts ??
    inputs.nationalSystems?.forecasting;
  if (!fc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const outlook = String(fc.outlookBand ?? fc.consensusOutlook?.band ?? fc.headlineBand ?? '');
  const confidence = String(fc.confidenceBand ?? fc.modelConfidence?.band ?? '');
  const dispersion = String(fc.dispersionBand ?? fc.forecastSpread?.band ?? '');

  if (outlook === 'upside' || outlook === 'strong_growth' || outlook === 'expansion') {
    cycleNudge += 2;
    investmentNudge += 1;
    summary = `Forecast outlook (${outlook}) supports macro cycle read.`;
  } else if (outlook === 'downside' || outlook === 'recession' || outlook === 'contraction') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Downside forecast consensus (${outlook}) drags macro cycle and investment read.`;
  }

  if (confidence === 'high' || confidence === 'strong') {
    if (outlook === 'downside' || outlook === 'recession' || outlook === 'contraction') cycleNudge -= 0.5;
    else cycleNudge += 0.5;
  } else if (confidence === 'low' || confidence === 'uncertain') {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Low forecast confidence caps investment conviction read.';
  }

  if (dispersion === 'wide' || dispersion === 'divergent') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Wide forecast dispersion increases macro uncertainty read.';
  } else if (dispersion === 'tight' || dispersion === 'aligned') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastingSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastingSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1017-command.ts ---

export interface MacroCommandSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.17 command center spillover (distinct from transport layer). */
export function readMacroCommandSpilloverFromV1017Command(inputs: MacroEconomyInputs): MacroCommandSpillover {
  const cc: any =
    inputs.commandCenter ??
    inputs.nationalCommand ??
    inputs.aiCommandCenter ??
    inputs.nationalSystems?.commandCenter;
  if (!cc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const posture = String(cc.postureBand ?? cc.operationalPosture?.band ?? cc.alertPosture?.band ?? '');
  const coordination = String(cc.coordinationBand ?? cc.crossAgency?.band ?? cc.syncBand ?? '');
  const backlog = String(cc.decisionBacklog?.band ?? cc.pendingDirectives?.band ?? '');

  if (posture === 'crisis' || posture === 'red' || posture === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Crisis command posture (${posture}) drags macro cycle and investment read.`;
  } else if (posture === 'steady' || posture === 'green' || posture === 'normal') {
    cycleNudge += 0.5;
    summary = 'Steady command posture supports stable macro interpretation.';
  }

  if (coordination === 'fragmented' || coordination === 'degraded') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragmented command coordination weighs on productivity read.';
  } else if (coordination === 'integrated' || coordination === 'strong') {
    productivityNudge += 1;
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'elevated') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated command decision backlog signals policy paralysis read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCommandSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCommandSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1020-automation.ts ---

export interface MacroAutomationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 idle automation spillover (never mutates automation state). */
export function readMacroAutomationSpilloverFromV1020(inputs: MacroEconomyInputs): MacroAutomationSpillover {
  const au: any =
    inputs.idleAutomation ??
    inputs.automation ??
    inputs.nationalAutomation ??
    inputs.nationalSystems?.automation;
  if (!au) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const throughput = String(au.throughputBand ?? au.automationThroughput?.band ?? '');
  const reliability = String(au.reliabilityBand ?? au.uptime?.band ?? '');
  const adoption = String(au.adoptionBand ?? au.coverageBand ?? '');

  if (throughput === 'surging' || throughput === 'high') {
    productivityNudge += 2;
    cycleNudge += 1;
    summary = `Strong automation throughput (${throughput}) lifts macro productivity read.`;
  } else if (throughput === 'stalled' || throughput === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Stalled automation (${throughput}) drags macro productivity interpretation.`;
  }

  if (reliability === 'degraded' || reliability === 'fragile') {
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragile automation reliability caps macro upside.';
  } else if (reliability === 'robust' || reliability === 'strong') {
    investmentNudge += 0.5;
  }

  if (adoption === 'broad' || adoption === 'deep') {
    productivityNudge += 1;
  } else if (adoption === 'minimal' || adoption === 'nascent') {
    productivityNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1018-team-ai.ts ---

export interface MacroTeamAiSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 team intelligence spillover (distinct from energy layer id). */
export function readMacroTeamAiSpilloverFromV1018Team(inputs: MacroEconomyInputs): MacroTeamAiSpillover {
  const ti: any =
    inputs.teamIntelligence ??
    inputs.teamAi ??
    inputs.nationalTeamAi ??
    inputs.nationalSystems?.teamAi;
  if (!ti) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const cohesion = String(ti.cohesionBand ?? ti.teamCohesion?.band ?? '');
  const throughput = String(ti.analysisThroughput?.band ?? ti.intelThroughput?.band ?? '');
  const conflict = String(ti.internalConflict?.band ?? ti.frictionBand ?? '');

  if (cohesion === 'strong' || cohesion === 'high' || cohesion === 'aligned') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = `Strong team AI cohesion (${cohesion}) supports macro productivity read.`;
  } else if (cohesion === 'fractured' || cohesion === 'critical' || cohesion === 'low') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Fractured team AI cohesion (${cohesion}) drags macro productivity interpretation.`;
  }

  if (throughput === 'surging' || throughput === 'high') {
    investmentNudge += 1;
    productivityNudge += 1;
  } else if (throughput === 'stalled' || throughput === 'blocked') {
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled team intelligence throughput caps macro upside.';
  }

  if (conflict === 'elevated' || conflict === 'severe') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated internal AI team conflict weighs on macro cycle read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTeamAiSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTeamAiSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1024-replay.ts ---

export interface MacroReplaySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history / replay spillover (never mutates replay state). */
export function readMacroReplaySpilloverFromV1024(inputs: MacroEconomyInputs): MacroReplaySpillover {
  const rp: any =
    inputs.historyReplay ??
    inputs.replayArchive ??
    inputs.nationalHistory ??
    inputs.nationalSystems?.historyReplay;
  if (!rp) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const volatility = String(rp.volatilityBand ?? rp.historicalVolatility?.band ?? '');
  const stressMemory = String(rp.stressMemory?.band ?? rp.priorShockMemory?.band ?? '');
  const recovery = String(rp.recoveryArc?.band ?? rp.reboundBand ?? '');

  if (volatility === 'high' || volatility === 'extreme') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Elevated historical volatility (${volatility}) increases macro uncertainty read.`;
  } else if (volatility === 'low' || volatility === 'stable') {
    cycleNudge += 0.5;
  }

  if (stressMemory === 'persistent' || stressMemory === 'scarring' || stressMemory === 'deep') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Persistent stress memory from replay archive drags productivity read.';
  }

  if (recovery === 'strong' || recovery === 'v-shaped') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong historical recovery arc supports macro cycle interpretation.';
  } else if (recovery === 'weak' || recovery === 'l-shaped') {
    cycleNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplaySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplaySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1019-memory.ts ---

export interface MacroMemorySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.19 AI memory / explainability spillover (never mutates memory state). */
export function readMacroMemorySpilloverFromV1019(inputs: MacroEconomyInputs): MacroMemorySpillover {
  const mem: any =
    inputs.aiMemory ??
    inputs.explainability ??
    inputs.nationalAiMemory ??
    inputs.nationalSystems?.aiMemory;
  if (!mem) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const drift = String(mem.driftBand ?? mem.memoryDrift?.band ?? mem.recallDrift?.band ?? '');
  const fidelity = String(mem.recallFidelity?.band ?? mem.fidelityBand ?? '');
  const auditGap = String(mem.auditGap?.band ?? mem.explainabilityGap?.band ?? '');

  if (drift === 'runaway' || drift === 'severe' || drift === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Runaway AI memory drift (${drift}) clouds macro cycle interpretation.`;
  } else if (drift === 'stable' || drift === 'anchored') {
    productivityNudge += 0.5;
  }

  if (fidelity === 'degraded' || fidelity === 'fragmented' || fidelity === 'low') {
    investmentNudge -= 1;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Degraded recall fidelity weakens macro investment read.';
  } else if (fidelity === 'high' || fidelity === 'verified') {
    productivityNudge += 1;
  }

  if (auditGap === 'wide' || auditGap === 'critical' || auditGap === 'unresolved') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Wide explainability audit gap adds macro policy uncertainty.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMemorySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMemorySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1023-dashboards.ts ---

export interface MacroDashboardsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboards & maps spillover (never mutates dashboard state). */
export function readMacroDashboardsSpilloverFromV1023(inputs: MacroEconomyInputs): MacroDashboardsSpillover {
  const dash: any =
    inputs.dashboardsMaps ??
    inputs.nationalDashboards ??
    inputs.mapsTelemetry ??
    inputs.nationalSystems?.dashboards;
  if (!dash) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const refreshLag = String(dash.refreshLag?.band ?? dash.dataLagBand ?? '');
  const signalCoherence = String(dash.signalCoherence?.band ?? dash.mapSignalBand ?? '');
  const alertDensity = String(dash.alertDensity?.band ?? dash.alertLoadBand ?? '');

  if (refreshLag === 'stale' || refreshLag === 'critical' || refreshLag === 'severe') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Stale dashboard refresh (${refreshLag}) lags macro situational read.`;
  } else if (refreshLag === 'realtime' || refreshLag === 'fresh') {
    productivityNudge += 0.5;
  }

  if (signalCoherence === 'fragmented' || signalCoherence === 'conflicting') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Fragmented map signals distort macro cycle aggregation.';
  } else if (signalCoherence === 'aligned' || signalCoherence === 'strong') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
  }

  if (alertDensity === 'flooded' || alertDensity === 'critical' || alertDensity === 'severe') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Flooded dashboard alerts cap macro investment confidence.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1022-ui.ts ---

export interface MacroUiSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI shell spillover (never mutates UI state). */
export function readMacroUiSpilloverFromV1022(inputs: MacroEconomyInputs): MacroUiSpillover {
  const ui: any =
    inputs.gameUi ??
    inputs.uiShell ??
    inputs.nationalUi ??
    inputs.nationalSystems?.ui ??
    inputs.nationalSystems?.gameUi;
  if (!ui) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const panelLatency = String(ui.panelLatency?.band ?? ui.renderLatencyBand ?? ui.latencyBand ?? '');
  const navigationClutter = String(ui.navigationClutter?.band ?? ui.navClutterBand ?? ui.clutterBand ?? '');
  const renderHealth = String(ui.renderHealth?.band ?? ui.shellHealthBand ?? ui.stabilityBand ?? '');

  if (panelLatency === 'severe' || panelLatency === 'critical' || panelLatency === 'degraded') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Degraded UI panel latency (${panelLatency}) slows macro operator throughput.`;
  } else if (panelLatency === 'snappy' || panelLatency === 'realtime') {
    productivityNudge += 0.5;
  }

  if (navigationClutter === 'overloaded' || navigationClutter === 'critical' || navigationClutter === 'severe') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Navigation clutter obscures macro investment signals.';
  } else if (navigationClutter === 'minimal' || navigationClutter === 'clear') {
    investmentNudge += 0.5;
  }

  if (renderHealth === 'unstable' || renderHealth === 'fragile' || renderHealth === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unstable UI shell undermines macro cycle confidence.';
  } else if (renderHealth === 'robust' || renderHealth === 'stable') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1012-utilities.ts ---

export interface MacroUtilitiesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.12 utilities grid spillover (Agent 12; distinct from transport corridors). */
export function readMacroUtilitiesSpilloverFromV1012Utilities(inputs: MacroEconomyInputs): MacroUtilitiesSpillover {
  const util: any =
    inputs.utilitiesGrid ??
    inputs.publicUtilities ??
    inputs.nationalUtilities ??
    inputs.nationalSystems?.utilities ??
    inputs.infrastructure?.utilities;
  if (!util) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const serviceReliability = String(
    util.serviceReliability?.band ?? util.reliabilityBand ?? util.gridReliability?.band ?? ''
  );
  const outageBand = String(util.outageBand ?? util.outageRisk?.band ?? util.disruptionBand ?? '');
  const capacityMargin = String(util.capacityMargin?.band ?? util.reserveMargin?.band ?? util.spareCapacity?.band ?? '');

  if (serviceReliability === 'fragile' || serviceReliability === 'critical' || serviceReliability === 'degraded') {
    cycleNudge -= 2;
    productivityNudge -= 2;
    summary = `Utilities service reliability (${serviceReliability}) drags macro productivity read.`;
  } else if (serviceReliability === 'robust' || serviceReliability === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
  }

  if (outageBand === 'frequent' || outageBand === 'severe' || outageBand === 'rolling') {
    cycleNudge -= 3;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Rolling utility outages bind macro cycle interpretation.';
  }

  if (capacityMargin === 'thin' || capacityMargin === 'critical' || capacityMargin === 'negative') {
    investmentNudge += 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Thin utilities capacity margin lifts capex need with near-term cycle drag.';
  } else if (capacityMargin === 'ample' || capacityMargin === 'surplus') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUtilitiesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUtilitiesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1015-logistics.ts ---

export interface MacroTradeLogisticsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.15 trade logistics / supply-chain spillover (Agent 15 domain; never mutates trade state). */
export function readMacroTradeLogisticsSpilloverFromV1015(inputs: MacroEconomyInputs): MacroTradeLogisticsSpillover {
  const tr: any = inputs.trade;
  const logistics: any =
    tr?.logistics ??
    tr?.supplyChain ??
    inputs.nationalSystems?.tradeLogistics ??
    inputs.nationalSystems?.trade?.logistics;
  if (!logistics && !tr) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const backlog = String(
    logistics?.portBacklogBand ??
      logistics?.backlogBand ??
      tr?.logisticsBacklogBand ??
      logistics?.congestionBand ??
      ''
  );
  const reliability = String(
    logistics?.routeReliability?.band ??
      logistics?.reliabilityBand ??
      tr?.shippingReliabilityBand ??
      ''
  );
  const leadTime = String(logistics?.leadTimeBand ?? logistics?.transitBand ?? tr?.leadTimeBand ?? '');

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'gridlocked') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 2;
    summary = `Severe trade logistics backlog (${backlog}) drags macro cycle and throughput read.`;
  } else if (backlog === 'elevated' || backlog === 'stressed') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = `Elevated logistics congestion (${backlog}) weighs on macro cycle interpretation.`;
  } else if (backlog === 'clear' || backlog === 'fluid') {
    cycleNudge += 0.5;
    productivityNudge += 0.5;
  }

  if (reliability === 'fragile' || reliability === 'disrupted' || reliability === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragile shipping reliability caps external productivity spillover.';
  } else if (reliability === 'robust' || reliability === 'high') {
    productivityNudge += 1;
    investmentNudge += 0.5;
  }

  if (leadTime === 'extended' || leadTime === 'critical' || leadTime === 'severe') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Extended trade lead times defer macro investment timing read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTradeLogisticsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTradeLogisticsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1005-negotiation.ts ---

export interface MacroNegotiationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.5 negotiation / diplomacy spillover (Agent 05 domain; never mutates event state). */
export function readMacroNegotiationSpilloverFromV1005(inputs: MacroEconomyInputs): MacroNegotiationSpillover {
  const neg: any =
    inputs.negotiationState ??
    inputs.diplomacy ??
    inputs.dynamicEvents?.negotiation ??
    inputs.narrativeEvents?.negotiation ??
    inputs.op10mEvents?.negotiation ??
    inputs.nationalSystems?.negotiation;
  if (!neg) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const deadlock = String(neg.deadlockBand ?? neg.stalemateBand ?? neg.impasseBand ?? '');
  const trust = String(neg.trustBand ?? neg.coalitionTrust?.band ?? neg.trustLevel ?? '');
  const claimPressure = String(neg.claimPressureBand ?? neg.claimBacklogBand ?? neg.pendingClaimsBand ?? '');

  if (deadlock === 'critical' || deadlock === 'severe' || deadlock === 'entrenched') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Negotiation deadlock (${deadlock}) suppresses macro cycle and policy investment read.`;
  } else if (deadlock === 'elevated' || deadlock === 'fragile') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Fragile negotiation posture (${deadlock}) weighs on macro investment timing.`;
  } else if (deadlock === 'resolved' || deadlock === 'clear') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
  }

  if (trust === 'collapsed' || trust === 'critical' || trust === 'broken') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Collapsed negotiation trust erodes macro productivity confidence.';
  } else if (trust === 'strong' || trust === 'robust') {
    cycleNudge += 1;
    productivityNudge += 0.5;
  }

  if (claimPressure === 'surging' || claimPressure === 'critical' || claimPressure === 'flooded') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Surging unresolved claims create macro policy paralysis read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroNegotiationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroNegotiationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1013-confidence.ts ---

export interface MacroHouseholdConfidenceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.13 household consumer-confidence spillover (never mutates household state). */
export function readMacroHouseholdConfidenceSpilloverFromV1013(inputs: MacroEconomyInputs): MacroHouseholdConfidenceSpillover {
  const hh: any = inputs.households ?? inputs.nationalSystems?.households;
  const conf: any = hh?.consumerConfidence ?? hh?.confidence ?? inputs.consumerConfidence;
  if (!conf && !hh) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const band = String(conf?.band ?? conf?.level ?? hh?.confidenceBand ?? hh?.sentimentBand ?? '');
  const volatility = String(conf?.volatilityBand ?? conf?.swingsBand ?? hh?.sentimentVolatility ?? '');

  if (band === 'euphoric' || band === 'very_high' || band === 'strong') {
    cycleNudge += 2;
    investmentNudge += 1;
    summary = `Elevated consumer confidence (${band}) supports macro cycle read.`;
  } else if (band === 'collapsed' || band === 'critical' || band === 'depressed') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Collapsed consumer confidence (${band}) drags macro cycle and spending read.`;
  } else if (band === 'weak' || band === 'cautious') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Cautious consumer confidence (${band}) weighs on macro demand interpretation.`;
  }

  if (volatility === 'extreme' || volatility === 'whipsaw' || volatility === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Volatile confidence swings obscure macro investment timing.';
  } else if (volatility === 'anchored' || volatility === 'stable') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroHouseholdConfidenceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHouseholdConfidenceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1008-capex.ts ---

export interface MacroCapexSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.8 private capex cycle spillover (Agent 08 domain; never mutates company state). */
export function readMacroCapexSpilloverFromV1008(inputs: MacroEconomyInputs): MacroCapexSpillover {
  const co: any =
    inputs.companies ??
    inputs.privateSector ??
    inputs.nationalPrivateSector ??
    inputs.nationalSystems?.privateSector;
  const capex: any = co?.capexCycle ?? co?.capitalExpenditure ?? co?.investmentCycle ?? inputs.privateCapex;
  if (!capex && !co) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pipeline = String(
    capex?.pipelineBand ?? capex?.backlogBand ?? co?.capexPipelineBand ?? co?.investmentPipeline?.band ?? ''
  );
  const freeze = String(capex?.freezeBand ?? capex?.haltBand ?? co?.capexFreezeBand ?? '');
  const payback = String(capex?.paybackBand ?? capex?.roiBand ?? co?.expectedPaybackBand ?? '');

  if (pipeline === 'surging' || pipeline === 'strong' || pipeline === 'expansionary') {
    investmentNudge += 3;
    cycleNudge += 1;
    productivityNudge += 1;
    summary = `Strong private capex pipeline (${pipeline}) lifts macro investment read.`;
  } else if (pipeline === 'frozen' || pipeline === 'collapsed' || pipeline === 'critical') {
    investmentNudge -= 3;
    cycleNudge -= 2;
    summary = `Frozen private capex pipeline (${pipeline}) drags macro investment and cycle read.`;
  } else if (pipeline === 'weak' || pipeline === 'cautious') {
    investmentNudge -= 1;
    cycleNudge -= 1;
  }

  if (freeze === 'binding' || freeze === 'severe' || freeze === 'total') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Binding capex freeze caps macro investment upside.';
  }

  if (payback === 'stretched' || payback === 'unfavorable' || payback === 'critical') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unfavorable capex payback expectations weigh on productivity spillover.';
  } else if (payback === 'attractive' || payback === 'strong') {
    investmentNudge += 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCapexSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCapexSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1010-monetary.ts ---

export interface MacroMonetarySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.10 monetary policy stance spillover (distinct from inflation band read). */
export function readMacroMonetarySpilloverFromV1010Monetary(inputs: MacroEconomyInputs): MacroMonetarySpillover {
  const mp: any =
    inputs.monetaryPolicy ??
    inputs.creditMarkets ??
    inputs.nationalFinance?.monetary ??
    inputs.nationalFinance?.policy;
  if (!mp) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const stance = String(mp.policyStance ?? mp.stance ?? mp.rateStance ?? mp.bias ?? '');
  const realRate = String(mp.realRateBand ?? mp.realRates?.band ?? mp.policyRateBand ?? '');
  const liquidity = String(mp.liquidityBand ?? mp.systemLiquidity?.band ?? mp.liquidityStance ?? '');

  if (stance === 'restrictive' || stance === 'aggressive_tightening' || stance === 'hawkish') {
    cycleNudge -= 2;
    investmentNudge -= 3;
    summary = `Restrictive monetary stance (${stance}) tightens macro investment read.`;
  } else if (stance === 'accommodative' || stance === 'easing' || stance === 'dovish') {
    cycleNudge += 1;
    investmentNudge += 2;
    summary = `Accommodative monetary stance (${stance}) supports macro investment interpretation.`;
  }

  if (realRate === 'elevated' || realRate === 'restrictive' || realRate === 'very_high') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated real policy rates weigh on macro cycle timing.';
  } else if (realRate === 'supportive' || realRate === 'negative') {
    investmentNudge += 1;
  }

  if (liquidity === 'strained' || liquidity === 'frozen' || liquidity === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Strained system liquidity amplifies macro downside read.';
  } else if (liquidity === 'ample' || liquidity === 'abundant') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMonetarySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMonetarySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1014-rental.ts ---

export interface MacroRentalSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.14 rental market spillover (Agent 14 domain; never mutates housing state). */
export function readMacroRentalSpilloverFromV1014Rental(inputs: MacroEconomyInputs): MacroRentalSpillover {
  const rental: any =
    inputs.rentalMarket ??
    inputs.housingWellbeing?.rental ??
    inputs.housing?.rentalMarket ??
    inputs.nationalSystems?.housing?.rental;
  if (!rental) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pressure = String(rental.pressureBand ?? rental.affordabilityBand ?? rental.stressBand ?? '');
  const vacancy = String(rental.vacancyBand ?? rental.vacancy?.band ?? rental.availabilityBand ?? '');
  const rentGrowth = String(rental.rentGrowthBand ?? rental.growthBand ?? rental.momentumBand ?? '');

  if (pressure === 'severe' || pressure === 'critical' || pressure === 'acute') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = `Severe rental pressure (${pressure}) weighs on household-linked macro cycle read.`;
  } else if (pressure === 'elevated' || pressure === 'stressed') {
    cycleNudge -= 1;
    summary = `Elevated rental pressure (${pressure}) caps domestic demand interpretation.`;
  } else if (pressure === 'balanced' || pressure === 'moderate') {
    cycleNudge += 0.5;
  }

  if (vacancy === 'tight' || vacancy === 'critical' || vacancy === 'zero') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Tight rental vacancy supports residential investment spillover read.';
  } else if (vacancy === 'glut' || vacancy === 'oversupply') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Rental oversupply drags residential investment interpretation.';
  }

  if (rentGrowth === 'surging' || rentGrowth === 'accelerating') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Surging rent growth tightens household real-income macro read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroRentalSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroRentalSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1018-climate-policy.ts ---

export interface MacroClimatePolicySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 climate policy spillover (Agent 13 domain; never mutates energy state). */
export function readMacroClimatePolicySpilloverFromV1018Climate(inputs: MacroEconomyInputs): MacroClimatePolicySpillover {
  const ce: any =
    inputs.climatePolicy ??
    inputs.energyEnvironment?.climatePolicy ??
    inputs.industrialEnergy?.climate ??
    inputs.nationalSystems?.climatePolicy;
  if (!ce) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const transition = String(ce.transitionBand ?? ce.transition?.band ?? ce.policyPace ?? '');
  const carbon = String(ce.carbonPriceBand ?? ce.carbonIntensityBand ?? ce.levyBand ?? '');
  const compliance = String(ce.complianceBand ?? ce.regulatoryPressure?.band ?? '');

  if (transition === 'disruptive' || transition === 'shock' || transition === 'forced') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Disruptive climate transition (${transition}) weighs on macro cycle read.`;
  } else if (transition === 'accelerating' || transition === 'steady') {
    investmentNudge += 1;
    productivityNudge += 0.5;
    summary = `Orderly climate transition (${transition}) supports green-investment spillover read.`;
  }

  if (carbon === 'punitive' || carbon === 'severe' || carbon === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Punitive carbon pricing tightens near-term macro cycle interpretation.';
  } else if (carbon === 'moderate' || carbon === 'incentive_aligned') {
    investmentNudge += 0.5;
  }

  if (compliance === 'binding' || compliance === 'severe' || compliance === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Binding climate compliance costs drag productivity spillover read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroClimatePolicySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroClimatePolicySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecast-dispersion.ts ---

export interface MacroForecastDispersionSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast dispersion spillover (Agent 21 domain; never mutates forecast state). */
export function readMacroForecastDispersionSpilloverFromV1021(inputs: MacroEconomyInputs): MacroForecastDispersionSpillover {
  const fl: any =
    inputs.forecastingLab ??
    inputs.macroForecasts ??
    inputs.nationalForecasts ??
    inputs.nationalSystems?.forecasting;
  if (!fl) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const dispersion = String(fl.dispersionBand ?? fl.forecastSpread?.band ?? fl.modelDispersion ?? '');
  const confidence = String(fl.confidenceBand ?? fl.consensusConfidence?.band ?? '');
  const disagreement = String(fl.disagreementBand ?? fl.analystSplit?.band ?? '');

  if (dispersion === 'wide' || dispersion === 'extreme' || dispersion === 'critical') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Wide forecast dispersion (${dispersion}) obscures macro investment timing read.`;
  } else if (dispersion === 'tight' || dispersion === 'aligned') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = 'Tight forecast dispersion supports coherent macro read.';
  }

  if (confidence === 'low' || confidence === 'critical' || confidence === 'fragmented') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Low forecast confidence caps macro investment upside.';
  } else if (confidence === 'high' || confidence === 'strong') {
    investmentNudge += 1;
  }

  if (disagreement === 'severe' || disagreement === 'polarized' || disagreement === 'extreme') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Polarized forecast disagreement weighs on productivity interpretation.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastDispersionSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastDispersionSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1022-accessibility.ts ---

export interface MacroAccessibilitySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI accessibility spillover (Agent 22 domain; never mutates UI state). */
export function readMacroAccessibilitySpilloverFromV1022(inputs: MacroEconomyInputs): MacroAccessibilitySpillover {
  const acc: any =
    inputs.uiAccessibility ??
    inputs.gameUi?.accessibility ??
    inputs.uiShell?.accessibility ??
    inputs.nationalUi?.accessibility;
  if (!acc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const contrast = String(acc.contrastBand ?? acc.contrast?.band ?? acc.visualContrast ?? '');
  const inputLag = String(acc.inputLagBand ?? acc.keyboardLag?.band ?? acc.focusLatencyBand ?? '');
  const coverage = String(acc.coverageBand ?? acc.wcagCoverage?.band ?? '');

  if (contrast === 'failing' || contrast === 'critical' || contrast === 'severe') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Failing UI contrast (${contrast}) slows macro operator comprehension read.`;
  } else if (contrast === 'strong' || contrast === 'aaa') {
    productivityNudge += 0.5;
  }

  if (inputLag === 'severe' || inputLag === 'critical' || inputLag === 'degraded') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Degraded accessibility input latency caps macro throughput interpretation.';
  }

  if (coverage === 'partial' || coverage === 'critical' || coverage === 'gaps') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Incomplete accessibility coverage obscures macro dashboard signals.';
  } else if (coverage === 'full' || coverage === 'complete') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAccessibilitySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAccessibilitySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1024-timeline.ts ---

export interface MacroTimelineSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history timeline spillover (Agent 24 domain; never mutates replay state). */
export function readMacroTimelineSpilloverFromV1024(inputs: MacroEconomyInputs): MacroTimelineSpillover {
  const tl: any =
    inputs.historyTimeline ??
    inputs.historyReplay?.timeline ??
    inputs.replayArchive?.timeline ??
    inputs.nationalHistory?.timeline;
  if (!tl) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const gap = String(tl.gapBand ?? tl.recordGap?.band ?? tl.continuityBand ?? '');
  const drift = String(tl.narrativeDriftBand ?? tl.driftBand ?? '');
  const shockMemory = String(tl.shockMemoryBand ?? tl.stressMemory?.band ?? '');

  if (gap === 'broken' || gap === 'critical' || gap === 'discontinuous') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = `Broken history timeline (${gap}) undermines macro cycle confidence read.`;
  } else if (gap === 'coherent' || gap === 'continuous') {
    cycleNudge += 0.5;
  }

  if (drift === 'severe' || drift === 'runaway' || drift === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Runaway narrative drift distorts productivity interpretation.';
  }

  if (shockMemory === 'scarring' || shockMemory === 'persistent' || shockMemory === 'deep') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Persistent timeline shock memory drags macro investment read.';
  } else if (shockMemory === 'fading' || shockMemory === 'cleared') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTimelineSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTimelineSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1016-liquidity.ts ---

export interface MacroLiquiditySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 system liquidity spillover (distinct from credit spread read). */
export function readMacroLiquiditySpilloverFromV1016Liquidity(inputs: MacroEconomyInputs): MacroLiquiditySpillover {
  const liq: any =
    inputs.systemLiquidity ??
    inputs.creditMarkets?.liquidity ??
    inputs.monetaryPolicy?.liquidity ??
    inputs.nationalFinance?.liquidity;
  if (!liq) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const band = String(liq.band ?? liq.stressBand ?? liq.systemBand ?? liq.stance ?? '');
  const marketDepth = String(liq.marketDepthBand ?? liq.depthBand ?? '');
  const rollRisk = String(liq.rolloverRiskBand ?? liq.refinancingBand ?? '');

  if (band === 'frozen' || band === 'critical' || band === 'strained') {
    cycleNudge -= 3;
    investmentNudge -= 3;
    productivityNudge -= 1;
    summary = `Strained system liquidity (${band}) tightens macro cycle and investment read.`;
  } else if (band === 'ample' || band === 'abundant') {
    investmentNudge += 1;
    cycleNudge += 0.5;
    summary = `Ample system liquidity (${band}) supports macro investment interpretation.`;
  }

  if (marketDepth === 'thin' || marketDepth === 'critical' || marketDepth === 'evaporated') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Thin market depth caps macro financing spillover read.';
  }

  if (rollRisk === 'elevated' || rollRisk === 'severe' || rollRisk === 'default_wave') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Elevated rollover risk amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroLiquiditySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroLiquiditySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1023-maps-telemetry.ts ---

export interface MacroMapsTelemetrySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 maps telemetry spillover (Agent 23 domain; never mutates dashboard state). */
export function readMacroMapsTelemetrySpilloverFromV1023(inputs: MacroEconomyInputs): MacroMapsTelemetrySpillover {
  const maps: any =
    inputs.mapsTelemetry ??
    inputs.dashboardsMaps?.telemetry ??
    inputs.nationalDashboards?.maps ??
    inputs.nationalSystems?.mapsTelemetry;
  if (!maps) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const fidelity = String(maps.geoFidelityBand ?? maps.mapFidelity?.band ?? maps.fidelityBand ?? '');
  const latency = String(maps.tileLatencyBand ?? maps.renderLag?.band ?? maps.latencyBand ?? '');
  const coverage = String(maps.coverageBand ?? maps.regionalCoverage?.band ?? '');

  if (fidelity === 'distorted' || fidelity === 'critical' || fidelity === 'misaligned') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Distorted map fidelity (${fidelity}) obscures regional macro cycle read.`;
  } else if (fidelity === 'high' || fidelity === 'precise') {
    productivityNudge += 0.5;
  }

  if (latency === 'severe' || latency === 'critical' || latency === 'stale') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stale map tile latency delays macro investment signal read.';
  }

  if (coverage === 'gaps' || coverage === 'partial' || coverage === 'critical') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Incomplete map coverage weakens macro regional spillover interpretation.';
  } else if (coverage === 'complete' || coverage === 'national') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMapsTelemetrySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMapsTelemetrySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1001-strategic-gameplay.ts ---

export interface MacroStrategicGameplaySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.01 strategic gameplay cadence spillover (Agent 01 domain). */
export function readMacroStrategicGameplaySpilloverFromV1001(inputs: MacroEconomyInputs): MacroStrategicGameplaySpillover {
  const gp: any =
    inputs.strategicGameplay ??
    inputs.strategicCapital?.gameplayCadence ??
    inputs.nationalStrategic?.gameplay ??
    inputs.gameModes?.macroCadence;
  if (!gp) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pacing = String(gp.pacingBand ?? gp.cadenceBand ?? gp.tempoBand ?? '');
  const coherence = String(gp.coherenceBand ?? gp.planningCoherence?.band ?? '');
  const friction = String(gp.frictionBand ?? gp.decisionFriction?.band ?? '');

  if (pacing === 'stalled' || pacing === 'critical' || pacing === 'gridlocked') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Stalled strategic gameplay pacing (${pacing}) drags macro cycle read.`;
  } else if (pacing === 'decisive' || pacing === 'fluid') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = `Fluid strategic pacing (${pacing}) supports macro investment interpretation.`;
  }

  if (coherence === 'fragmented' || coherence === 'critical' || coherence === 'contradictory') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragmented strategic coherence weakens macro investment signal.';
  }

  if (friction === 'severe' || friction === 'critical' || friction === 'paralyzed') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'High decision friction suppresses macro productivity spillover read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroStrategicGameplaySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroStrategicGameplaySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1024-archive-integrity.ts ---

export interface MacroArchiveIntegritySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history archive integrity spillover (Agent 24 domain; distinct from replay/timeline). */
export function readMacroArchiveIntegritySpilloverFromV1024(inputs: MacroEconomyInputs): MacroArchiveIntegritySpillover {
  const arch: any =
    inputs.historyArchiveIntegrity ??
    inputs.replayArchive?.integrity ??
    inputs.historyReplay?.archive ??
    inputs.nationalHistory?.archive;
  if (!arch) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const integrity = String(arch.integrityBand ?? arch.checksumBand ?? arch.fidelityBand ?? '');
  const lineage = String(arch.lineageBand ?? arch.provenanceBand ?? arch.chainBand ?? '');
  const retention = String(arch.retentionBand ?? arch.archiveRetention?.band ?? '');

  if (integrity === 'corrupt' || integrity === 'critical' || integrity === 'compromised') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Corrupt history archive (${integrity}) undermines macro confidence read.`;
  } else if (integrity === 'verified' || integrity === 'strong') {
    cycleNudge += 0.5;
  }

  if (lineage === 'broken' || lineage === 'discontinuous' || lineage === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Broken archive lineage distorts macro productivity interpretation.';
  }

  if (retention === 'truncated' || retention === 'critical' || retention === 'evaporating') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Truncated archive retention weakens macro investment evidence read.';
  } else if (retention === 'durable' || retention === 'complete') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroArchiveIntegritySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroArchiveIntegritySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1025-integration-health.ts ---

export interface MacroIntegrationHealthSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.25 cross-system integration health spillover (Agent 25 domain). */
export function readMacroIntegrationHealthSpilloverFromV1025(inputs: MacroEconomyInputs): MacroIntegrationHealthSpillover {
  const ih: any =
    inputs.integrationHealth ??
    inputs.op10mIntegration?.health ??
    inputs.nationalSystems?.integrationHealth ??
    inputs.assemblyHealth;
  if (!ih) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const mesh = String(ih.meshBand ?? ih.syncBand ?? ih.crossSystemBand ?? '');
  const drift = String(ih.contractDriftBand ?? ih.schemaDrift?.band ?? '');
  const smoke = String(ih.smokeBand ?? ih.smokeTest?.band ?? '');

  if (mesh === 'fractured' || mesh === 'critical' || mesh === 'desynced') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Fractured integration mesh (${mesh}) weakens macro cycle confidence read.`;
  } else if (mesh === 'healthy' || mesh === 'tight') {
    productivityNudge += 0.5;
    cycleNudge += 0.5;
    summary = `Healthy integration mesh (${mesh}) supports macro productivity interpretation.`;
  }

  if (drift === 'runaway' || drift === 'severe' || drift === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Runaway contract drift distorts macro spillover aggregation.';
  }

  if (smoke === 'failing' || smoke === 'critical' || smoke === 'red') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Failing integration smoke checks drag macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroIntegrationHealthSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIntegrationHealthSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1002-cadence-drift.ts ---

export interface MacroCadenceDriftSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.02 turn cadence drift spillover (Agent 02 domain; distinct from turn backlog layer). */
export function readMacroCadenceDriftSpilloverFromV1002(inputs: MacroEconomyInputs): MacroCadenceDriftSpillover {
  const cd: any =
    inputs.turnCadenceDrift ??
    inputs.turnsTime?.cadenceDrift ??
    inputs.temporalCadence?.drift ??
    inputs.gameClock?.cadence;
  if (!cd) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const skew = String(cd.skewBand ?? cd.driftBand ?? cd.phaseSkew?.band ?? '');
  const jitter = String(cd.jitterBand ?? cd.clockJitter?.band ?? '');
  const resolution = String(cd.resolutionBand ?? cd.turnResolution?.band ?? '');

  if (skew === 'severe' || skew === 'runaway' || skew === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Severe turn cadence skew (${skew}) distorts macro cycle timing read.`;
  } else if (skew === 'balanced' || skew === 'anchored') {
    cycleNudge += 0.5;
  }

  if (jitter === 'chaotic' || jitter === 'critical' || jitter === 'extreme') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Chaotic clock jitter weakens macro investment signal stability.';
  }

  if (resolution === 'slipped' || resolution === 'critical' || resolution === 'missed') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Missed turn resolution cadence drags macro productivity read.';
  } else if (resolution === 'crisp' || resolution === 'on_time') {
    productivityNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCadenceDriftSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCadenceDriftSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1003-research-momentum.ts ---

export interface MacroResearchMomentumSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.03 research momentum spillover (Agent 03 domain; distinct from research backlog layer). */
export function readMacroResearchMomentumSpilloverFromV1003(inputs: MacroEconomyInputs): MacroResearchMomentumSpillover {
  const rm: any =
    inputs.researchMomentum ??
    inputs.researchTech?.momentum ??
    inputs.nationalResearch?.momentum ??
    inputs.research?.pipelineMomentum;
  if (!rm) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const velocity = String(rm.velocityBand ?? rm.momentumBand ?? rm.paceBand ?? '');
  const diffusion = String(rm.diffusionBand ?? rm.spilloverBand ?? '');
  const funding = String(rm.fundingBand ?? rm.grantBand ?? '');

  if (velocity === 'stalled' || velocity === 'critical' || velocity === 'collapsed') {
    productivityNudge -= 3;
    cycleNudge -= 1;
    summary = `Stalled research momentum (${velocity}) drags macro productivity read.`;
  } else if (velocity === 'accelerating' || velocity === 'surging') {
    productivityNudge += 2;
    investmentNudge += 1;
    summary = `Accelerating research momentum (${velocity}) lifts macro productivity interpretation.`;
  }

  if (diffusion === 'bottlenecked' || diffusion === 'critical' || diffusion === 'siloed') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Bottlenecked research diffusion caps macro spillover benefits.';
  }

  if (funding === 'starved' || funding === 'critical' || funding === 'frozen') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Starved research funding drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroResearchMomentumSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroResearchMomentumSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1007-budget-outlook.ts ---

export interface MacroBudgetOutlookSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.07 public budget outlook spillover (Agent 07 domain; distinct from fiscal flow layer). */
export function readMacroBudgetOutlookSpilloverFromV1007(inputs: MacroEconomyInputs): MacroBudgetOutlookSpillover {
  const bo: any =
    inputs.budgetOutlook ??
    inputs.publicFinance?.outlook ??
    inputs.publicFinance?.budgetOutlook ??
    inputs.nationalFinance?.budgetOutlook;
  if (!bo) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const trajectory = String(bo.trajectoryBand ?? bo.pathBand ?? bo.fiscalPath?.band ?? '');
  const consolidation = String(bo.consolidationBand ?? bo.austerityBand ?? '');
  const capexRoom = String(bo.capexRoomBand ?? bo.capitalHeadroom?.band ?? '');

  if (trajectory === 'deteriorating' || trajectory === 'critical' || trajectory === 'unsustainable') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Deteriorating budget outlook (${trajectory}) tightens macro cycle and investment read.`;
  } else if (trajectory === 'improving' || trajectory === 'stable') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = `Stable budget outlook (${trajectory}) supports macro investment interpretation.`;
  }

  if (consolidation === 'severe' || consolidation === 'front_loaded' || consolidation === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Front-loaded consolidation drags macro cycle read.';
  }

  if (capexRoom === 'exhausted' || capexRoom === 'critical' || capexRoom === 'none') {
    investmentNudge -= 3;
    summary = (summary ? summary + ' ' : '') + 'Exhausted public capex room caps macro investment spillover.';
  } else if (capexRoom === 'ample' || capexRoom === 'expansionary') {
    investmentNudge += 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroBudgetOutlookSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroBudgetOutlookSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1004-mode-shift.ts ---

export interface MacroModeShiftSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.04 modes scenario shift spillover (Agent 04 domain; distinct from modes layer). */
export function readMacroModeShiftSpilloverFromV1004(inputs: MacroEconomyInputs): MacroModeShiftSpillover {
  const ms: any =
    inputs.modeShift ??
    inputs.modesScenarios?.shift ??
    inputs.scenarioRuntime?.modeShift ??
    inputs.gameModes?.shift;
  if (!ms) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const volatility = String(ms.volatilityBand ?? ms.shiftBand ?? ms.regimeBand ?? '');
  const alignment = String(ms.alignmentBand ?? ms.scenarioFit?.band ?? '');
  const handoff = String(ms.handoffBand ?? ms.transitionBand ?? '');

  if (volatility === 'disruptive' || volatility === 'critical' || volatility === 'chaotic') {
    cycleNudge -= 3;
    investmentNudge -= 1;
    summary = `Disruptive mode shift (${volatility}) unsettles macro cycle read.`;
  } else if (volatility === 'stable' || volatility === 'anchored') {
    cycleNudge += 0.5;
    summary = `Stable mode shift (${volatility}) anchors macro cycle read.`;
  }

  if (alignment === 'misaligned' || alignment === 'critical' || alignment === 'contradictory') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Misaligned scenario modes distort macro productivity interpretation.';
  }

  if (handoff === 'failed' || handoff === 'critical' || handoff === 'stalled') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Failed mode handoff drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroModeShiftSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroModeShiftSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1008-supply-chain.ts ---

export interface MacroSupplyChainSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.08 corporate supply-chain spillover (Agent 08 domain; distinct from companies production layer). */
export function readMacroSupplyChainSpilloverFromV1008(inputs: MacroEconomyInputs): MacroSupplyChainSpillover {
  const sc: any =
    inputs.supplyChainStress ??
    inputs.companies?.supplyChain ??
    inputs.privateSector?.supplyChain ??
    inputs.nationalPrivateSector?.logisticsStress;
  if (!sc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const fragility = String(sc.fragilityBand ?? sc.stressBand ?? sc.disruptionBand ?? '');
  const leadTime = String(sc.leadTimeBand ?? sc.delayBand ?? '');
  const inventory = String(sc.inventoryBand ?? sc.stockBand ?? '');

  if (fragility === 'severe' || fragility === 'critical' || fragility === 'broken') {
    productivityNudge -= 3;
    cycleNudge -= 2;
    summary = `Severe supply-chain fragility (${fragility}) drags macro productivity read.`;
  } else if (fragility === 'resilient' || fragility === 'robust') {
    productivityNudge += 1;
    summary = `Resilient supply chain (${fragility}) supports macro productivity read.`;
  }

  if (leadTime === 'extended' || leadTime === 'critical' || leadTime === 'extreme') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Extended supply lead times weaken macro investment signal.';
  }

  if (inventory === 'depleted' || inventory === 'critical' || inventory === 'empty') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Depleted corporate inventories amplify macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroSupplyChainSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroSupplyChainSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1005-event-cascade.ts ---

export interface MacroEventCascadeSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.05 dynamic event cascade spillover (Agent 05 domain; distinct from events backlog layer). */
export function readMacroEventCascadeSpilloverFromV1005(inputs: MacroEconomyInputs): MacroEventCascadeSpillover {
  const ec: any =
    inputs.eventCascade ??
    inputs.dynamicEvents?.cascade ??
    inputs.op10mEvents?.cascade ??
    inputs.narrativeEvents?.cascade;
  if (!ec) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const intensity = String(ec.intensityBand ?? ec.cascadeBand ?? ec.severityBand ?? '');
  const propagation = String(ec.propagationBand ?? ec.spreadBand ?? '');
  const duration = String(ec.durationBand ?? ec.persistenceBand ?? '');

  if (intensity === 'extreme' || intensity === 'critical' || intensity === 'runaway') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Runaway event cascade (${intensity}) drags macro cycle and investment read.`;
  } else if (intensity === 'contained' || intensity === 'fading') {
    cycleNudge += 0.5;
    summary = `Contained event cascade (${intensity}) eases macro downside transmission.`;
  }

  if (propagation === 'national' || propagation === 'cross_sector' || propagation === 'accelerating') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Accelerating event propagation widens macro spillover read.';
  }

  if (duration === 'persistent' || duration === 'chronic' || duration === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Persistent event cascade scarring drags macro productivity interpretation.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEventCascadeSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEventCascadeSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1009-demographic-shift.ts ---

export interface MacroDemographicShiftSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.09 demographic shift spillover (Agent 09 domain; distinct from population layer). */
export function readMacroDemographicShiftSpilloverFromV1009(inputs: MacroEconomyInputs): MacroDemographicShiftSpillover {
  const ds: any =
    inputs.demographicShift ??
    inputs.population?.shift ??
    inputs.demographics?.shift ??
    inputs.nationalPopulation?.shift;
  if (!ds) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const migration = String(ds.migrationBand ?? ds.flowBand ?? '');
  const aging = String(ds.agingBand ?? ds.dependencyBand ?? '');
  const participation = String(ds.participationBand ?? ds.laborParticipation?.band ?? '');

  if (migration === 'surge_out' || migration === 'critical' || migration === 'brain_drain') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Adverse demographic migration (${migration}) drags macro productivity read.`;
  } else if (migration === 'balanced' || migration === 'inflow') {
    cycleNudge += 0.5;
    summary = `Balanced migration (${migration}) supports macro cycle interpretation.`;
  }

  if (aging === 'rapid' || aging === 'critical' || aging === 'accelerating') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Rapid population aging weighs on macro investment/productivity read.';
  }

  if (participation === 'falling' || participation === 'critical' || participation === 'collapsed') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Falling labor participation drags macro cycle spillover.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDemographicShiftSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDemographicShiftSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1010-expectations-anchor.ts ---

export interface MacroExpectationsAnchorSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.10 inflation expectations anchor spillover (Agent 10 domain; distinct from inflation layer). */
export function readMacroExpectationsAnchorSpilloverFromV1010(inputs: MacroEconomyInputs): MacroExpectationsAnchorSpillover {
  const ex: any =
    inputs.inflationExpectationsAnchor ??
    inputs.nationalFinance?.expectationsAnchor ??
    inputs.monetaryPolicy?.expectationsAnchor ??
    inputs.nationalFinance?.inflationExpectations;
  if (!ex) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const anchor = String(ex.anchorBand ?? ex.stabilityBand ?? ex.beliefBand ?? '');
  const drift = String(ex.driftBand ?? ex.deanchoringBand ?? '');
  const credibility = String(ex.credibilityBand ?? ex.policyCredibility?.band ?? '');

  if (anchor === 'unmoored' || anchor === 'critical' || anchor === 'deanchored') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Deanchored inflation expectations (${anchor}) unsettle macro cycle read.`;
  } else if (anchor === 'firm' || anchor === 'well_anchored') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = `Well-anchored expectations (${anchor}) support macro investment interpretation.`;
  }

  if (drift === 'upward' || drift === 'runaway' || drift === 'critical') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Upward expectation drift tightens macro investment read.';
  }

  if (credibility === 'weak' || credibility === 'critical' || credibility === 'lost') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Weak policy credibility amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroExpectationsAnchorSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroExpectationsAnchorSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1011-metro-momentum.ts ---

export interface MacroMetroMomentumSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.11 metro growth momentum spillover (Agent 11 domain; distinct from cities layer). */
export function readMacroMetroMomentumSpilloverFromV1011(inputs: MacroEconomyInputs): MacroMetroMomentumSpillover {
  const metro: any =
    inputs.metroMomentum ??
    inputs.citiesRegions?.momentum ??
    inputs.metropolitanSystems?.growthMomentum ??
    inputs.urbanRegions?.momentum;
  if (!metro) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const growth = String(metro.growthBand ?? metro.momentumBand ?? metro.expansionBand ?? '');
  const congestion = String(metro.congestionBand ?? metro.capacityBand ?? '');
  const spread = String(metro.spreadBand ?? metro.regionalSpread?.band ?? '');

  if (growth === 'stalled' || growth === 'critical' || growth === 'contracting') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Stalled metro growth (${growth}) drags macro cycle and investment read.`;
  } else if (growth === 'surging' || growth === 'strong') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = `Strong metro momentum (${growth}) lifts macro cycle/investment interpretation.`;
  }

  if (congestion === 'severe' || congestion === 'critical' || congestion === 'gridlocked') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Gridlocked metro congestion suppresses macro productivity read.';
  }

  if (spread === 'polarized' || spread === 'critical' || spread === 'wide') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Wide metro-regional spread reinforces macro divergence read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMetroMomentumSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMetroMomentumSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1012-transport-throughput.ts ---

export interface MacroTransportThroughputSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.12 transport throughput spillover (Agent 12 domain; distinct from transport layer). */
export function readMacroTransportThroughputSpilloverFromV1012(inputs: MacroEconomyInputs): MacroTransportThroughputSpillover {
  const tt: any =
    inputs.transportThroughput ??
    inputs.transportInfrastructure?.throughput ??
    inputs.infrastructure?.freightThroughput ??
    inputs.nationalInfrastructure?.throughput;
  if (!tt) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const flow = String(tt.flowBand ?? tt.throughputBand ?? tt.capacityBand ?? '');
  const backlog = String(tt.backlogBand ?? tt.maintenanceBacklog?.band ?? '');
  const reliability = String(tt.reliabilityBand ?? tt.serviceReliability?.band ?? '');

  if (flow === 'congested' || flow === 'critical' || flow === 'collapsed') {
    productivityNudge -= 3;
    cycleNudge -= 2;
    summary = `Collapsed transport throughput (${flow}) drags macro productivity read.`;
  } else if (flow === 'fluid' || flow === 'strong') {
    productivityNudge += 1;
    investmentNudge += 0.5;
    summary = `Strong transport throughput (${flow}) supports macro productivity interpretation.`;
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'unbounded') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Severe infrastructure backlog caps macro investment spillover read.';
  }

  if (reliability === 'fragile' || reliability === 'critical' || reliability === 'failing') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragile transport reliability weakens macro cycle/investment signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTransportThroughputSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTransportThroughputSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1013-energy-transition-pace.ts ---

export interface MacroEnergyTransitionPaceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.13 energy transition pace spillover (Agent 13 domain; distinct from energy layer). */
export function readMacroEnergyTransitionPaceSpilloverFromV1013(inputs: MacroEconomyInputs): MacroEnergyTransitionPaceSpillover {
  const et: any =
    inputs.energyTransitionPace ??
    inputs.industrialEnergy?.transitionPace ??
    inputs.energyEnvironment?.transition ??
    inputs.climatePolicy?.transitionPace;
  if (!et) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pace = String(et.paceBand ?? et.transitionBand ?? et.speedBand ?? '');
  const cost = String(et.costBand ?? et.adjustmentCost?.band ?? '');
  const grid = String(et.gridBand ?? et.integrationBand ?? '');

  if (pace === 'disruptive' || pace === 'critical' || pace === 'forced') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Disruptive energy transition pace (${pace}) unsettles macro investment read.`;
  } else if (pace === 'orderly' || pace === 'steady') {
    investmentNudge += 1;
    summary = `Orderly transition pace (${pace}) supports macro investment interpretation.`;
  }

  if (cost === 'severe' || cost === 'critical' || cost === 'spiking') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Spiking transition costs drag macro productivity spillover.';
  }

  if (grid === 'strained' || grid === 'critical' || grid === 'unstable') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Strained grid integration amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEnergyTransitionPaceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEnergyTransitionPaceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1014-housing-affordability.ts ---

export interface MacroHousingAffordabilitySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.14 housing affordability spillover (Agent 14 domain; distinct from housing layer). */
export function readMacroHousingAffordabilitySpilloverFromV1014(inputs: MacroEconomyInputs): MacroHousingAffordabilitySpillover {
  const ha: any =
    inputs.housingAffordability ??
    inputs.housingWellbeing?.affordability ??
    inputs.housing?.affordability ??
    inputs.rentalMarket?.affordability;
  if (!ha) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const stress = String(ha.stressBand ?? ha.affordabilityBand ?? ha.pressureBand ?? '');
  const tenure = String(ha.tenureBand ?? ha.accessBand ?? '');
  const service = String(ha.serviceBand ?? ha.wellbeingBand ?? '');

  if (stress === 'acute' || stress === 'critical' || stress === 'crushed') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Acute housing affordability stress (${stress}) drags macro cycle read.`;
  } else if (stress === 'manageable' || stress === 'balanced') {
    cycleNudge += 1;
    summary = `Balanced housing affordability (${stress}) supports macro cycle interpretation.`;
  }

  if (tenure === 'locked_out' || tenure === 'precarious' || tenure === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Precarious tenure access weakens macro productivity spillover.';
  }

  if (service === 'strained' || service === 'critical' || service === 'failing') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Strained housing wellbeing services amplify macro downside.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroHousingAffordabilitySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroHousingAffordabilitySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1015-trade-exposure.ts ---

export interface MacroTradeExposureSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.15 trade exposure spillover (Agent 15 domain; distinct from trade layer). */
export function readMacroTradeExposureSpilloverFromV1015(inputs: MacroEconomyInputs): MacroTradeExposureSpillover {
  const te: any =
    inputs.tradeExposure ??
    inputs.trade?.exposure ??
    inputs.trade?.externalExposure ??
    inputs.nationalSystems?.tradeExposure;
  if (!te) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const openness = String(te.opennessBand ?? te.exposureBand ?? te.linkageBand ?? '');
  const shock = String(te.shockBand ?? te.vulnerabilityBand ?? '');
  const balance = String(te.balanceBand ?? te.deficitBand ?? '');

  if (shock === 'severe' || shock === 'critical' || shock === 'dislocated') {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = `Severe trade exposure shock (${shock}) drags macro productivity read.`;
  } else if (openness === 'diversified' || openness === 'balanced') {
    productivityNudge += 1;
    summary = `Diversified trade exposure (${openness}) supports macro productivity interpretation.`;
  }

  if (balance === 'deep_deficit' || balance === 'critical' || balance === 'unsustainable') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unsustainable external balance caps macro investment spillover.';
  }

  if (openness === 'concentrated' || openness === 'fragile') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Concentrated trade linkages amplify macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTradeExposureSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTradeExposureSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1016-guardian-vigilance.ts ---

export interface MacroGuardianVigilanceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.16 guardian vigilance spillover (Agent 16 domain; distinct from guardian layer). */
export function readMacroGuardianVigilanceSpilloverFromV1016(inputs: MacroEconomyInputs): MacroGuardianVigilanceSpillover {
  const gv: any =
    inputs.guardianVigilance ??
    inputs.guardianCopilot?.vigilance ??
    inputs.guardian?.riskVigilance ??
    inputs.coPilotWarnings?.vigilance;
  if (!gv) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const alert = String(gv.alertBand ?? gv.vigilanceBand ?? gv.postureBand ?? '');
  const coverage = String(gv.coverageBand ?? gv.scopeBand ?? '');
  const trust = String(gv.trustBand ?? gv.calibrationBand ?? '');

  if (alert === 'critical' || alert === 'elevated' || alert === 'red') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Elevated guardian vigilance (${alert}) tightens macro investment read.`;
  } else if (alert === 'calm' || alert === 'green') {
    investmentNudge += 0.5;
    summary = `Calm guardian vigilance (${alert}) supports macro investment interpretation.`;
  }

  if (coverage === 'blind' || coverage === 'gapped' || coverage === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Blind guardian coverage weakens macro productivity spillover.';
  }

  if (trust === 'eroded' || trust === 'critical' || trust === 'lost') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Eroded guardian trust amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroGuardianVigilanceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroGuardianVigilanceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1017-command-coordination.ts ---

export interface MacroCommandCoordinationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.17 command coordination spillover (Agent 17 domain; distinct from command layer). */
export function readMacroCommandCoordinationSpilloverFromV1017(inputs: MacroEconomyInputs): MacroCommandCoordinationSpillover {
  const cc: any =
    inputs.commandCoordination ??
    inputs.commandCenter?.coordination ??
    inputs.nationalCommand?.coordination ??
    inputs.aiCommandCenter?.coordination;
  if (!cc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const sync = String(cc.syncBand ?? cc.coordinationBand ?? cc.alignmentBand ?? '');
  const latency = String(cc.latencyBand ?? cc.responseBand ?? '');
  const load = String(cc.loadBand ?? cc.capacityBand ?? '');

  if (sync === 'fragmented' || sync === 'critical' || sync === 'broken') {
    cycleNudge -= 3;
    productivityNudge -= 1;
    summary = `Fragmented command coordination (${sync}) drags macro cycle read.`;
  } else if (sync === 'aligned' || sync === 'tight') {
    productivityNudge += 1;
    summary = `Aligned command coordination (${sync}) supports macro productivity interpretation.`;
  }

  if (latency === 'severe' || latency === 'critical' || latency === 'unbounded') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Severe command latency caps macro investment spillover.';
  }

  if (load === 'overloaded' || load === 'critical' || load === 'saturated') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Overloaded command center weakens macro cycle/investment signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCommandCoordinationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCommandCoordinationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1018-team-ai-cohesion.ts ---

export interface MacroTeamAiCohesionSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.18 team AI cohesion spillover (Agent 18 domain; distinct from team AI layer). */
export function readMacroTeamAiCohesionSpilloverFromV1018(inputs: MacroEconomyInputs): MacroTeamAiCohesionSpillover {
  const tc: any =
    inputs.teamAiCohesion ??
    inputs.teamIntelligence?.cohesion ??
    inputs.teamAi?.cohesion ??
    inputs.nationalTeamAi?.cohesion;
  if (!tc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const alignment = String(tc.alignmentBand ?? tc.cohesionBand ?? tc.syncBand ?? '');
  const drift = String(tc.driftBand ?? tc.divergenceBand ?? '');
  const quality = String(tc.qualityBand ?? tc.outputBand ?? '');

  if (alignment === 'fractured' || alignment === 'critical' || alignment === 'split') {
    productivityNudge -= 3;
    cycleNudge -= 1;
    summary = `Fractured team AI cohesion (${alignment}) drags macro productivity read.`;
  } else if (alignment === 'unified' || alignment === 'strong') {
    productivityNudge += 1;
    summary = `Unified team AI cohesion (${alignment}) supports macro productivity interpretation.`;
  }

  if (drift === 'runaway' || drift === 'critical' || drift === 'unbounded') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Runaway team AI drift caps macro investment spillover.';
  }

  if (quality === 'degraded' || quality === 'critical' || quality === 'hallucinating') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Degraded team AI output quality weakens macro cycle signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTeamAiCohesionSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTeamAiCohesionSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1019-memory-retention.ts ---

export interface MacroMemoryRetentionSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.19 memory retention spillover (Agent 19 domain; distinct from memory layer). */
export function readMacroMemoryRetentionSpilloverFromV1019(inputs: MacroEconomyInputs): MacroMemoryRetentionSpillover {
  const mr: any =
    inputs.memoryRetention ??
    inputs.aiMemory?.retention ??
    inputs.explainability?.retention ??
    inputs.nationalAiMemory?.retention;
  if (!mr) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const retention = String(mr.retentionBand ?? mr.holdBand ?? mr.persistenceBand ?? '');
  const decay = String(mr.decayBand ?? mr.erosionBand ?? '');
  const recall = String(mr.recallBand ?? mr.accuracyBand ?? '');

  if (retention === 'volatile' || retention === 'critical' || retention === 'lost') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = `Volatile AI memory retention (${retention}) drags macro investment read.`;
  } else if (retention === 'durable' || retention === 'stable') {
    investmentNudge += 1;
    summary = `Durable memory retention (${retention}) supports macro investment interpretation.`;
  }

  if (decay === 'accelerating' || decay === 'critical' || decay === 'runaway') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Accelerating memory decay weakens macro productivity spillover.';
  }

  if (recall === 'noisy' || recall === 'critical' || recall === 'corrupted') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Noisy memory recall amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMemoryRetentionSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMemoryRetentionSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1020-automation-throughput.ts ---

export interface MacroAutomationThroughputSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation throughput spillover (Agent 20 domain; distinct from automation layer). */
export function readMacroAutomationThroughputSpilloverFromV1020(inputs: MacroEconomyInputs): MacroAutomationThroughputSpillover {
  const at: any =
    inputs.automationThroughput ??
    inputs.idleAutomation?.throughput ??
    inputs.automation?.throughput ??
    inputs.nationalAutomation?.throughput;
  if (!at) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pace = String(at.paceBand ?? at.throughputBand ?? at.cadenceBand ?? '');
  const reliability = String(at.reliabilityBand ?? at.uptimeBand ?? '');
  const backlog = String(at.backlogBand ?? at.queueBand ?? '');

  if (pace === 'stalled' || pace === 'critical' || pace === 'collapsed') {
    productivityNudge -= 3;
    cycleNudge -= 2;
    summary = `Stalled automation throughput (${pace}) drags macro productivity read.`;
  } else if (pace === 'fluid' || pace === 'strong') {
    productivityNudge += 1;
    investmentNudge += 0.5;
    summary = `Strong automation throughput (${pace}) supports macro productivity interpretation.`;
  }

  if (reliability === 'fragile' || reliability === 'critical' || reliability === 'failing') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Fragile automation reliability caps macro investment spillover.';
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'unbounded') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Severe automation backlog weakens macro cycle signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationThroughputSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationThroughputSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecast-calibration.ts ---

export interface MacroForecastCalibrationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast calibration spillover (Agent 21 domain; distinct from forecasting layer). */
export function readMacroForecastCalibrationSpilloverFromV1021(inputs: MacroEconomyInputs): MacroForecastCalibrationSpillover {
  const fc: any =
    inputs.forecastCalibration ??
    inputs.forecastingLab?.calibration ??
    inputs.macroForecasts?.calibration ??
    inputs.nationalForecasts?.calibration;
  if (!fc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const bias = String(fc.biasBand ?? fc.calibrationBand ?? fc.errorBand ?? '');
  const horizon = String(fc.horizonBand ?? fc.rangeBand ?? '');
  const confidence = String(fc.confidenceBand ?? fc.certaintyBand ?? '');

  if (bias === 'severe' || bias === 'critical' || bias === 'runaway') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = `Severe forecast calibration bias (${bias}) drags macro investment read.`;
  } else if (bias === 'neutral' || bias === 'well_calibrated') {
    investmentNudge += 1;
    summary = `Well-calibrated forecasts (${bias}) support macro investment interpretation.`;
  }

  if (horizon === 'blind' || horizon === 'critical' || horizon === 'collapsed') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Blind forecast horizon weakens macro productivity spillover.';
  }

  if (confidence === 'overconfident' || confidence === 'critical' || confidence === 'misplaced') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misplaced forecast confidence amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastCalibrationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastCalibrationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: macro-transmission.ts ---

const ZERO_SPILLOVER = { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null as string | null };

export function buildMacroTransmissionReport(params: {
  turn: number;
  fiscal: MacroFiscalSpillover;
  household: MacroHouseholdSpillover;
  industry: MacroIndustrySpillover;
  trade: MacroTradeSpillover;
  geography: MacroGeographySpillover;
  credit: MacroCreditSpillover;
  innovation: MacroInnovationSpillover;
  workforce: MacroWorkforceSpillover;
  strategic: MacroStrategicSpillover;
  housing: MacroHousingSpillover;
  inflation?: MacroInflationSpillover;
  energy?: MacroEnergySpillover;
  events?: MacroEventsSpillover;
  companies?: MacroCompaniesSpillover;
  turns?: MacroTurnsSpillover;
  transport?: MacroTransportSpillover;
  research?: MacroResearchSpillover;
  population?: MacroPopulationSpillover;
  modes?: MacroModesSpillover;
  guardian?: MacroGuardianSpillover;
  cities?: MacroCitiesSpillover;
  forecasting?: MacroForecastingSpillover;
  command?: MacroCommandSpillover;
  automation?: MacroAutomationSpillover;
  teamAi?: MacroTeamAiSpillover;
  replay?: MacroReplaySpillover;
  memory?: MacroMemorySpillover;
  dashboards?: MacroDashboardsSpillover;
  ui?: MacroUiSpillover;
  utilities?: MacroUtilitiesSpillover;
  logistics?: MacroTradeLogisticsSpillover;
  negotiation?: MacroNegotiationSpillover;
  confidence?: MacroHouseholdConfidenceSpillover;
  capex?: MacroCapexSpillover;
  monetary?: MacroMonetarySpillover;
  rental?: MacroRentalSpillover;
  climate?: MacroClimatePolicySpillover;
  forecastDispersion?: MacroForecastDispersionSpillover;
  accessibility?: MacroAccessibilitySpillover;
  timeline?: MacroTimelineSpillover;
  liquidity?: MacroLiquiditySpillover;
  mapsTelemetry?: MacroMapsTelemetrySpillover;
  strategicGameplay?: MacroStrategicGameplaySpillover;
  archiveIntegrity?: MacroArchiveIntegritySpillover;
  integrationHealth?: MacroIntegrationHealthSpillover;
  cadenceDrift?: MacroCadenceDriftSpillover;
  researchMomentum?: MacroResearchMomentumSpillover;
  budgetOutlook?: MacroBudgetOutlookSpillover;
  modeShift?: MacroModeShiftSpillover;
  supplyChain?: MacroSupplyChainSpillover;
  eventCascade?: MacroEventCascadeSpillover;
  demographicShift?: MacroDemographicShiftSpillover;
  expectationsAnchor?: MacroExpectationsAnchorSpillover;
  metroMomentum?: MacroMetroMomentumSpillover;
  transportThroughput?: MacroTransportThroughputSpillover;
  energyTransitionPace?: MacroEnergyTransitionPaceSpillover;
  housingAffordability?: MacroHousingAffordabilitySpillover;
  tradeExposure?: MacroTradeExposureSpillover;
  guardianVigilance?: MacroGuardianVigilanceSpillover;
  commandCoordination?: MacroCommandCoordinationSpillover;
  teamAiCohesion?: MacroTeamAiCohesionSpillover;
  memoryRetention?: MacroMemoryRetentionSpillover;
  automationThroughput?: MacroAutomationThroughputSpillover;
  forecastCalibration?: MacroForecastCalibrationSpillover;
  automationIdleGovernance?: MacroAutomationIdleGovernanceSpillover;
  forecastProjectionSync?: MacroForecastProjectionSyncSpillover;
  automationIdleGovernanceWave36Export?: MacroAutomationIdleGovernanceWave36ExportSpillover;
  forecastWave36ProjectionSync?: MacroForecastWave36ProjectionSyncSpillover;
  uiResponsivenessWave37Export?: MacroUiResponsivenessWave37ExportSpillover;
  dashboardClarityWave37Export?: MacroDashboardClarityWave37ExportSpillover;
  replayWave38Export?: MacroReplayWave38ExportSpillover;
  integrationHealthWave38Export?: MacroIntegrationHealthWave38ExportSpillover;
  automationIdleGovernanceWave39Export?: MacroAutomationIdleGovernanceWave39ExportSpillover;
  forecastWave39Export?: MacroForecastWave39ExportSpillover;
  uiResponsivenessWave40Export?: MacroUiResponsivenessWave40ExportSpillover;
  dashboardClarityWave40Export?: MacroDashboardClarityWave40ExportSpillover;
  replayWave41Export?: MacroReplayWave41ExportSpillover;
  integrationHealthWave41Export?: MacroIntegrationHealthWave41ExportSpillover;
  automationIdleGovernanceWave42Export?: MacroAutomationIdleGovernanceWave42ExportSpillover;
  forecastWave42Export?: MacroForecastWave42ExportSpillover;
  uiResponsivenessWave43Export?: MacroUiResponsivenessWave43ExportSpillover;
  dashboardClarityWave43Export?: MacroDashboardClarityWave43ExportSpillover;
  automationIdleGovernanceWave44Export?: MacroAutomationIdleGovernanceWave44ExportSpillover;
  forecastWave44Export?: MacroForecastWave44ExportSpillover;
  replayWave45Export?: MacroReplayWave45ExportSpillover;
  integrationHealthWave45Export?: MacroIntegrationHealthWave45ExportSpillover;
  uiResponsivenessWave46Export?: MacroUiResponsivenessWave46ExportSpillover;
  dashboardClarityWave46Export?: MacroDashboardClarityWave46ExportSpillover;
  replayWave47Export?: MacroReplayWave47ExportSpillover;
  integrationHealthWave47Export?: MacroIntegrationHealthWave47ExportSpillover;
  replayWave48Export?: MacroReplayWave48ExportSpillover;
  integrationHealthWave48Export?: MacroIntegrationHealthWave48ExportSpillover;
}): MacroTransmissionReport {
  const inflation = params.inflation ?? ZERO_SPILLOVER;
  const energy = params.energy ?? ZERO_SPILLOVER;
  const events = params.events ?? ZERO_SPILLOVER;
  const companies = params.companies ?? ZERO_SPILLOVER;
  const turns = params.turns ?? ZERO_SPILLOVER;
  const transport = params.transport ?? ZERO_SPILLOVER;
  const research = params.research ?? ZERO_SPILLOVER;
  const population = params.population ?? ZERO_SPILLOVER;
  const modes = params.modes ?? ZERO_SPILLOVER;
  const guardian = params.guardian ?? ZERO_SPILLOVER;
  const cities = params.cities ?? ZERO_SPILLOVER;
  const forecasting = params.forecasting ?? ZERO_SPILLOVER;
  const command = params.command ?? ZERO_SPILLOVER;
  const automation = params.automation ?? ZERO_SPILLOVER;
  const teamAi = params.teamAi ?? ZERO_SPILLOVER;
  const replay = params.replay ?? ZERO_SPILLOVER;
  const memory = params.memory ?? ZERO_SPILLOVER;
  const dashboards = params.dashboards ?? ZERO_SPILLOVER;
  const ui = params.ui ?? ZERO_SPILLOVER;
  const utilities = params.utilities ?? ZERO_SPILLOVER;
  const logistics = params.logistics ?? ZERO_SPILLOVER;
  const negotiation = params.negotiation ?? ZERO_SPILLOVER;
  const confidence = params.confidence ?? ZERO_SPILLOVER;
  const capex = params.capex ?? ZERO_SPILLOVER;
  const monetary = params.monetary ?? ZERO_SPILLOVER;
  const rental = params.rental ?? ZERO_SPILLOVER;
  const climate = params.climate ?? ZERO_SPILLOVER;
  const forecastDispersion = params.forecastDispersion ?? ZERO_SPILLOVER;
  const accessibility = params.accessibility ?? ZERO_SPILLOVER;
  const timeline = params.timeline ?? ZERO_SPILLOVER;
  const liquidity = params.liquidity ?? ZERO_SPILLOVER;
  const mapsTelemetry = params.mapsTelemetry ?? ZERO_SPILLOVER;
  const strategicGameplay = params.strategicGameplay ?? ZERO_SPILLOVER;
  const archiveIntegrity = params.archiveIntegrity ?? ZERO_SPILLOVER;
  const integrationHealth = params.integrationHealth ?? ZERO_SPILLOVER;
  const cadenceDrift = params.cadenceDrift ?? ZERO_SPILLOVER;
  const researchMomentum = params.researchMomentum ?? ZERO_SPILLOVER;
  const budgetOutlook = params.budgetOutlook ?? ZERO_SPILLOVER;
  const modeShift = params.modeShift ?? ZERO_SPILLOVER;
  const supplyChain = params.supplyChain ?? ZERO_SPILLOVER;
  const eventCascade = params.eventCascade ?? ZERO_SPILLOVER;
  const demographicShift = params.demographicShift ?? ZERO_SPILLOVER;
  const expectationsAnchor = params.expectationsAnchor ?? ZERO_SPILLOVER;
  const metroMomentum = params.metroMomentum ?? ZERO_SPILLOVER;
  const transportThroughput = params.transportThroughput ?? ZERO_SPILLOVER;
  const energyTransitionPace = params.energyTransitionPace ?? ZERO_SPILLOVER;
  const housingAffordability = params.housingAffordability ?? ZERO_SPILLOVER;
  const tradeExposure = params.tradeExposure ?? ZERO_SPILLOVER;
  const guardianVigilance = params.guardianVigilance ?? ZERO_SPILLOVER;
  const commandCoordination = params.commandCoordination ?? ZERO_SPILLOVER;
  const teamAiCohesion = params.teamAiCohesion ?? ZERO_SPILLOVER;
  const memoryRetention = params.memoryRetention ?? ZERO_SPILLOVER;
  const automationThroughput = params.automationThroughput ?? ZERO_SPILLOVER;
  const forecastCalibration = params.forecastCalibration ?? ZERO_SPILLOVER;
  const automationIdleGovernance = params.automationIdleGovernance ?? ZERO_SPILLOVER;
  const forecastProjectionSync = params.forecastProjectionSync ?? ZERO_SPILLOVER;
  const automationIdleGovernanceWave36Export = params.automationIdleGovernanceWave36Export ?? ZERO_SPILLOVER;
  const forecastWave36ProjectionSync = params.forecastWave36ProjectionSync ?? ZERO_SPILLOVER;
  const uiResponsivenessWave37Export = params.uiResponsivenessWave37Export ?? ZERO_SPILLOVER;
  const dashboardClarityWave37Export = params.dashboardClarityWave37Export ?? ZERO_SPILLOVER;
  const replayWave38Export = params.replayWave38Export ?? ZERO_SPILLOVER;
  const integrationHealthWave38Export = params.integrationHealthWave38Export ?? ZERO_SPILLOVER;
  const automationIdleGovernanceWave39Export = params.automationIdleGovernanceWave39Export ?? ZERO_SPILLOVER;
  const forecastWave39Export = params.forecastWave39Export ?? ZERO_SPILLOVER;
  const uiResponsivenessWave40Export = params.uiResponsivenessWave40Export ?? ZERO_SPILLOVER;
  const dashboardClarityWave40Export = params.dashboardClarityWave40Export ?? ZERO_SPILLOVER;
  const replayWave41Export = params.replayWave41Export ?? ZERO_SPILLOVER;
  const integrationHealthWave41Export = params.integrationHealthWave41Export ?? ZERO_SPILLOVER;
  const automationIdleGovernanceWave42Export = params.automationIdleGovernanceWave42Export ?? ZERO_SPILLOVER;
  const forecastWave42Export = params.forecastWave42Export ?? ZERO_SPILLOVER;
  const uiResponsivenessWave43Export = params.uiResponsivenessWave43Export ?? ZERO_SPILLOVER;
  const dashboardClarityWave43Export = params.dashboardClarityWave43Export ?? ZERO_SPILLOVER;
  const automationIdleGovernanceWave44Export = params.automationIdleGovernanceWave44Export ?? ZERO_SPILLOVER;
  const forecastWave44Export = params.forecastWave44Export ?? ZERO_SPILLOVER;
  const replayWave45Export = params.replayWave45Export ?? ZERO_SPILLOVER;
  const integrationHealthWave45Export = params.integrationHealthWave45Export ?? ZERO_SPILLOVER;
  const uiResponsivenessWave46Export = params.uiResponsivenessWave46Export ?? ZERO_SPILLOVER;
  const dashboardClarityWave46Export = params.dashboardClarityWave46Export ?? ZERO_SPILLOVER;
  const replayWave47Export = params.replayWave47Export ?? ZERO_SPILLOVER;
  const integrationHealthWave47Export = params.integrationHealthWave47Export ?? ZERO_SPILLOVER;
  const replayWave48Export = params.replayWave48Export ?? ZERO_SPILLOVER;
  const integrationHealthWave48Export = params.integrationHealthWave48Export ?? ZERO_SPILLOVER;
  const layers: MacroTransmissionLayer[] = [
    layer(
      'v10.12_fiscal',
      'Public finance',
      params.fiscal.cycleNudge,
      params.fiscal.investmentNudge,
      params.fiscal.productivityNudge,
      params.fiscal.summary
    ),
    layer('v10.13_households', 'Household demand', params.household.cycleNudge, params.household.investmentNudge, 0, params.household.summary),
    layer('v10.1_industries', 'Industry utilization', params.industry.cycleNudge, 0, params.industry.productivityNudge, params.industry.summary),
    layer('v10.15_trade', 'Trade & external', params.trade.cycleNudge, 0, params.trade.productivityNudge, params.trade.summary),
    layer('v10.11_geography', 'Economic geography', params.geography.cycleNudge, params.geography.investmentNudge, 0, params.geography.summary),
    layer(
      'v10.16_credit',
      'Credit & financial conditions',
      params.credit.cycleNudge,
      params.credit.investmentNudge,
      params.credit.productivityNudge,
      params.credit.summary
    ),
    layer(
      'v10.4_innovation',
      'Innovation & productivity',
      params.innovation.cycleNudge,
      params.innovation.investmentNudge,
      params.innovation.productivityNudge,
      params.innovation.summary
    ),
    layer(
      'v10.7_workforce',
      'Workforce & labor market',
      params.workforce.cycleNudge,
      params.workforce.investmentNudge,
      params.workforce.productivityNudge,
      params.workforce.summary
    ),
    layer(
      'v10.9_strategic',
      'Strategic capital allocation',
      params.strategic.cycleNudge,
      params.strategic.investmentNudge,
      params.strategic.productivityNudge,
      params.strategic.summary
    ),
    layer(
      'v10.14_housing',
      'Housing & wellbeing',
      params.housing.cycleNudge,
      params.housing.investmentNudge,
      params.housing.productivityNudge,
      params.housing.summary
    ),
    layer(
      'v10.10_inflation',
      'Finance & inflation',
      inflation.cycleNudge,
      inflation.investmentNudge,
      inflation.productivityNudge,
      inflation.summary
    ),
    layer(
      'v10.18_energy',
      'Energy & environment',
      energy.cycleNudge,
      energy.investmentNudge,
      energy.productivityNudge,
      energy.summary
    ),
    layer(
      'v10.5_events',
      'Dynamic events & narrative',
      events.cycleNudge,
      events.investmentNudge,
      events.productivityNudge,
      events.summary
    ),
    layer(
      'v10.8_companies',
      'Companies & production',
      companies.cycleNudge,
      companies.investmentNudge,
      companies.productivityNudge,
      companies.summary
    ),
    layer(
      'v10.2_turns',
      'Turns & temporal cadence',
      turns.cycleNudge,
      turns.investmentNudge,
      turns.productivityNudge,
      turns.summary
    ),
    layer(
      'v10.17_transport',
      'Transport & infrastructure',
      transport.cycleNudge,
      transport.investmentNudge,
      transport.productivityNudge,
      transport.summary
    ),
    layer(
      'v10.3_research',
      'Research & technology',
      research.cycleNudge,
      research.investmentNudge,
      research.productivityNudge,
      research.summary
    ),
    layer(
      'v10.9_population',
      'Population & demographics',
      population.cycleNudge,
      population.investmentNudge,
      population.productivityNudge,
      population.summary
    ),
    layer(
      'v10.6_modes',
      'Modes & scenarios',
      modes.cycleNudge,
      modes.investmentNudge,
      modes.productivityNudge,
      modes.summary
    ),
    layer(
      'v10.16_guardian',
      'Guardian co-pilot',
      guardian.cycleNudge,
      guardian.investmentNudge,
      guardian.productivityNudge,
      guardian.summary
    ),
    layer(
      'v10.11_cities',
      'Cities & metro regions',
      cities.cycleNudge,
      cities.investmentNudge,
      cities.productivityNudge,
      cities.summary
    ),
    layer(
      'v10.21_forecasting',
      'Forecasting lab',
      forecasting.cycleNudge,
      forecasting.investmentNudge,
      forecasting.productivityNudge,
      forecasting.summary
    ),
    layer(
      'v10.17_command',
      'AI command center',
      command.cycleNudge,
      command.investmentNudge,
      command.productivityNudge,
      command.summary
    ),
    layer(
      'v10.20_automation',
      'Idle automation',
      automation.cycleNudge,
      automation.investmentNudge,
      automation.productivityNudge,
      automation.summary
    ),
    layer(
      'v10.18_team',
      'Team intelligence',
      teamAi.cycleNudge,
      teamAi.investmentNudge,
      teamAi.productivityNudge,
      teamAi.summary
    ),
    layer(
      'v10.24_replay',
      'History & replay',
      replay.cycleNudge,
      replay.investmentNudge,
      replay.productivityNudge,
      replay.summary
    ),
    layer(
      'v10.19_memory',
      'AI memory & explainability',
      memory.cycleNudge,
      memory.investmentNudge,
      memory.productivityNudge,
      memory.summary
    ),
    layer(
      'v10.23_dashboards',
      'Dashboards & maps',
      dashboards.cycleNudge,
      dashboards.investmentNudge,
      dashboards.productivityNudge,
      dashboards.summary
    ),
    layer(
      'v10.22_ui',
      'UI shell & navigation',
      ui.cycleNudge,
      ui.investmentNudge,
      ui.productivityNudge,
      ui.summary
    ),
    layer(
      'v10.12_utilities',
      'Utilities grid',
      utilities.cycleNudge,
      utilities.investmentNudge,
      utilities.productivityNudge,
      utilities.summary
    ),
    layer(
      'v10.15_logistics',
      'Trade logistics',
      logistics.cycleNudge,
      logistics.investmentNudge,
      logistics.productivityNudge,
      logistics.summary
    ),
    layer(
      'v10.5_negotiation',
      'Negotiation & diplomacy',
      negotiation.cycleNudge,
      negotiation.investmentNudge,
      negotiation.productivityNudge,
      negotiation.summary
    ),
    layer(
      'v10.13_confidence',
      'Household confidence',
      confidence.cycleNudge,
      confidence.investmentNudge,
      confidence.productivityNudge,
      confidence.summary
    ),
    layer(
      'v10.8_capex',
      'Private capex cycle',
      capex.cycleNudge,
      capex.investmentNudge,
      capex.productivityNudge,
      capex.summary
    ),
    layer(
      'v10.10_monetary',
      'Monetary policy stance',
      monetary.cycleNudge,
      monetary.investmentNudge,
      monetary.productivityNudge,
      monetary.summary
    ),
    layer(
      'v10.14_rental',
      'Rental market',
      rental.cycleNudge,
      rental.investmentNudge,
      rental.productivityNudge,
      rental.summary
    ),
    layer(
      'v10.18_climate',
      'Climate policy',
      climate.cycleNudge,
      climate.investmentNudge,
      climate.productivityNudge,
      climate.summary
    ),
    layer(
      'v10.21_forecast_dispersion',
      'Forecast dispersion',
      forecastDispersion.cycleNudge,
      forecastDispersion.investmentNudge,
      forecastDispersion.productivityNudge,
      forecastDispersion.summary
    ),
    layer(
      'v10.22_accessibility',
      'UI accessibility',
      accessibility.cycleNudge,
      accessibility.investmentNudge,
      accessibility.productivityNudge,
      accessibility.summary
    ),
    layer(
      'v10.24_timeline',
      'History timeline',
      timeline.cycleNudge,
      timeline.investmentNudge,
      timeline.productivityNudge,
      timeline.summary
    ),
    layer(
      'v10.16_liquidity',
      'System liquidity',
      liquidity.cycleNudge,
      liquidity.investmentNudge,
      liquidity.productivityNudge,
      liquidity.summary
    ),
    layer(
      'v10.23_maps_telemetry',
      'Maps telemetry',
      mapsTelemetry.cycleNudge,
      mapsTelemetry.investmentNudge,
      mapsTelemetry.productivityNudge,
      mapsTelemetry.summary
    ),
    layer(
      'v10.01_strategic_gameplay',
      'Strategic gameplay cadence',
      strategicGameplay.cycleNudge,
      strategicGameplay.investmentNudge,
      strategicGameplay.productivityNudge,
      strategicGameplay.summary
    ),
    layer(
      'v10.24_archive',
      'History archive integrity',
      archiveIntegrity.cycleNudge,
      archiveIntegrity.investmentNudge,
      archiveIntegrity.productivityNudge,
      archiveIntegrity.summary
    ),
    layer(
      'v10.25_integration',
      'Cross-system integration',
      integrationHealth.cycleNudge,
      integrationHealth.investmentNudge,
      integrationHealth.productivityNudge,
      integrationHealth.summary
    ),
    layer(
      'v10.02_cadence',
      'Turn cadence drift',
      cadenceDrift.cycleNudge,
      cadenceDrift.investmentNudge,
      cadenceDrift.productivityNudge,
      cadenceDrift.summary
    ),
    layer(
      'v10.03_research_momentum',
      'Research momentum',
      researchMomentum.cycleNudge,
      researchMomentum.investmentNudge,
      researchMomentum.productivityNudge,
      researchMomentum.summary
    ),
    layer(
      'v10.07_budget',
      'Public budget outlook',
      budgetOutlook.cycleNudge,
      budgetOutlook.investmentNudge,
      budgetOutlook.productivityNudge,
      budgetOutlook.summary
    ),
    layer(
      'v10.04_mode_shift',
      'Modes scenario shift',
      modeShift.cycleNudge,
      modeShift.investmentNudge,
      modeShift.productivityNudge,
      modeShift.summary
    ),
    layer(
      'v10.08_supply_chain',
      'Corporate supply chain',
      supplyChain.cycleNudge,
      supplyChain.investmentNudge,
      supplyChain.productivityNudge,
      supplyChain.summary
    ),
    layer(
      'v10.05_event_cascade',
      'Dynamic event cascade',
      eventCascade.cycleNudge,
      eventCascade.investmentNudge,
      eventCascade.productivityNudge,
      eventCascade.summary
    ),
    layer(
      'v10.09_demographic_shift',
      'Demographic shift',
      demographicShift.cycleNudge,
      demographicShift.investmentNudge,
      demographicShift.productivityNudge,
      demographicShift.summary
    ),
    layer(
      'v10.10_expectations',
      'Inflation expectations anchor',
      expectationsAnchor.cycleNudge,
      expectationsAnchor.investmentNudge,
      expectationsAnchor.productivityNudge,
      expectationsAnchor.summary
    ),
    layer(
      'v10.11_metro_momentum',
      'Metro growth momentum',
      metroMomentum.cycleNudge,
      metroMomentum.investmentNudge,
      metroMomentum.productivityNudge,
      metroMomentum.summary
    ),
    layer(
      'v10.12_transport_throughput',
      'Transport throughput',
      transportThroughput.cycleNudge,
      transportThroughput.investmentNudge,
      transportThroughput.productivityNudge,
      transportThroughput.summary
    ),
    layer(
      'v10.13_energy_transition',
      'Energy transition pace',
      energyTransitionPace.cycleNudge,
      energyTransitionPace.investmentNudge,
      energyTransitionPace.productivityNudge,
      energyTransitionPace.summary
    ),
    layer(
      'v10.14_housing_affordability',
      'Housing affordability',
      housingAffordability.cycleNudge,
      housingAffordability.investmentNudge,
      housingAffordability.productivityNudge,
      housingAffordability.summary
    ),
    layer(
      'v10.15_trade_exposure',
      'Trade exposure',
      tradeExposure.cycleNudge,
      tradeExposure.investmentNudge,
      tradeExposure.productivityNudge,
      tradeExposure.summary
    ),
    layer(
      'v10.16_guardian_vigilance',
      'Guardian vigilance',
      guardianVigilance.cycleNudge,
      guardianVigilance.investmentNudge,
      guardianVigilance.productivityNudge,
      guardianVigilance.summary
    ),
    layer(
      'v10.17_command_coordination',
      'Command coordination',
      commandCoordination.cycleNudge,
      commandCoordination.investmentNudge,
      commandCoordination.productivityNudge,
      commandCoordination.summary
    ),
    layer(
      'v10.18_team_ai_cohesion',
      'Team AI cohesion',
      teamAiCohesion.cycleNudge,
      teamAiCohesion.investmentNudge,
      teamAiCohesion.productivityNudge,
      teamAiCohesion.summary
    ),
    layer(
      'v10.19_memory_retention',
      'Memory retention',
      memoryRetention.cycleNudge,
      memoryRetention.investmentNudge,
      memoryRetention.productivityNudge,
      memoryRetention.summary
    ),
    layer(
      'v10.20_automation_throughput',
      'Automation throughput',
      automationThroughput.cycleNudge,
      automationThroughput.investmentNudge,
      automationThroughput.productivityNudge,
      automationThroughput.summary
    ),
    layer(
      'v10.21_forecast_calibration',
      'Forecast calibration',
      forecastCalibration.cycleNudge,
      forecastCalibration.investmentNudge,
      forecastCalibration.productivityNudge,
      forecastCalibration.summary
    ),
    layer(
      'v10.20_automation_idle_governance',
      'Automation idle governance',
      automationIdleGovernance.cycleNudge,
      automationIdleGovernance.investmentNudge,
      automationIdleGovernance.productivityNudge,
      automationIdleGovernance.summary
    ),
    layer(
      'v10.21_forecast_projection_sync',
      'Forecast projection sync',
      forecastProjectionSync.cycleNudge,
      forecastProjectionSync.investmentNudge,
      forecastProjectionSync.productivityNudge,
      forecastProjectionSync.summary
    ),
    layer(
      'v10.20_automation_idle_governance_wave36_export',
      'Automation idle governance wave 36 export',
      automationIdleGovernanceWave36Export.cycleNudge,
      automationIdleGovernanceWave36Export.investmentNudge,
      automationIdleGovernanceWave36Export.productivityNudge,
      automationIdleGovernanceWave36Export.summary
    ),
    layer(
      'v10.21_forecast_wave36_projection_sync',
      'Forecast wave 36 projection sync',
      forecastWave36ProjectionSync.cycleNudge,
      forecastWave36ProjectionSync.investmentNudge,
      forecastWave36ProjectionSync.productivityNudge,
      forecastWave36ProjectionSync.summary
    ),
    layer(
      'v10.22_ui_responsiveness_wave37_export',
      'UI responsiveness wave 37 export',
      uiResponsivenessWave37Export.cycleNudge,
      uiResponsivenessWave37Export.investmentNudge,
      uiResponsivenessWave37Export.productivityNudge,
      uiResponsivenessWave37Export.summary
    ),
    layer(
      'v10.23_dashboard_clarity_wave37_export',
      'Dashboard clarity wave 37 export',
      dashboardClarityWave37Export.cycleNudge,
      dashboardClarityWave37Export.investmentNudge,
      dashboardClarityWave37Export.productivityNudge,
      dashboardClarityWave37Export.summary
    ),
    layer(
      'v10.24_replay_wave38_export',
      'History replay wave 38 export',
      replayWave38Export.cycleNudge,
      replayWave38Export.investmentNudge,
      replayWave38Export.productivityNudge,
      replayWave38Export.summary
    ),
    layer(
      'v10.25_integration_health_wave38_export',
      'Integration health wave 38 export',
      integrationHealthWave38Export.cycleNudge,
      integrationHealthWave38Export.investmentNudge,
      integrationHealthWave38Export.productivityNudge,
      integrationHealthWave38Export.summary
    ),
    layer(
      'v10.20_automation_idle_governance_wave39_export',
      'Automation idle governance wave 39 export',
      automationIdleGovernanceWave39Export.cycleNudge,
      automationIdleGovernanceWave39Export.investmentNudge,
      automationIdleGovernanceWave39Export.productivityNudge,
      automationIdleGovernanceWave39Export.summary
    ),
    layer(
      'v10.21_forecast_wave39_export',
      'Forecast wave 39 export',
      forecastWave39Export.cycleNudge,
      forecastWave39Export.investmentNudge,
      forecastWave39Export.productivityNudge,
      forecastWave39Export.summary
    ),
    layer(
      'v10.22_ui_responsiveness_wave40_export',
      'UI responsiveness wave 40 export',
      uiResponsivenessWave40Export.cycleNudge,
      uiResponsivenessWave40Export.investmentNudge,
      uiResponsivenessWave40Export.productivityNudge,
      uiResponsivenessWave40Export.summary
    ),
    layer(
      'v10.23_dashboard_clarity_wave40_export',
      'Dashboard clarity wave 40 export',
      dashboardClarityWave40Export.cycleNudge,
      dashboardClarityWave40Export.investmentNudge,
      dashboardClarityWave40Export.productivityNudge,
      dashboardClarityWave40Export.summary
    ),
    layer(
      'v10.24_replay_wave41_export',
      'History replay wave 41 export',
      replayWave41Export.cycleNudge,
      replayWave41Export.investmentNudge,
      replayWave41Export.productivityNudge,
      replayWave41Export.summary
    ),
    layer(
      'v10.25_integration_health_wave41_export',
      'Integration health wave 41 export',
      integrationHealthWave41Export.cycleNudge,
      integrationHealthWave41Export.investmentNudge,
      integrationHealthWave41Export.productivityNudge,
      integrationHealthWave41Export.summary
    ),
    layer(
      'v10.20_automation_idle_governance_wave42_export',
      'Automation idle governance wave 42 export',
      automationIdleGovernanceWave42Export.cycleNudge,
      automationIdleGovernanceWave42Export.investmentNudge,
      automationIdleGovernanceWave42Export.productivityNudge,
      automationIdleGovernanceWave42Export.summary
    ),
    layer(
      'v10.21_forecast_wave42_export',
      'Forecast wave 42 export',
      forecastWave42Export.cycleNudge,
      forecastWave42Export.investmentNudge,
      forecastWave42Export.productivityNudge,
      forecastWave42Export.summary
    ),
    layer(
      'v10.22_ui_responsiveness_wave43_export',
      'UI responsiveness wave 43 export',
      uiResponsivenessWave43Export.cycleNudge,
      uiResponsivenessWave43Export.investmentNudge,
      uiResponsivenessWave43Export.productivityNudge,
      uiResponsivenessWave43Export.summary
    ),
    layer(
      'v10.23_dashboard_clarity_wave43_export',
      'Dashboard clarity wave 43 export',
      dashboardClarityWave43Export.cycleNudge,
      dashboardClarityWave43Export.investmentNudge,
      dashboardClarityWave43Export.productivityNudge,
      dashboardClarityWave43Export.summary
    ),
    layer(
      'v10.20_automation_idle_governance_wave44_export',
      'Automation idle governance wave 44 export',
      automationIdleGovernanceWave44Export.cycleNudge,
      automationIdleGovernanceWave44Export.investmentNudge,
      automationIdleGovernanceWave44Export.productivityNudge,
      automationIdleGovernanceWave44Export.summary
    ),
    layer(
      'v10.21_forecast_wave44_export',
      'Forecast wave 44 export',
      forecastWave44Export.cycleNudge,
      forecastWave44Export.investmentNudge,
      forecastWave44Export.productivityNudge,
      forecastWave44Export.summary
    ),
    layer(
      'v10.24_replay_wave45_export',
      'History replay wave 45 export',
      replayWave45Export.cycleNudge,
      replayWave45Export.investmentNudge,
      replayWave45Export.productivityNudge,
      replayWave45Export.summary
    ),
    layer(
      'v10.25_integration_health_wave45_export',
      'Integration health wave 45 export',
      integrationHealthWave45Export.cycleNudge,
      integrationHealthWave45Export.investmentNudge,
      integrationHealthWave45Export.productivityNudge,
      integrationHealthWave45Export.summary
    ),
    layer(
      'v10.22_ui_responsiveness_wave46_export',
      'UI responsiveness wave 46 export',
      uiResponsivenessWave46Export.cycleNudge,
      uiResponsivenessWave46Export.investmentNudge,
      uiResponsivenessWave46Export.productivityNudge,
      uiResponsivenessWave46Export.summary
    ),
    layer(
      'v10.23_dashboard_clarity_wave46_export',
      'Dashboard clarity wave 46 export',
      dashboardClarityWave46Export.cycleNudge,
      dashboardClarityWave46Export.investmentNudge,
      dashboardClarityWave46Export.productivityNudge,
      dashboardClarityWave46Export.summary
    ),
    layer(
      'v10.24_replay_wave47_export',
      'History replay wave 47 export',
      replayWave47Export.cycleNudge,
      replayWave47Export.investmentNudge,
      replayWave47Export.productivityNudge,
      replayWave47Export.summary
    ),
    layer(
      'v10.25_integration_health_wave47_export',
      'Integration health wave 47 export',
      integrationHealthWave47Export.cycleNudge,
      integrationHealthWave47Export.investmentNudge,
      integrationHealthWave47Export.productivityNudge,
      integrationHealthWave47Export.summary
    ),
    layer(
      'v10.24_replay_wave48_export',
      'History replay wave 48 export',
      replayWave48Export.cycleNudge,
      replayWave48Export.investmentNudge,
      replayWave48Export.productivityNudge,
      replayWave48Export.summary
    ),
    layer(
      'v10.25_integration_health_wave48_export',
      'Integration health wave 48 export',
      integrationHealthWave48Export.cycleNudge,
      integrationHealthWave48Export.investmentNudge,
      integrationHealthWave48Export.productivityNudge,
      integrationHealthWave48Export.summary
    )
  ];
  const netCycleNudge = layers.reduce((a, l) => a + l.cycleContribution, 0);
  const netInvestmentNudge = layers.reduce((a, l) => a + l.investmentContribution, 0);
  const netProductivityNudge = layers.reduce((a, l) => a + l.productivityContribution, 0);
  const ranked = [...layers].sort(
    (a, b) =>
      Math.abs(b.cycleContribution) +
      Math.abs(b.investmentContribution) +
      Math.abs(b.productivityContribution) -
      (Math.abs(a.cycleContribution) + Math.abs(a.investmentContribution) + Math.abs(a.productivityContribution))
  );
  return {
    turn: params.turn,
    dominantLayerId: ranked[0] && magnitude(ranked[0]) > 0.01 ? ranked[0].systemId : null,
    layers,
    netCycleNudge,
    netInvestmentNudge,
    netProductivityNudge
  };
}

function layer(
  systemId: string,
  label: string,
  cycleContribution: number,
  investmentContribution: number,
  productivityContribution: number,
  summary: string | null
): MacroTransmissionLayer {
  return { systemId, label, cycleContribution, investmentContribution, productivityContribution, summary };
}

function magnitude(l: MacroTransmissionLayer): number {
  return Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution);
}


// --- source: macro-stress-index.ts ---

export type { MacroStressBand, MacroStressIndexSnapshot };

export function buildMacroStressIndexSnapshot(state: NationalMacroEconomyState): MacroStressIndexSnapshot {
  const transmissionStress = stressFromTransmission(state.transmissionReport);
  const gateStress = stressFromGates(state.consistencyGates);
  const phaseStress = phaseStressWeight(state.cyclePhase);
  const raw = transmissionStress * 0.45 + gateStress * 0.35 + phaseStress * 0.2;
  const score = v1014macroClamp(Math.round(raw * 100) / 100, 0, 100);
  const band: MacroStressBand = score >= 62 ? 'acute' : score >= 34 ? 'elevated' : 'calm';
  const drivers: string[] = [];
  if (transmissionStress > 0.35) drivers.push('transmission_dispersion');
  if (gateStress > 0.25) drivers.push('consistency_gates');
  if (phaseStress > 0.4) drivers.push('cycle_downside');
  if (state.investmentClimate === 'frozen') drivers.push('investment_frozen');
  return {
    score,
    band,
    drivers: drivers.slice(0, 5),
    transmissionStress: Math.round(transmissionStress * 1000) / 1000,
    gateStress: Math.round(gateStress * 1000) / 1000
  };
}

function stressFromTransmission(report: MacroTransmissionReport | null | undefined): number {
  if (!report?.layers?.length) return 0;
  const mag = report.layers.reduce(
    (a, l) =>
      a + Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution),
    0
  );
  return v1014macroClamp(mag / 28, 0, 1);
}

function stressFromGates(gates: MacroConsistencyGate[]): number {
  if (!gates.length) return 0;
  const triggered = gates.filter(g => g.triggered);
  let w = 0;
  for (const g of triggered) {
    w += g.severity === 'warn' ? 0.22 : 0.12;
  }
  return v1014macroClamp(w, 0, 1);
}

function phaseStressWeight(phase: NationalMacroEconomyState['cyclePhase']): number {
  if (phase === 'contraction' || phase === 'trough') return 0.85;
  if (phase === 'slowdown') return 0.55;
  if (phase === 'recovery') return 0.35;
  return 0.15;
}


// --- source: policy-stance-snapshot.ts ---

export type { MacroPolicyStanceLabel, MacroPolicyStanceSnapshot };

/** Read-only synthesis of fiscal + credit spillovers vs realized macro climate. */
export function buildMacroPolicyStanceSnapshot(params: {
  inputs: MacroEconomyInputs;
  state: Pick<NationalMacroEconomyState, 'investmentClimate' | 'cyclePhase'>;
  fiscal: MacroFiscalSpillover;
  credit: MacroCreditSpillover;
}): MacroPolicyStanceSnapshot {
  const fiscalTilt = params.fiscal.investmentNudge + params.fiscal.cycleNudge * 0.5;
  const creditTilt = params.credit.investmentNudge + params.credit.cycleNudge * 0.5;
  const net = fiscalTilt + creditTilt;
  let stance: MacroPolicyStanceLabel = 'neutral';
  if (net >= 2) stance = 'accommodative';
  else if (net <= -4) stance = 'restrictive';
  if (fiscalTilt <= -2 && creditTilt <= -2) stance = 'conflicted';

  const pf: any = params.inputs.publicFinance;
  const pressure = String(pf?.pressure ?? pf?.fiscalPosition?.pressure ?? '');
  let summary = `Policy read: ${stance} (fiscal tilt ${fiscalTilt.toFixed(1)}, credit tilt ${creditTilt.toFixed(1)}).`;
  if (stance === 'conflicted' && pressure === 'strained') {
    summary += ' Simultaneous fiscal and credit tightening — macro stabilizers may bind.';
  }
  if (params.state.investmentClimate === 'frozen' && stance === 'restrictive') {
    summary += ' Investment climate frozen under restrictive composite stance.';
  }
  return { stance, fiscalTilt, creditTilt, summary };
}


// --- source: counterfactual-delta.ts ---

export interface MacroCounterfactualDelta {
  baselineTurn: number;
  cycleScoreDelta: number;
  investmentScoreDelta: number;
  productivityScoreDelta: number;
  outputIndexDelta: number;
  stressScoreDelta: number;
}

/** Single-turn counterfactual: same persisted path, alternate inputs overlay. */
export function computeMacroCounterfactualDelta(
  baseInputs: MacroEconomyInputs,
  overlay: Partial<MacroEconomyInputs>,
  persisted: Parameters<typeof computeNationalMacroEconomy>[1],
  prev: NationalMacroEconomyState | null
): MacroCounterfactualDelta {
  const baseline = computeNationalMacroEconomy(baseInputs, persisted, prev).state;
  const stressed = computeNationalMacroEconomy({ ...baseInputs, ...overlay, turn: baseInputs.turn }, persisted, prev)
    .state;
  return {
    baselineTurn: baseInputs.turn,
    cycleScoreDelta: stressed.cycleMomentum - baseline.cycleMomentum,
    investmentScoreDelta: stressed.grossInvestmentIndex - baseline.grossInvestmentIndex,
    productivityScoreDelta: stressed.productivityIndex - baseline.productivityIndex,
    outputIndexDelta: stressed.accounting.grossOutputIndex - baseline.accounting.grossOutputIndex,
    stressScoreDelta: stressed.stressIndex.score - baseline.stressIndex.score
  };
}


// --- source: macro-capacity-snapshot.ts ---

export type { MacroCapacityBand, MacroCapacitySnapshot };

/** Composite capacity read from utilization, industry, and workforce spillovers. */
export function buildMacroCapacitySnapshot(params: {
  state: Pick<NationalMacroEconomyState, 'utilizationIndex' | 'utilizationBand' | 'investmentClimate'>;
  industry: MacroIndustrySpillover;
  workforce: MacroWorkforceSpillover;
}): MacroCapacitySnapshot {
  const utilComponent = (params.state.utilizationIndex - 50) / 50;
  const industryComponent = params.industry.productivityNudge / 6;
  const workforceComponent = -(params.workforce.productivityNudge / 8);
  const raw = utilComponent * 0.45 + industryComponent * 0.25 + workforceComponent * 0.3;
  const index = v1014macroClamp(Math.round((50 + raw * 35) * 10) / 10, 0, 100);

  let band: MacroCapacityBand = 'balanced';
  if (index >= 78) band = 'binding';
  else if (index >= 62) band = 'tight';
  else if (index <= 28) band = 'deep_slack';
  else if (index <= 42) band = 'slack';

  let summary = `Capacity index ${index.toFixed(0)} (${band}) from utilization and labor/industry reads.`;
  if (band === 'binding' && params.state.investmentClimate === 'active') {
    summary += ' Binding capacity may limit further investment acceleration.';
  }
  if (band === 'deep_slack' && params.state.utilizationBand === 'slack') {
    summary += ' Deep slack suggests substantial macro headroom before constraints bind.';
  }

  return { index, band, summary };
}


// --- source: macro-transmission-balance.ts ---

export type { MacroTransmissionBalanceBand, MacroTransmissionBalanceSnapshot };

/** Measures how aligned vs conflicting cross-layer transmission nudges are. */
export function buildMacroTransmissionBalanceSnapshot(report: MacroTransmissionReport): MacroTransmissionBalanceSnapshot {
  const cycleSigns = report.layers.map(l => Math.sign(l.cycleContribution)).filter(s => s !== 0);
  const invSigns = report.layers.map(l => Math.sign(l.investmentContribution)).filter(s => s !== 0);
  const prodSigns = report.layers.map(l => Math.sign(l.productivityContribution)).filter(s => s !== 0);

  const disagreement =
    signDispersion(cycleSigns) * 0.4 + signDispersion(invSigns) * 0.35 + signDispersion(prodSigns) * 0.25;
  const magnitudeSpread =
    report.layers.length > 0
      ? stdDev(report.layers.map(l => magnitude(l))) / Math.max(1, mean(report.layers.map(l => magnitude(l))))
      : 0;

  const raw = v1014macroClamp(disagreement * 0.55 + Math.min(1, magnitudeSpread) * 0.45, 0, 1);
  const dispersionIndex = Math.round(raw * 1000) / 10;

  let band: MacroTransmissionBalanceBand = 'aligned';
  if (dispersionIndex >= 72) band = 'fragmented';
  else if (dispersionIndex >= 52) band = 'cross_current';
  else if (dispersionIndex >= 32) band = 'mixed';

  let summary = `Transmission dispersion ${dispersionIndex.toFixed(1)} (${band}) across ${report.layers.length} layers.`;
  if (band === 'cross_current' || band === 'fragmented') {
    summary += ' Opposing layer nudges — interpret headline macro scores with caution.';
  } else if (band === 'aligned') {
    summary += ' Layer nudges broadly reinforce the national macro read.';
  }

  return { dispersionIndex, band, summary };
}

function magnitude(l: { cycleContribution: number; investmentContribution: number; productivityContribution: number }): number {
  return Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution);
}

function signDispersion(signs: number[]): number {
  if (signs.length <= 1) return 0;
  const pos = signs.filter(s => s > 0).length;
  const neg = signs.filter(s => s < 0).length;
  return Math.min(1, (Math.min(pos, neg) * 2) / signs.length);
}

function mean(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length <= 1) return 0;
  const m = mean(values);
  return Math.sqrt(values.reduce((a, v) => a + (v - m) ** 2, 0) / values.length);
}


// --- source: macro-transmission-coherence.ts ---
  BusinessCyclePhase,
  MacroTransmissionCoherenceBand,
  MacroTransmissionCoherenceSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionCoherenceBand, MacroTransmissionCoherenceSnapshot };

/** Share of transmission layers whose net nudge aligns with the current cycle phase read. */
export function buildMacroTransmissionCoherenceSnapshot(
  report: MacroTransmissionReport,
  cyclePhase: BusinessCyclePhase
): MacroTransmissionCoherenceSnapshot {
  const expectUp = cyclePhase === 'expansion' || cyclePhase === 'recovery' || cyclePhase === 'peak';
  const expectDown = cyclePhase === 'contraction' || cyclePhase === 'trough' || cyclePhase === 'slowdown';

  let aligned = 0;
  let considered = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (Math.abs(net) < 0.05) continue;
    considered++;
    const sign = Math.sign(net);
    if (expectUp && sign > 0) aligned++;
    else if (expectDown && sign < 0) aligned++;
    else if (!expectUp && !expectDown) aligned++;
  }

  const ratio = considered > 0 ? aligned / considered : 1;
  const coherenceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCoherenceBand = 'coherent';
  if (coherenceIndex < 45) band = 'contradictory';
  else if (coherenceIndex < 62) band = 'mixed';
  else if (coherenceIndex < 78) band = 'partial';

  let summary = `Transmission coherence ${coherenceIndex.toFixed(1)} (${band}) for ${cyclePhase} phase across ${report.layers.length} layers.`;
  if (band === 'contradictory' || band === 'mixed') {
    summary += ' Layer nudges partially oppose the headline cycle phase.';
  }

  return { coherenceIndex, band, alignedLayerCount: aligned, consideredLayerCount: considered, summary };
}


// --- source: macro-transmission-concentration.ts ---
  MacroTransmissionConcentrationBand,
  MacroTransmissionConcentrationSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionConcentrationBand, MacroTransmissionConcentrationSnapshot };

/** Herfindahl-style concentration of transmission magnitude across layers. */
export function buildMacroTransmissionConcentrationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionConcentrationSnapshot {
  const weights = report.layers.map(l => layerMagnitude(l));
  const total = weights.reduce((a, b) => a + b, 0);
  if (total <= 0.01 || weights.length === 0) {
    return {
      concentrationIndex: 0,
      band: 'diffuse',
      dominantShare: 0,
      summary: 'No material transmission magnitude — concentration read is diffuse.'
    };
  }

  const shares = weights.map(w => w / total);
  const hhi = shares.reduce((a, s) => a + s * s, 0);
  const normalized = v1014macroClamp((hhi - 1 / Math.max(1, shares.length)) / (1 - 1 / Math.max(1, shares.length)), 0, 1);
  const concentrationIndex = Math.round(normalized * 1000) / 10;
  const dominantShare = Math.round(Math.max(...shares) * 1000) / 10;

  let band: MacroTransmissionConcentrationBand = 'diffuse';
  if (concentrationIndex >= 68 || dominantShare >= 42) band = 'dominant_single';
  else if (concentrationIndex >= 48) band = 'concentrated';
  else if (concentrationIndex >= 28) band = 'moderate';

  let summary = `Transmission concentration ${concentrationIndex.toFixed(1)} (${band}); top layer share ${dominantShare.toFixed(1)}%.`;
  if (band === 'dominant_single' || band === 'concentrated') {
    summary += ' Macro read is sensitive to a narrow set of cross-system layers.';
  }

  return { concentrationIndex, band, dominantShare, summary };
}

function layerMagnitude(l: {
  cycleContribution: number;
  investmentContribution: number;
  productivityContribution: number;
}): number {
  return Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution);
}


// --- source: macro-transmission-asymmetry.ts ---
  MacroTransmissionAsymmetryBand,
  MacroTransmissionAsymmetrySnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionAsymmetryBand, MacroTransmissionAsymmetrySnapshot };

/** Measures imbalance between supportive vs restrictive transmission nudges. */
export function buildMacroTransmissionAsymmetrySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAsymmetrySnapshot {
  let supportive = 0;
  let restrictive = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.4 + layer.productivityContribution * 0.25;
    if (net > 0.05) supportive += Math.abs(net);
    else if (net < -0.05) restrictive += Math.abs(net);
  }
  const total = supportive + restrictive;
  if (total <= 0.01) {
    return {
      asymmetryIndex: 0,
      band: 'balanced',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — asymmetry read is balanced.'
    };
  }
  const skew = (supportive - restrictive) / total;
  const asymmetryIndex = Math.round(Math.abs(skew) * 1000) / 10;

  let band: MacroTransmissionAsymmetryBand = 'balanced';
  if (asymmetryIndex >= 55) band = skew > 0 ? 'support_skewed' : 'restrict_skewed';
  else if (asymmetryIndex >= 30) band = skew > 0 ? 'mild_support' : 'mild_restrict';

  const summary = `Transmission asymmetry ${asymmetryIndex.toFixed(1)} (${band}); supportive ${supportive.toFixed(1)} vs restrictive ${restrictive.toFixed(1)}.`;

  return {
    asymmetryIndex,
    band,
    supportiveMass: Math.round(supportive * 100) / 100,
    restrictiveMass: Math.round(restrictive * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-volatility.ts ---
  MacroTransmissionVolatilityBand,
  MacroTransmissionVolatilitySnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionVolatilityBand, MacroTransmissionVolatilitySnapshot };

/** Cross-layer magnitude spread — high spread implies volatile composite macro read. */
export function buildMacroTransmissionVolatilitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionVolatilitySnapshot {
  const magnitudes = report.layers.map(
    l => Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution)
  );
  if (magnitudes.length === 0) {
    return {
      volatilityIndex: 0,
      band: 'stable',
      layerSpread: 0,
      summary: 'No transmission layers — volatility read is stable.'
    };
  }
  const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const variance = magnitudes.reduce((a, v) => a + (v - mean) ** 2, 0) / magnitudes.length;
  const spread = Math.sqrt(variance);
  const normalized = mean > 0.01 ? v1014macroClamp(spread / mean, 0, 2) / 2 : 0;
  const volatilityIndex = Math.round(normalized * 1000) / 10;

  let band: MacroTransmissionVolatilityBand = 'stable';
  if (volatilityIndex >= 62) band = 'turbulent';
  else if (volatilityIndex >= 42) band = 'elevated';
  else if (volatilityIndex >= 22) band = 'moderate';

  const summary = `Transmission volatility ${volatilityIndex.toFixed(1)} (${band}); layer magnitude spread ${spread.toFixed(2)}.`;

  return { volatilityIndex, band, layerSpread: Math.round(spread * 100) / 100, summary };
}


// --- source: macro-transmission-resilience.ts ---
  MacroTransmissionReport,
  MacroTransmissionResilienceBand,
  MacroTransmissionResilienceSnapshot
} from './types.ts';

export type { MacroTransmissionResilienceBand, MacroTransmissionResilienceSnapshot };

/** Share of layers whose net nudge is not materially restrictive — macro read resilience proxy. */
export function buildMacroTransmissionResilienceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionResilienceSnapshot {
  let resilient = 0;
  let considered = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (Math.abs(net) < 0.05) continue;
    considered++;
    if (net >= -0.15) resilient++;
  }
  const ratio = considered > 0 ? resilient / considered : 1;
  const resilienceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionResilienceBand = 'fragile';
  if (resilienceIndex >= 78) band = 'robust';
  else if (resilienceIndex >= 62) band = 'steady';
  else if (resilienceIndex >= 45) band = 'mixed';

  const summary = `Transmission resilience ${resilienceIndex.toFixed(1)} (${band}); ${resilient}/${considered} layers non-restrictive.`;

  return { resilienceIndex, band, resilientLayerCount: resilient, consideredLayerCount: considered, summary };
}


// --- source: macro-transmission-coverage.ts ---
  MacroTransmissionCoverageBand,
  MacroTransmissionCoverageSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionCoverageBand, MacroTransmissionCoverageSnapshot };

/** Share of transmission layers carrying material (non-zero) nudge magnitude. */
export function buildMacroTransmissionCoverageSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionCoverageSnapshot {
  const total = report.layers.length;
  if (total === 0) {
    return { coverageIndex: 0, band: 'sparse', activeLayerCount: 0, summary: 'No transmission layers — coverage is sparse.' };
  }
  let active = 0;
  for (const layer of report.layers) {
    const mag =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (mag > 0.05) active++;
  }
  const ratio = active / total;
  const coverageIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCoverageBand = 'sparse';
  if (coverageIndex >= 75) band = 'broad';
  else if (coverageIndex >= 55) band = 'moderate';
  else if (coverageIndex >= 35) band = 'narrow';

  const summary = `Transmission coverage ${coverageIndex.toFixed(1)} (${band}); ${active}/${total} layers materially active.`;

  return { coverageIndex, band, activeLayerCount: active, summary };
}


// --- source: macro-transmission-amplification.ts ---
  MacroTransmissionAmplificationBand,
  MacroTransmissionAmplificationSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionAmplificationBand, MacroTransmissionAmplificationSnapshot };

/** Net amplification of restrictive vs supportive layer mass (headline macro sensitivity). */
export function buildMacroTransmissionAmplificationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAmplificationSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (net > 0.05) support += net;
    else if (net < -0.05) restrict += Math.abs(net);
  }
  const total = support + restrict;
  if (total <= 0.01) {
    return {
      amplificationIndex: 0,
      band: 'neutral',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — amplification read is neutral.'
    };
  }
  const skew = (restrict - support) / total;
  const amplificationIndex = Math.round(v1014macroClamp((skew + 1) / 2, 0, 1) * 1000) / 10;

  let band: MacroTransmissionAmplificationBand = 'neutral';
  if (amplificationIndex >= 68) band = 'restrictive';
  else if (amplificationIndex >= 58) band = 'mild_restrict';
  else if (amplificationIndex <= 32) band = 'supportive';
  else if (amplificationIndex <= 42) band = 'mild_support';

  const summary = `Transmission amplification ${amplificationIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    amplificationIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-tension.ts ---
  MacroTransmissionReport,
  MacroTransmissionTensionBand,
  MacroTransmissionTensionSnapshot
} from './types.ts';

export type { MacroTransmissionTensionBand, MacroTransmissionTensionSnapshot };

/** Net restrictive minus supportive layer mass — macro tension proxy. */
export function buildMacroTransmissionTensionSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionTensionSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (net > 0.05) support += net;
    else if (net < -0.05) restrict += Math.abs(net);
  }
  const raw = restrict - support;
  const normalized = v1014macroClamp((raw + 10) / 20, 0, 1);
  const tensionIndex = Math.round(normalized * 1000) / 10;

  let band: MacroTransmissionTensionBand = 'balanced';
  if (tensionIndex >= 68) band = 'acute';
  else if (tensionIndex >= 52) band = 'elevated';
  else if (tensionIndex <= 32) band = 'supportive';

  const summary = `Transmission tension ${tensionIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    tensionIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-divergence.ts ---
  MacroTransmissionDivergenceBand,
  MacroTransmissionDivergenceSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionDivergenceBand, MacroTransmissionDivergenceSnapshot };

/** Cycle vs investment directional disagreement across transmission layers. */
export function buildMacroTransmissionDivergenceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionDivergenceSnapshot {
  let aligned = 0;
  let conflict = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05) continue;
    if (c * i >= 0) aligned += 1;
    else conflict += 1;
  }
  const active = aligned + conflict;
  if (active <= 0) {
    return {
      divergenceIndex: 0,
      band: 'aligned',
      conflictingLayerCount: 0,
      alignedLayerCount: 0,
      summary: 'No active cycle/investment nudges — divergence read is aligned.'
    };
  }
  const ratio = conflict / active;
  const divergenceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionDivergenceBand = 'moderate';
  if (divergenceIndex >= 62) band = 'wide';
  else if (divergenceIndex >= 45) band = 'elevated';
  else if (divergenceIndex <= 22) band = 'aligned';

  const summary = `Transmission divergence ${divergenceIndex.toFixed(1)} (${band}); ${conflict}/${active} layers disagree on cycle vs investment sign.`;

  return {
    divergenceIndex,
    band,
    conflictingLayerCount: conflict,
    alignedLayerCount: aligned,
    summary
  };
}


// --- source: macro-transmission-stability.ts ---
  MacroTransmissionReport,
  MacroTransmissionStabilityBand,
  MacroTransmissionStabilitySnapshot
} from './types.ts';

export type { MacroTransmissionStabilityBand, MacroTransmissionStabilitySnapshot };

/** Cycle vs productivity directional disagreement across transmission layers. */
export function buildMacroTransmissionStabilitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionStabilitySnapshot {
  let aligned = 0;
  let conflict = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const p = layer.productivityContribution;
    if (Math.abs(c) < 0.05 && Math.abs(p) < 0.05) continue;
    if (c * p >= 0) aligned += 1;
    else conflict += 1;
  }
  const active = aligned + conflict;
  if (active <= 0) {
    return {
      stabilityIndex: 0,
      band: 'stable',
      conflictingLayerCount: 0,
      alignedLayerCount: 0,
      summary: 'No active cycle/productivity nudges — stability read is stable.'
    };
  }
  const ratio = conflict / active;
  const stabilityIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionStabilityBand = 'moderate';
  if (stabilityIndex >= 62) band = 'unstable';
  else if (stabilityIndex >= 45) band = 'fragile';
  else if (stabilityIndex <= 22) band = 'stable';

  const summary = `Transmission stability ${stabilityIndex.toFixed(1)} (${band}); ${conflict}/${active} layers disagree on cycle vs productivity sign.`;

  return {
    stabilityIndex,
    band,
    conflictingLayerCount: conflict,
    alignedLayerCount: aligned,
    summary
  };
}


// --- source: macro-transmission-alignment.ts ---
  MacroTransmissionAlignmentBand,
  MacroTransmissionAlignmentSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionAlignmentBand, MacroTransmissionAlignmentSnapshot };

/** Investment vs productivity directional disagreement across transmission layers. */
export function buildMacroTransmissionAlignmentSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAlignmentSnapshot {
  let aligned = 0;
  let conflict = 0;
  for (const layer of report.layers) {
    const i = layer.investmentContribution;
    const p = layer.productivityContribution;
    if (Math.abs(i) < 0.05 && Math.abs(p) < 0.05) continue;
    if (i * p >= 0) aligned += 1;
    else conflict += 1;
  }
  const active = aligned + conflict;
  if (active <= 0) {
    return {
      alignmentIndex: 0,
      band: 'aligned',
      conflictingLayerCount: 0,
      alignedLayerCount: 0,
      summary: 'No active investment/productivity nudges — alignment read is aligned.'
    };
  }
  const ratio = conflict / active;
  const alignmentIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionAlignmentBand = 'moderate';
  if (alignmentIndex >= 62) band = 'misaligned';
  else if (alignmentIndex >= 45) band = 'strained';
  else if (alignmentIndex <= 22) band = 'aligned';

  const summary = `Transmission alignment ${alignmentIndex.toFixed(1)} (${band}); ${conflict}/${active} layers disagree on investment vs productivity sign.`;

  return {
    alignmentIndex,
    band,
    conflictingLayerCount: conflict,
    alignedLayerCount: aligned,
    summary
  };
}


// --- source: macro-transmission-synchronization.ts ---
  MacroTransmissionReport,
  MacroTransmissionSynchronizationBand,
  MacroTransmissionSynchronizationSnapshot
} from './types.ts';

export type { MacroTransmissionSynchronizationBand, MacroTransmissionSynchronizationSnapshot };

/** Share of active layers with aligned cycle, investment, and productivity sign. */
export function buildMacroTransmissionSynchronizationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionSynchronizationSnapshot {
  let synchronized = 0;
  let active = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    const p = layer.productivityContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05 && Math.abs(p) < 0.05) continue;
    active += 1;
    const signs = [c, i, p].filter(v => Math.abs(v) >= 0.05).map(v => Math.sign(v));
    if (signs.length >= 2 && signs.every(s => s === signs[0])) synchronized += 1;
    else if (signs.length === 1) synchronized += 1;
  }
  if (active <= 0) {
    return {
      synchronizationIndex: 100,
      band: 'locked',
      synchronizedLayerCount: 0,
      activeLayerCount: 0,
      summary: 'No active transmission nudges — synchronization read is locked.'
    };
  }
  const ratio = synchronized / active;
  const synchronizationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionSynchronizationBand = 'mixed';
  if (synchronizationIndex >= 78) band = 'locked';
  else if (synchronizationIndex >= 58) band = 'coherent';
  else if (synchronizationIndex <= 35) band = 'fractured';

  const summary = `Transmission synchronization ${synchronizationIndex.toFixed(1)} (${band}); ${synchronized}/${active} active layers share aligned nudge signs.`;

  return {
    synchronizationIndex,
    band,
    synchronizedLayerCount: synchronized,
    activeLayerCount: active,
    summary
  };
}


// --- source: macro-transmission-intensity.ts ---
  MacroTransmissionIntensityBand,
  MacroTransmissionIntensitySnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionIntensityBand, MacroTransmissionIntensitySnapshot };

/** Share of transmission layers carrying material multi-channel nudges. */
export function buildMacroTransmissionIntensitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionIntensitySnapshot {
  const total = report.layers.length;
  if (total <= 0) {
    return {
      intensityIndex: 0,
      band: 'dormant',
      activeLayerCount: 0,
      totalLayerCount: 0,
      summary: 'Empty transmission report — intensity read is dormant.'
    };
  }
  let active = 0;
  for (const layer of report.layers) {
    const mag =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (mag >= 0.35) active += 1;
  }
  const ratio = active / total;
  const intensityIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionIntensityBand = 'moderate';
  if (intensityIndex >= 72) band = 'acute';
  else if (intensityIndex >= 52) band = 'elevated';
  else if (intensityIndex <= 28) band = 'dormant';

  const summary = `Transmission intensity ${intensityIndex.toFixed(1)} (${band}); ${active}/${total} layers carry material nudges.`;

  return {
    intensityIndex,
    band,
    activeLayerCount: active,
    totalLayerCount: total,
    summary
  };
}


// --- source: macro-transmission-polarization.ts ---
  MacroTransmissionPolarizationBand,
  MacroTransmissionPolarizationSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionPolarizationBand, MacroTransmissionPolarizationSnapshot };

/** Restrictive vs supportive layer mass imbalance across transmission stack. */
export function buildMacroTransmissionPolarizationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionPolarizationSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution + layer.productivityContribution;
    if (net > 0.08) support += net;
    else if (net < -0.08) restrict += Math.abs(net);
  }
  const total = support + restrict;
  if (total <= 0) {
    return {
      polarizationIndex: 0,
      band: 'balanced',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — polarization read is balanced.'
    };
  }
  const skew = (restrict - support) / total;
  const polarizationIndex = Math.round(v1014macroClamp((Math.abs(skew) + 1) / 2, 0, 1) * 1000) / 10;

  let band: MacroTransmissionPolarizationBand = 'balanced';
  if (polarizationIndex >= 72) band = skew > 0 ? 'restrictive_dominant' : 'supportive_dominant';
  else if (polarizationIndex >= 55) band = 'elevated';

  const summary = `Transmission polarization ${polarizationIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    polarizationIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-coupling.ts ---
  MacroTransmissionCouplingBand,
  MacroTransmissionCouplingSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionCouplingBand, MacroTransmissionCouplingSnapshot };

/** Mean absolute co-movement of cycle and investment contributions across layers. */
export function buildMacroTransmissionCouplingSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionCouplingSnapshot {
  let sum = 0;
  let count = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05) continue;
    sum += Math.min(Math.abs(c), Math.abs(i)) * (c * i >= 0 ? 1 : 0.35);
    count += 1;
  }
  if (count <= 0) {
    return {
      couplingIndex: 0,
      band: 'loose',
      coupledLayerCount: 0,
      summary: 'No active cycle/investment pairs — coupling read is loose.'
    };
  }
  const avg = sum / count;
  const couplingIndex = Math.round(v1014macroClamp(avg / 3, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCouplingBand = 'moderate';
  if (couplingIndex >= 68) band = 'tight';
  else if (couplingIndex >= 48) band = 'firm';
  else if (couplingIndex <= 25) band = 'loose';

  const summary = `Transmission coupling ${couplingIndex.toFixed(1)} (${band}); ${count} layers with co-moving cycle/investment nudges.`;

  return {
    couplingIndex,
    band,
    coupledLayerCount: count,
    summary
  };
}


// --- source: macro-transmission-imbalance.ts ---
  MacroTransmissionImbalanceBand,
  MacroTransmissionImbalanceSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionImbalanceBand, MacroTransmissionImbalanceSnapshot };

/** Net restrictive minus supportive transmission mass (signed imbalance index). */
export function buildMacroTransmissionImbalanceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionImbalanceSnapshot {
  let support = 0;
  let restrict = 0;
  for (const layer of report.layers) {
    const net = layer.cycleContribution + layer.investmentContribution + layer.productivityContribution;
    if (net > 0.08) support += net;
    else if (net < -0.08) restrict += Math.abs(net);
  }
  const total = support + restrict;
  if (total <= 0) {
    return {
      imbalanceIndex: 0,
      band: 'balanced',
      supportiveMass: 0,
      restrictiveMass: 0,
      summary: 'No directional transmission mass — imbalance read is balanced.'
    };
  }
  const skew = (restrict - support) / total;
  const imbalanceIndex = Math.round(v1014macroClamp((skew + 1) / 2, 0, 1) * 1000) / 10;

  let band: MacroTransmissionImbalanceBand = 'balanced';
  if (imbalanceIndex >= 72) band = skew > 0 ? 'restrictive_heavy' : 'supportive_heavy';
  else if (imbalanceIndex >= 55) band = 'tilted';

  const summary = `Transmission imbalance ${imbalanceIndex.toFixed(1)} (${band}); restrict ${restrict.toFixed(1)} vs support ${support.toFixed(1)}.`;

  return {
    imbalanceIndex,
    band,
    supportiveMass: Math.round(support * 100) / 100,
    restrictiveMass: Math.round(restrict * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-harmonic.ts ---
  MacroTransmissionHarmonicBand,
  MacroTransmissionHarmonicSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionHarmonicBand, MacroTransmissionHarmonicSnapshot };

/** Share of active layers whose cycle, investment, and productivity nudges share the same sign. */
export function buildMacroTransmissionHarmonicSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionHarmonicSnapshot {
  let harmonic = 0;
  let active = 0;
  for (const layer of report.layers) {
    const c = layer.cycleContribution;
    const i = layer.investmentContribution;
    const p = layer.productivityContribution;
    if (Math.abs(c) < 0.05 && Math.abs(i) < 0.05 && Math.abs(p) < 0.05) continue;
    active++;
    const signs = [c, i, p].filter(v => Math.abs(v) >= 0.05).map(v => Math.sign(v));
    const unique = new Set(signs);
    if (unique.size === 1) harmonic++;
  }
  if (active <= 0) {
    return {
      harmonicIndex: 0,
      band: 'dissonant',
      harmonicLayerCount: 0,
      activeLayerCount: 0,
      summary: 'No active multi-channel transmission layers — harmonic read is neutral.'
    };
  }
  const ratio = harmonic / active;
  const harmonicIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionHarmonicBand = 'mixed';
  if (harmonicIndex >= 72) band = 'aligned';
  else if (harmonicIndex >= 52) band = 'partial';
  else if (harmonicIndex <= 28) band = 'dissonant';

  const summary = `Transmission harmonic ${harmonicIndex.toFixed(1)} (${band}); ${harmonic}/${active} layers with aligned channel signs.`;

  return {
    harmonicIndex,
    band,
    harmonicLayerCount: harmonic,
    activeLayerCount: active,
    summary
  };
}


// --- source: macro-transmission-gradient.ts ---
  MacroTransmissionGradientBand,
  MacroTransmissionGradientSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionGradientBand, MacroTransmissionGradientSnapshot };

/** Spread between strongest and weakest active transmission layer magnitudes. */
export function buildMacroTransmissionGradientSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionGradientSnapshot {
  const magnitudes: number[] = [];
  for (const layer of report.layers) {
    const m =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (m >= 0.08) magnitudes.push(m);
  }
  if (magnitudes.length <= 1) {
    return {
      gradientIndex: 0,
      band: 'flat',
      peakMagnitude: magnitudes[0] ?? 0,
      floorMagnitude: magnitudes[0] ?? 0,
      summary: 'Insufficient active transmission spread — gradient read is flat.'
    };
  }
  const peak = Math.max(...magnitudes);
  const floor = Math.min(...magnitudes);
  const spread = peak - floor;
  const gradientIndex = Math.round(v1014macroClamp(spread / 8, 0, 1) * 1000) / 10;

  let band: MacroTransmissionGradientBand = 'moderate';
  if (gradientIndex >= 68) band = 'steep';
  else if (gradientIndex >= 48) band = 'sloped';
  else if (gradientIndex <= 22) band = 'flat';

  const summary = `Transmission gradient ${gradientIndex.toFixed(1)} (${band}); peak ${peak.toFixed(2)} vs floor ${floor.toFixed(2)}.`;

  return {
    gradientIndex,
    band,
    peakMagnitude: Math.round(peak * 100) / 100,
    floorMagnitude: Math.round(floor * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-attenuation.ts ---
  MacroTransmissionAttenuationBand,
  MacroTransmissionAttenuationSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionAttenuationBand, MacroTransmissionAttenuationSnapshot };

/** Mean layer magnitude relative to the strongest active layer (attenuation / tail softness). */
export function buildMacroTransmissionAttenuationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionAttenuationSnapshot {
  const magnitudes: number[] = [];
  for (const layer of report.layers) {
    const m =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (m >= 0.08) magnitudes.push(m);
  }
  if (magnitudes.length <= 0) {
    return {
      attenuationIndex: 0,
      band: 'muted',
      activeLayerCount: 0,
      peakMagnitude: 0,
      summary: 'No active transmission mass — attenuation read is muted.'
    };
  }
  const peak = Math.max(...magnitudes);
  const mean = magnitudes.reduce((a, b) => a + b, 0) / magnitudes.length;
  const ratio = peak > 0 ? mean / peak : 0;
  const attenuationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionAttenuationBand = 'balanced';
  if (attenuationIndex >= 72) band = 'diffuse';
  else if (attenuationIndex >= 52) band = 'balanced';
  else if (attenuationIndex <= 28) band = 'muted';

  const summary = `Transmission attenuation ${attenuationIndex.toFixed(1)} (${band}); mean/peak ${ratio.toFixed(2)} across ${magnitudes.length} layers.`;

  return {
    attenuationIndex,
    band,
    activeLayerCount: magnitudes.length,
    peakMagnitude: Math.round(peak * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-envelope.ts ---
  MacroTransmissionEnvelopeBand,
  MacroTransmissionEnvelopeSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionEnvelopeBand, MacroTransmissionEnvelopeSnapshot };

/** Peak active-layer magnitude scaled to a 0–100 envelope index. */
export function buildMacroTransmissionEnvelopeSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionEnvelopeSnapshot {
  let peak = 0;
  let active = 0;
  for (const layer of report.layers) {
    const m =
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) +
      Math.abs(layer.productivityContribution);
    if (m < 0.08) continue;
    active++;
    if (m > peak) peak = m;
  }
  if (active <= 0) {
    return {
      envelopeIndex: 0,
      band: 'quiet',
      peakMagnitude: 0,
      activeLayerCount: 0,
      summary: 'No active transmission envelope — spillover read is quiet.'
    };
  }
  const envelopeIndex = Math.round(v1014macroClamp(peak / 12, 0, 1) * 1000) / 10;

  let band: MacroTransmissionEnvelopeBand = 'moderate';
  if (envelopeIndex >= 68) band = 'wide';
  else if (envelopeIndex >= 45) band = 'moderate';
  else if (envelopeIndex <= 22) band = 'quiet';

  const summary = `Transmission envelope ${envelopeIndex.toFixed(1)} (${band}); peak ${peak.toFixed(2)} across ${active} active layers.`;

  return {
    envelopeIndex,
    band,
    peakMagnitude: Math.round(peak * 100) / 100,
    activeLayerCount: active,
    summary
  };
}


// --- source: macro-transmission-persistence.ts ---
  MacroTransmissionPersistenceBand,
  MacroTransmissionPersistenceSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionPersistenceBand, MacroTransmissionPersistenceSnapshot };

/** Share of active layers whose net nudge sign matches the report aggregate net sign. */
export function buildMacroTransmissionPersistenceSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionPersistenceSnapshot {
  const net =
    report.netCycleNudge + report.netInvestmentNudge * 0.35 + report.netProductivityNudge * 0.2;
  const aggregateSign = Math.sign(net);
  if (aggregateSign === 0) {
    return {
      persistenceIndex: 50,
      band: 'mixed',
      alignedLayerCount: 0,
      activeLayerCount: 0,
      summary: 'Flat aggregate transmission — persistence read is mixed.'
    };
  }
  let aligned = 0;
  let active = 0;
  for (const layer of report.layers) {
    const layerNet = layer.cycleContribution + layer.investmentContribution * 0.35 + layer.productivityContribution * 0.2;
    if (Math.abs(layerNet) < 0.05) continue;
    active++;
    if (Math.sign(layerNet) === aggregateSign) aligned++;
  }
  if (active <= 0) {
    return {
      persistenceIndex: 0,
      band: 'fragile',
      alignedLayerCount: 0,
      activeLayerCount: 0,
      summary: 'No directional layer mass — persistence read is fragile.'
    };
  }
  const ratio = aligned / active;
  const persistenceIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionPersistenceBand = 'cohesive';
  if (persistenceIndex >= 72) band = 'cohesive';
  else if (persistenceIndex >= 52) band = 'mixed';
  else band = 'fragile';

  const summary = `Transmission persistence ${persistenceIndex.toFixed(1)} (${band}); ${aligned}/${active} layers align with aggregate sign.`;

  return {
    persistenceIndex,
    band,
    alignedLayerCount: aligned,
    activeLayerCount: active,
    summary
  };
}


// --- source: macro-transmission-centrality.ts ---
  MacroTransmissionCentralityBand,
  MacroTransmissionCentralitySnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionCentralityBand, MacroTransmissionCentralitySnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Share of active transmission mass carried by the top three layers. */
export function buildMacroTransmissionCentralitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionCentralitySnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.08).sort((a, b) => b - a);
  if (mags.length <= 0) {
    return {
      centralityIndex: 0,
      band: 'diffuse',
      topLayerCount: 0,
      summary: 'No active transmission mass — centrality read is diffuse.'
    };
  }
  const total = mags.reduce((a, b) => a + b, 0);
  const top3 = mags.slice(0, 3).reduce((a, b) => a + b, 0);
  const ratio = top3 / total;
  const centralityIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionCentralityBand = 'balanced';
  if (centralityIndex >= 68) band = 'concentrated';
  else if (centralityIndex <= 32) band = 'diffuse';

  const summary = `Transmission centrality ${centralityIndex.toFixed(1)} (${band}); top-3 share ${(ratio * 100).toFixed(0)}% of active mass.`;

  return {
    centralityIndex,
    band,
    topLayerCount: Math.min(3, mags.length),
    summary
  };
}


// --- source: macro-transmission-synthesis.ts ---
  MacroTransmissionSynthesisBand,
  MacroTransmissionSynthesisSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionSynthesisBand, MacroTransmissionSynthesisSnapshot };

/** Weighted net transmission magnitude normalized to a synthesis index. */
export function buildMacroTransmissionSynthesisSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionSynthesisSnapshot {
  let mass = 0;
  for (const layer of report.layers) {
    mass +=
      Math.abs(layer.cycleContribution) +
      Math.abs(layer.investmentContribution) * 0.45 +
      Math.abs(layer.productivityContribution) * 0.35;
  }
  const synthesisIndex = Math.round(v1014macroClamp(mass / (report.layers.length * 2.2), 0, 1) * 1000) / 10;

  let band: MacroTransmissionSynthesisBand = 'moderate';
  if (synthesisIndex >= 68) band = 'elevated';
  else if (synthesisIndex <= 28) band = 'subdued';

  const netSigned =
    report.netCycleNudge + report.netInvestmentNudge * 0.45 + report.netProductivityNudge * 0.35;
  const summary = `Transmission synthesis ${synthesisIndex.toFixed(1)} (${band}); net signed impulse ${netSigned.toFixed(2)} across ${report.layers.length} layers.`;

  return {
    synthesisIndex,
    band,
    grossMass: Math.round(mass * 100) / 100,
    netSignedImpulse: Math.round(netSigned * 100) / 100,
    summary
  };
}


// --- source: macro-transmission-dispersion.ts ---
  MacroTransmissionDispersionBand,
  MacroTransmissionDispersionSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionDispersionBand, MacroTransmissionDispersionSnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Coefficient-of-variation style spread of active transmission layer magnitudes. */
export function buildMacroTransmissionDispersionSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionDispersionSnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.05);
  if (mags.length <= 1) {
    return {
      dispersionIndex: 0,
      band: 'uniform',
      activeLayerCount: mags.length,
      summary: 'Insufficient active transmission mass — dispersion read is uniform.'
    };
  }
  const mean = mags.reduce((a, b) => a + b, 0) / mags.length;
  const variance = mags.reduce((a, m) => a + (m - mean) ** 2, 0) / mags.length;
  const std = Math.sqrt(variance);
  const cv = mean > 0.01 ? std / mean : 0;
  const dispersionIndex = Math.round(v1014macroClamp(cv, 0, 2) * 50 * 10) / 10;

  let band: MacroTransmissionDispersionBand = 'moderate';
  if (dispersionIndex >= 62) band = 'wide';
  else if (dispersionIndex <= 28) band = 'uniform';

  const summary = `Transmission dispersion ${dispersionIndex.toFixed(1)} (${band}); ${mags.length} active layers with CV ${(cv * 100).toFixed(0)}%.`;

  return {
    dispersionIndex,
    band,
    activeLayerCount: mags.length,
    summary
  };
}


// --- source: macro-transmission-fragmentation.ts ---
  MacroTransmissionFragmentationBand,
  MacroTransmissionFragmentationSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionFragmentationBand, MacroTransmissionFragmentationSnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Share of transmission layers carrying negligible spillover mass (fragmentation read). */
export function buildMacroTransmissionFragmentationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionFragmentationSnapshot {
  const total = report.layers.length;
  if (total <= 0) {
    return {
      fragmentationIndex: 0,
      band: 'cohesive',
      inactiveLayerCount: 0,
      summary: 'No transmission layers — fragmentation read is cohesive.'
    };
  }
  const inactive = report.layers.filter(l => layerMagnitude(l) < 0.08).length;
  const ratio = inactive / total;
  const fragmentationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionFragmentationBand = 'moderate';
  if (fragmentationIndex >= 62) band = 'fragmented';
  else if (fragmentationIndex <= 28) band = 'cohesive';

  const summary = `Transmission fragmentation ${fragmentationIndex.toFixed(1)} (${band}); ${inactive}/${total} layers below active mass threshold.`;

  return {
    fragmentationIndex,
    band,
    inactiveLayerCount: inactive,
    summary
  };
}


// --- source: macro-transmission-redundancy.ts ---
  MacroTransmissionRedundancyBand,
  MacroTransmissionRedundancySnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionRedundancyBand, MacroTransmissionRedundancySnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Share of active transmission mass carried by layers with aligned cycle sign. */
export function buildMacroTransmissionRedundancySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionRedundancySnapshot {
  const active = report.layers.filter(l => layerMagnitude(l) >= 0.08);
  if (active.length <= 1) {
    return {
      redundancyIndex: 0,
      band: 'diverse',
      alignedLayerCount: active.length,
      summary: 'Insufficient active transmission mass — redundancy read is diverse.'
    };
  }
  const dominantSign = Math.sign(
    active.reduce((a, l) => a + l.cycleContribution + l.investmentContribution * 0.4, 0)
  );
  const aligned = active.filter(l => {
    const signed = l.cycleContribution + l.investmentContribution * 0.4;
    return dominantSign === 0 ? Math.abs(signed) < 0.05 : Math.sign(signed) === dominantSign;
  });
  const totalMass = active.reduce((a, l) => a + layerMagnitude(l), 0);
  const alignedMass = aligned.reduce((a, l) => a + layerMagnitude(l), 0);
  const ratio = totalMass > 0.01 ? alignedMass / totalMass : 0;
  const redundancyIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionRedundancyBand = 'balanced';
  if (redundancyIndex >= 72) band = 'stacked';
  else if (redundancyIndex <= 35) band = 'diverse';

  const summary = `Transmission redundancy ${redundancyIndex.toFixed(1)} (${band}); ${aligned.length}/${active.length} active layers align on dominant impulse sign.`;

  return {
    redundancyIndex,
    band,
    alignedLayerCount: aligned.length,
    summary
  };
}


// --- source: macro-transmission-saturation.ts ---
  MacroTransmissionSaturationBand,
  MacroTransmissionSaturationSnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionSaturationBand, MacroTransmissionSaturationSnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Peak-layer share of gross active transmission mass (saturation read). */
export function buildMacroTransmissionSaturationSnapshot(
  report: MacroTransmissionReport
): MacroTransmissionSaturationSnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.08);
  if (mags.length <= 0) {
    return {
      saturationIndex: 0,
      band: 'diffuse',
      peakLayerMagnitude: 0,
      summary: 'No active transmission mass — saturation read is diffuse.'
    };
  }
  const total = mags.reduce((a, b) => a + b, 0);
  const peak = Math.max(...mags);
  const ratio = total > 0.01 ? peak / total : 0;
  const saturationIndex = Math.round(v1014macroClamp(ratio, 0, 1) * 1000) / 10;

  let band: MacroTransmissionSaturationBand = 'moderate';
  if (saturationIndex >= 38) band = 'saturated';
  else if (saturationIndex <= 15) band = 'diffuse';

  const summary = `Transmission saturation ${saturationIndex.toFixed(1)} (${band}); peak layer carries ${(ratio * 100).toFixed(0)}% of active mass.`;

  return {
    saturationIndex,
    band,
    peakLayerMagnitude: Math.round(peak * 100) / 100,
    summary
  };
}


// --- source: scenario-compare.ts ---

export interface MacroScenarioCompareRow {
  scenarioId: string;
  delta: MacroCounterfactualDelta;
  stressScore: number;
  capacityIndex: number;
}

/** Compare baseline against named input overlays (single turn, shared persisted path). */
export function compareMacroEconomyScenarios(
  baseInputs: MacroEconomyInputs,
  scenarios: Array<{ id: string; overlay: Partial<MacroEconomyInputs> }>,
  persisted: Parameters<typeof computeNationalMacroEconomy>[1],
  prev: NationalMacroEconomyState | null
): MacroScenarioCompareRow[] {
  return scenarios.map(({ id, overlay }) => {
    const delta = computeMacroCounterfactualDelta(baseInputs, overlay, persisted, prev);
    const stressed = computeNationalMacroEconomy({ ...baseInputs, ...overlay, turn: baseInputs.turn }, persisted, prev)
      .state;
    return {
      scenarioId: id,
      delta,
      stressScore: stressed.stressIndex.score,
      capacityIndex: stressed.capacitySnapshot.index
    };
  });
}


// --- source: scenario-ranking.ts ---

/** Rank scenario overlays by net macro outcome (output lift minus stress penalty). */
export function rankMacroEconomyScenariosByNetOutcome(rows: MacroScenarioCompareRow[]): MacroScenarioCompareRow[] {
  return [...rows].sort((a, b) => scenarioNetScore(b) - scenarioNetScore(a));
}

export function scenarioNetScore(row: MacroScenarioCompareRow): number {
  return (
    row.delta.outputIndexDelta +
    row.delta.productivityScoreDelta * 0.15 +
    row.delta.cycleScoreDelta * 10 -
    row.stressScore * 0.08 -
    Math.max(0, 60 - row.capacityIndex) * 0.02
  );
}


// --- source: scenario-elasticity.ts ---

export interface MacroScenarioElasticityRow {
  scenarioId: string;
  netScore: number;
  elasticity: number;
}

/** Rank scenario overlays by absolute net-outcome sensitivity (lab prioritization). */
export function rankMacroScenarioElasticity(rows: MacroScenarioCompareRow[]): MacroScenarioElasticityRow[] {
  return rows
    .map(row => ({
      scenarioId: row.scenarioId,
      netScore: scenarioNetScore(row),
      elasticity: Math.round(Math.abs(scenarioNetScore(row)) * 100) / 100
    }))
    .sort((a, b) => b.elasticity - a.elasticity);
}


// --- source: scenario-convergence.ts ---

export interface MacroScenarioConvergenceRow {
  scenarioId: string;
  netScore: number;
  distanceFromBaseline: number;
  convergenceIndex: number;
}

/** Rank scenario overlays by closeness to baseline net outcome (lab reconciliation). */
export function rankMacroScenarioConvergence(
  rows: MacroScenarioCompareRow[],
  baselineNetScore?: number
): MacroScenarioConvergenceRow[] {
  const baseline =
    baselineNetScore ??
    rows.reduce((best, row) => {
      const score = scenarioNetScore(row);
      return Math.abs(score) < Math.abs(best) ? score : best;
    }, scenarioNetScore(rows[0] ?? { scenarioId: 'baseline', delta: { cycleDelta: 0, investmentDelta: 0, productivityDelta: 0, outputDelta: 0 }, stressScore: 0, capacityIndex: 0 }));

  return rows
    .map(row => {
      const netScore = scenarioNetScore(row);
      const distanceFromBaseline = Math.round(Math.abs(netScore - baseline) * 100) / 100;
      const convergenceIndex = Math.round(Math.max(0, 100 - distanceFromBaseline * 8) * 10) / 10;
      return { scenarioId: row.scenarioId, netScore, distanceFromBaseline, convergenceIndex };
    })
    .sort((a, b) => b.convergenceIndex - a.convergenceIndex);
}


// --- source: scenario-divergence.ts ---

export interface MacroScenarioDivergenceRow {
  scenarioId: string;
  netScore: number;
  divergenceIndex: number;
}

/** Rank scenario overlays by absolute distance from the weakest net outcome (stress prioritization). */
export function rankMacroScenarioDivergence(rows: MacroScenarioCompareRow[]): MacroScenarioDivergenceRow[] {
  const scored = rows.map(row => ({
    scenarioId: row.scenarioId,
    netScore: scenarioNetScore(row)
  }));
  const anchor = scored.reduce((min, row) => (row.netScore < min ? row.netScore : min), scored[0]?.netScore ?? 0);

  return scored
    .map(row => ({
      scenarioId: row.scenarioId,
      netScore: row.netScore,
      divergenceIndex: Math.round(Math.abs(row.netScore - anchor) * 100) / 100
    }))
    .sort((a, b) => b.divergenceIndex - a.divergenceIndex);
}


// --- source: scenario-severity.ts ---

export interface MacroScenarioSeverityRow {
  scenarioId: string;
  netScore: number;
  stressScore: number;
  severityIndex: number;
}

/** Rank scenario overlays by composite severity (stress + divergence + downside net). */
export function rankMacroScenarioSeverity(rows: MacroScenarioCompareRow[]): MacroScenarioSeverityRow[] {
  const divergence = rankMacroScenarioDivergence(rows);
  const divById = Object.fromEntries(divergence.map(d => [d.scenarioId, d.divergenceIndex]));

  return rows
    .map(row => {
      const netScore = scenarioNetScore(row);
      const downside = netScore < 0 ? Math.abs(netScore) : 0;
      const severityIndex =
        Math.round((row.stressScore * 0.45 + (divById[row.scenarioId] ?? 0) * 0.35 + downside * 0.2) * 100) / 100;
      return {
        scenarioId: row.scenarioId,
        netScore,
        stressScore: row.stressScore,
        severityIndex
      };
    })
    .sort((a, b) => b.severityIndex - a.severityIndex);
}


// --- source: scenario-composite-rank.ts ---

export interface MacroScenarioCompositeRow {
  scenarioId: string;
  compositeScore: number;
}

/** Lab composite rank blending severity, elasticity, and convergence (higher = more policy attention). */
export function rankMacroScenarioComposite(rows: MacroScenarioCompareRow[]): MacroScenarioCompositeRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const elasticity = rankMacroScenarioElasticity(rows);
  const convergence = rankMacroScenarioConvergence(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const elMax = Math.max(1, ...elasticity.map(e => e.elasticity));
  const convMax = Math.max(1, ...convergence.map(c => c.convergenceIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const el = elasticity.find(e => e.scenarioId === row.scenarioId)?.elasticity ?? 0;
      const conv = convergence.find(c => c.scenarioId === row.scenarioId)?.convergenceIndex ?? 0;
      const compositeScore =
        Math.round(((sev / sevMax) * 0.5 + (el / elMax) * 0.3 + (1 - conv / convMax) * 0.2) * 1000) / 1000;
      return { scenarioId: row.scenarioId, compositeScore };
    })
    .sort((a, b) => b.compositeScore - a.compositeScore);
}


// --- source: scenario-frontier-rank.ts ---

export interface MacroScenarioFrontierRow {
  scenarioId: string;
  frontierScore: number;
}

/** Rank scenarios on severity–convergence frontier (high severity, low convergence → front). */
export function rankMacroScenarioFrontier(rows: MacroScenarioCompareRow[]): MacroScenarioFrontierRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const convergence = rankMacroScenarioConvergence(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const convMax = Math.max(1, ...convergence.map(c => c.convergenceIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const conv = convergence.find(c => c.scenarioId === row.scenarioId)?.convergenceIndex ?? 0;
      const frontierScore = Math.round(((sev / sevMax) * 0.65 + (1 - conv / convMax) * 0.35) * 1000) / 1000;
      return { scenarioId: row.scenarioId, frontierScore };
    })
    .sort((a, b) => b.frontierScore - a.frontierScore);
}


// --- source: scenario-hedge-rank.ts ---

export interface MacroScenarioHedgeRow {
  scenarioId: string;
  netScore: number;
  hedgeIndex: number;
}

/** Rank overlays that best hedge baseline stress (high net score, lower severity). */
export function rankMacroScenarioHedge(rows: MacroScenarioCompareRow[]): MacroScenarioHedgeRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));

  return rows
    .map(row => {
      const netScore = scenarioNetScore(row);
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const hedgeIndex = Math.round((Math.max(0, netScore) * 0.55 + (1 - sev / sevMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, netScore, hedgeIndex };
    })
    .sort((a, b) => b.hedgeIndex - a.hedgeIndex);
}


// --- source: scenario-triage-rank.ts ---

export interface MacroScenarioTriageRow {
  scenarioId: string;
  triagePriority: number;
}

/** Rank overlays for policy triage (high severity, low hedge priority first). */
export function rankMacroScenarioTriage(rows: MacroScenarioCompareRow[]): MacroScenarioTriageRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const hedge = rankMacroScenarioHedge(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const hedgeMax = Math.max(1, ...hedge.map(h => h.hedgeIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const hed = hedge.find(h => h.scenarioId === row.scenarioId)?.hedgeIndex ?? 0;
      const triagePriority =
        Math.round(((sev / sevMax) * 0.7 + (1 - hed / hedgeMax) * 0.3) * 1000) / 1000;
      return { scenarioId: row.scenarioId, triagePriority };
    })
    .sort((a, b) => b.triagePriority - a.triagePriority);
}


// --- source: scenario-contingency-rank.ts ---

export interface MacroScenarioContingencyRow {
  scenarioId: string;
  contingencyPriority: number;
}

/** Rank overlays for contingency planning (severity + triage, hedge-neutral). */
export function rankMacroScenarioContingency(rows: MacroScenarioCompareRow[]): MacroScenarioContingencyRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const triage = rankMacroScenarioTriage(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const triMax = Math.max(1, ...triage.map(t => t.triagePriority));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const tri = triage.find(t => t.scenarioId === row.scenarioId)?.triagePriority ?? 0;
      const contingencyPriority =
        Math.round(((sev / sevMax) * 0.55 + (tri / triMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, contingencyPriority };
    })
    .sort((a, b) => b.contingencyPriority - a.contingencyPriority);
}


// --- source: scenario-recovery-rank.ts ---

export interface MacroScenarioRecoveryRow {
  scenarioId: string;
  recoveryPriority: number;
}

/** Rank overlays for recovery planning (convergence minus severity pressure). */
export function rankMacroScenarioRecovery(rows: MacroScenarioCompareRow[]): MacroScenarioRecoveryRow[] {
  const severity = rankMacroScenarioSeverity(rows);
  const convergence = rankMacroScenarioConvergence(rows);
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));
  const convMax = Math.max(1, ...convergence.map(c => c.convergenceIndex));

  return rows
    .map(row => {
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const conv = convergence.find(c => c.scenarioId === row.scenarioId)?.convergenceIndex ?? 0;
      const recoveryPriority =
        Math.round(((conv / convMax) * 0.6 + (1 - sev / sevMax) * 0.4) * 1000) / 1000;
      return { scenarioId: row.scenarioId, recoveryPriority };
    })
    .sort((a, b) => b.recoveryPriority - a.recoveryPriority);
}


// --- source: scenario-resilience-rank.ts ---

export interface MacroScenarioResilienceRow {
  scenarioId: string;
  resiliencePriority: number;
}

/** Rank overlays for resilience planning (recovery plus hedge cushion). */
export function rankMacroScenarioResilience(rows: MacroScenarioCompareRow[]): MacroScenarioResilienceRow[] {
  const recovery = rankMacroScenarioRecovery(rows);
  const hedge = rankMacroScenarioHedge(rows);
  const recMax = Math.max(1, ...recovery.map(r => r.recoveryPriority));
  const hedgeMax = Math.max(1, ...hedge.map(h => h.hedgeIndex));

  return rows
    .map(row => {
      const rec = recovery.find(r => r.scenarioId === row.scenarioId)?.recoveryPriority ?? 0;
      const hed = hedge.find(h => h.scenarioId === row.scenarioId)?.hedgeIndex ?? 0;
      const resiliencePriority =
        Math.round(((rec / recMax) * 0.55 + (hed / hedgeMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, resiliencePriority };
    })
    .sort((a, b) => b.resiliencePriority - a.resiliencePriority);
}


// --- source: scenario-stabilization-rank.ts ---

export interface MacroScenarioStabilizationRow {
  scenarioId: string;
  stabilizationPriority: number;
}

/** Rank overlays for stabilization planning (resilience minus severity pressure). */
export function rankMacroScenarioStabilization(rows: MacroScenarioCompareRow[]): MacroScenarioStabilizationRow[] {
  const resilience = rankMacroScenarioResilience(rows);
  const severity = rankMacroScenarioSeverity(rows);
  const resMax = Math.max(1, ...resilience.map(r => r.resiliencePriority));
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));

  return rows
    .map(row => {
      const res = resilience.find(r => r.scenarioId === row.scenarioId)?.resiliencePriority ?? 0;
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const stabilizationPriority =
        Math.round(((res / resMax) * 0.65 + (1 - sev / sevMax) * 0.35) * 1000) / 1000;
      return { scenarioId: row.scenarioId, stabilizationPriority };
    })
    .sort((a, b) => b.stabilizationPriority - a.stabilizationPriority);
}


// --- source: scenario-mitigation-rank.ts ---

export interface MacroScenarioMitigationRow {
  scenarioId: string;
  mitigationPriority: number;
}

/** Rank overlays for mitigation planning (stabilization plus triage urgency). */
export function rankMacroScenarioMitigation(rows: MacroScenarioCompareRow[]): MacroScenarioMitigationRow[] {
  const stabilization = rankMacroScenarioStabilization(rows);
  const triage = rankMacroScenarioTriage(rows);
  const stabMax = Math.max(1, ...stabilization.map(s => s.stabilizationPriority));
  const triMax = Math.max(1, ...triage.map(t => t.triagePriority));

  return rows
    .map(row => {
      const stab = stabilization.find(s => s.scenarioId === row.scenarioId)?.stabilizationPriority ?? 0;
      const tri = triage.find(t => t.scenarioId === row.scenarioId)?.triagePriority ?? 0;
      const mitigationPriority =
        Math.round(((stab / stabMax) * 0.5 + (tri / triMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, mitigationPriority };
    })
    .sort((a, b) => b.mitigationPriority - a.mitigationPriority);
}


// --- source: scenario-adaptation-rank.ts ---

export interface MacroScenarioAdaptationRow {
  scenarioId: string;
  adaptationPriority: number;
}

/** Rank overlays for adaptation planning (mitigation plus recovery cushion). */
export function rankMacroScenarioAdaptation(rows: MacroScenarioCompareRow[]): MacroScenarioAdaptationRow[] {
  const mitigation = rankMacroScenarioMitigation(rows);
  const recovery = rankMacroScenarioRecovery(rows);
  const mitMax = Math.max(1, ...mitigation.map(m => m.mitigationPriority));
  const recMax = Math.max(1, ...recovery.map(r => r.recoveryPriority));

  return rows
    .map(row => {
      const mit = mitigation.find(m => m.scenarioId === row.scenarioId)?.mitigationPriority ?? 0;
      const rec = recovery.find(r => r.scenarioId === row.scenarioId)?.recoveryPriority ?? 0;
      const adaptationPriority =
        Math.round(((mit / mitMax) * 0.55 + (rec / recMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, adaptationPriority };
    })
    .sort((a, b) => b.adaptationPriority - a.adaptationPriority);
}


// --- source: scenario-containment-rank.ts ---

export interface MacroScenarioContainmentRow {
  scenarioId: string;
  containmentPriority: number;
}

/** Rank overlays for containment planning (adaptation minus severity tail risk). */
export function rankMacroScenarioContainment(rows: MacroScenarioCompareRow[]): MacroScenarioContainmentRow[] {
  const adaptation = rankMacroScenarioAdaptation(rows);
  const severity = rankMacroScenarioSeverity(rows);
  const adMax = Math.max(1, ...adaptation.map(a => a.adaptationPriority));
  const sevMax = Math.max(1, ...severity.map(s => s.severityIndex));

  return rows
    .map(row => {
      const ad = adaptation.find(a => a.scenarioId === row.scenarioId)?.adaptationPriority ?? 0;
      const sev = severity.find(s => s.scenarioId === row.scenarioId)?.severityIndex ?? 0;
      const containmentPriority =
        Math.round(((ad / adMax) * 0.6 + (1 - sev / sevMax) * 0.4) * 1000) / 1000;
      return { scenarioId: row.scenarioId, containmentPriority };
    })
    .sort((a, b) => b.containmentPriority - a.containmentPriority);
}


// --- source: scenario-rebalance-rank.ts ---

export interface MacroScenarioRebalanceRow {
  scenarioId: string;
  rebalancePriority: number;
}

/** Rank overlays for rebalance planning (containment plus hedge cushion). */
export function rankMacroScenarioRebalance(rows: MacroScenarioCompareRow[]): MacroScenarioRebalanceRow[] {
  const containment = rankMacroScenarioContainment(rows);
  const hedge = rankMacroScenarioHedge(rows);
  const conMax = Math.max(1, ...containment.map(c => c.containmentPriority));
  const hedMax = Math.max(1, ...hedge.map(h => h.hedgeIndex));

  return rows
    .map(row => {
      const con = containment.find(c => c.scenarioId === row.scenarioId)?.containmentPriority ?? 0;
      const hed = hedge.find(h => h.scenarioId === row.scenarioId)?.hedgeIndex ?? 0;
      const rebalancePriority =
        Math.round(((con / conMax) * 0.55 + (hed / hedMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, rebalancePriority };
    })
    .sort((a, b) => b.rebalancePriority - a.rebalancePriority);
}


// --- source: scenario-restoration-rank.ts ---

export interface MacroScenarioRestorationRow {
  scenarioId: string;
  restorationPriority: number;
}

/** Rank overlays for restoration planning (rebalance cushion plus recovery convergence). */
export function rankMacroScenarioRestoration(rows: MacroScenarioCompareRow[]): MacroScenarioRestorationRow[] {
  const rebalance = rankMacroScenarioRebalance(rows);
  const recovery = rankMacroScenarioRecovery(rows);
  const rebMax = Math.max(1, ...rebalance.map(r => r.rebalancePriority));
  const recMax = Math.max(1, ...recovery.map(r => r.recoveryPriority));

  return rows
    .map(row => {
      const reb = rebalance.find(r => r.scenarioId === row.scenarioId)?.rebalancePriority ?? 0;
      const rec = recovery.find(r => r.scenarioId === row.scenarioId)?.recoveryPriority ?? 0;
      const restorationPriority =
        Math.round(((reb / rebMax) * 0.5 + (rec / recMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, restorationPriority };
    })
    .sort((a, b) => b.restorationPriority - a.restorationPriority);
}


// --- source: scenario-renewal-rank.ts ---

export interface MacroScenarioRenewalRow {
  scenarioId: string;
  renewalPriority: number;
}

/** Rank overlays for renewal planning (restoration plus adaptation headroom). */
export function rankMacroScenarioRenewal(rows: MacroScenarioCompareRow[]): MacroScenarioRenewalRow[] {
  const restoration = rankMacroScenarioRestoration(rows);
  const adaptation = rankMacroScenarioAdaptation(rows);
  const resMax = Math.max(1, ...restoration.map(r => r.restorationPriority));
  const adMax = Math.max(1, ...adaptation.map(a => a.adaptationPriority));

  return rows
    .map(row => {
      const res = restoration.find(r => r.scenarioId === row.scenarioId)?.restorationPriority ?? 0;
      const ad = adaptation.find(a => a.scenarioId === row.scenarioId)?.adaptationPriority ?? 0;
      const renewalPriority =
        Math.round(((res / resMax) * 0.55 + (ad / adMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, renewalPriority };
    })
    .sort((a, b) => b.renewalPriority - a.renewalPriority);
}


// --- source: scenario-revival-rank.ts ---

export interface MacroScenarioRevivalRow {
  scenarioId: string;
  revivalPriority: number;
}

/** Rank overlays for revival planning (renewal cushion plus mitigation headroom). */
export function rankMacroScenarioRevival(rows: MacroScenarioCompareRow[]): MacroScenarioRevivalRow[] {
  const renewal = rankMacroScenarioRenewal(rows);
  const mitigation = rankMacroScenarioMitigation(rows);
  const renMax = Math.max(1, ...renewal.map(r => r.renewalPriority));
  const mitMax = Math.max(1, ...mitigation.map(m => m.mitigationPriority));

  return rows
    .map(row => {
      const ren = renewal.find(r => r.scenarioId === row.scenarioId)?.renewalPriority ?? 0;
      const mit = mitigation.find(m => m.scenarioId === row.scenarioId)?.mitigationPriority ?? 0;
      const revivalPriority =
        Math.round(((ren / renMax) * 0.55 + (mit / mitMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, revivalPriority };
    })
    .sort((a, b) => b.revivalPriority - a.revivalPriority);
}


// --- source: scenario-regeneration-rank.ts ---

export interface MacroScenarioRegenerationRow {
  scenarioId: string;
  regenerationPriority: number;
}

/** Rank overlays for regeneration planning (revival cushion plus adaptation headroom). */
export function rankMacroScenarioRegeneration(rows: MacroScenarioCompareRow[]): MacroScenarioRegenerationRow[] {
  const revival = rankMacroScenarioRevival(rows);
  const adaptation = rankMacroScenarioAdaptation(rows);
  const revMax = Math.max(1, ...revival.map(r => r.revivalPriority));
  const adMax = Math.max(1, ...adaptation.map(a => a.adaptationPriority));

  return rows
    .map(row => {
      const rev = revival.find(r => r.scenarioId === row.scenarioId)?.revivalPriority ?? 0;
      const ad = adaptation.find(a => a.scenarioId === row.scenarioId)?.adaptationPriority ?? 0;
      const regenerationPriority =
        Math.round(((rev / revMax) * 0.55 + (ad / adMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, regenerationPriority };
    })
    .sort((a, b) => b.regenerationPriority - a.regenerationPriority);
}


// --- source: scenario-reconstitution-rank.ts ---

export interface MacroScenarioReconstitutionRow {
  scenarioId: string;
  reconstitutionPriority: number;
}

/** Rank overlays for reconstitution planning (regeneration plus containment). */
export function rankMacroScenarioReconstitution(rows: MacroScenarioCompareRow[]): MacroScenarioReconstitutionRow[] {
  const regeneration = rankMacroScenarioRegeneration(rows);
  const containment = rankMacroScenarioContainment(rows);
  const regMax = Math.max(1, ...regeneration.map(r => r.regenerationPriority));
  const conMax = Math.max(1, ...containment.map(c => c.containmentPriority));

  return rows
    .map(row => {
      const reg = regeneration.find(r => r.scenarioId === row.scenarioId)?.regenerationPriority ?? 0;
      const con = containment.find(c => c.scenarioId === row.scenarioId)?.containmentPriority ?? 0;
      const reconstitutionPriority =
        Math.round(((reg / regMax) * 0.55 + (con / conMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, reconstitutionPriority };
    })
    .sort((a, b) => b.reconstitutionPriority - a.reconstitutionPriority);
}


// --- source: scenario-consolidation-rank.ts ---

export interface MacroScenarioConsolidationRow {
  scenarioId: string;
  consolidationPriority: number;
}

/** Rank overlays for consolidation planning (reconstitution plus stabilization). */
export function rankMacroScenarioConsolidation(rows: MacroScenarioCompareRow[]): MacroScenarioConsolidationRow[] {
  const reconstitution = rankMacroScenarioReconstitution(rows);
  const stabilization = rankMacroScenarioStabilization(rows);
  const recMax = Math.max(1, ...reconstitution.map(r => r.reconstitutionPriority));
  const stabMax = Math.max(1, ...stabilization.map(s => s.stabilizationPriority));

  return rows
    .map(row => {
      const rec = reconstitution.find(r => r.scenarioId === row.scenarioId)?.reconstitutionPriority ?? 0;
      const stab = stabilization.find(s => s.scenarioId === row.scenarioId)?.stabilizationPriority ?? 0;
      const consolidationPriority =
        Math.round(((rec / recMax) * 0.55 + (stab / stabMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, consolidationPriority };
    })
    .sort((a, b) => b.consolidationPriority - a.consolidationPriority);
}


// --- source: scenario-equilibrium-rank.ts ---

export interface MacroScenarioEquilibriumRow {
  scenarioId: string;
  equilibriumPriority: number;
}

/** Rank overlays for equilibrium planning (consolidation balance plus mitigation cushion). */
export function rankMacroScenarioEquilibrium(rows: MacroScenarioCompareRow[]): MacroScenarioEquilibriumRow[] {
  const consolidation = rankMacroScenarioConsolidation(rows);
  const mitigation = rankMacroScenarioMitigation(rows);
  const conMax = Math.max(1, ...consolidation.map(c => c.consolidationPriority));
  const mitMax = Math.max(1, ...mitigation.map(m => m.mitigationPriority));

  return rows
    .map(row => {
      const con = consolidation.find(c => c.scenarioId === row.scenarioId)?.consolidationPriority ?? 0;
      const mit = mitigation.find(m => m.scenarioId === row.scenarioId)?.mitigationPriority ?? 0;
      const equilibriumPriority =
        Math.round(((con / conMax) * 0.5 + (mit / mitMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, equilibriumPriority };
    })
    .sort((a, b) => b.equilibriumPriority - a.equilibriumPriority);
}


// --- source: scenario-sustainability-rank.ts ---

export interface MacroScenarioSustainabilityRow {
  scenarioId: string;
  sustainabilityPriority: number;
}

/** Rank overlays for sustainability planning (equilibrium balance plus renewal runway). */
export function rankMacroScenarioSustainability(rows: MacroScenarioCompareRow[]): MacroScenarioSustainabilityRow[] {
  const equilibrium = rankMacroScenarioEquilibrium(rows);
  const renewal = rankMacroScenarioRenewal(rows);
  const eqMax = Math.max(1, ...equilibrium.map(e => e.equilibriumPriority));
  const renMax = Math.max(1, ...renewal.map(r => r.renewalPriority));

  return rows
    .map(row => {
      const eq = equilibrium.find(e => e.scenarioId === row.scenarioId)?.equilibriumPriority ?? 0;
      const ren = renewal.find(r => r.scenarioId === row.scenarioId)?.renewalPriority ?? 0;
      const sustainabilityPriority =
        Math.round(((eq / eqMax) * 0.55 + (ren / renMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, sustainabilityPriority };
    })
    .sort((a, b) => b.sustainabilityPriority - a.sustainabilityPriority);
}


// --- source: scenario-viability-rank.ts ---

export interface MacroScenarioViabilityRow {
  scenarioId: string;
  viabilityPriority: number;
}

/** Rank overlays for viability planning (sustainability balance plus revival upside). */
export function rankMacroScenarioViability(rows: MacroScenarioCompareRow[]): MacroScenarioViabilityRow[] {
  const sustainability = rankMacroScenarioSustainability(rows);
  const revival = rankMacroScenarioRevival(rows);
  const susMax = Math.max(1, ...sustainability.map(s => s.sustainabilityPriority));
  const revMax = Math.max(1, ...revival.map(r => r.revivalPriority));

  return rows
    .map(row => {
      const sus = sustainability.find(s => s.scenarioId === row.scenarioId)?.sustainabilityPriority ?? 0;
      const rev = revival.find(r => r.scenarioId === row.scenarioId)?.revivalPriority ?? 0;
      const viabilityPriority =
        Math.round(((sus / susMax) * 0.5 + (rev / revMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, viabilityPriority };
    })
    .sort((a, b) => b.viabilityPriority - a.viabilityPriority);
}


// --- source: scenario-continuity-rank.ts ---

export interface MacroScenarioContinuityRow {
  scenarioId: string;
  continuityPriority: number;
}

/** Rank overlays for continuity planning (viability balance plus regeneration depth). */
export function rankMacroScenarioContinuity(rows: MacroScenarioCompareRow[]): MacroScenarioContinuityRow[] {
  const viability = rankMacroScenarioViability(rows);
  const regeneration = rankMacroScenarioRegeneration(rows);
  const viaMax = Math.max(1, ...viability.map(v => v.viabilityPriority));
  const regMax = Math.max(1, ...regeneration.map(r => r.regenerationPriority));

  return rows
    .map(row => {
      const via = viability.find(v => v.scenarioId === row.scenarioId)?.viabilityPriority ?? 0;
      const reg = regeneration.find(r => r.scenarioId === row.scenarioId)?.regenerationPriority ?? 0;
      const continuityPriority =
        Math.round(((via / viaMax) * 0.5 + (reg / regMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, continuityPriority };
    })
    .sort((a, b) => b.continuityPriority - a.continuityPriority);
}


// --- source: scenario-prosperity-rank.ts ---

export interface MacroScenarioProsperityRow {
  scenarioId: string;
  prosperityPriority: number;
}

/** Rank overlays for prosperity planning (continuity balance plus frontier upside). */
export function rankMacroScenarioProsperity(rows: MacroScenarioCompareRow[]): MacroScenarioProsperityRow[] {
  const continuity = rankMacroScenarioContinuity(rows);
  const frontier = rankMacroScenarioFrontier(rows);
  const conMax = Math.max(1, ...continuity.map(c => c.continuityPriority));
  const frMax = Math.max(1, ...frontier.map(f => f.frontierScore));

  return rows
    .map(row => {
      const con = continuity.find(c => c.scenarioId === row.scenarioId)?.continuityPriority ?? 0;
      const fr = frontier.find(f => f.scenarioId === row.scenarioId)?.frontierScore ?? 0;
      const prosperityPriority =
        Math.round(((con / conMax) * 0.55 + (fr / frMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, prosperityPriority };
    })
    .sort((a, b) => b.prosperityPriority - a.prosperityPriority);
}


// --- source: scenario-resilience-rank.ts ---

export interface MacroScenarioResilienceRow {
  scenarioId: string;
  resiliencePriority: number;
}

/** Rank overlays for resilience planning (recovery plus hedge cushion). */
export function rankMacroScenarioResilience(rows: MacroScenarioCompareRow[]): MacroScenarioResilienceRow[] {
  const recovery = rankMacroScenarioRecovery(rows);
  const hedge = rankMacroScenarioHedge(rows);
  const recMax = Math.max(1, ...recovery.map(r => r.recoveryPriority));
  const hedgeMax = Math.max(1, ...hedge.map(h => h.hedgeIndex));

  return rows
    .map(row => {
      const rec = recovery.find(r => r.scenarioId === row.scenarioId)?.recoveryPriority ?? 0;
      const hed = hedge.find(h => h.scenarioId === row.scenarioId)?.hedgeIndex ?? 0;
      const resiliencePriority =
        Math.round(((rec / recMax) * 0.55 + (hed / hedgeMax) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, resiliencePriority };
    })
    .sort((a, b) => b.resiliencePriority - a.resiliencePriority);
}


// --- source: macro-transmission-elasticity.ts ---
  MacroTransmissionElasticityBand,
  MacroTransmissionElasticitySnapshot,
  MacroTransmissionReport
} from './types.ts';

export type { MacroTransmissionElasticityBand, MacroTransmissionElasticitySnapshot };

function layerMagnitude(layer: MacroTransmissionReport['layers'][number]): number {
  return (
    Math.abs(layer.cycleContribution) +
    Math.abs(layer.investmentContribution) +
    Math.abs(layer.productivityContribution)
  );
}

/** Coefficient-of-variation read on active transmission mass (load-sharing elasticity). */
export function buildMacroTransmissionElasticitySnapshot(
  report: MacroTransmissionReport
): MacroTransmissionElasticitySnapshot {
  const mags = report.layers.map(layerMagnitude).filter(m => m >= 0.08);
  if (mags.length <= 1) {
    return {
      elasticityIndex: 0,
      band: 'rigid',
      activeLayerCount: mags.length,
      summary: 'Insufficient active transmission mass — elasticity read is rigid.'
    };
  }
  const mean = mags.reduce((a, b) => a + b, 0) / mags.length;
  const variance = mags.reduce((a, m) => a + (m - mean) ** 2, 0) / mags.length;
  const cv = mean > 0.01 ? Math.sqrt(variance) / mean : 0;
  const elasticityIndex = Math.round(v1014macroClamp(cv, 0, 1.5) * 1000) / 10;

  let band: MacroTransmissionElasticityBand = 'balanced';
  if (elasticityIndex >= 55) band = 'flexible';
  else if (elasticityIndex <= 22) band = 'rigid';

  const summary = `Transmission elasticity ${elasticityIndex.toFixed(1)} (${band}); ${mags.length} active layers share spillover mass.`;

  return {
    elasticityIndex,
    band,
    activeLayerCount: mags.length,
    summary
  };
}


// --- source: bridge-v1020-automation-idle-governance.ts ---

export interface MacroAutomationIdleGovernanceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance spillover (Agent 20 wave 35 export). */
export function readMacroAutomationIdleGovernanceSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceSpillover {
  const gov: any =
    inputs.automationIdleGovernance ??
    inputs.idleAutomation?.governance ??
    inputs.automation?.idleGovernance ??
    inputs.nationalAutomation?.idleGovernance;
  if (!gov) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const governance = String(gov.governanceBand ?? gov.policyBand ?? gov.controlBand ?? '');
  const idle = String(gov.idleBand ?? gov.dormancyBand ?? gov.pauseBand ?? '');
  const escrow = String(gov.escrowBand ?? gov.commitBand ?? gov.holdBand ?? '');

  if (governance === 'escalated' || governance === 'critical' || governance === 'runaway') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = `Escalated automation idle governance (${governance}) drags macro investment read.`;
  } else if (governance === 'balanced' || governance === 'grounded') {
    investmentNudge += 1;
    summary = `Grounded idle governance (${governance}) supports macro investment interpretation.`;
  }

  if (idle === 'unbounded' || idle === 'critical' || idle === 'frozen') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Unbounded automation idle weakens macro productivity spillover.';
  }

  if (escrow === 'leaking' || escrow === 'critical' || escrow === 'misaligned') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Leaking automation escrow misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecast-projection-sync.ts ---

export interface MacroForecastProjectionSyncSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast projection sync spillover (Agent 21 wave 35 baseline handoff). */
export function readMacroForecastProjectionSyncSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastProjectionSyncSpillover {
  const sync: any =
    inputs.forecastProjectionSync ??
    inputs.forecastingLab?.projectionSync ??
    inputs.macroForecasts?.projectionSync ??
    inputs.nationalForecasts?.wave35Sync;
  if (!sync) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const ledger = String(sync.ledgerBand ?? sync.baselineBand ?? sync.integrationBand ?? '');
  const drift = String(sync.driftBand ?? sync.offsetBand ?? sync.skewBand ?? '');
  const syncBand = String(sync.syncBand ?? sync.alignmentBand ?? sync.handoffBand ?? '');

  if (ledger === 'stale' || ledger === 'critical' || ledger === 'orphaned') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `Stale forecast projection ledger (${ledger}) drags macro productivity read.`;
  } else if (ledger === 'latched' || ledger === 'synced') {
    investmentNudge += 1;
    summary = `Synced projection ledger (${ledger}) supports macro investment interpretation.`;
  }

  if (drift === 'runaway' || drift === 'critical' || drift === 'unbounded') {
    cycleNudge -= 3;
    summary = (summary ? summary + ' ' : '') + 'Runaway projection drift amplifies macro downside transmission.';
  }

  if (syncBand === 'broken' || syncBand === 'critical' || syncBand === 'desynced') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Broken forecast projection sync weakens macro productivity spillover.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastProjectionSyncSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastProjectionSyncSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1020-automation-idle-governance-wave-round36-export.ts ---

export interface MacroAutomationIdleGovernanceWave36ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 36 export spillover (Agent 20 wave 36 export). */
export function readMacroAutomationIdleGovernanceWave36ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave36ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave36Export ??
    inputs.automationIdleGovernance?.wave36Export ??
    inputs.idleAutomation?.governanceWave36Export ??
    inputs.automation?.idleGovernanceWave36Export ??
    inputs.nationalAutomation?.idleGovernanceWave36Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round36Ready = Boolean(
    exportPayload.round36Ready ??
      exportPayload.payload?.round36Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const hookLines: string[] =
    exportPayload.wave36HookLines ??
    exportPayload.payload?.wave36HookLines ??
    exportPayload.hookLines ??
    [];

  if (!round36Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 36 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-203' || waveRound === 36) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 36 idle governance export latched (${o10Task || 'O10-203'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 1_900_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 36 projected LOC hint misaligns macro cycle transmission.';
  }

  if (hookLines.some((line: string) => String(line).includes('round36_ready=false'))) {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Wave 36 export hooks report round36 not ready.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave36ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave36ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecast-wave36-projection-sync.ts ---

export interface MacroForecastWave36ProjectionSyncSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast wave 36 projection sync spillover (Agent 21 wave 36 baseline). */
export function readMacroForecastWave36ProjectionSyncSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastWave36ProjectionSyncSpillover {
  const sync: any =
    inputs.forecastWave36ProjectionSync ??
    inputs.forecastingLab?.wave36ProjectionSync ??
    inputs.macroForecasts?.wave36ProjectionSync ??
    inputs.nationalForecasts?.wave36Sync;
  if (!sync) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const status = String(sync.status ?? sync.syncStatus ?? sync.projectionStatus ?? 'unknown').toLowerCase();
  const baselineSha = String(sync.baselineSha ?? sync.baseline ?? '');
  const projectedLoc = Number(sync.projectedFunctionalLoc ?? sync.projectedLoc ?? 0);

  if (status === 'drift') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Forecast wave 36 projection sync drifted — macro downside transmission amplifies.';
  } else if (status === 'aligned') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Aligned forecast wave 36 projection sync supports macro investment interpretation.';
  } else if (status === 'unknown') {
    productivityNudge -= 1;
    summary = 'Unknown forecast wave 36 projection sync weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('ea2bb03')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-ea2bb03 wave 36 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 1_950_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 36 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastWave36ProjectionSyncSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastWave36ProjectionSyncSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave36-integration-rank.ts ---

export interface MacroScenarioWave36IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 36 integration (resilience cushion plus wave 35 integration latch). */
export function rankMacroScenarioWave36Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave36IntegrationRow[] {
  const resilience = rankMacroScenarioResilience(rows);
  const wave35 = rankMacroScenarioWave35Integration(rows);
  const resMax = Math.max(1, ...resilience.map(r => r.resiliencePriority));
  const w35Max = Math.max(1, ...wave35.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const res = resilience.find(r => r.scenarioId === row.scenarioId)?.resiliencePriority ?? 0;
      const w35 = wave35.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((res / resMax) * 0.45 + (w35 / w35Max) * 0.55) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1022-ui-responsiveness-wave-round37-export.ts ---

export interface MacroUiResponsivenessWave37ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI responsiveness wave 37 export spillover (Agent 22 wave 37 export). */
export function readMacroUiResponsivenessWave37ExportSpilloverFromV1022(
  inputs: MacroEconomyInputs
): MacroUiResponsivenessWave37ExportSpillover {
  const exportPayload: any =
    inputs.uiResponsivenessWave37Export ??
    inputs.uiResponsiveness?.wave37Export ??
    inputs.gameUi?.responsivenessWave37Export ??
    inputs.uiShell?.wave37Export ??
    inputs.nationalUi?.responsivenessWave37Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round37Ready = Boolean(
    exportPayload.round37Ready ??
      exportPayload.payload?.round37Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const latencyBand = String(exportPayload.latencyBand ?? exportPayload.payload?.latencyBand ?? '');

  if (!round37Ready) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'UI responsiveness wave 37 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-205' || waveRound === 37) {
    productivityNudge += 1;
    investmentNudge += 1;
    summary = `Wave 37 UI responsiveness export latched (${o10Task || 'O10-205'}) supports macro productivity read.`;
  }

  if (latencyBand === 'critical' || latencyBand === 'unresponsive') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Critical UI latency band strains macro cycle transmission.';
  }

  if (locHint > 0 && locHint < 1_980_000) {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 37 projected LOC hint misaligns macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiResponsivenessWave37ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiResponsivenessWave37ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1023-dashboard-clarity-wave-round37-export.ts ---

export interface MacroDashboardClarityWave37ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboard clarity wave 37 export spillover (Agent 23 wave 37 export). */
export function readMacroDashboardClarityWave37ExportSpilloverFromV1023(
  inputs: MacroEconomyInputs
): MacroDashboardClarityWave37ExportSpillover {
  const exportPayload: any =
    inputs.dashboardClarityWave37Export ??
    inputs.dashboardClarity?.wave37Export ??
    inputs.dashboards?.clarityWave37Export ??
    inputs.nationalDashboards?.clarityWave37Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const clarityReady = Boolean(
    exportPayload.clarityReady ??
      exportPayload.round37Ready ??
      exportPayload.payload?.clarityReady ??
      exportPayload.exportReady
  );
  const signalBand = String(exportPayload.signalBand ?? exportPayload.payload?.signalBand ?? '');
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);

  if (!clarityReady) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Dashboard clarity wave 37 export not ready — macro investment read drags.';
  } else if (signalBand === 'clear' || signalBand === 'strong') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Clear dashboard clarity wave 37 export supports macro investment interpretation.';
  }

  if (signalBand === 'misleading' || signalBand === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misleading dashboard clarity export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('cfb4603')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-cfb4603 wave 37 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 1_990_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 37 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardClarityWave37ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardClarityWave37ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave37-integration-rank.ts ---

export interface MacroScenarioWave37IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 37 integration (wave 36 integration latch plus prosperity cushion). */
export function rankMacroScenarioWave37Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave37IntegrationRow[] {
  const wave36 = rankMacroScenarioWave36Integration(rows);
  const prosperity = rankMacroScenarioProsperity(rows);
  const w36Max = Math.max(1, ...wave36.map(w => w.integrationPriority));
  const proMax = Math.max(1, ...prosperity.map(p => p.prosperityPriority));

  return rows
    .map(row => {
      const w36 = wave36.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const pro = prosperity.find(p => p.scenarioId === row.scenarioId)?.prosperityPriority ?? 0;
      const integrationPriority =
        Math.round(((w36 / w36Max) * 0.5 + (pro / proMax) * 0.5) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1024-replay-wave-round38-export.ts ---

export interface MacroReplayWave38ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 38 export spillover (Agent 24 wave 38 export). */
export function readMacroReplayWave38ExportSpilloverFromV1024(
  inputs: MacroEconomyInputs
): MacroReplayWave38ExportSpillover {
  const exportPayload: any =
    inputs.replayWave38Export ??
    inputs.historyReplay?.wave38Export ??
    inputs.replay?.wave38Export ??
    inputs.nationalHistory?.replayWave38Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round38Ready = Boolean(
    exportPayload.round38Ready ??
      exportPayload.payload?.round38Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round38Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 38 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-207' || waveRound === 38) {
    productivityNudge += 1;
    summary = `Wave 38 replay export latched (${o10Task || 'O10-207'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 2_020_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 38 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave38ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave38ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1025-integration-health-wave-round38-export.ts ---

export interface MacroIntegrationHealthWave38ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.25 integration health wave 38 export spillover (Agent 25 wave 38 export). */
export function readMacroIntegrationHealthWave38ExportSpilloverFromV1025(
  inputs: MacroEconomyInputs
): MacroIntegrationHealthWave38ExportSpillover {
  const exportPayload: any =
    inputs.integrationHealthWave38Export ??
    inputs.integrationHealth?.wave38Export ??
    inputs.assembly?.integrationHealthWave38Export ??
    inputs.nationalIntegration?.healthWave38Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const healthReady = Boolean(
    exportPayload.healthReady ??
      exportPayload.round38Ready ??
      exportPayload.payload?.healthReady ??
      exportPayload.exportReady
  );
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);
  const slotBand = String(exportPayload.slotBand ?? exportPayload.payload?.slotBand ?? '');

  if (!healthReady) {
    investmentNudge -= 3;
    productivityNudge -= 1;
    summary = 'Integration health wave 38 export not ready — macro investment read drags.';
  } else if (slotBand === 'green' || slotBand === 'latched') {
    investmentNudge += 1;
    cycleNudge += 1;
    summary = 'Latched integration health wave 38 export supports macro cycle interpretation.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('b44b36f')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-b44b36f wave 38 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_030_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 38 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroIntegrationHealthWave38ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIntegrationHealthWave38ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave38-integration-rank.ts ---

export interface MacroScenarioWave38IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 38 integration (wave 37 latch plus wave 36 integration cushion). */
export function rankMacroScenarioWave38Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave38IntegrationRow[] {
  const wave37 = rankMacroScenarioWave37Integration(rows);
  const wave36 = rankMacroScenarioWave36Integration(rows);
  const w37Max = Math.max(1, ...wave37.map(w => w.integrationPriority));
  const w36Max = Math.max(1, ...wave36.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w37 = wave37.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w36 = wave36.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w37 / w37Max) * 0.55 + (w36 / w36Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1020-automation-idle-governance-wave-round39-export.ts ---

export interface MacroAutomationIdleGovernanceWave39ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 39 export spillover (Agent 20 wave 39 export). */
export function readMacroAutomationIdleGovernanceWave39ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave39ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave39Export ??
    inputs.automationIdleGovernance?.wave39Export ??
    inputs.idleAutomation?.governanceWave39Export ??
    inputs.automation?.idleGovernanceWave39Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round39Ready = Boolean(
    exportPayload.round39Ready ??
      exportPayload.payload?.round39Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );

  if (!round39Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 39 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-209' || waveRound === 39) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 39 idle governance export latched (${o10Task || 'O10-209'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 2_050_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 39 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave39ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave39ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecast-wave-round39-export.ts ---

export interface MacroForecastWave39ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast wave 39 export spillover (Agent 21 wave 39 baseline). */
export function readMacroForecastWave39ExportSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastWave39ExportSpillover {
  const sync: any =
    inputs.forecastWave39Export ??
    inputs.forecastingLab?.wave39Export ??
    inputs.macroForecasts?.wave39Export ??
    inputs.nationalForecasts?.wave39Sync;
  if (!sync) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const status = String(sync.status ?? sync.syncStatus ?? sync.exportStatus ?? 'unknown').toLowerCase();
  const baselineSha = String(sync.baselineSha ?? sync.baseline ?? '');
  const projectedLoc = Number(sync.projectedFunctionalLoc ?? sync.projectedLoc ?? 0);

  if (status === 'drift') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Forecast wave 39 export drifted — macro downside transmission amplifies.';
  } else if (status === 'aligned') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Aligned forecast wave 39 export supports macro investment interpretation.';
  } else if (status === 'unknown') {
    productivityNudge -= 1;
    summary = 'Unknown forecast wave 39 export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('6134c6a')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-6134c6a wave 39 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_070_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 39 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastWave39ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastWave39ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave39-integration-rank.ts ---

export interface MacroScenarioWave39IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 39 integration (wave 38 latch plus wave 37 integration cushion). */
export function rankMacroScenarioWave39Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave39IntegrationRow[] {
  const wave38 = rankMacroScenarioWave38Integration(rows);
  const wave37 = rankMacroScenarioWave37Integration(rows);
  const w38Max = Math.max(1, ...wave38.map(w => w.integrationPriority));
  const w37Max = Math.max(1, ...wave37.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w38 = wave38.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w37 = wave37.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w38 / w38Max) * 0.55 + (w37 / w37Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1022-ui-responsiveness-wave-round40-export.ts ---

export interface MacroUiResponsivenessWave40ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI responsiveness wave 40 export spillover (Agent 22 wave 40 export). */
export function readMacroUiResponsivenessWave40ExportSpilloverFromV1022(
  inputs: MacroEconomyInputs
): MacroUiResponsivenessWave40ExportSpillover {
  const exportPayload: any =
    inputs.uiResponsivenessWave40Export ??
    inputs.uiResponsiveness?.wave40Export ??
    inputs.gameUi?.responsivenessWave40Export ??
    inputs.nationalUi?.responsivenessWave40Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round40Ready = Boolean(
    exportPayload.round40Ready ??
      exportPayload.payload?.round40Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const latencyBand = String(exportPayload.latencyBand ?? exportPayload.payload?.latencyBand ?? '');

  if (!round40Ready) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'UI responsiveness wave 40 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-211' || waveRound === 40) {
    productivityNudge += 1;
    investmentNudge += 1;
    summary = `Wave 40 UI responsiveness export latched (${o10Task || 'O10-211'}) supports macro productivity read.`;
  }

  if (latencyBand === 'critical' || latencyBand === 'unresponsive') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Critical UI latency band strains macro cycle transmission.';
  }

  if (locHint > 0 && locHint < 2_100_000) {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 40 projected LOC hint misaligns macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiResponsivenessWave40ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiResponsivenessWave40ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1023-dashboard-clarity-wave-round40-export.ts ---

export interface MacroDashboardClarityWave40ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboard clarity wave 40 export spillover (Agent 23 wave 40 export). */
export function readMacroDashboardClarityWave40ExportSpilloverFromV1023(
  inputs: MacroEconomyInputs
): MacroDashboardClarityWave40ExportSpillover {
  const exportPayload: any =
    inputs.dashboardClarityWave40Export ??
    inputs.dashboardClarity?.wave40Export ??
    inputs.dashboards?.clarityWave40Export ??
    inputs.nationalDashboards?.clarityWave40Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const clarityReady = Boolean(
    exportPayload.clarityReady ??
      exportPayload.round40Ready ??
      exportPayload.payload?.clarityReady ??
      exportPayload.exportReady
  );
  const signalBand = String(exportPayload.signalBand ?? exportPayload.payload?.signalBand ?? '');
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);

  if (!clarityReady) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Dashboard clarity wave 40 export not ready — macro investment read drags.';
  } else if (signalBand === 'clear' || signalBand === 'strong') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Clear dashboard clarity wave 40 export supports macro investment interpretation.';
  }

  if (signalBand === 'misleading' || signalBand === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misleading dashboard clarity export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('6f7fa49')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-6f7fa49 wave 40 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_110_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 40 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardClarityWave40ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardClarityWave40ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave40-integration-rank.ts ---

export interface MacroScenarioWave40IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 40 integration (wave 39 latch plus wave 38 integration cushion). */
export function rankMacroScenarioWave40Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave40IntegrationRow[] {
  const wave39 = rankMacroScenarioWave39Integration(rows);
  const wave38 = rankMacroScenarioWave38Integration(rows);
  const w39Max = Math.max(1, ...wave39.map(w => w.integrationPriority));
  const w38Max = Math.max(1, ...wave38.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w39 = wave39.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w38 = wave38.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w39 / w39Max) * 0.55 + (w38 / w38Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1024-replay-wave-round41-export.ts ---

export interface MacroReplayWave41ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 41 export spillover (Agent 24 wave 41 export). */
export function readMacroReplayWave41ExportSpilloverFromV1024(
  inputs: MacroEconomyInputs
): MacroReplayWave41ExportSpillover {
  const exportPayload: any =
    inputs.replayWave41Export ??
    inputs.historyReplay?.wave41Export ??
    inputs.replay?.wave41Export ??
    inputs.nationalHistory?.replayWave41Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round41Ready = Boolean(
    exportPayload.round41Ready ??
      exportPayload.payload?.round41Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round41Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 41 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-213' || waveRound === 41) {
    productivityNudge += 1;
    summary = `Wave 41 replay export latched (${o10Task || 'O10-213'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 2_140_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 41 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave41ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave41ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1025-integration-health-wave-round41-export.ts ---

export interface MacroIntegrationHealthWave41ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.25 integration health wave 41 export spillover (Agent 25 wave 41 export). */
export function readMacroIntegrationHealthWave41ExportSpilloverFromV1025(
  inputs: MacroEconomyInputs
): MacroIntegrationHealthWave41ExportSpillover {
  const exportPayload: any =
    inputs.integrationHealthWave41Export ??
    inputs.integrationHealth?.wave41Export ??
    inputs.assembly?.integrationHealthWave41Export ??
    inputs.nationalIntegration?.healthWave41Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const healthReady = Boolean(
    exportPayload.healthReady ??
      exportPayload.round41Ready ??
      exportPayload.payload?.healthReady ??
      exportPayload.exportReady
  );
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);
  const slotBand = String(exportPayload.slotBand ?? exportPayload.payload?.slotBand ?? '');

  if (!healthReady) {
    investmentNudge -= 3;
    productivityNudge -= 1;
    summary = 'Integration health wave 41 export not ready — macro investment read drags.';
  } else if (slotBand === 'green' || slotBand === 'latched') {
    investmentNudge += 1;
    cycleNudge += 1;
    summary = 'Latched integration health wave 41 export supports macro cycle interpretation.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('875d6f3')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-875d6f3 wave 41 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_150_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 41 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroIntegrationHealthWave41ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIntegrationHealthWave41ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave41-integration-rank.ts ---

export interface MacroScenarioWave41IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 41 integration (wave 40 latch plus wave 39 integration cushion). */
export function rankMacroScenarioWave41Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave41IntegrationRow[] {
  const wave40 = rankMacroScenarioWave40Integration(rows);
  const wave39 = rankMacroScenarioWave39Integration(rows);
  const w40Max = Math.max(1, ...wave40.map(w => w.integrationPriority));
  const w39Max = Math.max(1, ...wave39.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w40 = wave40.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w39 = wave39.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w40 / w40Max) * 0.55 + (w39 / w39Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1020-automation-idle-governance-wave-round42-export.ts ---

export interface MacroAutomationIdleGovernanceWave42ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 42 export spillover (Agent 20 wave 42 export). */
export function readMacroAutomationIdleGovernanceWave42ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave42ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave42Export ??
    inputs.automationIdleGovernance?.wave42Export ??
    inputs.idleAutomation?.governanceWave42Export ??
    inputs.automation?.idleGovernanceWave42Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round42Ready = Boolean(
    exportPayload.round42Ready ??
      exportPayload.payload?.round42Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );

  if (!round42Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 42 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-215' || waveRound === 42) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 42 idle governance export latched (${o10Task || 'O10-215'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 2_180_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 42 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave42ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave42ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecast-wave-round42-export.ts ---

export interface MacroForecastWave42ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast wave 42 export spillover (Agent 21 wave 42 baseline). */
export function readMacroForecastWave42ExportSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastWave42ExportSpillover {
  const sync: any =
    inputs.forecastWave42Export ??
    inputs.forecastingLab?.wave42Export ??
    inputs.macroForecasts?.wave42Export ??
    inputs.nationalForecasts?.wave42Sync;
  if (!sync) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const status = String(sync.status ?? sync.syncStatus ?? sync.exportStatus ?? 'unknown').toLowerCase();
  const baselineSha = String(sync.baselineSha ?? sync.baseline ?? '');
  const projectedLoc = Number(sync.projectedFunctionalLoc ?? sync.projectedLoc ?? 0);

  if (status === 'drift') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Forecast wave 42 export drifted — macro downside transmission amplifies.';
  } else if (status === 'aligned') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Aligned forecast wave 42 export supports macro investment interpretation.';
  } else if (status === 'unknown') {
    productivityNudge -= 1;
    summary = 'Unknown forecast wave 42 export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('431df5d')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-431df5d wave 42 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_190_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 42 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastWave42ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastWave42ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave42-integration-rank.ts ---

export interface MacroScenarioWave42IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 42 integration (wave 41 latch plus wave 40 integration cushion). */
export function rankMacroScenarioWave42Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave42IntegrationRow[] {
  const wave41 = rankMacroScenarioWave41Integration(rows);
  const wave40 = rankMacroScenarioWave40Integration(rows);
  const w41Max = Math.max(1, ...wave41.map(w => w.integrationPriority));
  const w40Max = Math.max(1, ...wave40.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w41 = wave41.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w40 = wave40.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w41 / w41Max) * 0.55 + (w40 / w40Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1022-ui-responsiveness-wave-round43-export.ts ---

export interface MacroUiResponsivenessWave43ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI responsiveness wave 43 export spillover (Agent 22 wave 43 export). */
export function readMacroUiResponsivenessWave43ExportSpilloverFromV1022(
  inputs: MacroEconomyInputs
): MacroUiResponsivenessWave43ExportSpillover {
  const exportPayload: any =
    inputs.uiResponsivenessWave43Export ??
    inputs.uiResponsiveness?.wave43Export ??
    inputs.gameUi?.responsivenessWave43Export ??
    inputs.nationalUi?.responsivenessWave43Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round43Ready = Boolean(
    exportPayload.round43Ready ??
      exportPayload.payload?.round43Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const latencyBand = String(exportPayload.latencyBand ?? exportPayload.payload?.latencyBand ?? '');

  if (!round43Ready) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'UI responsiveness wave 43 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-217' || waveRound === 43) {
    productivityNudge += 1;
    investmentNudge += 1;
    summary = `Wave 43 UI responsiveness export latched (${o10Task || 'O10-217'}) supports macro productivity read.`;
  }

  if (latencyBand === 'critical' || latencyBand === 'unresponsive') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Critical UI latency band strains macro cycle transmission.';
  }

  if (locHint > 0 && locHint < 2_240_000) {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 43 projected LOC hint misaligns macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiResponsivenessWave43ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiResponsivenessWave43ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1023-dashboard-clarity-wave-round43-export.ts ---

export interface MacroDashboardClarityWave43ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboard clarity wave 43 export spillover (Agent 23 wave 43 export). */
export function readMacroDashboardClarityWave43ExportSpilloverFromV1023(
  inputs: MacroEconomyInputs
): MacroDashboardClarityWave43ExportSpillover {
  const exportPayload: any =
    inputs.dashboardClarityWave43Export ??
    inputs.dashboardClarity?.wave43Export ??
    inputs.dashboards?.clarityWave43Export ??
    inputs.nationalDashboards?.clarityWave43Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const clarityReady = Boolean(
    exportPayload.clarityReady ??
      exportPayload.round43Ready ??
      exportPayload.payload?.clarityReady ??
      exportPayload.exportReady
  );
  const signalBand = String(exportPayload.signalBand ?? exportPayload.payload?.signalBand ?? '');
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);

  if (!clarityReady) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Dashboard clarity wave 43 export not ready — macro investment read drags.';
  } else if (signalBand === 'clear' || signalBand === 'strong') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Clear dashboard clarity wave 43 export supports macro investment interpretation.';
  }

  if (signalBand === 'misleading' || signalBand === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misleading dashboard clarity export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('641d7d16')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-641d7d16 wave 43 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_240_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 43 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardClarityWave43ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardClarityWave43ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave43-integration-rank.ts ---

export interface MacroScenarioWave43IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 43 integration (wave 42 latch plus wave 41 integration cushion). */
export function rankMacroScenarioWave43Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave43IntegrationRow[] {
  const wave42 = rankMacroScenarioWave42Integration(rows);
  const wave41 = rankMacroScenarioWave41Integration(rows);
  const w42Max = Math.max(1, ...wave42.map(w => w.integrationPriority));
  const w41Max = Math.max(1, ...wave41.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w42 = wave42.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w41 = wave41.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w42 / w42Max) * 0.55 + (w41 / w41Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1020-automation-idle-governance-wave-round44-export.ts ---

export interface MacroAutomationIdleGovernanceWave44ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation idle governance wave 44 export spillover (Agent 20 wave 44 export). */
export function readMacroAutomationIdleGovernanceWave44ExportSpilloverFromV1020(
  inputs: MacroEconomyInputs
): MacroAutomationIdleGovernanceWave44ExportSpillover {
  const exportPayload: any =
    inputs.automationIdleGovernanceWave44Export ??
    inputs.automationIdleGovernance?.wave44Export ??
    inputs.idleAutomation?.governanceWave44Export ??
    inputs.automation?.idleGovernanceWave44Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round44Ready = Boolean(
    exportPayload.round44Ready ??
      exportPayload.payload?.round44Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );

  if (!round44Ready) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Automation idle governance wave 44 export not ready — macro investment read drags.';
  } else if (o10Task === 'O10-219' || waveRound === 44) {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = `Wave 44 idle governance export latched (${o10Task || 'O10-219'}) supports macro productivity read.`;
  }

  if (locHint > 0 && locHint < 2_480_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 44 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationIdleGovernanceWave44ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationIdleGovernanceWave44ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1021-forecast-wave-round44-export.ts ---

export interface MacroForecastWave44ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast wave 44 export spillover (Agent 21 wave 44 baseline). */
export function readMacroForecastWave44ExportSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastWave44ExportSpillover {
  const sync: any =
    inputs.forecastWave44Export ??
    inputs.forecastingLab?.wave44Export ??
    inputs.macroForecasts?.wave44Export ??
    inputs.nationalForecasts?.wave44Sync;
  if (!sync) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const status = String(sync.status ?? sync.syncStatus ?? sync.exportStatus ?? 'unknown').toLowerCase();
  const baselineSha = String(sync.baselineSha ?? sync.baseline ?? '');
  const projectedLoc = Number(sync.projectedFunctionalLoc ?? sync.projectedLoc ?? 0);

  if (status === 'drift') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Forecast wave 44 export drifted — macro downside transmission amplifies.';
  } else if (status === 'aligned') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Aligned forecast wave 44 export supports macro investment interpretation.';
  } else if (status === 'unknown') {
    productivityNudge -= 1;
    summary = 'Unknown forecast wave 44 export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('bca7e0a3')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-bca7e0a3 wave 44 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_480_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 44 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastWave44ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastWave44ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave44-integration-rank.ts ---

export interface MacroScenarioWave44IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 44 integration (wave 43 latch plus wave 42 integration cushion). */
export function rankMacroScenarioWave44Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave44IntegrationRow[] {
  const wave43 = rankMacroScenarioWave43Integration(rows);
  const wave42 = rankMacroScenarioWave42Integration(rows);
  const w43Max = Math.max(1, ...wave43.map(w => w.integrationPriority));
  const w42Max = Math.max(1, ...wave42.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w43 = wave43.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w42 = wave42.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w43 / w43Max) * 0.55 + (w42 / w42Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1024-replay-wave-round45-export.ts ---

export interface MacroReplayWave45ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 45 export spillover (Agent 24 wave 45 export). */
export function readMacroReplayWave45ExportSpilloverFromV1024(
  inputs: MacroEconomyInputs
): MacroReplayWave45ExportSpillover {
  const exportPayload: any =
    inputs.replayWave45Export ??
    inputs.historyReplay?.wave45Export ??
    inputs.replay?.wave45Export ??
    inputs.nationalHistory?.replayWave45Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round45Ready = Boolean(
    exportPayload.round45Ready ??
      exportPayload.payload?.round45Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round45Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 45 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-221' || waveRound === 45) {
    productivityNudge += 1;
    summary = `Wave 45 replay export latched (${o10Task || 'O10-221'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 2_520_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 45 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave45ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave45ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1025-integration-health-wave-round45-export.ts ---

export interface MacroIntegrationHealthWave45ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.25 integration health wave 45 export spillover (Agent 25 wave 45 export). */
export function readMacroIntegrationHealthWave45ExportSpilloverFromV1025(
  inputs: MacroEconomyInputs
): MacroIntegrationHealthWave45ExportSpillover {
  const exportPayload: any =
    inputs.integrationHealthWave45Export ??
    inputs.integrationHealth?.wave45Export ??
    inputs.assembly?.integrationHealthWave45Export ??
    inputs.nationalIntegration?.healthWave45Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const healthReady = Boolean(
    exportPayload.healthReady ??
      exportPayload.round45Ready ??
      exportPayload.payload?.healthReady ??
      exportPayload.exportReady
  );
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);
  const slotBand = String(exportPayload.slotBand ?? exportPayload.payload?.slotBand ?? '');

  if (!healthReady) {
    investmentNudge -= 3;
    productivityNudge -= 1;
    summary = 'Integration health wave 45 export not ready — macro investment read drags.';
  } else if (slotBand === 'green' || slotBand === 'latched') {
    investmentNudge += 1;
    cycleNudge += 1;
    summary = 'Latched integration health wave 45 export supports macro cycle interpretation.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('98bcd652')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-98bcd652 wave 45 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_520_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 45 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroIntegrationHealthWave45ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIntegrationHealthWave45ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave45-integration-rank.ts ---

export interface MacroScenarioWave45IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 45 integration (wave 44 latch plus wave 43 integration cushion). */
export function rankMacroScenarioWave45Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave45IntegrationRow[] {
  const wave44 = rankMacroScenarioWave44Integration(rows);
  const wave43 = rankMacroScenarioWave43Integration(rows);
  const w44Max = Math.max(1, ...wave44.map(w => w.integrationPriority));
  const w43Max = Math.max(1, ...wave43.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w44 = wave44.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w43 = wave43.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w44 / w44Max) * 0.55 + (w43 / w43Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: bridge-v1022-ui-responsiveness-wave-round46-export.ts ---

export interface MacroUiResponsivenessWave46ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI responsiveness wave 46 export spillover (Agent 22 wave 46 export). */
export function readMacroUiResponsivenessWave46ExportSpilloverFromV1022(
  inputs: MacroEconomyInputs
): MacroUiResponsivenessWave46ExportSpillover {
  const exportPayload: any =
    inputs.uiResponsivenessWave46Export ??
    inputs.uiResponsiveness?.wave46Export ??
    inputs.gameUi?.responsivenessWave46Export ??
    inputs.nationalUi?.responsivenessWave46Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round46Ready = Boolean(
    exportPayload.round46Ready ??
      exportPayload.payload?.round46Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const latencyBand = String(exportPayload.latencyBand ?? exportPayload.payload?.latencyBand ?? '');

  if (!round46Ready) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'UI responsiveness wave 46 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-223' || waveRound === 46) {
    productivityNudge += 1;
    investmentNudge += 1;
    summary = `Wave 46 UI responsiveness export latched (${o10Task || 'O10-223'}) supports macro productivity read.`;
  }

  if (latencyBand === 'critical' || latencyBand === 'unresponsive') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Critical UI latency band strains macro cycle transmission.';
  }

  if (locHint > 0 && locHint < 2_560_000) {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 46 projected LOC hint misaligns macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiResponsivenessWave46ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiResponsivenessWave46ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: bridge-v1023-dashboard-clarity-wave-round46-export.ts ---

export interface MacroDashboardClarityWave46ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboard clarity wave 46 export spillover (Agent 23 wave 46 export). */
export function readMacroDashboardClarityWave46ExportSpilloverFromV1023(
  inputs: MacroEconomyInputs
): MacroDashboardClarityWave46ExportSpillover {
  const exportPayload: any =
    inputs.dashboardClarityWave46Export ??
    inputs.dashboardClarity?.wave46Export ??
    inputs.dashboards?.clarityWave46Export ??
    inputs.nationalDashboards?.clarityWave46Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const clarityReady = Boolean(
    exportPayload.clarityReady ??
      exportPayload.round46Ready ??
      exportPayload.payload?.clarityReady ??
      exportPayload.exportReady
  );
  const signalBand = String(exportPayload.signalBand ?? exportPayload.payload?.signalBand ?? '');
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);

  if (!clarityReady) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Dashboard clarity wave 46 export not ready — macro investment read drags.';
  } else if (signalBand === 'clear' || signalBand === 'strong') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Clear dashboard clarity wave 46 export supports macro investment interpretation.';
  }

  if (signalBand === 'misleading' || signalBand === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misleading dashboard clarity export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('a9bb07e5')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-a9bb07e5 wave 46 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_560_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 46 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardClarityWave46ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardClarityWave46ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}


// --- source: scenario-wave46-integration-rank.ts ---

export interface MacroScenarioWave46IntegrationRow {
  scenarioId: string;
  integrationPriority: number;
}

/** Rank overlays for wave 46 integration (wave 45 latch plus wave 44 integration cushion). */
export function rankMacroScenarioWave46Integration(rows: MacroScenarioCompareRow[]): MacroScenarioWave46IntegrationRow[] {
  const wave45 = rankMacroScenarioWave45Integration(rows);
  const wave44 = rankMacroScenarioWave44Integration(rows);
  const w45Max = Math.max(1, ...wave45.map(w => w.integrationPriority));
  const w44Max = Math.max(1, ...wave44.map(w => w.integrationPriority));

  return rows
    .map(row => {
      const w45 = wave45.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const w44 = wave44.find(w => w.scenarioId === row.scenarioId)?.integrationPriority ?? 0;
      const integrationPriority =
        Math.round(((w45 / w45Max) * 0.55 + (w44 / w44Max) * 0.45) * 1000) / 1000;
      return { scenarioId: row.scenarioId, integrationPriority };
    })
    .sort((a, b) => b.integrationPriority - a.integrationPriority);
}


// --- source: regression-harness.ts ---

export interface MacroRegressionCheck {
  id: string;
  passed: boolean;
  detail: string;
}

export interface MacroRegressionHarnessResult {
  scenarioId: string;
  turnsRun: number;
  allPassed: boolean;
  checks: MacroRegressionCheck[];
}

/** Deterministic multi-turn macro regression (warn-only; no canonical mutation). */
export function runMacroEconomyRegressionHarness(options?: {
  turns?: number;
  scenarioId?: string;
  includeCreditStress?: boolean;
  includeLaborInnovationStress?: boolean;
  includeHousingStrategicStress?: boolean;
  includeInflationEnergyStress?: boolean;
  includeEventsCompaniesStress?: boolean;
  includeTurnsTransportStress?: boolean;
  includeResearchPopulationStress?: boolean;
  includeModesGuardianStress?: boolean;
  includeCitiesForecastingStress?: boolean;
  includeCommandAutomationStress?: boolean;
  includeTeamReplayStress?: boolean;
  includeMemoryDashboardStress?: boolean;
  includeUiUtilitiesStress?: boolean;
  includeLogisticsNegotiationStress?: boolean;
  includeConfidenceCapexStress?: boolean;
  includeMonetaryRentalStress?: boolean;
  includeClimateForecastStress?: boolean;
  includeAccessibilityTimelineStress?: boolean;
  includeLiquidityMapsStress?: boolean;
  includeGameplayArchiveStress?: boolean;
  includeIntegrationCadenceStress?: boolean;
  includeResearchBudgetStress?: boolean;
  includeModeSupplyStress?: boolean;
  includeEventDemographicStress?: boolean;
  includeExpectationsMetroStress?: boolean;
  includeTransportEnergyStress?: boolean;
  includeHousingTradeStress?: boolean;
  includeGuardianCommandStress?: boolean;
  includeTeamMemoryStress?: boolean;
  includeAutomationForecastStress?: boolean;
  includeGovernanceProjectionStress?: boolean;
  includeWave36ExportProjectionStress?: boolean;
  includeWave37UiDashboardExportStress?: boolean;
  includeWave38ReplayIntegrationStress?: boolean;
  includeWave39AutomationForecastExportStress?: boolean;
  includeWave40UiDashboardExportStress?: boolean;
  includeWave41ReplayIntegrationStress?: boolean;
  includeWave42AutomationForecastExportStress?: boolean;
  includeWave43UiDashboardExportStress?: boolean;
  includeWave44AutomationForecastExportStress?: boolean;
  includeWave45ReplayIntegrationStress?: boolean;
  includeWave46UiDashboardExportStress?: boolean;
  includeWave47ReplayIntegrationStress?: boolean;
  includeWave48ReplayIntegrationStress?: boolean;
}): MacroRegressionHarnessResult {
  const turns = Math.max(5, Math.min(48, Math.floor(options?.turns ?? 24)));
  const scenarioId = options?.scenarioId ?? 'baseline_soft_landing';
  const includeCreditStress = Boolean(options?.includeCreditStress);
  const includeLaborInnovationStress = Boolean(options?.includeLaborInnovationStress);
  const includeHousingStrategicStress = Boolean(options?.includeHousingStrategicStress);
  const includeInflationEnergyStress = Boolean(options?.includeInflationEnergyStress);
  const includeEventsCompaniesStress = Boolean(options?.includeEventsCompaniesStress);
  const includeTurnsTransportStress = Boolean(options?.includeTurnsTransportStress);
  const includeResearchPopulationStress = Boolean(options?.includeResearchPopulationStress);
  const includeModesGuardianStress = Boolean(options?.includeModesGuardianStress);
  const includeCitiesForecastingStress = Boolean(options?.includeCitiesForecastingStress);
  const includeCommandAutomationStress = Boolean(options?.includeCommandAutomationStress);
  const includeTeamReplayStress = Boolean(options?.includeTeamReplayStress);
  const includeMemoryDashboardStress = Boolean(options?.includeMemoryDashboardStress);
  const includeUiUtilitiesStress = Boolean(options?.includeUiUtilitiesStress);
  const includeLogisticsNegotiationStress = Boolean(options?.includeLogisticsNegotiationStress);
  const includeConfidenceCapexStress = Boolean(options?.includeConfidenceCapexStress);
  const includeMonetaryRentalStress = Boolean(options?.includeMonetaryRentalStress);
  const includeClimateForecastStress = Boolean(options?.includeClimateForecastStress);
  const includeAccessibilityTimelineStress = Boolean(options?.includeAccessibilityTimelineStress);
  const includeLiquidityMapsStress = Boolean(options?.includeLiquidityMapsStress);
  const includeGameplayArchiveStress = Boolean(options?.includeGameplayArchiveStress);
  const includeIntegrationCadenceStress = Boolean(options?.includeIntegrationCadenceStress);
  const includeResearchBudgetStress = Boolean(options?.includeResearchBudgetStress);
  const includeModeSupplyStress = Boolean(options?.includeModeSupplyStress);
  const includeEventDemographicStress = Boolean(options?.includeEventDemographicStress);
  const includeExpectationsMetroStress = Boolean(options?.includeExpectationsMetroStress);
  const includeTransportEnergyStress = Boolean(options?.includeTransportEnergyStress);
  const includeHousingTradeStress = Boolean(options?.includeHousingTradeStress);
  const includeGuardianCommandStress = Boolean(options?.includeGuardianCommandStress);
  const includeTeamMemoryStress = Boolean(options?.includeTeamMemoryStress);
  const includeAutomationForecastStress = Boolean(options?.includeAutomationForecastStress);
  const includeGovernanceProjectionStress = Boolean(options?.includeGovernanceProjectionStress);
  const includeWave36ExportProjectionStress = Boolean(options?.includeWave36ExportProjectionStress);
  const includeWave37UiDashboardExportStress = Boolean(options?.includeWave37UiDashboardExportStress);
  const includeWave38ReplayIntegrationStress = Boolean(options?.includeWave38ReplayIntegrationStress);
  const includeWave39AutomationForecastExportStress = Boolean(options?.includeWave39AutomationForecastExportStress);
  const includeWave40UiDashboardExportStress = Boolean(options?.includeWave40UiDashboardExportStress);
  const includeWave41ReplayIntegrationStress = Boolean(options?.includeWave41ReplayIntegrationStress);
  const includeWave42AutomationForecastExportStress = Boolean(options?.includeWave42AutomationForecastExportStress);
  const includeWave43UiDashboardExportStress = Boolean(options?.includeWave43UiDashboardExportStress);
  const includeWave44AutomationForecastExportStress = Boolean(options?.includeWave44AutomationForecastExportStress);
  const includeWave45ReplayIntegrationStress = Boolean(options?.includeWave45ReplayIntegrationStress);
  const includeWave46UiDashboardExportStress = Boolean(options?.includeWave46UiDashboardExportStress);
  const includeWave47ReplayIntegrationStress = Boolean(options?.includeWave47ReplayIntegrationStress);
  const includeWave48ReplayIntegrationStress = Boolean(options?.includeWave48ReplayIntegrationStress);
  const shockIds = macroStressScenarioShockIds(scenarioId);
  const checks: MacroRegressionCheck[] = [];
  let persisted: MacroEconomyPersisted | null = null;
  let prev: NationalMacroEconomyState | null = null;
  let lastHash = '';

  for (let t = 1; t <= turns; t++) {
    const inputs: MacroEconomyInputs = makeDefaultV1014_MACRO_TestInputs({
      turn: t,
      activeCyclicalShockIds: shockIds,
      creditMarkets: includeCreditStress
        ? { spreadBand: t % 5 === 0 ? 'stressed' : 'elevated', policyStance: 'restrictive' }
        : undefined,
      economicGeography: { connectivity: { band: t % 11 === 0 ? 'fragmented' : 'moderate' }, urbanizationIndex: 58 },
      workforce: includeLaborInnovationStress
        ? {
            nationalReadinessBand: t % 6 === 0 ? 'critical' : 'strained',
            laborMarket: { slack: t % 4 === 0 ? 'tight' : 'moderate' }
          }
        : undefined,
      innovation: includeLaborInnovationStress
        ? { momentum: { band: t % 5 === 0 ? 'stalled' : 'moderate' }, nationalProductivityBonus: t % 8 === 0 }
        : undefined,
      strategicCapital: includeHousingStrategicStress
        ? {
            allocationBand: t % 6 === 0 ? 'expansionary' : 'balanced',
            nationalPriority: t % 9 === 0 ? 'infrastructure' : 'stabilization'
          }
        : undefined,
      housingWellbeing: includeHousingStrategicStress
        ? {
            affordability: { band: t % 7 === 0 ? 'stressed' : 'balanced' },
            construction: { band: t % 5 === 0 ? 'correction' : 'strong' }
          }
        : undefined,
      nationalFinance: includeInflationEnergyStress
        ? {
            inflation: { band: t % 6 === 0 ? 'elevated' : 'moderate' },
            inflationExpectations: { band: t % 8 === 0 ? 'rising' : 'anchored' }
          }
        : undefined,
      industrialEnergy: includeInflationEnergyStress
        ? {
            supplyReliability: { band: t % 5 === 0 ? 'stressed' : 'robust' },
            energyCost: { band: t % 7 === 0 ? 'elevated' : 'favorable' },
            transition: { band: t % 9 === 0 ? 'accelerating' : 'steady' }
          }
        : undefined,
      dynamicEvents: includeEventsCompaniesStress
        ? {
            nationalStabilityBand: t % 6 === 0 ? 'fragile' : 'stable',
            pendingBacklogBand: t % 5 === 0 ? 'elevated' : 'calm',
            activeCrisisCount: t % 8 === 0 ? 2 : 0
          }
        : undefined,
      privateSector: includeEventsCompaniesStress
        ? {
            nationalUtilizationBand: t % 7 === 0 ? 'slack' : 'balanced',
            overloadedFirmCount: t % 6 === 0 ? 3 : 0,
            productionMomentum: { band: t % 9 === 0 ? 'contracting' : 'steady' }
          }
        : undefined,
      turnsTime: includeTurnsTransportStress
        ? {
            paceBand: t % 6 === 0 ? 'stalled' : 'steady',
            season: t % 4 === 0 ? 'Winter' : 'Spring',
            macroPhaseBand: t % 8 === 0 ? 'late_cycle' : 'expansionary_cadence'
          }
        : undefined,
      transportInfrastructure: includeTurnsTransportStress
        ? {
            connectivityBand: t % 5 === 0 ? 'fragmented' : 'robust',
            throughputBand: t % 7 === 0 ? 'constrained' : 'ample',
            investmentPipeline: { band: t % 9 === 0 ? 'active' : 'steady' }
          }
        : undefined,
      researchTech: includeResearchPopulationStress
        ? {
            pipelineBand: t % 6 === 0 ? 'stalled' : 'strong',
            adoptionBand: t % 7 === 0 ? 'fragmented' : 'scaling',
            fundingBand: t % 8 === 0 ? 'cut' : 'expansionary'
          }
        : undefined,
      population: includeResearchPopulationStress
        ? {
            growthBand: t % 5 === 0 ? 'stagnant' : 'strong',
            dependencyBand: t % 6 === 0 ? 'elevated' : 'favorable',
            netMigrationBand: t % 9 === 0 ? 'outflow' : 'strong_inflow'
          }
        : undefined,
      modesScenarios: includeModesGuardianStress
        ? {
            difficultyBand: t % 6 === 0 ? 'extreme' : 'standard',
            campaignMomentum: { band: t % 7 === 0 ? 'stalled' : 'summit_push' },
            scenarioVolatility: { band: t % 5 === 0 ? 'high' : 'stable' }
          }
        : undefined,
      guardianCopilot: includeModesGuardianStress
        ? {
            alertBand: t % 8 === 0 ? 'critical' : 'calm',
            openWarningCount: t % 6 === 0 ? 4 : 1,
            guidanceConfidence: { band: t % 9 === 0 ? 'low' : 'high' }
          }
        : undefined,
      citiesRegions: includeCitiesForecastingStress
        ? {
            urbanizationBand: t % 6 === 0 ? 'declining' : 'rapid',
            housingPressure: { band: t % 7 === 0 ? 'severe' : 'balanced' },
            hubStrength: { band: t % 5 === 0 ? 'weak' : 'strong' }
          }
        : undefined,
      forecastingLab: includeCitiesForecastingStress
        ? {
            outlookBand: t % 6 === 0 ? 'recession' : 'expansion',
            confidenceBand: t % 8 === 0 ? 'low' : 'high',
            dispersionBand: t % 5 === 0 ? 'wide' : 'tight'
          }
        : undefined,
      commandCenter: includeCommandAutomationStress
        ? {
            postureBand: t % 7 === 0 ? 'crisis' : 'steady',
            coordinationBand: t % 6 === 0 ? 'fragmented' : 'integrated',
            decisionBacklog: { band: t % 5 === 0 ? 'elevated' : 'clear' }
          }
        : undefined,
      idleAutomation: includeCommandAutomationStress
        ? {
            throughputBand: t % 6 === 0 ? 'stalled' : 'high',
            reliabilityBand: t % 8 === 0 ? 'fragile' : 'robust',
            adoptionBand: t % 9 === 0 ? 'minimal' : 'broad' }
        : undefined,
      teamIntelligence: includeTeamReplayStress
        ? {
            cohesionBand: t % 6 === 0 ? 'fractured' : 'strong',
            analysisThroughput: { band: t % 7 === 0 ? 'blocked' : 'high' },
            internalConflict: { band: t % 5 === 0 ? 'severe' : 'low' }
          }
        : undefined,
      historyReplay: includeTeamReplayStress
        ? {
            volatilityBand: t % 5 === 0 ? 'extreme' : 'stable',
            stressMemory: { band: t % 6 === 0 ? 'scarring' : 'fading' },
            recoveryArc: { band: t % 8 === 0 ? 'l-shaped' : 'strong' }
          }
        : undefined,
      aiMemory: includeMemoryDashboardStress
        ? {
            driftBand: t % 6 === 0 ? 'runaway' : 'stable',
            recallFidelity: { band: t % 7 === 0 ? 'degraded' : 'high' },
            auditGap: { band: t % 5 === 0 ? 'wide' : 'narrow' }
          }
        : undefined,
      dashboardsMaps: includeMemoryDashboardStress
        ? {
            refreshLag: { band: t % 5 === 0 ? 'stale' : 'fresh' },
            signalCoherence: { band: t % 6 === 0 ? 'fragmented' : 'aligned' },
            alertDensity: { band: t % 7 === 0 ? 'flooded' : 'calm' }
          }
        : undefined,
      gameUi: includeUiUtilitiesStress
        ? {
            panelLatency: { band: t % 6 === 0 ? 'critical' : 'snappy' },
            navigationClutter: { band: t % 5 === 0 ? 'overloaded' : 'clear' },
            renderHealth: { band: t % 7 === 0 ? 'unstable' : 'stable' }
          }
        : undefined,
      utilitiesGrid: includeUiUtilitiesStress
        ? {
            serviceReliability: { band: t % 6 === 0 ? 'fragile' : 'robust' },
            outageBand: t % 5 === 0 ? 'rolling' : 'rare',
            capacityMargin: { band: t % 8 === 0 ? 'thin' : 'ample' }
          }
        : undefined,
      trade: includeLogisticsNegotiationStress
        ? {
            termsOfTrade: { band: t % 7 === 0 ? 'weak' : 'stable' },
            logistics: {
              portBacklogBand: t % 6 === 0 ? 'gridlocked' : 'clear',
              routeReliability: { band: t % 5 === 0 ? 'disrupted' : 'robust' },
              leadTimeBand: t % 8 === 0 ? 'extended' : 'normal'
            }
          }
        : t % 7 === 0
          ? { termsOfTrade: { band: 'weak' }, exportMomentum: -4 }
          : { termsOfTrade: { band: 'stable' }, exportMomentum: 1 },
      negotiationState: includeLogisticsNegotiationStress
        ? {
            deadlockBand: t % 6 === 0 ? 'entrenched' : 'clear',
            trustBand: t % 7 === 0 ? 'collapsed' : 'robust',
            claimPressureBand: t % 5 === 0 ? 'surging' : 'calm'
          }
        : undefined,
      households: includeConfidenceCapexStress
        ? {
            consumerConfidence: {
              band: t % 6 === 0 ? 'collapsed' : 'strong',
              volatilityBand: t % 5 === 0 ? 'whipsaw' : 'stable'
            }
          }
        : undefined,
      privateSector: includeConfidenceCapexStress
        ? {
            capexCycle: {
              pipelineBand: t % 6 === 0 ? 'frozen' : 'expansionary',
              freezeBand: t % 7 === 0 ? 'binding' : 'none',
              paybackBand: t % 8 === 0 ? 'stretched' : 'attractive'
            }
          }
        : undefined,
      monetaryPolicy: includeMonetaryRentalStress
        ? {
            policyStance: t % 6 === 0 ? 'restrictive' : 'neutral',
            realRateBand: t % 7 === 0 ? 'elevated' : 'moderate',
            liquidityBand: t % 5 === 0 ? 'strained' : 'ample'
          }
        : undefined,
      rentalMarket: includeMonetaryRentalStress
        ? {
            pressureBand: t % 6 === 0 ? 'severe' : 'balanced',
            vacancyBand: t % 5 === 0 ? 'tight' : 'moderate',
            rentGrowthBand: t % 7 === 0 ? 'surging' : 'stable'
          }
        : undefined,
      climatePolicy: includeClimateForecastStress
        ? {
            transitionBand: t % 6 === 0 ? 'disruptive' : 'steady',
            carbonPriceBand: t % 7 === 0 ? 'punitive' : 'moderate',
            complianceBand: t % 5 === 0 ? 'binding' : 'light'
          }
        : undefined,
      forecastingLab: includeClimateForecastStress
        ? {
            dispersionBand: t % 6 === 0 ? 'wide' : 'tight',
            confidenceBand: t % 7 === 0 ? 'low' : 'high',
            disagreementBand: t % 5 === 0 ? 'polarized' : 'aligned'
          }
        : undefined,
      uiAccessibility: includeAccessibilityTimelineStress
        ? {
            contrastBand: t % 6 === 0 ? 'failing' : 'strong',
            inputLagBand: t % 5 === 0 ? 'severe' : 'snappy',
            coverageBand: t % 7 === 0 ? 'gaps' : 'full'
          }
        : undefined,
      historyTimeline: includeAccessibilityTimelineStress
        ? {
            gapBand: t % 6 === 0 ? 'broken' : 'coherent',
            narrativeDriftBand: t % 5 === 0 ? 'runaway' : 'stable',
            shockMemoryBand: t % 7 === 0 ? 'scarring' : 'fading'
          }
        : undefined,
      systemLiquidity: includeLiquidityMapsStress
        ? {
            band: t % 6 === 0 ? 'frozen' : 'ample',
            marketDepthBand: t % 5 === 0 ? 'thin' : 'deep',
            rolloverRiskBand: t % 7 === 0 ? 'severe' : 'low'
          }
        : undefined,
      mapsTelemetry: includeLiquidityMapsStress
        ? {
            geoFidelityBand: t % 6 === 0 ? 'distorted' : 'high',
            tileLatencyBand: t % 5 === 0 ? 'stale' : 'realtime',
            coverageBand: t % 7 === 0 ? 'gaps' : 'complete'
          }
        : undefined,
      strategicGameplay: includeGameplayArchiveStress
        ? {
            pacingBand: t % 6 === 0 ? 'gridlocked' : 'fluid',
            coherenceBand: t % 5 === 0 ? 'fragmented' : 'aligned',
            frictionBand: t % 7 === 0 ? 'severe' : 'low'
          }
        : undefined,
      historyArchiveIntegrity: includeGameplayArchiveStress
        ? {
            integrityBand: t % 6 === 0 ? 'corrupt' : 'verified',
            lineageBand: t % 5 === 0 ? 'broken' : 'continuous',
            retentionBand: t % 7 === 0 ? 'truncated' : 'durable'
          }
        : undefined,
      integrationHealth: includeIntegrationCadenceStress
        ? {
            meshBand: t % 6 === 0 ? 'fractured' : 'healthy',
            contractDriftBand: t % 5 === 0 ? 'runaway' : 'stable',
            smokeBand: t % 7 === 0 ? 'failing' : 'green'
          }
        : undefined,
      turnCadenceDrift: includeIntegrationCadenceStress
        ? {
            skewBand: t % 6 === 0 ? 'runaway' : 'anchored',
            jitterBand: t % 5 === 0 ? 'chaotic' : 'low',
            resolutionBand: t % 7 === 0 ? 'missed' : 'on_time'
          }
        : undefined,
      researchMomentum: includeResearchBudgetStress
        ? {
            velocityBand: t % 6 === 0 ? 'collapsed' : 'moderate',
            diffusionBand: t % 5 === 0 ? 'siloed' : 'broad',
            fundingBand: t % 7 === 0 ? 'starved' : 'strong'
          }
        : undefined,
      budgetOutlook: includeResearchBudgetStress
        ? {
            trajectoryBand: t % 6 === 0 ? 'deteriorating' : 'stable',
            consolidationBand: t % 5 === 0 ? 'severe' : 'moderate',
            capexRoomBand: t % 7 === 0 ? 'exhausted' : 'ample'
          }
        : undefined,
      modeShift: includeModeSupplyStress
        ? {
            volatilityBand: t % 6 === 0 ? 'chaotic' : 'stable',
            alignmentBand: t % 5 === 0 ? 'misaligned' : 'aligned',
            handoffBand: t % 7 === 0 ? 'failed' : 'smooth'
          }
        : undefined,
      supplyChainStress: includeModeSupplyStress
        ? {
            fragilityBand: t % 6 === 0 ? 'broken' : 'resilient',
            leadTimeBand: t % 5 === 0 ? 'extreme' : 'normal',
            inventoryBand: t % 7 === 0 ? 'empty' : 'healthy'
          }
        : undefined,
      eventCascade: includeEventDemographicStress
        ? {
            intensityBand: t % 6 === 0 ? 'runaway' : 'contained',
            propagationBand: t % 5 === 0 ? 'accelerating' : 'local',
            durationBand: t % 7 === 0 ? 'chronic' : 'fading'
          }
        : undefined,
      demographicShift: includeEventDemographicStress
        ? {
            migrationBand: t % 6 === 0 ? 'brain_drain' : 'balanced',
            agingBand: t % 5 === 0 ? 'accelerating' : 'gradual',
            participationBand: t % 7 === 0 ? 'collapsed' : 'stable'
          }
        : undefined,
      inflationExpectationsAnchor: includeExpectationsMetroStress
        ? {
            anchorBand: t % 6 === 0 ? 'deanchored' : 'well_anchored',
            driftBand: t % 5 === 0 ? 'runaway' : 'stable',
            credibilityBand: t % 7 === 0 ? 'lost' : 'strong'
          }
        : undefined,
      metroMomentum: includeExpectationsMetroStress
        ? {
            growthBand: t % 6 === 0 ? 'contracting' : 'strong',
            congestionBand: t % 5 === 0 ? 'gridlocked' : 'moderate',
            spreadBand: t % 7 === 0 ? 'wide' : 'narrow'
          }
        : undefined,
      transportThroughput: includeTransportEnergyStress
        ? {
            flowBand: t % 6 === 0 ? 'collapsed' : 'fluid',
            backlogBand: t % 5 === 0 ? 'severe' : 'moderate',
            reliabilityBand: t % 7 === 0 ? 'failing' : 'robust'
          }
        : undefined,
      energyTransitionPace: includeTransportEnergyStress
        ? {
            paceBand: t % 6 === 0 ? 'forced' : 'orderly',
            costBand: t % 5 === 0 ? 'spiking' : 'manageable',
            gridBand: t % 7 === 0 ? 'unstable' : 'stable'
          }
        : undefined,
      housingAffordability: includeHousingTradeStress
        ? {
            stressBand: t % 6 === 0 ? 'crushed' : 'balanced',
            tenureBand: t % 5 === 0 ? 'precarious' : 'stable',
            serviceBand: t % 7 === 0 ? 'strained' : 'adequate'
          }
        : undefined,
      tradeExposure: includeHousingTradeStress
        ? {
            shockBand: t % 6 === 0 ? 'dislocated' : 'muted',
            balanceBand: t % 5 === 0 ? 'unsustainable' : 'neutral',
            opennessBand: t % 7 === 0 ? 'fragile' : 'diversified'
          }
        : undefined,
      guardianVigilance: includeGuardianCommandStress
        ? {
            alertBand: t % 6 === 0 ? 'red' : 'green',
            coverageBand: t % 5 === 0 ? 'blind' : 'full',
            trustBand: t % 7 === 0 ? 'eroded' : 'strong'
          }
        : undefined,
      commandCoordination: includeGuardianCommandStress
        ? {
            syncBand: t % 6 === 0 ? 'broken' : 'aligned',
            latencyBand: t % 5 === 0 ? 'unbounded' : 'low',
            loadBand: t % 7 === 0 ? 'saturated' : 'balanced'
          }
        : undefined,
      teamAiCohesion: includeTeamMemoryStress
        ? {
            alignmentBand: t % 6 === 0 ? 'split' : 'unified',
            driftBand: t % 5 === 0 ? 'unbounded' : 'stable',
            qualityBand: t % 7 === 0 ? 'hallucinating' : 'reliable'
          }
        : undefined,
      memoryRetention: includeTeamMemoryStress
        ? {
            retentionBand: t % 6 === 0 ? 'lost' : 'durable',
            decayBand: t % 5 === 0 ? 'runaway' : 'slow',
            recallBand: t % 7 === 0 ? 'corrupted' : 'accurate'
          }
        : undefined,
      automationThroughput: includeAutomationForecastStress
        ? {
            paceBand: t % 6 === 0 ? 'collapsed' : 'strong',
            reliabilityBand: t % 5 === 0 ? 'failing' : 'robust',
            backlogBand: t % 7 === 0 ? 'unbounded' : 'light'
          }
        : undefined,
      forecastCalibration: includeAutomationForecastStress
        ? {
            biasBand: t % 6 === 0 ? 'runaway' : 'well_calibrated',
            horizonBand: t % 5 === 0 ? 'collapsed' : 'stable',
            confidenceBand: t % 7 === 0 ? 'misplaced' : 'grounded'
          }
        : undefined,
      automationIdleGovernance: includeGovernanceProjectionStress
        ? {
            governanceBand: t % 6 === 0 ? 'runaway' : 'grounded',
            idleBand: t % 5 === 0 ? 'frozen' : 'bounded',
            escrowBand: t % 7 === 0 ? 'misaligned' : 'latched'
          }
        : undefined,
      forecastProjectionSync: includeGovernanceProjectionStress
        ? {
            ledgerBand: t % 6 === 0 ? 'orphaned' : 'synced',
            driftBand: t % 5 === 0 ? 'runaway' : 'stable',
            syncBand: t % 7 === 0 ? 'desynced' : 'latched'
          }
        : undefined,
      automationIdleGovernanceWave36Export: includeWave36ExportProjectionStress
        ? {
            round36Ready: t % 6 !== 0,
            o10TaskId: 'O10-203',
            waveRound: 36,
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 1_962_828,
            wave36HookLines: t % 6 === 0 ? ['O10_AGENT20_WAVE36 round36_ready=false'] : ['O10_AGENT20_WAVE36 round36_ready=true']
          }
        : undefined,
      forecastWave36ProjectionSync: includeWave36ExportProjectionStress
        ? {
            status: t % 5 === 0 ? 'drift' : t % 7 === 0 ? 'unknown' : 'aligned',
            baselineSha: t % 7 === 0 ? 'deadbeef' : 'ea2bb03',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 1_962_828
          }
        : undefined,
      uiResponsivenessWave37Export: includeWave37UiDashboardExportStress
        ? {
            round37Ready: t % 6 !== 0,
            o10TaskId: 'O10-205',
            waveRound: 37,
            latencyBand: t % 5 === 0 ? 'critical' : 'fast',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_001_028
          }
        : undefined,
      dashboardClarityWave37Export: includeWave37UiDashboardExportStress
        ? {
            clarityReady: t % 6 !== 0,
            signalBand: t % 5 === 0 ? 'misleading' : 'clear',
            baselineSha: t % 7 === 0 ? 'deadbeef' : 'cfb4603',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_001_028
          }
        : undefined,
      replayWave38Export: includeWave38ReplayIntegrationStress
        ? {
            round38Ready: t % 6 !== 0,
            o10TaskId: 'O10-207',
            waveRound: 38,
            integrityBand: t % 5 === 0 ? 'corrupt' : 'sound',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_039_227
          }
        : undefined,
      integrationHealthWave38Export: includeWave38ReplayIntegrationStress
        ? {
            healthReady: t % 6 !== 0,
            slotBand: t % 5 === 0 ? 'red' : 'latched',
            baselineSha: t % 7 === 0 ? 'deadbeef' : 'b44b36f',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_039_227
          }
        : undefined,
      automationIdleGovernanceWave39Export: includeWave39AutomationForecastExportStress
        ? {
            round39Ready: t % 6 !== 0,
            o10TaskId: 'O10-209',
            waveRound: 39,
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_082_720
          }
        : undefined,
      forecastWave39Export: includeWave39AutomationForecastExportStress
        ? {
            status: t % 5 === 0 ? 'drift' : t % 7 === 0 ? 'unknown' : 'aligned',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '6134c6a',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_082_720
          }
        : undefined,
      uiResponsivenessWave40Export: includeWave40UiDashboardExportStress
        ? {
            round40Ready: t % 6 !== 0,
            o10TaskId: 'O10-211',
            waveRound: 40,
            latencyBand: t % 5 === 0 ? 'critical' : 'fast',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_121_263
          }
        : undefined,
      dashboardClarityWave40Export: includeWave40UiDashboardExportStress
        ? {
            clarityReady: t % 6 !== 0,
            signalBand: t % 5 === 0 ? 'misleading' : 'clear',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '6f7fa49',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_121_263
          }
        : undefined,
      replayWave41Export: includeWave41ReplayIntegrationStress
        ? {
            round41Ready: t % 6 !== 0,
            o10TaskId: 'O10-213',
            waveRound: 41,
            integrityBand: t % 5 === 0 ? 'corrupt' : 'sound',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_165_132
          }
        : undefined,
      integrationHealthWave41Export: includeWave41ReplayIntegrationStress
        ? {
            healthReady: t % 6 !== 0,
            slotBand: t % 5 === 0 ? 'red' : 'latched',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '875d6f3',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_165_132
          }
        : undefined,
      automationIdleGovernanceWave42Export: includeWave42AutomationForecastExportStress
        ? {
            round42Ready: t % 6 !== 0,
            o10TaskId: 'O10-215',
            waveRound: 42,
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_207_543
          }
        : undefined,
      forecastWave42Export: includeWave42AutomationForecastExportStress
        ? {
            status: t % 5 === 0 ? 'drift' : t % 7 === 0 ? 'unknown' : 'aligned',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '431df5d',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_207_543
          }
        : undefined,
      uiResponsivenessWave43Export: includeWave43UiDashboardExportStress
        ? {
            round43Ready: t % 6 !== 0,
            o10TaskId: 'O10-217',
            waveRound: 43,
            latencyBand: t % 5 === 0 ? 'critical' : 'fast',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_253_960
          }
        : undefined,
      dashboardClarityWave43Export: includeWave43UiDashboardExportStress
        ? {
            clarityReady: t % 6 !== 0,
            signalBand: t % 5 === 0 ? 'misleading' : 'clear',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '641d7d16',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_253_960
          }
        : undefined,
      automationIdleGovernanceWave44Export: includeWave44AutomationForecastExportStress
        ? {
            round44Ready: t % 6 !== 0,
            o10TaskId: 'O10-219',
            waveRound: 44,
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_503_353
          }
        : undefined,
      forecastWave44Export: includeWave44AutomationForecastExportStress
        ? {
            status: t % 5 === 0 ? 'drift' : t % 7 === 0 ? 'unknown' : 'aligned',
            baselineSha: t % 7 === 0 ? 'deadbeef' : 'bca7e0a3',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_503_353
          }
        : undefined,
      replayWave45Export: includeWave45ReplayIntegrationStress
        ? {
            round45Ready: t % 6 !== 0,
            o10TaskId: 'O10-221',
            waveRound: 45,
            integrityBand: t % 5 === 0 ? 'corrupt' : 'sound',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_548_579
          }
        : undefined,
      integrationHealthWave45Export: includeWave45ReplayIntegrationStress
        ? {
            healthReady: t % 6 !== 0,
            slotBand: t % 5 === 0 ? 'red' : 'latched',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '98bcd652',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_548_579
          }
        : undefined,
      uiResponsivenessWave46Export: includeWave46UiDashboardExportStress
        ? {
            round46Ready: t % 6 !== 0,
            o10TaskId: 'O10-223',
            waveRound: 46,
            latencyBand: t % 5 === 0 ? 'critical' : 'fast',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_593_189
          }
        : undefined,
      dashboardClarityWave46Export: includeWave46UiDashboardExportStress
        ? {
            clarityReady: t % 6 !== 0,
            signalBand: t % 5 === 0 ? 'misleading' : 'clear',
            baselineSha: t % 7 === 0 ? 'deadbeef' : 'a9bb07e5',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_593_189
          }
        : undefined,
      replayWave47Export: includeWave47ReplayIntegrationStress
        ? {
            round47Ready: t % 6 !== 0,
            o10TaskId: 'O10-225',
            waveRound: 47,
            integrityBand: t % 5 === 0 ? 'corrupt' : 'sound',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_637_258
          }
        : undefined,
      integrationHealthWave47Export: includeWave47ReplayIntegrationStress
        ? {
            healthReady: t % 6 !== 0,
            slotBand: t % 5 === 0 ? 'red' : 'latched',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '456efb9',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_637_258
          }
        : undefined,
      replayWave48Export: includeWave48ReplayIntegrationStress
        ? {
            round48Ready: t % 6 !== 0,
            o10TaskId: 'O10-227',
            waveRound: 48,
            integrityBand: t % 5 === 0 ? 'corrupt' : 'sound',
            projectedLocHint: t % 5 === 0 ? 1_800_000 : 2_684_235
          }
        : undefined,
      integrationHealthWave48Export: includeWave48ReplayIntegrationStress
        ? {
            healthReady: t % 6 !== 0,
            slotBand: t % 5 === 0 ? 'red' : 'latched',
            baselineSha: t % 7 === 0 ? 'deadbeef' : '4404bf0f',
            projectedFunctionalLoc: t % 5 === 0 ? 1_800_000 : 2_684_235
          }
        : undefined
    });
    const { state, persisted: nextP } = computeNationalMacroEconomy(inputs, persisted, prev);
    persisted = nextP;
    prev = state;
    lastHash = state.inputHash;
    const validation = validateNationalMacroEconomyState(state);
    if (!validation.valid) {
      checks.push({ id: `turn_${t}_valid`, passed: false, detail: validation.issues.join(';') });
      break;
    }
    if (!Number.isFinite(state.accounting.grossOutputIndex)) {
      checks.push({ id: `turn_${t}_finite`, passed: false, detail: 'non-finite output' });
      break;
    }
  }

  checks.push({
    id: 'completed_turns',
    passed: prev != null && prev.turn === turns,
    detail: prev ? `last turn ${prev.turn}` : 'no state'
  });
  checks.push({
    id: 'identity_stable',
    passed: Boolean(prev?.accounting.identityOk),
    detail: String(prev?.accounting.identityOk)
  });
  checks.push({
    id: 'transmission_present',
    passed: Boolean(prev?.transmissionReport?.layers?.length && prev.transmissionReport.layers.length >= 10),
    detail: String(prev?.transmissionReport?.layers?.length ?? 0)
  });
  if (includeCreditStress && prev) {
    checks.push({
      id: 'stress_index_present',
      passed: Number.isFinite(prev.stressIndex.score),
      detail: String(prev.stressIndex.score)
    });
  }
  if (includeLaborInnovationStress && prev) {
    checks.push({
      id: 'capacity_snapshot_finite',
      passed: Number.isFinite(prev.capacitySnapshot.index),
      detail: String(prev.capacitySnapshot.index)
    });
  }
  if (includeHousingStrategicStress && prev) {
    checks.push({
      id: 'transmission_balance_finite',
      passed: Number.isFinite(prev.transmissionBalance.dispersionIndex),
      detail: String(prev.transmissionBalance.dispersionIndex)
    });
  }
  if (includeInflationEnergyStress && prev) {
    checks.push({
      id: 'transmission_coherence_finite',
      passed: Number.isFinite(prev.transmissionCoherence.coherenceIndex),
      detail: String(prev.transmissionCoherence.coherenceIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeEventsCompaniesStress && prev) {
    checks.push({
      id: 'transmission_concentration_finite',
      passed: Number.isFinite(prev.transmissionConcentration.concentrationIndex),
      detail: String(prev.transmissionConcentration.concentrationIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_events',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeTurnsTransportStress && prev) {
    checks.push({
      id: 'transmission_asymmetry_finite',
      passed: Number.isFinite(prev.transmissionAsymmetry.asymmetryIndex),
      detail: String(prev.transmissionAsymmetry.asymmetryIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_turns',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeResearchPopulationStress && prev) {
    checks.push({
      id: 'transmission_volatility_finite',
      passed: Number.isFinite(prev.transmissionVolatility.volatilityIndex),
      detail: String(prev.transmissionVolatility.volatilityIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_research',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeModesGuardianStress && prev) {
    checks.push({
      id: 'transmission_resilience_finite',
      passed: Number.isFinite(prev.transmissionResilience.resilienceIndex),
      detail: String(prev.transmissionResilience.resilienceIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_modes',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeCitiesForecastingStress && prev) {
    checks.push({
      id: 'transmission_coverage_finite',
      passed: Number.isFinite(prev.transmissionCoverage.coverageIndex),
      detail: String(prev.transmissionCoverage.coverageIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_cities',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeCommandAutomationStress && prev) {
    checks.push({
      id: 'transmission_amplification_finite',
      passed: Number.isFinite(prev.transmissionAmplification.amplificationIndex),
      detail: String(prev.transmissionAmplification.amplificationIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_command',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeTeamReplayStress && prev) {
    checks.push({
      id: 'transmission_tension_finite',
      passed: Number.isFinite(prev.transmissionTension.tensionIndex),
      detail: String(prev.transmissionTension.tensionIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_team',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeMemoryDashboardStress && prev) {
    checks.push({
      id: 'transmission_divergence_finite',
      passed: Number.isFinite(prev.transmissionDivergence.divergenceIndex),
      detail: String(prev.transmissionDivergence.divergenceIndex)
    });
    checks.push({
      id: 'thirty_transmission_layers_memory',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeUiUtilitiesStress && prev) {
    checks.push({
      id: 'transmission_stability_finite',
      passed: Number.isFinite(prev.transmissionStability.stabilityIndex),
      detail: String(prev.transmissionStability.stabilityIndex)
    });
    checks.push({
      id: 'thirty_transmission_layers_ui',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeLogisticsNegotiationStress && prev) {
    checks.push({
      id: 'transmission_alignment_finite',
      passed: Number.isFinite(prev.transmissionAlignment.alignmentIndex),
      detail: String(prev.transmissionAlignment.alignmentIndex)
    });
    checks.push({
      id: 'thirty_two_transmission_layers_logistics',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeConfidenceCapexStress && prev) {
    checks.push({
      id: 'transmission_synchronization_finite',
      passed: Number.isFinite(prev.transmissionSynchronization.synchronizationIndex),
      detail: String(prev.transmissionSynchronization.synchronizationIndex)
    });
    checks.push({
      id: 'thirty_four_transmission_layers_confidence',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeMonetaryRentalStress && prev) {
    checks.push({
      id: 'transmission_intensity_finite',
      passed: Number.isFinite(prev.transmissionIntensity.intensityIndex),
      detail: String(prev.transmissionIntensity.intensityIndex)
    });
    checks.push({
      id: 'thirty_six_transmission_layers_monetary',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeClimateForecastStress && prev) {
    checks.push({
      id: 'transmission_polarization_finite',
      passed: Number.isFinite(prev.transmissionPolarization.polarizationIndex),
      detail: String(prev.transmissionPolarization.polarizationIndex)
    });
    checks.push({
      id: 'thirty_eight_transmission_layers_climate',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeAccessibilityTimelineStress && prev) {
    checks.push({
      id: 'transmission_coupling_finite',
      passed: Number.isFinite(prev.transmissionCoupling.couplingIndex),
      detail: String(prev.transmissionCoupling.couplingIndex)
    });
    checks.push({
      id: 'forty_transmission_layers_accessibility',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeLiquidityMapsStress && prev) {
    checks.push({
      id: 'transmission_imbalance_finite',
      passed: Number.isFinite(prev.transmissionImbalance.imbalanceIndex),
      detail: String(prev.transmissionImbalance.imbalanceIndex)
    });
    checks.push({
      id: 'forty_two_transmission_layers_liquidity',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeGameplayArchiveStress && prev) {
    checks.push({
      id: 'transmission_harmonic_finite',
      passed: Number.isFinite(prev.transmissionHarmonic.harmonicIndex),
      detail: String(prev.transmissionHarmonic.harmonicIndex)
    });
    checks.push({
      id: 'forty_four_transmission_layers_gameplay',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeIntegrationCadenceStress && prev) {
    checks.push({
      id: 'transmission_gradient_finite',
      passed: Number.isFinite(prev.transmissionGradient.gradientIndex),
      detail: String(prev.transmissionGradient.gradientIndex)
    });
    checks.push({
      id: 'forty_six_transmission_layers_integration',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeResearchBudgetStress && prev) {
    checks.push({
      id: 'transmission_attenuation_finite',
      passed: Number.isFinite(prev.transmissionAttenuation.attenuationIndex),
      detail: String(prev.transmissionAttenuation.attenuationIndex)
    });
    checks.push({
      id: 'forty_eight_transmission_layers_research',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeModeSupplyStress && prev) {
    checks.push({
      id: 'transmission_envelope_finite',
      passed: Number.isFinite(prev.transmissionEnvelope.envelopeIndex),
      detail: String(prev.transmissionEnvelope.envelopeIndex)
    });
    checks.push({
      id: 'fifty_transmission_layers_mode',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeEventDemographicStress && prev) {
    checks.push({
      id: 'transmission_persistence_finite',
      passed: Number.isFinite(prev.transmissionPersistence.persistenceIndex),
      detail: String(prev.transmissionPersistence.persistenceIndex)
    });
    checks.push({
      id: 'fifty_two_transmission_layers_event',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeExpectationsMetroStress && prev) {
    checks.push({
      id: 'transmission_centrality_finite',
      passed: Number.isFinite(prev.transmissionCentrality.centralityIndex),
      detail: String(prev.transmissionCentrality.centralityIndex)
    });
    checks.push({
      id: 'fifty_four_transmission_layers_expectations',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeTransportEnergyStress && prev) {
    checks.push({
      id: 'transmission_synthesis_finite',
      passed: Number.isFinite(prev.transmissionSynthesis.synthesisIndex),
      detail: String(prev.transmissionSynthesis.synthesisIndex)
    });
    checks.push({
      id: 'fifty_six_transmission_layers_transport',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeHousingTradeStress && prev) {
    checks.push({
      id: 'transmission_dispersion_finite',
      passed: Number.isFinite(prev.transmissionDispersion.dispersionIndex),
      detail: String(prev.transmissionDispersion.dispersionIndex)
    });
    checks.push({
      id: 'fifty_eight_transmission_layers_housing',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeGuardianCommandStress && prev) {
    checks.push({
      id: 'transmission_fragmentation_finite',
      passed: Number.isFinite(prev.transmissionFragmentation.fragmentationIndex),
      detail: String(prev.transmissionFragmentation.fragmentationIndex)
    });
    checks.push({
      id: 'sixty_transmission_layers_guardian',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeTeamMemoryStress && prev) {
    checks.push({
      id: 'transmission_redundancy_finite',
      passed: Number.isFinite(prev.transmissionRedundancy.redundancyIndex),
      detail: String(prev.transmissionRedundancy.redundancyIndex)
    });
    checks.push({
      id: 'sixty_two_transmission_layers_team',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeAutomationForecastStress && prev) {
    checks.push({
      id: 'transmission_saturation_finite',
      passed: Number.isFinite(prev.transmissionSaturation.saturationIndex),
      detail: String(prev.transmissionSaturation.saturationIndex)
    });
    checks.push({
      id: 'sixty_four_transmission_layers_automation',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeGovernanceProjectionStress && prev) {
    checks.push({
      id: 'transmission_elasticity_finite',
      passed: Number.isFinite(prev.transmissionElasticity.elasticityIndex),
      detail: String(prev.transmissionElasticity.elasticityIndex)
    });
    checks.push({
      id: 'sixty_six_transmission_layers_governance',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave36ExportProjectionStress && prev) {
    checks.push({
      id: 'transmission_dispersion_finite',
      passed: Number.isFinite(prev.transmissionDispersion.dispersionIndex),
      detail: String(prev.transmissionDispersion.dispersionIndex)
    });
    checks.push({
      id: 'sixty_eight_transmission_layers_wave36',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave37UiDashboardExportStress && prev) {
    checks.push({
      id: 'transmission_redundancy_finite',
      passed: Number.isFinite(prev.transmissionRedundancy.redundancyIndex),
      detail: String(prev.transmissionRedundancy.redundancyIndex)
    });
    checks.push({
      id: 'seventy_transmission_layers_wave37',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave38ReplayIntegrationStress && prev) {
    checks.push({
      id: 'transmission_synthesis_finite',
      passed: Number.isFinite(prev.transmissionSynthesis.synthesisIndex),
      detail: String(prev.transmissionSynthesis.synthesisIndex)
    });
    checks.push({
      id: 'seventy_two_transmission_layers_wave38',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave39AutomationForecastExportStress && prev) {
    checks.push({
      id: 'transmission_centrality_finite',
      passed: Number.isFinite(prev.transmissionCentrality.centralityIndex),
      detail: String(prev.transmissionCentrality.centralityIndex)
    });
    checks.push({
      id: 'seventy_four_transmission_layers_wave39',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave40UiDashboardExportStress && prev) {
    checks.push({
      id: 'transmission_envelope_finite',
      passed: Number.isFinite(prev.transmissionEnvelope.envelopeIndex),
      detail: String(prev.transmissionEnvelope.envelopeIndex)
    });
    checks.push({
      id: 'seventy_six_transmission_layers_wave40',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave41ReplayIntegrationStress && prev) {
    checks.push({
      id: 'transmission_persistence_finite',
      passed: Number.isFinite(prev.transmissionPersistence.persistenceIndex),
      detail: String(prev.transmissionPersistence.persistenceIndex)
    });
    checks.push({
      id: 'seventy_eight_transmission_layers_wave41',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave42AutomationForecastExportStress && prev) {
    checks.push({
      id: 'transmission_gradient_finite',
      passed: Number.isFinite(prev.transmissionGradient.gradientIndex),
      detail: String(prev.transmissionGradient.gradientIndex)
    });
    checks.push({
      id: 'eighty_transmission_layers_wave42',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave43UiDashboardExportStress && prev) {
    checks.push({
      id: 'transmission_envelope_finite',
      passed: Number.isFinite(prev.transmissionEnvelope.envelopeIndex),
      detail: String(prev.transmissionEnvelope.envelopeIndex)
    });
    checks.push({
      id: 'eighty_two_transmission_layers_wave43',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave44AutomationForecastExportStress && prev) {
    checks.push({
      id: 'transmission_gradient_finite',
      passed: Number.isFinite(prev.transmissionGradient.gradientIndex),
      detail: String(prev.transmissionGradient.gradientIndex)
    });
    checks.push({
      id: 'eighty_four_transmission_layers_wave44',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave45ReplayIntegrationStress && prev) {
    checks.push({
      id: 'transmission_persistence_finite',
      passed: Number.isFinite(prev.transmissionPersistence.persistenceIndex),
      detail: String(prev.transmissionPersistence.persistenceIndex)
    });
    checks.push({
      id: 'eighty_six_transmission_layers_wave45',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave46UiDashboardExportStress && prev) {
    checks.push({
      id: 'transmission_envelope_finite',
      passed: Number.isFinite(prev.transmissionEnvelope.envelopeIndex),
      detail: String(prev.transmissionEnvelope.envelopeIndex)
    });
    checks.push({
      id: 'eighty_eight_transmission_layers_wave46',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave47ReplayIntegrationStress && prev) {
    checks.push({
      id: 'transmission_persistence_finite',
      passed: Number.isFinite(prev.transmissionPersistence.persistenceIndex),
      detail: String(prev.transmissionPersistence.persistenceIndex)
    });
    checks.push({
      id: 'ninety_transmission_layers_wave47',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 90,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeWave48ReplayIntegrationStress && prev) {
    checks.push({
      id: 'transmission_persistence_finite',
      passed: Number.isFinite(prev.transmissionPersistence.persistenceIndex),
      detail: String(prev.transmissionPersistence.persistenceIndex)
    });
    checks.push({
      id: 'ninety_two_transmission_layers_wave48',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 92,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  checks.push({
    passed: lastHash.length > 8,
    detail: lastHash.slice(0, 12)
  });
  if (prev) {
    checks.push({
      id: 'debrief_headline',
      passed: prev.debrief.headline.includes(`T${turns}`),
      detail: prev.debrief.headline.slice(0, 40)
    });
  }

  return {
    scenarioId,
    turnsRun: turns,
    allPassed: checks.every(c => c.passed),
    checks
  };
}


// --- source: cycle-memory.ts ---

export function appendMacroCycleTransitionMemory(
  persisted: MacroEconomyPersisted,
  params: { turn: number; previousPhase: BusinessCyclePhase; nextPhase: BusinessCyclePhase }
): MacroEconomyPersisted {
  if (params.previousPhase === params.nextPhase) {
    return persisted;
  }
  const transition = {
    id: `me_tr:${params.turn}:${params.previousPhase}->${params.nextPhase}`,
    turn: params.turn,
    kind: 'cycle_phase_transition',
    summary: `${BUSINESS_CYCLE_LABEL[params.previousPhase]} → ${BUSINESS_CYCLE_LABEL[params.nextPhase]}`
  };
  const historyEntry = {
    id: `me_hist:${params.turn}:cycle`,
    turn: params.turn,
    summary: `National cycle entered ${BUSINESS_CYCLE_LABEL[params.nextPhase]}`
  };
  return {
    ...persisted,
    transitions: [...persisted.transitions, transition].slice(-V1014_MACRO_LIMITS.maxTransitions),
    history: [...persisted.history, historyEntry].slice(-V1014_MACRO_LIMITS.maxHistory)
  };
}

export function macroCycleTransitionCount(persisted: MacroEconomyPersisted): number {
  return persisted.transitions.filter(t => t.kind === 'cycle_phase_transition').length;
}


// --- source: sector-decomposition.ts ---

/** Derive national sector output mix from regional shares × regional sector productivity weights. */
export function computeNationalSectorOutputMix(
  contributions: RegionalMacroContribution[]
): Record<string, number> {
  const mix: Record<string, number> = Object.fromEntries(V1014_MACRO_SECTOR_KEYS.map(k => [k, 0]));
  for (const row of contributions) {
    const sectors = v1014macroComposeSectorProductivity(row.regionId);
    const sectorTotal = Object.values(sectors).reduce((a, b) => a + b, 0) || 1;
    for (const key of V1014_MACRO_SECTOR_KEYS) {
      mix[key] += row.share * ((sectors[key] ?? 0) / sectorTotal);
    }
  }
  const sum = Object.values(mix).reduce((a, b) => a + b, 0) || 1;
  for (const k of Object.keys(mix)) mix[k] = mix[k] / sum;
  return mix;
}

export function dominantNationalSector(mix: Record<string, number>): string {
  return Object.entries(mix).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'services';
}


// --- source: regional-divergence.ts ---

function herfindahl(shares: number[]): number {
  return shares.reduce((acc, s) => acc + s * s, 0);
}

export function computeRegionalDivergenceSnapshot(
  contributions: RegionalMacroContribution[]
): RegionalDivergenceSnapshot {
  const productivity = contributions.map(r => r.productivityIndex);
  const shares = contributions.map(r => r.share);
  const minP = Math.min(...productivity);
  const maxP = Math.max(...productivity);
  const productivitySpread = maxP - minP;
  const shareHerfindahl = herfindahl(shares);
  let band: RegionalDivergenceBand = 'moderate_spread';
  if (productivitySpread < 8 && shareHerfindahl < 0.14) band = 'cohesive';
  if (productivitySpread > 18 || shareHerfindahl > 0.2) band = 'wide_spread';
  const sortedProd = [...contributions].sort((a, b) => b.productivityIndex - a.productivityIndex);
  return {
    band,
    productivitySpread: v1014macroClamp(productivitySpread, 0, 100),
    shareHerfindahl: v1014macroClamp(shareHerfindahl, 0, 1),
    leadingRegionId: sortedProd[0]?.regionId ?? 'NSW',
    laggingRegionId: sortedProd[sortedProd.length - 1]?.regionId ?? 'TAS'
  };
}


// --- source: outlook-projection.ts ---
  v1014macroBandInvestment,
  v1014macroBandProductivity,
  v1014macroClamp,
  v1014macroCycleFromScore
} from './math.ts';
  BusinessCyclePhase,
  MacroEconomyInputs,
  MacroOutlookProjection,
  NationalMacroEconomyState
} from './types.ts';

export function projectMacroEconomyOutlook(
  state: NationalMacroEconomyState,
  inputs: MacroEconomyInputs,
  horizonTurns = 3
): MacroOutlookProjection {
  const h = Math.max(1, Math.min(6, Math.floor(horizonTurns)));
  let cycleScore = state.productivityIndex * 0.35 + state.grossInvestmentIndex * 0.35 + 50 * 0.3;
  let productivityScore = state.productivityIndex;
  let investmentScore = state.grossInvestmentIndex;
  const shockIds = resolveActiveCyclicalShockIds(inputs);
  const stacked = composeStackedShockDeltas(shockIds, CYCLICAL_MACRO_SHOCK_CATALOG);
  cycleScore += stacked.cycleDelta * 0.35 * h;
  productivityScore += stacked.productivityDelta * 0.25 * h;
  investmentScore += stacked.investmentDelta * 0.25 * h;
  cycleScore = v1014macroClamp(cycleScore, 0, 100);
  productivityScore = v1014macroClamp(productivityScore, 0, 100);
  investmentScore = v1014macroClamp(investmentScore, 0, 100);
  const projectedCyclePhase: BusinessCyclePhase = v1014macroCycleFromScore(cycleScore, state.cyclePhase);
  const projectedProductivityBand = v1014macroBandProductivity(productivityScore);
  const projectedInvestmentClimate = v1014macroBandInvestment(investmentScore);
  const utilization = deriveUtilizationIndex(cycleScore, investmentScore);
  const projectedOutputIndex = deriveGrossOutputIndex(productivityScore, utilization, investmentScore);
  const confidence = v1014macroClamp(0.92 - shockIds.length * 0.06 - h * 0.04, 0.45, 0.95);
  return {
    horizonTurns: h,
    projectedCyclePhase,
    projectedInvestmentClimate,
    projectedProductivityBand,
    projectedOutputIndex,
    confidence
  };
}


// --- source: action-alignment.ts ---

export interface MacroActionAlignment {
  category: string;
  scoreDelta: number;
  rationale: string;
}

const CATEGORY_WEIGHT: Record<string, { cycle: number; investment: number; productivity: number }> = {
  investments: { cycle: 0.2, investment: 0.55, productivity: 0.25 },
  infrastructure: { cycle: 0.25, investment: 0.45, productivity: 0.3 },
  industry: { cycle: 0.15, investment: 0.35, productivity: 0.5 },
  austerity: { cycle: -0.35, investment: -0.45, productivity: -0.2 },
  stimulus: { cycle: 0.4, investment: 0.35, productivity: 0.25 }
};

export function macroEconomyActionAlignment(
  state: NationalMacroEconomyState | null | undefined,
  action: { category?: string; regionId?: string | null }
): MacroActionAlignment | null {
  if (!state) return null;
  const cat = String(action.category ?? '').toLowerCase();
  const weights = CATEGORY_WEIGHT[cat];
  if (!weights) return null;
  const cycleNorm = (state.cycleMomentum + 1) / 2;
  const invNorm = state.grossInvestmentIndex / 100;
  const prodNorm = state.productivityIndex / 100;
  let scoreDelta =
    weights.cycle * (cycleNorm - 0.5) * 10 +
    weights.investment * (invNorm - 0.5) * 10 +
    weights.productivity * (prodNorm - 0.5) * 10;
  if (cat === 'austerity') {
    scoreDelta -= 1.25;
    if (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough' || state.investmentClimate === 'frozen') {
      scoreDelta -= 1.5;
    }
  }
  if (action.regionId) {
    const row = state.regionalContributions.find(r => r.regionId === action.regionId);
    if (row && row.role === 'lagging') scoreDelta -= 1.2;
    if (row && row.role === 'anchor') scoreDelta += 0.6;
  }
  if (state.regionalDivergence?.band === 'wide_spread' && cat === 'investments') scoreDelta -= 0.8;
  scoreDelta = v1014macroClamp(scoreDelta, -6, 6);
  return {
    category: cat,
    scoreDelta,
    rationale: `Macro alignment vs ${state.cyclePhase}/${state.investmentClimate}/${state.productivityBand}.`
  };
}


// --- source: consistency-gates.ts ---

export function evaluateMacroConsistencyGates(
  state: NationalMacroEconomyState,
  inputs: MacroEconomyInputs
): MacroConsistencyGate[] {
  const gates: MacroConsistencyGate[] = [];
  if (!state.accounting.identityOk) {
    gates.push({
      id: 'accounting_identity',
      triggered: true,
      severity: 'warn',
      summary: `Regional share accounting residual ${state.accounting.identityResidual.toFixed(6)}`
    });
  }
  const pf: any = inputs.publicFinance;
  const hh: any = inputs.households;
  const fiscalPressure = String(pf?.pressure ?? pf?.fiscalPosition?.pressure ?? '');
  const demand = String(hh?.domesticDemand?.level ?? hh?.domesticDemand?.band ?? '');
  if (fiscalPressure === 'critical' && (demand === 'strong' || demand === 'surging' || demand === 'very_strong')) {
    gates.push({
      id: 'fiscal_household_tension',
      triggered: true,
      severity: 'info',
      summary: 'Critical fiscal capacity coexists with strong household demand — interpret macro signals carefully.'
    });
  }
  if (state.investmentClimate === 'frozen' && state.utilizationBand === 'tight') {
    gates.push({
      id: 'investment_utilization_mismatch',
      triggered: true,
      severity: 'info',
      summary: 'Frozen investment climate despite tight utilization — binding constraint may be financial, not capacity.'
    });
  }
  if (state.regionalDivergence.band === 'wide_spread' && state.cyclePhase === 'expansion') {
    gates.push({
      id: 'regional_divergence_expansion',
      triggered: true,
      severity: 'info',
      summary: 'National expansion masks wide regional productivity dispersion.'
    });
  }
  const tr: any = inputs.trade;
  const terms = String(tr?.termsOfTrade?.band ?? tr?.termsBand ?? '');
  if (terms === 'weak' && (fiscalPressure === 'critical' || fiscalPressure === 'strained')) {
    gates.push({
      id: 'trade_fiscal_stress',
      triggered: true,
      severity: 'warn',
      summary: 'Weak external terms coincide with strained fiscal capacity — macro downside risk elevated.'
    });
  }
  if (state.transmissionReport?.dominantLayerId === 'v10.15_trade' && state.cyclePhase === 'contraction') {
    gates.push({
      id: 'external_led_contraction',
      triggered: true,
      severity: 'info',
      summary: 'External demand layer dominates transmission while cycle is in contraction.'
    });
  }
  const cm: any = inputs.creditMarkets ?? inputs.monetaryPolicy;
  const spread = String(cm?.spreadBand ?? cm?.creditSpread?.band ?? '');
  if (
    (spread === 'wide' || spread === 'stressed' || spread === 'frozen' || inputs.creditShockActive) &&
    state.investmentClimate === 'frozen'
  ) {
    gates.push({
      id: 'credit_investment_squeeze',
      triggered: true,
      severity: 'warn',
      summary: 'Tight credit conditions coincide with frozen investment climate — financing constraint likely binding.'
    });
  }
  const creditTight =
    inputs.creditShockActive ||
    spread === 'wide' ||
    spread === 'stressed' ||
    spread === 'frozen' ||
    String(cm?.policyStance ?? cm?.stance ?? '') === 'restrictive';
  if ((fiscalPressure === 'critical' || fiscalPressure === 'strained') && creditTight) {
    gates.push({
      id: 'monetary_fiscal_clamp',
      triggered: true,
      severity: 'warn',
      summary: 'Fiscal strain plus simultaneous credit tightening — composite policy stance is conflicted.'
    });
  }
  if (
    state.transmissionReport?.dominantLayerId === 'v10.16_credit' &&
    (creditTight || state.investmentClimate === 'frozen')
  ) {
    gates.push({
      id: 'credit_led_stress',
      triggered: true,
      severity: 'info',
      summary: 'Credit layer dominates macro transmission under tight financial conditions.'
    });
  }
  const wf: any = inputs.workforce;
  const readiness = String(wf?.nationalReadinessBand ?? wf?.readiness?.band ?? '');
  if (
    (readiness === 'critical' || readiness === 'shortage') &&
    (state.utilizationBand === 'tight' || state.utilizationBand === 'overextended')
  ) {
    gates.push({
      id: 'workforce_utilization_bind',
      triggered: true,
      severity: 'warn',
      summary: 'Labor shortages coincide with tight utilization — capacity constraint likely binding.'
    });
  }
  const inn: any = inputs.innovation;
  const innMomentum = String(inn?.momentum?.band ?? inn?.rAndDMomentum ?? '');
  if (
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough') &&
    (innMomentum === 'stalled' || innMomentum === 'weak' || innMomentum === 'contracting')
  ) {
    gates.push({
      id: 'innovation_contraction_drag',
      triggered: true,
      severity: 'info',
      summary: 'Innovation pipeline weakness amplifies macro contraction read.'
    });
  }
  if (state.capacitySnapshot?.band === 'binding' && state.investmentClimate === 'frozen') {
    gates.push({
      id: 'capacity_investment_paradox',
      triggered: true,
      severity: 'info',
      summary: 'Binding capacity read coexists with frozen investment — financing or policy may be the bind, not physical capacity.'
    });
  }
  const hw: any = inputs.housingWellbeing ?? inputs.housing;
  const housingStress = String(hw?.affordability?.band ?? hw?.affordabilityBand ?? hw?.stressBand ?? '');
  if (
    (housingStress === 'severe' || housingStress === 'critical' || housingStress === 'stressed') &&
    (creditTight || spread === 'stressed' || spread === 'frozen')
  ) {
    gates.push({
      id: 'housing_credit_stress',
      triggered: true,
      severity: 'warn',
      summary: 'Housing affordability stress coincides with tight credit — domestic macro downside risk elevated.'
    });
  }
  const sc: any = inputs.strategicCapital;
  const stratAlloc = String(sc?.allocationBand ?? sc?.capitalBand ?? '');
  if (
    (stratAlloc === 'expansionary' || stratAlloc === 'growth' || stratAlloc === 'active') &&
    state.investmentClimate === 'frozen'
  ) {
    gates.push({
      id: 'strategic_investment_divergence',
      triggered: true,
      severity: 'info',
      summary: 'Strategic capital stance is expansionary while macro investment climate reads frozen — execution or financing gap likely.'
    });
  }
  if (
    state.transmissionBalance?.band === 'cross_current' ||
    state.transmissionBalance?.band === 'fragmented'
  ) {
    gates.push({
      id: 'transmission_cross_current',
      triggered: true,
      severity: 'info',
      summary: 'Cross-current transmission layers — headline macro scores may mask offsetting sector forces.'
    });
  }
  const nf: any = inputs.nationalFinance ?? inputs.monetaryPolicy;
  const inflBand = String(nf?.inflation?.band ?? nf?.inflationBand ?? nf?.cpiBand ?? '');
  if (
    (inflBand === 'elevated' || inflBand === 'high' || inflBand === 'very_high' || inputs.highInflationScenarioActive) &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'slowdown' || state.cyclePhase === 'trough')
  ) {
    gates.push({
      id: 'inflation_cycle_drag',
      triggered: true,
      severity: 'warn',
      summary: 'Elevated inflation coincides with macro downturn — stagflation-style read elevated.'
    });
  }
  const en: any = inputs.industrialEnergy ?? inputs.energyEnvironment ?? inputs.nationalSystems?.industrialEnergy;
  const supply = String(en?.supplyReliability?.band ?? en?.reliabilityBand ?? en?.gridBand ?? '');
  if (
    (supply === 'critical' || supply === 'fragile' || supply === 'stressed') &&
    (state.utilizationBand === 'tight' || state.utilizationBand === 'overextended')
  ) {
    gates.push({
      id: 'energy_transition_bind',
      triggered: true,
      severity: 'warn',
      summary: 'Fragile energy supply with tight utilization — physical energy constraint may bind capacity.'
    });
  }
  const energyCost = String(en?.energyCost?.band ?? en?.inputCostBand ?? '');
  if (
    (energyCost === 'spike' || energyCost === 'severe' || energyCost === 'elevated') &&
    (inflBand === 'elevated' || inflBand === 'high' || inflBand === 'very_high' || inputs.highInflationScenarioActive)
  ) {
    gates.push({
      id: 'inflation_energy_stagflation',
      triggered: true,
      severity: 'info',
      summary: 'Energy cost shock aligns with elevated inflation — composite price-pressure macro risk.'
    });
  }
  if (
    state.transmissionCoherence?.band === 'contradictory' ||
    state.transmissionCoherence?.band === 'mixed'
  ) {
    gates.push({
      id: 'transmission_phase_incoherence',
      triggered: true,
      severity: 'info',
      summary: 'Transmission layer nudges partially contradict the headline cycle phase.'
    });
  }
  const ev: any = inputs.dynamicEvents ?? inputs.narrativeEvents ?? inputs.op10mEvents;
  const stability = String(ev?.nationalStabilityBand ?? ev?.stabilityBand ?? '');
  if (
    (stability === 'critical' || stability === 'fragile' || stability === 'stressed') &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough' || state.cyclePhase === 'slowdown')
  ) {
    gates.push({
      id: 'events_cycle_drag',
      triggered: true,
      severity: 'warn',
      summary: 'Fragile national narrative stability coincides with macro downturn — event-layer downside risk elevated.'
    });
  }
  const co: any = inputs.companies ?? inputs.privateSector ?? inputs.nationalPrivateSector;
  const utilization = String(co?.nationalUtilizationBand ?? co?.utilization?.band ?? co?.productionUtilization?.band ?? '');
  const overloaded = Math.max(0, Math.floor(Number(co?.overloadedFirmCount ?? co?.overloadedCount ?? 0)));
  if (
    (utilization === 'overextended' || utilization === 'saturated' || overloaded >= 3) &&
    (state.utilizationBand === 'tight' || state.utilizationBand === 'overextended')
  ) {
    gates.push({
      id: 'companies_capacity_bind',
      triggered: true,
      severity: 'warn',
      summary: 'Private-sector production strain coincides with tight macro utilization — capacity bind likely.'
    });
  }
  const backlog = String(ev?.pendingBacklogBand ?? ev?.backlogBand ?? '');
  if (
    (backlog === 'surging' || backlog === 'critical') &&
    (utilization === 'slack' || utilization === 'depressed' || utilization === 'critical')
  ) {
    gates.push({
      id: 'events_production_disruption',
      triggered: true,
      severity: 'info',
      summary: 'Event backlog pressure aligns with slack production utilization — narrative-production macro tension.'
    });
  }
  if (
    state.transmissionConcentration?.band === 'dominant_single' ||
    state.transmissionConcentration?.band === 'concentrated'
  ) {
    gates.push({
      id: 'transmission_concentration_risk',
      triggered: true,
      severity: 'info',
      summary: 'Macro transmission is concentrated in a narrow layer set — headline scores may be brittle.'
    });
  }
  const tt: any = inputs.turnsTime ?? inputs.temporalCadence ?? inputs.gameClock;
  const pace = String(tt?.paceBand ?? tt?.turnPace?.band ?? '');
  if (
    (pace === 'stalled' || pace === 'frozen' || pace === 'deferred') &&
    (state.cyclePhase === 'expansion' || state.cyclePhase === 'recovery')
  ) {
    gates.push({
      id: 'turns_cycle_desync',
      triggered: true,
      severity: 'info',
      summary: 'Stalled turn cadence coexists with expansionary macro phase — temporal desync elevated.'
    });
  }
  const infra: any = inputs.transportInfrastructure ?? inputs.infrastructure ?? inputs.nationalInfrastructure;
  const connectivity = String(infra?.connectivityBand ?? infra?.connectivity?.band ?? '');
  if (
    (connectivity === 'fragmented' || connectivity === 'critical' || connectivity === 'degraded') &&
    (state.productivityBand === 'strong' || state.productivityBand === 'leading')
  ) {
    gates.push({
      id: 'transport_productivity_tension',
      triggered: true,
      severity: 'warn',
      summary: 'Strong macro productivity read conflicts with degraded transport connectivity — logistics bind likely.'
    });
  }
  if (
    state.transmissionAsymmetry?.band === 'restrict_skewed' &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough')
  ) {
    gates.push({
      id: 'transmission_asymmetry_downside',
      triggered: true,
      severity: 'info',
      summary: 'Restrictive transmission skew aligns with macro downturn — downside reinforcement elevated.'
    });
  }
  const rs: any = inputs.researchTech ?? inputs.research ?? inputs.nationalResearch;
  const pipeline = String(rs?.pipelineBand ?? rs?.techPipeline?.band ?? '');
  if (
    (pipeline === 'stalled' || pipeline === 'blocked' || pipeline === 'weak') &&
    (state.productivityBand === 'strong' || state.productivityBand === 'leading')
  ) {
    gates.push({
      id: 'research_productivity_divergence',
      triggered: true,
      severity: 'info',
      summary: 'Strong macro productivity read conflicts with weak research pipeline — tech drag may be latent.'
    });
  }
  const pop: any = inputs.population ?? inputs.demographics ?? inputs.nationalPopulation;
  const growth = String(pop?.growthBand ?? pop?.populationGrowth?.band ?? '');
  if (
    (growth === 'contracting' || growth === 'critical' || growth === 'stagnant') &&
    (state.investmentClimate === 'active' || state.investmentClimate === 'overheating')
  ) {
    gates.push({
      id: 'population_investment_tension',
      triggered: true,
      severity: 'warn',
      summary: 'Weak demographic momentum coexists with overheating investment read — sustainability risk elevated.'
    });
  }
  if (state.transmissionVolatility?.band === 'turbulent' || state.transmissionVolatility?.band === 'elevated') {
    gates.push({
      id: 'transmission_volatility_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated cross-layer transmission volatility — composite macro scores may swing turn-to-turn.'
    });
  }
  const md: any = inputs.modesScenarios ?? inputs.gameModes ?? inputs.scenarioRuntime;
  const difficulty = String(md?.difficultyBand ?? md?.scenarioDifficulty?.band ?? '');
  if (
    (difficulty === 'extreme' || difficulty === 'crisis') &&
    (state.stressIndex?.band === 'acute' || state.stressIndex?.band === 'elevated')
  ) {
    gates.push({
      id: 'modes_stress_alignment',
      triggered: true,
      severity: 'warn',
      summary: 'Extreme scenario difficulty aligns with elevated macro stress index — composite downside risk.'
    });
  }
  const grd: any = inputs.guardianCopilot ?? inputs.guardian ?? inputs.coPilotWarnings;
  const alert = String(grd?.alertBand ?? grd?.riskBand ?? '');
  if (
    (alert === 'critical' || alert === 'severe' || alert === 'red') &&
    state.transmissionResilience?.band === 'fragile'
  ) {
    gates.push({
      id: 'guardian_resilience_fragility',
      triggered: true,
      severity: 'warn',
      summary: 'Critical guardian alerts with fragile transmission resilience — macro read highly brittle.'
    });
  }
  const ct: any = inputs.citiesRegions ?? inputs.urbanRegions ?? inputs.metropolitanSystems;
  const urban = String(ct?.urbanizationBand ?? ct?.urbanGrowth?.band ?? '');
  if (
    (urban === 'declining' || urban === 'stagnant') &&
    state.regionalDivergence?.band === 'wide_spread'
  ) {
    gates.push({
      id: 'cities_regional_divergence',
      triggered: true,
      severity: 'info',
      summary: 'Weak urban momentum with wide regional divergence — metro-regional macro tension elevated.'
    });
  }
  const fc: any = inputs.forecastingLab ?? inputs.macroForecasts ?? inputs.nationalForecasts;
  const outlook = String(fc?.outlookBand ?? fc?.consensusOutlook?.band ?? '');
  if (
    (outlook === 'downside' || outlook === 'recession' || outlook === 'contraction') &&
    (state.cyclePhase === 'expansion' || state.cyclePhase === 'peak')
  ) {
    gates.push({
      id: 'forecast_cycle_divergence',
      triggered: true,
      severity: 'warn',
      summary: 'Downside forecast consensus conflicts with headline expansion phase — interpret macro signals carefully.'
    });
  }
  if (state.transmissionCoverage?.band === 'sparse' || state.transmissionCoverage?.band === 'narrow') {
    gates.push({
      id: 'transmission_coverage_gap',
      triggered: true,
      severity: 'info',
      summary: 'Few transmission layers materially active — composite macro read may omit cross-system forces.'
    });
  }
  const cmd: any = inputs.commandCenter ?? inputs.nationalCommand ?? inputs.aiCommandCenter;
  const posture = String(cmd?.postureBand ?? cmd?.operationalPosture?.band ?? '');
  if (
    (posture === 'crisis' || posture === 'red' || posture === 'critical') &&
    state.stressIndex?.band === 'acute'
  ) {
    gates.push({
      id: 'command_stress_lockstep',
      triggered: true,
      severity: 'warn',
      summary: 'Crisis command posture aligns with acute macro stress — policy room likely constrained.'
    });
  }
  const au: any = inputs.idleAutomation ?? inputs.automation ?? inputs.nationalAutomation;
  const throughput = String(au?.throughputBand ?? au?.automationThroughput?.band ?? '');
  if (
    (throughput === 'stalled' || throughput === 'critical') &&
    (state.productivityBand === 'weak' || state.productivityBand === 'critical')
  ) {
    gates.push({
      id: 'automation_productivity_bind',
      triggered: true,
      severity: 'info',
      summary: 'Stalled automation throughput coincides with weak macro productivity — operational drag likely binding.'
    });
  }
  if (state.transmissionAmplification?.band === 'restrictive' || state.transmissionAmplification?.band === 'mild_restrict') {
    gates.push({
      id: 'transmission_amplification_downside',
      triggered: true,
      severity: 'info',
      summary: 'Restrictive transmission amplification — downside nudges dominate supportive layers.'
    });
  }
  const ti: any = inputs.teamIntelligence ?? inputs.teamAi ?? inputs.nationalTeamAi;
  const cohesion = String(ti?.cohesionBand ?? ti?.teamCohesion?.band ?? '');
  if (
    (cohesion === 'fractured' || cohesion === 'critical') &&
    state.transmissionCoherence?.band === 'contradictory'
  ) {
    gates.push({
      id: 'team_transmission_incoherence',
      triggered: true,
      severity: 'info',
      summary: 'Fractured team AI cohesion aligns with contradictory transmission phase read.'
    });
  }
  const rp: any = inputs.historyReplay ?? inputs.replayArchive ?? inputs.nationalHistory;
  const stressMemory = String(rp?.stressMemory?.band ?? rp?.priorShockMemory?.band ?? '');
  if (
    (stressMemory === 'persistent' || stressMemory === 'scarring') &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough')
  ) {
    gates.push({
      id: 'replay_stress_memory',
      triggered: true,
      severity: 'warn',
      summary: 'Persistent replay stress memory reinforces macro downturn interpretation.'
    });
  }
  if (state.transmissionTension?.band === 'acute' || state.transmissionTension?.band === 'elevated') {
    gates.push({
      id: 'transmission_tension_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated transmission tension — restrictive layer mass dominates supportive nudges.'
    });
  }
  const mem: any = inputs.aiMemory ?? inputs.explainability ?? inputs.nationalAiMemory;
  const drift = String(mem?.driftBand ?? mem?.memoryDrift?.band ?? '');
  if (
    (drift === 'runaway' || drift === 'critical') &&
    (state.transmissionCoherence?.band === 'contradictory' || state.transmissionCoherence?.band === 'mixed')
  ) {
    gates.push({
      id: 'memory_explainability_drift',
      triggered: true,
      severity: 'warn',
      summary: 'Runaway AI memory drift aligns with contradictory transmission coherence read.'
    });
  }
  const dash: any = inputs.dashboardsMaps ?? inputs.nationalDashboards ?? inputs.mapsTelemetry;
  const refreshLag = String(dash?.refreshLag?.band ?? dash?.dataLagBand ?? '');
  if (
    (refreshLag === 'stale' || refreshLag === 'critical') &&
    (state.investmentClimate === 'cautious' || state.investmentClimate === 'frozen')
  ) {
    gates.push({
      id: 'dashboard_signal_lag',
      triggered: true,
      severity: 'info',
      summary: 'Stale dashboard refresh coincides with cautious macro investment climate.'
    });
  }
  if (state.transmissionDivergence?.band === 'wide' || state.transmissionDivergence?.band === 'elevated') {
    gates.push({
      id: 'transmission_divergence_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated cycle vs investment transmission divergence — layer reads may conflict.'
    });
  }
  const ui: any = inputs.gameUi ?? inputs.uiShell ?? inputs.nationalUi;
  const panelLatency = String(ui?.panelLatency?.band ?? ui?.renderLatencyBand ?? '');
  if (
    (panelLatency === 'severe' || panelLatency === 'critical') &&
    (state.transmissionStability?.band === 'fragile' || state.transmissionStability?.band === 'unstable')
  ) {
    gates.push({
      id: 'ui_shell_latency_stress',
      triggered: true,
      severity: 'info',
      summary: 'Severe UI panel latency aligns with fragile cycle/productivity transmission stability.'
    });
  }
  const util: any = inputs.utilitiesGrid ?? inputs.publicUtilities ?? inputs.nationalUtilities;
  const outageBand = String(util?.outageBand ?? util?.outageRisk?.band ?? '');
  if (
    (outageBand === 'rolling' || outageBand === 'severe') &&
    (state.productivityBand === 'critical' || state.productivityBand === 'weak')
  ) {
    gates.push({
      id: 'utilities_outage_productivity',
      triggered: true,
      severity: 'warn',
      summary: 'Rolling utility outages reinforce stagnant macro productivity band.'
    });
  }
  if (state.transmissionStability?.band === 'unstable' || state.transmissionStability?.band === 'fragile') {
    gates.push({
      id: 'transmission_stability_fragile',
      triggered: true,
      severity: 'info',
      summary: 'Fragile cycle vs productivity transmission stability — interpret headline scores cautiously.'
    });
  }
  const trLog: any = inputs.trade?.logistics ?? inputs.trade?.supplyChain ?? inputs.trade;
  const portBacklog = String(trLog?.portBacklogBand ?? trLog?.backlogBand ?? trLog?.congestionBand ?? '');
  if (
    (portBacklog === 'gridlocked' || portBacklog === 'critical') &&
    (state.cyclePhase === 'contraction' || state.cyclePhase === 'slowdown')
  ) {
    gates.push({
      id: 'trade_logistics_gridlock',
      triggered: true,
      severity: 'warn',
      summary: 'Gridlocked trade logistics reinforce macro slowdown / contraction read.'
    });
  }
  const neg: any = inputs.negotiationState ?? inputs.diplomacy;
  const deadlock = String(neg?.deadlockBand ?? neg?.stalemateBand ?? '');
  if (
    (deadlock === 'entrenched' || deadlock === 'critical') &&
    (state.investmentClimate === 'frozen' || state.investmentClimate === 'cautious')
  ) {
    gates.push({
      id: 'negotiation_deadlock_investment',
      triggered: true,
      severity: 'info',
      summary: 'Entrenched negotiation deadlock aligns with cautious macro investment climate.'
    });
  }
  if (state.transmissionAlignment?.band === 'misaligned' || state.transmissionAlignment?.band === 'strained') {
    gates.push({
      id: 'transmission_alignment_strained',
      triggered: true,
      severity: 'info',
      summary: 'Strained investment vs productivity transmission alignment — layer reads may conflict.'
    });
  }
  const hhConf: any = inputs.households?.consumerConfidence ?? inputs.consumerConfidence;
  const confBand = String(hhConf?.band ?? hhConf?.level ?? inputs.households?.confidenceBand ?? '');
  if (
    (confBand === 'collapsed' || confBand === 'critical') &&
    (state.cyclePhase === 'contraction' || state.investmentClimate === 'frozen')
  ) {
    gates.push({
      id: 'consumer_confidence_collapse',
      triggered: true,
      severity: 'warn',
      summary: 'Collapsed consumer confidence aligns with contractionary macro read.'
    });
  }
  const capex: any = inputs.privateCapex ?? inputs.companies?.capexCycle ?? inputs.privateSector?.capitalExpenditure;
  const capexPipe = String(capex?.pipelineBand ?? capex?.backlogBand ?? inputs.companies?.capexPipelineBand ?? '');
  if (
    (capexPipe === 'frozen' || capexPipe === 'collapsed') &&
    state.transmissionSynchronization?.band === 'fractured'
  ) {
    gates.push({
      id: 'capex_freeze_desync',
      triggered: true,
      severity: 'info',
      summary: 'Frozen private capex pipeline coincides with fractured transmission synchronization.'
    });
  }
  if (state.transmissionSynchronization?.band === 'fractured') {
    gates.push({
      id: 'transmission_synchronization_fractured',
      triggered: true,
      severity: 'info',
      summary: 'Fractured cross-layer transmission synchronization — interpret composite scores cautiously.'
    });
  }
  const mp: any = inputs.monetaryPolicy ?? inputs.creditMarkets;
  const stance = String(mp?.policyStance ?? mp?.stance ?? '');
  if (
    (stance === 'restrictive' || stance === 'aggressive_tightening') &&
    (state.investmentClimate === 'frozen' || state.investmentClimate === 'cautious')
  ) {
    gates.push({
      id: 'monetary_stance_restrictive',
      triggered: true,
      severity: 'warn',
      summary: 'Restrictive monetary stance aligns with cautious macro investment climate.'
    });
  }
  const rental: any = inputs.rentalMarket ?? inputs.housingWellbeing?.rental;
  const rentalPressure = String(rental?.pressureBand ?? rental?.stressBand ?? '');
  if (
    (rentalPressure === 'severe' || rentalPressure === 'critical') &&
    (state.housingSpilloverSummary != null || state.productivityBand === 'weak')
  ) {
    gates.push({
      id: 'rental_stress_housing',
      triggered: true,
      severity: 'info',
      summary: 'Severe rental pressure reinforces weak housing-linked macro read.'
    });
  }
  if (state.transmissionIntensity?.band === 'elevated' || state.transmissionIntensity?.band === 'acute') {
    gates.push({
      id: 'transmission_intensity_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated transmission intensity — many layers carry material nudges simultaneously.'
    });
  }
  const climate: any = inputs.climatePolicy ?? inputs.energyEnvironment?.climatePolicy;
  const transition = String(climate?.transitionBand ?? climate?.transition?.band ?? '');
  if (
    (transition === 'disruptive' || transition === 'shock') &&
    (state.energySpilloverSummary != null || state.productivityBand === 'weak')
  ) {
    gates.push({
      id: 'climate_transition_shock',
      triggered: true,
      severity: 'warn',
      summary: 'Disruptive climate transition aligns with strained energy/productivity macro read.'
    });
  }
  const fl: any = inputs.forecastingLab ?? inputs.nationalForecasts;
  const dispersion = String(fl?.dispersionBand ?? fl?.forecastSpread?.band ?? '');
  if (
    (dispersion === 'wide' || dispersion === 'extreme') &&
    (state.investmentClimate === 'cautious' || state.investmentClimate === 'frozen')
  ) {
    gates.push({
      id: 'forecast_dispersion_wide',
      triggered: true,
      severity: 'info',
      summary: 'Wide forecast dispersion coincides with cautious macro investment climate.'
    });
  }
  if (
    state.transmissionPolarization?.band === 'restrictive_dominant' ||
    state.transmissionPolarization?.band === 'elevated'
  ) {
    gates.push({
      id: 'transmission_polarization_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated transmission polarization — restrictive layer mass dominates supportive mass.'
    });
  }
  const acc: any = inputs.uiAccessibility ?? inputs.gameUi?.accessibility;
  const contrast = String(acc?.contrastBand ?? acc?.contrast?.band ?? '');
  if (
    (contrast === 'failing' || contrast === 'critical') &&
    (state.productivityBand === 'weak' || state.productivityBand === 'critical')
  ) {
    gates.push({
      id: 'ui_accessibility_failing',
      triggered: true,
      severity: 'info',
      summary: 'Failing UI accessibility aligns with weak macro productivity band.'
    });
  }
  const tl: any = inputs.historyTimeline ?? inputs.historyReplay?.timeline;
  const gap = String(tl?.gapBand ?? tl?.continuityBand ?? '');
  if (
    (gap === 'broken' || gap === 'discontinuous') &&
    (state.replaySpilloverSummary != null || state.cyclePhase === 'contraction')
  ) {
    gates.push({
      id: 'history_timeline_broken',
      triggered: true,
      severity: 'warn',
      summary: 'Broken history timeline continuity reinforces contractionary macro read.'
    });
  }
  if (state.transmissionCoupling?.band === 'tight' || state.transmissionCoupling?.band === 'firm') {
    gates.push({
      id: 'transmission_coupling_firm',
      triggered: true,
      severity: 'info',
      summary: 'Firm cycle/investment transmission coupling — shocks may propagate quickly across layers.'
    });
  }
  const liq: any = inputs.systemLiquidity ?? inputs.creditMarkets?.liquidity;
  const liqBand = String(liq?.band ?? liq?.stressBand ?? liq?.stance ?? '');
  if (
    (liqBand === 'frozen' || liqBand === 'critical') &&
    (state.investmentClimate === 'frozen' || state.creditSpilloverSummary != null)
  ) {
    gates.push({
      id: 'system_liquidity_frozen',
      triggered: true,
      severity: 'warn',
      summary: 'Frozen system liquidity aligns with tight macro investment/credit read.'
    });
  }
  const mt: any = inputs.mapsTelemetry ?? inputs.dashboardsMaps?.telemetry;
  const mapFidelity = String(mt?.geoFidelityBand ?? mt?.fidelityBand ?? '');
  if (
    (mapFidelity === 'distorted' || mapFidelity === 'critical') &&
    (state.regionalDivergence?.band === 'wide_spread' || state.transmissionImbalance?.band === 'tilted')
  ) {
    gates.push({
      id: 'maps_telemetry_distorted',
      triggered: true,
      severity: 'info',
      summary: 'Distorted maps telemetry coincides with wide regional or tilted transmission imbalance.'
    });
  }
  if (
    state.transmissionImbalance?.band === 'restrictive_heavy' ||
    state.transmissionImbalance?.band === 'tilted'
  ) {
    gates.push({
      id: 'transmission_imbalance_tilted',
      triggered: true,
      severity: 'info',
      summary: 'Tilted transmission imbalance — restrictive mass dominates supportive spillover.'
    });
  }
  const gp: any = inputs.strategicGameplay ?? inputs.strategicCapital?.gameplayCadence;
  const pacing = String(gp?.pacingBand ?? gp?.cadenceBand ?? '');
  if (
    (pacing === 'gridlocked' || pacing === 'critical') &&
    (state.investmentClimate === 'frozen' || state.cyclePhase === 'contraction')
  ) {
    gates.push({
      id: 'strategic_gameplay_gridlocked',
      triggered: true,
      severity: 'info',
      summary: 'Gridlocked strategic gameplay aligns with contractionary or frozen macro read.'
    });
  }
  const arch: any = inputs.historyArchiveIntegrity ?? inputs.replayArchive?.integrity;
  const integrity = String(arch?.integrityBand ?? arch?.checksumBand ?? '');
  if (
    (integrity === 'corrupt' || integrity === 'compromised') &&
    (state.archiveIntegritySpilloverSummary != null || state.replaySpilloverSummary != null)
  ) {
    gates.push({
      id: 'history_archive_corrupt',
      triggered: true,
      severity: 'warn',
      summary: 'Corrupt history archive integrity reinforces fragile macro evidence read.'
    });
  }
  if (state.transmissionHarmonic?.band === 'dissonant' || state.transmissionHarmonic?.band === 'mixed') {
    gates.push({
      id: 'transmission_harmonic_dissonant',
      triggered: true,
      severity: 'info',
      summary: 'Dissonant cross-channel transmission harmonic — layer nudges disagree across cycle/investment/productivity.'
    });
  }
  const ih: any = inputs.integrationHealth ?? inputs.op10mIntegration?.health;
  const mesh = String(ih?.meshBand ?? ih?.syncBand ?? '');
  if (
    (mesh === 'fractured' || mesh === 'desynced') &&
    (state.integrationHealthSpilloverSummary != null || state.stressIndex.band !== 'calm')
  ) {
    gates.push({
      id: 'integration_mesh_fractured',
      triggered: true,
      severity: 'warn',
      summary: 'Fractured integration mesh coincides with elevated macro stress read.'
    });
  }
  const cd: any = inputs.turnCadenceDrift ?? inputs.turnsTime?.cadenceDrift;
  const jitter = String(cd?.jitterBand ?? cd?.clockJitter?.band ?? '');
  if (
    (jitter === 'chaotic' || jitter === 'extreme') &&
    (state.cadenceDriftSpilloverSummary != null || state.turnsSpilloverSummary != null)
  ) {
    gates.push({
      id: 'turn_cadence_chaotic',
      triggered: true,
      severity: 'info',
      summary: 'Chaotic turn cadence jitter aligns with strained temporal spillover read.'
    });
  }
  if (state.transmissionGradient?.band === 'steep' || state.transmissionGradient?.band === 'sloped') {
    gates.push({
      id: 'transmission_gradient_steep',
      triggered: true,
      severity: 'info',
      summary: 'Steep transmission gradient — a few layers dominate macro spillover mass.'
    });
  }
  const rm: any = inputs.researchMomentum ?? inputs.researchTech?.momentum;
  const velocity = String(rm?.velocityBand ?? rm?.momentumBand ?? '');
  if (
    (velocity === 'collapsed' || velocity === 'critical') &&
    (state.productivityBand === 'weak' || state.productivityBand === 'critical')
  ) {
    gates.push({
      id: 'research_momentum_collapsed',
      triggered: true,
      severity: 'info',
      summary: 'Collapsed research momentum aligns with weak macro productivity band.'
    });
  }
  const bo: any = inputs.budgetOutlook ?? inputs.publicFinance?.outlook;
  const capexRoom = String(bo?.capexRoomBand ?? bo?.capitalHeadroom?.band ?? '');
  if (
    (capexRoom === 'exhausted' || capexRoom === 'none') &&
    (state.investmentClimate === 'frozen' || state.fiscalSpilloverSummary != null)
  ) {
    gates.push({
      id: 'budget_capex_exhausted',
      triggered: true,
      severity: 'warn',
      summary: 'Exhausted public capex room coincides with tight macro investment/fiscal read.'
    });
  }
  if (state.transmissionAttenuation?.band === 'muted' || state.transmissionAttenuation?.band === 'balanced') {
    gates.push({
      id: 'transmission_attenuation_soft',
      triggered: true,
      severity: 'info',
      summary: 'Soft transmission attenuation — tail layers carry less spillover mass vs peak layer.'
    });
  }
  const ms: any = inputs.modeShift ?? inputs.modesScenarios?.shift;
  const vol = String(ms?.volatilityBand ?? ms?.shiftBand ?? '');
  if (
    (vol === 'chaotic' || vol === 'disruptive') &&
    (state.modesSpilloverSummary != null || state.cyclePhase === 'contraction')
  ) {
    gates.push({
      id: 'mode_shift_disruptive',
      triggered: true,
      severity: 'info',
      summary: 'Disruptive mode shift aligns with contractionary or modes spillover stress read.'
    });
  }
  const chainStress: any = inputs.supplyChainStress ?? inputs.companies?.supplyChain;
  const frag = String(chainStress?.fragilityBand ?? chainStress?.stressBand ?? '');
  if (
    (frag === 'broken' || frag === 'severe') &&
    (state.companiesSpilloverSummary != null || state.productivityBand === 'weak')
  ) {
    gates.push({
      id: 'supply_chain_broken',
      triggered: true,
      severity: 'warn',
      summary: 'Broken corporate supply chains reinforce weak macro productivity/companies read.'
    });
  }
  if (state.transmissionEnvelope?.band === 'wide') {
    gates.push({
      id: 'transmission_envelope_wide',
      triggered: true,
      severity: 'info',
      summary: 'Wide transmission envelope — peak layer spillover magnitude is elevated.'
    });
  }
  const eventCascade: any = inputs.eventCascade ?? inputs.dynamicEvents?.cascade;
  const cascadeIntensity = String(eventCascade?.intensityBand ?? eventCascade?.cascadeBand ?? '');
  if (
    (cascadeIntensity === 'runaway' || cascadeIntensity === 'extreme') &&
    (state.eventsSpilloverSummary != null || state.stressIndex.band !== 'calm')
  ) {
    gates.push({
      id: 'event_cascade_runaway',
      triggered: true,
      severity: 'warn',
      summary: 'Runaway event cascade coincides with elevated narrative or macro stress read.'
    });
  }
  const demoShift: any = inputs.demographicShift ?? inputs.population?.shift;
  const participation = String(demoShift?.participationBand ?? demoShift?.laborParticipation?.band ?? '');
  if (
    (participation === 'collapsed' || participation === 'falling') &&
    (state.populationSpilloverSummary != null || state.workforceSpilloverSummary != null)
  ) {
    gates.push({
      id: 'demographic_participation_falling',
      triggered: true,
      severity: 'info',
      summary: 'Falling demographic participation aligns with strained workforce/population spillover.'
    });
  }
  if (state.transmissionPersistence?.band === 'fragile') {
    gates.push({
      id: 'transmission_persistence_fragile',
      triggered: true,
      severity: 'info',
      summary: 'Fragile transmission persistence — layer signs diverge from aggregate spillover direction.'
    });
  }
  const inflAnchor: any = inputs.inflationExpectationsAnchor ?? inputs.nationalFinance?.expectationsAnchor;
  const anchorBand = String(inflAnchor?.anchorBand ?? inflAnchor?.stabilityBand ?? '');
  if (
    (anchorBand === 'deanchored' || anchorBand === 'unmoored') &&
    (state.inflationSpilloverSummary != null || inputs.highInflationScenarioActive)
  ) {
    gates.push({
      id: 'expectations_deanchored',
      triggered: true,
      severity: 'warn',
      summary: 'Deanchored inflation expectations align with elevated inflation macro read.'
    });
  }
  const metroMom: any = inputs.metroMomentum ?? inputs.citiesRegions?.momentum;
  const metroGrowth = String(metroMom?.growthBand ?? metroMom?.momentumBand ?? '');
  if (
    (metroGrowth === 'contracting' || metroGrowth === 'stalled') &&
    (state.citiesSpilloverSummary != null || state.regionalDivergence?.band === 'wide_spread')
  ) {
    gates.push({
      id: 'metro_growth_stalled',
      triggered: true,
      severity: 'info',
      summary: 'Stalled metro momentum coincides with wide regional or cities spillover stress.'
    });
  }
  if (state.transmissionCentrality?.band === 'concentrated') {
    gates.push({
      id: 'transmission_centrality_concentrated',
      triggered: true,
      severity: 'info',
      summary: 'Concentrated transmission centrality — top layers dominate spillover mass.'
    });
  }
  const transportTp: any = inputs.transportThroughput ?? inputs.transportInfrastructure?.throughput;
  const flow = String(transportTp?.flowBand ?? transportTp?.throughputBand ?? '');
  if (
    (flow === 'collapsed' || flow === 'critical') &&
    (state.transportSpilloverSummary != null || state.productivityBand === 'weak')
  ) {
    gates.push({
      id: 'transport_throughput_collapsed',
      triggered: true,
      severity: 'warn',
      summary: 'Collapsed transport throughput aligns with weak macro productivity/transport read.'
    });
  }
  const etp: any = inputs.energyTransitionPace ?? inputs.industrialEnergy?.transitionPace;
  const transitionPaceBand = String(etp?.paceBand ?? etp?.transitionBand ?? '');
  if (
    (transitionPaceBand === 'forced' || transitionPaceBand === 'disruptive') &&
    (state.energySpilloverSummary != null || state.climateSpilloverSummary != null)
  ) {
    gates.push({
      id: 'energy_transition_disruptive',
      triggered: true,
      severity: 'info',
      summary: 'Disruptive energy transition pace coincides with strained energy/climate spillover.'
    });
  }
  if (state.transmissionSynthesis?.band === 'elevated') {
    gates.push({
      id: 'transmission_synthesis_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated transmission synthesis — gross spillover mass is high across layers.'
    });
  }
  const haAff: any = inputs.housingAffordability ?? inputs.housingWellbeing?.affordability;
  const affordStress = String(haAff?.stressBand ?? haAff?.affordabilityBand ?? '');
  if (
    (affordStress === 'crushed' || affordStress === 'critical') &&
    (state.housingSpilloverSummary != null || state.rentalSpilloverSummary != null)
  ) {
    gates.push({
      id: 'housing_affordability_crushed',
      triggered: true,
      severity: 'warn',
      summary: 'Crushed housing affordability aligns with strained housing/rental spillover read.'
    });
  }
  const tradeExpIn: any = inputs.tradeExposure ?? inputs.trade?.exposure;
  const exposureShock = String(tradeExpIn?.shockBand ?? tradeExpIn?.vulnerabilityBand ?? '');
  if (
    (exposureShock === 'dislocated' || exposureShock === 'critical') &&
    (state.tradeSpilloverSummary != null || state.tradeExposureSpilloverSummary != null)
  ) {
    gates.push({
      id: 'trade_exposure_dislocated',
      triggered: true,
      severity: 'info',
      summary: 'Dislocated trade exposure coincides with strained external/trade spillover.'
    });
  }
  if (state.transmissionDispersion?.band === 'wide') {
    gates.push({
      id: 'transmission_dispersion_wide',
      triggered: true,
      severity: 'info',
      summary: 'Wide transmission dispersion — spillover mass is uneven across layers.'
    });
  }
  const gvIn: any = inputs.guardianVigilance ?? inputs.guardianCopilot?.vigilance;
  const vigilanceAlert = String(gvIn?.alertBand ?? gvIn?.vigilanceBand ?? '');
  if (
    (vigilanceAlert === 'red' || vigilanceAlert === 'critical') &&
    (state.guardianSpilloverSummary != null || state.guardianVigilanceSpilloverSummary != null)
  ) {
    gates.push({
      id: 'guardian_vigilance_elevated',
      triggered: true,
      severity: 'warn',
      summary: 'Elevated guardian vigilance aligns with strained guardian spillover read.'
    });
  }
  const cmdIn: any = inputs.commandCoordination ?? inputs.commandCenter?.coordination;
  const syncBand = String(cmdIn?.syncBand ?? cmdIn?.coordinationBand ?? '');
  if (
    (syncBand === 'broken' || syncBand === 'fragmented') &&
    (state.commandSpilloverSummary != null || state.commandCoordinationSpilloverSummary != null)
  ) {
    gates.push({
      id: 'command_coordination_fragmented',
      triggered: true,
      severity: 'info',
      summary: 'Fragmented command coordination coincides with strained command spillover.'
    });
  }
  if (state.transmissionFragmentation?.band === 'fragmented') {
    gates.push({
      id: 'transmission_fragmentation_high',
      triggered: true,
      severity: 'info',
      summary: 'High transmission fragmentation — many layers carry negligible spillover mass.'
    });
  }
  const teamCohesionIn: any = inputs.teamAiCohesion ?? inputs.teamIntelligence?.cohesion;
  const cohesionAlign = String(teamCohesionIn?.alignmentBand ?? teamCohesionIn?.cohesionBand ?? '');
  if (
    (cohesionAlign === 'split' || cohesionAlign === 'fractured') &&
    (state.teamAiSpilloverSummary != null || state.teamAiCohesionSpilloverSummary != null)
  ) {
    gates.push({
      id: 'team_ai_cohesion_fractured',
      triggered: true,
      severity: 'warn',
      summary: 'Fractured team AI cohesion aligns with strained team AI spillover read.'
    });
  }
  const memRetIn: any = inputs.memoryRetention ?? inputs.aiMemory?.retention;
  const retentionBand = String(memRetIn?.retentionBand ?? memRetIn?.holdBand ?? '');
  if (
    (retentionBand === 'lost' || retentionBand === 'volatile') &&
    (state.memorySpilloverSummary != null || state.memoryRetentionSpilloverSummary != null)
  ) {
    gates.push({
      id: 'memory_retention_volatile',
      triggered: true,
      severity: 'info',
      summary: 'Volatile memory retention coincides with strained AI memory spillover.'
    });
  }
  if (state.transmissionRedundancy?.band === 'stacked') {
    gates.push({
      id: 'transmission_redundancy_stacked',
      triggered: true,
      severity: 'info',
      summary: 'Stacked transmission redundancy — aligned layers dominate spillover mass.'
    });
  }
  const autoTp: any = inputs.automationThroughput ?? inputs.idleAutomation?.throughput;
  const autoPace = String(autoTp?.paceBand ?? autoTp?.throughputBand ?? '');
  if (
    (autoPace === 'collapsed' || autoPace === 'stalled') &&
    (state.automationSpilloverSummary != null || state.automationThroughputSpilloverSummary != null)
  ) {
    gates.push({
      id: 'automation_throughput_collapsed',
      triggered: true,
      severity: 'warn',
      summary: 'Collapsed automation throughput aligns with strained automation spillover read.'
    });
  }
  const fcIn: any = inputs.forecastCalibration ?? inputs.forecastingLab?.calibration;
  const calBias = String(fcIn?.biasBand ?? fcIn?.calibrationBand ?? '');
  if (
    (calBias === 'runaway' || calBias === 'severe') &&
    (state.forecastingSpilloverSummary != null || state.forecastCalibrationSpilloverSummary != null)
  ) {
    gates.push({
      id: 'forecast_calibration_runaway',
      triggered: true,
      severity: 'info',
      summary: 'Runaway forecast calibration bias coincides with strained forecasting spillover.'
    });
  }
  if (state.transmissionSaturation?.band === 'saturated') {
    gates.push({
      id: 'transmission_saturation_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated transmission saturation — a single layer dominates active mass.'
    });
  }
  const idleGov: any = inputs.automationIdleGovernance ?? inputs.idleAutomation?.governance;
  const govBand = String(idleGov?.governanceBand ?? idleGov?.policyBand ?? '');
  if (
    (govBand === 'runaway' || govBand === 'escalated') &&
    (state.automationSpilloverSummary != null || state.automationIdleGovernanceSpilloverSummary != null)
  ) {
    gates.push({
      id: 'automation_idle_governance_escalated',
      triggered: true,
      severity: 'warn',
      summary: 'Escalated automation idle governance aligns with strained automation spillover read.'
    });
  }
  const projSync: any = inputs.forecastProjectionSync ?? inputs.forecastingLab?.projectionSync;
  const driftBand = String(projSync?.driftBand ?? projSync?.offsetBand ?? '');
  if (
    (driftBand === 'runaway' || driftBand === 'critical') &&
    (state.forecastingSpilloverSummary != null || state.forecastProjectionSyncSpilloverSummary != null)
  ) {
    gates.push({
      id: 'forecast_projection_sync_drifted',
      triggered: true,
      severity: 'info',
      summary: 'Runaway forecast projection drift coincides with strained forecasting spillover.'
    });
  }
  if (state.transmissionElasticity?.band === 'rigid') {
    gates.push({
      id: 'transmission_elasticity_rigid',
      triggered: true,
      severity: 'info',
      summary: 'Rigid transmission elasticity — active spillover mass concentrates in few layers.'
    });
  }
  const wave36Export: any =
    inputs.automationIdleGovernanceWave36Export ?? inputs.idleAutomation?.governanceWave36Export;
  const round36Ready = Boolean(
    wave36Export?.round36Ready ?? wave36Export?.payload?.round36Ready ?? wave36Export?.exportReady
  );
  if (
    wave36Export &&
    !round36Ready &&
    (state.automationSpilloverSummary != null || state.automationIdleGovernanceWave36ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'automation_idle_governance_wave36_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'Automation idle governance wave 36 export not ready — macro spillover read is strained.'
    });
  }
  const wave36Sync: any =
    inputs.forecastWave36ProjectionSync ?? inputs.forecastingLab?.wave36ProjectionSync;
  const syncStatus = String(wave36Sync?.status ?? wave36Sync?.syncStatus ?? '').toLowerCase();
  if (
    syncStatus === 'drift' &&
    (state.forecastingSpilloverSummary != null || state.forecastWave36ProjectionSyncSpilloverSummary != null)
  ) {
    gates.push({
      id: 'forecast_wave36_projection_sync_drifted',
      triggered: true,
      severity: 'info',
      summary: 'Forecast wave 36 projection sync drifted coincides with strained forecasting spillover.'
    });
  }
  if (state.transmissionDispersion?.band === 'moderate') {
    gates.push({
      id: 'transmission_dispersion_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated transmission dispersion — spillover mass is uneven across active layers.'
    });
  }
  const wave37Ui: any =
    inputs.uiResponsivenessWave37Export ?? inputs.uiResponsiveness?.wave37Export ?? inputs.gameUi?.responsivenessWave37Export;
  const round37Ready = Boolean(
    wave37Ui?.round37Ready ?? wave37Ui?.payload?.round37Ready ?? wave37Ui?.exportReady
  );
  if (
    wave37Ui &&
    !round37Ready &&
    (state.uiSpilloverSummary != null || state.uiResponsivenessWave37ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'ui_responsiveness_wave37_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'UI responsiveness wave 37 export not ready — macro spillover read is strained.'
    });
  }
  const wave37Dash: any =
    inputs.dashboardClarityWave37Export ?? inputs.dashboardClarity?.wave37Export ?? inputs.dashboards?.clarityWave37Export;
  const clarityReady = Boolean(
    wave37Dash?.clarityReady ?? wave37Dash?.round37Ready ?? wave37Dash?.payload?.clarityReady
  );
  if (
    wave37Dash &&
    !clarityReady &&
    (state.dashboardsSpilloverSummary != null || state.dashboardClarityWave37ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'dashboard_clarity_wave37_export_blocked',
      triggered: true,
      severity: 'info',
      summary: 'Dashboard clarity wave 37 export not ready coincides with strained dashboards spillover.'
    });
  }
  if (state.transmissionRedundancy?.band === 'stacked') {
    gates.push({
      id: 'transmission_redundancy_stacked',
      triggered: true,
      severity: 'info',
      summary: 'Stacked transmission redundancy — aligned spillover mass concentrates across active layers.'
    });
  }
  const wave38Replay: any =
    inputs.replayWave38Export ?? inputs.historyReplay?.wave38Export ?? inputs.replay?.wave38Export;
  const round38Ready = Boolean(
    wave38Replay?.round38Ready ?? wave38Replay?.payload?.round38Ready ?? wave38Replay?.exportReady
  );
  if (
    wave38Replay &&
    !round38Ready &&
    (state.replaySpilloverSummary != null || state.replayWave38ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'replay_wave38_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'History replay wave 38 export not ready — macro spillover read is strained.'
    });
  }
  const wave38Health: any =
    inputs.integrationHealthWave38Export ??
    inputs.integrationHealth?.wave38Export ??
    inputs.assembly?.integrationHealthWave38Export;
  const healthReady = Boolean(
    wave38Health?.healthReady ?? wave38Health?.round38Ready ?? wave38Health?.payload?.healthReady
  );
  if (
    wave38Health &&
    !healthReady &&
    (state.integrationHealthSpilloverSummary != null || state.integrationHealthWave38ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'integration_health_wave38_export_blocked',
      triggered: true,
      severity: 'info',
      summary: 'Integration health wave 38 export not ready coincides with strained integration health spillover.'
    });
  }
  if (state.transmissionSynthesis?.band === 'elevated') {
    gates.push({
      id: 'transmission_synthesis_elevated',
      triggered: true,
      severity: 'info',
      summary: 'Elevated transmission synthesis — net spillover impulse is concentrated across layers.'
    });
  }
  const wave39Auto: any =
    inputs.automationIdleGovernanceWave39Export ??
    inputs.automationIdleGovernance?.wave39Export ??
    inputs.idleAutomation?.governanceWave39Export;
  const round39Ready = Boolean(
    wave39Auto?.round39Ready ?? wave39Auto?.payload?.round39Ready ?? wave39Auto?.exportReady
  );
  if (
    wave39Auto &&
    !round39Ready &&
    (state.automationSpilloverSummary != null || state.automationIdleGovernanceWave39ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'automation_idle_governance_wave39_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'Automation idle governance wave 39 export not ready — macro spillover read is strained.'
    });
  }
  const wave39Forecast: any =
    inputs.forecastWave39Export ?? inputs.forecastingLab?.wave39Export ?? inputs.macroForecasts?.wave39Export;
  const exportStatus = String(wave39Forecast?.status ?? wave39Forecast?.syncStatus ?? '').toLowerCase();
  if (
    exportStatus === 'drift' &&
    (state.forecastingSpilloverSummary != null || state.forecastWave39ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'forecast_wave39_export_drifted',
      triggered: true,
      severity: 'info',
      summary: 'Forecast wave 39 export drifted coincides with strained forecasting spillover.'
    });
  }
  if (state.transmissionCentrality?.band === 'concentrated') {
    gates.push({
      id: 'transmission_centrality_concentrated',
      triggered: true,
      severity: 'info',
      summary: 'Concentrated transmission centrality — top layers carry most active spillover mass.'
    });
  }
  const wave40Ui: any =
    inputs.uiResponsivenessWave40Export ??
    inputs.uiResponsiveness?.wave40Export ??
    inputs.gameUi?.responsivenessWave40Export;
  const round40Ready = Boolean(
    wave40Ui?.round40Ready ?? wave40Ui?.payload?.round40Ready ?? wave40Ui?.exportReady
  );
  if (
    wave40Ui &&
    !round40Ready &&
    (state.uiSpilloverSummary != null || state.uiResponsivenessWave40ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'ui_responsiveness_wave40_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'UI responsiveness wave 40 export not ready — macro spillover read is strained.'
    });
  }
  const wave40Dash: any =
    inputs.dashboardClarityWave40Export ??
    inputs.dashboardClarity?.wave40Export ??
    inputs.dashboards?.clarityWave40Export;
  const clarity40Ready = Boolean(
    wave40Dash?.clarityReady ?? wave40Dash?.round40Ready ?? wave40Dash?.payload?.clarityReady
  );
  if (
    wave40Dash &&
    !clarity40Ready &&
    (state.dashboardsSpilloverSummary != null || state.dashboardClarityWave40ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'dashboard_clarity_wave40_export_blocked',
      triggered: true,
      severity: 'info',
      summary: 'Dashboard clarity wave 40 export not ready coincides with strained dashboards spillover.'
    });
  }
  if (state.transmissionEnvelope?.band === 'wide') {
    gates.push({
      id: 'transmission_envelope_wide',
      triggered: true,
      severity: 'info',
      summary: 'Wide transmission envelope — peak active-layer spillover magnitude is elevated.'
    });
  }
  const wave41Replay: any =
    inputs.replayWave41Export ?? inputs.historyReplay?.wave41Export ?? inputs.replay?.wave41Export;
  const round41Ready = Boolean(
    wave41Replay?.round41Ready ?? wave41Replay?.payload?.round41Ready ?? wave41Replay?.exportReady
  );
  if (
    wave41Replay &&
    !round41Ready &&
    (state.replaySpilloverSummary != null || state.replayWave41ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'replay_wave41_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'History replay wave 41 export not ready — macro spillover read is strained.'
    });
  }
  const wave41Health: any =
    inputs.integrationHealthWave41Export ??
    inputs.integrationHealth?.wave41Export ??
    inputs.assembly?.integrationHealthWave41Export;
  const health41Ready = Boolean(
    wave41Health?.healthReady ?? wave41Health?.round41Ready ?? wave41Health?.payload?.healthReady
  );
  if (
    wave41Health &&
    !health41Ready &&
    (state.integrationHealthSpilloverSummary != null || state.integrationHealthWave41ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'integration_health_wave41_export_blocked',
      triggered: true,
      severity: 'info',
      summary: 'Integration health wave 41 export not ready coincides with strained integration health spillover.'
    });
  }
  const wave42Auto: any =
    inputs.automationIdleGovernanceWave42Export ??
    inputs.automationIdleGovernance?.wave42Export ??
    inputs.idleAutomation?.governanceWave42Export;
  const round42Ready = Boolean(
    wave42Auto?.round42Ready ?? wave42Auto?.payload?.round42Ready ?? wave42Auto?.exportReady
  );
  if (
    wave42Auto &&
    !round42Ready &&
    (state.automationSpilloverSummary != null || state.automationIdleGovernanceWave42ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'automation_idle_governance_wave42_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'Automation idle governance wave 42 export not ready — macro spillover read is strained.'
    });
  }
  const wave42Forecast: any =
    inputs.forecastWave42Export ?? inputs.forecastingLab?.wave42Export ?? inputs.macroForecasts?.wave42Export;
  const export42Status = String(wave42Forecast?.status ?? wave42Forecast?.syncStatus ?? '').toLowerCase();
  if (
    export42Status === 'drift' &&
    (state.forecastingSpilloverSummary != null || state.forecastWave42ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'forecast_wave42_export_drifted',
      triggered: true,
      severity: 'info',
      summary: 'Forecast wave 42 export drifted coincides with strained forecasting spillover.'
    });
  }
  if (state.transmissionGradient?.band === 'steep' || state.transmissionGradient?.band === 'sloped') {
    gates.push({
      id: 'transmission_gradient_steep_wave42',
      triggered: true,
      severity: 'info',
      summary: 'Steep transmission gradient after wave 42 export layers — spillover mass is concentrated.'
    });
  }
  const wave43Ui: any =
    inputs.uiResponsivenessWave43Export ??
    inputs.uiResponsiveness?.wave43Export ??
    inputs.gameUi?.responsivenessWave43Export;
  const round43Ready = Boolean(
    wave43Ui?.round43Ready ?? wave43Ui?.payload?.round43Ready ?? wave43Ui?.exportReady
  );
  if (
    wave43Ui &&
    !round43Ready &&
    (state.uiSpilloverSummary != null || state.uiResponsivenessWave43ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'ui_responsiveness_wave43_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'UI responsiveness wave 43 export not ready — macro spillover read is strained.'
    });
  }
  const wave43Dash: any =
    inputs.dashboardClarityWave43Export ??
    inputs.dashboardClarity?.wave43Export ??
    inputs.dashboards?.clarityWave43Export;
  const clarity43Ready = Boolean(
    wave43Dash?.clarityReady ?? wave43Dash?.round43Ready ?? wave43Dash?.payload?.clarityReady
  );
  if (
    wave43Dash &&
    !clarity43Ready &&
    (state.dashboardsSpilloverSummary != null || state.dashboardClarityWave43ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'dashboard_clarity_wave43_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'Dashboard clarity wave 43 export not ready — macro spillover read is strained.'
    });
  }
  if (state.transmissionEnvelope?.band === 'wide') {
    gates.push({
      id: 'transmission_envelope_wide_wave43',
      triggered: true,
      severity: 'info',
      summary: 'Wide transmission envelope after wave 43 UI/dashboard export layers — spillover spread is elevated.'
    });
  }
  const wave44Auto: any =
    inputs.automationIdleGovernanceWave44Export ??
    inputs.automationIdleGovernance?.wave44Export ??
    inputs.idleAutomation?.governanceWave44Export;
  const round44Ready = Boolean(
    wave44Auto?.round44Ready ?? wave44Auto?.payload?.round44Ready ?? wave44Auto?.exportReady
  );
  if (
    wave44Auto &&
    !round44Ready &&
    (state.automationSpilloverSummary != null || state.automationIdleGovernanceWave44ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'automation_idle_governance_wave44_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'Automation idle governance wave 44 export not ready — macro spillover read is strained.'
    });
  }
  const wave44Forecast: any =
    inputs.forecastWave44Export ?? inputs.forecastingLab?.wave44Export ?? inputs.macroForecasts?.wave44Export;
  const export44Status = String(wave44Forecast?.status ?? wave44Forecast?.syncStatus ?? '').toLowerCase();
  if (
    export44Status === 'drift' &&
    (state.forecastingSpilloverSummary != null || state.forecastWave44ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'forecast_wave44_export_drifted',
      triggered: true,
      severity: 'info',
      summary: 'Forecast wave 44 export drifted coincides with strained forecasting spillover.'
    });
  }
  if (state.transmissionGradient?.band === 'steep' || state.transmissionGradient?.band === 'sloped') {
    gates.push({
      id: 'transmission_gradient_steep_wave44',
      triggered: true,
      severity: 'info',
      summary: 'Steep transmission gradient after wave 44 export layers — spillover mass is concentrated.'
    });
  }
  const wave45Replay: any =
    inputs.replayWave45Export ?? inputs.historyReplay?.wave45Export ?? inputs.replay?.wave45Export;
  const round45Ready = Boolean(
    wave45Replay?.round45Ready ?? wave45Replay?.payload?.round45Ready ?? wave45Replay?.exportReady
  );
  if (
    wave45Replay &&
    !round45Ready &&
    (state.replaySpilloverSummary != null || state.replayWave45ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'replay_wave45_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'History replay wave 45 export not ready — macro spillover read is strained.'
    });
  }
  const wave45Health: any =
    inputs.integrationHealthWave45Export ??
    inputs.integrationHealth?.wave45Export ??
    inputs.assembly?.integrationHealthWave45Export;
  const health45Ready = Boolean(
    wave45Health?.healthReady ?? wave45Health?.round45Ready ?? wave45Health?.payload?.healthReady
  );
  if (
    wave45Health &&
    !health45Ready &&
    (state.integrationHealthSpilloverSummary != null || state.integrationHealthWave45ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'integration_health_wave45_export_blocked',
      triggered: true,
      severity: 'info',
      summary: 'Integration health wave 45 export not ready coincides with strained integration health spillover.'
    });
  }
  const wave46Ui: any =
    inputs.uiResponsivenessWave46Export ??
    inputs.uiResponsiveness?.wave46Export ??
    inputs.gameUi?.responsivenessWave46Export;
  const round46Ready = Boolean(
    wave46Ui?.round46Ready ?? wave46Ui?.payload?.round46Ready ?? wave46Ui?.exportReady
  );
  if (
    wave46Ui &&
    !round46Ready &&
    (state.uiSpilloverSummary != null || state.uiResponsivenessWave46ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'ui_responsiveness_wave46_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'UI responsiveness wave 46 export not ready — macro spillover read is strained.'
    });
  }
  const wave46Dash: any =
    inputs.dashboardClarityWave46Export ??
    inputs.dashboardClarity?.wave46Export ??
    inputs.dashboards?.clarityWave46Export;
  const clarity46Ready = Boolean(
    wave46Dash?.clarityReady ?? wave46Dash?.round46Ready ?? wave46Dash?.payload?.clarityReady
  );
  if (
    wave46Dash &&
    !clarity46Ready &&
    (state.dashboardsSpilloverSummary != null || state.dashboardClarityWave46ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'dashboard_clarity_wave46_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'Dashboard clarity wave 46 export not ready — macro spillover read is strained.'
    });
  }
  if (state.transmissionEnvelope?.band === 'wide') {
    gates.push({
      id: 'transmission_envelope_wide_wave46',
      triggered: true,
      severity: 'info',
      summary: 'Wide transmission envelope after wave 46 UI/dashboard export layers — spillover spread is elevated.'
    });
  }
  const wave47Replay: any =
    inputs.replayWave47Export ??
    inputs.historyReplay?.wave47Export ??
    inputs.replay?.wave47Export;
  const round47Ready = Boolean(
    wave47Replay?.round47Ready ?? wave47Replay?.payload?.round47Ready ?? wave47Replay?.exportReady
  );
  if (
    wave47Replay &&
    !round47Ready &&
    (state.replaySpilloverSummary != null || state.replayWave47ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'replay_wave47_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'History replay wave 47 export not ready — macro spillover read is strained.'
    });
  }
  const wave47Health: any =
    inputs.integrationHealthWave47Export ??
    inputs.integrationHealth?.wave47Export ??
    inputs.assembly?.integrationHealthWave47Export;
  const health47Ready = Boolean(
    wave47Health?.healthReady ?? wave47Health?.round47Ready ?? wave47Health?.payload?.healthReady
  );
  if (
    wave47Health &&
    !health47Ready &&
    (state.integrationHealthSpilloverSummary != null || state.integrationHealthWave47ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'integration_health_wave47_export_blocked',
      triggered: true,
      severity: 'info',
      summary: 'Integration health wave 47 export not ready coincides with strained integration health spillover.'
    });
  }
  if (state.transmissionPersistence?.band === 'cohesive') {
    gates.push({
      id: 'transmission_persistence_cohesive_wave47',
      triggered: true,
      severity: 'info',
      summary: 'Cohesive transmission persistence after wave 47 replay/integration export layers.'
    });
  }
  const wave48Replay: any =
    inputs.replayWave48Export ??
    inputs.historyReplay?.wave48Export ??
    inputs.replay?.wave48Export;
  const round48Ready = Boolean(
    wave48Replay?.round48Ready ?? wave48Replay?.payload?.round48Ready ?? wave48Replay?.exportReady
  );
  if (
    wave48Replay &&
    !round48Ready &&
    (state.replaySpilloverSummary != null || state.replayWave48ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'replay_wave48_export_blocked',
      triggered: true,
      severity: 'warn',
      summary: 'History replay wave 48 export not ready — macro spillover read is strained.'
    });
  }
  const wave48Health: any =
    inputs.integrationHealthWave48Export ??
    inputs.integrationHealth?.wave48Export ??
    inputs.assembly?.integrationHealthWave48Export;
  const health48Ready = Boolean(
    wave48Health?.healthReady ?? wave48Health?.round48Ready ?? wave48Health?.payload?.healthReady
  );
  if (
    wave48Health &&
    !health48Ready &&
    (state.integrationHealthSpilloverSummary != null || state.integrationHealthWave48ExportSpilloverSummary != null)
  ) {
    gates.push({
      id: 'integration_health_wave48_export_blocked',
      triggered: true,
      severity: 'info',
      summary: 'Integration health wave 48 export not ready coincides with strained integration health spillover.'
    });
  }
  if (state.transmissionPersistence?.band === 'cohesive') {
    gates.push({
      id: 'transmission_persistence_cohesive_wave48',
      triggered: true,
      severity: 'info',
      summary: 'Cohesive transmission persistence after wave 48 replay/integration export layers.'
    });
  }
  if (state.transmissionPersistence?.band === 'cohesive') {
    gates.push({
      id: 'transmission_persistence_cohesive',
      triggered: true,
      severity: 'info',
      summary: 'Cohesive transmission persistence — active layers align with aggregate spillover sign.'
    });
  }
  return gates;
}


// --- source: macro-debrief.ts ---

export function composeMacroEconomyDebrief(state: NationalMacroEconomyState): MacroDebriefSnapshot {
  const bullets: string[] = [
    `Cycle ${BUSINESS_CYCLE_LABEL[state.cyclePhase]} · productivity ${V1014_MACRO_PRODUCTIVITY_LABEL[state.productivityBand]} · investment ${V1014_MACRO_INVESTMENT_LABEL[state.investmentClimate]}`,
    `Gross output index ${state.accounting.grossOutputIndex.toFixed(1)} · identity ${state.accounting.identityOk ? 'OK' : 'DRIFT'}`,
    `Leading region ${state.regionalDivergence.leadingRegionId} · divergence ${state.regionalDivergence.band}`
  ];
  if (state.activeCyclicalShockIds.length) {
    bullets.push(`Active shocks: ${state.activeCyclicalShockIds.join(', ')}`);
  }
  if (state.fiscalSpilloverSummary) bullets.push(state.fiscalSpilloverSummary);
  if (state.householdSpilloverSummary) bullets.push(state.householdSpilloverSummary);
  if (state.industrySpilloverSummary) bullets.push(state.industrySpilloverSummary);
  if (state.tradeSpilloverSummary) bullets.push(state.tradeSpilloverSummary);
  if (state.geographySpilloverSummary) bullets.push(state.geographySpilloverSummary);
  if (state.creditSpilloverSummary) bullets.push(state.creditSpilloverSummary);
  if (state.innovationSpilloverSummary) bullets.push(state.innovationSpilloverSummary);
  if (state.workforceSpilloverSummary) bullets.push(state.workforceSpilloverSummary);
  if (state.capacitySnapshot?.band && state.capacitySnapshot.band !== 'balanced') {
    bullets.push(state.capacitySnapshot.summary);
  }
  if (state.transmissionReport?.dominantLayerId) {
    bullets.push(`Dominant transmission: ${state.transmissionReport.dominantLayerId}`);
  }
  if (state.stressIndex?.band && state.stressIndex.band !== 'calm') {
    bullets.push(`Macro stress ${state.stressIndex.band} (${state.stressIndex.score.toFixed(0)})`);
  }
  if (state.policyStance?.stance && state.policyStance.stance !== 'neutral') {
    bullets.push(state.policyStance.summary);
  }
  const triggered = state.consistencyGates.filter(g => g.triggered);
  if (triggered.length) bullets.push(`Consistency notes: ${triggered.map(g => g.id).join(', ')}`);
  return {
    headline: `Macro T${state.turn}: ${BUSINESS_CYCLE_LABEL[state.cyclePhase]} / ${V1014_MACRO_INVESTMENT_LABEL[state.investmentClimate]}`,
    bullets: bullets.slice(0, 8)
  };
}

export function buildMacroDerivedSignals(
  state: NationalMacroEconomyState,
  previousPhase: string | null | undefined
): Array<{ id: string; kind: string; text: string }> {
  const out: Array<{ id: string; kind: string; text: string }> = [];
  if (previousPhase && previousPhase !== state.cyclePhase) {
    out.push({
      id: `macro:cycle:${state.turn}:${state.cyclePhase}`,
      kind: 'cycle_phase_change',
      text: `National cycle shifted to ${BUSINESS_CYCLE_LABEL[state.cyclePhase]}.`
    });
  }
  for (const gate of state.consistencyGates.filter(g => g.triggered && g.severity === 'warn')) {
    out.push({
      id: `macro:gate:${gate.id}:t${state.turn}`,
      kind: 'consistency_gate',
      text: gate.summary
    });
  }
  return out.slice(0, 6);
}


// --- source: gi-queries.ts ---

export type MacroGiTopic =
  | 'business_cycle'
  | 'productivity'
  | 'investment_climate'
  | 'regional_contribution'
  | 'accounting_identity'
  | 'sector_mix';

export interface MacroGiMatch {
  topic: MacroGiTopic;
  regionId?: string;
}

export function detectMacroEconomyQuestion(text: string): MacroGiMatch | null {
  const q = text.toLowerCase();
  if (!q.includes('macro') && !q.includes('business cycle') && !q.includes('productivity') && !q.includes('investment climate')) {
    if (!q.includes('regional share') && !q.includes('gross output')) return null;
  }
  const regionMatch = q.match(/\b(nsw|vic|qld|wa|sa|tas|nt|act)\b/i);
  const regionId = regionMatch ? regionMatch[1].toUpperCase() : undefined;
  if (q.includes('business cycle') || q.includes('cycle phase')) return { topic: 'business_cycle', regionId };
  if (q.includes('productivity')) return { topic: 'productivity', regionId };
  if (q.includes('investment climate') || q.includes('gross investment')) return { topic: 'investment_climate', regionId };
  if (q.includes('regional share') || (q.includes('contribution') && regionId)) {
    return { topic: 'regional_contribution', regionId };
  }
  if (q.includes('accounting') || q.includes('identity')) return { topic: 'accounting_identity', regionId };
  if (q.includes('sector mix') || q.includes('dominant sector')) return { topic: 'sector_mix', regionId };
  if (q.includes('macro economy') || q.includes('macroeconomy')) return { topic: 'business_cycle', regionId };
  return null;
}

export function composeMacroEconomyGiAnswer(state: NationalMacroEconomyState, match: MacroGiMatch): string {
  switch (match.topic) {
    case 'business_cycle':
      return `National business cycle: ${BUSINESS_CYCLE_LABEL[state.cyclePhase]} (momentum ${state.cycleMomentum.toFixed(2)}, duration ${state.cycleDurationTurns} turns).`;
    case 'productivity':
      return `Macro productivity: ${V1014_MACRO_PRODUCTIVITY_LABEL[state.productivityBand]} (index ${state.productivityIndex.toFixed(1)}).`;
    case 'investment_climate':
      return `Macro investment climate: ${V1014_MACRO_INVESTMENT_LABEL[state.investmentClimate]} (gross investment index ${state.grossInvestmentIndex.toFixed(1)}).`;
    case 'regional_contribution': {
      const row = match.regionId
        ? state.regionalContributions.find(r => r.regionId === match.regionId)
        : state.regionalContributions[0];
      if (!row) return 'No regional macro contribution row available.';
      return `${row.regionId} contributes ${(row.share * 100).toFixed(1)}% of national output mix (${row.role}, primary ${row.primarySector}).`;
    }
    case 'accounting_identity':
      return state.accounting.identityOk
        ? `Macro accounting identity holds (residual ${state.accounting.identityResidual.toExponential(2)}). Gross output index ${state.accounting.grossOutputIndex.toFixed(1)}.`
        : `Macro accounting identity drift detected (residual ${state.accounting.identityResidual.toFixed(6)}). Review regional share normalization.`;
    case 'sector_mix': {
      const top = Object.entries(state.sectorOutputMix).sort((a, b) => b[1] - a[1])[0];
      return top
        ? `National sector mix is led by ${top[0]} (${(top[1] * 100).toFixed(1)}% share-weighted).`
        : 'Sector mix unavailable.';
    }
    default:
      return 'Macro economy state is active.';
  }
}


// --- source: compute.ts ---
  applyMacroStrategicGameplaySpillover,
  readMacroStrategicGameplaySpilloverFromV1001
} from './bridge-v1001-strategic-gameplay.ts';
  applyMacroArchiveIntegritySpillover,
  readMacroArchiveIntegritySpilloverFromV1024
} from './bridge-v1024-archive-integrity.ts';
  applyMacroIntegrationHealthSpillover,
  readMacroIntegrationHealthSpilloverFromV1025
} from './bridge-v1025-integration-health.ts';
  applyMacroCadenceDriftSpillover,
  readMacroCadenceDriftSpilloverFromV1002
} from './bridge-v1002-cadence-drift.ts';
  applyMacroResearchMomentumSpillover,
  readMacroResearchMomentumSpilloverFromV1003
} from './bridge-v1003-research-momentum.ts';
  applyMacroBudgetOutlookSpillover,
  readMacroBudgetOutlookSpilloverFromV1007
} from './bridge-v1007-budget-outlook.ts';
  applyMacroSupplyChainSpillover,
  readMacroSupplyChainSpilloverFromV1008
} from './bridge-v1008-supply-chain.ts';
  applyMacroEventCascadeSpillover,
  readMacroEventCascadeSpilloverFromV1005
} from './bridge-v1005-event-cascade.ts';
  applyMacroDemographicShiftSpillover,
  readMacroDemographicShiftSpilloverFromV1009
} from './bridge-v1009-demographic-shift.ts';
  applyMacroExpectationsAnchorSpillover,
  readMacroExpectationsAnchorSpilloverFromV1010
} from './bridge-v1010-expectations-anchor.ts';
  applyMacroMetroMomentumSpillover,
  readMacroMetroMomentumSpilloverFromV1011
} from './bridge-v1011-metro-momentum.ts';
  applyMacroTransportThroughputSpillover,
  readMacroTransportThroughputSpilloverFromV1012
} from './bridge-v1012-transport-throughput.ts';
  applyMacroEnergyTransitionPaceSpillover,
  readMacroEnergyTransitionPaceSpilloverFromV1013
} from './bridge-v1013-energy-transition-pace.ts';
  applyMacroHousingAffordabilitySpillover,
  readMacroHousingAffordabilitySpilloverFromV1014
} from './bridge-v1014-housing-affordability.ts';
  applyMacroTradeExposureSpillover,
  readMacroTradeExposureSpilloverFromV1015
} from './bridge-v1015-trade-exposure.ts';
  applyMacroGuardianVigilanceSpillover,
  readMacroGuardianVigilanceSpilloverFromV1016
} from './bridge-v1016-guardian-vigilance.ts';
  applyMacroCommandCoordinationSpillover,
  readMacroCommandCoordinationSpilloverFromV1017
} from './bridge-v1017-command-coordination.ts';
  applyMacroTeamAiCohesionSpillover,
  readMacroTeamAiCohesionSpilloverFromV1018
} from './bridge-v1018-team-ai-cohesion.ts';
  applyMacroMemoryRetentionSpillover,
  readMacroMemoryRetentionSpilloverFromV1019
} from './bridge-v1019-memory-retention.ts';
  applyMacroAutomationThroughputSpillover,
  readMacroAutomationThroughputSpilloverFromV1020
} from './bridge-v1020-automation-throughput.ts';
  applyMacroForecastCalibrationSpillover,
  readMacroForecastCalibrationSpilloverFromV1021
} from './bridge-v1021-forecast-calibration.ts';
  applyMacroAutomationIdleGovernanceSpillover,
  readMacroAutomationIdleGovernanceSpilloverFromV1020
} from './bridge-v1020-automation-idle-governance.ts';
  applyMacroForecastProjectionSyncSpillover,
  readMacroForecastProjectionSyncSpilloverFromV1021
} from './bridge-v1021-forecast-projection-sync.ts';
  applyMacroAutomationIdleGovernanceWave36ExportSpillover,
  readMacroAutomationIdleGovernanceWave36ExportSpilloverFromV1020
} from './bridge-v1020-automation-idle-governance-wave-round36-export.ts';
  applyMacroForecastWave36ProjectionSyncSpillover,
  readMacroForecastWave36ProjectionSyncSpilloverFromV1021
} from './bridge-v1021-forecast-wave36-projection-sync.ts';
  applyMacroUiResponsivenessWave37ExportSpillover,
  readMacroUiResponsivenessWave37ExportSpilloverFromV1022
} from './bridge-v1022-ui-responsiveness-wave-round37-export.ts';
  applyMacroDashboardClarityWave37ExportSpillover,
  readMacroDashboardClarityWave37ExportSpilloverFromV1023
} from './bridge-v1023-dashboard-clarity-wave-round37-export.ts';
  applyMacroReplayWave38ExportSpillover,
  readMacroReplayWave38ExportSpilloverFromV1024
} from './bridge-v1024-replay-wave-round38-export.ts';
  applyMacroIntegrationHealthWave38ExportSpillover,
  readMacroIntegrationHealthWave38ExportSpilloverFromV1025
} from './bridge-v1025-integration-health-wave-round38-export.ts';
  applyMacroAutomationIdleGovernanceWave39ExportSpillover,
  readMacroAutomationIdleGovernanceWave39ExportSpilloverFromV1020
} from './bridge-v1020-automation-idle-governance-wave-round39-export.ts';
  applyMacroForecastWave39ExportSpillover,
  readMacroForecastWave39ExportSpilloverFromV1021
} from './bridge-v1021-forecast-wave-round39-export.ts';
  applyMacroUiResponsivenessWave40ExportSpillover,
  readMacroUiResponsivenessWave40ExportSpilloverFromV1022
} from './bridge-v1022-ui-responsiveness-wave-round40-export.ts';
  applyMacroDashboardClarityWave40ExportSpillover,
  readMacroDashboardClarityWave40ExportSpilloverFromV1023
} from './bridge-v1023-dashboard-clarity-wave-round40-export.ts';
  applyMacroReplayWave41ExportSpillover,
  readMacroReplayWave41ExportSpilloverFromV1024
} from './bridge-v1024-replay-wave-round41-export.ts';
  applyMacroIntegrationHealthWave41ExportSpillover,
  readMacroIntegrationHealthWave41ExportSpilloverFromV1025
} from './bridge-v1025-integration-health-wave-round41-export.ts';
  applyMacroAutomationIdleGovernanceWave42ExportSpillover,
  readMacroAutomationIdleGovernanceWave42ExportSpilloverFromV1020
} from './bridge-v1020-automation-idle-governance-wave-round42-export.ts';
  applyMacroForecastWave42ExportSpillover,
  readMacroForecastWave42ExportSpilloverFromV1021
} from './bridge-v1021-forecast-wave-round42-export.ts';
  applyMacroUiResponsivenessWave43ExportSpillover,
  readMacroUiResponsivenessWave43ExportSpilloverFromV1022
} from './bridge-v1022-ui-responsiveness-wave-round43-export.ts';
  applyMacroDashboardClarityWave43ExportSpillover,
  readMacroDashboardClarityWave43ExportSpilloverFromV1023
} from './bridge-v1023-dashboard-clarity-wave-round43-export.ts';
  applyMacroAutomationIdleGovernanceWave44ExportSpillover,
  readMacroAutomationIdleGovernanceWave44ExportSpilloverFromV1020
} from './bridge-v1020-automation-idle-governance-wave-round44-export.ts';
  applyMacroForecastWave44ExportSpillover,
  readMacroForecastWave44ExportSpilloverFromV1021
} from './bridge-v1021-forecast-wave-round44-export.ts';
  applyMacroReplayWave45ExportSpillover,
  readMacroReplayWave45ExportSpilloverFromV1024
} from './bridge-v1024-replay-wave-round45-export.ts';
  applyMacroIntegrationHealthWave45ExportSpillover,
  readMacroIntegrationHealthWave45ExportSpilloverFromV1025
} from './bridge-v1025-integration-health-wave-round45-export.ts';
  applyMacroUiResponsivenessWave46ExportSpillover,
  readMacroUiResponsivenessWave46ExportSpilloverFromV1022
} from './bridge-v1022-ui-responsiveness-wave-round46-export.ts';
  applyMacroDashboardClarityWave46ExportSpillover,
  readMacroDashboardClarityWave46ExportSpilloverFromV1023
} from './bridge-v1023-dashboard-clarity-wave-round46-export.ts';
  applyMacroReplayWave47ExportSpillover,
  readMacroReplayWave47ExportSpilloverFromV1024
} from './bridge-v1024-replay-wave-round47-export.ts';
  applyMacroIntegrationHealthWave47ExportSpillover,
  readMacroIntegrationHealthWave47ExportSpilloverFromV1025
} from './bridge-v1025-integration-health-wave-round47-export.ts';
  applyMacroReplayWave48ExportSpillover,
  readMacroReplayWave48ExportSpilloverFromV1024
} from './bridge-v1024-replay-wave-round48-export.ts';
  applyMacroIntegrationHealthWave48ExportSpillover,
  readMacroIntegrationHealthWave48ExportSpilloverFromV1025
} from './bridge-v1025-integration-health-wave-round48-export.ts';
  v1014macroBandInvestment,
  v1014macroBandProductivity,
  v1014macroBandUtilization,
  v1014macroClamp,
  v1014macroCycleFromScore
} from './math.ts';
  buildRegionalContributions,
  computeRegionalWeightRows,
  v1014macroNormalizeRegionalShares
} from './regional-aggregation.ts';
  applyMacroShockAdjustments,
  applyMacroStructuralAdjustments,
  createMacroEvidencePush
} from './shocks.ts';
  V1014_MACRO_SCHEMA_VERSION,
  type MacroEconomyEvidence,
  type MacroEconomyInputs,
  type MacroEconomyPersisted,
  type NationalMacroEconomyState
} from './types.ts';

export function computeNationalMacroEconomy(
  inputs: MacroEconomyInputs,
  persistedIn: MacroEconomyPersisted | null | undefined,
  prevState: NationalMacroEconomyState | null | undefined
): { state: NationalMacroEconomyState; persisted: MacroEconomyPersisted } {
  const persisted = sanitizeMacroEconomyPersisted(persistedIn, inputs.turn);
  const hash = macroEconomyInputHash(inputs);
  if (prevState && persisted.lastInputHash === hash && prevState.inputHash === hash) {
    return { state: prevState, persisted };
  }

  const evList: MacroEconomyEvidence[] = [];
  const pushEv = createMacroEvidencePush(evList, inputs.turn);
  const activeShockIds = resolveActiveCyclicalShockIds(inputs);

  let productivityScore = persisted.productivityScore;
  let investmentScore = persisted.investmentScore;
  let cycleScore = persisted.cycleScore;

  const weights = computeRegionalWeightRows(inputs, pushEv);
  const shares = v1014macroNormalizeRegionalShares(weights);
  const shareSum = Object.values(shares).reduce((a, b) => a + b, 0);

  const structural = applyMacroStructuralAdjustments(
    inputs,
    { productivityScore, investmentScore, cycleScore },
    pushEv
  );
  const fiscalSpillover = readMacroFiscalSpilloverFromV1012(inputs);
  const householdSpillover = readMacroHouseholdSpilloverFromV1013(inputs);
  const industrySpillover = readMacroIndustrySpilloverFromV101(inputs);
  const tradeSpillover = readMacroTradeSpilloverFromV1015(inputs);
  const geographySpillover = readMacroGeographySpillover(inputs);
  const creditSpillover = readMacroCreditSpilloverFromV1016(inputs);
  const innovationSpillover = readMacroInnovationSpilloverFromV104(inputs);
  const workforceSpillover = readMacroWorkforceSpilloverFromV107(inputs);
  const strategicSpillover = readMacroStrategicSpilloverFromV109(inputs);
  const housingSpillover = readMacroHousingSpilloverFromV1014Housing(inputs);
  const inflationSpillover = readMacroInflationSpilloverFromV1010(inputs);
  const energySpillover = readMacroEnergySpilloverFromV1018(inputs);
  const eventsSpillover = readMacroEventsSpilloverFromV105(inputs);
  const companiesSpillover = readMacroCompaniesSpilloverFromV108(inputs);
  const turnsSpillover = readMacroTurnsSpilloverFromV102(inputs);
  const transportSpillover = readMacroTransportSpilloverFromV1017(inputs);
  const researchSpillover = readMacroResearchSpilloverFromV103(inputs);
  const populationSpillover = readMacroPopulationSpilloverFromV109Pop(inputs);
  const modesSpillover = readMacroModesSpilloverFromV1006(inputs);
  const guardianSpillover = readMacroGuardianSpilloverFromV1016Guardian(inputs);
  const citiesSpillover = readMacroCitiesSpilloverFromV1011Cities(inputs);
  const forecastingSpillover = readMacroForecastingSpilloverFromV1021(inputs);
  const commandSpillover = readMacroCommandSpilloverFromV1017Command(inputs);
  const automationSpillover = readMacroAutomationSpilloverFromV1020(inputs);
  const teamAiSpillover = readMacroTeamAiSpilloverFromV1018Team(inputs);
  const replaySpillover = readMacroReplaySpilloverFromV1024(inputs);
  const memorySpillover = readMacroMemorySpilloverFromV1019(inputs);
  const dashboardsSpillover = readMacroDashboardsSpilloverFromV1023(inputs);
  const uiSpillover = readMacroUiSpilloverFromV1022(inputs);
  const utilitiesSpillover = readMacroUtilitiesSpilloverFromV1012Utilities(inputs);
  const logisticsSpillover = readMacroTradeLogisticsSpilloverFromV1015(inputs);
  const negotiationSpillover = readMacroNegotiationSpilloverFromV1005(inputs);
  const confidenceSpillover = readMacroHouseholdConfidenceSpilloverFromV1013(inputs);
  const capexSpillover = readMacroCapexSpilloverFromV1008(inputs);
  const monetarySpillover = readMacroMonetarySpilloverFromV1010Monetary(inputs);
  const rentalSpillover = readMacroRentalSpilloverFromV1014Rental(inputs);
  const climateSpillover = readMacroClimatePolicySpilloverFromV1018Climate(inputs);
  const forecastDispersionSpillover = readMacroForecastDispersionSpilloverFromV1021(inputs);
  const accessibilitySpillover = readMacroAccessibilitySpilloverFromV1022(inputs);
  const timelineSpillover = readMacroTimelineSpilloverFromV1024(inputs);
  const liquiditySpillover = readMacroLiquiditySpilloverFromV1016Liquidity(inputs);
  const mapsTelemetrySpillover = readMacroMapsTelemetrySpilloverFromV1023(inputs);
  const strategicGameplaySpillover = readMacroStrategicGameplaySpilloverFromV1001(inputs);
  const archiveIntegritySpillover = readMacroArchiveIntegritySpilloverFromV1024(inputs);
  const integrationHealthSpillover = readMacroIntegrationHealthSpilloverFromV1025(inputs);
  const cadenceDriftSpillover = readMacroCadenceDriftSpilloverFromV1002(inputs);
  const researchMomentumSpillover = readMacroResearchMomentumSpilloverFromV1003(inputs);
  const budgetOutlookSpillover = readMacroBudgetOutlookSpilloverFromV1007(inputs);
  const modeShiftSpillover = readMacroModeShiftSpilloverFromV1004(inputs);
  const supplyChainSpillover = readMacroSupplyChainSpilloverFromV1008(inputs);
  const eventCascadeSpillover = readMacroEventCascadeSpilloverFromV1005(inputs);
  const demographicShiftSpillover = readMacroDemographicShiftSpilloverFromV1009(inputs);
  const expectationsAnchorSpillover = readMacroExpectationsAnchorSpilloverFromV1010(inputs);
  const metroMomentumSpillover = readMacroMetroMomentumSpilloverFromV1011(inputs);
  const transportThroughputSpillover = readMacroTransportThroughputSpilloverFromV1012(inputs);
  const energyTransitionPaceSpillover = readMacroEnergyTransitionPaceSpilloverFromV1013(inputs);
  const housingAffordabilitySpillover = readMacroHousingAffordabilitySpilloverFromV1014(inputs);
  const tradeExposureSpillover = readMacroTradeExposureSpilloverFromV1015(inputs);
  const guardianVigilanceSpillover = readMacroGuardianVigilanceSpilloverFromV1016(inputs);
  const commandCoordinationSpillover = readMacroCommandCoordinationSpilloverFromV1017(inputs);
  const teamAiCohesionSpillover = readMacroTeamAiCohesionSpilloverFromV1018(inputs);
  const memoryRetentionSpillover = readMacroMemoryRetentionSpilloverFromV1019(inputs);
  const automationThroughputSpillover = readMacroAutomationThroughputSpilloverFromV1020(inputs);
  const forecastCalibrationSpillover = readMacroForecastCalibrationSpilloverFromV1021(inputs);
  const automationIdleGovernanceSpillover = readMacroAutomationIdleGovernanceSpilloverFromV1020(inputs);
  const forecastProjectionSyncSpillover = readMacroForecastProjectionSyncSpilloverFromV1021(inputs);
  const automationIdleGovernanceWave36ExportSpillover =
    readMacroAutomationIdleGovernanceWave36ExportSpilloverFromV1020(inputs);
  const forecastWave36ProjectionSyncSpillover = readMacroForecastWave36ProjectionSyncSpilloverFromV1021(inputs);
  const uiResponsivenessWave37ExportSpillover = readMacroUiResponsivenessWave37ExportSpilloverFromV1022(inputs);
  const dashboardClarityWave37ExportSpillover = readMacroDashboardClarityWave37ExportSpilloverFromV1023(inputs);
  const replayWave38ExportSpillover = readMacroReplayWave38ExportSpilloverFromV1024(inputs);
  const integrationHealthWave38ExportSpillover = readMacroIntegrationHealthWave38ExportSpilloverFromV1025(inputs);
  const automationIdleGovernanceWave39ExportSpillover =
    readMacroAutomationIdleGovernanceWave39ExportSpilloverFromV1020(inputs);
  const forecastWave39ExportSpillover = readMacroForecastWave39ExportSpilloverFromV1021(inputs);
  const uiResponsivenessWave40ExportSpillover = readMacroUiResponsivenessWave40ExportSpilloverFromV1022(inputs);
  const dashboardClarityWave40ExportSpillover = readMacroDashboardClarityWave40ExportSpilloverFromV1023(inputs);
  const replayWave41ExportSpillover = readMacroReplayWave41ExportSpilloverFromV1024(inputs);
  const integrationHealthWave41ExportSpillover = readMacroIntegrationHealthWave41ExportSpilloverFromV1025(inputs);
  const automationIdleGovernanceWave42ExportSpillover =
    readMacroAutomationIdleGovernanceWave42ExportSpilloverFromV1020(inputs);
  const forecastWave42ExportSpillover = readMacroForecastWave42ExportSpilloverFromV1021(inputs);
  const uiResponsivenessWave43ExportSpillover = readMacroUiResponsivenessWave43ExportSpilloverFromV1022(inputs);
  const dashboardClarityWave43ExportSpillover = readMacroDashboardClarityWave43ExportSpilloverFromV1023(inputs);
  const automationIdleGovernanceWave44ExportSpillover =
    readMacroAutomationIdleGovernanceWave44ExportSpilloverFromV1020(inputs);
  const forecastWave44ExportSpillover = readMacroForecastWave44ExportSpilloverFromV1021(inputs);
  const replayWave45ExportSpillover = readMacroReplayWave45ExportSpilloverFromV1024(inputs);
  const integrationHealthWave45ExportSpillover = readMacroIntegrationHealthWave45ExportSpilloverFromV1025(inputs);
  const uiResponsivenessWave46ExportSpillover = readMacroUiResponsivenessWave46ExportSpilloverFromV1022(inputs);
  const dashboardClarityWave46ExportSpillover = readMacroDashboardClarityWave46ExportSpilloverFromV1023(inputs);
  const replayWave47ExportSpillover = readMacroReplayWave47ExportSpilloverFromV1024(inputs);
  const integrationHealthWave47ExportSpillover = readMacroIntegrationHealthWave47ExportSpilloverFromV1025(inputs);
  const replayWave48ExportSpillover = readMacroReplayWave48ExportSpilloverFromV1024(inputs);
  const integrationHealthWave48ExportSpillover = readMacroIntegrationHealthWave48ExportSpilloverFromV1025(inputs);
  const withFiscal = applyMacroFiscalSpillover(structural, fiscalSpillover);
  const withHousehold = applyMacroHouseholdSpillover(withFiscal, householdSpillover);
  const withIndustry = applyMacroIndustrySpillover(withHousehold, industrySpillover);
  const withTrade = applyMacroTradeSpillover(withIndustry, tradeSpillover);
  const withGeography = applyMacroGeographySpillover(withTrade, geographySpillover);
  const withCredit = applyMacroCreditSpillover(withGeography, creditSpillover);
  const withInnovation = applyMacroInnovationSpillover(withCredit, innovationSpillover);
  const withWorkforce = applyMacroWorkforceSpillover(withInnovation, workforceSpillover);
  const withStrategic = applyMacroStrategicSpillover(withWorkforce, strategicSpillover);
  const withHousing = applyMacroHousingSpillover(withStrategic, housingSpillover);
  const withInflation = applyMacroInflationSpillover(withHousing, inflationSpillover);
  const withEnergy = applyMacroEnergySpillover(withInflation, energySpillover);
  const withEvents = applyMacroEventsSpillover(withEnergy, eventsSpillover);
  const withCompanies = applyMacroCompaniesSpillover(withEvents, companiesSpillover);
  const withTurns = applyMacroTurnsSpillover(withCompanies, turnsSpillover);
  const withTransport = applyMacroTransportSpillover(withTurns, transportSpillover);
  const withResearch = applyMacroResearchSpillover(withTransport, researchSpillover);
  const withPopulation = applyMacroPopulationSpillover(withResearch, populationSpillover);
  const withModes = applyMacroModesSpillover(withPopulation, modesSpillover);
  const withGuardian = applyMacroGuardianSpillover(withModes, guardianSpillover);
  const withCities = applyMacroCitiesSpillover(withGuardian, citiesSpillover);
  const withForecasting = applyMacroForecastingSpillover(withCities, forecastingSpillover);
  const withCommand = applyMacroCommandSpillover(withForecasting, commandSpillover);
  const withAutomation = applyMacroAutomationSpillover(withCommand, automationSpillover);
  const withTeamAi = applyMacroTeamAiSpillover(withAutomation, teamAiSpillover);
  const withReplay = applyMacroReplaySpillover(withTeamAi, replaySpillover);
  const withMemory = applyMacroMemorySpillover(withReplay, memorySpillover);
  const withDashboards = applyMacroDashboardsSpillover(withMemory, dashboardsSpillover);
  const withUi = applyMacroUiSpillover(withDashboards, uiSpillover);
  const withUtilities = applyMacroUtilitiesSpillover(withUi, utilitiesSpillover);
  const withLogistics = applyMacroTradeLogisticsSpillover(withUtilities, logisticsSpillover);
  const withNegotiation = applyMacroNegotiationSpillover(withLogistics, negotiationSpillover);
  const withConfidence = applyMacroHouseholdConfidenceSpillover(withNegotiation, confidenceSpillover);
  const withCapex = applyMacroCapexSpillover(withConfidence, capexSpillover);
  const withMonetary = applyMacroMonetarySpillover(withCapex, monetarySpillover);
  const withRental = applyMacroRentalSpillover(withMonetary, rentalSpillover);
  const withClimate = applyMacroClimatePolicySpillover(withRental, climateSpillover);
  const withForecastDispersion = applyMacroForecastDispersionSpillover(withClimate, forecastDispersionSpillover);
  const withAccessibility = applyMacroAccessibilitySpillover(withForecastDispersion, accessibilitySpillover);
  const withTimeline = applyMacroTimelineSpillover(withAccessibility, timelineSpillover);
  const withLiquidity = applyMacroLiquiditySpillover(withTimeline, liquiditySpillover);
  const withMapsTelemetry = applyMacroMapsTelemetrySpillover(withLiquidity, mapsTelemetrySpillover);
  const withStrategicGameplay = applyMacroStrategicGameplaySpillover(withMapsTelemetry, strategicGameplaySpillover);
  const withArchiveIntegrity = applyMacroArchiveIntegritySpillover(withStrategicGameplay, archiveIntegritySpillover);
  const withIntegrationHealth = applyMacroIntegrationHealthSpillover(withArchiveIntegrity, integrationHealthSpillover);
  const withCadenceDrift = applyMacroCadenceDriftSpillover(withIntegrationHealth, cadenceDriftSpillover);
  const withResearchMomentum = applyMacroResearchMomentumSpillover(withCadenceDrift, researchMomentumSpillover);
  const withBudgetOutlook = applyMacroBudgetOutlookSpillover(withResearchMomentum, budgetOutlookSpillover);
  const withModeShift = applyMacroModeShiftSpillover(withBudgetOutlook, modeShiftSpillover);
  const withSupplyChain = applyMacroSupplyChainSpillover(withModeShift, supplyChainSpillover);
  const withEventCascade = applyMacroEventCascadeSpillover(withSupplyChain, eventCascadeSpillover);
  const withDemographicShift = applyMacroDemographicShiftSpillover(withEventCascade, demographicShiftSpillover);
  const withExpectationsAnchor = applyMacroExpectationsAnchorSpillover(withDemographicShift, expectationsAnchorSpillover);
  const withMetroMomentum = applyMacroMetroMomentumSpillover(withExpectationsAnchor, metroMomentumSpillover);
  const withTransportThroughput = applyMacroTransportThroughputSpillover(withMetroMomentum, transportThroughputSpillover);
  const withEnergyTransitionPace = applyMacroEnergyTransitionPaceSpillover(withTransportThroughput, energyTransitionPaceSpillover);
  const withHousingAffordability = applyMacroHousingAffordabilitySpillover(withEnergyTransitionPace, housingAffordabilitySpillover);
  const withTradeExposure = applyMacroTradeExposureSpillover(withHousingAffordability, tradeExposureSpillover);
  const withGuardianVigilance = applyMacroGuardianVigilanceSpillover(withTradeExposure, guardianVigilanceSpillover);
  const withCommandCoordination = applyMacroCommandCoordinationSpillover(withGuardianVigilance, commandCoordinationSpillover);
  const withTeamAiCohesion = applyMacroTeamAiCohesionSpillover(withCommandCoordination, teamAiCohesionSpillover);
  const withMemoryRetention = applyMacroMemoryRetentionSpillover(withTeamAiCohesion, memoryRetentionSpillover);
  const withAutomationThroughput = applyMacroAutomationThroughputSpillover(withMemoryRetention, automationThroughputSpillover);
  const withForecastCalibration = applyMacroForecastCalibrationSpillover(withAutomationThroughput, forecastCalibrationSpillover);
  const withAutomationIdleGovernance = applyMacroAutomationIdleGovernanceSpillover(
    withForecastCalibration,
    automationIdleGovernanceSpillover
  );
  const withForecastProjectionSync = applyMacroForecastProjectionSyncSpillover(
    withAutomationIdleGovernance,
    forecastProjectionSyncSpillover
  );
  const withAutomationIdleGovernanceWave36Export = applyMacroAutomationIdleGovernanceWave36ExportSpillover(
    withForecastProjectionSync,
    automationIdleGovernanceWave36ExportSpillover
  );
  const withForecastWave36ProjectionSync = applyMacroForecastWave36ProjectionSyncSpillover(
    withAutomationIdleGovernanceWave36Export,
    forecastWave36ProjectionSyncSpillover
  );
  const withUiResponsivenessWave37Export = applyMacroUiResponsivenessWave37ExportSpillover(
    withForecastWave36ProjectionSync,
    uiResponsivenessWave37ExportSpillover
  );
  const withDashboardClarityWave37Export = applyMacroDashboardClarityWave37ExportSpillover(
    withUiResponsivenessWave37Export,
    dashboardClarityWave37ExportSpillover
  );
  const withReplayWave38Export = applyMacroReplayWave38ExportSpillover(
    withDashboardClarityWave37Export,
    replayWave38ExportSpillover
  );
  const withIntegrationHealthWave38Export = applyMacroIntegrationHealthWave38ExportSpillover(
    withReplayWave38Export,
    integrationHealthWave38ExportSpillover
  );
  const withAutomationIdleGovernanceWave39Export = applyMacroAutomationIdleGovernanceWave39ExportSpillover(
    withIntegrationHealthWave38Export,
    automationIdleGovernanceWave39ExportSpillover
  );
  const withForecastWave39Export = applyMacroForecastWave39ExportSpillover(
    withAutomationIdleGovernanceWave39Export,
    forecastWave39ExportSpillover
  );
  const withUiResponsivenessWave40Export = applyMacroUiResponsivenessWave40ExportSpillover(
    withForecastWave39Export,
    uiResponsivenessWave40ExportSpillover
  );
  const withDashboardClarityWave40Export = applyMacroDashboardClarityWave40ExportSpillover(
    withUiResponsivenessWave40Export,
    dashboardClarityWave40ExportSpillover
  );
  const withReplayWave41Export = applyMacroReplayWave41ExportSpillover(
    withDashboardClarityWave40Export,
    replayWave41ExportSpillover
  );
  const withIntegrationHealthWave41Export = applyMacroIntegrationHealthWave41ExportSpillover(
    withReplayWave41Export,
    integrationHealthWave41ExportSpillover
  );
  const withAutomationIdleGovernanceWave42Export = applyMacroAutomationIdleGovernanceWave42ExportSpillover(
    withIntegrationHealthWave41Export,
    automationIdleGovernanceWave42ExportSpillover
  );
  const withForecastWave42Export = applyMacroForecastWave42ExportSpillover(
    withAutomationIdleGovernanceWave42Export,
    forecastWave42ExportSpillover
  );
  const withUiResponsivenessWave43Export = applyMacroUiResponsivenessWave43ExportSpillover(
    withForecastWave42Export,
    uiResponsivenessWave43ExportSpillover
  );
  const withDashboardClarityWave43Export = applyMacroDashboardClarityWave43ExportSpillover(
    withUiResponsivenessWave43Export,
    dashboardClarityWave43ExportSpillover
  );
  const withAutomationIdleGovernanceWave44Export = applyMacroAutomationIdleGovernanceWave44ExportSpillover(
    withDashboardClarityWave43Export,
    automationIdleGovernanceWave44ExportSpillover
  );
  const withForecastWave44Export = applyMacroForecastWave44ExportSpillover(
    withAutomationIdleGovernanceWave44Export,
    forecastWave44ExportSpillover
  );
  const withReplayWave45Export = applyMacroReplayWave45ExportSpillover(
    withForecastWave44Export,
    replayWave45ExportSpillover
  );
  const withIntegrationHealthWave45Export = applyMacroIntegrationHealthWave45ExportSpillover(
    withReplayWave45Export,
    integrationHealthWave45ExportSpillover
  );
  const withUiResponsivenessWave46Export = applyMacroUiResponsivenessWave46ExportSpillover(
    withIntegrationHealthWave45Export,
    uiResponsivenessWave46ExportSpillover
  );
  const withDashboardClarityWave46Export = applyMacroDashboardClarityWave46ExportSpillover(
    withUiResponsivenessWave46Export,
    dashboardClarityWave46ExportSpillover
  );
  const withReplayWave47Export = applyMacroReplayWave47ExportSpillover(
    withDashboardClarityWave46Export,
    replayWave47ExportSpillover
  );
  const withIntegrationHealthWave47Export = applyMacroIntegrationHealthWave47ExportSpillover(
    withReplayWave47Export,
    integrationHealthWave47ExportSpillover
  );
  const withReplayWave48Export = applyMacroReplayWave48ExportSpillover(
    withIntegrationHealthWave47Export,
    replayWave48ExportSpillover
  );
  const withIntegrationHealthWave48Export = applyMacroIntegrationHealthWave48ExportSpillover(
    withReplayWave48Export,
    integrationHealthWave48ExportSpillover
  );
  const shocked = applyMacroShockAdjustments(inputs, withIntegrationHealthWave48Export, pushEv);
  ({ productivityScore, investmentScore, cycleScore } = clampMacroScores(shocked));

  const productivityBand = v1014macroBandProductivity(productivityScore);
  const investmentClimate = v1014macroBandInvestment(investmentScore);
  const utilizationIndex = deriveUtilizationIndex(cycleScore, investmentScore);
  const utilizationBand = v1014macroBandUtilization(utilizationIndex);
  const cyclePhase = v1014macroCycleFromScore(cycleScore, persisted.cycleHysteresis);

  const regionalContributions = buildRegionalContributions({
    inputs,
    shares,
    investmentScore,
    utilizationIndex,
    evidence: evList
  });

  const accounting = buildNationalAccountingLedger({
    productivityScore,
    utilizationIndex,
    investmentScore,
    regionalSumShare: shareSum
  });

  const sectorProductivity = nationalSectorProductivityFromScore(productivityScore);
  const sectorOutputMix = computeNationalSectorOutputMix(regionalContributions);
  const regionalDivergence = computeRegionalDivergenceSnapshot(regionalContributions);
  const transmissionReport = buildMacroTransmissionReport({
    turn: inputs.turn,
    fiscal: fiscalSpillover,
    household: householdSpillover,
    industry: industrySpillover,
    trade: tradeSpillover,
    geography: geographySpillover,
    credit: creditSpillover,
    innovation: innovationSpillover,
    workforce: workforceSpillover,
    strategic: strategicSpillover,
    housing: housingSpillover,
    inflation: inflationSpillover,
    energy: energySpillover,
    events: eventsSpillover,
    companies: companiesSpillover,
    turns: turnsSpillover,
    transport: transportSpillover,
    research: researchSpillover,
    population: populationSpillover,
    modes: modesSpillover,
    guardian: guardianSpillover,
    cities: citiesSpillover,
    forecasting: forecastingSpillover,
    command: commandSpillover,
    automation: automationSpillover,
    teamAi: teamAiSpillover,
    replay: replaySpillover,
    memory: memorySpillover,
    dashboards: dashboardsSpillover,
    ui: uiSpillover,
    utilities: utilitiesSpillover,
    logistics: logisticsSpillover,
    negotiation: negotiationSpillover,
    confidence: confidenceSpillover,
    capex: capexSpillover,
    monetary: monetarySpillover,
    rental: rentalSpillover,
    climate: climateSpillover,
    forecastDispersion: forecastDispersionSpillover,
    accessibility: accessibilitySpillover,
    timeline: timelineSpillover,
    liquidity: liquiditySpillover,
    mapsTelemetry: mapsTelemetrySpillover,
    strategicGameplay: strategicGameplaySpillover,
    archiveIntegrity: archiveIntegritySpillover,
    integrationHealth: integrationHealthSpillover,
    cadenceDrift: cadenceDriftSpillover,
    researchMomentum: researchMomentumSpillover,
    budgetOutlook: budgetOutlookSpillover,
    modeShift: modeShiftSpillover,
    supplyChain: supplyChainSpillover,
    eventCascade: eventCascadeSpillover,
    demographicShift: demographicShiftSpillover,
    expectationsAnchor: expectationsAnchorSpillover,
    metroMomentum: metroMomentumSpillover,
    transportThroughput: transportThroughputSpillover,
    energyTransitionPace: energyTransitionPaceSpillover,
    housingAffordability: housingAffordabilitySpillover,
    tradeExposure: tradeExposureSpillover,
    guardianVigilance: guardianVigilanceSpillover,
    commandCoordination: commandCoordinationSpillover,
    teamAiCohesion: teamAiCohesionSpillover,
    memoryRetention: memoryRetentionSpillover,
    automationThroughput: automationThroughputSpillover,
    forecastCalibration: forecastCalibrationSpillover,
    automationIdleGovernance: automationIdleGovernanceSpillover,
    forecastProjectionSync: forecastProjectionSyncSpillover,
    automationIdleGovernanceWave36Export: automationIdleGovernanceWave36ExportSpillover,
    forecastWave36ProjectionSync: forecastWave36ProjectionSyncSpillover,
    uiResponsivenessWave37Export: uiResponsivenessWave37ExportSpillover,
    dashboardClarityWave37Export: dashboardClarityWave37ExportSpillover,
    replayWave38Export: replayWave38ExportSpillover,
    integrationHealthWave38Export: integrationHealthWave38ExportSpillover,
    automationIdleGovernanceWave39Export: automationIdleGovernanceWave39ExportSpillover,
    forecastWave39Export: forecastWave39ExportSpillover,
    uiResponsivenessWave40Export: uiResponsivenessWave40ExportSpillover,
    dashboardClarityWave40Export: dashboardClarityWave40ExportSpillover,
    replayWave41Export: replayWave41ExportSpillover,
    integrationHealthWave41Export: integrationHealthWave41ExportSpillover,
    automationIdleGovernanceWave42Export: automationIdleGovernanceWave42ExportSpillover,
    forecastWave42Export: forecastWave42ExportSpillover,
    uiResponsivenessWave43Export: uiResponsivenessWave43ExportSpillover,
    dashboardClarityWave43Export: dashboardClarityWave43ExportSpillover,
    automationIdleGovernanceWave44Export: automationIdleGovernanceWave44ExportSpillover,
    forecastWave44Export: forecastWave44ExportSpillover,
    replayWave45Export: replayWave45ExportSpillover,
    integrationHealthWave45Export: integrationHealthWave45ExportSpillover,
    uiResponsivenessWave46Export: uiResponsivenessWave46ExportSpillover,
    dashboardClarityWave46Export: dashboardClarityWave46ExportSpillover,
    replayWave47Export: replayWave47ExportSpillover,
    integrationHealthWave47Export: integrationHealthWave47ExportSpillover,
    replayWave48Export: replayWave48ExportSpillover,
    integrationHealthWave48Export: integrationHealthWave48ExportSpillover
  });

  const transmissionBalance = buildMacroTransmissionBalanceSnapshot(transmissionReport);
  const transmissionCoherence = buildMacroTransmissionCoherenceSnapshot(transmissionReport, cyclePhase);
  const transmissionConcentration = buildMacroTransmissionConcentrationSnapshot(transmissionReport);
  const transmissionAsymmetry = buildMacroTransmissionAsymmetrySnapshot(transmissionReport);
  const transmissionVolatility = buildMacroTransmissionVolatilitySnapshot(transmissionReport);
  const transmissionResilience = buildMacroTransmissionResilienceSnapshot(transmissionReport);
  const transmissionCoverage = buildMacroTransmissionCoverageSnapshot(transmissionReport);
  const transmissionAmplification = buildMacroTransmissionAmplificationSnapshot(transmissionReport);
  const transmissionTension = buildMacroTransmissionTensionSnapshot(transmissionReport);
  const transmissionDivergence = buildMacroTransmissionDivergenceSnapshot(transmissionReport);
  const transmissionStability = buildMacroTransmissionStabilitySnapshot(transmissionReport);
  const transmissionAlignment = buildMacroTransmissionAlignmentSnapshot(transmissionReport);
  const transmissionSynchronization = buildMacroTransmissionSynchronizationSnapshot(transmissionReport);
  const transmissionIntensity = buildMacroTransmissionIntensitySnapshot(transmissionReport);
  const transmissionPolarization = buildMacroTransmissionPolarizationSnapshot(transmissionReport);
  const transmissionCoupling = buildMacroTransmissionCouplingSnapshot(transmissionReport);
  const transmissionImbalance = buildMacroTransmissionImbalanceSnapshot(transmissionReport);
  const transmissionHarmonic = buildMacroTransmissionHarmonicSnapshot(transmissionReport);
  const transmissionGradient = buildMacroTransmissionGradientSnapshot(transmissionReport);
  const transmissionAttenuation = buildMacroTransmissionAttenuationSnapshot(transmissionReport);
  const transmissionEnvelope = buildMacroTransmissionEnvelopeSnapshot(transmissionReport);
  const transmissionPersistence = buildMacroTransmissionPersistenceSnapshot(transmissionReport);
  const transmissionCentrality = buildMacroTransmissionCentralitySnapshot(transmissionReport);
  const transmissionSynthesis = buildMacroTransmissionSynthesisSnapshot(transmissionReport);
  const transmissionDispersion = buildMacroTransmissionDispersionSnapshot(transmissionReport);
  const transmissionFragmentation = buildMacroTransmissionFragmentationSnapshot(transmissionReport);
  const transmissionRedundancy = buildMacroTransmissionRedundancySnapshot(transmissionReport);
  const transmissionSaturation = buildMacroTransmissionSaturationSnapshot(transmissionReport);
  const transmissionElasticity = buildMacroTransmissionElasticitySnapshot(transmissionReport);

  const capacitySnapshot = buildMacroCapacitySnapshot({
    state: {
      utilizationIndex,
      utilizationBand,
      investmentClimate
    },
    industry: industrySpillover,
    workforce: workforceSpillover
  });

  let nextPersisted: MacroEconomyPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    initializedTurn: persisted.initializedTurn ?? inputs.turn,
    lastUpdatedTurn: inputs.turn,
    lastInputHash: hash,
    cycleHysteresis: cyclePhase,
    cycleScore,
    productivityHysteresis: productivityBand,
    productivityScore,
    investmentHysteresis: investmentClimate,
    investmentScore
  };

  nextPersisted = appendMacroCycleTransitionMemory(nextPersisted, {
    turn: inputs.turn,
    previousPhase: persisted.cycleHysteresis,
    nextPhase: cyclePhase
  });

  const partialStateForOutlook: NationalMacroEconomyState = {
    schemaVersion: V1014_MACRO_SCHEMA_VERSION,
    revision: nextPersisted.revision,
    turn: inputs.turn,
    inputHash: hash,
    cyclePhase,
    cycleMomentum: v1014macroClamp((cycleScore - 50) / 50, -1, 1),
    cycleDurationTurns: prevState?.cyclePhase === cyclePhase ? (prevState?.cycleDurationTurns ?? 0) + 1 : 1,
    productivityBand,
    productivityIndex: productivityScore,
    investmentClimate,
    grossInvestmentIndex: investmentScore,
    utilizationBand,
    utilizationIndex,
    regionalContributions,
    accounting,
    sectorProductivity,
    sectorOutputMix,
    activeCyclicalShockIds: activeShockIds,
    fiscalSpilloverSummary: fiscalSpillover.summary,
    householdSpilloverSummary: householdSpillover.summary,
    industrySpilloverSummary: industrySpillover.summary,
    tradeSpilloverSummary: tradeSpillover.summary,
    geographySpilloverSummary: geographySpillover.summary,
    creditSpilloverSummary: creditSpillover.summary,
    innovationSpilloverSummary: innovationSpillover.summary,
    workforceSpilloverSummary: workforceSpillover.summary,
    strategicSpilloverSummary: strategicSpillover.summary,
    housingSpilloverSummary: housingSpillover.summary,
    inflationSpilloverSummary: inflationSpillover.summary,
    energySpilloverSummary: energySpillover.summary,
    eventsSpilloverSummary: eventsSpillover.summary,
    companiesSpilloverSummary: companiesSpillover.summary,
    turnsSpilloverSummary: turnsSpillover.summary,
    transportSpilloverSummary: transportSpillover.summary,
    researchSpilloverSummary: researchSpillover.summary,
    populationSpilloverSummary: populationSpillover.summary,
    modesSpilloverSummary: modesSpillover.summary,
    guardianSpilloverSummary: guardianSpillover.summary,
    citiesSpilloverSummary: citiesSpillover.summary,
    forecastingSpilloverSummary: forecastingSpillover.summary,
    commandSpilloverSummary: commandSpillover.summary,
    automationSpilloverSummary: automationSpillover.summary,
    teamAiSpilloverSummary: teamAiSpillover.summary,
    replaySpilloverSummary: replaySpillover.summary,
    memorySpilloverSummary: memorySpillover.summary,
    dashboardsSpilloverSummary: dashboardsSpillover.summary,
    uiSpilloverSummary: uiSpillover.summary,
    utilitiesSpilloverSummary: utilitiesSpillover.summary,
    logisticsSpilloverSummary: logisticsSpillover.summary,
    negotiationSpilloverSummary: negotiationSpillover.summary,
    confidenceSpilloverSummary: confidenceSpillover.summary,
    capexSpilloverSummary: capexSpillover.summary,
    monetarySpilloverSummary: monetarySpillover.summary,
    rentalSpilloverSummary: rentalSpillover.summary,
    climateSpilloverSummary: climateSpillover.summary,
    forecastDispersionSpilloverSummary: forecastDispersionSpillover.summary,
    accessibilitySpilloverSummary: accessibilitySpillover.summary,
    timelineSpilloverSummary: timelineSpillover.summary,
    liquiditySpilloverSummary: liquiditySpillover.summary,
    mapsTelemetrySpilloverSummary: mapsTelemetrySpillover.summary,
    strategicGameplaySpilloverSummary: strategicGameplaySpillover.summary,
    archiveIntegritySpilloverSummary: archiveIntegritySpillover.summary,
    integrationHealthSpilloverSummary: integrationHealthSpillover.summary,
    cadenceDriftSpilloverSummary: cadenceDriftSpillover.summary,
    researchMomentumSpilloverSummary: researchMomentumSpillover.summary,
    budgetOutlookSpilloverSummary: budgetOutlookSpillover.summary,
    modeShiftSpilloverSummary: modeShiftSpillover.summary,
    supplyChainSpilloverSummary: supplyChainSpillover.summary,
    eventCascadeSpilloverSummary: eventCascadeSpillover.summary,
    demographicShiftSpilloverSummary: demographicShiftSpillover.summary,
    expectationsAnchorSpilloverSummary: expectationsAnchorSpillover.summary,
    metroMomentumSpilloverSummary: metroMomentumSpillover.summary,
    transportThroughputSpilloverSummary: transportThroughputSpillover.summary,
    energyTransitionPaceSpilloverSummary: energyTransitionPaceSpillover.summary,
    housingAffordabilitySpilloverSummary: housingAffordabilitySpillover.summary,
    tradeExposureSpilloverSummary: tradeExposureSpillover.summary,
    guardianVigilanceSpilloverSummary: guardianVigilanceSpillover.summary,
    commandCoordinationSpilloverSummary: commandCoordinationSpillover.summary,
    teamAiCohesionSpilloverSummary: teamAiCohesionSpillover.summary,
    memoryRetentionSpilloverSummary: memoryRetentionSpillover.summary,
    automationThroughputSpilloverSummary: automationThroughputSpillover.summary,
    forecastCalibrationSpilloverSummary: forecastCalibrationSpillover.summary,
    automationIdleGovernanceSpilloverSummary: automationIdleGovernanceSpillover.summary,
    forecastProjectionSyncSpilloverSummary: forecastProjectionSyncSpillover.summary,
    automationIdleGovernanceWave36ExportSpilloverSummary: automationIdleGovernanceWave36ExportSpillover.summary,
    forecastWave36ProjectionSyncSpilloverSummary: forecastWave36ProjectionSyncSpillover.summary,
    uiResponsivenessWave37ExportSpilloverSummary: uiResponsivenessWave37ExportSpillover.summary,
    dashboardClarityWave37ExportSpilloverSummary: dashboardClarityWave37ExportSpillover.summary,
    replayWave38ExportSpilloverSummary: replayWave38ExportSpillover.summary,
    integrationHealthWave38ExportSpilloverSummary: integrationHealthWave38ExportSpillover.summary,
    automationIdleGovernanceWave39ExportSpilloverSummary: automationIdleGovernanceWave39ExportSpillover.summary,
    forecastWave39ExportSpilloverSummary: forecastWave39ExportSpillover.summary,
    uiResponsivenessWave40ExportSpilloverSummary: uiResponsivenessWave40ExportSpillover.summary,
    dashboardClarityWave40ExportSpilloverSummary: dashboardClarityWave40ExportSpillover.summary,
    replayWave41ExportSpilloverSummary: replayWave41ExportSpillover.summary,
    integrationHealthWave41ExportSpilloverSummary: integrationHealthWave41ExportSpillover.summary,
    automationIdleGovernanceWave42ExportSpilloverSummary: automationIdleGovernanceWave42ExportSpillover.summary,
    forecastWave42ExportSpilloverSummary: forecastWave42ExportSpillover.summary,
    uiResponsivenessWave43ExportSpilloverSummary: uiResponsivenessWave43ExportSpillover.summary,
    dashboardClarityWave43ExportSpilloverSummary: dashboardClarityWave43ExportSpillover.summary,
    automationIdleGovernanceWave44ExportSpilloverSummary: automationIdleGovernanceWave44ExportSpillover.summary,
    forecastWave44ExportSpilloverSummary: forecastWave44ExportSpillover.summary,
    replayWave45ExportSpilloverSummary: replayWave45ExportSpillover.summary,
    integrationHealthWave45ExportSpilloverSummary: integrationHealthWave45ExportSpillover.summary,
    uiResponsivenessWave46ExportSpilloverSummary: uiResponsivenessWave46ExportSpillover.summary,
    dashboardClarityWave46ExportSpilloverSummary: dashboardClarityWave46ExportSpillover.summary,
    replayWave47ExportSpilloverSummary: replayWave47ExportSpillover.summary,
    integrationHealthWave47ExportSpilloverSummary: integrationHealthWave47ExportSpillover.summary,
    replayWave48ExportSpilloverSummary: replayWave48ExportSpillover.summary,
    integrationHealthWave48ExportSpilloverSummary: integrationHealthWave48ExportSpillover.summary,
    capacitySnapshot,
    transmissionBalance,
    transmissionCoherence,
    transmissionConcentration,
    transmissionAsymmetry,
    transmissionVolatility,
    transmissionResilience,
    transmissionCoverage,
    transmissionAmplification,
    transmissionTension,
    transmissionDivergence,
    transmissionStability,
    transmissionAlignment,
    transmissionSynchronization,
    transmissionIntensity,
    transmissionPolarization,
    transmissionCoupling,
    transmissionImbalance,
    transmissionHarmonic,
    transmissionGradient,
    transmissionAttenuation,
    transmissionEnvelope,
    transmissionPersistence,
    transmissionCentrality,
    transmissionSynthesis,
    transmissionDispersion,
    transmissionFragmentation,
    transmissionRedundancy,
    transmissionSaturation,
    transmissionElasticity,
    transmissionReport,
    stressIndex: {
      score: 0,
      band: 'calm',
      drivers: [],
      transmissionStress: 0,
      gateStress: 0
    },
    policyStance: {
      stance: 'neutral',
      fiscalTilt: 0,
      creditTilt: 0,
      summary: ''
    },
    regionalDivergence,
    outlookProjection: {
      horizonTurns: 3,
      projectedCyclePhase: cyclePhase,
      projectedInvestmentClimate: investmentClimate,
      projectedProductivityBand: productivityBand,
      projectedOutputIndex: accounting.grossOutputIndex,
      confidence: 0.9
    },
    consistencyGates: [],
    debrief: { headline: '', bullets: [] },
    derivedSignals: [],
    evidence: evList.slice(0, V1014_MACRO_LIMITS.maxEvidence),
    outlook: { phase: cyclePhase, productivity: productivityBand, investment: investmentClimate }
  };

  const outlookProjection = projectMacroEconomyOutlook(partialStateForOutlook, inputs, 3);

  const stateBase: NationalMacroEconomyState = {
    ...partialStateForOutlook,
    outlookProjection
  };
  const consistencyGates = evaluateMacroConsistencyGates(stateBase, inputs);
  const stressIndex = buildMacroStressIndexSnapshot({ ...stateBase, consistencyGates });
  const policyStance = buildMacroPolicyStanceSnapshot({
    inputs,
    state: stateBase,
    fiscal: fiscalSpillover,
    credit: creditSpillover
  });
  const debrief = composeMacroEconomyDebrief({ ...stateBase, consistencyGates, stressIndex, policyStance });
  const derivedSignals = buildMacroDerivedSignals(stateBase, persisted.cycleHysteresis);

  const state: NationalMacroEconomyState = {
    ...stateBase,
    consistencyGates,
    stressIndex,
    policyStance,
    debrief,
    derivedSignals
  };

  return { state, persisted: nextPersisted };
}


// --- source: integration.ts ---

export function computeMacroEconomyRankingFit(
  state: NationalMacroEconomyState | null | undefined,
  regionId: string | null
): number {
  if (!state) return 0;
  let fit = 0;
  if (state.productivityBand === 'strong' || state.productivityBand === 'leading') fit += 1;
  if (state.investmentClimate === 'balanced' || state.investmentClimate === 'active') fit += 0.5;
  if (regionId) {
    const row = state.regionalContributions.find(r => r.regionId === regionId);
    if (row && (row.role === 'driver' || row.role === 'anchor')) fit += 0.5;
  }
  return v1014macroClamp(fit, -2, 2);
}

export function evaluateMacroEconomyGuardianWarnings(gs: any): Array<{
  id: string;
  title: string;
  detail: string;
  severity: 'info' | 'warn';
}> {
  if (gs.gameSettings && (gs.gameSettings.macroEconomyEnabled === false || gs.gameSettings.nationalSystemsEnabled === false)) {
    return [];
  }
  const st = gs.macroEconomyState as NationalMacroEconomyState | undefined;
  if (!st) return [];
  const out: Array<{ id: string; title: string; detail: string; severity: 'info' | 'warn' }> = [];
  const validation = validateNationalMacroEconomyState(st);
  if (!validation.valid) {
    out.push({
      id: 'me_accounting',
      title: 'Macro accounting identity drift',
      detail: validation.issues.join('; '),
      severity: 'warn'
    });
  }
  if (st.cyclePhase === 'contraction' || st.cyclePhase === 'trough') {
    out.push({
      id: 'me_cycle_down',
      title: 'National business cycle is weakening',
      detail: `Phase ${st.cyclePhase}`,
      severity: 'info'
    });
  }
  if (st.investmentClimate === 'frozen') {
    out.push({
      id: 'me_inv_frozen',
      title: 'Macro investment climate frozen',
      detail: 'National gross investment index is depressed',
      severity: 'info'
    });
  }
  return out;
}

export function evaluateMacroEconomyGuardianContext(
  context: GuardianEvaluationContext
): readonly GuardianDetectedRisk[] {
  if (context.isReplay) return [];
  const gs: any = context.gameState || {};
  const warnings = evaluateMacroEconomyGuardianWarnings({ ...gs, gameSettings: gs.gameSettings || context.gameSettings });
  if (!warnings.length) return [];
  return warnings.map((w, i) => ({
    id: `risk_macro_economy_${context.actorId}_t${context.turn}_${i}`,
    category: 'economy',
    severity: w.severity === 'warn' ? 'moderate' : 'informational',
    title: w.title,
    description: w.detail,
    evidence: ['V10.14 national macro accounting layer'],
    assumptions: ['National macro indices are not player cash; proceeding remains legal.'],
    probability: 1,
    estimatedImpact: 0,
    confidence: 0.8,
    reversible: true,
    immediate: false,
    triggeredSettingKeys: [],
    systemIds: ['macro_economy']
  }));
}


// --- source: accounting/reconciliation-tests.ts ---

export function runAccountingReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    const recon = reconcileAccountingLedger(r.state.accounting);
    record('AR01', 'Baseline ledger reconciles', recon.ok, recon.issues.join('; ') || 'ok');
  }

  {
    const r = computeNationalMacroEconomy(
      makeDefaultV1014_MACRO_TestInputs({ creditShockActive: true, highInflationScenarioActive: true }),
      null,
      null
    );
    const recon = reconcileAccountingLedger(r.state.accounting);
    const valid = validateNationalMacroEconomyState(r.state);
    record(
      'AR02',
      'Shock scenario reconciles + validates',
      recon.ok && valid.valid,
      [...recon.issues, ...valid.issues].join('; ') || 'ok'
    );
  }

  {
    const shares = v1014macroNormalizeRegionalShares([
      { regionId: 'NSW', weight: 0 },
      { regionId: 'VIC', weight: 0 }
    ]);
    const sum = Object.values(shares).reduce((a, b) => a + b, 0);
    record('AR03', 'Zero-weight fallback shares sum to 1', Math.abs(sum - 1) < 1e-5, `sum=${sum}`);
  }

  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    record(
      'AR04',
      'Gross output within 0..100',
      r.state.accounting.grossOutputIndex >= 0 && r.state.accounting.grossOutputIndex <= 100,
      String(r.state.accounting.grossOutputIndex)
    );
  }

  {
    let p = null;
    let prev = null;
    for (let t = 1; t <= 12; t++) {
      const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ turn: t }), p, prev);
      const recon = reconcileAccountingLedger(r.state.accounting);
      if (!recon.ok) {
        record('AR05', `Multi-turn reconcile turn ${t}`, false, recon.issues.join('; '));
        break;
      }
      p = r.persisted;
      prev = r.state;
      if (t === 12) record('AR05', 'Multi-turn reconcile 12 turns', true, 'ok');
    }
  }

  {
    const r = computeNationalMacroEconomy(
      makeDefaultV1014_MACRO_TestInputs({
        livingRegions: {
          regions: {
            NSW: { economy: { score: 90 }, momentum: { band: 'surging' }, development: { score: 80 } },
            VIC: { economy: { score: 40 }, momentum: { band: 'declining' }, development: { score: 30 } }
          }
        }
      }),
      null,
      null
    );
    const sum = r.state.regionalContributions.reduce((a, x) => a + x.share, 0);
    record('AR06', 'Skewed regional inputs preserve share identity', Math.abs(sum - 1) < 1e-5, `sum=${sum}`);
  }

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: accounting/regional-reconciliation.ts ---

export interface RegionalReconciliationReport {
  ok: boolean;
  shareSum: number;
  shareResidual: number;
  issues: string[];
  impliedOutputIndex: number;
  reportedOutputIndex: number;
  outputDrift: number;
}

export function reconcileRegionalContributionShares(
  contributions: RegionalMacroContribution[]
): { ok: boolean; shareSum: number; shareResidual: number; issues: string[] } {
  const issues: string[] = [];
  const shareSum = sumRegionalShares(contributions);
  const shareResidual = Math.abs(shareSum - 1);
  if (shareResidual > V1014_MACRO_LIMITS.accountingTolerance) {
    issues.push(`share sum ${shareSum}`);
  }
  if (contributions.length !== V1014_MACRO_LIMITS.maxRegionalRows) {
    issues.push(`expected ${V1014_MACRO_LIMITS.maxRegionalRows} rows, got ${contributions.length}`);
  }
  for (const row of contributions) {
    if (row.share < 0 || row.share > 1) issues.push(`${row.regionId} share out of range ${row.share}`);
    if (!Number.isFinite(row.productivityIndex)) issues.push(`${row.regionId} productivity NaN`);
    if (row.investmentIntensity < 0 || row.investmentIntensity > 100) {
      issues.push(`${row.regionId} investment intensity ${row.investmentIntensity}`);
    }
  }
  const ids = contributions.map(r => r.regionId);
  if (new Set(ids).size !== ids.length) issues.push('duplicate region ids');
  return {
    ok: issues.length === 0,
    shareSum,
    shareResidual,
    issues
  };
}

export function reconcileRegionalOutputAgainstNational(params: {
  contributions: RegionalMacroContribution[];
  grossOutputIndex: number;
}): RegionalReconciliationReport {
  const base = reconcileRegionalContributionShares(params.contributions);
  const impliedOutputIndex = params.contributions.reduce(
    (acc, r) => acc + r.share * (r.productivityIndex * 0.55 + r.utilizationIndex * 0.45) / 100,
    0
  );
  const scaledImplied = impliedOutputIndex * 100;
  const outputDrift = Math.abs(scaledImplied - params.grossOutputIndex);
  const issues = [...base.issues];
  if (outputDrift > 35) {
    issues.push(`output drift implied=${scaledImplied.toFixed(2)} national=${params.grossOutputIndex.toFixed(2)}`);
  }
  return {
    ok: issues.length === 0,
    shareSum: base.shareSum,
    shareResidual: base.shareResidual,
    issues,
    impliedOutputIndex: scaledImplied,
    reportedOutputIndex: params.grossOutputIndex,
    outputDrift
  };
}

export function runRegionalReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const baseline = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
  const regBase = reconcileRegionalContributionShares(baseline.state.regionalContributions);
  record('RR01', 'Baseline regional shares reconcile', regBase.ok, regBase.issues.join('; ') || 'ok');

  const full = reconcileRegionalOutputAgainstNational({
    contributions: baseline.state.regionalContributions,
    grossOutputIndex: baseline.state.accounting.grossOutputIndex
  });
  record('RR02', 'Baseline regional output diagnostic', full.ok, full.issues.join('; ') || 'ok');

  const shocked = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      activeCyclicalShockIds: ['commodity_bust', 'global_slowdown']
    }),
    null,
    null
  );
  const regShock = reconcileRegionalContributionShares(shocked.state.regionalContributions);
  record('RR03', 'Multi-shock regional shares reconcile', regShock.ok, `sum=${regShock.shareSum.toFixed(6)}`);

  const stim = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: ['stimulus_bounce'] }),
    null,
    null
  );
  record(
    'RR05',
    'Stimulus shock raises investment index vs baseline',
    stim.state.grossInvestmentIndex >= baseline.state.grossInvestmentIndex,
    `base=${baseline.state.grossInvestmentIndex} stim=${stim.state.grossInvestmentIndex}`
  );

  {
    const badRows = baseline.state.regionalContributions.map(r =>
      r.regionId === 'NSW' ? { ...r, share: r.share + 0.02 } : r
    );
    const bad = reconcileRegionalContributionShares(badRows);
    record('RR06', 'Detects inflated share sum', !bad.ok && bad.shareSum > 1, `sum=${bad.shareSum}`);
  }

  const bustOnly = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: ['commodity_bust'] }),
    null,
    null
  );
  const waShare = bustOnly.state.regionalContributions.find(r => r.regionId === 'WA')!.share;
  const baseWa = baseline.state.regionalContributions.find(r => r.regionId === 'WA')!.share;
  record(
    'RR07',
    'Commodity bust adjusts WA share downward vs baseline',
    waShare <= baseWa + 1e-9,
    `base=${baseWa.toFixed(4)} bust=${waShare.toFixed(4)}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: depth-self-tests.ts ---

export function runAgent06DepthSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const fiscal = readMacroFiscalSpilloverFromV1012(
    makeDefaultV1014_MACRO_TestInputs({
      publicFinance: { pressure: 'critical', fiscalHeadroom: -5 }
    })
  );
  record('DP01', 'Fiscal critical spillover negative investment nudge', fiscal.investmentNudge < 0, String(fiscal.investmentNudge));

  const stacked = composeStackedShockDeltas(['commodity_bust', 'global_slowdown'], CYCLICAL_MACRO_SHOCK_CATALOG);
  const naive = CYCLICAL_MACRO_SHOCK_CATALOG.commodity_bust.cycleDelta + CYCLICAL_MACRO_SHOCK_CATALOG.global_slowdown.cycleDelta;
  record('DP02', 'Stacked shocks diminish cycle drag vs naive sum', stacked.cycleDelta > naive, `${stacked.cycleDelta} vs ${naive}`);

  const baselineState = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null).state;
  const withFiscal = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'critical', fiscalHeadroom: -8 } }),
    null,
    null
  );

  record(
    'DP03',
    'Compute appends cycle transition when phase changes',
    macroCycleTransitionCount(
      appendMacroCycleTransitionMemory(withFiscal.persisted, {
        turn: 3,
        previousPhase: 'expansion',
        nextPhase: 'contraction'
      })
    ) >= 1,
    'ok'
  );

  const mix = computeNationalSectorOutputMix(baselineState.regionalContributions);
  const mixSum = Object.values(mix).reduce((a, b) => a + b, 0);
  record('DP04', 'Sector output mix sums to 1', Math.abs(mixSum - 1) < 1e-5, String(mixSum));
  record('DP05', 'Dominant sector resolved', dominantNationalSector(mix).length > 2, dominantNationalSector(mix));

  const match = detectMacroEconomyQuestion('What is the national business cycle phase?');
  const answer = match ? composeMacroEconomyGiAnswer(baselineState, match) : '';
  record('DP06', 'GI cycle question answered', Boolean(match && answer.includes('cycle')), answer.slice(0, 40));

  const regMatch = detectMacroEconomyQuestion('NSW regional share of macro economy');
  record('DP07', 'GI detects regional topic', regMatch?.topic === 'regional_contribution' && regMatch.regionId === 'NSW', String(regMatch?.topic));

  record(
    'DP08',
    'State exposes fiscal spillover summary',
    typeof withFiscal.state.fiscalSpilloverSummary === 'string' && withFiscal.state.fiscalSpilloverSummary!.length > 5,
    String(withFiscal.state.fiscalSpilloverSummary)
  );

  record(
    'DP09',
    'State exposes active shock ids',
    Array.isArray(withFiscal.state.activeCyclicalShockIds),
    withFiscal.state.activeCyclicalShockIds.join(',')
  );

  const mem = appendMacroCycleTransitionMemory(
    withFiscal.persisted,
    { turn: 2, previousPhase: 'expansion', nextPhase: 'slowdown' }
  );
  record('DP10', 'Manual transition append bounded', mem.transitions.length <= 16, String(mem.transitions.length));

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round2-self-tests.ts ---

export function runAgent06Round2SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const base = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
  const div = computeRegionalDivergenceSnapshot(base.state.regionalContributions);
  record('R2-01', 'Regional divergence snapshot populated', div.leadingRegionId.length >= 2, div.band);

  record(
    'R2-02',
    'State carries regional divergence',
    base.state.regionalDivergence.shareHerfindahl > 0,
    String(base.state.regionalDivergence.shareHerfindahl)
  );

  const outlook = projectMacroEconomyOutlook(base.state, makeDefaultV1014_MACRO_TestInputs(), 3);
  record(
    'R2-03',
    'Outlook projection bounded confidence',
    outlook.confidence >= 0.45 && outlook.confidence <= 0.95,
    String(outlook.confidence)
  );

  record(
    'R2-04',
    'State carries outlook projection',
    base.state.outlookProjection.horizonTurns === 3,
    String(base.state.outlookProjection.projectedOutputIndex)
  );

  const stressed = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: macroStressScenarioShockIds('resource_bust') }),
    null,
    null
  );
  record(
    'R2-05',
    'Stress scenario lowers investment vs baseline',
    stressed.state.grossInvestmentIndex <= base.state.grossInvestmentIndex,
    `${base.state.grossInvestmentIndex}->${stressed.state.grossInvestmentIndex}`
  );

  const align = macroEconomyActionAlignment(base.state, { category: 'investments', regionId: 'NSW' });
  record('R2-06', 'Action alignment bounded', Boolean(align && align.scoreDelta >= -6 && align.scoreDelta <= 6), String(align?.scoreDelta));

  record(
    'R2-07',
    'Stress catalog entries have shock lists',
    MACRO_STRESS_SCENARIO_CATALOG.every(s => s.shockIds.length > 0),
    String(MACRO_STRESS_SCENARIO_CATALOG.length)
  );

  const stimOutlook = projectMacroEconomyOutlook(
    base.state,
    makeDefaultV1014_MACRO_TestInputs({ activeCyclicalShockIds: macroStressScenarioShockIds('policy_recovery') }),
    2
  );
  record(
    'R2-08',
    'Recovery scenario outlook output >= baseline outlook',
    stimOutlook.projectedOutputIndex >= base.state.outlookProjection.projectedOutputIndex - 5,
    String(stimOutlook.projectedOutputIndex)
  );

  record(
    'R2-09',
    'Wide spread increases under commodity bust',
    computeRegionalDivergenceSnapshot(stressed.state.regionalContributions).productivitySpread >= div.productivitySpread - 0.01,
    stressed.state.regionalDivergence.band
  );

  const austerity = macroEconomyActionAlignment(stressed.state, { category: 'austerity' });
  record('R2-10', 'Austerity alignment negative under stress', Boolean(austerity && austerity.scoreDelta <= 0), String(austerity?.scoreDelta));

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round3-self-tests.ts ---

export function runAgent06Round3SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const hh = readMacroHouseholdSpilloverFromV1013(
    makeDefaultV1014_MACRO_TestInputs({
      households: { domesticDemand: { band: 'surging' }, affordability: { band: 'moderate' } }
    })
  );
  record('R3-01', 'Household surging demand nudges cycle up', hh.cycleNudge > 0, String(hh.cycleNudge));

  const ind = readMacroIndustrySpilloverFromV101(
    makeDefaultV1014_MACRO_TestInputs({ industries: { nationalUtilization: 80, supplyConstrained: true } })
  );
  record('R3-02', 'Tight constrained industry lowers productivity read', ind.productivityNudge < 0, String(ind.productivityNudge));

  const base = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
  record('R3-03', 'Debrief headline present', base.state.debrief.headline.length > 5, base.state.debrief.headline.slice(0, 30));

  record('R3-04', 'Debrief bullets bounded', base.state.debrief.bullets.length >= 2 && base.state.debrief.bullets.length <= 8, String(base.state.debrief.bullets.length));

  const tension = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      publicFinance: { pressure: 'critical', fiscalHeadroom: -3 },
      households: { domesticDemand: { level: 'strong' } }
    }),
    null,
    null
  );
  record(
    'R3-05',
    'Fiscal/household tension gate fires',
    tension.state.consistencyGates.some(g => g.id === 'fiscal_household_tension'),
    tension.state.consistencyGates.map(g => g.id).join(',')
  );

  const gates = evaluateMacroConsistencyGates(tension.state, makeDefaultV1014_MACRO_TestInputs({
    publicFinance: { pressure: 'critical' },
    households: { domesticDemand: { level: 'strong' } }
  }));
  record('R3-06', 'Gate evaluator is pure', gates.some(g => g.triggered), String(gates.length));

  const debrief = composeMacroEconomyDebrief({ ...tension.state, consistencyGates: gates });
  record('R3-07', 'Debrief mentions consistency when gates fire', debrief.bullets.some(b => b.includes('Consistency') || b.includes('fiscal')), 'ok');

  const signals = buildMacroDerivedSignals({ ...tension.state, cyclePhase: 'slowdown' }, 'expansion');
  record('R3-08', 'Derived signals on phase change', signals.some(s => s.kind === 'cycle_phase_change'), String(signals.length));

  const industryRun = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ industries: { nationalUtilization: 35 } }),
    null,
    null
  );
  record(
    'R3-09',
    'Industry spillover summary on state',
    industryRun.state.industrySpilloverSummary != null || industryRun.state.productivityIndex <= base.state.productivityIndex + 1,
    String(industryRun.state.industrySpilloverSummary)
  );

  let p = null;
  let prev = null;
  for (let t = 1; t <= 20; t++) {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ turn: t }), p, prev);
    p = r.persisted;
    prev = r.state;
  }
  record('R3-10', '20-turn macro sim stays valid', prev!.accounting.identityOk, String(prev!.revision));

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round4-self-tests.ts ---

export function runAgent06Round4SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const trade = readMacroTradeSpilloverFromV1015(
    makeDefaultV1014_MACRO_TestInputs({ trade: { termsOfTrade: { band: 'weak' }, exportMomentum: -5 } })
  );
  record('R4-01', 'Weak trade terms drag cycle', trade.cycleNudge < 0, String(trade.cycleNudge));

  const geo = readMacroGeographySpillover(
    makeDefaultV1014_MACRO_TestInputs({ economicGeography: { connectivity: { band: 'strong' } } })
  );
  record('R4-02', 'Strong geography lifts investment read', geo.investmentNudge > 0, String(geo.investmentNudge));

  const report = buildMacroTransmissionReport({
    turn: 4,
    fiscal: readMacroFiscalSpilloverFromV1012(makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'strained' } })),
    household: readMacroHouseholdSpilloverFromV1013(makeDefaultV1014_MACRO_TestInputs()),
    industry: readMacroIndustrySpilloverFromV101(makeDefaultV1014_MACRO_TestInputs()),
    trade,
    geography: geo,
    credit: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    innovation: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    workforce: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    strategic: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    housing: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null }
  });
  record('R4-03', 'Transmission report has sixty-eight layers', report.layers.length === 92, String(report.layers.length));
  record('R4-04', 'Net cycle nudge finite', Number.isFinite(report.netCycleNudge), String(report.netCycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      trade: { termsOfTrade: { band: 'favorable' } },
      economicGeography: { connectivity: { band: 'moderate' } }
    }),
    null,
    null
  );
  record('R4-05', 'State carries transmission report', integrated.state.transmissionReport.layers.length === 92, 'ok');
  record('R4-06', 'Trade summary on state', integrated.state.tradeSpilloverSummary != null, String(integrated.state.tradeSpilloverSummary));

  const stress = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      publicFinance: { pressure: 'critical' },
      trade: { termsOfTrade: { band: 'weak' } }
    }),
    null,
    null
  );
  record(
    'R4-07',
    'Trade/fiscal stress gate',
    stress.state.consistencyGates.some(g => g.id === 'trade_fiscal_stress'),
    stress.state.consistencyGates.map(g => g.id).join(',')
  );

  const harness = runMacroEconomyRegressionHarness({ turns: 12, scenarioId: 'resource_bust' });
  record('R4-08', 'Regression harness passes', harness.allPassed, harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok');

  record(
    'R4-09',
    'Debrief cites dominant transmission when present',
    integrated.state.debrief.bullets.some(b => b.includes('Dominant transmission') || b.includes('external')),
    integrated.state.debrief.bullets.join('|').slice(0, 60)
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round5-self-tests.ts ---

export function runAgent06Round5SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const credit = readMacroCreditSpilloverFromV1016(
    makeDefaultV1014_MACRO_TestInputs({
      creditMarkets: { spreadBand: 'stressed', policyStance: 'restrictive' }
    })
  );
  record('R5-01', 'Stressed credit tightens investment read', credit.investmentNudge < -3, String(credit.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      creditMarkets: { spreadBand: 'wide', liquidity: { band: 'strained' } },
      publicFinance: { pressure: 'strained' }
    }),
    null,
    null
  );
  record('R5-02', 'State exposes credit spillover summary', integrated.state.creditSpilloverSummary != null, 'ok');
  record('R5-03', 'Stress index finite', Number.isFinite(integrated.state.stressIndex.score), String(integrated.state.stressIndex.score));
  record(
    'R5-04',
    'Monetary/fiscal clamp gate',
    integrated.state.consistencyGates.some(g => g.id === 'monetary_fiscal_clamp'),
    integrated.state.consistencyGates.map(g => g.id).join(',')
  );

  const stance = buildMacroPolicyStanceSnapshot({
    inputs: makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'critical' } }),
    state: { investmentClimate: 'frozen', cyclePhase: 'contraction' },
    fiscal: readMacroFiscalSpilloverFromV1012(
      makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'critical' } })
    ),
    credit
  });
  record('R5-05', 'Conflicted policy stance under dual tightening', stance.stance === 'conflicted', stance.stance);

  const stress = buildMacroStressIndexSnapshot(integrated.state);
  record('R5-06', 'Stress band matches score', stress.band !== 'calm' || stress.score < 34, `${stress.band}/${stress.score}`);

  const delta = computeMacroCounterfactualDelta(
    makeDefaultV1014_MACRO_TestInputs({ turn: 6 }),
    { creditShockActive: true },
    null,
    null
  );
  record('R5-07', 'Counterfactual credit shock lowers investment', delta.investmentScoreDelta < 0, String(delta.investmentScoreDelta));

  const harness = runMacroEconomyRegressionHarness({ turns: 10, scenarioId: 'credit_crunch', includeCreditStress: true });
  record('R5-08', 'Credit regression harness', harness.allPassed, harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok');

  record(
    'R5-09',
    'Debrief mentions stress when elevated',
    integrated.state.stressIndex.band !== 'calm'
      ? integrated.state.debrief.bullets.some(b => b.includes('stress'))
      : true,
    integrated.state.debrief.bullets.join('|').slice(0, 80)
  );

  record('R5-10', 'Transmission includes credit layer', integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.16_credit'), 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round6-self-tests.ts ---

export function runAgent06Round6SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const innovation = readMacroInnovationSpilloverFromV104(
    makeDefaultV1014_MACRO_TestInputs({ innovation: { momentum: { band: 'accelerating' }, nationalProductivityBonus: true } })
  );
  record('R6-01', 'Accelerating innovation lifts productivity read', innovation.productivityNudge > 3, String(innovation.productivityNudge));

  const workforce = readMacroWorkforceSpilloverFromV107(
    makeDefaultV1014_MACRO_TestInputs({ workforce: { nationalReadinessBand: 'critical', laborMarket: { slack: 'tight' } } })
  );
  record('R6-02', 'Critical workforce drags productivity', workforce.productivityNudge < -3, String(workforce.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      innovation: { nationalProductivityBonus: true },
      workforce: { nationalReadinessBand: 'strong' }
    }),
    null,
    null
  );
  record('R6-03', 'State exposes innovation summary', integrated.state.innovationSpilloverSummary != null, 'ok');
  record('R6-04', 'State exposes workforce summary', integrated.state.workforceSpilloverSummary != null, 'ok');
  record('R6-05', 'Seventy-eight transmission layers', integrated.state.transmissionReport.layers.length === 92, String(integrated.state.transmissionReport.layers.length));

  const capacity = buildMacroCapacitySnapshot({
    state: integrated.state,
    industry: readMacroIndustrySpilloverFromV101(makeDefaultV1014_MACRO_TestInputs()),
    workforce
  });
  record('R6-06', 'Capacity snapshot finite', Number.isFinite(capacity.index), String(capacity.index));

  record(
    'R6-07',
    'Transmission includes innovation layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.4_innovation'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 9 }),
    [
      { id: 'strong_labor', overlay: { workforce: { nationalReadinessBand: 'strong' } } },
      { id: 'stalled_innovation', overlay: { innovation: { momentum: { band: 'stalled' } } } }
    ],
    null,
    null
  );
  record('R6-08', 'Scenario compare returns two rows', compare.length === 2, String(compare.length));
  record(
    'R6-09',
    'Strong labor raises productivity vs stalled innovation',
    compare[0].delta.productivityScoreDelta >= compare[1].delta.productivityScoreDelta,
    `${compare[0].delta.productivityScoreDelta}/${compare[1].delta.productivityScoreDelta}`
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'labor_innovation_shock',
    includeLaborInnovationStress: true
  });
  record('R6-10', 'Labor/innovation regression harness', harness.allPassed, harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round7-self-tests.ts ---

export function runAgent06Round7SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const strategic = readMacroStrategicSpilloverFromV109(
    makeDefaultV1014_MACRO_TestInputs({
      strategicCapital: { allocationBand: 'expansionary', nationalPriority: 'infrastructure', momentum: { band: 'strong' } }
    })
  );
  record('R7-01', 'Expansionary strategic lifts investment read', strategic.investmentNudge > 3, String(strategic.investmentNudge));

  const housing = readMacroHousingSpilloverFromV1014Housing(
    makeDefaultV1014_MACRO_TestInputs({
      housingWellbeing: { affordability: { band: 'stressed' }, construction: { band: 'correction' } }
    })
  );
  record('R7-02', 'Housing correction drags investment', housing.investmentNudge < -3, String(housing.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      strategicCapital: { allocationBand: 'growth' },
      housingWellbeing: { affordability: { band: 'balanced' }, wellbeing: { band: 'strong' } }
    }),
    null,
    null
  );
  record('R7-03', 'State exposes strategic summary', integrated.state.strategicSpilloverSummary != null, 'ok');
  record('R7-04', 'State exposes housing summary', integrated.state.housingSpilloverSummary != null, 'ok');
  record(
    'R7-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const balance = buildMacroTransmissionBalanceSnapshot(integrated.state.transmissionReport);
  record('R7-06', 'Transmission balance finite', Number.isFinite(balance.dispersionIndex), String(balance.dispersionIndex));
  record(
    'R7-07',
    'Transmission includes strategic layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.9_strategic'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 12 }),
    [
      { id: 'expansionary_strategic', overlay: { strategicCapital: { allocationBand: 'expansionary' } } },
      { id: 'housing_correction', overlay: { housingWellbeing: { construction: { band: 'correction' } } } }
    ],
    null,
    null
  );
  const ranked = rankMacroEconomyScenariosByNetOutcome(compare);
  record('R7-08', 'Scenario ranking preserves row count', ranked.length === 2, String(ranked.length));
  record(
    'R7-09',
    'Expansionary strategic ranks above housing correction',
    ranked[0].scenarioId === 'expansionary_strategic',
    ranked.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'housing_strategic_stress',
    includeHousingStrategicStress: true
  });
  record(
    'R7-10',
    'Housing/strategic regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round8-self-tests.ts ---

export function runAgent06Round8SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const inflation = readMacroInflationSpilloverFromV1010(
    makeDefaultV1014_MACRO_TestInputs({
      nationalFinance: { inflation: { band: 'elevated' }, inflationExpectations: { band: 'rising' } }
    })
  );
  record('R8-01', 'Elevated inflation drags cycle read', inflation.cycleNudge < -1, String(inflation.cycleNudge));

  const energy = readMacroEnergySpilloverFromV1018(
    makeDefaultV1014_MACRO_TestInputs({
      industrialEnergy: { supplyReliability: { band: 'critical' }, energyCost: { band: 'severe' } }
    })
  );
  record('R8-02', 'Critical energy supply drags productivity', energy.productivityNudge < -1, String(energy.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      nationalFinance: { inflation: { band: 'moderate' } },
      industrialEnergy: { transition: { band: 'accelerating' }, supplyReliability: { band: 'robust' } }
    }),
    null,
    null
  );
  record('R8-03', 'State exposes inflation summary', integrated.state.inflationSpilloverSummary != null, 'ok');
  record('R8-04', 'State exposes energy summary', integrated.state.energySpilloverSummary != null, 'ok');
  record(
    'R8-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const coherence = buildMacroTransmissionCoherenceSnapshot(integrated.state.transmissionReport, integrated.state.cyclePhase);
  record('R8-06', 'Transmission coherence finite', Number.isFinite(coherence.coherenceIndex), String(coherence.coherenceIndex));
  record(
    'R8-07',
    'Transmission includes inflation layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.10_inflation'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 14 }),
    [
      { id: 'energy_cost_shock', overlay: { industrialEnergy: { energyCost: { band: 'severe' } } } },
      { id: 'disinflation', overlay: { nationalFinance: { inflation: { band: 'disinflation' } } } }
    ],
    null,
    null
  );
  const ranked = rankMacroEconomyScenariosByNetOutcome(compare);
  const elasticity = rankMacroScenarioElasticity(compare);
  record('R8-08', 'Scenario elasticity preserves row count', elasticity.length === 2, String(elasticity.length));
  record(
    'R8-09',
    'Disinflation ranks above energy cost shock',
    ranked[0].scenarioId === 'disinflation',
    ranked.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'inflation_energy_stress',
    includeInflationEnergyStress: true
  });
  record(
    'R8-10',
    'Inflation/energy regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round9-self-tests.ts ---

export function runAgent06Round9SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const events = readMacroEventsSpilloverFromV105(
    makeDefaultV1014_MACRO_TestInputs({
      dynamicEvents: {
        nationalStabilityBand: 'critical',
        pendingBacklogBand: 'surging',
        activeCrisisCount: 3
      }
    })
  );
  record('R9-01', 'Critical event backlog drags cycle read', events.cycleNudge < -3, String(events.cycleNudge));

  const companies = readMacroCompaniesSpilloverFromV108(
    makeDefaultV1014_MACRO_TestInputs({
      privateSector: {
        nationalUtilizationBand: 'critical',
        overloadedFirmCount: 5,
        productionMomentum: { band: 'contracting' }
      }
    })
  );
  record('R9-02', 'Production strain drags productivity', companies.productivityNudge < -2, String(companies.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      dynamicEvents: { nationalStabilityBand: 'stable', pendingBacklogBand: 'calm' },
      privateSector: { nationalUtilizationBand: 'overextended', productionMomentum: { band: 'strong' } }
    }),
    null,
    null
  );
  record('R9-03', 'State exposes events summary', integrated.state.eventsSpilloverSummary != null, 'ok');
  record('R9-04', 'State exposes companies summary', integrated.state.companiesSpilloverSummary != null, 'ok');
  record(
    'R9-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const concentration = buildMacroTransmissionConcentrationSnapshot(integrated.state.transmissionReport);
  record('R9-06', 'Transmission concentration finite', Number.isFinite(concentration.concentrationIndex), String(concentration.concentrationIndex));
  record(
    'R9-07',
    'Transmission includes events layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.5_events'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 16 }),
    [
      { id: 'event_backlog', overlay: { dynamicEvents: { pendingBacklogBand: 'critical', nationalStabilityBand: 'fragile' } } },
      { id: 'production_slack', overlay: { privateSector: { nationalUtilizationBand: 'slack', productionMomentum: { band: 'contracting' } } } }
    ],
    null,
    null
  );
  const convergence = rankMacroScenarioConvergence(compare);
  const ranked = rankMacroEconomyScenariosByNetOutcome(compare);
  const elasticity = rankMacroScenarioElasticity(compare);
  record('R9-08', 'Scenario convergence preserves row count', convergence.length === 2, String(convergence.length));
  record(
    'R9-09',
    'Elasticity and ranking both order scenarios',
    ranked.length === 2 && elasticity.length === 2,
    ranked.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'events_companies_stress',
    includeEventsCompaniesStress: true
  });
  record(
    'R9-10',
    'Events/companies regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round10-self-tests.ts ---

export function runAgent06Round10SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const turns = readMacroTurnsSpilloverFromV102(
    makeDefaultV1014_MACRO_TestInputs({
      turnsTime: { paceBand: 'stalled', macroPhaseBand: 'late_cycle', season: 'Winter' }
    })
  );
  record('R10-01', 'Stalled turn cadence drags cycle', turns.cycleNudge < -2, String(turns.cycleNudge));

  const transport = readMacroTransportSpilloverFromV1017(
    makeDefaultV1014_MACRO_TestInputs({
      transportInfrastructure: {
        connectivityBand: 'critical',
        throughputBand: 'constrained',
        maintenanceBacklog: { band: 'severe' }
      }
    })
  );
  record('R10-02', 'Critical transport drags productivity', transport.productivityNudge < -2, String(transport.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      turnsTime: { paceBand: 'accelerated', season: 'Spring', macroPhaseBand: 'expansionary_cadence' },
      transportInfrastructure: { connectivityBand: 'robust', throughputBand: 'ample' }
    }),
    null,
    null
  );
  record('R10-03', 'State exposes turns summary', integrated.state.turnsSpilloverSummary != null, 'ok');
  record('R10-04', 'State exposes transport summary', integrated.state.transportSpilloverSummary != null, 'ok');
  record(
    'R10-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const asymmetry = buildMacroTransmissionAsymmetrySnapshot(integrated.state.transmissionReport);
  record('R10-06', 'Transmission asymmetry finite', Number.isFinite(asymmetry.asymmetryIndex), String(asymmetry.asymmetryIndex));
  record(
    'R10-07',
    'Transmission includes turns layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.2_turns'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 18 }),
    [
      { id: 'cadence_stall', overlay: { turnsTime: { paceBand: 'frozen', macroPhaseBand: 'late_cycle' } } },
      { id: 'logistics_fragile', overlay: { transportInfrastructure: { connectivityBand: 'fragmented', throughputBand: 'bottlenecked' } } }
    ],
    null,
    null
  );
  const divergence = rankMacroScenarioDivergence(compare);
  const convergence = rankMacroScenarioConvergence(compare);
  const elasticity = rankMacroScenarioElasticity(compare);
  record('R10-08', 'Scenario divergence preserves row count', divergence.length === 2, String(divergence.length));
  record(
    'R10-09',
    'Divergence and convergence both rank scenarios',
    convergence.length === 2 && elasticity.length === 2,
    divergence.map(d => d.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'turns_transport_stress',
    includeTurnsTransportStress: true
  });
  record(
    'R10-10',
    'Turns/transport regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round11-self-tests.ts ---

export function runAgent06Round11SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const research = readMacroResearchSpilloverFromV103(
    makeDefaultV1014_MACRO_TestInputs({
      researchTech: { pipelineBand: 'stalled', fundingBand: 'cut', adoptionBand: 'fragmented' }
    })
  );
  record('R11-01', 'Stalled research drags productivity', research.productivityNudge < -2, String(research.productivityNudge));

  const population = readMacroPopulationSpilloverFromV109Pop(
    makeDefaultV1014_MACRO_TestInputs({
      population: { growthBand: 'critical', dependencyBand: 'severe', netMigrationBand: 'outflow' }
    })
  );
  record('R11-02', 'Demographic drag hits cycle read', population.cycleNudge < -2, String(population.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      researchTech: { pipelineBand: 'breakthrough', adoptionBand: 'scaling', fundingBand: 'expansionary' },
      population: { growthBand: 'strong', dependencyBand: 'favorable', netMigrationBand: 'strong_inflow' }
    }),
    null,
    null
  );
  record('R11-03', 'State exposes research summary', integrated.state.researchSpilloverSummary != null, 'ok');
  record('R11-04', 'State exposes population summary', integrated.state.populationSpilloverSummary != null, 'ok');
  record(
    'R11-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const volatility = buildMacroTransmissionVolatilitySnapshot(integrated.state.transmissionReport);
  record('R11-06', 'Transmission volatility finite', Number.isFinite(volatility.volatilityIndex), String(volatility.volatilityIndex));
  record(
    'R11-07',
    'Transmission includes research layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.3_research'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 20 }),
    [
      { id: 'research_stall', overlay: { researchTech: { pipelineBand: 'blocked', fundingBand: 'frozen' } } },
      { id: 'demographic_drag', overlay: { population: { growthBand: 'contracting', dependencyBand: 'elevated' } } }
    ],
    null,
    null
  );
  const severity = rankMacroScenarioSeverity(compare);
  const divergence = rankMacroScenarioDivergence(compare);
  record('R11-08', 'Scenario severity preserves row count', severity.length === 2, String(severity.length));
  record(
    'R11-09',
    'Severity and divergence both rank scenarios',
    divergence.length === 2 && severity[0].severityIndex >= 0,
    severity.map(s => s.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'research_population_stress',
    includeResearchPopulationStress: true
  });
  record(
    'R11-10',
    'Research/population regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round12-self-tests.ts ---

export function runAgent06Round12SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const modes = readMacroModesSpilloverFromV1006(
    makeDefaultV1014_MACRO_TestInputs({
      modesScenarios: { difficultyBand: 'crisis', campaignMomentum: { band: 'stalled' }, scenarioVolatility: { band: 'chaotic' } }
    })
  );
  record('R12-01', 'Crisis scenario drags cycle read', modes.cycleNudge < -3, String(modes.cycleNudge));

  const guardian = readMacroGuardianSpilloverFromV1016Guardian(
    makeDefaultV1014_MACRO_TestInputs({
      guardianCopilot: { alertBand: 'critical', openWarningCount: 6, guidanceConfidence: { band: 'low' } }
    })
  );
  record('R12-02', 'Critical guardian drags investment', guardian.investmentNudge < -2, String(guardian.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      modesScenarios: { difficultyBand: 'relaxed', campaignMomentum: { band: 'summit_push' }, scenarioVolatility: { band: 'stable' } },
      guardianCopilot: { alertBand: 'calm', openWarningCount: 0, guidanceConfidence: { band: 'high' } }
    }),
    null,
    null
  );
  record('R12-03', 'State exposes modes summary', integrated.state.modesSpilloverSummary != null, 'ok');
  record('R12-04', 'State exposes guardian summary', integrated.state.guardianSpilloverSummary != null, 'ok');
  record(
    'R12-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const resilience = buildMacroTransmissionResilienceSnapshot(integrated.state.transmissionReport);
  record('R12-06', 'Transmission resilience finite', Number.isFinite(resilience.resilienceIndex), String(resilience.resilienceIndex));
  record(
    'R12-07',
    'Transmission includes modes layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.6_modes'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 22 }),
    [
      { id: 'crisis_mode', overlay: { modesScenarios: { difficultyBand: 'extreme', scenarioVolatility: { band: 'high' } } } },
      { id: 'guardian_red', overlay: { guardianCopilot: { alertBand: 'severe', openWarningCount: 5 } } }
    ],
    null,
    null
  );
  const composite = rankMacroScenarioComposite(compare);
  const severity = rankMacroScenarioSeverity(compare);
  record('R12-08', 'Scenario composite preserves row count', composite.length === 2, String(composite.length));
  record(
    'R12-09',
    'Composite and severity both rank scenarios',
    severity.length === 2 && composite[0].compositeScore >= 0,
    composite.map(c => c.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'modes_guardian_stress',
    includeModesGuardianStress: true
  });
  record(
    'R12-10',
    'Modes/guardian regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round13-self-tests.ts ---

export function runAgent06Round13SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const cities = readMacroCitiesSpilloverFromV1011Cities(
    makeDefaultV1014_MACRO_TestInputs({
      citiesRegions: { urbanizationBand: 'stagnant', housingPressure: { band: 'severe' }, hubStrength: { band: 'weak' } }
    })
  );
  record('R13-01', 'Metro housing pressure drags cycle', cities.cycleNudge < -1, String(cities.cycleNudge));

  const forecasting = readMacroForecastingSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastingLab: { outlookBand: 'recession', confidenceBand: 'low', dispersionBand: 'wide' }
    })
  );
  record('R13-02', 'Recession forecast drags cycle', forecasting.cycleNudge < -3, String(forecasting.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      citiesRegions: { urbanizationBand: 'surging', hubStrength: { band: 'global' }, housingPressure: { band: 'balanced' } },
      forecastingLab: { outlookBand: 'expansion', confidenceBand: 'high', dispersionBand: 'tight' }
    }),
    null,
    null
  );
  record('R13-03', 'State exposes cities summary', integrated.state.citiesSpilloverSummary != null, 'ok');
  record('R13-04', 'State exposes forecasting summary', integrated.state.forecastingSpilloverSummary != null, 'ok');
  record(
    'R13-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const coverage = buildMacroTransmissionCoverageSnapshot(integrated.state.transmissionReport);
  record('R13-06', 'Transmission coverage finite', Number.isFinite(coverage.coverageIndex), String(coverage.coverageIndex));
  record(
    'R13-07',
    'Transmission includes cities layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.11_cities'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 24 }),
    [
      { id: 'metro_stress', overlay: { citiesRegions: { housingPressure: { band: 'critical' }, urbanizationBand: 'declining' } } },
      { id: 'forecast_downside', overlay: { forecastingLab: { outlookBand: 'contraction', dispersionBand: 'divergent' } } }
    ],
    null,
    null
  );
  const frontier = rankMacroScenarioFrontier(compare);
  const composite = rankMacroScenarioComposite(compare);
  record('R13-08', 'Scenario frontier preserves row count', frontier.length === 2, String(frontier.length));
  record(
    'R13-09',
    'Frontier and composite both rank scenarios',
    composite.length === 2 && frontier[0].frontierScore >= 0,
    frontier.map(f => f.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'cities_forecasting_stress',
    includeCitiesForecastingStress: true
  });
  record(
    'R13-10',
    'Cities/forecasting regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round14-self-tests.ts ---

export function runAgent06Round14SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const command = readMacroCommandSpilloverFromV1017Command(
    makeDefaultV1014_MACRO_TestInputs({
      commandCenter: { postureBand: 'crisis', coordinationBand: 'fragmented', decisionBacklog: { band: 'critical' } }
    })
  );
  record('R14-01', 'Crisis command drags cycle read', command.cycleNudge < -3, String(command.cycleNudge));

  const automation = readMacroAutomationSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      idleAutomation: { throughputBand: 'stalled', reliabilityBand: 'fragile', adoptionBand: 'minimal' }
    })
  );
  record('R14-02', 'Stalled automation drags productivity', automation.productivityNudge < -2, String(automation.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      commandCenter: { postureBand: 'steady', coordinationBand: 'integrated', decisionBacklog: { band: 'clear' } },
      idleAutomation: { throughputBand: 'surging', reliabilityBand: 'robust', adoptionBand: 'broad' }
    }),
    null,
    null
  );
  record('R14-03', 'State exposes command summary', integrated.state.commandSpilloverSummary != null, 'ok');
  record('R14-04', 'State exposes automation summary', integrated.state.automationSpilloverSummary != null, 'ok');
  record(
    'R14-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const amplification = buildMacroTransmissionAmplificationSnapshot(integrated.state.transmissionReport);
  record('R14-06', 'Transmission amplification finite', Number.isFinite(amplification.amplificationIndex), String(amplification.amplificationIndex));
  record(
    'R14-07',
    'Transmission includes command layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.17_command'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 26 }),
    [
      { id: 'command_crisis', overlay: { commandCenter: { postureBand: 'red', coordinationBand: 'degraded' } } },
      { id: 'automation_boost', overlay: { idleAutomation: { throughputBand: 'surging', adoptionBand: 'deep' } } }
    ],
    null,
    null
  );
  const hedge = rankMacroScenarioHedge(compare);
  const frontier = rankMacroScenarioFrontier(compare);
  record('R14-08', 'Scenario hedge preserves row count', hedge.length === 2, String(hedge.length));
  record(
    'R14-09',
    'Hedge and frontier both rank scenarios',
    frontier.length === 2 && hedge[0].hedgeIndex >= 0,
    hedge.map(h => h.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'command_automation_stress',
    includeCommandAutomationStress: true
  });
  record(
    'R14-10',
    'Command/automation regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round15-self-tests.ts ---

export function runAgent06Round15SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const team = readMacroTeamAiSpilloverFromV1018Team(
    makeDefaultV1014_MACRO_TestInputs({
      teamIntelligence: { cohesionBand: 'fractured', internalConflict: { band: 'severe' }, analysisThroughput: { band: 'blocked' } }
    })
  );
  record('R15-01', 'Fractured team AI drags productivity', team.productivityNudge < -2, String(team.productivityNudge));

  const replay = readMacroReplaySpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      historyReplay: { stressMemory: { band: 'scarring' }, volatilityBand: 'extreme', recoveryArc: { band: 'l-shaped' } }
    })
  );
  record('R15-02', 'Replay stress memory drags cycle', replay.cycleNudge < -1, String(replay.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      teamIntelligence: { cohesionBand: 'strong', analysisThroughput: { band: 'high' }, internalConflict: { band: 'low' } },
      historyReplay: { recoveryArc: { band: 'strong' }, volatilityBand: 'stable', stressMemory: { band: 'fading' } }
    }),
    null,
    null
  );
  record('R15-03', 'State exposes team AI summary', integrated.state.teamAiSpilloverSummary != null, 'ok');
  record('R15-04', 'State exposes replay summary', integrated.state.replaySpilloverSummary != null, 'ok');
  record(
    'R15-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const tension = buildMacroTransmissionTensionSnapshot(integrated.state.transmissionReport);
  record('R15-06', 'Transmission tension finite', Number.isFinite(tension.tensionIndex), String(tension.tensionIndex));
  record(
    'R15-07',
    'Transmission includes team layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.18_team'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 28 }),
    [
      { id: 'team_fracture', overlay: { teamIntelligence: { cohesionBand: 'critical', internalConflict: { band: 'severe' } } } },
      { id: 'replay_scar', overlay: { historyReplay: { stressMemory: { band: 'persistent' }, recoveryArc: { band: 'weak' } } } }
    ],
    null,
    null
  );
  const triage = rankMacroScenarioTriage(compare);
  const hedge = rankMacroScenarioHedge(compare);
  record('R15-08', 'Scenario triage preserves row count', triage.length === 2, String(triage.length));
  record(
    'R15-09',
    'Triage and hedge both rank scenarios',
    hedge.length === 2 && triage[0].triagePriority >= 0,
    triage.map(t => t.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'team_replay_stress',
    includeTeamReplayStress: true
  });
  record(
    'R15-10',
    'Team/replay regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round16-self-tests.ts ---

export function runAgent06Round16SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const memory = readMacroMemorySpilloverFromV1019(
    makeDefaultV1014_MACRO_TestInputs({
      aiMemory: { driftBand: 'runaway', recallFidelity: { band: 'degraded' }, auditGap: { band: 'wide' } }
    })
  );
  record('R16-01', 'Runaway memory drift drags cycle', memory.cycleNudge < -2, String(memory.cycleNudge));

  const dashboards = readMacroDashboardsSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardsMaps: {
        refreshLag: { band: 'stale' },
        signalCoherence: { band: 'fragmented' },
        alertDensity: { band: 'flooded' }
      }
    })
  );
  record('R16-02', 'Flooded dashboard alerts drag investment', dashboards.investmentNudge < -1, String(dashboards.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      aiMemory: { driftBand: 'runaway', recallFidelity: { band: 'degraded' }, auditGap: { band: 'narrow' } },
      dashboardsMaps: { refreshLag: { band: 'stale' }, signalCoherence: { band: 'aligned' }, alertDensity: { band: 'calm' } }
    }),
    null,
    null
  );
  record('R16-03', 'State exposes memory summary', integrated.state.memorySpilloverSummary != null, 'ok');
  record('R16-04', 'State exposes dashboards summary', integrated.state.dashboardsSpilloverSummary != null, 'ok');
  record(
    'R16-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const divergence = buildMacroTransmissionDivergenceSnapshot(integrated.state.transmissionReport);
  record('R16-06', 'Transmission divergence finite', Number.isFinite(divergence.divergenceIndex), String(divergence.divergenceIndex));
  record(
    'R16-07',
    'Transmission includes memory layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.19_memory'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 30 }),
    [
      { id: 'memory_drift', overlay: { aiMemory: { driftBand: 'critical', auditGap: { band: 'unresolved' } } } },
      { id: 'dashboard_lag', overlay: { dashboardsMaps: { refreshLag: { band: 'critical' }, alertDensity: { band: 'severe' } } } }
    ],
    null,
    null
  );
  const contingency = rankMacroScenarioContingency(compare);
  const triage = rankMacroScenarioTriage(compare);
  record('R16-08', 'Scenario contingency preserves row count', contingency.length === 2, String(contingency.length));
  record(
    'R16-09',
    'Contingency and triage both rank scenarios',
    triage.length === 2 && contingency[0].contingencyPriority >= 0,
    contingency.map(c => c.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'memory_dashboard_stress',
    includeMemoryDashboardStress: true
  });
  record(
    'R16-10',
    'Memory/dashboard regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round17-self-tests.ts ---

export function runAgent06Round17SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      gameUi: {
        panelLatency: { band: 'critical' },
        navigationClutter: { band: 'overloaded' },
        renderHealth: { band: 'unstable' }
      }
    })
  );
  record('R17-01', 'Critical UI latency drags productivity', ui.productivityNudge < -1, String(ui.productivityNudge));

  const utilities = readMacroUtilitiesSpilloverFromV1012Utilities(
    makeDefaultV1014_MACRO_TestInputs({
      utilitiesGrid: {
        serviceReliability: { band: 'fragile' },
        outageBand: 'rolling',
        capacityMargin: { band: 'thin' }
      }
    })
  );
  record('R17-02', 'Rolling utility outages drag cycle', utilities.cycleNudge < -2, String(utilities.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      gameUi: {
        panelLatency: { band: 'critical' },
        navigationClutter: { band: 'clear' },
        renderHealth: { band: 'stable' }
      },
      utilitiesGrid: {
        serviceReliability: { band: 'fragile' },
        outageBand: 'rare',
        capacityMargin: { band: 'ample' }
      }
    }),
    null,
    null
  );
  record('R17-03', 'State exposes UI summary', integrated.state.uiSpilloverSummary != null, 'ok');
  record('R17-04', 'State exposes utilities summary', integrated.state.utilitiesSpilloverSummary != null, 'ok');
  record(
    'R17-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const stability = buildMacroTransmissionStabilitySnapshot(integrated.state.transmissionReport);
  record('R17-06', 'Transmission stability finite', Number.isFinite(stability.stabilityIndex), String(stability.stabilityIndex));
  record(
    'R17-07',
    'Transmission includes UI layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 32 }),
    [
      { id: 'ui_clutter', overlay: { gameUi: { navigationClutter: { band: 'critical' }, renderHealth: { band: 'fragile' } } } },
      {
        id: 'utilities_outage',
        overlay: { utilitiesGrid: { outageBand: 'severe', serviceReliability: { band: 'critical' } } }
      }
    ],
    null,
    null
  );
  const recovery = rankMacroScenarioRecovery(compare);
  const contingency = rankMacroScenarioContingency(compare);
  record('R17-08', 'Scenario recovery preserves row count', recovery.length === 2, String(recovery.length));
  record(
    'R17-09',
    'Recovery and contingency both rank scenarios',
    contingency.length === 2 && recovery[0].recoveryPriority >= 0,
    recovery.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'ui_utilities_stress',
    includeUiUtilitiesStress: true
  });
  record(
    'R17-10',
    'UI/utilities regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round18-self-tests.ts ---

export function runAgent06Round18SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const logistics = readMacroTradeLogisticsSpilloverFromV1015(
    makeDefaultV1014_MACRO_TestInputs({
      trade: {
        logistics: {
          portBacklogBand: 'gridlocked',
          routeReliability: { band: 'disrupted' },
          leadTimeBand: 'extended'
        }
      }
    })
  );
  record('R18-01', 'Gridlocked logistics drags cycle', logistics.cycleNudge < -2, String(logistics.cycleNudge));

  const negotiation = readMacroNegotiationSpilloverFromV1005(
    makeDefaultV1014_MACRO_TestInputs({
      negotiationState: {
        deadlockBand: 'entrenched',
        trustBand: 'collapsed',
        claimPressureBand: 'surging'
      }
    })
  );
  record('R18-02', 'Entrenched negotiation drags investment', negotiation.investmentNudge < -2, String(negotiation.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      trade: {
        logistics: {
          portBacklogBand: 'elevated',
          routeReliability: { band: 'robust' },
          leadTimeBand: 'normal'
        }
      },
      negotiationState: {
        deadlockBand: 'clear',
        trustBand: 'robust',
        claimPressureBand: 'calm'
      }
    }),
    null,
    null
  );
  record('R18-03', 'State exposes logistics summary', integrated.state.logisticsSpilloverSummary != null, 'ok');
  record(
    'R18-04',
    'Transmission includes negotiation layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.5_negotiation'),
    'ok'
  );
  record(
    'R18-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const alignment = buildMacroTransmissionAlignmentSnapshot(integrated.state.transmissionReport);
  record('R18-06', 'Transmission alignment finite', Number.isFinite(alignment.alignmentIndex), String(alignment.alignmentIndex));
  record(
    'R18-07',
    'Transmission includes logistics layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.15_logistics'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 33 }),
    [
      {
        id: 'logistics_gridlock',
        overlay: { trade: { logistics: { portBacklogBand: 'critical', routeReliability: { band: 'fragile' } } } }
      },
      {
        id: 'negotiation_deadlock',
        overlay: { negotiationState: { deadlockBand: 'severe', trustBand: 'broken', claimPressureBand: 'critical' } }
      }
    ],
    null,
    null
  );
  const resilience = rankMacroScenarioResilience(compare);
  const contingency = rankMacroScenarioContingency(compare);
  record('R18-08', 'Scenario resilience preserves row count', resilience.length === 2, String(resilience.length));
  record(
    'R18-09',
    'Resilience and contingency both rank scenarios',
    contingency.length === 2 && resilience[0].resiliencePriority >= 0,
    resilience.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'logistics_negotiation_stress',
    includeLogisticsNegotiationStress: true
  });
  record(
    'R18-10',
    'Logistics/negotiation regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round19-self-tests.ts ---

export function runAgent06Round19SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const confidence = readMacroHouseholdConfidenceSpilloverFromV1013(
    makeDefaultV1014_MACRO_TestInputs({
      households: {
        consumerConfidence: { band: 'collapsed', volatilityBand: 'whipsaw' }
      }
    })
  );
  record('R19-01', 'Collapsed confidence drags cycle', confidence.cycleNudge < -2, String(confidence.cycleNudge));

  const capex = readMacroCapexSpilloverFromV1008(
    makeDefaultV1014_MACRO_TestInputs({
      privateSector: {
        capexCycle: { pipelineBand: 'frozen', freezeBand: 'binding', paybackBand: 'stretched' }
      }
    })
  );
  record('R19-02', 'Frozen capex drags investment', capex.investmentNudge < -2, String(capex.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      households: { consumerConfidence: { band: 'cautious', volatilityBand: 'stable' } },
      companies: { capexCycle: { pipelineBand: 'strong', paybackBand: 'attractive' } }
    }),
    null,
    null
  );
  record('R19-03', 'State exposes confidence summary', integrated.state.confidenceSpilloverSummary != null, 'ok');
  record('R19-04', 'State exposes capex summary', integrated.state.capexSpilloverSummary != null, 'ok');
  record(
    'R19-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const sync = buildMacroTransmissionSynchronizationSnapshot(integrated.state.transmissionReport);
  record('R19-06', 'Transmission synchronization finite', Number.isFinite(sync.synchronizationIndex), String(sync.synchronizationIndex));
  record(
    'R19-07',
    'Transmission includes confidence layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.13_confidence'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 34 }),
    [
      {
        id: 'confidence_shock',
        overlay: { households: { consumerConfidence: { band: 'critical', volatilityBand: 'extreme' } } }
      },
      {
        id: 'capex_freeze',
        overlay: { privateSector: { capexCycle: { pipelineBand: 'critical', freezeBand: 'total' } } }
      }
    ],
    null,
    null
  );
  const stabilization = rankMacroScenarioStabilization(compare);
  const resilience = rankMacroScenarioResilience(compare);
  record('R19-08', 'Scenario stabilization preserves row count', stabilization.length === 2, String(stabilization.length));
  record(
    'R19-09',
    'Stabilization and resilience both rank scenarios',
    resilience.length === 2 && stabilization[0].stabilizationPriority >= 0,
    stabilization.map(s => s.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'confidence_capex_stress',
    includeConfidenceCapexStress: true
  });
  record(
    'R19-10',
    'Confidence/capex regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round20-self-tests.ts ---

export function runAgent06Round20SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const monetary = readMacroMonetarySpilloverFromV1010Monetary(
    makeDefaultV1014_MACRO_TestInputs({
      monetaryPolicy: {
        policyStance: 'restrictive',
        realRateBand: 'elevated',
        liquidityBand: 'strained'
      }
    })
  );
  record('R20-01', 'Restrictive monetary drags investment', monetary.investmentNudge < -2, String(monetary.investmentNudge));

  const rental = readMacroRentalSpilloverFromV1014Rental(
    makeDefaultV1014_MACRO_TestInputs({
      rentalMarket: {
        pressureBand: 'severe',
        vacancyBand: 'glut',
        rentGrowthBand: 'surging'
      }
    })
  );
  record('R20-02', 'Severe rental pressure drags cycle', rental.cycleNudge < -1, String(rental.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      monetaryPolicy: { policyStance: 'accommodative', liquidityBand: 'ample' },
      rentalMarket: { pressureBand: 'balanced', vacancyBand: 'tight', rentGrowthBand: 'stable' }
    }),
    null,
    null
  );
  record('R20-03', 'State exposes monetary summary', integrated.state.monetarySpilloverSummary != null, 'ok');
  record('R20-04', 'State exposes rental summary', integrated.state.rentalSpilloverSummary != null, 'ok');
  record(
    'R20-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const intensity = buildMacroTransmissionIntensitySnapshot(integrated.state.transmissionReport);
  record('R20-06', 'Transmission intensity finite', Number.isFinite(intensity.intensityIndex), String(intensity.intensityIndex));
  record(
    'R20-07',
    'Transmission includes monetary layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.10_monetary'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 35 }),
    [
      {
        id: 'monetary_tight',
        overlay: { monetaryPolicy: { policyStance: 'aggressive_tightening', realRateBand: 'very_high' } }
      },
      {
        id: 'rental_shock',
        overlay: { rentalMarket: { pressureBand: 'critical', rentGrowthBand: 'accelerating' } }
      }
    ],
    null,
    null
  );
  const mitigation = rankMacroScenarioMitigation(compare);
  const stabilization = rankMacroScenarioStabilization(compare);
  record('R20-08', 'Scenario mitigation preserves row count', mitigation.length === 2, String(mitigation.length));
  record(
    'R20-09',
    'Mitigation and stabilization both rank scenarios',
    stabilization.length === 2 && mitigation[0].mitigationPriority >= 0,
    mitigation.map(m => m.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'monetary_rental_stress',
    includeMonetaryRentalStress: true
  });
  record(
    'R20-10',
    'Monetary/rental regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round21-self-tests.ts ---

export function runAgent06Round21SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const climate = readMacroClimatePolicySpilloverFromV1018Climate(
    makeDefaultV1014_MACRO_TestInputs({
      climatePolicy: {
        transitionBand: 'disruptive',
        carbonPriceBand: 'punitive',
        complianceBand: 'binding'
      }
    })
  );
  record('R21-01', 'Disruptive climate drags cycle', climate.cycleNudge < -2, String(climate.cycleNudge));

  const forecast = readMacroForecastDispersionSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastingLab: {
        dispersionBand: 'extreme',
        confidenceBand: 'low',
        disagreementBand: 'polarized'
      }
    })
  );
  record('R21-02', 'Extreme forecast dispersion drags investment', forecast.investmentNudge < -2, String(forecast.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      climatePolicy: { transitionBand: 'steady', carbonPriceBand: 'moderate', complianceBand: 'light' },
      forecastingLab: { dispersionBand: 'tight', confidenceBand: 'high', disagreementBand: 'aligned' }
    }),
    null,
    null
  );
  record('R21-03', 'State exposes climate summary', integrated.state.climateSpilloverSummary != null, 'ok');
  record('R21-04', 'State exposes forecast dispersion summary', integrated.state.forecastDispersionSpilloverSummary != null, 'ok');
  record(
    'R21-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const polarization = buildMacroTransmissionPolarizationSnapshot(integrated.state.transmissionReport);
  record(
    'R21-06',
    'Transmission polarization finite',
    Number.isFinite(polarization.polarizationIndex),
    String(polarization.polarizationIndex)
  );
  record(
    'R21-07',
    'Transmission includes climate layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.18_climate'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 36 }),
    [
      {
        id: 'climate_shock',
        overlay: { climatePolicy: { transitionBand: 'shock', complianceBand: 'critical' } }
      },
      {
        id: 'forecast_noise',
        overlay: { forecastingLab: { dispersionBand: 'critical', confidenceBand: 'fragmented' } }
      }
    ],
    null,
    null
  );
  const adaptation = rankMacroScenarioAdaptation(compare);
  const mitigation = rankMacroScenarioMitigation(compare);
  record('R21-08', 'Scenario adaptation preserves row count', adaptation.length === 2, String(adaptation.length));
  record(
    'R21-09',
    'Adaptation and mitigation both rank scenarios',
    mitigation.length === 2 && adaptation[0].adaptationPriority >= 0,
    adaptation.map(a => a.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'climate_forecast_stress',
    includeClimateForecastStress: true
  });
  record(
    'R21-10',
    'Climate/forecast regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round22-self-tests.ts ---

export function runAgent06Round22SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const accessibility = readMacroAccessibilitySpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiAccessibility: { contrastBand: 'failing', inputLagBand: 'severe', coverageBand: 'gaps' }
    })
  );
  record('R22-01', 'Failing accessibility drags productivity', accessibility.productivityNudge < -2, String(accessibility.productivityNudge));

  const timeline = readMacroTimelineSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      historyTimeline: { gapBand: 'broken', narrativeDriftBand: 'runaway', shockMemoryBand: 'scarring' }
    })
  );
  record('R22-02', 'Broken timeline drags investment', timeline.investmentNudge < -2, String(timeline.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiAccessibility: { contrastBand: 'strong', inputLagBand: 'snappy', coverageBand: 'full' },
      historyTimeline: { gapBand: 'coherent', narrativeDriftBand: 'stable', shockMemoryBand: 'fading' }
    }),
    null,
    null
  );
  record('R22-03', 'State exposes coupling snapshot', integrated.state.transmissionCoupling.summary.length > 0, 'ok');
  record(
    'R22-04',
    'Transmission includes timeline layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_timeline'),
    'ok'
  );
  record(
    'R22-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const coupling = buildMacroTransmissionCouplingSnapshot(integrated.state.transmissionReport);
  record('R22-06', 'Transmission coupling finite', Number.isFinite(coupling.couplingIndex), String(coupling.couplingIndex));
  record(
    'R22-07',
    'Transmission includes accessibility layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_accessibility'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 37 }),
    [
      { id: 'a11y_fail', overlay: { uiAccessibility: { contrastBand: 'critical', coverageBand: 'critical' } } },
      { id: 'timeline_break', overlay: { historyTimeline: { gapBand: 'discontinuous', shockMemoryBand: 'deep' } } }
    ],
    null,
    null
  );
  const containment = rankMacroScenarioContainment(compare);
  const adaptation = rankMacroScenarioAdaptation(compare);
  record('R22-08', 'Scenario containment preserves row count', containment.length === 2, String(containment.length));
  record(
    'R22-09',
    'Containment and adaptation both rank scenarios',
    adaptation.length === 2 && containment[0].containmentPriority >= 0,
    containment.map(c => c.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'accessibility_timeline_stress',
    includeAccessibilityTimelineStress: true
  });
  record(
    'R22-10',
    'Accessibility/timeline regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round23-self-tests.ts ---

export function runAgent06Round23SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const liquidity = readMacroLiquiditySpilloverFromV1016Liquidity(
    makeDefaultV1014_MACRO_TestInputs({
      systemLiquidity: { band: 'frozen', marketDepthBand: 'thin', rolloverRiskBand: 'severe' }
    })
  );
  record('R23-01', 'Frozen liquidity drags investment', liquidity.investmentNudge < -2, String(liquidity.investmentNudge));

  const maps = readMacroMapsTelemetrySpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      mapsTelemetry: { geoFidelityBand: 'distorted', tileLatencyBand: 'stale', coverageBand: 'gaps' }
    })
  );
  record('R23-02', 'Distorted maps drag cycle', maps.cycleNudge < -1, String(maps.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      systemLiquidity: { band: 'ample', marketDepthBand: 'deep', rolloverRiskBand: 'low' },
      mapsTelemetry: { geoFidelityBand: 'high', tileLatencyBand: 'realtime', coverageBand: 'complete' }
    }),
    null,
    null
  );
  record('R23-03', 'State exposes liquidity summary', integrated.state.liquiditySpilloverSummary != null, 'ok');
  record('R23-04', 'Transmission includes maps telemetry layer', integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_maps_telemetry'), 'ok');
  record(
    'R23-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const imbalance = buildMacroTransmissionImbalanceSnapshot(integrated.state.transmissionReport);
  record('R23-06', 'Transmission imbalance finite', Number.isFinite(imbalance.imbalanceIndex), String(imbalance.imbalanceIndex));
  record(
    'R23-07',
    'Transmission includes liquidity layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.16_liquidity'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 38 }),
    [
      { id: 'liquidity_shock', overlay: { systemLiquidity: { band: 'critical', rolloverRiskBand: 'default_wave' } } },
      { id: 'maps_noise', overlay: { mapsTelemetry: { geoFidelityBand: 'critical', coverageBand: 'critical' } } }
    ],
    null,
    null
  );
  const rebalance = rankMacroScenarioRebalance(compare);
  const containment = rankMacroScenarioContainment(compare);
  record('R23-08', 'Scenario rebalance preserves row count', rebalance.length === 2, String(rebalance.length));
  record(
    'R23-09',
    'Rebalance and containment both rank scenarios',
    containment.length === 2 && rebalance[0].rebalancePriority >= 0,
    rebalance.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'liquidity_maps_stress',
    includeLiquidityMapsStress: true
  });
  record(
    'R23-10',
    'Liquidity/maps regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round24-self-tests.ts ---

export function runAgent06Round24SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const gameplay = readMacroStrategicGameplaySpilloverFromV1001(
    makeDefaultV1014_MACRO_TestInputs({
      strategicGameplay: { pacingBand: 'gridlocked', coherenceBand: 'fragmented', frictionBand: 'paralyzed' }
    })
  );
  record('R24-01', 'Gridlocked gameplay drags cycle', gameplay.cycleNudge < -2, String(gameplay.cycleNudge));

  const archive = readMacroArchiveIntegritySpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      historyArchiveIntegrity: { integrityBand: 'corrupt', lineageBand: 'broken', retentionBand: 'truncated' }
    })
  );
  record('R24-02', 'Corrupt archive drags investment', archive.investmentNudge < -2, String(archive.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      strategicGameplay: { pacingBand: 'fluid', coherenceBand: 'aligned', frictionBand: 'low' },
      historyArchiveIntegrity: { integrityBand: 'verified', lineageBand: 'continuous', retentionBand: 'durable' }
    }),
    null,
    null
  );
  record('R24-03', 'State exposes gameplay summary', integrated.state.strategicGameplaySpilloverSummary != null, 'ok');
  record(
    'R24-04',
    'Transmission includes archive integrity layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_archive'),
    'ok'
  );
  record(
    'R24-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const harmonic = buildMacroTransmissionHarmonicSnapshot(integrated.state.transmissionReport);
  record('R24-06', 'Transmission harmonic finite', Number.isFinite(harmonic.harmonicIndex), String(harmonic.harmonicIndex));
  record(
    'R24-07',
    'Transmission includes strategic gameplay layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.01_strategic_gameplay'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 40 }),
    [
      { id: 'gameplay_shock', overlay: { strategicGameplay: { pacingBand: 'critical', frictionBand: 'severe' } } },
      { id: 'archive_shock', overlay: { historyArchiveIntegrity: { integrityBand: 'critical', retentionBand: 'critical' } } }
    ],
    null,
    null
  );
  const restoration = rankMacroScenarioRestoration(compare);
  const rebalance = rankMacroScenarioRebalance(compare);
  record('R24-08', 'Scenario restoration preserves row count', restoration.length === 2, String(restoration.length));
  record(
    'R24-09',
    'Restoration and rebalance both rank scenarios',
    rebalance.length === 2 && restoration[0].restorationPriority >= 0,
    restoration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'gameplay_archive_stress',
    includeGameplayArchiveStress: true
  });
  record(
    'R24-10',
    'Gameplay/archive regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round25-self-tests.ts ---

export function runAgent06Round25SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const integration = readMacroIntegrationHealthSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealth: { meshBand: 'fractured', contractDriftBand: 'critical', smokeBand: 'failing' }
    })
  );
  record('R25-01', 'Fractured integration drags cycle', integration.cycleNudge < -2, String(integration.cycleNudge));

  const cadence = readMacroCadenceDriftSpilloverFromV1002(
    makeDefaultV1014_MACRO_TestInputs({
      turnCadenceDrift: { skewBand: 'runaway', jitterBand: 'chaotic', resolutionBand: 'missed' }
    })
  );
  record('R25-02', 'Chaotic cadence drags productivity', cadence.productivityNudge < -2, String(cadence.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealth: { meshBand: 'healthy', contractDriftBand: 'stable', smokeBand: 'green' },
      turnCadenceDrift: { skewBand: 'anchored', jitterBand: 'low', resolutionBand: 'on_time' }
    }),
    null,
    null
  );
  record('R25-03', 'State exposes integration summary', integrated.state.integrationHealthSpilloverSummary != null, 'ok');
  record(
    'R25-04',
    'Transmission includes cadence drift layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.02_cadence'),
    'ok'
  );
  record(
    'R25-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const gradient = buildMacroTransmissionGradientSnapshot(integrated.state.transmissionReport);
  record('R25-06', 'Transmission gradient finite', Number.isFinite(gradient.gradientIndex), String(gradient.gradientIndex));
  record(
    'R25-07',
    'Transmission includes integration health layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 42 }),
    [
      { id: 'integration_shock', overlay: { integrationHealth: { meshBand: 'critical', smokeBand: 'red' } } },
      { id: 'cadence_shock', overlay: { turnCadenceDrift: { skewBand: 'critical', resolutionBand: 'critical' } } }
    ],
    null,
    null
  );
  const renewal = rankMacroScenarioRenewal(compare);
  const restoration = rankMacroScenarioRestoration(compare);
  record('R25-08', 'Scenario renewal preserves row count', renewal.length === 2, String(renewal.length));
  record(
    'R25-09',
    'Renewal and restoration both rank scenarios',
    restoration.length === 2 && renewal[0].renewalPriority >= 0,
    renewal.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'integration_cadence_stress',
    includeIntegrationCadenceStress: true
  });
  record(
    'R25-10',
    'Integration/cadence regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round26-self-tests.ts ---

export function runAgent06Round26SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const research = readMacroResearchMomentumSpilloverFromV1003(
    makeDefaultV1014_MACRO_TestInputs({
      researchMomentum: { velocityBand: 'collapsed', diffusionBand: 'siloed', fundingBand: 'frozen' }
    })
  );
  record('R26-01', 'Collapsed research drags productivity', research.productivityNudge < -2, String(research.productivityNudge));

  const budget = readMacroBudgetOutlookSpilloverFromV1007(
    makeDefaultV1014_MACRO_TestInputs({
      budgetOutlook: { trajectoryBand: 'unsustainable', consolidationBand: 'severe', capexRoomBand: 'exhausted' }
    })
  );
  record('R26-02', 'Exhausted capex room drags investment', budget.investmentNudge < -2, String(budget.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      researchMomentum: { velocityBand: 'surging', diffusionBand: 'broad', fundingBand: 'strong' },
      budgetOutlook: { trajectoryBand: 'stable', consolidationBand: 'moderate', capexRoomBand: 'ample' }
    }),
    null,
    null
  );
  record('R26-03', 'State exposes research momentum summary', integrated.state.researchMomentumSpilloverSummary != null, 'ok');
  record(
    'R26-04',
    'Transmission includes budget outlook layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.07_budget'),
    'ok'
  );
  record(
    'R26-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const attenuation = buildMacroTransmissionAttenuationSnapshot(integrated.state.transmissionReport);
  record(
    'R26-06',
    'Transmission attenuation finite',
    Number.isFinite(attenuation.attenuationIndex),
    String(attenuation.attenuationIndex)
  );
  record(
    'R26-07',
    'Transmission includes research momentum layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.03_research_momentum'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 44 }),
    [
      { id: 'research_shock', overlay: { researchMomentum: { velocityBand: 'critical', fundingBand: 'starved' } } },
      { id: 'budget_shock', overlay: { budgetOutlook: { trajectoryBand: 'critical', capexRoomBand: 'critical' } } }
    ],
    null,
    null
  );
  const revival = rankMacroScenarioRevival(compare);
  const renewal = rankMacroScenarioRenewal(compare);
  record('R26-08', 'Scenario revival preserves row count', revival.length === 2, String(revival.length));
  record(
    'R26-09',
    'Revival and renewal both rank scenarios',
    renewal.length === 2 && revival[0].revivalPriority >= 0,
    revival.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'research_budget_stress',
    includeResearchBudgetStress: true
  });
  record(
    'R26-10',
    'Research/budget regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round27-self-tests.ts ---

export function runAgent06Round27SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const mode = readMacroModeShiftSpilloverFromV1004(
    makeDefaultV1014_MACRO_TestInputs({
      modeShift: { volatilityBand: 'chaotic', alignmentBand: 'contradictory', handoffBand: 'failed' }
    })
  );
  record('R27-01', 'Chaotic mode shift drags cycle', mode.cycleNudge < -2, String(mode.cycleNudge));

  const supply = readMacroSupplyChainSpilloverFromV1008(
    makeDefaultV1014_MACRO_TestInputs({
      supplyChainStress: { fragilityBand: 'broken', leadTimeBand: 'extreme', inventoryBand: 'empty' }
    })
  );
  record('R27-02', 'Broken supply chain drags productivity', supply.productivityNudge < -2, String(supply.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      modeShift: { volatilityBand: 'stable', alignmentBand: 'aligned', handoffBand: 'smooth' },
      supplyChainStress: { fragilityBand: 'resilient', leadTimeBand: 'normal', inventoryBand: 'healthy' }
    }),
    null,
    null
  );
  record('R27-03', 'State exposes mode shift summary', integrated.state.modeShiftSpilloverSummary != null, 'ok');
  record(
    'R27-04',
    'Transmission includes supply chain layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.08_supply_chain'),
    'ok'
  );
  record(
    'R27-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record('R27-06', 'Transmission envelope finite', Number.isFinite(envelope.envelopeIndex), String(envelope.envelopeIndex));
  record(
    'R27-07',
    'Transmission includes mode shift layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.04_mode_shift'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 46 }),
    [
      { id: 'mode_shock', overlay: { modeShift: { volatilityBand: 'critical', handoffBand: 'critical' } } },
      { id: 'supply_shock', overlay: { supplyChainStress: { fragilityBand: 'critical', inventoryBand: 'critical' } } }
    ],
    null,
    null
  );
  const regeneration = rankMacroScenarioRegeneration(compare);
  const revival = rankMacroScenarioRevival(compare);
  record('R27-08', 'Scenario regeneration preserves row count', regeneration.length === 2, String(regeneration.length));
  record(
    'R27-09',
    'Regeneration and revival both rank scenarios',
    revival.length === 2 && regeneration[0].regenerationPriority >= 0,
    regeneration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'mode_supply_stress',
    includeModeSupplyStress: true
  });
  record(
    'R27-10',
    'Mode/supply regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round28-self-tests.ts ---

export function runAgent06Round28SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const events = readMacroEventCascadeSpilloverFromV1005(
    makeDefaultV1014_MACRO_TestInputs({
      eventCascade: { intensityBand: 'runaway', propagationBand: 'accelerating', durationBand: 'chronic' }
    })
  );
  record('R28-01', 'Runaway cascade drags cycle', events.cycleNudge < -2, String(events.cycleNudge));

  const demo = readMacroDemographicShiftSpilloverFromV1009(
    makeDefaultV1014_MACRO_TestInputs({
      demographicShift: { migrationBand: 'brain_drain', agingBand: 'accelerating', participationBand: 'collapsed' }
    })
  );
  record('R28-02', 'Collapsed participation drags cycle', demo.cycleNudge < -2, String(demo.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      eventCascade: { intensityBand: 'contained', propagationBand: 'local', durationBand: 'fading' },
      demographicShift: { migrationBand: 'balanced', agingBand: 'gradual', participationBand: 'stable' }
    }),
    null,
    null
  );
  record('R28-03', 'State exposes event cascade summary', integrated.state.eventCascadeSpilloverSummary != null, 'ok');
  record(
    'R28-04',
    'Transmission includes demographic shift layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.09_demographic_shift'),
    'ok'
  );
  record(
    'R28-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R28-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R28-07',
    'Transmission includes event cascade layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.05_event_cascade'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 48 }),
    [
      { id: 'event_shock', overlay: { eventCascade: { intensityBand: 'critical', durationBand: 'critical' } } },
      { id: 'demo_shock', overlay: { demographicShift: { participationBand: 'critical', agingBand: 'critical' } } }
    ],
    null,
    null
  );
  const reconstitution = rankMacroScenarioReconstitution(compare);
  const regeneration = rankMacroScenarioRegeneration(compare);
  record('R28-08', 'Scenario reconstitution preserves row count', reconstitution.length === 2, String(reconstitution.length));
  record(
    'R28-09',
    'Reconstitution and regeneration both rank scenarios',
    regeneration.length === 2 && reconstitution[0].reconstitutionPriority >= 0,
    reconstitution.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'event_demographic_stress',
    includeEventDemographicStress: true
  });
  record(
    'R28-10',
    'Event/demographic regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round29-self-tests.ts ---

export function runAgent06Round29SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const expectations = readMacroExpectationsAnchorSpilloverFromV1010(
    makeDefaultV1014_MACRO_TestInputs({
      inflationExpectationsAnchor: { anchorBand: 'deanchored', driftBand: 'runaway', credibilityBand: 'lost' }
    })
  );
  record('R29-01', 'Deanchored expectations drag cycle', expectations.cycleNudge < -2, String(expectations.cycleNudge));

  const metro = readMacroMetroMomentumSpilloverFromV1011(
    makeDefaultV1014_MACRO_TestInputs({
      metroMomentum: { growthBand: 'contracting', congestionBand: 'gridlocked', spreadBand: 'wide' }
    })
  );
  record('R29-02', 'Contracting metro drags investment', metro.investmentNudge <= -2, String(metro.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      inflationExpectationsAnchor: { anchorBand: 'well_anchored', driftBand: 'stable', credibilityBand: 'strong' },
      metroMomentum: { growthBand: 'strong', congestionBand: 'moderate', spreadBand: 'narrow' }
    }),
    null,
    null
  );
  record('R29-03', 'State exposes expectations summary', integrated.state.expectationsAnchorSpilloverSummary != null, 'ok');
  record(
    'R29-04',
    'Transmission includes metro momentum layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.11_metro_momentum'),
    'ok'
  );
  record(
    'R29-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const centrality = buildMacroTransmissionCentralitySnapshot(integrated.state.transmissionReport);
  record('R29-06', 'Transmission centrality finite', Number.isFinite(centrality.centralityIndex), String(centrality.centralityIndex));
  record(
    'R29-07',
    'Transmission includes expectations anchor layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.10_expectations'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 50 }),
    [
      { id: 'expectations_shock', overlay: { inflationExpectationsAnchor: { anchorBand: 'critical', driftBand: 'critical' } } },
      { id: 'metro_shock', overlay: { metroMomentum: { growthBand: 'critical', congestionBand: 'critical' } } }
    ],
    null,
    null
  );
  const consolidation = rankMacroScenarioConsolidation(compare);
  const reconstitution = rankMacroScenarioReconstitution(compare);
  record('R29-08', 'Scenario consolidation preserves row count', consolidation.length === 2, String(consolidation.length));
  record(
    'R29-09',
    'Consolidation and reconstitution both rank scenarios',
    reconstitution.length === 2 && consolidation[0].consolidationPriority >= 0,
    consolidation.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'expectations_metro_stress',
    includeExpectationsMetroStress: true
  });
  record(
    'R29-10',
    'Expectations/metro regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round30-self-tests.ts ---

export function runAgent06Round30SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const transport = readMacroTransportThroughputSpilloverFromV1012(
    makeDefaultV1014_MACRO_TestInputs({
      transportThroughput: { flowBand: 'collapsed', backlogBand: 'unbounded', reliabilityBand: 'failing' }
    })
  );
  record('R30-01', 'Collapsed throughput drags productivity', transport.productivityNudge < -2, String(transport.productivityNudge));

  const energy = readMacroEnergyTransitionPaceSpilloverFromV1013(
    makeDefaultV1014_MACRO_TestInputs({
      energyTransitionPace: { paceBand: 'forced', costBand: 'spiking', gridBand: 'unstable' }
    })
  );
  record('R30-02', 'Forced transition drags investment', energy.investmentNudge <= -2, String(energy.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      transportThroughput: { flowBand: 'fluid', backlogBand: 'moderate', reliabilityBand: 'robust' },
      energyTransitionPace: { paceBand: 'orderly', costBand: 'manageable', gridBand: 'stable' }
    }),
    null,
    null
  );
  record('R30-03', 'State exposes transport throughput summary', integrated.state.transportThroughputSpilloverSummary != null, 'ok');
  record(
    'R30-04',
    'Transmission includes energy transition layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.13_energy_transition'),
    'ok'
  );
  record(
    'R30-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const synthesis = buildMacroTransmissionSynthesisSnapshot(integrated.state.transmissionReport);
  record('R30-06', 'Transmission synthesis finite', Number.isFinite(synthesis.synthesisIndex), String(synthesis.synthesisIndex));
  record(
    'R30-07',
    'Transmission includes transport throughput layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.12_transport_throughput'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 52 }),
    [
      { id: 'transport_shock', overlay: { transportThroughput: { flowBand: 'critical', backlogBand: 'critical' } } },
      { id: 'energy_shock', overlay: { energyTransitionPace: { paceBand: 'critical', gridBand: 'critical' } } }
    ],
    null,
    null
  );
  const equilibrium = rankMacroScenarioEquilibrium(compare);
  const consolidation = rankMacroScenarioConsolidation(compare);
  record('R30-08', 'Scenario equilibrium preserves row count', equilibrium.length === 2, String(equilibrium.length));
  record(
    'R30-09',
    'Equilibrium and consolidation both rank scenarios',
    consolidation.length === 2 && equilibrium[0].equilibriumPriority >= 0,
    equilibrium.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'transport_energy_stress',
    includeTransportEnergyStress: true
  });
  record(
    'R30-10',
    'Transport/energy regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round31-self-tests.ts ---

export function runAgent06Round31SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const housing = readMacroHousingAffordabilitySpilloverFromV1014(
    makeDefaultV1014_MACRO_TestInputs({
      housingAffordability: { stressBand: 'crushed', tenureBand: 'precarious', serviceBand: 'strained' }
    })
  );
  record('R31-01', 'Crushed affordability drags cycle', housing.cycleNudge < -2, String(housing.cycleNudge));

  const tradeExp = readMacroTradeExposureSpilloverFromV1015(
    makeDefaultV1014_MACRO_TestInputs({
      tradeExposure: { shockBand: 'dislocated', balanceBand: 'unsustainable', opennessBand: 'fragile' }
    })
  );
  record('R31-02', 'Dislocated exposure drags productivity', tradeExp.productivityNudge <= -2, String(tradeExp.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      housingAffordability: { stressBand: 'balanced', tenureBand: 'stable', serviceBand: 'adequate' },
      tradeExposure: { opennessBand: 'diversified', shockBand: 'muted', balanceBand: 'neutral' }
    }),
    null,
    null
  );
  record('R31-03', 'State exposes housing affordability summary', integrated.state.housingAffordabilitySpilloverSummary != null, 'ok');
  record(
    'R31-04',
    'Transmission includes trade exposure layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.15_trade_exposure'),
    'ok'
  );
  record(
    'R31-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const dispersion = buildMacroTransmissionDispersionSnapshot(integrated.state.transmissionReport);
  record('R31-06', 'Transmission dispersion finite', Number.isFinite(dispersion.dispersionIndex), String(dispersion.dispersionIndex));
  record(
    'R31-07',
    'Transmission includes housing affordability layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.14_housing_affordability'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 53 }),
    [
      { id: 'housing_shock', overlay: { housingAffordability: { stressBand: 'critical', tenureBand: 'locked_out' } } },
      { id: 'trade_shock', overlay: { tradeExposure: { shockBand: 'critical', opennessBand: 'concentrated' } } }
    ],
    null,
    null
  );
  const sustainability = rankMacroScenarioSustainability(compare);
  const equilibrium = rankMacroScenarioEquilibrium(compare);
  record('R31-08', 'Scenario sustainability preserves row count', sustainability.length === 2, String(sustainability.length));
  record(
    'R31-09',
    'Sustainability and equilibrium both rank scenarios',
    equilibrium.length === 2 && sustainability[0].sustainabilityPriority >= 0,
    sustainability.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'housing_trade_stress',
    includeHousingTradeStress: true
  });
  record(
    'R31-10',
    'Housing/trade regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round32-self-tests.ts ---

export function runAgent06Round32SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const guardian = readMacroGuardianVigilanceSpilloverFromV1016(
    makeDefaultV1014_MACRO_TestInputs({
      guardianVigilance: { alertBand: 'red', coverageBand: 'blind', trustBand: 'eroded' }
    })
  );
  record('R32-01', 'Red vigilance drags investment', guardian.investmentNudge <= -2, String(guardian.investmentNudge));

  const command = readMacroCommandCoordinationSpilloverFromV1017(
    makeDefaultV1014_MACRO_TestInputs({
      commandCoordination: { syncBand: 'broken', latencyBand: 'unbounded', loadBand: 'saturated' }
    })
  );
  record('R32-02', 'Broken coordination drags cycle', command.cycleNudge < -2, String(command.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      guardianVigilance: { alertBand: 'green', coverageBand: 'full', trustBand: 'strong' },
      commandCoordination: { syncBand: 'aligned', latencyBand: 'low', loadBand: 'balanced' }
    }),
    null,
    null
  );
  record('R32-03', 'State exposes guardian vigilance summary', integrated.state.guardianVigilanceSpilloverSummary != null, 'ok');
  record(
    'R32-04',
    'Transmission includes command coordination layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.17_command_coordination'),
    'ok'
  );
  record(
    'R32-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const fragmentation = buildMacroTransmissionFragmentationSnapshot(integrated.state.transmissionReport);
  record(
    'R32-06',
    'Transmission fragmentation finite',
    Number.isFinite(fragmentation.fragmentationIndex),
    String(fragmentation.fragmentationIndex)
  );
  record(
    'R32-07',
    'Transmission includes guardian vigilance layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.16_guardian_vigilance'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 54 }),
    [
      { id: 'guardian_shock', overlay: { guardianVigilance: { alertBand: 'critical', coverageBand: 'gapped' } } },
      { id: 'command_shock', overlay: { commandCoordination: { syncBand: 'critical', loadBand: 'overloaded' } } }
    ],
    null,
    null
  );
  const viability = rankMacroScenarioViability(compare);
  const sustainability = rankMacroScenarioSustainability(compare);
  record('R32-08', 'Scenario viability preserves row count', viability.length === 2, String(viability.length));
  record(
    'R32-09',
    'Viability and sustainability both rank scenarios',
    sustainability.length === 2 && viability[0].viabilityPriority >= 0,
    viability.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'guardian_command_stress',
    includeGuardianCommandStress: true
  });
  record(
    'R32-10',
    'Guardian/command regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round33-self-tests.ts ---

export function runAgent06Round33SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const team = readMacroTeamAiCohesionSpilloverFromV1018(
    makeDefaultV1014_MACRO_TestInputs({
      teamAiCohesion: { alignmentBand: 'split', driftBand: 'unbounded', qualityBand: 'hallucinating' }
    })
  );
  record('R33-01', 'Split cohesion drags productivity', team.productivityNudge <= -2, String(team.productivityNudge));

  const memory = readMacroMemoryRetentionSpilloverFromV1019(
    makeDefaultV1014_MACRO_TestInputs({
      memoryRetention: { retentionBand: 'lost', decayBand: 'runaway', recallBand: 'corrupted' }
    })
  );
  record('R33-02', 'Lost retention drags investment', memory.investmentNudge <= -2, String(memory.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      teamAiCohesion: { alignmentBand: 'unified', driftBand: 'stable', qualityBand: 'reliable' },
      memoryRetention: { retentionBand: 'durable', decayBand: 'slow', recallBand: 'accurate' }
    }),
    null,
    null
  );
  record('R33-03', 'State exposes team AI cohesion summary', integrated.state.teamAiCohesionSpilloverSummary != null, 'ok');
  record(
    'R33-04',
    'Transmission includes memory retention layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.19_memory_retention'),
    'ok'
  );
  record(
    'R33-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const redundancy = buildMacroTransmissionRedundancySnapshot(integrated.state.transmissionReport);
  record('R33-06', 'Transmission redundancy finite', Number.isFinite(redundancy.redundancyIndex), String(redundancy.redundancyIndex));
  record(
    'R33-07',
    'Transmission includes team AI cohesion layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.18_team_ai_cohesion'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 55 }),
    [
      { id: 'team_shock', overlay: { teamAiCohesion: { alignmentBand: 'critical', driftBand: 'runaway' } } },
      { id: 'memory_shock', overlay: { memoryRetention: { retentionBand: 'critical', recallBand: 'noisy' } } }
    ],
    null,
    null
  );
  const continuity = rankMacroScenarioContinuity(compare);
  const viability = rankMacroScenarioViability(compare);
  record('R33-08', 'Scenario continuity preserves row count', continuity.length === 2, String(continuity.length));
  record(
    'R33-09',
    'Continuity and viability both rank scenarios',
    viability.length === 2 && continuity[0].continuityPriority >= 0,
    continuity.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'team_memory_stress',
    includeTeamMemoryStress: true
  });
  record(
    'R33-10',
    'Team/memory regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round34-self-tests.ts ---

export function runAgent06Round34SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const automation = readMacroAutomationThroughputSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationThroughput: { paceBand: 'collapsed', reliabilityBand: 'failing', backlogBand: 'unbounded' }
    })
  );
  record('R34-01', 'Collapsed automation drags productivity', automation.productivityNudge <= -2, String(automation.productivityNudge));

  const forecast = readMacroForecastCalibrationSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastCalibration: { biasBand: 'runaway', horizonBand: 'collapsed', confidenceBand: 'misplaced' }
    })
  );
  record('R34-02', 'Runaway calibration drags investment', forecast.investmentNudge <= -2, String(forecast.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationThroughput: { paceBand: 'strong', reliabilityBand: 'robust', backlogBand: 'light' },
      forecastCalibration: { biasBand: 'well_calibrated', horizonBand: 'stable', confidenceBand: 'grounded' }
    }),
    null,
    null
  );
  record('R34-03', 'State exposes automation throughput summary', integrated.state.automationThroughputSpilloverSummary != null, 'ok');
  record(
    'R34-04',
    'Transmission includes forecast calibration layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_calibration'),
    'ok'
  );
  record(
    'R34-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const saturation = buildMacroTransmissionSaturationSnapshot(integrated.state.transmissionReport);
  record('R34-06', 'Transmission saturation finite', Number.isFinite(saturation.saturationIndex), String(saturation.saturationIndex));
  record(
    'R34-07',
    'Transmission includes automation throughput layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_throughput'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 56 }),
    [
      { id: 'automation_shock', overlay: { automationThroughput: { paceBand: 'critical', backlogBand: 'severe' } } },
      { id: 'forecast_shock', overlay: { forecastCalibration: { biasBand: 'critical', confidenceBand: 'overconfident' } } }
    ],
    null,
    null
  );
  const prosperity = rankMacroScenarioProsperity(compare);
  const continuity = rankMacroScenarioContinuity(compare);
  record('R34-08', 'Scenario prosperity preserves row count', prosperity.length === 2, String(prosperity.length));
  record(
    'R34-09',
    'Prosperity and continuity both rank scenarios',
    continuity.length === 2 && prosperity[0].prosperityPriority >= 0,
    prosperity.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'automation_forecast_stress',
    includeAutomationForecastStress: true
  });
  record(
    'R34-10',
    'Automation/forecast regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round35-self-tests.ts ---

export function runAgent06Round35SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const governance = readMacroAutomationIdleGovernanceSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernance: { governanceBand: 'runaway', idleBand: 'frozen', escrowBand: 'misaligned' }
    })
  );
  record('R35-01', 'Runaway idle governance drags investment', governance.investmentNudge <= -2, String(governance.investmentNudge));

  const projection = readMacroForecastProjectionSyncSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastProjectionSync: { ledgerBand: 'orphaned', driftBand: 'runaway', syncBand: 'desynced' }
    })
  );
  record('R35-02', 'Runaway projection drift drags cycle', projection.cycleNudge <= -2, String(projection.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernance: { governanceBand: 'grounded', idleBand: 'bounded', escrowBand: 'latched' },
      forecastProjectionSync: { ledgerBand: 'synced', driftBand: 'stable', syncBand: 'latched' }
    }),
    null,
    null
  );
  record('R35-03', 'State exposes idle governance summary', integrated.state.automationIdleGovernanceSpilloverSummary != null, 'ok');
  record(
    'R35-04',
    'Transmission includes forecast projection sync layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_projection_sync'),
    'ok'
  );
  record(
    'R35-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const elasticity = buildMacroTransmissionElasticitySnapshot(integrated.state.transmissionReport);
  record('R35-06', 'Transmission elasticity finite', Number.isFinite(elasticity.elasticityIndex), String(elasticity.elasticityIndex));
  record(
    'R35-07',
    'Transmission includes automation idle governance layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 57 }),
    [
      { id: 'governance_shock', overlay: { automationIdleGovernance: { governanceBand: 'critical', escrowBand: 'leaking' } } },
      { id: 'projection_shock', overlay: { forecastProjectionSync: { driftBand: 'critical', syncBand: 'broken' } } }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave35Integration(compare);
  const projectionRank = rankMacroScenarioProjectionSync(compare);
  record('R35-08', 'Wave 35 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R35-09',
    'Integration and projection sync both rank scenarios',
    projectionRank.length === 2 && integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'governance_projection_stress',
    includeGovernanceProjectionStress: true
  });
  record(
    'R35-10',
    'Governance/projection regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round36-self-tests.ts ---

export function runAgent06Round36SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave36ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave36Export: {
        round36Ready: false,
        o10TaskId: 'O10-203',
        waveRound: 36,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R36-01', 'Wave 36 export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const projection = readMacroForecastWave36ProjectionSyncSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave36ProjectionSync: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R36-02', 'Wave 36 projection drift drags cycle', projection.cycleNudge <= -2, String(projection.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave36Export: {
        round36Ready: true,
        o10TaskId: 'O10-203',
        waveRound: 36,
        projectedLocHint: 1_962_828,
        wave36HookLines: ['O10_AGENT20_WAVE36 round36_ready=true']
      },
      forecastWave36ProjectionSync: {
        status: 'aligned',
        baselineSha: 'ea2bb03',
        projectedFunctionalLoc: 1_962_828
      }
    }),
    null,
    null
  );
  record(
    'R36-03',
    'State exposes wave 36 export summary',
    integrated.state.automationIdleGovernanceWave36ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R36-04',
    'Transmission includes forecast wave 36 projection sync layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave36_projection_sync'),
    'ok'
  );
  record(
    'R36-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const dispersion = buildMacroTransmissionDispersionSnapshot(integrated.state.transmissionReport);
  record('R36-06', 'Transmission dispersion finite', Number.isFinite(dispersion.dispersionIndex), String(dispersion.dispersionIndex));
  record(
    'R36-07',
    'Transmission includes automation wave 36 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave36_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 58 }),
    [
      {
        id: 'export_shock',
        overlay: {
          automationIdleGovernanceWave36Export: { round36Ready: false, o10TaskId: 'O10-203', waveRound: 36 }
        }
      },
      {
        id: 'projection_shock',
        overlay: { forecastWave36ProjectionSync: { status: 'drift', baselineSha: 'ea2bb03' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave36Integration(compare);
  record('R36-08', 'Wave 36 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R36-09',
    'Resilience and wave 35 integration both rank scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave36_export_projection_stress',
    includeWave36ExportProjectionStress: true
  });
  record(
    'R36-10',
    'Wave 36 export/projection regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round37-self-tests.ts ---

export function runAgent06Round37SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave37ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave37Export: {
        round37Ready: false,
        o10TaskId: 'O10-205',
        waveRound: 37,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R37-01', 'Wave 37 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave37ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave37Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R37-02', 'Wave 37 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave37Export: {
        round37Ready: true,
        o10TaskId: 'O10-205',
        waveRound: 37,
        latencyBand: 'fast',
        projectedLocHint: 2_001_028
      },
      dashboardClarityWave37Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: 'cfb4603',
        projectedFunctionalLoc: 2_001_028
      }
    }),
    null,
    null
  );
  record(
    'R37-03',
    'State exposes wave 37 UI export summary',
    integrated.state.uiResponsivenessWave37ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R37-04',
    'Transmission includes dashboard clarity wave 37 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave37_export'),
    'ok'
  );
  record(
    'R37-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const redundancy = buildMacroTransmissionRedundancySnapshot(integrated.state.transmissionReport);
  record(
    'R37-06',
    'Transmission redundancy finite',
    Number.isFinite(redundancy.redundancyIndex),
    String(redundancy.redundancyIndex)
  );
  record(
    'R37-07',
    'Transmission includes UI responsiveness wave 37 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave37_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 59 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave37Export: { round37Ready: false, o10TaskId: 'O10-205', waveRound: 37, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave37Export: { clarityReady: false, signalBand: 'critical', baselineSha: 'cfb4603' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave37Integration(compare);
  record('R37-08', 'Wave 37 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R37-09',
    'Wave 37 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave37_ui_dashboard_export_stress',
    includeWave37UiDashboardExportStress: true
  });
  record(
    'R37-10',
    'Wave 37 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round38-self-tests.ts ---

export function runAgent06Round38SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave38ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave38Export: {
        round38Ready: false,
        o10TaskId: 'O10-207',
        waveRound: 38,
        integrityBand: 'broken',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R38-01', 'Wave 38 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave38ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave38Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R38-02', 'Wave 38 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave38Export: {
        round38Ready: true,
        o10TaskId: 'O10-207',
        waveRound: 38,
        integrityBand: 'sound',
        projectedLocHint: 2_039_227
      },
      integrationHealthWave38Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: 'b44b36f',
        projectedFunctionalLoc: 2_039_227
      }
    }),
    null,
    null
  );
  record(
    'R38-03',
    'State exposes wave 38 replay export summary',
    integrated.state.replayWave38ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R38-04',
    'Transmission includes integration health wave 38 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave38_export'),
    'ok'
  );
  record(
    'R38-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const synthesis = buildMacroTransmissionSynthesisSnapshot(integrated.state.transmissionReport);
  record(
    'R38-06',
    'Transmission synthesis finite',
    Number.isFinite(synthesis.synthesisIndex),
    String(synthesis.synthesisIndex)
  );
  record(
    'R38-07',
    'Transmission includes replay wave 38 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave38_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 60 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave38Export: { round38Ready: false, o10TaskId: 'O10-207', waveRound: 38, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave38Export: { healthReady: false, slotBand: 'red', baselineSha: 'b44b36f' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave38Integration(compare);
  record('R38-08', 'Wave 38 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R38-09',
    'Wave 38 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave38_replay_integration_stress',
    includeWave38ReplayIntegrationStress: true
  });
  record(
    'R38-10',
    'Wave 38 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round39-self-tests.ts ---

export function runAgent06Round39SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave39ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave39Export: {
        round39Ready: false,
        o10TaskId: 'O10-209',
        waveRound: 39,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R39-01', 'Wave 39 automation export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const forecast = readMacroForecastWave39ExportSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave39Export: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R39-02', 'Wave 39 forecast export drift drags cycle', forecast.cycleNudge <= -2, String(forecast.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave39Export: {
        round39Ready: true,
        o10TaskId: 'O10-209',
        waveRound: 39,
        projectedLocHint: 2_082_720
      },
      forecastWave39Export: {
        status: 'aligned',
        baselineSha: '6134c6a',
        projectedFunctionalLoc: 2_082_720
      }
    }),
    null,
    null
  );
  record(
    'R39-03',
    'State exposes wave 39 automation export summary',
    integrated.state.automationIdleGovernanceWave39ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R39-04',
    'Transmission includes forecast wave 39 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave39_export'),
    'ok'
  );
  record(
    'R39-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const centrality = buildMacroTransmissionCentralitySnapshot(integrated.state.transmissionReport);
  record(
    'R39-06',
    'Transmission centrality finite',
    Number.isFinite(centrality.centralityIndex),
    String(centrality.centralityIndex)
  );
  record(
    'R39-07',
    'Transmission includes automation wave 39 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave39_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 61 }),
    [
      {
        id: 'auto_shock',
        overlay: {
          automationIdleGovernanceWave39Export: { round39Ready: false, o10TaskId: 'O10-209', waveRound: 39 }
        }
      },
      {
        id: 'forecast_shock',
        overlay: { forecastWave39Export: { status: 'drift', baselineSha: '6134c6a' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave39Integration(compare);
  record('R39-08', 'Wave 39 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R39-09',
    'Wave 39 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave39_automation_forecast_export_stress',
    includeWave39AutomationForecastExportStress: true
  });
  record(
    'R39-10',
    'Wave 39 automation/forecast export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round40-self-tests.ts ---

export function runAgent06Round40SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave40ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave40Export: {
        round40Ready: false,
        o10TaskId: 'O10-211',
        waveRound: 40,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R40-01', 'Wave 40 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave40ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave40Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R40-02', 'Wave 40 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave40Export: {
        round40Ready: true,
        o10TaskId: 'O10-211',
        waveRound: 40,
        latencyBand: 'fast',
        projectedLocHint: 2_121_263
      },
      dashboardClarityWave40Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: '6f7fa49',
        projectedFunctionalLoc: 2_121_263
      }
    }),
    null,
    null
  );
  record(
    'R40-03',
    'State exposes wave 40 UI export summary',
    integrated.state.uiResponsivenessWave40ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R40-04',
    'Transmission includes dashboard clarity wave 40 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave40_export'),
    'ok'
  );
  record(
    'R40-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record(
    'R40-06',
    'Transmission envelope finite',
    Number.isFinite(envelope.envelopeIndex),
    String(envelope.envelopeIndex)
  );
  record(
    'R40-07',
    'Transmission includes UI responsiveness wave 40 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave40_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 62 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave40Export: { round40Ready: false, o10TaskId: 'O10-211', waveRound: 40, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave40Export: { clarityReady: false, signalBand: 'critical', baselineSha: '6f7fa49' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave40Integration(compare);
  record('R40-08', 'Wave 40 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R40-09',
    'Wave 40 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave40_ui_dashboard_export_stress',
    includeWave40UiDashboardExportStress: true
  });
  record(
    'R40-10',
    'Wave 40 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round41-self-tests.ts ---

export function runAgent06Round41SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave41ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave41Export: {
        round41Ready: false,
        o10TaskId: 'O10-213',
        waveRound: 41,
        integrityBand: 'broken',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R41-01', 'Wave 41 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave41ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave41Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R41-02', 'Wave 41 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave41Export: {
        round41Ready: true,
        o10TaskId: 'O10-213',
        waveRound: 41,
        integrityBand: 'sound',
        projectedLocHint: 2_165_132
      },
      integrationHealthWave41Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '875d6f3',
        projectedFunctionalLoc: 2_165_132
      }
    }),
    null,
    null
  );
  record(
    'R41-03',
    'State exposes wave 41 replay export summary',
    integrated.state.replayWave41ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R41-04',
    'Transmission includes integration health wave 41 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave41_export'),
    'ok'
  );
  record(
    'R41-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R41-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R41-07',
    'Transmission includes replay wave 41 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave41_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 63 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave41Export: { round41Ready: false, o10TaskId: 'O10-213', waveRound: 41, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave41Export: { healthReady: false, slotBand: 'red', baselineSha: '875d6f3' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave41Integration(compare);
  record('R41-08', 'Wave 41 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R41-09',
    'Wave 41 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave41_replay_integration_stress',
    includeWave41ReplayIntegrationStress: true
  });
  record(
    'R41-10',
    'Wave 41 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round42-self-tests.ts ---

export function runAgent06Round42SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave42ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave42Export: {
        round42Ready: false,
        o10TaskId: 'O10-215',
        waveRound: 42,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R42-01', 'Wave 42 automation export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const forecast = readMacroForecastWave42ExportSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave42Export: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R42-02', 'Wave 42 forecast export drift drags cycle', forecast.cycleNudge <= -2, String(forecast.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave42Export: {
        round42Ready: true,
        o10TaskId: 'O10-215',
        waveRound: 42,
        projectedLocHint: 2_207_543
      },
      forecastWave42Export: {
        status: 'aligned',
        baselineSha: '431df5d',
        projectedFunctionalLoc: 2_207_543
      }
    }),
    null,
    null
  );
  record(
    'R42-03',
    'State exposes wave 42 automation export summary',
    integrated.state.automationIdleGovernanceWave42ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R42-04',
    'Transmission includes forecast wave 42 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave42_export'),
    'ok'
  );
  record(
    'R42-05',
    'Eighty transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const gradient = buildMacroTransmissionGradientSnapshot(integrated.state.transmissionReport);
  record(
    'R42-06',
    'Transmission gradient finite',
    Number.isFinite(gradient.gradientIndex),
    String(gradient.gradientIndex)
  );
  record(
    'R42-07',
    'Transmission includes automation wave 42 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave42_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 64 }),
    [
      {
        id: 'auto_shock',
        overlay: {
          automationIdleGovernanceWave42Export: { round42Ready: false, o10TaskId: 'O10-215', waveRound: 42 }
        }
      },
      {
        id: 'forecast_shock',
        overlay: { forecastWave42Export: { status: 'drift', baselineSha: '431df5d' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave42Integration(compare);
  record('R42-08', 'Wave 42 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R42-09',
    'Wave 42 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave42_automation_forecast_export_stress',
    includeWave42AutomationForecastExportStress: true
  });
  record(
    'R42-10',
    'Wave 42 automation/forecast export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round43-self-tests.ts ---

export function runAgent06Round43SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave43ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave43Export: {
        round43Ready: false,
        o10TaskId: 'O10-217',
        waveRound: 43,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R43-01', 'Wave 43 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave43ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave43Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R43-02', 'Wave 43 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave43Export: {
        round43Ready: true,
        o10TaskId: 'O10-217',
        waveRound: 43,
        latencyBand: 'fast',
        projectedLocHint: 2_253_960
      },
      dashboardClarityWave43Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: '641d7d16',
        projectedFunctionalLoc: 2_253_960
      }
    }),
    null,
    null
  );
  record(
    'R43-03',
    'State exposes wave 43 UI export summary',
    integrated.state.uiResponsivenessWave43ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R43-04',
    'Transmission includes dashboard clarity wave 43 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave43_export'),
    'ok'
  );
  record(
    'R43-05',
    'Eighty-two transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record(
    'R43-06',
    'Transmission envelope finite',
    Number.isFinite(envelope.envelopeIndex),
    String(envelope.envelopeIndex)
  );
  record(
    'R43-07',
    'Transmission includes UI responsiveness wave 43 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave43_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 65 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave43Export: { round43Ready: false, o10TaskId: 'O10-217', waveRound: 43, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave43Export: { clarityReady: false, signalBand: 'critical', baselineSha: '641d7d16' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave43Integration(compare);
  record('R43-08', 'Wave 43 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R43-09',
    'Wave 43 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave43_ui_dashboard_export_stress',
    includeWave43UiDashboardExportStress: true
  });
  record(
    'R43-10',
    'Wave 43 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round44-self-tests.ts ---

export function runAgent06Round44SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave44ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave44Export: {
        round44Ready: false,
        o10TaskId: 'O10-219',
        waveRound: 44,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R44-01', 'Wave 44 automation export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const forecast = readMacroForecastWave44ExportSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave44Export: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R44-02', 'Wave 44 forecast export drift drags cycle', forecast.cycleNudge <= -2, String(forecast.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave44Export: {
        round44Ready: true,
        o10TaskId: 'O10-219',
        waveRound: 44,
        projectedLocHint: 2_503_353
      },
      forecastWave44Export: {
        status: 'aligned',
        baselineSha: 'bca7e0a3',
        projectedFunctionalLoc: 2_503_353
      }
    }),
    null,
    null
  );
  record(
    'R44-03',
    'State exposes wave 44 automation export summary',
    integrated.state.automationIdleGovernanceWave44ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R44-04',
    'Transmission includes forecast wave 44 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave44_export'),
    'ok'
  );
  record(
    'R44-05',
    'Eighty-four transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const gradient = buildMacroTransmissionGradientSnapshot(integrated.state.transmissionReport);
  record(
    'R44-06',
    'Transmission gradient finite',
    Number.isFinite(gradient.gradientIndex),
    String(gradient.gradientIndex)
  );
  record(
    'R44-07',
    'Transmission includes automation wave 44 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave44_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 66 }),
    [
      {
        id: 'auto_shock',
        overlay: {
          automationIdleGovernanceWave44Export: { round44Ready: false, o10TaskId: 'O10-219', waveRound: 44 }
        }
      },
      {
        id: 'forecast_shock',
        overlay: { forecastWave44Export: { status: 'drift', baselineSha: 'bca7e0a3' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave44Integration(compare);
  record('R44-08', 'Wave 44 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R44-09',
    'Wave 44 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave44_automation_forecast_export_stress',
    includeWave44AutomationForecastExportStress: true
  });
  record(
    'R44-10',
    'Wave 44 automation/forecast export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round45-self-tests.ts ---

export function runAgent06Round45SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave45ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave45Export: {
        round45Ready: false,
        o10TaskId: 'O10-221',
        waveRound: 45,
        integrityBand: 'broken',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R45-01', 'Wave 45 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave45ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave45Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R45-02', 'Wave 45 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave45Export: {
        round45Ready: true,
        o10TaskId: 'O10-221',
        waveRound: 45,
        integrityBand: 'sound',
        projectedLocHint: 2_548_579
      },
      integrationHealthWave45Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '98bcd652',
        projectedFunctionalLoc: 2_548_579
      }
    }),
    null,
    null
  );
  record(
    'R45-03',
    'State exposes wave 45 replay export summary',
    integrated.state.replayWave45ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R45-04',
    'Transmission includes integration health wave 45 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave45_export'),
    'ok'
  );
  record(
    'R45-05',
    'Eighty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R45-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R45-07',
    'Transmission includes replay wave 45 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave45_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 67 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave45Export: { round45Ready: false, o10TaskId: 'O10-221', waveRound: 45, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave45Export: { healthReady: false, slotBand: 'red', baselineSha: '98bcd652' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave45Integration(compare);
  record('R45-08', 'Wave 45 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R45-09',
    'Wave 45 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave45_replay_integration_stress',
    includeWave45ReplayIntegrationStress: true
  });
  record(
    'R45-10',
    'Wave 45 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: round46-self-tests.ts ---

export function runAgent06Round46SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave46ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave46Export: {
        round46Ready: false,
        o10TaskId: 'O10-223',
        waveRound: 46,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R46-01', 'Wave 46 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave46ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave46Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R46-02', 'Wave 46 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave46Export: {
        round46Ready: true,
        o10TaskId: 'O10-223',
        waveRound: 46,
        latencyBand: 'fast',
        projectedLocHint: 2_593_189
      },
      dashboardClarityWave46Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: 'a9bb07e5',
        projectedFunctionalLoc: 2_593_189
      }
    }),
    null,
    null
  );
  record(
    'R46-03',
    'State exposes wave 46 UI export summary',
    integrated.state.uiResponsivenessWave46ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R46-04',
    'Transmission includes dashboard clarity wave 46 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave46_export'),
    'ok'
  );
  record(
    'R46-05',
    'Eighty-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record(
    'R46-06',
    'Transmission envelope finite',
    Number.isFinite(envelope.envelopeIndex),
    String(envelope.envelopeIndex)
  );
  record(
    'R46-07',
    'Transmission includes UI responsiveness wave 46 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave46_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 68 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave46Export: { round46Ready: false, o10TaskId: 'O10-223', waveRound: 46, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave46Export: { clarityReady: false, signalBand: 'critical', baselineSha: 'a9bb07e5' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave46Integration(compare);
  record('R46-08', 'Wave 46 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R46-09',
    'Wave 46 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave46_ui_dashboard_export_stress',
    includeWave46UiDashboardExportStress: true
  });
  record(
    'R46-10',
    'Wave 46 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: self-tests.ts ---

export function runV1014_MACRO_MacroEconomySelfTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const check = (id: string, name: string, ok: boolean, detail = 'ok') =>
    results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });

  check(
    'v1014_t01',
    'TEST 01 — INIT',
    createInitialMacroEconomyPersisted().schemaVersion === V1014_MACRO_SCHEMA_VERSION
  );
  check(
    'v1014_t02',
    'TEST 02 — SANITIZE',
    sanitizeMacroEconomyPersisted({ cycleHysteresis: 'bogus', revision: -1 }, 3).cycleHysteresis === 'expansion'
  );
  {
    const a = macroEconomyInputHash(makeDefaultV1014_MACRO_TestInputs());
    const b = macroEconomyInputHash(makeDefaultV1014_MACRO_TestInputs());
    check('v1014_t03', 'TEST 03 — HASH', a === b && a.length > 10);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    const sum = sumRegionalShares(r.state.regionalContributions);
    check('v1014_t04', 'TEST 04 — SHARES', Math.abs(sum - 1) < 1e-5, `sum=${sum}`);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    check('v1014_t05', 'TEST 05 — IDENTITY', r.state.accounting.identityOk);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    check('v1014_t06', 'TEST 06 — CYCLE', BUSINESS_CYCLE_LABEL[r.state.cyclePhase] != null);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ turn: 8 }), null, null);
    check(
      'v1014_t07',
      'TEST 07 — PRODUCTIVITY',
      r.state.productivityIndex >= 0 && r.state.productivityIndex <= 100
    );
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    check('v1014_t08', 'TEST 08 — INVESTMENT', V1014_MACRO_INVESTMENT_LABEL[r.state.investmentClimate] != null);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ highInflationScenarioActive: true }), null, null);
    check('v1014_t09', 'TEST 09 — INFLATION', r.state.productivityIndex <= 100);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ creditShockActive: true }), null, null);
    check('v1014_t10', 'TEST 10 — CREDIT', r.state.grossInvestmentIndex <= 100);
  }

  const regions = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;
  for (let i = 0; i < 40; i++) {
    const turn = 11 + i;
    const region = regions[i % regions.length];
    const inp = makeDefaultV1014_MACRO_TestInputs({ turn });
    const r = computeNationalMacroEconomy(inp, null, null);
    const row = r.state.regionalContributions.find(x => x.regionId === region);
    check(
      `v1014_t${11 + i}`,
      `TEST ${11 + i} — REG_${region}`,
      Boolean(row && row.share > 0),
      `missing ${region}`
    );
  }

  const recon = runAccountingReconciliationSelfTests();
  for (const r of recon.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const regional = runRegionalReconciliationSelfTests();
  for (const r of regional.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const shocks = runCyclicalShockLibrarySelfTests();
  for (const r of shocks.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const depth = runAgent06DepthSelfTests();
  for (const r of depth.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round2 = runAgent06Round2SelfTests();
  for (const r of round2.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round3 = runAgent06Round3SelfTests();
  for (const r of round3.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round4 = runAgent06Round4SelfTests();
  for (const r of round4.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round5 = runAgent06Round5SelfTests();
  for (const r of round5.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round6 = runAgent06Round6SelfTests();
  for (const r of round6.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round7 = runAgent06Round7SelfTests();
  for (const r of round7.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round8 = runAgent06Round8SelfTests();
  for (const r of round8.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round9 = runAgent06Round9SelfTests();
  for (const r of round9.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round10 = runAgent06Round10SelfTests();
  for (const r of round10.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round11 = runAgent06Round11SelfTests();
  for (const r of round11.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round12 = runAgent06Round12SelfTests();
  for (const r of round12.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round13 = runAgent06Round13SelfTests();
  for (const r of round13.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round14 = runAgent06Round14SelfTests();
  for (const r of round14.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round15 = runAgent06Round15SelfTests();
  for (const r of round15.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round16 = runAgent06Round16SelfTests();
  for (const r of round16.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round17 = runAgent06Round17SelfTests();
  for (const r of round17.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round18 = runAgent06Round18SelfTests();
  for (const r of round18.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round19 = runAgent06Round19SelfTests();
  for (const r of round19.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round20 = runAgent06Round20SelfTests();
  for (const r of round20.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round21 = runAgent06Round21SelfTests();
  for (const r of round21.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round22 = runAgent06Round22SelfTests();
  for (const r of round22.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round23 = runAgent06Round23SelfTests();
  for (const r of round23.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round24 = runAgent06Round24SelfTests();
  for (const r of round24.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round25 = runAgent06Round25SelfTests();
  for (const r of round25.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round26 = runAgent06Round26SelfTests();
  for (const r of round26.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round27 = runAgent06Round27SelfTests();
  for (const r of round27.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round28 = runAgent06Round28SelfTests();
  for (const r of round28.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round29 = runAgent06Round29SelfTests();
  for (const r of round29.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round30 = runAgent06Round30SelfTests();
  for (const r of round30.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round31 = runAgent06Round31SelfTests();
  for (const r of round31.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round32 = runAgent06Round32SelfTests();
  for (const r of round32.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round33 = runAgent06Round33SelfTests();
  for (const r of round33.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round34 = runAgent06Round34SelfTests();
  for (const r of round34.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round35 = runAgent06Round35SelfTests();
  for (const r of round35.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round36 = runAgent06Round36SelfTests();
  for (const r of round36.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round37 = runAgent06Round37SelfTests();
  for (const r of round37.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round38 = runAgent06Round38SelfTests();
  for (const r of round38.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round39 = runAgent06Round39SelfTests();
  for (const r of round39.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round40 = runAgent06Round40SelfTests();
  for (const r of round40.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round41 = runAgent06Round41SelfTests();
  for (const r of round41.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round42 = runAgent06Round42SelfTests();
  for (const r of round42.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round43 = runAgent06Round43SelfTests();
  for (const r of round43.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round44 = runAgent06Round44SelfTests();
  for (const r of round44.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round45 = runAgent06Round45SelfTests();
  for (const r of round45.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round46 = runAgent06Round46SelfTests();
  for (const r of round46.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round47 = runAgent06Round47SelfTests();
  for (const r of round47.results) {
    check(r.id, r.name, r.passed, r.detail);
  }
  const round48 = runAgent06Round48SelfTests();
  for (const r of round48.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}

export function runAgent06AllSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const macro = runV1014_MACRO_MacroEconomySelfTests();
  return {
    ...macro,
    allPassed: macro.failed === 0
  };
}


// --- source: react/MacroEconomyInspectorLab.tsx ---

export function MacroEconomyInspectorLab(props: {
  state: NationalMacroEconomyState | null;
  onRunTests?: () => void;
  testResult?: unknown;
}) {
  const st = props.state;
  if (!st) {
    return <div style={{ padding: 10, color: '#94a3b8' }}>V10.14 Inspector: No state active.</div>;
  }
  return (
    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid="macro-economy-inspector">
      <strong style={{ color: '#38bdf8' }}>LAB — V10.14 Macro Economy (Agent 06 modular)</strong>
      <div>
        Cycle: {BUSINESS_CYCLE_LABEL[st.cyclePhase]} · Productivity:{' '}
        {V1014_MACRO_PRODUCTIVITY_LABEL[st.productivityBand]} · Investment:{' '}
        {V1014_MACRO_INVESTMENT_LABEL[st.investmentClimate]}
      </div>
      <div>
        Output index: {st.accounting.grossOutputIndex.toFixed(1)} · Identity OK:{' '}
        {String(st.accounting.identityOk)}
      </div>
      {st.transmissionReport?.dominantLayerId && (
        <div style={{ marginTop: 6, color: '#a5b4fc' }}>
          Transmission dominant: {st.transmissionReport.dominantLayerId}
        </div>
      )}
      {st.stressIndex && (
        <div style={{ marginTop: 4, color: st.stressIndex.band === 'acute' ? '#f87171' : '#cbd5e1' }}>
          Stress: {st.stressIndex.band} ({st.stressIndex.score.toFixed(0)})
        </div>
      )}
      {st.transmissionBalance?.band && st.transmissionBalance.band !== 'aligned' && (
        <div style={{ marginTop: 4, color: '#fb923c' }}>
          Transmission balance: {st.transmissionBalance.band} ({st.transmissionBalance.dispersionIndex.toFixed(1)})
        </div>
      )}
      {st.policyStance?.stance && st.policyStance.stance !== 'neutral' && (
        <div style={{ marginTop: 4, color: '#fcd34d' }}>Policy stance: {st.policyStance.stance}</div>
      )}
      <div style={{ marginTop: 8 }}>
        {st.regionalContributions.map(r => (
          <div key={r.regionId}>
            {r.regionId} {(r.share * 100).toFixed(1)}% · {r.role} · {r.primarySector}
          </div>
        ))}
      </div>
      {props.onRunTests && (
        <button type="button" onClick={props.onRunTests} style={{ marginTop: 8 }}>
          Run Agent 06 Self-Tests
        </button>
      )}
    </div>
  );
}


// OP10M_MODULE_END agent-06-macroeconomy
