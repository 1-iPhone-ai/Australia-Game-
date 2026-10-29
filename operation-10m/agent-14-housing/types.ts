/** V10.14 Agent 14 — public service capacity & delayed spending (modular slice). */

export const AGENT14_WELLBEING_SCHEMA_VERSION = '10.14.2-housing-depth' as const;

export type PublicServicePillar = 'housing' | 'healthcare' | 'education';

export type WorkforceReadiness =
  | 'blocking'
  | 'weak'
  | 'strained'
  | 'balanced'
  | 'strong';

export interface SpendingCommitment {
  id: string;
  programId: string;
  pillar: PublicServicePillar;
  regionId: string;
  committedTurn: number;
  /** Total fiscal load spread across durationTurns (V10.12-style points, not player cash). */
  fiscalLoadPoints: number;
  durationTurns: number;
  baseImpact: number;
  /** Turns after commit before any KPI uplift applies. */
  effectLagTurns: number;
  /** Turns after lag to reach full baseImpact on KPI indices. */
  rampTurns: number;
}

export type CapacityBindingConstraint =
  | 'none'
  | 'program_slots'
  | 'fiscal_absorption'
  | 'workforce';

export interface PillarCapacitySlice {
  capacityIndex: number;
  loadRatio: number;
  activeCommitments: number;
}

export interface PublicServiceCapacitySnapshot {
  turn: number;
  nationalProgramSlots: number;
  slotsUsed: number;
  slotsFree: number;
  fiscalAbsorptionCap: number;
  fiscalLoadScheduledThisTurn: number;
  fiscalHeadroomUsedRatio: number;
  workforceUtilization: number;
  deliveryCapacityIndex: number;
  bindingConstraint: CapacityBindingConstraint;
  byPillar: Record<PublicServicePillar, PillarCapacitySlice>;
  evidence: string[];
}

export interface DelayedSpendingTurnEffects {
  turn: number;
  fiscalLoadThisTurn: number;
  /** Effective completed-project equivalents feeding V10.14 pillar delivery math. */
  completedProjectBoost: Record<PublicServicePillar, number>;
  /** Per-region fractional boost from regional programs (0–1 scale × baseImpact). */
  regionalKpiDelta: Record<string, Partial<Record<PublicServicePillar, number>>>;
  maturedCommitmentIds: string[];
  events: Array<{ id: string; kind: string; summary: string }>;
}

export interface DelayedSpendingPersisted {
  schemaVersion: typeof AGENT14_WELLBEING_SCHEMA_VERSION;
  active: SpendingCommitment[];
  history: Array<{ id: string; turn: number; summary: string }>;
}

export interface CapacityAndSpendingInputs {
  turn: number;
  fiscalHeadroom?: number;
  stateCapacityLoad?: number;
  workforceReadiness?: WorkforceReadiness;
  workforceSpecialistGap?: number;
  activeProgramCount?: number;
}

export interface EnrichedPublicServiceTurnInputs extends CapacityAndSpendingInputs {
  fiscalLoadFromActivePrograms: number;
  completedHousingProjects: number;
  completedHealthProjects: number;
  completedEducationProjects: number;
  activeProgramCount: number;
  capacity: PublicServiceCapacitySnapshot;
  spending: DelayedSpendingTurnEffects;
  housingWellbeing?: NationalHousingWellbeingSnapshot;
}

export type HousingPipelineStage =
  | 'planning'
  | 'approvals'
  | 'construction'
  | 'handover'
  | 'stabilized';

export type AffordabilityStressBand = 'low' | 'moderate' | 'elevated' | 'severe';

export interface RegionalHousingPipelineState {
  regionId: string;
  stage: HousingPipelineStage;
  planningBacklogMonths: number;
  dwellingsInPipeline: number;
  socialHousingCompletionsRate: number;
  affordabilityStress: AffordabilityStressBand;
  affordabilityIndex: number;
  remoteShare: number;
  deliveryPressure: number;
  evidence: string[];
}

export interface NationalHousingWellbeingSnapshot {
  turn: number;
  nationalAffordabilityIndex: number;
  affordabilityStress: AffordabilityStressBand;
  averagePlanningBacklogMonths: number;
  totalDwellingsInPipeline: number;
  socialCompletionsIndex: number;
  regionalEquityGap: number;
  regions: Record<string, RegionalHousingPipelineState>;
  narrativeSummary: string;
}
