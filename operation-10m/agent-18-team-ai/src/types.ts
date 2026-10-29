/**
 * Agent 18 — Team multi-agent coordination types.
 * Mirrors Team OS 2.0 vocabulary without importing the canonical TSX artifact.
 */

export type TeamRole =
  | 'controller'
  | 'earner'
  | 'explorer'
  | 'support'
  | 'recovery'
  | 'scout';

export type TaskKind =
  | 'defend_region'
  | 'take_region'
  | 'reach_region'
  | 'generate_cash'
  | 'recover'
  | 'support_actor'
  | 'monitor_rival'
  | 'preserve_reserve'
  | 'request_treasury'
  | 'complete_contract';

export type TaskStatus =
  | 'waiting'
  | 'ready'
  | 'active'
  | 'blocked'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | 'superseded';

export interface TeamActorSnapshot {
  id: string;
  name: string;
  isHuman: boolean;
  inRecovery: boolean;
  location: string | null;
  apRemaining: number | null;
  brainRole: TeamRole | null;
}

export interface TeamTaskSnapshot {
  id: string;
  type: TaskKind;
  label: string;
  status: TaskStatus;
  priority: number;
  assignedActorIds: string[];
  regionId: string | null;
  resourceRequirement: number;
  dependencies: string[];
  humanStatus?: 'suggested' | 'accepted' | 'active' | 'declined';
}

export interface ExplicitResponsibility {
  actorId: string;
  focus: 'economy' | 'recovery' | 'support' | 'expansion' | 'contracts' | 'controller';
  regionId?: string | null;
  untilCash?: number | null;
}

export interface TeamCommandSlice {
  responsibilities: ExplicitResponsibility[];
  lockedActorIds: string[];
  reserveFloor: number | null;
}

export interface RoleAssignment {
  actorId: string;
  primaryRole: TeamRole;
  secondaryRole: TeamRole | null;
  responsibility: string;
  reason: string;
  taskIds: string[];
  startTurn: number;
  reviewCondition: string;
  temporary: boolean;
  confidence: number;
  explicit: boolean;
  exclusiveSlotId: string | null;
}

export type CoordinationLeaseKind =
  | 'region_exclusive'
  | 'treasury_request'
  | 'handoff_pending'
  | 'parallel_barrier';

export interface CoordinationLease {
  id: string;
  kind: CoordinationLeaseKind;
  holderActorId: string;
  regionId: string | null;
  taskId: string | null;
  sinceTurn: number;
  expiresTurn: number | null;
  reason: string;
}

export interface HandoffRequest {
  id: string;
  fromActorId: string;
  toActorId: string;
  regionId: string | null;
  taskId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  requestedTurn: number;
  reason: string;
}

export interface ParallelWorkstream {
  id: string;
  actorIds: string[];
  taskIds: string[];
  phase: 'active' | 'waiting_barrier' | 'complete';
  barrierTaskIds: string[];
}

export interface PriorityArbitrationRecord {
  regionId: string | null;
  winnerActorId: string;
  winnerTaskId: string;
  reason: string;
  demoted: Array<{ actorId: string; taskId: string; reason: string }>;
}

export interface CoordinationPlan {
  leases: CoordinationLease[];
  handoffs: HandoffRequest[];
  workstreams: ParallelWorkstream[];
  mutexRegions: Record<string, string>;
  warnings: string[];
  arbitrationLog: PriorityArbitrationRecord[];
}

export interface ActionFingerprint {
  key: string;
  actorId: string;
  actionKind: string;
  targetId: string | null;
  turn: number;
  executionGeneration: number;
  amount: number | null;
}

export type DuplicateCommitResult =
  | { ok: true; committed: true }
  | { ok: false; reason: 'duplicate_action_token' | 'stale_generation' | 'conflicting_holder' | 'lease_blocked'; detail: string };

export interface DuplicateGuardState {
  version: 1;
  committedKeys: string[];
  generationByActor: Record<string, number>;
  turn: number;
  reservations: Record<string, { holderActorId: string; taskId: string; turn: number }>;
}

export interface TeamMultiAgentInputs {
  teamId: string;
  turn: number;
  actors: TeamActorSnapshot[];
  tasks: TeamTaskSnapshot[];
  command: TeamCommandSlice | null;
  previousRoles: RoleAssignment[];
  roleSince: Record<string, number>;
  lockedRoles: string[];
  roleMinTurns: number;
  /** Optional Strategic Command proposals to filter through coordination (planning-only). */
  directiveProposals?: TeammateDirectiveProposal[];
}

