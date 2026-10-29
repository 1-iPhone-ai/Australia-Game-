/**
 * V1020_RPIPE — research pipeline, state–federal transfer & lab_transfer (SECTION 20BL / O6K-42).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1020_RPIPE_SCHEMA_VERSION = '10.20.research_pipeline.1' as const;

export type V1020RpipeRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1020RpipeSystemDomain =
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

export type V1020RpipeComplianceBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1020RpipeTransferBand = 'latent' | 'emerging' | 'active' | 'critical' | 'recovering';

export interface V1020RpipeV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1020RpipeRegionId, number>>;
  commercializationStackIndex: number;
}

export interface V1020RpipeV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1020RpipeV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  carbonStress: number;
}

export interface V1020RpipeV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** AI fidelity / commercialization slice (SECTION 20BE). */
export interface V1020RpipeV1014AiFidelitySlice {
  turn: number;
  planVerifyScore: number;
  automationCoverage: number;
  commercializationReadiness: number;
}

/** Fiscal federalism lab-transfer slice (SECTION 20BJ). */
export interface V1020RpipeV1014FiscalFederalismSlice {
  turn: number;
  transferPressure: number;
  grantStackLoad: number;
  labTransferBacklog: number;
}

export interface V1020RpipeGrantStackEdge {
  fromSystem: V1020RpipeSystemDomain;
  toSystem: V1020RpipeSystemDomain;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1020RpipeTransferSnapshot {
  scenarioId: string;
  regionId: V1020RpipeRegionId;
  systemDomain: V1020RpipeSystemDomain;
  transferBand: V1020RpipeTransferBand;
  severityIndex: number;
  commercializationStackDelayTurns: number;
  complianceScore: number;
  complianceBand: V1020RpipeComplianceBand;
}

export interface V1020RpipePersisted {
  schemaVersion: typeof V1020_RPIPE_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  pipelineSnapshots: Record<string, V1020RpipeTransferSnapshot>;
  commercializationStackGraphRevision: number;
  regionalCompliance: Partial<
    Record<
      V1020RpipeRegionId,
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

export interface V1020RpipeTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1020RpipeV1014SupplySlice;
  trade20ba: V1020RpipeV1014TradeSlice;
  energy20bc: V1020RpipeV1014EnergySlice;
  workforce20bf: V1020RpipeV1014WorkforceSlice;
  aiFidelity20be: V1020RpipeV1014AiFidelitySlice;
  fiscalFederalism20bj: V1020RpipeV1014FiscalFederalismSlice;
  researchHeadroom: number;
  pipelinePolicyFocus: number;
  activeTransferScenarioIds: string[];
  activeLabTransferNodeIds: string[];
  persisted: V1020RpipePersisted | null;
}

export interface V1020RpipeRuntimeState {
  turn: number;
  aggregateSeverityIndex: number;
  aggregateComplianceScore: number;
  fiscalFederalismScore: number;
  supplyTransferPressure: number;
  commercializationStackGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1020RpipeSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1020RpipeRegionId, number>>;
  commercializationDelta?: number;
  labTransferDelta?: number;
}

export interface V1020RpipeTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1020RpipeEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1020RpipeWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1020RpipeTurnResult {
  state: V1020RpipeRuntimeState;
  persisted: V1020RpipePersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1020RpipeSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
