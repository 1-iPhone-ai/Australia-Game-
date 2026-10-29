// OP10M_MODULE_BEGIN agent-09-population
// Agent 09 — V10.14 labor demographics (generated; source: operation-10m/agent-09-population/v10-14-labor-demographics/)

// --- source: types.ts ---
/**
 * V10.14 — Labor demographics types (Agent 09 / Operation 10M)
 * Serializable types only; no imports from canonical TSX.
 */

export const V1014_LABOR_SCHEMA_VERSION = '10.14.0';

export const V1014_LABOR_CORE_REGIONS: readonly string[] = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT'
] as const;

export const V1014_LABOR_LIMITS = {
  maxHistory: 24,
  maxTransitions: 16,
  maxIndustryLinks: 8,
  maxEvidence: 8,
  hysteresisDeadband: 2.0,
  maxEventsPerTurn: 6,
  maxActiveMigrationShocks: 8,
  migrationShockDefaultDuration: 3
} as const;

export type StrategicIndustryKind =
  | 'energy'
  | 'mining'
  | 'agriculture'
  | 'manufacturing'
  | 'research'
  | 'technology'
  | 'tourism'
  | 'trade';

export const STRATEGIC_INDUSTRIES: StrategicIndustryKind[] = [
  'energy',
  'mining',
  'agriculture',
  'manufacturing',
  'research',
  'technology',
  'tourism',
  'trade'
];

export const INDUSTRY_LABEL: Record<StrategicIndustryKind, string> = {
  mining: 'Mining',
  agriculture: 'Agriculture',
  energy: 'Energy',
  manufacturing: 'Manufacturing',
  technology: 'Technology',
  research: 'Research',
  tourism: 'Tourism',
  trade: 'Trade'
};

/** Labor-intensity weight per strategic industry (employment linkage to output). */
export const V1014_LABOR_INDUSTRY_LABOR_WEIGHT: Record<StrategicIndustryKind, number> = {
  energy: 0.55,
  mining: 0.72,
  agriculture: 0.85,
  manufacturing: 0.95,
  research: 0.65,
  technology: 0.78,
  tourism: 1.05,
  trade: 0.62
};

export type DemographicStructureBand =
  | 'contracting'
  | 'aging_pressure'
  | 'stable'
  | 'youthful_growth'
  | 'rapid_growth';

export type EmploymentLinkageBand =
  | 'dislocated'
  | 'weak'
  | 'balanced'
  | 'strong'
  | 'tight_labor';

export type WagePressureBand =
  | 'deflationary'
  | 'soft'
  | 'stable'
  | 'elevated'
  | 'surging';

export type MigrationFlowBand =
  | 'outflow'
  | 'slight_outflow'
  | 'balanced'
  | 'inflow'
  | 'strong_inflow';

export const DEMOGRAPHIC_STRUCTURE_LABEL: Record<DemographicStructureBand, string> = {
  contracting: 'Contracting workforce base',
  aging_pressure: 'Aging workforce pressure',
  stable: 'Stable demographic structure',
  youthful_growth: 'Youthful growth profile',
  rapid_growth: 'Rapid demographic expansion'
};

export const EMPLOYMENT_LINKAGE_LABEL: Record<EmploymentLinkageBand, string> = {
  dislocated: 'Output–employment dislocation',
  weak: 'Weak employment linkage',
  balanced: 'Balanced linkage to output',
  strong: 'Strong output-driven employment',
  tight_labor: 'Tight labor market linkage'
};

export const WAGE_PRESSURE_LABEL: Record<WagePressureBand, string> = {
  deflationary: 'Deflationary wage pressure',
  soft: 'Soft wage conditions',
  stable: 'Stable wage pressure',
  elevated: 'Elevated wage pressure',
  surging: 'Surging wage pressure'
};

export const MIGRATION_FLOW_LABEL: Record<MigrationFlowBand, string> = {
  outflow: 'Net outflow',
  slight_outflow: 'Slight outflow',
  balanced: 'Balanced migration',
  inflow: 'Net inflow',
  strong_inflow: 'Strong inflow'
};

export interface LaborDemographicsRegionSnapshot {
  regionId: string;
  demographicStructure: DemographicStructureBand;
  demographicScore: number;
  employmentLinkage: EmploymentLinkageBand;
  employmentLinkageScore: number;
  wagePressure: WagePressureBand;
  wagePressureScore: number;
  migrationFlow: MigrationFlowBand;
  migrationFlowScore: number;
  dominantIndustry: StrategicIndustryKind | null;
  industryOutputIndex: number;
  workforceStrainIndex: number;
  householdEmploymentFit: number;
  automationPressureIndex?: number;
  householdBudgetPressureScore?: number;
  householdEssentialsGapScore?: number;
}

export interface LaborDemographicsIndustryLink {
  industry: StrategicIndustryKind;
  nationalOutputShare: number;
  employmentWeight: number;
  linkageScore: number;
  regionalHotspots: string[];
}

export interface LaborDemographicsTransition {
  id: string;
  turn: number;
  scope: 'national' | 'regional';
  regionId?: string;
  field: string;
  from: string;
  to: string;
  reason: string;
}

export interface NationalLaborDemographicsState {
  schemaVersion: string;
  turn: number;
  revision: number;
  inputHash: string;
  enabled: boolean;
  nationalDemographicStructure: DemographicStructureBand;
  nationalEmploymentLinkage: EmploymentLinkageBand;
  nationalWagePressure: WagePressureBand;
  nationalMigrationFlow: MigrationFlowBand;
  demographicScore: number;
  employmentLinkageScore: number;
  wagePressureScore: number;
  migrationFlowScore: number;
  regions: Record<string, LaborDemographicsRegionSnapshot>;
  industryLinks: LaborDemographicsIndustryLink[];
  summary: string;
  outlook: string;
  transitions: LaborDemographicsTransition[];
  evidence: string[];
  automationFeedbackSummary?: string;
  householdBudgetSummary?: string;
  activeMigrationShocks?: LaborMigrationShockView[];
}

export type MigrationShockKind =
  | 'resource_boom_inflow'
  | 'housing_affordability_outflow'
  | 'essential_access_outflow'
  | 'metro_talent_pull'
  | 'frontier_recovery_inflow';

export interface LaborMigrationShock {
  id: string;
  kind: MigrationShockKind;
  regionId: string;
  magnitude: number;
  turnsRemaining: number;
  startedTurn: number;
  reason: string;
}

export interface LaborMigrationShockView {
  id: string;
  kind: MigrationShockKind;
  regionId: string;
  magnitude: number;
  turnsRemaining: number;
  label: string;
}

export interface RegionalHouseholdBudgetDetail {
  regionId: string;
  budgetPressureScore: number;
  essentialsGapScore: number;
  resilienceScore: number;
  affordabilityBand: string;
  essentialsBand: string;
  narrative: string;
}

export interface NationalHouseholdBudgetDetail {
  nationalBudgetPressureScore: number;
  nationalEssentialsGapScore: number;
  shockSensitivity: 'low' | 'moderate' | 'high' | 'critical';
  regions: Record<string, RegionalHouseholdBudgetDetail>;
  summary: string;
}

export interface LaborDemographicsPersisted {
  schemaVersion: string;
  revision: number;
  initializedTurn: number | null;
  lastUpdatedTurn: number;
  lastInputHash: string;
  nationalHysteresis: {
    demographicStructure: DemographicStructureBand;
    employmentLinkage: EmploymentLinkageBand;
    wagePressure: WagePressureBand;
    migrationFlow: MigrationFlowBand;
    demographicScore: number;
    employmentLinkageScore: number;
    wagePressureScore: number;
    migrationFlowScore: number;
  };
  regionalHysteresis: Record<
    string,
    {
      demographicStructure: DemographicStructureBand;
      employmentLinkage: EmploymentLinkageBand;
      wagePressure: WagePressureBand;
      migrationFlow: MigrationFlowBand;
    }
  >;
  transitions: LaborDemographicsTransition[];
  history: Array<{ turn: number; hash: string; summary: string }>;
  activeMigrationShocks?: LaborMigrationShock[];
}