export interface TeamMultiAgentLayerState {
  version: 1;
  teamId: string;
  turn: number;
  roles: RoleAssignment[];
  coordination: CoordinationPlan;
  duplicateGuard: DuplicateGuardState;
  diagnostics: string[];
  meta: TeamMultiAgentCoordinationMeta;
  auditFindings: CoordinationAuditFinding[];
}

export interface TeamMultiAgentEvaluation {
  state: TeamMultiAgentLayerState;
  blockedDuplicates: string[];
  coordinationIssues: string[];
  auditFindings: CoordinationAuditFinding[];
  persistence: TeamMultiAgentPersistenceDecision;
}

export interface TeamMultiAgentPersistenceDecision {
  commit: boolean;
  reason: string;
  signature: string;
}

export interface TeammateDirectiveProposal {
  id: string;
  actorId: string;
  goalKind: string;
  targetRegionId: string | null;
  taskId: string | null;
  priority: number;
}

export interface DirectiveCoordinationResult {
  allowed: TeammateDirectiveProposal[];
  suppressed: Array<{ proposal: TeammateDirectiveProposal; reason: string }>;
  constraintsByActor: Record<string, string>;
}

export interface CoordinationAuditFinding {
  id: string;
  severity: 'info' | 'warning' | 'error';
  message: string;
  actorIds: string[];
  regionId: string | null;
}

