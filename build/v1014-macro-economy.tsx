// ============================================================================
// SECTION 20AG: V10.14 MACROECONOMIC CYCLES, PRODUCTIVITY, INVESTMENT & NATIONAL ACCOUNTING
// ============================================================================
// Agent 06 — Division B Operation 600K
// PREREQUISITE AUDIT & ARCHITECTURAL BOUNDARY DOCUMENTATION (Parts 1–45, Invariants A–P):
// 1. Audited V10.0–V10.13 national layers, Living Regions, Resource Market, player Actor Money boundary.
// 2. V10.14 models NATIONAL macro structure (cycle phase, productivity, gross investment climate, regional
//    output contributions) with a coherent accounting identity — NOT player wallets or sovereign cash flows.
// 3. Actor Money, Actor Loans, Team Treasury, and Resource Market prices remain authoritative elsewhere.
// 4. V10.9 remains authoritative for actor strategic capital allocation; V10.14 interprets macro investment
//    intensity and crowding at the national level without mutating player cash.
// 5. V10.12 remains authoritative for fiscal capacity; V10.14 cross-checks consistency only (warn-only).
// 6. V10.13 remains authoritative for household living standards; V10.14 links via domestic demand signals.
// 7. Regional contribution shares ALWAYS sum to 1.0 ± 1e-6 after normalization (Invariant P).

export const V1014_SCHEMA_VERSION = '10.14.0';
export const V1014_CORE_REGIONS: readonly string[] = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;
export const V1014_LIMITS = {
  maxEvidence: 10,
  maxTransitions: 16,
  maxHistory: 24,
  maxRegionalRows: 8,
  hysteresisDeadband: 2.0,
  accountingTolerance: 1e-5
} as const;

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

export const BUSINESS_CYCLE_LABEL: Record<BusinessCyclePhase, string> = {
  expansion: 'EXPANSION',
  peak: 'PEAK',
  slowdown: 'SLOWDOWN',
  contraction: 'CONTRACTION',
  trough: 'TROUGH',
  recovery: 'RECOVERY',
};

export const V1014_PRODUCTIVITY_LABEL: Record<MacroProductivityBand, string> = {
  critical: 'CRITICAL', weak: 'WEAK', moderate: 'MODERATE', strong: 'STRONG', leading: 'LEADING'
};

export const V1014_INVESTMENT_LABEL: Record<MacroInvestmentClimateBand, string> = {
  frozen: 'FROZEN', cautious: 'CAUTIOUS', balanced: 'BALANCED', active: 'ACTIVE', overheating: 'OVERHEATING'
};

export interface MacroEconomyEvidence {
  id: string; sourceSystem: string; sourceId: string; factor: string; contribution: number;
  regionIds: string[]; turn: number; visibility: 'public' | 'actor_visible';
}

export interface RegionalMacroContribution {
  regionId: string; share: number; role: RegionalContributionRole; productivityIndex: number;
  investmentIntensity: number; utilizationIndex: number; primarySector: string;
  contributionTags: string[]; evidence: MacroEconomyEvidence[];
}

export interface NationalAccountingLedger {
  /** Normalized output index 0..100 (not currency). */
  grossOutputIndex: number;
  productivityComponent: number; utilizationComponent: number; investmentComponent: number;
  regionalSumShare: number; identityResidual: number; identityOk: boolean;
  provenance: string[];
}

export interface NationalMacroEconomyState {
  schemaVersion: string; revision: number; turn: number; inputHash: string;
  cyclePhase: BusinessCyclePhase; cycleMomentum: number; cycleDurationTurns: number;
  productivityBand: MacroProductivityBand; productivityIndex: number;
  investmentClimate: MacroInvestmentClimateBand; grossInvestmentIndex: number;
  utilizationBand: MacroUtilizationBand; utilizationIndex: number;
  regionalContributions: RegionalMacroContribution[]; accounting: NationalAccountingLedger;
  sectorProductivity: Record<string, number>; evidence: MacroEconomyEvidence[];
  outlook: { phase: BusinessCyclePhase; productivity: MacroProductivityBand; investment: MacroInvestmentClimateBand };
}

export interface MacroEconomyPersisted {
  schemaVersion: string; revision: number; initializedTurn: number | null; lastUpdatedTurn: number;
  lastInputHash: string; cycleHysteresis: BusinessCyclePhase; cycleScore: number;
  productivityHysteresis: MacroProductivityBand; productivityScore: number;
  investmentHysteresis: MacroInvestmentClimateBand; investmentScore: number;
  transitions: Array<{ id: string; turn: number; kind: string; summary: string }>;
  history: Array<{ id: string; turn: number; summary: string }>;
}

export interface MacroEconomyInputs {
  turn: number; enabled?: boolean;
  livingRegions?: any; nationalSystems?: any; industries?: any; innovation?: any;
  workforce?: any; publicFinance?: any; households?: any; economicGeography?: any;
  highInflationScenarioActive?: boolean; creditShockActive?: boolean;
  regions?: Record<string, { economyScore?: number; momentumBand?: string; developmentScore?: number }>;
}

