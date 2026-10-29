/**
 * V1023_CLAD — climate adaptation, state–federal transfer & flood_node (SECTION 20BR / O6K-51).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1023_CLAD_SCHEMA_VERSION = '10.23.climate_adaptation.1' as const;

export type V1023CladRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1023CladAdaptationChannel =
  | 'heat_urban'
  | 'flood_coastal'
  | 'drought_inland'
  | 'fire_interface'
  | 'cyclone_north'
  | 'heat_rural'
  | 'water_stress'
  | 'coastal_erosion'
  | 'regional'
  | 'remote';

export type V1023CladAdaptationChannelLegacy =
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

export type V1023CladAdaptationChannelLegacy =
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

export type V1023CladHazardBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1023CladHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1023CladV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1023CladRegionId, number>>;
  droughtBufferIndex: number;
}

export interface V1023CladV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1023CladV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1023CladV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1023CladPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Scenario packs flood-defend-node slice (SECTION 20BD). */
export interface V1023CladScenarioPacks20bdSlice {
  turn: number;
  packCohesionPressure: number;
  grantStackLoad: number;
  objectiveDriftTurns: number;
}

export interface V1023CladDroughtBufferEdge {
  fromChannel: V1023CladAdaptationChannel;
  toChannel: V1023CladAdaptationChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1023CladHazardSnapshot {
  scenarioId: string;
  regionId: V1023CladRegionId;
  adaptationChannel: V1023CladAdaptationChannel;
  hazardBand: V1023CladHazardBand;
  heatStressIndex: number;
  droughtBufferDelayTurns: number;
  resilienceScore: number;
  hazardBand: V1023CladHazardBand;
}

export interface V1023CladPersisted {
  schemaVersion: typeof V1023_CLAD_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  hazardSnapshots: Record<string, V1023CladHazardSnapshot>;
  droughtBufferGraphRevision: number;
  regionalDroughtBuffer: Partial<
    Record<
      V1023CladRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateHeatStress: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1023CladTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1023CladV1014SupplySlice;
  trade20ba: V1023CladV1014TradeSlice;
  energy20bc: V1023CladV1014EnergySlice;
  workforce20bf: V1023CladV1014WorkforceSlice;
  publicServices20az: V1023CladPublicServices20azSlice;
  scenarioPacks20bd: V1023CladScenarioPacks20bdSlice;
  coolingHeadroom: number;
  adaptationPolicyFocus: number;
  activeHazardScenarioIds: string[];
  activeFloodNodeIds: string[];
  persisted: V1023CladPersisted | null;
}

export interface V1023CladRuntimeState {
  turn: number;
  aggregateHeatStressIndex: number;
  aggregateResilienceScore: number;
  climateEnergyHarmonyScore: number;
  droughtBufferPressure: number;
  droughtBufferGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1023CladSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1023CladRegionId, number>>;
  serviceQueueDelta?: number;
  scenarioPackDelta?: number;
}

export interface V1023CladTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1023CladEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1023CladWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1023CladTurnResult {
  state: V1023CladRuntimeState;
  persisted: V1023CladPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1023CladSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
