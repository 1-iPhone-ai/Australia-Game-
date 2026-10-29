/**
 * V1034_CIRES — critical infrastructure network resilience, state–federal transfer & facility_zone (SECTION 20CE / O6K-80).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1034_CIRES_SCHEMA_VERSION = '10.32.critical_infrastructure_resilience.1' as const;

export type V1034CiresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1034CiresCriticalInfrastructureResilienceChannel =
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

export type V1034CiresCriticalInfrastructureResilienceChannelLegacy =
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

export type V1034CiresCriticalInfrastructureResilienceChannelLegacy =
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

export type V1034CiresCriticalInfrastructureResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1034CiresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1034CiresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1034CiresRegionId, number>>;
  segmentBufferIndex: number;
}

export interface V1034CiresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1034CiresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  routingCascadeRisk: number;
}

export interface V1034CiresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1034CiresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation facility-zone-node slice (SECTION 20BR). */
export interface V1034CiresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1034CiresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1034CiresWaterSecurity20bwSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Supply chain resilience slice (SECTION 20BZ — V1030 heatwave / arid-buffer bridge). */
export interface V1034CiresInlandHeat20bzSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1034CiresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance facility-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1034CiresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1034CiresSegmentBufferEdge {
  fromChannel: V1034CiresCriticalInfrastructureResilienceChannel;
  toChannel: V1034CiresCriticalInfrastructureResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1034CiresCompromiseSnapshot {
  scenarioId: string;
  regionId: V1034CiresRegionId;
  criticalInfrastructureResilienceChannel: V1034CiresCriticalInfrastructureResilienceChannel;
  criticalInfrastructureResilienceBand: V1034CiresCriticalInfrastructureResilienceBand;
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  criticalInfrastructureResilienceBand: V1034CiresCriticalInfrastructureResilienceBand;
}

export interface V1034CiresPersisted {
  schemaVersion: typeof V1034_CIRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  compromiseSnapshots: Record<string, V1034CiresCompromiseSnapshot>;
  segmentBufferGraphRevision: number;
  regionalSegmentBuffer: Partial<
    Record<
      V1034CiresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateCyberPhysicalStressExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1034CiresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1034CiresV1014SupplySlice;
  trade20ba: V1034CiresV1014TradeSlice;
  energy20bc: V1034CiresV1014EnergySlice;
  workforce20bf: V1034CiresV1014WorkforceSlice;
  publicServices20az: V1034CiresPublicServices20azSlice;
  climateAdaptation20br: V1034CiresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1034CiresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1034CiresBiodiversityStewardship20buSlice;
  reserveHeadroom: number;
  criticalInfrastructureResiliencePolicyFocus: number;
  activeCompromiseScenarioIds: string[];
  activeFacilityZoneIds: string[];
  persisted: V1034CiresPersisted | null;
}

export interface V1034CiresRuntimeState {
  turn: number;
  aggregateCyberPhysicalStressExposureIndex: number;
  aggregateCriticalInfrastructureResilienceScore: number;
  cyberPhysicalNetworkHarmonyScore: number;
  segmentBufferPressure: number;
  segmentBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1034CiresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1034CiresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  supplyChainResilienceDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1034CiresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1034CiresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1034CiresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1034CiresTurnResult {
  state: V1034CiresRuntimeState;
  persisted: V1034CiresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1034CiresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
