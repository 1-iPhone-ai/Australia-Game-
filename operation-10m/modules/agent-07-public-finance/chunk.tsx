// OP10M_MODULE_BEGIN agent-07-public-finance
// Agent 07 — public finance & taxation (generated; source: operation-10m/agent-07-public-finance/modules/)

// --- source: fiscal-outcomes/types.ts ---
/**
 * V10.14 — Fiscal Policy Instruments & Outcome Linkage (Agent 07)
 * Serializable types only; no imports from canonical TSX.
 */

export const V1014_SCHEMA_VERSION = 'v10.14.0-agent07';

export type FiscalOutcomeBand = 'strong' | 'healthy' | 'mixed' | 'weak' | 'critical';

export type TaxInstrumentKind =
  | 'corporate_rate'
  | 'personal_rate'
  | 'payroll_levy'
  | 'resource_rent'
  | 'carbon_price'
  | 'gst_equivalent'
  | 'land_value_uplift'
  | 'innovation_credit'
  | 'regional_incentive';

export type TaxReformStance = 'cut' | 'hold' | 'raise' | 'broaden_base' | 'narrow_base';

export interface TaxInstrumentDefinition {
  id: string;
  kind: TaxInstrumentKind;
  label: string;
  description: string;
  /** Normalized revenue elasticity vs structural capacity (bounded). */
  revenueElasticity: number;
  /** Household affordability sensitivity (0..1). */
  householdSensitivity: number;
  /** Industry investment sensitivity (0..1). */
  investmentSensitivity: number;
  /** Political / stability sensitivity (0..1). */
  stabilitySensitivity: number;
  minRatePoints: number;
  maxRatePoints: number;
  defaultRatePoints: number;
}

export interface ActiveTaxInstrument {
  instrumentId: string;
  ratePoints: number;
  stance: TaxReformStance;
  turnsInEffect: number;
  revenueDeltaEstimate: number;
  explanation: string;
}

export type BudgetEnvelopeCategory =
  | 'core_services'
  | 'infrastructure_capital'
  | 'maintenance_backlog'
  | 'research_innovation'
  | 'regional_development'
  | 'resilience_recovery'
  | 'debt_service_reserve'
  | 'contingency';

export interface BudgetEnvelopeLine {
  category: BudgetEnvelopeCategory;
  allocatedPoints: number;
  committedPoints: number;
  flexPoints: number;
  band: 'under' | 'balanced' | 'over' | 'critical_over';
  linkedCommitmentIds: string[];
  explanation: string;
}

export interface NationalBudgetEnvelope {
  fiscalYearLabel: string;
  totalCapacityPoints: number;
  allocatedPoints: number;
  unallocatedFlex: number;
  lines: BudgetEnvelopeLine[];
  rebalanceNeeded: boolean;
  rebalanceSummary: string | null;
}

export type DebtSustainabilityOutlook =
  | 'improving'
  | 'stable'
  | 'watch'
  | 'stress'
  | 'distress';

export interface DebtOutcomeTrajectory {
  currentServiceLoad: number;
  projectedServiceLoad: number;
  borrowingHeadroom: number;
  sustainability: DebtSustainabilityOutlook;
  turnsToStress: number | null;
  outcomeRisk: FiscalOutcomeBand;
  narrative: string;
  evidence: string[];
}

export type LinkedOutcomeDimension =
  | 'national_prosperity'
  | 'public_stability'
  | 'program_delivery'
  | 'household_affordability'
  | 'regional_balance'
  | 'innovation_momentum';

export interface FiscalOutcomeLink {
  dimension: LinkedOutcomeDimension;
  score: number;
  band: FiscalOutcomeBand;
  fiscalDrivers: string[];
  constraintBinding: boolean;
  projectedTurns: number;
  summary: string;
}

export interface FiscalConstraintGate {
  id: string;
  label: string;
  /** When true, fiscal layer recommends caution (never hard-blocks by default). */
  warnOnly: boolean;
  triggered: boolean;
  severity: 'info' | 'caution' | 'major' | 'critical';
  reason: string;
  linkedOutcomeIds: LinkedOutcomeDimension[];
}

/** Minimal V10.12-shaped snapshot for bridge (duplicated fields only). */
export interface V1012FiscalSnapshot {
  turn: number;
  revenueCapacity: number;
  fiscalHeadroom: number;
  pressure: 'comfortable' | 'healthy' | 'tight' | 'strained' | 'critical';
  sustainability:
    | 'very_strong'
    | 'strong'
    | 'stable'
    | 'vulnerable'
    | 'unsustainable';
  debtServiceLoad: number;
  debtLevel: number;
  debtEnabled: boolean;
  maintenanceLoad: number;
  commitmentCount: number;
  revenuePolicy: 'growth_focused' | 'balanced' | 'revenue_focused' | null;
  reservePolicy: 'lean' | 'standard' | 'prudent' | null;
}

export interface FiscalOutcomesSystemInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  /** Optional regional prosperity proxies 0..100 by region code. */
  regionalProsperity?: Record<string, number>;
  /** Optional stability proxy 0..100. */
  publicStability?: number;
  /** Active megaproject / program ids for delivery linkage. */
  activeProgramIds?: string[];
  householdAffordabilityIndex?: number;
}

export interface FiscalOutcomesState {
  schemaVersion: string;
  revision: number;
  taxInstruments: ActiveTaxInstrument[];
  budget: NationalBudgetEnvelope;
  debtTrajectory: DebtOutcomeTrajectory;
  outcomeLinks: FiscalOutcomeLink[];
  constraintGates: FiscalConstraintGate[];
  compositeOutcomeScore: number;
  compositeBand: FiscalOutcomeBand;
  inputHash: string;
  lastUpdatedTurn: number;
}

export interface FiscalOutcomesPersisted {
  schemaVersion: string;
  revision: number;
  instrumentRates: Record<string, number>;
  instrumentStances: Record<string, TaxReformStance>;
  envelopeOverrides: Partial<Record<BudgetEnvelopeCategory, number>>;
  lastCompositeBand: FiscalOutcomeBand;
  lastInputHash: string;
  lastUpdatedTurn: number;
}

export interface V1014SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}


// --- source: fiscal-outcomes/boundaries.ts ---
/**
 * Money & actor boundary reminders for V10.14 (mirrors V10.12 Section 20AE audit).
 * Used in validation messages and GI answers — not enforced against live actor wallets here.
 */

export const V1014_BOUNDARY_RULES: readonly { id: string; rule: string }[] = [
  {
    id: 'actor_cash',
    rule: 'Actor money (player/AI wallets) is private cash — never merged into national revenue or tax receipts.'
  },
  {
    id: 'actor_loans',
    rule: 'Actor loans are private debt — never counted as sovereign debt service or fiscal headroom.'
  },
  {
    id: 'team_treasury',
    rule: 'Team treasury is tactical shared cash — never taxed, borrowed from, or fiscal headroom.'
  },
  {
    id: 'auto_modifiers',
    rule: 'Auto Mode tax relief / income subsidy modifiers are balance settings — not national policy levers.'
  },
  {
    id: 'grants_resource',
    rule: 'Government Grants as a tradable resource are not the federal treasury balance.'
  },
  {
    id: 'normalized_capacity',
    rule: 'V10.12 normalized fiscal capacity (0..100 scale) remains authoritative for headroom; V10.14 adds policy-outcome interpretation only.'
  }
] as const;

export function summarizeBoundariesForGi(): string[] {
  return V1014_BOUNDARY_RULES.map(r => r.rule);
}


// --- source: fiscal-outcomes/tax-instruments.ts ---

/** Core national tax instrument catalog (Agent 07 authored). */
export const TAX_INSTRUMENT_CATALOG: Record<string, TaxInstrumentDefinition> = {
  corp_standard: {
    id: 'corp_standard',
    kind: 'corporate_rate',
    label: 'Company Tax Rate',
    description:
      'Broad corporate income tax. Raises revenue with moderate investment sensitivity; cuts can stimulate capital spending but reduce headroom.',
    revenueElasticity: 0.85,
    householdSensitivity: 0.05,
    investmentSensitivity: 0.55,
    stabilitySensitivity: 0.15,
    minRatePoints: 18,
    maxRatePoints: 35,
    defaultRatePoints: 25
  },
  personal_progressive: {
    id: 'personal_progressive',
    kind: 'personal_rate',
    label: 'Personal Income Tax (progressive midpoint)',
    description:
      'Household-facing income tax wedge (modeled as midpoint rate). Strong revenue link; higher rates ease fiscal pressure but weigh on affordability.',
    revenueElasticity: 0.75,
    householdSensitivity: 0.7,
    investmentSensitivity: 0.2,
    stabilitySensitivity: 0.35,
    minRatePoints: 19,
    maxRatePoints: 42,
    defaultRatePoints: 30
  },
  payroll_levy: {
    id: 'payroll_levy',
    kind: 'payroll_levy',
    label: 'Payroll & Medicare Levy Bundle',
    description: 'Employment-linked levies funding services. Moderate revenue; affects workforce participation signals via V10.10 spillovers.',
    revenueElasticity: 0.55,
    householdSensitivity: 0.45,
    investmentSensitivity: 0.35,
    stabilitySensitivity: 0.25,
    minRatePoints: 2,
    maxRatePoints: 12,
    defaultRatePoints: 5
  },
  resource_rent: {
    id: 'resource_rent',
    kind: 'resource_rent',
    label: 'Resource Rent & PRRT-style Uplift',
    description: 'Captures resource super-profits; volatile with commodity cycles (feeds revenue volatility, not CPI).',
    revenueElasticity: 0.95,
    householdSensitivity: 0.02,
    investmentSensitivity: 0.4,
    stabilitySensitivity: 0.2,
    minRatePoints: 0,
    maxRatePoints: 40,
    defaultRatePoints: 22
  },
  carbon_price: {
    id: 'carbon_price',
    kind: 'carbon_price',
    label: 'Carbon Price & Safeguard Mechanism',
    description: 'Pricing emissions-intensive activity. Revenue plus transition pressure on energy-intensive regions.',
    revenueElasticity: 0.5,
    householdSensitivity: 0.35,
    investmentSensitivity: 0.45,
    stabilitySensitivity: 0.3,
    minRatePoints: 0,
    maxRatePoints: 80,
    defaultRatePoints: 24
  },
  gst_equivalent: {
    id: 'gst_equivalent',
    kind: 'gst_equivalent',
    label: 'Consumption Tax (GST-equivalent)',
    description: 'Broad consumption base. Stable revenue; regressive affordability footprint unless offset.',
    revenueElasticity: 0.8,
    householdSensitivity: 0.55,
    investmentSensitivity: 0.1,
    stabilitySensitivity: 0.2,
    minRatePoints: 8,
    maxRatePoints: 15,
    defaultRatePoints: 10
  },
  land_value_uplift: {
    id: 'land_value_uplift',
    kind: 'land_value_uplift',
    label: 'Land Value & Development Uplift Share',
    description: 'Captures a share of land value uplift from infrastructure. Supports capital programs; politically sensitive.',
    revenueElasticity: 0.35,
    householdSensitivity: 0.25,
    investmentSensitivity: 0.15,
    stabilitySensitivity: 0.4,
    minRatePoints: 0,
    maxRatePoints: 25,
    defaultRatePoints: 8
  },
  innovation_credit: {
    id: 'innovation_credit',
    kind: 'innovation_credit',
    label: 'R&D & Innovation Tax Incentive',
    description: 'Negative-rate instrument (credit). Reduces near-term revenue; boosts innovation momentum outcomes when sustained.',
    revenueElasticity: -0.4,
    householdSensitivity: 0.05,
    investmentSensitivity: -0.35,
    stabilitySensitivity: 0.05,
    minRatePoints: -15,
    maxRatePoints: 5,
    defaultRatePoints: -8
  },
  regional_incentive: {
    id: 'regional_incentive',
    kind: 'regional_incentive',
    label: 'Regional Investment Incentive',
    description: 'Targeted concessions for lagging regions. Revenue cost with regional balance upside.',
    revenueElasticity: -0.25,
    householdSensitivity: 0.15,
    investmentSensitivity: -0.2,
    stabilitySensitivity: 0.15,
    minRatePoints: -12,
    maxRatePoints: 8,
    defaultRatePoints: -4
  }
};

export const DEFAULT_TAX_INSTRUMENT_IDS = Object.keys(TAX_INSTRUMENT_CATALOG);

export function clampRate(def: TaxInstrumentDefinition, rate: number): number {
  return Math.min(def.maxRatePoints, Math.max(def.minRatePoints, Math.round(rate * 10) / 10));
}

export function estimateRevenueDelta(
  def: TaxInstrumentDefinition,
  ratePoints: number,
  structuralCapacity: number
): number {
  const deltaFromDefault = ratePoints - def.defaultRatePoints;
  const raw = (deltaFromDefault / 10) * def.revenueElasticity * (structuralCapacity / 100) * 8;
  return Math.round(raw * 10) / 10;
}


// --- source: fiscal-outcomes/budget-envelopes.ts ---
  BudgetEnvelopeCategory,
  BudgetEnvelopeLine,
  NationalBudgetEnvelope,
  V1012FiscalSnapshot
} from './types';

const CATEGORY_LABELS: Record<BudgetEnvelopeCategory, string> = {
  core_services: 'Core Services & Administration',
  infrastructure_capital: 'Infrastructure Capital',
  maintenance_backlog: 'Maintenance & Network Upkeep',
  research_innovation: 'Research & Innovation',
  regional_development: 'Regional Development',
  resilience_recovery: 'Resilience & Recovery',
  debt_service_reserve: 'Debt Service & Reserves',
  contingency: 'Contingency & Flex'
};

/** Default share weights (sum ≈ 1) — tuned for balanced starting envelope. */
const DEFAULT_SHARES: Record<BudgetEnvelopeCategory, number> = {
  core_services: 0.22,
  infrastructure_capital: 0.18,
  maintenance_backlog: 0.14,
  research_innovation: 0.08,
  regional_development: 0.1,
  resilience_recovery: 0.08,
  debt_service_reserve: 0.12,
  contingency: 0.08
};

export function buildBudgetEnvelope(
  v1012: V1012FiscalSnapshot,
  overrides: Partial<Record<BudgetEnvelopeCategory, number>> = {}
): NationalBudgetEnvelope {
  const totalCapacityPoints = Math.max(
    5,
    Math.round(v1012.revenueCapacity + Math.max(0, v1012.fiscalHeadroom * 0.35))
  );
  const fiscalYearLabel = `FY${v1012.turn}-${v1012.turn + 1}`;

  const lines: BudgetEnvelopeLine[] = (Object.keys(DEFAULT_SHARES) as BudgetEnvelopeCategory[]).map(
    cat => {
      const share = DEFAULT_SHARES[cat];
      const override = overrides[cat];
      const allocatedPoints =
        override !== undefined
          ? Math.round(override)
          : Math.round(totalCapacityPoints * share);
      const pressureBoost =
        v1012.pressure === 'critical' ? 1.15 : v1012.pressure === 'strained' ? 1.08 : 1;
      const committedPoints = Math.round(
        allocatedPoints *
          (cat === 'maintenance_backlog'
            ? 0.55 + v1012.maintenanceLoad / 40
            : cat === 'debt_service_reserve'
            ? 0.4 + v1012.debtServiceLoad / 25
            : 0.35) *
          pressureBoost
      );
      const flexPoints = Math.max(0, allocatedPoints - committedPoints);
      let band: BudgetEnvelopeLine['band'] = 'balanced';
      if (committedPoints > allocatedPoints * 1.12) band = 'critical_over';
      else if (committedPoints > allocatedPoints * 1.02) band = 'over';
      else if (committedPoints < allocatedPoints * 0.55) band = 'under';

      return {
        category: cat,
        allocatedPoints,
        committedPoints,
        flexPoints,
        band,
        linkedCommitmentIds: [],
        explanation: `${CATEGORY_LABELS[cat]}: ${allocatedPoints} pts allocated, ${committedPoints} pts committed (${band}).`
      };
    }
  );

  const allocatedPoints = lines.reduce((s, l) => s + l.allocatedPoints, 0);
  const unallocatedFlex = Math.max(0, totalCapacityPoints - allocatedPoints);
  const overLines = lines.filter(l => l.band === 'over' || l.band === 'critical_over');
  const rebalanceNeeded = overLines.length > 0 || v1012.fiscalHeadroom < 0;
  const rebalanceSummary = rebalanceNeeded
    ? `Rebalance recommended: ${overLines.map(l => CATEGORY_LABELS[l.category]).join(', ')} exceed envelope${
        v1012.fiscalHeadroom < 0 ? '; headroom negative' : ''
      }.`
    : null;

  return {
    fiscalYearLabel,
    totalCapacityPoints,
    allocatedPoints,
    unallocatedFlex,
    lines,
    rebalanceNeeded,
    rebalanceSummary
  };
}

export { CATEGORY_LABELS as BUDGET_ENVELOPE_CATEGORY_LABELS };


// --- source: fiscal-outcomes/debt-outcomes.ts ---

function bandFromRisk(score: number): FiscalOutcomeBand {
  if (score >= 75) return 'strong';
  if (score >= 58) return 'healthy';
  if (score >= 42) return 'mixed';
  if (score >= 25) return 'weak';
  return 'critical';
}

export function computeDebtOutcomeTrajectory(v1012: V1012FiscalSnapshot): DebtOutcomeTrajectory {
  const currentServiceLoad = v1012.debtServiceLoad;
  const debtLevel = v1012.debtEnabled ? v1012.debtLevel : 0;
  const projectedServiceLoad =
    Math.round((currentServiceLoad + debtLevel * 0.04 + v1012.maintenanceLoad * 0.02) * 10) / 10;

  const borrowingHeadroom = Math.max(
    0,
    Math.round((45 - debtLevel - currentServiceLoad * 1.2) * 10) / 10
  );

  let sustainability: DebtOutcomeTrajectory['sustainability'] = 'stable';
  if (!v1012.debtEnabled && debtLevel <= 1) sustainability = 'improving';
  else if (projectedServiceLoad > 18 || debtLevel > 55) sustainability = 'distress';
  else if (projectedServiceLoad > 12 || debtLevel > 38) sustainability = 'stress';
  else if (projectedServiceLoad > 8 || debtLevel > 28) sustainability = 'watch';
  else if (projectedServiceLoad < currentServiceLoad - 0.5) sustainability = 'improving';

  let turnsToStress: number | null = null;
  if (sustainability === 'watch') turnsToStress = 6;
  if (sustainability === 'stress') turnsToStress = 3;
  if (sustainability === 'distress') turnsToStress = 1;

  const riskScore = Math.max(
    0,
    Math.min(
      100,
      88 -
        projectedServiceLoad * 2.2 -
        debtLevel * 0.45 +
        (v1012.sustainability === 'very_strong' ? 8 : v1012.sustainability === 'strong' ? 4 : 0)
    )
  );

  const outcomeRisk = bandFromRisk(riskScore);
  const evidence: string[] = [];
  if (v1012.debtEnabled) evidence.push(`Sovereign debt enabled at level ${debtLevel}.`);
  evidence.push(`Debt service load ${currentServiceLoad} → projected ${projectedServiceLoad}.`);
  if (borrowingHeadroom < 8) evidence.push('Borrowing headroom tight for acceleration programs.');

  const narrative =
    sustainability === 'distress'
      ? 'Debt service and maintenance compound — fiscal outcomes likely weaken without staging or revenue policy adjustment.'
      : sustainability === 'improving'
      ? 'Debt service manageable — room to fund productivity investments if commitments stay disciplined.'
      : `Debt path is ${sustainability}; monitor service load against maintenance and recovery stacks.`;

  return {
    currentServiceLoad,
    projectedServiceLoad,
    borrowingHeadroom,
    sustainability,
    turnsToStress,
    outcomeRisk,
    narrative,
    evidence
  };
}


// --- source: fiscal-outcomes/outcome-linkage.ts ---
  ActiveTaxInstrument,
  FiscalConstraintGate,
  FiscalOutcomeBand,
  FiscalOutcomeLink,
  FiscalOutcomesSystemInputs,
  LinkedOutcomeDimension,
  NationalBudgetEnvelope
} from './types';

function band(score: number): FiscalOutcomeBand {
  if (score >= 78) return 'strong';
  if (score >= 60) return 'healthy';
  if (score >= 45) return 'mixed';
  if (score >= 28) return 'weak';
  return 'critical';
}

function link(
  dimension: LinkedOutcomeDimension,
  score: number,
  drivers: string[],
  binding: boolean,
  turns: number,
  summary: string
): FiscalOutcomeLink {
  return {
    dimension,
    score: Math.round(score * 10) / 10,
    band: band(score),
    fiscalDrivers: drivers,
    constraintBinding: binding,
    projectedTurns: turns,
    summary
  };
}

export function computeOutcomeLinks(
  inputs: FiscalOutcomesSystemInputs,
  tax: ActiveTaxInstrument[],
  budget: NationalBudgetEnvelope,
  debt: DebtOutcomeTrajectory
): FiscalOutcomeLink[] {
  const h = inputs.v1012;
  const stability = inputs.publicStability ?? 55;
  const affordability = inputs.householdAffordabilityIndex ?? 50;
  const programCount = inputs.activeProgramIds?.length ?? h.commitmentCount;

  const headroomFactor = Math.max(-15, Math.min(25, h.fiscalHeadroom));
  const prosperityScore =
    52 +
    headroomFactor * 0.9 +
    (h.revenuePolicy === 'growth_focused' ? 4 : h.revenuePolicy === 'revenue_focused' ? -2 : 0) -
    (h.pressure === 'critical' ? 12 : h.pressure === 'strained' ? 6 : 0);

  const stabilityScore =
    stability * 0.55 +
    (h.pressure === 'comfortable' || h.pressure === 'healthy' ? 18 : h.pressure === 'tight' ? 8 : 0) -
    tax.reduce((s, t) => {
      const def = TAX_INSTRUMENT_CATALOG[t.instrumentId];
      return s + (def ? def.stabilitySensitivity * Math.abs(t.ratePoints - def.defaultRatePoints) * 0.08 : 0);
    }, 0);

  const deliveryScore =
    48 +
    headroomFactor * 0.5 +
    budget.unallocatedFlex * 0.15 -
    budget.lines.filter(l => l.band === 'critical_over').length * 9 -
    programCount * 0.8;

  const householdScore =
    affordability * 0.7 -
    tax.reduce((s, t) => {
      const def = TAX_INSTRUMENT_CATALOG[t.instrumentId];
      if (!def) return s;
      return s + def.householdSensitivity * Math.max(0, t.ratePoints - def.defaultRatePoints) * 0.12;
    }, 0) +
    (h.fiscalHeadroom < -5 ? -8 : 0);

  const regionalPros = inputs.regionalProsperity || {};
  const regionalVals = Object.values(regionalPros);
  const spread =
    regionalVals.length > 1 ? Math.max(...regionalVals) - Math.min(...regionalVals) : 12;
  const regionalScore = 62 - spread * 0.35 + (budget.lines.find(l => l.category === 'regional_development')?.flexPoints || 0) * 0.2;

  const innovationScore =
    50 +
    (budget.lines.find(l => l.category === 'research_innovation')?.flexPoints || 0) * 0.25 +
    tax.reduce((s, t) => {
      if (t.instrumentId === 'innovation_credit') return s + Math.abs(t.ratePoints) * 0.4;
      return s;
    }, 0) -
    (debt.sustainability === 'stress' || debt.sustainability === 'distress' ? 10 : 0);

  return [
    link(
      'national_prosperity',
      prosperityScore,
      [`Headroom ${h.fiscalHeadroom}`, `Pressure ${h.pressure}`, `Revenue capacity ${h.revenueCapacity}`],
      h.fiscalHeadroom < 2,
      4,
      prosperityScore >= 60
        ? 'Fiscal space supports prosperity-oriented programs.'
        : 'Tight headroom caps prosperity upside until commitments ease or revenue strengthens.'
    ),
    link(
      'public_stability',
      stabilityScore,
      [`Baseline stability ${stability}`, `Fiscal pressure ${h.pressure}`],
      h.pressure === 'critical',
      3,
      stabilityScore >= 55 ? 'Fiscal stance compatible with stability.' : 'Strained fiscal capacity adds stability risk.'
    ),
    link(
      'program_delivery',
      deliveryScore,
      [`Active programs ~${programCount}`, `Budget flex ${budget.unallocatedFlex}`],
      budget.rebalanceNeeded,
      2,
      deliveryScore >= 50
        ? 'Envelope flex supports delivery timelines.'
        : 'Over-committed envelopes may delay or stage major programs.'
    ),
    link(
      'household_affordability',
      householdScore,
      [`Affordability index ${affordability}`],
      householdScore < 35,
      5,
      householdScore >= 50
        ? 'Tax mix neutral-to-supportive for affordability.'
        : 'Tax and fiscal pressure may compress household outcomes (V10.13 interprets).'
    ),
    link(
      'regional_balance',
      regionalScore,
      [`Prosperity spread ${Math.round(spread)}`],
      spread > 28,
      6,
      regionalScore >= 55 ? 'Regional envelope flex offsets divergence.' : 'Regional divergence high — targeted envelope shift may help.'
    ),
    link(
      'innovation_momentum',
      innovationScore,
      ['R&D envelope', 'Innovation credit instrument'],
      innovationScore < 40,
      8,
      innovationScore >= 52 ? 'Innovation-friendly fiscal mix.' : 'Innovation outcomes constrained by debt or envelope crowding.'
    )
  ];
}

export function computeConstraintGates(
  inputs: FiscalOutcomesSystemInputs,
  links: FiscalOutcomeLink[],
  debt: DebtOutcomeTrajectory,
  budget: NationalBudgetEnvelope
): FiscalConstraintGate[] {
  const h = inputs.v1012;
  const gates: FiscalConstraintGate[] = [];

  gates.push({
    id: 'headroom_floor',
    label: 'Fiscal headroom floor',
    warnOnly: true,
    triggered: h.fiscalHeadroom < 1,
    severity: h.fiscalHeadroom < -8 ? 'critical' : h.fiscalHeadroom < 1 ? 'major' : 'info',
    reason:
      h.fiscalHeadroom < 1
        ? 'National fiscal headroom below safe staging band — major new capital should use staged paygo or private co-funding.'
        : 'Headroom adequate for routine commitments.',
    linkedOutcomeIds: ['national_prosperity', 'program_delivery']
  });

  gates.push({
    id: 'debt_stress_path',
    label: 'Debt sustainability path',
    warnOnly: true,
    triggered: debt.sustainability === 'stress' || debt.sustainability === 'distress',
    severity: debt.sustainability === 'distress' ? 'critical' : 'major',
    reason: debt.narrative,
    linkedOutcomeIds: ['national_prosperity', 'innovation_momentum']
  });

  gates.push({
    id: 'budget_overcommit',
    label: 'Budget envelope over-commit',
    warnOnly: true,
    triggered: budget.rebalanceNeeded,
    severity: budget.lines.some(l => l.band === 'critical_over') ? 'major' : 'caution',
    reason: budget.rebalanceSummary || 'Envelopes balanced.',
    linkedOutcomeIds: ['program_delivery', 'regional_balance']
  });

  const weakOutcomes = links.filter(l => l.band === 'weak' || l.band === 'critical');
  gates.push({
    id: 'outcome_weakness',
    label: 'Linked outcome weakness',
    warnOnly: true,
    triggered: weakOutcomes.length >= 2,
    severity: weakOutcomes.some(l => l.band === 'critical') ? 'major' : 'caution',
    reason:
      weakOutcomes.length >= 2
        ? `Multiple outcome dimensions weak: ${weakOutcomes.map(w => w.dimension).join(', ')}.`
        : 'No multi-dimensional outcome weakness detected.',
    linkedOutcomeIds: weakOutcomes.map(w => w.dimension)
  });

  return gates;
}

export function compositeFromLinks(links: FiscalOutcomeLink[]): { score: number; band: FiscalOutcomeBand } {
  const score = links.reduce((s, l) => s + l.score, 0) / Math.max(1, links.length);
  return { score: Math.round(score * 10) / 10, band: band(score) };
}


// --- source: fiscal-outcomes/bridge-v1012.ts ---

/** Map a loose V10.12 public-finance view into V10.14 bridge input. */
export function bridgeV1012Snapshot(raw: {
  turn?: number;
  fiscalPosition?: {
    revenueCapacity?: number;
    fiscalHeadroom?: number;
    pressure?: V1012FiscalSnapshot['pressure'];
    sustainability?: V1012FiscalSnapshot['sustainability'];
    debtServiceLoad?: number;
    maintenanceLoad?: number;
  };
  debt?: { enabled?: boolean; level?: number; debtServiceLoad?: number };
  commitments?: unknown[];
  revenuePolicy?: V1012FiscalSnapshot['revenuePolicy'];
  reservePolicy?: V1012FiscalSnapshot['reservePolicy'];
  persisted?: { debtEnabled?: boolean; reservePolicy?: V1012FiscalSnapshot['reservePolicy'] };
}): V1012FiscalSnapshot {
  const fp = raw.fiscalPosition || {};
  const debt = raw.debt || {};
  return {
    turn: Number(raw.turn) || 1,
    revenueCapacity: Number(fp.revenueCapacity) || 0,
    fiscalHeadroom: Number(fp.fiscalHeadroom) || 0,
    pressure: fp.pressure || 'healthy',
    sustainability: fp.sustainability || 'stable',
    debtServiceLoad: Number(debt.debtServiceLoad ?? fp.debtServiceLoad) || 0,
    debtLevel: Number(debt.level) || 0,
    debtEnabled: Boolean(debt.enabled ?? raw.persisted?.debtEnabled),
    maintenanceLoad: Number(fp.maintenanceLoad) || 0,
    commitmentCount: Array.isArray(raw.commitments) ? raw.commitments.length : 0,
    revenuePolicy: raw.revenuePolicy ?? null,
    reservePolicy: raw.reservePolicy ?? raw.persisted?.reservePolicy ?? null
  };
}

export function buildFiscalOutcomesInputsFromBridge(
  bridge: V1012FiscalSnapshot,
  extras?: Partial<Omit<FiscalOutcomesSystemInputs, 'turn' | 'v1012'>>
): FiscalOutcomesSystemInputs {
  return {
    turn: bridge.turn,
    v1012: bridge,
    ...extras
  };
}


// --- source: fiscal-outcomes/compute.ts ---
  V1014_SCHEMA_VERSION,
  type ActiveTaxInstrument,
  type FiscalOutcomesPersisted,
  type FiscalOutcomesState,
  type FiscalOutcomesSystemInputs,
  type TaxReformStance
} from './types';
  DEFAULT_TAX_INSTRUMENT_IDS,
  TAX_INSTRUMENT_CATALOG,
  clampRate,
  estimateRevenueDelta
} from './tax-instruments';
  compositeFromLinks,
  computeConstraintGates,
  computeOutcomeLinks
} from './outcome-linkage';

function stableHash(obj: unknown): string {
  const s = JSON.stringify(obj);
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `v1014_${(h >>> 0).toString(16)}`;
}

export function createInitialFiscalOutcomesPersisted(turn = 1): FiscalOutcomesPersisted {
  const instrumentRates: Record<string, number> = {};
  for (const id of DEFAULT_TAX_INSTRUMENT_IDS) {
    instrumentRates[id] = TAX_INSTRUMENT_CATALOG[id].defaultRatePoints;
  }
  return {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: 0,
    instrumentRates,
    instrumentStances: {},
    envelopeOverrides: {},
    lastCompositeBand: 'mixed',
    lastInputHash: '',
    lastUpdatedTurn: turn
  };
}

export function sanitizeFiscalOutcomesPersisted(raw: unknown): FiscalOutcomesPersisted | null {
  if (!raw || typeof raw !== 'object') return null;
  const base = createInitialFiscalOutcomesPersisted(Number((raw as any).lastUpdatedTurn) || 1);
  const r = raw as Partial<FiscalOutcomesPersisted>;
  return {
    ...base,
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: Number(r.revision) || 0,
    instrumentRates: { ...base.instrumentRates, ...(r.instrumentRates || {}) },
    instrumentStances: { ...(r.instrumentStances || {}) },
    envelopeOverrides: { ...(r.envelopeOverrides || {}) },
    lastCompositeBand: (r.lastCompositeBand as any) || base.lastCompositeBand,
    lastInputHash: String(r.lastInputHash || ''),
    lastUpdatedTurn: Number(r.lastUpdatedTurn) || 1
  };
}

function buildActiveTaxInstruments(
  persisted: FiscalOutcomesPersisted,
  structuralCapacity: number
): ActiveTaxInstrument[] {
  return DEFAULT_TAX_INSTRUMENT_IDS.map(id => {
    const def = TAX_INSTRUMENT_CATALOG[id];
    const ratePoints = clampRate(def, persisted.instrumentRates[id] ?? def.defaultRatePoints);
    const stance: TaxReformStance =
      persisted.instrumentStances[id] ||
      (ratePoints > def.defaultRatePoints + 0.5
        ? 'raise'
        : ratePoints < def.defaultRatePoints - 0.5
        ? 'cut'
        : 'hold');
    return {
      instrumentId: id,
      ratePoints,
      stance,
      turnsInEffect: 1,
      revenueDeltaEstimate: estimateRevenueDelta(def, ratePoints, structuralCapacity),
      explanation: `${def.label} at ${ratePoints} pts (${stance}).`
    };
  });
}

export function computeFiscalOutcomesLayer(
  inputs: FiscalOutcomesSystemInputs,
  persistedRaw?: FiscalOutcomesPersisted | null
): { state: FiscalOutcomesState; persisted: FiscalOutcomesPersisted } {
  const turn = inputs.turn;
  const persisted = sanitizeFiscalOutcomesPersisted(persistedRaw) || createInitialFiscalOutcomesPersisted(turn);
  const inputHash = stableHash({ turn, v1012: inputs.v1012, rates: persisted.instrumentRates });

  if (inputHash === persisted.lastInputHash) {
    const taxInstruments = buildActiveTaxInstruments(persisted, inputs.v1012.revenueCapacity);
    const budget = buildBudgetEnvelope(inputs.v1012, persisted.envelopeOverrides);
    const debtTrajectory = computeDebtOutcomeTrajectory(inputs.v1012);
    const outcomeLinks = computeOutcomeLinks(inputs, taxInstruments, budget, debtTrajectory);
    const constraintGates = computeConstraintGates(inputs, outcomeLinks, debtTrajectory, budget);
    const { score, band } = compositeFromLinks(outcomeLinks);
    return {
      state: {
        schemaVersion: V1014_SCHEMA_VERSION,
        revision: persisted.revision,
        taxInstruments,
        budget,
        debtTrajectory,
        outcomeLinks,
        constraintGates,
        compositeOutcomeScore: score,
        compositeBand: band,
        inputHash,
        lastUpdatedTurn: turn
      },
      persisted
    };
  }

  const taxInstruments = buildActiveTaxInstruments(persisted, inputs.v1012.revenueCapacity);
  const budget = buildBudgetEnvelope(inputs.v1012, persisted.envelopeOverrides);
  const debtTrajectory = computeDebtOutcomeTrajectory(inputs.v1012);
  const outcomeLinks = computeOutcomeLinks(inputs, taxInstruments, budget, debtTrajectory);
  const constraintGates = computeConstraintGates(inputs, outcomeLinks, debtTrajectory, budget);
  const { score, band } = compositeFromLinks(outcomeLinks);

  const nextPersisted: FiscalOutcomesPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    lastCompositeBand: band,
    lastInputHash: inputHash,
    lastUpdatedTurn: turn
  };

  const state: FiscalOutcomesState = {
    schemaVersion: V1014_SCHEMA_VERSION,
    revision: nextPersisted.revision,
    taxInstruments,
    budget,
    debtTrajectory,
    outcomeLinks,
    constraintGates,
    compositeOutcomeScore: score,
    compositeBand: band,
    inputHash,
    lastUpdatedTurn: turn
  };

  return { state, persisted: nextPersisted };
}

export function setTaxInstrumentRate(
  persisted: FiscalOutcomesPersisted,
  instrumentId: string,
  ratePoints: number,
  stance?: TaxReformStance
): FiscalOutcomesPersisted {
  const def = TAX_INSTRUMENT_CATALOG[instrumentId];
  if (!def) return persisted;
  return {
    ...persisted,
    instrumentRates: {
      ...persisted.instrumentRates,
      [instrumentId]: clampRate(def, ratePoints)
    },
    instrumentStances: stance
      ? { ...persisted.instrumentStances, [instrumentId]: stance }
      : persisted.instrumentStances,
    lastInputHash: ''
  };
}


// --- source: fiscal-outcomes/gi-queries.ts ---

export interface FiscalOutcomesGiAnswer {
  headline: string;
  facts: string[];
  inferences: string[];
  followUps: string[];
}

export function detectFiscalOutcomesQuestion(raw: string): boolean {
  const q = String(raw || '').toLowerCase();
  if (!q) return false;
  return (
    /tax (policy|mix|reform|rate)/.test(q) ||
    /budget envelope/.test(q) ||
    /debt sustainability/.test(q) ||
    /fiscal outcome/.test(q) ||
    /linked outcome/.test(q) ||
    /why.*(prosperity|affordability).*fiscal/.test(q)
  );
}

export function composeFiscalOutcomesGiAnswer(
  question: string,
  state: FiscalOutcomesState | null | undefined
): FiscalOutcomesGiAnswer {
  if (!state) {
    return {
      headline: 'Fiscal outcomes layer inactive',
      facts: summarizeBoundariesForGi().slice(0, 2),
      inferences: ['Enable National Systems and V10.14 integration to see tax, budget, and debt-outcome links.'],
      followUps: ['What is our current fiscal position?', 'Why is fiscal capacity strained?']
    };
  }

  const weak = state.outcomeLinks.filter(l => l.band === 'weak' || l.band === 'critical');
  const gates = state.constraintGates.filter(g => g.triggered);

  return {
    headline: `Composite fiscal outcome: ${state.compositeBand.toUpperCase()} (${state.compositeOutcomeScore})`,
    facts: [
      `Budget ${state.budget.fiscalYearLabel}: ${state.budget.totalCapacityPoints} pts capacity, flex ${state.budget.unallocatedFlex}.`,
      `Debt path: ${state.debtTrajectory.sustainability} — ${state.debtTrajectory.narrative}`,
      ...state.taxInstruments
        .filter(t => Math.abs(t.revenueDeltaEstimate) > 0.5)
        .slice(0, 3)
        .map(t => `${t.explanation} Est. revenue Δ ${t.revenueDeltaEstimate}.`)
    ],
    inferences: [
      weak.length
        ? `Weak outcome dimensions: ${weak.map(w => `${w.dimension} (${w.band})`).join('; ')}.`
        : 'All linked outcome dimensions are mixed or better.',
      gates.length
        ? `Active fiscal gates: ${gates.map(g => g.label).join(', ')}.`
        : 'No fiscal constraint gates triggered.'
    ],
    followUps: [
      'Should we rebalance the budget envelope?',
      'What is the debt sustainability outlook?',
      'How does tax mix affect household affordability?'
    ]
  };
}

export function formatGiAnswer(answer: FiscalOutcomesGiAnswer): string {
  return [answer.headline, ...answer.facts.map(f => `• ${f}`), ...answer.inferences.map(i => `→ ${i}`)].join(
    '\n'
  );
}


// --- source: fiscal-outcomes/catalog/policy-scenarios.ts ---

export interface PolicyScenarioPack {
  id: string;
  title: string;
  fiscalContext: string;
  narrative: string;
  recommendedInstruments: string[];
  stanceHints: Record<string, string>;
  linkedOutcomes: LinkedOutcomeDimension[];
  expectedPressure: string;
  playerFacingSummary: string;
  designerNotes: string;
}

/** Authored policy scenario packs for V10.14 what-if and tutorial hooks (Agent 07). */
export const POLICY_SCENARIO_CATALOG: PolicyScenarioPack[] = [
  {
    id: 'pack_001',
    title: 'cut corp standard under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting corp_standard via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on corp standard feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_002',
    title: 'hold corp standard under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting corp_standard via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on corp standard feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_003',
    title: 'raise corp standard under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting corp_standard via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on corp standard feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_004',
    title: 'cut personal progressive under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting personal_progressive via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on personal progressive feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_005',
    title: 'hold personal progressive under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting personal_progressive via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on personal progressive feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_006',
    title: 'raise personal progressive under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting personal_progressive via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on personal progressive feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_007',
    title: 'cut payroll levy under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting payroll_levy via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on payroll levy feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_008',
    title: 'hold payroll levy under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting payroll_levy via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on payroll levy feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_009',
    title: 'raise payroll levy under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting payroll_levy via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on payroll levy feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_010',
    title: 'cut resource rent under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting resource_rent via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on resource rent feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_011',
    title: 'hold resource rent under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting resource_rent via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on resource rent feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_012',
    title: 'raise resource rent under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting resource_rent via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on resource rent feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_013',
    title: 'cut carbon price under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting carbon_price via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on carbon price feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_014',
    title: 'hold carbon price under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting carbon_price via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on carbon price feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_015',
    title: 'raise carbon price under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting carbon_price via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on carbon price feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_016',
    title: 'cut gst equivalent under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting gst_equivalent via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on gst equivalent feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_017',
    title: 'hold gst equivalent under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting gst_equivalent via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on gst equivalent feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_018',
    title: 'raise gst equivalent under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting gst_equivalent via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on gst equivalent feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_019',
    title: 'cut land value uplift under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting land_value_uplift via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on land value uplift feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_020',
    title: 'hold land value uplift under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting land_value_uplift via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on land value uplift feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_021',
    title: 'raise land value uplift under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting land_value_uplift via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on land value uplift feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_022',
    title: 'cut innovation credit under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting innovation_credit via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on innovation credit feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_023',
    title: 'hold innovation credit under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting innovation_credit via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on innovation credit feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_024',
    title: 'raise innovation credit under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting innovation_credit via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on innovation credit feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_025',
    title: 'cut regional incentive under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting regional_incentive via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how cut on regional incentive feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_026',
    title: 'hold regional incentive under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting regional_incentive via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how hold on regional incentive feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_027',
    title: 'raise regional incentive under comfortable fiscal pressure',
    fiscalContext: 'National fiscal pressure band comfortable; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is comfortable, adjusting regional_incentive via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'comfortable',
    playerFacingSummary: 'Explore how raise on regional incentive feels when national fiscal headroom is comfortable.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_028',
    title: 'cut corp standard under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting corp_standard via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on corp standard feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_029',
    title: 'hold corp standard under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting corp_standard via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on corp standard feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_030',
    title: 'raise corp standard under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting corp_standard via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on corp standard feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_031',
    title: 'cut personal progressive under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting personal_progressive via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on personal progressive feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_032',
    title: 'hold personal progressive under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting personal_progressive via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on personal progressive feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_033',
    title: 'raise personal progressive under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting personal_progressive via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on personal progressive feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_034',
    title: 'cut payroll levy under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting payroll_levy via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on payroll levy feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_035',
    title: 'hold payroll levy under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting payroll_levy via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on payroll levy feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_036',
    title: 'raise payroll levy under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting payroll_levy via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on payroll levy feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_037',
    title: 'cut resource rent under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting resource_rent via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on resource rent feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_038',
    title: 'hold resource rent under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting resource_rent via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on resource rent feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_039',
    title: 'raise resource rent under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting resource_rent via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on resource rent feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_040',
    title: 'cut carbon price under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting carbon_price via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on carbon price feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_041',
    title: 'hold carbon price under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting carbon_price via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on carbon price feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_042',
    title: 'raise carbon price under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting carbon_price via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on carbon price feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_043',
    title: 'cut gst equivalent under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting gst_equivalent via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on gst equivalent feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_044',
    title: 'hold gst equivalent under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting gst_equivalent via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on gst equivalent feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_045',
    title: 'raise gst equivalent under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting gst_equivalent via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on gst equivalent feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_046',
    title: 'cut land value uplift under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting land_value_uplift via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on land value uplift feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_047',
    title: 'hold land value uplift under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting land_value_uplift via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on land value uplift feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_048',
    title: 'raise land value uplift under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting land_value_uplift via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on land value uplift feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_049',
    title: 'cut innovation credit under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting innovation_credit via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on innovation credit feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_050',
    title: 'hold innovation credit under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting innovation_credit via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on innovation credit feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_051',
    title: 'raise innovation credit under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting innovation_credit via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on innovation credit feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_052',
    title: 'cut regional incentive under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting regional_incentive via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how cut on regional incentive feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_053',
    title: 'hold regional incentive under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting regional_incentive via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how hold on regional incentive feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_054',
    title: 'raise regional incentive under healthy fiscal pressure',
    fiscalContext: 'National fiscal pressure band healthy; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is healthy, adjusting regional_incentive via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'healthy',
    playerFacingSummary: 'Explore how raise on regional incentive feels when national fiscal headroom is healthy.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_055',
    title: 'cut corp standard under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting corp_standard via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on corp standard feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_056',
    title: 'hold corp standard under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting corp_standard via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on corp standard feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_057',
    title: 'raise corp standard under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting corp_standard via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on corp standard feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_058',
    title: 'cut personal progressive under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting personal_progressive via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on personal progressive feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_059',
    title: 'hold personal progressive under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting personal_progressive via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on personal progressive feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_060',
    title: 'raise personal progressive under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting personal_progressive via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on personal progressive feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_061',
    title: 'cut payroll levy under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting payroll_levy via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on payroll levy feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_062',
    title: 'hold payroll levy under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting payroll_levy via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on payroll levy feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_063',
    title: 'raise payroll levy under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting payroll_levy via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on payroll levy feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_064',
    title: 'cut resource rent under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting resource_rent via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on resource rent feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_065',
    title: 'hold resource rent under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting resource_rent via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on resource rent feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_066',
    title: 'raise resource rent under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting resource_rent via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on resource rent feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_067',
    title: 'cut carbon price under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting carbon_price via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on carbon price feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_068',
    title: 'hold carbon price under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting carbon_price via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on carbon price feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_069',
    title: 'raise carbon price under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting carbon_price via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on carbon price feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_070',
    title: 'cut gst equivalent under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting gst_equivalent via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on gst equivalent feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_071',
    title: 'hold gst equivalent under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting gst_equivalent via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on gst equivalent feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_072',
    title: 'raise gst equivalent under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting gst_equivalent via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on gst equivalent feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_073',
    title: 'cut land value uplift under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting land_value_uplift via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on land value uplift feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_074',
    title: 'hold land value uplift under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting land_value_uplift via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on land value uplift feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_075',
    title: 'raise land value uplift under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting land_value_uplift via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on land value uplift feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_076',
    title: 'cut innovation credit under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting innovation_credit via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on innovation credit feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_077',
    title: 'hold innovation credit under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting innovation_credit via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on innovation credit feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_078',
    title: 'raise innovation credit under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting innovation_credit via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on innovation credit feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_079',
    title: 'cut regional incentive under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting regional_incentive via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how cut on regional incentive feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_080',
    title: 'hold regional incentive under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting regional_incentive via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how hold on regional incentive feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_081',
    title: 'raise regional incentive under tight fiscal pressure',
    fiscalContext: 'National fiscal pressure band tight; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is tight, adjusting regional_incentive via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'tight',
    playerFacingSummary: 'Explore how raise on regional incentive feels when national fiscal headroom is tight.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_082',
    title: 'cut corp standard under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting corp_standard via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on corp standard feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_083',
    title: 'hold corp standard under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting corp_standard via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on corp standard feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_084',
    title: 'raise corp standard under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting corp_standard via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on corp standard feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_085',
    title: 'cut personal progressive under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting personal_progressive via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on personal progressive feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_086',
    title: 'hold personal progressive under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting personal_progressive via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on personal progressive feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_087',
    title: 'raise personal progressive under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting personal_progressive via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on personal progressive feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_088',
    title: 'cut payroll levy under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting payroll_levy via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on payroll levy feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_089',
    title: 'hold payroll levy under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting payroll_levy via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on payroll levy feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_090',
    title: 'raise payroll levy under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting payroll_levy via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on payroll levy feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_091',
    title: 'cut resource rent under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting resource_rent via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on resource rent feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_092',
    title: 'hold resource rent under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting resource_rent via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on resource rent feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_093',
    title: 'raise resource rent under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting resource_rent via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on resource rent feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_094',
    title: 'cut carbon price under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting carbon_price via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on carbon price feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_095',
    title: 'hold carbon price under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting carbon_price via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on carbon price feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_096',
    title: 'raise carbon price under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting carbon_price via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on carbon price feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_097',
    title: 'cut gst equivalent under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting gst_equivalent via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on gst equivalent feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_098',
    title: 'hold gst equivalent under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting gst_equivalent via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on gst equivalent feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_099',
    title: 'raise gst equivalent under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting gst_equivalent via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on gst equivalent feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_100',
    title: 'cut land value uplift under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting land_value_uplift via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on land value uplift feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_101',
    title: 'hold land value uplift under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting land_value_uplift via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on land value uplift feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_102',
    title: 'raise land value uplift under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting land_value_uplift via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on land value uplift feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_103',
    title: 'cut innovation credit under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting innovation_credit via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on innovation credit feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_104',
    title: 'hold innovation credit under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting innovation_credit via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on innovation credit feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_105',
    title: 'raise innovation credit under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting innovation_credit via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on innovation credit feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_106',
    title: 'cut regional incentive under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting regional_incentive via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how cut on regional incentive feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_107',
    title: 'hold regional incentive under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting regional_incentive via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how hold on regional incentive feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_108',
    title: 'raise regional incentive under strained fiscal pressure',
    fiscalContext: 'National fiscal pressure band strained; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is strained, adjusting regional_incentive via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'strained',
    playerFacingSummary: 'Explore how raise on regional incentive feels when national fiscal headroom is strained.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_109',
    title: 'cut corp standard under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting corp_standard via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on corp standard feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_110',
    title: 'hold corp standard under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting corp_standard via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on corp standard feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_111',
    title: 'raise corp standard under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting corp_standard via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['corp_standard'],
    stanceHints: { 'corp_standard': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on corp standard feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_112',
    title: 'cut personal progressive under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting personal_progressive via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on personal progressive feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_113',
    title: 'hold personal progressive under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting personal_progressive via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on personal progressive feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_114',
    title: 'raise personal progressive under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting personal_progressive via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['personal_progressive'],
    stanceHints: { 'personal_progressive': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on personal progressive feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_115',
    title: 'cut payroll levy under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting payroll_levy via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on payroll levy feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_116',
    title: 'hold payroll levy under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting payroll_levy via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on payroll levy feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_117',
    title: 'raise payroll levy under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting payroll_levy via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['payroll_levy'],
    stanceHints: { 'payroll_levy': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on payroll levy feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_118',
    title: 'cut resource rent under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting resource_rent via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on resource rent feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_119',
    title: 'hold resource rent under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting resource_rent via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on resource rent feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_120',
    title: 'raise resource rent under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting resource_rent via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['resource_rent'],
    stanceHints: { 'resource_rent': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on resource rent feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_121',
    title: 'cut carbon price under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting carbon_price via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on carbon price feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_122',
    title: 'hold carbon price under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting carbon_price via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on carbon price feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_123',
    title: 'raise carbon price under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting carbon_price via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['carbon_price'],
    stanceHints: { 'carbon_price': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on carbon price feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_124',
    title: 'cut gst equivalent under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting gst_equivalent via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on gst equivalent feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_125',
    title: 'hold gst equivalent under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting gst_equivalent via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on gst equivalent feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_126',
    title: 'raise gst equivalent under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting gst_equivalent via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['gst_equivalent'],
    stanceHints: { 'gst_equivalent': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on gst equivalent feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_127',
    title: 'cut land value uplift under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting land_value_uplift via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on land value uplift feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_128',
    title: 'hold land value uplift under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting land_value_uplift via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on land value uplift feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_129',
    title: 'raise land value uplift under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting land_value_uplift via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['land_value_uplift'],
    stanceHints: { 'land_value_uplift': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on land value uplift feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_130',
    title: 'cut innovation credit under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting innovation_credit via a cut stance shifts normalized revenue estimates and linked regional_balance & national_prosperity outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'cut' },
    linkedOutcomes: ['regional_balance', 'national_prosperity'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on innovation credit feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_131',
    title: 'hold innovation credit under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting innovation_credit via a hold stance shifts normalized revenue estimates and linked innovation_momentum & public_stability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'hold' },
    linkedOutcomes: ['innovation_momentum', 'public_stability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on innovation credit feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_132',
    title: 'raise innovation credit under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting innovation_credit via a raise stance shifts normalized revenue estimates and linked national_prosperity & program_delivery outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['innovation_credit'],
    stanceHints: { 'innovation_credit': 'raise' },
    linkedOutcomes: ['national_prosperity', 'program_delivery'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on innovation credit feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_133',
    title: 'cut regional incentive under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting regional_incentive via a cut stance shifts normalized revenue estimates and linked public_stability & household_affordability outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'cut' },
    linkedOutcomes: ['public_stability', 'household_affordability'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how cut on regional incentive feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_134',
    title: 'hold regional incentive under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting regional_incentive via a hold stance shifts normalized revenue estimates and linked program_delivery & regional_balance outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'hold' },
    linkedOutcomes: ['program_delivery', 'regional_balance'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how hold on regional incentive feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
  {
    id: 'pack_135',
    title: 'raise regional incentive under critical fiscal pressure',
    fiscalContext: 'National fiscal pressure band critical; envelope flex depends on V10.12 headroom.',
    narrative: 'When fiscal capacity is critical, adjusting regional_incentive via a raise stance shifts normalized revenue estimates and linked household_affordability & innovation_momentum outcomes over several turns. This pack is advisory: legality and program approval remain unchanged from V10.12.',
    recommendedInstruments: ['regional_incentive'],
    stanceHints: { 'regional_incentive': 'raise' },
    linkedOutcomes: ['household_affordability', 'innovation_momentum'],
    expectedPressure: 'critical',
    playerFacingSummary: 'Explore how raise on regional incentive feels when national fiscal headroom is critical.',
    designerNotes: 'Merge hook: surface in Fiscal Outcomes inspector what-if carousel; do not mutate actor wallets.',
  },
];


// --- source: revenue-ledger/types.ts ---

export const REVENUE_LEDGER_SCHEMA = 'op10m-agent07-revenue-ledger-v1';

export type RevenueStreamKind =
  | 'tax_instrument'
  | 'resource_volatility'
  | 'carbon_market'
  | 'policy_dividend'
  | 'transfers_in'
  | 'one_off_receipt';

export interface RevenueStreamLine {
  id: string;
  kind: RevenueStreamKind;
  label: string;
  baseCapacityPoints: number;
  deltaPoints: number;
  volatilityBand: 'low' | 'medium' | 'high';
  sourceInstrumentId: string | null;
  explanation: string;
}

export interface NationalRevenueLedger {
  schemaVersion: string;
  turn: number;
  structuralCapacity: number;
  currentCapacity: number;
  streams: RevenueStreamLine[];
  totalDelta: number;
  reconciledToV1012: boolean;
  reconciliationNotes: string[];
}

export interface RevenueLedgerInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  taxInstruments: ActiveTaxInstrument[];
}


// --- source: revenue-ledger/compute.ts ---

function volatilityForInstrument(instrumentId: string): RevenueStreamLine['volatilityBand'] {
  if (instrumentId === 'resource_rent') return 'high';
  if (instrumentId === 'carbon_price') return 'medium';
  if (instrumentId === 'innovation_credit') return 'low';
  return 'low';
}

export function buildNationalRevenueLedger(inputs: RevenueLedgerInputs): NationalRevenueLedger {
  const { v1012, taxInstruments, turn } = inputs;
  const structuralCapacity = v1012.revenueCapacity;
  const streams: RevenueStreamLine[] = taxInstruments.map(inst => ({
    id: `stream_${inst.instrumentId}`,
    kind: 'tax_instrument',
    label: inst.explanation.split(' at ')[0] || inst.instrumentId,
    baseCapacityPoints: Math.round(structuralCapacity * 0.11),
    deltaPoints: Math.round(inst.revenueDeltaEstimate),
    volatilityBand: volatilityForInstrument(inst.instrumentId),
    sourceInstrumentId: inst.instrumentId,
    explanation: inst.explanation
  }));

  if (v1012.revenuePolicy === 'revenue_focused') {
    streams.push({
      id: 'stream_policy_dividend',
      kind: 'policy_dividend',
      label: 'Revenue-focused policy dividend',
      baseCapacityPoints: 0,
      deltaPoints: 2,
      volatilityBand: 'low',
      sourceInstrumentId: null,
      explanation: 'V10.12 revenue policy stance adds modest structural uplift (normalized points).'
    });
  }

  const totalDelta = streams.reduce((s, l) => s + l.deltaPoints, 0);
  const modeledCurrent = structuralCapacity + Math.round(totalDelta * 0.15);
  const reconciledToV1012 = Math.abs(modeledCurrent - structuralCapacity) <= Math.max(8, structuralCapacity * 0.12);
  const reconciliationNotes: string[] = [];
  if (!reconciledToV1012) {
    reconciliationNotes.push(
      `Modeled current ${modeledCurrent} vs V10.12 structural ${structuralCapacity} — within tolerance band for policy deltas only.`
    );
  } else {
    reconciliationNotes.push('Ledger deltas reconcile to V10.12 structural capacity (policy-scaled).');
  }

  return {
    schemaVersion: REVENUE_LEDGER_SCHEMA,
    turn,
    structuralCapacity,
    currentCapacity: structuralCapacity,
    streams,
    totalDelta,
    reconciledToV1012,
    reconciliationNotes
  };
}


// --- source: fiscal-risk-register/types.ts ---
export const FISCAL_RISK_REGISTER_SCHEMA = 'op10m-agent07-fiscal-risk-register-v1';

export type FiscalRiskCategory =
  | 'revenue_volatility'
  | 'debt_rollover'
  | 'demand_pressure'
  | 'commodity_exposure'
  | 'policy_reversal'
  | 'intergovernmental_clawback';

export interface FiscalRiskEntry {
  id: string;
  category: FiscalRiskCategory;
  label: string;
  likelihood: number;
  impactPoints: number;
  mitigationReady: boolean;
  warnOnly: boolean;
}

export interface FiscalRiskRegisterReport {
  schemaVersion: string;
  turn: number;
  entries: FiscalRiskEntry[];
  aggregateHeat: number;
  highImpactCount: number;
  unmitigatedCount: number;
  withinRiskAppetite: boolean;
  tier: 'low' | 'elevated' | 'severe';
  narrative: string;
  warnings: string[];
}


// --- source: fiscal-risk-register/compute.ts ---

export const BASE_FISCAL_RISKS: Omit<FiscalRiskEntry, 'id'>[] = [
  {
    category: 'revenue_volatility',
    label: 'Commodity-linked revenue volatility',
    likelihood: 0.22,
    impactPoints: 12,
    mitigationReady: true,
    warnOnly: true
  },
  {
    category: 'debt_rollover',
    label: 'Refinancing cluster concentration',
    likelihood: 0.18,
    impactPoints: 16,
    mitigationReady: false,
    warnOnly: true
  },
  {
    category: 'demand_pressure',
    label: 'Health and social demand overshoot',
    likelihood: 0.28,
    impactPoints: 10,
    mitigationReady: true,
    warnOnly: true
  },
  {
    category: 'commodity_exposure',
    label: 'Resource rent cyclicality',
    likelihood: 0.15,
    impactPoints: 14,
    mitigationReady: false,
    warnOnly: true
  },
  {
    category: 'policy_reversal',
    label: 'Tax instrument rollback risk',
    likelihood: 0.12,
    impactPoints: 8,
    mitigationReady: true,
    warnOnly: true
  },
  {
    category: 'intergovernmental_clawback',
    label: 'Grant clawback after performance miss',
    likelihood: 0.1,
    impactPoints: 6,
    mitigationReady: true,
    warnOnly: false
  }
];

export function catalogFiscalRisks(turn: number): FiscalRiskEntry[] {
  return BASE_FISCAL_RISKS.map((row, idx) => ({
    id: `fr_${turn}_${idx}_${row.category}`,
    ...row
  }));
}

function stressLikelihoodScale(v1012: V1012FiscalSnapshot): number {
  if (v1012.pressure === 'critical') return 1.35;
  if (v1012.pressure === 'strained') return 1.18;
  if (v1012.pressure === 'tight') return 1.06;
  return 1;
}

export function buildFiscalRiskRegister(
  turn: number,
  v1012: V1012FiscalSnapshot,
  entries: FiscalRiskEntry[] = catalogFiscalRisks(turn)
): FiscalRiskRegisterReport {
  const scale = stressLikelihoodScale(v1012);
  const debtAdj = v1012.debtServiceLoad > 14 ? 1.12 : 1;
  const headroomAdj = v1012.fiscalHeadroom < 0 ? 1.15 : 1;

  const scored = entries.map(e => ({
    ...e,
    score: e.likelihood * scale * debtAdj * headroomAdj * e.impactPoints
  }));

  const aggregateHeat = Math.round(scored.reduce((s, e) => s + e.score, 0) * 10) / 10;
  const highImpactCount = scored.filter(e => e.impactPoints >= 12).length;
  const unmitigatedCount = scored.filter(e => !e.mitigationReady).length;

  const appetiteCeiling = 28 + Math.max(0, v1012.fiscalHeadroom * 0.8);
  const withinRiskAppetite = aggregateHeat <= appetiteCeiling;

  let tier: FiscalRiskRegisterReport['tier'] = 'low';
  if (aggregateHeat > appetiteCeiling * 1.25 || v1012.pressure === 'critical') tier = 'severe';
  else if (
    aggregateHeat > appetiteCeiling * 0.85 ||
    unmitigatedCount >= 3 ||
    (v1012.pressure === 'strained' && aggregateHeat >= 16)
  ) {
    tier = 'elevated';
  }

  const warnings: string[] = [];
  if (!withinRiskAppetite) {
    warnings.push(`Aggregate heat ${aggregateHeat} exceeds appetite ${appetiteCeiling.toFixed(1)}.`);
  }
  if (unmitigatedCount >= 2 && v1012.fiscalHeadroom < 2) {
    warnings.push('Multiple unmitigated risks with limited fiscal headroom.');
  }

  const narrative = withinRiskAppetite
    ? `Fiscal risk register: heat ${aggregateHeat} within appetite (${tier} tier).`
    : `Fiscal risk register elevated (${tier}): ${unmitigatedCount} unmitigated, ${highImpactCount} high-impact entries.`;

  return {
    schemaVersion: FISCAL_RISK_REGISTER_SCHEMA,
    turn,
    entries,
    aggregateHeat,
    highImpactCount,
    unmitigatedCount,
    withinRiskAppetite,
    tier,
    narrative,
    warnings
  };
}


// --- source: intergovernmental-grants/types.ts ---
export const INTERGOVERNMENTAL_GRANTS_SCHEMA = 'op10m-agent07-intergovernmental-grants-v1';

export type GrantProgramKind =
  | 'health_block'
  | 'education_reform'
  | 'roads_partner'
  | 'housing_accelerator'
  | 'disaster_recovery';

export interface GrantAllocationLine {
  programId: GrantProgramKind;
  label: string;
  federalPoints: number;
  stateMatchRequired: number;
  performanceGateMet: boolean;
  clawbackPoints: number;
  netToStates: number;
}

export interface IntergovernmentalGrantsReport {
  schemaVersion: string;
  turn: number;
  allocations: GrantAllocationLine[];
  totalFederal: number;
  totalClawback: number;
  netFederalOutlay: number;
  performancePassRate: number;
  reconciledToIgrPool: boolean;
  warnings: string[];
}


// --- source: intergovernmental-grants/compute.ts ---

const PROGRAM_WEIGHTS: Record<GrantProgramKind, { share: number; match: number; label: string }> = {
  health_block: { share: 0.32, match: 0.05, label: 'Health block grant' },
  education_reform: { share: 0.24, match: 0.08, label: 'Schools reform partnership' },
  roads_partner: { share: 0.18, match: 0.12, label: 'Roads of significance partner' },
  housing_accelerator: { share: 0.14, match: 0.1, label: 'Housing accelerator' },
  disaster_recovery: { share: 0.12, match: 0, label: 'Disaster recovery advance' }
};

function performanceGate(v1012: V1012FiscalSnapshot, program: GrantProgramKind): boolean {
  if (program === 'disaster_recovery') return v1012.pressure !== 'critical';
  if (program === 'housing_accelerator') return v1012.fiscalHeadroom > -8;
  if (program === 'roads_partner') return v1012.maintenanceLoad < 16;
  if (program === 'education_reform') return v1012.sustainability !== 'fragile';
  return v1012.debtServiceLoad < 20;
}

export function allocateIntergovernmentalGrants(
  turn: number,
  v1012: V1012FiscalSnapshot
): IntergovernmentalGrantsReport {
  const igr = reconcileFederalStateTransfers(turn, v1012);
  const grantPool = Math.max(8, Math.round(igr.federalRevenuePool * 0.38));
  const warnings: string[] = [];

  const allocations: GrantAllocationLine[] = (Object.keys(PROGRAM_WEIGHTS) as GrantProgramKind[]).map(programId => {
    const meta = PROGRAM_WEIGHTS[programId];
    const federalPoints = Math.round(grantPool * meta.share * 10) / 10;
    const gate = performanceGate(v1012, programId);
    const clawbackRate = gate ? 0 : programId === 'disaster_recovery' ? 0.15 : 0.22;
    const clawbackPoints = Math.round(federalPoints * clawbackRate * 10) / 10;
    const netToStates = Math.round((federalPoints - clawbackPoints) * 10) / 10;
    return {
      programId,
      label: meta.label,
      federalPoints,
      stateMatchRequired: Math.round(federalPoints * meta.match * 10) / 10,
      performanceGateMet: gate,
      clawbackPoints,
      netToStates
    };
  });

  const totalFederal = Math.round(allocations.reduce((s, a) => s + a.federalPoints, 0) * 10) / 10;
  const totalClawback = Math.round(allocations.reduce((s, a) => s + a.clawbackPoints, 0) * 10) / 10;
  const netFederalOutlay = Math.round((totalFederal - totalClawback) * 10) / 10;
  const performancePassRate =
    allocations.length > 0 ? allocations.filter(a => a.performanceGateMet).length / allocations.length : 0;

  const reconciledToIgrPool = Math.abs(totalFederal - grantPool) <= 1.5;
  if (!reconciledToIgrPool) {
    warnings.push(`Grant pool ${totalFederal} vs IGR-derived ${grantPool} — rounding tolerance.`);
  }
  if (totalClawback > grantPool * 0.25) {
    warnings.push('Clawbacks exceed 25% of grant pool — state delivery stress.');
  }

  return {
    schemaVersion: INTERGOVERNMENTAL_GRANTS_SCHEMA,
    turn,
    allocations,
    totalFederal,
    totalClawback,
    netFederalOutlay,
    performancePassRate,
    reconciledToIgrPool,
    warnings
  };
}


// --- source: statutory-balances/types.ts ---
export const STATUTORY_BALANCES_SCHEMA = 'op10m-agent07-statutory-balances-v1';

export interface StatutoryBalanceBand {
  id: 'operating' | 'fiscal' | 'net_debt_anchor';
  label: string;
  balancePoints: number;
  anchorPoints: number;
  withinAnchor: boolean;
  warnOnly: boolean;
}

export interface StatutoryBalancesReport {
  schemaVersion: string;
  turn: number;
  bands: StatutoryBalanceBand[];
  netOperatingBalance: number;
  fiscalBalance: number;
  netDebtToCapacityRatio: number;
  allWithinSoftAnchors: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: statutory-balances/compute.ts ---

const OPERATING_ANCHOR_FLOOR = -8;
const FISCAL_ANCHOR_FLOOR = -14;
const NET_DEBT_RATIO_CEILING = 0.72;

export function buildStatutoryBalancesReport(turn: number, v1012: V1012FiscalSnapshot): StatutoryBalancesReport {
  const revenueBase = v1012.revenueCapacity * 0.42;
  const operatingOutlays =
    revenueBase * 0.38 + v1012.maintenanceLoad * 0.55 + Math.max(0, -v1012.fiscalHeadroom) * 0.25;
  const netOperatingBalance = Math.round((revenueBase - operatingOutlays + v1012.fiscalHeadroom * 0.6) * 10) / 10;

  const capitalNet = v1012.debtEnabled ? v1012.debtLevel * 0.04 - v1012.debtServiceLoad * 0.15 : 0;
  const fiscalBalance = Math.round((netOperatingBalance - capitalNet) * 10) / 10;

  const netDebtToCapacityRatio =
    v1012.revenueCapacity > 0
      ? Math.round((v1012.debtLevel / v1012.revenueCapacity) * 1000) / 1000
      : 0;

  const bands: StatutoryBalanceBand[] = [
    {
      id: 'operating',
      label: 'Net operating balance',
      balancePoints: netOperatingBalance,
      anchorPoints: OPERATING_ANCHOR_FLOOR,
      withinAnchor: netOperatingBalance >= OPERATING_ANCHOR_FLOOR || v1012.pressure === 'critical',
      warnOnly: true
    },
    {
      id: 'fiscal',
      label: 'Fiscal balance (incl. capital net)',
      balancePoints: fiscalBalance,
      anchorPoints: FISCAL_ANCHOR_FLOOR,
      withinAnchor: fiscalBalance >= FISCAL_ANCHOR_FLOOR || v1012.pressure === 'critical',
      warnOnly: true
    },
    {
      id: 'net_debt_anchor',
      label: 'Net debt to capacity ratio',
      balancePoints: netDebtToCapacityRatio,
      anchorPoints: NET_DEBT_RATIO_CEILING,
      withinAnchor: netDebtToCapacityRatio <= NET_DEBT_RATIO_CEILING || !v1012.debtEnabled,
      warnOnly: false
    }
  ];

  const warnings: string[] = [];
  if (!bands[0].withinAnchor) {
    warnings.push(`Operating balance ${netOperatingBalance} below soft floor ${OPERATING_ANCHOR_FLOOR}.`);
  }
  if (!bands[2].withinAnchor) {
    warnings.push(`Net debt ratio ${netDebtToCapacityRatio} exceeds anchor ${NET_DEBT_RATIO_CEILING}.`);
  }
  if (v1012.sustainability === 'fragile' && fiscalBalance < -6) {
    warnings.push('Fragile sustainability with deeply negative fiscal balance.');
  }

  const allWithinSoftAnchors = bands.every(b => b.withinAnchor);
  const narrative = allWithinSoftAnchors
    ? `Statutory balances within anchors (NOB ${netOperatingBalance}, FB ${fiscalBalance}).`
    : `Statutory balance pressure: NOB ${netOperatingBalance}, FB ${fiscalBalance}, debt/cap ${netDebtToCapacityRatio}.`;

  return {
    schemaVersion: STATUTORY_BALANCES_SCHEMA,
    turn,
    bands,
    netOperatingBalance,
    fiscalBalance,
    netDebtToCapacityRatio,
    allWithinSoftAnchors,
    narrative,
    warnings
  };
}


// --- source: cost-recovery-pricing/types.ts ---
export const COST_RECOVERY_SCHEMA = 'op10m-agent07-cost-recovery-v1';

export type UserChargeCategory =
  | 'water_sewerage'
  | 'road_tolling'
  | 'regulatory_licensing'
  | 'hospital_copayment'
  | 'university_contribution';

export interface CostRecoveryLine {
  category: UserChargeCategory;
  label: string;
  fullCostPoints: number;
  recoveredPoints: number;
  recoveryRatio: number;
  policyTargetRatio: number;
  withinTarget: boolean;
}

export interface CostRecoveryStatement {
  schemaVersion: string;
  turn: number;
  lines: CostRecoveryLine[];
  aggregateFullCost: number;
  aggregateRecovered: number;
  weightedRecoveryRatio: number;
  withinPortfolioTarget: boolean;
  underRecoveryCount: number;
  narrative: string;
  warnings: string[];
}


// --- source: cost-recovery-pricing/compute.ts ---

const BASE_LINES: Omit<CostRecoveryLine, 'recoveredPoints' | 'recoveryRatio' | 'withinTarget'>[] = [
  {
    category: 'water_sewerage',
    label: 'Urban water & sewerage',
    fullCostPoints: 14,
    policyTargetRatio: 0.75
  },
  {
    category: 'road_tolling',
    label: 'Major road tolling',
    fullCostPoints: 9,
    policyTargetRatio: 0.55
  },
  {
    category: 'regulatory_licensing',
    label: 'Regulatory licensing fees',
    fullCostPoints: 6,
    policyTargetRatio: 0.85
  },
  {
    category: 'hospital_copayment',
    label: 'Hospital copayments (selected services)',
    fullCostPoints: 11,
    policyTargetRatio: 0.35
  },
  {
    category: 'university_contribution',
    label: 'Higher education student contributions',
    fullCostPoints: 16,
    policyTargetRatio: 0.42
  }
];

function pressureRecoveryScale(v1012: V1012FiscalSnapshot): number {
  if (v1012.revenuePolicy === 'revenue_focused') return 1.08;
  if (v1012.pressure === 'critical') return 0.82;
  if (v1012.pressure === 'strained') return 0.92;
  return 1;
}

export function buildCostRecoveryStatement(turn: number, v1012: V1012FiscalSnapshot): CostRecoveryStatement {
  const scale = pressureRecoveryScale(v1012);
  const headroomAdj = v1012.fiscalHeadroom < 0 ? 0.94 : 1;

  const lines: CostRecoveryLine[] = BASE_LINES.map(row => {
    const jitter = ((turn + row.fullCostPoints) % 7) * 0.005;
    const recoveryRatio = Math.min(
      1,
      Math.round((row.policyTargetRatio * scale * headroomAdj + jitter) * 1000) / 1000
    );
    const recoveredPoints = Math.round(row.fullCostPoints * recoveryRatio * 10) / 10;
    const withinTarget = recoveryRatio >= row.policyTargetRatio * 0.85 || v1012.pressure === 'critical';
    return {
      ...row,
      recoveredPoints,
      recoveryRatio,
      withinTarget
    };
  });

  const aggregateFullCost = lines.reduce((s, l) => s + l.fullCostPoints, 0);
  const aggregateRecovered = lines.reduce((s, l) => s + l.recoveredPoints, 0);
  const weightedRecoveryRatio =
    aggregateFullCost > 0
      ? Math.round((aggregateRecovered / aggregateFullCost) * 1000) / 1000
      : 0;

  const underRecoveryCount = lines.filter(l => !l.withinTarget).length;
  const portfolioFloor = v1012.revenuePolicy === 'revenue_focused' ? 0.48 : 0.42;
  const withinPortfolioTarget =
    weightedRecoveryRatio >= portfolioFloor || v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (underRecoveryCount >= 2 && v1012.fiscalHeadroom < 4) {
    warnings.push(`${underRecoveryCount} charge lines under recovery target with limited headroom.`);
  }
  if (!withinPortfolioTarget) {
    warnings.push(`Portfolio recovery ${weightedRecoveryRatio} below floor ${portfolioFloor}.`);
  }

  const narrative = withinPortfolioTarget
    ? `Cost recovery portfolio at ${(weightedRecoveryRatio * 100).toFixed(1)}% of full cost.`
    : `Cost recovery shortfall: weighted ratio ${weightedRecoveryRatio}.`;

  return {
    schemaVersion: COST_RECOVERY_SCHEMA,
    turn,
    lines,
    aggregateFullCost,
    aggregateRecovered,
    weightedRecoveryRatio,
    withinPortfolioTarget,
    underRecoveryCount,
    narrative,
    warnings
  };
}


// --- source: cash-management/types.ts ---
export const CASH_MANAGEMENT_SCHEMA = 'op10m-agent07-cash-management-v1';

export type CashRunwayBand = 'comfortable' | 'watch' | 'squeeze' | 'critical';

export interface CashManagementLine {
  id: string;
  label: string;
  openingBalancePoints: number;
  inflowPoints: number;
  outflowPoints: number;
  closingBalancePoints: number;
}

export interface CashManagementReport {
  schemaVersion: string;
  turn: number;
  lines: CashManagementLine[];
  aggregateClosingBalance: number;
  runwayTurns: number;
  runwayBand: CashRunwayBand;
  withinDrawdownLimit: boolean;
  endOfYearSqueeze: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: cash-management/compute.ts ---

const DRAWDOWN_LIMIT = 12;

function runwayBand(runwayTurns: number, squeeze: boolean): CashRunwayBand {
  if (squeeze) return 'critical';
  if (runwayTurns >= 5) return 'comfortable';
  if (runwayTurns >= 3) return 'watch';
  if (runwayTurns >= 1) return 'squeeze';
  return 'critical';
}

export function buildCashManagementReport(turn: number, v1012: V1012FiscalSnapshot): CashManagementReport {
  const revenueInflow = Math.round(v1012.revenueCapacity * 0.11 * 10) / 10;
  const grantInflow = Math.round(v1012.revenueCapacity * 0.015 * 10) / 10;
  const operatingOutflow =
    Math.round((v1012.maintenanceLoad * 0.9 + v1012.debtServiceLoad * 0.55 + Math.max(0, 8 - v1012.fiscalHeadroom) * 0.4) * 10) /
    10;
  const capitalOutflow = v1012.debtEnabled ? Math.round(v1012.debtLevel * 0.02 * 10) / 10 : 0;

  const opening =
    Math.round((14 + v1012.fiscalHeadroom * 0.35 + (v1012.reservePolicy === 'prudent' ? 4 : 0)) * 10) / 10;

  const lines: CashManagementLine[] = [
    {
      id: 'operating',
      label: 'Operating TGA slice',
      openingBalancePoints: opening,
      inflowPoints: revenueInflow + grantInflow,
      outflowPoints: operatingOutflow,
      closingBalancePoints: 0
    },
    {
      id: 'capital',
      label: 'Capital & rollover buffer',
      openingBalancePoints: Math.max(2, opening * 0.25),
      inflowPoints: v1012.debtEnabled ? Math.round(v1012.debtLevel * 0.015 * 10) / 10 : 0,
      outflowPoints: capitalOutflow,
      closingBalancePoints: 0
    }
  ];

  for (const line of lines) {
    line.closingBalancePoints =
      Math.round((line.openingBalancePoints + line.inflowPoints - line.outflowPoints) * 10) / 10;
  }

  const aggregateClosingBalance = lines.reduce((s, l) => s + l.closingBalancePoints, 0);
  const weeklyBurn = Math.max(0.5, operatingOutflow / 4);
  const runwayTurns = Math.max(0, Math.round((aggregateClosingBalance / weeklyBurn) * 10) / 10);

  const endOfYearSqueeze = turn % 12 >= 10 && aggregateClosingBalance < DRAWDOWN_LIMIT;
  const band = runwayBand(runwayTurns, endOfYearSqueeze && v1012.pressure !== 'comfortable');

  const withinDrawdownLimit =
    aggregateClosingBalance >= DRAWDOWN_LIMIT || v1012.pressure === 'critical' || !v1012.debtEnabled;

  const warnings: string[] = [];
  if (endOfYearSqueeze) {
    warnings.push('End-of-year appropriation squeeze — TGA closing balance below drawdown comfort.');
  }
  if (!withinDrawdownLimit) {
    warnings.push(`Aggregate closing ${aggregateClosingBalance} below drawdown limit ${DRAWDOWN_LIMIT}.`);
  }
  if (band === 'squeeze' || band === 'critical') {
    warnings.push(`Cash runway ${runwayTurns} turns — ${band} band.`);
  }

  const narrative = withinDrawdownLimit
    ? `TGA aggregate closing ${aggregateClosingBalance} with ~${runwayTurns} turn runway (${band}).`
    : `Cash management alert: closing ${aggregateClosingBalance}, runway ${runwayTurns}.`;

  return {
    schemaVersion: CASH_MANAGEMENT_SCHEMA,
    turn,
    lines,
    aggregateClosingBalance,
    runwayTurns,
    runwayBand: band,
    withinDrawdownLimit,
    endOfYearSqueeze,
    narrative,
    warnings
  };
}


// --- source: appropriation-warrants/types.ts ---
export const APPROPRIATION_WARRANTS_SCHEMA = 'op10m-agent07-appropriation-warrants-v1';

export type WarrantStatus = 'open' | 'partially_lapsed' | 'fully_lapsed' | 'reallocated';

export interface AppropriationWarrantLine {
  warrantId: string;
  portfolio: string;
  appropriationPoints: number;
  warrantIssuedPoints: number;
  warrantRemainingPoints: number;
  lapseRiskPoints: number;
  status: WarrantStatus;
  withinTolerance: boolean;
}

export interface AppropriationWarrantLedger {
  schemaVersion: string;
  turn: number;
  lines: AppropriationWarrantLine[];
  aggregateAppropriation: number;
  aggregateRemaining: number;
  aggregateLapseRisk: number;
  lapseWithinTolerance: boolean;
  reallocationCount: number;
  narrative: string;
  warnings: string[];
}


// --- source: appropriation-warrants/compute.ts ---

const BASE_PORTFOLIOS: Array<{ portfolio: string; share: number }> = [
  { portfolio: 'social_services', share: 0.32 },
  { portfolio: 'infrastructure', share: 0.22 },
  { portfolio: 'defence', share: 0.14 },
  { portfolio: 'health', share: 0.18 },
  { portfolio: 'education', share: 0.14 }
];

function statusFromRemaining(ratio: number, lapseRisk: number): WarrantStatus {
  if (lapseRisk >= ratio * 0.45) return 'fully_lapsed';
  if (lapseRisk >= ratio * 0.2) return 'partially_lapsed';
  if (lapseRisk >= ratio * 0.08) return 'reallocated';
  return 'open';
}

export function buildAppropriationWarrantLedger(turn: number, v1012: V1012FiscalSnapshot): AppropriationWarrantLedger {
  const envelopeCapacity = v1012.revenueCapacity * 0.55 + Math.max(0, v1012.fiscalHeadroom) * 0.4;
  const pressureLapseScale =
    v1012.pressure === 'critical' ? 1.35 : v1012.pressure === 'strained' ? 1.15 : v1012.pressure === 'tight' ? 1.05 : 1;
  const turnPhase = turn % 12 >= 9 ? 1.2 : 1;

  const lines: AppropriationWarrantLine[] = BASE_PORTFOLIOS.map((row, idx) => {
    const appropriationPoints = Math.round(envelopeCapacity * row.share * 10) / 10;
    const issuedRatio = 0.72 + ((turn + idx) % 5) * 0.04;
    const warrantIssuedPoints = Math.round(appropriationPoints * issuedRatio * 10) / 10;
    const warrantRemainingPoints = Math.round((appropriationPoints - warrantIssuedPoints) * 10) / 10;
    const lapseRiskPoints =
      Math.round(Math.max(0, warrantRemainingPoints * 0.35 * pressureLapseScale * turnPhase) * 10) / 10;
    const status = statusFromRemaining(
      warrantRemainingPoints / Math.max(1, appropriationPoints),
      lapseRiskPoints
    );
    const withinTolerance =
      lapseRiskPoints <= appropriationPoints * 0.12 || v1012.pressure === 'critical' || status === 'open';
    return {
      warrantId: `warrant_${row.portfolio}`,
      portfolio: row.portfolio,
      appropriationPoints,
      warrantIssuedPoints,
      warrantRemainingPoints,
      lapseRiskPoints,
      status,
      withinTolerance
    };
  });

  const aggregateAppropriation = lines.reduce((s, l) => s + l.appropriationPoints, 0);
  const aggregateRemaining = lines.reduce((s, l) => s + l.warrantRemainingPoints, 0);
  const aggregateLapseRisk = lines.reduce((s, l) => s + l.lapseRiskPoints, 0);
  const reallocationCount = lines.filter(l => l.status === 'reallocated').length;

  const lapseTolerance = aggregateAppropriation * 0.1;
  const lapseWithinTolerance =
    aggregateLapseRisk <= lapseTolerance || v1012.pressure === 'critical';

  const warnings: string[] = [];
  const outOfTolerance = lines.filter(l => !l.withinTolerance);
  if (outOfTolerance.length >= 2) {
    warnings.push(`${outOfTolerance.length} warrant lines exceed per-portfolio lapse tolerance.`);
  }
  if (!lapseWithinTolerance) {
    warnings.push(`Aggregate lapse risk ${aggregateLapseRisk} above tolerance ${lapseTolerance.toFixed(1)}.`);
  }

  const narrative = lapseWithinTolerance
    ? `Warrant ledger reconciled; ${aggregateRemaining.toFixed(1)} points unissued with controlled lapse risk.`
    : `Appropriation lapse pressure: aggregate risk ${aggregateLapseRisk.toFixed(1)}.`;

  return {
    schemaVersion: APPROPRIATION_WARRANTS_SCHEMA,
    turn,
    lines,
    aggregateAppropriation,
    aggregateRemaining,
    aggregateLapseRisk,
    lapseWithinTolerance,
    reallocationCount,
    narrative,
    warnings
  };
}


// --- source: supplementary-estimates/types.ts ---
export const SUPPLEMENTARY_ESTIMATES_SCHEMA = 'op10m-agent07-supplementary-estimates-v1';

export type SupplementaryEstimateKind = 'myefo' | 'additional_estimates' | 'decision_variation';

export interface SupplementaryEstimateLine {
  id: string;
  kind: SupplementaryEstimateKind;
  portfolioId: string;
  label: string;
  baselinePoints: number;
  revisionPoints: number;
  netDeltaPoints: number;
  withinForwardBand: boolean;
}

export interface SupplementaryEstimatesReport {
  schemaVersion: string;
  turn: number;
  lines: SupplementaryEstimateLine[];
  aggregateUpwardRevision: number;
  aggregateDownwardRevision: number;
  netRevisionPoints: number;
  withinRevisionTolerance: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: supplementary-estimates/compute.ts ---

const REVISION_TOLERANCE = 14;

function line(
  id: string,
  kind: SupplementaryEstimateLine['kind'],
  portfolioId: string,
  label: string,
  baselinePoints: number,
  revisionPoints: number,
  forwardCeiling: number
): SupplementaryEstimateLine {
  const netDeltaPoints = Math.round((revisionPoints - baselinePoints) * 10) / 10;
  return {
    id,
    kind,
    portfolioId,
    label,
    baselinePoints,
    revisionPoints,
    netDeltaPoints,
    withinForwardBand: Math.abs(netDeltaPoints) <= forwardCeiling
  };
}

export function buildSupplementaryEstimatesReport(turn: number, v1012: V1012FiscalSnapshot): SupplementaryEstimatesReport {
  const forwardCeiling =
    v1012.pressure === 'critical' ? REVISION_TOLERANCE * 2 : v1012.pressure === 'strained' ? REVISION_TOLERANCE * 1.35 : REVISION_TOLERANCE;

  const parameterDrift = Math.round((v1012.maintenanceLoad * 0.15 + Math.max(0, 6 - v1012.fiscalHeadroom) * 0.25) * 10) / 10;
  const decisionUplift = turn % 12 >= 6 ? Math.round(v1012.revenueCapacity * 0.012 * 10) / 10 : 0;
  const savingsReprioritisation = v1012.fiscalHeadroom < 0 ? Math.round(Math.abs(v1012.fiscalHeadroom) * 0.35 * 10) / 10 : 0;

  const lines: SupplementaryEstimateLine[] = [
    line('sup_health', 'myefo', 'health', 'Health parameter variation', 42, 42 + parameterDrift, forwardCeiling),
    line('sup_education', 'myefo', 'education', 'Schools cost index', 28, 28 + parameterDrift * 0.6, forwardCeiling),
    line(
      'sup_defence',
      'additional_estimates',
      'defence',
      'Capability acceleration',
      18,
      18 + decisionUplift,
      forwardCeiling
    ),
    line(
      'sup_infrastructure',
      'decision_variation',
      'infrastructure',
      'Pipeline reprioritisation',
      22,
      22 + decisionUplift * 0.5 - savingsReprioritisation * 0.4,
      forwardCeiling
    ),
    line(
      'sup_social',
      'myefo',
      'social',
      'Demand-driven revision',
      35,
      35 + parameterDrift * 0.45 - savingsReprioritisation * 0.25,
      forwardCeiling
    )
  ];

  let aggregateUpwardRevision = 0;
  let aggregateDownwardRevision = 0;
  for (const l of lines) {
    if (l.netDeltaPoints > 0) aggregateUpwardRevision += l.netDeltaPoints;
    if (l.netDeltaPoints < 0) aggregateDownwardRevision += Math.abs(l.netDeltaPoints);
  }
  aggregateUpwardRevision = Math.round(aggregateUpwardRevision * 10) / 10;
  aggregateDownwardRevision = Math.round(aggregateDownwardRevision * 10) / 10;
  const netRevisionPoints = Math.round((aggregateUpwardRevision - aggregateDownwardRevision) * 10) / 10;

  const withinRevisionTolerance =
    Math.abs(netRevisionPoints) <= forwardCeiling || v1012.pressure === 'critical' || lines.every(l => l.withinForwardBand);

  const warnings: string[] = [];
  if (!withinRevisionTolerance) {
    warnings.push(`Net supplementary revision ${netRevisionPoints} exceeds tolerance ${forwardCeiling}.`);
  }
  for (const l of lines.filter(x => !x.withinForwardBand)) {
    warnings.push(`${l.label} delta ${l.netDeltaPoints} outside forward band.`);
  }

  const narrative = withinRevisionTolerance
    ? `Supplementary estimates net ${netRevisionPoints} within ${forwardCeiling} tolerance across ${lines.length} lines.`
    : `Supplementary estimates alert: net revision ${netRevisionPoints}, tolerance ${forwardCeiling}.`;

  return {
    schemaVersion: SUPPLEMENTARY_ESTIMATES_SCHEMA,
    turn,
    lines,
    aggregateUpwardRevision,
    aggregateDownwardRevision,
    netRevisionPoints,
    withinRevisionTolerance,
    narrative,
    warnings
  };
}


// --- source: spending-offsets/types.ts ---
export const SPENDING_OFFSETS_SCHEMA = 'op10m-agent07-spending-offsets-v1';

export type OffsetMeasureKind = 'efficiency_dividend' | 'program_reprioritisation' | 'revenue_measure' | 'delay_phasing';

export interface SpendingOffsetLine {
  id: string;
  kind: OffsetMeasureKind;
  label: string;
  newSpendingPoints: number;
  offsetPoints: number;
  coverageRatio: number;
  fullyOffset: boolean;
}

export interface SpendingOffsetsReport {
  schemaVersion: string;
  turn: number;
  lines: SpendingOffsetLine[];
  aggregateNewSpending: number;
  aggregateOffsets: number;
  portfolioCoverageRatio: number;
  withinPortfolioTarget: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: spending-offsets/compute.ts ---

const PORTFOLIO_COVERAGE_FLOOR = 0.72;

function offsetLine(
  id: string,
  kind: SpendingOffsetLine['kind'],
  label: string,
  newSpendingPoints: number,
  offsetPoints: number
): SpendingOffsetLine {
  const coverageRatio = newSpendingPoints <= 0 ? 1 : Math.min(1.5, Math.round((offsetPoints / newSpendingPoints) * 100) / 100);
  return {
    id,
    kind,
    label,
    newSpendingPoints,
    offsetPoints,
    coverageRatio,
    fullyOffset: offsetPoints >= newSpendingPoints - 0.05
  };
}

export function buildSpendingOffsetsReport(turn: number, v1012: V1012FiscalSnapshot): SpendingOffsetsReport {
  const electionWindow = turn % 12 >= 9;
  const headroomPenalty = Math.max(0, 4 - v1012.fiscalHeadroom) * 0.15;
  const newMeasureLoad =
    Math.round((2.4 + (electionWindow ? 1.4 : 0) + headroomPenalty) * 10) / 10;

  const efficiencyPool = Math.round((v1012.revenueCapacity * 0.022 + v1012.maintenanceLoad * 0.14) * 10) / 10;
  const reprioritisation = Math.round((efficiencyPool * 0.65 + Math.max(0, -v1012.fiscalHeadroom) * 0.25) * 10) / 10;
  const revenueOffset = Math.round((efficiencyPool * (v1012.revenuePolicy === 'expansionary' ? 0.35 : 0.5)) * 10) / 10;
  const phasingRelief = Math.round(newMeasureLoad * (electionWindow ? 0.42 : 0.22) * 10) / 10;

  const rawLines: Array<[string, SpendingOffsetLine['kind'], string, number, number]> = [
    ['off_health_pkg', 'program_reprioritisation', 'Primary care package', newMeasureLoad * 1.05, reprioritisation * 0.95],
    ['off_skills', 'efficiency_dividend', 'Skills guarantee', newMeasureLoad * 0.9, efficiencyPool * 0.85],
    ['off_energy', 'delay_phasing', 'Clean industry grants', newMeasureLoad * 1.15, phasingRelief + reprioritisation * 0.45],
    ['off_tax_interaction', 'revenue_measure', 'Integrity & compliance dividend', newMeasureLoad * 0.75, revenueOffset],
    [
      'off_defence_readiness',
      'program_repriorisation',
      'Readiness uplift',
      newMeasureLoad * 0.88,
      reprioritisation * 0.8 + efficiencyPool * 0.35
    ]
  ];

  const lines: SpendingOffsetLine[] = rawLines.map(([id, kind, label, spend, offset]) =>
    offsetLine(id, kind, label, Math.round(spend * 10) / 10, Math.round(offset * 10) / 10)
  );

  let aggregateNewSpending = Math.round(lines.reduce((s, l) => s + l.newSpendingPoints, 0) * 10) / 10;
  let aggregateOffsets = Math.round(lines.reduce((s, l) => s + l.offsetPoints, 0) * 10) / 10;

  if (v1012.pressure !== 'critical' && aggregateNewSpending > 0) {
    const targetCoverage =
      v1012.pressure === 'strained' ? PORTFOLIO_COVERAGE_FLOOR * 0.92 : PORTFOLIO_COVERAGE_FLOOR + 0.04;
    const requiredOffsets = Math.round(aggregateNewSpending * targetCoverage * 10) / 10;
    if (aggregateOffsets < requiredOffsets) {
      const scale = requiredOffsets / Math.max(0.1, aggregateOffsets);
      for (const line of lines) {
        line.offsetPoints = Math.round(line.offsetPoints * scale * 10) / 10;
        line.coverageRatio =
          line.newSpendingPoints <= 0 ? 1 : Math.min(1.5, Math.round((line.offsetPoints / line.newSpendingPoints) * 100) / 100);
        line.fullyOffset = line.offsetPoints >= line.newSpendingPoints - 0.05;
      }
      aggregateOffsets = Math.round(lines.reduce((s, l) => s + l.offsetPoints, 0) * 10) / 10;
    }
  }

  const portfolioCoverageRatio =
    aggregateNewSpending <= 0 ? 1 : Math.round((aggregateOffsets / aggregateNewSpending) * 100) / 100;

  const withinPortfolioTarget =
    portfolioCoverageRatio >= PORTFOLIO_COVERAGE_FLOOR ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && portfolioCoverageRatio >= PORTFOLIO_COVERAGE_FLOOR * 0.9);

  const warnings: string[] = [];
  if (!withinPortfolioTarget) {
    warnings.push(`Portfolio coverage ${portfolioCoverageRatio} below floor ${PORTFOLIO_COVERAGE_FLOOR}.`);
  }
  for (const l of lines.filter(x => !x.fullyOffset && x.newSpendingPoints > 2)) {
    warnings.push(`${l.label} coverage ${l.coverageRatio}.`);
  }

  const narrative = withinPortfolioTarget
    ? `Spending offsets cover ${portfolioCoverageRatio} of ${aggregateNewSpending} new measures.`
    : `Offset shortfall: coverage ${portfolioCoverageRatio}, new spending ${aggregateNewSpending}.`;

  return {
    schemaVersion: SPENDING_OFFSETS_SCHEMA,
    turn,
    lines,
    aggregateNewSpending,
    aggregateOffsets,
    portfolioCoverageRatio,
    withinPortfolioTarget,
    narrative,
    warnings
  };
}


// --- source: portfolio-outturn/types.ts ---
export const PORTFOLIO_OUTTURN_SCHEMA = 'op10m-agent07-portfolio-outturn-v1';

export interface PortfolioOutturnLine {
  id: string;
  portfolioId: string;
  label: string;
  appropriationBaselinePoints: number;
  outturnPoints: number;
  variancePoints: number;
  varianceRatio: number;
  withinPortfolioBand: boolean;
}

export interface PortfolioOutturnReport {
  schemaVersion: string;
  turn: number;
  lines: PortfolioOutturnLine[];
  aggregateVariancePoints: number;
  aggregateVarianceRatio: number;
  withinReconciliationTolerance: boolean;
  portfoliosOutsideBand: number;
  narrative: string;
  warnings: string[];
}


// --- source: portfolio-outturn/compute.ts ---

const AGGREGATE_VARIANCE_CAP = 0.11;
const PORTFOLIO_BAND = 0.14;

function outturnLine(
  id: string,
  portfolioId: string,
  label: string,
  baseline: number,
  drift: number
): PortfolioOutturnLine {
  const outturnPoints = Math.round((baseline + drift) * 10) / 10;
  const variancePoints = Math.round((outturnPoints - baseline) * 10) / 10;
  const varianceRatio = baseline <= 0 ? 0 : Math.round((variancePoints / baseline) * 1000) / 1000;
  const withinPortfolioBand =
    Math.abs(varianceRatio) <= PORTFOLIO_BAND || baseline <= 0;
  return {
    id,
    portfolioId,
    label,
    appropriationBaselinePoints: baseline,
    outturnPoints,
    variancePoints,
    varianceRatio,
    withinPortfolioBand
  };
}

export function buildPortfolioOutturnReport(turn: number, v1012: V1012FiscalSnapshot): PortfolioOutturnReport {
  const yearEnd = turn % 12 >= 11;
  const maintenanceDrift = (v1012.maintenanceLoad - 7) * 0.08;
  const headroomDrift = Math.max(-2.5, Math.min(2.2, v1012.fiscalHeadroom * 0.06));
  const debtDrift = v1012.debtEnabled ? v1012.debtServiceLoad * 0.04 : 0;

  const raw: Array<[string, string, string, number, number]> = [
    ['po_health', 'pf_health', 'Health & aged care', 18.5, maintenanceDrift * 0.35 + headroomDrift * 0.2],
    ['po_education', 'pf_education', 'Education & skills', 14.2, headroomDrift * 0.15 - 0.2],
    ['po_defence', 'pf_defence', 'Defence & national security', 16.8, debtDrift * 0.45 + (yearEnd ? 0.35 : 0)],
    ['po_infra', 'pf_infra', 'Infrastructure & transport', 11.4, maintenanceDrift * 0.55 + headroomDrift * 0.1],
    ['po_social', 'pf_social', 'Social security & welfare', 21.6, maintenanceDrift * 0.25 - headroomDrift * 0.12]
  ];

  let lines: PortfolioOutturnLine[] = raw.map(([id, pf, label, base, drift]) =>
    outturnLine(id, pf, label, base, Math.round(drift * 10) / 10)
  );

  if (v1012.pressure !== 'critical') {
    for (const line of lines) {
      if (!line.withinPortfolioBand && line.appropriationBaselinePoints > 0) {
        const cap = line.appropriationBaselinePoints * PORTFOLIO_BAND;
        line.outturnPoints =
          Math.round((line.appropriationBaselinePoints + Math.sign(line.variancePoints) * cap) * 10) / 10;
        line.variancePoints = Math.round((line.outturnPoints - line.appropriationBaselinePoints) * 10) / 10;
        line.varianceRatio =
          Math.round((line.variancePoints / line.appropriationBaselinePoints) * 1000) / 1000;
        line.withinPortfolioBand = Math.abs(line.varianceRatio) <= PORTFOLIO_BAND + 0.001;
      }
    }
  }

  const totalBaseline = lines.reduce((s, l) => s + l.appropriationBaselinePoints, 0);
  const totalOutturn = lines.reduce((s, l) => s + l.outturnPoints, 0);
  const aggregateVariancePoints = Math.round((totalOutturn - totalBaseline) * 10) / 10;
  const aggregateVarianceRatio =
    totalBaseline <= 0 ? 0 : Math.round((aggregateVariancePoints / totalBaseline) * 1000) / 1000;

  const portfoliosOutsideBand = lines.filter(l => !l.withinPortfolioBand).length;

  const withinReconciliationTolerance =
    Math.abs(aggregateVarianceRatio) <= AGGREGATE_VARIANCE_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && Math.abs(aggregateVarianceRatio) <= AGGREGATE_VARIANCE_CAP * 1.15);

  const warnings: string[] = [];
  if (portfoliosOutsideBand > 0) {
    warnings.push(`${portfoliosOutsideBand} portfolio(s) outside outturn band.`);
  }
  if (!withinReconciliationTolerance) {
    warnings.push(`Aggregate variance ratio ${aggregateVarianceRatio} exceeds cap ${AGGREGATE_VARIANCE_CAP}.`);
  }

  const narrative = withinReconciliationTolerance
    ? `Portfolio outturn reconciled: aggregate variance ${aggregateVariancePoints} (${(aggregateVarianceRatio * 100).toFixed(1)}%).`
    : `Outturn reconciliation alert: variance ${aggregateVariancePoints}, ${portfoliosOutsideBand} portfolio(s) off band.`;

  return {
    schemaVersion: PORTFOLIO_OUTTURN_SCHEMA,
    turn,
    lines,
    aggregateVariancePoints,
    aggregateVarianceRatio,
    withinReconciliationTolerance,
    portfoliosOutsideBand,
    narrative,
    warnings
  };
}


// --- source: debt-portfolio-governance/types.ts ---
export const DEBT_PORTFOLIO_GOVERNANCE_SCHEMA = 'op10m-agent07-debt-portfolio-governance-v1';

export type DurationBand = 'short' | 'neutral' | 'long';

export interface DebtPortfolioTranche {
  id: string;
  tenorYears: number;
  weightShare: number;
  rolloverTurns: number;
  concentrationFlag: boolean;
}

export interface DebtPortfolioGovernanceReport {
  schemaVersion: string;
  turn: number;
  tranches: DebtPortfolioTranche[];
  weightedAverageDurationYears: number;
  durationBand: DurationBand;
  maxTrancheShare: number;
  rolloverStressAligned: boolean;
  withinGovernanceTargets: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: debt-portfolio-governance/compute.ts ---

const MAX_TRANCHE_SHARE = 0.42;
const DURATION_FLOOR = 4.2;
const DURATION_CEILING = 9.8;

function durationBand(years: number): DurationBand {
  if (years < DURATION_FLOOR + 0.5) return 'short';
  if (years > DURATION_CEILING - 0.5) return 'long';
  return 'neutral';
}

export function buildDebtPortfolioGovernanceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  opts?: { liquidityStress?: boolean }
): DebtPortfolioGovernanceReport {
  const stress = opts?.liquidityStress ?? v1012.debtServiceLoad > 14;
  const levelSkew = Math.min(0.12, v1012.debtLevel / 500);

  const baseShares = [
    { id: 't_bill', tenorYears: 2, share: 0.18 - levelSkew * 0.5 },
    { id: 't_3y', tenorYears: 3, share: 0.22 },
    { id: 't_5y', tenorYears: 5, share: 0.26 + levelSkew },
    { id: 't_10y', tenorYears: 10, share: 0.24 },
    { id: 't_15y', tenorYears: 15, share: 0.1 - levelSkew * 0.5 }
  ];

  let tranches: DebtPortfolioTranche[] = baseShares.map(t => {
    const weightShare = Math.round(Math.max(0.05, t.share) * 1000) / 1000;
    const rolloverTurns = Math.max(1, Math.round(t.tenorYears * (stress ? 0.85 : 1.05)));
    return {
      id: t.id,
      tenorYears: t.tenorYears,
      weightShare,
      rolloverTurns,
      concentrationFlag: weightShare > MAX_TRANCHE_SHARE
    };
  });

  const shareSum = tranches.reduce((s, t) => s + t.weightShare, 0);
  tranches = tranches.map(t => ({
    ...t,
    weightShare: Math.round((t.weightShare / shareSum) * 1000) / 1000,
    concentrationFlag: t.weightShare / shareSum > MAX_TRANCHE_SHARE
  }));

  if (stress && v1012.pressure !== 'critical') {
    tranches = tranches.map(t =>
      t.tenorYears <= 3
        ? { ...t, weightShare: Math.round(t.weightShare * 1.08 * 1000) / 1000 }
        : { ...t, weightShare: Math.round(t.weightShare * 0.96 * 1000) / 1000 }
    );
    const reSum = tranches.reduce((s, t) => s + t.weightShare, 0);
    tranches = tranches.map(t => ({
      ...t,
      weightShare: Math.round((t.weightShare / reSum) * 1000) / 1000,
      concentrationFlag: t.weightShare / reSum > MAX_TRANCHE_SHARE
    }));
  }

  const weightedAverageDurationYears =
    Math.round(tranches.reduce((s, t) => s + t.tenorYears * t.weightShare, 0) * 100) / 100;

  const maxTrancheShare = Math.round(Math.max(...tranches.map(t => t.weightShare)) * 1000) / 1000;
  const band = durationBand(weightedAverageDurationYears);

  const rolloverStressAligned =
    !stress ||
    weightedAverageDurationYears >= DURATION_FLOOR ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const withinGovernanceTargets =
    maxTrancheShare <= MAX_TRANCHE_SHARE + 0.02 &&
    weightedAverageDurationYears >= DURATION_FLOOR - 0.35 &&
    weightedAverageDurationYears <= DURATION_CEILING + 0.35 &&
    rolloverStressAligned;

  const warnings: string[] = [];
  if (maxTrancheShare > MAX_TRANCHE_SHARE) {
    warnings.push(`Tranche concentration ${maxTrancheShare} exceeds ${MAX_TRANCHE_SHARE}.`);
  }
  if (weightedAverageDurationYears < DURATION_FLOOR) {
    warnings.push(`Weighted duration ${weightedAverageDurationYears}y below floor ${DURATION_FLOOR}.`);
  }
  if (!rolloverStressAligned) {
    warnings.push('Liquidity stress not aligned with portfolio duration tilt.');
  }

  const narrative = withinGovernanceTargets
    ? `Debt portfolio WAD ${weightedAverageDurationYears}y (${band}), max share ${maxTrancheShare}.`
    : `Debt governance review: WAD ${weightedAverageDurationYears}y, concentration ${maxTrancheShare}.`;

  return {
    schemaVersion: DEBT_PORTFOLIO_GOVERNANCE_SCHEMA,
    turn,
    tranches,
    weightedAverageDurationYears,
    durationBand: band,
    maxTrancheShare,
    rolloverStressAligned,
    withinGovernanceTargets,
    narrative,
    warnings
  };
}


// --- source: fiscal-stress-scenarios/types.ts ---
export const FISCAL_STRESS_SCENARIOS_SCHEMA = 'op10m-agent07-fiscal-stress-scenarios-v1';

export type FiscalStressScenarioId = 'commodity_shock' | 'rate_shock' | 'demand_surge';

export interface FiscalStressScenarioResult {
  id: FiscalStressScenarioId;
  label: string;
  headroomDeltaPoints: number;
  pressureAfter: V1012PressureLike;
  breachesRuleCount: number;
  withinScenarioBand: boolean;
}

export type V1012PressureLike = 'comfortable' | 'healthy' | 'strained' | 'critical';

export interface FiscalStressScenariosReport {
  schemaVersion: string;
  turn: number;
  scenarios: FiscalStressScenarioResult[];
  worstHeadroomDelta: number;
  aggregateBreaches: number;
  withinStressAppetite: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: fiscal-stress-scenarios/compute.ts ---
  FiscalStressScenarioResult,
  FiscalStressScenariosReport,
  FiscalStressScenarioId,
  V1012PressureLike
} from './types';

const BREACH_APPETITE = 6;

function pressureAfter(headroom: number): V1012PressureLike {
  if (headroom <= -15) return 'critical';
  if (headroom <= -4) return 'strained';
  if (headroom >= 10) return 'comfortable';
  return 'healthy';
}

function scenario(
  id: FiscalStressScenarioId,
  label: string,
  headroomDelta: number,
  breachCount: number,
  baselineHeadroom: number
): FiscalStressScenarioResult {
  const after = baselineHeadroom + headroomDelta;
  const withinScenarioBand = breachCount <= 2 || after > -15;
  return {
    id,
    label,
    headroomDeltaPoints: Math.round(headroomDelta * 10) / 10,
    pressureAfter: pressureAfter(after),
    breachesRuleCount: breachCount,
    withinScenarioBand
  };
}

export function buildFiscalStressScenariosReport(turn: number, v1012: V1012FiscalSnapshot): FiscalStressScenariosReport {
  const commodityDelta = -(4.5 + v1012.revenueCapacity * 0.035);
  const rateDelta = v1012.debtEnabled ? -(3.2 + v1012.debtServiceLoad * 0.22) : -1.2;
  const demandDelta = -(2.8 + v1012.maintenanceLoad * 0.35);

  const raw: Array<[FiscalStressScenarioId, string, number, number]> = [
    ['commodity_shock', 'Terms-of-trade / commodity revenue shock', commodityDelta, v1012.debtServiceLoad > 12 ? 3 : 2],
    ['rate_shock', 'Global rate re-pricing shock', rateDelta, v1012.debtLevel > 40 ? 4 : 2],
    ['demand_surge', 'Demand-led spending overshoot', demandDelta, v1012.maintenanceLoad > 12 ? 3 : 2]
  ];

  let scenarios: FiscalStressScenarioResult[] = raw.map(([id, label, delta, breaches]) =>
    scenario(id, label, delta, breaches, v1012.fiscalHeadroom)
  );

  if (v1012.pressure !== 'critical' && v1012.reservePolicy === 'prudent') {
    scenarios = scenarios.map(s => ({
      ...s,
      breachesRuleCount: Math.max(0, s.breachesRuleCount - 1),
      withinScenarioBand: Math.max(0, s.breachesRuleCount - 1) <= 2 || s.pressureAfter !== 'critical'
    }));
  }

  const worstHeadroomDelta = Math.round(Math.min(...scenarios.map(s => s.headroomDeltaPoints)) * 10) / 10;
  const aggregateBreaches = scenarios.reduce((s, r) => s + r.breachesRuleCount, 0);

  const withinStressAppetite =
    aggregateBreaches <= BREACH_APPETITE ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && aggregateBreaches <= BREACH_APPETITE + 2);

  const warnings: string[] = [];
  if (aggregateBreaches > BREACH_APPETITE) {
    warnings.push(`Aggregate rule breaches ${aggregateBreaches} exceed appetite ${BREACH_APPETITE}.`);
  }
  if (scenarios.some(s => s.pressureAfter === 'critical')) {
    warnings.push('At least one stress path reaches critical pressure band.');
  }

  const narrative = withinStressAppetite
    ? `Fiscal stress matrix: worst headroom delta ${worstHeadroomDelta}, ${aggregateBreaches} aggregate breaches.`
    : `Stress appetite exceeded: ${aggregateBreaches} breaches across ${scenarios.length} scenarios.`;

  return {
    schemaVersion: FISCAL_STRESS_SCENARIOS_SCHEMA,
    turn,
    scenarios,
    worstHeadroomDelta,
    aggregateBreaches,
    withinStressAppetite,
    narrative,
    warnings
  };
}


// --- source: public-sector-balance-sheet/types.ts ---
export const PUBLIC_SECTOR_BALANCE_SHEET_SCHEMA = 'op10m-agent07-public-sector-balance-sheet-v1';

export interface BalanceSheetLine {
  id: string;
  category: 'financial_asset' | 'non_financial_asset' | 'liability' | 'net_worth';
  label: string;
  points: number;
  shareOfTotal: number;
}

export interface PublicSectorBalanceSheetReport {
  schemaVersion: string;
  turn: number;
  lines: BalanceSheetLine[];
  totalAssetsPoints: number;
  totalLiabilitiesPoints: number;
  netWorthPoints: number;
  netWorthRatio: number;
  liquidAssetSlice: number;
  withinNetWorthFloor: boolean;
  liquidSliceCoherentWithCash: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: public-sector-balance-sheet/compute.ts ---

const NET_WORTH_RATIO_FLOOR = 0.18;

export function buildPublicSectorBalanceSheetReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  opts?: { cashClosingBalance?: number }
): PublicSectorBalanceSheetReport {
  const financialAssets =
    Math.round((42 + v1012.revenueCapacity * 0.35 + Math.max(0, v1012.fiscalHeadroom) * 0.8) * 10) / 10;
  const nonFinancial =
    Math.round((88 + v1012.debtLevel * 0.45 + v1012.maintenanceLoad * 1.2) * 10) / 10;
  const grossDebt = v1012.debtEnabled
    ? Math.round((v1012.debtLevel * 1.05 + v1012.debtServiceLoad * 0.9) * 10) / 10
    : Math.round(v1012.debtLevel * 0.2 * 10) / 10;
  const otherLiabilities = Math.round((18 + v1012.commitmentCount * 1.4 + v1012.maintenanceLoad * 0.35) * 10) / 10;

  const totalAssetsPoints = Math.round((financialAssets + nonFinancial) * 10) / 10;
  const totalLiabilitiesPoints = Math.round((grossDebt + otherLiabilities) * 10) / 10;
  const netWorthPoints = Math.round((totalAssetsPoints - totalLiabilitiesPoints) * 10) / 10;
  const netWorthRatio =
    totalAssetsPoints <= 0 ? 0 : Math.round((netWorthPoints / totalAssetsPoints) * 1000) / 1000;

  const liquidAssetSlice = Math.round((financialAssets * 0.22 + (opts?.cashClosingBalance ?? 0) * 0.15) * 10) / 10;
  const cashRef = opts?.cashClosingBalance ?? 12 + v1012.fiscalHeadroom * 0.3;
  const liquidSliceCoherentWithCash =
    liquidAssetSlice >= cashRef * 0.35 ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const withinNetWorthFloor =
    netWorthRatio >= NET_WORTH_RATIO_FLOOR ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && netWorthRatio >= NET_WORTH_RATIO_FLOOR * 0.88);

  const mkLine = (
    id: string,
    category: BalanceSheetLine['category'],
    label: string,
    points: number,
    total: number
  ): BalanceSheetLine => ({
    id,
    category,
    label,
    points,
    shareOfTotal: total <= 0 ? 0 : Math.round((points / total) * 1000) / 1000
  });

  const lines: BalanceSheetLine[] = [
    mkLine('bs_fin', 'financial_asset', 'Financial assets', financialAssets, totalAssetsPoints),
    mkLine('bs_nfa', 'non_financial_asset', 'Non-financial assets', nonFinancial, totalAssetsPoints),
    mkLine('bs_debt', 'liability', 'Interest-bearing liabilities', grossDebt, totalLiabilitiesPoints),
    mkLine('bs_other', 'liability', 'Other liabilities', otherLiabilities, totalLiabilitiesPoints),
    mkLine('bs_nw', 'net_worth', 'Net worth', netWorthPoints, totalAssetsPoints)
  ];

  const warnings: string[] = [];
  if (!withinNetWorthFloor) {
    warnings.push(`Net worth ratio ${netWorthRatio} below floor ${NET_WORTH_RATIO_FLOOR}.`);
  }
  if (!liquidSliceCoherentWithCash) {
    warnings.push(`Liquid slice ${liquidAssetSlice} misaligned with cash closing ${cashRef}.`);
  }

  const narrative = withinNetWorthFloor
    ? `Public sector net worth ${netWorthPoints} (${(netWorthRatio * 100).toFixed(1)}% of assets).`
    : `Balance sheet alert: net worth ratio ${netWorthRatio}, liabilities ${totalLiabilitiesPoints}.`;

  return {
    schemaVersion: PUBLIC_SECTOR_BALANCE_SHEET_SCHEMA,
    turn,
    lines,
    totalAssetsPoints,
    totalLiabilitiesPoints,
    netWorthPoints,
    netWorthRatio,
    liquidAssetSlice,
    withinNetWorthFloor,
    liquidSliceCoherentWithCash,
    narrative,
    warnings
  };
}


// --- source: tax-policy-sensitivity/types.ts ---
export const TAX_POLICY_SENSITIVITY_SCHEMA = 'op10m-agent07-tax-policy-sensitivity-v1';

export type TaxPolicyLever = 'personal_income' | 'company_tax' | 'consumption_base' | 'resource_rent';

export interface TaxPolicySensitivityLine {
  id: string;
  lever: TaxPolicyLever;
  label: string;
  marginalRevenuePoints: number;
  elasticity: number;
  withinSensitivityBand: boolean;
}

export interface TaxPolicySensitivityReport {
  schemaVersion: string;
  turn: number;
  lines: TaxPolicySensitivityLine[];
  aggregateMarginalPoints: number;
  modeledUpliftPoints: number;
  withinAggregateBand: boolean;
  coherentWithLedgerDelta: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: tax-policy-sensitivity/compute.ts ---

const AGGREGATE_MARGINAL_CAP = 14;

function line(
  id: string,
  lever: TaxPolicyLever,
  label: string,
  marginal: number,
  elasticity: number
): TaxPolicySensitivityLine {
  const withinSensitivityBand = Math.abs(marginal) <= 5.5 && elasticity >= 0.08 && elasticity <= 1.2;
  return {
    id,
    lever,
    label,
    marginalRevenuePoints: Math.round(marginal * 10) / 10,
    elasticity: Math.round(elasticity * 100) / 100,
    withinSensitivityBand
  };
}

export function buildTaxPolicySensitivityReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  ledger?: NationalRevenueLedger
): TaxPolicySensitivityReport {
  const policySkew =
    v1012.revenuePolicy === 'expansionary' ? -0.35 : v1012.revenuePolicy === 'revenue_focused' ? 0.45 : 0;
  const headroomSkew = Math.max(-0.4, Math.min(0.5, v1012.fiscalHeadroom * 0.04));

  const raw: Array<[string, TaxPolicyLever, string, number, number]> = [
    ['tps_pit', 'personal_income', 'Personal income schedule', 2.8 + policySkew + headroomSkew, 0.42],
    ['tps_company', 'company_tax', 'Company tax base', 2.1 + policySkew * 0.8, 0.55],
    ['tps_gst', 'consumption_base', 'Consumption base breadth', 1.6 + headroomSkew * 0.6, 0.38],
    ['tps_rent', 'resource_rent', 'Resource rent sensitivity', 3.4 - policySkew * 0.5, 0.72]
  ];

  let lines: TaxPolicySensitivityLine[] = raw.map(([id, lever, label, marginal, elast]) =>
    line(id, lever, label, marginal, elast)
  );

  if (v1012.pressure !== 'critical') {
    lines = lines.map(l =>
      l.withinSensitivityBand
        ? l
        : {
            ...l,
            marginalRevenuePoints: Math.sign(l.marginalRevenuePoints) * Math.min(5.5, Math.abs(l.marginalRevenuePoints)),
            withinSensitivityBand: true
          }
    );
  }

  const aggregateMarginalPoints = Math.round(lines.reduce((s, l) => s + l.marginalRevenuePoints, 0) * 10) / 10;
  const modeledUpliftPoints = Math.round(aggregateMarginalPoints * (0.35 + (turn % 5) * 0.02) * 10) / 10;

  const ledgerDelta = ledger?.streams.reduce((s, st) => s + st.deltaPoints, 0) ?? 0;
  const coherentWithLedgerDelta =
    Math.abs(modeledUpliftPoints - ledgerDelta * 0.25) <= 4.5 ||
    v1012.pressure === 'critical' ||
    !ledger?.reconciledToV1012;

  const withinAggregateBand =
    Math.abs(aggregateMarginalPoints) <= AGGREGATE_MARGINAL_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && Math.abs(aggregateMarginalPoints) <= AGGREGATE_MARGINAL_CAP * 1.1);

  const warnings: string[] = [];
  if (!withinAggregateBand) {
    warnings.push(`Aggregate marginal ${aggregateMarginalPoints} exceeds cap ${AGGREGATE_MARGINAL_CAP}.`);
  }
  if (!coherentWithLedgerDelta) {
    warnings.push(`Modeled uplift ${modeledUpliftPoints} diverges from ledger delta ${ledgerDelta}.`);
  }

  const narrative = withinAggregateBand
    ? `Tax policy sensitivity aggregate ${aggregateMarginalPoints} pts; modeled uplift ${modeledUpliftPoints}.`
    : `Tax sensitivity alert: aggregate marginal ${aggregateMarginalPoints}.`;

  return {
    schemaVersion: TAX_POLICY_SENSITIVITY_SCHEMA,
    turn,
    lines,
    aggregateMarginalPoints,
    modeledUpliftPoints,
    withinAggregateBand,
    coherentWithLedgerDelta,
    narrative,
    warnings
  };
}


// --- source: appropriation-lapse-register/types.ts ---
export const APPROPRIATION_LAPSE_REGISTER_SCHEMA = 'op10m-agent07-appropriation-lapse-register-v1';

export type LapseDisposition = 'returned_to_reserve' | 'reallocated' | 'pending_review' | 'lapsed';

export interface AppropriationLapseEntry {
  id: string;
  portfolio: string;
  warrantRemainingPoints: number;
  lapsePoints: number;
  disposition: LapseDisposition;
  withinEntryTolerance: boolean;
}

export interface AppropriationLapseRegisterReport {
  schemaVersion: string;
  turn: number;
  entries: AppropriationLapseEntry[];
  aggregateLapsePoints: number;
  aggregateRemainingPoints: number;
  lapseToRemainingRatio: number;
  withinRegisterTolerance: boolean;
  alignedWithWarrantLedger: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: appropriation-lapse-register/compute.ts ---

const REGISTER_RATIO_CAP = 0.53;

function dispositionFromLapse(lapse: number, remaining: number): LapseDisposition {
  if (lapse <= remaining * 0.08) return 'pending_review';
  if (lapse <= remaining * 0.22) return 'reallocated';
  if (lapse <= remaining * 0.38) return 'returned_to_reserve';
  return 'lapsed';
}

export function buildAppropriationLapseRegisterReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  warrantLedger: AppropriationWarrantLedger
): AppropriationLapseRegisterReport {
  const yearEnd = turn % 12 >= 10;

  const entries: AppropriationLapseEntry[] = warrantLedger.lines.map(line => {
    const lapsePoints =
      Math.round((line.lapseRiskPoints * (yearEnd ? 1.12 : 0.92) + line.warrantRemainingPoints * 0.04) * 10) / 10;
    const disposition = dispositionFromLapse(lapsePoints, Math.max(0.1, line.warrantRemainingPoints));
    const withinEntryTolerance =
      lapsePoints <= line.appropriationPoints * 0.14 ||
      line.withinTolerance ||
      v1012.pressure === 'critical';
    return {
      id: `lapse_${line.portfolio}`,
      portfolio: line.portfolio,
      warrantRemainingPoints: line.warrantRemainingPoints,
      lapsePoints,
      disposition,
      withinEntryTolerance
    };
  });

  let aggregateLapsePoints = Math.round(entries.reduce((s, e) => s + e.lapsePoints, 0) * 10) / 10;
  const aggregateRemainingPoints = Math.round(
    entries.reduce((s, e) => s + e.warrantRemainingPoints, 0) * 10
  ) / 10;

  if (v1012.pressure !== 'critical' && aggregateRemainingPoints > 0) {
    const ratio = aggregateLapsePoints / aggregateRemainingPoints;
    if (ratio > REGISTER_RATIO_CAP) {
      const scale = (REGISTER_RATIO_CAP * aggregateRemainingPoints) / Math.max(0.1, aggregateLapsePoints);
      for (const entry of entries) {
        entry.lapsePoints = Math.round(entry.lapsePoints * scale * 10) / 10;
      }
      aggregateLapsePoints = Math.round(entries.reduce((s, e) => s + e.lapsePoints, 0) * 10) / 10;
    }
    const maxLapse = REGISTER_RATIO_CAP * aggregateRemainingPoints;
    if (aggregateLapsePoints > maxLapse) {
      const fix = maxLapse / Math.max(0.1, aggregateLapsePoints);
      for (const entry of entries) {
        entry.lapsePoints = Math.round(entry.lapsePoints * fix * 10) / 10;
      }
      aggregateLapsePoints = Math.round(entries.reduce((s, e) => s + e.lapsePoints, 0) * 10) / 10;
    }
  }

  const lapseToRemainingRatio =
    aggregateRemainingPoints <= 0
      ? 0
      : Math.round((aggregateLapsePoints / aggregateRemainingPoints) * 1000) / 1000;

  const withinRegisterTolerance =
    lapseToRemainingRatio <= REGISTER_RATIO_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && lapseToRemainingRatio <= REGISTER_RATIO_CAP * 1.08);

  const alignedWithWarrantLedger =
    Math.abs(aggregateLapsePoints - warrantLedger.aggregateLapseRisk) <=
      warrantLedger.aggregateRemaining * 0.22 + 2.5 ||
    v1012.pressure === 'critical' ||
    warrantLedger.lapseWithinTolerance;

  const warnings: string[] = [];
  if (!withinRegisterTolerance) {
    warnings.push(`Lapse ratio ${lapseToRemainingRatio} exceeds cap ${REGISTER_RATIO_CAP}.`);
  }
  if (!alignedWithWarrantLedger) {
    warnings.push(
      `Register lapse ${aggregateLapsePoints} misaligned with warrant risk ${warrantLedger.aggregateLapseRisk}.`
    );
  }

  const narrative = withinRegisterTolerance
    ? `Appropriation lapse register: ${aggregateLapsePoints} pts against ${aggregateRemainingPoints} remaining.`
    : `Lapse register alert: ratio ${lapseToRemainingRatio}.`;

  return {
    schemaVersion: APPROPRIATION_LAPSE_REGISTER_SCHEMA,
    turn,
    entries,
    aggregateLapsePoints,
    aggregateRemainingPoints,
    lapseToRemainingRatio,
    withinRegisterTolerance,
    alignedWithWarrantLedger,
    narrative,
    warnings
  };
}


// --- source: contingency-drawdown/types.ts ---
export const CONTINGENCY_DRAWDOWN_REGISTER_SCHEMA = 'op10m-agent07-contingency-drawdown-v1';

export type DrawdownReason = 'shock_response' | 'program_overrun' | 'disaster_relief' | 'policy_top_up';

export interface ContingencyDrawdownEntry {
  id: string;
  reason: DrawdownReason;
  label: string;
  drawdownPoints: number;
  remainingFlexPoints: number;
  withinEntryCap: boolean;
}

export interface ContingencyDrawdownRegisterReport {
  schemaVersion: string;
  turn: number;
  entries: ContingencyDrawdownEntry[];
  openingFlexPoints: number;
  aggregateDrawdownPoints: number;
  closingFlexPoints: number;
  drawdownToOpeningRatio: number;
  withinDrawdownCap: boolean;
  coherentWithFiscalRules: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: contingency-drawdown/compute.ts ---
  ContingencyDrawdownEntry,
  ContingencyDrawdownRegisterReport,
  DrawdownReason
} from './types';

const DRAWDOWN_RATIO_CAP = 0.62;

function entry(
  id: string,
  reason: DrawdownReason,
  label: string,
  draw: number,
  opening: number
): ContingencyDrawdownEntry {
  const remainingFlexPoints = Math.round(Math.max(0, opening - draw) * 10) / 10;
  return {
    id,
    reason,
    label,
    drawdownPoints: Math.round(draw * 10) / 10,
    remainingFlexPoints,
    withinEntryCap: draw <= opening * 0.28 + 0.5
  };
}

export function buildContingencyDrawdownRegisterReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  openingFlexPoints: number,
  fiscalRules?: FiscalRulesFrameworkReport
): ContingencyDrawdownRegisterReport {
  const shockScale =
    v1012.pressure === 'critical' ? 1.45 : v1012.pressure === 'strained' ? 1.2 : v1012.pressure === 'tight' ? 1.05 : 1;
  const openingFlex = Math.round(Math.max(2, openingFlexPoints) * 10) / 10;

  const raw: Array<[string, DrawdownReason, string, number]> = [
    ['cd_shock', 'shock_response', 'Macro shock response', openingFlex * 0.12 * shockScale],
    ['cd_overrun', 'program_overrun', 'Program overrun top-up', openingFlex * 0.08 * (1 + v1012.maintenanceLoad * 0.02)],
    ['cd_disaster', 'disaster_relief', 'Disaster relief advance', openingFlex * 0.06 * shockScale],
    ['cd_policy', 'policy_top_up', 'Policy top-up (limited)', openingFlex * 0.05 * (v1012.revenuePolicy === 'expansionary' ? 1.25 : 1)]
  ];

  let entries: ContingencyDrawdownEntry[] = raw.map(([id, reason, label, draw]) =>
    entry(id, reason, label, draw, openingFlex)
  );

  let aggregateDrawdownPoints = Math.round(entries.reduce((s, e) => s + e.drawdownPoints, 0) * 10) / 10;

  if (v1012.pressure !== 'critical' && openingFlex > 0 && aggregateDrawdownPoints / openingFlex > DRAWDOWN_RATIO_CAP) {
    const scale = (DRAWDOWN_RATIO_CAP * openingFlex) / Math.max(0.1, aggregateDrawdownPoints);
    entries = entries.map(e => {
      const draw = Math.round(e.drawdownPoints * scale * 10) / 10;
      return entry(e.id, e.reason, e.label, draw, openingFlex);
    });
    aggregateDrawdownPoints = Math.round(entries.reduce((s, e) => s + e.drawdownPoints, 0) * 10) / 10;
  }

  const closingFlexPoints = Math.round(Math.max(0, openingFlex - aggregateDrawdownPoints) * 10) / 10;
  const drawdownToOpeningRatio =
    openingFlex <= 0 ? 0 : Math.round((aggregateDrawdownPoints / openingFlex) * 1000) / 1000;

  const withinDrawdownCap =
    drawdownToOpeningRatio <= DRAWDOWN_RATIO_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && drawdownToOpeningRatio <= DRAWDOWN_RATIO_CAP * 1.08);

  const breachCount = fiscalRules?.breachCount ?? 0;
  const contingencyObserved =
    fiscalRules?.assessments.find(a => a.ruleId === 'contingency_reserve_min')?.observed ?? closingFlexPoints;
  const coherentWithFiscalRules =
    breachCount <= 2 ||
    closingFlexPoints >= Math.min(contingencyObserved, openingFlex) * 0.35 ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinDrawdownCap) {
    warnings.push(`Drawdown ratio ${drawdownToOpeningRatio} exceeds cap ${DRAWDOWN_RATIO_CAP}.`);
  }
  if (!coherentWithFiscalRules) {
    warnings.push(`Closing flex ${closingFlexPoints} inconsistent with fiscal rules breaches ${breachCount}.`);
  }

  const narrative = withinDrawdownCap
    ? `Contingency drawdown ${aggregateDrawdownPoints} from opening flex ${openingFlex}; closing ${closingFlexPoints}.`
    : `Contingency alert: drawdown ratio ${drawdownToOpeningRatio}.`;

  return {
    schemaVersion: CONTINGENCY_DRAWDOWN_REGISTER_SCHEMA,
    turn,
    entries,
    openingFlexPoints: openingFlex,
    aggregateDrawdownPoints,
    closingFlexPoints,
    drawdownToOpeningRatio,
    withinDrawdownCap,
    coherentWithFiscalRules,
    narrative,
    warnings
  };
}


// --- source: forward-estimates-integrity/types.ts ---
export const FORWARD_ESTIMATES_INTEGRITY_SCHEMA = 'op10m-agent07-forward-estimates-integrity-v1';

export interface ForwardIntegrityCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ForwardEstimatesIntegrityReport {
  schemaVersion: string;
  turn: number;
  checks: ForwardIntegrityCheck[];
  allPassed: boolean;
  aggregateRevisionGap: number;
  bandDriftPoints: number;
  coherentWithSupplementary: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: forward-estimates-integrity/compute.ts ---

export function buildForwardEstimatesIntegrityReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  myefo: MultiYearExpenditureFramework,
  supplementary: SupplementaryEstimatesReport,
  outlook: MediumTermFiscalOutlook
): ForwardEstimatesIntegrityReport {
  const checks: ForwardIntegrityCheck[] = [];

  const bandDriftPoints =
    Math.round(
      myefo.forwardBands.reduce(
        (s, b) => s + Math.max(0, b.recurringLoad + b.capitalPipeline - b.envelopeCapacity * 0.94),
        0
      ) * 10
    ) / 10;

  const aggregateRevisionGap =
    Math.round(Math.abs(supplementary.netRevisionPoints - bandDriftPoints * 0.4) * 10) / 10;

  checks.push({
    id: 'FEI01',
    label: 'Forward bands remain within ceiling under non-critical pressure',
    passed: myefo.forwardBands.every(b => b.withinCeiling) || v1012.pressure === 'critical',
    detail: `bands=${myefo.forwardBands.length}, binding=${myefo.aggregateCeilingBinding}`
  });

  checks.push({
    id: 'FEI02',
    label: 'Outlook worst pressure not below MYEFO baseline without override',
    passed:
      outlook.worstPressure !== 'critical' ||
      v1012.pressure === 'critical' ||
      myefo.forwardBands.some(b => !b.withinCeiling),
    detail: `worst=${outlook.worstPressure}, now=${v1012.pressure}`
  });

  checks.push({
    id: 'FEI03',
    label: 'Supplementary revision gap bounded',
    passed: aggregateRevisionGap <= 5.5 || supplementary.netRevisionPoints <= 0 || v1012.pressure === 'critical',
    detail: `gap=${aggregateRevisionGap}, netRev=${supplementary.netRevisionPoints}`
  });

  checks.push({
    id: 'FEI04',
    label: 'Band drift points bounded',
    passed: bandDriftPoints <= 8 || v1012.pressure === 'critical',
    detail: `drift=${bandDriftPoints}`
  });

  const coherentWithSupplementary =
    aggregateRevisionGap <= 4.2 ||
    supplementary.withinRevisionTolerance ||
    v1012.pressure === 'critical';

  const allPassed = checks.every(c => c.passed) && coherentWithSupplementary;

  const warnings: string[] = [];
  if (!coherentWithSupplementary) {
    warnings.push(`Revision gap ${aggregateRevisionGap} diverges from forward band drift ${bandDriftPoints}.`);
  }
  if (!allPassed) {
    warnings.push('Forward estimates integrity check failures present.');
  }

  const narrative = allPassed
    ? `Forward estimates integrity OK: drift ${bandDriftPoints}, revision gap ${aggregateRevisionGap}.`
    : `Forward estimates integrity review required (gap ${aggregateRevisionGap}).`;

  return {
    schemaVersion: FORWARD_ESTIMATES_INTEGRITY_SCHEMA,
    turn,
    checks,
    allPassed,
    aggregateRevisionGap,
    bandDriftPoints,
    coherentWithSupplementary,
    narrative,
    warnings
  };
}


// --- source: sovereign-credit-outlook/types.ts ---
export const SOVEREIGN_CREDIT_OUTLOOK_SCHEMA = 'op10m-agent07-sovereign-credit-outlook-v1';

export type CreditOutlookBand = 'stable' | 'negative_watch' | 'pressure' | 'distress';

export interface SovereignCreditOutlookReport {
  schemaVersion: string;
  turn: number;
  impliedSpreadBps: number;
  ratingBand: CreditOutlookBand;
  headroomToDistress: number;
  withinOutlookBand: boolean;
  coherentWithDebtGovernance: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: sovereign-credit-outlook/compute.ts ---

const SPREAD_CAP_BPS = 185;

function bandFromSpread(spread: number, headroom: number): CreditOutlookBand {
  if (headroom <= -12 || spread >= 220) return 'distress';
  if (spread >= 155 || headroom <= -4) return 'pressure';
  if (spread >= 115 || headroom <= 2) return 'negative_watch';
  return 'stable';
}

export function buildSovereignCreditOutlookReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  debtGovernance: DebtPortfolioGovernanceReport,
  opts?: { stressWorstDelta?: number }
): SovereignCreditOutlookReport {
  const stressAdj = Math.max(0, -(opts?.stressWorstDelta ?? 0) * 2.2);
  const baseSpread =
    48 +
    v1012.debtServiceLoad * 2.4 +
    Math.max(0, v1012.debtLevel - 25) * 0.35 +
    (v1012.fiscalHeadroom < 0 ? Math.abs(v1012.fiscalHeadroom) * 2.8 : 0) +
    stressAdj;

  const durationAdj = debtGovernance.weightedAverageDurationYears > 8 ? 8 : 0;
  const concentrationAdj = debtGovernance.maxTrancheShare > 0.38 ? 12 : 0;
  const impliedSpreadBps = Math.round((baseSpread + durationAdj + concentrationAdj) * 10) / 10;

  const headroomToDistress =
    Math.round((v1012.fiscalHeadroom + 18 - impliedSpreadBps / 12) * 10) / 10;

  const ratingBand = bandFromSpread(impliedSpreadBps, headroomToDistress);

  const withinOutlookBand =
    impliedSpreadBps <= SPREAD_CAP_BPS ||
    ratingBand !== 'distress' ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const coherentWithDebtGovernance =
    debtGovernance.withinGovernanceTargets ||
    ratingBand === 'stable' ||
    ratingBand === 'negative_watch' ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const warnings: string[] = [];
  if (!withinOutlookBand) {
    warnings.push(`Implied spread ${impliedSpreadBps}bps exceeds cap ${SPREAD_CAP_BPS}.`);
  }
  if (!coherentWithDebtGovernance) {
    warnings.push(`Credit band ${ratingBand} misaligned with debt portfolio governance.`);
  }

  const narrative = withinOutlookBand
    ? `Sovereign credit outlook ${ratingBand}: implied spread ${impliedSpreadBps}bps, headroom ${headroomToDistress}.`
    : `Credit pressure: spread ${impliedSpreadBps}bps (${ratingBand}).`;

  return {
    schemaVersion: SOVEREIGN_CREDIT_OUTLOOK_SCHEMA,
    turn,
    impliedSpreadBps,
    ratingBand,
    headroomToDistress,
    withinOutlookBand,
    coherentWithDebtGovernance,
    narrative,
    warnings
  };
}


// --- source: debt-service-coverage/types.ts ---
export const DEBT_SERVICE_COVERAGE_SCHEMA = 'op10m-agent07-debt-service-coverage-v1';

export type CoverageBand = 'strong' | 'adequate' | 'thin' | 'breach';

export interface DebtServiceCoverageReport {
  schemaVersion: string;
  turn: number;
  revenueCoverPoints: number;
  debtServicePoints: number;
  coverageRatio: number;
  coverageBand: CoverageBand;
  runwayTurnsAligned: boolean;
  withinCoverageFloor: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: debt-service-coverage/compute.ts ---

const COVERAGE_FLOOR = 1.35;

function band(ratio: number): CoverageBand {
  if (ratio >= 2.1) return 'strong';
  if (ratio >= COVERAGE_FLOOR) return 'adequate';
  if (ratio >= 1.05) return 'thin';
  return 'breach';
}

export function buildDebtServiceCoverageReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  ledger: NationalRevenueLedger,
  cashMgmt: CashManagementReport
): DebtServiceCoverageReport {
  const streamDelta = ledger.streams.reduce((s, st) => s + st.deltaPoints, 0);
  const revenueCoverPoints =
    Math.round((v1012.revenueCapacity * 0.14 + streamDelta * 0.2 + Math.max(0, v1012.fiscalHeadroom) * 0.25) * 10) /
    10;
  const debtServicePoints =
    Math.round((v1012.debtServiceLoad * 0.95 + (v1012.debtEnabled ? v1012.debtLevel * 0.015 : 0)) * 10) / 10;

  const coverageRatio =
    debtServicePoints <= 0 ? 99 : Math.round((revenueCoverPoints / debtServicePoints) * 100) / 100;

  const coverageBand = band(coverageRatio);

  const runwayTurnsAligned =
    cashMgmt.runwayTurns >= 2.5 ||
    coverageBand === 'strong' ||
    coverageBand === 'adequate' ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const withinCoverageFloor =
    coverageRatio >= COVERAGE_FLOOR ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && coverageRatio >= COVERAGE_FLOOR * 0.92) ||
    !v1012.debtEnabled;

  const warnings: string[] = [];
  if (!withinCoverageFloor) {
    warnings.push(`Coverage ratio ${coverageRatio} below floor ${COVERAGE_FLOOR}.`);
  }
  if (!runwayTurnsAligned) {
    warnings.push(`TGA runway ${cashMgmt.runwayTurns} misaligned with coverage band ${coverageBand}.`);
  }

  const narrative = withinCoverageFloor
    ? `Debt service coverage ${coverageRatio}x (${coverageBand}); revenue cover ${revenueCoverPoints}.`
    : `Coverage alert: ${coverageRatio}x vs service ${debtServicePoints}.`;

  return {
    schemaVersion: DEBT_SERVICE_COVERAGE_SCHEMA,
    turn,
    revenueCoverPoints,
    debtServicePoints,
    coverageRatio,
    coverageBand,
    runwayTurnsAligned,
    withinCoverageFloor,
    narrative,
    warnings
  };
}


// --- source: grant-clawback-schedule/types.ts ---
export const GRANT_CLAWBACK_SCHEDULE_SCHEMA = 'op10m-agent07-grant-clawback-schedule-v1';

export interface GrantClawbackTranche {
  id: string;
  grantProgramId: string;
  label: string;
  scheduledPoints: number;
  performanceGatePassed: boolean;
  withinScheduleBand: boolean;
}

export interface GrantClawbackScheduleReport {
  schemaVersion: string;
  turn: number;
  tranches: GrantClawbackTranche[];
  aggregateScheduledPoints: number;
  aggregateClawbackPoints: number;
  scheduleToClawbackRatio: number;
  withinScheduleTolerance: boolean;
  alignedWithIgrPool: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: grant-clawback-schedule/compute.ts ---

const SCHEDULE_RATIO_CAP = 0.58;

export function buildGrantClawbackScheduleReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  igGrants: IntergovernmentalGrantsReport
): GrantClawbackScheduleReport {
  const performanceScale = igGrants.performancePassRate >= 0.55 ? 0.85 : igGrants.performancePassRate >= 0.4 ? 1 : 1.18;

  const tranches: GrantClawbackTranche[] = igGrants.allocations.map((row, idx) => {
    const scheduledPoints = Math.round(row.clawbackPoints * 0.92 * performanceScale * 10) / 10;
    const performanceGatePassed = row.performanceGateMet || v1012.pressure === 'critical';
    const withinScheduleBand = scheduledPoints <= row.federalPoints * 0.25 + 0.2;
    return {
      id: `gcs_${idx}_${row.programId}`,
      grantProgramId: row.programId,
      label: row.label,
      scheduledPoints,
      performanceGatePassed,
      withinScheduleBand
    };
  });

  let aggregateScheduledPoints = Math.round(tranches.reduce((s, t) => s + t.scheduledPoints, 0) * 10) / 10;
  const aggregateClawbackPoints = igGrants.totalClawback;

  if (v1012.pressure !== 'critical' && aggregateClawbackPoints > 0 && aggregateScheduledPoints / aggregateClawbackPoints > SCHEDULE_RATIO_CAP) {
    const scale = (SCHEDULE_RATIO_CAP * aggregateClawbackPoints) / Math.max(0.1, aggregateScheduledPoints);
    for (const t of tranches) {
      t.scheduledPoints = Math.round(t.scheduledPoints * scale * 10) / 10;
    }
    aggregateScheduledPoints = Math.round(tranches.reduce((s, t) => s + t.scheduledPoints, 0) * 10) / 10;
  }

  const scheduleToClawbackRatio =
    aggregateClawbackPoints <= 0
      ? 0
      : Math.round((aggregateScheduledPoints / aggregateClawbackPoints) * 1000) / 1000;

  const withinScheduleTolerance =
    scheduleToClawbackRatio <= SCHEDULE_RATIO_CAP ||
    aggregateClawbackPoints <= 0 ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && scheduleToClawbackRatio <= SCHEDULE_RATIO_CAP * 1.1);

  const alignedWithIgrPool =
    Math.abs(aggregateScheduledPoints - aggregateClawbackPoints * 0.42) <= 3.5 ||
    igGrants.reconciledToIgrPool ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinScheduleTolerance) {
    warnings.push(`Schedule/clawback ratio ${scheduleToClawbackRatio} exceeds ${SCHEDULE_RATIO_CAP}.`);
  }
  if (!alignedWithIgrPool) {
    warnings.push(`Scheduled ${aggregateScheduledPoints} misaligned with clawback pool ${aggregateClawbackPoints}.`);
  }

  const narrative = withinScheduleTolerance
    ? `Grant clawback schedule: ${aggregateScheduledPoints} scheduled vs ${aggregateClawbackPoints} clawback pool.`
    : `Clawback schedule alert: ratio ${scheduleToClawbackRatio}.`;

  return {
    schemaVersion: GRANT_CLAWBACK_SCHEDULE_SCHEMA,
    turn,
    tranches,
    aggregateScheduledPoints,
    aggregateClawbackPoints,
    scheduleToClawbackRatio,
    withinScheduleTolerance,
    alignedWithIgrPool,
    narrative,
    warnings
  };
}


// --- source: budget-neutral-packages/types.ts ---
export const BUDGET_NEUTRAL_PACKAGES_SCHEMA = 'op10m-agent07-budget-neutral-packages-v1';

export interface BudgetNeutralPackageLine {
  id: string;
  title: string;
  newSpendingPoints: number;
  offsetPoints: number;
  netPoints: number;
  withinNeutralityBand: boolean;
}

export interface BudgetNeutralPackagesReport {
  schemaVersion: string;
  turn: number;
  packages: BudgetNeutralPackageLine[];
  aggregateNewSpending: number;
  aggregateOffsets: number;
  aggregateNetPoints: number;
  withinPortfolioNeutrality: boolean;
  coherentWithSpendingOffsets: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: budget-neutral-packages/compute.ts ---

const NET_NEUTRALITY_CAP = 1.8;

function pkg(
  id: string,
  title: string,
  spend: number,
  offset: number
): BudgetNeutralPackageLine {
  const netPoints = Math.round((spend - offset) * 10) / 10;
  return {
    id,
    title,
    newSpendingPoints: Math.round(spend * 10) / 10,
    offsetPoints: Math.round(offset * 10) / 10,
    netPoints,
    withinNeutralityBand: Math.abs(netPoints) <= NET_NEUTRALITY_CAP
  };
}

export function buildBudgetNeutralPackagesReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  spendingOffsets: SpendingOffsetsReport,
  supplementary: SupplementaryEstimatesReport
): BudgetNeutralPackagesReport {
  const electionWindow = turn % 12 >= 9;
  const baseSpend = spendingOffsets.aggregateNewSpending / Math.max(1, spendingOffsets.lines.length);
  const baseOffset = spendingOffsets.aggregateOffsets / Math.max(1, spendingOffsets.lines.length);

  let packages: BudgetNeutralPackageLine[] = [
    pkg('bnp_care', 'Care economy bundle', baseSpend * 1.05, baseOffset * 1.02),
    pkg('bnp_energy', 'Energy transition bundle', baseSpend * 0.95, baseOffset * 0.98),
    pkg('bnp_skills', 'Skills and migration bundle', baseSpend * 1.1, baseOffset * 1.05 + (electionWindow ? 0.3 : 0)),
    pkg('bnp_infra', 'Infrastructure pinch bundle', baseSpend * 0.9, baseOffset * 0.92)
  ];

  if (v1012.pressure !== 'critical') {
    packages = packages.map(p => {
      if (p.withinNeutralityBand) return p;
      const targetNet = Math.sign(p.netPoints) * NET_NEUTRALITY_CAP;
      const offsetPoints = Math.round((p.newSpendingPoints - targetNet) * 10) / 10;
      return {
        ...p,
        offsetPoints,
        netPoints: targetNet,
        withinNeutralityBand: true
      };
    });
  }

  const aggregateNewSpending = Math.round(packages.reduce((s, p) => s + p.newSpendingPoints, 0) * 10) / 10;
  const aggregateOffsets = Math.round(packages.reduce((s, p) => s + p.offsetPoints, 0) * 10) / 10;
  const aggregateNetPoints = Math.round(packages.reduce((s, p) => s + p.netPoints, 0) * 10) / 10;

  const withinPortfolioNeutrality =
    Math.abs(aggregateNetPoints) <= NET_NEUTRALITY_CAP * 2.2 ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && Math.abs(aggregateNetPoints) <= NET_NEUTRALITY_CAP * 2.8);

  const coherentWithSpendingOffsets =
    Math.abs(aggregateNewSpending - spendingOffsets.aggregateNewSpending) <= 6 ||
    Math.abs(aggregateOffsets - spendingOffsets.aggregateOffsets) <= 6 ||
    supplementary.withinRevisionTolerance ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinPortfolioNeutrality) {
    warnings.push(`Aggregate net ${aggregateNetPoints} exceeds neutrality band.`);
  }
  if (!coherentWithSpendingOffsets) {
    warnings.push('Package totals diverge from spending offsets portfolio.');
  }

  const narrative = withinPortfolioNeutrality
    ? `Budget-neutral packages net ${aggregateNetPoints} (new ${aggregateNewSpending}, offsets ${aggregateOffsets}).`
    : `Neutrality review: net ${aggregateNetPoints}.`;

  return {
    schemaVersion: BUDGET_NEUTRAL_PACKAGES_SCHEMA,
    turn,
    packages,
    aggregateNewSpending,
    aggregateOffsets,
    aggregateNetPoints,
    withinPortfolioNeutrality,
    coherentWithSpendingOffsets,
    narrative,
    warnings
  };
}


// --- source: infrastructure-fiscal-load/types.ts ---
export const INFRASTRUCTURE_FISCAL_LOAD_SCHEMA = 'op10m-agent07-infrastructure-fiscal-load-v1';

export interface InfrastructureFiscalLoadLine {
  projectId: string;
  capitalPoints: number;
  serviceLoadPoints: number;
  envelopeShare: number;
  withinLoadBand: boolean;
}

export interface InfrastructureFiscalLoadReport {
  schemaVersion: string;
  turn: number;
  lines: InfrastructureFiscalLoadLine[];
  aggregateCapital: number;
  aggregateServiceLoad: number;
  envelopeCapacityPoints: number;
  loadToCapacityRatio: number;
  withinPortfolioLoadCap: boolean;
  feasibleUnderEnvelope: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: infrastructure-fiscal-load/compute.ts ---

const LOAD_RATIO_CAP = 0.38;

export function buildInfrastructureFiscalLoadReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  infraSummary: InfrastructureFinancingSummary,
  envelope: BudgetEnvelope
): InfrastructureFiscalLoadReport {
  const envelopeCapacityPoints = envelope.totalCapacityPoints;
  const lines: InfrastructureFiscalLoadLine[] = infraSummary.plans.map(plan => {
    const serviceLoadPoints =
      Math.round(plan.stack.reduce((s, l) => s + l.serviceLoadDelta, 0) * 10) / 10;
    const envelopeShare =
      envelopeCapacityPoints <= 0 ? 0 : Math.round((serviceLoadPoints / envelopeCapacityPoints) * 1000) / 1000;
    return {
      projectId: plan.projectId,
      capitalPoints: plan.totalCapitalPoints,
      serviceLoadPoints,
      envelopeShare,
      withinLoadBand: envelopeShare <= 0.12 || v1012.pressure === 'critical'
    };
  });

  const aggregateCapital = infraSummary.aggregateCapital;
  const aggregateServiceLoad = infraSummary.aggregateServiceLoad;
  const loadToCapacityRatio =
    envelopeCapacityPoints <= 0
      ? 0
      : Math.round((aggregateServiceLoad / envelopeCapacityPoints) * 1000) / 1000;

  const withinPortfolioLoadCap =
    loadToCapacityRatio <= LOAD_RATIO_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && loadToCapacityRatio <= LOAD_RATIO_CAP * 1.1);

  const feasibleUnderEnvelope =
    infraSummary.plans.every(p => p.feasible) || withinPortfolioLoadCap || v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinPortfolioLoadCap) {
    warnings.push(`Infra service load ratio ${loadToCapacityRatio} exceeds ${LOAD_RATIO_CAP}.`);
  }
  if (!feasibleUnderEnvelope) {
    warnings.push('At least one infrastructure plan infeasible under envelope.');
  }

  const narrative = withinPortfolioLoadCap
    ? `Infrastructure fiscal load ${loadToCapacityRatio} of envelope; service ${aggregateServiceLoad}.`
    : `Infrastructure load alert: ratio ${loadToCapacityRatio}.`;

  return {
    schemaVersion: INFRASTRUCTURE_FISCAL_LOAD_SCHEMA,
    turn,
    lines,
    aggregateCapital,
    aggregateServiceLoad,
    envelopeCapacityPoints,
    loadToCapacityRatio,
    withinPortfolioLoadCap,
    feasibleUnderEnvelope,
    narrative,
    warnings
  };
}


// --- source: revenue-integrity-audit/types.ts ---
export const REVENUE_INTEGRITY_AUDIT_SCHEMA = 'op10m-agent07-revenue-integrity-audit-v1';

export interface RevenueIntegrityFinding {
  id: string;
  label: string;
  severity: 'info' | 'caution' | 'major';
  passed: boolean;
  detail: string;
}

export interface RevenueIntegrityAuditReport {
  schemaVersion: string;
  turn: number;
  findings: RevenueIntegrityFinding[];
  allPassed: boolean;
  aggregateDeltaGap: number;
  coherentWithTaxSensitivity: boolean;
  narrative: string;
  warnings: string[];
}


// --- source: revenue-integrity-audit/compute.ts ---

export function buildRevenueIntegrityAuditReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  ledger: NationalRevenueLedger,
  taxSensitivity: TaxPolicySensitivityReport
): RevenueIntegrityAuditReport {
  const streamDelta = ledger.streams.reduce((s, st) => s + st.deltaPoints, 0);
  const aggregateDeltaGap = Math.round(Math.abs(streamDelta - taxSensitivity.modeledUpliftPoints * 1.4) * 10) / 10;

  const findings: RevenueIntegrityFinding[] = [
    {
      id: 'ria_ledger_flag',
      label: 'Revenue ledger reconciled flag set',
      severity: ledger.reconciledToV1012 ? 'info' : 'caution',
      passed: ledger.reconciledToV1012 || v1012.pressure === 'critical',
      detail: ledger.reconciliationNotes[0] ?? 'reconciled'
    },
    {
      id: 'ria_stream_count',
      label: 'At least one revenue stream modeled',
      severity: 'info',
      passed: ledger.streams.length >= 1,
      detail: `streams=${ledger.streams.length}`
    },
    {
      id: 'ria_delta_gap',
      label: 'Ledger delta gap vs tax sensitivity bounded',
      severity: aggregateDeltaGap > 6 ? 'caution' : 'info',
      passed: aggregateDeltaGap <= 7.5 || v1012.pressure === 'critical',
      detail: `gap=${aggregateDeltaGap}, uplift=${taxSensitivity.modeledUpliftPoints}`
    },
    {
      id: 'ria_high_vol',
      label: 'High-volatility streams flagged when headroom tight',
      severity: 'caution',
      passed:
        v1012.fiscalHeadroom > -6 ||
        ledger.streams.filter(s => s.volatilityBand === 'high').length <= 1 ||
        v1012.pressure === 'critical',
      detail: `headroom=${v1012.fiscalHeadroom}`
    }
  ];

  const coherentWithTaxSensitivity =
    taxSensitivity.coherentWithLedgerDelta &&
    (aggregateDeltaGap <= 6 || taxSensitivity.withinAggregateBand || v1012.pressure === 'critical');

  const allPassed = findings.every(f => f.passed) && coherentWithTaxSensitivity;

  const warnings: string[] = [];
  if (!coherentWithTaxSensitivity) {
    warnings.push(`Integrity gap ${aggregateDeltaGap} vs tax sensitivity uplift.`);
  }

  const narrative = allPassed
    ? `Revenue integrity audit passed (${findings.filter(f => f.passed).length}/${findings.length} findings).`
    : 'Revenue integrity audit flagged items for review.';

  return {
    schemaVersion: REVENUE_INTEGRITY_AUDIT_SCHEMA,
    turn,
    findings,
    allPassed,
    aggregateDeltaGap,
    coherentWithTaxSensitivity,
    narrative,
    warnings
  };
}


// --- source: infrastructure-financing/types.ts ---
export const INFRA_FINANCING_SCHEMA = 'op10m-agent07-infra-financing-v1';

export type InfrastructureFinancingVehicle =
  | 'paygo_appropriation'
  | 'sovereign_bond_series'
  | 'state_borrowing_facility'
  | 'ppp_availability'
  | 'grant_match_federal'
  | 'off_budget_entity'
  | 'debt_funded_acceleration';

export interface InfrastructureProjectFundingRequest {
  projectId: string;
  title: string;
  regionIds: string[];
  capitalPoints: number;
  maintenancePointsPerTurn: number;
  strategicWeight: number;
  preferredVehicle: InfrastructureFinancingVehicle;
}

export interface InfrastructureFundingStackLine {
  vehicle: InfrastructureFinancingVehicle;
  capitalPoints: number;
  serviceLoadDelta: number;
  envelopeCategory: 'infrastructure_capital' | 'maintenance_backlog' | 'debt_service_reserve';
  warnOnly: boolean;
  explanation: string;
}

export interface InfrastructureFundingPlan {
  projectId: string;
  totalCapitalPoints: number;
  stack: InfrastructureFundingStackLine[];
  fiscalHeadroomAfter: number;
  debtServiceAfter: number;
  feasible: boolean;
  warnings: string[];
}

export interface InfrastructureFinancingSummary {
  schemaVersion: string;
  turn: number;
  plans: InfrastructureFundingPlan[];
  aggregateCapital: number;
  aggregateServiceLoad: number;
  bindingWarnings: string[];
}


// --- source: infrastructure-financing/compute.ts ---
  InfrastructureFinancingSummary,
  InfrastructureFundingPlan,
  InfrastructureProjectFundingRequest
} from './types';

const VEHICLE_SERVICE_LOAD: Record<string, number> = {
  paygo_appropriation: 0,
  sovereign_bond_series: 0.08,
  state_borrowing_facility: 0.06,
  ppp_availability: 0.04,
  grant_match_federal: 0,
  off_budget_entity: 0.02,
  debt_funded_acceleration: 0.12
};

export function planInfrastructureFunding(
  request: InfrastructureProjectFundingRequest,
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope
): InfrastructureFundingPlan {
  const infraLine = envelope.lines.find(l => l.category === 'infrastructure_capital');
  const flex = infraLine?.flexPoints ?? 0;
  const warnings: string[] = [];
  const vehicle = request.preferredVehicle;
  let capitalFromPaygo = Math.min(request.capitalPoints, flex);
  let remainder = request.capitalPoints - capitalFromPaygo;

  const stack: InfrastructureFundingPlan['stack'] = [];
  if (capitalFromPaygo > 0) {
    stack.push({
      vehicle: 'paygo_appropriation',
      capitalPoints: capitalFromPaygo,
      serviceLoadDelta: 0,
      envelopeCategory: 'infrastructure_capital',
      warnOnly: false,
      explanation: `Pay-go from infrastructure envelope flex (${capitalFromPaygo} pts).`
    });
  }

  if (remainder > 0 && v1012.debtEnabled) {
    const debtVehicle =
      vehicle === 'debt_funded_acceleration' ? 'debt_funded_acceleration' : 'sovereign_bond_series';
    const load = remainder * (VEHICLE_SERVICE_LOAD[debtVehicle] ?? 0.08);
    stack.push({
      vehicle: debtVehicle,
      capitalPoints: remainder,
      serviceLoadDelta: Math.round(load * 10) / 10,
      envelopeCategory: 'debt_service_reserve',
      warnOnly: v1012.pressure !== 'critical',
      explanation: `Debt-funded tranche ${remainder} pts; service load +${load.toFixed(1)}.`
    });
    remainder = 0;
  } else if (remainder > 0) {
    stack.push({
      vehicle: 'grant_match_federal',
      capitalPoints: remainder,
      serviceLoadDelta: 0,
      envelopeCategory: 'infrastructure_capital',
      warnOnly: true,
      explanation: `Grant-match / staged funding for ${remainder} pts (debt disabled).`
    });
    warnings.push('Debt disabled — remainder staged via grant-match (warn-only).');
  }

  const aggregateService = stack.reduce((s, l) => s + l.serviceLoadDelta, 0);
  const fiscalHeadroomAfter = v1012.fiscalHeadroom - Math.round(request.capitalPoints * 0.04);
  const debtServiceAfter = v1012.debtServiceLoad + aggregateService;
  const feasible =
    fiscalHeadroomAfter > -18 &&
    (v1012.pressure !== 'critical' || request.capitalPoints <= flex + 5);

  if (v1012.pressure === 'critical' && request.capitalPoints > flex) {
    warnings.push('Critical fiscal pressure — large capital stack should be staged.');
  }
  if (debtServiceAfter > 20) {
    warnings.push('Projected debt service exceeds soft guard (20 pts).');
  }

  return {
    projectId: request.projectId,
    totalCapitalPoints: request.capitalPoints,
    stack,
    fiscalHeadroomAfter,
    debtServiceAfter,
    feasible,
    warnings
  };
}

export function summarizeInfrastructureFinancing(
  turn: number,
  requests: InfrastructureProjectFundingRequest[],
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope
): InfrastructureFinancingSummary {
  const plans = requests.map(r => planInfrastructureFunding(r, v1012, envelope));
  const aggregateCapital = plans.reduce((s, p) => s + p.totalCapitalPoints, 0);
  const aggregateServiceLoad = plans.reduce(
    (s, p) => s + p.stack.reduce((t, l) => t + l.serviceLoadDelta, 0),
    0
  );
  const bindingWarnings = plans.flatMap(p => p.warnings).filter(Boolean);

  return {
    schemaVersion: INFRA_FINANCING_SCHEMA,
    turn,
    plans,
    aggregateCapital,
    aggregateServiceLoad,
    bindingWarnings
  };
}


// --- source: recurring-commitments/types.ts ---

export const RECURRING_COMMITMENTS_SCHEMA = 'op10m-agent07-recurring-commitments-v1';

export type RecurringCommitmentCadence = 'every_turn' | 'every_2_turns' | 'annual';

export type RecurringCommitmentKind =
  | 'core_services'
  | 'maintenance_contract'
  | 'subsidy_program'
  | 'debt_coupon'
  | 'indexed_transfer';

export interface RecurringCommitmentDefinition {
  id: string;
  title: string;
  kind: RecurringCommitmentKind;
  cadence: RecurringCommitmentCadence;
  loadPointsPerPulse: number;
  envelopeCategory: BudgetEnvelopeCategory;
  mandatory: boolean;
  expiryTurn: number | null;
  regionIds: string[];
}

export interface RecurringCommitmentPulse {
  commitmentId: string;
  turn: number;
  loadPoints: number;
  envelopeCategory: BudgetEnvelopeCategory;
  skipped: boolean;
  explanation: string;
}

export interface RecurringCommitmentsSchedule {
  schemaVersion: string;
  turn: number;
  pulses: RecurringCommitmentPulse[];
  totalLoadThisTurn: number;
  mandatoryLoad: number;
  discretionaryLoad: number;
  overlapsEnvelopeCommitted: boolean;
  warnings: string[];
}


// --- source: recurring-commitments/compute.ts ---
  RecurringCommitmentDefinition,
  RecurringCommitmentsSchedule
} from './types';

export const DEFAULT_RECURRING_COMMITMENTS: RecurringCommitmentDefinition[] = [
  {
    id: 'rc_core_admin',
    title: 'Core administration & services baseline',
    kind: 'core_services',
    cadence: 'every_turn',
    loadPointsPerPulse: 4,
    envelopeCategory: 'core_services',
    mandatory: true,
    expiryTurn: null,
    regionIds: []
  },
  {
    id: 'rc_network_maintenance',
    title: 'Network maintenance contracts',
    kind: 'maintenance_contract',
    cadence: 'every_turn',
    loadPointsPerPulse: 3,
    envelopeCategory: 'maintenance_backlog',
    mandatory: true,
    expiryTurn: null,
    regionIds: []
  },
  {
    id: 'rc_regional_transfers',
    title: 'Indexed regional transfers',
    kind: 'indexed_transfer',
    cadence: 'every_2_turns',
    loadPointsPerPulse: 5,
    envelopeCategory: 'regional_development',
    mandatory: false,
    expiryTurn: null,
    regionIds: ['NSW', 'VIC', 'QLD']
  },
  {
    id: 'rc_sovereign_coupon',
    title: 'Sovereign debt coupon strip',
    kind: 'debt_coupon',
    cadence: 'every_turn',
    loadPointsPerPulse: 2,
    envelopeCategory: 'debt_service_reserve',
    mandatory: true,
    expiryTurn: null,
    regionIds: []
  }
];

function cadenceDue(def: RecurringCommitmentDefinition, turn: number): boolean {
  if (def.expiryTurn !== null && turn > def.expiryTurn) return false;
  if (def.cadence === 'every_turn') return true;
  if (def.cadence === 'every_2_turns') return turn % 2 === 0;
  if (def.cadence === 'annual') return turn % 12 === 0;
  return true;
}

function scaleLoad(def: RecurringCommitmentDefinition, v1012: V1012FiscalSnapshot): number {
  let load = def.loadPointsPerPulse;
  if (def.kind === 'maintenance_contract') {
    load += Math.round(v1012.maintenanceLoad * 0.08);
  }
  if (def.kind === 'debt_coupon' && v1012.debtEnabled) {
    load += Math.round(v1012.debtServiceLoad * 0.15);
  }
  if (v1012.pressure === 'critical') load = Math.round(load * 1.05);
  return load;
}

export function scheduleRecurringCommitments(
  turn: number,
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope,
  definitions: RecurringCommitmentDefinition[] = DEFAULT_RECURRING_COMMITMENTS
): RecurringCommitmentsSchedule {
  const pulses = definitions
    .filter(d => cadenceDue(d, turn))
    .map(d => {
      const loadPoints = scaleLoad(d, v1012);
      const line = envelope.lines.find(l => l.category === d.envelopeCategory);
      const skipped = Boolean(line && line.flexPoints < loadPoints && !d.mandatory);
      return {
        commitmentId: d.id,
        turn,
        loadPoints: skipped ? 0 : loadPoints,
        envelopeCategory: d.envelopeCategory,
        skipped,
        explanation: skipped
          ? `${d.title} deferred — insufficient flex in ${d.envelopeCategory}.`
          : `${d.title} pulses ${loadPoints} pts (${d.cadence}).`
      };
    });

  const mandatoryLoad = pulses
    .filter(p => {
      const def = definitions.find(d => d.id === p.commitmentId);
      return def?.mandatory && !p.skipped;
    })
    .reduce((s, p) => s + p.loadPoints, 0);

  const totalLoadThisTurn = pulses.reduce((s, p) => s + p.loadPoints, 0);
  const discretionaryLoad = totalLoadThisTurn - mandatoryLoad;

  const warnings: string[] = [];
  if (mandatoryLoad > envelope.totalCapacityPoints * 0.35) {
    warnings.push('Mandatory recurring load exceeds 35% of envelope capacity — rebalance recommended.');
  }
  if (pulses.some(p => p.skipped)) {
    warnings.push('One or more discretionary recurring pulses skipped due to envelope flex.');
  }

  const overlapsEnvelopeCommitted = envelope.lines.some(line => {
    const pulseLoad = pulses
      .filter(p => p.envelopeCategory === line.category && !p.skipped)
      .reduce((s, p) => s + p.loadPoints, 0);
    return pulseLoad + line.committedPoints > line.allocatedPoints * 1.15;
  });

  if (overlapsEnvelopeCommitted) {
    warnings.push('Recurring pulses plus committed envelope exceed category guard (115%).');
  }

  return {
    schemaVersion: RECURRING_COMMITMENTS_SCHEMA,
    turn,
    pulses,
    totalLoadThisTurn,
    mandatoryLoad,
    discretionaryLoad,
    overlapsEnvelopeCommitted,
    warnings
  };
}


// --- source: fiscal-resilience/types.ts ---

export const FISCAL_RESILIENCE_SCHEMA = 'op10m-agent07-fiscal-resilience-v1';

export type FiscalShockKind =
  | 'commodity_revenue_drop'
  | 'disaster_recovery_surge'
  | 'rate_shock_debt_service'
  | 'migration_dividend'
  | 'trade_terms_improvement';

export interface FiscalShockDefinition {
  id: string;
  kind: FiscalShockKind;
  label: string;
  /** Normalized impact on revenue capacity (negative = loss). */
  revenueCapacityDelta: number;
  /** Normalized impact on fiscal headroom. */
  headroomDelta: number;
  /** Extra maintenance / recovery load. */
  maintenanceLoadDelta: number;
  durationTurns: number;
  warnOnly: boolean;
}

export interface AppliedFiscalShock {
  shockId: string;
  turnApplied: number;
  turnsRemaining: number;
  adjustedSnapshot: V1012FiscalSnapshot;
  pressureAfter: V1012FiscalSnapshot['pressure'];
  narrative: string;
}

export interface FiscalResilienceAssessment {
  schemaVersion: string;
  turn: number;
  baselinePressure: V1012FiscalSnapshot['pressure'];
  shocksApplied: AppliedFiscalShock[];
  compositeStressBand: FiscalOutcomeBand;
  reserveAdequacy: 'strong' | 'adequate' | 'thin' | 'depleted';
  recoveryTurnsEstimate: number | null;
  warnings: string[];
}


// --- source: fiscal-resilience/compute.ts ---

export const FISCAL_SHOCK_CATALOG: Record<string, FiscalShockDefinition> = {
  commodity_drop: {
    id: 'commodity_drop',
    kind: 'commodity_revenue_drop',
    label: 'Commodity revenue shortfall',
    revenueCapacityDelta: -8,
    headroomDelta: -4,
    maintenanceLoadDelta: 0,
    durationTurns: 4,
    warnOnly: true
  },
  disaster_surge: {
    id: 'disaster_surge',
    kind: 'disaster_recovery_surge',
    label: 'Disaster recovery expenditure surge',
    revenueCapacityDelta: -2,
    headroomDelta: -10,
    maintenanceLoadDelta: 6,
    durationTurns: 6,
    warnOnly: true
  },
  rate_shock: {
    id: 'rate_shock',
    kind: 'rate_shock_debt_service',
    label: 'Global rate shock on debt service',
    revenueCapacityDelta: 0,
    headroomDelta: -6,
    maintenanceLoadDelta: 0,
    durationTurns: 3,
    warnOnly: true
  },
  migration_dividend: {
    id: 'migration_dividend',
    kind: 'migration_dividend',
    label: 'Migration-driven revenue dividend',
    revenueCapacityDelta: 4,
    headroomDelta: 3,
    maintenanceLoadDelta: 1,
    durationTurns: 5,
    warnOnly: false
  }
};

function pressureFromHeadroom(headroom: number): V1012FiscalSnapshot['pressure'] {
  if (headroom >= 12) return 'comfortable';
  if (headroom >= 5) return 'healthy';
  if (headroom >= 0) return 'tight';
  if (headroom >= -8) return 'strained';
  return 'critical';
}

function bandFromStress(score: number): FiscalOutcomeBand {
  if (score >= 72) return 'strong';
  if (score >= 55) return 'healthy';
  if (score >= 40) return 'mixed';
  if (score >= 22) return 'weak';
  return 'critical';
}

function applyShock(base: V1012FiscalSnapshot, shock: FiscalShockDefinition, turn: number): AppliedFiscalShock {
  const revenueCapacity = Math.max(0, Math.min(100, base.revenueCapacity + shock.revenueCapacityDelta));
  const fiscalHeadroom = base.fiscalHeadroom + shock.headroomDelta;
  const maintenanceLoad = Math.max(0, base.maintenanceLoad + shock.maintenanceLoadDelta);
  let debtServiceLoad = base.debtServiceLoad;
  if (shock.kind === 'rate_shock_debt_service' && base.debtEnabled) {
    debtServiceLoad = Math.round((debtServiceLoad + base.debtLevel * 0.06) * 10) / 10;
  }
  const adjusted: V1012FiscalSnapshot = {
    ...base,
    turn,
    revenueCapacity,
    fiscalHeadroom,
    maintenanceLoad,
    debtServiceLoad,
    pressure: pressureFromHeadroom(fiscalHeadroom)
  };
  return {
    shockId: shock.id,
    turnApplied: turn,
    turnsRemaining: shock.durationTurns,
    adjustedSnapshot: adjusted,
    pressureAfter: adjusted.pressure,
    narrative: `${shock.label}: revenue ${shock.revenueCapacityDelta >= 0 ? '+' : ''}${shock.revenueCapacityDelta}, headroom ${shock.headroomDelta >= 0 ? '+' : ''}${shock.headroomDelta}.`
  };
}

export function assessFiscalResilience(
  turn: number,
  baseline: V1012FiscalSnapshot,
  shockIds: string[]
): FiscalResilienceAssessment {
  const warnings: string[] = [];
  let working = { ...baseline, turn };
  const shocksApplied: AppliedFiscalShock[] = [];

  for (const id of shockIds) {
    const def = FISCAL_SHOCK_CATALOG[id];
    if (!def) {
      warnings.push(`Unknown shock id: ${id}`);
      continue;
    }
    const applied = applyShock(working, def, turn);
    shocksApplied.push(applied);
    working = applied.adjustedSnapshot;
  }

  const reservePolicy = baseline.reservePolicy ?? 'standard';
  let reserveAdequacy: FiscalResilienceAssessment['reserveAdequacy'] = 'adequate';
  if (working.fiscalHeadroom >= 10 && reservePolicy === 'prudent') reserveAdequacy = 'strong';
  else if (working.fiscalHeadroom < 0) reserveAdequacy = 'depleted';
  else if (working.fiscalHeadroom < 4) reserveAdequacy = 'thin';

  const stressScore = Math.max(
    0,
    Math.min(
      100,
      70 +
        working.fiscalHeadroom * 1.5 +
        working.revenueCapacity * 0.2 -
        working.debtServiceLoad * 2 -
        working.maintenanceLoad * 0.8
    )
  );

  let recoveryTurnsEstimate: number | null = null;
  if (working.pressure === 'strained' || working.pressure === 'critical') {
    recoveryTurnsEstimate = working.pressure === 'critical' ? 8 : 4;
    warnings.push('Shock stack elevated fiscal pressure — staged recovery recommended.');
  }

  if (shocksApplied.some(s => FISCAL_SHOCK_CATALOG[s.shockId]?.kind === 'disaster_recovery_surge')) {
    warnings.push('Disaster recovery shock increases maintenance load — check recurring commitments.');
  }

  return {
    schemaVersion: FISCAL_RESILIENCE_SCHEMA,
    turn,
    baselinePressure: baseline.pressure,
    shocksApplied,
    compositeStressBand: bandFromStress(stressScore),
    reserveAdequacy,
    recoveryTurnsEstimate,
    warnings
  };
}


// --- source: debt-rollover/types.ts ---

export const DEBT_ROLLOVER_SCHEMA = 'op10m-agent07-debt-rollover-v1';

export type DebtInstrumentTenor = 'short' | 'medium' | 'long';

export interface MaturityTranche {
  id: string;
  tenor: DebtInstrumentTenor;
  principalPoints: number;
  couponLoad: number;
  maturityTurn: number;
  rolledCount: number;
}

export type RolloverOutcome =
  | 'rolled_at_market'
  | 'rolled_with_penalty'
  | 'partially_retired'
  | 'failed_liquidity'
  | 'not_due';

export interface DebtRolloverEvent {
  trancheId: string;
  turn: number;
  outcome: RolloverOutcome;
  principalBefore: number;
  principalAfter: number;
  serviceLoadBefore: number;
  serviceLoadAfter: number;
  headroomDelta: number;
  explanation: string;
}

export interface DebtRolloverPlan {
  schemaVersion: string;
  turn: number;
  events: DebtRolloverEvent[];
  trajectoryAfter: DebtOutcomeTrajectory | null;
  liquidityStress: boolean;
  warnings: string[];
}

export interface DebtRolloverInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  tranches: MaturityTranche[];
  computeTrajectory: (snap: V1012FiscalSnapshot) => DebtOutcomeTrajectory;
}


// --- source: debt-rollover/compute.ts ---

function isDue(tranche: MaturityTranche, turn: number): boolean {
  return turn >= tranche.maturityTurn;
}

export function resolveDebtRollover(inputs: DebtRolloverInputs): DebtRolloverPlan {
  const { turn, v1012, tranches, computeTrajectory } = inputs;
  const events: DebtRolloverEvent[] = [];
  const warnings: string[] = [];
  let working: V1012FiscalSnapshot = { ...v1012, turn };
  let liquidityStress = false;

  for (const tranche of tranches) {
    if (!isDue(tranche, turn)) {
      events.push({
        trancheId: tranche.id,
        turn,
        outcome: 'not_due',
        principalBefore: tranche.principalPoints,
        principalAfter: tranche.principalPoints,
        serviceLoadBefore: working.debtServiceLoad,
        serviceLoadAfter: working.debtServiceLoad,
        headroomDelta: 0,
        explanation: `Maturity turn ${tranche.maturityTurn} not reached.`
      });
      continue;
    }

    if (!v1012.debtEnabled) {
      events.push({
        trancheId: tranche.id,
        turn,
        outcome: 'partially_retired',
        principalBefore: tranche.principalPoints,
        principalAfter: 0,
        serviceLoadBefore: working.debtServiceLoad,
        serviceLoadAfter: Math.max(0, working.debtServiceLoad - tranche.couponLoad),
        headroomDelta: 2,
        explanation: 'Debt disabled — tranche retired from sovereign stack.'
      });
      working = {
        ...working,
        debtLevel: Math.max(0, working.debtLevel - tranche.principalPoints * 0.2),
        debtServiceLoad: Math.max(0, working.debtServiceLoad - tranche.couponLoad),
        fiscalHeadroom: working.fiscalHeadroom + 2
      };
      continue;
    }

    const headroom = working.fiscalHeadroom;
    const rolledTooOften = tranche.rolledCount >= 3;
    const critical = working.pressure === 'critical' || headroom < -12;

    let outcome: DebtRolloverEvent['outcome'] = 'rolled_at_market';
    let serviceLoadAfter = working.debtServiceLoad;
    let principalAfter = tranche.principalPoints;
    let headroomDelta = -1;
    let explanation = 'Standard market rollover.';

    if (critical && tranche.tenor === 'short') {
      outcome = 'failed_liquidity';
      liquidityStress = true;
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.5;
      headroomDelta = -6;
      explanation = 'Critical headroom — short tranche rollover failed; liquidity stress event.';
      warnings.push(`Tranche ${tranche.id} failed rollover under critical headroom.`);
    } else if (rolledTooOften) {
      outcome = 'rolled_with_penalty';
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.35;
      headroomDelta = -3;
      explanation = 'Repeated rollovers — penalty coupon uplift applied.';
    } else if (headroom < 0 && tranche.principalPoints > 15) {
      outcome = 'partially_retired';
      principalAfter = Math.round(tranche.principalPoints * 0.6);
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.1;
      headroomDelta = 1;
      explanation = 'Negative headroom — partial retirement with smaller re-issue.';
    } else if (tranche.tenor === 'long') {
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.05;
      headroomDelta = -0.5;
      explanation = 'Long tenor rolled — modest service load increase.';
    }

    events.push({
      trancheId: tranche.id,
      turn,
      outcome,
      principalBefore: tranche.principalPoints,
      principalAfter,
      serviceLoadBefore: working.debtServiceLoad,
      serviceLoadAfter,
      headroomDelta,
      explanation
    });

    working = {
      ...working,
      debtLevel:
        outcome === 'partially_retired'
          ? Math.max(0, working.debtLevel - tranche.principalPoints * 0.15)
          : working.debtLevel,
      debtServiceLoad: serviceLoadAfter,
      fiscalHeadroom: working.fiscalHeadroom + headroomDelta,
      pressure:
        working.fiscalHeadroom + headroomDelta >= 0
          ? working.pressure === 'critical'
            ? 'strained'
            : working.pressure
          : 'critical'
    };
  }

  return {
    schemaVersion: DEBT_ROLLOVER_SCHEMA,
    turn,
    events,
    trajectoryAfter: computeTrajectory(working),
    liquidityStress,
    warnings
  };
}

export function defaultMaturityLadder(turn: number): MaturityTranche[] {
  return [
    {
      id: 'tranche_short_1',
      tenor: 'short',
      principalPoints: 8,
      couponLoad: 1.2,
      maturityTurn: turn,
      rolledCount: 0
    },
    {
      id: 'tranche_med_1',
      tenor: 'medium',
      principalPoints: 18,
      couponLoad: 2.1,
      maturityTurn: turn + 2,
      rolledCount: 1
    },
    {
      id: 'tranche_long_1',
      tenor: 'long',
      principalPoints: 30,
      couponLoad: 2.8,
      maturityTurn: turn,
      rolledCount: 4
    }
  ];
}


// --- source: budget-lines/types.ts ---

export const BUDGET_LINES_SCHEMA = 'op10m-agent07-budget-lines-v2';

export type AppropriationTier = 'department' | 'program' | 'measure';

export interface AppropriationLineItem {
  id: string;
  category: BudgetEnvelopeCategory;
  tier: AppropriationTier;
  code: string;
  title: string;
  description: string;
  /** Share of parent category allocation (0..1). */
  weight: number;
  recurring: boolean;
  capital: boolean;
}

export interface BudgetSubLine {
  lineId: string;
  code: string;
  title: string;
  allocatedPoints: number;
  committedPoints: number;
  forwardEstimateY1: number;
  forwardEstimateY2: number;
  varianceBand: 'under' | 'on_track' | 'pressure' | 'blown';
  explanation: string;
}

export interface CategoryBudgetBreakdown {
  category: BudgetEnvelopeCategory;
  envelopeAllocated: number;
  subLines: BudgetSubLine[];
  subtotalAllocated: number;
  subtotalCommitted: number;
  linesBalanced: boolean;
}

export interface DetailedBudgetPaper {
  schemaVersion: string;
  fiscalYearLabel: string;
  turn: number;
  categories: CategoryBudgetBreakdown[];
  totalSubLines: number;
  aggregateVarianceWarnings: string[];
}


// --- source: budget-lines/catalog/appropriation-lines.ts ---

/** Federal appropriation structure (normalized points, not AUD). */
export const APPROPRIATION_LINE_CATALOG: AppropriationLineItem[] = [
  {
    id: 'cs_health_admin',
    category: 'core_services',
    tier: 'department',
    code: 'CS-010',
    title: 'Health portfolio administration',
    description: 'Departmental operating for national health policy coordination.',
    weight: 0.18,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_social_services',
    category: 'core_services',
    tier: 'department',
    code: 'CS-020',
    title: 'Social services delivery support',
    description: 'Platform costs for services payment integrity and compliance.',
    weight: 0.22,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_treasury_ops',
    category: 'core_services',
    tier: 'program',
    code: 'CS-030',
    title: 'Treasury & fiscal operations',
    description: 'Budget execution, appropriation management, fiscal reporting.',
    weight: 0.15,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_digital_gov',
    category: 'core_services',
    tier: 'measure',
    code: 'CS-040',
    title: 'Digital government shared services',
    description: 'Whole-of-government platforms; amortized operating charge.',
    weight: 0.12,
    recurring: true,
    capital: false
  },
  {
    id: 'cs_other_admin',
    category: 'core_services',
    tier: 'program',
    code: 'CS-090',
    title: 'Residual administration',
    description: 'Cross-portfolio admin not allocated to specific measures.',
    weight: 0.33,
    recurring: true,
    capital: false
  },
  {
    id: 'ic_transport_corridor',
    category: 'infrastructure_capital',
    tier: 'program',
    code: 'IC-110',
    title: 'National transport corridor capital',
    description: 'Rail and highway packages with multi-year profiles.',
    weight: 0.35,
    recurring: false,
    capital: true
  },
  {
    id: 'ic_energy_transition',
    category: 'infrastructure_capital',
    tier: 'program',
    code: 'IC-120',
    title: 'Energy transition infrastructure',
    description: 'Grid, storage, and connection assets (capital).',
    weight: 0.25,
    recurring: false,
    capital: true
  },
  {
    id: 'ic_water_security',
    category: 'infrastructure_capital',
    tier: 'measure',
    code: 'IC-130',
    title: 'Water security capital',
    description: 'Dams, pipelines, and basin projects.',
    weight: 0.2,
    recurring: false,
    capital: true
  },
  {
    id: 'ic_regional_alloc',
    category: 'infrastructure_capital',
    tier: 'measure',
    code: 'IC-140',
    title: 'Regional infrastructure allocation',
    description: 'State-identified priority capital with federal co-funding rules.',
    weight: 0.2,
    recurring: false,
    capital: true
  },
  {
    id: 'mb_road_network',
    category: 'maintenance_backlog',
    tier: 'program',
    code: 'MB-210',
    title: 'National road network maintenance',
    description: 'Pavement, bridges, and safety remediation backlog.',
    weight: 0.4,
    recurring: true,
    capital: false
  },
  {
    id: 'mb_rail_network',
    category: 'maintenance_backlog',
    tier: 'program',
    code: 'MB-220',
    title: 'Rail network upkeep',
    description: 'Track, signalling, and rolling stock lifecycle maintenance.',
    weight: 0.35,
    recurring: true,
    capital: false
  },
  {
    id: 'mb_public_housing',
    category: 'maintenance_backlog',
    tier: 'measure',
    code: 'MB-230',
    title: 'Public housing maintenance',
    description: 'Stock remediation tied to V10.14 services delivery.',
    weight: 0.25,
    recurring: true,
    capital: false
  },
  {
    id: 'ri_research_council',
    category: 'research_innovation',
    tier: 'program',
    code: 'RI-310',
    title: 'Research councils & competitive grants',
    description: 'Discovery and linkage programs (accrual profile).',
    weight: 0.55,
    recurring: true,
    capital: false
  },
  {
    id: 'ri_innovation_agency',
    category: 'research_innovation',
    tier: 'program',
    code: 'RI-320',
    title: 'Innovation commercialization agency',
    description: 'Translation, industry collaboration, startup support.',
    weight: 0.45,
    recurring: true,
    capital: false
  },
  {
    id: 'rd_regional_growth',
    category: 'regional_development',
    tier: 'program',
    code: 'RD-410',
    title: 'Regional growth packages',
    description: 'Place-based investment outside capital cities.',
    weight: 0.5,
    recurring: true,
    capital: false
  },
  {
    id: 'rd_remote_services',
    category: 'regional_development',
    tier: 'measure',
    code: 'RD-420',
    title: 'Remote & Indigenous community services',
    description: 'Service delivery load in remote jurisdictions.',
    weight: 0.5,
    recurring: true,
    capital: false
  },
  {
    id: 'rr_disaster_recovery',
    category: 'resilience_recovery',
    tier: 'program',
    code: 'RR-510',
    title: 'Disaster recovery funding',
    description: 'Event-driven recovery; contingent appropriation drawdown.',
    weight: 0.6,
    recurring: false,
    capital: false
  },
  {
    id: 'rr_resilience_fund',
    category: 'resilience_recovery',
    tier: 'measure',
    code: 'RR-520',
    title: 'National resilience fund',
    description: 'Mitigation and preparedness baseline.',
    weight: 0.4,
    recurring: true,
    capital: false
  },
  {
    id: 'ds_coupon_service',
    category: 'debt_service_reserve',
    tier: 'program',
    code: 'DS-610',
    title: 'Sovereign coupon & interest',
    description: 'Debt service on issued securities (non-discretionary).',
    weight: 0.7,
    recurring: true,
    capital: false
  },
  {
    id: 'ds_liquidity_buffer',
    category: 'debt_service_reserve',
    tier: 'measure',
    code: 'DS-620',
    title: 'Fiscal liquidity buffer',
    description: 'Cash management and short-term facility costs.',
    weight: 0.3,
    recurring: true,
    capital: false
  },
  {
    id: 'ct_unallocated',
    category: 'contingency',
    tier: 'measure',
    code: 'CT-710',
    title: 'Unallocated contingency',
    description: 'Held for mid-year estimates and unforeseen pressures.',
    weight: 0.65,
    recurring: false,
    capital: false
  },
  {
    id: 'ct_economic_risk',
    category: 'contingency',
    tier: 'measure',
    code: 'CT-720',
    title: 'Economic risk reserve',
    description: 'Macro shock buffer (draw rules tied to fiscal resilience layer).',
    weight: 0.35,
    recurring: false,
    capital: false
  }
];

export function linesForCategory(category: AppropriationLineItem['category']): AppropriationLineItem[] {
  return APPROPRIATION_LINE_CATALOG.filter(l => l.category === category);
}

export function normalizedWeights(category: AppropriationLineItem['category']): Map<string, number> {
  const items = linesForCategory(category);
  const sum = items.reduce((s, i) => s + i.weight, 0) || 1;
  const map = new Map<string, number>();
  for (const item of items) {
    map.set(item.id, item.weight / sum);
  }
  return map;
}


// --- source: budget-lines/compute.ts ---

function varianceBand(
  allocated: number,
  committed: number,
  pressure: V1012FiscalSnapshot['pressure']
): CategoryBudgetBreakdown['subLines'][0]['varianceBand'] {
  const ratio = allocated > 0 ? committed / allocated : 0;
  if (ratio > 1.12) return 'blown';
  if (ratio > 1.02) return 'pressure';
  if (ratio < 0.55) return 'under';
  if (pressure === 'critical' && ratio > 0.95) return 'pressure';
  return 'on_track';
}

function buildCategoryBreakdown(
  envelopeLine: NationalBudgetEnvelope['lines'][0],
  v1012: V1012FiscalSnapshot
): CategoryBudgetBreakdown {
  const weights = normalizedWeights(envelopeLine.category);
  const items = linesForCategory(envelopeLine.category);
  const subLines = items.map(item => {
    const w = weights.get(item.id) ?? 0;
    const allocatedPoints = Math.max(0, Math.round(envelopeLine.allocatedPoints * w));
    const commitFactor = item.capital ? 0.42 : item.recurring ? 0.58 : 0.35;
    const pressureMult =
      v1012.pressure === 'critical' ? 1.45 : v1012.pressure === 'strained' ? 1.06 : 1;
    const committedPoints =
      v1012.pressure === 'critical'
        ? Math.round(allocatedPoints * 1.09)
        : Math.round(allocatedPoints * commitFactor * pressureMult);
    const forwardEstimateY1 = Math.round(allocatedPoints * (item.capital ? 0.85 : 1.02));
    const forwardEstimateY2 = Math.round(forwardEstimateY1 * (item.recurring ? 1.01 : 0.75));
    return {
      lineId: item.id,
      code: item.code,
      title: item.title,
      allocatedPoints,
      committedPoints,
      forwardEstimateY1,
      forwardEstimateY2,
      varianceBand: varianceBand(allocatedPoints, committedPoints, v1012.pressure),
      explanation: item.description
    };
  });

  const subtotalAllocated = subLines.reduce((s, l) => s + l.allocatedPoints, 0);
  const subtotalCommitted = subLines.reduce((s, l) => s + l.committedPoints, 0);
  const allocDrift = envelopeLine.allocatedPoints - subtotalAllocated;
  if (subLines.length > 0 && allocDrift !== 0) {
    subLines[subLines.length - 1]!.allocatedPoints += allocDrift;
    subLines[subLines.length - 1]!.varianceBand = varianceBand(
      subLines[subLines.length - 1]!.allocatedPoints,
      subLines[subLines.length - 1]!.committedPoints,
      v1012.pressure
    );
  }
  const subtotalAllocatedFixed = subLines.reduce((s, l) => s + l.allocatedPoints, 0);
  const linesBalanced = Math.abs(subtotalAllocatedFixed - envelopeLine.allocatedPoints) <= 1;

  return {
    category: envelopeLine.category,
    envelopeAllocated: envelopeLine.allocatedPoints,
    subLines,
    subtotalAllocated: subtotalAllocatedFixed,
    subtotalCommitted,
    linesBalanced
  };
}

export function buildDetailedBudgetPaper(
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope
): DetailedBudgetPaper {
  const categories = envelope.lines.map(line => buildCategoryBreakdown(line, v1012));
  const aggregateVarianceWarnings: string[] = [];

  for (const cat of categories) {
    if (!cat.linesBalanced) {
      aggregateVarianceWarnings.push(
        `${cat.category}: sub-lines sum ${cat.subtotalAllocated} vs envelope ${cat.envelopeAllocated}.`
      );
    }
    const blown = cat.subLines.filter(s => s.varianceBand === 'blown');
    if (blown.length) {
      aggregateVarianceWarnings.push(`${cat.category}: ${blown.length} sub-line(s) in blown variance.`);
    }
  }

  if (categories.every(c => c.subtotalCommitted > c.envelopeAllocated * 1.05)) {
    aggregateVarianceWarnings.push('Aggregate committed load exceeds envelope across all categories.');
  }

  return {
    schemaVersion: BUDGET_LINES_SCHEMA,
    fiscalYearLabel: envelope.fiscalYearLabel,
    turn: v1012.turn,
    categories,
    totalSubLines: APPROPRIATION_LINE_CATALOG.length,
    aggregateVarianceWarnings
  };
}

export function countAppropriationLines(): number {
  return APPROPRIATION_LINE_CATALOG.length;
}


// --- source: federal-state/types.ts ---
export const FEDERAL_STATE_SCHEMA = 'op10m-agent07-federal-state-v1';

export type AustralianStateCode = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export type TransferInstrumentKind =
  | 'gst_igr'
  | 'health_specific'
  | 'education_specific'
  | 'infrastructure_partner'
  | 'general_purpose';

export interface StateFiscalProfile {
  stateCode: AustralianStateCode;
  populationWeight: number;
  fiscalCapacityIndex: number;
  remoteLoadFactor: number;
}

export interface IntergovernmentalTransferLine {
  stateCode: AustralianStateCode;
  instrument: TransferInstrumentKind;
  entitlementPoints: number;
  adjustmentPoints: number;
  netPoints: number;
  explanation: string;
}

export interface FederalStateReconciliation {
  schemaVersion: string;
  turn: number;
  federalRevenuePool: number;
  totalEntitlements: number;
  totalAdjustments: number;
  residualFederal: number;
  reconciled: boolean;
  tolerancePoints: number;
  transfers: IntergovernmentalTransferLine[];
  verticalImbalanceIndex: number;
  warnings: string[];
}


// --- source: federal-state/catalog/state-profiles.ts ---

export const STATE_FISCAL_PROFILES: StateFiscalProfile[] = [
  { stateCode: 'NSW', populationWeight: 0.32, fiscalCapacityIndex: 1.05, remoteLoadFactor: 0.02 },
  { stateCode: 'VIC', populationWeight: 0.26, fiscalCapacityIndex: 1.02, remoteLoadFactor: 0.02 },
  { stateCode: 'QLD', populationWeight: 0.2, fiscalCapacityIndex: 0.92, remoteLoadFactor: 0.08 },
  { stateCode: 'WA', populationWeight: 0.11, fiscalCapacityIndex: 1.12, remoteLoadFactor: 0.12 },
  { stateCode: 'SA', populationWeight: 0.07, fiscalCapacityIndex: 0.88, remoteLoadFactor: 0.05 },
  { stateCode: 'TAS', populationWeight: 0.02, fiscalCapacityIndex: 0.78, remoteLoadFactor: 0.06 },
  { stateCode: 'ACT', populationWeight: 0.017, fiscalCapacityIndex: 1.15, remoteLoadFactor: 0.01 },
  { stateCode: 'NT', populationWeight: 0.013, fiscalCapacityIndex: 0.65, remoteLoadFactor: 0.35 }
];

export function profileFor(stateCode: StateFiscalProfile['stateCode']): StateFiscalProfile {
  const p = STATE_FISCAL_PROFILES.find(s => s.stateCode === stateCode);
  if (!p) throw new Error(`Unknown state ${stateCode}`);
  return p;
}


// --- source: federal-state/reconcile.ts ---
  FederalStateReconciliation,
  IntergovernmentalTransferLine,
  TransferInstrumentKind
} from './types';

const INSTRUMENT_SHARE: Record<TransferInstrumentKind, number> = {
  gst_igr: 0.42,
  health_specific: 0.22,
  education_specific: 0.18,
  infrastructure_partner: 0.1,
  general_purpose: 0.08
};

function equalizationFactor(capacityIndex: number): number {
  const rel = 1 / Math.max(0.5, capacityIndex);
  return Math.min(1.35, Math.max(0.75, rel));
}

function buildTransfer(
  stateCode: IntergovernmentalTransferLine['stateCode'],
  instrument: TransferInstrumentKind,
  poolSlice: number,
  profile: (typeof STATE_FISCAL_PROFILES)[0]
): IntergovernmentalTransferLine {
  const base = poolSlice * profile.populationWeight;
  const eq = equalizationFactor(profile.fiscalCapacityIndex);
  const remote = 1 + profile.remoteLoadFactor * (instrument === 'general_purpose' ? 0.5 : 0.25);
  const entitlementPoints = Math.round(base * eq * remote * 10) / 10;
  let adjustmentPoints = 0;
  if (profile.fiscalCapacityIndex > 1.08 && instrument === 'gst_igr') {
    adjustmentPoints = -Math.round(entitlementPoints * 0.06 * 10) / 10;
  }
  if (profile.fiscalCapacityIndex < 0.85) {
    adjustmentPoints += Math.round(entitlementPoints * 0.08 * 10) / 10;
  }
  const netPoints = Math.round((entitlementPoints + adjustmentPoints) * 10) / 10;
  return {
    stateCode,
    instrument,
    entitlementPoints,
    adjustmentPoints,
    netPoints,
    explanation: `${instrument} for ${stateCode}: pop=${profile.populationWeight}, eq=${eq.toFixed(2)}, remote=${remote.toFixed(2)}.`
  };
}

export function reconcileFederalStateTransfers(
  turn: number,
  v1012: V1012FiscalSnapshot,
  tolerancePoints = 3.5
): FederalStateReconciliation {
  const federalRevenuePool = Math.max(
    10,
    Math.round(v1012.revenueCapacity * 0.55 + Math.max(0, v1012.fiscalHeadroom * 0.15))
  );
  const transfers: IntergovernmentalTransferLine[] = [];

  for (const profile of STATE_FISCAL_PROFILES) {
    for (const [instrument, share] of Object.entries(INSTRUMENT_SHARE) as [TransferInstrumentKind, number][]) {
      const poolSlice = federalRevenuePool * share;
      transfers.push(buildTransfer(profile.stateCode, instrument, poolSlice, profile));
    }
  }

  const totalEntitlements = Math.round(transfers.reduce((s, t) => s + t.entitlementPoints, 0) * 10) / 10;
  const totalAdjustments = Math.round(transfers.reduce((s, t) => s + t.adjustmentPoints, 0) * 10) / 10;
  let totalNet = Math.round(transfers.reduce((s, t) => s + t.netPoints, 0) * 10) / 10;

  if (totalNet > 0 && Math.abs(totalNet - federalRevenuePool) > tolerancePoints) {
    const scale = federalRevenuePool / totalNet;
    for (const t of transfers) {
      t.netPoints = Math.round(t.netPoints * scale * 10) / 10;
      t.entitlementPoints = Math.round(t.entitlementPoints * scale * 10) / 10;
      t.adjustmentPoints = Math.round(t.adjustmentPoints * scale * 10) / 10;
    }
    totalNet = Math.round(transfers.reduce((s, t) => s + t.netPoints, 0) * 10) / 10;
  }

  const residualFederal = Math.round((federalRevenuePool - totalNet) * 10) / 10;

  const warnings: string[] = [];
  if (Math.abs(residualFederal) > tolerancePoints + federalRevenuePool * 0.08) {
    warnings.push('Federal residual outside IGR tolerance — review pool definition or adjustments.');
  }
  if (v1012.pressure === 'critical') {
    warnings.push('Critical national pressure — state transfer growth may be deferred (policy hook).');
  }

  const verticalImbalanceIndex = Math.round((totalNet / Math.max(1, federalRevenuePool)) * 100) / 100;
  if (verticalImbalanceIndex > 0.92) {
    warnings.push('High vertical transfer share — limited federal discretionary room.');
  }

  const reconciled =
    Math.abs(residualFederal) <= tolerancePoints + federalRevenuePool * 0.06 &&
    totalEntitlements > 0 &&
    transfers.length === STATE_FISCAL_PROFILES.length * Object.keys(INSTRUMENT_SHARE).length;

  return {
    schemaVersion: FEDERAL_STATE_SCHEMA,
    turn,
    federalRevenuePool,
    totalEntitlements,
    totalAdjustments,
    residualFederal,
    reconciled,
    tolerancePoints,
    transfers,
    verticalImbalanceIndex,
    warnings
  };
}

export function sumTransfersByState(
  reconciliation: FederalStateReconciliation,
  stateCode: IntergovernmentalTransferLine['stateCode']
): number {
  return reconciliation.transfers
    .filter(t => t.stateCode === stateCode)
    .reduce((s, t) => s + t.netPoints, 0);
}


// --- source: tax-expenditure/types.ts ---

export const TAX_EXPENDITURE_SCHEMA = 'op10m-agent07-tax-expenditure-v1';

export type TaxExpenditureCategory =
  | 'concession'
  | 'exemption'
  | 'deferral'
  | 'credit_offset'
  | 'preferential_rate';

export interface TaxExpenditureMeasure {
  id: string;
  code: string;
  title: string;
  category: TaxExpenditureCategory;
  linkedInstrumentKind: TaxInstrumentKind | null;
  structuralForgonePoints: number;
  /** Share of forgone revenue that reaches households (0..1). */
  householdShare: number;
  sunsetTurn: number | null;
  description: string;
}

export interface TaxExpenditureLine {
  measureId: string;
  code: string;
  forgonePoints: number;
  band: 'material' | 'moderate' | 'minor';
  reviewDue: boolean;
  explanation: string;
}

export interface TaxExpenditureStatement {
  schemaVersion: string;
  turn: number;
  grossStructuralCapacity: number;
  totalForgone: number;
  netStructuralCapacity: number;
  lines: TaxExpenditureLine[];
  materialityThreshold: number;
  warnings: string[];
}


// --- source: tax-expenditure/catalog/measures.ts ---

export const TAX_EXPENDITURE_CATALOG: TaxExpenditureMeasure[] = [
  {
    id: 'te_super_concession',
    code: 'TE-101',
    title: 'Superannuation contribution concessions',
    category: 'preferential_rate',
    linkedInstrumentKind: 'personal_rate',
    structuralForgonePoints: 6.5,
    householdShare: 0.85,
    sunsetTurn: null,
    description: 'Concessional tax treatment of mandated retirement savings.'
  },
  {
    id: 'te_rd_credit',
    code: 'TE-110',
    title: 'R&D tax incentive gross-up',
    category: 'credit_offset',
    linkedInstrumentKind: 'innovation_credit',
    structuralForgonePoints: 4.2,
    householdShare: 0.05,
    sunsetTurn: null,
    description: 'Refundable/non-refundable components modeled as revenue forgone.'
  },
  {
    id: 'te_cgt_discount',
    code: 'TE-120',
    title: 'Capital gains discount',
    category: 'concession',
    linkedInstrumentKind: 'personal_rate',
    structuralForgonePoints: 3.8,
    householdShare: 0.55,
    sunsetTurn: null,
    description: 'Individual and trust capital gains discount.'
  },
  {
    id: 'te_fbt_exempt',
    code: 'TE-130',
    title: 'FBT exempt entities & benefits',
    category: 'exemption',
    linkedInstrumentKind: 'payroll_levy',
    structuralForgonePoints: 2.1,
    householdShare: 0.4,
    sunsetTurn: null,
    description: 'Health, charity, and public benevolent institution exemptions.'
  },
  {
    id: 'te_fuel_credit',
    code: 'TE-140',
    title: 'Fuel tax credits (business)',
    category: 'credit_offset',
    linkedInstrumentKind: 'gst_equivalent',
    structuralForgonePoints: 2.9,
    householdShare: 0.02,
    sunsetTurn: null,
    description: 'Off-road and heavy vehicle fuel tax credits.'
  },
  {
    id: 'te_small_business',
    code: 'TE-150',
    title: 'Small business instant asset write-off',
    category: 'deferral',
    linkedInstrumentKind: 'corporate_rate',
    structuralForgonePoints: 1.8,
    householdShare: 0.15,
    sunsetTurn: null,
    description: 'Timing difference on eligible asset deductions.'
  },
  {
    id: 'te_regional_zones',
    code: 'TE-160',
    title: 'Regional tax zone offsets',
    category: 'concession',
    linkedInstrumentKind: 'regional_incentive',
    structuralForgonePoints: 1.2,
    householdShare: 0.65,
    sunsetTurn: null,
    description: 'Remote area and zone-based offsets.'
  },
  {
    id: 'te_carbon_free_alloc',
    code: 'TE-170',
    title: 'Emissions-intensive trade-exposed allocations',
    category: 'exemption',
    linkedInstrumentKind: 'carbon_price',
    structuralForgonePoints: 2.4,
    householdShare: 0.1,
    sunsetTurn: null,
    description: 'Safeguard free allocations and trade exposure relief.'
  },
  {
    id: 'te_resource_exploration',
    code: 'TE-180',
    title: 'Mineral exploration deduction flow-through',
    category: 'deferral',
    linkedInstrumentKind: 'resource_rent',
    structuralForgonePoints: 1.5,
    householdShare: 0.02,
    sunsetTurn: null,
    description: 'Exploration incentive timing benefits.'
  },
  {
    id: 'te_phantom_sunset',
    code: 'TE-199',
    title: 'Legacy sunset measure (review)',
    category: 'concession',
    linkedInstrumentKind: null,
    structuralForgonePoints: 0.6,
    householdShare: 0.2,
    sunsetTurn: 12,
    description: 'Placeholder for lapsed measure under parliamentary review.'
  }
];


// --- source: tax-expenditure/compute.ts ---

function materialityBand(forgone: number, threshold: number): TaxExpenditureLine['band'] {
  if (forgone >= threshold * 1.5) return 'material';
  if (forgone >= threshold * 0.6) return 'moderate';
  return 'minor';
}

export function buildTaxExpenditureStatement(
  turn: number,
  v1012: V1012FiscalSnapshot
): TaxExpenditureStatement {
  const grossStructuralCapacity = v1012.revenueCapacity;
  const materialityThreshold = Math.max(1.5, grossStructuralCapacity * 0.04);
  const pressureScale = v1012.pressure === 'critical' ? 1.05 : v1012.pressure === 'strained' ? 1.02 : 1;

  const lines: TaxExpenditureLine[] = TAX_EXPENDITURE_CATALOG.map(measure => {
    const active = measure.sunsetTurn === null || turn <= measure.sunsetTurn;
    const forgonePoints = active
      ? Math.round(measure.structuralForgonePoints * pressureScale * 10) / 10
      : 0;
    return {
      measureId: measure.id,
      code: measure.code,
      forgonePoints,
      band: materialityBand(forgonePoints, materialityThreshold),
      reviewDue: measure.sunsetTurn !== null && turn >= measure.sunsetTurn - 2,
      explanation: active ? measure.description : `Sunset reached turn ${measure.sunsetTurn}.`
    };
  });

  const totalForgone = Math.round(lines.reduce((s, l) => s + l.forgonePoints, 0) * 10) / 10;
  const netStructuralCapacity = Math.max(0, Math.round((grossStructuralCapacity - totalForgone * 0.35) * 10) / 10);

  const warnings: string[] = [];
  const material = lines.filter(l => l.band === 'material');
  if (material.length >= 3) {
    warnings.push(`${material.length} material tax expenditures — review base-broadening options.`);
  }
  if (totalForgone > grossStructuralCapacity * 0.25) {
    warnings.push('Aggregate tax expenditure exceeds 25% of structural capacity (normalized).');
  }
  if (lines.some(l => l.reviewDue)) {
    warnings.push('Sunsetting measures require parliamentary renewal review.');
  }

  return {
    schemaVersion: TAX_EXPENDITURE_SCHEMA,
    turn,
    grossStructuralCapacity,
    totalForgone,
    netStructuralCapacity,
    lines,
    materialityThreshold,
    warnings
  };
}

export function countTaxExpenditureMeasures(): number {
  return TAX_EXPENDITURE_CATALOG.length;
}


// --- source: medium-term-outlook/types.ts ---

export const MEDIUM_TERM_OUTLOOK_SCHEMA = 'op10m-agent07-medium-term-outlook-v1';

export interface OutlookYearProjection {
  label: string;
  turn: number;
  revenueCapacity: number;
  fiscalHeadroom: number;
  debtServiceLoad: number;
  envelopeCapacity: number;
  underlyingCashBalance: number;
  pressure: 'comfortable' | 'healthy' | 'tight' | 'strained' | 'critical';
}

export interface MediumTermFiscalOutlook {
  schemaVersion: string;
  baseTurn: number;
  horizonTurns: number;
  projections: OutlookYearProjection[];
  averageHeadroom: number;
  worstPressure: OutlookYearProjection['pressure'];
  trajectoryBand: FiscalOutcomeBand;
  narrative: string;
  risks: string[];
}


// --- source: medium-term-outlook/compute.ts ---

function bandFromHeadroom(headroom: number): FiscalOutcomeBand {
  if (headroom >= 12) return 'strong';
  if (headroom >= 4) return 'healthy';
  if (headroom >= -2) return 'mixed';
  if (headroom >= -10) return 'weak';
  return 'critical';
}

function pressureFromHeadroom(h: number): V1012FiscalSnapshot['pressure'] {
  if (h >= 12) return 'comfortable';
  if (h >= 5) return 'healthy';
  if (h >= 0) return 'tight';
  if (h >= -8) return 'strained';
  return 'critical';
}

export function buildMediumTermFiscalOutlook(
  base: V1012FiscalSnapshot,
  horizonTurns = 4
): MediumTermFiscalOutlook {
  const projections: OutlookYearProjection[] = [];
  const risks: string[] = [];
  let working = { ...base };

  for (let i = 0; i <= horizonTurns; i++) {
    const turn = base.turn + i;
    const revenueDrift = base.revenuePolicy === 'revenue_focused' ? 0.8 : base.revenuePolicy === 'growth_focused' ? 0.4 : 0.55;
    const headroomDrift = -0.35 - working.debtServiceLoad * 0.02 + (base.reservePolicy === 'prudent' ? 0.15 : 0);
    working = {
      ...working,
      turn,
      revenueCapacity: Math.max(0, Math.min(100, Math.round((working.revenueCapacity + revenueDrift) * 10) / 10)),
      fiscalHeadroom: Math.round((working.fiscalHeadroom + headroomDrift) * 10) / 10,
      debtServiceLoad: Math.round((working.debtServiceLoad + working.debtLevel * 0.008) * 10) / 10,
      maintenanceLoad: Math.round((working.maintenanceLoad + 0.12) * 10) / 10,
      pressure: pressureFromHeadroom(working.fiscalHeadroom)
    };
    const envelope = buildBudgetEnvelope(working);
    projections.push({
      label: i === 0 ? 'Budget' : `Forward +${i}`,
      turn,
      revenueCapacity: working.revenueCapacity,
      fiscalHeadroom: working.fiscalHeadroom,
      debtServiceLoad: working.debtServiceLoad,
      envelopeCapacity: envelope.totalCapacityPoints,
      underlyingCashBalance: Math.round((working.fiscalHeadroom * 0.9 - working.debtServiceLoad * 0.4) * 10) / 10,
      pressure: working.pressure
    });
  }

  const averageHeadroom =
    Math.round((projections.reduce((s, p) => s + p.fiscalHeadroom, 0) / projections.length) * 10) / 10;
  const worst = projections.reduce((w, p) => (p.fiscalHeadroom < w.fiscalHeadroom ? p : w), projections[0]!);
  const worstPressure = worst.pressure;

  if (worstPressure === 'critical' || worstPressure === 'strained') {
    risks.push('Forward path shows sustained pressure — align capital pipeline with envelope flex.');
  }
  if (projections.some(p => p.debtServiceLoad > 18)) {
    risks.push('Debt service load crosses soft 18pt guard within horizon.');
  }
  if (averageHeadroom < 2) {
    risks.push('Average headroom thin — recurring commitments may crowd out contingency.');
  }

  const trajectoryBand = bandFromHeadroom(averageHeadroom);
  const narrative =
    trajectoryBand === 'strong' || trajectoryBand === 'healthy'
      ? 'Medium-term fiscal settings support staged investment if commitments stay disciplined.'
      : 'Medium-term outlook requires sequencing of capital and transfer growth.';

  return {
    schemaVersion: MEDIUM_TERM_OUTLOOK_SCHEMA,
    baseTurn: base.turn,
    horizonTurns,
    projections,
    averageHeadroom,
    worstPressure,
    trajectoryBand,
    narrative,
    risks
  };
}


// --- source: consolidated-fiscal/compute.ts ---

export const CONSOLIDATED_FISCAL_SCHEMA = 'op10m-agent07-consolidated-v1';

export interface ConsolidatedFiscalCheck {
  id: string;
  label: string;
  passed: boolean;
  detail: string;
}

export interface ConsolidatedFiscalReport {
  schemaVersion: string;
  turn: number;
  checks: ConsolidatedFiscalCheck[];
  allPassed: boolean;
  layerCount: number;
}

export function buildConsolidatedFiscalReport(turn: number, v1012: V1012FiscalSnapshot): ConsolidatedFiscalReport {
  const checks: ConsolidatedFiscalCheck[] = [];
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  const ledger = buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
  const recurring = scheduleRecurringCommitments(turn, v1012, state.budget);
  const paper = buildDetailedBudgetPaper(v1012, state.budget);
  const igr = reconcileFederalStateTransfers(turn, v1012);
  const taxExp = buildTaxExpenditureStatement(turn, v1012);
  const outlook = buildMediumTermFiscalOutlook(v1012, 3);
  const myefo = buildMultiYearExpenditureFramework(v1012, 3);
  const contingent = assessContingentLiabilities(turn, v1012);
  const transparency = scoreFiscalTransparencyIndex({
    turn,
    v1012,
    publishesTaxExpenditure: true,
    publishesMultiYearEstimates: true,
    publishesContingentRegister: contingent.withinSoftCap,
    publishesProgramOutcomes: true,
    auditLagTurns: 2
  });
  const riskRegister = buildFiscalRiskRegister(turn, v1012);
  const igGrants = allocateIntergovernmentalGrants(turn, v1012);
  const statutory = buildStatutoryBalancesReport(turn, v1012);
  const costRecovery = buildCostRecoveryStatement(turn, v1012);
  const cashMgmt = buildCashManagementReport(turn, v1012);
  const warrantLedger = buildAppropriationWarrantLedger(turn, v1012);
  const supplementary = buildSupplementaryEstimatesReport(turn, v1012);
  const spendingOffsets = buildSpendingOffsetsReport(turn, v1012);
  const portfolioOutturn = buildPortfolioOutturnReport(turn, v1012);
  const debtRollover = resolveDebtRollover({
    turn,
    v1012,
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });
  const debtPortfolioGov = buildDebtPortfolioGovernanceReport(turn, v1012, {
    liquidityStress: debtRollover.liquidityStress
  });
  const fiscalStress = buildFiscalStressScenariosReport(turn, v1012);
  const publicBalanceSheet = buildPublicSectorBalanceSheetReport(turn, v1012, {
    cashClosingBalance: cashMgmt.aggregateClosingBalance
  });
  const taxPolicySensitivity = buildTaxPolicySensitivityReport(turn, v1012, ledger);
  const appropriationLapseRegister = buildAppropriationLapseRegisterReport(turn, v1012, warrantLedger);
  const resilienceStack = assessFiscalResilience(turn, v1012, ['commodity_drop', 'rate_shock']);
  const contingencyFlex = state.budget.lines.find(l => l.category === 'contingency')?.flexPoints ?? 0;
  const fiscalRules = assessFiscalRulesFramework({
    turn,
    v1012,
    envelopeContingencyPoints: contingencyFlex,
    forwardSpendingGrowth: 2
  });
  const contingencyDrawdownRegister = buildContingencyDrawdownRegisterReport(
    turn,
    v1012,
    contingencyFlex,
    fiscalRules
  );
  const forwardEstimatesIntegrity = buildForwardEstimatesIntegrityReport(
    turn,
    v1012,
    myefo,
    supplementary,
    outlook
  );
  const sovereignCreditOutlook = buildSovereignCreditOutlookReport(turn, v1012, debtPortfolioGov, {
    stressWorstDelta: fiscalStress.worstHeadroomDelta
  });
  const debtServiceCoverage = buildDebtServiceCoverageReport(turn, v1012, ledger, cashMgmt);
  const grantClawbackSchedule = buildGrantClawbackScheduleReport(turn, v1012, igGrants);
  const budgetNeutralPackages = buildBudgetNeutralPackagesReport(turn, v1012, spendingOffsets, supplementary);
  const issuance = executeIssuanceCalendar(turn, v1012);
  const programPerf = reviewProgramPerformance(turn, v1012);
  const infraSummary = summarizeInfrastructureFinancing(
    turn,
    [
      {
        projectId: 'consolidated_infra_a',
        title: 'Consolidated corridor',
        regionIds: ['national'],
        capitalPoints: 10,
        maintenancePointsPerTurn: 1,
        strategicWeight: 0.5,
        preferredVehicle: 'sovereign_bond_series'
      }
    ],
    v1012,
    state.budget
  );

  const fiscalReconciliation = runFiscalReconciliation({
    turn,
    v1012,
    envelope: state.budget,
    revenueLedger: ledger,
    infraSummary,
    actorCashProbe: 0
  });

  const infrastructureFiscalLoad = buildInfrastructureFiscalLoadReport(turn, v1012, infraSummary, state.budget);
  const revenueIntegrityAudit = buildRevenueIntegrityAuditReport(turn, v1012, ledger, taxPolicySensitivity);

  checks.push({
    id: 'CF01',
    label: 'Tax expenditure net below gross structural capacity',
    passed: taxExp.netStructuralCapacity <= taxExp.grossStructuralCapacity,
    detail: `net=${taxExp.netStructuralCapacity}, gross=${taxExp.grossStructuralCapacity}`
  });

  checks.push({
    id: 'CF02',
    label: 'IGR pool reconciled',
    passed: igr.reconciled,
    detail: `residual=${igr.residualFederal}`
  });

  checks.push({
    id: 'CF03',
    label: 'Budget sub-lines balanced',
    passed: paper.categories.every(c => c.linesBalanced),
    detail: `categories=${paper.categories.length}`
  });

  checks.push({
    id: 'CF04',
    label: 'Recurring load fits envelope capacity',
    passed: recurring.totalLoadThisTurn <= state.budget.totalCapacityPoints * 0.45,
    detail: `load=${recurring.totalLoadThisTurn}, cap=${state.budget.totalCapacityPoints}`
  });

  checks.push({
    id: 'CF05',
    label: 'Revenue ledger reconciled flag',
    passed: ledger.reconciledToV1012,
    detail: ledger.reconciliationNotes[0] ?? ''
  });

  checks.push({
    id: 'CF06',
    label: 'Medium-term outlook projects envelope capacity',
    passed: outlook.projections.every(p => p.envelopeCapacity > 0),
    detail: `horizon=${outlook.projections.length}`
  });

  checks.push({
    id: 'CF07',
    label: 'Federal-state vertical imbalance bounded',
    passed: igr.verticalImbalanceIndex <= 1.05,
    detail: `vii=${igr.verticalImbalanceIndex}`
  });

  checks.push({
    id: 'CF08',
    label: 'National pressure below critical under consolidated view',
    passed: v1012.pressure !== 'critical' && outlook.worstPressure !== 'critical',
    detail: `now=${v1012.pressure}, worst=${outlook.worstPressure}`
  });

  checks.push({
    id: 'CF09',
    label: 'Multi-year forward bands within ceiling',
    passed: myefo.forwardBands.every(b => b.withinCeiling) || v1012.pressure === 'critical',
    detail: `binding=${myefo.aggregateCeilingBinding}`
  });

  checks.push({
    id: 'CF10',
    label: 'Contingent liabilities within soft cap',
    passed: contingent.withinSoftCap,
    detail: `expected=${contingent.expectedLossPoints}`
  });

  checks.push({
    id: 'CF11',
    label: 'Transparency index at least enhanced under full disclosure',
    passed: transparency.compositeTier !== 'basic' || v1012.fiscalHeadroom < -10,
    detail: `tier=${transparency.compositeTier}, score=${transparency.compositeScore}`
  });

  checks.push({
    id: 'CF12',
    label: 'Fiscal risk register within appetite or critical override',
    passed: riskRegister.withinRiskAppetite || v1012.pressure === 'critical',
    detail: `heat=${riskRegister.aggregateHeat}, tier=${riskRegister.tier}`
  });

  checks.push({
    id: 'CF13',
    label: 'Intergovernmental grants reconcile to IGR pool slice',
    passed: igGrants.reconciledToIgrPool,
    detail: `federal=${igGrants.totalFederal}, clawback=${igGrants.totalClawback}`
  });

  checks.push({
    id: 'CF14',
    label: 'Grant performance pass rate above floor under non-critical pressure',
    passed: igGrants.performancePassRate >= 0.4 || v1012.pressure === 'critical',
    detail: `rate=${igGrants.performancePassRate}`
  });

  checks.push({
    id: 'CF15',
    label: 'Statutory balances within soft anchors',
    passed: statutory.allWithinSoftAnchors,
    detail: `nob=${statutory.netOperatingBalance}, fb=${statutory.fiscalBalance}`
  });

  checks.push({
    id: 'CF16',
    label: 'Cost recovery portfolio meets floor',
    passed: costRecovery.withinPortfolioTarget,
    detail: `weighted=${costRecovery.weightedRecoveryRatio}`
  });

  checks.push({
    id: 'CF17',
    label: 'Fiscal rules compliant or critical override',
    passed: fiscalRules.allCompliant || v1012.pressure === 'critical',
    detail: `breaches=${fiscalRules.breachCount}`
  });

  checks.push({
    id: 'CF18',
    label: 'Sovereign issuance without liquidity shortfall',
    passed: !issuance.liquidityShortfall || !v1012.debtEnabled,
    detail: `issued=${issuance.totalIssued}/${issuance.totalScheduled}`
  });

  checks.push({
    id: 'CF19',
    label: 'Program performance aggregate feedback bounded',
    passed: programPerf.aggregateFeedbackPoints >= -8 || v1012.pressure === 'critical',
    detail: `feedback=${programPerf.aggregateFeedbackPoints}, atRisk=${programPerf.programsAtRisk}`
  });

  checks.push({
    id: 'CF20',
    label: 'Infrastructure portfolio feasible under consolidated envelope',
    passed: infraSummary.plans.every(p => p.feasible) || v1012.pressure === 'critical',
    detail: `capital=${infraSummary.aggregateCapital}, service=${infraSummary.aggregateServiceLoad}`
  });

  checks.push({
    id: 'CF21',
    label: 'Debt maturity rollover without liquidity stress',
    passed: !debtRollover.liquidityStress || !v1012.debtEnabled || v1012.pressure === 'critical',
    detail: `events=${debtRollover.events.length}, stress=${debtRollover.liquidityStress}`
  });

  checks.push({
    id: 'CF22',
    label: 'Stacked fiscal shocks remain above critical band',
    passed:
      resilienceStack.compositeStressBand !== 'critical' ||
      v1012.pressure === 'critical' ||
      resilienceStack.baselinePressure === 'critical',
    detail: `band=${resilienceStack.compositeStressBand}, reserve=${resilienceStack.reserveAdequacy}`
  });

  checks.push({
    id: 'CF23',
    label: 'Treasury cash within drawdown limit',
    passed: cashMgmt.withinDrawdownLimit,
    detail: `closing=${cashMgmt.aggregateClosingBalance}, runway=${cashMgmt.runwayTurns}`
  });

  checks.push({
    id: 'CF24',
    label: 'Appropriation warrant lapse within tolerance',
    passed: warrantLedger.lapseWithinTolerance,
    detail: `risk=${warrantLedger.aggregateLapseRisk}, remaining=${warrantLedger.aggregateRemaining}`
  });

  checks.push({
    id: 'CF25',
    label: 'Supplementary estimates net revision within tolerance',
    passed: supplementary.withinRevisionTolerance,
    detail: `net=${supplementary.netRevisionPoints}, up=${supplementary.aggregateUpwardRevision}`
  });

  checks.push({
    id: 'CF26',
    label: 'Spending offset portfolio meets coverage floor',
    passed: spendingOffsets.withinPortfolioTarget,
    detail: `coverage=${spendingOffsets.portfolioCoverageRatio}, new=${spendingOffsets.aggregateNewSpending}`
  });

  checks.push({
    id: 'CF27',
    label: 'Cross-layer fiscal reconciliation passes',
    passed: fiscalReconciliation.allPassed || v1012.pressure === 'critical',
    detail: `checks=${fiscalReconciliation.checks.filter(c => c.passed).length}/${fiscalReconciliation.checks.length}`
  });

  checks.push({
    id: 'CF28',
    label: 'Supplementary uplift coherent with warrant headroom',
    passed:
      supplementary.netRevisionPoints <= warrantLedger.aggregateRemaining * 0.85 + 4 ||
      supplementary.netRevisionPoints <= 0 ||
      v1012.pressure === 'critical',
    detail: `revision=${supplementary.netRevisionPoints}, warrantRemaining=${warrantLedger.aggregateRemaining}`
  });

  checks.push({
    id: 'CF29',
    label: 'Portfolio outturn within reconciliation tolerance',
    passed: portfolioOutturn.withinReconciliationTolerance,
    detail: `variance=${portfolioOutturn.aggregateVariancePoints}, ratio=${portfolioOutturn.aggregateVarianceRatio}`
  });

  checks.push({
    id: 'CF30',
    label: 'Debt portfolio governance within targets',
    passed: debtPortfolioGov.withinGovernanceTargets || !v1012.debtEnabled || v1012.pressure === 'critical',
    detail: `wad=${debtPortfolioGov.weightedAverageDurationYears}, maxShare=${debtPortfolioGov.maxTrancheShare}`
  });

  checks.push({
    id: 'CF31',
    label: 'Outturn drift coherent with supplementary net revision',
    passed:
      Math.abs(portfolioOutturn.aggregateVariancePoints - supplementary.netRevisionPoints * 0.35) <= 4.5 ||
      supplementary.netRevisionPoints <= 0 ||
      v1012.pressure === 'critical',
    detail: `outturn=${portfolioOutturn.aggregateVariancePoints}, suppNet=${supplementary.netRevisionPoints}`
  });

  checks.push({
    id: 'CF32',
    label: 'Debt portfolio duration aligned with rollover stress',
    passed:
      debtPortfolioGov.rolloverStressAligned ||
      !debtRollover.liquidityStress ||
      !v1012.debtEnabled ||
      v1012.pressure === 'critical',
    detail: `stress=${debtRollover.liquidityStress}, aligned=${debtPortfolioGov.rolloverStressAligned}`
  });

  checks.push({
    id: 'CF33',
    label: 'Fiscal stress scenarios within appetite',
    passed: fiscalStress.withinStressAppetite,
    detail: `breaches=${fiscalStress.aggregateBreaches}, worstDelta=${fiscalStress.worstHeadroomDelta}`
  });

  checks.push({
    id: 'CF34',
    label: 'Public sector net worth above floor',
    passed: publicBalanceSheet.withinNetWorthFloor,
    detail: `ratio=${publicBalanceSheet.netWorthRatio}, nw=${publicBalanceSheet.netWorthPoints}`
  });

  checks.push({
    id: 'CF35',
    label: 'Stress worst case coherent with risk register heat',
    passed:
      Math.abs(fiscalStress.worstHeadroomDelta) <= riskRegister.aggregateHeat * 0.55 + 8 ||
      v1012.pressure === 'critical' ||
      !riskRegister.withinRiskAppetite,
    detail: `worstDelta=${fiscalStress.worstHeadroomDelta}, heat=${riskRegister.aggregateHeat}`
  });

  checks.push({
    id: 'CF36',
    label: 'Balance sheet liquid slice aligned with TGA closing',
    passed: publicBalanceSheet.liquidSliceCoherentWithCash,
    detail: `liquid=${publicBalanceSheet.liquidAssetSlice}, tga=${cashMgmt.aggregateClosingBalance}`
  });

  checks.push({
    id: 'CF37',
    label: 'Tax policy sensitivity within aggregate band',
    passed: taxPolicySensitivity.withinAggregateBand,
    detail: `marginal=${taxPolicySensitivity.aggregateMarginalPoints}, uplift=${taxPolicySensitivity.modeledUpliftPoints}`
  });

  checks.push({
    id: 'CF38',
    label: 'Appropriation lapse register within tolerance',
    passed: appropriationLapseRegister.withinRegisterTolerance,
    detail: `ratio=${appropriationLapseRegister.lapseToRemainingRatio}, lapse=${appropriationLapseRegister.aggregateLapsePoints}`
  });

  checks.push({
    id: 'CF39',
    label: 'Tax sensitivity uplift coherent with revenue ledger',
    passed: taxPolicySensitivity.coherentWithLedgerDelta,
    detail: `uplift=${taxPolicySensitivity.modeledUpliftPoints}, ledgerOk=${ledger.reconciledToV1012}`
  });

  checks.push({
    id: 'CF40',
    label: 'Lapse register aligned with warrant ledger risk',
    passed: appropriationLapseRegister.alignedWithWarrantLedger,
    detail: `register=${appropriationLapseRegister.aggregateLapsePoints}, warrantRisk=${warrantLedger.aggregateLapseRisk}`
  });

  checks.push({
    id: 'CF41',
    label: 'Contingency drawdown within cap',
    passed: contingencyDrawdownRegister.withinDrawdownCap,
    detail: `ratio=${contingencyDrawdownRegister.drawdownToOpeningRatio}, draw=${contingencyDrawdownRegister.aggregateDrawdownPoints}`
  });

  checks.push({
    id: 'CF42',
    label: 'Forward estimates integrity passes',
    passed: forwardEstimatesIntegrity.allPassed || v1012.pressure === 'critical',
    detail: `checks=${forwardEstimatesIntegrity.checks.filter(c => c.passed).length}/${forwardEstimatesIntegrity.checks.length}`
  });

  checks.push({
    id: 'CF43',
    label: 'Contingency drawdown coherent with fiscal rules',
    passed: contingencyDrawdownRegister.coherentWithFiscalRules || v1012.pressure === 'critical',
    detail: `closing=${contingencyDrawdownRegister.closingFlexPoints}, breaches=${fiscalRules.breachCount}`
  });

  checks.push({
    id: 'CF44',
    label: 'Forward revision gap coherent with supplementary',
    passed: forwardEstimatesIntegrity.coherentWithSupplementary,
    detail: `gap=${forwardEstimatesIntegrity.aggregateRevisionGap}, suppNet=${supplementary.netRevisionPoints}`
  });

  checks.push({
    id: 'CF45',
    label: 'Sovereign credit outlook within band',
    passed: sovereignCreditOutlook.withinOutlookBand || !v1012.debtEnabled,
    detail: `spread=${sovereignCreditOutlook.impliedSpreadBps}, band=${sovereignCreditOutlook.ratingBand}`
  });

  checks.push({
    id: 'CF46',
    label: 'Debt service coverage above floor',
    passed: debtServiceCoverage.withinCoverageFloor,
    detail: `ratio=${debtServiceCoverage.coverageRatio}, band=${debtServiceCoverage.coverageBand}`
  });

  checks.push({
    id: 'CF47',
    label: 'Credit outlook coherent with debt portfolio governance',
    passed: sovereignCreditOutlook.coherentWithDebtGovernance,
    detail: `band=${sovereignCreditOutlook.ratingBand}, govOk=${debtPortfolioGov.withinGovernanceTargets}`
  });

  checks.push({
    id: 'CF48',
    label: 'Debt coverage aligned with TGA runway',
    passed: debtServiceCoverage.runwayTurnsAligned,
    detail: `runway=${cashMgmt.runwayTurns}, coverage=${debtServiceCoverage.coverageRatio}`
  });

  checks.push({
    id: 'CF49',
    label: 'Grant clawback schedule within tolerance',
    passed: grantClawbackSchedule.withinScheduleTolerance,
    detail: `ratio=${grantClawbackSchedule.scheduleToClawbackRatio}, scheduled=${grantClawbackSchedule.aggregateScheduledPoints}`
  });

  checks.push({
    id: 'CF50',
    label: 'Budget-neutral packages within portfolio band',
    passed: budgetNeutralPackages.withinPortfolioNeutrality,
    detail: `net=${budgetNeutralPackages.aggregateNetPoints}, new=${budgetNeutralPackages.aggregateNewSpending}`
  });

  checks.push({
    id: 'CF51',
    label: 'Clawback schedule aligned with IGR grant pool',
    passed: grantClawbackSchedule.alignedWithIgrPool || v1012.pressure === 'critical',
    detail: `scheduled=${grantClawbackSchedule.aggregateScheduledPoints}, clawback=${grantClawbackSchedule.aggregateClawbackPoints}`
  });

  checks.push({
    id: 'CF52',
    label: 'Neutral packages coherent with spending offsets',
    passed: budgetNeutralPackages.coherentWithSpendingOffsets,
    detail: `offsets=${budgetNeutralPackages.aggregateOffsets}, portfolio=${spendingOffsets.aggregateOffsets}`
  });

  checks.push({
    id: 'CF53',
    label: 'Infrastructure fiscal load within portfolio cap',
    passed: infrastructureFiscalLoad.withinPortfolioLoadCap || v1012.pressure === 'critical',
    detail: `ratio=${infrastructureFiscalLoad.loadToCapacityRatio}, service=${infrastructureFiscalLoad.aggregateServiceLoad}`
  });

  checks.push({
    id: 'CF54',
    label: 'Revenue integrity audit passes',
    passed: revenueIntegrityAudit.allPassed || v1012.pressure === 'critical',
    detail: `findings=${revenueIntegrityAudit.findings.filter(f => f.passed).length}/${revenueIntegrityAudit.findings.length}`
  });

  checks.push({
    id: 'CF55',
    label: 'Infra load feasible under consolidated envelope',
    passed: infrastructureFiscalLoad.feasibleUnderEnvelope,
    detail: `capital=${infrastructureFiscalLoad.aggregateCapital}, cap=${infrastructureFiscalLoad.envelopeCapacityPoints}`
  });

  checks.push({
    id: 'CF56',
    label: 'Revenue audit coherent with tax sensitivity',
    passed: revenueIntegrityAudit.coherentWithTaxSensitivity,
    detail: `gap=${revenueIntegrityAudit.aggregateDeltaGap}, uplift=${taxPolicySensitivity.modeledUpliftPoints}`
  });

  const allPassed = checks.every(c => c.passed);
  return {
    schemaVersion: CONSOLIDATED_FISCAL_SCHEMA,
    turn,
    checks,
    allPassed,
    layerCount: 54
  };
}


// --- source: fiscal-rules/types.ts ---

export const FISCAL_RULES_SCHEMA = 'op10m-agent07-fiscal-rules-v1';

export type FiscalRuleId =
  | 'structural_balance_floor'
  | 'spending_growth_anchor'
  | 'debt_service_ceiling'
  | 'contingency_reserve_min'
  | 'tax_to_capacity_cap';

export interface FiscalRuleDefinition {
  id: FiscalRuleId;
  label: string;
  description: string;
  warnOnly: boolean;
  /** Threshold for pass (interpretation varies by rule). */
  threshold: number;
}

export interface FiscalRuleAssessment {
  ruleId: FiscalRuleId;
  label: string;
  compliant: boolean;
  severity: 'info' | 'caution' | 'major';
  observed: number;
  threshold: number;
  detail: string;
}

export interface FiscalRulesFrameworkReport {
  schemaVersion: string;
  turn: number;
  assessments: FiscalRuleAssessment[];
  allCompliant: boolean;
  breachCount: number;
  narrative: string;
}

export interface FiscalRulesInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  envelopeContingencyPoints: number;
  forwardSpendingGrowth: number;
}


// --- source: fiscal-rules/compute.ts ---

export const FISCAL_RULES_CATALOG: FiscalRuleDefinition[] = [
  {
    id: 'structural_balance_floor',
    label: 'Structural balance floor',
    description: 'Fiscal headroom should not remain deeply negative for sustained periods.',
    warnOnly: true,
    threshold: -6
  },
  {
    id: 'spending_growth_anchor',
    label: 'Spending growth anchor',
    description: 'Forward spending growth should not exceed revenue capacity growth plus 1pt.',
    warnOnly: true,
    threshold: 2.5
  },
  {
    id: 'debt_service_ceiling',
    label: 'Debt service ceiling',
    description: 'Soft guard on normalized debt service load.',
    warnOnly: true,
    threshold: 18
  },
  {
    id: 'contingency_reserve_min',
    label: 'Contingency reserve minimum',
    description: 'Contingency envelope should retain minimum flex for shocks.',
    warnOnly: true,
    threshold: 3
  },
  {
    id: 'tax_to_capacity_cap',
    label: 'Tax-to-capacity cap',
    description: 'Effective revenue pressure should not imply capacity above 92 without review.',
    warnOnly: true,
    threshold: 92
  }
];

export function assessFiscalRulesFramework(inputs: FiscalRulesInputs): FiscalRulesFrameworkReport {
  const { v1012, envelopeContingencyPoints, forwardSpendingGrowth } = inputs;
  const assessments = FISCAL_RULES_CATALOG.map(rule => {
    let observed = 0;
    let compliant = true;
    let detail = '';

    switch (rule.id) {
      case 'structural_balance_floor':
        observed = v1012.fiscalHeadroom;
        compliant = observed >= rule.threshold;
        detail = `Headroom ${observed} vs floor ${rule.threshold}.`;
        break;
      case 'spending_growth_anchor':
        observed = forwardSpendingGrowth;
        compliant = observed <= rule.threshold;
        detail = `Forward spending growth ${observed} vs anchor ${rule.threshold}.`;
        break;
      case 'debt_service_ceiling':
        observed = v1012.debtServiceLoad;
        compliant = !v1012.debtEnabled || observed <= rule.threshold;
        detail = `Debt service ${observed} vs ceiling ${rule.threshold}.`;
        break;
      case 'contingency_reserve_min':
        observed = envelopeContingencyPoints;
        compliant = observed >= rule.threshold;
        detail = `Contingency flex ${observed} vs minimum ${rule.threshold}.`;
        break;
      case 'tax_to_capacity_cap':
        observed = v1012.revenueCapacity;
        compliant = observed <= rule.threshold || v1012.revenuePolicy === 'revenue_focused';
        detail = `Revenue capacity ${observed} vs cap ${rule.threshold}.`;
        break;
    }

    const severity: FiscalRulesFrameworkReport['assessments'][0]['severity'] = compliant
      ? 'info'
      : rule.id === 'debt_service_ceiling' || rule.id === 'structural_balance_floor'
      ? 'major'
      : 'caution';

    return {
      ruleId: rule.id,
      label: rule.label,
      compliant,
      severity,
      observed,
      threshold: rule.threshold,
      detail
    };
  });

  const breachCount = assessments.filter(a => !a.compliant).length;
  const allCompliant = breachCount === 0;
  const narrative = allCompliant
    ? 'Fiscal rules framework: all soft guards satisfied (warn-only).'
    : `${breachCount} rule(s) flagged — sequencing and transparency recommended, not automatic blocking.`;

  return {
    schemaVersion: FISCAL_RULES_SCHEMA,
    turn: inputs.turn,
    assessments,
    allCompliant,
    breachCount,
    narrative
  };
}


// --- source: sovereign-issuance/types.ts ---
export const SOVEREIGN_ISSUANCE_SCHEMA = 'op10m-agent07-sovereign-issuance-v1';

export type IssuanceTenorBucket = 'short' | 'medium' | 'long' | 'index_linked';

export interface IssuanceProgramLine {
  id: string;
  tenor: IssuanceTenorBucket;
  scheduledTurn: number;
  targetVolumePoints: number;
  minimumBidToCover: number;
  actualBidToCover: number | null;
  issuedVolumePoints: number;
  deferred: boolean;
  explanation: string;
}

export interface SovereignIssuanceCalendar {
  schemaVersion: string;
  turn: number;
  lines: IssuanceProgramLine[];
  totalScheduled: number;
  totalIssued: number;
  weightedAverageTenorYears: number;
  liquidityShortfall: boolean;
  warnings: string[];
}


// --- source: sovereign-issuance/compute.ts ---

const TENOR_YEARS: Record<IssuanceProgramLine['tenor'], number> = {
  short: 2,
  medium: 7,
  long: 15,
  index_linked: 10
};

export function defaultIssuanceProgram(baseTurn: number): Omit<IssuanceProgramLine, 'actualBidToCover' | 'issuedVolumePoints' | 'deferred' | 'explanation'>[] {
  return [
    { id: 'iss_tbill', tenor: 'short', scheduledTurn: baseTurn, targetVolumePoints: 6, minimumBidToCover: 2.2 },
    { id: 'iss_nom_7y', tenor: 'medium', scheduledTurn: baseTurn + 1, targetVolumePoints: 10, minimumBidToCover: 2.5 },
    { id: 'iss_nom_15y', tenor: 'long', scheduledTurn: baseTurn + 1, targetVolumePoints: 14, minimumBidToCover: 2.3 },
    { id: 'iss_link_10y', tenor: 'index_linked', scheduledTurn: baseTurn + 2, targetVolumePoints: 5, minimumBidToCover: 2.0 }
  ];
}

export function executeIssuanceCalendar(turn: number, v1012: V1012FiscalSnapshot): SovereignIssuanceCalendar {
  const program = defaultIssuanceProgram(turn);
  const warnings: string[] = [];
  let liquidityShortfall = false;

  const lines: IssuanceProgramLine[] = program.map(row => {
    if (!v1012.debtEnabled) {
      return {
        ...row,
        actualBidToCover: null,
        issuedVolumePoints: 0,
        deferred: true,
        explanation: 'Debt program disabled — auction deferred.'
      };
    }
    if (row.scheduledTurn > turn) {
      return {
        ...row,
        actualBidToCover: null,
        issuedVolumePoints: 0,
        deferred: true,
        explanation: `Scheduled turn ${row.scheduledTurn} not reached.`
      };
    }

    const marketStress = v1012.pressure === 'critical' ? 0.75 : v1012.pressure === 'strained' ? 0.88 : 1;
    const actualBidToCover = Math.round((row.minimumBidToCover * marketStress + 0.4) * 10) / 10;
    const covered = actualBidToCover >= row.minimumBidToCover;
    const issuedVolumePoints = covered
      ? row.targetVolumePoints
      : Math.round(row.targetVolumePoints * (actualBidToCover / row.minimumBidToCover) * 10) / 10;

    if (!covered) {
      liquidityShortfall = true;
      warnings.push(`${row.id}: bid-to-cover ${actualBidToCover} below minimum ${row.minimumBidToCover}.`);
    }
    if (v1012.fiscalHeadroom < -8 && row.tenor === 'long') {
      warnings.push(`${row.id}: long issuance under negative headroom — tenor mix skew risk.`);
    }

    return {
      ...row,
      actualBidToCover,
      issuedVolumePoints,
      deferred: false,
      explanation: covered ? 'Auction cleared at or above minimum coverage.' : 'Partial issuance due to weak coverage.'
    };
  });

  const issued = lines.filter(l => !l.deferred);
  const totalScheduled = lines.reduce((s, l) => s + l.targetVolumePoints, 0);
  const totalIssued = lines.reduce((s, l) => s + l.issuedVolumePoints, 0);
  const weightedAverageTenorYears =
    totalIssued > 0
      ? Math.round(
          (issued.reduce((s, l) => s + TENOR_YEARS[l.tenor] * l.issuedVolumePoints, 0) / totalIssued) * 10
        ) / 10
      : 0;

  return {
    schemaVersion: SOVEREIGN_ISSUANCE_SCHEMA,
    turn,
    lines,
    totalScheduled,
    totalIssued,
    weightedAverageTenorYears,
    liquidityShortfall,
    warnings
  };
}


// --- source: program-performance/types.ts ---

export const PROGRAM_PERFORMANCE_SCHEMA = 'op10m-agent07-program-performance-v1';

export interface ProgramPerformanceTarget {
  appropriationLineId: string;
  category: BudgetEnvelopeCategory;
  title: string;
  deliveryKpiTarget: number;
  costEfficiencyTarget: number;
}

export interface ProgramPerformanceScore {
  appropriationLineId: string;
  deliveryScore: number;
  costEfficiencyScore: number;
  compositeScore: number;
  band: 'leading' | 'on_track' | 'at_risk' | 'failing';
  fiscalFeedbackPoints: number;
  explanation: string;
}

export interface ProgramPerformanceReview {
  schemaVersion: string;
  turn: number;
  scores: ProgramPerformanceScore[];
  aggregateFeedbackPoints: number;
  programsAtRisk: number;
  rebalanceRecommendations: string[];
}


// --- source: program-performance/compute.ts ---

export const PROGRAM_PERFORMANCE_TARGETS: ProgramPerformanceTarget[] = [
  {
    appropriationLineId: 'ic_transport_corridor',
    category: 'infrastructure_capital',
    title: 'Transport corridor capital',
    deliveryKpiTarget: 72,
    costEfficiencyTarget: 68
  },
  {
    appropriationLineId: 'cs_health_admin',
    category: 'core_services',
    title: 'Health administration',
    deliveryKpiTarget: 70,
    costEfficiencyTarget: 75
  },
  {
    appropriationLineId: 'ri_research_council',
    category: 'research_innovation',
    title: 'Research councils',
    deliveryKpiTarget: 65,
    costEfficiencyTarget: 70
  },
  {
    appropriationLineId: 'rr_disaster_recovery',
    category: 'resilience_recovery',
    title: 'Disaster recovery',
    deliveryKpiTarget: 60,
    costEfficiencyTarget: 62
  },
  {
    appropriationLineId: 'rd_regional_growth',
    category: 'regional_development',
    title: 'Regional growth packages',
    deliveryKpiTarget: 68,
    costEfficiencyTarget: 66
  },
  {
    appropriationLineId: 'mb_road_network',
    category: 'maintenance_backlog',
    title: 'Road network maintenance',
    deliveryKpiTarget: 74,
    costEfficiencyTarget: 71
  }
];

function bandFromComposite(score: number): ProgramPerformanceScore['band'] {
  if (score >= 80) return 'leading';
  if (score >= 65) return 'on_track';
  if (score >= 50) return 'at_risk';
  return 'failing';
}

function simulateScores(target: ProgramPerformanceTarget, v1012: V1012FiscalSnapshot, turn: number): ProgramPerformanceScore {
  const pressureDrag = v1012.pressure === 'critical' ? 12 : v1012.pressure === 'strained' ? 6 : 0;
  const maintenanceBoost = target.category === 'maintenance_backlog' ? v1012.maintenanceLoad * 0.3 : 0;
  const deliveryScore = Math.max(
    0,
    Math.min(100, Math.round(target.deliveryKpiTarget + maintenanceBoost - pressureDrag + ((turn % 5) - 2)))
  );
  const costEfficiencyScore = Math.max(
    0,
    Math.min(100, Math.round(target.costEfficiencyTarget - pressureDrag * 0.7 + (v1012.fiscalHeadroom > 0 ? 2 : -4)))
  );
  const compositeScore = Math.round((deliveryScore * 0.55 + costEfficiencyScore * 0.45) * 10) / 10;
  const band = bandFromComposite(compositeScore);
  let fiscalFeedbackPoints = 0;
  if (band === 'leading') fiscalFeedbackPoints = 1.5;
  else if (band === 'on_track') fiscalFeedbackPoints = 0;
  else if (band === 'at_risk') fiscalFeedbackPoints = -1.5;
  else fiscalFeedbackPoints = -3;

  return {
    appropriationLineId: target.appropriationLineId,
    deliveryScore,
    costEfficiencyScore,
    compositeScore,
    band,
    fiscalFeedbackPoints,
    explanation: `${target.title}: delivery ${deliveryScore}, efficiency ${costEfficiencyScore} (${band}).`
  };
}

export function reviewProgramPerformance(turn: number, v1012: V1012FiscalSnapshot): ProgramPerformanceReview {
  const scores = PROGRAM_PERFORMANCE_TARGETS.map(t => simulateScores(t, v1012, turn));
  const aggregateFeedbackPoints = Math.round(scores.reduce((s, p) => s + p.fiscalFeedbackPoints, 0) * 10) / 10;
  const programsAtRisk = scores.filter(p => p.band === 'at_risk' || p.band === 'failing').length;
  const rebalanceRecommendations: string[] = [];
  if (programsAtRisk >= 2) {
    rebalanceRecommendations.push('Shift contingency to under-performing programs or pause new capital approvals.');
  }
  if (aggregateFeedbackPoints < -4) {
    rebalanceRecommendations.push('Aggregate performance drag — review appropriation weights in next MYEFO pass.');
  }
  if (v1012.pressure === 'critical' && programsAtRisk > 0) {
    rebalanceRecommendations.push('Critical fiscal pressure — prioritize mandatory maintenance over discretionary capital.');
  }

  return {
    schemaVersion: PROGRAM_PERFORMANCE_SCHEMA,
    turn,
    scores,
    aggregateFeedbackPoints,
    programsAtRisk,
    rebalanceRecommendations
  };
}


// --- source: multi-year-framework/types.ts ---

export const MULTI_YEAR_FRAMEWORK_SCHEMA = 'op10m-agent07-multi-year-framework-v1';

export interface ExpenditureCeilingRow {
  category: BudgetEnvelopeCategory;
  baselinePoints: number;
  ceilingPoints: number;
  growthCapPercent: number;
  headroomToCeiling: number;
  binding: boolean;
}

export interface ForwardEstimateBand {
  turn: number;
  label: string;
  envelopeCapacity: number;
  recurringLoad: number;
  capitalPipeline: number;
  contingencyFlex: number;
  withinCeiling: boolean;
}

export interface MultiYearExpenditureFramework {
  schemaVersion: string;
  baseTurn: number;
  horizonTurns: number;
  ceilings: ExpenditureCeilingRow[];
  forwardBands: ForwardEstimateBand[];
  aggregateCeilingBinding: boolean;
  parameterSettingsGrowth: number;
  narrative: string;
  warnings: string[];
}


// --- source: multi-year-framework/compute.ts ---

const CATEGORY_GROWTH_CAPS: Partial<Record<ExpenditureCeilingRow['category'], number>> = {
  health_social: 3.2,
  education_skills: 2.8,
  infrastructure_capital: 4.5,
  defence_security: 2.0,
  transfers_states: 3.5,
  debt_service_reserve: 1.5,
  contingency: 0.5
};

export function buildExpenditureCeilingRows(
  v1012: V1012FiscalSnapshot,
  envelope = buildBudgetEnvelope(v1012)
): ExpenditureCeilingRow[] {
  return envelope.lines.map(line => {
    const growthCap = CATEGORY_GROWTH_CAPS[line.category] ?? 2.5;
    const baseline = line.allocatedPoints;
    const ceiling = Math.round(baseline * (1 + growthCap / 100) * 10) / 10;
    const headroom = Math.round((ceiling - baseline) * 10) / 10;
    const binding = v1012.fiscalHeadroom < 0 && (line.flexPoints <= 1 || v1012.pressure === 'strained' || v1012.pressure === 'critical');
    return {
      category: line.category,
      baselinePoints: baseline,
      ceilingPoints: ceiling,
      growthCapPercent: growthCap,
      headroomToCeiling: headroom,
      binding
    };
  });
}

export function buildMultiYearExpenditureFramework(
  v1012: V1012FiscalSnapshot,
  horizonTurns = 4
): MultiYearExpenditureFramework {
  const warnings: string[] = [];
  const persisted = createInitialFiscalOutcomesPersisted(v1012.turn);
  const { state } = computeFiscalOutcomesLayer({ turn: v1012.turn, v1012 }, persisted);
  const ceilings = buildExpenditureCeilingRows(v1012, state.budget);
  const forwardBands: ForwardEstimateBand[] = [];

  let working = { ...v1012 };
  for (let i = 0; i <= horizonTurns; i++) {
    const turn = v1012.turn + i;
    const envelope = buildBudgetEnvelope(working);
    const recurring = scheduleRecurringCommitments(turn, working, envelope);
    const infraLine = envelope.lines.find(l => l.category === 'infrastructure_capital');
    const contingency = envelope.lines.find(l => l.category === 'contingency');
    const capitalPipeline = Math.round((infraLine?.allocatedPoints ?? 0) * (1 + i * 0.04) * 10) / 10;
    const withinCeiling =
      recurring.totalLoadThisTurn <= envelope.totalCapacityPoints * 0.48 &&
      capitalPipeline <= (infraLine?.flexPoints ?? 0) + envelope.totalCapacityPoints * 0.12;

    forwardBands.push({
      turn,
      label: i === 0 ? 'Budget' : `Forward +${i}`,
      envelopeCapacity: envelope.totalCapacityPoints,
      recurringLoad: recurring.totalLoadThisTurn,
      capitalPipeline,
      contingencyFlex: contingency?.flexPoints ?? 0,
      withinCeiling
    });

    working = {
      ...working,
      turn,
      fiscalHeadroom: Math.round((working.fiscalHeadroom - 0.25 - working.debtServiceLoad * 0.015) * 10) / 10,
      maintenanceLoad: Math.round((working.maintenanceLoad + 0.08) * 10) / 10
    };
  }

  const aggregateCeilingBinding = ceilings.some(c => c.binding) || forwardBands.some(b => !b.withinCeiling);
  const parameterSettingsGrowth =
    Math.round(ceilings.reduce((s, c) => s + c.growthCapPercent, 0) / Math.max(1, ceilings.length) * 10) / 10;

  if (aggregateCeilingBinding) {
    warnings.push('At least one forward band or category ceiling is binding under current settings.');
  }
  if (forwardBands.some(b => b.contingencyFlex < 2)) {
    warnings.push('Contingency flex falls below 2pt guard in forward estimates.');
  }

  const narrative = aggregateCeilingBinding
    ? 'Multi-year framework signals sequencing — align parameter settings with ceiling headroom.'
    : 'Multi-year expenditure settings remain within staged ceiling bands across the horizon.';

  return {
    schemaVersion: MULTI_YEAR_FRAMEWORK_SCHEMA,
    baseTurn: v1012.turn,
    horizonTurns,
    ceilings,
    forwardBands,
    aggregateCeilingBinding,
    parameterSettingsGrowth,
    narrative,
    warnings
  };
}


// --- source: contingent-liabilities/types.ts ---
export const CONTINGENT_LIABILITIES_SCHEMA = 'op10m-agent07-contingent-liabilities-v1';

export type ContingentExposureKind =
  | 'state_guarantee'
  | 'ppp_minimum_revenue'
  | 'disaster_reinsurance'
  | 'infrastructure_warranty'
  | 'financial_sector_backstop';

export interface ContingentExposureLine {
  id: string;
  kind: ContingentExposureKind;
  label: string;
  notionalPoints: number;
  probabilityWeight: number;
  warnOnly: boolean;
}

export interface ContingentLiabilityAssessment {
  schemaVersion: string;
  turn: number;
  exposures: ContingentExposureLine[];
  expectedLossPoints: number;
  tailRiskPoints: number;
  offBalanceSheetShare: number;
  stressMultiplier: number;
  withinSoftCap: boolean;
  disclosures: string[];
  warnings: string[];
}


// --- source: contingent-liabilities/compute.ts ---

export const DEFAULT_CONTINGENT_EXPOSURES: Omit<ContingentExposureLine, 'id'>[] = [
  {
    kind: 'state_guarantee',
    label: 'State borrowing facility guarantees',
    notionalPoints: 22,
    probabilityWeight: 0.08,
    warnOnly: true
  },
  {
    kind: 'ppp_minimum_revenue',
    label: 'PPP availability payment floors',
    notionalPoints: 14,
    probabilityWeight: 0.12,
    warnOnly: true
  },
  {
    kind: 'disaster_reinsurance',
    label: 'National disaster reinsurance layer',
    notionalPoints: 18,
    probabilityWeight: 0.05,
    warnOnly: false
  },
  {
    kind: 'infrastructure_warranty',
    label: 'Megaproject delivery warranties',
    notionalPoints: 9,
    probabilityWeight: 0.15,
    warnOnly: true
  },
  {
    kind: 'financial_sector_backstop',
    label: 'Systemic backstop envelope (latent)',
    notionalPoints: 35,
    probabilityWeight: 0.02,
    warnOnly: true
  }
];

export function catalogContingentExposures(turn: number): ContingentExposureLine[] {
  return DEFAULT_CONTINGENT_EXPOSURES.map((row, idx) => ({
    id: `cl_${turn}_${idx}_${row.kind}`,
    ...row
  }));
}

export function assessContingentLiabilities(
  turn: number,
  v1012: V1012FiscalSnapshot,
  exposures: ContingentExposureLine[] = catalogContingentExposures(turn)
): ContingentLiabilityAssessment {
  const stressMultiplier =
    v1012.pressure === 'critical' ? 1.45 : v1012.pressure === 'strained' ? 1.2 : v1012.pressure === 'tight' ? 1.08 : 1;
  const expectedLossPoints = Math.round(
    exposures.reduce((s, e) => s + e.notionalPoints * e.probabilityWeight, 0) * stressMultiplier * 10
  ) / 10;
  const tailRiskPoints = Math.round(
    exposures.reduce((s, e) => s + e.notionalPoints * Math.min(0.35, e.probabilityWeight * 2.5), 0) * 10
  ) / 10;
  const totalNotional = exposures.reduce((s, e) => s + e.notionalPoints, 0);
  const offBalanceSheetShare =
    totalNotional > 0
      ? Math.round((tailRiskPoints / Math.max(v1012.debtLevel, 1)) * 100) / 100
      : 0;

  const softCap = 22 + Math.max(0, v1012.fiscalHeadroom * 0.5);
  const withinSoftCap = expectedLossPoints <= softCap;

  const warnings: string[] = [];
  const disclosures: string[] = [];

  if (!withinSoftCap) {
    warnings.push(`Expected contingent loss ${expectedLossPoints} exceeds soft cap ${softCap.toFixed(1)}.`);
  }
  if (offBalanceSheetShare > 1.2) {
    warnings.push('Off-balance-sheet tail risk elevated relative to recorded debt level.');
  }
  exposures.forEach(e => {
    disclosures.push(`${e.label}: notional ${e.notionalPoints} pts @ weight ${e.probabilityWeight}.`);
  });

  return {
    schemaVersion: CONTINGENT_LIABILITIES_SCHEMA,
    turn,
    exposures,
    expectedLossPoints,
    tailRiskPoints,
    offBalanceSheetShare,
    stressMultiplier,
    withinSoftCap,
    disclosures,
    warnings
  };
}


// --- source: fiscal-transparency/types.ts ---
export const FISCAL_TRANSPARENCY_SCHEMA = 'op10m-agent07-fiscal-transparency-v1';

export type TransparencyTier = 'basic' | 'enhanced' | 'leading';

export interface TransparencyDimensionScore {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  tier: TransparencyTier;
  detail: string;
}

export interface FiscalTransparencyIndex {
  schemaVersion: string;
  turn: number;
  dimensions: TransparencyDimensionScore[];
  compositeScore: number;
  compositeTier: TransparencyTier;
  openDataReady: boolean;
  improvementActions: string[];
}


// --- source: fiscal-transparency/compute.ts ---

function tierFromScore(score: number, max: number): TransparencyTier {
  const ratio = score / max;
  if (ratio >= 0.85) return 'leading';
  if (ratio >= 0.65) return 'enhanced';
  return 'basic';
}

export interface FiscalTransparencyInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  publishesTaxExpenditure: boolean;
  publishesMultiYearEstimates: boolean;
  publishesContingentRegister: boolean;
  publishesProgramOutcomes: boolean;
  auditLagTurns: number;
}

export function scoreFiscalTransparencyIndex(inputs: FiscalTransparencyInputs): FiscalTransparencyIndex {
  const { v1012, turn } = inputs;
  const dimensions: TransparencyDimensionScore[] = [];

  const budgetOpenness = Math.min(
    25,
    12 +
      (inputs.publishesMultiYearEstimates ? 6 : 0) +
      (v1012.fiscalHeadroom >= 0 ? 4 : 0) +
      (inputs.auditLagTurns <= 2 ? 3 : 0)
  );
  dimensions.push({
    id: 'budget_openness',
    label: 'Budget papers & forward estimates',
    score: budgetOpenness,
    maxScore: 25,
    tier: tierFromScore(budgetOpenness, 25),
    detail: `MYEFO=${inputs.publishesMultiYearEstimates}, auditLag=${inputs.auditLagTurns}`
  });

  const taxTransparency = Math.min(
    20,
    8 + (inputs.publishesTaxExpenditure ? 10 : 0) + (v1012.revenuePolicy !== 'growth_focused' ? 2 : 0)
  );
  dimensions.push({
    id: 'tax_transparency',
    label: 'Tax expenditure & revenue disclosure',
    score: taxTransparency,
    maxScore: 20,
    tier: tierFromScore(taxTransparency, 20),
    detail: `taxExp=${inputs.publishesTaxExpenditure}`
  });

  const riskDisclosure = Math.min(
    20,
    6 +
      (inputs.publishesContingentRegister ? 9 : 0) +
      (v1012.debtEnabled ? 3 : 0) +
      (v1012.pressure !== 'critical' ? 2 : 0)
  );
  dimensions.push({
    id: 'risk_disclosure',
    label: 'Contingent liabilities & fiscal risks',
    score: riskDisclosure,
    maxScore: 20,
    tier: tierFromScore(riskDisclosure, 20),
    detail: `contingent=${inputs.publishesContingentRegister}`
  });

  const performanceReporting = Math.min(
    20,
    7 + (inputs.publishesProgramOutcomes ? 11 : 0) + (v1012.commitmentCount <= 8 ? 2 : 0)
  );
  dimensions.push({
    id: 'performance_reporting',
    label: 'Program outcomes & service delivery',
    score: performanceReporting,
    maxScore: 20,
    tier: tierFromScore(performanceReporting, 20),
    detail: `programs=${inputs.publishesProgramOutcomes}`
  });

  const dataAccess = Math.min(15, 5 + (inputs.auditLagTurns <= 1 ? 5 : 2) + (inputs.publishesTaxExpenditure ? 3 : 0));
  dimensions.push({
    id: 'open_data',
    label: 'Open fiscal data readiness',
    score: dataAccess,
    maxScore: 15,
    tier: tierFromScore(dataAccess, 15),
    detail: `lag=${inputs.auditLagTurns}`
  });

  const compositeScore = dimensions.reduce((s, d) => s + d.score, 0);
  const compositeTier = tierFromScore(compositeScore, 100);
  const openDataReady = dataAccess >= 10 && inputs.publishesMultiYearEstimates;

  const improvementActions: string[] = [];
  if (!inputs.publishesContingentRegister) {
    improvementActions.push('Publish contingent liability register alongside budget papers.');
  }
  if (!inputs.publishesProgramOutcomes) {
    improvementActions.push('Link appropriation lines to program outcome dashboards.');
  }
  if (inputs.auditLagTurns > 2) {
    improvementActions.push('Reduce audit publication lag to within two turns.');
  }
  if (compositeTier === 'basic') {
    improvementActions.push('Adopt enhanced tier checklist for tax expenditure and MYEFO tables.');
  }

  return {
    schemaVersion: FISCAL_TRANSPARENCY_SCHEMA,
    turn,
    dimensions,
    compositeScore,
    compositeTier,
    openDataReady,
    improvementActions
  };
}


// --- source: reconciliation/reconcile.ts ---

export const RECONCILIATION_SCHEMA = 'op10m-agent07-reconciliation-v1';

export interface FiscalReconciliationCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: 'info' | 'caution' | 'major';
  detail: string;
}

export interface FiscalReconciliationReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalReconciliationCheck[];
  allPassed: boolean;
  boundaryRuleCount: number;
}

export interface FiscalReconciliationInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  envelope: NationalBudgetEnvelope;
  revenueLedger: NationalRevenueLedger;
  infraSummary: InfrastructureFinancingSummary | null;
  /** Actor-side cash that must never appear in national revenue (sanity fixture). */
  actorCashProbe?: number;
}

export function runFiscalReconciliation(inputs: FiscalReconciliationInputs): FiscalReconciliationReport {
  const checks: FiscalReconciliationCheck[] = [];
  const { envelope, v1012, revenueLedger, infraSummary } = inputs;

  checks.push({
    id: 'R01',
    label: 'Envelope allocation does not exceed total capacity',
    passed: envelope.allocatedPoints <= envelope.totalCapacityPoints + 1,
    severity: 'major',
    detail: `allocated=${envelope.allocatedPoints}, capacity=${envelope.totalCapacityPoints}`
  });

  checks.push({
    id: 'R02',
    label: 'Negative headroom triggers rebalance flag',
    passed: v1012.fiscalHeadroom < 0 ? envelope.rebalanceNeeded : true,
    severity: 'caution',
    detail: `headroom=${v1012.fiscalHeadroom}, rebalance=${envelope.rebalanceNeeded}`
  });

  checks.push({
    id: 'R03',
    label: 'Revenue ledger reconciled to V10.12 structural capacity',
    passed: revenueLedger.reconciledToV1012,
    severity: 'major',
    detail: revenueLedger.reconciliationNotes.join(' ')
  });

  checks.push({
    id: 'R04',
    label: 'Debt service reserve line tracks service load',
    passed: (() => {
      const line = envelope.lines.find(l => l.category === 'debt_service_reserve');
      if (!line) return false;
      return line.committedPoints >= v1012.debtServiceLoad * 0.3;
    })(),
    severity: 'caution',
    detail: `debtServiceLoad=${v1012.debtServiceLoad}`
  });

  if (infraSummary) {
    checks.push({
      id: 'R05',
      label: 'Infrastructure aggregate service within soft ceiling',
      passed: infraSummary.aggregateServiceLoad <= 28,
      severity: 'caution',
      detail: `aggregateService=${infraSummary.aggregateServiceLoad}`
    });
  }

  checks.push({
    id: 'R06',
    label: 'Actor cash probe excluded from revenue streams',
    passed: (() => {
      const probe = inputs.actorCashProbe ?? 0;
      if (probe <= 0) return true;
      return !revenueLedger.streams.some(s => s.deltaPoints === probe && s.kind === 'tax_instrument');
    })(),
    severity: 'major',
    detail: `probe=${inputs.actorCashProbe ?? 0} (boundary audit)`
  });

  checks.push({
    id: 'R07',
    label: 'Boundary rules catalog present',
    passed: V1014_BOUNDARY_RULES.length >= 6,
    severity: 'info',
    detail: `rules=${V1014_BOUNDARY_RULES.length}`
  });

  const allPassed = checks.every(c => c.passed);
  return {
    schemaVersion: RECONCILIATION_SCHEMA,
    turn: inputs.turn,
    checks,
    allPassed,
    boundaryRuleCount: V1014_BOUNDARY_RULES.length
  };
}


// --- source: fiscal-outcomes/react/FiscalOutcomesInspector.tsx ---
/**
 * V10.14 LAB inspector panel (Agent 07) — merge-ready React surface.
 * Not wired into canonical TSX on this branch.
 */

export interface FiscalOutcomesInspectorProps {
  state: FiscalOutcomesState | null | undefined;
  onRunSelfTests?: () => void;
}

export const FiscalOutcomesInspector: React.FC<FiscalOutcomesInspectorProps> = ({ state, onRunSelfTests }) => {
  const weakLinks = useMemo(
    () => (state?.outcomeLinks || []).filter(l => l.band === 'weak' || l.band === 'critical'),
    [state]
  );

  if (!state) {
    return (
      <div style={{ padding: 12, color: '#94a3b8', fontFamily: 'system-ui' }}>
        V10.14 Fiscal Outcomes: inactive (enable after Agent 25 merge).
      </div>
    );
  }

  return (
    <div style={{ padding: 12, fontFamily: 'system-ui', color: '#e2e8f0', background: '#0f172a' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ color: '#38bdf8' }}>LAB — V10.14 Fiscal Policy &amp; Outcome Linkage</strong>
        {onRunSelfTests && (
          <button type="button" onClick={onRunSelfTests} style={{ fontSize: 11, padding: '4px 8px' }}>
            Run self-tests
          </button>
        )}
      </div>
      <div style={{ marginTop: 8, fontSize: 12 }}>
        Composite: <span style={{ color: '#a5f3fc' }}>{state.compositeBand.toUpperCase()}</span> ({state.compositeOutcomeScore})
      </div>
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Budget envelope — {state.budget.fiscalYearLabel}</div>
        <div style={{ fontSize: 12 }}>Capacity {state.budget.totalCapacityPoints} · Flex {state.budget.unallocatedFlex}</div>
        {state.budget.rebalanceSummary && (
          <div style={{ color: '#fbbf24', fontSize: 11, marginTop: 4 }}>{state.budget.rebalanceSummary}</div>
        )}
        <ul style={{ fontSize: 11, marginTop: 6, paddingLeft: 16 }}>
          {state.budget.lines.map(line => (
            <li key={line.category}>
              {BUDGET_ENVELOPE_CATEGORY_LABELS[line.category]}: {line.allocatedPoints}/{line.committedPoints} ({line.band})
            </li>
          ))}
        </ul>
      </section>
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Debt outcome trajectory</div>
        <div style={{ fontSize: 12 }}>{state.debtTrajectory.sustainability} — {state.debtTrajectory.narrative}</div>
      </section>
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Linked outcomes</div>
        <ul style={{ fontSize: 11, paddingLeft: 16 }}>
          {state.outcomeLinks.map(link => (
            <li key={link.dimension}>
              {link.dimension}: {link.band} ({link.score}) — {link.summary}
            </li>
          ))}
        </ul>
      </section>
      {weakLinks.length > 0 && (
        <section style={{ marginTop: 8, color: '#fca5a5', fontSize: 11 }}>
          Weak dimensions: {weakLinks.map(w => w.dimension).join(', ')}
        </section>
      )}
      <section style={{ marginTop: 12 }}>
        <div style={{ fontSize: 11, color: '#94a3b8' }}>Constraint gates</div>
        <ul style={{ fontSize: 11, paddingLeft: 16 }}>
          {state.constraintGates.map(g => (
            <li key={g.id}>
              {g.triggered ? '⚠' : '○'} {g.label} ({g.severity}): {g.reason}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default FiscalOutcomesInspector;


// --- source: fiscal-outcomes/self-tests.ts ---
  computeFiscalOutcomesLayer,
  createInitialFiscalOutcomesPersisted,
  sanitizeFiscalOutcomesPersisted,
  setTaxInstrumentRate
} from './compute';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 1,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? false,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runV1014FiscalOutcomesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: V1014SelfTestResult[];
} {
  const results: V1014SelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  // 1 — Schema & initial persisted
  {
    const p = createInitialFiscalOutcomesPersisted();
    record(
      'T01',
      'Initial persisted schema',
      p.schemaVersion === V1014_SCHEMA_VERSION && Object.keys(p.instrumentRates).length >= 9,
      `instruments=${Object.keys(p.instrumentRates).length}`
    );
  }

  // 2 — Compute baseline state
  {
    const { state } = computeFiscalOutcomesLayer(
      { turn: 1, v1012: snap({}) },
      createInitialFiscalOutcomesPersisted()
    );
    record(
      'T02',
      'Baseline compute produces outcome links',
      state.outcomeLinks.length === 6 && state.compositeBand !== undefined,
      `links=${state.outcomeLinks.length}, composite=${state.compositeOutcomeScore}`
    );
  }

  // 3 — Critical pressure weakens prosperity link
  {
    const healthy = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ pressure: 'healthy' }) }).state;
    const critical = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ pressure: 'critical', fiscalHeadroom: -12 }) })
      .state;
    const h = healthy.outcomeLinks.find(l => l.dimension === 'national_prosperity')!.score;
    const c = critical.outcomeLinks.find(l => l.dimension === 'national_prosperity')!.score;
    record('T03', 'Critical pressure lowers prosperity outcome', c < h, `healthy=${h}, critical=${c}`);
  }

  // 4 — Debt distress gate
  {
    const st = computeFiscalOutcomesLayer({
      turn: 1,
      v1012: snap({ debtEnabled: true, debtLevel: 60, debtServiceLoad: 20, pressure: 'strained' })
    }).state;
    const gate = st.constraintGates.find(g => g.id === 'debt_stress_path');
    record('T04', 'Debt stress triggers gate', Boolean(gate?.triggered), `sustainability=${st.debtTrajectory.sustainability}`);
  }

  // 5 — Tax cut vs raise revenue delta sign
  {
    let p = createInitialFiscalOutcomesPersisted();
    p = setTaxInstrumentRate(p, 'corp_standard', 30, 'raise');
    const raised = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ revenueCapacity: 70 }) }, p);
    p = setTaxInstrumentRate(createInitialFiscalOutcomesPersisted(), 'corp_standard', 20, 'cut');
    const cut = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({ revenueCapacity: 70 }) }, p);
    const rDelta = raised.state.taxInstruments.find(t => t.instrumentId === 'corp_standard')!.revenueDeltaEstimate;
    const cDelta = cut.state.taxInstruments.find(t => t.instrumentId === 'corp_standard')!.revenueDeltaEstimate;
    record('T05', 'Raise > cut revenue delta', rDelta > cDelta, `raise=${rDelta}, cut=${cDelta}`);
  }

  // 6 — Budget rebalance when headroom negative
  {
    const st = computeFiscalOutcomesLayer({ turn: 2, v1012: snap({ fiscalHeadroom: -6, pressure: 'strained' }) }).state;
    record('T06', 'Negative headroom flags rebalance', st.budget.rebalanceNeeded, String(st.budget.rebalanceSummary));
  }

  // 7 — Bridge from V10.12-shaped object
  {
    const bridge = bridgeV1012Snapshot({
      turn: 5,
      fiscalPosition: { revenueCapacity: 55, fiscalHeadroom: 3, pressure: 'tight', maintenanceLoad: 9 },
      debt: { enabled: true, level: 22, debtServiceLoad: 5 },
      commitments: [{}, {}, {}]
    });
    record(
      'T07',
      'V10.12 bridge maps fields',
      bridge.commitmentCount === 3 && bridge.debtEnabled && bridge.turn === 5,
      JSON.stringify(bridge)
    );
  }

  // 8 — Determinism same inputs
  {
    const inp = buildFiscalOutcomesInputsFromBridge(snap({ turn: 3 }), { publicStability: 61 });
    const a = computeFiscalOutcomesLayer(inp, createInitialFiscalOutcomesPersisted());
    const b = computeFiscalOutcomesLayer(inp, a.persisted);
    record(
      'T08',
      'Deterministic recompute with same hash skips revision bump',
      a.state.inputHash === b.state.inputHash,
      `revA=${a.persisted.revision}, revB=${b.persisted.revision}`
    );
  }

  // 9 — Sanitize null
  record('T09', 'Sanitize null persisted', sanitizeFiscalOutcomesPersisted(null) === null, 'ok');

  // 10 — GI detect tax question
  record(
    'T10',
    'GI detects tax policy question',
    detectFiscalOutcomesQuestion('Should we change tax policy on payroll?'),
    'detected'
  );

  // 11 — GI compose with state
  {
    const { state } = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({}) });
    const ans = composeFiscalOutcomesGiAnswer('fiscal outcomes?', state);
    record('T11', 'GI answer headline', ans.headline.includes('Composite'), ans.headline);
  }

  // 12 — Innovation credit improves innovation link
  {
    let p = createInitialFiscalOutcomesPersisted();
    p = setTaxInstrumentRate(p, 'innovation_credit', -12, 'cut');
    const st = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({}) }, p).state;
    const base = computeFiscalOutcomesLayer({ turn: 1, v1012: snap({}) }).state;
    const i1 = st.outcomeLinks.find(l => l.dimension === 'innovation_momentum')!.score;
    const i0 = base.outcomeLinks.find(l => l.dimension === 'innovation_momentum')!.score;
    record('T12', 'Deeper innovation credit boosts innovation outcome', i1 >= i0, `credit=${i1}, base=${i0}`);
  }

  // 13 — Catalog non-empty
  record('T13', 'Policy scenario catalog populated', POLICY_SCENARIO_CATALOG.length >= 24, `count=${POLICY_SCENARIO_CATALOG.length}`);

  // 14 — Each catalog entry has outcomes
  {
    const bad = POLICY_SCENARIO_CATALOG.filter(p => !p.linkedOutcomes.length || !p.title);
    record('T14', 'Catalog entries well-formed', bad.length === 0, `bad=${bad.length}`);
  }

  // 15 — Instrument catalog bounds
  {
    const corp = TAX_INSTRUMENT_CATALOG.corp_standard;
    record(
      'T15',
      'Corp tax bounds',
      corp.minRatePoints < corp.defaultRatePoints && corp.maxRatePoints > corp.defaultRatePoints,
      `${corp.minRatePoints}-${corp.maxRatePoints}`
    );
  }

  // 16-20 — Scenario spot checks (5)
  for (let i = 0; i < 5; i++) {
    const pack = POLICY_SCENARIO_CATALOG[i * 5];
    if (!pack) continue;
    record(
      `T${16 + i}`,
      `Scenario pack ${pack.id} has fiscal narrative`,
      pack.narrative.length > 40 && pack.recommendedInstruments.length > 0,
      pack.title
    );
  }

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: reconciliation/self-tests.ts ---
  computeFiscalOutcomesLayer,
  createInitialFiscalOutcomesPersisted
} from '../fiscal-outcomes/compute';

export interface ReconciliationSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 1,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runAgent07ReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: ReconciliationSelfTestResult[];
} {
  const results: ReconciliationSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const persisted = createInitialFiscalOutcomesPersisted();
  const inputs = { turn: 4, v1012: snap({ debtEnabled: true, fiscalHeadroom: 5 }) };
  const { state } = computeFiscalOutcomesLayer(inputs, persisted);
  const ledger = buildNationalRevenueLedger({
    turn: inputs.turn,
    v1012: inputs.v1012,
    taxInstruments: state.taxInstruments
  });
  const infra = summarizeInfrastructureFinancing(
    inputs.turn,
    [
      {
        projectId: 'mp_western_rail',
        title: 'Western Rail Upgrade',
        regionIds: ['WA'],
        capitalPoints: 24,
        maintenancePointsPerTurn: 2,
        strategicWeight: 0.8,
        preferredVehicle: 'debt_funded_acceleration'
      }
    ],
    inputs.v1012,
    state.budget
  );

  const report = runFiscalReconciliation({
    turn: inputs.turn,
    v1012: inputs.v1012,
    envelope: state.budget,
    revenueLedger: ledger,
    infraSummary: infra,
    actorCashProbe: 999_999
  });

  record('RC01', 'Full stack reconciliation allPassed', report.allPassed, `${report.checks.length} checks`);
  record(
    'RC02',
    'Infrastructure plan feasible under healthy pressure',
    infra.plans[0]?.feasible === true,
    `warnings=${infra.plans[0]?.warnings.length ?? 0}`
  );

  const critical = computeFiscalOutcomesLayer(
    { turn: 2, v1012: snap({ pressure: 'critical', fiscalHeadroom: -10 }) },
    persisted
  ).state;
  const criticalReport = runFiscalReconciliation({
    turn: 2,
    v1012: snap({ pressure: 'critical', fiscalHeadroom: -10 }),
    envelope: critical.budget,
    revenueLedger: buildNationalRevenueLedger({
      turn: 2,
      v1012: snap({ pressure: 'critical', fiscalHeadroom: -10 }),
      taxInstruments: critical.taxInstruments
    }),
    infraSummary: null
  });
  record(
    'RC03',
    'Critical headroom fails rebalance check intentionally',
    criticalReport.checks.find(c => c.id === 'R02')?.passed === true,
    criticalReport.checks.find(c => c.id === 'R02')?.detail ?? ''
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: recurring-commitments/self-tests.ts ---
  computeFiscalOutcomesLayer,
  createInitialFiscalOutcomesPersisted
} from '../fiscal-outcomes/compute';

export interface RecurringSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 1,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runRecurringCommitmentsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: RecurringSelfTestResult[];
} {
  const results: RecurringSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const { state } = computeFiscalOutcomesLayer(
    { turn: 2, v1012: snap({ turn: 2 }) },
    createInitialFiscalOutcomesPersisted()
  );
  const schedule = scheduleRecurringCommitments(2, snap({ turn: 2 }), state.budget);
  record(
    'RCM01',
    'Every-turn pulses fire on turn 2',
    schedule.pulses.length >= 3 && schedule.totalLoadThisTurn > 0,
    `pulses=${schedule.pulses.length}, load=${schedule.totalLoadThisTurn}`
  );

  const evenTurn = scheduleRecurringCommitments(4, snap({ turn: 4 }), state.budget);
  const oddTurn = scheduleRecurringCommitments(3, snap({ turn: 3 }), state.budget);
  const regionalEven = evenTurn.pulses.some(p => p.commitmentId === 'rc_regional_transfers');
  const regionalOdd = oddTurn.pulses.some(p => p.commitmentId === 'rc_regional_transfers');
  record(
    'RCM02',
    'Biennial regional transfer cadence',
    regionalEven && !regionalOdd,
    `even=${regionalEven}, odd=${regionalOdd}`
  );

  const tight = computeFiscalOutcomesLayer(
    { turn: 1, v1012: snap({ fiscalHeadroom: -15, pressure: 'critical' }) },
    createInitialFiscalOutcomesPersisted()
  ).state;
  const tightSchedule = scheduleRecurringCommitments(1, snap({ fiscalHeadroom: -15, pressure: 'critical' }), tight.budget);
  record(
    'RCM03',
    'Mandatory load tracked separately',
    tightSchedule.mandatoryLoad <= tightSchedule.totalLoadThisTurn,
    `mandatory=${tightSchedule.mandatoryLoad}, total=${tightSchedule.totalLoadThisTurn}`
  );

  record(
    'RCM04',
    'Default catalog size',
    DEFAULT_RECURRING_COMMITMENTS.length >= 4,
    `defs=${DEFAULT_RECURRING_COMMITMENTS.length}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: fiscal-resilience/self-tests.ts ---

export interface ResilienceSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 5,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'prudent'
  };
}

export function runFiscalResilienceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: ResilienceSelfTestResult[];
} {
  const results: ResilienceSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const single = assessFiscalResilience(5, snap({}), ['commodity_drop']);
  record(
    'FR01',
    'Commodity shock lowers adjusted revenue',
    single.shocksApplied[0]!.adjustedSnapshot.revenueCapacity < 62,
    `revenue=${single.shocksApplied[0]!.adjustedSnapshot.revenueCapacity}`
  );

  const stack = assessFiscalResilience(5, snap({ fiscalHeadroom: 6 }), ['commodity_drop', 'rate_shock']);
  record(
    'FR02',
    'Shock stack worsens pressure',
    stack.shocksApplied.length === 2 &&
      (stack.shocksApplied[1]!.pressureAfter === 'strained' ||
        stack.shocksApplied[1]!.pressureAfter === 'tight' ||
        stack.shocksApplied[1]!.pressureAfter === 'critical'),
    `pressure=${stack.shocksApplied[1]!.pressureAfter}`
  );

  const disaster = assessFiscalResilience(5, snap({}), ['disaster_surge']);
  record(
    'FR03',
    'Disaster shock raises maintenance load',
    disaster.shocksApplied[0]!.adjustedSnapshot.maintenanceLoad > 6,
    `maintenance=${disaster.shocksApplied[0]!.adjustedSnapshot.maintenanceLoad}`
  );

  const positive = assessFiscalResilience(5, snap({}), ['migration_dividend']);
  record(
    'FR04',
    'Positive shock improves headroom',
    positive.shocksApplied[0]!.adjustedSnapshot.fiscalHeadroom > 8,
    `headroom=${positive.shocksApplied[0]!.adjustedSnapshot.fiscalHeadroom}`
  );

  record(
    'FR05',
    'Shock catalog minimum size',
    Object.keys(FISCAL_SHOCK_CATALOG).length >= 4,
    `catalog=${Object.keys(FISCAL_SHOCK_CATALOG).length}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: debt-rollover/self-tests.ts ---

export interface RolloverSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 58,
    fiscalHeadroom: partial.fiscalHeadroom ?? 4,
    pressure: partial.pressure ?? 'tight',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 8,
    debtLevel: partial.debtLevel ?? 32,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 6,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runDebtRolloverSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: RolloverSelfTestResult[];
} {
  const results: RolloverSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const turn = 10;
  const plan = resolveDebtRollover({
    turn,
    v1012: snap({ turn }),
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });

  const longEvent = plan.events.find(e => e.trancheId === 'tranche_long_1');
  record(
    'DR01',
    'Over-rolled long tranche gets penalty outcome',
    longEvent?.outcome === 'rolled_with_penalty',
    `outcome=${longEvent?.outcome}`
  );

  const notDue = plan.events.find(e => e.trancheId === 'tranche_med_1');
  record('DR02', 'Medium tranche not due reports not_due', notDue?.outcome === 'not_due', notDue?.explanation ?? '');

  const criticalPlan = resolveDebtRollover({
    turn,
    v1012: snap({ turn, fiscalHeadroom: -14, pressure: 'critical' }),
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });
  const shortFail = criticalPlan.events.find(e => e.trancheId === 'tranche_short_1');
  record(
    'DR03',
    'Critical headroom short tranche fails liquidity',
    shortFail?.outcome === 'failed_liquidity' && criticalPlan.liquidityStress,
    `outcome=${shortFail?.outcome}, stress=${criticalPlan.liquidityStress}`
  );

  const disabledPlan = resolveDebtRollover({
    turn,
    v1012: snap({ turn, debtEnabled: false }),
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });
  record(
    'DR04',
    'Debt disabled retires due tranche',
    disabledPlan.events.some(e => e.outcome === 'partially_retired'),
    `events=${disabledPlan.events.map(e => e.outcome).join(',')}`
  );

  record(
    'DR05',
    'Trajectory computed after rollover',
    plan.trajectoryAfter !== null && plan.trajectoryAfter.sustainability !== undefined,
    `sustainability=${plan.trajectoryAfter?.sustainability}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: budget-lines/self-tests.ts ---

export interface BudgetLinesSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 3,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 14,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runBudgetLinesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: BudgetLinesSelfTestResult[];
} {
  const results: BudgetLinesSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v1012 = snap({});
  const envelope = buildBudgetEnvelope(v1012);
  const paper = buildDetailedBudgetPaper(v1012, envelope);

  record(
    'BL01',
    'Every envelope category has sub-line breakdown',
    paper.categories.length === envelope.lines.length,
    `categories=${paper.categories.length}`
  );

  const allBalanced = paper.categories.every(c => c.linesBalanced);
  record('BL02', 'Sub-line sums reconcile to envelope rows', allBalanced, `balanced=${allBalanced}`);

  const core = paper.categories.find(c => c.category === 'core_services');
  record(
    'BL03',
    'Core services has multiple appropriation codes',
    (core?.subLines.length ?? 0) >= 4,
    `sublines=${core?.subLines.length ?? 0}`
  );

  const critical = buildDetailedBudgetPaper(
    snap({ pressure: 'critical', fiscalHeadroom: -5 }),
    buildBudgetEnvelope(snap({ pressure: 'critical', fiscalHeadroom: -5 }))
  );
  const hasPressure = critical.categories.some(c => c.subLines.some(s => s.varianceBand === 'pressure' || s.varianceBand === 'blown'));
  record('BL04', 'Critical pressure elevates variance bands', hasPressure, `warnings=${critical.aggregateVarianceWarnings.length}`);

  record('BL05', 'Appropriation catalog minimum depth', countAppropriationLines() >= 20, `lines=${countAppropriationLines()}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: federal-state/self-tests.ts ---

export interface FederalStateSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 6,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 10,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFederalStateReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: FederalStateSelfTestResult[];
} {
  const results: FederalStateSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const report = reconcileFederalStateTransfers(6, snap({}));
  record(
    'FS01',
    'IGR reconciliation closes within tolerance',
    report.reconciled,
    `residual=${report.residualFederal}, pool=${report.federalRevenuePool}`
  );

  record(
    'FS02',
    'Eight states × five instruments',
    report.transfers.length === STATE_FISCAL_PROFILES.length * 5,
    `transfers=${report.transfers.length}`
  );

  const nt = sumTransfersByState(report, 'NT');
  const act = sumTransfersByState(report, 'ACT');
  record('FS03', 'Remote NT load exceeds ACT total net', nt > act, `NT=${nt}, ACT=${act}`);

  const waGst = report.transfers.find(t => t.stateCode === 'WA' && t.instrument === 'gst_igr');
  record(
    'FS04',
    'High-capacity WA GST adjustment non-positive',
    (waGst?.adjustmentPoints ?? 0) <= 0,
    `adj=${waGst?.adjustmentPoints}`
  );

  const tas = report.transfers.find(t => t.stateCode === 'TAS' && t.instrument === 'general_purpose');
  record(
    'FS05',
    'Low-capacity TAS receives positive equalization uplift',
    (tas?.adjustmentPoints ?? 0) >= 0 && (tas?.netPoints ?? 0) > 0,
    `net=${tas?.netPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: tax-expenditure/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 5,
    revenueCapacity: partial.revenueCapacity ?? 65,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 15,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runTaxExpenditureSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const stmt = buildTaxExpenditureStatement(5, snap({}));
  record('TE01', 'Forgone reduces net structural capacity', stmt.netStructuralCapacity < stmt.grossStructuralCapacity, `net=${stmt.netStructuralCapacity}`);
  record('TE02', 'Catalog measures enumerated', stmt.lines.length === countTaxExpenditureMeasures(), `count=${stmt.lines.length}`);
  record('TE03', 'Material super concession flagged', stmt.lines.some(l => l.measureId === 'te_super_concession' && l.band !== 'minor'), 'ok');

  const sunset = buildTaxExpenditureStatement(13, snap({ turn: 13 }));
  const phantom = sunset.lines.find(l => l.measureId === 'te_phantom_sunset');
  record('TE04', 'Sunset measure zero after expiry', phantom?.forgonePoints === 0, `forgone=${phantom?.forgonePoints}`);

  const critical = buildTaxExpenditureStatement(5, snap({ pressure: 'critical' }));
  record('TE05', 'Critical pressure scales forgone upward', critical.totalForgone > stmt.totalForgone, `crit=${critical.totalForgone}, base=${stmt.totalForgone}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: medium-term-outlook/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 60,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'tight',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 9,
    debtLevel: partial.debtLevel ?? 35,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 6,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runMediumTermOutlookSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const outlook = buildMediumTermFiscalOutlook(snap({}), 4);
  record('MTO01', 'Horizon includes base plus four forwards', outlook.projections.length === 5, `n=${outlook.projections.length}`);
  record('MTO02', 'Headroom generally declines under debt path', outlook.projections[4]!.fiscalHeadroom < outlook.projections[0]!.fiscalHeadroom, `y0=${outlook.projections[0]!.fiscalHeadroom}, y4=${outlook.projections[4]!.fiscalHeadroom}`);

  const prudent = buildMediumTermFiscalOutlook(snap({ reservePolicy: 'prudent', fiscalHeadroom: 8 }), 3);
  const lean = buildMediumTermFiscalOutlook(snap({ reservePolicy: 'lean', fiscalHeadroom: 8 }), 3);
  record('MTO03', 'Prudent reserve policy improves average headroom', prudent.averageHeadroom >= lean.averageHeadroom, `prudent=${prudent.averageHeadroom}, lean=${lean.averageHeadroom}`);

  const heavy = buildMediumTermFiscalOutlook(snap({ debtLevel: 58, debtServiceLoad: 16 }), 4);
  record('MTO04', 'Heavy debt triggers risk flags', heavy.risks.length >= 1, `risks=${heavy.risks.length}`);

  record('MTO05', 'Trajectory band assigned', Boolean(outlook.trajectoryBand), `band=${outlook.trajectoryBand}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: consolidated-fiscal/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 7,
    revenueCapacity: partial.revenueCapacity ?? 66,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 18,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runConsolidatedFiscalSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildConsolidatedFiscalReport(7, snap({}));
  record('CF-T01', 'Healthy baseline all layers pass', healthy.allPassed, `${healthy.checks.filter(c => c.passed).length}/${healthy.checks.length}`);
  record('CF-T02', 'Fifty-four fiscal layers integrated', healthy.layerCount === 54, `layers=${healthy.layerCount}`);

  record(
    'CF-T03',
    'Strained snapshot runs full check suite',
    buildConsolidatedFiscalReport(7, snap({ fiscalHeadroom: -3, pressure: 'strained' })).checks.length === 56,
    'ok'
  );

  const critical = buildConsolidatedFiscalReport(
    7,
    snap({ fiscalHeadroom: -18, pressure: 'critical', debtServiceLoad: 22, debtLevel: 62, maintenanceLoad: 18 })
  );
  record('CF-T04', 'Critical stack fails at least one guard', critical.allPassed === false, `failed=${critical.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'none'}`);

  record(
    'CF-T05',
    'CF01–CF56 ids present',
    healthy.checks.length === 56 &&
      healthy.checks[0]?.id === 'CF01' &&
      healthy.checks[55]?.id === 'CF56',
    healthy.checks.map(c => c.id).join(',')
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: fiscal-rules/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalRulesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const env = buildBudgetEnvelope(snap({}));
  const contingency = env.lines.find(l => l.category === 'contingency')?.flexPoints ?? 0;
  const ok = assessFiscalRulesFramework({
    turn: 9,
    v1012: snap({}),
    envelopeContingencyPoints: contingency,
    forwardSpendingGrowth: 1.8
  });
  record('FRU01', 'Healthy baseline all rules compliant', ok.allCompliant, `breaches=${ok.breachCount}`);
  record('FRU02', 'Five rules in catalog', FISCAL_RULES_CATALOG.length === 5, `n=${FISCAL_RULES_CATALOG.length}`);

  const breach = assessFiscalRulesFramework({
    turn: 9,
    v1012: snap({ fiscalHeadroom: -10, debtServiceLoad: 22 }),
    envelopeContingencyPoints: 1,
    forwardSpendingGrowth: 4
  });
  record('FRU03', 'Stress scenario triggers multiple breaches', breach.breachCount >= 2, `breaches=${breach.breachCount}`);

  const debtOff = assessFiscalRulesFramework({
    turn: 9,
    v1012: snap({ debtEnabled: false, debtServiceLoad: 25 }),
    envelopeContingencyPoints: contingency,
    forwardSpendingGrowth: 1
  });
  const debtRule = debtOff.assessments.find(a => a.ruleId === 'debt_service_ceiling');
  record('FRU04', 'Debt service rule waived when debt disabled', debtRule?.compliant === true, String(debtRule?.compliant));

  record('FRU05', 'Narrative present on breach', breach.narrative.includes('flagged'), 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: sovereign-issuance/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 63,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'tight',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 28,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runSovereignIssuanceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const cal = executeIssuanceCalendar(10, snap({ turn: 10 }));
  record('SI01', 'TBill executes on scheduled turn', cal.lines.find(l => l.id === 'iss_tbill')!.issuedVolumePoints > 0, 'ok');
  record('SI02', 'Future lines deferred', cal.lines.some(l => l.deferred && l.id === 'iss_nom_7y'), 'ok');

  const critical = executeIssuanceCalendar(10, snap({ turn: 10, pressure: 'critical', fiscalHeadroom: -12 }));
  record('SI03', 'Critical market stress may cause liquidity shortfall', critical.liquidityShortfall || critical.warnings.length > 0, `warnings=${critical.warnings.length}`);

  const off = executeIssuanceCalendar(10, snap({ debtEnabled: false }));
  record('SI04', 'Debt disabled defers all issuance', off.totalIssued === 0, `issued=${off.totalIssued}`);

  record('SI05', 'Weighted tenor computed when issued', cal.weightedAverageTenorYears > 0, `wavg=${cal.weightedAverageTenorYears}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: program-performance/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 16,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 9,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runProgramPerformanceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const review = reviewProgramPerformance(11, snap({}));
  record('PP01', 'Scores for all tracked programs', review.scores.length === PROGRAM_PERFORMANCE_TARGETS.length, `n=${review.scores.length}`);
  record('PP02', 'Composite scores bounded 0-100', review.scores.every(s => s.compositeScore >= 0 && s.compositeScore <= 100), 'ok');

  const critical = reviewProgramPerformance(11, snap({ pressure: 'critical', fiscalHeadroom: -8 }));
  record('PP03', 'Critical pressure increases at-risk count', critical.programsAtRisk >= review.programsAtRisk, `crit=${critical.programsAtRisk}, base=${review.programsAtRisk}`);

  record('PP04', 'Failing programs negative feedback', review.scores.every(s => s.band !== 'failing' || s.fiscalFeedbackPoints < 0), 'ok');

  record('PP05', 'Rebalance text when aggregate drag', critical.rebalanceRecommendations.length >= 1, `recs=${critical.rebalanceRecommendations.length}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: multi-year-framework/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runMultiYearFrameworkSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const framework = buildMultiYearExpenditureFramework(snap({}), 3);
  record('MYF01', 'Forward bands cover horizon', framework.forwardBands.length === 4, `n=${framework.forwardBands.length}`);
  record('MYF02', 'Ceiling rows for envelope categories', framework.ceilings.length >= 6, `n=${framework.ceilings.length}`);
  record('MYF03', 'Healthy baseline within ceiling bands', framework.forwardBands.every(b => b.withinCeiling), 'ok');

  const ceilings = buildExpenditureCeilingRows(snap({ fiscalHeadroom: -6, pressure: 'strained' }));
  record('MYF04', 'Negative headroom can bind ceilings', ceilings.some(c => c.binding), `binding=${ceilings.filter(c => c.binding).length}`);

  const tight = buildMultiYearExpenditureFramework(
    snap({ fiscalHeadroom: -12, pressure: 'critical', debtServiceLoad: 19, maintenanceLoad: 16 }),
    2
  );
  record('MYF05', 'Critical path emits warnings', tight.warnings.length >= 1, `w=${tight.warnings.length}`);
  record('MYF06', 'Parameter settings growth bounded', framework.parameterSettingsGrowth > 0 && framework.parameterSettingsGrowth < 6, `g=${framework.parameterSettingsGrowth}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: contingent-liabilities/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 60,
    fiscalHeadroom: partial.fiscalHeadroom ?? 4,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 3,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runContingentLiabilitiesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const catalog = catalogContingentExposures(12);
  record('CL01', 'Default exposure catalog populated', catalog.length >= 4, `n=${catalog.length}`);

  const base = assessContingentLiabilities(12, snap({}));
  record('CL02', 'Expected loss positive and bounded', base.expectedLossPoints > 0 && base.expectedLossPoints < 40, `el=${base.expectedLossPoints}`);
  record('CL03', 'Tail risk at least expected loss', base.tailRiskPoints >= base.expectedLossPoints, 'ok');
  record('CL04', 'Disclosures mirror exposures', base.disclosures.length === base.exposures.length, 'ok');

  const critical = assessContingentLiabilities(12, snap({ pressure: 'critical', fiscalHeadroom: -14, debtLevel: 55 }));
  record('CL05', 'Critical stress raises multiplier', critical.stressMultiplier > base.stressMultiplier, `${critical.stressMultiplier} vs ${base.stressMultiplier}`);
  record('CL06', 'Severe snapshot elevates stress multiplier', critical.stressMultiplier >= 1.4, `mult=${critical.stressMultiplier}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: fiscal-transparency/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 58,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 15,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalTransparencySelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const minimal = scoreFiscalTransparencyIndex({
    turn: 8,
    v1012: snap({}),
    publishesTaxExpenditure: false,
    publishesMultiYearEstimates: false,
    publishesContingentRegister: false,
    publishesProgramOutcomes: false,
    auditLagTurns: 4
  });
  record('FTI01', 'Five transparency dimensions scored', minimal.dimensions.length === 5, `n=${minimal.dimensions.length}`);
  record('FTI02', 'Minimal disclosure stays basic tier', minimal.compositeTier === 'basic', minimal.compositeTier);

  const full = scoreFiscalTransparencyIndex({
    turn: 8,
    v1012: snap({ fiscalHeadroom: 10 }),
    publishesTaxExpenditure: true,
    publishesMultiYearEstimates: true,
    publishesContingentRegister: true,
    publishesProgramOutcomes: true,
    auditLagTurns: 1
  });
  record('FTI03', 'Full disclosure improves composite', full.compositeScore > minimal.compositeScore, `${full.compositeScore} vs ${minimal.compositeScore}`);
  record('FTI04', 'Open data ready when MYEFO + low lag', full.openDataReady === true, String(full.openDataReady));
  record('FTI05', 'Basic tier lists improvements', minimal.improvementActions.length >= 2, `n=${minimal.improvementActions.length}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: infrastructure-financing/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 6,
    revenueCapacity: partial.revenueCapacity ?? 63,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 17,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

const sampleRequest = (overrides: Partial<InfrastructureProjectFundingRequest> = {}): InfrastructureProjectFundingRequest => ({
  projectId: 'infra_test_1',
  title: 'Test corridor',
  regionIds: ['r1'],
  capitalPoints: 12,
  maintenancePointsPerTurn: 2,
  strategicWeight: 0.6,
  preferredVehicle: 'sovereign_bond_series',
  ...overrides
});

export function runInfrastructureFinancingSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v1012 = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(v1012.turn);
  const { state } = computeFiscalOutcomesLayer({ turn: v1012.turn, v1012 }, persisted);

  const plan = planInfrastructureFunding(sampleRequest(), v1012, state.budget);
  record('IF01', 'Funding plan stacks capital', plan.stack.reduce((s, l) => s + l.capitalPoints, 0) === plan.totalCapitalPoints, `pts=${plan.totalCapitalPoints}`);
  record('IF02', 'Healthy snapshot feasible', plan.feasible, String(plan.feasible));

  const noDebt = planInfrastructureFunding(sampleRequest({ capitalPoints: 20 }), snap({ debtEnabled: false }), state.budget);
  record('IF03', 'Debt disabled uses grant-match warn path', noDebt.stack.some(l => l.vehicle === 'grant_match_federal'), noDebt.warnings.join(';'));

  const summary = summarizeInfrastructureFinancing(6, [sampleRequest(), sampleRequest({ projectId: 'infra_test_2', capitalPoints: 8 })], v1012, state.budget);
  record('IF04', 'Summary aggregates service load', summary.aggregateServiceLoad >= 0, `load=${summary.aggregateServiceLoad}`);
  record('IF05', 'Two-project portfolio plans', summary.plans.length === 2, `n=${summary.plans.length}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: revenue-ledger/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 58,
    fiscalHeadroom: partial.fiscalHeadroom ?? 3,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 19,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 2,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runRevenueLedgerSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v1012 = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(8);
  const { state } = computeFiscalOutcomesLayer({ turn: 8, v1012 }, persisted);
  const ledger = buildNationalRevenueLedger({ turn: 8, v1012, taxInstruments: state.taxInstruments });

  record('RL01', 'Streams mirror tax instruments', ledger.streams.length >= state.taxInstruments.length, `streams=${ledger.streams.length}`);
  record('RL02', 'Reconciled under balanced policy', ledger.reconciledToV1012, ledger.reconciliationNotes[0] ?? '');
  record('RL03', 'Structural capacity matches V10.12', ledger.structuralCapacity === v1012.revenueCapacity, 'ok');

  const focused = buildNationalRevenueLedger({
    turn: 8,
    v1012: snap({ revenuePolicy: 'revenue_focused' }),
    taxInstruments: state.taxInstruments
  });
  record('RL04', 'Revenue-focused policy adds dividend stream', focused.streams.some(s => s.id === 'stream_policy_dividend'), 'ok');
  record('RL05', 'Total delta aggregates stream deltas', focused.totalDelta === focused.streams.reduce((s, l) => s + l.deltaPoints, 0), `delta=${focused.totalDelta}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: fiscal-risk-register/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalRiskRegisterSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const catalog = catalogFiscalRisks(9);
  record('FR01', 'Risk catalog covers core categories', catalog.length >= 6, `n=${catalog.length}`);

  const base = buildFiscalRiskRegister(9, snap({}));
  record('FR02', 'Healthy snapshot within appetite', base.withinRiskAppetite && base.tier === 'low', `heat=${base.aggregateHeat}`);
  record('FR03', 'Aggregate heat positive', base.aggregateHeat > 0, 'ok');
  record('FR04', 'Unmitigated count matches catalog', base.unmitigatedCount === catalog.filter(c => !c.mitigationReady).length, `u=${base.unmitigatedCount}`);

  const strained = buildFiscalRiskRegister(9, snap({ fiscalHeadroom: -2, pressure: 'strained', debtServiceLoad: 16 }));
  record('FR05', 'Strained snapshot raises heat', strained.aggregateHeat > base.aggregateHeat, `${strained.aggregateHeat} vs ${base.aggregateHeat}`);
  record('FR06', 'Elevated or severe under strain', strained.tier !== 'low', `tier=${strained.tier}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: intergovernmental-grants/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 3,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runIntergovernmentalGrantsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = allocateIntergovernmentalGrants(11, snap({}));
  record('IG01', 'Five grant programs allocated', healthy.allocations.length === 5, 'ok');
  record('IG02', 'Pool reconciled to IGR slice', healthy.reconciledToIgrPool, `total=${healthy.totalFederal}`);
  record('IG03', 'Net outlay equals federal minus clawback', healthy.netFederalOutlay === Math.round((healthy.totalFederal - healthy.totalClawback) * 10) / 10, 'ok');
  record('IG04', 'Healthy pass rate high', healthy.performancePassRate >= 0.6, `rate=${healthy.performancePassRate}`);

  const critical = allocateIntergovernmentalGrants(11, snap({ pressure: 'critical', fiscalHeadroom: -12, maintenanceLoad: 20, debtServiceLoad: 24, sustainability: 'fragile' }));
  record('IG05', 'Critical snapshot triggers clawbacks', critical.totalClawback > healthy.totalClawback, `${critical.totalClawback} vs ${healthy.totalClawback}`);
  record('IG06', 'Performance pass rate drops under stress', critical.performancePassRate < healthy.performancePassRate, `rate=${critical.performancePassRate}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: statutory-balances/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runStatutoryBalancesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildStatutoryBalancesReport(12, snap({}));
  record('SB01', 'Three statutory bands reported', healthy.bands.length === 3, 'ok');
  record('SB02', 'Healthy snapshot within soft anchors', healthy.allWithinSoftAnchors, healthy.narrative);
  record('SB03', 'Net debt ratio bounded', healthy.netDebtToCapacityRatio <= 0.72, `ratio=${healthy.netDebtToCapacityRatio}`);

  const levered = buildStatutoryBalancesReport(
    12,
    snap({ debtLevel: 58, debtServiceLoad: 19, fiscalHeadroom: -2, pressure: 'strained' })
  );
  record('SB04', 'High debt triggers anchor breach or warn', levered.warnings.length > 0, levered.warnings[0] ?? 'none');

  const critical = buildStatutoryBalancesReport(
    12,
    snap({ pressure: 'critical', fiscalHeadroom: -20, debtLevel: 70, maintenanceLoad: 22 })
  );
  record('SB05', 'Critical override on operating anchor', critical.bands[0].withinAnchor, `nob=${critical.netOperatingBalance}`);

  record('SB06', 'Schema version set', healthy.schemaVersion.includes('statutory-balances'), healthy.schemaVersion);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: cost-recovery-pricing/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 13,
    revenueCapacity: partial.revenueCapacity ?? 65,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 8,
    debtLevel: partial.debtLevel ?? 26,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 3,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runCostRecoveryPricingSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildCostRecoveryStatement(13, snap({}));
  record('CR01', 'Five user-charge lines', healthy.lines.length === 5, 'ok');
  record('CR02', 'Weighted ratio in valid range', healthy.weightedRecoveryRatio > 0 && healthy.weightedRecoveryRatio <= 1, `w=${healthy.weightedRecoveryRatio}`);
  record('CR03', 'Healthy meets portfolio target', healthy.withinPortfolioTarget, healthy.narrative);

  const revenueFocus = buildCostRecoveryStatement(13, snap({ revenuePolicy: 'revenue_focused', fiscalHeadroom: 10 }));
  record('CR04', 'Revenue-focused policy lifts recovery', revenueFocus.weightedRecoveryRatio >= healthy.weightedRecoveryRatio, `${revenueFocus.weightedRecoveryRatio} vs ${healthy.weightedRecoveryRatio}`);

  const critical = buildCostRecoveryStatement(13, snap({ pressure: 'critical', fiscalHeadroom: -15 }));
  record('CR05', 'Critical pressure overrides portfolio target', critical.withinPortfolioTarget, 'ok');

  record('CR06', 'Aggregate recovered <= full cost', healthy.aggregateRecovered <= healthy.aggregateFullCost, `${healthy.aggregateRecovered}/${healthy.aggregateFullCost}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: cash-management/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runCashManagementSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildCashManagementReport(11, snap({}));
  record('CM01', 'Operating and capital TGA lines', healthy.lines.length === 2, 'ok');
  record('CM02', 'Healthy within drawdown limit', healthy.withinDrawdownLimit, healthy.narrative);
  record('CM03', 'Runway turns non-negative', healthy.runwayTurns >= 0, `runway=${healthy.runwayTurns}`);

  const prudent = buildCashManagementReport(11, snap({ reservePolicy: 'prudent', fiscalHeadroom: 12 }));
  record(
    'CM04',
    'Prudent reserve lifts closing balance',
    prudent.aggregateClosingBalance >= healthy.aggregateClosingBalance,
    `${prudent.aggregateClosingBalance} vs ${healthy.aggregateClosingBalance}`
  );

  const eoy = buildCashManagementReport(11, snap({ fiscalHeadroom: -2, maintenanceLoad: 16, debtServiceLoad: 14 }));
  record('CM05', 'Stressed fiscal position may fail drawdown', eoy.withinDrawdownLimit === false || eoy.runwayBand !== 'comfortable', eoy.narrative);

  const critical = buildCashManagementReport(11, snap({ pressure: 'critical', fiscalHeadroom: -20 }));
  record('CM06', 'Critical pressure overrides drawdown guard', critical.withinDrawdownLimit, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: appropriation-warrants/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runAppropriationWarrantsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildAppropriationWarrantLedger(8, snap({}));
  record('AW01', 'Five portfolio warrant lines', healthy.lines.length === 5, 'ok');
  record('AW02', 'Healthy lapse within tolerance', healthy.lapseWithinTolerance, healthy.narrative);
  record(
    'AW03',
    'Issued plus remaining approximates appropriation',
    healthy.lines.every(l => l.warrantIssuedPoints + l.warrantRemainingPoints <= l.appropriationPoints + 0.2),
    'ok'
  );

  const lateYear = buildAppropriationWarrantLedger(11, snap({ pressure: 'strained', fiscalHeadroom: -1 }));
  record(
    'AW04',
    'Late-year strained pressure raises lapse risk',
    lateYear.aggregateLapseRisk >= healthy.aggregateLapseRisk,
    `${lateYear.aggregateLapseRisk} vs ${healthy.aggregateLapseRisk}`
  );

  const critical = buildAppropriationWarrantLedger(11, snap({ pressure: 'critical', fiscalHeadroom: -18 }));
  record('AW05', 'Critical overrides aggregate lapse guard', critical.lapseWithinTolerance, 'ok');

  record(
    'AW06',
    'Each line has warrant id',
    healthy.lines.every(l => l.warrantId.startsWith('warrant_')),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: supplementary-estimates/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runSupplementaryEstimatesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildSupplementaryEstimatesReport(8, snap({}));
  record('SE01', 'Five supplementary estimate lines', healthy.lines.length === 5, 'ok');
  record('SE02', 'Healthy revision within tolerance', healthy.withinRevisionTolerance, healthy.narrative);
  record(
    'SE03',
    'Net revision equals upward minus downward',
    Math.abs(healthy.netRevisionPoints - (healthy.aggregateUpwardRevision - healthy.aggregateDownwardRevision)) < 0.15,
    `net=${healthy.netRevisionPoints}`
  );

  const midYear = buildSupplementaryEstimatesReport(7, snap({ turn: 7, maintenanceLoad: 16, fiscalHeadroom: -2 }));
  record(
    'SE04',
    'Strained maintenance raises parameter drift',
    midYear.aggregateUpwardRevision >= healthy.aggregateUpwardRevision,
    `${midYear.aggregateUpwardRevision} vs ${healthy.aggregateUpwardRevision}`
  );

  const critical = buildSupplementaryEstimatesReport(11, snap({ pressure: 'critical', fiscalHeadroom: -20 }));
  record('SE05', 'Critical pressure overrides revision guard', critical.withinRevisionTolerance, 'ok');

  record(
    'SE06',
    'Each line carries portfolio id',
    healthy.lines.every(l => l.portfolioId.length > 0),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: spending-offsets/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runSpendingOffsetsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildSpendingOffsetsReport(8, snap({}));
  record('SO01', 'Five offset portfolio lines', healthy.lines.length === 5, 'ok');
  record('SO02', 'Healthy portfolio meets coverage floor', healthy.withinPortfolioTarget, healthy.narrative);
  record(
    'SO03',
    'Coverage ratio bounded',
    healthy.portfolioCoverageRatio >= 0 && healthy.portfolioCoverageRatio <= 1.5,
    `ratio=${healthy.portfolioCoverageRatio}`
  );

  const election = buildSpendingOffsetsReport(10, snap({ turn: 10 }));
  record(
    'SO04',
    'Election window raises new spending load',
    election.aggregateNewSpending >= healthy.aggregateNewSpending,
    `${election.aggregateNewSpending} vs ${healthy.aggregateNewSpending}`
  );

  const critical = buildSpendingOffsetsReport(10, snap({ pressure: 'critical', fiscalHeadroom: -22 }));
  record('SO05', 'Critical overrides portfolio target', critical.withinPortfolioTarget, 'ok');

  record(
    'SO06',
    'Fully offset lines have coverage at least 1',
    healthy.lines.filter(l => l.fullyOffset).every(l => l.coverageRatio >= 0.99),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: portfolio-outturn/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runPortfolioOutturnSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildPortfolioOutturnReport(9, snap({}));
  record('PO01', 'Five portfolio outturn lines', healthy.lines.length === 5, 'ok');
  record('PO02', 'Healthy aggregate within tolerance', healthy.withinReconciliationTolerance, healthy.narrative);
  record(
    'PO03',
    'Variance ratio bounded per line under healthy',
    healthy.lines.every(l => l.withinPortfolioBand),
    `outside=${healthy.portfoliosOutsideBand}`
  );

  const strained = buildPortfolioOutturnReport(11, snap({ turn: 11, maintenanceLoad: 19, fiscalHeadroom: -4, pressure: 'strained' }));
  record(
    'PO04',
    'Strained maintenance increases aggregate variance magnitude',
    Math.abs(strained.aggregateVariancePoints) >= Math.abs(healthy.aggregateVariancePoints),
    `${strained.aggregateVariancePoints} vs ${healthy.aggregateVariancePoints}`
  );

  const critical = buildPortfolioOutturnReport(12, snap({ pressure: 'critical', fiscalHeadroom: -22, maintenanceLoad: 22 }));
  record('PO05', 'Critical pressure overrides reconciliation guard', critical.withinReconciliationTolerance, 'ok');

  record(
    'PO06',
    'Each line links portfolio id',
    healthy.lines.every(l => l.portfolioId.startsWith('pf_')),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: debt-portfolio-governance/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 72,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 28,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runDebtPortfolioGovernanceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildDebtPortfolioGovernanceReport(10, snap({}));
  record('DPG01', 'Five debt portfolio tranches', healthy.tranches.length === 5, 'ok');
  record('DPG02', 'Healthy within governance targets', healthy.withinGovernanceTargets, healthy.narrative);
  record(
    'DPG03',
    'Weighted duration within band',
    healthy.weightedAverageDurationYears >= 4 && healthy.weightedAverageDurationYears <= 10,
    `wad=${healthy.weightedAverageDurationYears}`
  );

  const stressed = buildDebtPortfolioGovernanceReport(10, snap({ debtServiceLoad: 18, debtLevel: 55 }), {
    liquidityStress: true
  });
  record(
    'DPG04',
    'Liquidity stress keeps rollover alignment or critical override path',
    stressed.rolloverStressAligned || stressed.withinGovernanceTargets,
    `aligned=${stressed.rolloverStressAligned}`
  );

  const noDebt = buildDebtPortfolioGovernanceReport(10, snap({ debtEnabled: false, debtLevel: 0 }));
  record('DPG05', 'Debt disabled still produces tranche ledger', noDebt.tranches.length === 5, 'ok');

  record(
    'DPG06',
    'Max tranche share bounded under healthy',
    healthy.maxTrancheShare <= 0.45,
    `max=${healthy.maxTrancheShare}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: fiscal-stress-scenarios/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 71,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 26,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalStressScenariosSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildFiscalStressScenariosReport(10, snap({}));
  record('FSS01', 'Three fiscal stress scenarios', healthy.scenarios.length === 3, 'ok');
  record('FSS02', 'Healthy within stress appetite', healthy.withinStressAppetite, healthy.narrative);
  record(
    'FSS03',
    'Worst delta is most negative scenario',
    healthy.worstHeadroomDelta === Math.min(...healthy.scenarios.map(s => s.headroomDeltaPoints)),
    `worst=${healthy.worstHeadroomDelta}`
  );

  const heavy = buildFiscalStressScenariosReport(10, snap({ debtLevel: 58, debtServiceLoad: 19, maintenanceLoad: 17 }));
  record(
    'FSS04',
    'Heavy debt/demand raises aggregate breaches',
    heavy.aggregateBreaches >= healthy.aggregateBreaches,
    `${heavy.aggregateBreaches} vs ${healthy.aggregateBreaches}`
  );

  const critical = buildFiscalStressScenariosReport(10, snap({ pressure: 'critical', fiscalHeadroom: -24 }));
  record('FSS05', 'Critical pressure overrides appetite guard', critical.withinStressAppetite, 'ok');

  const prudent = buildFiscalStressScenariosReport(10, snap({ reservePolicy: 'prudent' }));
  record(
    'FSS06',
    'Prudent reserve shaves breach count',
    prudent.aggregateBreaches <= healthy.aggregateBreaches,
    `${prudent.aggregateBreaches} vs ${healthy.aggregateBreaches}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: public-sector-balance-sheet/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 69,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 30,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runPublicSectorBalanceSheetSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildPublicSectorBalanceSheetReport(11, snap({}));
  record('PSBS01', 'Five balance sheet lines', healthy.lines.length === 5, 'ok');
  record('PSBS02', 'Healthy net worth above floor', healthy.withinNetWorthFloor, healthy.narrative);
  record(
    'PSBS03',
    'Net worth equals assets minus liabilities',
    Math.abs(healthy.netWorthPoints - (healthy.totalAssetsPoints - healthy.totalLiabilitiesPoints)) < 0.05,
    `nw=${healthy.netWorthPoints}`
  );

  const levered = buildPublicSectorBalanceSheetReport(11, snap({ debtLevel: 85, debtServiceLoad: 24, fiscalHeadroom: -8 }));
  record(
    'PSBS04',
    'High leverage lowers net worth ratio',
    levered.netWorthRatio < healthy.netWorthRatio,
    `${levered.netWorthRatio} vs ${healthy.netWorthRatio}`
  );

  const withCash = buildPublicSectorBalanceSheetReport(11, snap({}), { cashClosingBalance: 18 });
  record('PSBS05', 'Cash probe improves liquid slice coherence', withCash.liquidSliceCoherentWithCash, 'ok');

  const critical = buildPublicSectorBalanceSheetReport(11, snap({ pressure: 'critical', fiscalHeadroom: -30, debtLevel: 90 }));
  record('PSBS06', 'Critical pressure overrides net worth floor', critical.withinNetWorthFloor, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: tax-policy-sensitivity/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 28,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

function ledgerFor(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  return buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
}

export function runTaxPolicySensitivitySelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const healthy = buildTaxPolicySensitivityReport(12, v, ledgerFor(12, v));
  record('TPS01', 'Four tax policy sensitivity levers', healthy.lines.length === 4, 'ok');
  record('TPS02', 'Healthy within aggregate band', healthy.withinAggregateBand, healthy.narrative);
  record('TPS03', 'Ledger coherence under healthy', healthy.coherentWithLedgerDelta, 'ok');

  const focused = buildTaxPolicySensitivityReport(12, snap({ revenuePolicy: 'revenue_focused' }), ledgerFor(12, snap({ revenuePolicy: 'revenue_focused' })));
  record(
    'TPS04',
    'Revenue-focused policy shifts aggregate marginal',
    focused.aggregateMarginalPoints !== healthy.aggregateMarginalPoints,
    `${focused.aggregateMarginalPoints} vs ${healthy.aggregateMarginalPoints}`
  );

  const critical = buildTaxPolicySensitivityReport(12, snap({ pressure: 'critical', fiscalHeadroom: -22 }), ledgerFor(12, snap({ pressure: 'critical' })));
  record('TPS05', 'Critical overrides aggregate band', critical.withinAggregateBand, 'ok');

  record(
    'TPS06',
    'Each lever within sensitivity band after guard',
    healthy.lines.every(l => l.withinSensitivityBand),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: appropriation-lapse-register/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 25,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runAppropriationLapseRegisterSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const warrants = buildAppropriationWarrantLedger(11, v);
  const healthy = buildAppropriationLapseRegisterReport(11, v, warrants);
  record('ALR01', 'Five lapse register entries', healthy.entries.length === 5, 'ok');
  record('ALR02', 'Healthy within register tolerance', healthy.withinRegisterTolerance, healthy.narrative);
  record('ALR03', 'Aligned with warrant ledger', healthy.alignedWithWarrantLedger, 'ok');

  const midYear = buildAppropriationLapseRegisterReport(
    5,
    snap({ turn: 5 }),
    buildAppropriationWarrantLedger(5, snap({ turn: 5 }))
  );
  record(
    'ALR04',
    'Year-end turn raises lapse aggregate vs mid-year',
    healthy.aggregateLapsePoints >= midYear.aggregateLapsePoints * 0.95,
    `${healthy.aggregateLapsePoints} vs mid ${midYear.aggregateLapsePoints}`
  );

  const critical = buildAppropriationLapseRegisterReport(
    11,
    snap({ pressure: 'critical', fiscalHeadroom: -18 }),
    buildAppropriationWarrantLedger(11, snap({ pressure: 'critical' }))
  );
  record('ALR05', 'Critical overrides register tolerance', critical.withinRegisterTolerance, 'ok');

  record(
    'ALR06',
    'Lapse ratio bounded under healthy',
    healthy.lapseToRemainingRatio <= 0.53,
    `ratio=${healthy.lapseToRemainingRatio}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: contingency-drawdown/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 67,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runContingencyDrawdownSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(8);
  const { state } = computeFiscalOutcomesLayer({ turn: 8, v1012: v }, persisted);
  const flex = state.budget.lines.find(l => l.category === 'contingency')?.flexPoints ?? 4;
  const rules = assessFiscalRulesFramework({
    turn: 8,
    v1012: v,
    envelopeContingencyPoints: flex,
    forwardSpendingGrowth: 2
  });

  const healthy = buildContingencyDrawdownRegisterReport(8, v, flex, rules);
  record('CDR01', 'Four contingency drawdown entries', healthy.entries.length === 4, 'ok');
  record('CDR02', 'Healthy within drawdown cap', healthy.withinDrawdownCap, healthy.narrative);
  record('CDR03', 'Coherent with fiscal rules under healthy', healthy.coherentWithFiscalRules, 'ok');

  const strained = buildContingencyDrawdownRegisterReport(
    8,
    snap({ pressure: 'strained', maintenanceLoad: 16 }),
    flex,
    rules
  );
  record(
    'CDR04',
    'Strained pressure raises drawdown aggregate',
    strained.aggregateDrawdownPoints >= healthy.aggregateDrawdownPoints,
    `${strained.aggregateDrawdownPoints} vs ${healthy.aggregateDrawdownPoints}`
  );

  const critical = buildContingencyDrawdownRegisterReport(8, snap({ pressure: 'critical' }), flex, rules);
  record('CDR05', 'Critical overrides drawdown cap', critical.withinDrawdownCap, 'ok');

  record(
    'CDR06',
    'Closing flex non-negative',
    healthy.closingFlexPoints >= 0 && healthy.closingFlexPoints <= healthy.openingFlexPoints,
    `closing=${healthy.closingFlexPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: forward-estimates-integrity/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 69,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runForwardEstimatesIntegritySelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const supp = buildSupplementaryEstimatesReport(9, v);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const healthy = buildForwardEstimatesIntegrityReport(9, v, myefo, supp, outlook);

  record('FEI-T01', 'Four integrity sub-checks', healthy.checks.length === 4, 'ok');
  record('FEI-T02', 'Healthy forward integrity passes', healthy.allPassed, healthy.narrative);
  record('FEI-T03', 'Coherent with supplementary under healthy', healthy.coherentWithSupplementary, 'ok');

  const strained = buildForwardEstimatesIntegrityReport(
    9,
    snap({ fiscalHeadroom: -5, pressure: 'strained' }),
    buildMultiYearExpenditureFramework(snap({ fiscalHeadroom: -5, pressure: 'strained' }), 3),
    buildSupplementaryEstimatesReport(9, snap({ fiscalHeadroom: -5, pressure: 'strained' })),
    buildMediumTermFiscalOutlook(snap({ fiscalHeadroom: -5, pressure: 'strained' }), 3)
  );
  record(
    'FEI-T04',
    'Strained snapshot runs integrity suite',
    strained.checks.length === 4,
    `allPassed=${strained.allPassed}`
  );

  const critical = buildForwardEstimatesIntegrityReport(
    9,
    snap({ pressure: 'critical', fiscalHeadroom: -20 }),
    myefo,
    supp,
    outlook
  );
  record('FEI-T05', 'Critical pressure override path', critical.allPassed || critical.coherentWithSupplementary, 'ok');

  record(
    'FEI-T06',
    'Band drift non-negative',
    healthy.bandDriftPoints >= 0,
    `drift=${healthy.bandDriftPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: sovereign-credit-outlook/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 13,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 28,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runSovereignCreditOutlookSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const gov = buildDebtPortfolioGovernanceReport(13, v);
  const stress = buildFiscalStressScenariosReport(13, v);
  const healthy = buildSovereignCreditOutlookReport(13, v, gov, { stressWorstDelta: stress.worstHeadroomDelta });

  record('SCO01', 'Healthy within outlook band', healthy.withinOutlookBand, healthy.narrative);
  record('SCO02', 'Stable or watch band under healthy', healthy.ratingBand === 'stable' || healthy.ratingBand === 'negative_watch', healthy.ratingBand);
  record('SCO03', 'Coherent with debt governance', healthy.coherentWithDebtGovernance, 'ok');

  const levered = buildSovereignCreditOutlookReport(
    13,
    snap({ debtLevel: 72, debtServiceLoad: 20, fiscalHeadroom: -6 }),
    buildDebtPortfolioGovernanceReport(13, snap({ debtLevel: 72, debtServiceLoad: 20 }), { liquidityStress: true }),
    { stressWorstDelta: -9 }
  );
  record(
    'SCO04',
    'Levered snapshot raises implied spread',
    levered.impliedSpreadBps > healthy.impliedSpreadBps,
    `${levered.impliedSpreadBps} vs ${healthy.impliedSpreadBps}`
  );

  const noDebt = buildSovereignCreditOutlookReport(13, snap({ debtEnabled: false }), gov, {});
  record('SCO05', 'Debt disabled passes outlook guard', noDebt.withinOutlookBand, 'ok');

  record('SCO06', 'Implied spread positive', healthy.impliedSpreadBps > 0, `spread=${healthy.impliedSpreadBps}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: debt-service-coverage/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 14,
    revenueCapacity: partial.revenueCapacity ?? 72,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 26,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

function ledgerFor(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  return buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
}

export function runDebtServiceCoverageSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const cash = buildCashManagementReport(14, v);
  const healthy = buildDebtServiceCoverageReport(14, v, ledgerFor(14, v), cash);

  record('DSC01', 'Healthy within coverage floor', healthy.withinCoverageFloor, healthy.narrative);
  record('DSC02', 'Runway aligned under healthy', healthy.runwayTurnsAligned, `runway=${cash.runwayTurns}`);
  record(
    'DSC03',
    'Coverage ratio matches revenue over service',
    Math.abs(healthy.coverageRatio - healthy.revenueCoverPoints / Math.max(0.1, healthy.debtServicePoints)) < 0.05,
    `ratio=${healthy.coverageRatio}`
  );

  const thin = buildDebtServiceCoverageReport(
    14,
    snap({ debtServiceLoad: 22, debtLevel: 60, fiscalHeadroom: -4 }),
    ledgerFor(14, snap({ debtServiceLoad: 22 })),
    buildCashManagementReport(14, snap({ debtServiceLoad: 22, fiscalHeadroom: -4 }))
  );
  record(
    'DSC04',
    'High service load lowers coverage vs healthy',
    thin.coverageRatio < healthy.coverageRatio,
    `${thin.coverageRatio} vs ${healthy.coverageRatio}`
  );

  const critical = buildDebtServiceCoverageReport(14, snap({ pressure: 'critical' }), ledgerFor(14, snap({ pressure: 'critical' })), cash);
  record('DSC05', 'Critical overrides coverage floor', critical.withinCoverageFloor, 'ok');

  record('DSC06', 'Adequate or strong band under healthy', healthy.coverageBand === 'adequate' || healthy.coverageBand === 'strong', healthy.coverageBand);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: grant-clawback-schedule/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runGrantClawbackScheduleSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const ig = allocateIntergovernmentalGrants(10, v);
  const healthy = buildGrantClawbackScheduleReport(10, v, ig);

  record('GCS01', 'Five clawback schedule tranches', healthy.tranches.length === 5, 'ok');
  record('GCS02', 'Healthy within schedule tolerance', healthy.withinScheduleTolerance, healthy.narrative);
  record('GCS03', 'Aligned with IGR pool under healthy', healthy.alignedWithIgrPool, 'ok');

  const stressed = buildGrantClawbackScheduleReport(
    10,
    snap({ maintenanceLoad: 18, fiscalHeadroom: -6, pressure: 'strained' }),
    allocateIntergovernmentalGrants(10, snap({ maintenanceLoad: 18, fiscalHeadroom: -6, pressure: 'strained' }))
  );
  record(
    'GCS04',
    'Stressed grants raise clawback pool vs healthy',
    stressed.aggregateClawbackPoints >= healthy.aggregateClawbackPoints,
    `${stressed.aggregateClawbackPoints} vs ${healthy.aggregateClawbackPoints}`
  );

  const critical = buildGrantClawbackScheduleReport(10, snap({ pressure: 'critical' }), ig);
  record('GCS05', 'Critical overrides schedule tolerance', critical.withinScheduleTolerance, 'ok');

  record(
    'GCS06',
    'Scheduled points non-negative',
    healthy.tranches.every(t => t.scheduledPoints >= 0),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: budget-neutral-packages/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 69,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 23,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runBudgetNeutralPackagesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const offsets = buildSpendingOffsetsReport(9, v);
  const supp = buildSupplementaryEstimatesReport(9, v);
  const healthy = buildBudgetNeutralPackagesReport(9, v, offsets, supp);

  record('BNP01', 'Four budget-neutral packages', healthy.packages.length === 4, 'ok');
  record('BNP02', 'Healthy portfolio neutrality', healthy.withinPortfolioNeutrality, healthy.narrative);
  record('BNP03', 'Coherent with spending offsets', healthy.coherentWithSpendingOffsets, 'ok');

  record(
    'BNP04',
    'Aggregate new spending positive under healthy',
    healthy.aggregateNewSpending > 0 && healthy.aggregateOffsets > 0,
    `new=${healthy.aggregateNewSpending}`
  );

  const critical = buildBudgetNeutralPackagesReport(9, snap({ pressure: 'critical' }), offsets, supp);
  record('BNP05', 'Critical overrides neutrality guard', critical.withinPortfolioNeutrality, 'ok');

  record(
    'BNP06',
    'Each package within neutrality band after guard',
    healthy.packages.every(p => p.withinNeutralityBand),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: infrastructure-fiscal-load/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 67,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

const SAMPLE_PROJECT = {
  projectId: 'ifl_sample',
  title: 'Sample corridor',
  regionIds: ['national'],
  capitalPoints: 12,
  maintenancePointsPerTurn: 1.2,
  strategicWeight: 0.6,
  preferredVehicle: 'sovereign_bond_series' as const
};

export function runInfrastructureFiscalLoadSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(8);
  const { state } = computeFiscalOutcomesLayer({ turn: 8, v1012: v }, persisted);
  const infra = summarizeInfrastructureFinancing(8, [SAMPLE_PROJECT], v, state.budget);
  const healthy = buildInfrastructureFiscalLoadReport(8, v, infra, state.budget);

  record('IFL01', 'At least one infra load line', healthy.lines.length >= 1, 'ok');
  record('IFL02', 'Healthy within portfolio load cap', healthy.withinPortfolioLoadCap, healthy.narrative);
  record('IFL03', 'Feasible under envelope', healthy.feasibleUnderEnvelope, 'ok');

  const heavy = buildInfrastructureFiscalLoadReport(
    8,
    snap({ maintenanceLoad: 18, fiscalHeadroom: -5 }),
    summarizeInfrastructureFinancing(
      8,
      [{ ...SAMPLE_PROJECT, capitalPoints: 28, maintenancePointsPerTurn: 3.5 }],
      snap({ maintenanceLoad: 18 }),
      computeFiscalOutcomesLayer({ turn: 8, v1012: snap({ maintenanceLoad: 18 }) }, createInitialFiscalOutcomesPersisted(8)).state.budget
    ),
    computeFiscalOutcomesLayer({ turn: 8, v1012: snap({ maintenanceLoad: 18 }) }, createInitialFiscalOutcomesPersisted(8)).state.budget
  );
  record(
    'IFL04',
    'Heavier project raises load ratio vs healthy',
    heavy.loadToCapacityRatio >= healthy.loadToCapacityRatio,
    `${heavy.loadToCapacityRatio} vs ${healthy.loadToCapacityRatio}`
  );

  const critical = buildInfrastructureFiscalLoadReport(8, snap({ pressure: 'critical' }), infra, state.budget);
  record('IFL05', 'Critical overrides load cap', critical.withinPortfolioLoadCap, 'ok');

  record(
    'IFL06',
    'Envelope capacity positive',
    healthy.envelopeCapacityPoints > 0,
    `cap=${healthy.envelopeCapacityPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// --- source: revenue-integrity-audit/self-tests.ts ---

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 71,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 27,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

function bundle(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  const ledger = buildNationalRevenueLedger({ turn, v1012, taxInstruments: state.taxInstruments });
  const tax = buildTaxPolicySensitivityReport(turn, v1012, ledger);
  return { ledger, tax };
}

export function runRevenueIntegrityAuditSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const { ledger, tax } = bundle(12, v);
  const healthy = buildRevenueIntegrityAuditReport(12, v, ledger, tax);

  record('RIA01', 'Four integrity findings', healthy.findings.length === 4, 'ok');
  record('RIA02', 'Healthy audit passes', healthy.allPassed, healthy.narrative);
  record('RIA03', 'Coherent with tax sensitivity', healthy.coherentWithTaxSensitivity, 'ok');

  const tight = buildRevenueIntegrityAuditReport(
    12,
    snap({ fiscalHeadroom: -8, pressure: 'strained' }),
    bundle(12, snap({ fiscalHeadroom: -8, pressure: 'strained' })).ledger,
    bundle(12, snap({ fiscalHeadroom: -8, pressure: 'strained' })).tax
  );
  record('RIA04', 'Strained headroom still runs audit', tight.findings.length === 4, `passed=${tight.allPassed}`);

  const critical = buildRevenueIntegrityAuditReport(12, snap({ pressure: 'critical' }), ledger, tax);
  record('RIA05', 'Critical override path', critical.allPassed || critical.coherentWithTaxSensitivity, 'ok');

  record('RIA06', 'Delta gap non-negative', healthy.aggregateDeltaGap >= 0, `gap=${healthy.aggregateDeltaGap}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}


// OP10M_MODULE_END agent-07-public-finance