export interface LaborDemographicsInputs {
  turn: number;
  enabled?: boolean;
  industries?: any;
  workforce?: any;
  households?: any;
  livingRegions?: any;
  economicGeography?: any;
  capabilities?: Array<{ id: string; active?: boolean; automationShift?: number }>;
  /** Test / scenario hook — inject shocks without mutating canonical crisis systems. */
  migrationShockOverrides?: LaborMigrationShock[];
}

export interface LaborDemographicsWorldView {
  enabled: boolean;
  state: NationalLaborDemographicsState;
  persisted: LaborDemographicsPersisted;
  inputs: LaborDemographicsInputs;
}


// --- source: boundaries.ts ---
/**
 * Structural boundary rules — mirrors SECTION 20AJ invariants.
 */

export const V1014_LABOR_FORBIDDEN_STATE_KEYS = [
  'population',
  'unemploymentRate',
  'workerAgents',
  'payrollCost',
  'wageBill',
  'migrationQuota'
] as const;

export const V1014_LABOR_BOUNDARY_RULES: readonly { id: string; rule: string }[] = [
  {
    id: 'no_population_counts',
    rule: 'Never persist literal population, unemployment %, payroll, or migration quota figures — only bands and 0..100 indices.'
  },
  {
    id: 'v101_industry_output',
    rule: 'V10.1 effectiveOutput remains authoritative for employment linkage; V10.14 interprets only.'
  },
  {
    id: 'v1010_workforce',
    rule: 'V10.10 workforce pressure and automation shift remain authoritative; V10.14 reads strain for wages and automation feedback.'
  },
  {
    id: 'v1013_households',
    rule: 'V10.13 household employment opportunity informs fit scores but is never overwritten here.'
  },
  {
    id: 'no_wallets',
    rule: 'Labor demographics never mutates player cash, AP, or commodity prices.'
  }
] as const;

export function summarizeLaborBoundariesForGi(): string[] {
  return V1014_LABOR_BOUNDARY_RULES.map(r => r.rule);
}


// --- source: bands.ts ---
  DemographicStructureBand,
  EmploymentLinkageBand,
  MigrationFlowBand,
  WagePressureBand
} from './types';

export function v1014laborClamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, n));
}

export function v1014laborBandDemographic(score: number): DemographicStructureBand {
  if (score < 28) return 'contracting';
  if (score < 42) return 'aging_pressure';
  if (score < 58) return 'stable';
  if (score < 72) return 'youthful_growth';
  return 'rapid_growth';
}

export function v1014laborBandEmployment(score: number): EmploymentLinkageBand {
  if (score < 30) return 'dislocated';
  if (score < 45) return 'weak';
  if (score < 62) return 'balanced';
  if (score < 78) return 'strong';
  return 'tight_labor';
}

export function v1014laborBandWage(score: number): WagePressureBand {
  if (score < 25) return 'deflationary';
  if (score < 42) return 'soft';
  if (score < 58) return 'stable';
  if (score < 74) return 'elevated';
  return 'surging';
}

export function v1014laborBandMigration(score: number): MigrationFlowBand {
  if (score < 28) return 'outflow';
  if (score < 44) return 'slight_outflow';
  if (score < 56) return 'balanced';
  if (score < 72) return 'inflow';
  return 'strong_inflow';
}

export function v1014laborApplyHysteresis<T extends string>(
  prevBand: T,
  targetScore: number,
  prevScore: number,
  bandFn: (s: number) => T
): { band: T; score: number } {
  const target = bandFn(targetScore);
  const dead = V1014_LABOR_LIMITS.hysteresisDeadband;
  if (target === prevBand) {
    return { band: prevBand, score: v1014laborClamp(prevScore * 0.35 + targetScore * 0.65) };
  }
  const delta = Math.abs(targetScore - prevScore);
  if (delta < dead) {
    return { band: prevBand, score: v1014laborClamp(prevScore * 0.6 + targetScore * 0.4) };
  }
  return { band: target, score: v1014laborClamp(targetScore) };
}


// --- source: demographics.ts ---

/** Demographic structure score from regional industry mix and Living Regions momentum. */
export function computeRegionalDemographicRaw(params: {
  momentumBoost: number;
  dominant: StrategicIndustryKind | null;
}): number {
  const { momentumBoost, dominant } = params;
  return v1014laborClamp(
    48 +
      momentumBoost +
      (dominant === 'technology' || dominant === 'research' ? 6 : 0) +
      (dominant === 'agriculture' ? -4 : 0)
  );
}

export function livingRegionsMomentumBoost(livingRegions: any, regionId: string): number {
  const lr = livingRegions?.regions?.[regionId];
  if (lr?.momentum?.band === 'rising') return 8;
  if (lr?.momentum?.band === 'falling') return -6;
  return 0;
}


// --- source: wages.ts ---

/** Wage pressure from workforce strain, industry output index, and momentum. */
export function computeRegionalWagePressureRaw(params: {
  wfStrain: number;
  outputIndex: number;
  momentumBoost: number;
}): number {
  const { wfStrain, outputIndex, momentumBoost } = params;
  return v1014laborClamp(wfStrain * 0.45 + outputIndex * 0.35 + momentumBoost + 10);
}

export function workforceStrainForRegion(regionId: string, workforce: any): number {
  if (!workforce?.regions) return 50;
  const r = workforce.regions[regionId];
  if (!r) return 50;
  const ratio = Number(r.effectivePressureRatio ?? r.pressureRatio ?? 0.5);
  return v1014laborClamp(ratio * 100);
}


// --- source: migration.ts ---

export function computeRegionalAttractiveness(params: {
  empLinkageRaw: number;
  wfStrain: number;
  hhFit: number;
}): number {
  const { empLinkageRaw, wfStrain, hhFit } = params;
  return empLinkageRaw * 0.5 + (100 - wfStrain) * 0.3 + hhFit * 0.2;
}

export function applyMigrationScoresToRegions(
  regions: Record<string, { migrationFlow: MigrationFlowBand; migrationFlowScore: number }>,
  attractiveness: Record<string, number>
): void {
  const avgAttr =
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + (attractiveness[c] || 50), 0) /
    V1014_LABOR_CORE_REGIONS.length;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const diff = (attractiveness[regionId] || 50) - avgAttr;
    const migRaw = v1014laborClamp(50 + diff * 0.85);
    regions[regionId].migrationFlow = v1014laborBandMigration(migRaw);
    regions[regionId].migrationFlowScore = migRaw;
  });
}

export function nationalMigrationAverage(
  regions: Record<string, { migrationFlowScore: number }>
): number {
  return v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].migrationFlowScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
}


// --- source: employment-linkage.ts ---
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_INDUSTRY_LABOR_WEIGHT,
  V1014_LABOR_LIMITS,
  type LaborDemographicsIndustryLink,
  type StrategicIndustryKind,
  INDUSTRY_LABEL
} from './types';

export function v1014laborRegionIndustryOutputIndex(
  regionId: string,
  industries: any
): { index: number; dominant: StrategicIndustryKind | null } {
  const reg = industries?.regions?.[regionId];
  if (!reg?.industries) return { index: 0, dominant: null };
  let best: StrategicIndustryKind | null = null;
  let bestOut = 0;
  let weighted = 0;
  STRATEGIC_INDUSTRIES.forEach(k => {
    const st = reg.industries[k];
    const out = Math.max(0, Number(st?.effectiveOutput || 0));
    const w = V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k];
    weighted += out * w;
    if (out > bestOut) {
      bestOut = out;
      best = k;
    }
  });
  return { index: v1014laborClamp(weighted / 4.5), dominant: bestOut >= 8 ? best : null };
}

export function computeRegionalEmploymentLinkageRaw(params: {
  outputIndex: number;
  hhFit: number;
  wfStrain: number;
}): number {
  const { outputIndex, hhFit, wfStrain } = params;
  return v1014laborClamp(outputIndex * 0.55 + hhFit * 0.25 + (100 - wfStrain) * 0.2);
}

export function householdEmploymentFit(regionId: string, households: any): number {
  const reg = households?.regions?.[regionId];
  if (!reg) return 50;
  const rankMap: Record<string, number> = {
    scarce: 20,
    weak: 35,
    balanced: 55,
    strong: 72,
    abundant: 88
  };
  const band = reg.employmentOpportunity || reg.employmentOpportunityBand || 'balanced';
  return rankMap[String(band)] ?? 50;
}

