/**
 * V1035_CYRES — sovereign cyber network resilience, state–federal transfer & facility_zone (SECTION 20CG / O6K-84).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1035_CYRES_SCHEMA_VERSION = '10.32.cyber_resilience.1' as const;

export type V1035CyresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1035CyresCyberResilienceChannel =
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

export type V1035CyresCyberResilienceChannelLegacy =
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

export type V1035CyresCyberResilienceChannelLegacy =
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

export type V1035CyresCyberResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1035CyresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1035CyresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1035CyresRegionId, number>>;
  segmentBufferIndex: number;
}

export interface V1035CyresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1035CyresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  routingCascadeRisk: number;
}

export interface V1035CyresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1035CyresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation facility-zone-node slice (SECTION 20BR). */
export interface V1035CyresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1035CyresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1035CyresWaterSecurity20bwSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Critical infrastructure resilience slice (SECTION 20BZ — V1030 heatwave / arid-buffer bridge). */
export interface V1035CyresInlandHeat20bzSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1035CyresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance facility-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1035CyresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1035CyresSegmentBufferEdge {
  fromChannel: V1035CyresCyberResilienceChannel;
  toChannel: V1035CyresCyberResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1035CyresIntrusionSnapshot {
  scenarioId: string;
  regionId: V1035CyresRegionId;
  cyberResilienceChannel: V1035CyresCyberResilienceChannel;
  cyberResilienceBand: V1035CyresCyberResilienceBand;
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  cyberResilienceBand: V1035CyresCyberResilienceBand;
}

export interface V1035CyresPersisted {
  schemaVersion: typeof V1035_CYRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  intrusionSnapshots: Record<string, V1035CyresIntrusionSnapshot>;
  segmentBufferGraphRevision: number;
  regionalSegmentBuffer: Partial<
    Record<
      V1035CyresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSovereignDigitalStressExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1035CyresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1035CyresV1014SupplySlice;
  trade20ba: V1035CyresV1014TradeSlice;
  energy20bc: V1035CyresV1014EnergySlice;
  workforce20bf: V1035CyresV1014WorkforceSlice;
  publicServices20az: V1035CyresPublicServices20azSlice;
  climateAdaptation20br: V1035CyresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1035CyresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1035CyresBiodiversityStewardship20buSlice;
  reserveHeadroom: number;
  cyberResiliencePolicyFocus: number;
  activeIntrusionScenarioIds: string[];
  activeFacilityZoneIds: string[];
  persisted: V1035CyresPersisted | null;
}

export interface V1035CyresRuntimeState {
  turn: number;
  aggregateSovereignDigitalStressExposureIndex: number;
  aggregateCyberResilienceScore: number;
  sovereignDigitalNetworkHarmonyScore: number;
  segmentBufferPressure: number;
  segmentBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1035CyresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1035CyresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  criticalInfrastructureResilienceDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1035CyresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1035CyresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1035CyresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1035CyresTurnResult {
  state: V1035CyresRuntimeState;
  persisted: V1035CyresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1035CyresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
