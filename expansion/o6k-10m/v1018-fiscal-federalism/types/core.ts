/**
 * V1018_FFED — fiscal federalism, state–federal transfer & audit_trail (SECTION 20BI / O6K-37).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1018_FFED_SCHEMA_VERSION = '10.18.fiscal_federalism.1' as const;

export type V1018FfedRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1018FfedSystemDomain =
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

export type V1018FfedComplianceBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1018FfedTransferBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1018FfedV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1018FfedRegionId, number>>;
  grantStackIndex: number;
}

export interface V1018FfedV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1018FfedV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1018FfedV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

export interface V1018FfedGrantStackEdge {
  fromSystem: V1018FfedSystemDomain;
  toSystem: V1018FfedSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1018FfedTransferSnapshot {
  scenarioId: string;
  regionId: V1018FfedRegionId;
  systemDomain: V1018FfedSystemDomain;
  transferBand: V1018FfedTransferBand;
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  complianceBand: V1018FfedComplianceBand;
}

export interface V1018FfedPersisted {
  schemaVersion: typeof V1018_FFED_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  transferSnapshots: Record<string, V1018FfedTransferSnapshot>;
  grantStackGraphRevision: number;
  regionalCompliance: Partial<
    Record<
      V1018FfedRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCompliance: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateSeverity: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1018FfedTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1018FfedV1014SupplySlice;
  trade20ba: V1018FfedV1014TradeSlice;
  energy20bc: V1018FfedV1014EnergySlice;
  workforce20bf: V1018FfedV1014WorkforceSlice;
  fiscalHeadroom: number;
  federalismPolicyFocus: number;
  activeTransferScenarioIds: string[];
  activeComplianceNodeIds: string[];
  persisted: V1018FfedPersisted | null;
}

export interface V1018FfedRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregateComplianceScore: number;
  fiscalFederalismScore: number;
  supplyTransferPressure: number;
  grantStackGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1018FfedSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1018FfedRegionId, number>>;
}

export interface V1018FfedTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1018FfedEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1018FfedWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1018FfedTurnResult {
  state: V1018FfedRuntimeState;
  persisted: V1018FfedPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1018FfedSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
