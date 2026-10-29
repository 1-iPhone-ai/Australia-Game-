/**
 * V1014_WORKFORCE — core types (SECTION 20BD / O6K-25 — 20AC part 4).
 * Cross-wire: 20AC skills graph, 20AJ migration catalogs, 20AF household demand.
 */

export const V1014_WORKFORCE_SCHEMA_VERSION = '10.14.workforce_v2.1' as const;

export type V1014WorkforceRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1014WorkforceSkillDomain =
  | 'engineering'
  | 'healthcare'
  | 'trades'
  | 'digital'
  | 'logistics'
  | 'education'
  | 'mining'
  | 'agriculture'
  | 'hospitality'
  | 'public_admin';

export type V1014WorkforceMigrationFlowBand = 'surge' | 'balanced' | 'constrained' | 'outflow';

export type V1014WorkforceReadinessBand = 'strong' | 'adequate' | 'strained' | 'weak' | 'blocking';

export interface V1014WorkforceAc20Slice {
  turn: number;
  nationalReadiness: number;
  specialistGap: number;
  regionalSkillSupply: Partial<Record<V1014WorkforceRegionId, number>>;
  domainDepth?: Partial<Record<V1014WorkforceSkillDomain, number>>;
}

export interface V1014WorkforceAj20Slice {
  turn: number;
  migrationFlowBand: V1014WorkforceMigrationFlowBand;
  regionalAttractiveness: Partial<Record<V1014WorkforceRegionId, number>>;
  wagePressureIndex: number;
  visaBacklogTurns?: number;
}

export interface V1014WorkforceAf20Slice {
  turn: number;
  affordabilityStress: number;
  regionalLivingStandard: Partial<Record<V1014WorkforceRegionId, number>>;
  domesticDemandPull: number;
}

export interface V1014WorkforceSkillsGraphEdge {
  fromDomain: V1014WorkforceSkillDomain;
  toDomain: V1014WorkforceSkillDomain;
  weight: number;
  retrainTurns: number;
  corridorId: string;
}

export interface V1014WorkforceMigrationScenarioSnapshot {
  scenarioId: string;
  regionId: V1014WorkforceRegionId;
  flowBand: V1014WorkforceMigrationFlowBand;
  netInflow: number;
  skillMismatchIndex: number;
  readinessBand: V1014WorkforceReadinessBand;
}

export interface V1014WorkforcePersisted {
  schemaVersion: typeof V1014_WORKFORCE_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  migrationSnapshots: Record<string, V1014WorkforceMigrationScenarioSnapshot>;
  skillsGraphRevision: number;
  regionalAggregates: Partial<
    Record<
      V1014WorkforceRegionId,
      {
        queuePressure: number;
        mismatchIndex: number;
        migrationLoopGain: number;
        compositeReadiness: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateMismatch: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1014WorkforceTurnInput {
  turn: number;
  seed: number;
  ac20: V1014WorkforceAc20Slice;
  aj20: V1014WorkforceAj20Slice;
  af20: V1014WorkforceAf20Slice;
  fiscalHeadroom: number;
  policyRetrainFocus: number;
  activeScenarioIds: string[];
  activeCorridorIds: string[];
  persisted: V1014WorkforcePersisted | null;
}

export interface V1014WorkforceRuntimeState {
  turn: number;
  aggregateMismatchIndex: number;
  aggregateMigrationPressure: number;
  nationalReadinessScore: number;
  householdLaborIncomeEffect: number;
  skillsGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1014WorkforceAc20Bridge {
  readinessDelta: number;
  specialistGapDelta: number;
  domainPressure: Partial<Record<V1014WorkforceSkillDomain, number>>;
}

export interface V1014WorkforceAj20Bridge {
  flowBandHint: V1014WorkforceMigrationFlowBand;
  attractivenessDelta: Partial<Record<V1014WorkforceRegionId, number>>;
  wagePressureContribution: number;
}

export interface V1014WorkforceAf20Bridge {
  affordabilityDrag: number;
  domesticDemandMultiplier: number;
  livingStandardDelta: Partial<Record<V1014WorkforceRegionId, number>>;
}

export interface V1014WorkforceTurnResult {
  state: V1014WorkforceRuntimeState;
  persisted: V1014WorkforcePersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1014WorkforceSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