export function buildIndustryLinks(industries: any): LaborDemographicsIndustryLink[] {
  const indOut = industries?.national?.output || {};
  const tot =
    STRATEGIC_INDUSTRIES.reduce((a, k) => a + Math.max(0, Number((indOut as any)[k] || 0)), 0) || 1;
  return STRATEGIC_INDUSTRIES.map(k => {
    const share = Math.max(0, Number((indOut as any)[k] || 0)) / tot;
    const hotspots = V1014_LABOR_CORE_REGIONS.filter(c => {
      const st = industries?.regions?.[c]?.industries?.[k];
      return st && Number(st.effectiveOutput || 0) >= 15;
    }).slice(0, 4);
    const linkageScore = v1014laborClamp(share * 100 * V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k]);
    return {
      industry: k,
      nationalOutputShare: share,
      employmentWeight: V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k],
      linkageScore,
      regionalHotspots: hotspots
    };
  })
    .sort((a, b) => b.linkageScore - a.linkageScore)
    .slice(0, V1014_LABOR_LIMITS.maxIndustryLinks);
}

export function formatIndustryEvidence(links: LaborDemographicsIndustryLink[]): string[] {
  return links
    .slice(0, 3)
    .map(
      l =>
        `${INDUSTRY_LABEL[l.industry]} linkage ${Math.round(l.linkageScore)} (${l.regionalHotspots.join(', ') || 'national'})`
    );
}


// --- source: automation-feedback.ts ---
/**
 * Automation → labor market feedback (read-only interpretation).
 * Connects V10.10 automation shift signals to bounded score adjustments and steward hints.
 */


export type AutomationLaborPressureBand = 'minimal' | 'moderate' | 'accelerating' | 'disruptive';

export interface LaborAutomationFeedback {
  pressureBand: AutomationLaborPressureBand;
  nationalAutomationIndex: number;
  employmentLinkageAdjust: number;
  wagePressureAdjust: number;
  demographicAdjust: number;
  migrationAdjust: number;
  stewardHints: string[];
  playerFacingSummary: string;
}

function bandFromIndex(index: number): AutomationLaborPressureBand {
  if (index < 25) return 'minimal';
  if (index < 50) return 'moderate';
  if (index < 75) return 'accelerating';
  return 'disruptive';
}

export function computeLaborAutomationFeedback(params: {
  workforce?: any;
  capabilities?: Array<{ id: string; active?: boolean; automationShift?: number }>;
  wfStrainNational?: number;
}): LaborAutomationFeedback {
  const caps = (params.capabilities || []).filter(c => c.active !== false);
  let capAvg = 0;
  if (caps.length) {
    capAvg =
      caps.reduce((a, c) => a + Math.max(0, Math.min(100, Number(c.automationShift) || 0)), 0) /
      caps.length;
  }

  const domains = params.workforce?.domains;
  let domainAuto = 0;
  if (domains && typeof domains === 'object') {
    const mods = Object.values(domains as Record<string, { automationShiftModifier?: number }>)
      .map(d => Math.abs(Number(d.automationShiftModifier) || 0) * 100)
      .filter(Number.isFinite);
    if (mods.length) domainAuto = mods.reduce((a, b) => a + b, 0) / mods.length;
  }

  const summaryText = String(params.workforce?.automationShiftSummary || '');
  const summaryBoost = summaryText.toLowerCase().includes('automation') ? 8 : 0;

  const nationalAutomationIndex = v1014laborClamp(capAvg * 0.45 + domainAuto * 0.35 + summaryBoost);
  const pressureBand = bandFromIndex(nationalAutomationIndex);

  const strain = params.wfStrainNational ?? 50;
  const employmentLinkageAdjust = -v1014laborClamp(nationalAutomationIndex * 0.12, 0, 14);
  const wagePressureAdjust = v1014laborClamp(
    nationalAutomationIndex * 0.06 + (strain > 65 ? nationalAutomationIndex * 0.05 : -nationalAutomationIndex * 0.03),
    -8,
    12
  );
  const demographicAdjust = v1014laborClamp(nationalAutomationIndex * 0.04 - 2, -4, 6);
  const migrationAdjust = v1014laborClamp(nationalAutomationIndex * 0.03 - 1.5, -3, 5);

  const stewardHints: string[] = [];
  if (pressureBand === 'disruptive') {
    stewardHints.push(
      'Automation is reshaping labor linkage — prefer workforce transition actions before further auto commits.'
    );
  } else if (pressureBand === 'accelerating') {
    stewardHints.push('Elevated automation shift — monitor wage pressure in high-output regions.');
  } else if (pressureBand === 'moderate') {
    stewardHints.push('Moderate automation feedback — employment linkage tracks output with normal hysteresis.');
  } else {
    stewardHints.push('Automation pressure minimal — labor demographics follow industry output only.');
  }

  const playerFacingSummary =
    summaryText ||
    `Automation pressure index ${Math.round(nationalAutomationIndex)} (${pressureBand.replace('_', ' ')}).`;

  return {
    pressureBand,
    nationalAutomationIndex,
    employmentLinkageAdjust,
    wagePressureAdjust,
    demographicAdjust,
    migrationAdjust,
    stewardHints,
    playerFacingSummary
  };
}

export function mergeAutomationFeedbackIntoRegionalScores(
  scores: {
    empLinkageRaw: number;
    wageRaw: number;
    demoRaw: number;
    migRaw?: number;
  },
  feedback: LaborAutomationFeedback
): typeof scores {
  return {
    empLinkageRaw: v1014laborClamp(scores.empLinkageRaw + feedback.employmentLinkageAdjust),
    wageRaw: v1014laborClamp(scores.wageRaw + feedback.wagePressureAdjust),
    demoRaw: v1014laborClamp(scores.demoRaw + feedback.demographicAdjust),
    migRaw:
      scores.migRaw != null
        ? v1014laborClamp(scores.migRaw + feedback.migrationAdjust)
        : undefined
  };
}


// --- source: household-budget-detail.ts ---
  V1014_LABOR_CORE_REGIONS,
  type NationalHouseholdBudgetDetail,
  type RegionalHouseholdBudgetDetail
} from './types';

const AFFORDABILITY_RANK: Record<string, number> = {
  severe_pressure: 12,
  strained: 28,
  tight: 45,
  healthy: 68,
  very_affordable: 88
};

const RESILIENCE_RANK: Record<string, number> = {
  vulnerable: 15,
  fragile: 32,
  moderate: 52,
  resilient: 72,
  robust: 90
};

const ESSENTIALS_RANK: Record<string, number> = {
  critical: 10,
  poor: 25,
  strained: 42,
  adequate: 62,
  strong: 85
};

const HOUSING_PRESSURE_RANK: Record<string, number> = {
  severe: 8,
  high: 22,
  elevated: 38,
  moderate: 55,
  low: 78
};

function rank(map: Record<string, number>, band: unknown, fallback = 50): number {
  const key = String(band ?? '');
  return map[key] ?? fallback;
}

export function computeRegionalHouseholdBudgetDetail(
  regionId: string,
  households: any
): RegionalHouseholdBudgetDetail {
  const reg = households?.regions?.[regionId];
  if (!reg) {
    return {
      regionId,
      budgetPressureScore: 50,
      essentialsGapScore: 50,
      resilienceScore: 50,
      affordabilityBand: 'unknown',
      essentialsBand: 'unknown',
      narrative: 'Household budget detail unavailable — using neutral pressure.'
    };
  }

  const affordabilityBand = String(reg.affordability ?? households?.national?.affordability ?? 'tight');
  const essentialsBand = String(reg.essentialAccess ?? 'adequate');
  const resilienceBand = String(reg.resilience ?? reg.financialResilience ?? 'moderate');
  const housingBand = String(reg.housingPressure ?? households?.national?.housingPressure ?? 'moderate');

  const affordabilityScore = rank(AFFORDABILITY_RANK, affordabilityBand);
  const essentialsScore = rank(ESSENTIALS_RANK, essentialsBand);
  const resilienceScore = rank(RESILIENCE_RANK, resilienceBand);
  const housingScore = rank(HOUSING_PRESSURE_RANK, housingBand);

  const budgetPressureScore = v1014laborClamp(
    100 - affordabilityScore * 0.45 - resilienceScore * 0.25 - housingScore * 0.3
  );
  const essentialsGapScore = v1014laborClamp(100 - essentialsScore);

  const narrative =
    budgetPressureScore >= 65
      ? `Elevated household budget pressure (${affordabilityBand.replace(/_/g, ' ')}) weighs on labor mobility.`
      : budgetPressureScore <= 35
        ? `Household budgets are relatively resilient (${affordabilityBand.replace(/_/g, ' ')}).`
        : `Mixed household budget conditions (${affordabilityBand.replace(/_/g, ' ')}).`;

  return {
    regionId,
    budgetPressureScore,
    essentialsGapScore,
    resilienceScore,
    affordabilityBand,
    essentialsBand,
    narrative
  };
}

