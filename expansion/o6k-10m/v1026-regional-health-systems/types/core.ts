/**
 * V1026_RHS — regional health systems, state–federal transfer & hospital_network (SECTION 20BV / O6K-59).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1026_RHS_SCHEMA_VERSION = '10.25.regional_health_systems.1' as const;

export type V1026RhsRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1026RhsHealthSystemChannel =
  | 'emergency_care'
  | 'primary_access'
  | 'hospital_network'
  | 'telehealth'
  | 'rural_clinic'
  | 'specialist_referral'
  | 'aged_care'
  | 'mental_health'
  | 'regional'
  | 'remote';

export type V1026RhsHealthSystemChannelLegacy =
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

export type V1026RhsHealthSystemChannelLegacy =
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

export type V1026RhsHealthSystemBand = 'robust' | 'stable' | 'strained' | 'overloaded' | 'critical';

export type V1026RhsHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1026RhsV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1026RhsRegionId, number>>;
  primaryCareAccessIndex: number;
}

export interface V1026RhsV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1026RhsV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  surgeRiskStress: number;
}

export interface V1026RhsV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1026RhsPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation hospital-network-node slice (SECTION 20BR). */
export interface V1026RhsClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}

/** Digital governance hospital-network slice (SECTION 20BT — V1024 bridge). */
export interface V1026RhsDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1026RhsPrimaryCareAccessEdge {
  fromChannel: V1026RhsHealthSystemChannel;
  toChannel: V1026RhsHealthSystemChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1026RhsCareSnapshot {
  scenarioId: string;
  regionId: V1026RhsRegionId;
  healthSystemChannel: V1026RhsHealthSystemChannel;
  healthSystemBand: V1026RhsHealthSystemBand;
  capacityStressIndex: number;
  primaryCareAccessDelayTurns: number;
  healthSystemScore: number;
  healthSystemBand: V1026RhsHealthSystemBand;
}

export interface V1026RhsPersisted {
  schemaVersion: typeof V1026_RHS_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  careSnapshots: Record<string, V1026RhsCareSnapshot>;
  primaryCareAccessGraphRevision: number;
  regionalPrimaryCareAccess: Partial<
    Record<
      V1026RhsRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateCapacityStress: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1026RhsTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1026RhsV1014SupplySlice;
  trade20ba: V1026RhsV1014TradeSlice;
  energy20bc: V1026RhsV1014EnergySlice;
  workforce20bf: V1026RhsV1014WorkforceSlice;
  publicServices20az: V1026RhsPublicServices20azSlice;
  climateAdaptation20br: V1026RhsClimateAdaptation20brSlice;
  digitalGovernance20bt: V1026RhsDigitalGovernance20btSlice;
  bedHeadroom: number;
  healthPolicyFocus: number;
  activeCareScenarioIds: string[];
  activeHospitalNetworkIds: string[];
  persisted: V1026RhsPersisted | null;
}

export interface V1026RhsRuntimeState {
  turn: number;
  aggregateCapacityStressIndex: number;
  aggregateHealthSystemScore: number;
  healthClimateHarmonyScore: number;
  primaryCareAccessPressure: number;
  primaryCareAccessGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1026RhsSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1026RhsRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
}

export interface V1026RhsTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1026RhsEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1026RhsWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1026RhsTurnResult {
  state: V1026RhsRuntimeState;
  persisted: V1026RhsPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1026RhsSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