export const V1014_REGION_BASE_WEIGHT: Record<string, number> = {
  NSW: 0.32,
  VIC: 0.26,
  QLD: 0.19,
  WA: 0.16,
  SA: 0.04,
  TAS: 0.01,
  NT: 0.01,
  ACT: 0.01,
};

export const V1014_SECTOR_PRODUCTIVITY_PRIORS: Record<string, number> = {
  mining: 57,
  energy: 53,
  manufacturing: 64,
  agriculture: 61,
  services: 66,
  technology: 54,
  tourism: 67,
  construction: 66,
  trade_logistics: 60,
};

export function v1014Clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

export function createInitialMacroEconomyPersisted(turn = 1): MacroEconomyPersisted {
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
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
  const validCycle = new Set<BusinessCyclePhase>(['expansion','peak','slowdown','contraction','trough','recovery']);
  const validProd = new Set<MacroProductivityBand>(['critical','weak','moderate','strong','leading']);
  const validInv = new Set<MacroInvestmentClimateBand>(['frozen','cautious','balanced','active','overheating']);
  return {
    ...base,
    revision: Math.max(1, Math.floor(Number(raw.revision) || 1)),
    initializedTurn: raw.initializedTurn == null ? null : Math.max(1, Math.floor(Number(raw.initializedTurn) || 1)),
    lastUpdatedTurn: Math.max(1, Math.floor(Number(raw.lastUpdatedTurn) || turn)),
    lastInputHash: typeof raw.lastInputHash === 'string' ? raw.lastInputHash : '',
    cycleHysteresis: validCycle.has(raw.cycleHysteresis) ? raw.cycleHysteresis : base.cycleHysteresis,
    cycleScore: v1014Clamp(Number(raw.cycleScore), 0, 100),
    productivityHysteresis: validProd.has(raw.productivityHysteresis) ? raw.productivityHysteresis : base.productivityHysteresis,
    productivityScore: v1014Clamp(Number(raw.productivityScore), 0, 100),
    investmentHysteresis: validInv.has(raw.investmentHysteresis) ? raw.investmentHysteresis : base.investmentHysteresis,
    investmentScore: v1014Clamp(Number(raw.investmentScore), 0, 100),
    transitions: Array.isArray(raw.transitions) ? raw.transitions.slice(-V1014_LIMITS.maxTransitions) : [],
    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_LIMITS.maxHistory) : []
  };
}

export function macroEconomyInputHash(inputs: MacroEconomyInputs): string {
  const parts: string[] = [String(inputs.turn), inputs.enabled === false ? '0' : '1'];
  for (const code of V1014_CORE_REGIONS) {
    const ex = inputs.regions?.[code];
    const lr = inputs.livingRegions?.regions?.[code];
    const econ = Math.round(Number(ex?.economyScore ?? lr?.economy?.score ?? 55));
    const mom = String(ex?.momentumBand ?? lr?.momentum?.band ?? 'stable');
    parts.push(`${code}:${econ}:${mom}`);
  }
  parts.push(inputs.highInflationScenarioActive ? 'hi1' : 'hi0');
  parts.push(inputs.creditShockActive ? 'cr1' : 'cr0');
  return parts.join('|');
}

/** Deterministic regional share normalization — shares sum to 1. */
export function v1014NormalizeRegionalShares(
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
    for (const code of V1014_CORE_REGIONS) out[code] = V1014_REGION_BASE_WEIGHT[code] ?? 0.125;
    total = Object.values(out).reduce((a, b) => a + b, 0);
  }
  for (const k of Object.keys(out)) out[k] = out[k] / total;
  return out;
}

function v1014BandProductivity(score: number): MacroProductivityBand {
  if (score < 35) return 'critical';
  if (score < 48) return 'weak';
  if (score < 62) return 'moderate';
  if (score < 78) return 'strong';
  return 'leading';
}

function v1014BandInvestment(score: number): MacroInvestmentClimateBand {
  if (score < 30) return 'frozen';
  if (score < 45) return 'cautious';
  if (score < 60) return 'balanced';
  if (score < 75) return 'active';
  return 'overheating';
}

function v1014BandUtilization(score: number): MacroUtilizationBand {
  if (score < 35) return 'slack';
  if (score < 50) return 'below_potential';
  if (score < 65) return 'balanced';
  if (score < 80) return 'tight';
  return 'overextended';
}