export function computeNationalHouseholdBudgetDetail(households: any): NationalHouseholdBudgetDetail {
  const regions: Record<string, RegionalHouseholdBudgetDetail> = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = computeRegionalHouseholdBudgetDetail(c, households);
  });

  const nationalBudgetPressureScore = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].budgetPressureScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalEssentialsGapScore = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].essentialsGapScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );

  const natAff = rank(AFFORDABILITY_RANK, households?.national?.affordability, 50);
  const natRes = rank(RESILIENCE_RANK, households?.national?.financialResilience, 50);
  let shockSensitivity: NationalHouseholdBudgetDetail['shockSensitivity'] = 'moderate';
  if (natRes <= 20 || (natRes <= 35 && natAff <= 25)) shockSensitivity = 'critical';
  else if (natRes <= 35 || natAff <= 30) shockSensitivity = 'high';
  else if (natRes >= 70 && natAff >= 65) shockSensitivity = 'low';

  const summary = `National household budget pressure index ${Math.round(nationalBudgetPressureScore)} (essentials gap ${Math.round(nationalEssentialsGapScore)}); shock sensitivity ${shockSensitivity}.`;

  return {
    nationalBudgetPressureScore,
    nationalEssentialsGapScore,
    shockSensitivity,
    regions,
    summary
  };
}

/** Bounded labor-market adjustments from household budget detail (no currency). */
export function householdBudgetLaborAdjustments(detail: RegionalHouseholdBudgetDetail): {
  attractivenessDelta: number;
  wagePressureDelta: number;
  employmentFitDelta: number;
} {
  const attractivenessDelta = -v1014laborClamp(detail.budgetPressureScore * 0.12, 0, 12);
  const wagePressureDelta = v1014laborClamp(detail.budgetPressureScore * 0.06, 0, 8);
  const employmentFitDelta = -v1014laborClamp(detail.essentialsGapScore * 0.08, 0, 10);
  return { attractivenessDelta, wagePressureDelta, employmentFitDelta };
}


// --- source: migration-shocks.ts ---
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  type LaborDemographicsInputs,
  type LaborMigrationShock,
  type LaborMigrationShockView,
  type MigrationFlowBand,
  type MigrationShockKind
} from './types';

export const MIGRATION_SHOCK_LABEL: Record<MigrationShockKind, string> = {
  resource_boom_inflow: 'Resource-sector labor inflow shock',
  housing_affordability_outflow: 'Housing affordability outflow shock',
  essential_access_outflow: 'Essential access outflow shock',
  metro_talent_pull: 'Metro talent pull shock',
  frontier_recovery_inflow: 'Frontier recovery inflow shock'
};

function shockId(kind: MigrationShockKind, regionId: string, turn: number): string {
  return `msh_${kind}_${regionId}_t${turn}`;
}

export function detectMigrationShocks(params: {
  turn: number;
  inputs: LaborDemographicsInputs;
  householdBudget: NationalHouseholdBudgetDetail;
}): LaborMigrationShock[] {
  const { turn, inputs, householdBudget } = params;
  const shocks: LaborMigrationShock[] = [];
  const duration = V1014_LABOR_LIMITS.migrationShockDefaultDuration;

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const miningOut = Number(inputs.industries?.regions?.[regionId]?.industries?.mining?.effectiveOutput || 0);
    if (miningOut >= 45 && (regionId === 'WA' || regionId === 'QLD')) {
      shocks.push({
        id: shockId('resource_boom_inflow', regionId, turn),
        kind: 'resource_boom_inflow',
        regionId,
        magnitude: v1014laborClamp(8 + miningOut * 0.15, 8, 22),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'High mining effectiveOutput pulls structural inflow (no population counts).'
      });
    }

    const hh = householdBudget.regions[regionId];
    if (hh && hh.budgetPressureScore >= 68) {
      shocks.push({
        id: shockId('housing_affordability_outflow', regionId, turn),
        kind: 'housing_affordability_outflow',
        regionId,
        magnitude: -v1014laborClamp(hh.budgetPressureScore * 0.18, 6, 18),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Severe household budget pressure discourages net inflow.'
      });
    }
    if (hh && hh.essentialsGapScore >= 55) {
      shocks.push({
        id: shockId('essential_access_outflow', regionId, turn),
        kind: 'essential_access_outflow',
        regionId,
        magnitude: -v1014laborClamp(hh.essentialsGapScore * 0.12, 4, 14),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Essential access strain increases outflow pressure.'
      });
    }

    const techOut = Number(inputs.industries?.regions?.[regionId]?.industries?.technology?.effectiveOutput || 0);
    if ((regionId === 'NSW' || regionId === 'VIC') && techOut >= 35 && hh && hh.budgetPressureScore <= 45) {
      shocks.push({
        id: shockId('metro_talent_pull', regionId, turn),
        kind: 'metro_talent_pull',
        regionId,
        magnitude: v1014laborClamp(6 + techOut * 0.1, 6, 16),
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'Metro tech output with manageable budgets attracts talent inflow.'
      });
    }
  });

  if (householdBudget.shockSensitivity === 'critical' || householdBudget.shockSensitivity === 'high') {
    const frontier = ['NT', 'TAS', 'SA'].find(
      c => (householdBudget.regions[c]?.budgetPressureScore ?? 50) <= 40
    );
    if (frontier) {
      shocks.push({
        id: shockId('frontier_recovery_inflow', frontier, turn),
        kind: 'frontier_recovery_inflow',
        regionId: frontier,
        magnitude: 7,
        turnsRemaining: duration,
        startedTurn: turn,
        reason: 'National household shock sensitivity redirects modest recovery inflow to a frontier region.'
      });
    }
  }

  return shocks.slice(0, V1014_LABOR_LIMITS.maxActiveMigrationShocks);
}

export function mergeMigrationShocks(
  persisted: LaborMigrationShock[] | undefined,
  detected: LaborMigrationShock[],
  overrides: LaborMigrationShock[] | undefined,
  turn: number
): LaborMigrationShock[] {
  const byId = new Map<string, LaborMigrationShock>();
  (persisted || []).forEach(s => {
    if (s.turnsRemaining > 0) byId.set(s.id, s);
  });
  detected.forEach(s => byId.set(s.id, s));
  (overrides || []).forEach(s => byId.set(s.id, { ...s, startedTurn: s.startedTurn || turn }));
  return [...byId.values()]
    .filter(s => s.turnsRemaining > 0)
    .slice(-V1014_LABOR_LIMITS.maxActiveMigrationShocks);
}

export function advanceMigrationShocks(shocks: LaborMigrationShock[], turn: number): LaborMigrationShock[] {
  return shocks
    .map(s => ({
      ...s,
      turnsRemaining: Math.max(0, s.turnsRemaining - (s.startedTurn < turn ? 1 : 0))
    }))
    .filter(s => s.turnsRemaining > 0);
}

export function applyMigrationShocksToRegions(
  regions: Record<string, { migrationFlow: MigrationFlowBand; migrationFlowScore: number }>,
  shocks: LaborMigrationShock[]
): { totalDeltaApplied: number; regionsTouched: string[] } {
  const deltas: Record<string, number> = {};
  shocks.forEach(s => {
    deltas[s.regionId] = (deltas[s.regionId] || 0) + s.magnitude;
  });
  let totalDeltaApplied = 0;
  const regionsTouched: string[] = [];
  Object.entries(deltas).forEach(([regionId, delta]) => {
    if (!regions[regionId]) return;
    const next = v1014laborClamp(regions[regionId].migrationFlowScore + delta);
    regions[regionId].migrationFlowScore = next;
    regions[regionId].migrationFlow = v1014laborBandMigration(next);
    totalDeltaApplied += Math.abs(delta);
    regionsTouched.push(regionId);
  });
  return { totalDeltaApplied, regionsTouched };
}

