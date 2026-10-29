/**
 * V1027_WSEC — water security, state–federal transfer & distribution_network (SECTION 20BW / O6K-61).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1027_WSEC_SCHEMA_VERSION = '10.25.water_security.1' as const;

export type V1027WsecRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1027WsecWaterSecurityChannel =
  | 'surface_water'
  | 'groundwater'
  | 'desalination'
  | 'irrigation'
  | 'urban_supply'
  | 'basin_allocation'
  | 'flood_mitigation'
  | 'environmental_flow'
  | 'regional'
  | 'remote';

export type V1027WsecWaterSecurityChannelLegacy =
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

export type V1027WsecWaterSecurityChannelLegacy =
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

export type V1027WsecWaterSecurityBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1027WsecHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1027WsecV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1027WsecRegionId, number>>;
  aquiferReserveIndex: number;
}

export interface V1027WsecV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1027WsecV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  droughtRiskStress: number;
}

export interface V1027WsecV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1027WsecPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation distribution-network-node slice (SECTION 20BR). */
export interface V1027WsecClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BU — upstream basin integrity). */
export interface V1027WsecBiodiversityStewardship20buSlice {
  turn: number;
  catchmentIntegrityPressure: number;
  grantStackLoad: number;
  offsetDriftTurns: number;
}

/** Digital governance distribution-network slice (SECTION 20BT — V1024 bridge). */
export interface V1027WsecDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1027WsecAquiferReserveEdge {
  fromChannel: V1027WsecWaterSecurityChannel;
  toChannel: V1027WsecWaterSecurityChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1027WsecBasinSnapshot {
  scenarioId: string;
  regionId: V1027WsecRegionId;
  waterSecurityChannel: V1027WsecWaterSecurityChannel;
  waterSecurityBand: V1027WsecWaterSecurityBand;
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  waterSecurityBand: V1027WsecWaterSecurityBand;
}

export interface V1027WsecPersisted {
  schemaVersion: typeof V1027_WSEC_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  basinSnapshots: Record<string, V1027WsecBasinSnapshot>;
  aquiferReserveGraphRevision: number;
  regionalAquiferReserve: Partial<
    Record<
      V1027WsecRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateWaterStress: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1027WsecTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1027WsecV1014SupplySlice;
  trade20ba: V1027WsecV1014TradeSlice;
  energy20bc: V1027WsecV1014EnergySlice;
  workforce20bf: V1027WsecV1014WorkforceSlice;
  publicServices20az: V1027WsecPublicServices20azSlice;
  climateAdaptation20br: V1027WsecClimateAdaptation20brSlice;
  digitalGovernance20bt: V1027WsecDigitalGovernance20btSlice;
  biodiversityStewardship20bu: V1027WsecBiodiversityStewardship20buSlice;
  storageHeadroom: number;
  waterPolicyFocus: number;
  activeBasinScenarioIds: string[];
  activeDistributionNetworkIds: string[];
  persisted: V1027WsecPersisted | null;
}

export interface V1027WsecRuntimeState {
  turn: number;
  aggregateWaterStressIndex: number;
  aggregateWaterSecurityScore: number;
  waterClimateHarmonyScore: number;
  aquiferReservePressure: number;
  aquiferReserveGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1027WsecSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1027WsecRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  biodiversityStewardshipDelta?: number;
}

export interface V1027WsecTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1027WsecEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1027WsecWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1027WsecTurnResult {
  state: V1027WsecRuntimeState;
  persisted: V1027WsecPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1027WsecSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
