/**
 * V1030_IHEAT — inland heat adaptation, state–federal transfer & inland_zone (SECTION 20BZ / O6K-66).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1030_IHEAT_SCHEMA_VERSION = '10.30.inland_heat.1' as const;

export type V1030IheatRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1030IheatInlandHeatChannel =
  | 'extreme_heat'
  | 'drought'
  | 'dust_storm'
  | 'bushfire'
  | 'grid_overload'
  | 'water_stress'
  | 'cooling_center'
  | 'remote_clinic'
  | 'regional'
  | 'remote';

export type V1030IheatInlandHeatChannelLegacy =
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

export type V1030IheatInlandHeatChannelLegacy =
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

export type V1030IheatAridAdaptationBand = 'secure' | 'stable' | 'stressed' | 'depleted' | 'critical';

export type V1030IheatHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1030IheatV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1030IheatRegionId, number>>;
  aridBufferIndex: number;
}

export interface V1030IheatV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1030IheatV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  heatStressRisk: number;
}

export interface V1030IheatV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1030IheatPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Climate adaptation inland-zone-node slice (SECTION 20BR). */
export interface V1030IheatClimateAdaptation20brSlice {
  turn: number;
  heatStressPressure: number;
  grantStackLoad: number;
  resilienceDriftTurns: number;
}


/** Biodiversity / catchment stewardship slice (SECTION 20BV — upstream basin integrity). */
export interface V1030IheatBiodiversityStewardship20buSlice {
  turn: number;
  hospitalSurgePressure: number;
  grantStackLoad: number;
  bedCapacityDriftTurns: number;
}


/** Coastal resilience slice (SECTION 20BW — upstream supply stress bridge). */
export interface V1030IheatWaterSecurity20bwSlice {
  turn: number;
  seaLevelExposurePressure: number;
  grantStackLoad: number;
  surgeDriftTurns: number;
}

/** Disaster resilience slice (SECTION 20BX — V1028 compound hazard bridge). */
export interface V1030IheatDisasterResilience20bxSlice {
  turn: number;
  activeCrisisLoad: number;
  coordinationLagTurns: number;
  escalationPressure: number;
}

/** Digital governance inland-zone slice (SECTION 20BT — V1024 bridge). */
export interface V1030IheatDigitalGovernance20btSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1030IheatAridBufferEdge {
  fromChannel: V1030IheatInlandHeatChannel;
  toChannel: V1030IheatInlandHeatChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1030IheatHeatwaveSnapshot {
  scenarioId: string;
  regionId: V1030IheatRegionId;
  inlandHeatChannel: V1030IheatInlandHeatChannel;
  aridAdaptationBand: V1030IheatAridAdaptationBand;
  inlandHeatExposureIndex: number;
  aridBufferDelayTurns: number;
  aridAdaptationScore: number;
  aridAdaptationBand: V1030IheatAridAdaptationBand;
}

export interface V1030IheatPersisted {
  schemaVersion: typeof V1030_IHEAT_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  heatwaveSnapshots: Record<string, V1030IheatHeatwaveSnapshot>;
  aridBufferGraphRevision: number;
  regionalAridBuffer: Partial<
    Record<
      V1030IheatRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateInlandHeatExposure: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1030IheatTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1030IheatV1014SupplySlice;
  trade20ba: V1030IheatV1014TradeSlice;
  energy20bc: V1030IheatV1014EnergySlice;
  workforce20bf: V1030IheatV1014WorkforceSlice;
  publicServices20az: V1030IheatPublicServices20azSlice;
  climateAdaptation20br: V1030IheatClimateAdaptation20brSlice;
  digitalGovernance20bt: V1030IheatDigitalGovernance20btSlice;
  regionalHealthSystems20bv: V1030IheatBiodiversityStewardship20buSlice;
  shadeHeadroom: number;
  inlandHeatPolicyFocus: number;
  activeHeatwaveScenarioIds: string[];
  activeInlandZoneIds: string[];
  persisted: V1030IheatPersisted | null;
}

export interface V1030IheatRuntimeState {
  turn: number;
  aggregateInlandHeatExposureIndex: number;
  aggregateAridAdaptationScore: number;
  inlandAridHarmonyScore: number;
  aridBufferPressure: number;
  aridBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1030IheatSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1030IheatRegionId, number>>;
  serviceQueueDelta?: number;
  climateAdaptationDelta?: number;
  digitalGovernanceDelta?: number;
  regionalHealthDelta?: number;
  coastalResilienceDelta?: number;
  disasterResilienceDelta?: number;
}

export interface V1030IheatTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1030IheatEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1030IheatWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1030IheatTurnResult {
  state: V1030IheatRuntimeState;
  persisted: V1030IheatPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1030IheatSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