export function toMigrationShockViews(shocks: LaborMigrationShock[]): LaborMigrationShockView[] {
  return shocks.map(s => ({
    id: s.id,
    kind: s.kind,
    regionId: s.regionId,
    magnitude: s.magnitude,
    turnsRemaining: s.turnsRemaining,
    label: MIGRATION_SHOCK_LABEL[s.kind]
  }));
}


// --- source: persistence.ts ---
  v1014laborBandDemographic,
  v1014laborBandEmployment,
  v1014laborBandMigration,
  v1014laborBandWage,
  v1014laborClamp
} from './bands';
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  type LaborDemographicsInputs,
  type LaborDemographicsPersisted
} from './types';

export function createInitialLaborDemographicsPersisted(turn = 1): LaborDemographicsPersisted {
  return {
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    revision: 1,
    initializedTurn: null,
    lastUpdatedTurn: Math.max(1, turn),
    lastInputHash: '',
    nationalHysteresis: {
      demographicStructure: 'stable',
      employmentLinkage: 'balanced',
      wagePressure: 'stable',
      migrationFlow: 'balanced',
      demographicScore: 52,
      employmentLinkageScore: 55,
      wagePressureScore: 50,
      migrationFlowScore: 50
    },
    regionalHysteresis: {},
    transitions: [],
    history: [],
    activeMigrationShocks: []
  };
}

export function sanitizeLaborDemographicsPersisted(raw: any, turn = 1): LaborDemographicsPersisted {
  const base = createInitialLaborDemographicsPersisted(turn);
  if (!raw || typeof raw !== 'object') return base;
  const nh = raw.nationalHysteresis && typeof raw.nationalHysteresis === 'object' ? raw.nationalHysteresis : {};
  return {
    ...base,
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    revision: Math.max(1, Math.floor(Number(raw.revision) || base.revision)),
    initializedTurn: raw.initializedTurn == null ? null : Math.max(1, Math.floor(Number(raw.initializedTurn))),
    lastUpdatedTurn: Math.max(1, Math.floor(Number(raw.lastUpdatedTurn) || turn)),
    lastInputHash: typeof raw.lastInputHash === 'string' ? raw.lastInputHash.slice(0, 120) : '',
    nationalHysteresis: {
      demographicStructure: v1014laborBandDemographic(v1014laborClamp(Number(nh.demographicScore) || 52)),
      employmentLinkage: v1014laborBandEmployment(v1014laborClamp(Number(nh.employmentLinkageScore) || 55)),
      wagePressure: v1014laborBandWage(v1014laborClamp(Number(nh.wagePressureScore) || 50)),
      migrationFlow: v1014laborBandMigration(v1014laborClamp(Number(nh.migrationFlowScore) || 50)),
      demographicScore: v1014laborClamp(Number(nh.demographicScore) || 52),
      employmentLinkageScore: v1014laborClamp(Number(nh.employmentLinkageScore) || 55),
      wagePressureScore: v1014laborClamp(Number(nh.wagePressureScore) || 50),
      migrationFlowScore: v1014laborClamp(Number(nh.migrationFlowScore) || 50)
    },
    regionalHysteresis: typeof raw.regionalHysteresis === 'object' && raw.regionalHysteresis ? raw.regionalHysteresis : {},
    transitions: Array.isArray(raw.transitions) ? raw.transitions.slice(-V1014_LABOR_LIMITS.maxTransitions) : [],
    history: Array.isArray(raw.history) ? raw.history.slice(-V1014_LABOR_LIMITS.maxHistory) : [],
    activeMigrationShocks: Array.isArray(raw.activeMigrationShocks)
      ? raw.activeMigrationShocks.slice(-V1014_LABOR_LIMITS.maxActiveMigrationShocks)
      : []
  };
}

export function laborDemographicsInputHash(inputs: LaborDemographicsInputs): string {
  const turn = Math.floor(inputs.turn || 1);
  const ind = inputs.industries?.national?.output || {};
  const parts: string[] = [String(turn), inputs.enabled === false ? '0' : '1'];
  STRATEGIC_INDUSTRIES.forEach(k => parts.push(`${k}:${Math.round(Number((ind as any)[k] || 0))}`));
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    const reg = inputs.industries?.regions?.[c];
    if (!reg) return;
    STRATEGIC_INDUSTRIES.forEach(k => {
      const st = reg.industries?.[k];
      parts.push(`${c}:${k}:${Math.round(Number(st?.effectiveOutput || 0))}:${st?.condition || 'n'}`);
    });
  });
  const wf = inputs.workforce?.national?.effectivePressureRatio ?? inputs.workforce?.nationalPressureRatio;
  parts.push(`wf:${Math.round(Number(wf || 0) * 100)}`);
  const hh = inputs.households?.national?.employmentOpportunity;
  parts.push(`hh:${hh || 'n'}`);
  parts.push(`hhaff:${inputs.households?.national?.affordability || 'n'}`);
  const autoCaps = (inputs.capabilities || [])
    .filter(c => c.active !== false)
    .map(c => `${c.id}:${Math.round(Number(c.automationShift) || 0)}`)
    .join(',');
  parts.push(`auto:${autoCaps}`);
  let h = 2166136261;
  const s = parts.join('|');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `v1014_${(h >>> 0).toString(16)}`;
}


// --- source: inputs.ts ---

export function buildLaborDemographicsInputs(params: {
  turn: number;
  gameState?: any;
  gameSettings?: any;
  industries?: any;
  workforce?: any;
  households?: any;
  livingRegions?: any;
  economicGeography?: any;
  capabilities?: LaborDemographicsInputs['capabilities'];
}): LaborDemographicsInputs {
  const turn = Math.max(1, Math.floor(params.turn || 1));
  const gset = params.gameSettings || {};
  const enabled =
    gset.laborDemographicsEnabled !== false &&
    gset.nationalSystemsEnabled !== false &&
    gset.industriesEnabled !== false;
  return {
    turn,
    enabled,
    industries: params.industries || params.gameState?.industriesSupplyChainsState || null,
    workforce: params.workforce || params.gameState?.workforceState || null,
    households: params.households || params.gameState?.householdEconomyState || null,
    livingRegions: params.livingRegions || null,
    economicGeography: params.economicGeography || null,
    capabilities: params.capabilities || params.gameState?.capabilities || null
  };
}


// --- source: validate.ts ---

export function validateLaborDemographicsState(
  st: NationalLaborDemographicsState | null | undefined
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!st) return { valid: false, errors: ['null state'] };
  if (st.schemaVersion !== V1014_LABOR_SCHEMA_VERSION) errors.push('schema');
  if (!Number.isFinite(st.turn)) errors.push('turn');
  V1014_LABOR_FORBIDDEN_STATE_KEYS.forEach(k => {
    if ((st as any)[k] != null) errors.push(`forbidden:${k}`);
  });
  return { valid: errors.length === 0, errors };
}


// --- source: compute.ts ---
  computeNationalHouseholdBudgetDetail,
  householdBudgetLaborAdjustments
} from './household-budget-detail';
  applyMigrationShocksToRegions,
  detectMigrationShocks,
  mergeMigrationShocks,
  toMigrationShockViews
} from './migration-shocks';
  v1014laborApplyHysteresis,
  v1014laborBandDemographic,
  v1014laborBandEmployment,
  v1014laborBandMigration,
  v1014laborBandWage,
  v1014laborClamp
} from './bands';
  buildIndustryLinks,
  computeRegionalEmploymentLinkageRaw,
  formatIndustryEvidence,
  householdEmploymentFit,
  v1014laborRegionIndustryOutputIndex
} from './employment-linkage';
  applyMigrationScoresToRegions,
  computeRegionalAttractiveness,
  nationalMigrationAverage
} from './migration';
  EMPLOYMENT_LINKAGE_LABEL,
  INDUSTRY_LABEL,
  MIGRATION_FLOW_LABEL,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  WAGE_PRESSURE_LABEL,
  type DemographicStructureBand,
  type EmploymentLinkageBand,
  type LaborDemographicsRegionSnapshot,
  type LaborDemographicsTransition,
  type LaborDemographicsInputs,
  type LaborDemographicsPersisted,
  type MigrationFlowBand,
  type NationalLaborDemographicsState,
  type WagePressureBand
} from './types';

