/**
 * V1014_AI_FIDELITY — core types (SECTION 20BE / T6-8).
 * Cross-wire: ACC17 execution verifier, SECTION 20AU team routing, SECTION 20PA advisory escalation.
 */

export const V1014_AI_FIDELITY_SCHEMA_VERSION = '10.14.ai_fidelity.1' as const;

export type V1014AiFidelityPavPhase = 'plan' | 'act' | 'verify';

export type V1014AiFidelityExecutionBand = 'blocked' | 'cautious' | 'normal' | 'accelerated' | 'autonomous';

export type V1014AiFidelityAdvisoryTier = 'monitor' | 'advise' | 'alert' | 'escalate';

export interface V1014AiFidelityLoopContext {
  turn: number;
  seed: number;
  loopId: string;
  executionConfidence: number;
  routingCoherence: number;
  advisoryAlignment: number;
}

export interface V1014AiFidelityVerifyInput {
  turn: number;
  planHashStrength: number;
  actDeltaMagnitude: number;
  verifyRegression: number;
  fingerprint: string;
}

export interface V1014AiFidelityTeamRouteInput {
  turn: number;
  teamLoad: number;
  directiveCount: number;
  coordinationScore: number;
  actorCount: number;
}

export interface V1014AiFidelityAdvisoryInput {
  turn: number;
  monitorSeverity: number;
  copilotNoise: number;
  guardianRulesTriggered: number;
}

export interface V1014AiFidelityUiGateInput {
  turn: number;
  nationalDevelopmentIndex: number;
  featureFlagEnabled: boolean;
  surfaceId: string;
}

export interface V1014AiFidelityAcc17ReadSlice {
  queueDepth: number;
  verifiedExecutionRate: number;
  pendingPlanSteps: number;
  fingerprintGateOpen: boolean;
}

export interface V1014AiFidelityTeamAuReadSlice {
  routingPressure: number;
  conflictCount: number;
  coordinationPlanId: string | null;
  transparencyEnabled: boolean;
}

export interface V1014AiFidelityPaReadSlice {
  advisoryTier: V1014AiFidelityAdvisoryTier;
  escalationDebt: number;
  copilotCandidatesStripped: number;
}

export interface V1014AiFidelityExplainBundle {
  id: string;
  turn: number;
  headline: string;
  facts: Array<{ key: string; value: string }>;
  digest: string;
}

export interface V1014AiFidelityPersisted {
  schemaVersion: typeof V1014_AI_FIDELITY_SCHEMA_VERSION;
  revision: number;
  lastProcessedTurn: number | null;
  loopSnapshots: Record<string, { phase: V1014AiFidelityPavPhase; score: number }>;
  verifyPassRate: number;
  routeHashes: Record<string, string>;
  advisoryEscalations: string[];
  uiUnlockFlags: Record<string, boolean>;
  explainabilityCache: Record<string, string>;
}

export interface V1014AiFidelityTurnInput {
  turn: number;
  seed: number;
  executionBand: V1014AiFidelityExecutionBand;
  acc17QueueDepth: number;
  teamCoordinationScore: number;
  advisoryMonitorSeverity: number;
  nationalDevelopmentIndex: number;
  featureFlagsEnabled: boolean;
  activeLoopIds: string[];
  persisted: V1014AiFidelityPersisted | null;
}

export interface V1014AiFidelityRuntimeState {
  turn: number;
  aggregatePavScore: number;
  verifyPassRate: number;
  routingCoherence: number;
  advisoryPressure: number;
  uiSurfacesUnlocked: number;
  executionBandHint: V1014AiFidelityExecutionBand;
  explainabilityDigest: string;
  inputHash: string;
}

export interface V1014AiFidelityTurnResult {
  state: V1014AiFidelityRuntimeState;
  persisted: V1014AiFidelityPersisted;
  telemetry: Array<{ id: string; turn: number; kind: 'pav' | 'verify' | 'route' | 'advisory'; summary: string }>;
}

export interface V1014AiFidelitySelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}
