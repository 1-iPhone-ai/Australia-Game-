/**
 * V1017_ICLOG — intercity logistics, freight route & hub (SECTION 20BI / O6K-36).
 * Cross-wire: V1014 supply (20BB), trade (20BA), cities (20AK), V1016 resilience (20BG).
 */

export const V1017_ICLOG_SCHEMA_VERSION = '10.17.intercity_logistics.1' as const;

export type V1017IclogRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1017IclogSystemDomain =
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

export type V1017IclogHubBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1017IclogRouteBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1017IclogV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1017IclogRegionId, number>>;
  corridorIndex: number;
}

export interface V1017IclogV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1017IclogV1014CitiesSlice {
  turn: number;
  intercityLinkCongestion: number;
  corridorThroughputIndex: number;
  hubCapacityScore: number;
}

export interface V1017IclogV1016ResilienceSlice {
  turn: number;
  supplyShockPressure: number;
  resilienceContinuityScore: number;
  rerouteUrgencyIndex: number;
}

export interface V1017IclogCorridorEdge {
  fromSystem: V1017IclogSystemDomain;
  toSystem: V1017IclogSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1017IclogSupplyRouteSnapshot {
  scenarioId: string;
  regionId: V1017IclogRegionId;
  systemDomain: V1017IclogSystemDomain;
  routeBand: V1017IclogRouteBand;
  severityIndex: number;
  corridorDelayTurns: number;
  hubScore: number;
  hubBand: V1017IclogHubBand;
}

export interface V1017IclogPersisted {
  schemaVersion: typeof V1017_ICLOG_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  routeSnapshots: Record<string, V1017IclogSupplyRouteSnapshot>;
  corridorGraphRevision: number;
  regionalHub: Partial<
    Record<
      V1017IclogRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeHub: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeverity: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1017IclogTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1017IclogV1014SupplySlice;
  trade20ba: V1017IclogV1014TradeSlice;
  cities20ak: V1017IclogV1014CitiesSlice;
  resilience20bg: V1017IclogV1016ResilienceSlice;
  fiscalHeadroom: number;
  hubPolicyFocus: number;
  activeRouteScenarioIds: string[];
  activeHubNodeIds: string[];
  persisted: V1017IclogPersisted | null;
}

export interface V1017IclogRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregateHubScore: number;
  nationalResilienceScore: number;
  supplyRoutePressure: number;
  corridorGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1017IclogSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1017IclogRegionId, number>>;
}

export interface V1017IclogTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1017IclogCitiesBridge {
  congestionDrag: number;
  throughputContribution: number;
}

export interface V1017IclogResilienceBridge {
  continuityDelta: number;
  shockContribution: number;
}

export interface V1017IclogTurnResult {
  state: V1017IclogRuntimeState;
  persisted: V1017IclogPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1017IclogSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