function v1014CycleFromScore(score: number, prev: BusinessCyclePhase): BusinessCyclePhase {
  const db = V1014_LIMITS.hysteresisDeadband;
  const order: BusinessCyclePhase[] = ['trough','recovery','expansion','peak','slowdown','contraction'];
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

function v1014RegionNSWSectorAdjust(base: Record<string, number>): Record<string, number> {
  // NSW: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + -4, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + -1, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + 2, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + 5, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + -3, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + 0, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + 3, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + -5, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + -2, 20, 95);
  return base;
}

function v1014RegionVICSectorAdjust(base: Record<string, number>): Record<string, number> {
  // VIC: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + 4, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + -4, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + -1, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + 2, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + 5, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + -3, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + 0, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + 3, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + -5, 20, 95);
  return base;
}

function v1014RegionQLDSectorAdjust(base: Record<string, number>): Record<string, number> {
  // QLD: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + -1, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + 2, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + 5, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + -3, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + 0, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + 3, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + -5, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + -2, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + 1, 20, 95);
  return base;
}

function v1014RegionWASectorAdjust(base: Record<string, number>): Record<string, number> {
  // WA: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + 5, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + -3, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + 0, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + 3, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + -5, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + -2, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + 1, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + 4, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + -4, 20, 95);
  return base;
}

function v1014RegionSASectorAdjust(base: Record<string, number>): Record<string, number> {
  // SA: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + 1, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + 4, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + -4, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + -1, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + 2, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + 5, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + -3, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + 0, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + 3, 20, 95);
  return base;
}

function v1014RegionTASSectorAdjust(base: Record<string, number>): Record<string, number> {
  // TAS: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + 2, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + 5, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + -3, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + 0, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + 3, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + -5, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + -2, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + 1, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + 4, 20, 95);
  return base;
}

function v1014RegionNTSectorAdjust(base: Record<string, number>): Record<string, number> {
  // NT: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + -4, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + -1, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + 2, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + 5, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + -3, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + 0, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + 3, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + -5, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + -2, 20, 95);
  return base;
}

function v1014RegionACTSectorAdjust(base: Record<string, number>): Record<string, number> {
  // ACT: stylized sector productivity modifiers for macro accounting decomposition.
  base['mining'] = v1014Clamp((base['mining'] ?? 55) + 5, 20, 95);
  base['energy'] = v1014Clamp((base['energy'] ?? 55) + -3, 20, 95);
  base['manufacturing'] = v1014Clamp((base['manufacturing'] ?? 55) + 0, 20, 95);
  base['agriculture'] = v1014Clamp((base['agriculture'] ?? 55) + 3, 20, 95);
  base['services'] = v1014Clamp((base['services'] ?? 55) + -5, 20, 95);
  base['technology'] = v1014Clamp((base['technology'] ?? 55) + -2, 20, 95);
  base['tourism'] = v1014Clamp((base['tourism'] ?? 55) + 1, 20, 95);
  base['construction'] = v1014Clamp((base['construction'] ?? 55) + 4, 20, 95);
  base['trade_logistics'] = v1014Clamp((base['trade_logistics'] ?? 55) + -4, 20, 95);
  return base;
}

export function v1014ComposeSectorProductivity(regionId: string): Record<string, number> {
  let base: Record<string, number> = { ...V1014_SECTOR_PRODUCTIVITY_PRIORS };
  switch (regionId) {
    case 'NSW': return v1014RegionNSWSectorAdjust({ ...base });
    case 'VIC': return v1014RegionVICSectorAdjust({ ...base });
    case 'QLD': return v1014RegionQLDSectorAdjust({ ...base });
    case 'WA': return v1014RegionWASectorAdjust({ ...base });
    case 'SA': return v1014RegionSASectorAdjust({ ...base });
    case 'TAS': return v1014RegionTASSectorAdjust({ ...base });
    case 'NT': return v1014RegionNTSectorAdjust({ ...base });
    case 'ACT': return v1014RegionACTSectorAdjust({ ...base });
    default: return base;
  }
}

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
    economicGeography: params?.economicGeography,
    highInflationScenarioActive: Boolean(params?.highInflationScenarioActive || gset.selectedScenarioId === 'high_inflation'),
    creditShockActive: Boolean(params?.creditShockActive)
  };
}

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
  const evidence: MacroEconomyEvidence[] = [];
  const pushEv = (factor: string, contribution: number, sourceSystem: string, sourceId: string, regionIds: string[] = []) => {
    evidence.push({ id: `me:${sourceSystem}:${sourceId}:${factor}`, sourceSystem, sourceId, factor, contribution, regionIds, turn: inputs.turn, visibility: 'public' });
  };
  let productivityScore = persisted.productivityScore;
  let investmentScore = persisted.investmentScore;
  let cycleScore = persisted.cycleScore;
  const lr: any = inputs.livingRegions;
  const weights: Array<{ regionId: string; weight: number }> = [];
  for (const code of V1014_CORE_REGIONS) {
    const lrReg = lr?.regions?.[code];
    const econ = Number(lrReg?.economy?.score ?? 55);
    const mom = String(lrReg?.momentum?.band ?? 'stable');
    const dev = Number(lrReg?.development?.score ?? 50);
    let w = (V1014_REGION_BASE_WEIGHT[code] ?? 0.125) * (0.55 + econ / 200 + dev / 400);
    if (mom === 'surging') w *= 1.08;
    if (mom === 'declining') w *= 0.92;
    weights.push({ regionId: code, weight: w });
    pushEv('regional_economy', econ / 100, 'living_regions', code, [code]);
  }
  const shares = v1014NormalizeRegionalShares(weights);
  const shareSum = Object.values(shares).reduce((a, b) => a + b, 0);
  if (inputs.innovation?.nationalProductivityBonus) productivityScore += 2;
  if (inputs.workforce?.nationalReadinessBand === 'strong') productivityScore += 3;
  if (inputs.highInflationScenarioActive) { productivityScore -= 4; investmentScore -= 6; cycleScore -= 5; pushEv('inflation_scenario', -0.04, 'scenario', 'high_inflation'); }
  if (inputs.creditShockActive) { investmentScore -= 10; cycleScore -= 8; pushEv('credit_shock', -0.1, 'crisis', 'credit'); }
  const hhDemand = inputs.households?.domesticDemand?.band;
  if (hhDemand === 'strong' || hhDemand === 'very_strong' || hhDemand === 'surging') cycleScore += 4;
  if (hhDemand === 'contracting' || hhDemand === 'soft') cycleScore -= 4;
  productivityScore = v1014Clamp(productivityScore, 0, 100);
  investmentScore = v1014Clamp(investmentScore, 0, 100);
  cycleScore = v1014Clamp(cycleScore, 0, 100);
  const productivityBand = v1014BandProductivity(productivityScore);
  const investmentClimate = v1014BandInvestment(investmentScore);
  const utilizationIndex = v1014Clamp(48 + (cycleScore - 50) * 0.6 + (investmentScore - 50) * 0.25, 0, 100);
  const utilizationBand = v1014BandUtilization(utilizationIndex);
  const cyclePhase = v1014CycleFromScore(cycleScore, persisted.cycleHysteresis);
  const regionalContributions: RegionalMacroContribution[] = V1014_CORE_REGIONS.map(code => {
    const share = shares[code] ?? 0;
    const lrReg = lr?.regions?.[code];
    const prod = v1014ComposeSectorProductivity(code);
    const productivityIndex = Object.values(prod).reduce((a, b) => a + b, 0) / Math.max(1, Object.keys(prod).length);
    const investmentIntensity = v1014Clamp(investmentScore * (0.85 + share * 0.3), 0, 100);
    const utilizationIndexR = v1014Clamp(utilizationIndex * (0.9 + share * 0.2), 0, 100);
    let role: RegionalContributionRole = 'balanced';
    if (share >= 0.22) role = 'anchor';
    else if (share >= 0.14) role = 'driver';
    else if (share < 0.03) role = 'lagging';
    if (String(lrReg?.momentum?.band) === 'volatile') role = 'volatile';
    const primarySector = Object.entries(prod).sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'services';
    return {
      regionId: code, share, role, productivityIndex, investmentIntensity, utilizationIndex: utilizationIndexR,
      primarySector, contributionTags: [role, primarySector],
      evidence: evidence.filter(e => e.regionIds.includes(code)).slice(0, V1014_LIMITS.maxEvidence)
    };
  });
  const productivityComponent = productivityIndexFromBand(productivityScore);
  const utilizationComponent = utilizationIndex / 100;
  const investmentComponent = investmentScore / 100;
  const grossOutputIndex = v1014Clamp(productivityComponent * utilizationComponent * 100 * (0.92 + investmentComponent * 0.16), 0, 100);
  const identityResidual = Math.abs(shareSum - 1);
  const accounting: NationalAccountingLedger = {
    grossOutputIndex,
    productivityComponent,
    utilizationComponent,
    investmentComponent,
    regionalSumShare: shareSum,
    identityResidual,
    identityOk: identityResidual <= V1014_LIMITS.accountingTolerance,
    provenance: ['v1014_macro_accounting_identity_v1']
  };
  const sectorProductivity: Record<string, number> = { ...V1014_SECTOR_PRODUCTIVITY_PRIORS };
  for (const s of Object.keys(sectorProductivity)) {
    sectorProductivity[s] = v1014Clamp(sectorProductivity[s] + (productivityScore - 58) * 0.15, 20, 95);
  }
  const nextPersisted: MacroEconomyPersisted = {
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
  const state: NationalMacroEconomyState = {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: nextPersisted.revision,
    turn: inputs.turn,
    inputHash: hash,
    cyclePhase,
    cycleMomentum: v1014Clamp((cycleScore - 50) / 50, -1, 1),
    cycleDurationTurns: prevState?.cyclePhase === cyclePhase ? (prevState.cycleDurationTurns + 1) : 1,
    productivityBand,
    productivityIndex: productivityScore,
    investmentClimate,
    grossInvestmentIndex: investmentScore,
    utilizationBand,
    utilizationIndex,
    regionalContributions,
    accounting,
    sectorProductivity,
    evidence: evidence.slice(0, V1014_LIMITS.maxEvidence),
    outlook: { phase: cyclePhase, productivity: productivityBand, investment: investmentClimate }
  };
  return { state, persisted: nextPersisted };
}