export interface TeamMultiAgentCoordinationMeta {
  directiveConstraints: Record<string, string>;
  suppressedDirectiveIds: string[];
  auditSummary: { errors: number; warnings: number; info: number };
  lastReconcileStable: boolean;
  thrashingRegions: string[];
  /** Rolling mutex snapshots for thrashing detection (newest last). */
  mutexHistory: Array<Record<string, string>>;
  handoffSlaCompliance?: number;
  overdueHandoffIds?: string[];
  capacityBalanceScore?: number;
  overloadedActorIds?: string[];
  idleActorIds?: string[];
  directiveQuotaRemaining?: Record<string, number>;
  handoffReadinessAverage?: number;
  notReadyHandoffIds?: string[];
  mutexStabilityIndex?: number;
  volatileMutexRegionIds?: string[];
  workstreamBarrierCompliance?: number;
  stalledWorkstreamIds?: string[];
  workstreamBarrierSince?: Record<string, number>;
  roleChurnIndex?: number;
  roleChurnActorIds?: string[];
  leaseHealthScore?: number;
  expiringLeaseIds?: string[];
  expiredLeaseIds?: string[];
  coordinationCompositeScore?: number;
  coordinationWeakestDimension?: string;
  directiveCollisionIndex?: number;
  collidingDirectiveIds?: string[];
  handoffIntegrityScore?: number;
  brokenHandoffIds?: string[];
  duplicatePendingHandoffTaskIds?: string[];
  coordinationEscalationTier?: number;
  coordinationEscalationLabel?: string;
  coordinationRecoveryUrgency?: number;
  coordinationRecoveryActions?: string[];
  directivePriorityInversionIndex?: number;
  invertedDirectiveIds?: string[];
  handoffOrphanCount?: number;
  orphanHandoffIds?: string[];
  workstreamDeadlockCount?: number;
  deadlockedWorkstreamIds?: string[];
  leaseContentionIndex?: number;
  contendedRegionIds?: string[];
  coordinationSaturationIndex?: number;
  mutexLeaseDivergenceIndex?: number;
  mutexLeaseDivergentRegionIds?: string[];
  handoffCascadeRiskIndex?: number;
  handoffCascadeChainActorIds?: string[];
  suppressionBacklogIndex?: number;
  reconcileDriftIndex?: number;
  arbitrationPressureIndex?: number;
  arbitrationDemotedActorIds?: string[];
  persistenceChurnIndex?: number;
  duplicateGuardPressureIndex?: number;
  roleTaskCoverageGapIndex?: number;
  uncoveredTaskIds?: string[];
  compositeHealthGradientIndex?: number;
  compositeHealthTrend?: string;
  handoffReadinessSpreadIndex?: number;
  workstreamParallelismIndex?: number;
  escalationRecoveryAlignmentIndex?: number;
  auditPressureIndex?: number;
  roleLockFrictionIndex?: number;
  lockedRoleActorIds?: string[];
  directiveConstraintDensityIndex?: number;
  directiveConstrainedActorIds?: string[];
  crossTeamRejectionIndex?: number;
  handoffSlaVelocityIndex?: number;
  recoveryActionBreadthIndex?: number;
  directiveQuotaExhaustionIndex?: number;
  quotaExhaustedActorIds?: string[];
  capacityImbalanceIndex?: number;
  workstreamBarrierStalenessIndex?: number;
  workstreamDeadlockPressureIndex?: number;
  suppressionQuotaCouplingIndex?: number;
  handoffLeaseOverlapIndex?: number;
  saturationDeadlockCouplingIndex?: number;
  cascadeLeaseConvergenceIndex?: number;
  gradientAuditTensionIndex?: number;
  escalationSaturationStackIndex?: number;
  recoveryCascadeMismatchIndex?: number;
  persistenceGradientFrictionIndex?: number;
  stackMismatchCouplingIndex?: number;
  auditStackAmplificationIndex?: number;
  frictionAlignmentGapIndex?: number;
  couplingAmplificationFusionIndex?: number;
  gapChurnResonanceIndex?: number;
  stackFrictionConvergenceIndex?: number;
  fusionResonanceCouplingIndex?: number;
  convergenceFusionStackIndex?: number;
  resonanceAuditCascadeIndex?: number;
  couplingStackCascadeIndex?: number;
  stackCascadeAmplificationIndex?: number;
  cascadeCouplingSynthesisIndex?: number;
  cascadeSynthesisFusionIndex?: number;
  amplificationStackResonanceIndex?: number;
  synthesisEscalationPressureIndex?: number;
  fusionResonanceConvergenceIndex?: number;
  pressureFusionCascadeIndex?: number;
  resonancePressureSynthesisIndex?: number;
  convergenceCascadeSynthesisIndex?: number;
  synthesisConvergenceStackIndex?: number;
  cascadeResonanceAmplificationIndex?: number;
  synthesisStackAmplificationIndex?: number;
  amplificationConvergenceCascadeIndex?: number;
  stackSynthesisResonanceIndex?: number;
  stackAmplificationCascadeFusionIndex?: number;
  resonanceAmplificationStackIndex?: number;
  cascadeConvergenceResonanceIndex?: number;
  fusionStackConvergenceIndex?: number;
  resonanceCascadeSynthesisIndex?: number;
  convergenceAmplificationPressureIndex?: number;
  convergenceSynthesisFusionIndex?: number;
  pressureCascadeStackIndex?: number;
  synthesisPressureResonanceIndex?: number;
  fusionCascadeStackIndex?: number;
  resonancePressureCascadeIndex?: number;
  synthesisFusionConvergenceIndex?: number;
  stackCascadeResonanceIndex?: number;
  cascadeConvergencePressureIndex?: number;
  convergenceFusionSynthesisIndex?: number;
  resonanceConvergenceFusionIndex?: number;
  pressureSynthesisCascadeIndex?: number;
  synthesisResonanceStackIndex?: number;
  convergenceFusionPressureIndex?: number;
  synthesisCascadeStackIndex?: number;
  resonanceStackFusionIndex?: number;
}

export const AGENT18_LIMITS = {
  maxLeases: 12,
  maxHandoffs: 6,
  maxWorkstreams: 4,
  maxCommittedKeys: 48,
  maxReservations: 24,
  maxAuditFindings: 16,
  maxSuppressedDirectives: 24,
  maxCommitsPerTurn: 8,
  maxDirectivesPerActorPerTurn: 3,
  maxDirectivesPerTeamPerTurn: 8,
  handoffSlaMaxPendingTurns: 2,
  workstreamBarrierMaxWaitTurns: 2,
  maxMutexHistorySnapshots: 5,
  roleMinTurnsDefault: 2,
} as const;

export const TASK_ROLE_MAP: Partial<Record<TaskKind, TeamRole>> = {
  defend_region: 'controller',
  take_region: 'explorer',
  reach_region: 'explorer',
  generate_cash: 'earner',
  recover: 'recovery',
  support_actor: 'support',
  monitor_rival: 'scout',
  preserve_reserve: 'controller',
  request_treasury: 'earner',
  complete_contract: 'earner',
};

export const EXCLUSIVE_TASK_KINDS: TaskKind[] = ['defend_region', 'take_region', 'generate_cash'];
