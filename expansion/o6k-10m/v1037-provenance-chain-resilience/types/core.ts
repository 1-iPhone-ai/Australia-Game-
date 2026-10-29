/**
 * V1037_PCRS — provenance chain network resilience, state–federal transfer & facility_zone (SECTION 20CK / O6K-88).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1037_PCRS_SCHEMA_VERSION = '10.32.provenance_chain_resilience.1' as const;

export type V1037PcresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1037PcresProvenanceChainResilienceChannel =
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

export type V1037PcresProvenanceChainResilienceChannelLegacy =
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

export type V1037PcresProvenanceChainResilienceChannelLegacy =
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

export type V1037PcresProvenanceChainResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1037PcresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1037PcresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1037PcresRegionId, number>>;
  custodyChainMeshIndex: number;
}

export interface V1037PcresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1037PcresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  routingCascadeRisk: number;
}

export interface V1037PcresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1037PcresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation facility-zone-node slice (SECTION 20BR). */
export interface V1037PcresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1037PcresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1037PcresWaterSecurity20bwSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Information integrity resilience slice (SECTION 20BZ — V1030 heatwave / arid-buffer bridge). */
export interface V1037PcresInlandHeat20bzSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1037PcresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance facility-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1037PcresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1037PcresCustodyChainMeshEdge {
  fromChannel: V1037PcresProvenanceChainResilienceChannel;
  toChannel: V1037PcresProvenanceChainResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1037PcresCustodySnapshot {
  scenarioId: string;
  regionId: V1037PcresRegionId;
  provenanceChainResilienceChannel: V1037PcresProvenanceChainResilienceChannel;
  provenanceChainResilienceBand: V1037PcresProvenanceChainResilienceBand;
  custodyChainStressExposureIndex: number;
  custodyChainMeshDelayTurns: number;
  provenanceChainResilienceScore: number;
  provenanceChainResilienceBand: V1037PcresProvenanceChainResilienceBand;
}

export interface V1037PcresPersisted {
  schemaVersion: typeof V1037_PCRS_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  custodySnapshots: Record<string, V1037PcresCustodySnapshot>;
  custodyChainMeshGraphRevision: number;
  regionalCustodyChainMesh: Partial<
    Record<
      V1037PcresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateCustodyChainStressExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1037PcresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1037PcresV1014SupplySlice;
  trade20ba: V1037PcresV1014TradeSlice;
  energy20bc: V1037PcresV1014EnergySlice;
  workforce20bf: V1037PcresV1014WorkforceSlice;
  publicServices20az: V1037PcresPublicServices20azSlice;
  climateAdaptation20br: V1037PcresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1037PcresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1037PcresBiodiversityStewardship20buSlice;
  reserveHeadroom: number;
  provenanceChainResiliencePolicyFocus: number;
  activeCustodyScenarioIds: string[];
  activeFacilityZoneIds: string[];
  persisted: V1037PcresPersisted | null;
}

export interface V1037PcresRuntimeState {
  turn: number;
  aggregateCustodyChainStressExposureIndex: number;
  aggregateProvenanceChainResilienceScore: number;
  custodyChainNetworkHarmonyScore: number;
  custodyChainMeshPressure: number;
  custodyChainMeshGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1037PcresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1037PcresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  informationIntegrityResilienceDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1037PcresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1037PcresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1037PcresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1037PcresTurnResult {
  state: V1037PcresRuntimeState;
  persisted: V1037PcresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1037PcresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