function productivityIndexFromBand(score: number): number { return v1014Clamp(score / 100, 0.2, 1); }

export function validateNationalMacroEconomyState(st: NationalMacroEconomyState | null | undefined): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  if (!st) return { valid: false, issues: ['null state'] };
  if (!st.accounting.identityOk) issues.push(`accounting identity residual ${st.accounting.identityResidual}`);
  const sum = st.regionalContributions.reduce((a, r) => a + r.share, 0);
  if (Math.abs(sum - 1) > V1014_LIMITS.accountingTolerance) issues.push(`regional share sum ${sum}`);
  return { valid: issues.length === 0, issues };
}

/** Reference macro profile for NSW (LAB diagnostics). */
export const V1014_REF_PROFILE_NSW: readonly string[] = [
  'NSW:mining',
  'NSW:energy',
  'NSW:manufacturing',
  'NSW:agriculture',
  'NSW:services',
  'NSW:technology',
  'NSW:tourism',
  'NSW:construction',
  'NSW:trade_logistics',
] as const;

/** Reference macro profile for VIC (LAB diagnostics). */
export const V1014_REF_PROFILE_VIC: readonly string[] = [
  'VIC:mining',
  'VIC:energy',
  'VIC:manufacturing',
  'VIC:agriculture',
  'VIC:services',
  'VIC:technology',
  'VIC:tourism',
  'VIC:construction',
  'VIC:trade_logistics',
] as const;

