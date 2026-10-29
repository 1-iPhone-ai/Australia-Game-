/**
 * V1028_DRES — disaster resilience, state–federal transfer & emergency_response (SECTION 20BX / O6K-62).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1028_DRES_SCHEMA_VERSION = '10.25.disaster_resilience.1' as const;

export type V1028DresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1028DresDisasterResilienceChannel =
  | 'bushfire'
  | 'flood'
  | 'cyclone'
  | 'heatwave'
  | 'pandemic'
  | 'infrastructure_failure'
  | 'cyber_incident'
  | 'evacuation'
  | 'regional'
  | 'remote';

export type V1028DresDisasterResilienceChannelLegacy =
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

export type V1028DresDisasterResilienceChannelLegacy =
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

export type V1028DresResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1028DresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1028DresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1028DresRegionId, number>>;
  evacuationCapacityIndex: number;
}

export interface V1028DresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1028DresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  cascadeRiskStress: number;
}

export interface V1028DresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1028DresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation emergency-response-node slice (SECTION 20BR). */
export interface V1028DresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1028DresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1028DresWaterSecurity20bwSlice {
  turn: number;
  supplyStressPressure: number;
  grantStackLoad: number;
  basinDriftTurns: number;
}

/** Crisis spine slice (SECTION 20AS — national crisis coordination bridge). */
export interface V1028DresCrisisSpine20asSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance emergency-response slice (SECTION 20BT — V1024 bridge). */
export interface V1028DresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1028DresEvacuationCapacityEdge {
  fromChannel: V1028DresDisasterResilienceChannel;
  toChannel: V1028DresDisasterResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1028DresHazardSnapshot {
  scenarioId: string;
  regionId: V1028DresRegionId;
  disasterResilienceChannel: V1028DresDisasterResilienceChannel;
  resilienceBand: V1028DresResilienceBand;
  disasterRiskIndex: number;
  evacuationCapacityDelayTurns: number;
  resilienceScore: number;
  resilienceBand: V1028DresResilienceBand;
}

export interface V1028DresPersisted {
  schemaVersion: typeof V1028_DRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  hazardSnapshots: Record<string, V1028DresHazardSnapshot>;
  evacuationCapacityGraphRevision: number;
  regionalEvacuationCapacity: Partial<
    Record<
      V1028DresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateDisasterRisk: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1028DresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1028DresV1014SupplySlice;
  trade20ba: V1028DresV1014TradeSlice;
  energy20bc: V1028DresV1014EnergySlice;
  workforce20bf: V1028DresV1014WorkforceSlice;
  publicServices20az: V1028DresPublicServices20azSlice;
  climateAdaptation20br: V1028DresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1028DresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1028DresBiodiversityStewardship20buSlice;
  shelterHeadroom: number;
  emergencyPolicyFocus: number;
  activeHazardScenarioIds: string[];
  activeEmergencyResponseIds: string[];
  persisted: V1028DresPersisted | null;
}

export interface V1028DresRuntimeState {
  turn: number;
  aggregateDisasterRiskIndex: number;
  aggregateResilienceScore: number;
  disasterClimateHarmonyScore: number;
  evacuationCapacityPressure: number;
  evacuationCapacityGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1028DresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1028DresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  waterSecurityDelta?: number;
  crisisSpineDelta?: number;
}

export interface V1028DresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1028DresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1028DresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1028DresTurnResult {
  state: V1028DresRuntimeState;
  persisted: V1028DresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1028DresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
