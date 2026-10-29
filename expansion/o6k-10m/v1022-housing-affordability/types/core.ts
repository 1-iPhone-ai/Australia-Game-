/**
 * V1022_HAFF — housing affordability, state–federal transfer & zoning_node (SECTION 20BQ / O6K-49).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1022_HAFF_SCHEMA_VERSION = '10.22.housing_affordability.1' as const;

export type V1022HaffRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1022HaffHousingTenure =
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

export type V1022HaffHousingTenureLegacy =
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

export type V1022HaffTenureBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1022HaffStressBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1022HaffV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1022HaffRegionId, number>>;
  supplyPipelineIndex: number;
}

export interface V1022HaffV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1022HaffV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1022HaffV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1022HaffPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** Fiscal federalism zoning-friction-node slice (SECTION 20BJ). */
export interface V1022HaffFiscalFederalism20bjSlice {
  turn: number;
  transferBackpressure: number;
  grantStackLoad: number;
  zoningBacklogTurns: number;
}

export interface V1022HaffSupplyPipelineEdge {
  fromTenure: V1022HaffHousingTenure;
  toTenure: V1022HaffHousingTenure;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1022HaffStressSnapshot {
  scenarioId: string;
  regionId: V1022HaffRegionId;
  housingTenure: V1022HaffHousingTenure;
  stressBand: V1022HaffStressBand;
  rentStressIndex: number;
  supplyPipelineDelayTurns: number;
  affordabilityScore: number;
  tenureBand: V1022HaffTenureBand;
}

export interface V1022HaffPersisted {
  schemaVersion: typeof V1022_HAFF_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  stressSnapshots: Record<string, V1022HaffStressSnapshot>;
  supplyPipelineGraphRevision: number;
  regionalSupplyPipeline: Partial<
    Record<
      V1022HaffRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateRentStress: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1022HaffTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1022HaffV1014SupplySlice;
  trade20ba: V1022HaffV1014TradeSlice;
  energy20bc: V1022HaffV1014EnergySlice;
  workforce20bf: V1022HaffV1014WorkforceSlice;
  publicServices20az: V1022HaffPublicServices20azSlice;
  fiscalFederalism20bj: V1022HaffFiscalFederalism20bjSlice;
  constructionHeadroom: number;
  housingPolicyFocus: number;
  activeStressScenarioIds: string[];
  activeZoningNodeIds: string[];
  persisted: V1022HaffPersisted | null;
}

export interface V1022HaffRuntimeState {
  turn: number;
  aggregateRentStressIndex: number;
  aggregateAffordabilityScore: number;
  housingFiscalHarmonyScore: number;
  supplyPipelinePressure: number;
  supplyPipelineGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1022HaffSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1022HaffRegionId, number>>;
  serviceQueueDelta?: number;
  fiscalTransferDelta?: number;
}

export interface V1022HaffTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1022HaffEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1022HaffWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1022HaffTurnResult {
  state: V1022HaffRuntimeState;
  persisted: V1022HaffPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1022HaffSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