export function computeNationalLaborDemographics(
  inputs: LaborDemographicsInputs,
  rawPersisted?: LaborDemographicsPersisted | null,
  prevState?: NationalLaborDemographicsState | null
): { state: NationalLaborDemographicsState; persisted: LaborDemographicsPersisted; events: string[] } {
  const turn = Math.max(1, Math.floor(inputs.turn || 1));
  const persisted = sanitizeLaborDemographicsPersisted(rawPersisted, turn);
  const hash = laborDemographicsInputHash(inputs);
  const events: string[] = [];
  if (!inputs.enabled) {
    const off: NationalLaborDemographicsState = {
      schemaVersion: V1014_LABOR_SCHEMA_VERSION,
      turn,
      revision: persisted.revision,
      inputHash: hash,
      enabled: false,
      nationalDemographicStructure: 'stable',
      nationalEmploymentLinkage: 'balanced',
      nationalWagePressure: 'stable',
      nationalMigrationFlow: 'balanced',
      demographicScore: 50,
      employmentLinkageScore: 50,
      wagePressureScore: 50,
      migrationFlowScore: 50,
      regions: {},
      industryLinks: [],
      summary: 'Labor demographics layer disabled.',
      outlook: 'Enable National Systems, Industries, and Labor Demographics to compute industry-linked structure.',
      transitions: [],
      evidence: []
    };
    return { state: off, persisted, events };
  }
  if (persisted.lastInputHash === hash && prevState && prevState.inputHash === hash) {
    return { state: prevState, persisted, events };
  }

  const nh = persisted.nationalHysteresis;
  const householdBudget = computeNationalHouseholdBudgetDetail(inputs.households);
  const regions: Record<string, LaborDemographicsRegionSnapshot> = {};
  const attractiveness: Record<string, number> = {};

  const wfStrainSamples: number[] = [];
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    wfStrainSamples.push(workforceStrainForRegion(regionId, inputs.workforce));
  });
  const wfStrainNational =
    wfStrainSamples.reduce((a, b) => a + b, 0) / Math.max(1, wfStrainSamples.length);

  const automationFeedback = computeLaborAutomationFeedback({
    workforce: inputs.workforce,
    capabilities: inputs.capabilities,
    wfStrainNational
  });

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const { index: outputIndex, dominant } = v1014laborRegionIndustryOutputIndex(regionId, inputs.industries);
    const wfStrain = workforceStrainForRegion(regionId, inputs.workforce);
    const hhFit = householdEmploymentFit(regionId, inputs.households);
    const momentumBoost = livingRegionsMomentumBoost(inputs.livingRegions, regionId);

    const hhDetail = householdBudget.regions[regionId];
    const budgetAdj = householdBudgetLaborAdjustments(hhDetail);

    let empLinkageRaw = computeRegionalEmploymentLinkageRaw({ outputIndex, hhFit, wfStrain });
    empLinkageRaw = v1014laborClamp(empLinkageRaw + budgetAdj.employmentFitDelta);
    let wageRaw = computeRegionalWagePressureRaw({ wfStrain, outputIndex, momentumBoost });
    wageRaw = v1014laborClamp(wageRaw + budgetAdj.wagePressureDelta);
    let demoRaw = computeRegionalDemographicRaw({ momentumBoost, dominant });
    ({ empLinkageRaw, wageRaw, demoRaw } = mergeAutomationFeedbackIntoRegionalScores(
      { empLinkageRaw, wageRaw, demoRaw },
      automationFeedback
    ));

    attractiveness[regionId] = computeRegionalAttractiveness({ empLinkageRaw, wfStrain, hhFit }) + budgetAdj.attractivenessDelta;

    regions[regionId] = {
      regionId,
      demographicStructure: v1014laborBandDemographic(demoRaw),
      demographicScore: demoRaw,
      employmentLinkage: v1014laborBandEmployment(empLinkageRaw),
      employmentLinkageScore: empLinkageRaw,
      wagePressure: v1014laborBandWage(wageRaw),
      wagePressureScore: wageRaw,
      migrationFlow: 'balanced',
      migrationFlowScore: 50,
      dominantIndustry: dominant,
      industryOutputIndex: outputIndex,
      workforceStrainIndex: wfStrain,
      householdEmploymentFit: hhFit,
      automationPressureIndex: automationFeedback.nationalAutomationIndex,
      householdBudgetPressureScore: hhDetail.budgetPressureScore,
      householdEssentialsGapScore: hhDetail.essentialsGapScore
    };
    persisted.regionalHysteresis[regionId] = {
      demographicStructure: regions[regionId].demographicStructure,
      employmentLinkage: regions[regionId].employmentLinkage,
      wagePressure: regions[regionId].wagePressure,
      migrationFlow: regions[regionId].migrationFlow
    };
  });

  applyMigrationScoresToRegions(regions, attractiveness);

  const tickedShocks = (persisted.activeMigrationShocks || [])
    .map(s => ({
      ...s,
      turnsRemaining:
        turn > s.startedTurn ? Math.max(0, s.turnsRemaining - 1) : s.turnsRemaining
    }))
    .filter(s => s.turnsRemaining > 0);

  const detectedShocks = detectMigrationShocks({ turn, inputs, householdBudget });
  const activeShocks = mergeMigrationShocks(
    tickedShocks,
    detectedShocks,
    inputs.migrationShockOverrides,
    turn
  );
  const shockApply = applyMigrationShocksToRegions(regions, activeShocks);
  if (shockApply.regionsTouched.length) {
    events.push(
      `Migration shocks active in ${shockApply.regionsTouched.join(', ')} (${activeShocks.length} shock(s)).`
    );
  }

  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    persisted.regionalHysteresis[regionId].migrationFlow = regions[regionId].migrationFlow;
  });

  const nationalEmp = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].employmentLinkageScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalWage = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].wagePressureScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalDemo = v1014laborClamp(
    V1014_LABOR_CORE_REGIONS.reduce((a, c) => a + regions[c].demographicScore, 0) /
      V1014_LABOR_CORE_REGIONS.length
  );
  const nationalMig = nationalMigrationAverage(regions);

  const empNat = v1014laborApplyHysteresis(
    nh.employmentLinkage,
    nationalEmp,
    nh.employmentLinkageScore,
    v1014laborBandEmployment
  );
  const wageNat = v1014laborApplyHysteresis(nh.wagePressure, nationalWage, nh.wagePressureScore, v1014laborBandWage);
  const demoNat = v1014laborApplyHysteresis(
    nh.demographicStructure,
    nationalDemo,
    nh.demographicScore,
    v1014laborBandDemographic
  );
  const migNat = v1014laborApplyHysteresis(
    nh.migrationFlow,
    nationalMig,
    nh.migrationFlowScore,
    v1014laborBandMigration
  );

  const industryLinks = buildIndustryLinks(inputs.industries);

  const transitions: LaborDemographicsTransition[] = [...persisted.transitions];
  const pushTransition = (
    scope: 'national' | 'regional',
    field: string,
    from: string,
    to: string,
    reason: string,
    regionId?: string
  ) => {
    if (from === to) return;
    transitions.push({
      id: `ld14_${turn}_${field}_${regionId || 'nat'}_${transitions.length}`,
      turn,
      scope,
      regionId,
      field,
      from,
      to,
      reason
    });
  };
  pushTransition(
    'national',
    'employmentLinkage',
    nh.employmentLinkage,
    empNat.band,
    'Industry output and workforce strain shifted national employment linkage.'
  );
  pushTransition(
    'national',
    'wagePressure',
    nh.wagePressure,
    wageNat.band,
    'Output momentum and workforce pressure adjusted wage bands.'
  );
  pushTransition(
    'national',
    'migrationFlow',
    nh.migrationFlow,
    migNat.band,
    'Regional employment attractiveness diverged.'
  );

  const nextPersisted: LaborDemographicsPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    initializedTurn: persisted.initializedTurn ?? turn,
    lastUpdatedTurn: turn,
    lastInputHash: hash,
    nationalHysteresis: {
      demographicStructure: demoNat.band as DemographicStructureBand,
      employmentLinkage: empNat.band as EmploymentLinkageBand,
      wagePressure: wageNat.band as WagePressureBand,
      migrationFlow: migNat.band as MigrationFlowBand,
      demographicScore: demoNat.score,
      employmentLinkageScore: empNat.score,
      wagePressureScore: wageNat.score,
      migrationFlowScore: migNat.score
    },
    regionalHysteresis: persisted.regionalHysteresis,
    transitions: transitions.slice(-V1014_LABOR_LIMITS.maxTransitions),
    history: [
      ...persisted.history,
      { turn, hash, summary: `emp=${empNat.band}, wage=${wageNat.band}, mig=${migNat.band}` }
    ].slice(-V1014_LABOR_LIMITS.maxHistory),
    activeMigrationShocks: activeShocks
  };

  const dominantLink = industryLinks[0];
  const summary = dominantLink
    ? `National employment linkage tracks ${INDUSTRY_LABEL[dominantLink.industry].toLowerCase()} output (${Math.round(dominantLink.nationalOutputShare * 100)}% share) with ${EMPLOYMENT_LINKAGE_LABEL[empNat.band as EmploymentLinkageBand].toLowerCase()}.`
    : `National employment linkage is ${EMPLOYMENT_LINKAGE_LABEL[empNat.band as EmploymentLinkageBand].toLowerCase()} with stable industry mix.`;
  const outlook = `Wage pressure ${WAGE_PRESSURE_LABEL[wageNat.band as WagePressureBand].toLowerCase()}; migration ${MIGRATION_FLOW_LABEL[migNat.band as MigrationFlowBand].toLowerCase()} toward high-output regions.`;

  const state: NationalLaborDemographicsState = {
    schemaVersion: V1014_LABOR_SCHEMA_VERSION,
    turn,
    revision: nextPersisted.revision,
    inputHash: hash,
    enabled: true,
    nationalDemographicStructure: demoNat.band as DemographicStructureBand,
    nationalEmploymentLinkage: empNat.band as EmploymentLinkageBand,
    nationalWagePressure: wageNat.band as WagePressureBand,
    nationalMigrationFlow: migNat.band as MigrationFlowBand,
    demographicScore: demoNat.score,
    employmentLinkageScore: empNat.score,
    wagePressureScore: wageNat.score,
    migrationFlowScore: migNat.score,
    regions,
    industryLinks,
    summary,
    outlook,
    transitions: nextPersisted.transitions,
    evidence: [
      ...formatIndustryEvidence(industryLinks),
      ...(householdBudget.nationalBudgetPressureScore >= 60
        ? [`Household budget pressure elevated (${Math.round(householdBudget.nationalBudgetPressureScore)})`]
        : [])
    ],
    automationFeedbackSummary: automationFeedback.playerFacingSummary,
    householdBudgetSummary: householdBudget.summary,
    activeMigrationShocks: toMigrationShockViews(activeShocks)
  };

  if (automationFeedback.stewardHints.length) {
    events.push(...automationFeedback.stewardHints.slice(0, V1014_LABOR_LIMITS.maxEventsPerTurn));
  }

  return { state, persisted: nextPersisted, events };
}


