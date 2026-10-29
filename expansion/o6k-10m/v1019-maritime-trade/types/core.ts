/**
 * V1019_MTRD — maritime trade, shipping lanes & ports (SECTION 20BM / O6K-41).
 * Cross-wire: V1014 trade (20BA), energy depth (20BC).
 */

export const V1019_MTRD_SCHEMA_VERSION = '10.19.maritime_trade.1' as const;

export type V1019MtrdRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1019MtrdSystemDomain =
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

export type V1019MtrdPortBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1019MtrdLaneBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1019MtrdV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1019MtrdV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1019MtrdLaneGraphEdge {
  fromSystem: V1019MtrdSystemDomain;
  toSystem: V1019MtrdSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1019MtrdShippingLaneSnapshot {
  scenarioId: string;
  regionId: V1019MtrdRegionId;
  systemDomain: V1019MtrdSystemDomain;
  laneBand: V1019MtrdLaneBand;
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  portBand: V1019MtrdPortBand;
}

export interface V1019MtrdPersisted {
  schemaVersion: typeof V1019_MTRD_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  laneSnapshots: Record<string, V1019MtrdShippingLaneSnapshot>;
  laneGraphRevision: number;
  regionalPort: Partial<
    Record<
      V1019MtrdRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositePort: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeverity: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1019MtrdTurnInput {
  turn: number;
  seed: number;
  trade20ba: V1019MtrdV1014TradeSlice;
  energy20bc: V1019MtrdV1014EnergySlice;
  fiscalHeadroom: number;
  portPolicyFocus: number;
  activeLaneScenarioIds: string[];
  activePortNodeIds: string[];
  persisted: V1019MtrdPersisted | null;
}

export interface V1019MtrdRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregatePortScore: number;
  nationalMaritimeScore: number;
  shippingLanePressure: number;
  laneGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1019MtrdTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1019MtrdEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1019MtrdTurnResult {
  state: V1019MtrdRuntimeState;
  persisted: V1019MtrdPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1019MtrdSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

/** @deprecated use V1019MtrdLaneGraphEdge */
export type V1019MtrdCorridorEdge = V1019MtrdLaneGraphEdge;

/** @deprecated use V1019MtrdLaneBand */
export type V1019MtrdRouteBand = V1019MtrdLaneBand;