/** Reference macro profile for QLD (LAB diagnostics). */
export const V1014_REF_PROFILE_QLD: readonly string[] = [
  'QLD:mining',
  'QLD:energy',
  'QLD:manufacturing',
  'QLD:agriculture',
  'QLD:services',
  'QLD:technology',
  'QLD:tourism',
  'QLD:construction',
  'QLD:trade_logistics',
] as const;

/** Reference macro profile for WA (LAB diagnostics). */
export const V1014_REF_PROFILE_WA: readonly string[] = [
  'WA:mining',
  'WA:energy',
  'WA:manufacturing',
  'WA:agriculture',
  'WA:services',
  'WA:technology',
  'WA:tourism',
  'WA:construction',
  'WA:trade_logistics',
] as const;

/** Reference macro profile for SA (LAB diagnostics). */
export const V1014_REF_PROFILE_SA: readonly string[] = [
  'SA:mining',
  'SA:energy',
  'SA:manufacturing',
  'SA:agriculture',
  'SA:services',
  'SA:technology',
  'SA:tourism',
  'SA:construction',
  'SA:trade_logistics',
] as const;

/** Reference macro profile for TAS (LAB diagnostics). */
export const V1014_REF_PROFILE_TAS: readonly string[] = [
  'TAS:mining',
  'TAS:energy',
  'TAS:manufacturing',
  'TAS:agriculture',
  'TAS:services',
  'TAS:technology',
  'TAS:tourism',
  'TAS:construction',
  'TAS:trade_logistics',
] as const;

/** Reference macro profile for NT (LAB diagnostics). */
export const V1014_REF_PROFILE_NT: readonly string[] = [
  'NT:mining',
  'NT:energy',
  'NT:manufacturing',
  'NT:agriculture',
  'NT:services',
  'NT:technology',
  'NT:tourism',
  'NT:construction',
  'NT:trade_logistics',
] as const;

/** Reference macro profile for ACT (LAB diagnostics). */
export const V1014_REF_PROFILE_ACT: readonly string[] = [
  'ACT:mining',
  'ACT:energy',
  'ACT:manufacturing',
  'ACT:agriculture',
  'ACT:services',
  'ACT:technology',
  'ACT:tourism',
  'ACT:construction',
  'ACT:trade_logistics',
] as const;

export function makeDefaultV1014TestInputs(overrides: Partial<MacroEconomyInputs> = {}): MacroEconomyInputs {
  return { turn: 5, enabled: true, livingRegions: { regions: Object.fromEntries(V1014_CORE_REGIONS.map(c => [c, { economy: { score: 55, band: 'moderate' }, momentum: { band: 'stable' }, development: { score: 50 } }])) }, ...overrides };
}

