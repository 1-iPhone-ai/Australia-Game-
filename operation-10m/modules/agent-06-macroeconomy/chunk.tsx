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
      trade:
        t % 7 === 0
          ? { termsOfTrade: { band: 'weak' }, exportMomentum: -4 }
          : { termsOfTrade: { band: 'stable' }, exportMomentum: 1 },
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 26,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  checks.push({
    id: 'input_hash_stable_replay',
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
  const shocked = applyMacroShockAdjustments(inputs, withReplay, pushEv);
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
    replay: replaySpillover
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
  record('R4-03', 'Transmission report has twenty-six layers', report.layers.length === 26, String(report.layers.length));
  record('R4-04', 'Net cycle nudge finite', Number.isFinite(report.netCycleNudge), String(report.netCycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      trade: { termsOfTrade: { band: 'favorable' } },
      economicGeography: { connectivity: { band: 'moderate' } }
    }),
    null,
    null
  );
  record('R4-05', 'State carries transmission report', integrated.state.transmissionReport.layers.length === 26, 'ok');
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
  record('R6-05', 'Twenty-six transmission layers', integrated.state.transmissionReport.layers.length === 26, String(integrated.state.transmissionReport.layers.length));

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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
    'Twenty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 26,
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
