/** SECTION 20AZ — V1014 public services v2 crosswalk types (expansion shard). */

export const V1014_PUBSVC_SCHEMA_VERSION = '10.14.2' as const;

export const V1014_PUBSVC_CORE_REGIONS = [
  'NSW',
  'VIC',
  'QLD',
  'WA',
  'SA',
  'TAS',
  'NT',
  'ACT',
] as const;

export type V1014PubsSvcRegionId = (typeof V1014_PUBSVC_CORE_REGIONS)[number];

export type V1014PubsSvcPillar = 'housing' | 'healthcare' | 'education';

export type V1014PubsSvcQueueBand =
  | 'clearing'
  | 'stable'
  | 'building'
  | 'severe'
  | 'critical';

export type V1014PubsSvcSkillGapBand =
  | 'aligned'
  | 'mild_gap'
  | 'moderate_gap'
  | 'severe_gap'
  | 'crisis_gap';

export type V1014PubsSvcMigrationFeedbackBand =
  | 'dampening'
  | 'neutral'
  | 'amplifying'
  | 'runaway_pressure';

export interface V1014PubsSvcQueueSlot {
  id: string;
  pillar: V1014PubsSvcPillar;
  regionId: V1014PubsSvcRegionId;
  waitTurns: number;
  demandPressure: number;
  throughputCapacity: number;
  staffingCoverage: number;
  band: V1014PubsSvcQueueBand;
}

export interface V1014PubsSvcSkillMismatchSlice {
  regionId: V1014PubsSvcRegionId;
  pillar: V1014PubsSvcPillar;
  requiredSkillIndex: number;
  availableSkillIndex: number;
  gapScore: number;
  band: V1014PubsSvcSkillGapBand;
  workforcePipelineTurns: number;
}

export interface V1014PubsSvcMigrationFeedbackSlice {
  regionId: V1014PubsSvcRegionId;
  inflowPressure: number;
  serviceAbsorption: number;
  housingQueueDelta: number;
  healthQueueDelta: number;
  educationQueueDelta: number;
  band: V1014PubsSvcMigrationFeedbackBand;
  loopGain: number;
}

export interface V1014PubsSvcRegionalAggregate {
  regionId: V1014PubsSvcRegionId;
  turn: number;
  queuePressureIndex: number;
  skillMismatchIndex: number;
  migrationLoopIndex: number;
  compositeKpi: number;
  pillars: Record<
    V1014PubsSvcPillar,
    {
      waitTurns: number;
      backlogBand: V1014PubsSvcQueueBand;
      skillGapBand: V1014PubsSvcSkillGapBand;
    }
  >;
}

export interface V1014PubsSvcNationalSnapshot {
  turn: number;
  schemaVersion: typeof V1014_PUBSVC_SCHEMA_VERSION;
  nationalQueuePressure: number;
  nationalSkillMismatch: number;
  nationalMigrationLoop: number;
  nationalCompositeKpi: number;
  regions: Record<V1014PubsSvcRegionId, V1014PubsSvcRegionalAggregate>;
  queues: V1014PubsSvcQueueSlot[];
  skillSlices: V1014PubsSvcSkillMismatchSlice[];
  migrationSlices: V1014PubsSvcMigrationFeedbackSlice[];
}

/** Read-only adapter surfaces for canonical §20AP / §20AC / §20AJ / §20AF. */
export interface V1014PubsSvcAdapter20AP {
  turn: number;
  nationalOutcomeIndex: number;
  regionalOutcome: Partial<
    Record<
      V1014PubsSvcRegionId,
      Partial<Record<V1014PubsSvcPillar, { accessScore: number; backlogPressure: number; staffingBand: string }>>
    >
  >;
}

export interface V1014PubsSvcAdapter20AC {
  turn: number;
  nationalReadiness: number;
  specialistGap: number;
  regionalSkillSupply: Partial<Record<V1014PubsSvcRegionId, number>>;
}

export interface V1014PubsSvcAdapter20AJ {
  turn: number;
  migrationFlowBand: string;
  regionalAttractiveness: Partial<Record<V1014PubsSvcRegionId, number>>;
  wagePressureIndex: number;
}

export interface V1014PubsSvcAdapter20AF {
  turn: number;
  affordabilityStress: number;
  regionalLivingStandard: Partial<Record<V1014PubsSvcRegionId, number>>;
  domesticDemandPull: number;
}

export interface V1014PubsSvcCrosswalkInputs {
  turn: number;
  ap20: V1014PubsSvcAdapter20AP;
  ac20: V1014PubsSvcAdapter20AC;
  aj20: V1014PubsSvcAdapter20AJ;
  af20: V1014PubsSvcAdapter20AF;
  policyFocus: Partial<Record<V1014PubsSvcPillar, number>>;
  fiscalHeadroom: number;
}

export interface V1014PubsSvcSection6Persisted {
  schemaVersion: typeof V1014_PUBSVC_SCHEMA_VERSION;
  lastTurn: number;
  regionalAggregates: Record<V1014PubsSvcRegionId, V1014PubsSvcRegionalAggregate>;
  historyTail: V1014PubsSvcRegionalAggregate[][];
}

export interface V1014PubsSvcTickResult {
  snapshot: V1014PubsSvcNationalSnapshot;
  persisted: V1014PubsSvcSection6Persisted;
  events: string[];
}