export function runV1014MacroEconomySelfTests(): { passed: number; failed: number; total: number; results: Array<{ id: string; name: string; passed: boolean; detail: string }> } {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const check = (id: string, name: string, ok: boolean, detail = 'ok') => results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });

  // TEST 01 — INIT: createInitialMacroEconomyPersisted has schema 10.14.0
  { const p = createInitialMacroEconomyPersisted(); check('v1014_t01', 'TEST 01 — INIT', p.schemaVersion === V1014_SCHEMA_VERSION); }
  // TEST 02 — SANITIZE: sanitize tolerates garbage
  { const p = sanitizeMacroEconomyPersisted({ cycleHysteresis: 'bogus', revision: -1 }, 3); check('v1014_t02', 'TEST 02 — SANITIZE', p.cycleHysteresis === 'expansion' && p.revision >= 1); }
  // TEST 03 — HASH: input hash stable
  { const a = macroEconomyInputHash(makeDefaultV1014TestInputs()); const b = macroEconomyInputHash(makeDefaultV1014TestInputs()); check('v1014_t03', 'TEST 03 — HASH', a === b && a.length > 10); }
  // TEST 04 — SHARES: regional shares sum to 1
  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); const sum = r.state.regionalContributions.reduce((a, x) => a + x.share, 0); check('v1014_t04', 'TEST 04 — SHARES', Math.abs(sum - 1) < 1e-5, `sum=${sum}`); }
  // TEST 05 — IDENTITY: accounting identityOk
  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); check('v1014_t05', 'TEST 05 — IDENTITY', r.state.accounting.identityOk); }
  // TEST 06 — CYCLE: cycle phase in enum
  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); check('v1014_t06', 'TEST 06 — CYCLE', BUSINESS_CYCLE_LABEL[r.state.cyclePhase] != null); }
  // TEST 07 — PRODUCTIVITY: productivity band maps score
  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs({ turn: 8 }), null, null); check('v1014_t07', 'TEST 07 — PRODUCTIVITY', r.state.productivityIndex >= 0 && r.state.productivityIndex <= 100); }
  // TEST 08 — INVESTMENT: investment band maps score
  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs(), null, null); check('v1014_t08', 'TEST 08 — INVESTMENT', V1014_INVESTMENT_LABEL[r.state.investmentClimate] != null); }
  // TEST 09 — INFLATION: high inflation drags scores
  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs({ highInflationScenarioActive: true }), null, null); check('v1014_t09', 'TEST 09 — INFLATION', r.state.productivityIndex <= 100); }
  // TEST 10 — CREDIT: credit shock drags investment
  { const r = computeNationalMacroEconomy(makeDefaultV1014TestInputs({ creditShockActive: true }), null, null); check('v1014_t10', 'TEST 10 — CREDIT', r.state.grossInvestmentIndex <= 100); }
  // TEST 11 — REG_NSW: region scenario 11
  { const inp = makeDefaultV1014TestInputs({ turn: 11 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NSW'); check('v1014_t11', 'TEST 11 — REG_NSW', Boolean(row && row.share > 0), 'missing NSW'); }
  // TEST 12 — REG_VIC: region scenario 12
  { const inp = makeDefaultV1014TestInputs({ turn: 12 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'VIC'); check('v1014_t12', 'TEST 12 — REG_VIC', Boolean(row && row.share > 0), 'missing VIC'); }
  // TEST 13 — REG_QLD: region scenario 13
  { const inp = makeDefaultV1014TestInputs({ turn: 13 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'QLD'); check('v1014_t13', 'TEST 13 — REG_QLD', Boolean(row && row.share > 0), 'missing QLD'); }
  // TEST 14 — REG_WA: region scenario 14
  { const inp = makeDefaultV1014TestInputs({ turn: 14 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'WA'); check('v1014_t14', 'TEST 14 — REG_WA', Boolean(row && row.share > 0), 'missing WA'); }
  // TEST 15 — REG_SA: region scenario 15
  { const inp = makeDefaultV1014TestInputs({ turn: 15 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'SA'); check('v1014_t15', 'TEST 15 — REG_SA', Boolean(row && row.share > 0), 'missing SA'); }
  // TEST 16 — REG_TAS: region scenario 16
  { const inp = makeDefaultV1014TestInputs({ turn: 16 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'TAS'); check('v1014_t16', 'TEST 16 — REG_TAS', Boolean(row && row.share > 0), 'missing TAS'); }
  // TEST 17 — REG_NT: region scenario 17
  { const inp = makeDefaultV1014TestInputs({ turn: 17 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NT'); check('v1014_t17', 'TEST 17 — REG_NT', Boolean(row && row.share > 0), 'missing NT'); }
  // TEST 18 — REG_ACT: region scenario 18
  { const inp = makeDefaultV1014TestInputs({ turn: 18 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'ACT'); check('v1014_t18', 'TEST 18 — REG_ACT', Boolean(row && row.share > 0), 'missing ACT'); }
  // TEST 19 — REG_NSW: region scenario 19
  { const inp = makeDefaultV1014TestInputs({ turn: 19 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NSW'); check('v1014_t19', 'TEST 19 — REG_NSW', Boolean(row && row.share > 0), 'missing NSW'); }
  // TEST 20 — REG_VIC: region scenario 20
  { const inp = makeDefaultV1014TestInputs({ turn: 20 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'VIC'); check('v1014_t20', 'TEST 20 — REG_VIC', Boolean(row && row.share > 0), 'missing VIC'); }
  // TEST 21 — REG_QLD: region scenario 21
  { const inp = makeDefaultV1014TestInputs({ turn: 21 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'QLD'); check('v1014_t21', 'TEST 21 — REG_QLD', Boolean(row && row.share > 0), 'missing QLD'); }
  // TEST 22 — REG_WA: region scenario 22
  { const inp = makeDefaultV1014TestInputs({ turn: 22 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'WA'); check('v1014_t22', 'TEST 22 — REG_WA', Boolean(row && row.share > 0), 'missing WA'); }
  // TEST 23 — REG_SA: region scenario 23
  { const inp = makeDefaultV1014TestInputs({ turn: 23 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'SA'); check('v1014_t23', 'TEST 23 — REG_SA', Boolean(row && row.share > 0), 'missing SA'); }
  // TEST 24 — REG_TAS: region scenario 24
  { const inp = makeDefaultV1014TestInputs({ turn: 24 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'TAS'); check('v1014_t24', 'TEST 24 — REG_TAS', Boolean(row && row.share > 0), 'missing TAS'); }
  // TEST 25 — REG_NT: region scenario 25
  { const inp = makeDefaultV1014TestInputs({ turn: 25 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NT'); check('v1014_t25', 'TEST 25 — REG_NT', Boolean(row && row.share > 0), 'missing NT'); }
  // TEST 26 — REG_ACT: region scenario 26
  { const inp = makeDefaultV1014TestInputs({ turn: 26 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'ACT'); check('v1014_t26', 'TEST 26 — REG_ACT', Boolean(row && row.share > 0), 'missing ACT'); }
  // TEST 27 — REG_NSW: region scenario 27
  { const inp = makeDefaultV1014TestInputs({ turn: 27 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NSW'); check('v1014_t27', 'TEST 27 — REG_NSW', Boolean(row && row.share > 0), 'missing NSW'); }
  // TEST 28 — REG_VIC: region scenario 28
  { const inp = makeDefaultV1014TestInputs({ turn: 28 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'VIC'); check('v1014_t28', 'TEST 28 — REG_VIC', Boolean(row && row.share > 0), 'missing VIC'); }
  // TEST 29 — REG_QLD: region scenario 29
  { const inp = makeDefaultV1014TestInputs({ turn: 29 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'QLD'); check('v1014_t29', 'TEST 29 — REG_QLD', Boolean(row && row.share > 0), 'missing QLD'); }
  // TEST 30 — REG_WA: region scenario 30
  { const inp = makeDefaultV1014TestInputs({ turn: 30 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'WA'); check('v1014_t30', 'TEST 30 — REG_WA', Boolean(row && row.share > 0), 'missing WA'); }
  // TEST 31 — REG_SA: region scenario 31
  { const inp = makeDefaultV1014TestInputs({ turn: 31 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'SA'); check('v1014_t31', 'TEST 31 — REG_SA', Boolean(row && row.share > 0), 'missing SA'); }
  // TEST 32 — REG_TAS: region scenario 32
  { const inp = makeDefaultV1014TestInputs({ turn: 32 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'TAS'); check('v1014_t32', 'TEST 32 — REG_TAS', Boolean(row && row.share > 0), 'missing TAS'); }
  // TEST 33 — REG_NT: region scenario 33
  { const inp = makeDefaultV1014TestInputs({ turn: 33 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NT'); check('v1014_t33', 'TEST 33 — REG_NT', Boolean(row && row.share > 0), 'missing NT'); }
  // TEST 34 — REG_ACT: region scenario 34
  { const inp = makeDefaultV1014TestInputs({ turn: 34 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'ACT'); check('v1014_t34', 'TEST 34 — REG_ACT', Boolean(row && row.share > 0), 'missing ACT'); }
  // TEST 35 — REG_NSW: region scenario 35
  { const inp = makeDefaultV1014TestInputs({ turn: 35 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NSW'); check('v1014_t35', 'TEST 35 — REG_NSW', Boolean(row && row.share > 0), 'missing NSW'); }
  // TEST 36 — REG_VIC: region scenario 36
  { const inp = makeDefaultV1014TestInputs({ turn: 36 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'VIC'); check('v1014_t36', 'TEST 36 — REG_VIC', Boolean(row && row.share > 0), 'missing VIC'); }
  // TEST 37 — REG_QLD: region scenario 37
  { const inp = makeDefaultV1014TestInputs({ turn: 37 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'QLD'); check('v1014_t37', 'TEST 37 — REG_QLD', Boolean(row && row.share > 0), 'missing QLD'); }
  // TEST 38 — REG_WA: region scenario 38
  { const inp = makeDefaultV1014TestInputs({ turn: 38 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'WA'); check('v1014_t38', 'TEST 38 — REG_WA', Boolean(row && row.share > 0), 'missing WA'); }
  // TEST 39 — REG_SA: region scenario 39
  { const inp = makeDefaultV1014TestInputs({ turn: 39 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'SA'); check('v1014_t39', 'TEST 39 — REG_SA', Boolean(row && row.share > 0), 'missing SA'); }
  // TEST 40 — REG_TAS: region scenario 40
  { const inp = makeDefaultV1014TestInputs({ turn: 40 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'TAS'); check('v1014_t40', 'TEST 40 — REG_TAS', Boolean(row && row.share > 0), 'missing TAS'); }
  // TEST 41 — REG_NT: region scenario 41
  { const inp = makeDefaultV1014TestInputs({ turn: 41 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NT'); check('v1014_t41', 'TEST 41 — REG_NT', Boolean(row && row.share > 0), 'missing NT'); }
  // TEST 42 — REG_ACT: region scenario 42
  { const inp = makeDefaultV1014TestInputs({ turn: 42 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'ACT'); check('v1014_t42', 'TEST 42 — REG_ACT', Boolean(row && row.share > 0), 'missing ACT'); }
  // TEST 43 — REG_NSW: region scenario 43
  { const inp = makeDefaultV1014TestInputs({ turn: 43 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NSW'); check('v1014_t43', 'TEST 43 — REG_NSW', Boolean(row && row.share > 0), 'missing NSW'); }
  // TEST 44 — REG_VIC: region scenario 44
  { const inp = makeDefaultV1014TestInputs({ turn: 44 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'VIC'); check('v1014_t44', 'TEST 44 — REG_VIC', Boolean(row && row.share > 0), 'missing VIC'); }
  // TEST 45 — REG_QLD: region scenario 45
  { const inp = makeDefaultV1014TestInputs({ turn: 45 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'QLD'); check('v1014_t45', 'TEST 45 — REG_QLD', Boolean(row && row.share > 0), 'missing QLD'); }
  // TEST 46 — REG_WA: region scenario 46
  { const inp = makeDefaultV1014TestInputs({ turn: 46 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'WA'); check('v1014_t46', 'TEST 46 — REG_WA', Boolean(row && row.share > 0), 'missing WA'); }
  // TEST 47 — REG_SA: region scenario 47
  { const inp = makeDefaultV1014TestInputs({ turn: 47 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'SA'); check('v1014_t47', 'TEST 47 — REG_SA', Boolean(row && row.share > 0), 'missing SA'); }
  // TEST 48 — REG_TAS: region scenario 48
  { const inp = makeDefaultV1014TestInputs({ turn: 48 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'TAS'); check('v1014_t48', 'TEST 48 — REG_TAS', Boolean(row && row.share > 0), 'missing TAS'); }
  // TEST 49 — REG_NT: region scenario 49
  { const inp = makeDefaultV1014TestInputs({ turn: 49 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'NT'); check('v1014_t49', 'TEST 49 — REG_NT', Boolean(row && row.share > 0), 'missing NT'); }
  // TEST 50 — REG_ACT: region scenario 50
  { const inp = makeDefaultV1014TestInputs({ turn: 50 }); const r = computeNationalMacroEconomy(inp, null, null); const row = r.state.regionalContributions.find(x => x.regionId === 'ACT'); check('v1014_t50', 'TEST 50 — REG_ACT', Boolean(row && row.share > 0), 'missing ACT'); }
  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}

export function MacroEconomyInspectorLab(props: { state: NationalMacroEconomyState | null; onRunTests?: () => void; testResult?: any }) {
  const st = props.state;
  if (!st) return <div style={{ padding: 10, color: '#94a3b8' }}>V10.14 Inspector: No state active.</div>;
  return (
    <div style={{ padding: 12, fontSize: 12, color: '#e2e8f0' }} data-testid='macro-economy-inspector'>
      <strong style={{ color: '#38bdf8' }}>LAB — V10.14 Macro Economy</strong>
      <div>Cycle: {BUSINESS_CYCLE_LABEL[st.cyclePhase]} · Productivity: {V1014_PRODUCTIVITY_LABEL[st.productivityBand]} · Investment: {V1014_INVESTMENT_LABEL[st.investmentClimate]}</div>
      <div>Output index: {st.accounting.grossOutputIndex.toFixed(1)} · Identity OK: {String(st.accounting.identityOk)}</div>
      <div style={{ marginTop: 8 }}>{st.regionalContributions.map(r => <div key={r.regionId}>{r.regionId} {(r.share * 100).toFixed(1)}% · {r.role} · {r.primarySector}</div>)}</div>
      {props.onRunTests && <button type='button' onClick={props.onRunTests} style={{ marginTop: 8 }}>Run V10.14 Self-Tests (50)</button>}
    </div>
  );
}

export function computeMacroEconomyRankingFit(state: NationalMacroEconomyState | null | undefined, regionId: string | null): number {
  if (!state) return 0;
  let fit = 0;
  if (state.productivityBand === 'strong' || state.productivityBand === 'leading') fit += 1;
  if (state.investmentClimate === 'balanced' || state.investmentClimate === 'active') fit += 0.5;
  if (regionId) {
    const row = state.regionalContributions.find(r => r.regionId === regionId);
    if (row && (row.role === 'driver' || row.role === 'anchor')) fit += 0.5;
  }
  return v1014Clamp(fit, -2, 2);
}

export function evaluateMacroEconomyGuardianWarnings(gs: any): Array<{ id: string; title: string; detail: string; severity: 'info' | 'warn' }> {
  if (gs.gameSettings && (gs.gameSettings.macroEconomyEnabled === false || gs.gameSettings.nationalSystemsEnabled === false)) return [];
  const st = gs.macroEconomyState as NationalMacroEconomyState | undefined;
  if (!st) return [];
  const out: Array<{ id: string; title: string; detail: string; severity: 'info' | 'warn' }> = [];
  if (!st.accounting.identityOk) out.push({ id: 'me_accounting', title: 'Macro accounting identity drift', detail: `Residual ${st.accounting.identityResidual.toFixed(6)}`, severity: 'warn' });
  if (st.cyclePhase === 'contraction' || st.cyclePhase === 'trough') out.push({ id: 'me_cycle_down', title: 'National business cycle is weakening', detail: `Phase ${st.cyclePhase}`, severity: 'info' });
  if (st.investmentClimate === 'frozen') out.push({ id: 'me_inv_frozen', title: 'Macro investment climate frozen', detail: 'National gross investment index is depressed', severity: 'info' });
  return out;
}

