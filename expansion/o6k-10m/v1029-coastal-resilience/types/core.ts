/**
 * V1029_CRES — coastal resilience, state–federal transfer & littoral_zone (SECTION 20BY / O6K-64).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1029_CRES_SCHEMA_VERSION = '10.25.coastal_resilience.1' as const;

export type V1029CresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1029CresCoastalAdaptationChannel =
  | 'storm_surge'
  | 'king_tide'
  | 'coastal_erosion'
  | 'saltwater_intrusion'
  | 'beach_replenishment'
  | 'mangrove_buffer'
  | 'port_infrastructure'
  | 'regional'
  | 'remote';

export type V1029CresCoastalAdaptationChannelLegacy =
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

export type V1029CresCoastalAdaptationChannelLegacy =
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

export type V1029CresAdaptationBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1029CresHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1029CresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1029CresRegionId, number>>;
  adaptationBufferIndex: number;
}

export interface V1029CresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1029CresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  inundationRiskStress: number;
}

export interface V1029CresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1029CresPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation littoral-zone-node slice (SECTION 20BR). */
export interface V1029CresClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1029CresBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Water security slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1029CresWaterSecurity20bwSlice {
  turn: number;
  supplyStressPressure: number;
  grantStackLoad: number;
  basinDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1029CresDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance littoral-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1029CresDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1029CresAdaptationBufferEdge {
  fromChannel: V1029CresCoastalAdaptationChannel;
  toChannel: V1029CresCoastalAdaptationChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1029CresSurgeSnapshot {
  scenarioId: string;
  regionId: V1029CresRegionId;
  coastalAdaptationChannel: V1029CresCoastalAdaptationChannel;
  adaptationBand: V1029CresAdaptationBand;
  seaLevelExposureIndex: number;
  adaptationBufferDelayTurns: number;
  adaptationScore: number;
  adaptationBand: V1029CresAdaptationBand;
}

export interface V1029CresPersisted {
  schemaVersion: typeof V1029_CRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  surgeSnapshots: Record<string, V1029CresSurgeSnapshot>;
  adaptationBufferGraphRevision: number;
  regionalAdaptationBuffer: Partial<
    Record<
      V1029CresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeaLevelExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1029CresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1029CresV1014SupplySlice;
  trade20ba: V1029CresV1014TradeSlice;
  energy20bc: V1029CresV1014EnergySlice;
  workforce20bf: V1029CresV1014WorkforceSlice;
  publicServices20az: V1029CresPublicServices20azSlice;
  climateAdaptation20br: V1029CresClimateAdaptation20brSlice;
  digitalGovernance20bt: V1029CresDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1029CresBiodiversityStewardship20buSlice;
  bermHeadroom: number;
  coastalPolicyFocus: number;
  activeSurgeScenarioIds: string[];
  activeLittoralZoneIds: string[];
  persisted: V1029CresPersisted | null;
}

export interface V1029CresRuntimeState {
  turn: number;
  aggregateSeaLevelExposureIndex: number;
  aggregateAdaptationScore: number;
  coastalClimateHarmonyScore: number;
  adaptationBufferPressure: number;
  adaptationBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1029CresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1029CresRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  waterSecurityDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1029CresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1029CresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1029CresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1029CresTurnResult {
  state: V1029CresRuntimeState;
  persisted: V1029CresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1029CresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
