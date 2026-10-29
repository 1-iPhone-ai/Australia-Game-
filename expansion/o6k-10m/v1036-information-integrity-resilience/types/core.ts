/**
 * V1036_IIRES — information integrity network resilience, state–federal transfer & facility_zone (SECTION 20CI / O6K-86).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1036_IIRES_SCHEMA_VERSION = '10.32.information_integrity_resilience.1' as const;

export type V1036IiresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1036IiresInformationIntegrityResilienceChannel =
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

export type V1036IiresInformationIntegrityResilienceChannelLegacy =
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

export type V1036IiresInformationIntegrityResilienceChannelLegacy =
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

export type V1036IiresInformationIntegrityResilienceBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1036IiresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1036IiresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1036IiresRegionId, number>>;
  attestationMeshIndex: number;
}

export interface V1036IiresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1036IiresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  routingCascadeRisk: number;
}

export interface V1036IiresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1036IiresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation facility-zone-node slice (SECTION 20BR). */
export interface V1036IiresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1036IiresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1036IiresWaterSecurity20bwSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Sovereign cyber resilience slice (SECTION 20BZ — V1030 heatwave / arid-buffer bridge). */
export interface V1036IiresInlandHeat20bzSlice {
  turn: number;
  gridStressExposurePressure: number;
  grantStackLoad: number;
  outageDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1036IiresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance facility-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1036IiresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1036IiresAttestationMeshEdge {
  fromChannel: V1036IiresInformationIntegrityResilienceChannel;
  toChannel: V1036IiresInformationIntegrityResilienceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1036IiresAttestationSnapshot {
  scenarioId: string;
  regionId: V1036IiresRegionId;
  informationIntegrityResilienceChannel: V1036IiresInformationIntegrityResilienceChannel;
  informationIntegrityResilienceBand: V1036IiresInformationIntegrityResilienceBand;
  attestationMeshStressExposureIndex: number;
  attestationMeshDelayTurns: number;
  informationIntegrityResilienceScore: number;
  informationIntegrityResilienceBand: V1036IiresInformationIntegrityResilienceBand;
}

export interface V1036IiresPersisted {
  schemaVersion: typeof V1036_IIRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  attestationSnapshots: Record<string, V1036IiresAttestationSnapshot>;
  attestationMeshGraphRevision: number;
  regionalAttestationMesh: Partial<
    Record<
      V1036IiresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateAttestationMeshStressExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1036IiresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1036IiresV1014SupplySlice;
  trade20ba: V1036IiresV1014TradeSlice;
  energy20bc: V1036IiresV1014EnergySlice;
  workforce20bf: V1036IiresV1014WorkforceSlice;
  publicServices20az: V1036IiresPublicServices20azSlice;
  climateAdaptation20br: V1036IiresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1036IiresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1036IiresBiodiversityStewardship20buSlice;
  reserveHeadroom: number;
  informationIntegrityResiliencePolicyFocus: number;
  activeAttestationScenarioIds: string[];
  activeFacilityZoneIds: string[];
  persisted: V1036IiresPersisted | null;
}

export interface V1036IiresRuntimeState {
  turn: number;
  aggregateAttestationMeshStressExposureIndex: number;
  aggregateInformationIntegrityResilienceScore: number;
  attestationMeshNetworkHarmonyScore: number;
  attestationMeshPressure: number;
  attestationMeshGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1036IiresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1036IiresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  sovereignCyberResilienceDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1036IiresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1036IiresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1036IiresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1036IiresTurnResult {
  state: V1036IiresRuntimeState;
  persisted: V1036IiresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1036IiresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
