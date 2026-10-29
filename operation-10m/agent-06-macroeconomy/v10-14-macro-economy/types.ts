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
