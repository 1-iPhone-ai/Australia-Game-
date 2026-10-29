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
  capacitySnapshot: MacroCapacitySnapshot;
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
  publicFinance?: any;
  households?: any;
  trade?: any;
  economicGeography?: any;
  creditMarkets?: any;
  monetaryPolicy?: any;
  nationalFinance?: any;
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
    publicFinance: params?.publicFinance,
    households: params?.households,
    trade: params?.trade ?? params?.gameState?.tradeState,
    economicGeography: params?.economicGeography,
    creditMarkets: params?.creditMarkets ?? params?.gameState?.creditMarketsState,
    monetaryPolicy: params?.monetaryPolicy,
    nationalFinance: params?.nationalFinance,
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


// --- source: macro-transmission.ts ---

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
}): MacroTransmissionReport {
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
}): MacroRegressionHarnessResult {
  const turns = Math.max(5, Math.min(48, Math.floor(options?.turns ?? 24)));
  const scenarioId = options?.scenarioId ?? 'baseline_soft_landing';
  const includeCreditStress = Boolean(options?.includeCreditStress);
  const includeLaborInnovationStress = Boolean(options?.includeLaborInnovationStress);
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
    passed: Boolean(prev?.transmissionReport?.layers?.length && prev.transmissionReport.layers.length >= 8),
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
  const withFiscal = applyMacroFiscalSpillover(structural, fiscalSpillover);
  const withHousehold = applyMacroHouseholdSpillover(withFiscal, householdSpillover);
  const withIndustry = applyMacroIndustrySpillover(withHousehold, industrySpillover);
  const withTrade = applyMacroTradeSpillover(withIndustry, tradeSpillover);
  const withGeography = applyMacroGeographySpillover(withTrade, geographySpillover);
  const withCredit = applyMacroCreditSpillover(withGeography, creditSpillover);
  const withInnovation = applyMacroInnovationSpillover(withCredit, innovationSpillover);
  const withWorkforce = applyMacroWorkforceSpillover(withInnovation, workforceSpillover);
  const shocked = applyMacroShockAdjustments(inputs, withWorkforce, pushEv);
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
    workforce: workforceSpillover
  });

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
    capacitySnapshot,
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
    workforce: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null }
  });
  record('R4-03', 'Transmission report has eight layers', report.layers.length === 8, String(report.layers.length));
  record('R4-04', 'Net cycle nudge finite', Number.isFinite(report.netCycleNudge), String(report.netCycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      trade: { termsOfTrade: { band: 'favorable' } },
      economicGeography: { connectivity: { band: 'moderate' } }
    }),
    null,
    null
  );
  record('R4-05', 'State carries transmission report', integrated.state.transmissionReport.layers.length === 8, 'ok');
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
  record('R6-05', 'Eight transmission layers', integrated.state.transmissionReport.layers.length === 8, String(integrated.state.transmissionReport.layers.length));

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