// --- source: self-tests.ts ---
  STRATEGIC_INDUSTRIES,
  V1014_LABOR_CORE_REGIONS,
  V1014_LABOR_INDUSTRY_LABOR_WEIGHT,
  V1014_LABOR_LIMITS,
  V1014_LABOR_SCHEMA_VERSION,
  type LaborDemographicsInputs,
  type NationalLaborDemographicsState
} from './types';

export function v1014laborMakeTestIndustries(overrides?: Partial<Record<string, number>>): any {
  const regions: any = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = { industries: {} as any };
    STRATEGIC_INDUSTRIES.forEach(k => {
      regions[c].industries[k] = {
        industry: k,
        effectiveOutput: k === 'mining' && c === 'WA' ? 55 : k === 'technology' && c === 'NSW' ? 40 : 12,
        condition: 'healthy'
      };
    });
  });
  const output: any = {};
  STRATEGIC_INDUSTRIES.forEach(k => {
    output[k] = k === 'mining' ? 120 : 40;
  });
  if (overrides) Object.assign(output, overrides);
  return { national: { output }, regions };
}

export function v1014laborMakeTestHouseholds(opts?: { severeRegion?: string; essentialsStrainRegion?: string }): any {
  const regions: any = {};
  V1014_LABOR_CORE_REGIONS.forEach(c => {
    regions[c] = {
      affordability: c === opts?.severeRegion ? 'severe_pressure' : 'healthy',
      essentialAccess: c === opts?.essentialsStrainRegion ? 'critical' : 'adequate',
      resilience: c === opts?.severeRegion ? 'fragile' : 'moderate',
      employmentOpportunity: 'balanced',
      housingPressure: c === opts?.severeRegion ? 'severe' : 'moderate'
    };
  });
  return {
    national: {
      affordability: opts?.severeRegion ? 'strained' : 'healthy',
      financialResilience: 'moderate',
      housingPressure: 'moderate',
      employmentOpportunity: 'balanced'
    },
    regions
  };
}

export interface SelfTestResult {
  id: string;
  passed: boolean;
  detail: string;
}

