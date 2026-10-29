/**
 * V1031_GRES — grid network resilience, state–federal transfer & substation_zone (SECTION 20CA / O6K-67).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1031_GRES_SCHEMA_VERSION = '10.30.grid_resilience.1' as const;

export type V1031GresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1031GresGridResilienceChannel =
  | 'transmission'
  | 'distribution'
  | 'renewable_curtailment'
  | 'fossil_ramp'
  | 'storage_dispatch'
  | 'demand_response'
  | 'microgrid'
  | 'remote_feeder'
  | 'regional'
  | 'remote';

export type V1031GresGridResilienceChannelLegacy =
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

export type V1031GresGridResilienceChannelLegacy =
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

export type V1031GresGridResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1031GresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1031GresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1031GresRegionId, number>>;
  gridBufferIndex: number;
}

export interface V1031GresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1031GresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  outageCascadeRisk: number;
}

export interface V1031GresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1031GresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation substation-zone-node slice (SECTION 20BR). */
export interface V1031GresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1031GresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1031GresWaterSecurity20bwSlice {
  turn: number;
  inlandHeatExposurePressure: number;
  grantStackLoad: number;
  heatwaveDriftTurns: number;
}

/** Inland heat slice (SECTION 20BZ — V1030 heatwave / arid-buffer bridge). */
export interface V1031GresInlandHeat20bzSlice {
  turn: number;
  inlandHeatExposurePressure: number;
  grantStackLoad: number;
  heatwaveDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1031GresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance substation-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1031GresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1031GresGridBufferEdge {
  fromChannel: V1031GresGridResilienceChannel;
  toChannel: V1031GresGridResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1031GresOutageSnapshot {
  scenarioId: string;
  regionId: V1031GresRegionId;
  gridResilienceChannel: V1031GresGridResilienceChannel;
  gridResilienceBand: V1031GresGridResilienceBand;
  gridStressExposureIndex: number;
  gridBufferDelayTurns: number;
  gridResilienceScore: number;
  gridResilienceBand: V1031GresGridResilienceBand;
}

export interface V1031GresPersisted {
  schemaVersion: typeof V1031_GRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  outageSnapshots: Record<string, V1031GresOutageSnapshot>;
  gridBufferGraphRevision: number;
  regionalGridBuffer: Partial<
    Record<
      V1031GresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateGridStressExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1031GresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1031GresV1014SupplySlice;
  trade20ba: V1031GresV1014TradeSlice;
  energy20bc: V1031GresV1014EnergySlice;
  workforce20bf: V1031GresV1014WorkforceSlice;
  publicServices20az: V1031GresPublicServices20azSlice;
  climateAdaptation20br: V1031GresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1031GresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1031GresBiodiversityStewardship20buSlice;
  reserveHeadroom: number;
  gridResiliencePolicyFocus: number;
  activeOutageScenarioIds: string[];
  activeSubstationZoneIds: string[];
  persisted: V1031GresPersisted | null;
}

export interface V1031GresRuntimeState {
  turn: number;
  aggregateGridStressExposureIndex: number;
  aggregateGridResilienceScore: number;
  gridNetworkHarmonyScore: number;
  gridBufferPressure: number;
  gridBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1031GresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1031GresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  inlandHeatDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1031GresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1031GresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1031GresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1031GresTurnResult {
  state: V1031GresRuntimeState;
  persisted: V1031GresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1031GresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
