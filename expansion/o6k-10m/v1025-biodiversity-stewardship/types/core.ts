/**
 * V1025_BIO — biodiversity stewardship, state–federal transfer & protected_area (SECTION 20BU / O6K-56).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1025_BIO_SCHEMA_VERSION = '10.25.biodiversity_stewardship.1' as const;

export type V1025BioRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1025BioStewardshipChannel =
  | 'species_recovery'
  | 'habitat_connectivity'
  | 'offset_integrity'
  | 'invasive_pressure'
  | 'fire_regime'
  | 'marine_protected'
  | 'urban_green'
  | 'indigenous_care'
  | 'regional'
  | 'remote';

export type V1025BioStewardshipChannelLegacy =
  | 'rent'
  | 'mortgage'
  | 'social'
  | 'build_to_rent'
  | 'student'
  | 'senior'
  | 'regional'
  | 'remote'
  | 'investor'
  | 'co_living';

export type V1025BioStewardshipChannelLegacy =
  | 'freight'
  | 'energy'
  | 'water'
  | 'digital'
  | 'trade'
  | 'pharma'
  | 'food'
  | 'industrial'
  | 'telecom'
  | 'finance';

export type V1025BioStewardshipBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1025BioHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1025BioV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1025BioRegionId, number>>;
  conservationOffsetIndex: number;
}

export interface V1025BioV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1025BioV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  invasiveRiskStress: number;
}

export interface V1025BioV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1025BioPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation protected-area-node slice (SECTION 20BR). */
export interface V1025BioClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}

export interface V1025BioConservationOffsetEdge {
  fromChannel: V1025BioStewardshipChannel;
  toChannel: V1025BioStewardshipChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1025BioRecoverySnapshot {
  scenarioId: string;
  regionId: V1025BioRegionId;
  stewardshipChannel: V1025BioStewardshipChannel;
  stewardshipBand: V1025BioStewardshipBand;
  ecosystemStressIndex: number;
  conservationOffsetDelayTurns: number;
  stewardshipScore: number;
  stewardshipBand: V1025BioStewardshipBand;
}

export interface V1025BioPersisted {
  schemaVersion: typeof V1025_BIO_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  recoverySnapshots: Record<string, V1025BioRecoverySnapshot>;
  conservationOffsetGraphRevision: number;
  regionalConservationOffset: Partial<
    Record<
      V1025BioRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateEcosystemStress: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1025BioTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1025BioV1014SupplySlice;
  trade20ba: V1025BioV1014TradeSlice;
  energy20bc: V1025BioV1014EnergySlice;
  workforce20bf: V1025BioV1014WorkforceSlice;
  publicServices20az: V1025BioPublicServices20azSlice;
  climateAdaptation20br: V1025BioClimateAdaptation20brSlice;
  habitatHeadroom: number;
  stewardshipPolicyFocus: number;
  activeRecoveryScenarioIds: string[];
  activeProtectedAreaIds: string[];
  persisted: V1025BioPersisted | null;
}

export interface V1025BioRuntimeState {
  turn: number;
  aggregateEcosystemStressIndex: number;
  aggregateStewardshipScore: number;
  stewardshipClimateHarmonyScore: number;
  conservationOffsetPressure: number;
  conservationOffsetGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1025BioSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1025BioRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
}

export interface V1025BioTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1025BioEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1025BioWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1025BioTurnResult {
  state: V1025BioRuntimeState;
  persisted: V1025BioPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1025BioSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