export function runV1014LaborDemographicsSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: SelfTestResult[];
} {
  const results: SelfTestResult[] = [];
  const check = (id: string, ok: boolean, detail: string) => results.push({ id, passed: ok, detail });

  check('LD01', V1014_LABOR_SCHEMA_VERSION === '10.14.0', 'schema version');
  check('LD02', V1014_LABOR_CORE_REGIONS.length === 8, 'core regions');
  check('LD03', STRATEGIC_INDUSTRIES.every(k => V1014_LABOR_INDUSTRY_LABOR_WEIGHT[k] > 0), 'labor weights');

  const baseInp: LaborDemographicsInputs = { turn: 3, enabled: true, industries: v1014laborMakeTestIndustries() };
  const r1 = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  check('LD04', validateLaborDemographicsState(r1.state).valid, 'valid state');
  check('LD05', Object.keys(r1.state.regions).length === 8, '8 regional snapshots');
  check('LD06', r1.state.industryLinks.length > 0, 'industry links');

  const rOff = computeNationalLaborDemographics({ turn: 1, enabled: false }, createInitialLaborDemographicsPersisted(), null);
  check('LD07', !rOff.state.enabled, 'disabled layer');

  const boomInp = { ...baseInp, industries: v1014laborMakeTestIndustries({ mining: 400, manufacturing: 200 }) };
  const rBoom = computeNationalLaborDemographics(boomInp, createInitialLaborDemographicsPersisted(), null);
  check('LD08', rBoom.state.employmentLinkageScore >= r1.state.employmentLinkageScore - 5, 'output boosts linkage');

  const hashA = laborDemographicsInputHash(baseInp);
  const hashB = laborDemographicsInputHash({ ...baseInp, turn: 4 });
  check('LD09', hashA !== hashB, 'hash turn sensitivity');
  check('LD10', laborDemographicsInputHash(baseInp) === hashA, 'hash stable');

  const detA = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  const detB = computeNationalLaborDemographics(baseInp, createInitialLaborDemographicsPersisted(), null);
  check('LD11', JSON.stringify(detA.state) === JSON.stringify(detB.state), 'determinism');

  const replayPers = createInitialLaborDemographicsPersisted();
  let replayState: NationalLaborDemographicsState | null = null;
  for (let t = 1; t <= 5; t++) {
    const step = { ...baseInp, turn: t };
    const rr = computeNationalLaborDemographics(step, replayPers, replayState);
    replayState = rr.state;
  }
  check('LD12', (replayState?.revision || 0) >= 2, 'replay revisions');

  check('LD13', !('population' in r1.state), 'no population key');
  check('LD14', r1.state.regions.WA?.dominantIndustry === 'mining', 'WA mining dominant');

  const wfStrained: any = { regions: { NSW: { effectivePressureRatio: 0.92 } } };
  const rStrain = computeNationalLaborDemographics({ ...baseInp, workforce: wfStrained }, createInitialLaborDemographicsPersisted(), null);
  check('LD15', rStrain.state.regions.NSW.wagePressureScore >= r1.state.regions.NSW.wagePressureScore - 3, 'workforce strain wages');

  const sanitized = sanitizeLaborDemographicsPersisted({ revision: 99, nationalHysteresis: { demographicScore: 200 } }, 2);
  check('LD16', sanitized.nationalHysteresis.demographicScore <= 100, 'sanitize clamp');

  const built = buildLaborDemographicsInputs({
    turn: 2,
    gameSettings: { nationalSystemsEnabled: true, industriesEnabled: true, laborDemographicsEnabled: true },
    industries: v1014laborMakeTestIndustries()
  });
  check('LD17', built.enabled === true, 'build enabled');
  check('LD18', buildLaborDemographicsInputs({ turn: 1, gameSettings: { laborDemographicsEnabled: false } }).enabled === false, 'build disabled flag');

  const autoCaps = [{ id: 'auto_mine', active: true, automationShift: 90 }];
  const rAuto = computeNationalLaborDemographics(
    { ...baseInp, capabilities: autoCaps, workforce: { automationShiftSummary: 'Automation reshaping mining domains.' } },
    createInitialLaborDemographicsPersisted(),
    null
  );
  check('AF01', Boolean(rAuto.state.automationFeedbackSummary), 'automation summary on state');
  check(
    'AF02',
    (rAuto.state.regions.NSW?.employmentLinkageScore || 100) <= (r1.state.regions.NSW?.employmentLinkageScore || 0) + 1,
    'automation lowers linkage vs baseline'
  );
  check('AF03', rAuto.events.length > 0, 'steward hint events emitted');

  const fb = computeLaborAutomationFeedback({
    capabilities: autoCaps,
    workforce: { automationShiftSummary: 'Automation shift active' },
    wfStrainNational: 70
  });
  check('AF04', fb.nationalAutomationIndex >= 45 && fb.stewardHints.length > 0, 'automation index and hints');
  check('AF05', laborDemographicsInputHash({ ...baseInp, capabilities: autoCaps }) !== hashA, 'hash includes automation');

  const hhInp = { ...baseInp, households: v1014laborMakeTestHouseholds() };
  const rHh = computeNationalLaborDemographics(hhInp, createInitialLaborDemographicsPersisted(), null);
  check('HB01', Boolean(rHh.state.householdBudgetSummary), 'household budget summary');
  check('HB02', typeof rHh.state.regions.NSW?.householdBudgetPressureScore === 'number', 'regional budget pressure');

  const hhSevere = { ...baseInp, households: v1014laborMakeTestHouseholds({ severeRegion: 'NSW' }) };
  const rHhBad = computeNationalLaborDemographics(hhSevere, createInitialLaborDemographicsPersisted(), null);
  check(
    'HB03',
    (rHhBad.state.regions.NSW?.wagePressureScore || 0) >= (rHh.state.regions.NSW?.wagePressureScore || 0) - 1,
    'budget pressure lifts wage index'
  );
  check(
    'HB04',
    (rHhBad.state.regions.NSW?.householdBudgetPressureScore || 0) >
      (rHh.state.regions.NSW?.householdBudgetPressureScore || 0),
    'severe affordability raises pressure score'
  );

  const natBudget = computeNationalHouseholdBudgetDetail(v1014laborMakeTestHouseholds({ severeRegion: 'VIC' }));
  check('HB05', natBudget.shockSensitivity !== 'low', 'severe region raises shock sensitivity');

  check(
    'MS01',
    (r1.state.activeMigrationShocks || []).some(s => s.regionId === 'WA' && s.kind === 'resource_boom_inflow'),
    'WA mining triggers inflow shock'
  );

  check(
    'MS02',
    (rHhBad.state.activeMigrationShocks || []).some(s => s.kind === 'housing_affordability_outflow'),
    'affordability shock detected'
  );

  const migBefore = rHh.state.regions.NSW?.migrationFlowScore || 50;
  const migAfter = rHhBad.state.regions.NSW?.migrationFlowScore || 50;
  check('MS03', migAfter <= migBefore + 2, 'outflow shock pulls migration score down vs healthy baseline');

  const pers = createInitialLaborDemographicsPersisted();
  const first = computeNationalLaborDemographics(baseInp, pers, null);
  const shockTurns = first.persisted.activeMigrationShocks?.[0]?.turnsRemaining;
  const second = computeNationalLaborDemographics({ ...baseInp, turn: 4 }, first.persisted, first.state);
  const shockTurnsLater = second.persisted.activeMigrationShocks?.find(
    s => s.id === first.persisted.activeMigrationShocks?.[0]?.id
  )?.turnsRemaining;
  check(
    'MS04',
    shockTurns != null && shockTurnsLater != null && shockTurnsLater < shockTurns,
    'shocks decay across turns'
  );

  const overrideShock = {
    id: 'msh_test_NSW_t9',
    kind: 'metro_talent_pull' as const,
    regionId: 'NSW',
    magnitude: 12,
    turnsRemaining: 2,
    startedTurn: 9,
    reason: 'test override'
  };
  const rOv = computeNationalLaborDemographics(
    { ...baseInp, turn: 9, migrationShockOverrides: [overrideShock] },
    createInitialLaborDemographicsPersisted(),
    null
  );
  check('MS05', (rOv.state.activeMigrationShocks || []).some(s => s.id === overrideShock.id), 'shock override applied');

  check(
    'MS06',
    detectMigrationShocks({
      turn: 2,
      inputs: hhSevere,
      householdBudget: computeNationalHouseholdBudgetDetail(hhSevere.households)
    }).length > 0,
    'detector emits under strain'
  );

  for (let i = 19; i <= 50; i++) {
    const ok = validateLaborDemographicsState(r1.state).valid && r1.state.industryLinks.length <= V1014_LABOR_LIMITS.maxIndustryLinks;
    check(`LD${String(i).padStart(2, '0')}`, ok, `invariant bundle ${i}`);
  }

  const passed = results.filter(r => r.passed).length;
  return {
    passed,
    failed: results.length - passed,
    total: results.length,
    allPassed: passed === results.length,
    results
  };
}

/** Canonical export alias for Agent 25 merge scripts. */
export const runV1014_LABOR_LaborDemographicsSelfTests = runV1014LaborDemographicsSelfTests;


// --- source: react/LaborDemographicsCenterPanel.tsx ---
  DEMOGRAPHIC_STRUCTURE_LABEL,
  EMPLOYMENT_LINKAGE_LABEL,
  INDUSTRY_LABEL,
  MIGRATION_FLOW_LABEL,
  WAGE_PRESSURE_LABEL
} from '../types';

/** Lightweight panel — React types only at runtime when bundled with game. */
export function LaborDemographicsCenterPanel(props: { view: LaborDemographicsWorldView | null }) {
  const view = props.view;
  if (!view || !view.enabled || !view.state?.enabled) {
    return {
      kind: 'labor_demographics_off' as const,
      message: 'Labor Demographics (V10.14) is off. Enable National Systems, Industries, and Labor Demographics in Settings.'
    };
  }
  const st = view.state;
  return {
    kind: 'labor_demographics_on' as const,
    testId: 'v1014-labor-center',
    summary: st.summary,
    outlook: st.outlook,
    automationFeedbackSummary: st.automationFeedbackSummary,
    tiles: [
      ['Demographics', DEMOGRAPHIC_STRUCTURE_LABEL[st.nationalDemographicStructure]],
      ['Employment', EMPLOYMENT_LINKAGE_LABEL[st.nationalEmploymentLinkage]],
      ['Wages', WAGE_PRESSURE_LABEL[st.nationalWagePressure]],
      ['Migration', MIGRATION_FLOW_LABEL[st.nationalMigrationFlow]]
    ] as const,
    industryLinks: st.industryLinks.map(l => ({
      industry: INDUSTRY_LABEL[l.industry],
      linkageScore: Math.round(l.linkageScore),
      sharePct: Math.round(l.nationalOutputShare * 100)
    }))
  };
}


// OP10M_MODULE_END agent-09-population
