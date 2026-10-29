/**
 * V1016_NRES — national resilience, supply shock & continuity (SECTION 20BG / O6K-33).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1016_NRES_SCHEMA_VERSION = '10.16.national_resilience.1' as const;

export type V1016NresRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1016NresSystemDomain =
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

export type V1016NresContinuityBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1016NresShockBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1016NresV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1016NresRegionId, number>>;
  propagationIndex: number;
}

export interface V1016NresV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1016NresV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1016NresV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

export interface V1016NresPropagationEdge {
  fromSystem: V1016NresSystemDomain;
  toSystem: V1016NresSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1016NresSupplyShockSnapshot {
  scenarioId: string;
  regionId: V1016NresRegionId;
  systemDomain: V1016NresSystemDomain;
  shockBand: V1016NresShockBand;
  severityIndex: number;
  propagationDelayTurns: number;
  continuityScore: number;
  continuityBand: V1016NresContinuityBand;
}

export interface V1016NresPersisted {
  schemaVersion: typeof V1016_NRES_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  shockSnapshots: Record<string, V1016NresSupplyShockSnapshot>;
  propagationGraphRevision: number;
  regionalContinuity: Partial<
    Record<
      V1016NresRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeContinuity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeverity: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1016NresTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1016NresV1014SupplySlice;
  trade20ba: V1016NresV1014TradeSlice;
  energy20bc: V1016NresV1014EnergySlice;
  workforce20bf: V1016NresV1014WorkforceSlice;
  fiscalHeadroom: number;
  continuityPolicyFocus: number;
  activeShockScenarioIds: string[];
  activeContinuityNodeIds: string[];
  persisted: V1016NresPersisted | null;
}

export interface V1016NresRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregateContinuityScore: number;
  nationalResilienceScore: number;
  supplyShockPressure: number;
  propagationGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1016NresSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1016NresRegionId, number>>;
}

export interface V1016NresTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1016NresEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1016NresWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1016NresTurnResult {
  state: V1016NresRuntimeState;
  persisted: V1016NresPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1016NresSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
