/**
 * V1033_SCRES — supply chain network resilience, state–federal transfer & hub_zone (SECTION 20CD / O6K-79).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1033_SCRES_SCHEMA_VERSION = '10.32.supply_chain_resilience.1' as const;

export type V1033ScresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1033ScresSupplyChainResilienceChannel =
  | 'fiber_backbone'
  | '5g_ran'
  | 'satellite_backhaul'
  | 'ixp_peering'
  | 'dns_anycast'
  | 'cdn_edge'
  | 'last_mile'
  | 'enterprise_circuit'
  | 'regional'
  | 'remote';

export type V1033ScresSupplyChainResilienceChannelLegacy =
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

export type V1033ScresSupplyChainResilienceChannelLegacy =
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

export type V1033ScresSupplyChainResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1033ScresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1033ScresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1033ScresRegionId, number>>;
  corridorBufferIndex: number;
}

export interface V1033ScresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1033ScresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  routingCascadeRisk: number;
}

export interface V1033ScresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1033ScresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation hub-zone-node slice (SECTION 20BR). */
export interface V1033ScresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1033ScresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1033ScresWaterSecurity20bwSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Telecom resilience slice (SECTION 20BZ — V1030 heatwave / arid-buffer bridge). */
export interface V1033ScresInlandHeat20bzSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1033ScresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance hub-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1033ScresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1033ScresCorridorBufferEdge {
  fromChannel: V1033ScresSupplyChainResilienceChannel;
  toChannel: V1033ScresSupplyChainResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1033ScresDisruptionSnapshot {
  scenarioId: string;
  regionId: V1033ScresRegionId;
  supplyChainResilienceChannel: V1033ScresSupplyChainResilienceChannel;
  supplyChainResilienceBand: V1033ScresSupplyChainResilienceBand;
  logisticsStressExposureIndex: number;
  corridorBufferDelayTurns: number;
  supplyChainResilienceScore: number;
  supplyChainResilienceBand: V1033ScresSupplyChainResilienceBand;
}

export interface V1033ScresPersisted {
  schemaVersion: typeof V1033_SCRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  disruptionSnapshots: Record<string, V1033ScresDisruptionSnapshot>;
  corridorBufferGraphRevision: number;
  regionalCorridorBuffer: Partial<
    Record<
      V1033ScresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateLogisticsStressExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1033ScresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1033ScresV1014SupplySlice;
  trade20ba: V1033ScresV1014TradeSlice;
  energy20bc: V1033ScresV1014EnergySlice;
  workforce20bf: V1033ScresV1014WorkforceSlice;
  publicServices20az: V1033ScresPublicServices20azSlice;
  climateAdaptation20br: V1033ScresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1033ScresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1033ScresBiodiversityStewardship20buSlice;
  reserveHeadroom: number;
  supplyChainResiliencePolicyFocus: number;
  activeDisruptionScenarioIds: string[];
  activeHubZoneIds: string[];
  persisted: V1033ScresPersisted | null;
}

export interface V1033ScresRuntimeState {
  turn: number;
  aggregateLogisticsStressExposureIndex: number;
  aggregateSupplyChainResilienceScore: number;
  logisticsNetworkHarmonyScore: number;
  corridorBufferPressure: number;
  corridorBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1033ScresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1033ScresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  telecomResilienceDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1033ScresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1033ScresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1033ScresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1033ScresTurnResult {
  state: V1033ScresRuntimeState;
  persisted: V1033ScresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1033ScresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
