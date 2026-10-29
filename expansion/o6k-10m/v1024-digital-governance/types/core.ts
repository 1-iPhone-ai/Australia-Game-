/**
 * V1024_DGOV — digital governance, state–federal transfer & platform_node (SECTION 20BT / O6K-54).
 * Cross-wire: V1014 supply (20BB), trade (20BA), energy (20BC), workforce (20BF).
 */

export const V1024_DGOV_SCHEMA_VERSION = '10.24.digital_governance.1' as const;

export type V1024DgovRegionId = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'NT' | 'ACT';

export type V1024DgovGovernanceChannel =
  | 'data_residency'
  | 'platform_liability'
  | 'algo_audit'
  | 'cross_border_flow'
  | 'child_safety'
  | 'open_banking'
  | 'critical_infra'
  | 'genai_disclosure'
  | 'regional'
  | 'remote';

export type V1024DgovGovernanceChannelLegacy =
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

export type V1024DgovGovernanceChannelLegacy =
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

export type V1024DgovGovernanceBand = 'robust' | 'stable' | 'strained' | 'fragile' | 'critical';

export type V1024DgovHazardSeverityBand = 'minimal' | 'moderate' | 'elevated' | 'critical' | 'recovering';

export interface V1024DgovV1014SupplySlice {
  turn: number;
  bottleneckPressure: number;
  regionalStockDays: Partial<Record<V1024DgovRegionId, number>>;
  dataSovereigntyIndex: number;
}

export interface V1024DgovV1014TradeSlice {
  turn: number;
  sanctionsPressure: number;
  importDependencyRatio: number;
  exportLaneStability: number;
}

export interface V1024DgovV1014EnergySlice {
  turn: number;
  gridStability: number;
  reserveMarginPct: number;
  platformRiskStress: number;
}

export interface V1024DgovV1014WorkforceSlice {
  turn: number;
  specialistGap: number;
  nationalReadiness: number;
  mismatchIndex: number;
}

/** Public services v2 slice (SECTION 20AZ). */
export interface V1024DgovPublicServices20azSlice {
  turn: number;
  clinicCapacityScore: number;
  digitalServiceCoverage: number;
  serviceDeliveryReadiness: number;
}

/** AI fidelity platform-regulation-node slice (SECTION 20BE). */
export interface V1024DgovAiFidelity20beSlice {
  turn: number;
  modelGovernancePressure: number;
  grantStackLoad: number;
  alignmentDriftTurns: number;
}

export interface V1024DgovDataSovereigntyEdge {
  fromChannel: V1024DgovGovernanceChannel;
  toChannel: V1024DgovGovernanceChannel;
  weight: number;
  lagTurns: number;
  nodeId: string;
}

export interface V1024DgovPolicySnapshot {
  scenarioId: string;
  regionId: V1024DgovRegionId;
  governanceChannel: V1024DgovGovernanceChannel;
  governanceBand: V1024DgovGovernanceBand;
  complianceStressIndex: number;
  dataSovereigntyDelayTurns: number;
  governanceScore: number;
  governanceBand: V1024DgovGovernanceBand;
}

export interface V1024DgovPersisted {
  schemaVersion: typeof V1024_DGOV_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  policySnapshots: Record<string, V1024DgovPolicySnapshot>;
  dataSovereigntyGraphRevision: number;
  regionalDataSovereignty: Partial<
    Record<
      V1024DgovRegionId,
      {
        bufferIndex: number;
        rerouteStress: number;
        compositeCapacity: number;
        exposedSystems: number;
      }
    >
  >;
  historyTail: Array<{ turn: number; inputHash: string; aggregateComplianceStress: number }>;
  aiReadCache: Record<string, string>;
}

export interface V1024DgovTurnInput {
  turn: number;
  seed: number;
  supply20bb: V1024DgovV1014SupplySlice;
  trade20ba: V1024DgovV1014TradeSlice;
  energy20bc: V1024DgovV1014EnergySlice;
  workforce20bf: V1024DgovV1014WorkforceSlice;
  publicServices20az: V1024DgovPublicServices20azSlice;
  aiFidelity20be: V1024DgovAiFidelity20beSlice;
  auditHeadroom: number;
  governancePolicyFocus: number;
  activePolicyScenarioIds: string[];
  activePlatformNodeIds: string[];
  persisted: V1024DgovPersisted | null;
}

export interface V1024DgovRuntimeState {
  turn: number;
  aggregateComplianceStressIndex: number;
  aggregateGovernanceScore: number;
  governanceAiHarmonyScore: number;
  dataSovereigntyPressure: number;
  dataSovereigntyGraphHash: string;
  inputHash: string;
  briefing: string;
}

export interface V1024DgovSupplyBridge {
  bottleneckDelta: number;
  stockDaysDelta: Partial<Record<V1024DgovRegionId, number>>;
  serviceQueueDelta?: number;
  aiFidelityDelta?: number;
}

export interface V1024DgovTradeBridge {
  laneStabilityDelta: number;
  importStressContribution: number;
}

export interface V1024DgovEnergyBridge {
  gridDrag: number;
  reserveContribution: number;
}

export interface V1024DgovWorkforceBridge {
  readinessDelta: number;
  mismatchContribution: number;
}

export interface V1024DgovTurnResult {
  state: V1024DgovRuntimeState;
  persisted: V1024DgovPersisted;
  worldEvents: Array<{ id: string; turn: number; kind: string; title: string; summary: string }>;
}

export interface V1024DgovSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
