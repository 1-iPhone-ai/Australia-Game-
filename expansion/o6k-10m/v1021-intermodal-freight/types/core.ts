/**
 * V1021_IMFD — intermodal freight, state–federal transfer & dwell_hub (SECTION 20BO / O6K-45).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1021_IMFD_SCHEMA_VERSION = '10.21.intermodal_freight.1' as const;

export type V1021ImfdRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1021ImfdFreightMode =
  | 'rail'
  | 'road'
  | 'port'
  | 'air'
  | 'intermodal'
  | 'bulk'
  | 'container'
  | 'refrigerated'
  | 'express'
  | 'regional';

export type V1021ImfdFreightModeLegacy =
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

export type V1021ImfdComplianceBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1021ImfdDwellBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1021ImfdV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1021ImfdRegionId, number>>;
  handoffStackIndex: number;
}

export interface V1021ImfdV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1021ImfdV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1021ImfdV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** AI fidelity / handoff slice (SECTION 20BN). */
export interface V1021ImfdMaritime20bnSlice {
  turn: number;
  berthUtilizationScore: number;
  craneAutomationCoverage: number;
  handoffReadiness: number;
}

/** Fiscal federalism dwell-hub slice (SECTION 20BK). */
export interface V1021ImfdIclog20bkSlice {
  turn: number;
  iclogBackpressure: number;
  corridorLoadFactor: number;
  dwellBacklogTurns: number;
}

export interface V1021ImfdHandoffStackEdge {
  fromMode: V1021ImfdFreightMode;
  toMode: V1021ImfdFreightMode;
  weight: number;
  lagTurns: number;
  hubId: string;
}

export interface V1021ImfdCorridorSnapshot {
  scenarioId: string;
  regionId: V1021ImfdRegionId;
  freightMode: V1021ImfdFreightMode;
  dwellBand: V1021ImfdDwellBand;
  dwellPenaltyIndex: number;
  handoffDelayTurns: number;
  corridorCapacityScore: number;
  handoffBand: V1021ImfdComplianceBand;
}

export interface V1021ImfdPersisted {
  schemaVersion: typeof V1021_IMFD_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  corridorSnapshots: Record<string, V1021ImfdCorridorSnapshot>;
  handoffStackGraphRevision: number;
  regionalHandoff: Partial<
    Record<
      V1021ImfdRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateDwellPenalty: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1021ImfdTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1021ImfdV1014SupplySlice;
  trade20ba: V1021ImfdV1014TradeSlice;
  energy20bc: V1021ImfdV1014EnergySlice;
  workforce20bf: V1021ImfdV1014WorkforceSlice;
  maritime20bn: V1021ImfdMaritime20bnSlice;
  iclog20bk: V1021ImfdIclog20bkSlice;
  freightHeadroom: number;
  corridorPolicyFocus: number;
  activeCorridorScenarioIds: string[];
  activeDwellHubNodeIds: string[];
  persisted: V1021ImfdPersisted | null;
}

export interface V1021ImfdRuntimeState {
  turn: number;
  aggregateDwellPenaltyIndex: number;
  aggregateCapacityScore: number;
  intermodalResilienceScore: number;
  handoffStackPressure: number;
  handoffStackGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1021ImfdSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1021ImfdRegionId, number>>;
  handoffDelta?: number;
  labTransferDelta?: number;
}

export interface V1021ImfdTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1021ImfdEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1021ImfdWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1021ImfdTurnResult {
  state: V1021ImfdRuntimeState;
  persisted: V1021ImfdPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1021ImfdSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
