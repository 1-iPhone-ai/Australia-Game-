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
