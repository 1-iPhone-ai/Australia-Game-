// OP10M_MODULE_BEGIN agent-18-team-ai
// Agent 18 — Team Intelligence / multi-agent coordination (generated; source: operation-10m/agent-18-team-ai/src/)

// --- source: types.ts ---
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
  pressureStackResonanceIndex?: number;
  stackFusionCascadeIndex?: number;
  fusionCascadeConvergenceIndex?: number;
  resonanceFusionStackIndex?: number;
  fusionCascadePressureIndex?: number;
  stackConvergenceResonanceIndex?: number;
  fusionStackPressureIndex?: number;
  pressureResonanceCascadeIndex?: number;
  stackSynthesisConvergenceIndex?: number;
  pressureCascadeFusionIndex?: number;
  cascadeSynthesisResonanceIndex?: number;
  convergencePressureStackIndex?: number;
  fusionCascadeResonanceIndex?: number;
  resonancePressureStackIndex?: number;
  stackSynthesisFusionIndex?: number;
  cascadeResonanceStackIndex?: number;
  resonanceFusionPressureIndex?: number;
  fusionConvergenceSynthesisIndex?: number;
  stackResonancePressureIndex?: number;
  pressureFusionSynthesisIndex?: number;
  synthesisStackConvergenceIndex?: number;
  stackFusionResonanceIndex?: number;
  fusionSynthesisPressureIndex?: number;
  synthesisCascadeConvergenceIndex?: number;
  fusionResonanceSynthesisIndex?: number;
  pressureCascadeConvergenceIndex?: number;
  cascadeStackFusionIndex?: number;
  synthesisResonanceConvergenceIndex?: number;
  pressureStackFusionIndex?: number;
  fusionStackSynthesisIndex?: number;
  resonanceConvergenceStackIndex?: number;
  pressureStackSynthesisIndex?: number;
  fusionStackResonanceIndex?: number;
  convergenceStackSynthesisIndex?: number;
  stackSynthesisPressureIndex?: number;
  fusionResonanceStackIndex?: number;
  synthesisPressureConvergenceIndex?: number;
  pressureFusionStackIndex?: number;
  resonanceSynthesisFusionIndex?: number;
  convergencePressureFusionIndex?: number;
  pressureResonanceSynthesisIndex?: number;
  fusionConvergencePressureIndex?: number;
  fusionSynthesisResonanceIndex?: number;
  resonancePressureConvergenceIndex?: number;
  pressureFusionConvergenceIndex?: number;
  resonanceConvergenceSynthesisIndex?: number;
  synthesisPressureFusionIndex?: number;
  convergenceSynthesisResonanceIndex?: number;
  synthesisConvergencePressureIndex?: number;
  convergencePressureSynthesisIndex?: number;
  pressureSynthesisConvergenceIndex?: number;
  convergenceSynthesisPressureIndex?: number;
  synthesisPressureResonanceIndex?: number;
  pressureResonanceConvergenceIndex?: number;
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


// --- source: priority-arbitration.ts ---

/** Mission tier (lower number = wins). Mirrors Team OS objective tiers. */
export const MISSION_TIER_BY_TASK: Partial<Record<TaskKind, number>> = {
  request_treasury: 3,
  generate_cash: 4,
  preserve_reserve: 5,
  defend_region: 6,
  recover: 7,
  take_region: 8,
  reach_region: 8,
  support_actor: 7,
  monitor_rival: 9,
  complete_contract: 8,
};

export interface ArbitrationCandidate {
  actorId: string;
  task: TeamTaskSnapshot;
  role: RoleAssignment | null;
  explicit: boolean;
  locked: boolean;
}

export interface ArbitrationOutcome {
  winner: ArbitrationCandidate;
  demoted: ArbitrationCandidate[];
  reason: string;
}

export function missionTierForTask(task: TeamTaskSnapshot): number {
  return MISSION_TIER_BY_TASK[task.type] ?? 8;
}

/**
 * Effective arbitration score (lower wins). Combines mission tier, task priority field,
 * explicit/locked boosts, and defend-over-take on the same region.
 */
export function arbitrationScore(
  candidate: ArbitrationCandidate,
  regionId: string | null,
): number {
  let score = missionTierForTask(candidate.task) * 100 + candidate.task.priority;
  if (candidate.task.type === 'defend_region' && regionId && candidate.task.regionId === regionId) {
    score -= 5;
  }
  if (candidate.task.type === 'take_region' && regionId && candidate.task.regionId === regionId) {
    score += 3;
  }
  if (candidate.explicit) score -= 2;
  if (candidate.locked) score -= 1;
  if (candidate.role?.primaryRole === 'recovery') score += 4;
  return score;
}

export function compareArbitrationCandidates(
  a: ArbitrationCandidate,
  b: ArbitrationCandidate,
  regionId: string | null,
): number {
  const sa = arbitrationScore(a, regionId);
  const sb = arbitrationScore(b, regionId);
  if (sa !== sb) return sa - sb;
  if (a.task.priority !== b.task.priority) return a.task.priority - b.task.priority;
  const actorCmp = a.actorId.localeCompare(b.actorId);
  if (actorCmp !== 0) return actorCmp;
  return a.task.id.localeCompare(b.task.id);
}

export function arbitrateCompetingCandidates(
  candidates: ArbitrationCandidate[],
  regionId: string | null,
): ArbitrationOutcome | null {
  const live = candidates.filter(
    c => !['completed', 'cancelled', 'superseded'].includes(c.task.status),
  );
  if (!live.length) return null;
  if (live.length === 1) {
    return {
      winner: live[0],
      demoted: [],
      reason: `Priority arbitration: ${live[0].actorId} wins (sole active candidate, tier ${missionTierForTask(live[0].task)})`,
    };
  }
  const sorted = live.slice().sort((x, y) => compareArbitrationCandidates(x, y, regionId));
  const winner = sorted[0];
  const demoted = sorted.slice(1);
  const winTier = missionTierForTask(winner.task);
  const reasonParts = [`tier ${winTier} ${winner.task.type}`, `task priority ${winner.task.priority}`];
  if (winner.explicit) reasonParts.push('explicit assignment');
  if (winner.locked) reasonParts.push('locked role');
  const reason = reasonParts.join('; ');
  return {
    winner,
    demoted,
    reason: `Priority arbitration: ${winner.actorId} wins (${reason})`,
  };
}

export function collectRegionCandidates(
  regionId: string,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): ArbitrationCandidate[] {
  const depositTasks = tasks.filter(
    t =>
      t.regionId === regionId &&
      (t.type === 'defend_region' || t.type === 'take_region') &&
      !['completed', 'cancelled', 'superseded'].includes(t.status),
  );
  const out: ArbitrationCandidate[] = [];
  depositTasks.forEach(task => {
    task.assignedActorIds.forEach(actorId => {
      const role = roles.find(r => r.actorId === actorId) || null;
      out.push({
        actorId,
        task,
        role,
        explicit: Boolean(role?.explicit),
        locked: lockedActorIds.includes(actorId),
      });
    });
  });
  return out;
}

/** Pick one lead actor per region using mission tiers and stable tie-breaks. */
export function arbitrateRegionLead(
  regionId: string,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): { holderActorId: string | null; record: ArbitrationOutcome | null } {
  const candidates = collectRegionCandidates(regionId, tasks, roles, lockedActorIds);
  if (!candidates.length) return { holderActorId: null, record: null };
  const outcome = arbitrateCompetingCandidates(candidates, regionId);
  if (!outcome) return { holderActorId: null, record: null };
  return { holderActorId: outcome.winner.actorId, record: outcome };
}

export function buildMutexMapWithPriorityArbitration(
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): { mutexRegions: Record<string, string>; arbitrationLog: PriorityArbitrationRecord[] } {
  const regions = new Set(
    tasks
      .filter(
        t =>
          t.regionId &&
          (t.type === 'defend_region' || t.type === 'take_region') &&
          !['completed', 'cancelled', 'superseded'].includes(t.status),
      )
      .map(t => t.regionId as string),
  );
  const mutexRegions: Record<string, string> = {};
  const arbitrationLog: PriorityArbitrationRecord[] = [];
  regions.forEach(regionId => {
    const { holderActorId, record } = arbitrateRegionLead(regionId, tasks, roles, lockedActorIds);
    if (!holderActorId || !record) return;
    mutexRegions[regionId] = holderActorId;
    arbitrationLog.push({
      regionId,
      winnerActorId: record.winner.actorId,
      winnerTaskId: record.winner.task.id,
      reason: record.reason,
      demoted: record.demoted.map(d => ({
        actorId: d.actorId,
        taskId: d.task.id,
        reason: `tier ${missionTierForTask(d.task)} ${d.task.type} loses arbitration`,
      })),
    });
  });
  return { mutexRegions, arbitrationLog };
}

/** Slot collision winner using the same arbitration ordering as region mutex. */
export function pickSlotCollisionWinner(
  actorIds: string[],
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  slotRegionId: string | null,
): string | null {
  const candidates: ArbitrationCandidate[] = [];
  actorIds.forEach(actorId => {
    const role = roles.find(r => r.actorId === actorId) || null;
    const task =
      tasks
        .filter(
          t =>
            t.assignedActorIds.includes(actorId) &&
            !['completed', 'cancelled', 'superseded'].includes(t.status),
        )
        .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))[0] || null;
    if (!task) return;
    candidates.push({ actorId, task, role, explicit: Boolean(role?.explicit), locked: false });
  });
  const outcome = arbitrateCompetingCandidates(candidates, slotRegionId);
  return outcome?.winner.actorId ?? null;
}


// --- source: duplicate-action-guard.ts ---
  ActionFingerprint,
  AGENT18_LIMITS,
  CoordinationPlan,
  DuplicateCommitResult,
  DuplicateGuardState,
} from './types.ts';

export function buildActionFingerprint(input: {
  actorId: string;
  actionKind: string;
  targetId?: string | null;
  turn: number;
  executionGeneration: number;
  amount?: number | null;
}): ActionFingerprint {
  const targetId = input.targetId ?? null;
  const amount = input.amount ?? null;
  const key = [
    input.actorId,
    input.actionKind,
    targetId || '_',
    String(input.turn),
    String(input.executionGeneration),
    amount === null ? '_' : String(amount),
  ].join('|');
  return {
    key,
    actorId: input.actorId,
    actionKind: input.actionKind,
    targetId,
    turn: input.turn,
    executionGeneration: input.executionGeneration,
    amount,
  };
}

export function emptyDuplicateGuardState(turn: number): DuplicateGuardState {
  return {
    version: 1,
    committedKeys: [],
    generationByActor: {},
    turn,
    reservations: {},
  };
}

export function advanceDuplicateGuardTurn(state: DuplicateGuardState, turn: number): DuplicateGuardState {
  if (state.turn === turn) return state;
  return {
    ...state,
    turn,
    committedKeys: state.committedKeys.slice(-AGENT18_LIMITS.maxCommittedKeys),
    reservations: Object.fromEntries(
      Object.entries(state.reservations).filter(([, v]) => v.turn >= turn - 1),
    ),
  };
}

export function reserveActionSlot(
  state: DuplicateGuardState,
  reservationKey: string,
  holderActorId: string,
  taskId: string,
  turn: number,
): DuplicateGuardState {
  const keys = Object.keys(state.reservations);
  if (keys.length >= AGENT18_LIMITS.maxReservations && !state.reservations[reservationKey]) {
    return state;
  }
  const existing = state.reservations[reservationKey];
  if (existing && existing.holderActorId !== holderActorId) {
    return state;
  }
  return {
    ...state,
    reservations: {
      ...state.reservations,
      [reservationKey]: { holderActorId, taskId, turn },
    },
  };
}

export function reservationKeyForRegionAction(regionId: string, actionKind: string): string {
  return `res:${regionId}:${actionKind}`;
}

/**
 * Attempt to commit an action fingerprint. Matches canonical executor semantics:
 * same key + generation → duplicate_action_token; stale generation → stale_generation.
 */
export function tryCommitAction(
  state: DuplicateGuardState,
  fingerprint: ActionFingerprint,
  coordination?: CoordinationPlan | null,
): { state: DuplicateGuardState; result: DuplicateCommitResult } {
  const gen = state.generationByActor[fingerprint.actorId] ?? 0;
  if (fingerprint.executionGeneration < gen) {
    return {
      state,
      result: {
        ok: false,
        reason: 'stale_generation',
        detail: `generation ${fingerprint.executionGeneration} < actor ${gen}`,
      },
    };
  }
  if (state.committedKeys.includes(fingerprint.key)) {
    return {
      state,
      result: {
        ok: false,
        reason: 'duplicate_action_token',
        detail: fingerprint.key,
      },
    };
  }
  if (fingerprint.targetId && coordination) {
    const region = fingerprint.targetId;
    const holder = coordination.mutexRegions[region];
    if (holder && holder !== fingerprint.actorId && /deposit|region/i.test(fingerprint.actionKind)) {
      return {
        state,
        result: {
          ok: false,
          reason: 'lease_blocked',
          detail: `${fingerprint.actorId} blocked; mutex held by ${holder}`,
        },
      };
    }
  }
  const reservationKey = fingerprint.targetId
    ? reservationKeyForRegionAction(fingerprint.targetId, fingerprint.actionKind)
    : null;
  if (reservationKey && state.reservations[reservationKey]) {
    const r = state.reservations[reservationKey];
    if (r.holderActorId !== fingerprint.actorId) {
      return {
        state,
        result: {
          ok: false,
          reason: 'conflicting_holder',
          detail: `reservation held by ${r.holderActorId}`,
        },
      };
    }
  }
  const nextKeys = [...state.committedKeys, fingerprint.key].slice(-AGENT18_LIMITS.maxCommittedKeys);
  const nextState: DuplicateGuardState = {
    ...state,
    committedKeys: nextKeys,
    generationByActor: {
      ...state.generationByActor,
      [fingerprint.actorId]: Math.max(gen, fingerprint.executionGeneration),
    },
  };
  return { state: nextState, result: { ok: true, committed: true } };
}

/** Detect duplicate intents among proposed AI actions before they reach the executor. */
export function detectDuplicateIntents(fingerprints: ActionFingerprint[]): string[] {
  const seen = new Map<string, string>();
  const dupes: string[] = [];
  fingerprints.forEach(fp => {
    const logical = [fp.actorId, fp.actionKind, fp.targetId || '_', String(fp.turn)].join('|');
    if (seen.has(logical) && seen.get(logical) !== fp.key) {
      dupes.push(logical);
    }
    seen.set(logical, fp.key);
  });
  return dupes;
}

export function mergeDuplicateGuardStates(
  a: DuplicateGuardState,
  b: DuplicateGuardState,
): DuplicateGuardState {
  const turn = Math.max(a.turn, b.turn);
  const committedKeys = [...new Set([...a.committedKeys, ...b.committedKeys])].slice(
    -AGENT18_LIMITS.maxCommittedKeys,
  );
  const generationByActor = { ...a.generationByActor, ...b.generationByActor };
  Object.keys(generationByActor).forEach(k => {
    generationByActor[k] = Math.max(a.generationByActor[k] ?? 0, b.generationByActor[k] ?? 0);
  });
  return {
    version: 1,
    turn,
    committedKeys,
    generationByActor,
    reservations: { ...a.reservations, ...b.reservations },
  };
}

export function sanitizeDuplicateGuardState(raw: unknown, turn: number): DuplicateGuardState {
  const base = emptyDuplicateGuardState(turn);
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Record<string, unknown>;
  const committedKeys = Array.isArray(r.committedKeys)
    ? r.committedKeys.map(String).slice(-AGENT18_LIMITS.maxCommittedKeys)
    : [];
  const generationByActor =
    r.generationByActor && typeof r.generationByActor === 'object'
      ? Object.fromEntries(
          Object.entries(r.generationByActor as Record<string, unknown>).map(([k, v]) => [
            String(k),
            Number(v) || 0,
          ]),
        )
      : {};
  const reservations: DuplicateGuardState['reservations'] = {};
  if (r.reservations && typeof r.reservations === 'object') {
    Object.entries(r.reservations as Record<string, unknown>).slice(0, AGENT18_LIMITS.maxReservations).forEach(([k, v]) => {
      if (!v || typeof v !== 'object') return;
      const o = v as Record<string, unknown>;
      reservations[k] = {
        holderActorId: String(o.holderActorId || ''),
        taskId: String(o.taskId || ''),
        turn: Number(o.turn) || turn,
      };
    });
  }
  return {
    version: 1,
    turn: Number(r.turn) || turn,
    committedKeys,
    generationByActor,
    reservations,
  };
}

export class DuplicateActionGuard {
  private state: DuplicateGuardState;

  constructor(initial?: DuplicateGuardState, turn: number = 0) {
    this.state = initial ? sanitizeDuplicateGuardState(initial, turn) : emptyDuplicateGuardState(turn);
  }

  snapshot(): DuplicateGuardState {
    return { ...this.state, committedKeys: [...this.state.committedKeys], reservations: { ...this.state.reservations } };
  }

  onTurn(turn: number): void {
    this.state = advanceDuplicateGuardTurn(this.state, turn);
  }

  tryCommit(fingerprint: ActionFingerprint, coordination?: CoordinationPlan | null): DuplicateCommitResult {
    const out = tryCommitAction(this.state, fingerprint, coordination);
    this.state = out.state;
    return out.result;
  }
}


// --- source: role-assignment-engine.ts ---
  AGENT18_LIMITS,
  ExplicitResponsibility,
  RoleAssignment,
  TASK_ROLE_MAP,
  TeamActorSnapshot,
  TeamCommandSlice,
  TeamMultiAgentInputs,
  TeamRole,
  TeamTaskSnapshot,
} from './types.ts';

function focusToRole(focus: ExplicitResponsibility['focus']): TeamRole {
  switch (focus) {
    case 'economy':
    case 'contracts':
      return 'earner';
    case 'recovery':
      return 'recovery';
    case 'support':
      return 'support';
    case 'expansion':
      return 'explorer';
    case 'controller':
      return 'controller';
    default:
      return 'earner';
  }
}

function responsibilityLabel(resp: ExplicitResponsibility): string {
  if (resp.regionId) {
    return resp.focus === 'expansion'
      ? `Expand into ${resp.regionId}`
      : `Hold ${resp.regionId}`;
  }
  if (resp.focus === 'economy') return 'Team income';
  if (resp.focus === 'recovery') {
    return resp.untilCash ? `Recover until $${resp.untilCash}` : 'Recover';
  }
  return resp.focus;
}

function pickTopTask(tasks: TeamTaskSnapshot[], actorId: string): TeamTaskSnapshot | null {
  const mine = tasks.filter(
    t =>
      t.assignedActorIds.includes(actorId) &&
      !['completed', 'cancelled', 'superseded'].includes(t.status) &&
      t.type !== 'support_actor',
  );
  if (!mine.length) return null;
  return mine.slice().sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))[0];
}

function exclusiveSlotForTask(task: TeamTaskSnapshot | null): string | null {
  if (!task) return null;
  if (task.type === 'defend_region' || task.type === 'take_region') {
    return task.regionId ? `region:${task.regionId}:${task.type}` : null;
  }
  if (task.type === 'generate_cash') return `cash:${task.assignedActorIds[0] || 'team'}`;
  return null;
}

/** Resolve two actors competing for the same exclusive slot — higher-priority task wins. */
export function resolveExclusiveSlotCollisions(
  roles: RoleAssignment[],
  tasks: TeamTaskSnapshot[],
): { roles: RoleAssignment[]; notes: string[] } {
  const notes: string[] = [];
  const slotToActors = new Map<string, string[]>();
  roles.forEach(r => {
    if (!r.exclusiveSlotId) return;
    const list = slotToActors.get(r.exclusiveSlotId) || [];
    list.push(r.actorId);
    slotToActors.set(r.exclusiveSlotId, list);
  });
  let next = roles.map(r => ({ ...r }));
  slotToActors.forEach((actorIds, slot) => {
    if (actorIds.length <= 1) return;
    const slotRegion = slot.startsWith('region:') ? slot.split(':')[1] : null;
    const winner = pickSlotCollisionWinner(actorIds, tasks, roles, slotRegion);
    if (!winner) return;
    next = next.map(r => {
      if (!actorIds.includes(r.actorId) || r.actorId === winner) return r;
      notes.push(`Demoted ${r.actorId} from slot ${slot}; ${winner} leads`);
      return {
        ...r,
        primaryRole: 'support',
        responsibility: `Support ${winner} on ${slot.replace(/^region:/, '')}`,
        reason: 'Exclusive slot collision — supporting lead actor',
        temporary: true,
        exclusiveSlotId: null,
        confidence: Math.min(r.confidence, 0.55),
      };
    });
  });
  return { roles: next, notes };
}

/**
 * Assign team roles with hysteresis, explicit responsibilities, recovery override,
 * and exclusive slot metadata for coordination.
 */
export function assignTeamRolesWithSlots(
  inputs: TeamMultiAgentInputs,
): { roles: RoleAssignment[]; notes: string[] } {
  const { actors, tasks, command, previousRoles, roleSince, lockedRoles, roleMinTurns } = inputs;
  const notes: string[] = [];
  const roles: RoleAssignment[] = actors.map(a => {
    const prev = previousRoles.find(p => p.actorId === a.id) || null;
    const explicitResp =
      (command?.responsibilities || []).find(
        r => r.actorId === a.id || (a.isHuman && r.actorId === 'player'),
      ) || null;
    const top = pickTopTask(tasks, a.id);
    let role: TeamRole =
      a.inRecovery && !a.isHuman
        ? 'recovery'
        : top
          ? TASK_ROLE_MAP[top.type] || 'earner'
          : a.brainRole || 'earner';
    if (explicitResp) role = focusToRole(explicitResp.focus);
    const responsibility = explicitResp
      ? responsibilityLabel(explicitResp)
      : top
        ? top.label
        : 'No active task';
    const since = roleSince[a.id] ?? inputs.turn;
    const locked =
      lockedRoles.includes(a.id) ||
      (command?.lockedActorIds || []).includes(a.id) ||
      Boolean(prev?.explicit && !explicitResp && command === null);
    if (
      prev &&
      !explicitResp &&
      (locked ||
        (prev.primaryRole !== role &&
          inputs.turn - since < roleMinTurns &&
          role !== 'recovery'))
    ) {
      return {
        ...prev,
        taskIds: tasks.filter(t => t.assignedActorIds.includes(a.id)).map(t => t.id),
        exclusiveSlotId: exclusiveSlotForTask(top),
      };
    }
    return {
      actorId: a.id,
      primaryRole: role,
      secondaryRole: null,
      responsibility,
      reason: explicitResp
        ? 'You assigned this responsibility.'
        : a.inRecovery && !a.isHuman
          ? 'Economic recovery comes first.'
          : top
            ? `Assigned to "${top.label}".`
            : 'Team Brain default role.',
      taskIds: tasks.filter(t => t.assignedActorIds.includes(a.id)).map(t => t.id),
      startTurn: prev && prev.primaryRole === role ? prev.startTurn : inputs.turn,
      reviewCondition:
        role === 'recovery'
          ? 'exits economic recovery'
          : top
            ? `"${top.label}" completes or is blocked`
            : 'next replan',
      temporary: role === 'recovery' || Boolean(explicitResp?.untilCash),
      confidence: explicitResp ? 0.95 : top ? 0.8 : 0.6,
      explicit: Boolean(explicitResp),
      exclusiveSlotId: exclusiveSlotForTask(top),
    };
  });
  const resolved = resolveExclusiveSlotCollisions(roles, tasks);
  notes.push(...resolved.notes);
  return { roles: resolved.roles, notes };
}

/** Detect tasks that illegally assign multiple actors to one exclusive action. */
export function detectIllegalSharedExclusiveTasks(tasks: TeamTaskSnapshot[]): string[] {
  const issues: string[] = [];
  tasks.forEach(t => {
    if (!['defend_region', 'take_region', 'generate_cash'].includes(t.type)) return;
    if (t.assignedActorIds.length > 1 && !['cancelled', 'superseded', 'completed'].includes(t.status)) {
      issues.push(`Task ${t.id} (${t.type}) assigns ${t.assignedActorIds.join('+')} — exclusive kinds allow one lead actor`);
    }
  });
  return issues;
}

export function mergeCommandSlice(
  base: TeamCommandSlice | null,
  patch: Partial<TeamCommandSlice>,
): TeamCommandSlice {
  return {
    responsibilities: patch.responsibilities ?? base?.responsibilities ?? [],
    lockedActorIds: patch.lockedActorIds ?? base?.lockedActorIds ?? [],
    reserveFloor: patch.reserveFloor ?? base?.reserveFloor ?? null,
  };
}

export function actorsNeedingRoleReview(
  roles: RoleAssignment[],
  turn: number,
  maxIdleTurns: number = AGENT18_LIMITS.roleMinTurnsDefault + 2,
): string[] {
  return roles
    .filter(r => !r.temporary && turn - r.startTurn >= maxIdleTurns && r.taskIds.length === 0)
    .map(r => r.actorId);
}

export function summarizeRoleBoard(roles: RoleAssignment[]): string {
  return roles
    .map(r => `${r.actorId}:${r.primaryRole}${r.exclusiveSlotId ? `@${r.exclusiveSlotId}` : ''}`)
    .join(' | ');
}


// --- source: coordination-orchestrator.ts ---
  AGENT18_LIMITS,
  CoordinationLease,
  CoordinationPlan,
  HandoffRequest,
  ParallelWorkstream,
  PriorityArbitrationRecord,
  RoleAssignment,
  TeamTaskSnapshot,
} from './types.ts';

function leaseId(kind: string, regionId: string | null, taskId: string | null, holder: string): string {
  return `lease_${kind}_${regionId || 'none'}_${taskId || 'none'}_${holder}`;
}

/** Build region mutex map: one lead actor per contested region (priority arbitration). */
export function buildRegionMutexMap(
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): Record<string, string> {
  return buildMutexMapWithPriorityArbitration(tasks, roles, lockedActorIds).mutexRegions;
}

export function buildRegionMutexWithLog(
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): { mutexRegions: Record<string, string>; arbitrationLog: PriorityArbitrationRecord[] } {
  return buildMutexMapWithPriorityArbitration(tasks, roles, lockedActorIds);
}

export function buildCoordinationLeases(
  turn: number,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  mutexRegions: Record<string, string>,
): CoordinationLease[] {
  const leases: CoordinationLease[] = [];
  Object.entries(mutexRegions).forEach(([regionId, holderActorId]) => {
    const task = tasks.find(
      t =>
        t.regionId === regionId &&
        (t.type === 'defend_region' || t.type === 'take_region') &&
        t.assignedActorIds.includes(holderActorId),
    );
    leases.push({
      id: leaseId('region_exclusive', regionId, task?.id || null, holderActorId),
      kind: 'region_exclusive',
      holderActorId,
      regionId,
      taskId: task?.id || null,
      sinceTurn: turn,
      expiresTurn: null,
      reason: `Lead deposit coordination for ${regionId}`,
    });
  });
  tasks
    .filter(t => t.type === 'request_treasury' && t.status !== 'completed')
    .slice(0, 2)
    .forEach(t => {
      const holder = t.assignedActorIds[0];
      if (!holder) return;
      leases.push({
        id: leaseId('treasury_request', null, t.id, holder),
        kind: 'treasury_request',
        holderActorId: holder,
        regionId: null,
        taskId: t.id,
        sinceTurn: turn,
        expiresTurn: turn + 2,
        reason: 'Treasury funding request in flight',
      });
    });
  return leases.slice(0, AGENT18_LIMITS.maxLeases);
}

export function detectHandoffCandidates(
  turn: number,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  mutexRegions: Record<string, string>,
): HandoffRequest[] {
  const handoffs: HandoffRequest[] = [];
  Object.entries(mutexRegions).forEach(([regionId, leadId]) => {
    const task = tasks.find(
      t =>
        t.regionId === regionId &&
        t.status === 'blocked' &&
        t.assignedActorIds.includes(leadId),
    );
    if (!task) return;
    const supporter = roles.find(
      r => r.primaryRole === 'support' && r.responsibility.includes(regionId),
    );
    if (!supporter || supporter.actorId === leadId) return;
    handoffs.push({
      id: `handoff_${regionId}_${leadId}_${supporter.actorId}`,
      fromActorId: leadId,
      toActorId: supporter.actorId,
      regionId,
      taskId: task.id,
      status: 'pending',
      requestedTurn: turn,
      reason: `${leadId} blocked on ${regionId}; offer handoff to ${supporter.actorId}`,
    });
  });
  return handoffs.slice(0, AGENT18_LIMITS.maxHandoffs);
}

export function buildParallelWorkstreams(
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): ParallelWorkstream[] {
  const activeActors = roles.filter(r => r.taskIds.length > 0).map(r => r.actorId);
  if (activeActors.length < 2) return [];
  const human = roles.find(r => r.actorId === 'player');
  const ai = roles.find(r => r.actorId !== 'player' && r.taskIds.length > 0);
  if (!human || !ai) return [];
  const sharedBarrier = tasks.filter(
    t => t.type === 'preserve_reserve' || t.type === 'monitor_rival',
  );
  return [
    {
      id: 'ws_parallel_human_ai',
      actorIds: [human.actorId, ai.actorId],
      taskIds: [...new Set([...human.taskIds, ...ai.taskIds])],
      phase: sharedBarrier.some(b => b.status === 'waiting') ? 'waiting_barrier' : 'active',
      barrierTaskIds: sharedBarrier.map(t => t.id),
    },
  ].slice(0, AGENT18_LIMITS.maxWorkstreams);
}

export function orchestrateTeamCoordination(
  turn: number,
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
  lockedActorIds: string[] = [],
): CoordinationPlan {
  const warnings: string[] = [];
  const { mutexRegions, arbitrationLog } = buildRegionMutexWithLog(tasks, roles, lockedActorIds);
  const leases = buildCoordinationLeases(turn, tasks, roles, mutexRegions);
  const handoffs = detectHandoffCandidates(turn, tasks, roles, mutexRegions);
  const workstreams = buildParallelWorkstreams(tasks, roles);
  tasks.forEach(t => {
    if (!t.regionId || !mutexRegions[t.regionId]) return;
    const lead = mutexRegions[t.regionId];
    if (t.type !== 'support_actor' && t.assignedActorIds.length > 1) {
      warnings.push(`Task ${t.id} shares actors but region ${t.regionId} mutex held by ${lead}`);
    }
  });
  return { leases, handoffs, workstreams, mutexRegions, warnings, arbitrationLog };
}

export function acceptHandoff(plan: CoordinationPlan, handoffId: string): CoordinationPlan {
  const handoffs = plan.handoffs.map(h =>
    h.id === handoffId ? { ...h, status: 'accepted' as const } : h,
  );
  const accepted = handoffs.find(h => h.id === handoffId && h.status === 'accepted');
  if (!accepted || !accepted.regionId) return { ...plan, handoffs };
  const mutexRegions = { ...plan.mutexRegions, [accepted.regionId]: accepted.toActorId };
  const leases = plan.leases.map(l =>
    l.regionId === accepted.regionId && l.kind === 'region_exclusive'
      ? { ...l, holderActorId: accepted.toActorId, reason: `Handoff accepted from ${accepted.fromActorId}` }
      : l,
  );
  return { ...plan, handoffs, mutexRegions, leases };
}

export function rejectHandoff(plan: CoordinationPlan, handoffId: string): CoordinationPlan {
  return {
    ...plan,
    handoffs: plan.handoffs.map(h =>
      h.id === handoffId ? { ...h, status: 'rejected' as const } : h,
    ),
  };
}

export function coordinationHealthScore(plan: CoordinationPlan): number {
  let score = 1;
  score -= Math.min(0.4, plan.warnings.length * 0.08);
  score -= Math.min(0.2, plan.handoffs.filter(h => h.status === 'pending').length * 0.05);
  const barriers = plan.workstreams.filter(w => w.phase === 'waiting_barrier').length;
  score -= Math.min(0.15, barriers * 0.07);
  return Math.max(0, Math.round(score * 100) / 100);
}

export function actorHoldsLease(plan: CoordinationPlan, actorId: string, regionId: string): boolean {
  return plan.leases.some(
    l => l.kind === 'region_exclusive' && l.holderActorId === actorId && l.regionId === regionId,
  );
}

export function serializeCoordinationPlan(plan: CoordinationPlan): string {
  return JSON.stringify({
    leases: plan.leases.map(l => [l.id, l.holderActorId, l.regionId]),
    mutex: plan.mutexRegions,
    handoffs: plan.handoffs.map(h => [h.id, h.status]),
    ws: plan.workstreams.map(w => [w.id, w.phase]),
    arb: plan.arbitrationLog.map(a => [a.regionId, a.winnerActorId]),
  });
}


// --- source: directive-coordination.ts ---
  CoordinationPlan,
  RoleAssignment,
  TeammateDirectiveProposal,
  DirectiveCoordinationResult,
} from './types.ts';

function directiveKey(p: TeammateDirectiveProposal): string {
  return [p.actorId, p.goalKind, p.targetRegionId || '_', p.taskId || '_'].join('|');
}

function isRegionDepositGoal(kind: string): boolean {
  return /deposit|defend|take|region/i.test(kind);
}

/** Stable dedupe before mutex filtering (same actor/goal/target/task). */
export function dedupeDirectiveProposals(proposals: TeammateDirectiveProposal[]): TeammateDirectiveProposal[] {
  const seen = new Set<string>();
  const out: TeammateDirectiveProposal[] = [];
  proposals
    .slice()
    .sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id))
    .forEach(p => {
      const k = directiveKey(p);
      if (seen.has(k)) return;
      seen.add(k);
      out.push(p);
    });
  return out;
}

export function buildActorDirectiveConstraints(
  plan: CoordinationPlan,
  roles: RoleAssignment[],
): Record<string, string> {
  const constraints: Record<string, string> = {};
  Object.entries(plan.mutexRegions).forEach(([regionId, holderId]) => {
    constraints[holderId] = `Lead region coordination for ${regionId}`;
  });
  roles.forEach(r => {
    if (r.primaryRole === 'support') {
      constraints[r.actorId] = constraints[r.actorId] || `Support role: ${r.responsibility}`;
    }
    if (r.primaryRole === 'recovery') {
      constraints[r.actorId] = 'Recovery first — no expansion directives';
    }
  });
  plan.handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      constraints[h.toActorId] = `Pending handoff for ${h.regionId || 'task'} from ${h.fromActorId}`;
    });
  return constraints;
}

/**
 * Filter Strategic Command directive proposals so teammates never receive conflicting
 * region deposit goals (mutex + duplicate suppression).
 */
export function coordinateTeammateDirectives(
  proposals: TeammateDirectiveProposal[],
  plan: CoordinationPlan,
  roles: RoleAssignment[],
): DirectiveCoordinationResult {
  const constraintsByActor = buildActorDirectiveConstraints(plan, roles);
  const allowed: TeammateDirectiveProposal[] = [];
  const suppressed: DirectiveCoordinationResult['suppressed'] = [];
  const seen = new Set<string>();

  dedupeDirectiveProposals(proposals).forEach(p => {
    const key = directiveKey(p);
    if (seen.has(key)) {
      suppressed.push({ proposal: p, reason: 'duplicate_directive_proposal' });
      return;
    }
    seen.add(key);

    const role = roles.find(r => r.actorId === p.actorId);
    if (role?.primaryRole === 'recovery' && /take|expand|expansion/i.test(p.goalKind)) {
      suppressed.push({ proposal: p, reason: 'recovery_blocks_expansion_directive' });
      return;
    }

    if (p.targetRegionId && isRegionDepositGoal(p.goalKind)) {
      const holder = plan.mutexRegions[p.targetRegionId];
      if (holder && holder !== p.actorId) {
        suppressed.push({
          proposal: p,
          reason: `mutex_holder_${holder}_for_${p.targetRegionId}`,
        });
        return;
      }
    }

    if (role?.primaryRole === 'support' && p.targetRegionId && !role.responsibility.includes(p.targetRegionId)) {
      suppressed.push({ proposal: p, reason: 'support_out_of_scope_region' });
      return;
    }

    allowed.push(p);
  });

  return { allowed, suppressed, constraintsByActor };
}

export interface DirectiveStressStep {
  turn: number;
  allowedCount: number;
  suppressedCount: number;
}

/** Deterministic multi-turn directive stress (coordination stability). */
export function stressDirectiveCoordination(
  baseProposals: TeammateDirectiveProposal[],
  evaluatePlan: (turn: number) => CoordinationPlan,
  roles: RoleAssignment[],
  turns: number,
): DirectiveStressStep[] {
  const steps: DirectiveStressStep[] = [];
  for (let t = 0; t < turns; t += 1) {
    const plan = evaluatePlan(t);
    const proposals = baseProposals.map(p => ({ ...p, id: `${p.id}_t${t}` }));
    const r = coordinateTeammateDirectives(proposals, plan, roles);
    steps.push({ turn: t, allowedCount: r.allowed.length, suppressedCount: r.suppressed.length });
  }
  return steps;
}


// --- source: team-boundary-guard.ts ---

/** Actor ids allowed for this team's coordination slice (defaults to input actors). */
export function teamActorScope(inputs: TeamMultiAgentInputs, explicitIds?: string[]): Set<string> {
  if (explicitIds?.length) return new Set(explicitIds.map(String));
  return new Set(inputs.actors.map(a => a.id));
}

export function filterCrossTeamDirectives(
  proposals: TeammateDirectiveProposal[],
  scope: Set<string>,
): { inTeam: TeammateDirectiveProposal[]; rejected: Array<{ proposal: TeammateDirectiveProposal; reason: string }> } {
  const inTeam: TeammateDirectiveProposal[] = [];
  const rejected: Array<{ proposal: TeammateDirectiveProposal; reason: string }> = [];
  proposals.forEach(p => {
    if (scope.has(p.actorId)) inTeam.push(p);
    else rejected.push({ proposal: p, reason: `cross_team_actor_${p.actorId}` });
  });
  return { inTeam, rejected };
}

export function assertTasksTeamScoped(
  inputs: TeamMultiAgentInputs,
  scope: Set<string>,
): string[] {
  const issues: string[] = [];
  inputs.tasks.forEach(t => {
    t.assignedActorIds.forEach(id => {
      if (!scope.has(id)) {
        issues.push(`Task ${t.id} assigns out-of-team actor ${id}`);
      }
    });
  });
  return issues;
}

export function regionsMutexDisjoint(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  return !Object.keys(a).some(regionId => b[regionId] !== undefined);
}

/** Enemy/friendly plans must not share mutex keys with different holders (isolation). */
export function auditCrossTeamMutexIsolation(
  friendlyMutex: Record<string, string>,
  enemyMutex: Record<string, string>,
): string[] {
  if (regionsMutexDisjoint(friendlyMutex, enemyMutex)) return [];
  const overlaps = Object.keys(friendlyMutex).filter(r => enemyMutex[r] !== undefined);
  return overlaps.map(
    r =>
      `Cross-team mutex overlap on ${r} (friendly ${friendlyMutex[r]}, enemy ${enemyMutex[r]}) — expected disjoint team planning namespaces`,
  );
}


// --- source: layer-persistence.ts ---

export function teamMultiAgentPersistSignature(state: TeamMultiAgentLayerState): string {
  return (
    serializeCoordinationPlan(state.coordination) +
    '::' +
    state.roles.map(r => [r.actorId, r.primaryRole, r.exclusiveSlotId].join(':')).join(',') +
    '::' +
    JSON.stringify(state.meta.auditSummary)
  );
}

/**
 * Loop-safe persistence gate (mirrors Team OS commit throttling).
 * Identical signatures skip; cap automatic commits per turn.
 */
export function decideTeamMultiAgentPersistence(
  stored: TeamMultiAgentLayerState | null | undefined,
  evaluated: TeamMultiAgentLayerState,
  lastCommittedSignature: string | null,
  commitsThisTurn: number,
  maxCommitsPerTurn: number = AGENT18_LIMITS.maxCommitsPerTurn,
): TeamMultiAgentPersistenceDecision {
  const signature = teamMultiAgentPersistSignature(evaluated);
  if (!stored) {
    return { commit: true, reason: 'initial state', signature };
  }
  const prevSig = teamMultiAgentPersistSignature(stored);
  if (signature === prevSig) {
    return { commit: false, reason: 'signature unchanged', signature };
  }
  if (lastCommittedSignature === signature) {
    return { commit: false, reason: 'already committed this signature', signature };
  }
  if (commitsThisTurn >= maxCommitsPerTurn) {
    return { commit: false, reason: `commit cap (${maxCommitsPerTurn}/turn)`, signature };
  }
  return { commit: true, reason: 'material change', signature };
}

export interface PersistTracker {
  turn: number;
  commits: number;
  lastSignature: string | null;
}

export function bumpPersistTracker(
  tracker: PersistTracker,
  turn: number,
  signature: string | null,
  committed: boolean,
): PersistTracker {
  if (tracker.turn !== turn) {
    return { turn, commits: committed ? 1 : 0, lastSignature: committed ? signature : tracker.lastSignature };
  }
  return {
    turn,
    commits: committed ? tracker.commits + 1 : tracker.commits,
    lastSignature: committed && signature ? signature : tracker.lastSignature,
  };
}


// --- source: handoff-sla-monitor.ts ---

export interface HandoffSlaPolicy {
  maxPendingTurns: number;
}

export interface HandoffSlaReport {
  pendingCount: number;
  overdueHandoffIds: string[];
  complianceScore: number;
  notes: string[];
}

const DEFAULT_HANDOFF_SLA: HandoffSlaPolicy = {
  maxPendingTurns: 2,
};

/**
 * Score pending handoffs against a turn budget; overdue ids can drive audit/diagnostics.
 */
export function evaluateHandoffSla(
  turn: number,
  handoffs: HandoffRequest[],
  policy: Partial<HandoffSlaPolicy> = {},
): HandoffSlaReport {
  const maxPending = policy.maxPendingTurns ?? DEFAULT_HANDOFF_SLA.maxPendingTurns;
  const pending = handoffs.filter(h => h.status === 'pending').slice(0, AGENT18_LIMITS.maxHandoffs);
  const overdueHandoffIds: string[] = [];
  const notes: string[] = [];

  pending.forEach(h => {
    const age = turn - h.requestedTurn;
    if (age > maxPending) {
      overdueHandoffIds.push(h.id);
      notes.push(`Handoff ${h.id} overdue (${age} turns pending, max ${maxPending})`);
    }
  });

  const complianceScore =
    pending.length === 0
      ? 100
      : Math.max(0, Math.round(100 * (1 - overdueHandoffIds.length / pending.length)));

  return {
    pendingCount: pending.length,
    overdueHandoffIds,
    complianceScore,
    notes,
  };
}

export function handoffSlaAuditMessages(report: HandoffSlaReport): string[] {
  return report.overdueHandoffIds.map(id => `Handoff SLA breach: ${id} exceeded pending turn budget`);
}

export function summarizeDualTeamHandoffSla(
  friendlyTeamId: string,
  friendly: HandoffSlaReport,
  enemyTeamId: string | null,
  enemy: HandoffSlaReport | null,
): { combinedCompliance: number; teamReports: Record<string, HandoffSlaReport> } {
  if (!enemy || !enemyTeamId) {
    return {
      combinedCompliance: friendly.complianceScore,
      teamReports: { [friendlyTeamId]: friendly },
    };
  }
  const combinedCompliance = Math.round((friendly.complianceScore + enemy.complianceScore) / 2);
  return {
    combinedCompliance,
    teamReports: { [friendlyTeamId]: friendly, [enemyTeamId]: enemy },
  };
}

export function handoffsFromPlan(plan: CoordinationPlan): HandoffRequest[] {
  return plan.handoffs;
}


// --- source: actor-capacity-ledger.ts ---

export interface ActorCapacityRow {
  actorId: string;
  apRemaining: number | null;
  readyTaskCount: number;
  activeTaskCount: number;
  loadScore: number;
  status: 'balanced' | 'overloaded' | 'idle';
}

export interface CapacityLedgerSnapshot {
  rows: ActorCapacityRow[];
  balanceScore: number;
  overloadedActorIds: string[];
  idleActorIds: string[];
  notes: string[];
}

const ACTIVE_STATUSES = new Set(['ready', 'active', 'blocked']);

function taskLoadForActor(actorId: string, tasks: TeamTaskSnapshot[]): { ready: number; active: number } {
  let ready = 0;
  let active = 0;
  tasks.forEach(t => {
    if (!t.assignedActorIds.includes(actorId)) return;
    if (t.status === 'ready') ready += 1;
    if (t.status === 'active') active += 1;
  });
  return { ready, active };
}

function roleWeight(role: RoleAssignment | undefined): number {
  if (!role) return 1;
  if (role.primaryRole === 'recovery') return 0.5;
  if (role.primaryRole === 'support') return 0.75;
  return 1;
}

/**
 * Read-only capacity view: compares AP budget vs assigned work for rebalance hints.
 */
export function buildActorCapacityLedger(
  actors: TeamActorSnapshot[],
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): CapacityLedgerSnapshot {
  const rows: ActorCapacityRow[] = [];
  const overloadedActorIds: string[] = [];
  const idleActorIds: string[] = [];
  const notes: string[] = [];

  actors.forEach(actor => {
    const role = roles.find(r => r.actorId === actor.id);
    const { ready, active } = taskLoadForActor(actor.id, tasks);
    const weight = roleWeight(role);
    const ap = actor.apRemaining;
    const demand = (ready + active * 1.25) * weight;
    const supply = ap === null ? Math.max(1, demand) : Math.max(0, ap);
    const loadScore = supply <= 0 ? demand : demand / supply;

    let status: ActorCapacityRow['status'] = 'balanced';
    if (actor.inRecovery) {
      status = ready + active > 1 ? 'overloaded' : 'balanced';
    } else if (ap !== null && ap === 0 && ready > 0) {
      status = 'overloaded';
    } else if (loadScore > 1.35) {
      status = 'overloaded';
    } else if (ap !== null && ap >= 3 && ready === 0 && active === 0) {
      status = 'idle';
    }

    if (status === 'overloaded') {
      overloadedActorIds.push(actor.id);
      notes.push(`Actor ${actor.id} overloaded (load ${loadScore.toFixed(2)})`);
    }
    if (status === 'idle') {
      idleActorIds.push(actor.id);
      notes.push(`Actor ${actor.id} idle with ${ap} AP remaining`);
    }

    rows.push({
      actorId: actor.id,
      apRemaining: ap,
      readyTaskCount: ready,
      activeTaskCount: active,
      loadScore: Math.round(loadScore * 100) / 100,
      status,
    });
  });

  const balanceScore =
    rows.length === 0
      ? 100
      : Math.round(
          (rows.filter(r => r.status === 'balanced').length / rows.length) * 100,
        );

  return {
    rows,
    balanceScore,
    overloadedActorIds,
    idleActorIds,
    notes: notes.slice(0, 8),
  };
}

export function suggestCapacityRebalanceNotes(ledger: CapacityLedgerSnapshot): string[] {
  if (ledger.overloadedActorIds.length === 0 || ledger.idleActorIds.length === 0) {
    return [];
  }
  return [
    `Rebalance hint: shift work from ${ledger.overloadedActorIds.join(', ')} to ${ledger.idleActorIds.join(', ')}`,
  ];
}


// --- source: directive-quota-guard.ts ---

export interface DirectiveQuotaPolicy {
  maxPerActorPerTurn: number;
  maxPerTeamPerTurn: number;
}

export interface DirectiveQuotaReport {
  allowed: TeammateDirectiveProposal[];
  dropped: Array<{ proposal: TeammateDirectiveProposal; reason: string }>;
  remainingByActor: Record<string, number>;
}

const DEFAULT_QUOTA: DirectiveQuotaPolicy = {
  maxPerActorPerTurn: 3,
  maxPerTeamPerTurn: 8,
};

/**
 * Enforce per-actor and team-wide directive proposal caps before coordination filtering.
 */
export function applyDirectiveQuotaGuard(
  proposals: TeammateDirectiveProposal[],
  policy: Partial<DirectiveQuotaPolicy> = {},
): DirectiveQuotaReport {
  const maxActor = policy.maxPerActorPerTurn ?? DEFAULT_QUOTA.maxPerActorPerTurn;
  const maxTeam = policy.maxPerTeamPerTurn ?? DEFAULT_QUOTA.maxPerTeamPerTurn;
  const sorted = [...proposals].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const allowed: TeammateDirectiveProposal[] = [];
  const dropped: DirectiveQuotaReport['dropped'] = [];
  const perActor: Record<string, number> = {};
  const remainingByActor: Record<string, number> = {};

  sorted.forEach(p => {
    perActor[p.actorId] = perActor[p.actorId] ?? 0;
    if (allowed.length >= maxTeam) {
      dropped.push({ proposal: p, reason: 'team_quota_exceeded' });
      return;
    }
    if (perActor[p.actorId] >= maxActor) {
      dropped.push({ proposal: p, reason: 'actor_quota_exceeded' });
      return;
    }
    allowed.push(p);
    perActor[p.actorId] += 1;
  });

  Object.keys(perActor).forEach(actorId => {
    remainingByActor[actorId] = Math.max(0, maxActor - perActor[actorId]);
  });

  return {
    allowed: allowed.slice(0, AGENT18_LIMITS.maxSuppressedDirectives),
    dropped: dropped.slice(0, AGENT18_LIMITS.maxSuppressedDirectives),
    remainingByActor,
  };
}

export function mergeQuotaDroppedIntoSuppressed(
  quota: DirectiveQuotaReport,
): string[] {
  return quota.dropped.map(d => d.proposal.id);
}


// --- source: handoff-readiness-scorer.ts ---
  HandoffRequest,
  RoleAssignment,
  TeamActorSnapshot,
  TeamTaskSnapshot,
} from './types.ts';

export interface HandoffReadinessRow {
  handoffId: string;
  toActorId: string;
  readinessScore: number;
  blockers: string[];
  ready: boolean;
}

export interface HandoffReadinessReport {
  rows: HandoffReadinessRow[];
  averageReadiness: number;
  notReadyHandoffIds: string[];
  notes: string[];
}

/**
 * Score whether pending handoff targets can accept responsibility this turn.
 */
export function scoreHandoffReadiness(
  handoffs: HandoffRequest[],
  actors: TeamActorSnapshot[],
  roles: RoleAssignment[],
  tasks: TeamTaskSnapshot[],
): HandoffReadinessReport {
  const pending = handoffs.filter(h => h.status === 'pending');
  const rows: HandoffReadinessRow[] = [];
  const notReadyHandoffIds: string[] = [];
  const notes: string[] = [];

  pending.forEach(h => {
    const actor = actors.find(a => a.id === h.toActorId);
    const role = roles.find(r => r.actorId === h.toActorId);
    const task = tasks.find(t => t.id === h.taskId);
    const blockers: string[] = [];
    let score = 100;

    if (!actor) {
      blockers.push('missing_target_actor');
      score = 0;
    } else {
      if (actor.inRecovery) {
        blockers.push('target_in_recovery');
        score -= 45;
      }
      if (actor.apRemaining !== null && actor.apRemaining <= 0) {
        blockers.push('target_no_ap');
        score -= 35;
      }
    }

    if (role?.primaryRole === 'recovery') {
      blockers.push('target_recovery_role');
      score -= 25;
    }

    if (task && task.status !== 'blocked') {
      blockers.push('task_not_blocked');
      score -= 20;
    }

    const ready = score >= 60 && blockers.length === 0;
    if (!ready) {
      notReadyHandoffIds.push(h.id);
      notes.push(`Handoff ${h.id} target ${h.toActorId} not ready (${blockers.join(', ') || 'low score'})`);
    }

    rows.push({
      handoffId: h.id,
      toActorId: h.toActorId,
      readinessScore: Math.max(0, Math.min(100, score)),
      blockers,
      ready,
    });
  });

  const averageReadiness =
    rows.length === 0
      ? 100
      : Math.round(rows.reduce((sum, r) => sum + r.readinessScore, 0) / rows.length);

  return {
    rows,
    averageReadiness,
    notReadyHandoffIds,
    notes: notes.slice(0, 8),
  };
}

export function filterHandoffsByReadiness(
  handoffs: HandoffRequest[],
  report: HandoffReadinessReport,
  minScore = 60,
): { eligible: HandoffRequest[]; deferredIds: string[] } {
  const eligible: HandoffRequest[] = [];
  const deferredIds: string[] = [];
  handoffs.forEach(h => {
    if (h.status !== 'pending') {
      eligible.push(h);
      return;
    }
    const row = report.rows.find(r => r.handoffId === h.id);
    if (row && row.readinessScore >= minScore && row.ready) {
      eligible.push(h);
    } else {
      deferredIds.push(h.id);
    }
  });
  return { eligible, deferredIds };
}


// --- source: mutex-stability-index.ts ---

export interface MutexStabilityReport {
  stabilityIndex: number;
  volatileRegionIds: string[];
  stableRegionCount: number;
  trackedTurns: number;
  notes: string[];
}

/**
 * Complement thrashing detection: score how stable region mutex holders have been.
 */
export function computeMutexStabilityIndex(
  mutexHistory: Array<Record<string, string>>,
  thrashingRegions: string[] = [],
): MutexStabilityReport {
  const history = mutexHistory.slice(-AGENT18_LIMITS.maxMutexHistorySnapshots);
  if (history.length < 2) {
    return {
      stabilityIndex: 100,
      volatileRegionIds: [],
      stableRegionCount: 0,
      trackedTurns: history.length,
      notes: history.length === 0 ? ['No mutex history yet'] : [],
    };
  }

  const regions = new Set<string>();
  history.forEach(snap => Object.keys(snap).forEach(r => regions.add(r)));

  const volatileRegionIds: string[] = [];
  const notes: string[] = [];
  let stableRegionCount = 0;

  regions.forEach(regionId => {
    if (thrashingRegions.includes(regionId)) {
      volatileRegionIds.push(regionId);
      return;
    }
    const holders = history.map(s => s[regionId]).filter(Boolean);
    if (holders.length < 2) {
      stableRegionCount += 1;
      return;
    }
    const flips = holders.slice(1).filter((h, i) => h !== holders[i]).length;
    const flipRate = flips / (holders.length - 1);
    if (flipRate >= 0.5) {
      volatileRegionIds.push(regionId);
      notes.push(`Region ${regionId} volatile (flip rate ${Math.round(flipRate * 100)}%)`);
    } else {
      stableRegionCount += 1;
    }
  });

  const volatilePenalty = volatileRegionIds.length * 18;
  const stabilityIndex = Math.max(0, Math.min(100, 100 - volatilePenalty));

  return {
    stabilityIndex,
    volatileRegionIds: volatileRegionIds.slice(0, 8),
    stableRegionCount,
    trackedTurns: history.length,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamMutexStability(
  friendly: MutexStabilityReport,
  enemy: MutexStabilityReport | null,
): number {
  if (!enemy) return friendly.stabilityIndex;
  return Math.round((friendly.stabilityIndex + enemy.stabilityIndex) / 2);
}


// --- source: workstream-barrier-monitor.ts ---

export interface WorkstreamBarrierReport {
  stalledWorkstreamIds: string[];
  waitingBarrierCount: number;
  barrierComplianceScore: number;
  notes: string[];
}

/**
 * Detect parallel workstreams stuck on barrier tasks beyond a turn budget.
 */
export function evaluateWorkstreamBarriers(
  turn: number,
  workstreams: ParallelWorkstream[],
  tasks: TeamTaskSnapshot[],
  options: { maxBarrierWaitTurns?: number; workstreamSinceTurn?: Record<string, number> } = {},
): WorkstreamBarrierReport {
  const maxWait = options.maxBarrierWaitTurns ?? AGENT18_LIMITS.workstreamBarrierMaxWaitTurns;
  const sinceById = options.workstreamSinceTurn ?? {};
  const stalledWorkstreamIds: string[] = [];
  const notes: string[] = [];

  const waiting = workstreams.filter(ws => ws.phase === 'waiting_barrier');
  waiting.forEach(ws => {
    const barrierTasks = ws.barrierTaskIds
      .map(id => tasks.find(t => t.id === id))
      .filter((t): t is TeamTaskSnapshot => Boolean(t));
    const allWaiting = barrierTasks.length > 0 && barrierTasks.every(t => t.status === 'waiting');
    if (!allWaiting) return;

    const since = sinceById[ws.id] ?? turn;
    const age = turn - since;
    if (age > maxWait) {
      stalledWorkstreamIds.push(ws.id);
      notes.push(`Workstream ${ws.id} stalled on barrier (${age} turns, max ${maxWait})`);
    }
  });

  const barrierComplianceScore =
    waiting.length === 0
      ? 100
      : Math.max(
          0,
          Math.round(100 * (1 - stalledWorkstreamIds.length / Math.max(1, waiting.length))),
        );

  return {
    stalledWorkstreamIds,
    waitingBarrierCount: waiting.length,
    barrierComplianceScore,
    notes: notes.slice(0, 6),
  };
}

export function trackWorkstreamBarrierSince(
  previous: Record<string, number>,
  workstreams: ParallelWorkstream[],
  turn: number,
): Record<string, number> {
  const next: Record<string, number> = { ...previous };
  workstreams.forEach(ws => {
    if (ws.phase === 'waiting_barrier') {
      if (next[ws.id] === undefined) next[ws.id] = turn;
    } else {
      delete next[ws.id];
    }
  });
  return next;
}


// --- source: role-churn-index.ts ---

export interface RoleChurnReport {
  churnIndex: number;
  churnedActorIds: string[];
  stableActorCount: number;
  notes: string[];
}

/**
 * Measure how many actors changed primary role since the previous evaluation.
 */
export function computeRoleChurnIndex(
  previousRoles: RoleAssignment[] | null | undefined,
  currentRoles: RoleAssignment[],
): RoleChurnReport {
  if (!previousRoles || previousRoles.length === 0) {
    return {
      churnIndex: 0,
      churnedActorIds: [],
      stableActorCount: currentRoles.length,
      notes: [],
    };
  }

  const prevByActor = new Map(previousRoles.map(r => [r.actorId, r]));
  const churnedActorIds: string[] = [];
  const notes: string[] = [];

  currentRoles.forEach(role => {
    const prev = prevByActor.get(role.actorId);
    if (!prev) return;
    if (prev.primaryRole !== role.primaryRole) {
      churnedActorIds.push(role.actorId);
      notes.push(
        `Actor ${role.actorId} role churn ${prev.primaryRole} → ${role.primaryRole}`,
      );
    }
  });

  const compared = currentRoles.filter(r => prevByActor.has(r.actorId)).length;
  const stableActorCount = Math.max(0, compared - churnedActorIds.length);
  const churnRate = compared === 0 ? 0 : churnedActorIds.length / compared;
  const churnIndex = Math.round(Math.min(100, churnRate * 100));

  return {
    churnIndex,
    churnedActorIds: churnedActorIds.slice(0, 8),
    stableActorCount,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRoleChurn(
  friendly: RoleChurnReport,
  enemy: RoleChurnReport | null,
): number {
  if (!enemy) return friendly.churnIndex;
  return Math.round((friendly.churnIndex + enemy.churnIndex) / 2);
}


// --- source: lease-expiry-watchdog.ts ---

export interface LeaseExpiryReport {
  leaseHealthScore: number;
  expiringLeaseIds: string[];
  expiredLeaseIds: string[];
  notes: string[];
}

export interface LeaseExpiryPolicy {
  warnTurnsBeforeExpiry: number;
}

const DEFAULT_POLICY: LeaseExpiryPolicy = {
  warnTurnsBeforeExpiry: 1,
};

/**
 * Score lease portfolio health: expired leases and those expiring within a turn window.
 */
export function evaluateLeaseExpiry(
  turn: number,
  leases: CoordinationLease[],
  policy: Partial<LeaseExpiryPolicy> = {},
): LeaseExpiryReport {
  const warnWindow = policy.warnTurnsBeforeExpiry ?? DEFAULT_POLICY.warnTurnsBeforeExpiry;
  const scoped = leases.slice(0, AGENT18_LIMITS.maxLeases);
  const expiringLeaseIds: string[] = [];
  const expiredLeaseIds: string[] = [];
  const notes: string[] = [];

  scoped.forEach(lease => {
    if (lease.expiresTurn === null) return;
    if (lease.expiresTurn < turn) {
      expiredLeaseIds.push(lease.id);
      notes.push(`Lease ${lease.id} expired at turn ${lease.expiresTurn}`);
      return;
    }
    const remaining = lease.expiresTurn - turn;
    if (remaining <= warnWindow) {
      expiringLeaseIds.push(lease.id);
      notes.push(`Lease ${lease.id} expires in ${remaining} turn(s)`);
    }
  });

  const problemCount = expiredLeaseIds.length + expiringLeaseIds.length;
  const leaseHealthScore =
    scoped.length === 0
      ? 100
      : Math.max(0, Math.round(100 * (1 - problemCount / Math.max(1, scoped.length))));

  return {
    leaseHealthScore,
    expiringLeaseIds: expiringLeaseIds.slice(0, 8),
    expiredLeaseIds: expiredLeaseIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamLeaseHealth(
  friendly: LeaseExpiryReport,
  enemy: LeaseExpiryReport | null,
): number {
  if (!enemy) return friendly.leaseHealthScore;
  return Math.round((friendly.leaseHealthScore + enemy.leaseHealthScore) / 2);
}


// --- source: coordination-composite-score.ts ---
export interface CoordinationCompositeInputs {
  handoffSlaCompliance: number;
  handoffReadinessAverage: number;
  mutexStabilityIndex: number;
  workstreamBarrierCompliance: number;
  capacityBalanceScore?: number;
  leaseHealthScore?: number;
  roleChurnIndex?: number;
}

export interface CoordinationCompositeReport {
  compositeScore: number;
  weakestDimension: string;
  notes: string[];
}

const WEIGHTS = {
  handoffSla: 0.18,
  handoffReadiness: 0.16,
  mutexStability: 0.2,
  workstreamBarrier: 0.16,
  capacityBalance: 0.12,
  leaseHealth: 0.1,
  roleChurn: 0.08,
} as const;

function clampScore(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(100, value));
}

/**
 * Weighted rollup of round-4/5/6 coordination metrics for dashboards and dual-team summaries.
 */
export function computeCoordinationComposite(
  inputs: CoordinationCompositeInputs,
): CoordinationCompositeReport {
  const sla = clampScore(inputs.handoffSlaCompliance, 100);
  const readiness = clampScore(inputs.handoffReadinessAverage, 100);
  const mutex = clampScore(inputs.mutexStabilityIndex, 100);
  const barrier = clampScore(inputs.workstreamBarrierCompliance, 100);
  const capacity = clampScore(inputs.capacityBalanceScore, 100);
  const lease = clampScore(inputs.leaseHealthScore, 100);
  const churnPenalty = clampScore(inputs.roleChurnIndex, 0);
  const roleStability = 100 - churnPenalty;

  const dimensions: Array<{ key: string; score: number; weight: number }> = [
    { key: 'handoff_sla', score: sla, weight: WEIGHTS.handoffSla },
    { key: 'handoff_readiness', score: readiness, weight: WEIGHTS.handoffReadiness },
    { key: 'mutex_stability', score: mutex, weight: WEIGHTS.mutexStability },
    { key: 'workstream_barrier', score: barrier, weight: WEIGHTS.workstreamBarrier },
    { key: 'capacity_balance', score: capacity, weight: WEIGHTS.capacityBalance },
    { key: 'lease_health', score: lease, weight: WEIGHTS.leaseHealth },
    { key: 'role_stability', score: roleStability, weight: WEIGHTS.roleChurn },
  ];

  const compositeScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0),
  );

  const weakest = dimensions.reduce((min, d) => (d.score < min.score ? d : min), dimensions[0]);
  const notes: string[] = [];
  if (weakest.score < 60) {
    notes.push(`Weakest coordination dimension: ${weakest.key} (${weakest.score})`);
  }
  if (compositeScore < 70) {
    notes.push(`Coordination composite below target (${compositeScore}/100)`);
  }

  return {
    compositeScore,
    weakestDimension: weakest.key,
    notes: notes.slice(0, 4),
  };
}

export function combineDualTeamCoordinationComposite(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.round((friendly + enemy) / 2);
}


// --- source: directive-collision-index.ts ---

export interface DirectiveCollisionReport {
  collisionIndex: number;
  collidingProposalIds: string[];
  notes: string[];
}

function targetsSameResource(a: TeammateDirectiveProposal, b: TeammateDirectiveProposal): boolean {
  if (a.actorId === b.actorId) return false;
  if (a.taskId && b.taskId && a.taskId === b.taskId) return true;
  if (a.targetRegionId && b.targetRegionId && a.targetRegionId === b.targetRegionId) {
    return /deposit|defend|take|region/i.test(a.goalKind) && /deposit|defend|take|region/i.test(b.goalKind);
  }
  return false;
}

/**
 * Cross-actor directive overlap on the same region or task (after in-team scoping).
 */
export function computeDirectiveCollisionIndex(
  proposals: TeammateDirectiveProposal[],
): DirectiveCollisionReport {
  const notes: string[] = [];
  const collidingIds = new Set<string>();
  let pairCount = 0;

  for (let i = 0; i < proposals.length; i++) {
    for (let j = i + 1; j < proposals.length; j++) {
      const a = proposals[i];
      const b = proposals[j];
      if (!targetsSameResource(a, b)) continue;
      pairCount += 1;
      collidingIds.add(a.id);
      collidingIds.add(b.id);
      notes.push(
        `Directive collision ${a.actorId} vs ${b.actorId} on ${a.taskId || a.targetRegionId || 'resource'}`,
      );
    }
  }

  const maxPairs = Math.max(1, (proposals.length * (proposals.length - 1)) / 2);
  const collisionIndex = proposals.length < 2 ? 0 : Math.round(Math.min(100, (pairCount / maxPairs) * 100));

  return {
    collisionIndex,
    collidingProposalIds: [...collidingIds].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamDirectiveCollision(
  friendly: DirectiveCollisionReport,
  enemy: DirectiveCollisionReport | null,
): number {
  if (!enemy) return friendly.collisionIndex;
  return Math.max(friendly.collisionIndex, enemy.collisionIndex);
}


// --- source: handoff-chain-integrity.ts ---

export interface HandoffChainIntegrityReport {
  integrityScore: number;
  brokenHandoffIds: string[];
  duplicatePendingTaskIds: string[];
  notes: string[];
}

function actorKnown(actorId: string, known: Set<string>): boolean {
  return known.has(actorId);
}

/**
 * Validate pending handoff chains: actor membership, self-handoffs, duplicate pending targets.
 */
export function evaluateHandoffChainIntegrity(
  handoffs: HandoffRequest[],
  teamActorIds: Iterable<string>,
): HandoffChainIntegrityReport {
  const known = new Set(teamActorIds);
  const notes: string[] = [];
  const brokenHandoffIds: string[] = [];
  const pendingByTask = new Map<string, HandoffRequest[]>();

  handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      const list = pendingByTask.get(h.taskId) || [];
      list.push(h);
      pendingByTask.set(h.taskId, list);

      if (h.fromActorId === h.toActorId) {
        brokenHandoffIds.push(h.id);
        notes.push(`Handoff ${h.id} is a self-handoff`);
      }
      if (!actorKnown(h.fromActorId, known) || !actorKnown(h.toActorId, known)) {
        brokenHandoffIds.push(h.id);
        notes.push(`Handoff ${h.id} references unknown actor`);
      }
    });

  const duplicatePendingTaskIds: string[] = [];
  pendingByTask.forEach((list, taskId) => {
    if (list.length > 1) {
      duplicatePendingTaskIds.push(taskId);
      list.forEach(h => {
        if (!brokenHandoffIds.includes(h.id)) brokenHandoffIds.push(h.id);
      });
      notes.push(`Multiple pending handoffs for task ${taskId}`);
    }
  });

  const pendingCount = handoffs.filter(h => h.status === 'pending').length;
  const defectCount = new Set(brokenHandoffIds).size;
  const integrityScore =
    pendingCount === 0 ? 100 : Math.round(Math.max(0, 100 - (defectCount / pendingCount) * 100));

  return {
    integrityScore,
    brokenHandoffIds: [...new Set(brokenHandoffIds)].slice(0, 8),
    duplicatePendingTaskIds: duplicatePendingTaskIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamHandoffIntegrity(
  friendly: HandoffChainIntegrityReport,
  enemy: HandoffChainIntegrityReport | null,
): number {
  if (!enemy) return friendly.integrityScore;
  return Math.round((friendly.integrityScore + enemy.integrityScore) / 2);
}


// --- source: coordination-escalation-tier.ts ---
export interface CoordinationEscalationInputs {
  coordinationCompositeScore: number;
  auditErrors: number;
  auditWarnings: number;
  directiveCollisionIndex?: number;
  handoffIntegrityScore?: number;
}

export interface CoordinationEscalationReport {
  tier: 0 | 1 | 2 | 3;
  label: string;
  notes: string[];
}

const TIER_LABELS: Record<CoordinationEscalationReport['tier'], string> = {
  0: 'nominal',
  1: 'watch',
  2: 'elevated',
  3: 'critical',
};

/**
 * Operator escalation ladder from composite health, audit pressure, and round-7 integrity signals.
 */
export function computeCoordinationEscalationTier(
  inputs: CoordinationEscalationInputs,
): CoordinationEscalationReport {
  const composite = inputs.coordinationCompositeScore;
  const collision = inputs.directiveCollisionIndex ?? 0;
  const integrity = inputs.handoffIntegrityScore ?? 100;
  const notes: string[] = [];

  let tier: CoordinationEscalationReport['tier'] = 0;

  if (inputs.auditErrors > 0 || composite < 45 || integrity < 50) {
    tier = 3;
    notes.push('Critical coordination escalation — errors or severe health collapse');
  } else if (composite < 60 || collision >= 50 || inputs.auditWarnings >= 4) {
    tier = 2;
    notes.push('Elevated coordination escalation');
  } else if (composite < 75 || collision >= 25 || inputs.auditWarnings >= 2) {
    tier = 1;
    notes.push('Watch-tier coordination escalation');
  }

  return {
    tier,
    label: TIER_LABELS[tier],
    notes: notes.slice(0, 4),
  };
}

export function combineDualTeamEscalationTier(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: coordination-recovery-playbook.ts ---
export interface CoordinationRecoveryInputs {
  escalationTier: number;
  coordinationCompositeScore: number;
  coordinationWeakestDimension?: string;
  directiveCollisionIndex?: number;
  handoffIntegrityScore?: number;
}

export interface CoordinationRecoveryPlaybook {
  recoveryUrgency: number;
  recommendedActions: string[];
  notes: string[];
}

const DIMENSION_ACTIONS: Record<string, string[]> = {
  handoffSla: ['flush_overdue_handoffs', 'reassign_handoff_targets'],
  handoffReadiness: ['defer_not_ready_handoffs', 'boost_target_ap'],
  mutexStability: ['freeze_mutex_reassign', 'extend_region_leases'],
  workstreamBarriers: ['split_stalled_workstreams', 'drop_barrier_dependencies'],
  capacityBalance: ['rebalance_task_load', 'idle_actor_pickup'],
  leaseHealth: ['renew_expiring_leases', 'revoke_expired_leases'],
  roleChurn: ['extend_role_locks', 'stabilize_primary_assignments'],
};

/**
 * Operator recovery playbook from escalation tier and weakest composite dimension.
 */
export function buildCoordinationRecoveryPlaybook(
  inputs: CoordinationRecoveryInputs,
): CoordinationRecoveryPlaybook {
  const notes: string[] = [];
  const actions: string[] = [];
  const tier = Math.max(0, Math.min(3, inputs.escalationTier));
  const collision = inputs.directiveCollisionIndex ?? 0;
  const integrity = inputs.handoffIntegrityScore ?? 100;

  if (tier >= 3) {
    actions.push('halt_noncritical_directives', 'operator_review_required');
    notes.push('Critical escalation — halt discretionary teammate directives');
  } else if (tier >= 2) {
    actions.push('reduce_directive_quota', 'serialize_region_mutex');
    notes.push('Elevated escalation — throttle parallel directives');
  } else if (tier >= 1) {
    actions.push('monitor_coordination_dashboard');
    notes.push('Watch-tier escalation — increase observation cadence');
  }

  const weakest = inputs.coordinationWeakestDimension;
  if (weakest && DIMENSION_ACTIONS[weakest]) {
    actions.push(...DIMENSION_ACTIONS[weakest].slice(0, 2));
    notes.push(`Weakest dimension ${weakest} — targeted recovery steps appended`);
  }

  if (collision >= 40) {
    actions.push('dedupe_colliding_directives');
    notes.push('High directive collision — dedupe before commit');
  }
  if (integrity < 70) {
    actions.push('repair_handoff_chain');
    notes.push('Low handoff integrity — repair pending chain');
  }

  const compositeGap = Math.max(0, 100 - inputs.coordinationCompositeScore);
  const tierBoost = tier * 18;
  const signalBoost = Math.round(collision * 0.25 + Math.max(0, 70 - integrity) * 0.5);
  const recoveryUrgency = Math.round(Math.min(100, compositeGap * 0.45 + tierBoost + signalBoost));

  return {
    recoveryUrgency,
    recommendedActions: [...new Set(actions)].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRecoveryUrgency(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: directive-priority-inversion.ts ---

export interface DirectivePriorityInversionReport {
  inversionIndex: number;
  invertedProposalIds: string[];
  notes: string[];
}

function collisionKey(p: TeammateDirectiveProposal): string | null {
  if (p.taskId) return `task:${p.taskId}`;
  if (p.targetRegionId) return `region:${p.targetRegionId}`;
  return null;
}

export interface DirectivePriorityInversionContext {
  allowed: TeammateDirectiveProposal[];
  suppressed: TeammateDirectiveProposal[];
}

/**
 * Detect higher-priority (lower number) directives suppressed while lower-priority peers remain allowed on the same target.
 */
export function computeDirectivePriorityInversion(
  proposals: TeammateDirectiveProposal[],
  collidingProposalIds: string[],
  context: DirectivePriorityInversionContext,
): DirectivePriorityInversionReport {
  const notes: string[] = [];
  const colliding = new Set(collidingProposalIds);
  const byKey = new Map<string, TeammateDirectiveProposal[]>();

  proposals.forEach(p => {
    if (colliding.size > 0 && !colliding.has(p.id)) return;
    const key = collisionKey(p);
    if (!key) return;
    const list = byKey.get(key) || [];
    list.push(p);
    byKey.set(key, list);
  });

  const allowedIds = new Set(context.allowed.map(p => p.id));
  const suppressedIds = new Set(context.suppressed.map(p => p.id));
  const invertedIds = new Set<string>();
  let inversionPairs = 0;
  let pairTotal = 0;

  byKey.forEach(list => {
    const allowedInCluster = list.filter(p => allowedIds.has(p.id));
    const suppressedInCluster = list.filter(p => suppressedIds.has(p.id));
    if (!allowedInCluster.length || !suppressedInCluster.length) return;

    allowedInCluster.forEach(a => {
      suppressedInCluster.forEach(s => {
        pairTotal += 1;
        if (s.priority < a.priority) {
          inversionPairs += 1;
          invertedIds.add(a.id);
          invertedIds.add(s.id);
          notes.push(
            `Priority inversion: suppressed ${s.actorId} priority ${s.priority} loses to allowed ${a.actorId} priority ${a.priority}`,
          );
        }
      });
    });
  });

  const inversionIndex =
    pairTotal === 0 ? 0 : Math.round(Math.min(100, (inversionPairs / pairTotal) * 100));

  return {
    inversionIndex,
    invertedProposalIds: [...invertedIds].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamPriorityInversion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: handoff-orphan-detector.ts ---

export interface HandoffOrphanReport {
  orphanCount: number;
  orphanHandoffIds: string[];
  notes: string[];
}

function taskAssignedToActor(task: TeamTaskSnapshot | undefined, actorId: string): boolean {
  return Boolean(task && task.assignedActorIds.includes(actorId));
}

/**
 * Pending handoffs whose target actor is not assigned to the handoff task (orphaned acceptance).
 */
export function detectHandoffOrphans(
  handoffs: HandoffRequest[],
  tasks: TeamTaskSnapshot[],
  roles: RoleAssignment[],
): HandoffOrphanReport {
  const notes: string[] = [];
  const orphanHandoffIds: string[] = [];
  const roleByActor = new Map(roles.map(r => [r.actorId, r]));

  handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      const task = tasks.find(t => t.id === h.taskId);
      const toRole = roleByActor.get(h.toActorId);
      const assigned = taskAssignedToActor(task, h.toActorId);
      const roleLinked = Boolean(toRole && toRole.taskIds.includes(h.taskId));

      if (!assigned && !roleLinked) {
        orphanHandoffIds.push(h.id);
        notes.push(`Orphan handoff ${h.id}: ${h.toActorId} not linked to task ${h.taskId}`);
      }
    });

  return {
    orphanCount: orphanHandoffIds.length,
    orphanHandoffIds: orphanHandoffIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamHandoffOrphans(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return friendly + enemy;
}


// --- source: workstream-deadlock-detector.ts ---

export interface WorkstreamDeadlockReport {
  deadlockCount: number;
  deadlockedWorkstreamIds: string[];
  notes: string[];
}

function waitingWorkstreams(workstreams: ParallelWorkstream[]): ParallelWorkstream[] {
  return workstreams.filter(ws => ws.phase === 'waiting_barrier');
}

function dependsOn(a: ParallelWorkstream, b: ParallelWorkstream): boolean {
  if (b.taskIds.length === 0) return false;
  const bTasks = new Set(b.taskIds);
  return a.barrierTaskIds.some(taskId => bTasks.has(taskId));
}

/**
 * Detect circular barrier dependencies among workstreams stuck in waiting_barrier.
 */
export function detectWorkstreamDeadlocks(workstreams: ParallelWorkstream[]): WorkstreamDeadlockReport {
  const waiting = waitingWorkstreams(workstreams);
  const notes: string[] = [];
  const deadlocked = new Set<string>();

  const adjacency = new Map<string, string[]>();
  waiting.forEach(ws => {
    const deps = waiting.filter(other => other.id !== ws.id && dependsOn(ws, other)).map(o => o.id);
    adjacency.set(ws.id, deps);
  });

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const stack: string[] = [];

  const reportCycle = (cycleStart: string) => {
    const startIdx = stack.indexOf(cycleStart);
    if (startIdx < 0) return;
    const cycle = stack.slice(startIdx);
    cycle.forEach(id => deadlocked.add(id));
    notes.push(`Workstream deadlock cycle: ${cycle.join(' → ')}`);
  };

  const dfs = (node: string): boolean => {
    if (visiting.has(node)) {
      reportCycle(node);
      return true;
    }
    if (visited.has(node)) return false;
    visiting.add(node);
    stack.push(node);
    const neighbors = adjacency.get(node) || [];
    neighbors.forEach(n => {
      dfs(n);
    });
    stack.pop();
    visiting.delete(node);
    visited.add(node);
    return false;
  };

  waiting.forEach(ws => {
    if (!visited.has(ws.id)) dfs(ws.id);
  });

  return {
    deadlockCount: deadlocked.size,
    deadlockedWorkstreamIds: [...deadlocked].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamWorkstreamDeadlocks(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return friendly + enemy;
}


// --- source: lease-contention-index.ts ---

export interface LeaseContentionReport {
  contentionIndex: number;
  contendedRegionIds: string[];
  notes: string[];
}

/**
 * Score regions where leases, mutex holders, and pending handoffs disagree on ownership.
 */
export function computeLeaseContentionIndex(
  leases: CoordinationLease[],
  handoffs: HandoffRequest[],
  mutexRegions: Record<string, string>,
): LeaseContentionReport {
  const notes: string[] = [];
  const contendedRegionIds: string[] = [];
  const scopedLeases = leases.slice(0, AGENT18_LIMITS.maxLeases);
  const regionLeaseHolders = new Map<string, Set<string>>();

  scopedLeases.forEach(lease => {
    if (!lease.regionId) return;
    const holders = regionLeaseHolders.get(lease.regionId) ?? new Set<string>();
    holders.add(lease.holderActorId);
    regionLeaseHolders.set(lease.regionId, holders);
  });

  regionLeaseHolders.forEach((holders, regionId) => {
    if (holders.size > 1) {
      contendedRegionIds.push(regionId);
      notes.push(`Region ${regionId}: ${holders.size} lease holders (${[...holders].join(', ')})`);
    }
  });

  handoffs
    .filter(h => h.status === 'pending' && h.regionId)
    .forEach(h => {
      const regionId = h.regionId as string;
      const mutexHolder = mutexRegions[regionId];
      if (mutexHolder && mutexHolder !== h.toActorId) {
        if (!contendedRegionIds.includes(regionId)) contendedRegionIds.push(regionId);
        notes.push(
          `Handoff ${h.id} to ${h.toActorId} conflicts with mutex holder ${mutexHolder} on ${regionId}`,
        );
      }
    });

  const leaseConflictWeight = contendedRegionIds.filter(r => {
    const holders = regionLeaseHolders.get(r);
    return holders && holders.size > 1;
  }).length;
  const handoffConflictCount = notes.filter(n => n.startsWith('Handoff')).length;
  const signal = leaseConflictWeight * 35 + handoffConflictCount * 25;
  const contentionIndex = Math.min(100, Math.round(signal));

  return {
    contentionIndex,
    contendedRegionIds: contendedRegionIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamLeaseContention(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: coordination-saturation-gauge.ts ---

export interface CoordinationSaturationInputs {
  directiveProposalCount: number;
  pendingHandoffCount: number;
  activeLeaseCount: number;
  activeWorkstreamCount: number;
  suppressedDirectiveCount?: number;
}

export interface CoordinationSaturationReport {
  saturationIndex: number;
  notes: string[];
}

function ratio(numerator: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(1, numerator / limit);
}

/**
 * Measure how close the team is to coordination resource limits (directives, handoffs, leases, workstreams).
 */
export function measureCoordinationSaturation(
  inputs: CoordinationSaturationInputs,
): CoordinationSaturationReport {
  const notes: string[] = [];
  const directiveLoad =
    inputs.directiveProposalCount + (inputs.suppressedDirectiveCount ?? 0);
  const ratios = [
    { label: 'directives', value: ratio(directiveLoad, AGENT18_LIMITS.maxDirectivesPerTeamPerTurn) },
    { label: 'handoffs', value: ratio(inputs.pendingHandoffCount, AGENT18_LIMITS.maxHandoffs) },
    { label: 'leases', value: ratio(inputs.activeLeaseCount, AGENT18_LIMITS.maxLeases) },
    { label: 'workstreams', value: ratio(inputs.activeWorkstreamCount, AGENT18_LIMITS.maxWorkstreams) },
  ];

  ratios
    .filter(r => r.value >= 0.75)
    .forEach(r => notes.push(`Coordination ${r.label} at ${Math.round(r.value * 100)}% of limit`));

  const peak = Math.max(...ratios.map(r => r.value));
  const average = ratios.reduce((s, r) => s + r.value, 0) / ratios.length;
  const saturationIndex = Math.round(Math.min(100, peak * 70 + average * 30));

  return {
    saturationIndex,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamCoordinationSaturation(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: mutex-lease-divergence-index.ts ---

export interface MutexLeaseDivergenceReport {
  divergenceIndex: number;
  divergentRegionIds: string[];
  notes: string[];
}

/**
 * Flag regions where mutex holder and active lease holder disagree.
 */
export function computeMutexLeaseDivergenceIndex(
  mutexRegions: Record<string, string>,
  leases: CoordinationLease[],
): MutexLeaseDivergenceReport {
  const notes: string[] = [];
  const divergentRegionIds: string[] = [];
  const scoped = leases.slice(0, AGENT18_LIMITS.maxLeases);

  Object.entries(mutexRegions).forEach(([regionId, mutexHolder]) => {
    const lease = scoped.find(l => l.regionId === regionId);
    if (!lease) return;
    if (lease.holderActorId !== mutexHolder) {
      divergentRegionIds.push(regionId);
      notes.push(
        `Region ${regionId}: mutex ${mutexHolder} vs lease ${lease.holderActorId} (${lease.id})`,
      );
    }
  });

  const tracked = Object.keys(mutexRegions).length;
  const ratio = tracked === 0 ? 0 : divergentRegionIds.length / tracked;
  const divergenceIndex = Math.round(Math.min(100, ratio * 100 + divergentRegionIds.length * 12));

  return {
    divergenceIndex,
    divergentRegionIds: divergentRegionIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamMutexLeaseDivergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: handoff-cascade-analyzer.ts ---

export interface HandoffCascadeReport {
  cascadeRiskIndex: number;
  cascadeChainActorIds: string[];
  notes: string[];
}

/**
 * Score risk from long pending handoff chains (sequential actor delegation).
 */
export function analyzeHandoffCascadeRisk(handoffs: HandoffRequest[]): HandoffCascadeReport {
  const pending = handoffs
    .filter(h => h.status === 'pending')
    .slice(0, AGENT18_LIMITS.maxHandoffs);
  const notes: string[] = [];
  const nextByFrom = new Map<string, string>();

  pending.forEach(h => {
    if (!nextByFrom.has(h.fromActorId)) nextByFrom.set(h.fromActorId, h.toActorId);
  });

  let maxChain = 0;
  let worstChain: string[] = [];
  const starts = new Set(pending.map(h => h.fromActorId));

  starts.forEach(start => {
    const chain: string[] = [start];
    const seen = new Set<string>([start]);
    let cursor: string | undefined = start;
    while (cursor && nextByFrom.has(cursor)) {
      const next = nextByFrom.get(cursor) as string;
      if (seen.has(next)) {
        notes.push(`Handoff cascade cycle includes ${next}`);
        break;
      }
      chain.push(next);
      seen.add(next);
      cursor = next;
      if (chain.length > maxChain) {
        maxChain = chain.length;
        worstChain = [...chain];
      }
    }
  });

  const cascadeRiskIndex = Math.round(
    Math.min(100, Math.max(0, (maxChain - 1) * 28 + (maxChain >= 4 ? 20 : 0))),
  );
  if (maxChain >= 3) {
    notes.push(`Handoff cascade length ${maxChain}: ${worstChain.join(' → ')}`);
  }

  return {
    cascadeRiskIndex,
    cascadeChainActorIds: worstChain.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamHandoffCascadeRisk(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: suppression-backlog-index.ts ---

export interface SuppressionBacklogInputs {
  suppressedDirectiveIds: string[];
  droppedDirectiveCount: number;
  quotaExhaustedActorIds: string[];
}

export interface SuppressionBacklogReport {
  backlogIndex: number;
  notes: string[];
}

/**
 * Measure pressure from suppressed and quota-dropped directives versus team caps.
 */
export function computeSuppressionBacklogIndex(
  inputs: SuppressionBacklogInputs,
): SuppressionBacklogReport {
  const notes: string[] = [];
  const uniqueSuppressed = new Set(inputs.suppressedDirectiveIds);
  const suppressedLoad = uniqueSuppressed.size + inputs.droppedDirectiveCount;
  const capRatio = suppressedLoad / Math.max(1, AGENT18_LIMITS.maxSuppressedDirectives);
  const actorPressure = inputs.quotaExhaustedActorIds.length / Math.max(1, AGENT18_LIMITS.maxDirectivesPerActorPerTurn);
  const backlogIndex = Math.round(Math.min(100, capRatio * 65 + actorPressure * 35));

  if (capRatio >= 0.75) {
    notes.push(`Suppressed directive backlog at ${Math.round(capRatio * 100)}% of cap`);
  }
  if (inputs.quotaExhaustedActorIds.length > 0) {
    notes.push(`Quota exhausted for: ${inputs.quotaExhaustedActorIds.join(', ')}`);
  }

  return {
    backlogIndex,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamSuppressionBacklog(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: reconcile-drift-index.ts ---

export interface ReconcileDriftReport {
  driftIndex: number;
  notes: string[];
}

/**
 * Score coordination plan drift from reconcile churn and mutex thrashing.
 */
export function computeReconcileDriftIndex(
  report: CoordinationReconcileReport,
  thrashingRegionCount: number,
): ReconcileDriftReport {
  const notes: string[] = [];
  if (!report.stable) {
    notes.push(`Reconcile unstable: ${report.changes.length} change(s) at turn ${report.turn}`);
  }
  if (thrashingRegionCount > 0) {
    notes.push(`Thrashing regions contribute to drift (${thrashingRegionCount})`);
  }

  const changeSignal = Math.min(60, report.changes.length * 12);
  const thrashSignal = Math.min(40, thrashingRegionCount * 15);
  const unstableBoost = report.stable ? 0 : 18;
  const driftIndex = Math.round(Math.min(100, changeSignal + thrashSignal + unstableBoost));

  return { driftIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamReconcileDrift(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: arbitration-pressure-index.ts ---

export interface ArbitrationPressureReport {
  pressureIndex: number;
  demotedActorIds: string[];
  notes: string[];
}

/**
 * Measure mutex arbitration demotion pressure from coordination arbitration log.
 */
export function computeArbitrationPressureIndex(
  arbitrationLog: PriorityArbitrationRecord[],
): ArbitrationPressureReport {
  const notes: string[] = [];
  const demotedActorIds: string[] = [];

  arbitrationLog.forEach(entry => {
    entry.demoted.forEach(d => {
      demotedActorIds.push(d.actorId);
      notes.push(`Demoted ${d.actorId} on ${entry.regionId || 'global'}: ${d.reason}`);
    });
  });

  const demotionCount = demotedActorIds.length;
  const entryCount = arbitrationLog.length;
  const pressureIndex = Math.round(
    Math.min(100, demotionCount * 14 + entryCount * 8 + (demotionCount >= 4 ? 15 : 0)),
  );

  return {
    pressureIndex,
    demotedActorIds: [...new Set(demotedActorIds)].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamArbitrationPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: persistence-churn-gauge.ts ---

export interface PersistenceChurnReport {
  churnIndex: number;
  notes: string[];
}

/**
 * Gauge persistence churn from signature deltas and commit-gate outcomes.
 */
export function measurePersistenceChurn(
  previous: TeamMultiAgentLayerState | null,
  evaluated: TeamMultiAgentLayerState,
  decision: TeamMultiAgentPersistenceDecision,
): PersistenceChurnReport {
  const notes: string[] = [];
  const nextSig = teamMultiAgentPersistSignature(evaluated);
  const prevSig = previous ? teamMultiAgentPersistSignature(previous) : null;

  if (prevSig && prevSig !== nextSig) {
    notes.push('Persistence signature changed versus stored layer');
  }
  if (!decision.commit) {
    notes.push(`Persistence blocked: ${decision.reason}`);
  }

  const roleDelta = previous
    ? Math.abs(previous.roles.length - evaluated.roles.length)
    : evaluated.roles.length;
  const signatureChanged = !prevSig || prevSig !== nextSig;
  const blocked = !decision.commit;
  const churnIndex = Math.round(
    Math.min(
      100,
      (signatureChanged ? 35 : 8) + roleDelta * 12 + (blocked ? 55 : 0),
    ),
  );

  return { churnIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPersistenceChurn(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: duplicate-guard-pressure.ts ---

export interface DuplicateGuardPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Score duplicate-guard reservation and commit-key load versus configured caps.
 */
export function measureDuplicateGuardPressure(guard: DuplicateGuardState): DuplicateGuardPressureReport {
  const notes: string[] = [];
  const reservationCount = Object.keys(guard.reservations).length;
  const committedCount = guard.committedKeys.length;
  const reservationRatio = reservationCount / Math.max(1, AGENT18_LIMITS.maxReservations);
  const committedRatio = committedCount / Math.max(1, AGENT18_LIMITS.maxCommittedKeys);

  if (reservationRatio >= 0.75) {
    notes.push(`Duplicate reservations at ${Math.round(reservationRatio * 100)}% of cap`);
  }
  if (committedRatio >= 0.75) {
    notes.push(`Committed action keys at ${Math.round(committedRatio * 100)}% of cap`);
  }

  const pressureIndex = Math.round(
    Math.min(100, reservationRatio * 55 + committedRatio * 45 + (reservationRatio >= 1 ? 10 : 0)),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamDuplicateGuardPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: role-task-coverage-gap.ts ---

export interface RoleTaskCoverageReport {
  gapIndex: number;
  uncoveredTaskIds: string[];
  notes: string[];
}

function roleCoversTask(roles: RoleAssignment[], taskId: string): boolean {
  return roles.some(r => r.taskIds.includes(taskId));
}

/**
 * Detect team tasks with assignees that are not linked from any role assignment board.
 */
export function computeRoleTaskCoverageGap(
  roles: RoleAssignment[],
  tasks: TeamTaskSnapshot[],
): RoleTaskCoverageReport {
  const notes: string[] = [];
  const uncoveredTaskIds: string[] = [];

  tasks
    .filter(t => t.assignedActorIds.length > 0)
    .forEach(task => {
      if (!roleCoversTask(roles, task.id)) {
        uncoveredTaskIds.push(task.id);
        notes.push(`Task ${task.id} assigned but absent from role boards`);
      }
    });

  const assignedCount = tasks.filter(t => t.assignedActorIds.length > 0).length;
  const ratio = assignedCount === 0 ? 0 : uncoveredTaskIds.length / assignedCount;
  const gapIndex = Math.round(Math.min(100, ratio * 100 + uncoveredTaskIds.length * 8));

  return {
    gapIndex,
    uncoveredTaskIds: uncoveredTaskIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRoleTaskCoverageGap(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: composite-health-gradient.ts ---
export type CompositeHealthTrend = 'improving' | 'declining' | 'flat';

export interface CompositeHealthGradientReport {
  gradientIndex: number;
  trend: CompositeHealthTrend;
  delta: number;
  notes: string[];
}

/**
 * Turn-over-turn composite score delta; declining health yields higher gradient index.
 */
export function computeCompositeHealthGradient(
  previousScore: number | undefined,
  currentScore: number,
): CompositeHealthGradientReport {
  const notes: string[] = [];
  if (previousScore === undefined) {
    return {
      gradientIndex: 0,
      trend: 'flat',
      delta: 0,
      notes: ['No prior composite score — gradient baseline'],
    };
  }

  const delta = currentScore - previousScore;
  let trend: CompositeHealthTrend = 'flat';
  if (delta >= 4) trend = 'improving';
  if (delta <= -4) trend = 'declining';

  if (trend === 'declining') {
    notes.push(`Composite health declined ${Math.abs(delta)} points`);
  } else if (trend === 'improving') {
    notes.push(`Composite health improved ${delta} points`);
  }

  const gradientIndex = Math.round(Math.min(100, Math.max(0, -delta * 2.5)));

  return { gradientIndex, trend, delta, notes: notes.slice(0, 6) };
}

export function combineDualTeamCompositeHealthGradient(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: handoff-readiness-spread.ts ---

export interface HandoffReadinessSpreadReport {
  spreadIndex: number;
  notes: string[];
}

/**
 * Measure dispersion of pending handoff readiness scores (uneven acceptance capacity).
 */
export function computeHandoffReadinessSpread(
  report: HandoffReadinessReport,
): HandoffReadinessSpreadReport {
  const notes: string[] = [];
  const scores = report.rows.map(r => r.readinessScore);
  if (scores.length < 2) {
    return { spreadIndex: 0, notes: ['Insufficient pending handoffs for spread'] };
  }

  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const spread = max - min;
  if (spread >= 35) {
    notes.push(`Handoff readiness spread ${spread} (${min}–${max})`);
  }

  const spreadIndex = Math.round(Math.min(100, spread * 1.4 + (report.notReadyHandoffIds.length > 0 ? 12 : 0)));

  return { spreadIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHandoffReadinessSpread(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: workstream-parallelism-index.ts ---

export interface WorkstreamParallelismReport {
  parallelismIndex: number;
  notes: string[];
}

/**
 * Score active parallel workstream load relative to configured workstream cap.
 */
export function measureWorkstreamParallelism(workstreams: ParallelWorkstream[]): WorkstreamParallelismReport {
  const notes: string[] = [];
  const scoped = workstreams.slice(0, AGENT18_LIMITS.maxWorkstreams);
  const active = scoped.filter(ws => ws.phase === 'active').length;
  const waiting = scoped.filter(ws => ws.phase === 'waiting_barrier').length;
  const inFlight = active + waiting;
  const ratio = inFlight / Math.max(1, AGENT18_LIMITS.maxWorkstreams);

  if (ratio >= 0.75) {
    notes.push(`Workstreams in flight at ${Math.round(ratio * 100)}% of cap (${inFlight}/${AGENT18_LIMITS.maxWorkstreams})`);
  }
  if (waiting >= 2) {
    notes.push(`${waiting} workstreams waiting on barriers`);
  }

  const parallelismIndex = Math.round(Math.min(100, ratio * 70 + waiting * 12));

  return { parallelismIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamWorkstreamParallelism(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: escalation-recovery-alignment.ts ---
export interface EscalationRecoveryAlignmentReport {
  alignmentIndex: number;
  notes: string[];
}

/**
 * Misalignment between escalation tier and recovery urgency expectations.
 */
export function computeEscalationRecoveryAlignment(
  escalationTier: number,
  recoveryUrgency: number,
): EscalationRecoveryAlignmentReport {
  const notes: string[] = [];
  const tier = Math.max(0, Math.min(3, escalationTier));
  const expectedUrgency = tier * 24 + (tier >= 2 ? 18 : 8);
  const delta = Math.abs(recoveryUrgency - expectedUrgency);

  if (tier >= 2 && recoveryUrgency < expectedUrgency - 15) {
    notes.push('Recovery urgency lagging escalation tier');
  }
  if (tier <= 1 && recoveryUrgency > expectedUrgency + 25) {
    notes.push('Recovery urgency overshoots nominal escalation tier');
  }

  const alignmentIndex = Math.round(Math.min(100, delta * 1.35));

  return { alignmentIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamEscalationRecoveryAlignment(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: audit-pressure-index.ts ---

export interface AuditPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Aggregate audit finding severity into a single pressure score.
 */
export function computeAuditPressureIndex(findings: CoordinationAuditFinding[]): AuditPressureReport {
  const notes: string[] = [];
  const errors = findings.filter(f => f.severity === 'error').length;
  const warnings = findings.filter(f => f.severity === 'warning').length;

  if (errors > 0) notes.push(`${errors} coordination audit error(s)`);
  if (warnings >= 3) notes.push(`${warnings} coordination audit warnings`);

  const pressureIndex = Math.round(Math.min(100, errors * 28 + warnings * 9));

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAuditPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: role-lock-friction-index.ts ---

export interface RoleLockFrictionReport {
  frictionIndex: number;
  lockedRoleActorIds: string[];
  notes: string[];
}

/**
 * Score friction from role locks that block reassignment this turn.
 */
export function computeRoleLockFrictionIndex(
  turn: number,
  roles: RoleAssignment[],
): RoleLockFrictionReport {
  const notes: string[] = [];
  const lockedRoleActorIds = roles
    .filter(r => r.lockedUntilTurn !== null && r.lockedUntilTurn > turn)
    .map(r => r.actorId);

  if (lockedRoleActorIds.length > 0) {
    notes.push(`Role locks active for: ${lockedRoleActorIds.join(', ')}`);
  }

  const ratio = roles.length === 0 ? 0 : lockedRoleActorIds.length / roles.length;
  const frictionIndex = Math.round(Math.min(100, ratio * 80 + lockedRoleActorIds.length * 10));

  return {
    frictionIndex,
    lockedRoleActorIds: lockedRoleActorIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRoleLockFriction(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: directive-constraint-density.ts ---
export interface DirectiveConstraintDensityReport {
  densityIndex: number;
  constrainedActorIds: string[];
  notes: string[];
}

/**
 * Measure how many actors carry active directive coordination constraints.
 */
export function computeDirectiveConstraintDensity(
  constraintsByActor: Record<string, string>,
): DirectiveConstraintDensityReport {
  const notes: string[] = [];
  const constrainedActorIds = Object.entries(constraintsByActor)
    .filter(([, value]) => value.trim().length > 0)
    .map(([actorId]) => actorId);

  if (constrainedActorIds.length > 0) {
    notes.push(`Directive constraints on: ${constrainedActorIds.join(', ')}`);
  }

  const densityIndex = Math.round(Math.min(100, constrainedActorIds.length * 18 + 8));

  return {
    densityIndex,
    constrainedActorIds: constrainedActorIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamDirectiveConstraintDensity(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cross-team-rejection-index.ts ---
export interface CrossTeamRejectionReport {
  rejectionIndex: number;
  notes: string[];
}

/**
 * Score pressure from cross-team directive rejections at the team boundary.
 */
export function computeCrossTeamRejectionIndex(
  rejectedCount: number,
  totalProposals: number,
): CrossTeamRejectionReport {
  const notes: string[] = [];
  if (rejectedCount > 0) {
    notes.push(`${rejectedCount} cross-team directive(s) rejected of ${totalProposals} proposals`);
  }

  const ratio = totalProposals === 0 ? 0 : rejectedCount / totalProposals;
  const rejectionIndex = Math.round(Math.min(100, ratio * 90 + rejectedCount * 15));

  return { rejectionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCrossTeamRejection(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: handoff-sla-velocity-index.ts ---
export interface HandoffSlaVelocityReport {
  velocityIndex: number;
  notes: string[];
}

/**
 * Pending handoff SLA stress: overdue share of pending handoffs.
 */
export function computeHandoffSlaVelocityIndex(
  pendingCount: number,
  overdueHandoffIds: string[],
): HandoffSlaVelocityReport {
  const notes: string[] = [];
  const overdue = overdueHandoffIds.length;
  if (pendingCount === 0) {
    return { velocityIndex: 0, notes: ['No pending handoffs'] };
  }

  const ratio = overdue / pendingCount;
  if (ratio >= 0.5) {
    notes.push(`Handoff SLA stress: ${overdue}/${pendingCount} overdue`);
  }

  const velocityIndex = Math.round(Math.min(100, ratio * 100 + overdue * 8));

  return { velocityIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHandoffSlaVelocity(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: recovery-action-breadth.ts ---
export interface RecoveryActionBreadthReport {
  breadthGapIndex: number;
  notes: string[];
}

/**
 * Gap between escalation tier expectations and recovery playbook action breadth.
 */
export function measureRecoveryActionBreadth(
  escalationTier: number,
  recommendedActions: string[],
): RecoveryActionBreadthReport {
  const notes: string[] = [];
  const tier = Math.max(0, Math.min(3, escalationTier));
  const expectedMinActions = tier === 0 ? 0 : tier + 1;
  const actual = recommendedActions.length;
  const shortfall = Math.max(0, expectedMinActions - actual);

  if (shortfall > 0) {
    notes.push(`Recovery playbook shortfall: ${actual} actions for tier ${tier}`);
  }
  if (tier >= 2 && actual >= 4) {
    notes.push(`Recovery playbook breadth adequate for tier ${tier}`);
  }

  const overshootPenalty = tier <= 1 && actual >= 6 ? 12 : 0;
  const breadthGapIndex = Math.round(Math.min(100, shortfall * 28 + overshootPenalty));

  return { breadthGapIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamRecoveryActionBreadth(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: directive-quota-exhaustion-index.ts ---
export interface DirectiveQuotaExhaustionReport {
  exhaustionIndex: number;
  notes: string[];
}

/**
 * Pressure from directive quota drops and actors with zero remaining quota.
 */
export function computeDirectiveQuotaExhaustionIndex(
  droppedCount: number,
  quotaExhaustedActorIds: string[],
): DirectiveQuotaExhaustionReport {
  const notes: string[] = [];
  const exhausted = quotaExhaustedActorIds.length;
  if (droppedCount > 0) {
    notes.push(`${droppedCount} directive(s) dropped by quota guard`);
  }
  if (exhausted > 0) {
    notes.push(`${exhausted} actor(s) at directive quota limit`);
  }

  const exhaustionIndex = Math.round(
    Math.min(100, droppedCount * 18 + exhausted * 22 + (droppedCount > 0 && exhausted > 0 ? 10 : 0)),
  );

  return { exhaustionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamDirectiveQuotaExhaustion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: capacity-imbalance-index.ts ---
export interface CapacityImbalanceReport {
  imbalanceIndex: number;
  notes: string[];
}

/**
 * Actor capacity skew: simultaneous overload and idle teammates.
 */
export function computeCapacityImbalanceIndex(
  balanceScore: number,
  overloadedActorIds: string[],
  idleActorIds: string[],
): CapacityImbalanceReport {
  const notes: string[] = [];
  const overloaded = overloadedActorIds.length;
  const idle = idleActorIds.length;
  if (overloaded > 0 && idle > 0) {
    notes.push(`Capacity skew: ${overloaded} overloaded, ${idle} idle`);
  } else if (overloaded >= 2) {
    notes.push(`${overloaded} actors overloaded without idle relief`);
  }

  const skewPairs = Math.min(overloaded, idle);
  const imbalanceIndex = Math.round(
    Math.min(
      100,
      Math.max(0, 100 - balanceScore) * 0.45 + skewPairs * 24 + overloaded * 8 + idle * 4,
    ),
  );

  return { imbalanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCapacityImbalance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: workstream-barrier-staleness-index.ts ---

export interface WorkstreamBarrierStalenessReport {
  stalenessIndex: number;
  notes: string[];
}

/**
 * How long workstreams have waited at barriers relative to the SLA cap.
 */
export function computeWorkstreamBarrierStalenessIndex(
  currentTurn: number,
  workstreamBarrierSince: Record<string, number>,
  stalledWorkstreamIds: string[],
): WorkstreamBarrierStalenessReport {
  const notes: string[] = [];
  const maxWait = AGENT18_LIMITS.workstreamBarrierMaxWaitTurns;
  let worstWait = 0;

  stalledWorkstreamIds.forEach(wsId => {
    const since = workstreamBarrierSince[wsId];
    if (since === undefined) return;
    const wait = Math.max(0, currentTurn - since);
    worstWait = Math.max(worstWait, wait);
  });

  if (worstWait > maxWait) {
    notes.push(`Workstream barrier stale ${worstWait} turn(s) (cap ${maxWait})`);
  } else if (stalledWorkstreamIds.length > 0 && worstWait >= maxWait) {
    notes.push(`${stalledWorkstreamIds.length} stalled workstream(s) at barrier cap`);
  }

  const stallPenalty = stalledWorkstreamIds.length * 14;
  const waitPenalty = worstWait <= 0 ? 0 : Math.min(60, (worstWait / Math.max(1, maxWait)) * 55);
  const stalenessIndex = Math.round(Math.min(100, stallPenalty + waitPenalty));

  return { stalenessIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamWorkstreamBarrierStaleness(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: workstream-deadlock-pressure-index.ts ---
export interface WorkstreamDeadlockPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Deadlock pressure amplified by in-flight workstream parallelism load.
 */
export function computeWorkstreamDeadlockPressureIndex(
  deadlockCount: number,
  deadlockedWorkstreamIds: string[],
  parallelismIndex: number,
): WorkstreamDeadlockPressureReport {
  const notes: string[] = [];
  const deadlocked = deadlockedWorkstreamIds.length;
  if (deadlockCount > 0) {
    notes.push(`${deadlockCount} workstream deadlock(s) detected`);
  }
  if (deadlockCount > 0 && parallelismIndex >= 55) {
    notes.push(`Deadlocks under high parallelism load (${parallelismIndex})`);
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      deadlockCount * 28 +
        deadlocked * 12 +
        (deadlockCount > 0 && parallelismIndex >= 50
          ? Math.floor(parallelismIndex * 0.25)
          : 0) +
        (deadlockCount >= 2 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamWorkstreamDeadlockPressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: suppression-quota-coupling-index.ts ---
export interface SuppressionQuotaCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Combined stress when directive suppression backlog coincides with quota exhaustion.
 */
export function computeSuppressionQuotaCouplingIndex(
  suppressionBacklogIndex: number,
  directiveQuotaExhaustionIndex: number,
  quotaExhaustedActorCount: number,
): SuppressionQuotaCouplingReport {
  const notes: string[] = [];
  if (suppressionBacklogIndex >= 35 && directiveQuotaExhaustionIndex >= 35) {
    notes.push('Suppression backlog and quota exhaustion both elevated');
  }
  if (quotaExhaustedActorCount > 0 && suppressionBacklogIndex >= 40) {
    notes.push(`${quotaExhaustedActorCount} exhausted actor(s) with suppressed backlog`);
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      suppressionBacklogIndex * 0.35 +
        directiveQuotaExhaustionIndex * 0.35 +
        quotaExhaustedActorCount * 10 +
        (suppressionBacklogIndex >= 40 && directiveQuotaExhaustionIndex >= 40 ? 18 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSuppressionQuotaCoupling(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: handoff-lease-overlap-index.ts ---
export interface HandoffLeaseOverlapReport {
  overlapIndex: number;
  notes: string[];
}

/**
 * Pending handoffs targeting regions with expiring or expired leases.
 */
export function computeHandoffLeaseOverlapIndex(
  overlappingPendingHandoffCount: number,
  pendingHandoffCount: number,
  expiringLeaseCount: number,
  expiredLeaseCount: number,
): HandoffLeaseOverlapReport {
  const notes: string[] = [];
  if (overlappingPendingHandoffCount > 0) {
    notes.push(
      `${overlappingPendingHandoffCount} pending handoff(s) overlap lease-at-risk regions`,
    );
  } else if (pendingHandoffCount > 0 && (expiringLeaseCount > 0 || expiredLeaseCount > 0)) {
    notes.push('Lease risk present but no region overlap with pending handoffs');
  }

  const leaseRisk = expiringLeaseCount + expiredLeaseCount * 2;
  const overlapIndex = Math.round(
    Math.min(
      100,
      overlappingPendingHandoffCount * 26 +
        leaseRisk * 8 +
        (pendingHandoffCount > 0
          ? Math.floor((overlappingPendingHandoffCount / pendingHandoffCount) * 40)
          : 0),
    ),
  );

  return { overlapIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamHandoffLeaseOverlap(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: saturation-deadlock-coupling-index.ts ---
export interface SaturationDeadlockCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Coordination saturation amplified when workstream deadlock pressure is elevated.
 */
export function computeSaturationDeadlockCouplingIndex(
  coordinationSaturationIndex: number,
  workstreamDeadlockPressureIndex: number,
  deadlockCount: number,
): SaturationDeadlockCouplingReport {
  const notes: string[] = [];
  if (coordinationSaturationIndex >= 40 && workstreamDeadlockPressureIndex >= 35) {
    notes.push('Coordination saturation and deadlock pressure both elevated');
  }
  if (deadlockCount > 0 && coordinationSaturationIndex >= 50) {
    notes.push(`${deadlockCount} deadlock(s) under saturated coordination load`);
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      coordinationSaturationIndex * 0.32 +
        workstreamDeadlockPressureIndex * 0.38 +
        deadlockCount * 14 +
        (coordinationSaturationIndex >= 45 && workstreamDeadlockPressureIndex >= 40 ? 16 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSaturationDeadlockCoupling(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-lease-convergence-index.ts ---
export interface CascadeLeaseConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Handoff cascade risk converging with lease-overlap stress on pending chains.
 */
export function computeCascadeLeaseConvergenceIndex(
  handoffCascadeRiskIndex: number,
  handoffLeaseOverlapIndex: number,
  cascadeChainActorCount: number,
): CascadeLeaseConvergenceReport {
  const notes: string[] = [];
  if (handoffCascadeRiskIndex >= 38 && handoffLeaseOverlapIndex >= 38) {
    notes.push('Handoff cascade risk and lease overlap both elevated');
  }
  if (cascadeChainActorCount > 0 && handoffLeaseOverlapIndex >= 42) {
    notes.push(`${cascadeChainActorCount} actor(s) in cascade with lease-overlap stress`);
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      handoffCascadeRiskIndex * 0.34 +
        handoffLeaseOverlapIndex * 0.36 +
        cascadeChainActorCount * 9 +
        (handoffCascadeRiskIndex >= 42 && handoffLeaseOverlapIndex >= 44 ? 17 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeLeaseConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: gradient-audit-tension-index.ts ---
export interface GradientAuditTensionReport {
  tensionIndex: number;
  notes: string[];
}

/**
 * Composite health gradient decline under rising audit pressure.
 */
export function computeGradientAuditTensionIndex(
  compositeHealthGradientIndex: number,
  compositeHealthTrend: string | undefined,
  auditPressureIndex: number,
): GradientAuditTensionReport {
  const notes: string[] = [];
  const declining =
    compositeHealthTrend === 'declining' || compositeHealthGradientIndex >= 42;
  if (declining && auditPressureIndex >= 35) {
    notes.push('Composite health declining while audit pressure rises');
  }
  if (auditPressureIndex >= 45 && compositeHealthGradientIndex >= 38) {
    notes.push('High audit pressure against negative composite gradient');
  }

  const trendBoost = compositeHealthTrend === 'declining' ? 12 : 0;
  const tensionIndex = Math.round(
    Math.min(
      100,
      compositeHealthGradientIndex * 0.3 +
        auditPressureIndex * 0.42 +
        trendBoost +
        (declining && auditPressureIndex >= 40 ? 15 : 0),
    ),
  );

  return { tensionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamGradientAuditTension(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: escalation-saturation-stack-index.ts ---
export interface EscalationSaturationStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Coordination escalation tier stacked on saturation–deadlock coupling stress.
 */
export function computeEscalationSaturationStackIndex(
  coordinationEscalationTier: number,
  saturationDeadlockCouplingIndex: number,
  coordinationSaturationIndex: number,
): EscalationSaturationStackReport {
  const notes: string[] = [];
  if (coordinationEscalationTier >= 2 && saturationDeadlockCouplingIndex >= 40) {
    notes.push('Escalation tier elevated atop saturation–deadlock coupling');
  }
  if (coordinationEscalationTier >= 3 && coordinationSaturationIndex >= 50) {
    notes.push(`Tier ${coordinationEscalationTier} escalation under saturated coordination`);
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      coordinationEscalationTier * 18 +
        saturationDeadlockCouplingIndex * 0.36 +
        coordinationSaturationIndex * 0.22 +
        (coordinationEscalationTier >= 2 && saturationDeadlockCouplingIndex >= 44 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamEscalationSaturationStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: recovery-cascade-mismatch-index.ts ---
export interface RecoveryCascadeMismatchReport {
  mismatchIndex: number;
  notes: string[];
}

/**
 * Recovery playbook breadth gap when cascade–lease convergence is elevated.
 */
export function computeRecoveryCascadeMismatchIndex(
  recoveryActionBreadthIndex: number,
  cascadeLeaseConvergenceIndex: number,
  coordinationRecoveryUrgency: number,
): RecoveryCascadeMismatchReport {
  const notes: string[] = [];
  if (recoveryActionBreadthIndex >= 38 && cascadeLeaseConvergenceIndex >= 40) {
    notes.push('Recovery breadth gap coincides with cascade–lease convergence');
  }
  if (coordinationRecoveryUrgency >= 3 && cascadeLeaseConvergenceIndex >= 42) {
    notes.push('High recovery urgency with unresolved cascade–lease convergence');
  }

  const mismatchIndex = Math.round(
    Math.min(
      100,
      recoveryActionBreadthIndex * 0.34 +
        cascadeLeaseConvergenceIndex * 0.38 +
        coordinationRecoveryUrgency * 8 +
        (recoveryActionBreadthIndex >= 40 && cascadeLeaseConvergenceIndex >= 44 ? 16 : 0),
    ),
  );

  return { mismatchIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamRecoveryCascadeMismatch(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: persistence-gradient-friction-index.ts ---
export interface PersistenceGradientFrictionReport {
  frictionIndex: number;
  notes: string[];
}

/**
 * Persistence churn amplifying gradient–audit tension on layer state.
 */
export function computePersistenceGradientFrictionIndex(
  persistenceChurnIndex: number,
  gradientAuditTensionIndex: number,
  compositeHealthTrend: string | undefined,
): PersistenceGradientFrictionReport {
  const notes: string[] = [];
  if (persistenceChurnIndex >= 35 && gradientAuditTensionIndex >= 38) {
    notes.push('Persistence churn under gradient–audit tension');
  }
  if (compositeHealthTrend === 'declining' && persistenceChurnIndex >= 40) {
    notes.push('State churn while composite health is declining');
  }

  const trendBoost = compositeHealthTrend === 'declining' ? 10 : 0;
  const frictionIndex = Math.round(
    Math.min(
      100,
      persistenceChurnIndex * 0.4 +
        gradientAuditTensionIndex * 0.35 +
        trendBoost +
        (persistenceChurnIndex >= 42 && gradientAuditTensionIndex >= 42 ? 15 : 0),
    ),
  );

  return { frictionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPersistenceGradientFriction(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-mismatch-coupling-index.ts ---
export interface StackMismatchCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Escalation–saturation stack coupled with recovery–cascade mismatch stress.
 */
export function computeStackMismatchCouplingIndex(
  escalationSaturationStackIndex: number,
  recoveryCascadeMismatchIndex: number,
  coordinationEscalationTier: number,
): StackMismatchCouplingReport {
  const notes: string[] = [];
  if (escalationSaturationStackIndex >= 42 && recoveryCascadeMismatchIndex >= 40) {
    notes.push('Escalation stack and recovery mismatch both elevated');
  }
  if (coordinationEscalationTier >= 2 && recoveryCascadeMismatchIndex >= 44) {
    notes.push('Recovery mismatch under active escalation tier');
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      escalationSaturationStackIndex * 0.37 +
        recoveryCascadeMismatchIndex * 0.39 +
        coordinationEscalationTier * 6 +
        (escalationSaturationStackIndex >= 46 && recoveryCascadeMismatchIndex >= 44 ? 15 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackMismatchCoupling(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: audit-stack-amplification-index.ts ---
export interface AuditStackAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Audit pressure amplifying escalation–saturation stack under gradient tension.
 */
export function computeAuditStackAmplificationIndex(
  auditPressureIndex: number,
  escalationSaturationStackIndex: number,
  gradientAuditTensionIndex: number,
): AuditStackAmplificationReport {
  const notes: string[] = [];
  if (auditPressureIndex >= 38 && escalationSaturationStackIndex >= 40) {
    notes.push('Audit pressure atop escalation–saturation stack');
  }
  if (gradientAuditTensionIndex >= 42 && auditPressureIndex >= 40) {
    notes.push('Gradient–audit tension reinforcing stack amplification');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      auditPressureIndex * 0.36 +
        escalationSaturationStackIndex * 0.34 +
        gradientAuditTensionIndex * 0.28 +
        (auditPressureIndex >= 42 && escalationSaturationStackIndex >= 44 ? 14 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAuditStackAmplification(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: friction-alignment-gap-index.ts ---
export interface FrictionAlignmentGapReport {
  gapIndex: number;
  notes: string[];
}

/**
 * Persistence–gradient friction diverging from escalation–recovery alignment.
 */
export function computeFrictionAlignmentGapIndex(
  persistenceGradientFrictionIndex: number,
  escalationRecoveryAlignmentIndex: number,
  persistenceChurnIndex: number,
): FrictionAlignmentGapReport {
  const notes: string[] = [];
  const misaligned = escalationRecoveryAlignmentIndex < 45;
  if (persistenceGradientFrictionIndex >= 40 && misaligned) {
    notes.push('Persistence friction while escalation–recovery alignment is weak');
  }
  if (persistenceChurnIndex >= 38 && persistenceGradientFrictionIndex >= 42) {
    notes.push('Elevated churn contributing to friction–alignment gap');
  }

  const alignmentPenalty = misaligned ? Math.max(0, 55 - escalationRecoveryAlignmentIndex) * 0.5 : 0;
  const gapIndex = Math.round(
    Math.min(
      100,
      persistenceGradientFrictionIndex * 0.38 +
        alignmentPenalty +
        persistenceChurnIndex * 0.22 +
        (misaligned && persistenceGradientFrictionIndex >= 44 ? 16 : 0),
    ),
  );

  return { gapIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFrictionAlignmentGap(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: coupling-amplification-fusion-index.ts ---
export interface CouplingAmplificationFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Stack–mismatch coupling fused with audit–stack amplification pressure.
 */
export function computeCouplingAmplificationFusionIndex(
  stackMismatchCouplingIndex: number,
  auditStackAmplificationIndex: number,
  auditPressureIndex: number,
): CouplingAmplificationFusionReport {
  const notes: string[] = [];
  if (stackMismatchCouplingIndex >= 44 && auditStackAmplificationIndex >= 42) {
    notes.push('Stack coupling and audit amplification both elevated');
  }
  if (auditPressureIndex >= 40 && stackMismatchCouplingIndex >= 46) {
    notes.push('Audit pressure reinforcing coupling–amplification fusion');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      stackMismatchCouplingIndex * 0.36 +
        auditStackAmplificationIndex * 0.38 +
        auditPressureIndex * 0.18 +
        (stackMismatchCouplingIndex >= 48 && auditStackAmplificationIndex >= 44 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCouplingAmplificationFusion(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: gap-churn-resonance-index.ts ---
export interface GapChurnResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Friction–alignment gap resonating with persistence churn spikes.
 */
export function computeGapChurnResonanceIndex(
  frictionAlignmentGapIndex: number,
  persistenceChurnIndex: number,
  persistenceGradientFrictionIndex: number,
): GapChurnResonanceReport {
  const notes: string[] = [];
  if (frictionAlignmentGapIndex >= 42 && persistenceChurnIndex >= 38) {
    notes.push('Alignment gap and persistence churn both elevated');
  }
  if (persistenceGradientFrictionIndex >= 44 && frictionAlignmentGapIndex >= 44) {
    notes.push('Gradient friction reinforcing gap–churn resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      frictionAlignmentGapIndex * 0.37 +
        persistenceChurnIndex * 0.35 +
        persistenceGradientFrictionIndex * 0.2 +
        (frictionAlignmentGapIndex >= 46 && persistenceChurnIndex >= 40 ? 15 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamGapChurnResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-friction-convergence-index.ts ---
export interface StackFrictionConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Stack–mismatch coupling converging with friction–alignment gap under weak composite health.
 */
export function computeStackFrictionConvergenceIndex(
  stackMismatchCouplingIndex: number,
  frictionAlignmentGapIndex: number,
  coordinationCompositeScore: number,
): StackFrictionConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackMismatchCouplingIndex >= 42 && frictionAlignmentGapIndex >= 42) {
    notes.push('Stack coupling and friction gap both elevated');
  }
  if (weakComposite && frictionAlignmentGapIndex >= 44) {
    notes.push('Friction gap under depressed coordination composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 60 - coordinationCompositeScore) * 0.4 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      stackMismatchCouplingIndex * 0.35 +
        frictionAlignmentGapIndex * 0.36 +
        compositePenalty +
        (weakComposite && stackMismatchCouplingIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackFrictionConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-resonance-coupling-index.ts ---
export interface FusionResonanceCouplingReport {
  couplingIndex: number;
  notes: string[];
}

/**
 * Coupling–amplification fusion coupled with gap–churn resonance stress.
 */
export function computeFusionResonanceCouplingIndex(
  couplingAmplificationFusionIndex: number,
  gapChurnResonanceIndex: number,
  persistenceChurnIndex: number,
): FusionResonanceCouplingReport {
  const notes: string[] = [];
  if (couplingAmplificationFusionIndex >= 44 && gapChurnResonanceIndex >= 42) {
    notes.push('Fusion and gap–churn resonance both elevated');
  }
  if (persistenceChurnIndex >= 40 && couplingAmplificationFusionIndex >= 46) {
    notes.push('Persistence churn reinforcing fusion–resonance coupling');
  }

  const couplingIndex = Math.round(
    Math.min(
      100,
      couplingAmplificationFusionIndex * 0.38 +
        gapChurnResonanceIndex * 0.36 +
        persistenceChurnIndex * 0.18 +
        (couplingAmplificationFusionIndex >= 48 && gapChurnResonanceIndex >= 44 ? 14 : 0),
    ),
  );

  return { couplingIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceCoupling(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-fusion-stack-index.ts ---
export interface ConvergenceFusionStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–friction convergence stacked with coupling–amplification fusion under escalation.
 */
export function computeConvergenceFusionStackIndex(
  stackFrictionConvergenceIndex: number,
  couplingAmplificationFusionIndex: number,
  coordinationEscalationTier: number,
): ConvergenceFusionStackReport {
  const notes: string[] = [];
  if (stackFrictionConvergenceIndex >= 44 && couplingAmplificationFusionIndex >= 44) {
    notes.push('Convergence and fusion both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackFrictionConvergenceIndex >= 46) {
    notes.push('Stack–friction convergence under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      stackFrictionConvergenceIndex * 0.37 +
        couplingAmplificationFusionIndex * 0.37 +
        coordinationEscalationTier * 7 +
        (stackFrictionConvergenceIndex >= 48 && couplingAmplificationFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceFusionStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-audit-cascade-index.ts ---
export interface ResonanceAuditCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Gap–churn resonance cascading with audit–stack amplification pressure.
 */
export function computeResonanceAuditCascadeIndex(
  gapChurnResonanceIndex: number,
  auditStackAmplificationIndex: number,
  auditPressureIndex: number,
): ResonanceAuditCascadeReport {
  const notes: string[] = [];
  if (gapChurnResonanceIndex >= 42 && auditStackAmplificationIndex >= 42) {
    notes.push('Resonance and audit amplification both elevated');
  }
  if (auditPressureIndex >= 40 && gapChurnResonanceIndex >= 44) {
    notes.push('Audit pressure cascading through gap–churn resonance');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      gapChurnResonanceIndex * 0.35 +
        auditStackAmplificationIndex * 0.36 +
        auditPressureIndex * 0.22 +
        (gapChurnResonanceIndex >= 46 && auditStackAmplificationIndex >= 44 ? 14 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceAuditCascade(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: coupling-stack-cascade-index.ts ---
export interface CouplingStackCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance coupling cascading into convergence–fusion stack pressure.
 */
export function computeCouplingStackCascadeIndex(
  fusionResonanceCouplingIndex: number,
  convergenceFusionStackIndex: number,
  coordinationEscalationTier: number,
): CouplingStackCascadeReport {
  const notes: string[] = [];
  if (fusionResonanceCouplingIndex >= 44 && convergenceFusionStackIndex >= 44) {
    notes.push('Fusion coupling and convergence stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionResonanceCouplingIndex >= 46) {
    notes.push('Coupling–stack cascade under active escalation');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      fusionResonanceCouplingIndex * 0.38 +
        convergenceFusionStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionResonanceCouplingIndex >= 48 && convergenceFusionStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCouplingStackCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-cascade-amplification-index.ts ---
export interface StackCascadeAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Convergence–fusion stack amplified by resonance–audit cascade load.
 */
export function computeStackCascadeAmplificationIndex(
  convergenceFusionStackIndex: number,
  resonanceAuditCascadeIndex: number,
  auditPressureIndex: number,
): StackCascadeAmplificationReport {
  const notes: string[] = [];
  if (convergenceFusionStackIndex >= 44 && resonanceAuditCascadeIndex >= 42) {
    notes.push('Convergence stack and audit cascade both elevated');
  }
  if (auditPressureIndex >= 40 && convergenceFusionStackIndex >= 46) {
    notes.push('Audit pressure amplifying stack–cascade load');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      convergenceFusionStackIndex * 0.36 +
        resonanceAuditCascadeIndex * 0.38 +
        auditPressureIndex * 0.2 +
        (convergenceFusionStackIndex >= 48 && resonanceAuditCascadeIndex >= 44 ? 15 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackCascadeAmplification(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-coupling-synthesis-index.ts ---
export interface CascadeCouplingSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Resonance–audit cascade synthesized with fusion–resonance coupling under composite health.
 */
export function computeCascadeCouplingSynthesisIndex(
  resonanceAuditCascadeIndex: number,
  fusionResonanceCouplingIndex: number,
  coordinationCompositeScore: number,
): CascadeCouplingSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceAuditCascadeIndex >= 44 && fusionResonanceCouplingIndex >= 44) {
    notes.push('Audit cascade and fusion coupling both elevated');
  }
  if (weakComposite && resonanceAuditCascadeIndex >= 46) {
    notes.push('Cascade–coupling synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.35 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      resonanceAuditCascadeIndex * 0.37 +
        fusionResonanceCouplingIndex * 0.35 +
        compositePenalty +
        (weakComposite && fusionResonanceCouplingIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeCouplingSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-synthesis-fusion-index.ts ---
export interface CascadeSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Coupling–stack cascade fused with cascade–coupling synthesis stress.
 */
export function computeCascadeSynthesisFusionIndex(
  couplingStackCascadeIndex: number,
  cascadeCouplingSynthesisIndex: number,
  coordinationCompositeScore: number,
): CascadeSynthesisFusionReport {
  const notes: string[] = [];
  if (couplingStackCascadeIndex >= 44 && cascadeCouplingSynthesisIndex >= 44) {
    notes.push('Stack cascade and coupling synthesis both elevated');
  }
  if (coordinationCompositeScore < 55 && cascadeCouplingSynthesisIndex >= 46) {
    notes.push('Synthesis fusion under depressed coordination composite');
  }

  const compositePenalty =
    coordinationCompositeScore < 55 ? Math.max(0, 60 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      couplingStackCascadeIndex * 0.37 +
        cascadeCouplingSynthesisIndex * 0.38 +
        compositePenalty +
        (couplingStackCascadeIndex >= 48 && cascadeCouplingSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeSynthesisFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: amplification-stack-resonance-index.ts ---
export interface AmplificationStackResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Stack–cascade amplification resonating with convergence–fusion stack load.
 */
export function computeAmplificationStackResonanceIndex(
  stackCascadeAmplificationIndex: number,
  convergenceFusionStackIndex: number,
  gapChurnResonanceIndex: number,
): AmplificationStackResonanceReport {
  const notes: string[] = [];
  if (stackCascadeAmplificationIndex >= 44 && convergenceFusionStackIndex >= 44) {
    notes.push('Cascade amplification and convergence stack both elevated');
  }
  if (gapChurnResonanceIndex >= 42 && stackCascadeAmplificationIndex >= 46) {
    notes.push('Gap–churn resonance reinforcing amplification stack');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      stackCascadeAmplificationIndex * 0.36 +
        convergenceFusionStackIndex * 0.34 +
        gapChurnResonanceIndex * 0.22 +
        (stackCascadeAmplificationIndex >= 48 && convergenceFusionStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAmplificationStackResonance(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-escalation-pressure-index.ts ---
export interface SynthesisEscalationPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Cascade–coupling synthesis pressure stacked with escalation tier and amplification load.
 */
export function computeSynthesisEscalationPressureIndex(
  cascadeCouplingSynthesisIndex: number,
  stackCascadeAmplificationIndex: number,
  coordinationEscalationTier: number,
): SynthesisEscalationPressureReport {
  const notes: string[] = [];
  if (cascadeCouplingSynthesisIndex >= 44 && stackCascadeAmplificationIndex >= 44) {
    notes.push('Coupling synthesis and cascade amplification both elevated');
  }
  if (coordinationEscalationTier >= 2 && cascadeCouplingSynthesisIndex >= 46) {
    notes.push('Synthesis escalation pressure under active tier');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      cascadeCouplingSynthesisIndex * 0.36 +
        stackCascadeAmplificationIndex * 0.36 +
        coordinationEscalationTier * 8 +
        (cascadeCouplingSynthesisIndex >= 48 && stackCascadeAmplificationIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisEscalationPressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-resonance-convergence-index.ts ---
export interface FusionResonanceConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Cascade–synthesis fusion converging with amplification–stack resonance.
 */
export function computeFusionResonanceConvergenceIndex(
  cascadeSynthesisFusionIndex: number,
  amplificationStackResonanceIndex: number,
  fusionResonanceCouplingIndex: number,
): FusionResonanceConvergenceReport {
  const notes: string[] = [];
  if (cascadeSynthesisFusionIndex >= 44 && amplificationStackResonanceIndex >= 44) {
    notes.push('Synthesis fusion and stack resonance both elevated');
  }
  if (fusionResonanceCouplingIndex >= 46 && cascadeSynthesisFusionIndex >= 46) {
    notes.push('Fusion–resonance coupling reinforcing convergence');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      cascadeSynthesisFusionIndex * 0.37 +
        amplificationStackResonanceIndex * 0.37 +
        fusionResonanceCouplingIndex * 0.16 +
        (cascadeSynthesisFusionIndex >= 48 && amplificationStackResonanceIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-fusion-cascade-index.ts ---
export interface PressureFusionCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Synthesis–escalation pressure cascading through cascade–synthesis fusion.
 */
export function computePressureFusionCascadeIndex(
  synthesisEscalationPressureIndex: number,
  cascadeSynthesisFusionIndex: number,
  coordinationEscalationTier: number,
): PressureFusionCascadeReport {
  const notes: string[] = [];
  if (synthesisEscalationPressureIndex >= 44 && cascadeSynthesisFusionIndex >= 44) {
    notes.push('Escalation pressure and synthesis fusion both elevated');
  }
  if (coordinationEscalationTier >= 3 && synthesisEscalationPressureIndex >= 46) {
    notes.push('Pressure–fusion cascade at high escalation tier');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      synthesisEscalationPressureIndex * 0.38 +
        cascadeSynthesisFusionIndex * 0.36 +
        coordinationEscalationTier * 6 +
        (synthesisEscalationPressureIndex >= 48 && cascadeSynthesisFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-pressure-synthesis-index.ts ---
export interface ResonancePressureSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Amplification–stack resonance synthesized with escalation pressure under composite health.
 */
export function computeResonancePressureSynthesisIndex(
  amplificationStackResonanceIndex: number,
  synthesisEscalationPressureIndex: number,
  coordinationCompositeScore: number,
): ResonancePressureSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (amplificationStackResonanceIndex >= 44 && synthesisEscalationPressureIndex >= 44) {
    notes.push('Stack resonance and escalation pressure both elevated');
  }
  if (weakComposite && synthesisEscalationPressureIndex >= 46) {
    notes.push('Resonance–pressure synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.32 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      amplificationStackResonanceIndex * 0.36 +
        synthesisEscalationPressureIndex * 0.38 +
        compositePenalty +
        (weakComposite && amplificationStackResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-cascade-synthesis-index.ts ---
export interface ConvergenceCascadeSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance convergence synthesized with pressure–fusion cascade load.
 */
export function computeConvergenceCascadeSynthesisIndex(
  fusionResonanceConvergenceIndex: number,
  pressureFusionCascadeIndex: number,
  coordinationEscalationTier: number,
): ConvergenceCascadeSynthesisReport {
  const notes: string[] = [];
  if (fusionResonanceConvergenceIndex >= 44 && pressureFusionCascadeIndex >= 44) {
    notes.push('Fusion convergence and pressure cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureFusionCascadeIndex >= 46) {
    notes.push('Convergence–cascade synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      fusionResonanceConvergenceIndex * 0.38 +
        pressureFusionCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionResonanceConvergenceIndex >= 48 && pressureFusionCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceCascadeSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-convergence-stack-index.ts ---
export interface SynthesisConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure synthesis stacked on fusion–resonance convergence.
 */
export function computeSynthesisConvergenceStackIndex(
  resonancePressureSynthesisIndex: number,
  fusionResonanceConvergenceIndex: number,
  cascadeSynthesisFusionIndex: number,
): SynthesisConvergenceStackReport {
  const notes: string[] = [];
  if (resonancePressureSynthesisIndex >= 44 && fusionResonanceConvergenceIndex >= 44) {
    notes.push('Pressure synthesis and fusion convergence both elevated');
  }
  if (cascadeSynthesisFusionIndex >= 46 && resonancePressureSynthesisIndex >= 46) {
    notes.push('Cascade synthesis fusion reinforcing convergence stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      resonancePressureSynthesisIndex * 0.36 +
        fusionResonanceConvergenceIndex * 0.36 +
        cascadeSynthesisFusionIndex * 0.2 +
        (resonancePressureSynthesisIndex >= 48 && fusionResonanceConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisConvergenceStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-resonance-amplification-index.ts ---
export interface CascadeResonanceAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion cascade amplified by resonance–pressure synthesis and audit load.
 */
export function computeCascadeResonanceAmplificationIndex(
  pressureFusionCascadeIndex: number,
  resonancePressureSynthesisIndex: number,
  auditPressureIndex: number,
): CascadeResonanceAmplificationReport {
  const notes: string[] = [];
  if (pressureFusionCascadeIndex >= 44 && resonancePressureSynthesisIndex >= 44) {
    notes.push('Fusion cascade and resonance synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionCascadeIndex >= 46) {
    notes.push('Audit pressure amplifying cascade–resonance load');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      pressureFusionCascadeIndex * 0.36 +
        resonancePressureSynthesisIndex * 0.36 +
        auditPressureIndex * 0.2 +
        (pressureFusionCascadeIndex >= 48 && resonancePressureSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeResonanceAmplification(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-stack-amplification-index.ts ---
export interface SynthesisStackAmplificationReport {
  amplificationIndex: number;
  notes: string[];
}

/**
 * Convergence–cascade synthesis amplified by synthesis–convergence stack load.
 */
export function computeSynthesisStackAmplificationIndex(
  convergenceCascadeSynthesisIndex: number,
  synthesisConvergenceStackIndex: number,
  coordinationEscalationTier: number,
): SynthesisStackAmplificationReport {
  const notes: string[] = [];
  if (convergenceCascadeSynthesisIndex >= 44 && synthesisConvergenceStackIndex >= 44) {
    notes.push('Cascade synthesis and convergence stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisConvergenceStackIndex >= 46) {
    notes.push('Synthesis stack amplification under active escalation');
  }

  const amplificationIndex = Math.round(
    Math.min(
      100,
      convergenceCascadeSynthesisIndex * 0.37 +
        synthesisConvergenceStackIndex * 0.39 +
        coordinationEscalationTier * 5 +
        (convergenceCascadeSynthesisIndex >= 48 && synthesisConvergenceStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { amplificationIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisStackAmplification(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: amplification-convergence-cascade-index.ts ---
export interface AmplificationConvergenceCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Cascade–resonance amplification cascading through convergence–cascade synthesis.
 */
export function computeAmplificationConvergenceCascadeIndex(
  cascadeResonanceAmplificationIndex: number,
  convergenceCascadeSynthesisIndex: number,
  auditPressureIndex: number,
): AmplificationConvergenceCascadeReport {
  const notes: string[] = [];
  if (cascadeResonanceAmplificationIndex >= 44 && convergenceCascadeSynthesisIndex >= 44) {
    notes.push('Resonance amplification and cascade synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeResonanceAmplificationIndex >= 46) {
    notes.push('Audit pressure driving amplification–convergence cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      cascadeResonanceAmplificationIndex * 0.38 +
        convergenceCascadeSynthesisIndex * 0.36 +
        auditPressureIndex * 0.18 +
        (cascadeResonanceAmplificationIndex >= 48 && convergenceCascadeSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamAmplificationConvergenceCascade(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-synthesis-resonance-index.ts ---
export interface StackSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Synthesis–convergence stack resonating with cascade–resonance amplification under composite health.
 */
export function computeStackSynthesisResonanceIndex(
  synthesisConvergenceStackIndex: number,
  cascadeResonanceAmplificationIndex: number,
  coordinationCompositeScore: number,
): StackSynthesisResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisConvergenceStackIndex >= 44 && cascadeResonanceAmplificationIndex >= 44) {
    notes.push('Convergence stack and resonance amplification both elevated');
  }
  if (weakComposite && synthesisConvergenceStackIndex >= 46) {
    notes.push('Stack–synthesis resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      synthesisConvergenceStackIndex * 0.37 +
        cascadeResonanceAmplificationIndex * 0.37 +
        compositePenalty +
        (weakComposite && cascadeResonanceAmplificationIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-amplification-cascade-fusion-index.ts ---
export interface StackAmplificationCascadeFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–stack amplification fused with amplification–convergence cascade load.
 */
export function computeStackAmplificationCascadeFusionIndex(
  synthesisStackAmplificationIndex: number,
  amplificationConvergenceCascadeIndex: number,
  coordinationEscalationTier: number,
): StackAmplificationCascadeFusionReport {
  const notes: string[] = [];
  if (synthesisStackAmplificationIndex >= 44 && amplificationConvergenceCascadeIndex >= 44) {
    notes.push('Stack amplification and convergence cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisStackAmplificationIndex >= 46) {
    notes.push('Amplification–cascade fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisStackAmplificationIndex * 0.38 +
        amplificationConvergenceCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (synthesisStackAmplificationIndex >= 48 && amplificationConvergenceCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackAmplificationCascadeFusion(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-amplification-stack-index.ts ---
export interface ResonanceAmplificationStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis resonance stacked on synthesis–stack amplification pressure.
 */
export function computeResonanceAmplificationStackIndex(
  stackSynthesisResonanceIndex: number,
  synthesisStackAmplificationIndex: number,
  convergenceCascadeSynthesisIndex: number,
): ResonanceAmplificationStackReport {
  const notes: string[] = [];
  if (stackSynthesisResonanceIndex >= 44 && synthesisStackAmplificationIndex >= 44) {
    notes.push('Synthesis resonance and stack amplification both elevated');
  }
  if (convergenceCascadeSynthesisIndex >= 46 && stackSynthesisResonanceIndex >= 46) {
    notes.push('Cascade synthesis reinforcing resonance–amplification stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      stackSynthesisResonanceIndex * 0.37 +
        synthesisStackAmplificationIndex * 0.37 +
        convergenceCascadeSynthesisIndex * 0.18 +
        (stackSynthesisResonanceIndex >= 48 && synthesisStackAmplificationIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceAmplificationStack(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-convergence-resonance-index.ts ---
export interface CascadeConvergenceResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Amplification–convergence cascade converging with stack–synthesis resonance under audit load.
 */
export function computeCascadeConvergenceResonanceIndex(
  amplificationConvergenceCascadeIndex: number,
  stackSynthesisResonanceIndex: number,
  auditPressureIndex: number,
): CascadeConvergenceResonanceReport {
  const notes: string[] = [];
  if (amplificationConvergenceCascadeIndex >= 44 && stackSynthesisResonanceIndex >= 44) {
    notes.push('Convergence cascade and synthesis resonance both elevated');
  }
  if (auditPressureIndex >= 40 && amplificationConvergenceCascadeIndex >= 46) {
    notes.push('Audit pressure driving cascade–convergence resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      amplificationConvergenceCascadeIndex * 0.36 +
        stackSynthesisResonanceIndex * 0.38 +
        auditPressureIndex * 0.2 +
        (amplificationConvergenceCascadeIndex >= 48 && stackSynthesisResonanceIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeConvergenceResonance(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-stack-convergence-index.ts ---
export interface FusionStackConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Stack–amplification cascade fusion converging with resonance–amplification stack.
 */
export function computeFusionStackConvergenceIndex(
  stackAmplificationCascadeFusionIndex: number,
  resonanceAmplificationStackIndex: number,
  coordinationEscalationTier: number,
): FusionStackConvergenceReport {
  const notes: string[] = [];
  if (stackAmplificationCascadeFusionIndex >= 44 && resonanceAmplificationStackIndex >= 44) {
    notes.push('Cascade fusion and amplification stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackAmplificationCascadeFusionIndex >= 46) {
    notes.push('Fusion–stack convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      stackAmplificationCascadeFusionIndex * 0.38 +
        resonanceAmplificationStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackAmplificationCascadeFusionIndex >= 48 && resonanceAmplificationStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-cascade-synthesis-index.ts ---
export interface ResonanceCascadeSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Cascade–convergence resonance synthesized with stack–amplification cascade fusion.
 */
export function computeResonanceCascadeSynthesisIndex(
  cascadeConvergenceResonanceIndex: number,
  stackAmplificationCascadeFusionIndex: number,
  auditPressureIndex: number,
): ResonanceCascadeSynthesisReport {
  const notes: string[] = [];
  if (cascadeConvergenceResonanceIndex >= 44 && stackAmplificationCascadeFusionIndex >= 44) {
    notes.push('Convergence resonance and cascade fusion both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeConvergenceResonanceIndex >= 46) {
    notes.push('Audit pressure reinforcing resonance–cascade synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      cascadeConvergenceResonanceIndex * 0.37 +
        stackAmplificationCascadeFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (cascadeConvergenceResonanceIndex >= 48 && stackAmplificationCascadeFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceCascadeSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-amplification-pressure-index.ts ---
export interface ConvergenceAmplificationPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–amplification stack pressure converging with cascade–convergence resonance under composite health.
 */
export function computeConvergenceAmplificationPressureIndex(
  resonanceAmplificationStackIndex: number,
  cascadeConvergenceResonanceIndex: number,
  coordinationCompositeScore: number,
): ConvergenceAmplificationPressureReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceAmplificationStackIndex >= 44 && cascadeConvergenceResonanceIndex >= 44) {
    notes.push('Amplification stack and convergence resonance both elevated');
  }
  if (weakComposite && resonanceAmplificationStackIndex >= 46) {
    notes.push('Convergence amplification pressure under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.32 : 0;
  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceAmplificationStackIndex * 0.36 +
        cascadeConvergenceResonanceIndex * 0.38 +
        compositePenalty +
        (weakComposite && cascadeConvergenceResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceAmplificationPressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-synthesis-fusion-index.ts ---
export interface ConvergenceSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Fusion–stack convergence fused with resonance–cascade synthesis stress.
 */
export function computeConvergenceSynthesisFusionIndex(
  fusionStackConvergenceIndex: number,
  resonanceCascadeSynthesisIndex: number,
  coordinationEscalationTier: number,
): ConvergenceSynthesisFusionReport {
  const notes: string[] = [];
  if (fusionStackConvergenceIndex >= 44 && resonanceCascadeSynthesisIndex >= 44) {
    notes.push('Stack convergence and cascade synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionStackConvergenceIndex >= 46) {
    notes.push('Convergence–synthesis fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      fusionStackConvergenceIndex * 0.38 +
        resonanceCascadeSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionStackConvergenceIndex >= 48 && resonanceCascadeSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceSynthesisFusion(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-cascade-stack-index.ts ---
export interface PressureCascadeStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Convergence–amplification pressure stacked on fusion–stack convergence load.
 */
export function computePressureCascadeStackIndex(
  convergenceAmplificationPressureIndex: number,
  fusionStackConvergenceIndex: number,
  stackAmplificationCascadeFusionIndex: number,
): PressureCascadeStackReport {
  const notes: string[] = [];
  if (convergenceAmplificationPressureIndex >= 44 && fusionStackConvergenceIndex >= 44) {
    notes.push('Amplification pressure and stack convergence both elevated');
  }
  if (stackAmplificationCascadeFusionIndex >= 46 && convergenceAmplificationPressureIndex >= 46) {
    notes.push('Cascade fusion reinforcing pressure–cascade stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      convergenceAmplificationPressureIndex * 0.37 +
        fusionStackConvergenceIndex * 0.37 +
        stackAmplificationCascadeFusionIndex * 0.18 +
        (convergenceAmplificationPressureIndex >= 48 && fusionStackConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureCascadeStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-pressure-resonance-index.ts ---
export interface SynthesisPressureResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Resonance–cascade synthesis resonating with convergence–amplification pressure under audit load.
 */
export function computeSynthesisPressureResonanceIndex(
  resonanceCascadeSynthesisIndex: number,
  convergenceAmplificationPressureIndex: number,
  auditPressureIndex: number,
): SynthesisPressureResonanceReport {
  const notes: string[] = [];
  if (resonanceCascadeSynthesisIndex >= 44 && convergenceAmplificationPressureIndex >= 44) {
    notes.push('Cascade synthesis and amplification pressure both elevated');
  }
  if (auditPressureIndex >= 40 && resonanceCascadeSynthesisIndex >= 46) {
    notes.push('Audit pressure driving synthesis–pressure resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      resonanceCascadeSynthesisIndex * 0.37 +
        convergenceAmplificationPressureIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonanceCascadeSynthesisIndex >= 48 && convergenceAmplificationPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisPressureResonance(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-cascade-stack-index.ts ---
export interface FusionCascadeStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Convergence–synthesis fusion stacked with pressure–cascade stack under escalation.
 */
export function computeFusionCascadeStackIndex(
  convergenceSynthesisFusionIndex: number,
  pressureCascadeStackIndex: number,
  coordinationEscalationTier: number,
): FusionCascadeStackReport {
  const notes: string[] = [];
  if (convergenceSynthesisFusionIndex >= 44 && pressureCascadeStackIndex >= 44) {
    notes.push('Synthesis fusion and pressure–cascade stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureCascadeStackIndex >= 46) {
    notes.push('Fusion–cascade stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      convergenceSynthesisFusionIndex * 0.38 +
        pressureCascadeStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergenceSynthesisFusionIndex >= 48 && pressureCascadeStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadeStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-pressure-cascade-index.ts ---
export interface ResonancePressureCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Synthesis–pressure resonance cascading with pressure–cascade stack load.
 */
export function computeResonancePressureCascadeIndex(
  synthesisPressureResonanceIndex: number,
  pressureCascadeStackIndex: number,
  auditPressureIndex: number,
): ResonancePressureCascadeReport {
  const notes: string[] = [];
  if (synthesisPressureResonanceIndex >= 44 && pressureCascadeStackIndex >= 44) {
    notes.push('Pressure resonance and cascade stack both elevated');
  }
  if (auditPressureIndex >= 40 && synthesisPressureResonanceIndex >= 46) {
    notes.push('Audit pressure driving resonance–pressure cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      synthesisPressureResonanceIndex * 0.37 +
        pressureCascadeStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (synthesisPressureResonanceIndex >= 48 && pressureCascadeStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-fusion-convergence-index.ts ---
export interface SynthesisFusionConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Convergence–synthesis fusion converging with synthesis–pressure resonance under composite health.
 */
export function computeSynthesisFusionConvergenceIndex(
  convergenceSynthesisFusionIndex: number,
  synthesisPressureResonanceIndex: number,
  coordinationCompositeScore: number,
): SynthesisFusionConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergenceSynthesisFusionIndex >= 44 && synthesisPressureResonanceIndex >= 44) {
    notes.push('Synthesis fusion and pressure resonance both elevated');
  }
  if (weakComposite && convergenceSynthesisFusionIndex >= 46) {
    notes.push('Synthesis–fusion convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      convergenceSynthesisFusionIndex * 0.37 +
        synthesisPressureResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && synthesisPressureResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisFusionConvergence(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-cascade-resonance-index.ts ---
export interface StackCascadeResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade stack resonating with resonance–pressure cascade under escalation.
 */
export function computeStackCascadeResonanceIndex(
  fusionCascadeStackIndex: number,
  resonancePressureCascadeIndex: number,
  coordinationEscalationTier: number,
): StackCascadeResonanceReport {
  const notes: string[] = [];
  if (fusionCascadeStackIndex >= 44 && resonancePressureCascadeIndex >= 44) {
    notes.push('Cascade stack and pressure cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionCascadeStackIndex >= 46) {
    notes.push('Stack–cascade resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      fusionCascadeStackIndex * 0.38 +
        resonancePressureCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionCascadeStackIndex >= 48 && resonancePressureCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackCascadeResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-convergence-pressure-index.ts ---
export interface CascadeConvergencePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure cascade pressuring synthesis–fusion convergence under audit load.
 */
export function computeCascadeConvergencePressureIndex(
  resonancePressureCascadeIndex: number,
  synthesisFusionConvergenceIndex: number,
  auditPressureIndex: number,
): CascadeConvergencePressureReport {
  const notes: string[] = [];
  if (resonancePressureCascadeIndex >= 44 && synthesisFusionConvergenceIndex >= 44) {
    notes.push('Pressure cascade and fusion convergence both elevated');
  }
  if (auditPressureIndex >= 40 && resonancePressureCascadeIndex >= 46) {
    notes.push('Audit pressure driving cascade–convergence pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonancePressureCascadeIndex * 0.37 +
        synthesisFusionConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonancePressureCascadeIndex >= 48 && synthesisFusionConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeConvergencePressure(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-fusion-synthesis-index.ts ---
export interface ConvergenceFusionSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Synthesis–fusion convergence synthesizing with fusion–cascade stack under composite health.
 */
export function computeConvergenceFusionSynthesisIndex(
  synthesisFusionConvergenceIndex: number,
  fusionCascadeStackIndex: number,
  coordinationCompositeScore: number,
): ConvergenceFusionSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisFusionConvergenceIndex >= 44 && fusionCascadeStackIndex >= 44) {
    notes.push('Fusion convergence and cascade stack both elevated');
  }
  if (weakComposite && synthesisFusionConvergenceIndex >= 46) {
    notes.push('Convergence–fusion synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      synthesisFusionConvergenceIndex * 0.37 +
        fusionCascadeStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionCascadeStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceFusionSynthesis(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-convergence-fusion-index.ts ---
export interface ResonanceConvergenceFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Stack–cascade resonance fusing with cascade–convergence pressure under escalation.
 */
export function computeResonanceConvergenceFusionIndex(
  stackCascadeResonanceIndex: number,
  cascadeConvergencePressureIndex: number,
  coordinationEscalationTier: number,
): ResonanceConvergenceFusionReport {
  const notes: string[] = [];
  if (stackCascadeResonanceIndex >= 44 && cascadeConvergencePressureIndex >= 44) {
    notes.push('Stack resonance and convergence pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackCascadeResonanceIndex >= 46) {
    notes.push('Resonance–convergence fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      stackCascadeResonanceIndex * 0.38 +
        cascadeConvergencePressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackCascadeResonanceIndex >= 48 && cascadeConvergencePressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceConvergenceFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-synthesis-cascade-index.ts ---
export interface PressureSynthesisCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Cascade–convergence pressure cascading with convergence–fusion synthesis under audit load.
 */
export function computePressureSynthesisCascadeIndex(
  cascadeConvergencePressureIndex: number,
  convergenceFusionSynthesisIndex: number,
  auditPressureIndex: number,
): PressureSynthesisCascadeReport {
  const notes: string[] = [];
  if (cascadeConvergencePressureIndex >= 44 && convergenceFusionSynthesisIndex >= 44) {
    notes.push('Convergence pressure and fusion synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeConvergencePressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–synthesis cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      cascadeConvergencePressureIndex * 0.37 +
        convergenceFusionSynthesisIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (cascadeConvergencePressureIndex >= 48 && convergenceFusionSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureSynthesisCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-resonance-stack-index.ts ---
export interface SynthesisResonanceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Convergence–fusion synthesis stacking with stack–cascade resonance under composite health.
 */
export function computeSynthesisResonanceStackIndex(
  convergenceFusionSynthesisIndex: number,
  stackCascadeResonanceIndex: number,
  coordinationCompositeScore: number,
): SynthesisResonanceStackReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergenceFusionSynthesisIndex >= 44 && stackCascadeResonanceIndex >= 44) {
    notes.push('Fusion synthesis and stack resonance both elevated');
  }
  if (weakComposite && convergenceFusionSynthesisIndex >= 46) {
    notes.push('Synthesis–resonance stack under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const stackIndex = Math.round(
    Math.min(
      100,
      convergenceFusionSynthesisIndex * 0.37 +
        stackCascadeResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && stackCascadeResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisResonanceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-fusion-pressure-index.ts ---
export interface ConvergenceFusionPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–convergence fusion pressuring pressure–synthesis cascade under escalation.
 */
export function computeConvergenceFusionPressureIndex(
  resonanceConvergenceFusionIndex: number,
  pressureSynthesisCascadeIndex: number,
  coordinationEscalationTier: number,
): ConvergenceFusionPressureReport {
  const notes: string[] = [];
  if (resonanceConvergenceFusionIndex >= 44 && pressureSynthesisCascadeIndex >= 44) {
    notes.push('Convergence fusion and synthesis cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonanceConvergenceFusionIndex >= 46) {
    notes.push('Convergence–fusion pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceConvergenceFusionIndex * 0.38 +
        pressureSynthesisCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceConvergenceFusionIndex >= 48 && pressureSynthesisCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceFusionPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-cascade-stack-index.ts ---
export interface SynthesisCascadeStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Pressure–synthesis cascade stacking with synthesis–resonance stack under audit load.
 */
export function computeSynthesisCascadeStackIndex(
  pressureSynthesisCascadeIndex: number,
  synthesisResonanceStackIndex: number,
  auditPressureIndex: number,
): SynthesisCascadeStackReport {
  const notes: string[] = [];
  if (pressureSynthesisCascadeIndex >= 44 && synthesisResonanceStackIndex >= 44) {
    notes.push('Synthesis cascade and resonance stack both elevated');
  }
  if (auditPressureIndex >= 40 && pressureSynthesisCascadeIndex >= 46) {
    notes.push('Audit pressure driving synthesis–cascade stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      pressureSynthesisCascadeIndex * 0.37 +
        synthesisResonanceStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureSynthesisCascadeIndex >= 48 && synthesisResonanceStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisCascadeStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-stack-fusion-index.ts ---
export interface ResonanceStackFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–resonance stack fusing with resonance–convergence fusion under composite health.
 */
export function computeResonanceStackFusionIndex(
  synthesisResonanceStackIndex: number,
  resonanceConvergenceFusionIndex: number,
  coordinationCompositeScore: number,
): ResonanceStackFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisResonanceStackIndex >= 44 && resonanceConvergenceFusionIndex >= 44) {
    notes.push('Resonance stack and convergence fusion both elevated');
  }
  if (weakComposite && synthesisResonanceStackIndex >= 46) {
    notes.push('Resonance–stack fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisResonanceStackIndex * 0.37 +
        resonanceConvergenceFusionIndex * 0.37 +
        compositePenalty +
        (weakComposite && resonanceConvergenceFusionIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceStackFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-stack-resonance-index.ts ---
export interface PressureStackResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Convergence–fusion pressure resonating with synthesis–cascade stack under escalation.
 */
export function computePressureStackResonanceIndex(
  convergenceFusionPressureIndex: number,
  synthesisCascadeStackIndex: number,
  coordinationEscalationTier: number,
): PressureStackResonanceReport {
  const notes: string[] = [];
  if (convergenceFusionPressureIndex >= 44 && synthesisCascadeStackIndex >= 44) {
    notes.push('Fusion pressure and cascade stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergenceFusionPressureIndex >= 46) {
    notes.push('Pressure–stack resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      convergenceFusionPressureIndex * 0.38 +
        synthesisCascadeStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergenceFusionPressureIndex >= 48 && synthesisCascadeStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureStackResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-fusion-cascade-index.ts ---
export interface StackFusionCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Synthesis–cascade stack cascading with resonance–stack fusion under audit load.
 */
export function computeStackFusionCascadeIndex(
  synthesisCascadeStackIndex: number,
  resonanceStackFusionIndex: number,
  auditPressureIndex: number,
): StackFusionCascadeReport {
  const notes: string[] = [];
  if (synthesisCascadeStackIndex >= 44 && resonanceStackFusionIndex >= 44) {
    notes.push('Cascade stack and stack fusion both elevated');
  }
  if (auditPressureIndex >= 40 && synthesisCascadeStackIndex >= 46) {
    notes.push('Audit pressure driving stack–fusion cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      synthesisCascadeStackIndex * 0.37 +
        resonanceStackFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (synthesisCascadeStackIndex >= 48 && resonanceStackFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackFusionCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-cascade-convergence-index.ts ---
export interface FusionCascadeConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Resonance–stack fusion converging with convergence–fusion pressure under composite health.
 */
export function computeFusionCascadeConvergenceIndex(
  resonanceStackFusionIndex: number,
  convergenceFusionPressureIndex: number,
  coordinationCompositeScore: number,
): FusionCascadeConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceStackFusionIndex >= 44 && convergenceFusionPressureIndex >= 44) {
    notes.push('Stack fusion and fusion pressure both elevated');
  }
  if (weakComposite && resonanceStackFusionIndex >= 46) {
    notes.push('Fusion–cascade convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      resonanceStackFusionIndex * 0.37 +
        convergenceFusionPressureIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergenceFusionPressureIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadeConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-fusion-stack-index.ts ---
export interface ResonanceFusionStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Pressure–stack resonance stacking with stack–fusion cascade under escalation.
 */
export function computeResonanceFusionStackIndex(
  pressureStackResonanceIndex: number,
  stackFusionCascadeIndex: number,
  coordinationEscalationTier: number,
): ResonanceFusionStackReport {
  const notes: string[] = [];
  if (pressureStackResonanceIndex >= 44 && stackFusionCascadeIndex >= 44) {
    notes.push('Stack resonance and fusion cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureStackResonanceIndex >= 46) {
    notes.push('Resonance–fusion stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      pressureStackResonanceIndex * 0.38 +
        stackFusionCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (pressureStackResonanceIndex >= 48 && stackFusionCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceFusionStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-cascade-pressure-index.ts ---
export interface FusionCascadePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Stack–fusion cascade pressuring fusion–cascade convergence under audit load.
 */
export function computeFusionCascadePressureIndex(
  stackFusionCascadeIndex: number,
  fusionCascadeConvergenceIndex: number,
  auditPressureIndex: number,
): FusionCascadePressureReport {
  const notes: string[] = [];
  if (stackFusionCascadeIndex >= 44 && fusionCascadeConvergenceIndex >= 44) {
    notes.push('Fusion cascade and cascade convergence both elevated');
  }
  if (auditPressureIndex >= 40 && stackFusionCascadeIndex >= 46) {
    notes.push('Audit pressure driving fusion–cascade pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      stackFusionCascadeIndex * 0.37 +
        fusionCascadeConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (stackFusionCascadeIndex >= 48 && fusionCascadeConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-convergence-resonance-index.ts ---
export interface StackConvergenceResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade convergence resonating with pressure–stack resonance under composite health.
 */
export function computeStackConvergenceResonanceIndex(
  fusionCascadeConvergenceIndex: number,
  pressureStackResonanceIndex: number,
  coordinationCompositeScore: number,
): StackConvergenceResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionCascadeConvergenceIndex >= 44 && pressureStackResonanceIndex >= 44) {
    notes.push('Cascade convergence and stack resonance both elevated');
  }
  if (weakComposite && fusionCascadeConvergenceIndex >= 46) {
    notes.push('Stack–convergence resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      fusionCascadeConvergenceIndex * 0.37 +
        pressureStackResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && pressureStackResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackConvergenceResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-stack-pressure-index.ts ---
export interface FusionStackPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–fusion stack pressuring fusion–cascade pressure under escalation.
 */
export function computeFusionStackPressureIndex(
  resonanceFusionStackIndex: number,
  fusionCascadePressureIndex: number,
  coordinationEscalationTier: number,
): FusionStackPressureReport {
  const notes: string[] = [];
  if (resonanceFusionStackIndex >= 44 && fusionCascadePressureIndex >= 44) {
    notes.push('Fusion stack and cascade pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonanceFusionStackIndex >= 46) {
    notes.push('Fusion–stack pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceFusionStackIndex * 0.38 +
        fusionCascadePressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceFusionStackIndex >= 48 && fusionCascadePressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-resonance-cascade-index.ts ---
export interface PressureResonanceCascadeReport {
  cascadeIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade pressure cascading with stack–convergence resonance under audit load.
 */
export function computePressureResonanceCascadeIndex(
  fusionCascadePressureIndex: number,
  stackConvergenceResonanceIndex: number,
  auditPressureIndex: number,
): PressureResonanceCascadeReport {
  const notes: string[] = [];
  if (fusionCascadePressureIndex >= 44 && stackConvergenceResonanceIndex >= 44) {
    notes.push('Cascade pressure and convergence resonance both elevated');
  }
  if (auditPressureIndex >= 40 && fusionCascadePressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–resonance cascade');
  }

  const cascadeIndex = Math.round(
    Math.min(
      100,
      fusionCascadePressureIndex * 0.37 +
        stackConvergenceResonanceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (fusionCascadePressureIndex >= 48 && stackConvergenceResonanceIndex >= 46 ? 15 : 0),
    ),
  );

  return { cascadeIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureResonanceCascade(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-synthesis-convergence-index.ts ---
export interface StackSynthesisConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Stack–convergence resonance converging with resonance–fusion stack under composite health.
 */
export function computeStackSynthesisConvergenceIndex(
  stackConvergenceResonanceIndex: number,
  resonanceFusionStackIndex: number,
  coordinationCompositeScore: number,
): StackSynthesisConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackConvergenceResonanceIndex >= 44 && resonanceFusionStackIndex >= 44) {
    notes.push('Convergence resonance and fusion stack both elevated');
  }
  if (weakComposite && stackConvergenceResonanceIndex >= 46) {
    notes.push('Stack–synthesis convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      stackConvergenceResonanceIndex * 0.37 +
        resonanceFusionStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && resonanceFusionStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-cascade-fusion-index.ts ---
export interface PressureCascadeFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Fusion–stack pressure fusing with pressure–resonance cascade under escalation.
 */
export function computePressureCascadeFusionIndex(
  fusionStackPressureIndex: number,
  pressureResonanceCascadeIndex: number,
  coordinationEscalationTier: number,
): PressureCascadeFusionReport {
  const notes: string[] = [];
  if (fusionStackPressureIndex >= 44 && pressureResonanceCascadeIndex >= 44) {
    notes.push('Stack pressure and resonance cascade both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionStackPressureIndex >= 46) {
    notes.push('Pressure–cascade fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      fusionStackPressureIndex * 0.38 +
        pressureResonanceCascadeIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionStackPressureIndex >= 48 && pressureResonanceCascadeIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureCascadeFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-synthesis-resonance-index.ts ---
export interface CascadeSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Pressure–resonance cascade resonating with stack–synthesis convergence under audit load.
 */
export function computeCascadeSynthesisResonanceIndex(
  pressureResonanceCascadeIndex: number,
  stackSynthesisConvergenceIndex: number,
  auditPressureIndex: number,
): CascadeSynthesisResonanceReport {
  const notes: string[] = [];
  if (pressureResonanceCascadeIndex >= 44 && stackSynthesisConvergenceIndex >= 44) {
    notes.push('Resonance cascade and synthesis convergence both elevated');
  }
  if (auditPressureIndex >= 40 && pressureResonanceCascadeIndex >= 46) {
    notes.push('Audit pressure driving cascade–synthesis resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      pressureResonanceCascadeIndex * 0.37 +
        stackSynthesisConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureResonanceCascadeIndex >= 48 && stackSynthesisConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-pressure-stack-index.ts ---
export interface ConvergencePressureStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis convergence stacking with fusion–stack pressure under composite health.
 */
export function computeConvergencePressureStackIndex(
  stackSynthesisConvergenceIndex: number,
  fusionStackPressureIndex: number,
  coordinationCompositeScore: number,
): ConvergencePressureStackReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackSynthesisConvergenceIndex >= 44 && fusionStackPressureIndex >= 44) {
    notes.push('Synthesis convergence and stack pressure both elevated');
  }
  if (weakComposite && stackSynthesisConvergenceIndex >= 46) {
    notes.push('Convergence–pressure stack under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const stackIndex = Math.round(
    Math.min(
      100,
      stackSynthesisConvergenceIndex * 0.37 +
        fusionStackPressureIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionStackPressureIndex >= 48 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergencePressureStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-cascade-resonance-index.ts ---
export interface FusionCascadeResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Pressure–cascade fusion resonating with cascade–synthesis resonance under escalation.
 */
export function computeFusionCascadeResonanceIndex(
  pressureCascadeFusionIndex: number,
  cascadeSynthesisResonanceIndex: number,
  coordinationEscalationTier: number,
): FusionCascadeResonanceReport {
  const notes: string[] = [];
  if (pressureCascadeFusionIndex >= 44 && cascadeSynthesisResonanceIndex >= 44) {
    notes.push('Cascade fusion and synthesis resonance both elevated');
  }
  if (coordinationEscalationTier >= 2 && pressureCascadeFusionIndex >= 46) {
    notes.push('Fusion–cascade resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      pressureCascadeFusionIndex * 0.38 +
        cascadeSynthesisResonanceIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (pressureCascadeFusionIndex >= 48 && cascadeSynthesisResonanceIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionCascadeResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-pressure-stack-index.ts ---
export interface ResonancePressureStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Cascade–synthesis resonance stacking with convergence–pressure stack under audit load.
 */
export function computeResonancePressureStackIndex(
  cascadeSynthesisResonanceIndex: number,
  convergencePressureStackIndex: number,
  auditPressureIndex: number,
): ResonancePressureStackReport {
  const notes: string[] = [];
  if (cascadeSynthesisResonanceIndex >= 44 && convergencePressureStackIndex >= 44) {
    notes.push('Synthesis resonance and pressure stack both elevated');
  }
  if (auditPressureIndex >= 40 && cascadeSynthesisResonanceIndex >= 46) {
    notes.push('Audit pressure driving resonance–pressure stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      cascadeSynthesisResonanceIndex * 0.37 +
        convergencePressureStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (cascadeSynthesisResonanceIndex >= 48 && convergencePressureStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-synthesis-fusion-index.ts ---
export interface StackSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Convergence–pressure stack fusing with pressure–cascade fusion under composite health.
 */
export function computeStackSynthesisFusionIndex(
  convergencePressureStackIndex: number,
  pressureCascadeFusionIndex: number,
  coordinationCompositeScore: number,
): StackSynthesisFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergencePressureStackIndex >= 44 && pressureCascadeFusionIndex >= 44) {
    notes.push('Pressure stack and cascade fusion both elevated');
  }
  if (weakComposite && convergencePressureStackIndex >= 46) {
    notes.push('Stack–synthesis fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      convergencePressureStackIndex * 0.37 +
        pressureCascadeFusionIndex * 0.37 +
        compositePenalty +
        (weakComposite && pressureCascadeFusionIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-resonance-stack-index.ts ---
export interface CascadeResonanceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Fusion–cascade resonance stacking with resonance–pressure stack under escalation.
 */
export function computeCascadeResonanceStackIndex(
  fusionCascadeResonanceIndex: number,
  resonancePressureStackIndex: number,
  coordinationEscalationTier: number,
): CascadeResonanceStackReport {
  const notes: string[] = [];
  if (fusionCascadeResonanceIndex >= 44 && resonancePressureStackIndex >= 44) {
    notes.push('Cascade resonance and pressure stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionCascadeResonanceIndex >= 46) {
    notes.push('Cascade–resonance stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      fusionCascadeResonanceIndex * 0.38 +
        resonancePressureStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionCascadeResonanceIndex >= 48 && resonancePressureStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeResonanceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-fusion-pressure-index.ts ---
export interface ResonanceFusionPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure stack pressuring stack–synthesis fusion under audit load.
 */
export function computeResonanceFusionPressureIndex(
  resonancePressureStackIndex: number,
  stackSynthesisFusionIndex: number,
  auditPressureIndex: number,
): ResonanceFusionPressureReport {
  const notes: string[] = [];
  if (resonancePressureStackIndex >= 44 && stackSynthesisFusionIndex >= 44) {
    notes.push('Pressure stack and synthesis fusion both elevated');
  }
  if (auditPressureIndex >= 40 && resonancePressureStackIndex >= 46) {
    notes.push('Audit pressure driving resonance–fusion pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonancePressureStackIndex * 0.37 +
        stackSynthesisFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonancePressureStackIndex >= 48 && stackSynthesisFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceFusionPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-convergence-synthesis-index.ts ---
export interface FusionConvergenceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis fusion synthesizing with fusion–cascade resonance under composite health.
 */
export function computeFusionConvergenceSynthesisIndex(
  stackSynthesisFusionIndex: number,
  fusionCascadeResonanceIndex: number,
  coordinationCompositeScore: number,
): FusionConvergenceSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (stackSynthesisFusionIndex >= 44 && fusionCascadeResonanceIndex >= 44) {
    notes.push('Synthesis fusion and cascade resonance both elevated');
  }
  if (weakComposite && stackSynthesisFusionIndex >= 46) {
    notes.push('Fusion–convergence synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      stackSynthesisFusionIndex * 0.37 +
        fusionCascadeResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionCascadeResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionConvergenceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-resonance-pressure-index.ts ---
export interface StackResonancePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Cascade–resonance stack pressuring resonance–fusion pressure under escalation.
 */
export function computeStackResonancePressureIndex(
  cascadeResonanceStackIndex: number,
  resonanceFusionPressureIndex: number,
  coordinationEscalationTier: number,
): StackResonancePressureReport {
  const notes: string[] = [];
  if (cascadeResonanceStackIndex >= 44 && resonanceFusionPressureIndex >= 44) {
    notes.push('Resonance stack and fusion pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && cascadeResonanceStackIndex >= 46) {
    notes.push('Stack–resonance pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      cascadeResonanceStackIndex * 0.38 +
        resonanceFusionPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (cascadeResonanceStackIndex >= 48 && resonanceFusionPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackResonancePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-fusion-synthesis-index.ts ---
export interface PressureFusionSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Resonance–fusion pressure synthesizing with fusion–convergence synthesis under audit load.
 */
export function computePressureFusionSynthesisIndex(
  resonanceFusionPressureIndex: number,
  fusionConvergenceSynthesisIndex: number,
  auditPressureIndex: number,
): PressureFusionSynthesisReport {
  const notes: string[] = [];
  if (resonanceFusionPressureIndex >= 44 && fusionConvergenceSynthesisIndex >= 44) {
    notes.push('Fusion pressure and convergence synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && resonanceFusionPressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–fusion synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      resonanceFusionPressureIndex * 0.37 +
        fusionConvergenceSynthesisIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonanceFusionPressureIndex >= 48 && fusionConvergenceSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-stack-convergence-index.ts ---
export interface SynthesisStackConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–convergence synthesis converging with cascade–resonance stack under composite health.
 */
export function computeSynthesisStackConvergenceIndex(
  fusionConvergenceSynthesisIndex: number,
  cascadeResonanceStackIndex: number,
  coordinationCompositeScore: number,
): SynthesisStackConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionConvergenceSynthesisIndex >= 44 && cascadeResonanceStackIndex >= 44) {
    notes.push('Convergence synthesis and resonance stack both elevated');
  }
  if (weakComposite && fusionConvergenceSynthesisIndex >= 46) {
    notes.push('Synthesis–stack convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionConvergenceSynthesisIndex * 0.37 +
        cascadeResonanceStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && cascadeResonanceStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisStackConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-fusion-resonance-index.ts ---
export interface StackFusionResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Stack–resonance pressure resonating with pressure–fusion synthesis under escalation.
 */
export function computeStackFusionResonanceIndex(
  stackResonancePressureIndex: number,
  pressureFusionSynthesisIndex: number,
  coordinationEscalationTier: number,
): StackFusionResonanceReport {
  const notes: string[] = [];
  if (stackResonancePressureIndex >= 44 && pressureFusionSynthesisIndex >= 44) {
    notes.push('Resonance pressure and fusion synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackResonancePressureIndex >= 46) {
    notes.push('Stack–fusion resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      stackResonancePressureIndex * 0.38 +
        pressureFusionSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackResonancePressureIndex >= 48 && pressureFusionSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackFusionResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-synthesis-pressure-index.ts ---
export interface FusionSynthesisPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion synthesis pressuring synthesis–stack convergence under audit load.
 */
export function computeFusionSynthesisPressureIndex(
  pressureFusionSynthesisIndex: number,
  synthesisStackConvergenceIndex: number,
  auditPressureIndex: number,
): FusionSynthesisPressureReport {
  const notes: string[] = [];
  if (pressureFusionSynthesisIndex >= 44 && synthesisStackConvergenceIndex >= 44) {
    notes.push('Fusion synthesis and stack convergence both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionSynthesisIndex >= 46) {
    notes.push('Audit pressure driving fusion–synthesis pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      pressureFusionSynthesisIndex * 0.37 +
        synthesisStackConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureFusionSynthesisIndex >= 48 && synthesisStackConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionSynthesisPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-cascade-convergence-index.ts ---
export interface SynthesisCascadeConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Synthesis–stack convergence converging with stack–resonance pressure under composite health.
 */
export function computeSynthesisCascadeConvergenceIndex(
  synthesisStackConvergenceIndex: number,
  stackResonancePressureIndex: number,
  coordinationCompositeScore: number,
): SynthesisCascadeConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisStackConvergenceIndex >= 44 && stackResonancePressureIndex >= 44) {
    notes.push('Stack convergence and resonance pressure both elevated');
  }
  if (weakComposite && synthesisStackConvergenceIndex >= 46) {
    notes.push('Synthesis–cascade convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      synthesisStackConvergenceIndex * 0.37 +
        stackResonancePressureIndex * 0.37 +
        compositePenalty +
        (weakComposite && stackResonancePressureIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisCascadeConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-resonance-synthesis-index.ts ---
export interface FusionResonanceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Stack–fusion resonance synthesizing with fusion–synthesis pressure under escalation.
 */
export function computeFusionResonanceSynthesisIndex(
  stackFusionResonanceIndex: number,
  fusionSynthesisPressureIndex: number,
  coordinationEscalationTier: number,
): FusionResonanceSynthesisReport {
  const notes: string[] = [];
  if (stackFusionResonanceIndex >= 44 && fusionSynthesisPressureIndex >= 44) {
    notes.push('Fusion resonance and synthesis pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && stackFusionResonanceIndex >= 46) {
    notes.push('Fusion–resonance synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      stackFusionResonanceIndex * 0.38 +
        fusionSynthesisPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (stackFusionResonanceIndex >= 48 && fusionSynthesisPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-cascade-convergence-index.ts ---
export interface PressureCascadeConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–synthesis pressure converging with synthesis–cascade convergence under audit load.
 */
export function computePressureCascadeConvergenceIndex(
  fusionSynthesisPressureIndex: number,
  synthesisCascadeConvergenceIndex: number,
  auditPressureIndex: number,
): PressureCascadeConvergenceReport {
  const notes: string[] = [];
  if (fusionSynthesisPressureIndex >= 44 && synthesisCascadeConvergenceIndex >= 44) {
    notes.push('Synthesis pressure and cascade convergence both elevated');
  }
  if (auditPressureIndex >= 40 && fusionSynthesisPressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–cascade convergence');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionSynthesisPressureIndex * 0.37 +
        synthesisCascadeConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (fusionSynthesisPressureIndex >= 48 && synthesisCascadeConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureCascadeConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: cascade-stack-fusion-index.ts ---
export interface CascadeStackFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–cascade convergence fusing with stack–fusion resonance under composite health.
 */
export function computeCascadeStackFusionIndex(
  synthesisCascadeConvergenceIndex: number,
  stackFusionResonanceIndex: number,
  coordinationCompositeScore: number,
): CascadeStackFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (synthesisCascadeConvergenceIndex >= 44 && stackFusionResonanceIndex >= 44) {
    notes.push('Cascade convergence and fusion resonance both elevated');
  }
  if (weakComposite && synthesisCascadeConvergenceIndex >= 46) {
    notes.push('Cascade–stack fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisCascadeConvergenceIndex * 0.37 +
        stackFusionResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && stackFusionResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamCascadeStackFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-resonance-convergence-index.ts ---
export interface SynthesisResonanceConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance synthesis converging with pressure–cascade convergence under escalation.
 */
export function computeSynthesisResonanceConvergenceIndex(
  fusionResonanceSynthesisIndex: number,
  pressureCascadeConvergenceIndex: number,
  coordinationEscalationTier: number,
): SynthesisResonanceConvergenceReport {
  const notes: string[] = [];
  if (fusionResonanceSynthesisIndex >= 44 && pressureCascadeConvergenceIndex >= 44) {
    notes.push('Resonance synthesis and cascade convergence both elevated');
  }
  if (coordinationEscalationTier >= 2 && fusionResonanceSynthesisIndex >= 46) {
    notes.push('Synthesis–resonance convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionResonanceSynthesisIndex * 0.38 +
        pressureCascadeConvergenceIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionResonanceSynthesisIndex >= 48 && pressureCascadeConvergenceIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisResonanceConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-stack-fusion-index.ts ---
export interface PressureStackFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Pressure–cascade convergence fusing with cascade–stack fusion under audit load.
 */
export function computePressureStackFusionIndex(
  pressureCascadeConvergenceIndex: number,
  cascadeStackFusionIndex: number,
  auditPressureIndex: number,
): PressureStackFusionReport {
  const notes: string[] = [];
  if (pressureCascadeConvergenceIndex >= 44 && cascadeStackFusionIndex >= 44) {
    notes.push('Cascade convergence and stack fusion both elevated');
  }
  if (auditPressureIndex >= 40 && pressureCascadeConvergenceIndex >= 46) {
    notes.push('Audit pressure driving pressure–stack fusion');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      pressureCascadeConvergenceIndex * 0.37 +
        cascadeStackFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureCascadeConvergenceIndex >= 48 && cascadeStackFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureStackFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-stack-synthesis-index.ts ---
export interface FusionStackSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Cascade–stack fusion synthesizing with fusion–resonance synthesis under composite health.
 */
export function computeFusionStackSynthesisIndex(
  cascadeStackFusionIndex: number,
  fusionResonanceSynthesisIndex: number,
  coordinationCompositeScore: number,
): FusionStackSynthesisReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (cascadeStackFusionIndex >= 44 && fusionResonanceSynthesisIndex >= 44) {
    notes.push('Stack fusion and resonance synthesis both elevated');
  }
  if (weakComposite && cascadeStackFusionIndex >= 46) {
    notes.push('Fusion–stack synthesis under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const synthesisIndex = Math.round(
    Math.min(
      100,
      cascadeStackFusionIndex * 0.37 +
        fusionResonanceSynthesisIndex * 0.37 +
        compositePenalty +
        (weakComposite && fusionResonanceSynthesisIndex >= 48 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-convergence-stack-index.ts ---
export interface ResonanceConvergenceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Synthesis–resonance convergence stacking with pressure–stack fusion under escalation.
 */
export function computeResonanceConvergenceStackIndex(
  synthesisResonanceConvergenceIndex: number,
  pressureStackFusionIndex: number,
  coordinationEscalationTier: number,
): ResonanceConvergenceStackReport {
  const notes: string[] = [];
  if (synthesisResonanceConvergenceIndex >= 44 && pressureStackFusionIndex >= 44) {
    notes.push('Resonance convergence and stack fusion both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisResonanceConvergenceIndex >= 46) {
    notes.push('Resonance–convergence stack under active escalation');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      synthesisResonanceConvergenceIndex * 0.38 +
        pressureStackFusionIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (synthesisResonanceConvergenceIndex >= 48 && pressureStackFusionIndex >= 46 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceConvergenceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-stack-synthesis-index.ts ---
export interface PressureStackSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Pressure–stack fusion synthesizing with fusion–stack synthesis under audit load.
 */
export function computePressureStackSynthesisIndex(
  pressureStackFusionIndex: number,
  fusionStackSynthesisIndex: number,
  auditPressureIndex: number,
): PressureStackSynthesisReport {
  const notes: string[] = [];
  if (pressureStackFusionIndex >= 44 && fusionStackSynthesisIndex >= 44) {
    notes.push('Stack fusion and stack synthesis both elevated');
  }
  if (auditPressureIndex >= 40 && pressureStackFusionIndex >= 46) {
    notes.push('Audit pressure driving pressure–stack synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      pressureStackFusionIndex * 0.37 +
        fusionStackSynthesisIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureStackFusionIndex >= 48 && fusionStackSynthesisIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureStackSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-stack-resonance-index.ts ---
export interface FusionStackResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Fusion–stack synthesis resonating with synthesis–resonance convergence under composite health.
 */
export function computeFusionStackResonanceIndex(
  fusionStackSynthesisIndex: number,
  synthesisResonanceConvergenceIndex: number,
  coordinationCompositeScore: number,
): FusionStackResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionStackSynthesisIndex >= 44 && synthesisResonanceConvergenceIndex >= 44) {
    notes.push('Stack synthesis and resonance convergence both elevated');
  }
  if (weakComposite && fusionStackSynthesisIndex >= 46) {
    notes.push('Fusion–stack resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      fusionStackSynthesisIndex * 0.37 +
        synthesisResonanceConvergenceIndex * 0.37 +
        compositePenalty +
        (weakComposite && synthesisResonanceConvergenceIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionStackResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-stack-synthesis-index.ts ---
export interface ConvergenceStackSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Resonance–convergence stack synthesizing with pressure–stack synthesis under escalation.
 */
export function computeConvergenceStackSynthesisIndex(
  resonanceConvergenceStackIndex: number,
  pressureStackSynthesisIndex: number,
  coordinationEscalationTier: number,
): ConvergenceStackSynthesisReport {
  const notes: string[] = [];
  if (resonanceConvergenceStackIndex >= 44 && pressureStackSynthesisIndex >= 44) {
    notes.push('Convergence stack and stack synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonanceConvergenceStackIndex >= 46) {
    notes.push('Convergence–stack synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      resonanceConvergenceStackIndex * 0.38 +
        pressureStackSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceConvergenceStackIndex >= 48 && pressureStackSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceStackSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: stack-synthesis-pressure-index.ts ---
export interface StackSynthesisPressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Pressure–stack synthesis pressuring with fusion–stack resonance under audit load.
 */
export function computeStackSynthesisPressureIndex(
  pressureStackSynthesisIndex: number,
  fusionStackResonanceIndex: number,
  auditPressureIndex: number,
): StackSynthesisPressureReport {
  const notes: string[] = [];
  if (pressureStackSynthesisIndex >= 44 && fusionStackResonanceIndex >= 44) {
    notes.push('Stack synthesis and stack resonance both elevated');
  }
  if (auditPressureIndex >= 40 && pressureStackSynthesisIndex >= 46) {
    notes.push('Audit pressure driving stack–synthesis pressure');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      pressureStackSynthesisIndex * 0.37 +
        fusionStackResonanceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureStackSynthesisIndex >= 48 && fusionStackResonanceIndex >= 46 ? 15 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamStackSynthesisPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-resonance-stack-index.ts ---
export interface FusionResonanceStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Fusion–stack resonance stacking with resonance–convergence stack under composite health.
 */
export function computeFusionResonanceStackIndex(
  fusionStackResonanceIndex: number,
  resonanceConvergenceStackIndex: number,
  coordinationCompositeScore: number,
): FusionResonanceStackReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionStackResonanceIndex >= 44 && resonanceConvergenceStackIndex >= 44) {
    notes.push('Stack resonance and convergence stack both elevated');
  }
  if (weakComposite && fusionStackResonanceIndex >= 46) {
    notes.push('Fusion–resonance stack under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const stackIndex = Math.round(
    Math.min(
      100,
      fusionStackResonanceIndex * 0.37 +
        resonanceConvergenceStackIndex * 0.37 +
        compositePenalty +
        (weakComposite && resonanceConvergenceStackIndex >= 48 ? 14 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionResonanceStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-pressure-convergence-index.ts ---
export interface SynthesisPressureConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Convergence–stack synthesis converging with stack–synthesis pressure under escalation.
 */
export function computeSynthesisPressureConvergenceIndex(
  convergenceStackSynthesisIndex: number,
  stackSynthesisPressureIndex: number,
  coordinationEscalationTier: number,
): SynthesisPressureConvergenceReport {
  const notes: string[] = [];
  if (convergenceStackSynthesisIndex >= 44 && stackSynthesisPressureIndex >= 44) {
    notes.push('Stack synthesis and synthesis pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergenceStackSynthesisIndex >= 46) {
    notes.push('Synthesis–pressure convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      convergenceStackSynthesisIndex * 0.38 +
        stackSynthesisPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergenceStackSynthesisIndex >= 48 && stackSynthesisPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisPressureConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-fusion-stack-index.ts ---
export interface PressureFusionStackReport {
  stackIndex: number;
  notes: string[];
}

/**
 * Stack–synthesis pressure fusing with fusion–resonance stack under audit load.
 */
export function computePressureFusionStackIndex(
  stackSynthesisPressureIndex: number,
  fusionResonanceStackIndex: number,
  auditPressureIndex: number,
): PressureFusionStackReport {
  const notes: string[] = [];
  if (stackSynthesisPressureIndex >= 44 && fusionResonanceStackIndex >= 44) {
    notes.push('Synthesis pressure and resonance stack both elevated');
  }
  if (auditPressureIndex >= 40 && stackSynthesisPressureIndex >= 46) {
    notes.push('Audit pressure driving pressure–fusion stack');
  }

  const stackIndex = Math.round(
    Math.min(
      100,
      stackSynthesisPressureIndex * 0.37 +
        fusionResonanceStackIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (stackSynthesisPressureIndex >= 48 && fusionResonanceStackIndex >= 46 ? 15 : 0),
    ),
  );

  return { stackIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionStack(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-synthesis-fusion-index.ts ---
export interface ResonanceSynthesisFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Fusion–resonance stack fusing with convergence–stack synthesis under composite health.
 */
export function computeResonanceSynthesisFusionIndex(
  fusionResonanceStackIndex: number,
  convergenceStackSynthesisIndex: number,
  coordinationCompositeScore: number,
): ResonanceSynthesisFusionReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionResonanceStackIndex >= 44 && convergenceStackSynthesisIndex >= 44) {
    notes.push('Resonance stack and stack synthesis both elevated');
  }
  if (weakComposite && fusionResonanceStackIndex >= 46) {
    notes.push('Resonance–synthesis fusion under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const fusionIndex = Math.round(
    Math.min(
      100,
      fusionResonanceStackIndex * 0.37 +
        convergenceStackSynthesisIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergenceStackSynthesisIndex >= 48 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceSynthesisFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-pressure-fusion-index.ts ---
export interface ConvergencePressureFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Synthesis–pressure convergence fusing with pressure–fusion stack under escalation.
 */
export function computeConvergencePressureFusionIndex(
  synthesisPressureConvergenceIndex: number,
  pressureFusionStackIndex: number,
  coordinationEscalationTier: number,
): ConvergencePressureFusionReport {
  const notes: string[] = [];
  if (synthesisPressureConvergenceIndex >= 44 && pressureFusionStackIndex >= 44) {
    notes.push('Pressure convergence and fusion stack both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisPressureConvergenceIndex >= 46) {
    notes.push('Convergence–pressure fusion under active escalation');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      synthesisPressureConvergenceIndex * 0.38 +
        pressureFusionStackIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (synthesisPressureConvergenceIndex >= 48 && pressureFusionStackIndex >= 46 ? 14 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergencePressureFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-resonance-synthesis-index.ts ---
export interface PressureResonanceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion stack synthesizing with resonance–synthesis fusion under audit load.
 */
export function computePressureResonanceSynthesisIndex(
  pressureFusionStackIndex: number,
  resonanceSynthesisFusionIndex: number,
  auditPressureIndex: number,
): PressureResonanceSynthesisReport {
  const notes: string[] = [];
  if (pressureFusionStackIndex >= 44 && resonanceSynthesisFusionIndex >= 44) {
    notes.push('Fusion stack and synthesis fusion both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionStackIndex >= 46) {
    notes.push('Audit pressure driving pressure–resonance synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      pressureFusionStackIndex * 0.37 +
        resonanceSynthesisFusionIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureFusionStackIndex >= 48 && resonanceSynthesisFusionIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureResonanceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-convergence-pressure-index.ts ---
export interface FusionConvergencePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–synthesis fusion pressuring with synthesis–pressure convergence under composite health.
 */
export function computeFusionConvergencePressureIndex(
  resonanceSynthesisFusionIndex: number,
  synthesisPressureConvergenceIndex: number,
  coordinationCompositeScore: number,
): FusionConvergencePressureReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (resonanceSynthesisFusionIndex >= 44 && synthesisPressureConvergenceIndex >= 44) {
    notes.push('Synthesis fusion and pressure convergence both elevated');
  }
  if (weakComposite && resonanceSynthesisFusionIndex >= 46) {
    notes.push('Fusion–convergence pressure under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceSynthesisFusionIndex * 0.37 +
        synthesisPressureConvergenceIndex * 0.37 +
        compositePenalty +
        (weakComposite && synthesisPressureConvergenceIndex >= 48 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionConvergencePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: fusion-synthesis-resonance-index.ts ---
export interface FusionSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Convergence–pressure fusion resonating with pressure–resonance synthesis under escalation.
 */
export function computeFusionSynthesisResonanceIndex(
  convergencePressureFusionIndex: number,
  pressureResonanceSynthesisIndex: number,
  coordinationEscalationTier: number,
): FusionSynthesisResonanceReport {
  const notes: string[] = [];
  if (convergencePressureFusionIndex >= 44 && pressureResonanceSynthesisIndex >= 44) {
    notes.push('Pressure fusion and resonance synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergencePressureFusionIndex >= 46) {
    notes.push('Fusion–synthesis resonance under active escalation');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      convergencePressureFusionIndex * 0.38 +
        pressureResonanceSynthesisIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergencePressureFusionIndex >= 48 && pressureResonanceSynthesisIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamFusionSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-pressure-convergence-index.ts ---
export interface ResonancePressureConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Pressure–resonance synthesis converging with fusion–convergence pressure under audit load.
 */
export function computeResonancePressureConvergenceIndex(
  pressureResonanceSynthesisIndex: number,
  fusionConvergencePressureIndex: number,
  auditPressureIndex: number,
): ResonancePressureConvergenceReport {
  const notes: string[] = [];
  if (pressureResonanceSynthesisIndex >= 44 && fusionConvergencePressureIndex >= 44) {
    notes.push('Resonance synthesis and convergence pressure both elevated');
  }
  if (auditPressureIndex >= 40 && pressureResonanceSynthesisIndex >= 46) {
    notes.push('Audit pressure driving resonance–pressure convergence');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      pressureResonanceSynthesisIndex * 0.37 +
        fusionConvergencePressureIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (pressureResonanceSynthesisIndex >= 48 && fusionConvergencePressureIndex >= 46 ? 15 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonancePressureConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-fusion-convergence-index.ts ---
export interface PressureFusionConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Fusion–convergence pressure converging with convergence–pressure fusion under composite health.
 */
export function computePressureFusionConvergenceIndex(
  fusionConvergencePressureIndex: number,
  convergencePressureFusionIndex: number,
  coordinationCompositeScore: number,
): PressureFusionConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (fusionConvergencePressureIndex >= 44 && convergencePressureFusionIndex >= 44) {
    notes.push('Convergence pressure and pressure fusion both elevated');
  }
  if (weakComposite && fusionConvergencePressureIndex >= 46) {
    notes.push('Pressure–fusion convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      fusionConvergencePressureIndex * 0.37 +
        convergencePressureFusionIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergencePressureFusionIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureFusionConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: resonance-convergence-synthesis-index.ts ---
export interface ResonanceConvergenceSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Fusion–synthesis resonance synthesizing with resonance–pressure convergence under escalation.
 */
export function computeResonanceConvergenceSynthesisIndex(
  fusionSynthesisResonanceIndex: number,
  resonancePressureConvergenceIndex: number,
  coordinationEscalationTier: number,
): ResonanceConvergenceSynthesisReport {
  const notes: string[] = [];
  if (fusionSynthesisResonanceIndex >= 44 && resonancePressureConvergenceIndex >= 44) {
    notes.push('Fusion synthesis resonance and pressure convergence both elevated');
  }
  if (coordinationEscalationTier >= 2 && resonancePressureConvergenceIndex >= 46) {
    notes.push('Resonance–convergence synthesis under active escalation');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      fusionSynthesisResonanceIndex * 0.38 +
        resonancePressureConvergenceIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (fusionSynthesisResonanceIndex >= 48 && resonancePressureConvergenceIndex >= 46 ? 14 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamResonanceConvergenceSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-pressure-fusion-index.ts ---
export interface SynthesisPressureFusionReport {
  fusionIndex: number;
  notes: string[];
}

/**
 * Resonance–pressure convergence fusing with pressure–fusion convergence under audit load.
 */
export function computeSynthesisPressureFusionIndex(
  resonancePressureConvergenceIndex: number,
  pressureFusionConvergenceIndex: number,
  auditPressureIndex: number,
): SynthesisPressureFusionReport {
  const notes: string[] = [];
  if (resonancePressureConvergenceIndex >= 44 && pressureFusionConvergenceIndex >= 44) {
    notes.push('Pressure convergence and fusion convergence both elevated');
  }
  if (auditPressureIndex >= 40 && pressureFusionConvergenceIndex >= 46) {
    notes.push('Audit pressure driving synthesis–pressure fusion');
  }

  const fusionIndex = Math.round(
    Math.min(
      100,
      resonancePressureConvergenceIndex * 0.37 +
        pressureFusionConvergenceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonancePressureConvergenceIndex >= 48 && pressureFusionConvergenceIndex >= 46 ? 15 : 0),
    ),
  );

  return { fusionIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisPressureFusion(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-synthesis-resonance-index.ts ---
export interface ConvergenceSynthesisResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Pressure–fusion convergence resonating with fusion–synthesis resonance under composite health.
 */
export function computeConvergenceSynthesisResonanceIndex(
  pressureFusionConvergenceIndex: number,
  fusionSynthesisResonanceIndex: number,
  coordinationCompositeScore: number,
): ConvergenceSynthesisResonanceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (pressureFusionConvergenceIndex >= 44 && fusionSynthesisResonanceIndex >= 44) {
    notes.push('Fusion convergence and synthesis resonance both elevated');
  }
  if (weakComposite && fusionSynthesisResonanceIndex >= 46) {
    notes.push('Convergence–synthesis resonance under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const resonanceIndex = Math.round(
    Math.min(
      100,
      pressureFusionConvergenceIndex * 0.37 +
        fusionSynthesisResonanceIndex * 0.37 +
        compositePenalty +
        (weakComposite && pressureFusionConvergenceIndex >= 48 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceSynthesisResonance(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-convergence-pressure-index.ts ---
export interface SynthesisConvergencePressureReport {
  pressureIndex: number;
  notes: string[];
}

/**
 * Resonance–convergence synthesis pressuring with synthesis–pressure fusion under escalation.
 */
export function computeSynthesisConvergencePressureIndex(
  resonanceConvergenceSynthesisIndex: number,
  synthesisPressureFusionIndex: number,
  coordinationEscalationTier: number,
): SynthesisConvergencePressureReport {
  const notes: string[] = [];
  if (resonanceConvergenceSynthesisIndex >= 44 && synthesisPressureFusionIndex >= 44) {
    notes.push('Convergence synthesis and pressure fusion both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisPressureFusionIndex >= 46) {
    notes.push('Synthesis–convergence pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      resonanceConvergenceSynthesisIndex * 0.38 +
        synthesisPressureFusionIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (resonanceConvergenceSynthesisIndex >= 48 && synthesisPressureFusionIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisConvergencePressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-pressure-synthesis-index.ts ---
export interface ConvergencePressureSynthesisReport {
  synthesisIndex: number;
  notes: string[];
}

/**
 * Synthesis–pressure fusion synthesizing with convergence–synthesis resonance under audit load.
 */
export function computeConvergencePressureSynthesisIndex(
  synthesisPressureFusionIndex: number,
  convergenceSynthesisResonanceIndex: number,
  auditPressureIndex: number,
): ConvergencePressureSynthesisReport {
  const notes: string[] = [];
  if (synthesisPressureFusionIndex >= 44 && convergenceSynthesisResonanceIndex >= 44) {
    notes.push('Pressure fusion and synthesis resonance both elevated');
  }
  if (auditPressureIndex >= 40 && convergenceSynthesisResonanceIndex >= 46) {
    notes.push('Audit pressure driving convergence–pressure synthesis');
  }

  const synthesisIndex = Math.round(
    Math.min(
      100,
      synthesisPressureFusionIndex * 0.37 +
        convergenceSynthesisResonanceIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (synthesisPressureFusionIndex >= 48 && convergenceSynthesisResonanceIndex >= 46 ? 15 : 0),
    ),
  );

  return { synthesisIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergencePressureSynthesis(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-synthesis-convergence-index.ts ---
export interface PressureSynthesisConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/**
 * Convergence–synthesis resonance converging with resonance–convergence synthesis under composite health.
 */
export function computePressureSynthesisConvergenceIndex(
  convergenceSynthesisResonanceIndex: number,
  resonanceConvergenceSynthesisIndex: number,
  coordinationCompositeScore: number,
): PressureSynthesisConvergenceReport {
  const notes: string[] = [];
  const weakComposite = coordinationCompositeScore < 55;
  if (convergenceSynthesisResonanceIndex >= 44 && resonanceConvergenceSynthesisIndex >= 44) {
    notes.push('Synthesis resonance and convergence synthesis both elevated');
  }
  if (weakComposite && resonanceConvergenceSynthesisIndex >= 46) {
    notes.push('Pressure–synthesis convergence under depressed composite');
  }

  const compositePenalty = weakComposite ? Math.max(0, 58 - coordinationCompositeScore) * 0.3 : 0;
  const convergenceIndex = Math.round(
    Math.min(
      100,
      convergenceSynthesisResonanceIndex * 0.37 +
        resonanceConvergenceSynthesisIndex * 0.37 +
        compositePenalty +
        (weakComposite && convergenceSynthesisResonanceIndex >= 48 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureSynthesisConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: convergence-synthesis-pressure-index.ts ---
export interface ConvergenceSynthesisPressureReport {
  pressureIndex: number;
  notes: string[];
}

/** Convergence–synthesis pressure pressuring with synthesis–convergence resonance under escalation. */
export function computeConvergenceSynthesisPressureIndex(
  convergencePressureSynthesisIndex: number,
  synthesisConvergencePressureIndex: number,
  coordinationEscalationTier: number,
): ConvergenceSynthesisPressureReport {
  const notes: string[] = [];
  if (convergencePressureSynthesisIndex >= 44 && synthesisConvergencePressureIndex >= 44) {
    notes.push('Synthesis pressure and convergence synthesis both elevated');
  }
  if (coordinationEscalationTier >= 2 && synthesisConvergencePressureIndex >= 46) {
    notes.push('Convergence–synthesis pressure under active escalation');
  }

  const pressureIndex = Math.round(
    Math.min(
      100,
      convergencePressureSynthesisIndex * 0.38 +
        synthesisConvergencePressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (convergencePressureSynthesisIndex >= 48 && synthesisConvergencePressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { pressureIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamConvergenceSynthesisPressure(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: synthesis-pressure-resonance-index.ts ---
export interface SynthesisPressureResonanceReport {
  resonanceIndex: number;
  notes: string[];
}

/**
 * Resonance–cascade synthesis resonating with convergence–amplification pressure under audit load.
 */
export function computeSynthesisPressureResonanceIndex(
  resonanceCascadeSynthesisIndex: number,
  convergenceAmplificationPressureIndex: number,
  auditPressureIndex: number,
): SynthesisPressureResonanceReport {
  const notes: string[] = [];
  if (resonanceCascadeSynthesisIndex >= 44 && convergenceAmplificationPressureIndex >= 44) {
    notes.push('Cascade synthesis and amplification pressure both elevated');
  }
  if (auditPressureIndex >= 40 && resonanceCascadeSynthesisIndex >= 46) {
    notes.push('Audit pressure driving synthesis–pressure resonance');
  }

  const resonanceIndex = Math.round(
    Math.min(
      100,
      resonanceCascadeSynthesisIndex * 0.37 +
        convergenceAmplificationPressureIndex * 0.37 +
        auditPressureIndex * 0.2 +
        (resonanceCascadeSynthesisIndex >= 48 && convergenceAmplificationPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { resonanceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamSynthesisPressureResonance(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: pressure-resonance-convergence-index.ts ---
export interface PressureResonanceConvergenceReport {
  convergenceIndex: number;
  notes: string[];
}

/** Pressure–resonance synthesis converging with convergence–synthesis pressure under escalation. */
export function computePressureResonanceConvergenceIndex(
  pressureSynthesisConvergenceIndex: number,
  convergenceSynthesisPressureIndex: number,
  coordinationEscalationTier: number,
): PressureResonanceConvergenceReport {
  const notes: string[] = [];
  if (pressureSynthesisConvergenceIndex >= 44 && convergenceSynthesisPressureIndex >= 44) {
    notes.push('Resonance convergence and synthesis pressure both elevated');
  }
  if (coordinationEscalationTier >= 2 && convergenceSynthesisPressureIndex >= 46) {
    notes.push('Pressure–resonance convergence under active escalation');
  }

  const convergenceIndex = Math.round(
    Math.min(
      100,
      pressureSynthesisConvergenceIndex * 0.38 +
        convergenceSynthesisPressureIndex * 0.38 +
        coordinationEscalationTier * 5 +
        (pressureSynthesisConvergenceIndex >= 48 && convergenceSynthesisPressureIndex >= 46 ? 14 : 0),
    ),
  );

  return { convergenceIndex, notes: notes.slice(0, 6) };
}

export function combineDualTeamPressureResonanceConvergence(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}


// --- source: coordination-audit.ts ---
  AGENT18_LIMITS,
  CoordinationAuditFinding,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
  TeamMultiAgentCoordinationMeta,
} from './types.ts';

function summarizeAudit(findings: CoordinationAuditFinding[]): TeamMultiAgentCoordinationMeta['auditSummary'] {
  return {
    errors: findings.filter(f => f.severity === 'error').length,
    warnings: findings.filter(f => f.severity === 'warning').length,
    info: findings.filter(f => f.severity === 'info').length,
  };
}

export function emptyCoordinationMeta(): TeamMultiAgentCoordinationMeta {
  return {
    directiveConstraints: {},
    suppressedDirectiveIds: [],
    auditSummary: { errors: 0, warnings: 0, info: 0 },
    lastReconcileStable: true,
    thrashingRegions: [],
    mutexHistory: [],
  };
}

export function auditTeamMultiAgentLayer(
  state: TeamMultiAgentLayerState,
  inputs: TeamMultiAgentInputs,
): CoordinationAuditFinding[] {
  const findings: CoordinationAuditFinding[] = [];
  const push = (f: Omit<CoordinationAuditFinding, 'id'>) => {
    if (findings.length >= AGENT18_LIMITS.maxAuditFindings) return;
    findings.push({ ...f, id: `audit_${findings.length}_${f.severity}` });
  };

  detectIllegalSharedExclusiveTasks(inputs.tasks).forEach(msg =>
    push({ severity: 'error', message: msg, actorIds: [], regionId: null }),
  );

  Object.entries(state.coordination.mutexRegions).forEach(([regionId, holderId]) => {
    const role = state.roles.find(r => r.actorId === holderId);
    const task = inputs.tasks.find(
      t => t.regionId === regionId && t.assignedActorIds.includes(holderId),
    );
    if (!task) {
      push({
        severity: 'warning',
        message: `Mutex holder ${holderId} has no assigned task for ${regionId}`,
        actorIds: [holderId],
        regionId,
      });
    }
    if (role && role.primaryRole === 'support') {
      push({
        severity: 'warning',
        message: `Support role holds mutex for ${regionId} — verify handoff`,
        actorIds: [holderId],
        regionId,
      });
    }
    const resKey = reservationKeyForRegionAction(regionId, 'region_deposit');
    const reservation = state.duplicateGuard.reservations[resKey];
    if (reservation && reservation.holderActorId !== holderId) {
      push({
        severity: 'error',
        message: `Reservation holder ${reservation.holderActorId} disagrees with mutex ${holderId}`,
        actorIds: [holderId, reservation.holderActorId],
        regionId,
      });
    }
  });

  state.coordination.arbitrationLog.forEach(entry => {
    if (entry.regionId && state.coordination.mutexRegions[entry.regionId] !== entry.winnerActorId) {
      push({
        severity: 'error',
        message: `Arbitration winner ${entry.winnerActorId} does not match mutex for ${entry.regionId}`,
        actorIds: [entry.winnerActorId],
        regionId: entry.regionId,
      });
    }
  });

  state.coordination.handoffs
    .filter(h => h.status === 'pending')
    .forEach(h => {
      const task = inputs.tasks.find(t => t.id === h.taskId);
      if (!task || task.status !== 'blocked') {
        push({
          severity: 'info',
          message: `Handoff ${h.id} pending without blocked task ${h.taskId}`,
          actorIds: [h.fromActorId, h.toActorId],
          regionId: h.regionId,
        });
      }
    });

  state.coordination.workstreams.forEach(ws => {
    ws.actorIds.forEach(id => {
      const role = state.roles.find(r => r.actorId === id);
      if (!role || role.taskIds.length === 0) {
        push({
          severity: 'warning',
          message: `Workstream ${ws.id} includes idle actor ${id}`,
          actorIds: [id],
          regionId: null,
        });
      }
    });
  });

  if (state.coordination.warnings.length > 3) {
    push({
      severity: 'warning',
      message: `${state.coordination.warnings.length} coordination warnings active`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.thrashingRegions.length > 0) {
    push({
      severity: 'error',
      message: `Mutex thrashing on ${state.meta.thrashingRegions.join(', ')}`,
      actorIds: [],
      regionId: state.meta.thrashingRegions[0] || null,
    });
  }

  if (state.meta.lastReconcileStable === false) {
    push({
      severity: 'warning',
      message: 'Coordination plan changed materially since last evaluation',
      actorIds: [],
      regionId: null,
    });
  }

  const suppressRate =
    state.meta.suppressedDirectiveIds.length /
    Math.max(1, state.meta.suppressedDirectiveIds.length + Object.keys(state.meta.directiveConstraints).length);
  if (state.meta.suppressedDirectiveIds.length >= 3 && suppressRate > 0.5) {
    push({
      severity: 'info',
      message: `High directive suppression rate (${state.meta.suppressedDirectiveIds.length} suppressed)`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.overdueHandoffIds && state.meta.overdueHandoffIds.length > 0) {
    push({
      severity: 'warning',
      message: `Handoff SLA overdue: ${state.meta.overdueHandoffIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (state.meta.overloadedActorIds && state.meta.overloadedActorIds.length > 0) {
    push({
      severity: 'info',
      message: `Capacity overload: ${state.meta.overloadedActorIds.join(', ')}`,
      actorIds: state.meta.overloadedActorIds,
      regionId: null,
    });
  }

  if (state.meta.notReadyHandoffIds && state.meta.notReadyHandoffIds.length > 0) {
    push({
      severity: 'warning',
      message: `Handoff targets not ready: ${state.meta.notReadyHandoffIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.mutexStabilityIndex === 'number' &&
    state.meta.mutexStabilityIndex < 50 &&
    (state.meta.volatileMutexRegionIds?.length ?? 0) > 0
  ) {
    push({
      severity: 'warning',
      message: `Low mutex stability (${state.meta.mutexStabilityIndex}) on ${state.meta.volatileMutexRegionIds!.join(', ')}`,
      actorIds: [],
      regionId: state.meta.volatileMutexRegionIds![0] || null,
    });
  }

  if (state.meta.stalledWorkstreamIds && state.meta.stalledWorkstreamIds.length > 0) {
    push({
      severity: 'warning',
      message: `Workstream barrier stall: ${state.meta.stalledWorkstreamIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.roleChurnIndex === 'number' && state.meta.roleChurnIndex >= 50) {
    push({
      severity: 'warning',
      message: `High role churn (${state.meta.roleChurnIndex}) on ${(state.meta.roleChurnActorIds || []).join(', ') || 'actors'}`,
      actorIds: state.meta.roleChurnActorIds || [],
      regionId: null,
    });
  }

  if (state.meta.expiredLeaseIds && state.meta.expiredLeaseIds.length > 0) {
    push({
      severity: 'warning',
      message: `Expired leases: ${state.meta.expiredLeaseIds.join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.coordinationCompositeScore === 'number' &&
    state.meta.coordinationCompositeScore < 55
  ) {
    push({
      severity: 'warning',
      message: `Low coordination composite (${state.meta.coordinationCompositeScore}); weakest: ${state.meta.coordinationWeakestDimension || 'unknown'}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.directiveCollisionIndex === 'number' && state.meta.directiveCollisionIndex >= 40) {
    push({
      severity: 'warning',
      message: `High directive collision index (${state.meta.directiveCollisionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.handoffIntegrityScore === 'number' && state.meta.handoffIntegrityScore < 70) {
    push({
      severity: 'warning',
      message: `Low handoff chain integrity (${state.meta.handoffIntegrityScore})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.coordinationEscalationTier === 'number' &&
    state.meta.coordinationEscalationTier >= 2
  ) {
    push({
      severity: state.meta.coordinationEscalationTier >= 3 ? 'error' : 'warning',
      message: `Coordination escalation ${state.meta.coordinationEscalationLabel || state.meta.coordinationEscalationTier} (tier ${state.meta.coordinationEscalationTier})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.coordinationRecoveryUrgency === 'number' && state.meta.coordinationRecoveryUrgency >= 75) {
    push({
      severity: 'warning',
      message: `High coordination recovery urgency (${state.meta.coordinationRecoveryUrgency})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.directivePriorityInversionIndex === 'number' &&
    state.meta.directivePriorityInversionIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Directive priority inversion index (${state.meta.directivePriorityInversionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.handoffOrphanCount === 'number' && state.meta.handoffOrphanCount > 0) {
    push({
      severity: 'warning',
      message: `Orphan handoffs pending: ${(state.meta.orphanHandoffIds || []).join(', ') || state.meta.handoffOrphanCount}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.workstreamDeadlockCount === 'number' && state.meta.workstreamDeadlockCount > 0) {
    push({
      severity: 'error',
      message: `Workstream deadlocks detected (${state.meta.workstreamDeadlockCount}): ${(state.meta.deadlockedWorkstreamIds || []).join(', ')}`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.leaseContentionIndex === 'number' && state.meta.leaseContentionIndex >= 50) {
    push({
      severity: 'warning',
      message: `High lease contention index (${state.meta.leaseContentionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.coordinationSaturationIndex === 'number' &&
    state.meta.coordinationSaturationIndex >= 75
  ) {
    push({
      severity: 'warning',
      message: `Coordination saturation elevated (${state.meta.coordinationSaturationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.mutexLeaseDivergenceIndex === 'number' &&
    state.meta.mutexLeaseDivergenceIndex >= 40
  ) {
    push({
      severity: 'warning',
      message: `Mutex/lease divergence index (${state.meta.mutexLeaseDivergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.handoffCascadeRiskIndex === 'number' &&
    state.meta.handoffCascadeRiskIndex >= 55
  ) {
    push({
      severity: 'warning',
      message: `Handoff cascade risk (${state.meta.handoffCascadeRiskIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.suppressionBacklogIndex === 'number' && state.meta.suppressionBacklogIndex >= 70) {
    push({
      severity: 'warning',
      message: `Directive suppression backlog (${state.meta.suppressionBacklogIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.reconcileDriftIndex === 'number' && state.meta.reconcileDriftIndex >= 50) {
    push({
      severity: 'warning',
      message: `Coordination reconcile drift (${state.meta.reconcileDriftIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.arbitrationPressureIndex === 'number' &&
    state.meta.arbitrationPressureIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Arbitration demotion pressure (${state.meta.arbitrationPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.persistenceChurnIndex === 'number' && state.meta.persistenceChurnIndex >= 60) {
    push({
      severity: 'warning',
      message: `Persistence churn elevated (${state.meta.persistenceChurnIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.duplicateGuardPressureIndex === 'number' &&
    state.meta.duplicateGuardPressureIndex >= 70
  ) {
    push({
      severity: 'warning',
      message: `Duplicate guard pressure (${state.meta.duplicateGuardPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.roleTaskCoverageGapIndex === 'number' && state.meta.roleTaskCoverageGapIndex >= 50) {
    push({
      severity: 'warning',
      message: `Role/task coverage gap (${state.meta.roleTaskCoverageGapIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.compositeHealthGradientIndex === 'number' &&
    state.meta.compositeHealthGradientIndex >= 40
  ) {
    push({
      severity: 'warning',
      message: `Composite health declining (${state.meta.compositeHealthGradientIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.handoffReadinessSpreadIndex === 'number' &&
    state.meta.handoffReadinessSpreadIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Handoff readiness spread (${state.meta.handoffReadinessSpreadIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.workstreamParallelismIndex === 'number' &&
    state.meta.workstreamParallelismIndex >= 75
  ) {
    push({
      severity: 'warning',
      message: `Workstream parallelism elevated (${state.meta.workstreamParallelismIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.escalationRecoveryAlignmentIndex === 'number' &&
    state.meta.escalationRecoveryAlignmentIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Escalation/recovery misalignment (${state.meta.escalationRecoveryAlignmentIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.roleLockFrictionIndex === 'number' && state.meta.roleLockFrictionIndex >= 55) {
    push({
      severity: 'warning',
      message: `Role lock friction (${state.meta.roleLockFrictionIndex})`,
      actorIds: state.meta.lockedRoleActorIds || [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.directiveConstraintDensityIndex === 'number' &&
    state.meta.directiveConstraintDensityIndex >= 60
  ) {
    push({
      severity: 'warning',
      message: `Directive constraint density (${state.meta.directiveConstraintDensityIndex})`,
      actorIds: state.meta.directiveConstrainedActorIds || [],
      regionId: null,
    });
  }

  if (typeof state.meta.auditPressureIndex === 'number' && state.meta.auditPressureIndex >= 65) {
    push({
      severity: 'warning',
      message: `Coordination audit pressure (${state.meta.auditPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.crossTeamRejectionIndex === 'number' && state.meta.crossTeamRejectionIndex >= 40) {
    push({
      severity: 'warning',
      message: `Cross-team directive rejections (${state.meta.crossTeamRejectionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (typeof state.meta.handoffSlaVelocityIndex === 'number' && state.meta.handoffSlaVelocityIndex >= 50) {
    push({
      severity: 'warning',
      message: `Handoff SLA velocity stress (${state.meta.handoffSlaVelocityIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.recoveryActionBreadthIndex === 'number' &&
    state.meta.recoveryActionBreadthIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Recovery action breadth gap (${state.meta.recoveryActionBreadthIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.directiveQuotaExhaustionIndex === 'number' &&
    state.meta.directiveQuotaExhaustionIndex >= 42
  ) {
    push({
      severity: 'warning',
      message: `Directive quota exhaustion (${state.meta.directiveQuotaExhaustionIndex})`,
      actorIds: state.meta.quotaExhaustedActorIds || [],
      regionId: null,
    });
  }

  if (typeof state.meta.capacityImbalanceIndex === 'number' && state.meta.capacityImbalanceIndex >= 48) {
    push({
      severity: 'warning',
      message: `Actor capacity imbalance (${state.meta.capacityImbalanceIndex})`,
      actorIds: [...(state.meta.overloadedActorIds || []), ...(state.meta.idleActorIds || [])],
      regionId: null,
    });
  }

  if (
    typeof state.meta.workstreamBarrierStalenessIndex === 'number' &&
    state.meta.workstreamBarrierStalenessIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Workstream barrier staleness (${state.meta.workstreamBarrierStalenessIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.workstreamDeadlockPressureIndex === 'number' &&
    state.meta.workstreamDeadlockPressureIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Workstream deadlock pressure (${state.meta.workstreamDeadlockPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.suppressionQuotaCouplingIndex === 'number' &&
    state.meta.suppressionQuotaCouplingIndex >= 44
  ) {
    push({
      severity: 'warning',
      message: `Suppression–quota coupling (${state.meta.suppressionQuotaCouplingIndex})`,
      actorIds: state.meta.quotaExhaustedActorIds || [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.handoffLeaseOverlapIndex === 'number' &&
    state.meta.handoffLeaseOverlapIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Handoff–lease overlap (${state.meta.handoffLeaseOverlapIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.saturationDeadlockCouplingIndex === 'number' &&
    state.meta.saturationDeadlockCouplingIndex >= 45
  ) {
    push({
      severity: 'warning',
      message: `Saturation–deadlock coupling (${state.meta.saturationDeadlockCouplingIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeLeaseConvergenceIndex === 'number' &&
    state.meta.cascadeLeaseConvergenceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Cascade–lease convergence (${state.meta.cascadeLeaseConvergenceIndex})`,
      actorIds: state.meta.handoffCascadeChainActorIds || [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.gradientAuditTensionIndex === 'number' &&
    state.meta.gradientAuditTensionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Gradient–audit tension (${state.meta.gradientAuditTensionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.escalationSaturationStackIndex === 'number' &&
    state.meta.escalationSaturationStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Escalation–saturation stack (${state.meta.escalationSaturationStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.recoveryCascadeMismatchIndex === 'number' &&
    state.meta.recoveryCascadeMismatchIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Recovery–cascade mismatch (${state.meta.recoveryCascadeMismatchIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.persistenceGradientFrictionIndex === 'number' &&
    state.meta.persistenceGradientFrictionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Persistence–gradient friction (${state.meta.persistenceGradientFrictionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackMismatchCouplingIndex === 'number' &&
    state.meta.stackMismatchCouplingIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–mismatch coupling (${state.meta.stackMismatchCouplingIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.auditStackAmplificationIndex === 'number' &&
    state.meta.auditStackAmplificationIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Audit–stack amplification (${state.meta.auditStackAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.frictionAlignmentGapIndex === 'number' &&
    state.meta.frictionAlignmentGapIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Friction–alignment gap (${state.meta.frictionAlignmentGapIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.couplingAmplificationFusionIndex === 'number' &&
    state.meta.couplingAmplificationFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Coupling–amplification fusion (${state.meta.couplingAmplificationFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.gapChurnResonanceIndex === 'number' &&
    state.meta.gapChurnResonanceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Gap–churn resonance (${state.meta.gapChurnResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackFrictionConvergenceIndex === 'number' &&
    state.meta.stackFrictionConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–friction convergence (${state.meta.stackFrictionConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceCouplingIndex === 'number' &&
    state.meta.fusionResonanceCouplingIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance coupling (${state.meta.fusionResonanceCouplingIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceFusionStackIndex === 'number' &&
    state.meta.convergenceFusionStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Convergence–fusion stack (${state.meta.convergenceFusionStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceAuditCascadeIndex === 'number' &&
    state.meta.resonanceAuditCascadeIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Resonance–audit cascade (${state.meta.resonanceAuditCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.couplingStackCascadeIndex === 'number' &&
    state.meta.couplingStackCascadeIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Coupling–stack cascade (${state.meta.couplingStackCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackCascadeAmplificationIndex === 'number' &&
    state.meta.stackCascadeAmplificationIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Stack–cascade amplification (${state.meta.stackCascadeAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeCouplingSynthesisIndex === 'number' &&
    state.meta.cascadeCouplingSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–coupling synthesis (${state.meta.cascadeCouplingSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeSynthesisFusionIndex === 'number' &&
    state.meta.cascadeSynthesisFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Cascade–synthesis fusion (${state.meta.cascadeSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.amplificationStackResonanceIndex === 'number' &&
    state.meta.amplificationStackResonanceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Amplification–stack resonance (${state.meta.amplificationStackResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisEscalationPressureIndex === 'number' &&
    state.meta.synthesisEscalationPressureIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–escalation pressure (${state.meta.synthesisEscalationPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceConvergenceIndex === 'number' &&
    state.meta.fusionResonanceConvergenceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance convergence (${state.meta.fusionResonanceConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionCascadeIndex === 'number' &&
    state.meta.pressureFusionCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion cascade (${state.meta.pressureFusionCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureSynthesisIndex === 'number' &&
    state.meta.resonancePressureSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure synthesis (${state.meta.resonancePressureSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceCascadeSynthesisIndex === 'number' &&
    state.meta.convergenceCascadeSynthesisIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Convergence–cascade synthesis (${state.meta.convergenceCascadeSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisConvergenceStackIndex === 'number' &&
    state.meta.synthesisConvergenceStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–convergence stack (${state.meta.synthesisConvergenceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeResonanceAmplificationIndex === 'number' &&
    state.meta.cascadeResonanceAmplificationIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–resonance amplification (${state.meta.cascadeResonanceAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisStackAmplificationIndex === 'number' &&
    state.meta.synthesisStackAmplificationIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–stack amplification (${state.meta.synthesisStackAmplificationIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.amplificationConvergenceCascadeIndex === 'number' &&
    state.meta.amplificationConvergenceCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Amplification–convergence cascade (${state.meta.amplificationConvergenceCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisResonanceIndex === 'number' &&
    state.meta.stackSynthesisResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis resonance (${state.meta.stackSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackAmplificationCascadeFusionIndex === 'number' &&
    state.meta.stackAmplificationCascadeFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–amplification cascade fusion (${state.meta.stackAmplificationCascadeFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceAmplificationStackIndex === 'number' &&
    state.meta.resonanceAmplificationStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–amplification stack (${state.meta.resonanceAmplificationStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeConvergenceResonanceIndex === 'number' &&
    state.meta.cascadeConvergenceResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–convergence resonance (${state.meta.cascadeConvergenceResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackConvergenceIndex === 'number' &&
    state.meta.fusionStackConvergenceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack convergence (${state.meta.fusionStackConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceCascadeSynthesisIndex === 'number' &&
    state.meta.resonanceCascadeSynthesisIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–cascade synthesis (${state.meta.resonanceCascadeSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceAmplificationPressureIndex === 'number' &&
    state.meta.convergenceAmplificationPressureIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Convergence–amplification pressure (${state.meta.convergenceAmplificationPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceSynthesisFusionIndex === 'number' &&
    state.meta.convergenceSynthesisFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Convergence–synthesis fusion (${state.meta.convergenceSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureCascadeStackIndex === 'number' &&
    state.meta.pressureCascadeStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–cascade stack (${state.meta.pressureCascadeStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisPressureResonanceIndex === 'number' &&
    state.meta.synthesisPressureResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–pressure resonance (${state.meta.synthesisPressureResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadeStackIndex === 'number' &&
    state.meta.fusionCascadeStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade stack (${state.meta.fusionCascadeStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureCascadeIndex === 'number' &&
    state.meta.resonancePressureCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure cascade (${state.meta.resonancePressureCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisFusionConvergenceIndex === 'number' &&
    state.meta.synthesisFusionConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–fusion convergence (${state.meta.synthesisFusionConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackCascadeResonanceIndex === 'number' &&
    state.meta.stackCascadeResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–cascade resonance (${state.meta.stackCascadeResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeConvergencePressureIndex === 'number' &&
    state.meta.cascadeConvergencePressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Cascade–convergence pressure (${state.meta.cascadeConvergencePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceFusionSynthesisIndex === 'number' &&
    state.meta.convergenceFusionSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Convergence–fusion synthesis (${state.meta.convergenceFusionSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceConvergenceFusionIndex === 'number' &&
    state.meta.resonanceConvergenceFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Resonance–convergence fusion (${state.meta.resonanceConvergenceFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureSynthesisCascadeIndex === 'number' &&
    state.meta.pressureSynthesisCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–synthesis cascade (${state.meta.pressureSynthesisCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisResonanceStackIndex === 'number' &&
    state.meta.synthesisResonanceStackIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–resonance stack (${state.meta.synthesisResonanceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceFusionPressureIndex === 'number' &&
    state.meta.convergenceFusionPressureIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Convergence–fusion pressure (${state.meta.convergenceFusionPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisCascadeStackIndex === 'number' &&
    state.meta.synthesisCascadeStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–cascade stack (${state.meta.synthesisCascadeStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceStackFusionIndex === 'number' &&
    state.meta.resonanceStackFusionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Resonance–stack fusion (${state.meta.resonanceStackFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureStackResonanceIndex === 'number' &&
    state.meta.pressureStackResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Pressure–stack resonance (${state.meta.pressureStackResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackFusionCascadeIndex === 'number' &&
    state.meta.stackFusionCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Stack–fusion cascade (${state.meta.stackFusionCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadeConvergenceIndex === 'number' &&
    state.meta.fusionCascadeConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade convergence (${state.meta.fusionCascadeConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceFusionStackIndex === 'number' &&
    state.meta.resonanceFusionStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Resonance–fusion stack (${state.meta.resonanceFusionStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadePressureIndex === 'number' &&
    state.meta.fusionCascadePressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade pressure (${state.meta.fusionCascadePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackConvergenceResonanceIndex === 'number' &&
    state.meta.stackConvergenceResonanceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–convergence resonance (${state.meta.stackConvergenceResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackPressureIndex === 'number' &&
    state.meta.fusionStackPressureIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack pressure (${state.meta.fusionStackPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureResonanceCascadeIndex === 'number' &&
    state.meta.pressureResonanceCascadeIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–resonance cascade (${state.meta.pressureResonanceCascadeIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisConvergenceIndex === 'number' &&
    state.meta.stackSynthesisConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis convergence (${state.meta.stackSynthesisConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureCascadeFusionIndex === 'number' &&
    state.meta.pressureCascadeFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Pressure–cascade fusion (${state.meta.pressureCascadeFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeSynthesisResonanceIndex === 'number' &&
    state.meta.cascadeSynthesisResonanceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Cascade–synthesis resonance (${state.meta.cascadeSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergencePressureStackIndex === 'number' &&
    state.meta.convergencePressureStackIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Convergence–pressure stack (${state.meta.convergencePressureStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionCascadeResonanceIndex === 'number' &&
    state.meta.fusionCascadeResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–cascade resonance (${state.meta.fusionCascadeResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureStackIndex === 'number' &&
    state.meta.resonancePressureStackIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure stack (${state.meta.resonancePressureStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisFusionIndex === 'number' &&
    state.meta.stackSynthesisFusionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis fusion (${state.meta.stackSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeResonanceStackIndex === 'number' &&
    state.meta.cascadeResonanceStackIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Cascade–resonance stack (${state.meta.cascadeResonanceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceFusionPressureIndex === 'number' &&
    state.meta.resonanceFusionPressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Resonance–fusion pressure (${state.meta.resonanceFusionPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionConvergenceSynthesisIndex === 'number' &&
    state.meta.fusionConvergenceSynthesisIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Fusion–convergence synthesis (${state.meta.fusionConvergenceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackResonancePressureIndex === 'number' &&
    state.meta.stackResonancePressureIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–resonance pressure (${state.meta.stackResonancePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionSynthesisIndex === 'number' &&
    state.meta.pressureFusionSynthesisIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion synthesis (${state.meta.pressureFusionSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisStackConvergenceIndex === 'number' &&
    state.meta.synthesisStackConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–stack convergence (${state.meta.synthesisStackConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackFusionResonanceIndex === 'number' &&
    state.meta.stackFusionResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Stack–fusion resonance (${state.meta.stackFusionResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionSynthesisPressureIndex === 'number' &&
    state.meta.fusionSynthesisPressureIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Fusion–synthesis pressure (${state.meta.fusionSynthesisPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisCascadeConvergenceIndex === 'number' &&
    state.meta.synthesisCascadeConvergenceIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–cascade convergence (${state.meta.synthesisCascadeConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceSynthesisIndex === 'number' &&
    state.meta.fusionResonanceSynthesisIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance synthesis (${state.meta.fusionResonanceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureCascadeConvergenceIndex === 'number' &&
    state.meta.pressureCascadeConvergenceIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Pressure–cascade convergence (${state.meta.pressureCascadeConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.cascadeStackFusionIndex === 'number' &&
    state.meta.cascadeStackFusionIndex >= 46
  ) {
    push({
      severity: 'warning',
      message: `Cascade–stack fusion (${state.meta.cascadeStackFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisResonanceConvergenceIndex === 'number' &&
    state.meta.synthesisResonanceConvergenceIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–resonance convergence (${state.meta.synthesisResonanceConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureStackFusionIndex === 'number' &&
    state.meta.pressureStackFusionIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Pressure–stack fusion (${state.meta.pressureStackFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackSynthesisIndex === 'number' &&
    state.meta.fusionStackSynthesisIndex >= 47
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack synthesis (${state.meta.fusionStackSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceConvergenceStackIndex === 'number' &&
    state.meta.resonanceConvergenceStackIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Resonance–convergence stack (${state.meta.resonanceConvergenceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureStackSynthesisIndex === 'number' &&
    state.meta.pressureStackSynthesisIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Pressure–stack synthesis (${state.meta.pressureStackSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionStackResonanceIndex === 'number' &&
    state.meta.fusionStackResonanceIndex >= 48
  ) {
    push({
      severity: 'warning',
      message: `Fusion–stack resonance (${state.meta.fusionStackResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceStackSynthesisIndex === 'number' &&
    state.meta.convergenceStackSynthesisIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Convergence–stack synthesis (${state.meta.convergenceStackSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.stackSynthesisPressureIndex === 'number' &&
    state.meta.stackSynthesisPressureIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Stack–synthesis pressure (${state.meta.stackSynthesisPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionResonanceStackIndex === 'number' &&
    state.meta.fusionResonanceStackIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Fusion–resonance stack (${state.meta.fusionResonanceStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisPressureConvergenceIndex === 'number' &&
    state.meta.synthesisPressureConvergenceIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–pressure convergence (${state.meta.synthesisPressureConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionStackIndex === 'number' &&
    state.meta.pressureFusionStackIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion stack (${state.meta.pressureFusionStackIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceSynthesisFusionIndex === 'number' &&
    state.meta.resonanceSynthesisFusionIndex >= 49
  ) {
    push({
      severity: 'warning',
      message: `Resonance–synthesis fusion (${state.meta.resonanceSynthesisFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergencePressureFusionIndex === 'number' &&
    state.meta.convergencePressureFusionIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Convergence–pressure fusion (${state.meta.convergencePressureFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureResonanceSynthesisIndex === 'number' &&
    state.meta.pressureResonanceSynthesisIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Pressure–resonance synthesis (${state.meta.pressureResonanceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionConvergencePressureIndex === 'number' &&
    state.meta.fusionConvergencePressureIndex >= 50
  ) {
    push({
      severity: 'warning',
      message: `Fusion–convergence pressure (${state.meta.fusionConvergencePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.fusionSynthesisResonanceIndex === 'number' &&
    state.meta.fusionSynthesisResonanceIndex >= 53
  ) {
    push({
      severity: 'warning',
      message: `Fusion–synthesis resonance (${state.meta.fusionSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonancePressureConvergenceIndex === 'number' &&
    state.meta.resonancePressureConvergenceIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Resonance–pressure convergence (${state.meta.resonancePressureConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureFusionConvergenceIndex === 'number' &&
    state.meta.pressureFusionConvergenceIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Pressure–fusion convergence (${state.meta.pressureFusionConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.resonanceConvergenceSynthesisIndex === 'number' &&
    state.meta.resonanceConvergenceSynthesisIndex >= 53
  ) {
    push({
      severity: 'warning',
      message: `Resonance–convergence synthesis (${state.meta.resonanceConvergenceSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisPressureFusionIndex === 'number' &&
    state.meta.synthesisPressureFusionIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–pressure fusion (${state.meta.synthesisPressureFusionIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceSynthesisResonanceIndex === 'number' &&
    state.meta.convergenceSynthesisResonanceIndex >= 51
  ) {
    push({
      severity: 'warning',
      message: `Convergence–synthesis resonance (${state.meta.convergenceSynthesisResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisConvergencePressureIndex === 'number' &&
    state.meta.synthesisConvergencePressureIndex >= 54
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–convergence pressure (${state.meta.synthesisConvergencePressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergencePressureSynthesisIndex === 'number' &&
    state.meta.convergencePressureSynthesisIndex >= 53
  ) {
    push({
      severity: 'warning',
      message: `Convergence–pressure synthesis (${state.meta.convergencePressureSynthesisIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureSynthesisConvergenceIndex === 'number' &&
    state.meta.pressureSynthesisConvergenceIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Pressure–synthesis convergence (${state.meta.pressureSynthesisConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.convergenceSynthesisPressureIndex === 'number' &&
    state.meta.convergenceSynthesisPressureIndex >= 54
  ) {
    push({
      severity: 'warning',
      message: `Convergence–synthesis pressure (${state.meta.convergenceSynthesisPressureIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.synthesisPressureResonanceIndex === 'number' &&
    state.meta.synthesisPressureResonanceIndex >= 53
  ) {
    push({
      severity: 'warning',
      message: `Synthesis–pressure resonance (${state.meta.synthesisPressureResonanceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  if (
    typeof state.meta.pressureResonanceConvergenceIndex === 'number' &&
    state.meta.pressureResonanceConvergenceIndex >= 52
  ) {
    push({
      severity: 'warning',
      message: `Pressure–resonance convergence (${state.meta.pressureResonanceConvergenceIndex})`,
      actorIds: [],
      regionId: null,
    });
  }

  state.coordination.leases.forEach(lease => {
    if (lease.expiresTurn !== null && lease.expiresTurn < state.turn) {
      push({
        severity: 'warning',
        message: `Lease ${lease.id} expired at turn ${lease.expiresTurn}`,
        actorIds: [lease.holderActorId],
        regionId: lease.regionId,
      });
    }
  });

  return findings;
}

export function attachAuditToState(
  state: TeamMultiAgentLayerState,
  findings: CoordinationAuditFinding[],
  metaPatch: Partial<TeamMultiAgentCoordinationMeta>,
): TeamMultiAgentLayerState {
  const auditFindings = findings.slice(0, AGENT18_LIMITS.maxAuditFindings);
  const meta: TeamMultiAgentCoordinationMeta = {
    ...emptyCoordinationMeta(),
    ...state.meta,
    ...metaPatch,
    auditSummary: summarizeAudit(auditFindings),
  };
  return { ...state, auditFindings, meta };
}


// --- source: coordination-reconcile.ts ---

export interface CoordinationReconcileChange {
  kind:
    | 'mutex_holder_changed'
    | 'handoff_opened'
    | 'handoff_closed'
    | 'lease_added'
    | 'lease_removed'
    | 'arbitration_reversed';
  regionId: string | null;
  detail: string;
}

export interface CoordinationReconcileReport {
  turn: number;
  stable: boolean;
  changes: CoordinationReconcileChange[];
  thrashingRegions: string[];
}

function handoffKey(h: HandoffRequest): string {
  return `${h.id}:${h.status}`;
}

/** Compare two coordination plans for material diffs (turn-to-turn stability). */
export function reconcileCoordinationPlans(
  previous: CoordinationPlan | null,
  next: CoordinationPlan,
  turn: number,
): CoordinationReconcileReport {
  const changes: CoordinationReconcileChange[] = [];
  if (!previous) {
    return { turn, stable: true, changes, thrashingRegions: [] };
  }

  const prevRegions = previous.mutexRegions;
  const nextRegions = next.mutexRegions;
  new Set([...Object.keys(prevRegions), ...Object.keys(nextRegions)]).forEach(regionId => {
    const a = prevRegions[regionId];
    const b = nextRegions[regionId];
    if (a && b && a !== b) {
      changes.push({
        kind: 'mutex_holder_changed',
        regionId,
        detail: `${regionId}: ${a} → ${b}`,
      });
      const prevArb = previous.arbitrationLog.find(x => x.regionId === regionId);
      const nextArb = next.arbitrationLog.find(x => x.regionId === regionId);
      if (prevArb && nextArb && prevArb.winnerActorId !== nextArb.winnerActorId) {
        changes.push({
          kind: 'arbitration_reversed',
          regionId,
          detail: `arbitration ${prevArb.winnerActorId} → ${nextArb.winnerActorId}`,
        });
      }
    }
  });

  const prevHandoffs = new Map(previous.handoffs.map(h => [handoffKey(h), h]));
  next.handoffs.forEach(h => {
    const k = handoffKey(h);
    const p = prevHandoffs.get(k);
    if (!p && h.status === 'pending') {
      changes.push({ kind: 'handoff_opened', regionId: h.regionId, detail: h.id });
    }
  });
  previous.handoffs.forEach(h => {
    const n = next.handoffs.find(x => x.id === h.id);
    if (h.status === 'pending' && n && n.status !== 'pending') {
      changes.push({
        kind: 'handoff_closed',
        regionId: h.regionId,
        detail: `${h.id} → ${n.status}`,
      });
    }
  });

  const prevLeaseIds = new Set(previous.leases.map(l => l.id));
  const nextLeaseIds = new Set(next.leases.map(l => l.id));
  next.leases.forEach(l => {
    if (!prevLeaseIds.has(l.id)) {
      changes.push({ kind: 'lease_added', regionId: l.regionId, detail: l.id });
    }
  });
  previous.leases.forEach(l => {
    if (!nextLeaseIds.has(l.id)) {
      changes.push({ kind: 'lease_removed', regionId: l.regionId, detail: l.id });
    }
  });

  return {
    turn,
    stable: changes.length === 0,
    changes,
    thrashingRegions: [],
  };
}

/** Flag regions whose mutex holder changed in ≥2 of the last N snapshots. */
export function detectMutexThrashing(
  mutexHistory: Array<Record<string, string>>,
  minFlips: number = 2,
): string[] {
  const flips: Record<string, number> = {};
  for (let i = 1; i < mutexHistory.length; i += 1) {
    const prev = mutexHistory[i - 1];
    const cur = mutexHistory[i];
    new Set([...Object.keys(prev), ...Object.keys(cur)]).forEach(regionId => {
      if (prev[regionId] && cur[regionId] && prev[regionId] !== cur[regionId]) {
        flips[regionId] = (flips[regionId] || 0) + 1;
      }
    });
  }
  return Object.entries(flips)
    .filter(([, n]) => n >= minFlips)
    .map(([regionId]) => regionId)
    .sort();
}

export function mergeReconcileThrashing(
  report: CoordinationReconcileReport,
  mutexHistory: Array<Record<string, string>>,
): CoordinationReconcileReport {
  const thrashingRegions = detectMutexThrashing(mutexHistory);
  return {
    ...report,
    stable: report.stable && thrashingRegions.length === 0,
    thrashingRegions,
  };
}

export function summarizeArbitrationDemotions(log: PriorityArbitrationRecord[]): number {
  return log.reduce((s, e) => s + e.demoted.length, 0);
}


// --- source: multi-agent-state.ts ---
  mergeReconcileThrashing,
  reconcileCoordinationPlans,
} from './coordination-reconcile.ts';
  buildActorDirectiveConstraints,
  coordinateTeammateDirectives,
} from './directive-coordination.ts';
  advanceDuplicateGuardTurn,
  emptyDuplicateGuardState,
  reserveActionSlot,
  reservationKeyForRegionAction,
  sanitizeDuplicateGuardState,
} from './duplicate-action-guard.ts';
  assignTeamRolesWithSlots,
  detectIllegalSharedExclusiveTasks,
} from './role-assignment-engine.ts';
  decideTeamMultiAgentPersistence,
  teamMultiAgentPersistSignature,
} from './layer-persistence.ts';
  buildActorCapacityLedger,
  suggestCapacityRebalanceNotes,
} from './actor-capacity-ledger.ts';
  evaluateWorkstreamBarriers,
  trackWorkstreamBarrierSince,
} from './workstream-barrier-monitor.ts';
  assertTasksTeamScoped,
  filterCrossTeamDirectives,
  teamActorScope,
} from './team-boundary-guard.ts';
  AGENT18_LIMITS,
  TeamMultiAgentEvaluation,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
  TeamMultiAgentPersistenceDecision,
} from './types.ts';

const emptyCoordination = {
  leases: [],
  handoffs: [],
  workstreams: [],
  mutexRegions: {},
  warnings: [],
  arbitrationLog: [],
};

export function sanitizeTeamMultiAgentCoordinationState(
  raw: unknown,
  teamId: string,
  turn: number,
): TeamMultiAgentLayerState {
  const empty: TeamMultiAgentLayerState = {
    version: 1,
    teamId,
    turn,
    roles: [],
    coordination: { ...emptyCoordination },
    duplicateGuard: emptyDuplicateGuardState(turn),
    diagnostics: [],
    meta: emptyCoordinationMeta(),
    auditFindings: [],
  };
  if (!raw || typeof raw !== 'object') return empty;
  const r = raw as Record<string, unknown>;
  const roles = Array.isArray(r.roles) ? (r.roles as TeamMultiAgentLayerState['roles']) : [];
  const coordination =
    r.coordination && typeof r.coordination === 'object'
      ? (r.coordination as TeamMultiAgentLayerState['coordination'])
      : empty.coordination;
  const metaRaw = r.meta && typeof r.meta === 'object' ? (r.meta as Record<string, unknown>) : {};
  return {
    version: 1,
    teamId: String(r.teamId || teamId),
    turn: Number(r.turn) || turn,
    roles,
    coordination: {
      leases: Array.isArray(coordination.leases) ? coordination.leases.slice(0, AGENT18_LIMITS.maxLeases) : [],
      handoffs: Array.isArray(coordination.handoffs) ? coordination.handoffs.slice(0, AGENT18_LIMITS.maxHandoffs) : [],
      workstreams: Array.isArray(coordination.workstreams)
        ? coordination.workstreams.slice(0, AGENT18_LIMITS.maxWorkstreams)
        : [],
      mutexRegions:
        coordination.mutexRegions && typeof coordination.mutexRegions === 'object'
          ? (coordination.mutexRegions as Record<string, string>)
          : {},
      warnings: Array.isArray(coordination.warnings) ? coordination.warnings.map(String).slice(0, 12) : [],
      arbitrationLog: Array.isArray(coordination.arbitrationLog)
        ? coordination.arbitrationLog.slice(0, 12)
        : [],
    },
    duplicateGuard: sanitizeDuplicateGuardState(r.duplicateGuard, turn),
    diagnostics: Array.isArray(r.diagnostics) ? r.diagnostics.map(String).slice(0, 20) : [],
    meta: {
      directiveConstraints:
        metaRaw.directiveConstraints && typeof metaRaw.directiveConstraints === 'object'
          ? (metaRaw.directiveConstraints as Record<string, string>)
          : {},
      suppressedDirectiveIds: Array.isArray(metaRaw.suppressedDirectiveIds)
        ? metaRaw.suppressedDirectiveIds.map(String).slice(0, AGENT18_LIMITS.maxSuppressedDirectives)
        : [],
      auditSummary:
        metaRaw.auditSummary && typeof metaRaw.auditSummary === 'object'
          ? (metaRaw.auditSummary as TeamMultiAgentLayerState['meta']['auditSummary'])
          : { errors: 0, warnings: 0, info: 0 },
      lastReconcileStable: metaRaw.lastReconcileStable !== false,
      thrashingRegions: Array.isArray(metaRaw.thrashingRegions)
        ? metaRaw.thrashingRegions.map(String).slice(0, 8)
        : [],
      mutexHistory: Array.isArray(metaRaw.mutexHistory)
        ? (metaRaw.mutexHistory as Array<Record<string, string>>).slice(-5)
        : [],
      handoffSlaCompliance:
        typeof metaRaw.handoffSlaCompliance === 'number' ? metaRaw.handoffSlaCompliance : undefined,
      overdueHandoffIds: Array.isArray(metaRaw.overdueHandoffIds)
        ? metaRaw.overdueHandoffIds.map(String).slice(0, 8)
        : undefined,
      capacityBalanceScore:
        typeof metaRaw.capacityBalanceScore === 'number' ? metaRaw.capacityBalanceScore : undefined,
      overloadedActorIds: Array.isArray(metaRaw.overloadedActorIds)
        ? metaRaw.overloadedActorIds.map(String).slice(0, 8)
        : undefined,
      idleActorIds: Array.isArray(metaRaw.idleActorIds)
        ? metaRaw.idleActorIds.map(String).slice(0, 8)
        : undefined,
      directiveQuotaRemaining:
        metaRaw.directiveQuotaRemaining && typeof metaRaw.directiveQuotaRemaining === 'object'
          ? (metaRaw.directiveQuotaRemaining as Record<string, number>)
          : undefined,
      handoffReadinessAverage:
        typeof metaRaw.handoffReadinessAverage === 'number' ? metaRaw.handoffReadinessAverage : undefined,
      notReadyHandoffIds: Array.isArray(metaRaw.notReadyHandoffIds)
        ? metaRaw.notReadyHandoffIds.map(String).slice(0, 8)
        : undefined,
      mutexStabilityIndex:
        typeof metaRaw.mutexStabilityIndex === 'number' ? metaRaw.mutexStabilityIndex : undefined,
      volatileMutexRegionIds: Array.isArray(metaRaw.volatileMutexRegionIds)
        ? metaRaw.volatileMutexRegionIds.map(String).slice(0, 8)
        : undefined,
      workstreamBarrierCompliance:
        typeof metaRaw.workstreamBarrierCompliance === 'number'
          ? metaRaw.workstreamBarrierCompliance
          : undefined,
      stalledWorkstreamIds: Array.isArray(metaRaw.stalledWorkstreamIds)
        ? metaRaw.stalledWorkstreamIds.map(String).slice(0, 8)
        : undefined,
      workstreamBarrierSince:
        metaRaw.workstreamBarrierSince && typeof metaRaw.workstreamBarrierSince === 'object'
          ? (metaRaw.workstreamBarrierSince as Record<string, number>)
          : undefined,
      roleChurnIndex:
        typeof metaRaw.roleChurnIndex === 'number' ? metaRaw.roleChurnIndex : undefined,
      roleChurnActorIds: Array.isArray(metaRaw.roleChurnActorIds)
        ? metaRaw.roleChurnActorIds.map(String).slice(0, 8)
        : undefined,
      leaseHealthScore:
        typeof metaRaw.leaseHealthScore === 'number' ? metaRaw.leaseHealthScore : undefined,
      expiringLeaseIds: Array.isArray(metaRaw.expiringLeaseIds)
        ? metaRaw.expiringLeaseIds.map(String).slice(0, 8)
        : undefined,
      expiredLeaseIds: Array.isArray(metaRaw.expiredLeaseIds)
        ? metaRaw.expiredLeaseIds.map(String).slice(0, 8)
        : undefined,
      coordinationCompositeScore:
        typeof metaRaw.coordinationCompositeScore === 'number'
          ? metaRaw.coordinationCompositeScore
          : undefined,
      coordinationWeakestDimension:
        typeof metaRaw.coordinationWeakestDimension === 'string'
          ? metaRaw.coordinationWeakestDimension
          : undefined,
      directiveCollisionIndex:
        typeof metaRaw.directiveCollisionIndex === 'number'
          ? metaRaw.directiveCollisionIndex
          : undefined,
      collidingDirectiveIds: Array.isArray(metaRaw.collidingDirectiveIds)
        ? metaRaw.collidingDirectiveIds.map(String).slice(0, 8)
        : undefined,
      handoffIntegrityScore:
        typeof metaRaw.handoffIntegrityScore === 'number' ? metaRaw.handoffIntegrityScore : undefined,
      brokenHandoffIds: Array.isArray(metaRaw.brokenHandoffIds)
        ? metaRaw.brokenHandoffIds.map(String).slice(0, 8)
        : undefined,
      duplicatePendingHandoffTaskIds: Array.isArray(metaRaw.duplicatePendingHandoffTaskIds)
        ? metaRaw.duplicatePendingHandoffTaskIds.map(String).slice(0, 8)
        : undefined,
      coordinationEscalationTier:
        typeof metaRaw.coordinationEscalationTier === 'number'
          ? metaRaw.coordinationEscalationTier
          : undefined,
      coordinationEscalationLabel:
        typeof metaRaw.coordinationEscalationLabel === 'string'
          ? metaRaw.coordinationEscalationLabel
          : undefined,
      coordinationRecoveryUrgency:
        typeof metaRaw.coordinationRecoveryUrgency === 'number'
          ? metaRaw.coordinationRecoveryUrgency
          : undefined,
      coordinationRecoveryActions: Array.isArray(metaRaw.coordinationRecoveryActions)
        ? metaRaw.coordinationRecoveryActions.map(String).slice(0, 8)
        : undefined,
      directivePriorityInversionIndex:
        typeof metaRaw.directivePriorityInversionIndex === 'number'
          ? metaRaw.directivePriorityInversionIndex
          : undefined,
      invertedDirectiveIds: Array.isArray(metaRaw.invertedDirectiveIds)
        ? metaRaw.invertedDirectiveIds.map(String).slice(0, 8)
        : undefined,
      handoffOrphanCount:
        typeof metaRaw.handoffOrphanCount === 'number' ? metaRaw.handoffOrphanCount : undefined,
      orphanHandoffIds: Array.isArray(metaRaw.orphanHandoffIds)
        ? metaRaw.orphanHandoffIds.map(String).slice(0, 8)
        : undefined,
      workstreamDeadlockCount:
        typeof metaRaw.workstreamDeadlockCount === 'number'
          ? metaRaw.workstreamDeadlockCount
          : undefined,
      deadlockedWorkstreamIds: Array.isArray(metaRaw.deadlockedWorkstreamIds)
        ? metaRaw.deadlockedWorkstreamIds.map(String).slice(0, 8)
        : undefined,
      leaseContentionIndex:
        typeof metaRaw.leaseContentionIndex === 'number' ? metaRaw.leaseContentionIndex : undefined,
      contendedRegionIds: Array.isArray(metaRaw.contendedRegionIds)
        ? metaRaw.contendedRegionIds.map(String).slice(0, 8)
        : undefined,
      coordinationSaturationIndex:
        typeof metaRaw.coordinationSaturationIndex === 'number'
          ? metaRaw.coordinationSaturationIndex
          : undefined,
      mutexLeaseDivergenceIndex:
        typeof metaRaw.mutexLeaseDivergenceIndex === 'number'
          ? metaRaw.mutexLeaseDivergenceIndex
          : undefined,
      mutexLeaseDivergentRegionIds: Array.isArray(metaRaw.mutexLeaseDivergentRegionIds)
        ? metaRaw.mutexLeaseDivergentRegionIds.map(String).slice(0, 8)
        : undefined,
      handoffCascadeRiskIndex:
        typeof metaRaw.handoffCascadeRiskIndex === 'number'
          ? metaRaw.handoffCascadeRiskIndex
          : undefined,
      handoffCascadeChainActorIds: Array.isArray(metaRaw.handoffCascadeChainActorIds)
        ? metaRaw.handoffCascadeChainActorIds.map(String).slice(0, 8)
        : undefined,
      suppressionBacklogIndex:
        typeof metaRaw.suppressionBacklogIndex === 'number'
          ? metaRaw.suppressionBacklogIndex
          : undefined,
      reconcileDriftIndex:
        typeof metaRaw.reconcileDriftIndex === 'number' ? metaRaw.reconcileDriftIndex : undefined,
      arbitrationPressureIndex:
        typeof metaRaw.arbitrationPressureIndex === 'number'
          ? metaRaw.arbitrationPressureIndex
          : undefined,
      arbitrationDemotedActorIds: Array.isArray(metaRaw.arbitrationDemotedActorIds)
        ? metaRaw.arbitrationDemotedActorIds.map(String).slice(0, 8)
        : undefined,
      persistenceChurnIndex:
        typeof metaRaw.persistenceChurnIndex === 'number'
          ? metaRaw.persistenceChurnIndex
          : undefined,
      duplicateGuardPressureIndex:
        typeof metaRaw.duplicateGuardPressureIndex === 'number'
          ? metaRaw.duplicateGuardPressureIndex
          : undefined,
      roleTaskCoverageGapIndex:
        typeof metaRaw.roleTaskCoverageGapIndex === 'number'
          ? metaRaw.roleTaskCoverageGapIndex
          : undefined,
      uncoveredTaskIds: Array.isArray(metaRaw.uncoveredTaskIds)
        ? metaRaw.uncoveredTaskIds.map(String).slice(0, 8)
        : undefined,
      compositeHealthGradientIndex:
        typeof metaRaw.compositeHealthGradientIndex === 'number'
          ? metaRaw.compositeHealthGradientIndex
          : undefined,
      compositeHealthTrend:
        typeof metaRaw.compositeHealthTrend === 'string' ? metaRaw.compositeHealthTrend : undefined,
      handoffReadinessSpreadIndex:
        typeof metaRaw.handoffReadinessSpreadIndex === 'number'
          ? metaRaw.handoffReadinessSpreadIndex
          : undefined,
      workstreamParallelismIndex:
        typeof metaRaw.workstreamParallelismIndex === 'number'
          ? metaRaw.workstreamParallelismIndex
          : undefined,
      escalationRecoveryAlignmentIndex:
        typeof metaRaw.escalationRecoveryAlignmentIndex === 'number'
          ? metaRaw.escalationRecoveryAlignmentIndex
          : undefined,
      auditPressureIndex:
        typeof metaRaw.auditPressureIndex === 'number' ? metaRaw.auditPressureIndex : undefined,
      roleLockFrictionIndex:
        typeof metaRaw.roleLockFrictionIndex === 'number' ? metaRaw.roleLockFrictionIndex : undefined,
      lockedRoleActorIds: Array.isArray(metaRaw.lockedRoleActorIds)
        ? metaRaw.lockedRoleActorIds.map(String).slice(0, 8)
        : undefined,
      directiveConstraintDensityIndex:
        typeof metaRaw.directiveConstraintDensityIndex === 'number'
          ? metaRaw.directiveConstraintDensityIndex
          : undefined,
      directiveConstrainedActorIds: Array.isArray(metaRaw.directiveConstrainedActorIds)
        ? metaRaw.directiveConstrainedActorIds.map(String).slice(0, 8)
        : undefined,
      crossTeamRejectionIndex:
        typeof metaRaw.crossTeamRejectionIndex === 'number'
          ? metaRaw.crossTeamRejectionIndex
          : undefined,
      handoffSlaVelocityIndex:
        typeof metaRaw.handoffSlaVelocityIndex === 'number'
          ? metaRaw.handoffSlaVelocityIndex
          : undefined,
      recoveryActionBreadthIndex:
        typeof metaRaw.recoveryActionBreadthIndex === 'number'
          ? metaRaw.recoveryActionBreadthIndex
          : undefined,
      directiveQuotaExhaustionIndex:
        typeof metaRaw.directiveQuotaExhaustionIndex === 'number'
          ? metaRaw.directiveQuotaExhaustionIndex
          : undefined,
      quotaExhaustedActorIds: Array.isArray(metaRaw.quotaExhaustedActorIds)
        ? metaRaw.quotaExhaustedActorIds.map(String).slice(0, 8)
        : undefined,
      capacityImbalanceIndex:
        typeof metaRaw.capacityImbalanceIndex === 'number'
          ? metaRaw.capacityImbalanceIndex
          : undefined,
      workstreamBarrierStalenessIndex:
        typeof metaRaw.workstreamBarrierStalenessIndex === 'number'
          ? metaRaw.workstreamBarrierStalenessIndex
          : undefined,
      workstreamDeadlockPressureIndex:
        typeof metaRaw.workstreamDeadlockPressureIndex === 'number'
          ? metaRaw.workstreamDeadlockPressureIndex
          : undefined,
      suppressionQuotaCouplingIndex:
        typeof metaRaw.suppressionQuotaCouplingIndex === 'number'
          ? metaRaw.suppressionQuotaCouplingIndex
          : undefined,
      handoffLeaseOverlapIndex:
        typeof metaRaw.handoffLeaseOverlapIndex === 'number'
          ? metaRaw.handoffLeaseOverlapIndex
          : undefined,
      saturationDeadlockCouplingIndex:
        typeof metaRaw.saturationDeadlockCouplingIndex === 'number'
          ? metaRaw.saturationDeadlockCouplingIndex
          : undefined,
      cascadeLeaseConvergenceIndex:
        typeof metaRaw.cascadeLeaseConvergenceIndex === 'number'
          ? metaRaw.cascadeLeaseConvergenceIndex
          : undefined,
      gradientAuditTensionIndex:
        typeof metaRaw.gradientAuditTensionIndex === 'number'
          ? metaRaw.gradientAuditTensionIndex
          : undefined,
      escalationSaturationStackIndex:
        typeof metaRaw.escalationSaturationStackIndex === 'number'
          ? metaRaw.escalationSaturationStackIndex
          : undefined,
      recoveryCascadeMismatchIndex:
        typeof metaRaw.recoveryCascadeMismatchIndex === 'number'
          ? metaRaw.recoveryCascadeMismatchIndex
          : undefined,
      persistenceGradientFrictionIndex:
        typeof metaRaw.persistenceGradientFrictionIndex === 'number'
          ? metaRaw.persistenceGradientFrictionIndex
          : undefined,
      stackMismatchCouplingIndex:
        typeof metaRaw.stackMismatchCouplingIndex === 'number'
          ? metaRaw.stackMismatchCouplingIndex
          : undefined,
      auditStackAmplificationIndex:
        typeof metaRaw.auditStackAmplificationIndex === 'number'
          ? metaRaw.auditStackAmplificationIndex
          : undefined,
      frictionAlignmentGapIndex:
        typeof metaRaw.frictionAlignmentGapIndex === 'number'
          ? metaRaw.frictionAlignmentGapIndex
          : undefined,
      couplingAmplificationFusionIndex:
        typeof metaRaw.couplingAmplificationFusionIndex === 'number'
          ? metaRaw.couplingAmplificationFusionIndex
          : undefined,
      gapChurnResonanceIndex:
        typeof metaRaw.gapChurnResonanceIndex === 'number'
          ? metaRaw.gapChurnResonanceIndex
          : undefined,
      stackFrictionConvergenceIndex:
        typeof metaRaw.stackFrictionConvergenceIndex === 'number'
          ? metaRaw.stackFrictionConvergenceIndex
          : undefined,
      fusionResonanceCouplingIndex:
        typeof metaRaw.fusionResonanceCouplingIndex === 'number'
          ? metaRaw.fusionResonanceCouplingIndex
          : undefined,
      convergenceFusionStackIndex:
        typeof metaRaw.convergenceFusionStackIndex === 'number'
          ? metaRaw.convergenceFusionStackIndex
          : undefined,
      resonanceAuditCascadeIndex:
        typeof metaRaw.resonanceAuditCascadeIndex === 'number'
          ? metaRaw.resonanceAuditCascadeIndex
          : undefined,
      couplingStackCascadeIndex:
        typeof metaRaw.couplingStackCascadeIndex === 'number'
          ? metaRaw.couplingStackCascadeIndex
          : undefined,
      stackCascadeAmplificationIndex:
        typeof metaRaw.stackCascadeAmplificationIndex === 'number'
          ? metaRaw.stackCascadeAmplificationIndex
          : undefined,
      cascadeCouplingSynthesisIndex:
        typeof metaRaw.cascadeCouplingSynthesisIndex === 'number'
          ? metaRaw.cascadeCouplingSynthesisIndex
          : undefined,
      cascadeSynthesisFusionIndex:
        typeof metaRaw.cascadeSynthesisFusionIndex === 'number'
          ? metaRaw.cascadeSynthesisFusionIndex
          : undefined,
      amplificationStackResonanceIndex:
        typeof metaRaw.amplificationStackResonanceIndex === 'number'
          ? metaRaw.amplificationStackResonanceIndex
          : undefined,
      synthesisEscalationPressureIndex:
        typeof metaRaw.synthesisEscalationPressureIndex === 'number'
          ? metaRaw.synthesisEscalationPressureIndex
          : undefined,
      fusionResonanceConvergenceIndex:
        typeof metaRaw.fusionResonanceConvergenceIndex === 'number'
          ? metaRaw.fusionResonanceConvergenceIndex
          : undefined,
      pressureFusionCascadeIndex:
        typeof metaRaw.pressureFusionCascadeIndex === 'number'
          ? metaRaw.pressureFusionCascadeIndex
          : undefined,
      resonancePressureSynthesisIndex:
        typeof metaRaw.resonancePressureSynthesisIndex === 'number'
          ? metaRaw.resonancePressureSynthesisIndex
          : undefined,
      convergenceCascadeSynthesisIndex:
        typeof metaRaw.convergenceCascadeSynthesisIndex === 'number'
          ? metaRaw.convergenceCascadeSynthesisIndex
          : undefined,
      synthesisConvergenceStackIndex:
        typeof metaRaw.synthesisConvergenceStackIndex === 'number'
          ? metaRaw.synthesisConvergenceStackIndex
          : undefined,
      cascadeResonanceAmplificationIndex:
        typeof metaRaw.cascadeResonanceAmplificationIndex === 'number'
          ? metaRaw.cascadeResonanceAmplificationIndex
          : undefined,
      synthesisStackAmplificationIndex:
        typeof metaRaw.synthesisStackAmplificationIndex === 'number'
          ? metaRaw.synthesisStackAmplificationIndex
          : undefined,
      amplificationConvergenceCascadeIndex:
        typeof metaRaw.amplificationConvergenceCascadeIndex === 'number'
          ? metaRaw.amplificationConvergenceCascadeIndex
          : undefined,
      stackSynthesisResonanceIndex:
        typeof metaRaw.stackSynthesisResonanceIndex === 'number'
          ? metaRaw.stackSynthesisResonanceIndex
          : undefined,
      stackAmplificationCascadeFusionIndex:
        typeof metaRaw.stackAmplificationCascadeFusionIndex === 'number'
          ? metaRaw.stackAmplificationCascadeFusionIndex
          : undefined,
      resonanceAmplificationStackIndex:
        typeof metaRaw.resonanceAmplificationStackIndex === 'number'
          ? metaRaw.resonanceAmplificationStackIndex
          : undefined,
      cascadeConvergenceResonanceIndex:
        typeof metaRaw.cascadeConvergenceResonanceIndex === 'number'
          ? metaRaw.cascadeConvergenceResonanceIndex
          : undefined,
      fusionStackConvergenceIndex:
        typeof metaRaw.fusionStackConvergenceIndex === 'number'
          ? metaRaw.fusionStackConvergenceIndex
          : undefined,
      resonanceCascadeSynthesisIndex:
        typeof metaRaw.resonanceCascadeSynthesisIndex === 'number'
          ? metaRaw.resonanceCascadeSynthesisIndex
          : undefined,
      convergenceAmplificationPressureIndex:
        typeof metaRaw.convergenceAmplificationPressureIndex === 'number'
          ? metaRaw.convergenceAmplificationPressureIndex
          : undefined,
      convergenceSynthesisFusionIndex:
        typeof metaRaw.convergenceSynthesisFusionIndex === 'number'
          ? metaRaw.convergenceSynthesisFusionIndex
          : undefined,
      pressureCascadeStackIndex:
        typeof metaRaw.pressureCascadeStackIndex === 'number'
          ? metaRaw.pressureCascadeStackIndex
          : undefined,
      synthesisPressureResonanceIndex:
        typeof metaRaw.synthesisPressureResonanceIndex === 'number'
          ? metaRaw.synthesisPressureResonanceIndex
          : undefined,
      fusionCascadeStackIndex:
        typeof metaRaw.fusionCascadeStackIndex === 'number'
          ? metaRaw.fusionCascadeStackIndex
          : undefined,
      resonancePressureCascadeIndex:
        typeof metaRaw.resonancePressureCascadeIndex === 'number'
          ? metaRaw.resonancePressureCascadeIndex
          : undefined,
      synthesisFusionConvergenceIndex:
        typeof metaRaw.synthesisFusionConvergenceIndex === 'number'
          ? metaRaw.synthesisFusionConvergenceIndex
          : undefined,
      stackCascadeResonanceIndex:
        typeof metaRaw.stackCascadeResonanceIndex === 'number'
          ? metaRaw.stackCascadeResonanceIndex
          : undefined,
      cascadeConvergencePressureIndex:
        typeof metaRaw.cascadeConvergencePressureIndex === 'number'
          ? metaRaw.cascadeConvergencePressureIndex
          : undefined,
      convergenceFusionSynthesisIndex:
        typeof metaRaw.convergenceFusionSynthesisIndex === 'number'
          ? metaRaw.convergenceFusionSynthesisIndex
          : undefined,
      resonanceConvergenceFusionIndex:
        typeof metaRaw.resonanceConvergenceFusionIndex === 'number'
          ? metaRaw.resonanceConvergenceFusionIndex
          : undefined,
      pressureSynthesisCascadeIndex:
        typeof metaRaw.pressureSynthesisCascadeIndex === 'number'
          ? metaRaw.pressureSynthesisCascadeIndex
          : undefined,
      synthesisResonanceStackIndex:
        typeof metaRaw.synthesisResonanceStackIndex === 'number'
          ? metaRaw.synthesisResonanceStackIndex
          : undefined,
      convergenceFusionPressureIndex:
        typeof metaRaw.convergenceFusionPressureIndex === 'number'
          ? metaRaw.convergenceFusionPressureIndex
          : undefined,
      synthesisCascadeStackIndex:
        typeof metaRaw.synthesisCascadeStackIndex === 'number'
          ? metaRaw.synthesisCascadeStackIndex
          : undefined,
      resonanceStackFusionIndex:
        typeof metaRaw.resonanceStackFusionIndex === 'number'
          ? metaRaw.resonanceStackFusionIndex
          : undefined,
      pressureStackResonanceIndex:
        typeof metaRaw.pressureStackResonanceIndex === 'number'
          ? metaRaw.pressureStackResonanceIndex
          : undefined,
      stackFusionCascadeIndex:
        typeof metaRaw.stackFusionCascadeIndex === 'number'
          ? metaRaw.stackFusionCascadeIndex
          : undefined,
      fusionCascadeConvergenceIndex:
        typeof metaRaw.fusionCascadeConvergenceIndex === 'number'
          ? metaRaw.fusionCascadeConvergenceIndex
          : undefined,
      resonanceFusionStackIndex:
        typeof metaRaw.resonanceFusionStackIndex === 'number'
          ? metaRaw.resonanceFusionStackIndex
          : undefined,
      fusionCascadePressureIndex:
        typeof metaRaw.fusionCascadePressureIndex === 'number'
          ? metaRaw.fusionCascadePressureIndex
          : undefined,
      stackConvergenceResonanceIndex:
        typeof metaRaw.stackConvergenceResonanceIndex === 'number'
          ? metaRaw.stackConvergenceResonanceIndex
          : undefined,
      fusionStackPressureIndex:
        typeof metaRaw.fusionStackPressureIndex === 'number'
          ? metaRaw.fusionStackPressureIndex
          : undefined,
      pressureResonanceCascadeIndex:
        typeof metaRaw.pressureResonanceCascadeIndex === 'number'
          ? metaRaw.pressureResonanceCascadeIndex
          : undefined,
      stackSynthesisConvergenceIndex:
        typeof metaRaw.stackSynthesisConvergenceIndex === 'number'
          ? metaRaw.stackSynthesisConvergenceIndex
          : undefined,
      pressureCascadeFusionIndex:
        typeof metaRaw.pressureCascadeFusionIndex === 'number'
          ? metaRaw.pressureCascadeFusionIndex
          : undefined,
      cascadeSynthesisResonanceIndex:
        typeof metaRaw.cascadeSynthesisResonanceIndex === 'number'
          ? metaRaw.cascadeSynthesisResonanceIndex
          : undefined,
      convergencePressureStackIndex:
        typeof metaRaw.convergencePressureStackIndex === 'number'
          ? metaRaw.convergencePressureStackIndex
          : undefined,
      fusionCascadeResonanceIndex:
        typeof metaRaw.fusionCascadeResonanceIndex === 'number'
          ? metaRaw.fusionCascadeResonanceIndex
          : undefined,
      resonancePressureStackIndex:
        typeof metaRaw.resonancePressureStackIndex === 'number'
          ? metaRaw.resonancePressureStackIndex
          : undefined,
      stackSynthesisFusionIndex:
        typeof metaRaw.stackSynthesisFusionIndex === 'number'
          ? metaRaw.stackSynthesisFusionIndex
          : undefined,
      cascadeResonanceStackIndex:
        typeof metaRaw.cascadeResonanceStackIndex === 'number'
          ? metaRaw.cascadeResonanceStackIndex
          : undefined,
      resonanceFusionPressureIndex:
        typeof metaRaw.resonanceFusionPressureIndex === 'number'
          ? metaRaw.resonanceFusionPressureIndex
          : undefined,
      fusionConvergenceSynthesisIndex:
        typeof metaRaw.fusionConvergenceSynthesisIndex === 'number'
          ? metaRaw.fusionConvergenceSynthesisIndex
          : undefined,
      stackResonancePressureIndex:
        typeof metaRaw.stackResonancePressureIndex === 'number'
          ? metaRaw.stackResonancePressureIndex
          : undefined,
      pressureFusionSynthesisIndex:
        typeof metaRaw.pressureFusionSynthesisIndex === 'number'
          ? metaRaw.pressureFusionSynthesisIndex
          : undefined,
      synthesisStackConvergenceIndex:
        typeof metaRaw.synthesisStackConvergenceIndex === 'number'
          ? metaRaw.synthesisStackConvergenceIndex
          : undefined,
      stackFusionResonanceIndex:
        typeof metaRaw.stackFusionResonanceIndex === 'number'
          ? metaRaw.stackFusionResonanceIndex
          : undefined,
      fusionSynthesisPressureIndex:
        typeof metaRaw.fusionSynthesisPressureIndex === 'number'
          ? metaRaw.fusionSynthesisPressureIndex
          : undefined,
      synthesisCascadeConvergenceIndex:
        typeof metaRaw.synthesisCascadeConvergenceIndex === 'number'
          ? metaRaw.synthesisCascadeConvergenceIndex
          : undefined,
      fusionResonanceSynthesisIndex:
        typeof metaRaw.fusionResonanceSynthesisIndex === 'number'
          ? metaRaw.fusionResonanceSynthesisIndex
          : undefined,
      pressureCascadeConvergenceIndex:
        typeof metaRaw.pressureCascadeConvergenceIndex === 'number'
          ? metaRaw.pressureCascadeConvergenceIndex
          : undefined,
      cascadeStackFusionIndex:
        typeof metaRaw.cascadeStackFusionIndex === 'number'
          ? metaRaw.cascadeStackFusionIndex
          : undefined,
      synthesisResonanceConvergenceIndex:
        typeof metaRaw.synthesisResonanceConvergenceIndex === 'number'
          ? metaRaw.synthesisResonanceConvergenceIndex
          : undefined,
      pressureStackFusionIndex:
        typeof metaRaw.pressureStackFusionIndex === 'number'
          ? metaRaw.pressureStackFusionIndex
          : undefined,
      fusionStackSynthesisIndex:
        typeof metaRaw.fusionStackSynthesisIndex === 'number'
          ? metaRaw.fusionStackSynthesisIndex
          : undefined,
      resonanceConvergenceStackIndex:
        typeof metaRaw.resonanceConvergenceStackIndex === 'number'
          ? metaRaw.resonanceConvergenceStackIndex
          : undefined,
      pressureStackSynthesisIndex:
        typeof metaRaw.pressureStackSynthesisIndex === 'number'
          ? metaRaw.pressureStackSynthesisIndex
          : undefined,
      fusionStackResonanceIndex:
        typeof metaRaw.fusionStackResonanceIndex === 'number'
          ? metaRaw.fusionStackResonanceIndex
          : undefined,
      convergenceStackSynthesisIndex:
        typeof metaRaw.convergenceStackSynthesisIndex === 'number'
          ? metaRaw.convergenceStackSynthesisIndex
          : undefined,
      stackSynthesisPressureIndex:
        typeof metaRaw.stackSynthesisPressureIndex === 'number'
          ? metaRaw.stackSynthesisPressureIndex
          : undefined,
      fusionResonanceStackIndex:
        typeof metaRaw.fusionResonanceStackIndex === 'number'
          ? metaRaw.fusionResonanceStackIndex
          : undefined,
      synthesisPressureConvergenceIndex:
        typeof metaRaw.synthesisPressureConvergenceIndex === 'number'
          ? metaRaw.synthesisPressureConvergenceIndex
          : undefined,
      pressureFusionStackIndex:
        typeof metaRaw.pressureFusionStackIndex === 'number'
          ? metaRaw.pressureFusionStackIndex
          : undefined,
      resonanceSynthesisFusionIndex:
        typeof metaRaw.resonanceSynthesisFusionIndex === 'number'
          ? metaRaw.resonanceSynthesisFusionIndex
          : undefined,
      convergencePressureFusionIndex:
        typeof metaRaw.convergencePressureFusionIndex === 'number'
          ? metaRaw.convergencePressureFusionIndex
          : undefined,
      pressureResonanceSynthesisIndex:
        typeof metaRaw.pressureResonanceSynthesisIndex === 'number'
          ? metaRaw.pressureResonanceSynthesisIndex
          : undefined,
      fusionConvergencePressureIndex:
        typeof metaRaw.fusionConvergencePressureIndex === 'number'
          ? metaRaw.fusionConvergencePressureIndex
          : undefined,
      fusionSynthesisResonanceIndex:
        typeof metaRaw.fusionSynthesisResonanceIndex === 'number'
          ? metaRaw.fusionSynthesisResonanceIndex
          : undefined,
      resonancePressureConvergenceIndex:
        typeof metaRaw.resonancePressureConvergenceIndex === 'number'
          ? metaRaw.resonancePressureConvergenceIndex
          : undefined,
      pressureFusionConvergenceIndex:
        typeof metaRaw.pressureFusionConvergenceIndex === 'number'
          ? metaRaw.pressureFusionConvergenceIndex
          : undefined,
      resonanceConvergenceSynthesisIndex:
        typeof metaRaw.resonanceConvergenceSynthesisIndex === 'number'
          ? metaRaw.resonanceConvergenceSynthesisIndex
          : undefined,
      synthesisPressureFusionIndex:
        typeof metaRaw.synthesisPressureFusionIndex === 'number'
          ? metaRaw.synthesisPressureFusionIndex
          : undefined,
      convergenceSynthesisResonanceIndex:
        typeof metaRaw.convergenceSynthesisResonanceIndex === 'number'
          ? metaRaw.convergenceSynthesisResonanceIndex
          : undefined,
      synthesisConvergencePressureIndex:
        typeof metaRaw.synthesisConvergencePressureIndex === 'number'
          ? metaRaw.synthesisConvergencePressureIndex
          : undefined,
      convergencePressureSynthesisIndex:
        typeof metaRaw.convergencePressureSynthesisIndex === 'number'
          ? metaRaw.convergencePressureSynthesisIndex
          : undefined,
      pressureSynthesisConvergenceIndex:
        typeof metaRaw.pressureSynthesisConvergenceIndex === 'number'
          ? metaRaw.pressureSynthesisConvergenceIndex
          : undefined,
    },
    auditFindings: Array.isArray(r.auditFindings)
      ? (r.auditFindings as TeamMultiAgentLayerState['auditFindings']).slice(0, AGENT18_LIMITS.maxAuditFindings)
      : [],
  };
}

export function teamMultiAgentSignature(state: TeamMultiAgentLayerState): string {
  return teamMultiAgentPersistSignature(state);
}

/**
 * Evaluate the Agent 18 multi-agent layer: roles + coordination + duplicate reservations.
 * Pure function — safe to call from Team OS evaluation and Strategic Command sync.
 */
export function evaluateTeamMultiAgentLayer(
  inputs: TeamMultiAgentInputs,
  previous: TeamMultiAgentLayerState | null,
): TeamMultiAgentEvaluation {
  const diagnostics: string[] = [];
  const roleMinTurns = inputs.roleMinTurns || AGENT18_LIMITS.roleMinTurnsDefault;
  const { roles, notes } = assignTeamRolesWithSlots({ ...inputs, roleMinTurns });
  diagnostics.push(...notes);
  const roleTaskCoverage = computeRoleTaskCoverageGap(roles, inputs.tasks);
  roleTaskCoverage.notes.forEach(n => diagnostics.push(n));
  const roleLockFriction = computeRoleLockFrictionIndex(inputs.turn, roles);
  roleLockFriction.notes.forEach(n => diagnostics.push(n));
  const sharedIssues = detectIllegalSharedExclusiveTasks(inputs.tasks);
  const locked = [...inputs.lockedRoles, ...(inputs.command?.lockedActorIds || [])];
  const coordination = orchestrateTeamCoordination(inputs.turn, inputs.tasks, roles, locked);
  diagnostics.push(...coordination.warnings);
  coordination.arbitrationLog.forEach(a => diagnostics.push(a.reason));

  const directiveConstraints = buildActorDirectiveConstraints(coordination, roles);
  const scope = teamActorScope(inputs);
  diagnostics.push(...assertTasksTeamScoped(inputs, scope));

  const rawProposals = inputs.directiveProposals || [];
  const scoped = filterCrossTeamDirectives(rawProposals, scope);
  scoped.rejected.forEach(r =>
    diagnostics.push(`Rejected cross-team directive ${r.proposal.id}: ${r.reason}`),
  );
  const crossTeamRejection = computeCrossTeamRejectionIndex(
    scoped.rejected.length,
    rawProposals.length,
  );
  crossTeamRejection.notes.forEach(n => diagnostics.push(n));
  const quota = applyDirectiveQuotaGuard(scoped.inTeam, {
    maxPerActorPerTurn: AGENT18_LIMITS.maxDirectivesPerActorPerTurn,
    maxPerTeamPerTurn: AGENT18_LIMITS.maxDirectivesPerTeamPerTurn,
  });
  quota.dropped.forEach(d =>
    diagnostics.push(`Dropped directive ${d.proposal.id}: ${d.reason}`),
  );
  const quotaExhaustedActorIds = Object.entries(quota.remainingByActor)
    .filter(([, remaining]) => remaining === 0)
    .map(([actorId]) => actorId);
  const directiveQuotaExhaustion = computeDirectiveQuotaExhaustionIndex(
    quota.dropped.length,
    quotaExhaustedActorIds,
  );
  directiveQuotaExhaustion.notes.forEach(n => diagnostics.push(n));
  const proposals = quota.allowed;
  const directiveCollisions = computeDirectiveCollisionIndex(proposals);
  directiveCollisions.notes.forEach(n => diagnostics.push(n));
  const handoffIntegrity = evaluateHandoffChainIntegrity(coordination.handoffs, scope);
  handoffIntegrity.notes.forEach(n => diagnostics.push(n));
  const directiveResult = coordinateTeammateDirectives(proposals, coordination, roles);
  const priorityInversion = computeDirectivePriorityInversion(
    proposals,
    directiveCollisions.collidingProposalIds,
    {
      allowed: directiveResult.allowed,
      suppressed: directiveResult.suppressed.map(s => s.proposal),
    },
  );
  priorityInversion.notes.forEach(n => diagnostics.push(n));
  const handoffOrphans = detectHandoffOrphans(coordination.handoffs, inputs.tasks, roles);
  handoffOrphans.notes.forEach(n => diagnostics.push(n));
  const handoffSla = evaluateHandoffSla(inputs.turn, coordination.handoffs, {
    maxPendingTurns: AGENT18_LIMITS.handoffSlaMaxPendingTurns,
  });
  handoffSla.notes.forEach(n => diagnostics.push(n));
  const handoffSlaVelocity = computeHandoffSlaVelocityIndex(
    coordination.handoffs.filter(h => h.status === 'pending').length,
    handoffSla.overdueHandoffIds,
  );
  handoffSlaVelocity.notes.forEach(n => diagnostics.push(n));
  const handoffReadiness = scoreHandoffReadiness(
    coordination.handoffs,
    inputs.actors,
    roles,
    inputs.tasks,
  );
  handoffReadiness.notes.forEach(n => diagnostics.push(n));
  const handoffReadinessSpread = computeHandoffReadinessSpread(handoffReadiness);
  handoffReadinessSpread.notes.forEach(n => diagnostics.push(n));
  const capacityLedger = buildActorCapacityLedger(inputs.actors, inputs.tasks, roles);
  suggestCapacityRebalanceNotes(capacityLedger).forEach(n => diagnostics.push(n));
  const capacityImbalance = computeCapacityImbalanceIndex(
    capacityLedger.balanceScore,
    capacityLedger.overloadedActorIds,
    capacityLedger.idleActorIds,
  );
  capacityImbalance.notes.forEach(n => diagnostics.push(n));
  directiveResult.suppressed.forEach(s =>
    diagnostics.push(`Suppressed directive ${s.proposal.id}: ${s.reason}`),
  );

  let duplicateGuard = previous
    ? advanceDuplicateGuardTurn(previous.duplicateGuard, inputs.turn)
    : emptyDuplicateGuardState(inputs.turn);
  Object.entries(coordination.mutexRegions).forEach(([regionId, holderActorId]) => {
    const task = inputs.tasks.find(t => t.regionId === regionId);
    duplicateGuard = reserveActionSlot(
      duplicateGuard,
      reservationKeyForRegionAction(regionId, 'region_deposit'),
      holderActorId,
      task?.id || `region_${regionId}`,
      inputs.turn,
    );
  });
  const duplicateGuardPressure = measureDuplicateGuardPressure(duplicateGuard);
  duplicateGuardPressure.notes.forEach(n => diagnostics.push(n));

  let state: TeamMultiAgentLayerState = {
    version: 1,
    teamId: inputs.teamId,
    turn: inputs.turn,
    roles,
    coordination,
    duplicateGuard,
    diagnostics,
    meta: emptyCoordinationMeta(),
    auditFindings: [],
  };

  const mutexHistory = [...(previous?.meta.mutexHistory || []), coordination.mutexRegions].slice(
    -AGENT18_LIMITS.maxMutexHistorySnapshots,
  );
  const reconcile = mergeReconcileThrashing(
    reconcileCoordinationPlans(previous?.coordination ?? null, coordination, inputs.turn),
    mutexHistory,
  );
  if (!reconcile.stable) {
    diagnostics.push(`Coordination reconcile: ${reconcile.changes.length} change(s)`);
  }
  if (reconcile.thrashingRegions.length) {
    diagnostics.push(`Mutex thrashing: ${reconcile.thrashingRegions.join(', ')}`);
  }
  const reconcileDrift = computeReconcileDriftIndex(reconcile, reconcile.thrashingRegions.length);
  reconcileDrift.notes.forEach(n => diagnostics.push(n));
  const arbitrationPressure = computeArbitrationPressureIndex(coordination.arbitrationLog);
  arbitrationPressure.notes.forEach(n => diagnostics.push(n));

  const mutexStability = computeMutexStabilityIndex(mutexHistory, reconcile.thrashingRegions);
  mutexStability.notes.forEach(n => diagnostics.push(n));

  const barrierSince = trackWorkstreamBarrierSince(
    previous?.meta.workstreamBarrierSince ?? {},
    coordination.workstreams,
    inputs.turn,
  );
  const workstreamBarriers = evaluateWorkstreamBarriers(
    inputs.turn,
    coordination.workstreams,
    inputs.tasks,
    { workstreamSinceTurn: barrierSince },
  );
  workstreamBarriers.notes.forEach(n => diagnostics.push(n));
  const workstreamBarrierStaleness = computeWorkstreamBarrierStalenessIndex(
    inputs.turn,
    barrierSince,
    workstreamBarriers.stalledWorkstreamIds,
  );
  workstreamBarrierStaleness.notes.forEach(n => diagnostics.push(n));
  const workstreamDeadlocks = detectWorkstreamDeadlocks(coordination.workstreams);
  workstreamDeadlocks.notes.forEach(n => diagnostics.push(n));
  const workstreamParallelism = measureWorkstreamParallelism(coordination.workstreams);
  workstreamParallelism.notes.forEach(n => diagnostics.push(n));
  const workstreamDeadlockPressure = computeWorkstreamDeadlockPressureIndex(
    workstreamDeadlocks.deadlockCount,
    workstreamDeadlocks.deadlockedWorkstreamIds,
    workstreamParallelism.parallelismIndex,
  );
  workstreamDeadlockPressure.notes.forEach(n => diagnostics.push(n));
  const leaseContention = computeLeaseContentionIndex(
    coordination.leases,
    coordination.handoffs,
    coordination.mutexRegions,
  );
  leaseContention.notes.forEach(n => diagnostics.push(n));
  const coordinationSaturation = measureCoordinationSaturation({
    directiveProposalCount: proposals.length,
    pendingHandoffCount: coordination.handoffs.filter(h => h.status === 'pending').length,
    activeLeaseCount: coordination.leases.length,
    activeWorkstreamCount: coordination.workstreams.filter(ws => ws.phase !== 'complete').length,
    suppressedDirectiveCount: directiveResult.suppressed.length + quota.dropped.length,
  });
  coordinationSaturation.notes.forEach(n => diagnostics.push(n));
  const mutexLeaseDivergence = computeMutexLeaseDivergenceIndex(
    coordination.mutexRegions,
    coordination.leases,
  );
  mutexLeaseDivergence.notes.forEach(n => diagnostics.push(n));
  const handoffCascade = analyzeHandoffCascadeRisk(coordination.handoffs);
  handoffCascade.notes.forEach(n => diagnostics.push(n));
  const suppressedIds = [
    ...quota.dropped.map(d => d.proposal.id),
    ...directiveResult.suppressed.map(s => s.proposal.id),
  ];
  const suppressionBacklog = computeSuppressionBacklogIndex({
    suppressedDirectiveIds: suppressedIds,
    droppedDirectiveCount: quota.dropped.length,
    quotaExhaustedActorIds: Object.entries(quota.remainingByActor)
      .filter(([, remaining]) => remaining === 0)
      .map(([actorId]) => actorId),
  });
  suppressionBacklog.notes.forEach(n => diagnostics.push(n));
  const suppressionQuotaCoupling = computeSuppressionQuotaCouplingIndex(
    suppressionBacklog.backlogIndex,
    directiveQuotaExhaustion.exhaustionIndex,
    quotaExhaustedActorIds.length,
  );
  suppressionQuotaCoupling.notes.forEach(n => diagnostics.push(n));

  const roleChurn = computeRoleChurnIndex(previous?.roles ?? null, roles);
  roleChurn.notes.forEach(n => diagnostics.push(n));

  const leaseExpiry = evaluateLeaseExpiry(inputs.turn, coordination.leases);
  leaseExpiry.notes.forEach(n => diagnostics.push(n));
  const leaseAtRiskRegions = new Set<string>();
  coordination.leases.forEach(lease => {
    if (
      leaseExpiry.expiringLeaseIds.includes(lease.id) ||
      leaseExpiry.expiredLeaseIds.includes(lease.id)
    ) {
      if (lease.regionId) leaseAtRiskRegions.add(lease.regionId);
    }
  });
  const pendingHandoffs = coordination.handoffs.filter(h => h.status === 'pending');
  const overlappingPendingHandoffs = pendingHandoffs.filter(
    h => h.regionId !== null && leaseAtRiskRegions.has(h.regionId),
  ).length;
  const handoffLeaseOverlap = computeHandoffLeaseOverlapIndex(
    overlappingPendingHandoffs,
    pendingHandoffs.length,
    leaseExpiry.expiringLeaseIds.length,
    leaseExpiry.expiredLeaseIds.length,
  );
  handoffLeaseOverlap.notes.forEach(n => diagnostics.push(n));

  const saturationDeadlockCoupling = computeSaturationDeadlockCouplingIndex(
    coordinationSaturation.saturationIndex,
    workstreamDeadlockPressure.pressureIndex,
    workstreamDeadlocks.deadlockCount,
  );
  saturationDeadlockCoupling.notes.forEach(n => diagnostics.push(n));
  const cascadeLeaseConvergence = computeCascadeLeaseConvergenceIndex(
    handoffCascade.cascadeRiskIndex,
    handoffLeaseOverlap.overlapIndex,
    handoffCascade.cascadeChainActorIds.length,
  );
  cascadeLeaseConvergence.notes.forEach(n => diagnostics.push(n));

  const coordinationComposite = computeCoordinationComposite({
    handoffSlaCompliance: handoffSla.complianceScore,
    handoffReadinessAverage: handoffReadiness.averageReadiness,
    mutexStabilityIndex: mutexStability.stabilityIndex,
    workstreamBarrierCompliance: workstreamBarriers.barrierComplianceScore,
    capacityBalanceScore: capacityLedger.balanceScore,
    leaseHealthScore: leaseExpiry.leaseHealthScore,
    roleChurnIndex: roleChurn.churnIndex,
  });
  coordinationComposite.notes.forEach(n => diagnostics.push(n));
  const compositeGradient = computeCompositeHealthGradient(
    previous?.meta.coordinationCompositeScore,
    coordinationComposite.compositeScore,
  );
  compositeGradient.notes.forEach(n => diagnostics.push(n));
  const directiveConstraintDensity = computeDirectiveConstraintDensity(
    directiveResult.constraintsByActor,
  );
  directiveConstraintDensity.notes.forEach(n => diagnostics.push(n));

  state = {
    ...state,
    diagnostics,
    meta: {
      ...emptyCoordinationMeta(),
      directiveConstraints: directiveResult.constraintsByActor,
      suppressedDirectiveIds: [
        ...quota.dropped.map(d => d.proposal.id),
        ...directiveResult.suppressed.map(s => s.proposal.id),
      ].slice(0, AGENT18_LIMITS.maxSuppressedDirectives),
      lastReconcileStable: reconcile.stable,
      thrashingRegions: reconcile.thrashingRegions,
      mutexHistory,
      handoffSlaCompliance: handoffSla.complianceScore,
      overdueHandoffIds: handoffSla.overdueHandoffIds,
      capacityBalanceScore: capacityLedger.balanceScore,
      overloadedActorIds: capacityLedger.overloadedActorIds,
      idleActorIds: capacityLedger.idleActorIds,
      directiveQuotaRemaining: quota.remainingByActor,
      handoffReadinessAverage: handoffReadiness.averageReadiness,
      notReadyHandoffIds: handoffReadiness.notReadyHandoffIds,
      mutexStabilityIndex: mutexStability.stabilityIndex,
      volatileMutexRegionIds: mutexStability.volatileRegionIds,
      workstreamBarrierCompliance: workstreamBarriers.barrierComplianceScore,
      stalledWorkstreamIds: workstreamBarriers.stalledWorkstreamIds,
      workstreamBarrierSince: barrierSince,
      roleChurnIndex: roleChurn.churnIndex,
      roleChurnActorIds: roleChurn.churnedActorIds,
      leaseHealthScore: leaseExpiry.leaseHealthScore,
      expiringLeaseIds: leaseExpiry.expiringLeaseIds,
      expiredLeaseIds: leaseExpiry.expiredLeaseIds,
      coordinationCompositeScore: coordinationComposite.compositeScore,
      coordinationWeakestDimension: coordinationComposite.weakestDimension,
      directiveCollisionIndex: directiveCollisions.collisionIndex,
      collidingDirectiveIds: directiveCollisions.collidingProposalIds,
      handoffIntegrityScore: handoffIntegrity.integrityScore,
      brokenHandoffIds: handoffIntegrity.brokenHandoffIds,
      duplicatePendingHandoffTaskIds: handoffIntegrity.duplicatePendingTaskIds,
      directivePriorityInversionIndex: priorityInversion.inversionIndex,
      invertedDirectiveIds: priorityInversion.invertedProposalIds,
      handoffOrphanCount: handoffOrphans.orphanCount,
      orphanHandoffIds: handoffOrphans.orphanHandoffIds,
      workstreamDeadlockCount: workstreamDeadlocks.deadlockCount,
      deadlockedWorkstreamIds: workstreamDeadlocks.deadlockedWorkstreamIds,
      leaseContentionIndex: leaseContention.contentionIndex,
      contendedRegionIds: leaseContention.contendedRegionIds,
      coordinationSaturationIndex: coordinationSaturation.saturationIndex,
      mutexLeaseDivergenceIndex: mutexLeaseDivergence.divergenceIndex,
      mutexLeaseDivergentRegionIds: mutexLeaseDivergence.divergentRegionIds,
      handoffCascadeRiskIndex: handoffCascade.cascadeRiskIndex,
      handoffCascadeChainActorIds: handoffCascade.cascadeChainActorIds,
      suppressionBacklogIndex: suppressionBacklog.backlogIndex,
      reconcileDriftIndex: reconcileDrift.driftIndex,
      arbitrationPressureIndex: arbitrationPressure.pressureIndex,
      arbitrationDemotedActorIds: arbitrationPressure.demotedActorIds,
      duplicateGuardPressureIndex: duplicateGuardPressure.pressureIndex,
      roleTaskCoverageGapIndex: roleTaskCoverage.gapIndex,
      uncoveredTaskIds: roleTaskCoverage.uncoveredTaskIds,
      compositeHealthGradientIndex: compositeGradient.gradientIndex,
      compositeHealthTrend: compositeGradient.trend,
      handoffReadinessSpreadIndex: handoffReadinessSpread.spreadIndex,
      workstreamParallelismIndex: workstreamParallelism.parallelismIndex,
      roleLockFrictionIndex: roleLockFriction.frictionIndex,
      lockedRoleActorIds: roleLockFriction.lockedRoleActorIds,
      directiveConstraintDensityIndex: directiveConstraintDensity.densityIndex,
      directiveConstrainedActorIds: directiveConstraintDensity.constrainedActorIds,
      crossTeamRejectionIndex: crossTeamRejection.rejectionIndex,
      handoffSlaVelocityIndex: handoffSlaVelocity.velocityIndex,
      directiveQuotaExhaustionIndex: directiveQuotaExhaustion.exhaustionIndex,
      quotaExhaustedActorIds: quotaExhaustedActorIds.slice(0, 8),
      capacityImbalanceIndex: capacityImbalance.imbalanceIndex,
      workstreamBarrierStalenessIndex: workstreamBarrierStaleness.stalenessIndex,
      workstreamDeadlockPressureIndex: workstreamDeadlockPressure.pressureIndex,
      suppressionQuotaCouplingIndex: suppressionQuotaCoupling.couplingIndex,
      handoffLeaseOverlapIndex: handoffLeaseOverlap.overlapIndex,
      saturationDeadlockCouplingIndex: saturationDeadlockCoupling.couplingIndex,
      cascadeLeaseConvergenceIndex: cascadeLeaseConvergence.convergenceIndex,
    },
  };

  const auditFindings = auditTeamMultiAgentLayer(state, inputs);
  const escalation = computeCoordinationEscalationTier({
    coordinationCompositeScore: coordinationComposite.compositeScore,
    auditErrors: auditFindings.filter(f => f.severity === 'error').length,
    auditWarnings: auditFindings.filter(f => f.severity === 'warning').length,
    directiveCollisionIndex: directiveCollisions.collisionIndex,
    handoffIntegrityScore: handoffIntegrity.integrityScore,
  });
  escalation.notes.forEach(n => diagnostics.push(n));
  const recoveryPlaybook = buildCoordinationRecoveryPlaybook({
    escalationTier: escalation.tier,
    coordinationCompositeScore: coordinationComposite.compositeScore,
    coordinationWeakestDimension: coordinationComposite.weakestDimension,
    directiveCollisionIndex: directiveCollisions.collisionIndex,
    handoffIntegrityScore: handoffIntegrity.integrityScore,
  });
  recoveryPlaybook.notes.forEach(n => diagnostics.push(n));
  const escalationAlignment = computeEscalationRecoveryAlignment(
    escalation.tier,
    recoveryPlaybook.recoveryUrgency,
  );
  escalationAlignment.notes.forEach(n => diagnostics.push(n));
  const auditPressure = computeAuditPressureIndex(auditFindings);
  auditPressure.notes.forEach(n => diagnostics.push(n));
  const recoveryBreadth = measureRecoveryActionBreadth(
    escalation.tier,
    recoveryPlaybook.recommendedActions,
  );
  recoveryBreadth.notes.forEach(n => diagnostics.push(n));
  state = attachAuditToState(state, auditFindings, {
    coordinationEscalationTier: escalation.tier,
    coordinationEscalationLabel: escalation.label,
    coordinationRecoveryUrgency: recoveryPlaybook.recoveryUrgency,
    coordinationRecoveryActions: recoveryPlaybook.recommendedActions,
    escalationRecoveryAlignmentIndex: escalationAlignment.alignmentIndex,
    auditPressureIndex: auditPressure.pressureIndex,
    recoveryActionBreadthIndex: recoveryBreadth.breadthGapIndex,
  });
  const gradientAuditTension = computeGradientAuditTensionIndex(
    state.meta.compositeHealthGradientIndex ?? 0,
    state.meta.compositeHealthTrend,
    state.meta.auditPressureIndex ?? 0,
  );
  gradientAuditTension.notes.forEach(n => diagnostics.push(n));
  const escalationSaturationStack = computeEscalationSaturationStackIndex(
    state.meta.coordinationEscalationTier ?? 0,
    state.meta.saturationDeadlockCouplingIndex ?? 0,
    state.meta.coordinationSaturationIndex ?? 0,
  );
  escalationSaturationStack.notes.forEach(n => diagnostics.push(n));
  const recoveryCascadeMismatch = computeRecoveryCascadeMismatchIndex(
    state.meta.recoveryActionBreadthIndex ?? 0,
    state.meta.cascadeLeaseConvergenceIndex ?? 0,
    state.meta.coordinationRecoveryUrgency ?? 0,
  );
  recoveryCascadeMismatch.notes.forEach(n => diagnostics.push(n));
  const stackMismatchCoupling = computeStackMismatchCouplingIndex(
    escalationSaturationStack.stackIndex,
    recoveryCascadeMismatch.mismatchIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackMismatchCoupling.notes.forEach(n => diagnostics.push(n));
  const auditStackAmplification = computeAuditStackAmplificationIndex(
    state.meta.auditPressureIndex ?? 0,
    escalationSaturationStack.stackIndex,
    gradientAuditTension.tensionIndex,
  );
  auditStackAmplification.notes.forEach(n => diagnostics.push(n));
  const couplingAmplificationFusion = computeCouplingAmplificationFusionIndex(
    stackMismatchCoupling.couplingIndex,
    auditStackAmplification.amplificationIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  couplingAmplificationFusion.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    meta: {
      ...state.meta,
      gradientAuditTensionIndex: gradientAuditTension.tensionIndex,
      escalationSaturationStackIndex: escalationSaturationStack.stackIndex,
      recoveryCascadeMismatchIndex: recoveryCascadeMismatch.mismatchIndex,
      stackMismatchCouplingIndex: stackMismatchCoupling.couplingIndex,
      auditStackAmplificationIndex: auditStackAmplification.amplificationIndex,
      couplingAmplificationFusionIndex: couplingAmplificationFusion.fusionIndex,
    },
  };
  state = { ...state, diagnostics };

  const coordinationIssues = [
    ...sharedIssues,
    ...coordination.warnings,
    ...auditFindings.filter(f => f.severity !== 'info').map(f => f.message),
  ];

  const persistence = decideTeamMultiAgentPersistence(
    previous,
    state,
    previous ? teamMultiAgentPersistSignature(previous) : null,
    0,
  );
  const persistenceChurn = measurePersistenceChurn(previous, state, persistence);
  persistenceChurn.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    diagnostics,
    meta: { ...state.meta, persistenceChurnIndex: persistenceChurn.churnIndex },
  };
  const persistenceGradientFriction = computePersistenceGradientFrictionIndex(
    persistenceChurn.churnIndex,
    state.meta.gradientAuditTensionIndex ?? 0,
    state.meta.compositeHealthTrend,
  );
  persistenceGradientFriction.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    diagnostics,
    meta: {
      ...state.meta,
      persistenceGradientFrictionIndex: persistenceGradientFriction.frictionIndex,
    },
  };
  const frictionAlignmentGap = computeFrictionAlignmentGapIndex(
    persistenceGradientFriction.frictionIndex,
    state.meta.escalationRecoveryAlignmentIndex ?? 100,
    persistenceChurn.churnIndex,
  );
  frictionAlignmentGap.notes.forEach(n => diagnostics.push(n));
  const gapChurnResonance = computeGapChurnResonanceIndex(
    frictionAlignmentGap.gapIndex,
    persistenceChurn.churnIndex,
    persistenceGradientFriction.frictionIndex,
  );
  gapChurnResonance.notes.forEach(n => diagnostics.push(n));
  const stackFrictionConvergence = computeStackFrictionConvergenceIndex(
    stackMismatchCoupling.couplingIndex,
    frictionAlignmentGap.gapIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackFrictionConvergence.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceCoupling = computeFusionResonanceCouplingIndex(
    couplingAmplificationFusion.fusionIndex,
    gapChurnResonance.resonanceIndex,
    persistenceChurn.churnIndex,
  );
  fusionResonanceCoupling.notes.forEach(n => diagnostics.push(n));
  const convergenceFusionStack = computeConvergenceFusionStackIndex(
    stackFrictionConvergence.convergenceIndex,
    couplingAmplificationFusion.fusionIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceFusionStack.notes.forEach(n => diagnostics.push(n));
  const resonanceAuditCascade = computeResonanceAuditCascadeIndex(
    gapChurnResonance.resonanceIndex,
    state.meta.auditStackAmplificationIndex ?? 0,
    state.meta.auditPressureIndex ?? 0,
  );
  resonanceAuditCascade.notes.forEach(n => diagnostics.push(n));
  const couplingStackCascade = computeCouplingStackCascadeIndex(
    fusionResonanceCoupling.couplingIndex,
    convergenceFusionStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  couplingStackCascade.notes.forEach(n => diagnostics.push(n));
  const stackCascadeAmplification = computeStackCascadeAmplificationIndex(
    convergenceFusionStack.stackIndex,
    resonanceAuditCascade.cascadeIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  stackCascadeAmplification.notes.forEach(n => diagnostics.push(n));
  const cascadeCouplingSynthesis = computeCascadeCouplingSynthesisIndex(
    resonanceAuditCascade.cascadeIndex,
    fusionResonanceCoupling.couplingIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  cascadeCouplingSynthesis.notes.forEach(n => diagnostics.push(n));
  const cascadeSynthesisFusion = computeCascadeSynthesisFusionIndex(
    couplingStackCascade.cascadeIndex,
    cascadeCouplingSynthesis.synthesisIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  cascadeSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  const amplificationStackResonance = computeAmplificationStackResonanceIndex(
    stackCascadeAmplification.amplificationIndex,
    convergenceFusionStack.stackIndex,
    gapChurnResonance.resonanceIndex,
  );
  amplificationStackResonance.notes.forEach(n => diagnostics.push(n));
  const synthesisEscalationPressure = computeSynthesisEscalationPressureIndex(
    cascadeCouplingSynthesis.synthesisIndex,
    stackCascadeAmplification.amplificationIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisEscalationPressure.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceConvergence = computeFusionResonanceConvergenceIndex(
    cascadeSynthesisFusion.fusionIndex,
    amplificationStackResonance.resonanceIndex,
    fusionResonanceCoupling.couplingIndex,
  );
  fusionResonanceConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureFusionCascade = computePressureFusionCascadeIndex(
    synthesisEscalationPressure.pressureIndex,
    cascadeSynthesisFusion.fusionIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  pressureFusionCascade.notes.forEach(n => diagnostics.push(n));
  const resonancePressureSynthesis = computeResonancePressureSynthesisIndex(
    amplificationStackResonance.resonanceIndex,
    synthesisEscalationPressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  resonancePressureSynthesis.notes.forEach(n => diagnostics.push(n));
  const convergenceCascadeSynthesis = computeConvergenceCascadeSynthesisIndex(
    fusionResonanceConvergence.convergenceIndex,
    pressureFusionCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceCascadeSynthesis.notes.forEach(n => diagnostics.push(n));
  const synthesisConvergenceStack = computeSynthesisConvergenceStackIndex(
    resonancePressureSynthesis.synthesisIndex,
    fusionResonanceConvergence.convergenceIndex,
    cascadeSynthesisFusion.fusionIndex,
  );
  synthesisConvergenceStack.notes.forEach(n => diagnostics.push(n));
  const cascadeResonanceAmplification = computeCascadeResonanceAmplificationIndex(
    pressureFusionCascade.cascadeIndex,
    resonancePressureSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeResonanceAmplification.notes.forEach(n => diagnostics.push(n));
  const synthesisStackAmplification = computeSynthesisStackAmplificationIndex(
    convergenceCascadeSynthesis.synthesisIndex,
    synthesisConvergenceStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisStackAmplification.notes.forEach(n => diagnostics.push(n));
  const amplificationConvergenceCascade = computeAmplificationConvergenceCascadeIndex(
    cascadeResonanceAmplification.amplificationIndex,
    convergenceCascadeSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  amplificationConvergenceCascade.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisResonance = computeStackSynthesisResonanceIndex(
    synthesisConvergenceStack.stackIndex,
    cascadeResonanceAmplification.amplificationIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackSynthesisResonance.notes.forEach(n => diagnostics.push(n));
  const stackAmplificationCascadeFusion = computeStackAmplificationCascadeFusionIndex(
    synthesisStackAmplification.amplificationIndex,
    amplificationConvergenceCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackAmplificationCascadeFusion.notes.forEach(n => diagnostics.push(n));
  const resonanceAmplificationStack = computeResonanceAmplificationStackIndex(
    stackSynthesisResonance.resonanceIndex,
    synthesisStackAmplification.amplificationIndex,
    convergenceCascadeSynthesis.synthesisIndex,
  );
  resonanceAmplificationStack.notes.forEach(n => diagnostics.push(n));
  const cascadeConvergenceResonance = computeCascadeConvergenceResonanceIndex(
    amplificationConvergenceCascade.cascadeIndex,
    stackSynthesisResonance.resonanceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeConvergenceResonance.notes.forEach(n => diagnostics.push(n));
  const fusionStackConvergence = computeFusionStackConvergenceIndex(
    stackAmplificationCascadeFusion.fusionIndex,
    resonanceAmplificationStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionStackConvergence.notes.forEach(n => diagnostics.push(n));
  const resonanceCascadeSynthesis = computeResonanceCascadeSynthesisIndex(
    cascadeConvergenceResonance.resonanceIndex,
    stackAmplificationCascadeFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonanceCascadeSynthesis.notes.forEach(n => diagnostics.push(n));
  const convergenceAmplificationPressure = computeConvergenceAmplificationPressureIndex(
    resonanceAmplificationStack.stackIndex,
    cascadeConvergenceResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  convergenceAmplificationPressure.notes.forEach(n => diagnostics.push(n));
  const convergenceSynthesisFusion = computeConvergenceSynthesisFusionIndex(
    fusionStackConvergence.convergenceIndex,
    resonanceCascadeSynthesis.synthesisIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  const pressureCascadeStack = computePressureCascadeStackIndex(
    convergenceAmplificationPressure.pressureIndex,
    fusionStackConvergence.convergenceIndex,
    stackAmplificationCascadeFusion.fusionIndex,
  );
  pressureCascadeStack.notes.forEach(n => diagnostics.push(n));
  const synthesisPressureResonance = computeSynthesisPressureResonanceIndex(
    resonanceCascadeSynthesis.synthesisIndex,
    convergenceAmplificationPressure.pressureIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  synthesisPressureResonance.notes.forEach(n => diagnostics.push(n));
  const fusionCascadeStack = computeFusionCascadeStackIndex(
    convergenceSynthesisFusion.fusionIndex,
    pressureCascadeStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionCascadeStack.notes.forEach(n => diagnostics.push(n));
  const resonancePressureCascade = computeResonancePressureCascadeIndex(
    synthesisPressureResonance.resonanceIndex,
    pressureCascadeStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonancePressureCascade.notes.forEach(n => diagnostics.push(n));
  const synthesisFusionConvergence = computeSynthesisFusionConvergenceIndex(
    convergenceSynthesisFusion.fusionIndex,
    synthesisPressureResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisFusionConvergence.notes.forEach(n => diagnostics.push(n));
  const stackCascadeResonance = computeStackCascadeResonanceIndex(
    fusionCascadeStack.stackIndex,
    resonancePressureCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackCascadeResonance.notes.forEach(n => diagnostics.push(n));
  const cascadeConvergencePressure = computeCascadeConvergencePressureIndex(
    resonancePressureCascade.cascadeIndex,
    synthesisFusionConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeConvergencePressure.notes.forEach(n => diagnostics.push(n));
  const convergenceFusionSynthesis = computeConvergenceFusionSynthesisIndex(
    synthesisFusionConvergence.convergenceIndex,
    fusionCascadeStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  convergenceFusionSynthesis.notes.forEach(n => diagnostics.push(n));
  const resonanceConvergenceFusion = computeResonanceConvergenceFusionIndex(
    stackCascadeResonance.resonanceIndex,
    cascadeConvergencePressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  resonanceConvergenceFusion.notes.forEach(n => diagnostics.push(n));
  const pressureSynthesisCascade = computePressureSynthesisCascadeIndex(
    cascadeConvergencePressure.pressureIndex,
    convergenceFusionSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureSynthesisCascade.notes.forEach(n => diagnostics.push(n));
  const synthesisResonanceStack = computeSynthesisResonanceStackIndex(
    convergenceFusionSynthesis.synthesisIndex,
    stackCascadeResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisResonanceStack.notes.forEach(n => diagnostics.push(n));
  const convergenceFusionPressure = computeConvergenceFusionPressureIndex(
    resonanceConvergenceFusion.fusionIndex,
    pressureSynthesisCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceFusionPressure.notes.forEach(n => diagnostics.push(n));
  const synthesisCascadeStack = computeSynthesisCascadeStackIndex(
    pressureSynthesisCascade.cascadeIndex,
    synthesisResonanceStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  synthesisCascadeStack.notes.forEach(n => diagnostics.push(n));
  const resonanceStackFusion = computeResonanceStackFusionIndex(
    synthesisResonanceStack.stackIndex,
    resonanceConvergenceFusion.fusionIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  resonanceStackFusion.notes.forEach(n => diagnostics.push(n));
  const pressureStackResonance = computePressureStackResonanceIndex(
    convergenceFusionPressure.pressureIndex,
    synthesisCascadeStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  pressureStackResonance.notes.forEach(n => diagnostics.push(n));
  const stackFusionCascade = computeStackFusionCascadeIndex(
    synthesisCascadeStack.stackIndex,
    resonanceStackFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  stackFusionCascade.notes.forEach(n => diagnostics.push(n));
  const fusionCascadeConvergence = computeFusionCascadeConvergenceIndex(
    resonanceStackFusion.fusionIndex,
    convergenceFusionPressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionCascadeConvergence.notes.forEach(n => diagnostics.push(n));
  const resonanceFusionStack = computeResonanceFusionStackIndex(
    pressureStackResonance.resonanceIndex,
    stackFusionCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  resonanceFusionStack.notes.forEach(n => diagnostics.push(n));
  const fusionCascadePressure = computeFusionCascadePressureIndex(
    stackFusionCascade.cascadeIndex,
    fusionCascadeConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  fusionCascadePressure.notes.forEach(n => diagnostics.push(n));
  const stackConvergenceResonance = computeStackConvergenceResonanceIndex(
    fusionCascadeConvergence.convergenceIndex,
    pressureStackResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackConvergenceResonance.notes.forEach(n => diagnostics.push(n));
  const fusionStackPressure = computeFusionStackPressureIndex(
    resonanceFusionStack.stackIndex,
    fusionCascadePressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionStackPressure.notes.forEach(n => diagnostics.push(n));
  const pressureResonanceCascade = computePressureResonanceCascadeIndex(
    fusionCascadePressure.pressureIndex,
    stackConvergenceResonance.resonanceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureResonanceCascade.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisConvergence = computeStackSynthesisConvergenceIndex(
    stackConvergenceResonance.resonanceIndex,
    resonanceFusionStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackSynthesisConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureCascadeFusion = computePressureCascadeFusionIndex(
    fusionStackPressure.pressureIndex,
    pressureResonanceCascade.cascadeIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  pressureCascadeFusion.notes.forEach(n => diagnostics.push(n));
  const cascadeSynthesisResonance = computeCascadeSynthesisResonanceIndex(
    pressureResonanceCascade.cascadeIndex,
    stackSynthesisConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  cascadeSynthesisResonance.notes.forEach(n => diagnostics.push(n));
  const convergencePressureStack = computeConvergencePressureStackIndex(
    stackSynthesisConvergence.convergenceIndex,
    fusionStackPressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  convergencePressureStack.notes.forEach(n => diagnostics.push(n));
  const fusionCascadeResonance = computeFusionCascadeResonanceIndex(
    pressureCascadeFusion.fusionIndex,
    cascadeSynthesisResonance.resonanceIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionCascadeResonance.notes.forEach(n => diagnostics.push(n));
  const resonancePressureStack = computeResonancePressureStackIndex(
    cascadeSynthesisResonance.resonanceIndex,
    convergencePressureStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonancePressureStack.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisFusion = computeStackSynthesisFusionIndex(
    convergencePressureStack.stackIndex,
    pressureCascadeFusion.fusionIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  stackSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  const cascadeResonanceStack = computeCascadeResonanceStackIndex(
    fusionCascadeResonance.resonanceIndex,
    resonancePressureStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  cascadeResonanceStack.notes.forEach(n => diagnostics.push(n));
  const resonanceFusionPressure = computeResonanceFusionPressureIndex(
    resonancePressureStack.stackIndex,
    stackSynthesisFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonanceFusionPressure.notes.forEach(n => diagnostics.push(n));
  const fusionConvergenceSynthesis = computeFusionConvergenceSynthesisIndex(
    stackSynthesisFusion.fusionIndex,
    fusionCascadeResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionConvergenceSynthesis.notes.forEach(n => diagnostics.push(n));
  const stackResonancePressure = computeStackResonancePressureIndex(
    cascadeResonanceStack.stackIndex,
    resonanceFusionPressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackResonancePressure.notes.forEach(n => diagnostics.push(n));
  const pressureFusionSynthesis = computePressureFusionSynthesisIndex(
    resonanceFusionPressure.pressureIndex,
    fusionConvergenceSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureFusionSynthesis.notes.forEach(n => diagnostics.push(n));
  const synthesisStackConvergence = computeSynthesisStackConvergenceIndex(
    fusionConvergenceSynthesis.synthesisIndex,
    cascadeResonanceStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisStackConvergence.notes.forEach(n => diagnostics.push(n));
  const stackFusionResonance = computeStackFusionResonanceIndex(
    stackResonancePressure.pressureIndex,
    pressureFusionSynthesis.synthesisIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  stackFusionResonance.notes.forEach(n => diagnostics.push(n));
  const fusionSynthesisPressure = computeFusionSynthesisPressureIndex(
    pressureFusionSynthesis.synthesisIndex,
    synthesisStackConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  fusionSynthesisPressure.notes.forEach(n => diagnostics.push(n));
  const synthesisCascadeConvergence = computeSynthesisCascadeConvergenceIndex(
    synthesisStackConvergence.convergenceIndex,
    stackResonancePressure.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  synthesisCascadeConvergence.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceSynthesis = computeFusionResonanceSynthesisIndex(
    stackFusionResonance.resonanceIndex,
    fusionSynthesisPressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionResonanceSynthesis.notes.forEach(n => diagnostics.push(n));
  const pressureCascadeConvergence = computePressureCascadeConvergenceIndex(
    fusionSynthesisPressure.pressureIndex,
    synthesisCascadeConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureCascadeConvergence.notes.forEach(n => diagnostics.push(n));
  const cascadeStackFusion = computeCascadeStackFusionIndex(
    synthesisCascadeConvergence.convergenceIndex,
    stackFusionResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  cascadeStackFusion.notes.forEach(n => diagnostics.push(n));
  const synthesisResonanceConvergence = computeSynthesisResonanceConvergenceIndex(
    fusionResonanceSynthesis.synthesisIndex,
    pressureCascadeConvergence.convergenceIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisResonanceConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureStackFusion = computePressureStackFusionIndex(
    pressureCascadeConvergence.convergenceIndex,
    cascadeStackFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureStackFusion.notes.forEach(n => diagnostics.push(n));
  const fusionStackSynthesis = computeFusionStackSynthesisIndex(
    cascadeStackFusion.fusionIndex,
    fusionResonanceSynthesis.synthesisIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionStackSynthesis.notes.forEach(n => diagnostics.push(n));
  const resonanceConvergenceStack = computeResonanceConvergenceStackIndex(
    synthesisResonanceConvergence.convergenceIndex,
    pressureStackFusion.fusionIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  resonanceConvergenceStack.notes.forEach(n => diagnostics.push(n));
  const pressureStackSynthesis = computePressureStackSynthesisIndex(
    pressureStackFusion.fusionIndex,
    fusionStackSynthesis.synthesisIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureStackSynthesis.notes.forEach(n => diagnostics.push(n));
  const fusionStackResonance = computeFusionStackResonanceIndex(
    fusionStackSynthesis.synthesisIndex,
    synthesisResonanceConvergence.convergenceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionStackResonance.notes.forEach(n => diagnostics.push(n));
  const convergenceStackSynthesis = computeConvergenceStackSynthesisIndex(
    resonanceConvergenceStack.stackIndex,
    pressureStackSynthesis.synthesisIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceStackSynthesis.notes.forEach(n => diagnostics.push(n));
  const stackSynthesisPressure = computeStackSynthesisPressureIndex(
    pressureStackSynthesis.synthesisIndex,
    fusionStackResonance.resonanceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  stackSynthesisPressure.notes.forEach(n => diagnostics.push(n));
  const fusionResonanceStack = computeFusionResonanceStackIndex(
    fusionStackResonance.resonanceIndex,
    resonanceConvergenceStack.stackIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionResonanceStack.notes.forEach(n => diagnostics.push(n));
  const synthesisPressureConvergence = computeSynthesisPressureConvergenceIndex(
    convergenceStackSynthesis.synthesisIndex,
    stackSynthesisPressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisPressureConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureFusionStack = computePressureFusionStackIndex(
    stackSynthesisPressure.pressureIndex,
    fusionResonanceStack.stackIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureFusionStack.notes.forEach(n => diagnostics.push(n));
  const resonanceSynthesisFusion = computeResonanceSynthesisFusionIndex(
    fusionResonanceStack.stackIndex,
    convergenceStackSynthesis.synthesisIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  resonanceSynthesisFusion.notes.forEach(n => diagnostics.push(n));
  const convergencePressureFusion = computeConvergencePressureFusionIndex(
    synthesisPressureConvergence.convergenceIndex,
    pressureFusionStack.stackIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergencePressureFusion.notes.forEach(n => diagnostics.push(n));
  const pressureResonanceSynthesis = computePressureResonanceSynthesisIndex(
    pressureFusionStack.stackIndex,
    resonanceSynthesisFusion.fusionIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  pressureResonanceSynthesis.notes.forEach(n => diagnostics.push(n));
  const fusionConvergencePressure = computeFusionConvergencePressureIndex(
    resonanceSynthesisFusion.fusionIndex,
    synthesisPressureConvergence.convergenceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  fusionConvergencePressure.notes.forEach(n => diagnostics.push(n));
  const fusionSynthesisResonance = computeFusionSynthesisResonanceIndex(
    convergencePressureFusion.fusionIndex,
    pressureResonanceSynthesis.synthesisIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  fusionSynthesisResonance.notes.forEach(n => diagnostics.push(n));
  const resonancePressureConvergence = computeResonancePressureConvergenceIndex(
    pressureResonanceSynthesis.synthesisIndex,
    fusionConvergencePressure.pressureIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  resonancePressureConvergence.notes.forEach(n => diagnostics.push(n));
  const pressureFusionConvergence = computePressureFusionConvergenceIndex(
    fusionConvergencePressure.pressureIndex,
    convergencePressureFusion.fusionIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  pressureFusionConvergence.notes.forEach(n => diagnostics.push(n));
  const resonanceConvergenceSynthesis = computeResonanceConvergenceSynthesisIndex(
    fusionSynthesisResonance.resonanceIndex,
    resonancePressureConvergence.convergenceIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  resonanceConvergenceSynthesis.notes.forEach(n => diagnostics.push(n));
  const synthesisPressureFusion = computeSynthesisPressureFusionIndex(
    resonancePressureConvergence.convergenceIndex,
    pressureFusionConvergence.convergenceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  synthesisPressureFusion.notes.forEach(n => diagnostics.push(n));
  const convergenceSynthesisResonance = computeConvergenceSynthesisResonanceIndex(
    pressureFusionConvergence.convergenceIndex,
    fusionSynthesisResonance.resonanceIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  convergenceSynthesisResonance.notes.forEach(n => diagnostics.push(n));
  const synthesisConvergencePressure = computeSynthesisConvergencePressureIndex(
    resonanceConvergenceSynthesis.synthesisIndex,
    synthesisPressureFusion.fusionIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisConvergencePressure.notes.forEach(n => diagnostics.push(n));
  const convergencePressureSynthesis = computeConvergencePressureSynthesisIndex(
    synthesisPressureFusion.fusionIndex,
    convergenceSynthesisResonance.resonanceIndex,
    state.meta.auditPressureIndex ?? 0,
  );
  convergencePressureSynthesis.notes.forEach(n => diagnostics.push(n));
  const pressureSynthesisConvergence = computePressureSynthesisConvergenceIndex(
    convergenceSynthesisResonance.resonanceIndex,
    resonanceConvergenceSynthesis.synthesisIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  pressureSynthesisConvergence.notes.forEach(n => diagnostics.push(n));
  const convergenceSynthesisPressureR52 = computeConvergenceSynthesisPressureIndex(
    convergencePressureSynthesis.synthesisIndex,
    synthesisConvergencePressure.pressureIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  convergenceSynthesisPressureR52.notes.forEach(n => diagnostics.push(n));
  const synthesisPressureResonanceR52 = computeSynthesisPressureResonanceIndex(
    synthesisConvergencePressure.pressureIndex,
    pressureSynthesisConvergence.convergenceIndex,
    state.meta.coordinationEscalationTier ?? 0,
  );
  synthesisPressureResonanceR52.notes.forEach(n => diagnostics.push(n));
  const pressureResonanceConvergenceR52 = computePressureResonanceConvergenceIndex(
    pressureSynthesisConvergence.convergenceIndex,
    convergenceSynthesisPressureR52.pressureIndex,
    state.meta.coordinationCompositeScore ?? 100,
  );
  pressureResonanceConvergenceR52.notes.forEach(n => diagnostics.push(n));
  state = {
    ...state,
    diagnostics,
    meta: {
      ...state.meta,
      frictionAlignmentGapIndex: frictionAlignmentGap.gapIndex,
      gapChurnResonanceIndex: gapChurnResonance.resonanceIndex,
      stackFrictionConvergenceIndex: stackFrictionConvergence.convergenceIndex,
      fusionResonanceCouplingIndex: fusionResonanceCoupling.couplingIndex,
      convergenceFusionStackIndex: convergenceFusionStack.stackIndex,
      resonanceAuditCascadeIndex: resonanceAuditCascade.cascadeIndex,
      couplingStackCascadeIndex: couplingStackCascade.cascadeIndex,
      stackCascadeAmplificationIndex: stackCascadeAmplification.amplificationIndex,
      cascadeCouplingSynthesisIndex: cascadeCouplingSynthesis.synthesisIndex,
      cascadeSynthesisFusionIndex: cascadeSynthesisFusion.fusionIndex,
      amplificationStackResonanceIndex: amplificationStackResonance.resonanceIndex,
      synthesisEscalationPressureIndex: synthesisEscalationPressure.pressureIndex,
      fusionResonanceConvergenceIndex: fusionResonanceConvergence.convergenceIndex,
      pressureFusionCascadeIndex: pressureFusionCascade.cascadeIndex,
      resonancePressureSynthesisIndex: resonancePressureSynthesis.synthesisIndex,
      convergenceCascadeSynthesisIndex: convergenceCascadeSynthesis.synthesisIndex,
      synthesisConvergenceStackIndex: synthesisConvergenceStack.stackIndex,
      cascadeResonanceAmplificationIndex: cascadeResonanceAmplification.amplificationIndex,
      synthesisStackAmplificationIndex: synthesisStackAmplification.amplificationIndex,
      amplificationConvergenceCascadeIndex: amplificationConvergenceCascade.cascadeIndex,
      stackSynthesisResonanceIndex: stackSynthesisResonance.resonanceIndex,
      stackAmplificationCascadeFusionIndex: stackAmplificationCascadeFusion.fusionIndex,
      resonanceAmplificationStackIndex: resonanceAmplificationStack.stackIndex,
      cascadeConvergenceResonanceIndex: cascadeConvergenceResonance.resonanceIndex,
      fusionStackConvergenceIndex: fusionStackConvergence.convergenceIndex,
      resonanceCascadeSynthesisIndex: resonanceCascadeSynthesis.synthesisIndex,
      convergenceAmplificationPressureIndex: convergenceAmplificationPressure.pressureIndex,
      convergenceSynthesisFusionIndex: convergenceSynthesisFusion.fusionIndex,
      pressureCascadeStackIndex: pressureCascadeStack.stackIndex,
      synthesisPressureResonanceIndex: synthesisPressureResonance.resonanceIndex,
      fusionCascadeStackIndex: fusionCascadeStack.stackIndex,
      resonancePressureCascadeIndex: resonancePressureCascade.cascadeIndex,
      synthesisFusionConvergenceIndex: synthesisFusionConvergence.convergenceIndex,
      stackCascadeResonanceIndex: stackCascadeResonance.resonanceIndex,
      cascadeConvergencePressureIndex: cascadeConvergencePressure.pressureIndex,
      convergenceFusionSynthesisIndex: convergenceFusionSynthesis.synthesisIndex,
      resonanceConvergenceFusionIndex: resonanceConvergenceFusion.fusionIndex,
      pressureSynthesisCascadeIndex: pressureSynthesisCascade.cascadeIndex,
      synthesisResonanceStackIndex: synthesisResonanceStack.stackIndex,
      convergenceFusionPressureIndex: convergenceFusionPressure.pressureIndex,
      synthesisCascadeStackIndex: synthesisCascadeStack.stackIndex,
      resonanceStackFusionIndex: resonanceStackFusion.fusionIndex,
      pressureStackResonanceIndex: pressureStackResonance.resonanceIndex,
      stackFusionCascadeIndex: stackFusionCascade.cascadeIndex,
      fusionCascadeConvergenceIndex: fusionCascadeConvergence.convergenceIndex,
      resonanceFusionStackIndex: resonanceFusionStack.stackIndex,
      fusionCascadePressureIndex: fusionCascadePressure.pressureIndex,
      stackConvergenceResonanceIndex: stackConvergenceResonance.resonanceIndex,
      fusionStackPressureIndex: fusionStackPressure.pressureIndex,
      pressureResonanceCascadeIndex: pressureResonanceCascade.cascadeIndex,
      stackSynthesisConvergenceIndex: stackSynthesisConvergence.convergenceIndex,
      pressureCascadeFusionIndex: pressureCascadeFusion.fusionIndex,
      cascadeSynthesisResonanceIndex: cascadeSynthesisResonance.resonanceIndex,
      convergencePressureStackIndex: convergencePressureStack.stackIndex,
      fusionCascadeResonanceIndex: fusionCascadeResonance.resonanceIndex,
      resonancePressureStackIndex: resonancePressureStack.stackIndex,
      stackSynthesisFusionIndex: stackSynthesisFusion.fusionIndex,
      cascadeResonanceStackIndex: cascadeResonanceStack.stackIndex,
      resonanceFusionPressureIndex: resonanceFusionPressure.pressureIndex,
      fusionConvergenceSynthesisIndex: fusionConvergenceSynthesis.synthesisIndex,
      stackResonancePressureIndex: stackResonancePressure.pressureIndex,
      pressureFusionSynthesisIndex: pressureFusionSynthesis.synthesisIndex,
      synthesisStackConvergenceIndex: synthesisStackConvergence.convergenceIndex,
      stackFusionResonanceIndex: stackFusionResonance.resonanceIndex,
      fusionSynthesisPressureIndex: fusionSynthesisPressure.pressureIndex,
      synthesisCascadeConvergenceIndex: synthesisCascadeConvergence.convergenceIndex,
      fusionResonanceSynthesisIndex: fusionResonanceSynthesis.synthesisIndex,
      pressureCascadeConvergenceIndex: pressureCascadeConvergence.convergenceIndex,
      cascadeStackFusionIndex: cascadeStackFusion.fusionIndex,
      synthesisResonanceConvergenceIndex: synthesisResonanceConvergence.convergenceIndex,
      pressureStackFusionIndex: pressureStackFusion.fusionIndex,
      fusionStackSynthesisIndex: fusionStackSynthesis.synthesisIndex,
      resonanceConvergenceStackIndex: resonanceConvergenceStack.stackIndex,
      pressureStackSynthesisIndex: pressureStackSynthesis.synthesisIndex,
      fusionStackResonanceIndex: fusionStackResonance.resonanceIndex,
      convergenceStackSynthesisIndex: convergenceStackSynthesis.synthesisIndex,
      stackSynthesisPressureIndex: stackSynthesisPressure.pressureIndex,
      fusionResonanceStackIndex: fusionResonanceStack.stackIndex,
      synthesisPressureConvergenceIndex: synthesisPressureConvergence.convergenceIndex,
      pressureFusionStackIndex: pressureFusionStack.stackIndex,
      resonanceSynthesisFusionIndex: resonanceSynthesisFusion.fusionIndex,
      convergencePressureFusionIndex: convergencePressureFusion.fusionIndex,
      pressureResonanceSynthesisIndex: pressureResonanceSynthesis.synthesisIndex,
      fusionConvergencePressureIndex: fusionConvergencePressure.pressureIndex,
      fusionSynthesisResonanceIndex: fusionSynthesisResonance.resonanceIndex,
      resonancePressureConvergenceIndex: resonancePressureConvergence.convergenceIndex,
      pressureFusionConvergenceIndex: pressureFusionConvergence.convergenceIndex,
      resonanceConvergenceSynthesisIndex: resonanceConvergenceSynthesis.synthesisIndex,
      synthesisPressureFusionIndex: synthesisPressureFusion.fusionIndex,
      convergenceSynthesisResonanceIndex: convergenceSynthesisResonance.resonanceIndex,
      synthesisConvergencePressureIndex: synthesisConvergencePressure.pressureIndex,
      convergencePressureSynthesisIndex: convergencePressureSynthesis.synthesisIndex,
      pressureSynthesisConvergenceIndex: pressureSynthesisConvergence.convergenceIndex,
      convergenceSynthesisPressureIndex: convergenceSynthesisPressureR52.pressureIndex,
      synthesisPressureResonanceIndex: synthesisPressureResonanceR52.resonanceIndex,
      pressureResonanceConvergenceIndex: pressureResonanceConvergenceR52.convergenceIndex,
    },
  };

  return {
    state,
    blockedDuplicates: sharedIssues,
    coordinationIssues,
    auditFindings: state.auditFindings,
    persistence,
  };
}

export function syncMultiAgentCoordinationForDirectives(
  inputs: TeamMultiAgentInputs,
  stored: TeamMultiAgentLayerState | null,
): TeamMultiAgentLayerState {
  return evaluateTeamMultiAgentLayer(inputs, stored).state;
}


// --- source: dual-team-coordination.ts ---
  combineDualTeamCoordinationComposite,
} from './coordination-composite-score.ts';
  auditCrossTeamMutexIsolation,
  assertTasksTeamScoped,
  teamActorScope,
} from './team-boundary-guard.ts';
  TeamMultiAgentEvaluation,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
} from './types.ts';

export interface DualTeamMultiAgentResult {
  friendly: TeamMultiAgentEvaluation;
  enemy: TeamMultiAgentEvaluation | null;
  isolationIssues: string[];
  byTeam: Record<string, TeamMultiAgentLayerState>;
  handoffSlaCombinedCompliance: number;
  mutexStabilityCombined: number;
  coordinationCompositeCombined: number;
  roleChurnCombined: number;
  leaseHealthCombined: number;
  directiveCollisionCombined: number;
  handoffIntegrityCombined: number;
  escalationTierCombined: number;
  recoveryUrgencyCombined: number;
  priorityInversionCombined: number;
  handoffOrphanCombined: number;
  workstreamDeadlockCombined: number;
  leaseContentionCombined: number;
  coordinationSaturationCombined: number;
  mutexLeaseDivergenceCombined: number;
  handoffCascadeRiskCombined: number;
  suppressionBacklogCombined: number;
  reconcileDriftCombined: number;
  arbitrationPressureCombined: number;
  persistenceChurnCombined: number;
  duplicateGuardPressureCombined: number;
  roleTaskCoverageGapCombined: number;
  compositeHealthGradientCombined: number;
  handoffReadinessSpreadCombined: number;
  workstreamParallelismCombined: number;
  escalationRecoveryAlignmentCombined: number;
  auditPressureCombined: number;
  roleLockFrictionCombined: number;
  directiveConstraintDensityCombined: number;
  crossTeamRejectionCombined: number;
  handoffSlaVelocityCombined: number;
  recoveryActionBreadthCombined: number;
  directiveQuotaExhaustionCombined: number;
  capacityImbalanceCombined: number;
  workstreamBarrierStalenessCombined: number;
  workstreamDeadlockPressureCombined: number;
  suppressionQuotaCouplingCombined: number;
  handoffLeaseOverlapCombined: number;
  saturationDeadlockCouplingCombined: number;
  cascadeLeaseConvergenceCombined: number;
  gradientAuditTensionCombined: number;
  escalationSaturationStackCombined: number;
  recoveryCascadeMismatchCombined: number;
  persistenceGradientFrictionCombined: number;
  stackMismatchCouplingCombined: number;
  auditStackAmplificationCombined: number;
  frictionAlignmentGapCombined: number;
  couplingAmplificationFusionCombined: number;
  gapChurnResonanceCombined: number;
  stackFrictionConvergenceCombined: number;
  fusionResonanceCouplingCombined: number;
  convergenceFusionStackCombined: number;
  resonanceAuditCascadeCombined: number;
  couplingStackCascadeCombined: number;
  stackCascadeAmplificationCombined: number;
  cascadeCouplingSynthesisCombined: number;
  cascadeSynthesisFusionCombined: number;
  amplificationStackResonanceCombined: number;
  synthesisEscalationPressureCombined: number;
  fusionResonanceConvergenceCombined: number;
  pressureFusionCascadeCombined: number;
  resonancePressureSynthesisCombined: number;
  convergenceCascadeSynthesisCombined: number;
  synthesisConvergenceStackCombined: number;
  cascadeResonanceAmplificationCombined: number;
  synthesisStackAmplificationCombined: number;
  amplificationConvergenceCascadeCombined: number;
  stackSynthesisResonanceCombined: number;
  stackAmplificationCascadeFusionCombined: number;
  resonanceAmplificationStackCombined: number;
  cascadeConvergenceResonanceCombined: number;
  fusionStackConvergenceCombined: number;
  resonanceCascadeSynthesisCombined: number;
  convergenceAmplificationPressureCombined: number;
  convergenceSynthesisFusionCombined: number;
  pressureCascadeStackCombined: number;
  synthesisPressureResonanceCombined: number;
  fusionCascadeStackCombined: number;
  resonancePressureCascadeCombined: number;
  synthesisFusionConvergenceCombined: number;
  stackCascadeResonanceCombined: number;
  cascadeConvergencePressureCombined: number;
  convergenceFusionSynthesisCombined: number;
  resonanceConvergenceFusionCombined: number;
  pressureSynthesisCascadeCombined: number;
  synthesisResonanceStackCombined: number;
  convergenceFusionPressureCombined: number;
  synthesisCascadeStackCombined: number;
  resonanceStackFusionCombined: number;
  pressureStackResonanceCombined: number;
  stackFusionCascadeCombined: number;
  fusionCascadeConvergenceCombined: number;
  resonanceFusionStackCombined: number;
  fusionCascadePressureCombined: number;
  stackConvergenceResonanceCombined: number;
  fusionStackPressureCombined: number;
  pressureResonanceCascadeCombined: number;
  stackSynthesisConvergenceCombined: number;
  pressureCascadeFusionCombined: number;
  cascadeSynthesisResonanceCombined: number;
  convergencePressureStackCombined: number;
  fusionCascadeResonanceCombined: number;
  resonancePressureStackCombined: number;
  stackSynthesisFusionCombined: number;
  cascadeResonanceStackCombined: number;
  resonanceFusionPressureCombined: number;
  fusionConvergenceSynthesisCombined: number;
  stackResonancePressureCombined: number;
  pressureFusionSynthesisCombined: number;
  synthesisStackConvergenceCombined: number;
  stackFusionResonanceCombined: number;
  fusionSynthesisPressureCombined: number;
  synthesisCascadeConvergenceCombined: number;
  fusionResonanceSynthesisCombined: number;
  pressureCascadeConvergenceCombined: number;
  cascadeStackFusionCombined: number;
  synthesisResonanceConvergenceCombined: number;
  pressureStackFusionCombined: number;
  fusionStackSynthesisCombined: number;
  resonanceConvergenceStackCombined: number;
  pressureStackSynthesisCombined: number;
  fusionStackResonanceCombined: number;
  convergenceStackSynthesisCombined: number;
  stackSynthesisPressureCombined: number;
  fusionResonanceStackCombined: number;
  synthesisPressureConvergenceCombined: number;
  pressureFusionStackCombined: number;
  resonanceSynthesisFusionCombined: number;
  convergencePressureFusionCombined: number;
  pressureResonanceSynthesisCombined: number;
  fusionConvergencePressureCombined: number;
  fusionSynthesisResonanceCombined: number;
  resonancePressureConvergenceCombined: number;
  pressureFusionConvergenceCombined: number;
  resonanceConvergenceSynthesisCombined: number;
  synthesisPressureFusionCombined: number;
  convergenceSynthesisResonanceCombined: number;
  synthesisConvergencePressureCombined: number;
  convergencePressureSynthesisCombined: number;
  pressureSynthesisConvergenceCombined: number;
  convergenceSynthesisPressureCombined: number;
  synthesisPressureResonanceCombined: number;
  pressureResonanceConvergenceCombined: number;
}

/**
 * Evaluate friendly + optional enemy team layers with cross-team isolation checks.
 * Planning-only: each team keeps its own mutex namespace (no shared state mutation).
 */
export function evaluateDualTeamMultiAgentLayers(
  friendlyInputs: TeamMultiAgentInputs,
  enemyInputs: TeamMultiAgentInputs | null,
  storedByTeam: Record<string, TeamMultiAgentLayerState | null> = {},
): DualTeamMultiAgentResult {
  const friendlyScope = teamActorScope(friendlyInputs);
  const boundaryIssues = assertTasksTeamScoped(friendlyInputs, friendlyScope);
  const friendlyProposals = friendlyInputs.directiveProposals || [];
  const friendly = evaluateTeamMultiAgentLayer(
    {
      ...friendlyInputs,
      directiveProposals: friendlyProposals,
    },
    storedByTeam[friendlyInputs.teamId] ?? null,
  );
  friendly.coordinationIssues.push(...boundaryIssues);

  if (!enemyInputs) {
    const friendlySla = evaluateHandoffSla(
      friendlyInputs.turn,
      friendly.state.coordination.handoffs,
    );
    return {
      friendly,
      enemy: null,
      isolationIssues: boundaryIssues,
      byTeam: { [friendlyInputs.teamId]: friendly.state },
      handoffSlaCombinedCompliance: friendlySla.complianceScore,
      mutexStabilityCombined: friendly.state.meta.mutexStabilityIndex ?? 100,
      coordinationCompositeCombined: friendly.state.meta.coordinationCompositeScore ?? 100,
      roleChurnCombined: friendly.state.meta.roleChurnIndex ?? 0,
      leaseHealthCombined: friendly.state.meta.leaseHealthScore ?? 100,
      directiveCollisionCombined: friendly.state.meta.directiveCollisionIndex ?? 0,
      handoffIntegrityCombined: friendly.state.meta.handoffIntegrityScore ?? 100,
      escalationTierCombined: friendly.state.meta.coordinationEscalationTier ?? 0,
      recoveryUrgencyCombined: friendly.state.meta.coordinationRecoveryUrgency ?? 0,
      priorityInversionCombined: friendly.state.meta.directivePriorityInversionIndex ?? 0,
      handoffOrphanCombined: friendly.state.meta.handoffOrphanCount ?? 0,
      workstreamDeadlockCombined: friendly.state.meta.workstreamDeadlockCount ?? 0,
      leaseContentionCombined: friendly.state.meta.leaseContentionIndex ?? 0,
      coordinationSaturationCombined: friendly.state.meta.coordinationSaturationIndex ?? 0,
      mutexLeaseDivergenceCombined: friendly.state.meta.mutexLeaseDivergenceIndex ?? 0,
      handoffCascadeRiskCombined: friendly.state.meta.handoffCascadeRiskIndex ?? 0,
      suppressionBacklogCombined: friendly.state.meta.suppressionBacklogIndex ?? 0,
      reconcileDriftCombined: friendly.state.meta.reconcileDriftIndex ?? 0,
      arbitrationPressureCombined: friendly.state.meta.arbitrationPressureIndex ?? 0,
      persistenceChurnCombined: friendly.state.meta.persistenceChurnIndex ?? 0,
      duplicateGuardPressureCombined: friendly.state.meta.duplicateGuardPressureIndex ?? 0,
      roleTaskCoverageGapCombined: friendly.state.meta.roleTaskCoverageGapIndex ?? 0,
      compositeHealthGradientCombined: friendly.state.meta.compositeHealthGradientIndex ?? 0,
      handoffReadinessSpreadCombined: friendly.state.meta.handoffReadinessSpreadIndex ?? 0,
      workstreamParallelismCombined: friendly.state.meta.workstreamParallelismIndex ?? 0,
      escalationRecoveryAlignmentCombined: friendly.state.meta.escalationRecoveryAlignmentIndex ?? 0,
      auditPressureCombined: friendly.state.meta.auditPressureIndex ?? 0,
      roleLockFrictionCombined: friendly.state.meta.roleLockFrictionIndex ?? 0,
      directiveConstraintDensityCombined: friendly.state.meta.directiveConstraintDensityIndex ?? 0,
      crossTeamRejectionCombined: friendly.state.meta.crossTeamRejectionIndex ?? 0,
      handoffSlaVelocityCombined: friendly.state.meta.handoffSlaVelocityIndex ?? 0,
      recoveryActionBreadthCombined: friendly.state.meta.recoveryActionBreadthIndex ?? 0,
      directiveQuotaExhaustionCombined: friendly.state.meta.directiveQuotaExhaustionIndex ?? 0,
      capacityImbalanceCombined: friendly.state.meta.capacityImbalanceIndex ?? 0,
      workstreamBarrierStalenessCombined: friendly.state.meta.workstreamBarrierStalenessIndex ?? 0,
      workstreamDeadlockPressureCombined: friendly.state.meta.workstreamDeadlockPressureIndex ?? 0,
      suppressionQuotaCouplingCombined: friendly.state.meta.suppressionQuotaCouplingIndex ?? 0,
      handoffLeaseOverlapCombined: friendly.state.meta.handoffLeaseOverlapIndex ?? 0,
      saturationDeadlockCouplingCombined: friendly.state.meta.saturationDeadlockCouplingIndex ?? 0,
      cascadeLeaseConvergenceCombined: friendly.state.meta.cascadeLeaseConvergenceIndex ?? 0,
      gradientAuditTensionCombined: friendly.state.meta.gradientAuditTensionIndex ?? 0,
      escalationSaturationStackCombined: friendly.state.meta.escalationSaturationStackIndex ?? 0,
      recoveryCascadeMismatchCombined: friendly.state.meta.recoveryCascadeMismatchIndex ?? 0,
      persistenceGradientFrictionCombined: friendly.state.meta.persistenceGradientFrictionIndex ?? 0,
      stackMismatchCouplingCombined: friendly.state.meta.stackMismatchCouplingIndex ?? 0,
      auditStackAmplificationCombined: friendly.state.meta.auditStackAmplificationIndex ?? 0,
      frictionAlignmentGapCombined: friendly.state.meta.frictionAlignmentGapIndex ?? 0,
      couplingAmplificationFusionCombined: friendly.state.meta.couplingAmplificationFusionIndex ?? 0,
      gapChurnResonanceCombined: friendly.state.meta.gapChurnResonanceIndex ?? 0,
      stackFrictionConvergenceCombined: friendly.state.meta.stackFrictionConvergenceIndex ?? 0,
      fusionResonanceCouplingCombined: friendly.state.meta.fusionResonanceCouplingIndex ?? 0,
      convergenceFusionStackCombined: friendly.state.meta.convergenceFusionStackIndex ?? 0,
      resonanceAuditCascadeCombined: friendly.state.meta.resonanceAuditCascadeIndex ?? 0,
      couplingStackCascadeCombined: friendly.state.meta.couplingStackCascadeIndex ?? 0,
      stackCascadeAmplificationCombined: friendly.state.meta.stackCascadeAmplificationIndex ?? 0,
      cascadeCouplingSynthesisCombined: friendly.state.meta.cascadeCouplingSynthesisIndex ?? 0,
      cascadeSynthesisFusionCombined: friendly.state.meta.cascadeSynthesisFusionIndex ?? 0,
      amplificationStackResonanceCombined: friendly.state.meta.amplificationStackResonanceIndex ?? 0,
      synthesisEscalationPressureCombined: friendly.state.meta.synthesisEscalationPressureIndex ?? 0,
      fusionResonanceConvergenceCombined: friendly.state.meta.fusionResonanceConvergenceIndex ?? 0,
      pressureFusionCascadeCombined: friendly.state.meta.pressureFusionCascadeIndex ?? 0,
      resonancePressureSynthesisCombined: friendly.state.meta.resonancePressureSynthesisIndex ?? 0,
      convergenceCascadeSynthesisCombined: friendly.state.meta.convergenceCascadeSynthesisIndex ?? 0,
      synthesisConvergenceStackCombined: friendly.state.meta.synthesisConvergenceStackIndex ?? 0,
      cascadeResonanceAmplificationCombined: friendly.state.meta.cascadeResonanceAmplificationIndex ?? 0,
      synthesisStackAmplificationCombined: friendly.state.meta.synthesisStackAmplificationIndex ?? 0,
      amplificationConvergenceCascadeCombined: friendly.state.meta.amplificationConvergenceCascadeIndex ?? 0,
      stackSynthesisResonanceCombined: friendly.state.meta.stackSynthesisResonanceIndex ?? 0,
      stackAmplificationCascadeFusionCombined: friendly.state.meta.stackAmplificationCascadeFusionIndex ?? 0,
      resonanceAmplificationStackCombined: friendly.state.meta.resonanceAmplificationStackIndex ?? 0,
      cascadeConvergenceResonanceCombined: friendly.state.meta.cascadeConvergenceResonanceIndex ?? 0,
      fusionStackConvergenceCombined: friendly.state.meta.fusionStackConvergenceIndex ?? 0,
      resonanceCascadeSynthesisCombined: friendly.state.meta.resonanceCascadeSynthesisIndex ?? 0,
      convergenceAmplificationPressureCombined: friendly.state.meta.convergenceAmplificationPressureIndex ?? 0,
      convergenceSynthesisFusionCombined: friendly.state.meta.convergenceSynthesisFusionIndex ?? 0,
      pressureCascadeStackCombined: friendly.state.meta.pressureCascadeStackIndex ?? 0,
      synthesisPressureResonanceCombined: friendly.state.meta.synthesisPressureResonanceIndex ?? 0,
      fusionCascadeStackCombined: friendly.state.meta.fusionCascadeStackIndex ?? 0,
      resonancePressureCascadeCombined: friendly.state.meta.resonancePressureCascadeIndex ?? 0,
      synthesisFusionConvergenceCombined: friendly.state.meta.synthesisFusionConvergenceIndex ?? 0,
      stackCascadeResonanceCombined: friendly.state.meta.stackCascadeResonanceIndex ?? 0,
      cascadeConvergencePressureCombined: friendly.state.meta.cascadeConvergencePressureIndex ?? 0,
      convergenceFusionSynthesisCombined: friendly.state.meta.convergenceFusionSynthesisIndex ?? 0,
      resonanceConvergenceFusionCombined: friendly.state.meta.resonanceConvergenceFusionIndex ?? 0,
      pressureSynthesisCascadeCombined: friendly.state.meta.pressureSynthesisCascadeIndex ?? 0,
      synthesisResonanceStackCombined: friendly.state.meta.synthesisResonanceStackIndex ?? 0,
      convergenceFusionPressureCombined: friendly.state.meta.convergenceFusionPressureIndex ?? 0,
      synthesisCascadeStackCombined: friendly.state.meta.synthesisCascadeStackIndex ?? 0,
      resonanceStackFusionCombined: friendly.state.meta.resonanceStackFusionIndex ?? 0,
      pressureStackResonanceCombined: friendly.state.meta.pressureStackResonanceIndex ?? 0,
      stackFusionCascadeCombined: friendly.state.meta.stackFusionCascadeIndex ?? 0,
      fusionCascadeConvergenceCombined: friendly.state.meta.fusionCascadeConvergenceIndex ?? 0,
      resonanceFusionStackCombined: friendly.state.meta.resonanceFusionStackIndex ?? 0,
      fusionCascadePressureCombined: friendly.state.meta.fusionCascadePressureIndex ?? 0,
      stackConvergenceResonanceCombined: friendly.state.meta.stackConvergenceResonanceIndex ?? 0,
      fusionStackPressureCombined: friendly.state.meta.fusionStackPressureIndex ?? 0,
      pressureResonanceCascadeCombined: friendly.state.meta.pressureResonanceCascadeIndex ?? 0,
      stackSynthesisConvergenceCombined: friendly.state.meta.stackSynthesisConvergenceIndex ?? 0,
      pressureCascadeFusionCombined: friendly.state.meta.pressureCascadeFusionIndex ?? 0,
      cascadeSynthesisResonanceCombined: friendly.state.meta.cascadeSynthesisResonanceIndex ?? 0,
      convergencePressureStackCombined: friendly.state.meta.convergencePressureStackIndex ?? 0,
      fusionCascadeResonanceCombined: friendly.state.meta.fusionCascadeResonanceIndex ?? 0,
      resonancePressureStackCombined: friendly.state.meta.resonancePressureStackIndex ?? 0,
      stackSynthesisFusionCombined: friendly.state.meta.stackSynthesisFusionIndex ?? 0,
      cascadeResonanceStackCombined: friendly.state.meta.cascadeResonanceStackIndex ?? 0,
      resonanceFusionPressureCombined: friendly.state.meta.resonanceFusionPressureIndex ?? 0,
      fusionConvergenceSynthesisCombined: friendly.state.meta.fusionConvergenceSynthesisIndex ?? 0,
      stackResonancePressureCombined: friendly.state.meta.stackResonancePressureIndex ?? 0,
      pressureFusionSynthesisCombined: friendly.state.meta.pressureFusionSynthesisIndex ?? 0,
      synthesisStackConvergenceCombined: friendly.state.meta.synthesisStackConvergenceIndex ?? 0,
      stackFusionResonanceCombined: friendly.state.meta.stackFusionResonanceIndex ?? 0,
      fusionSynthesisPressureCombined: friendly.state.meta.fusionSynthesisPressureIndex ?? 0,
      synthesisCascadeConvergenceCombined: friendly.state.meta.synthesisCascadeConvergenceIndex ?? 0,
      fusionResonanceSynthesisCombined: friendly.state.meta.fusionResonanceSynthesisIndex ?? 0,
      pressureCascadeConvergenceCombined: friendly.state.meta.pressureCascadeConvergenceIndex ?? 0,
      cascadeStackFusionCombined: friendly.state.meta.cascadeStackFusionIndex ?? 0,
      synthesisResonanceConvergenceCombined: friendly.state.meta.synthesisResonanceConvergenceIndex ?? 0,
      pressureStackFusionCombined: friendly.state.meta.pressureStackFusionIndex ?? 0,
      fusionStackSynthesisCombined: friendly.state.meta.fusionStackSynthesisIndex ?? 0,
      resonanceConvergenceStackCombined: friendly.state.meta.resonanceConvergenceStackIndex ?? 0,
      pressureStackSynthesisCombined: friendly.state.meta.pressureStackSynthesisIndex ?? 0,
      fusionStackResonanceCombined: friendly.state.meta.fusionStackResonanceIndex ?? 0,
      convergenceStackSynthesisCombined: friendly.state.meta.convergenceStackSynthesisIndex ?? 0,
      stackSynthesisPressureCombined: friendly.state.meta.stackSynthesisPressureIndex ?? 0,
      fusionResonanceStackCombined: friendly.state.meta.fusionResonanceStackIndex ?? 0,
      synthesisPressureConvergenceCombined: friendly.state.meta.synthesisPressureConvergenceIndex ?? 0,
      pressureFusionStackCombined: friendly.state.meta.pressureFusionStackIndex ?? 0,
      resonanceSynthesisFusionCombined: friendly.state.meta.resonanceSynthesisFusionIndex ?? 0,
      convergencePressureFusionCombined: friendly.state.meta.convergencePressureFusionIndex ?? 0,
      pressureResonanceSynthesisCombined: friendly.state.meta.pressureResonanceSynthesisIndex ?? 0,
      fusionConvergencePressureCombined: friendly.state.meta.fusionConvergencePressureIndex ?? 0,
      fusionSynthesisResonanceCombined: friendly.state.meta.fusionSynthesisResonanceIndex ?? 0,
      resonancePressureConvergenceCombined: friendly.state.meta.resonancePressureConvergenceIndex ?? 0,
      pressureFusionConvergenceCombined: friendly.state.meta.pressureFusionConvergenceIndex ?? 0,
      resonanceConvergenceSynthesisCombined: friendly.state.meta.resonanceConvergenceSynthesisIndex ?? 0,
      synthesisPressureFusionCombined: friendly.state.meta.synthesisPressureFusionIndex ?? 0,
      convergenceSynthesisResonanceCombined: friendly.state.meta.convergenceSynthesisResonanceIndex ?? 0,
      synthesisConvergencePressureCombined: friendly.state.meta.synthesisConvergencePressureIndex ?? 0,
      convergencePressureSynthesisCombined: friendly.state.meta.convergencePressureSynthesisIndex ?? 0,
      pressureSynthesisConvergenceCombined: friendly.state.meta.pressureSynthesisConvergenceIndex ?? 0,
      convergenceSynthesisPressureCombined: friendly.state.meta.convergenceSynthesisPressureIndex ?? 0,
      synthesisPressureResonanceCombined: friendly.state.meta.synthesisPressureResonanceIndex ?? 0,
      pressureResonanceConvergenceCombined: friendly.state.meta.pressureResonanceConvergenceIndex ?? 0,
    };
  }

  const enemyScope = teamActorScope(enemyInputs);
  const enemyBoundary = assertTasksTeamScoped(enemyInputs, enemyScope);
  const enemy = evaluateTeamMultiAgentLayer(enemyInputs, storedByTeam[enemyInputs.teamId] ?? null);
  enemy.coordinationIssues.push(...enemyBoundary);

  const mutexIssues = auditCrossTeamMutexIsolation(
    friendly.state.coordination.mutexRegions,
    enemy.state.coordination.mutexRegions,
  );

  const crossActorIssues: string[] = [];
  if ([...friendlyScope].some(id => enemyScope.has(id))) {
    crossActorIssues.push('Friendly and enemy teams share actor ids — invalid isolation');
  }

  const isolationIssues = [...boundaryIssues, ...enemyBoundary, ...mutexIssues, ...crossActorIssues];

  const friendlySla = evaluateHandoffSla(friendlyInputs.turn, friendly.state.coordination.handoffs);
  const enemySla = evaluateHandoffSla(enemyInputs.turn, enemy.state.coordination.handoffs);
  const slaSummary = summarizeDualTeamHandoffSla(
    friendlyInputs.teamId,
    friendlySla,
    enemyInputs.teamId,
    enemySla,
  );

  return {
    friendly,
    enemy,
    isolationIssues,
    byTeam: {
      [friendlyInputs.teamId]: friendly.state,
      [enemyInputs.teamId]: enemy.state,
    },
    handoffSlaCombinedCompliance: slaSummary.combinedCompliance,
    mutexStabilityCombined: combineDualTeamMutexStability(
      {
        stabilityIndex: friendly.state.meta.mutexStabilityIndex ?? 100,
        volatileRegionIds: friendly.state.meta.volatileMutexRegionIds ?? [],
        stableRegionCount: 0,
        trackedTurns: friendly.state.meta.mutexHistory.length,
        notes: [],
      },
      {
        stabilityIndex: enemy.state.meta.mutexStabilityIndex ?? 100,
        volatileRegionIds: enemy.state.meta.volatileMutexRegionIds ?? [],
        stableRegionCount: 0,
        trackedTurns: enemy.state.meta.mutexHistory.length,
        notes: [],
      },
    ),
    coordinationCompositeCombined: combineDualTeamCoordinationComposite(
      friendly.state.meta.coordinationCompositeScore ?? 100,
      enemy.state.meta.coordinationCompositeScore ?? 100,
    ),
    roleChurnCombined: combineDualTeamRoleChurn(
      {
        churnIndex: friendly.state.meta.roleChurnIndex ?? 0,
        churnedActorIds: friendly.state.meta.roleChurnActorIds ?? [],
        stableActorCount: 0,
        notes: [],
      },
      {
        churnIndex: enemy.state.meta.roleChurnIndex ?? 0,
        churnedActorIds: enemy.state.meta.roleChurnActorIds ?? [],
        stableActorCount: 0,
        notes: [],
      },
    ),
    leaseHealthCombined: combineDualTeamLeaseHealth(
      {
        leaseHealthScore: friendly.state.meta.leaseHealthScore ?? 100,
        expiringLeaseIds: friendly.state.meta.expiringLeaseIds ?? [],
        expiredLeaseIds: friendly.state.meta.expiredLeaseIds ?? [],
        notes: [],
      },
      {
        leaseHealthScore: enemy.state.meta.leaseHealthScore ?? 100,
        expiringLeaseIds: enemy.state.meta.expiringLeaseIds ?? [],
        expiredLeaseIds: enemy.state.meta.expiredLeaseIds ?? [],
        notes: [],
      },
    ),
    directiveCollisionCombined: combineDualTeamDirectiveCollision(
      {
        collisionIndex: friendly.state.meta.directiveCollisionIndex ?? 0,
        collidingProposalIds: friendly.state.meta.collidingDirectiveIds ?? [],
        notes: [],
      },
      {
        collisionIndex: enemy.state.meta.directiveCollisionIndex ?? 0,
        collidingProposalIds: enemy.state.meta.collidingDirectiveIds ?? [],
        notes: [],
      },
    ),
    handoffIntegrityCombined: combineDualTeamHandoffIntegrity(
      {
        integrityScore: friendly.state.meta.handoffIntegrityScore ?? 100,
        brokenHandoffIds: friendly.state.meta.brokenHandoffIds ?? [],
        duplicatePendingTaskIds: friendly.state.meta.duplicatePendingHandoffTaskIds ?? [],
        notes: [],
      },
      {
        integrityScore: enemy.state.meta.handoffIntegrityScore ?? 100,
        brokenHandoffIds: enemy.state.meta.brokenHandoffIds ?? [],
        duplicatePendingTaskIds: enemy.state.meta.duplicatePendingHandoffTaskIds ?? [],
        notes: [],
      },
    ),
    escalationTierCombined: combineDualTeamEscalationTier(
      friendly.state.meta.coordinationEscalationTier ?? 0,
      enemy.state.meta.coordinationEscalationTier ?? 0,
    ),
    recoveryUrgencyCombined: combineDualTeamRecoveryUrgency(
      friendly.state.meta.coordinationRecoveryUrgency ?? 0,
      enemy.state.meta.coordinationRecoveryUrgency ?? 0,
    ),
    priorityInversionCombined: combineDualTeamPriorityInversion(
      friendly.state.meta.directivePriorityInversionIndex ?? 0,
      enemy.state.meta.directivePriorityInversionIndex ?? 0,
    ),
    handoffOrphanCombined: combineDualTeamHandoffOrphans(
      friendly.state.meta.handoffOrphanCount ?? 0,
      enemy.state.meta.handoffOrphanCount ?? 0,
    ),
    workstreamDeadlockCombined: combineDualTeamWorkstreamDeadlocks(
      friendly.state.meta.workstreamDeadlockCount ?? 0,
      enemy.state.meta.workstreamDeadlockCount ?? 0,
    ),
    leaseContentionCombined: combineDualTeamLeaseContention(
      friendly.state.meta.leaseContentionIndex ?? 0,
      enemy.state.meta.leaseContentionIndex ?? 0,
    ),
    coordinationSaturationCombined: combineDualTeamCoordinationSaturation(
      friendly.state.meta.coordinationSaturationIndex ?? 0,
      enemy.state.meta.coordinationSaturationIndex ?? 0,
    ),
    mutexLeaseDivergenceCombined: combineDualTeamMutexLeaseDivergence(
      friendly.state.meta.mutexLeaseDivergenceIndex ?? 0,
      enemy.state.meta.mutexLeaseDivergenceIndex ?? 0,
    ),
    handoffCascadeRiskCombined: combineDualTeamHandoffCascadeRisk(
      friendly.state.meta.handoffCascadeRiskIndex ?? 0,
      enemy.state.meta.handoffCascadeRiskIndex ?? 0,
    ),
    suppressionBacklogCombined: combineDualTeamSuppressionBacklog(
      friendly.state.meta.suppressionBacklogIndex ?? 0,
      enemy.state.meta.suppressionBacklogIndex ?? 0,
    ),
    reconcileDriftCombined: combineDualTeamReconcileDrift(
      friendly.state.meta.reconcileDriftIndex ?? 0,
      enemy.state.meta.reconcileDriftIndex ?? 0,
    ),
    arbitrationPressureCombined: combineDualTeamArbitrationPressure(
      friendly.state.meta.arbitrationPressureIndex ?? 0,
      enemy.state.meta.arbitrationPressureIndex ?? 0,
    ),
    persistenceChurnCombined: combineDualTeamPersistenceChurn(
      friendly.state.meta.persistenceChurnIndex ?? 0,
      enemy.state.meta.persistenceChurnIndex ?? 0,
    ),
    duplicateGuardPressureCombined: combineDualTeamDuplicateGuardPressure(
      friendly.state.meta.duplicateGuardPressureIndex ?? 0,
      enemy.state.meta.duplicateGuardPressureIndex ?? 0,
    ),
    roleTaskCoverageGapCombined: combineDualTeamRoleTaskCoverageGap(
      friendly.state.meta.roleTaskCoverageGapIndex ?? 0,
      enemy.state.meta.roleTaskCoverageGapIndex ?? 0,
    ),
    compositeHealthGradientCombined: combineDualTeamCompositeHealthGradient(
      friendly.state.meta.compositeHealthGradientIndex ?? 0,
      enemy.state.meta.compositeHealthGradientIndex ?? 0,
    ),
    handoffReadinessSpreadCombined: combineDualTeamHandoffReadinessSpread(
      friendly.state.meta.handoffReadinessSpreadIndex ?? 0,
      enemy.state.meta.handoffReadinessSpreadIndex ?? 0,
    ),
    workstreamParallelismCombined: combineDualTeamWorkstreamParallelism(
      friendly.state.meta.workstreamParallelismIndex ?? 0,
      enemy.state.meta.workstreamParallelismIndex ?? 0,
    ),
    escalationRecoveryAlignmentCombined: combineDualTeamEscalationRecoveryAlignment(
      friendly.state.meta.escalationRecoveryAlignmentIndex ?? 0,
      enemy.state.meta.escalationRecoveryAlignmentIndex ?? 0,
    ),
    auditPressureCombined: combineDualTeamAuditPressure(
      friendly.state.meta.auditPressureIndex ?? 0,
      enemy.state.meta.auditPressureIndex ?? 0,
    ),
    roleLockFrictionCombined: combineDualTeamRoleLockFriction(
      friendly.state.meta.roleLockFrictionIndex ?? 0,
      enemy.state.meta.roleLockFrictionIndex ?? 0,
    ),
    directiveConstraintDensityCombined: combineDualTeamDirectiveConstraintDensity(
      friendly.state.meta.directiveConstraintDensityIndex ?? 0,
      enemy.state.meta.directiveConstraintDensityIndex ?? 0,
    ),
    crossTeamRejectionCombined: combineDualTeamCrossTeamRejection(
      friendly.state.meta.crossTeamRejectionIndex ?? 0,
      enemy.state.meta.crossTeamRejectionIndex ?? 0,
    ),
    handoffSlaVelocityCombined: combineDualTeamHandoffSlaVelocity(
      friendly.state.meta.handoffSlaVelocityIndex ?? 0,
      enemy.state.meta.handoffSlaVelocityIndex ?? 0,
    ),
    recoveryActionBreadthCombined: combineDualTeamRecoveryActionBreadth(
      friendly.state.meta.recoveryActionBreadthIndex ?? 0,
      enemy.state.meta.recoveryActionBreadthIndex ?? 0,
    ),
    directiveQuotaExhaustionCombined: combineDualTeamDirectiveQuotaExhaustion(
      friendly.state.meta.directiveQuotaExhaustionIndex ?? 0,
      enemy.state.meta.directiveQuotaExhaustionIndex ?? 0,
    ),
    capacityImbalanceCombined: combineDualTeamCapacityImbalance(
      friendly.state.meta.capacityImbalanceIndex ?? 0,
      enemy.state.meta.capacityImbalanceIndex ?? 0,
    ),
    workstreamBarrierStalenessCombined: combineDualTeamWorkstreamBarrierStaleness(
      friendly.state.meta.workstreamBarrierStalenessIndex ?? 0,
      enemy.state.meta.workstreamBarrierStalenessIndex ?? 0,
    ),
    workstreamDeadlockPressureCombined: combineDualTeamWorkstreamDeadlockPressure(
      friendly.state.meta.workstreamDeadlockPressureIndex ?? 0,
      enemy.state.meta.workstreamDeadlockPressureIndex ?? 0,
    ),
    suppressionQuotaCouplingCombined: combineDualTeamSuppressionQuotaCoupling(
      friendly.state.meta.suppressionQuotaCouplingIndex ?? 0,
      enemy.state.meta.suppressionQuotaCouplingIndex ?? 0,
    ),
    handoffLeaseOverlapCombined: combineDualTeamHandoffLeaseOverlap(
      friendly.state.meta.handoffLeaseOverlapIndex ?? 0,
      enemy.state.meta.handoffLeaseOverlapIndex ?? 0,
    ),
    saturationDeadlockCouplingCombined: combineDualTeamSaturationDeadlockCoupling(
      friendly.state.meta.saturationDeadlockCouplingIndex ?? 0,
      enemy.state.meta.saturationDeadlockCouplingIndex ?? 0,
    ),
    cascadeLeaseConvergenceCombined: combineDualTeamCascadeLeaseConvergence(
      friendly.state.meta.cascadeLeaseConvergenceIndex ?? 0,
      enemy.state.meta.cascadeLeaseConvergenceIndex ?? 0,
    ),
    gradientAuditTensionCombined: combineDualTeamGradientAuditTension(
      friendly.state.meta.gradientAuditTensionIndex ?? 0,
      enemy.state.meta.gradientAuditTensionIndex ?? 0,
    ),
    escalationSaturationStackCombined: combineDualTeamEscalationSaturationStack(
      friendly.state.meta.escalationSaturationStackIndex ?? 0,
      enemy.state.meta.escalationSaturationStackIndex ?? 0,
    ),
    recoveryCascadeMismatchCombined: combineDualTeamRecoveryCascadeMismatch(
      friendly.state.meta.recoveryCascadeMismatchIndex ?? 0,
      enemy.state.meta.recoveryCascadeMismatchIndex ?? 0,
    ),
    persistenceGradientFrictionCombined: combineDualTeamPersistenceGradientFriction(
      friendly.state.meta.persistenceGradientFrictionIndex ?? 0,
      enemy.state.meta.persistenceGradientFrictionIndex ?? 0,
    ),
    stackMismatchCouplingCombined: combineDualTeamStackMismatchCoupling(
      friendly.state.meta.stackMismatchCouplingIndex ?? 0,
      enemy.state.meta.stackMismatchCouplingIndex ?? 0,
    ),
    auditStackAmplificationCombined: combineDualTeamAuditStackAmplification(
      friendly.state.meta.auditStackAmplificationIndex ?? 0,
      enemy.state.meta.auditStackAmplificationIndex ?? 0,
    ),
    frictionAlignmentGapCombined: combineDualTeamFrictionAlignmentGap(
      friendly.state.meta.frictionAlignmentGapIndex ?? 0,
      enemy.state.meta.frictionAlignmentGapIndex ?? 0,
    ),
    couplingAmplificationFusionCombined: combineDualTeamCouplingAmplificationFusion(
      friendly.state.meta.couplingAmplificationFusionIndex ?? 0,
      enemy.state.meta.couplingAmplificationFusionIndex ?? 0,
    ),
    gapChurnResonanceCombined: combineDualTeamGapChurnResonance(
      friendly.state.meta.gapChurnResonanceIndex ?? 0,
      enemy.state.meta.gapChurnResonanceIndex ?? 0,
    ),
    stackFrictionConvergenceCombined: combineDualTeamStackFrictionConvergence(
      friendly.state.meta.stackFrictionConvergenceIndex ?? 0,
      enemy.state.meta.stackFrictionConvergenceIndex ?? 0,
    ),
    fusionResonanceCouplingCombined: combineDualTeamFusionResonanceCoupling(
      friendly.state.meta.fusionResonanceCouplingIndex ?? 0,
      enemy.state.meta.fusionResonanceCouplingIndex ?? 0,
    ),
    convergenceFusionStackCombined: combineDualTeamConvergenceFusionStack(
      friendly.state.meta.convergenceFusionStackIndex ?? 0,
      enemy.state.meta.convergenceFusionStackIndex ?? 0,
    ),
    resonanceAuditCascadeCombined: combineDualTeamResonanceAuditCascade(
      friendly.state.meta.resonanceAuditCascadeIndex ?? 0,
      enemy.state.meta.resonanceAuditCascadeIndex ?? 0,
    ),
    couplingStackCascadeCombined: combineDualTeamCouplingStackCascade(
      friendly.state.meta.couplingStackCascadeIndex ?? 0,
      enemy.state.meta.couplingStackCascadeIndex ?? 0,
    ),
    stackCascadeAmplificationCombined: combineDualTeamStackCascadeAmplification(
      friendly.state.meta.stackCascadeAmplificationIndex ?? 0,
      enemy.state.meta.stackCascadeAmplificationIndex ?? 0,
    ),
    cascadeCouplingSynthesisCombined: combineDualTeamCascadeCouplingSynthesis(
      friendly.state.meta.cascadeCouplingSynthesisIndex ?? 0,
      enemy.state.meta.cascadeCouplingSynthesisIndex ?? 0,
    ),
    cascadeSynthesisFusionCombined: combineDualTeamCascadeSynthesisFusion(
      friendly.state.meta.cascadeSynthesisFusionIndex ?? 0,
      enemy.state.meta.cascadeSynthesisFusionIndex ?? 0,
    ),
    amplificationStackResonanceCombined: combineDualTeamAmplificationStackResonance(
      friendly.state.meta.amplificationStackResonanceIndex ?? 0,
      enemy.state.meta.amplificationStackResonanceIndex ?? 0,
    ),
    synthesisEscalationPressureCombined: combineDualTeamSynthesisEscalationPressure(
      friendly.state.meta.synthesisEscalationPressureIndex ?? 0,
      enemy.state.meta.synthesisEscalationPressureIndex ?? 0,
    ),
    fusionResonanceConvergenceCombined: combineDualTeamFusionResonanceConvergence(
      friendly.state.meta.fusionResonanceConvergenceIndex ?? 0,
      enemy.state.meta.fusionResonanceConvergenceIndex ?? 0,
    ),
    pressureFusionCascadeCombined: combineDualTeamPressureFusionCascade(
      friendly.state.meta.pressureFusionCascadeIndex ?? 0,
      enemy.state.meta.pressureFusionCascadeIndex ?? 0,
    ),
    resonancePressureSynthesisCombined: combineDualTeamResonancePressureSynthesis(
      friendly.state.meta.resonancePressureSynthesisIndex ?? 0,
      enemy.state.meta.resonancePressureSynthesisIndex ?? 0,
    ),
    convergenceCascadeSynthesisCombined: combineDualTeamConvergenceCascadeSynthesis(
      friendly.state.meta.convergenceCascadeSynthesisIndex ?? 0,
      enemy.state.meta.convergenceCascadeSynthesisIndex ?? 0,
    ),
    synthesisConvergenceStackCombined: combineDualTeamSynthesisConvergenceStack(
      friendly.state.meta.synthesisConvergenceStackIndex ?? 0,
      enemy.state.meta.synthesisConvergenceStackIndex ?? 0,
    ),
    cascadeResonanceAmplificationCombined: combineDualTeamCascadeResonanceAmplification(
      friendly.state.meta.cascadeResonanceAmplificationIndex ?? 0,
      enemy.state.meta.cascadeResonanceAmplificationIndex ?? 0,
    ),
    synthesisStackAmplificationCombined: combineDualTeamSynthesisStackAmplification(
      friendly.state.meta.synthesisStackAmplificationIndex ?? 0,
      enemy.state.meta.synthesisStackAmplificationIndex ?? 0,
    ),
    amplificationConvergenceCascadeCombined: combineDualTeamAmplificationConvergenceCascade(
      friendly.state.meta.amplificationConvergenceCascadeIndex ?? 0,
      enemy.state.meta.amplificationConvergenceCascadeIndex ?? 0,
    ),
    stackSynthesisResonanceCombined: combineDualTeamStackSynthesisResonance(
      friendly.state.meta.stackSynthesisResonanceIndex ?? 0,
      enemy.state.meta.stackSynthesisResonanceIndex ?? 0,
    ),
    stackAmplificationCascadeFusionCombined: combineDualTeamStackAmplificationCascadeFusion(
      friendly.state.meta.stackAmplificationCascadeFusionIndex ?? 0,
      enemy.state.meta.stackAmplificationCascadeFusionIndex ?? 0,
    ),
    resonanceAmplificationStackCombined: combineDualTeamResonanceAmplificationStack(
      friendly.state.meta.resonanceAmplificationStackIndex ?? 0,
      enemy.state.meta.resonanceAmplificationStackIndex ?? 0,
    ),
    cascadeConvergenceResonanceCombined: combineDualTeamCascadeConvergenceResonance(
      friendly.state.meta.cascadeConvergenceResonanceIndex ?? 0,
      enemy.state.meta.cascadeConvergenceResonanceIndex ?? 0,
    ),
    fusionStackConvergenceCombined: combineDualTeamFusionStackConvergence(
      friendly.state.meta.fusionStackConvergenceIndex ?? 0,
      enemy.state.meta.fusionStackConvergenceIndex ?? 0,
    ),
    resonanceCascadeSynthesisCombined: combineDualTeamResonanceCascadeSynthesis(
      friendly.state.meta.resonanceCascadeSynthesisIndex ?? 0,
      enemy.state.meta.resonanceCascadeSynthesisIndex ?? 0,
    ),
    convergenceAmplificationPressureCombined: combineDualTeamConvergenceAmplificationPressure(
      friendly.state.meta.convergenceAmplificationPressureIndex ?? 0,
      enemy.state.meta.convergenceAmplificationPressureIndex ?? 0,
    ),
    convergenceSynthesisFusionCombined: combineDualTeamConvergenceSynthesisFusion(
      friendly.state.meta.convergenceSynthesisFusionIndex ?? 0,
      enemy.state.meta.convergenceSynthesisFusionIndex ?? 0,
    ),
    pressureCascadeStackCombined: combineDualTeamPressureCascadeStack(
      friendly.state.meta.pressureCascadeStackIndex ?? 0,
      enemy.state.meta.pressureCascadeStackIndex ?? 0,
    ),
    synthesisPressureResonanceCombined: combineDualTeamSynthesisPressureResonance(
      friendly.state.meta.synthesisPressureResonanceIndex ?? 0,
      enemy.state.meta.synthesisPressureResonanceIndex ?? 0,
    ),
    fusionCascadeStackCombined: combineDualTeamFusionCascadeStack(
      friendly.state.meta.fusionCascadeStackIndex ?? 0,
      enemy.state.meta.fusionCascadeStackIndex ?? 0,
    ),
    resonancePressureCascadeCombined: combineDualTeamResonancePressureCascade(
      friendly.state.meta.resonancePressureCascadeIndex ?? 0,
      enemy.state.meta.resonancePressureCascadeIndex ?? 0,
    ),
    synthesisFusionConvergenceCombined: combineDualTeamSynthesisFusionConvergence(
      friendly.state.meta.synthesisFusionConvergenceIndex ?? 0,
      enemy.state.meta.synthesisFusionConvergenceIndex ?? 0,
    ),
    stackCascadeResonanceCombined: combineDualTeamStackCascadeResonance(
      friendly.state.meta.stackCascadeResonanceIndex ?? 0,
      enemy.state.meta.stackCascadeResonanceIndex ?? 0,
    ),
    cascadeConvergencePressureCombined: combineDualTeamCascadeConvergencePressure(
      friendly.state.meta.cascadeConvergencePressureIndex ?? 0,
      enemy.state.meta.cascadeConvergencePressureIndex ?? 0,
    ),
    convergenceFusionSynthesisCombined: combineDualTeamConvergenceFusionSynthesis(
      friendly.state.meta.convergenceFusionSynthesisIndex ?? 0,
      enemy.state.meta.convergenceFusionSynthesisIndex ?? 0,
    ),
    resonanceConvergenceFusionCombined: combineDualTeamResonanceConvergenceFusion(
      friendly.state.meta.resonanceConvergenceFusionIndex ?? 0,
      enemy.state.meta.resonanceConvergenceFusionIndex ?? 0,
    ),
    pressureSynthesisCascadeCombined: combineDualTeamPressureSynthesisCascade(
      friendly.state.meta.pressureSynthesisCascadeIndex ?? 0,
      enemy.state.meta.pressureSynthesisCascadeIndex ?? 0,
    ),
    synthesisResonanceStackCombined: combineDualTeamSynthesisResonanceStack(
      friendly.state.meta.synthesisResonanceStackIndex ?? 0,
      enemy.state.meta.synthesisResonanceStackIndex ?? 0,
    ),
    convergenceFusionPressureCombined: combineDualTeamConvergenceFusionPressure(
      friendly.state.meta.convergenceFusionPressureIndex ?? 0,
      enemy.state.meta.convergenceFusionPressureIndex ?? 0,
    ),
    synthesisCascadeStackCombined: combineDualTeamSynthesisCascadeStack(
      friendly.state.meta.synthesisCascadeStackIndex ?? 0,
      enemy.state.meta.synthesisCascadeStackIndex ?? 0,
    ),
    resonanceStackFusionCombined: combineDualTeamResonanceStackFusion(
      friendly.state.meta.resonanceStackFusionIndex ?? 0,
      enemy.state.meta.resonanceStackFusionIndex ?? 0,
    ),
    pressureStackResonanceCombined: combineDualTeamPressureStackResonance(
      friendly.state.meta.pressureStackResonanceIndex ?? 0,
      enemy.state.meta.pressureStackResonanceIndex ?? 0,
    ),
    stackFusionCascadeCombined: combineDualTeamStackFusionCascade(
      friendly.state.meta.stackFusionCascadeIndex ?? 0,
      enemy.state.meta.stackFusionCascadeIndex ?? 0,
    ),
    fusionCascadeConvergenceCombined: combineDualTeamFusionCascadeConvergence(
      friendly.state.meta.fusionCascadeConvergenceIndex ?? 0,
      enemy.state.meta.fusionCascadeConvergenceIndex ?? 0,
    ),
    resonanceFusionStackCombined: combineDualTeamResonanceFusionStack(
      friendly.state.meta.resonanceFusionStackIndex ?? 0,
      enemy.state.meta.resonanceFusionStackIndex ?? 0,
    ),
    fusionCascadePressureCombined: combineDualTeamFusionCascadePressure(
      friendly.state.meta.fusionCascadePressureIndex ?? 0,
      enemy.state.meta.fusionCascadePressureIndex ?? 0,
    ),
    stackConvergenceResonanceCombined: combineDualTeamStackConvergenceResonance(
      friendly.state.meta.stackConvergenceResonanceIndex ?? 0,
      enemy.state.meta.stackConvergenceResonanceIndex ?? 0,
    ),
    fusionStackPressureCombined: combineDualTeamFusionStackPressure(
      friendly.state.meta.fusionStackPressureIndex ?? 0,
      enemy.state.meta.fusionStackPressureIndex ?? 0,
    ),
    pressureResonanceCascadeCombined: combineDualTeamPressureResonanceCascade(
      friendly.state.meta.pressureResonanceCascadeIndex ?? 0,
      enemy.state.meta.pressureResonanceCascadeIndex ?? 0,
    ),
    stackSynthesisConvergenceCombined: combineDualTeamStackSynthesisConvergence(
      friendly.state.meta.stackSynthesisConvergenceIndex ?? 0,
      enemy.state.meta.stackSynthesisConvergenceIndex ?? 0,
    ),
    pressureCascadeFusionCombined: combineDualTeamPressureCascadeFusion(
      friendly.state.meta.pressureCascadeFusionIndex ?? 0,
      enemy.state.meta.pressureCascadeFusionIndex ?? 0,
    ),
    cascadeSynthesisResonanceCombined: combineDualTeamCascadeSynthesisResonance(
      friendly.state.meta.cascadeSynthesisResonanceIndex ?? 0,
      enemy.state.meta.cascadeSynthesisResonanceIndex ?? 0,
    ),
    convergencePressureStackCombined: combineDualTeamConvergencePressureStack(
      friendly.state.meta.convergencePressureStackIndex ?? 0,
      enemy.state.meta.convergencePressureStackIndex ?? 0,
    ),
    fusionCascadeResonanceCombined: combineDualTeamFusionCascadeResonance(
      friendly.state.meta.fusionCascadeResonanceIndex ?? 0,
      enemy.state.meta.fusionCascadeResonanceIndex ?? 0,
    ),
    resonancePressureStackCombined: combineDualTeamResonancePressureStack(
      friendly.state.meta.resonancePressureStackIndex ?? 0,
      enemy.state.meta.resonancePressureStackIndex ?? 0,
    ),
    stackSynthesisFusionCombined: combineDualTeamStackSynthesisFusion(
      friendly.state.meta.stackSynthesisFusionIndex ?? 0,
      enemy.state.meta.stackSynthesisFusionIndex ?? 0,
    ),
    cascadeResonanceStackCombined: combineDualTeamCascadeResonanceStack(
      friendly.state.meta.cascadeResonanceStackIndex ?? 0,
      enemy.state.meta.cascadeResonanceStackIndex ?? 0,
    ),
    resonanceFusionPressureCombined: combineDualTeamResonanceFusionPressure(
      friendly.state.meta.resonanceFusionPressureIndex ?? 0,
      enemy.state.meta.resonanceFusionPressureIndex ?? 0,
    ),
    fusionConvergenceSynthesisCombined: combineDualTeamFusionConvergenceSynthesis(
      friendly.state.meta.fusionConvergenceSynthesisIndex ?? 0,
      enemy.state.meta.fusionConvergenceSynthesisIndex ?? 0,
    ),
    stackResonancePressureCombined: combineDualTeamStackResonancePressure(
      friendly.state.meta.stackResonancePressureIndex ?? 0,
      enemy.state.meta.stackResonancePressureIndex ?? 0,
    ),
    pressureFusionSynthesisCombined: combineDualTeamPressureFusionSynthesis(
      friendly.state.meta.pressureFusionSynthesisIndex ?? 0,
      enemy.state.meta.pressureFusionSynthesisIndex ?? 0,
    ),
    synthesisStackConvergenceCombined: combineDualTeamSynthesisStackConvergence(
      friendly.state.meta.synthesisStackConvergenceIndex ?? 0,
      enemy.state.meta.synthesisStackConvergenceIndex ?? 0,
    ),
    stackFusionResonanceCombined: combineDualTeamStackFusionResonance(
      friendly.state.meta.stackFusionResonanceIndex ?? 0,
      enemy.state.meta.stackFusionResonanceIndex ?? 0,
    ),
    fusionSynthesisPressureCombined: combineDualTeamFusionSynthesisPressure(
      friendly.state.meta.fusionSynthesisPressureIndex ?? 0,
      enemy.state.meta.fusionSynthesisPressureIndex ?? 0,
    ),
    synthesisCascadeConvergenceCombined: combineDualTeamSynthesisCascadeConvergence(
      friendly.state.meta.synthesisCascadeConvergenceIndex ?? 0,
      enemy.state.meta.synthesisCascadeConvergenceIndex ?? 0,
    ),
    fusionResonanceSynthesisCombined: combineDualTeamFusionResonanceSynthesis(
      friendly.state.meta.fusionResonanceSynthesisIndex ?? 0,
      enemy.state.meta.fusionResonanceSynthesisIndex ?? 0,
    ),
    pressureCascadeConvergenceCombined: combineDualTeamPressureCascadeConvergence(
      friendly.state.meta.pressureCascadeConvergenceIndex ?? 0,
      enemy.state.meta.pressureCascadeConvergenceIndex ?? 0,
    ),
    cascadeStackFusionCombined: combineDualTeamCascadeStackFusion(
      friendly.state.meta.cascadeStackFusionIndex ?? 0,
      enemy.state.meta.cascadeStackFusionIndex ?? 0,
    ),
    synthesisResonanceConvergenceCombined: combineDualTeamSynthesisResonanceConvergence(
      friendly.state.meta.synthesisResonanceConvergenceIndex ?? 0,
      enemy.state.meta.synthesisResonanceConvergenceIndex ?? 0,
    ),
    pressureStackFusionCombined: combineDualTeamPressureStackFusion(
      friendly.state.meta.pressureStackFusionIndex ?? 0,
      enemy.state.meta.pressureStackFusionIndex ?? 0,
    ),
    fusionStackSynthesisCombined: combineDualTeamFusionStackSynthesis(
      friendly.state.meta.fusionStackSynthesisIndex ?? 0,
      enemy.state.meta.fusionStackSynthesisIndex ?? 0,
    ),
    resonanceConvergenceStackCombined: combineDualTeamResonanceConvergenceStack(
      friendly.state.meta.resonanceConvergenceStackIndex ?? 0,
      enemy.state.meta.resonanceConvergenceStackIndex ?? 0,
    ),
    pressureStackSynthesisCombined: combineDualTeamPressureStackSynthesis(
      friendly.state.meta.pressureStackSynthesisIndex ?? 0,
      enemy.state.meta.pressureStackSynthesisIndex ?? 0,
    ),
    fusionStackResonanceCombined: combineDualTeamFusionStackResonance(
      friendly.state.meta.fusionStackResonanceIndex ?? 0,
      enemy.state.meta.fusionStackResonanceIndex ?? 0,
    ),
    convergenceStackSynthesisCombined: combineDualTeamConvergenceStackSynthesis(
      friendly.state.meta.convergenceStackSynthesisIndex ?? 0,
      enemy.state.meta.convergenceStackSynthesisIndex ?? 0,
    ),
    stackSynthesisPressureCombined: combineDualTeamStackSynthesisPressure(
      friendly.state.meta.stackSynthesisPressureIndex ?? 0,
      enemy.state.meta.stackSynthesisPressureIndex ?? 0,
    ),
    fusionResonanceStackCombined: combineDualTeamFusionResonanceStack(
      friendly.state.meta.fusionResonanceStackIndex ?? 0,
      enemy.state.meta.fusionResonanceStackIndex ?? 0,
    ),
    synthesisPressureConvergenceCombined: combineDualTeamSynthesisPressureConvergence(
      friendly.state.meta.synthesisPressureConvergenceIndex ?? 0,
      enemy.state.meta.synthesisPressureConvergenceIndex ?? 0,
    ),
    pressureFusionStackCombined: combineDualTeamPressureFusionStack(
      friendly.state.meta.pressureFusionStackIndex ?? 0,
      enemy.state.meta.pressureFusionStackIndex ?? 0,
    ),
    resonanceSynthesisFusionCombined: combineDualTeamResonanceSynthesisFusion(
      friendly.state.meta.resonanceSynthesisFusionIndex ?? 0,
      enemy.state.meta.resonanceSynthesisFusionIndex ?? 0,
    ),
    convergencePressureFusionCombined: combineDualTeamConvergencePressureFusion(
      friendly.state.meta.convergencePressureFusionIndex ?? 0,
      enemy.state.meta.convergencePressureFusionIndex ?? 0,
    ),
    pressureResonanceSynthesisCombined: combineDualTeamPressureResonanceSynthesis(
      friendly.state.meta.pressureResonanceSynthesisIndex ?? 0,
      enemy.state.meta.pressureResonanceSynthesisIndex ?? 0,
    ),
    fusionConvergencePressureCombined: combineDualTeamFusionConvergencePressure(
      friendly.state.meta.fusionConvergencePressureIndex ?? 0,
      enemy.state.meta.fusionConvergencePressureIndex ?? 0,
    ),
    fusionSynthesisResonanceCombined: combineDualTeamFusionSynthesisResonance(
      friendly.state.meta.fusionSynthesisResonanceIndex ?? 0,
      enemy.state.meta.fusionSynthesisResonanceIndex ?? 0,
    ),
    resonancePressureConvergenceCombined: combineDualTeamResonancePressureConvergence(
      friendly.state.meta.resonancePressureConvergenceIndex ?? 0,
      enemy.state.meta.resonancePressureConvergenceIndex ?? 0,
    ),
    pressureFusionConvergenceCombined: combineDualTeamPressureFusionConvergence(
      friendly.state.meta.pressureFusionConvergenceIndex ?? 0,
      enemy.state.meta.pressureFusionConvergenceIndex ?? 0,
    ),
    resonanceConvergenceSynthesisCombined: combineDualTeamResonanceConvergenceSynthesis(
      friendly.state.meta.resonanceConvergenceSynthesisIndex ?? 0,
      enemy.state.meta.resonanceConvergenceSynthesisIndex ?? 0,
    ),
    synthesisPressureFusionCombined: combineDualTeamSynthesisPressureFusion(
      friendly.state.meta.synthesisPressureFusionIndex ?? 0,
      enemy.state.meta.synthesisPressureFusionIndex ?? 0,
    ),
    convergenceSynthesisResonanceCombined: combineDualTeamConvergenceSynthesisResonance(
      friendly.state.meta.convergenceSynthesisResonanceIndex ?? 0,
      enemy.state.meta.convergenceSynthesisResonanceIndex ?? 0,
    ),
    synthesisConvergencePressureCombined: combineDualTeamSynthesisConvergencePressure(
      friendly.state.meta.synthesisConvergencePressureIndex ?? 0,
      enemy.state.meta.synthesisConvergencePressureIndex ?? 0,
    ),
    convergencePressureSynthesisCombined: combineDualTeamConvergencePressureSynthesis(
      friendly.state.meta.convergencePressureSynthesisIndex ?? 0,
      enemy.state.meta.convergencePressureSynthesisIndex ?? 0,
    ),
    pressureSynthesisConvergenceCombined: combineDualTeamPressureSynthesisConvergence(
      friendly.state.meta.pressureSynthesisConvergenceIndex ?? 0,
      enemy.state.meta.pressureSynthesisConvergenceIndex ?? 0,
    ),
    convergenceSynthesisPressureCombined: combineDualTeamConvergenceSynthesisPressure(
      friendly.state.meta.convergenceSynthesisPressureIndex ?? 0,
      enemy.state.meta.convergenceSynthesisPressureIndex ?? 0,
    ),
    synthesisPressureResonanceCombined: combineDualTeamSynthesisPressureResonance(
      friendly.state.meta.synthesisPressureResonanceIndex ?? 0,
      enemy.state.meta.synthesisPressureResonanceIndex ?? 0,
    ),
    pressureResonanceConvergenceCombined: combineDualTeamPressureResonanceConvergence(
      friendly.state.meta.pressureResonanceConvergenceIndex ?? 0,
      enemy.state.meta.pressureResonanceConvergenceIndex ?? 0,
    ),
  };
}


// --- source: self-tests.ts ---
  arbitrateRegionLead,
  buildMutexMapWithPriorityArbitration,
  compareArbitrationCandidates,
  missionTierForTask,
} from './priority-arbitration.ts';
  buildActorDirectiveConstraints,
  coordinateTeammateDirectives,
  dedupeDirectiveProposals,
  stressDirectiveCoordination,
} from './directive-coordination.ts';
  detectMutexThrashing,
  mergeReconcileThrashing,
  reconcileCoordinationPlans,
} from './coordination-reconcile.ts';
  bumpPersistTracker,
  decideTeamMultiAgentPersistence,
  teamMultiAgentPersistSignature,
} from './layer-persistence.ts';
  auditCrossTeamMutexIsolation,
  filterCrossTeamDirectives,
  teamActorScope,
} from './team-boundary-guard.ts';
  buildActorCapacityLedger,
  suggestCapacityRebalanceNotes,
} from './actor-capacity-ledger.ts';
  filterHandoffsByReadiness,
  scoreHandoffReadiness,
} from './handoff-readiness-scorer.ts';
  evaluateWorkstreamBarriers,
  trackWorkstreamBarrierSince,
} from './workstream-barrier-monitor.ts';
  DuplicateActionGuard,
  buildActionFingerprint,
  detectDuplicateIntents,
  tryCommitAction,
} from './duplicate-action-guard.ts';
  assignTeamRolesWithSlots,
  detectIllegalSharedExclusiveTasks,
  resolveExclusiveSlotCollisions,
  summarizeRoleBoard,
} from './role-assignment-engine.ts';
  AGENT18_LIMITS,
  RoleAssignment,
  TeamMultiAgentInputs,
  TeamTaskSnapshot,
  TeammateDirectiveProposal,
} from './types.ts';

export interface Agent18SelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function check(
  results: Agent18SelfTestResult[],
  id: string,
  name: string,
  fn: () => boolean | string,
): void {
  try {
    const out = fn();
    results.push({
      id,
      name,
      passed: out === true,
      detail: out === true ? 'ok' : String(out || 'failed'),
    });
  } catch (e) {
    results.push({
      id,
      name,
      passed: false,
      detail: e instanceof Error ? e.message : String(e),
    });
  }
}

function baseInputs(overrides: Partial<TeamMultiAgentInputs> = {}): TeamMultiAgentInputs {
  const tasks: TeamTaskSnapshot[] = [
    {
      id: 'task_defend_NSW',
      type: 'defend_region',
      label: 'Defend NSW',
      status: 'ready',
      priority: 1,
      assignedActorIds: ['player'],
      regionId: 'NSW',
      resourceRequirement: 2000,
      dependencies: [],
      humanStatus: 'suggested',
    },
    {
      id: 'task_cash_mate',
      type: 'generate_cash',
      label: 'Generate team cash',
      status: 'ready',
      priority: 2,
      assignedActorIds: ['mate'],
      regionId: null,
      resourceRequirement: 0,
      dependencies: [],
    },
  ];
  return {
    teamId: 'team_player',
    turn: 7,
    actors: [
      {
        id: 'player',
        name: 'You',
        isHuman: true,
        inRecovery: false,
        location: 'NSW',
        apRemaining: 3,
        brainRole: null,
      },
      {
        id: 'mate',
        name: 'Riley',
        isHuman: false,
        inRecovery: false,
        location: 'VIC',
        apRemaining: null,
        brainRole: 'earner',
      },
    ],
    tasks,
    command: {
      responsibilities: [
        { actorId: 'mate', focus: 'economy' },
        { actorId: 'player', focus: 'controller', regionId: 'NSW' },
      ],
      lockedActorIds: [],
      reserveFloor: 8000,
    },
    previousRoles: [],
    roleSince: {},
    lockedRoles: [],
    roleMinTurns: AGENT18_LIMITS.roleMinTurnsDefault,
    ...overrides,
  };
}

export function runAgent18TeamMultiAgentSelfTests(): Agent18SelfTestResult[] {
  const results: Agent18SelfTestResult[] = [];

  check(results, 'a18_roles_explicit', 'Roles: explicit command assigns Riley earner and player controller', () => {
    const { roles } = assignTeamRolesWithSlots(baseInputs());
    const mate = roles.find(r => r.actorId === 'mate');
    const me = roles.find(r => r.actorId === 'player');
    return (mate?.primaryRole === 'earner' && mate.explicit && me?.primaryRole === 'controller') || summarizeRoleBoard(roles);
  });

  check(results, 'a18_roles_hysteresis', 'Roles: non-explicit roles hold for roleMinTurns', () => {
    const first = assignTeamRolesWithSlots(baseInputs({ turn: 7 }));
    const prev = first.roles;
    const moved = baseInputs({ turn: 8 });
    moved.tasks = moved.tasks.map(t =>
      t.id === 'task_cash_mate' ? { ...t, type: 'take_region', label: 'Take QLD', regionId: 'QLD' } : t,
    );
    const second = assignTeamRolesWithSlots({ ...moved, previousRoles: prev, roleSince: { mate: 7 } });
    const before = prev.find(r => r.actorId === 'mate')!.primaryRole;
    const after = second.roles.find(r => r.actorId === 'mate')!.primaryRole;
    return before === after || `${before}→${after}`;
  });

  check(results, 'a18_roles_recovery', 'Roles: AI in recovery forced to recovery role', () => {
    const inp = baseInputs({ command: null });
    inp.actors = inp.actors.map(a => (a.id === 'mate' ? { ...a, inRecovery: true } : a));
    const { roles } = assignTeamRolesWithSlots(inp);
    return roles.find(r => r.actorId === 'mate')?.primaryRole === 'recovery' || 'not recovery';
  });

  check(results, 'a18_slot_collision', 'Roles: exclusive slot collision demotes loser to support', () => {
    const roles: RoleAssignment[] = [
      {
        actorId: 'a',
        primaryRole: 'controller',
        secondaryRole: null,
        responsibility: 'Defend NSW',
        reason: 'test',
        taskIds: ['t1'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: false,
        confidence: 0.8,
        explicit: false,
        exclusiveSlotId: 'region:NSW:defend_region',
      },
      {
        actorId: 'b',
        primaryRole: 'explorer',
        secondaryRole: null,
        responsibility: 'Also NSW',
        reason: 'test',
        taskIds: ['t2'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: false,
        confidence: 0.8,
        explicit: false,
        exclusiveSlotId: 'region:NSW:defend_region',
      },
    ];
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 't1',
        type: 'defend_region',
        label: 'Defend NSW',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['a'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
      {
        id: 't2',
        type: 'defend_region',
        label: 'Defend NSW too',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['b'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
    ];
    const out = resolveExclusiveSlotCollisions(roles, tasks);
    const loser = out.roles.find(r => r.actorId === 'b');
    return (loser?.primaryRole === 'support' && out.notes.length > 0) || JSON.stringify(out);
  });

  check(results, 'a18_coord_mutex', 'Coordination: region mutex selects single lead for deposits', () => {
    const inp = baseInputs();
    const ev = evaluateTeamMultiAgentLayer(inp, null);
    return ev.state.coordination.mutexRegions.NSW === 'player' || JSON.stringify(ev.state.coordination.mutexRegions);
  });

  check(results, 'a18_coord_parallel', 'Coordination: human and AI can work in parallel workstream', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const ws = ev.state.coordination.workstreams[0];
    return (ws && ws.actorIds.includes('player') && ws.actorIds.includes('mate')) || 'no workstream';
  });

  check(results, 'a18_coord_handoff', 'Coordination: accepting handoff moves mutex holder', () => {
    let plan = orchestrateTeamCoordination(5, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    plan = {
      ...plan,
      handoffs: [
        {
          id: 'h1',
          fromActorId: 'player',
          toActorId: 'mate',
          regionId: 'NSW',
          taskId: 'task_defend_NSW',
          status: 'pending',
          requestedTurn: 5,
          reason: 'test',
        },
      ],
    };
    const next = acceptHandoff(plan, 'h1');
    return next.mutexRegions.NSW === 'mate' || JSON.stringify(next.mutexRegions);
  });

  check(results, 'a18_coord_health', 'Coordination: health score penalizes warnings', () => {
    const good = coordinationHealthScore({ leases: [], handoffs: [], workstreams: [], mutexRegions: {}, warnings: [], arbitrationLog: [] });
    const bad = coordinationHealthScore({
      leases: [],
      handoffs: [],
      workstreams: [],
      mutexRegions: {},
      warnings: ['a', 'b', 'c', 'd', 'e'],
      arbitrationLog: [],
    });
    return good > bad || `${good} vs ${bad}`;
  });

  check(results, 'a18_dup_commit_once', 'Duplicate guard: same fingerprint blocked as duplicate_action_token', () => {
    const guard = new DuplicateActionGuard(undefined, 3);
    const fp = buildActionFingerprint({
      actorId: 'mate',
      actionKind: 'region_deposit',
      targetId: 'NSW',
      turn: 3,
      executionGeneration: 1,
      amount: 500,
    });
    const first = guard.tryCommit(fp);
    const second = guard.tryCommit(fp);
    return first.ok === true && second.ok === false && second.reason === 'duplicate_action_token';
  });

  check(results, 'a18_dup_stale_gen', 'Duplicate guard: stale execution generation rejected', () => {
    const state = { version: 1 as const, committedKeys: [], generationByActor: { mate: 5 }, turn: 4, reservations: {} };
    const fp = buildActionFingerprint({
      actorId: 'mate',
      actionKind: 'travel',
      targetId: 'VIC',
      turn: 4,
      executionGeneration: 3,
    });
    const out = tryCommitAction(state, fp);
    return out.result.ok === false && out.result.reason === 'stale_generation';
  });

  check(results, 'a18_dup_mutex_block', 'Duplicate guard: non-holder blocked by coordination mutex', () => {
    const fp = buildActionFingerprint({
      actorId: 'mate',
      actionKind: 'region_deposit',
      targetId: 'NSW',
      turn: 2,
      executionGeneration: 1,
    });
    const coordination = orchestrateTeamCoordination(2, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    const out = tryCommitAction(emptyGuard(2), fp, coordination);
    return out.result.ok === false && out.result.reason === 'lease_blocked';
  });

  check(results, 'a18_dup_intent_scan', 'Duplicate guard: detectDuplicateIntents finds parallel proposals', () => {
    const a = buildActionFingerprint({ actorId: 'm', actionKind: 'travel', targetId: 'X', turn: 1, executionGeneration: 1 });
    const b = buildActionFingerprint({ actorId: 'm', actionKind: 'travel', targetId: 'X', turn: 1, executionGeneration: 2 });
    return detectDuplicateIntents([a, b]).length === 1 || 'missed dupe';
  });

  check(results, 'a18_shared_exclusive', 'Safeguard: illegal shared exclusive tasks flagged', () => {
    const tasks = baseInputs().tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, assignedActorIds: ['player', 'mate'] } : t,
    );
    const issues = detectIllegalSharedExclusiveTasks(tasks);
    return issues.length > 0 || 'no issue detected';
  });

  check(results, 'a18_eval_deterministic', 'Layer evaluation is deterministic for identical inputs', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const b = evaluateTeamMultiAgentLayer(baseInputs(), null);
    return teamMultiAgentSignature(a.state) === teamMultiAgentSignature(b.state) || 'signatures differ';
  });

  check(results, 'a18_reservation_wiring', 'Layer evaluation reserves region deposit slots for mutex holder', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const key = 'res:NSW:region_deposit';
    const r = ev.state.duplicateGuard.reservations[key];
    return (r && r.holderActorId === 'player') || JSON.stringify(ev.state.duplicateGuard.reservations);
  });

  check(results, 'a18_turn_advance', 'Duplicate guard trims reservations on turn advance', () => {
    const prev = evaluateTeamMultiAgentLayer(baseInputs({ turn: 5 }), null);
    const next = evaluateTeamMultiAgentLayer(baseInputs({ turn: 8 }), prev.state);
    return next.state.duplicateGuard.turn === 8 || `turn ${next.state.duplicateGuard.turn}`;
  });

  check(results, 'a18_arb_defend_beats_take', 'Priority: defend_region beats take_region on same region even with worse task priority', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'def',
        type: 'defend_region',
        label: 'Defend NSW',
        status: 'ready',
        priority: 3,
        assignedActorIds: ['player'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
      {
        id: 'take',
        type: 'take_region',
        label: 'Take NSW',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['mate'],
        regionId: 'NSW',
        resourceRequirement: 1000,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(baseInputs({ tasks, command: null })).roles;
    const { mutexRegions } = buildMutexMapWithPriorityArbitration(tasks, roles);
    return mutexRegions.NSW === 'player' || JSON.stringify(mutexRegions);
  });

  check(results, 'a18_arb_tiebreak_actor', 'Priority: identical tier/priority tie-breaks by actorId lexicographic order', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'd1',
        type: 'defend_region',
        label: 'Defend QLD',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['zeta'],
        regionId: 'QLD',
        resourceRequirement: 500,
        dependencies: [],
      },
      {
        id: 'd2',
        type: 'defend_region',
        label: 'Defend QLD too',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['alpha'],
        regionId: 'QLD',
        resourceRequirement: 500,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(
      baseInputs({
        tasks,
        command: null,
        actors: [
          { id: 'alpha', name: 'A', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
          { id: 'zeta', name: 'Z', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
        ],
      }),
    ).roles;
    const { holderActorId } = arbitrateRegionLead('QLD', tasks, roles);
    return holderActorId === 'alpha' || `holder ${holderActorId}`;
  });

  check(results, 'a18_arb_explicit_boost', 'Priority: explicit assignment wins among equal mission tiers', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 't1',
        type: 'take_region',
        label: 'Take SA',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['player'],
        regionId: 'SA',
        resourceRequirement: 800,
        dependencies: [],
      },
      {
        id: 't2',
        type: 'take_region',
        label: 'Take SA too',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['mate'],
        regionId: 'SA',
        resourceRequirement: 800,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(
      baseInputs({
        tasks,
        command: {
          responsibilities: [{ actorId: 'mate', focus: 'expansion', regionId: 'SA' }],
          lockedActorIds: [],
          reserveFloor: null,
        },
      }),
    ).roles;
    const { mutexRegions } = buildMutexMapWithPriorityArbitration(tasks, roles);
    return mutexRegions.SA === 'mate' || JSON.stringify({ mutexRegions, roles });
  });

  check(results, 'a18_arb_locked_retains', 'Priority: locked actor keeps lead when scores are close', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'd1',
        type: 'defend_region',
        label: 'Defend WA',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['locked'],
        regionId: 'WA',
        resourceRequirement: 500,
        dependencies: [],
      },
      {
        id: 'd2',
        type: 'defend_region',
        label: 'Defend WA',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['other'],
        regionId: 'WA',
        resourceRequirement: 500,
        dependencies: [],
      },
    ];
    const roles = assignTeamRolesWithSlots(
      baseInputs({
        tasks,
        command: null,
        lockedRoles: ['locked'],
        actors: [
          { id: 'locked', name: 'L', isHuman: false, inRecovery: false, location: 'WA', apRemaining: null, brainRole: null },
          { id: 'other', name: 'O', isHuman: false, inRecovery: false, location: 'WA', apRemaining: null, brainRole: null },
        ],
      }),
    ).roles;
    const { mutexRegions } = buildMutexMapWithPriorityArbitration(tasks, roles, ['locked']);
    return mutexRegions.WA === 'locked' || JSON.stringify(mutexRegions);
  });

  check(results, 'a18_arb_recovery_loses', 'Priority: recovery-weighted actor loses region lead to healthy defender', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'rec',
        type: 'defend_region',
        label: 'Defend NT',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['sick'],
        regionId: 'NT',
        resourceRequirement: 500,
        dependencies: [],
      },
      {
        id: 'ok',
        type: 'defend_region',
        label: 'Defend NT',
        status: 'ready',
        priority: 2,
        assignedActorIds: ['healthy'],
        regionId: 'NT',
        resourceRequirement: 500,
        dependencies: [],
      },
    ];
    const roles: RoleAssignment[] = [
      {
        actorId: 'sick',
        primaryRole: 'recovery',
        secondaryRole: null,
        responsibility: 'Recover',
        reason: 'test',
        taskIds: ['rec'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: true,
        confidence: 0.5,
        explicit: false,
        exclusiveSlotId: null,
      },
      {
        actorId: 'healthy',
        primaryRole: 'controller',
        secondaryRole: null,
        responsibility: 'Defend NT',
        reason: 'test',
        taskIds: ['ok'],
        startTurn: 1,
        reviewCondition: 'x',
        temporary: false,
        confidence: 0.8,
        explicit: false,
        exclusiveSlotId: null,
      },
    ];
    const { holderActorId } = arbitrateRegionLead('NT', tasks, roles);
    return holderActorId === 'healthy' || `holder ${holderActorId}`;
  });

  check(results, 'a18_arb_log_wired', 'Priority: arbitration log attached to coordination plan', () => {
    const tasks = baseInputs().tasks.concat({
      id: 'task_take_VIC',
      type: 'take_region',
      label: 'Take VIC',
      status: 'ready',
      priority: 1,
      assignedActorIds: ['mate'],
      regionId: 'VIC',
      resourceRequirement: 500,
      dependencies: [],
    });
    const ev = evaluateTeamMultiAgentLayer(baseInputs({ tasks }), null);
    return (
      ev.state.coordination.arbitrationLog.length >= 2 &&
      ev.state.diagnostics.some(d => d.includes('Priority arbitration'))
    ) || JSON.stringify({ log: ev.state.coordination.arbitrationLog, diag: ev.state.diagnostics.slice(0, 5) });
  });

  check(results, 'a18_arb_compare_stable', 'Priority: compareArbitrationCandidates is antisymmetric and deterministic', () => {
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'x',
        type: 'take_region',
        label: 'X',
        status: 'ready',
        priority: 1,
        assignedActorIds: ['a'],
        regionId: 'TAS',
        resourceRequirement: 1,
        dependencies: [],
      },
    ];
    const ca = {
      actorId: 'a',
      task: tasks[0],
      role: null,
      explicit: false,
      locked: false,
    };
    const cb = { ...ca, actorId: 'b' };
    const ab = compareArbitrationCandidates(ca, cb, 'TAS');
    const ba = compareArbitrationCandidates(cb, ca, 'TAS');
    return ab < 0 && ba > 0 && missionTierForTask(tasks[0]) === 8;
  });

  check(results, 'a18_dir_mutex_suppress', 'Directives: non-holder region deposit proposal suppressed', () => {
    const inp = baseInputs();
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'd1', actorId: 'mate', goalKind: 'region_deposit', targetRegionId: 'NSW', taskId: 'x', priority: 1 },
    ];
    const ev = evaluateTeamMultiAgentLayer({ ...inp, directiveProposals: proposals }, null);
    return (
      ev.state.meta.suppressedDirectiveIds.includes('d1') &&
      ev.state.coordination.mutexRegions.NSW === 'player'
    ) || JSON.stringify(ev.state.meta);
  });

  check(results, 'a18_dir_dedupe', 'Directives: dedupeDirectiveProposals keeps highest-priority unique keys', () => {
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'a', actorId: 'm', goalKind: 'travel', targetRegionId: 'VIC', taskId: null, priority: 2 },
      { id: 'b', actorId: 'm', goalKind: 'travel', targetRegionId: 'VIC', taskId: null, priority: 1 },
    ];
    const out = dedupeDirectiveProposals(proposals);
    return out.length === 1 && out[0].id === 'b' || JSON.stringify(out);
  });

  check(results, 'a18_dir_recovery_block', 'Directives: recovery role blocks expansion directives', () => {
    const inp = baseInputs({ command: null });
    inp.actors = inp.actors.map(a => (a.id === 'mate' ? { ...a, inRecovery: true } : a));
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'exp', actorId: 'mate', goalKind: 'take_region', targetRegionId: 'QLD', taskId: null, priority: 1 },
    ];
    const ev = evaluateTeamMultiAgentLayer({ ...inp, directiveProposals: proposals }, null);
    return ev.state.meta.suppressedDirectiveIds.includes('exp') || JSON.stringify(ev.state.meta);
  });

  check(results, 'a18_dir_constraints', 'Directives: mutex holder receives lead constraint label', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const c = ev.state.meta.directiveConstraints.player;
    return (typeof c === 'string' && c.includes('NSW')) || JSON.stringify(ev.state.meta.directiveConstraints);
  });

  check(results, 'a18_audit_shared_exclusive', 'Audit: illegal shared exclusive tasks surface as errors', () => {
    const tasks = baseInputs().tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, assignedActorIds: ['player', 'mate'] } : t,
    );
    const ev = evaluateTeamMultiAgentLayer(baseInputs({ tasks }), null);
    return ev.auditFindings.some(f => f.severity === 'error') || JSON.stringify(ev.auditFindings);
  });

  check(results, 'a18_audit_reservation', 'Audit: reservation/mutex mismatch flagged', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const bad = { ...ev.state };
    bad.duplicateGuard = {
      ...bad.duplicateGuard,
      reservations: {
        'res:NSW:region_deposit': { holderActorId: 'mate', taskId: 't', turn: ev.state.turn },
      },
    };
    const findings = auditTeamMultiAgentLayer(bad, baseInputs());
    return findings.some(f => f.severity === 'error' && /disagrees with mutex/.test(f.message));
  });

  check(results, 'a18_stress_directives', 'Stress: directive coordination stable over 5 turns', () => {
    const roles = assignTeamRolesWithSlots(baseInputs()).roles;
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'p', actorId: 'mate', goalKind: 'region_deposit', targetRegionId: 'NSW', taskId: null, priority: 1 },
    ];
    const steps = stressDirectiveCoordination(
      proposals,
      () => orchestrateTeamCoordination(0, baseInputs().tasks, roles),
      roles,
      5,
    );
    return steps.length === 5 && steps.every(s => s.suppressedCount >= 1) || JSON.stringify(steps);
  });

  check(results, 'a18_meta_summary', 'Audit: meta auditSummary matches finding severities', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const s = ev.state.meta.auditSummary;
    const counts = {
      errors: ev.auditFindings.filter(f => f.severity === 'error').length,
      warnings: ev.auditFindings.filter(f => f.severity === 'warning').length,
      info: ev.auditFindings.filter(f => f.severity === 'info').length,
    };
    return s.errors === counts.errors && s.warnings === counts.warnings && s.info === counts.info;
  });

  check(results, 'a18_reconcile_stable', 'Reconcile: identical plans report stable with no changes', () => {
    const plan = orchestrateTeamCoordination(3, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    const r = reconcileCoordinationPlans(plan, plan, 4);
    return r.stable && r.changes.length === 0;
  });

  check(results, 'a18_reconcile_mutex_change', 'Reconcile: mutex holder change recorded', () => {
    const prev = orchestrateTeamCoordination(1, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles);
    const next = { ...prev, mutexRegions: { ...prev.mutexRegions, NSW: 'mate' } };
    const r = reconcileCoordinationPlans(prev, next, 2);
    return r.changes.some(c => c.kind === 'mutex_holder_changed') || JSON.stringify(r.changes);
  });

  check(results, 'a18_thrash_detect', 'Reconcile: detectMutexThrashing flags flip-flopping region', () => {
    const history = [
      { NSW: 'player' },
      { NSW: 'mate' },
      { NSW: 'player' },
      { NSW: 'mate' },
    ];
    const thrash = detectMutexThrashing(history, 2);
    return thrash.includes('NSW') || JSON.stringify(thrash);
  });

  check(results, 'a18_eval_reconcile_meta', 'Layer: prior state yields reconcile metadata on plan change', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs({ turn: 4 }), null);
    const b = evaluateTeamMultiAgentLayer(baseInputs({ turn: 5 }), a.state);
    return b.state.meta.mutexHistory.length >= 2 || `history ${b.state.meta.mutexHistory.length}`;
  });

  check(results, 'a18_audit_expired_lease', 'Audit: expired treasury lease surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs({ turn: 10 }), null);
    const state = { ...ev.state };
    state.coordination = {
      ...state.coordination,
      leases: [
        {
          id: 'lease_x',
          kind: 'treasury_request',
          holderActorId: 'mate',
          regionId: null,
          taskId: 'task_cash_mate',
          sinceTurn: 8,
          expiresTurn: 9,
          reason: 'test',
        },
      ],
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs({ turn: 10 }));
    return findings.some(f => /expired/.test(f.message)) || JSON.stringify(findings);
  });

  check(results, 'a18_audit_thrash_error', 'Audit: thrashing regions in meta escalate to error finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, thrashingRegions: ['NSW'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'error' && /thrashing/.test(f.message));
  });

  check(results, 'a18_merge_reconcile_thrash', 'Reconcile: mergeReconcileThrashing marks plan unstable', () => {
    const history = [{ NSW: 'a' }, { NSW: 'b' }, { NSW: 'a' }, { NSW: 'b' }];
    const base = reconcileCoordinationPlans(null, orchestrateTeamCoordination(0, baseInputs().tasks, assignTeamRolesWithSlots(baseInputs()).roles), 1);
    const merged = mergeReconcileThrashing(base, history);
    return merged.stable === false && merged.thrashingRegions.includes('NSW');
  });

  check(results, 'a18_boundary_cross_directive', 'Boundary: cross-team directive proposals rejected', () => {
    const scope = teamActorScope(baseInputs());
    const { rejected } = filterCrossTeamDirectives(
      [{ id: 'x', actorId: 'enemy_bot', goalKind: 'travel', targetRegionId: null, taskId: null, priority: 1 }],
      scope,
    );
    return rejected.length === 1 && rejected[0].reason.includes('cross_team');
  });

  check(results, 'a18_boundary_eval', 'Boundary: evaluate layer rejects out-of-team directive via diagnostics', () => {
    const ev = evaluateTeamMultiAgentLayer(
      {
        ...baseInputs(),
        directiveProposals: [
          { id: 'bad', actorId: 'rival', goalKind: 'region_deposit', targetRegionId: 'NSW', taskId: null, priority: 1 },
        ],
      },
      null,
    );
    return ev.state.diagnostics.some(d => d.includes('cross-team')) || JSON.stringify(ev.state.diagnostics);
  });

  check(results, 'a18_persist_unchanged', 'Persistence: identical evaluation skips commit', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const d = decideTeamMultiAgentPersistence(a.state, a.state, teamMultiAgentPersistSignature(a.state), 0);
    return d.commit === false && d.reason.includes('unchanged');
  });

  check(results, 'a18_persist_material', 'Persistence: first material state commits', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const d = decideTeamMultiAgentPersistence(null, a.state, null, 0);
    return d.commit === true || d.reason;
  });

  check(results, 'a18_persist_cap', 'Persistence: commit cap blocks excessive commits', () => {
    const a = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const mutated = {
      ...a.state,
      coordination: {
        ...a.state.coordination,
        mutexRegions: { ...a.state.coordination.mutexRegions, TAS: 'mate' },
      },
    };
    const d = decideTeamMultiAgentPersistence(
      a.state,
      mutated,
      null,
      AGENT18_LIMITS.maxCommitsPerTurn,
    );
    return d.commit === false && d.reason.includes('cap');
  });

  check(results, 'a18_persist_tracker', 'Persistence: bumpPersistTracker resets on new turn', () => {
    const t1 = bumpPersistTracker({ turn: 1, commits: 2, lastSignature: 'a' }, 2, 'b', true);
    return t1.turn === 2 && t1.commits === 1;
  });

  check(results, 'a18_dual_team', 'Dual team: friendly + enemy evaluate with separate byTeam states', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [
        {
          id: 'take_qld',
          type: 'take_region',
          label: 'Take QLD',
          status: 'ready',
          priority: 1,
          assignedActorIds: ['ai1'],
          regionId: 'QLD',
          resourceRequirement: 500,
          dependencies: [],
        },
      ],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      dual.enemy !== null &&
      dual.byTeam.team_player &&
      dual.byTeam.team_opponent &&
      dual.isolationIssues.length === 0 &&
      typeof dual.handoffSlaCombinedCompliance === 'number'
    ) || JSON.stringify({ issues: dual.isolationIssues });
  });

  check(results, 'a18_dual_mutex_overlap', 'Dual team: overlapping mutex regions flagged', () => {
    const issues = auditCrossTeamMutexIsolation({ NSW: 'player' }, { NSW: 'ai1' });
    return issues.length === 1 && /overlap/.test(issues[0]);
  });

  check(results, 'a18_eval_persistence_field', 'Layer evaluation exposes persistence decision', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    return typeof ev.persistence.commit === 'boolean' && Boolean(ev.persistence.signature);
  });

  check(results, 'a18_handoff_sla_overdue', 'Handoff SLA: stale pending handoff flagged overdue', () => {
    const report = evaluateHandoffSla(10, [
      {
        id: 'h_old',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 5,
        reason: 'test',
      },
    ]);
    return report.overdueHandoffIds.includes('h_old') && report.complianceScore === 0;
  });

  check(results, 'a18_handoff_sla_clean', 'Handoff SLA: fresh pending handoff stays compliant', () => {
    const report = evaluateHandoffSla(6, [
      {
        id: 'h_new',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 6,
        reason: 'test',
      },
    ]);
    return report.overdueHandoffIds.length === 0 && report.complianceScore === 100;
  });

  check(results, 'a18_capacity_overload', 'Capacity: zero AP with ready tasks marks overloaded', () => {
    const inp = baseInputs();
    inp.actors = inp.actors.map(a => (a.id === 'player' ? { ...a, apRemaining: 0 } : a));
    const roles = assignTeamRolesWithSlots(inp).roles;
    const ledger = buildActorCapacityLedger(inp.actors, inp.tasks, roles);
    return ledger.overloadedActorIds.includes('player') || JSON.stringify(ledger);
  });

  check(results, 'a18_capacity_idle', 'Capacity: high AP without tasks marks idle', () => {
    const inp = baseInputs({ command: null });
    inp.actors = [
      { id: 'solo', name: 'S', isHuman: false, inRecovery: false, location: 'NSW', apRemaining: 5, brainRole: null },
    ];
    inp.tasks = [];
    const roles = assignTeamRolesWithSlots(inp).roles;
    const ledger = buildActorCapacityLedger(inp.actors, inp.tasks, roles);
    return ledger.idleActorIds.includes('solo') && ledger.rows[0]?.status === 'idle';
  });

  check(results, 'a18_capacity_rebalance_hint', 'Capacity: rebalance hint when overload and idle coexist', () => {
    const ledger = {
      rows: [],
      balanceScore: 50,
      overloadedActorIds: ['a'],
      idleActorIds: ['b'],
      notes: [],
    };
    const hints = suggestCapacityRebalanceNotes(ledger);
    return hints.length === 1 && hints[0].includes('a') && hints[0].includes('b');
  });

  check(results, 'a18_quota_actor_cap', 'Directive quota: actor cap drops lower-priority extras', () => {
    const proposals: TeammateDirectiveProposal[] = [
      { id: 'p1', actorId: 'mate', goalKind: 'travel', targetRegionId: 'VIC', taskId: null, priority: 1 },
      { id: 'p2', actorId: 'mate', goalKind: 'travel', targetRegionId: 'QLD', taskId: null, priority: 2 },
      { id: 'p3', actorId: 'mate', goalKind: 'travel', targetRegionId: 'SA', taskId: null, priority: 3 },
      { id: 'p4', actorId: 'mate', goalKind: 'travel', targetRegionId: 'WA', taskId: null, priority: 4 },
    ];
    const q = applyDirectiveQuotaGuard(proposals, { maxPerActorPerTurn: 2, maxPerTeamPerTurn: 8 });
    return q.allowed.length === 2 && q.dropped.some(d => d.proposal.id === 'p3');
  });

  check(results, 'a18_quota_team_cap', 'Directive quota: team cap enforced across actors', () => {
    const proposals: TeammateDirectiveProposal[] = Array.from({ length: 10 }, (_, i) => ({
      id: `d${i}`,
      actorId: i % 2 === 0 ? 'player' : 'mate',
      goalKind: 'travel',
      targetRegionId: 'VIC',
      taskId: null,
      priority: i,
    }));
    const q = applyDirectiveQuotaGuard(proposals, { maxPerActorPerTurn: 5, maxPerTeamPerTurn: 4 });
    return q.allowed.length === 4 && q.dropped.length === 6;
  });

  check(results, 'a18_eval_round4_meta', 'Layer: round-4 meta exposes SLA, capacity, quota fields', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.handoffSlaCompliance === 'number' &&
      typeof m.capacityBalanceScore === 'number' &&
      m.directiveQuotaRemaining !== undefined
    );
  });

  check(results, 'a18_dual_sla_compliance', 'Dual team: combined handoff SLA compliance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return typeof dual.handoffSlaCombinedCompliance === 'number';
  });

  check(results, 'a18_handoff_readiness_block', 'Handoff readiness: zero AP marks target not ready', () => {
    const handoffs = [
      {
        id: 'h1',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 'task_defend_NSW',
        status: 'pending' as const,
        requestedTurn: 5,
        reason: 'test',
      },
    ];
    const inp = baseInputs();
    inp.tasks = inp.tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, status: 'blocked' as const } : t,
    );
    inp.actors = inp.actors.map(a => (a.id === 'mate' ? { ...a, apRemaining: 0 } : a));
    const roles = assignTeamRolesWithSlots(inp).roles;
    const report = scoreHandoffReadiness(handoffs, inp.actors, roles, inp.tasks);
    return report.notReadyHandoffIds.includes('h1') && report.averageReadiness < 100;
  });

  check(results, 'a18_handoff_readiness_ok', 'Handoff readiness: blocked task + AP yields ready target', () => {
    const handoffs = [
      {
        id: 'h_ok',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 'task_defend_NSW',
        status: 'pending' as const,
        requestedTurn: 6,
        reason: 'test',
      },
    ];
    const inp = baseInputs();
    inp.tasks = inp.tasks.map(t =>
      t.id === 'task_defend_NSW' ? { ...t, status: 'blocked' as const } : t,
    );
    const roles = assignTeamRolesWithSlots(inp).roles;
    const report = scoreHandoffReadiness(handoffs, inp.actors, roles, inp.tasks);
    const row = report.rows.find(r => r.handoffId === 'h_ok');
    return row?.ready === true && report.notReadyHandoffIds.length === 0;
  });

  check(results, 'a18_handoff_filter_defer', 'Handoff filter: defers unreadiness below score threshold', () => {
    const handoffs = [
      {
        id: 'h_bad',
        fromActorId: 'player',
        toActorId: 'mate',
        regionId: 'NSW',
        taskId: 't',
        status: 'pending' as const,
        requestedTurn: 1,
        reason: 'test',
      },
    ];
    const report = scoreHandoffReadiness(
      handoffs,
      [{ id: 'mate', name: 'M', isHuman: false, inRecovery: true, location: 'NSW', apRemaining: 0, brainRole: null }],
      [],
      [{ id: 't', type: 'defend_region', label: 'x', status: 'blocked', priority: 1, assignedActorIds: ['player'], regionId: 'NSW', resourceRequirement: 1, dependencies: [] }],
    );
    const filtered = filterHandoffsByReadiness(handoffs, report);
    return filtered.deferredIds.includes('h_bad') && filtered.eligible.length === 0;
  });

  check(results, 'a18_mutex_stability_stable', 'Mutex stability: steady holder history scores 100', () => {
    const history = [{ NSW: 'player' }, { NSW: 'player' }, { NSW: 'player' }];
    const report = computeMutexStabilityIndex(history, []);
    return report.stabilityIndex === 100 && report.volatileRegionIds.length === 0;
  });

  check(results, 'a18_mutex_stability_volatile', 'Mutex stability: flip-flopping region marked volatile', () => {
    const history = [{ NSW: 'a' }, { NSW: 'b' }, { NSW: 'a' }, { NSW: 'b' }];
    const report = computeMutexStabilityIndex(history, []);
    return report.volatileRegionIds.includes('NSW') && report.stabilityIndex < 100;
  });

  check(results, 'a18_mutex_stability_thrash_penalty', 'Mutex stability: thrashing list forces volatile region', () => {
    const report = computeMutexStabilityIndex([{ NSW: 'a' }, { NSW: 'b' }], ['NSW']);
    return report.volatileRegionIds.includes('NSW');
  });

  check(results, 'a18_barrier_stall', 'Workstream barrier: long wait marks stall', () => {
    const ws = [
      {
        id: 'ws1',
        actorIds: ['player', 'mate'],
        taskIds: ['b1'],
        phase: 'waiting_barrier' as const,
        barrierTaskIds: ['b1'],
      },
    ];
    const tasks: TeamTaskSnapshot[] = [
      {
        id: 'b1',
        type: 'preserve_reserve',
        label: 'Reserve',
        status: 'waiting',
        priority: 1,
        assignedActorIds: ['player', 'mate'],
        regionId: null,
        resourceRequirement: 0,
        dependencies: [],
      },
    ];
    const report = evaluateWorkstreamBarriers(10, ws, tasks, {
      workstreamSinceTurn: { ws1: 5 },
      maxBarrierWaitTurns: 2,
    });
    return report.stalledWorkstreamIds.includes('ws1') && report.barrierComplianceScore === 0;
  });

  check(results, 'a18_barrier_track_since', 'Workstream barrier: since-turn tracker resets when phase clears', () => {
    const ws = [
      {
        id: 'ws1',
        actorIds: ['a'],
        taskIds: [],
        phase: 'active' as const,
        barrierTaskIds: [],
      },
    ];
    const tracked = trackWorkstreamBarrierSince({ ws1: 3, ws_old: 1 }, ws, 7);
    return tracked.ws1 === undefined && tracked.ws_old === 1;
  });

  check(results, 'a18_eval_round5_meta', 'Layer: round-5 meta exposes readiness, stability, barrier fields', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.handoffReadinessAverage === 'number' &&
      typeof m.mutexStabilityIndex === 'number' &&
      typeof m.workstreamBarrierCompliance === 'number'
    );
  });

  check(results, 'a18_audit_handoff_not_ready', 'Audit: not-ready handoffs surface warning finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, notReadyHandoffIds: ['h_x'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /not ready/.test(f.message));
  });

  check(results, 'a18_dual_mutex_stability', 'Dual team: combined mutex stability exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return typeof dual.mutexStabilityCombined === 'number';
  });

  check(results, 'a18_role_churn_detect', 'Role churn: primary role change increments churn index', () => {
    const prev = [{ actorId: 'player', primaryRole: 'controller' as const, secondaryRole: null, responsibility: '', reason: '', taskIds: [], startTurn: 1, reviewCondition: '', temporary: false, confidence: 1, explicit: false, exclusiveSlotId: null }];
    const next = [{ ...prev[0], primaryRole: 'explorer' as const }];
    const report = computeRoleChurnIndex(prev, next);
    return report.churnIndex === 100 && report.churnedActorIds.includes('player');
  });

  check(results, 'a18_role_churn_stable', 'Role churn: unchanged roles score zero churn', () => {
    const roles = [{ actorId: 'mate', primaryRole: 'earner' as const, secondaryRole: null, responsibility: '', reason: '', taskIds: [], startTurn: 1, reviewCondition: '', temporary: false, confidence: 1, explicit: false, exclusiveSlotId: null }];
    const report = computeRoleChurnIndex(roles, roles);
    return report.churnIndex === 0 && report.stableActorCount === 1;
  });

  check(results, 'a18_lease_expiry_warn', 'Lease watchdog: near-expiry lease flagged', () => {
    const report = evaluateLeaseExpiry(5, [
      {
        id: 'lease1',
        kind: 'region_exclusive',
        holderActorId: 'player',
        regionId: 'NSW',
        taskId: 't1',
        sinceTurn: 1,
        expiresTurn: 5,
        reason: 'test',
      },
    ]);
    return report.expiringLeaseIds.includes('lease1') && report.leaseHealthScore < 100;
  });

  check(results, 'a18_lease_expired', 'Lease watchdog: expired lease lowers health score', () => {
    const report = evaluateLeaseExpiry(6, [
      {
        id: 'lease_old',
        kind: 'handoff_pending',
        holderActorId: 'mate',
        regionId: null,
        taskId: null,
        sinceTurn: 2,
        expiresTurn: 4,
        reason: 'test',
      },
    ]);
    return report.expiredLeaseIds.includes('lease_old') && report.leaseHealthScore === 0;
  });

  check(results, 'a18_coordination_composite', 'Coordination composite: perfect inputs score 100', () => {
    const report = computeCoordinationComposite({
      handoffSlaCompliance: 100,
      handoffReadinessAverage: 100,
      mutexStabilityIndex: 100,
      workstreamBarrierCompliance: 100,
      capacityBalanceScore: 100,
      leaseHealthScore: 100,
      roleChurnIndex: 0,
    });
    return report.compositeScore === 100;
  });

  check(results, 'a18_coordination_composite_weak', 'Coordination composite: weak SLA surfaces weakest dimension', () => {
    const report = computeCoordinationComposite({
      handoffSlaCompliance: 10,
      handoffReadinessAverage: 100,
      mutexStabilityIndex: 100,
      workstreamBarrierCompliance: 100,
    });
    return report.weakestDimension === 'handoff_sla' && report.compositeScore < 90;
  });

  check(results, 'a18_eval_round6_meta', 'Layer: round-6 meta exposes churn, lease, composite fields', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.roleChurnIndex === 'number' &&
      typeof m.leaseHealthScore === 'number' &&
      typeof m.coordinationCompositeScore === 'number'
    );
  });

  check(results, 'a18_audit_role_churn', 'Audit: high role churn surfaces warning finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, roleChurnIndex: 75, roleChurnActorIds: ['player'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /role churn/.test(f.message));
  });

  check(results, 'a18_dual_round6_combined', 'Dual team: round-6 combined composite and lease health exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.coordinationCompositeCombined === 'number' &&
      typeof dual.leaseHealthCombined === 'number' &&
      typeof dual.roleChurnCombined === 'number'
    );
  });

  check(results, 'a18_directive_collision', 'Directive collision: same region proposals from two actors', () => {
    const report = computeDirectiveCollisionIndex([
      { id: 'd1', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't1', priority: 1 },
      { id: 'd2', actorId: 'b', goalKind: 'defend_region', targetRegionId: 'NSW', taskId: 't2', priority: 2 },
    ]);
    return report.collisionIndex > 0 && report.collidingProposalIds.length === 2;
  });

  check(results, 'a18_directive_collision_none', 'Directive collision: disjoint targets score zero', () => {
    const report = computeDirectiveCollisionIndex([
      { id: 'd1', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't1', priority: 1 },
      { id: 'd2', actorId: 'b', goalKind: 'take_region', targetRegionId: 'VIC', taskId: 't2', priority: 2 },
    ]);
    return report.collisionIndex === 0;
  });

  check(results, 'a18_handoff_integrity_self', 'Handoff integrity: self-handoff lowers score', () => {
    const report = evaluateHandoffChainIntegrity(
      [
        {
          id: 'h_self',
          fromActorId: 'player',
          toActorId: 'player',
          regionId: 'NSW',
          taskId: 't1',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      ['player', 'mate'],
    );
    return report.brokenHandoffIds.includes('h_self') && report.integrityScore < 100;
  });

  check(results, 'a18_handoff_integrity_dup', 'Handoff integrity: duplicate pending task flagged', () => {
    const handoff = {
      fromActorId: 'player',
      toActorId: 'mate',
      regionId: 'NSW',
      taskId: 't_dup',
      status: 'pending' as const,
      requestedTurn: 1,
      reason: 'test',
    };
    const report = evaluateHandoffChainIntegrity(
      [
        { ...handoff, id: 'h1' },
        { ...handoff, id: 'h2', fromActorId: 'mate', toActorId: 'player' },
      ],
      ['player', 'mate'],
    );
    return report.duplicatePendingTaskIds.includes('t_dup');
  });

  check(results, 'a18_escalation_critical', 'Escalation tier: audit errors force critical tier', () => {
    const report = computeCoordinationEscalationTier({
      coordinationCompositeScore: 90,
      auditErrors: 1,
      auditWarnings: 0,
    });
    return report.tier === 3 && report.label === 'critical';
  });

  check(results, 'a18_escalation_nominal', 'Escalation tier: healthy team stays nominal', () => {
    const report = computeCoordinationEscalationTier({
      coordinationCompositeScore: 92,
      auditErrors: 0,
      auditWarnings: 0,
      directiveCollisionIndex: 0,
      handoffIntegrityScore: 100,
    });
    return report.tier === 0;
  });

  check(results, 'a18_eval_round7_meta', 'Layer: round-7 meta exposes collision, integrity, escalation', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.directiveCollisionIndex === 'number' &&
      typeof m.handoffIntegrityScore === 'number' &&
      typeof m.coordinationEscalationTier === 'number'
    );
  });

  check(results, 'a18_audit_escalation', 'Audit: critical escalation tier surfaces error finding', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, coordinationEscalationTier: 3, coordinationEscalationLabel: 'critical' },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'error' && /escalation critical/.test(f.message));
  });

  check(results, 'a18_dual_round7_combined', 'Dual team: round-7 combined collision, integrity, escalation exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.directiveCollisionCombined === 'number' &&
      typeof dual.handoffIntegrityCombined === 'number' &&
      typeof dual.escalationTierCombined === 'number'
    );
  });

  check(results, 'a18_recovery_playbook_critical', 'Recovery playbook: critical tier yields halt actions', () => {
    const report = buildCoordinationRecoveryPlaybook({
      escalationTier: 3,
      coordinationCompositeScore: 40,
      coordinationWeakestDimension: 'mutexStability',
      directiveCollisionIndex: 60,
      handoffIntegrityScore: 40,
    });
    return report.recoveryUrgency >= 75 && report.recommendedActions.includes('halt_noncritical_directives');
  });

  check(results, 'a18_recovery_playbook_nominal', 'Recovery playbook: nominal tier stays low urgency', () => {
    const report = buildCoordinationRecoveryPlaybook({
      escalationTier: 0,
      coordinationCompositeScore: 92,
      directiveCollisionIndex: 0,
      handoffIntegrityScore: 100,
    });
    return report.recoveryUrgency < 40;
  });

  check(results, 'a18_priority_inversion_detect', 'Priority inversion: suppressed higher priority than allowed peer', () => {
    const proposals = [
      { id: 'd_hi', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 1 },
      { id: 'd_lo', actorId: 'b', goalKind: 'defend_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 4 },
    ];
    const report = computeDirectivePriorityInversion(proposals, ['d_hi', 'd_lo'], {
      allowed: [proposals[1]],
      suppressed: [proposals[0]],
    });
    return report.inversionIndex > 0 && report.invertedProposalIds.includes('d_hi');
  });

  check(results, 'a18_priority_inversion_none', 'Priority inversion: aligned allow/suppress scores zero', () => {
    const proposals = [
      { id: 'd_hi', actorId: 'a', goalKind: 'take_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 1 },
      { id: 'd_lo', actorId: 'b', goalKind: 'defend_region', targetRegionId: 'NSW', taskId: 't_shared', priority: 4 },
    ];
    const report = computeDirectivePriorityInversion(proposals, ['d_hi', 'd_lo'], {
      allowed: [proposals[0]],
      suppressed: [proposals[1]],
    });
    return report.inversionIndex === 0;
  });

  check(results, 'a18_handoff_orphan_detect', 'Handoff orphan: target not assigned to task', () => {
    const report = detectHandoffOrphans(
      [
        {
          id: 'h_orphan',
          fromActorId: 'player',
          toActorId: 'mate',
          regionId: 'NSW',
          taskId: 'task_defend_NSW',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      baseInputs().tasks,
      [{ actorId: 'player', primaryRole: 'controller', responsibility: 'lead', taskIds: ['task_defend_NSW'], lockedUntilTurn: null }],
    );
    return report.orphanCount === 1 && report.orphanHandoffIds.includes('h_orphan');
  });

  check(results, 'a18_eval_round8_meta', 'Layer: round-8 meta exposes recovery, inversion, orphan signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.coordinationRecoveryUrgency === 'number' &&
      typeof m.directivePriorityInversionIndex === 'number' &&
      typeof m.handoffOrphanCount === 'number'
    );
  });

  check(results, 'a18_audit_recovery_urgency', 'Audit: high recovery urgency surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, coordinationRecoveryUrgency: 90 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /recovery urgency/.test(f.message));
  });

  check(results, 'a18_dual_round8_combined', 'Dual team: round-8 combined recovery, inversion, orphan exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.recoveryUrgencyCombined === 'number' &&
      typeof dual.priorityInversionCombined === 'number' &&
      typeof dual.handoffOrphanCombined === 'number'
    );
  });

  check(results, 'a18_workstream_deadlock_cycle', 'Workstream deadlock: mutual barrier dependency detected', () => {
    const report = detectWorkstreamDeadlocks([
      {
        id: 'ws_a',
        actorIds: ['a'],
        taskIds: ['task_a'],
        phase: 'waiting_barrier',
        barrierTaskIds: ['task_b'],
      },
      {
        id: 'ws_b',
        actorIds: ['b'],
        taskIds: ['task_b'],
        phase: 'waiting_barrier',
        barrierTaskIds: ['task_a'],
      },
    ]);
    return report.deadlockCount >= 2 && report.deadlockedWorkstreamIds.includes('ws_a');
  });

  check(results, 'a18_workstream_deadlock_none', 'Workstream deadlock: independent streams score zero', () => {
    const report = detectWorkstreamDeadlocks([
      {
        id: 'ws_a',
        actorIds: ['a'],
        taskIds: ['task_a'],
        phase: 'active',
        barrierTaskIds: [],
      },
    ]);
    return report.deadlockCount === 0;
  });

  check(results, 'a18_lease_contention_mutex', 'Lease contention: pending handoff vs mutex holder', () => {
    const report = computeLeaseContentionIndex(
      [],
      [
        {
          id: 'h1',
          fromActorId: 'a',
          toActorId: 'mate',
          regionId: 'NSW',
          taskId: 't1',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      { NSW: 'player' },
    );
    return report.contentionIndex > 0 && report.contendedRegionIds.includes('NSW');
  });

  check(results, 'a18_lease_contention_clear', 'Lease contention: aligned handoff scores zero', () => {
    const report = computeLeaseContentionIndex(
      [],
      [
        {
          id: 'h1',
          fromActorId: 'a',
          toActorId: 'player',
          regionId: 'NSW',
          taskId: 't1',
          status: 'pending',
          requestedTurn: 1,
          reason: 'test',
        },
      ],
      { NSW: 'player' },
    );
    return report.contentionIndex === 0;
  });

  check(results, 'a18_coordination_saturation_high', 'Coordination saturation: near-limit load scores high', () => {
    const report = measureCoordinationSaturation({
      directiveProposalCount: 8,
      pendingHandoffCount: 6,
      activeLeaseCount: 12,
      activeWorkstreamCount: 4,
      suppressedDirectiveCount: 4,
    });
    return report.saturationIndex >= 75;
  });

  check(results, 'a18_coordination_saturation_low', 'Coordination saturation: light load stays low', () => {
    const report = measureCoordinationSaturation({
      directiveProposalCount: 1,
      pendingHandoffCount: 0,
      activeLeaseCount: 1,
      activeWorkstreamCount: 1,
    });
    return report.saturationIndex < 40;
  });

  check(results, 'a18_eval_round9_meta', 'Layer: round-9 meta exposes deadlock, contention, saturation signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.workstreamDeadlockCount === 'number' &&
      typeof m.leaseContentionIndex === 'number' &&
      typeof m.coordinationSaturationIndex === 'number'
    );
  });

  check(results, 'a18_audit_workstream_deadlock', 'Audit: workstream deadlock surfaces error', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, workstreamDeadlockCount: 2, deadlockedWorkstreamIds: ['ws_a', 'ws_b'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'error' && /deadlock/.test(f.message));
  });

  check(results, 'a18_dual_round9_combined', 'Dual team: round-9 combined deadlock, contention, saturation exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.workstreamDeadlockCombined === 'number' &&
      typeof dual.leaseContentionCombined === 'number' &&
      typeof dual.coordinationSaturationCombined === 'number'
    );
  });

  check(results, 'a18_mutex_lease_divergence_detect', 'Mutex/lease divergence: holder mismatch flagged', () => {
    const report = computeMutexLeaseDivergenceIndex(
      { NSW: 'player' },
      [
        {
          id: 'lease_nsw',
          kind: 'region_exclusive',
          holderActorId: 'mate',
          regionId: 'NSW',
          taskId: 't1',
          sinceTurn: 1,
          expiresTurn: 5,
          reason: 'test',
        },
      ],
    );
    return report.divergenceIndex > 0 && report.divergentRegionIds.includes('NSW');
  });

  check(results, 'a18_mutex_lease_divergence_aligned', 'Mutex/lease divergence: aligned holders score zero', () => {
    const report = computeMutexLeaseDivergenceIndex(
      { NSW: 'player' },
      [
        {
          id: 'lease_nsw',
          kind: 'region_exclusive',
          holderActorId: 'player',
          regionId: 'NSW',
          taskId: 't1',
          sinceTurn: 1,
          expiresTurn: 5,
          reason: 'test',
        },
      ],
    );
    return report.divergenceIndex === 0;
  });

  check(results, 'a18_handoff_cascade_chain', 'Handoff cascade: long pending chain raises risk', () => {
    const report = analyzeHandoffCascadeRisk([
      {
        id: 'h1',
        fromActorId: 'a',
        toActorId: 'b',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
      {
        id: 'h2',
        fromActorId: 'b',
        toActorId: 'c',
        regionId: 'VIC',
        taskId: 't2',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
      {
        id: 'h3',
        fromActorId: 'c',
        toActorId: 'd',
        regionId: 'QLD',
        taskId: 't3',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
    ]);
    return report.cascadeRiskIndex >= 55 && report.cascadeChainActorIds.length >= 3;
  });

  check(results, 'a18_handoff_cascade_none', 'Handoff cascade: single hop stays low risk', () => {
    const report = analyzeHandoffCascadeRisk([
      {
        id: 'h1',
        fromActorId: 'a',
        toActorId: 'b',
        regionId: 'NSW',
        taskId: 't1',
        status: 'pending',
        requestedTurn: 1,
        reason: 'test',
      },
    ]);
    return report.cascadeRiskIndex < 30;
  });

  check(results, 'a18_suppression_backlog_high', 'Suppression backlog: near-cap load scores high', () => {
    const report = computeSuppressionBacklogIndex({
      suppressedDirectiveIds: Array.from({ length: 20 }, (_, i) => `d_${i}`),
      droppedDirectiveCount: 4,
      quotaExhaustedActorIds: ['a', 'b', 'c'],
    });
    return report.backlogIndex >= 70;
  });

  check(results, 'a18_suppression_backlog_low', 'Suppression backlog: light load stays low', () => {
    const report = computeSuppressionBacklogIndex({
      suppressedDirectiveIds: ['d1'],
      droppedDirectiveCount: 0,
      quotaExhaustedActorIds: [],
    });
    return report.backlogIndex < 40;
  });

  check(results, 'a18_eval_round10_meta', 'Layer: round-10 meta exposes divergence, cascade, backlog signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.mutexLeaseDivergenceIndex === 'number' &&
      typeof m.handoffCascadeRiskIndex === 'number' &&
      typeof m.suppressionBacklogIndex === 'number'
    );
  });

  check(results, 'a18_audit_suppression_backlog', 'Audit: high suppression backlog surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, suppressionBacklogIndex: 85 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /suppression backlog/.test(f.message));
  });

  check(results, 'a18_dual_round10_combined', 'Dual team: round-10 combined divergence, cascade, backlog exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.mutexLeaseDivergenceCombined === 'number' &&
      typeof dual.handoffCascadeRiskCombined === 'number' &&
      typeof dual.suppressionBacklogCombined === 'number'
    );
  });

  check(results, 'a18_reconcile_drift_unstable', 'Reconcile drift: unstable plan scores high', () => {
    const report = computeReconcileDriftIndex(
      { turn: 2, stable: false, changes: [{ kind: 'lease_added', regionId: 'NSW', detail: 'l1' }, { kind: 'handoff_closed', regionId: null, detail: 'h1' }], thrashingRegions: ['NSW'] },
      1,
    );
    return report.driftIndex >= 50;
  });

  check(results, 'a18_reconcile_drift_stable', 'Reconcile drift: stable empty plan stays low', () => {
    const report = computeReconcileDriftIndex(
      { turn: 2, stable: true, changes: [], thrashingRegions: [] },
      0,
    );
    return report.driftIndex < 20;
  });

  check(results, 'a18_arbitration_pressure_demotions', 'Arbitration pressure: demotions raise index', () => {
    const report = computeArbitrationPressureIndex([
      {
        regionId: 'NSW',
        winnerActorId: 'player',
        winnerTaskId: 't1',
        reason: 'priority',
        demoted: [
          { actorId: 'mate', taskId: 't2', reason: 'lower tier' },
          { actorId: 'scout', taskId: 't3', reason: 'lower tier' },
          { actorId: 'earner', taskId: 't4', reason: 'lower tier' },
        ],
      },
    ]);
    return report.pressureIndex >= 45 && report.demotedActorIds.includes('mate');
  });

  check(results, 'a18_arbitration_pressure_clear', 'Arbitration pressure: empty log scores zero', () => {
    const report = computeArbitrationPressureIndex([]);
    return report.pressureIndex === 0;
  });

  check(results, 'a18_persistence_churn_blocked', 'Persistence churn: blocked commit raises index', () => {
    const first = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const second = evaluateTeamMultiAgentLayer(baseInputs({ turn: 3 }), first.state);
    const decision = {
      commit: false,
      reason: 'commit cap (8/turn)',
      signature: teamMultiAgentPersistSignature(second.state),
    };
    const report = measurePersistenceChurn(first.state, second.state, decision);
    return report.churnIndex >= 60;
  });

  check(results, 'a18_persistence_churn_initial', 'Persistence churn: first material state moderate', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const decision = decideTeamMultiAgentPersistence(null, ev.state, null, 0);
    const report = measurePersistenceChurn(null, ev.state, decision);
    return report.churnIndex >= 0 && report.churnIndex <= 100;
  });

  check(results, 'a18_eval_round11_meta', 'Layer: round-11 meta exposes drift, arbitration, churn signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.reconcileDriftIndex === 'number' &&
      typeof m.arbitrationPressureIndex === 'number' &&
      typeof m.persistenceChurnIndex === 'number'
    );
  });

  check(results, 'a18_audit_reconcile_drift', 'Audit: high reconcile drift surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, reconcileDriftIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /reconcile drift/.test(f.message));
  });

  check(results, 'a18_dual_round11_combined', 'Dual team: round-11 combined drift, arbitration, churn exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.reconcileDriftCombined === 'number' &&
      typeof dual.arbitrationPressureCombined === 'number' &&
      typeof dual.persistenceChurnCombined === 'number'
    );
  });

  check(results, 'a18_duplicate_guard_pressure_high', 'Duplicate guard pressure: near-cap reservations score high', () => {
    const reservations: Record<string, { holderActorId: string; taskId: string; turn: number }> = {};
    for (let i = 0; i < 24; i += 1) {
      reservations[`key_${i}`] = { holderActorId: 'player', taskId: `t_${i}`, turn: 1 };
    }
    const report = measureDuplicateGuardPressure({
      version: 1,
      committedKeys: Array.from({ length: 40 }, (_, i) => `c_${i}`),
      generationByActor: { player: 1 },
      turn: 1,
      reservations,
    });
    return report.pressureIndex >= 70;
  });

  check(results, 'a18_duplicate_guard_pressure_low', 'Duplicate guard pressure: empty guard stays low', () => {
    const report = measureDuplicateGuardPressure(emptyGuard(1));
    return report.pressureIndex < 30;
  });

  check(results, 'a18_role_task_coverage_gap', 'Role/task coverage: assigned task missing from roles flagged', () => {
    const tasks = baseInputs().tasks;
    const report = computeRoleTaskCoverageGap(
      [{ actorId: 'player', primaryRole: 'controller', responsibility: 'lead', taskIds: [], lockedUntilTurn: null }],
      tasks,
    );
    return report.gapIndex > 0 && report.uncoveredTaskIds.length > 0;
  });

  check(results, 'a18_role_task_coverage_full', 'Role/task coverage: linked roles score zero gap', () => {
    const tasks = baseInputs().tasks;
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const report = computeRoleTaskCoverageGap(ev.state.roles, tasks);
    return report.gapIndex === 0;
  });

  check(results, 'a18_composite_health_declining', 'Composite gradient: sharp decline scores high', () => {
    const report = computeCompositeHealthGradient(90, 70);
    return report.trend === 'declining' && report.gradientIndex >= 40;
  });

  check(results, 'a18_composite_health_improving', 'Composite gradient: improvement trends up', () => {
    const report = computeCompositeHealthGradient(60, 72);
    return report.trend === 'improving' && report.gradientIndex === 0;
  });

  check(results, 'a18_eval_round12_meta', 'Layer: round-12 meta exposes guard, coverage, gradient signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.duplicateGuardPressureIndex === 'number' &&
      typeof m.roleTaskCoverageGapIndex === 'number' &&
      typeof m.compositeHealthGradientIndex === 'number'
    );
  });

  check(results, 'a18_audit_role_coverage_gap', 'Audit: high role/task gap surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, roleTaskCoverageGapIndex: 65 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /coverage gap/.test(f.message));
  });

  check(results, 'a18_dual_round12_combined', 'Dual team: round-12 combined guard, coverage, gradient exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.duplicateGuardPressureCombined === 'number' &&
      typeof dual.roleTaskCoverageGapCombined === 'number' &&
      typeof dual.compositeHealthGradientCombined === 'number'
    );
  });

  check(results, 'a18_handoff_readiness_spread', 'Handoff readiness spread: uneven scores raise index', () => {
    const report = computeHandoffReadinessSpread({
      rows: [
        { handoffId: 'h1', toActorId: 'mate', readinessScore: 95, blockers: [], ready: true },
        { handoffId: 'h2', toActorId: 'player', readinessScore: 25, blockers: ['low_ap'], ready: false },
      ],
      averageReadiness: 60,
      notReadyHandoffIds: ['h2'],
      notes: [],
    });
    return report.spreadIndex >= 45;
  });

  check(results, 'a18_handoff_readiness_spread_none', 'Handoff readiness spread: single pending stays zero', () => {
    const readiness = scoreHandoffReadiness([], baseInputs().actors, [], baseInputs().tasks);
    const report = computeHandoffReadinessSpread(readiness);
    return report.spreadIndex === 0;
  });

  check(results, 'a18_workstream_parallelism_high', 'Workstream parallelism: saturated cap scores high', () => {
    const report = measureWorkstreamParallelism([
      { id: 'ws1', actorIds: ['a'], taskIds: ['t1'], phase: 'active', barrierTaskIds: [] },
      { id: 'ws2', actorIds: ['b'], taskIds: ['t2'], phase: 'active', barrierTaskIds: [] },
      { id: 'ws3', actorIds: ['c'], taskIds: ['t3'], phase: 'waiting_barrier', barrierTaskIds: ['t4'] },
      { id: 'ws4', actorIds: ['d'], taskIds: ['t5'], phase: 'waiting_barrier', barrierTaskIds: ['t6'] },
    ]);
    return report.parallelismIndex >= 75;
  });

  check(results, 'a18_escalation_recovery_misaligned', 'Escalation/recovery alignment: tier/urgency mismatch scores high', () => {
    const report = computeEscalationRecoveryAlignment(3, 15);
    return report.alignmentIndex >= 50;
  });

  check(results, 'a18_escalation_recovery_aligned', 'Escalation/recovery alignment: matched tier/urgency stays low', () => {
    const report = computeEscalationRecoveryAlignment(1, 32);
    return report.alignmentIndex < 30;
  });

  check(results, 'a18_eval_round13_meta', 'Layer: round-13 meta exposes spread, parallelism, alignment signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.handoffReadinessSpreadIndex === 'number' &&
      typeof m.workstreamParallelismIndex === 'number' &&
      typeof m.escalationRecoveryAlignmentIndex === 'number'
    );
  });

  check(results, 'a18_audit_escalation_alignment', 'Audit: escalation/recovery misalignment surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, escalationRecoveryAlignmentIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /misalignment/.test(f.message));
  });

  check(results, 'a18_dual_round13_combined', 'Dual team: round-13 combined spread, parallelism, alignment exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.handoffReadinessSpreadCombined === 'number' &&
      typeof dual.workstreamParallelismCombined === 'number' &&
      typeof dual.escalationRecoveryAlignmentCombined === 'number'
    );
  });

  check(results, 'a18_audit_pressure_errors', 'Audit pressure: errors and warnings aggregate', () => {
    const report = computeAuditPressureIndex([
      { id: 'e1', severity: 'error', message: 'x', actorIds: [], regionId: null },
      { id: 'w1', severity: 'warning', message: 'y', actorIds: [], regionId: null },
      { id: 'w2', severity: 'warning', message: 'z', actorIds: [], regionId: null },
    ]);
    return report.pressureIndex >= 45;
  });

  check(results, 'a18_role_lock_friction', 'Role lock friction: locked roles raise index', () => {
    const report = computeRoleLockFrictionIndex(2, [
      { actorId: 'player', primaryRole: 'controller', responsibility: 'lead', taskIds: ['t1'], lockedUntilTurn: 5 },
      { actorId: 'mate', primaryRole: 'support', responsibility: 'assist', taskIds: ['t2'], lockedUntilTurn: 4 },
    ]);
    return report.frictionIndex >= 55 && report.lockedRoleActorIds.includes('player');
  });

  check(results, 'a18_directive_constraint_density', 'Directive constraint density: constrained actors score high', () => {
    const report = computeDirectiveConstraintDensity({
      player: 'mutex:NSW',
      mate: 'handoff_pending',
      scout: 'barrier',
    });
    return report.densityIndex >= 60 && report.constrainedActorIds.length === 3;
  });

  check(results, 'a18_directive_constraint_sparse', 'Directive constraint density: empty map stays low', () => {
    const report = computeDirectiveConstraintDensity({});
    return report.densityIndex < 20;
  });

  check(results, 'a18_eval_round14_meta', 'Layer: round-14 meta exposes audit, lock, constraint signals', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.auditPressureIndex === 'number' &&
      typeof m.roleLockFrictionIndex === 'number' &&
      typeof m.directiveConstraintDensityIndex === 'number'
    );
  });

  check(results, 'a18_audit_role_lock_friction', 'Audit: high role lock friction surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = {
      ...ev.state,
      meta: { ...ev.state.meta, roleLockFrictionIndex: 70, lockedRoleActorIds: ['player'] },
    };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /lock friction/.test(f.message));
  });

  check(results, 'a18_dual_round14_combined', 'Dual team: round-14 combined audit, lock, constraint exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.auditPressureCombined === 'number' &&
      typeof dual.roleLockFrictionCombined === 'number' &&
      typeof dual.directiveConstraintDensityCombined === 'number'
    );
  });

  check(results, 'a18_cross_team_rejection', 'Cross-team rejection: rejected proposals raise index', () => {
    const report = computeCrossTeamRejectionIndex(2, 5);
    return report.rejectionIndex >= 40;
  });

  check(results, 'a18_handoff_sla_velocity', 'Handoff SLA velocity: overdue pending share scores high', () => {
    const report = computeHandoffSlaVelocityIndex(4, ['h1', 'h2', 'h3']);
    return report.velocityIndex >= 50;
  });

  check(results, 'a18_handoff_sla_velocity_clear', 'Handoff SLA velocity: no pending stays zero', () => {
    const report = computeHandoffSlaVelocityIndex(0, ['h1']);
    return report.velocityIndex === 0;
  });

  check(results, 'a18_recovery_action_breadth_gap', 'Recovery breadth: tier shortfall scores gap', () => {
    const report = measureRecoveryActionBreadth(3, ['halt_noncritical_directives']);
    return report.breadthGapIndex >= 45;
  });

  check(results, 'a18_recovery_action_breadth_ok', 'Recovery breadth: adequate actions stay low gap', () => {
    const report = measureRecoveryActionBreadth(
      2,
      ['a', 'b', 'c', 'd', 'e'].map(x => `action_${x}`),
    );
    return report.breadthGapIndex < 30;
  });

  check(results, 'a18_eval_round15_meta', 'Layer: round-15 meta exposes rejection, SLA velocity, recovery breadth', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.crossTeamRejectionIndex === 'number' &&
      typeof m.handoffSlaVelocityIndex === 'number' &&
      typeof m.recoveryActionBreadthIndex === 'number'
    );
  });

  check(results, 'a18_audit_handoff_sla_velocity', 'Audit: handoff SLA velocity stress surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, handoffSlaVelocityIndex: 80 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /SLA velocity/.test(f.message));
  });

  check(results, 'a18_dual_round15_combined', 'Dual team: round-15 combined rejection, velocity, breadth exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.crossTeamRejectionCombined === 'number' &&
      typeof dual.handoffSlaVelocityCombined === 'number' &&
      typeof dual.recoveryActionBreadthCombined === 'number'
    );
  });

  check(results, 'a18_directive_quota_exhaustion', 'Directive quota exhaustion: drops and exhausted actors score high', () => {
    const report = computeDirectiveQuotaExhaustionIndex(3, ['a1', 'a2']);
    return report.exhaustionIndex >= 42;
  });

  check(results, 'a18_directive_quota_exhaustion_clear', 'Directive quota exhaustion: no drops stays low', () => {
    const report = computeDirectiveQuotaExhaustionIndex(0, []);
    return report.exhaustionIndex === 0;
  });

  check(results, 'a18_capacity_imbalance', 'Capacity imbalance: overload plus idle raises index', () => {
    const report = computeCapacityImbalanceIndex(40, ['a1', 'a2'], ['a3']);
    return report.imbalanceIndex >= 48;
  });

  check(results, 'a18_workstream_barrier_staleness', 'Barrier staleness: stalled workstreams beyond cap score high', () => {
    const report = computeWorkstreamBarrierStalenessIndex(10, { ws1: 5 }, ['ws1']);
    return report.stalenessIndex >= 50;
  });

  check(results, 'a18_eval_round16_meta', 'Layer: round-16 meta exposes quota, capacity, barrier staleness', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.directiveQuotaExhaustionIndex === 'number' &&
      typeof m.capacityImbalanceIndex === 'number' &&
      typeof m.workstreamBarrierStalenessIndex === 'number'
    );
  });

  check(results, 'a18_audit_capacity_imbalance', 'Audit: capacity imbalance surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, capacityImbalanceIndex: 70 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /capacity imbalance/.test(f.message));
  });

  check(results, 'a18_dual_round16_combined', 'Dual team: round-16 combined quota, capacity, staleness exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.directiveQuotaExhaustionCombined === 'number' &&
      typeof dual.capacityImbalanceCombined === 'number' &&
      typeof dual.workstreamBarrierStalenessCombined === 'number'
    );
  });

  check(results, 'a18_workstream_deadlock_pressure', 'Deadlock pressure: deadlocks under parallelism score high', () => {
    const report = computeWorkstreamDeadlockPressureIndex(2, ['ws1', 'ws2'], 70);
    return report.pressureIndex >= 45;
  });

  check(results, 'a18_workstream_deadlock_pressure_clear', 'Deadlock pressure: no deadlocks stays low', () => {
    const report = computeWorkstreamDeadlockPressureIndex(0, [], 80);
    return report.pressureIndex === 0;
  });

  check(results, 'a18_suppression_quota_coupling', 'Suppression–quota coupling: dual elevation scores high', () => {
    const report = computeSuppressionQuotaCouplingIndex(55, 50, 2);
    return report.couplingIndex >= 44;
  });

  check(results, 'a18_handoff_lease_overlap', 'Handoff–lease overlap: overlapping pending handoffs score high', () => {
    const report = computeHandoffLeaseOverlapIndex(2, 3, 1, 1);
    return report.overlapIndex >= 46;
  });

  check(results, 'a18_eval_round17_meta', 'Layer: round-17 meta exposes deadlock pressure, coupling, overlap', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.workstreamDeadlockPressureIndex === 'number' &&
      typeof m.suppressionQuotaCouplingIndex === 'number' &&
      typeof m.handoffLeaseOverlapIndex === 'number'
    );
  });

  check(results, 'a18_audit_suppression_quota_coupling', 'Audit: suppression–quota coupling surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, suppressionQuotaCouplingIndex: 70 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Suppression–quota coupling/.test(f.message));
  });

  check(results, 'a18_dual_round17_combined', 'Dual team: round-17 combined deadlock, coupling, overlap exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.workstreamDeadlockPressureCombined === 'number' &&
      typeof dual.suppressionQuotaCouplingCombined === 'number' &&
      typeof dual.handoffLeaseOverlapCombined === 'number'
    );
  });

  check(results, 'a18_saturation_deadlock_coupling', 'Saturation–deadlock coupling: dual elevation scores high', () => {
    const report = computeSaturationDeadlockCouplingIndex(55, 48, 2);
    return report.couplingIndex >= 45;
  });

  check(results, 'a18_cascade_lease_convergence', 'Cascade–lease convergence: cascade plus overlap scores high', () => {
    const report = computeCascadeLeaseConvergenceIndex(50, 48, 2);
    return report.convergenceIndex >= 47;
  });

  check(results, 'a18_gradient_audit_tension', 'Gradient–audit tension: declining gradient under audit pressure', () => {
    const report = computeGradientAuditTensionIndex(45, 'declining', 42);
    return report.tensionIndex >= 46;
  });

  check(results, 'a18_eval_round18_meta', 'Layer: round-18 meta exposes saturation coupling, cascade convergence, gradient tension', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.saturationDeadlockCouplingIndex === 'number' &&
      typeof m.cascadeLeaseConvergenceIndex === 'number' &&
      typeof m.gradientAuditTensionIndex === 'number'
    );
  });

  check(results, 'a18_audit_cascade_lease_convergence', 'Audit: cascade–lease convergence surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, cascadeLeaseConvergenceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Cascade–lease convergence/.test(f.message));
  });

  check(results, 'a18_dual_round18_combined', 'Dual team: round-18 combined coupling, convergence, tension exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.saturationDeadlockCouplingCombined === 'number' &&
      typeof dual.cascadeLeaseConvergenceCombined === 'number' &&
      typeof dual.gradientAuditTensionCombined === 'number'
    );
  });

  check(results, 'a18_escalation_saturation_stack', 'Escalation–saturation stack: tier plus coupling scores high', () => {
    const report = computeEscalationSaturationStackIndex(3, 50, 55);
    return report.stackIndex >= 48;
  });

  check(results, 'a18_recovery_cascade_mismatch', 'Recovery–cascade mismatch: breadth gap plus convergence scores high', () => {
    const report = computeRecoveryCascadeMismatchIndex(45, 48, 3);
    return report.mismatchIndex >= 47;
  });

  check(results, 'a18_persistence_gradient_friction', 'Persistence–gradient friction: churn under tension scores high', () => {
    const report = computePersistenceGradientFrictionIndex(44, 46, 'declining');
    return report.frictionIndex >= 46;
  });

  check(results, 'a18_eval_round19_meta', 'Layer: round-19 meta exposes escalation stack, recovery mismatch, persistence friction', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.escalationSaturationStackIndex === 'number' &&
      typeof m.recoveryCascadeMismatchIndex === 'number' &&
      typeof m.persistenceGradientFrictionIndex === 'number'
    );
  });

  check(results, 'a18_audit_escalation_saturation_stack', 'Audit: escalation–saturation stack surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, escalationSaturationStackIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Escalation–saturation stack/.test(f.message));
  });

  check(results, 'a18_dual_round19_combined', 'Dual team: round-19 combined stack, mismatch, friction exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.escalationSaturationStackCombined === 'number' &&
      typeof dual.recoveryCascadeMismatchCombined === 'number' &&
      typeof dual.persistenceGradientFrictionCombined === 'number'
    );
  });

  check(results, 'a18_stack_mismatch_coupling', 'Stack–mismatch coupling: stack plus mismatch scores high', () => {
    const report = computeStackMismatchCouplingIndex(50, 48, 3);
    return report.couplingIndex >= 48;
  });

  check(results, 'a18_audit_stack_amplification', 'Audit–stack amplification: audit plus stack scores high', () => {
    const report = computeAuditStackAmplificationIndex(45, 48, 44);
    return report.amplificationIndex >= 47;
  });

  check(results, 'a18_friction_alignment_gap', 'Friction–alignment gap: friction with weak alignment scores high', () => {
    const report = computeFrictionAlignmentGapIndex(46, 30, 40);
    return report.gapIndex >= 46;
  });

  check(results, 'a18_eval_round20_meta', 'Layer: round-20 meta exposes stack coupling, audit amplification, friction gap', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.stackMismatchCouplingIndex === 'number' &&
      typeof m.auditStackAmplificationIndex === 'number' &&
      typeof m.frictionAlignmentGapIndex === 'number'
    );
  });

  check(results, 'a18_audit_stack_mismatch_coupling', 'Audit: stack–mismatch coupling surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, stackMismatchCouplingIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Stack–mismatch coupling/.test(f.message));
  });

  check(results, 'a18_dual_round20_combined', 'Dual team: round-20 combined coupling, amplification, gap exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.stackMismatchCouplingCombined === 'number' &&
      typeof dual.auditStackAmplificationCombined === 'number' &&
      typeof dual.frictionAlignmentGapCombined === 'number'
    );
  });

  check(results, 'a18_coupling_amplification_fusion', 'Coupling–amplification fusion: dual elevation scores high', () => {
    const report = computeCouplingAmplificationFusionIndex(50, 48, 42);
    return report.fusionIndex >= 48;
  });

  check(results, 'a18_gap_churn_resonance', 'Gap–churn resonance: gap plus churn scores high', () => {
    const report = computeGapChurnResonanceIndex(46, 42, 44);
    return report.resonanceIndex >= 47;
  });

  check(results, 'a18_stack_friction_convergence', 'Stack–friction convergence: coupling plus gap under weak composite', () => {
    const report = computeStackFrictionConvergenceIndex(48, 46, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round21_meta', 'Layer: round-21 meta exposes fusion, resonance, convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.couplingAmplificationFusionIndex === 'number' &&
      typeof m.gapChurnResonanceIndex === 'number' &&
      typeof m.stackFrictionConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_coupling_amplification_fusion', 'Audit: coupling–amplification fusion surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, couplingAmplificationFusionIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Coupling–amplification fusion/.test(f.message));
  });

  check(results, 'a18_dual_round21_combined', 'Dual team: round-21 combined fusion, resonance, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.couplingAmplificationFusionCombined === 'number' &&
      typeof dual.gapChurnResonanceCombined === 'number' &&
      typeof dual.stackFrictionConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_fusion_resonance_coupling', 'Fusion–resonance coupling: fusion plus resonance scores high', () => {
    const report = computeFusionResonanceCouplingIndex(50, 48, 40);
    return report.couplingIndex >= 48;
  });

  check(results, 'a18_convergence_fusion_stack', 'Convergence–fusion stack: convergence plus fusion scores high', () => {
    const report = computeConvergenceFusionStackIndex(48, 50, 3);
    return report.stackIndex >= 47;
  });

  check(results, 'a18_resonance_audit_cascade', 'Resonance–audit cascade: resonance plus audit amplification scores high', () => {
    const report = computeResonanceAuditCascadeIndex(46, 48, 42);
    return report.cascadeIndex >= 46;
  });

  check(results, 'a18_eval_round22_meta', 'Layer: round-22 meta exposes fusion coupling, convergence stack, audit cascade', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionResonanceCouplingIndex === 'number' &&
      typeof m.convergenceFusionStackIndex === 'number' &&
      typeof m.resonanceAuditCascadeIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_resonance_coupling', 'Audit: fusion–resonance coupling surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionResonanceCouplingIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–resonance coupling/.test(f.message));
  });

  check(results, 'a18_dual_round22_combined', 'Dual team: round-22 combined coupling, stack, cascade exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionResonanceCouplingCombined === 'number' &&
      typeof dual.convergenceFusionStackCombined === 'number' &&
      typeof dual.resonanceAuditCascadeCombined === 'number'
    );
  });

  check(results, 'a18_coupling_stack_cascade', 'Coupling–stack cascade: fusion coupling plus convergence stack scores high', () => {
    const report = computeCouplingStackCascadeIndex(50, 48, 3);
    return report.cascadeIndex >= 48;
  });

  check(results, 'a18_stack_cascade_amplification', 'Stack–cascade amplification: stack plus audit cascade scores high', () => {
    const report = computeStackCascadeAmplificationIndex(48, 46, 42);
    return report.amplificationIndex >= 47;
  });

  check(results, 'a18_cascade_coupling_synthesis', 'Cascade–coupling synthesis: audit cascade plus fusion coupling scores high', () => {
    const report = computeCascadeCouplingSynthesisIndex(48, 50, 48);
    return report.synthesisIndex >= 46;
  });

  check(results, 'a18_eval_round23_meta', 'Layer: round-23 meta exposes stack cascade, amplification, synthesis', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.couplingStackCascadeIndex === 'number' &&
      typeof m.stackCascadeAmplificationIndex === 'number' &&
      typeof m.cascadeCouplingSynthesisIndex === 'number'
    );
  });

  check(results, 'a18_audit_coupling_stack_cascade', 'Audit: coupling–stack cascade surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, couplingStackCascadeIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Coupling–stack cascade/.test(f.message));
  });

  check(results, 'a18_dual_round23_combined', 'Dual team: round-23 combined cascade, amplification, synthesis exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.couplingStackCascadeCombined === 'number' &&
      typeof dual.stackCascadeAmplificationCombined === 'number' &&
      typeof dual.cascadeCouplingSynthesisCombined === 'number'
    );
  });

  check(results, 'a18_cascade_synthesis_fusion', 'Cascade–synthesis fusion: stack cascade plus synthesis scores high', () => {
    const report = computeCascadeSynthesisFusionIndex(50, 48, 48);
    return report.fusionIndex >= 48;
  });

  check(results, 'a18_amplification_stack_resonance', 'Amplification–stack resonance: amplification plus stack scores high', () => {
    const report = computeAmplificationStackResonanceIndex(48, 50, 44);
    return report.resonanceIndex >= 47;
  });

  check(results, 'a18_synthesis_escalation_pressure', 'Synthesis–escalation pressure: synthesis plus amplification under tier', () => {
    const report = computeSynthesisEscalationPressureIndex(50, 48, 3);
    return report.pressureIndex >= 46;
  });

  check(results, 'a18_eval_round24_meta', 'Layer: round-24 meta exposes synthesis fusion, stack resonance, escalation pressure', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.cascadeSynthesisFusionIndex === 'number' &&
      typeof m.amplificationStackResonanceIndex === 'number' &&
      typeof m.synthesisEscalationPressureIndex === 'number'
    );
  });

  check(results, 'a18_audit_cascade_synthesis_fusion', 'Audit: cascade–synthesis fusion surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, cascadeSynthesisFusionIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Cascade–synthesis fusion/.test(f.message));
  });

  check(results, 'a18_dual_round24_combined', 'Dual team: round-24 combined fusion, resonance, pressure exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.cascadeSynthesisFusionCombined === 'number' &&
      typeof dual.amplificationStackResonanceCombined === 'number' &&
      typeof dual.synthesisEscalationPressureCombined === 'number'
    );
  });

  check(results, 'a18_fusion_resonance_convergence', 'Fusion–resonance convergence: synthesis fusion plus stack resonance scores high', () => {
    const report = computeFusionResonanceConvergenceIndex(50, 48, 46);
    return report.convergenceIndex >= 48;
  });

  check(results, 'a18_pressure_fusion_cascade', 'Pressure–fusion cascade: escalation pressure plus synthesis fusion scores high', () => {
    const report = computePressureFusionCascadeIndex(50, 48, 3);
    return report.cascadeIndex >= 47;
  });

  check(results, 'a18_resonance_pressure_synthesis', 'Resonance–pressure synthesis: stack resonance plus escalation pressure scores high', () => {
    const report = computeResonancePressureSynthesisIndex(48, 50, 48);
    return report.synthesisIndex >= 46;
  });

  check(results, 'a18_eval_round25_meta', 'Layer: round-25 meta exposes convergence, pressure cascade, resonance synthesis', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionResonanceConvergenceIndex === 'number' &&
      typeof m.pressureFusionCascadeIndex === 'number' &&
      typeof m.resonancePressureSynthesisIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_resonance_convergence', 'Audit: fusion–resonance convergence surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionResonanceConvergenceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–resonance convergence/.test(f.message));
  });

  check(results, 'a18_dual_round25_combined', 'Dual team: round-25 combined convergence, cascade, synthesis exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionResonanceConvergenceCombined === 'number' &&
      typeof dual.pressureFusionCascadeCombined === 'number' &&
      typeof dual.resonancePressureSynthesisCombined === 'number'
    );
  });

  check(results, 'a18_convergence_cascade_synthesis', 'Convergence–cascade synthesis: convergence plus cascade scores high', () => {
    const report = computeConvergenceCascadeSynthesisIndex(50, 48, 3);
    return report.synthesisIndex >= 48;
  });

  check(results, 'a18_synthesis_convergence_stack', 'Synthesis–convergence stack: pressure synthesis plus convergence scores high', () => {
    const report = computeSynthesisConvergenceStackIndex(50, 48, 46);
    return report.stackIndex >= 47;
  });

  check(results, 'a18_cascade_resonance_amplification', 'Cascade–resonance amplification: cascade plus synthesis under audit scores high', () => {
    const report = computeCascadeResonanceAmplificationIndex(48, 50, 42);
    return report.amplificationIndex >= 46;
  });

  check(results, 'a18_eval_round26_meta', 'Layer: round-26 meta exposes cascade synthesis, convergence stack, resonance amplification', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.convergenceCascadeSynthesisIndex === 'number' &&
      typeof m.synthesisConvergenceStackIndex === 'number' &&
      typeof m.cascadeResonanceAmplificationIndex === 'number'
    );
  });

  check(results, 'a18_audit_convergence_cascade_synthesis', 'Audit: convergence–cascade synthesis surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, convergenceCascadeSynthesisIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Convergence–cascade synthesis/.test(f.message));
  });

  check(results, 'a18_dual_round26_combined', 'Dual team: round-26 combined synthesis, stack, amplification exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.convergenceCascadeSynthesisCombined === 'number' &&
      typeof dual.synthesisConvergenceStackCombined === 'number' &&
      typeof dual.cascadeResonanceAmplificationCombined === 'number'
    );
  });

  check(results, 'a18_synthesis_stack_amplification', 'Synthesis–stack amplification: cascade synthesis plus convergence stack scores high', () => {
    const report = computeSynthesisStackAmplificationIndex(50, 48, 3);
    return report.amplificationIndex >= 48;
  });

  check(results, 'a18_amplification_convergence_cascade', 'Amplification–convergence cascade: resonance amp plus cascade synthesis scores high', () => {
    const report = computeAmplificationConvergenceCascadeIndex(48, 50, 42);
    return report.cascadeIndex >= 47;
  });

  check(results, 'a18_stack_synthesis_resonance', 'Stack–synthesis resonance: convergence stack plus resonance amp scores high', () => {
    const report = computeStackSynthesisResonanceIndex(48, 50, 48);
    return report.resonanceIndex >= 46;
  });

  check(results, 'a18_eval_round27_meta', 'Layer: round-27 meta exposes stack amplification, convergence cascade, synthesis resonance', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.synthesisStackAmplificationIndex === 'number' &&
      typeof m.amplificationConvergenceCascadeIndex === 'number' &&
      typeof m.stackSynthesisResonanceIndex === 'number'
    );
  });

  check(results, 'a18_audit_synthesis_stack_amplification', 'Audit: synthesis–stack amplification surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, synthesisStackAmplificationIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Synthesis–stack amplification/.test(f.message));
  });

  check(results, 'a18_dual_round27_combined', 'Dual team: round-27 combined amplification, cascade, resonance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.synthesisStackAmplificationCombined === 'number' &&
      typeof dual.amplificationConvergenceCascadeCombined === 'number' &&
      typeof dual.stackSynthesisResonanceCombined === 'number'
    );
  });

  check(results, 'a18_stack_amplification_cascade_fusion', 'Stack–amplification cascade fusion: amplification plus cascade scores high', () => {
    const report = computeStackAmplificationCascadeFusionIndex(50, 48, 3);
    return report.fusionIndex >= 48;
  });

  check(results, 'a18_resonance_amplification_stack', 'Resonance–amplification stack: synthesis resonance plus stack amp scores high', () => {
    const report = computeResonanceAmplificationStackIndex(48, 50, 46);
    return report.stackIndex >= 47;
  });

  check(results, 'a18_cascade_convergence_resonance', 'Cascade–convergence resonance: convergence cascade plus synthesis resonance scores high', () => {
    const report = computeCascadeConvergenceResonanceIndex(48, 50, 42);
    return report.resonanceIndex >= 46;
  });

  check(results, 'a18_eval_round28_meta', 'Layer: round-28 meta exposes cascade fusion, amplification stack, convergence resonance', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.stackAmplificationCascadeFusionIndex === 'number' &&
      typeof m.resonanceAmplificationStackIndex === 'number' &&
      typeof m.cascadeConvergenceResonanceIndex === 'number'
    );
  });

  check(results, 'a18_audit_stack_amplification_cascade_fusion', 'Audit: stack–amplification cascade fusion surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, stackAmplificationCascadeFusionIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Stack–amplification cascade fusion/.test(f.message));
  });

  check(results, 'a18_dual_round28_combined', 'Dual team: round-28 combined fusion, stack, resonance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.stackAmplificationCascadeFusionCombined === 'number' &&
      typeof dual.resonanceAmplificationStackCombined === 'number' &&
      typeof dual.cascadeConvergenceResonanceCombined === 'number'
    );
  });

  check(results, 'a18_fusion_stack_convergence', 'Fusion–stack convergence: cascade fusion plus amp stack scores high', () => {
    const report = computeFusionStackConvergenceIndex(50, 48, 3);
    return report.convergenceIndex >= 48;
  });

  check(results, 'a18_resonance_cascade_synthesis', 'Resonance–cascade synthesis: convergence resonance plus fusion scores high', () => {
    const report = computeResonanceCascadeSynthesisIndex(48, 50, 42);
    return report.synthesisIndex >= 47;
  });

  check(results, 'a18_convergence_amplification_pressure', 'Convergence–amplification pressure: amp stack plus convergence resonance scores high', () => {
    const report = computeConvergenceAmplificationPressureIndex(48, 50, 48);
    return report.pressureIndex >= 46;
  });

  check(results, 'a18_eval_round29_meta', 'Layer: round-29 meta exposes stack convergence, cascade synthesis, amplification pressure', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionStackConvergenceIndex === 'number' &&
      typeof m.resonanceCascadeSynthesisIndex === 'number' &&
      typeof m.convergenceAmplificationPressureIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_stack_convergence', 'Audit: fusion–stack convergence surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionStackConvergenceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–stack convergence/.test(f.message));
  });

  check(results, 'a18_dual_round29_combined', 'Dual team: round-29 combined convergence, synthesis, pressure exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionStackConvergenceCombined === 'number' &&
      typeof dual.resonanceCascadeSynthesisCombined === 'number' &&
      typeof dual.convergenceAmplificationPressureCombined === 'number'
    );
  });

  check(results, 'a18_convergence_synthesis_fusion', 'Convergence–synthesis fusion: stack convergence plus cascade synthesis scores high', () => {
    const report = computeConvergenceSynthesisFusionIndex(50, 48, 3);
    return report.fusionIndex >= 48;
  });

  check(results, 'a18_pressure_cascade_stack', 'Pressure–cascade stack: amplification pressure plus stack convergence scores high', () => {
    const report = computePressureCascadeStackIndex(48, 50, 46);
    return report.stackIndex >= 47;
  });

  check(results, 'a18_synthesis_pressure_resonance', 'Synthesis–pressure resonance: cascade synthesis plus amplification pressure scores high', () => {
    const report = computeSynthesisPressureResonanceIndex(48, 50, 42);
    return report.resonanceIndex >= 46;
  });

  check(results, 'a18_eval_round30_meta', 'Layer: round-30 meta exposes synthesis fusion, cascade stack, pressure resonance', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.convergenceSynthesisFusionIndex === 'number' &&
      typeof m.pressureCascadeStackIndex === 'number' &&
      typeof m.synthesisPressureResonanceIndex === 'number'
    );
  });

  check(results, 'a18_audit_convergence_synthesis_fusion', 'Audit: convergence–synthesis fusion surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, convergenceSynthesisFusionIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Convergence–synthesis fusion/.test(f.message));
  });

  check(results, 'a18_dual_round30_combined', 'Dual team: round-30 combined fusion, stack, resonance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.convergenceSynthesisFusionCombined === 'number' &&
      typeof dual.pressureCascadeStackCombined === 'number' &&
      typeof dual.synthesisPressureResonanceCombined === 'number'
    );
  });

  check(results, 'a18_fusion_cascade_stack', 'Fusion–cascade stack: synthesis fusion plus pressure stack scores high', () => {
    const report = computeFusionCascadeStackIndex(50, 48, 3);
    return report.stackIndex >= 48;
  });

  check(results, 'a18_resonance_pressure_cascade', 'Resonance–pressure cascade: pressure resonance plus cascade stack scores high', () => {
    const report = computeResonancePressureCascadeIndex(48, 50, 42);
    return report.cascadeIndex >= 47;
  });

  check(results, 'a18_synthesis_fusion_convergence', 'Synthesis–fusion convergence: synthesis fusion plus pressure resonance scores high', () => {
    const report = computeSynthesisFusionConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round31_meta', 'Layer: round-31 meta exposes cascade stack, pressure cascade, fusion convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionCascadeStackIndex === 'number' &&
      typeof m.resonancePressureCascadeIndex === 'number' &&
      typeof m.synthesisFusionConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_cascade_stack', 'Audit: fusion–cascade stack surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionCascadeStackIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–cascade stack/.test(f.message));
  });

  check(results, 'a18_dual_round31_combined', 'Dual team: round-31 combined stack, cascade, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionCascadeStackCombined === 'number' &&
      typeof dual.resonancePressureCascadeCombined === 'number' &&
      typeof dual.synthesisFusionConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_stack_cascade_resonance', 'Stack–cascade resonance: fusion stack plus pressure cascade scores high', () => {
    const report = computeStackCascadeResonanceIndex(50, 48, 3);
    return report.resonanceIndex >= 48;
  });

  check(results, 'a18_cascade_convergence_pressure', 'Cascade–convergence pressure: pressure cascade plus fusion convergence scores high', () => {
    const report = computeCascadeConvergencePressureIndex(48, 50, 42);
    return report.pressureIndex >= 47;
  });

  check(results, 'a18_convergence_fusion_synthesis', 'Convergence–fusion synthesis: fusion convergence plus cascade stack scores high', () => {
    const report = computeConvergenceFusionSynthesisIndex(48, 50, 48);
    return report.synthesisIndex >= 46;
  });

  check(results, 'a18_eval_round32_meta', 'Layer: round-32 meta exposes stack resonance, convergence pressure, fusion synthesis', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.stackCascadeResonanceIndex === 'number' &&
      typeof m.cascadeConvergencePressureIndex === 'number' &&
      typeof m.convergenceFusionSynthesisIndex === 'number'
    );
  });

  check(results, 'a18_audit_stack_cascade_resonance', 'Audit: stack–cascade resonance surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, stackCascadeResonanceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Stack–cascade resonance/.test(f.message));
  });

  check(results, 'a18_dual_round32_combined', 'Dual team: round-32 combined resonance, pressure, synthesis exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.stackCascadeResonanceCombined === 'number' &&
      typeof dual.cascadeConvergencePressureCombined === 'number' &&
      typeof dual.convergenceFusionSynthesisCombined === 'number'
    );
  });

  check(results, 'a18_resonance_convergence_fusion', 'Resonance–convergence fusion: stack resonance plus convergence pressure scores high', () => {
    const report = computeResonanceConvergenceFusionIndex(50, 48, 3);
    return report.fusionIndex >= 48;
  });

  check(results, 'a18_pressure_synthesis_cascade', 'Pressure–synthesis cascade: convergence pressure plus fusion synthesis scores high', () => {
    const report = computePressureSynthesisCascadeIndex(48, 50, 42);
    return report.cascadeIndex >= 47;
  });

  check(results, 'a18_synthesis_resonance_stack', 'Synthesis–resonance stack: fusion synthesis plus stack resonance scores high', () => {
    const report = computeSynthesisResonanceStackIndex(48, 50, 48);
    return report.stackIndex >= 46;
  });

  check(results, 'a18_eval_round33_meta', 'Layer: round-33 meta exposes convergence fusion, synthesis cascade, resonance stack', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.resonanceConvergenceFusionIndex === 'number' &&
      typeof m.pressureSynthesisCascadeIndex === 'number' &&
      typeof m.synthesisResonanceStackIndex === 'number'
    );
  });

  check(results, 'a18_audit_resonance_convergence_fusion', 'Audit: resonance–convergence fusion surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, resonanceConvergenceFusionIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Resonance–convergence fusion/.test(f.message));
  });

  check(results, 'a18_dual_round33_combined', 'Dual team: round-33 combined fusion, cascade, stack exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.resonanceConvergenceFusionCombined === 'number' &&
      typeof dual.pressureSynthesisCascadeCombined === 'number' &&
      typeof dual.synthesisResonanceStackCombined === 'number'
    );
  });

  check(results, 'a18_convergence_fusion_pressure', 'Convergence–fusion pressure: convergence fusion plus synthesis cascade scores high', () => {
    const report = computeConvergenceFusionPressureIndex(50, 48, 3);
    return report.pressureIndex >= 48;
  });

  check(results, 'a18_synthesis_cascade_stack', 'Synthesis–cascade stack: synthesis cascade plus resonance stack scores high', () => {
    const report = computeSynthesisCascadeStackIndex(48, 50, 42);
    return report.stackIndex >= 47;
  });

  check(results, 'a18_resonance_stack_fusion', 'Resonance–stack fusion: resonance stack plus convergence fusion scores high', () => {
    const report = computeResonanceStackFusionIndex(48, 50, 48);
    return report.fusionIndex >= 46;
  });

  check(results, 'a18_eval_round34_meta', 'Layer: round-34 meta exposes fusion pressure, cascade stack, stack fusion', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.convergenceFusionPressureIndex === 'number' &&
      typeof m.synthesisCascadeStackIndex === 'number' &&
      typeof m.resonanceStackFusionIndex === 'number'
    );
  });

  check(results, 'a18_audit_convergence_fusion_pressure', 'Audit: convergence–fusion pressure surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, convergenceFusionPressureIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Convergence–fusion pressure/.test(f.message));
  });

  check(results, 'a18_dual_round34_combined', 'Dual team: round-34 combined pressure, stack, fusion exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.convergenceFusionPressureCombined === 'number' &&
      typeof dual.synthesisCascadeStackCombined === 'number' &&
      typeof dual.resonanceStackFusionCombined === 'number'
    );
  });

  check(results, 'a18_pressure_stack_resonance', 'Pressure–stack resonance: fusion pressure plus cascade stack scores high', () => {
    const report = computePressureStackResonanceIndex(50, 48, 3);
    return report.resonanceIndex >= 48;
  });

  check(results, 'a18_stack_fusion_cascade', 'Stack–fusion cascade: cascade stack plus stack fusion scores high', () => {
    const report = computeStackFusionCascadeIndex(48, 50, 42);
    return report.cascadeIndex >= 47;
  });

  check(results, 'a18_fusion_cascade_convergence', 'Fusion–cascade convergence: stack fusion plus fusion pressure scores high', () => {
    const report = computeFusionCascadeConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round35_meta', 'Layer: round-35 meta exposes stack resonance, fusion cascade, cascade convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.pressureStackResonanceIndex === 'number' &&
      typeof m.stackFusionCascadeIndex === 'number' &&
      typeof m.fusionCascadeConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_pressure_stack_resonance', 'Audit: pressure–stack resonance surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, pressureStackResonanceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Pressure–stack resonance/.test(f.message));
  });

  check(results, 'a18_dual_round35_combined', 'Dual team: round-35 combined resonance, cascade, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.pressureStackResonanceCombined === 'number' &&
      typeof dual.stackFusionCascadeCombined === 'number' &&
      typeof dual.fusionCascadeConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_resonance_fusion_stack', 'Resonance–fusion stack: stack resonance plus fusion cascade scores high', () => {
    const report = computeResonanceFusionStackIndex(50, 48, 3);
    return report.stackIndex >= 48;
  });

  check(results, 'a18_fusion_cascade_pressure', 'Fusion–cascade pressure: fusion cascade plus cascade convergence scores high', () => {
    const report = computeFusionCascadePressureIndex(48, 50, 42);
    return report.pressureIndex >= 47;
  });

  check(results, 'a18_stack_convergence_resonance', 'Stack–convergence resonance: cascade convergence plus stack resonance scores high', () => {
    const report = computeStackConvergenceResonanceIndex(48, 50, 48);
    return report.resonanceIndex >= 46;
  });

  check(results, 'a18_eval_round36_meta', 'Layer: round-36 meta exposes fusion stack, cascade pressure, convergence resonance', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.resonanceFusionStackIndex === 'number' &&
      typeof m.fusionCascadePressureIndex === 'number' &&
      typeof m.stackConvergenceResonanceIndex === 'number'
    );
  });

  check(results, 'a18_audit_resonance_fusion_stack', 'Audit: resonance–fusion stack surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, resonanceFusionStackIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Resonance–fusion stack/.test(f.message));
  });

  check(results, 'a18_dual_round36_combined', 'Dual team: round-36 combined stack, pressure, resonance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.resonanceFusionStackCombined === 'number' &&
      typeof dual.fusionCascadePressureCombined === 'number' &&
      typeof dual.stackConvergenceResonanceCombined === 'number'
    );
  });

  check(results, 'a18_fusion_stack_pressure', 'Fusion–stack pressure: fusion stack plus cascade pressure scores high', () => {
    const report = computeFusionStackPressureIndex(50, 48, 3);
    return report.pressureIndex >= 48;
  });

  check(results, 'a18_pressure_resonance_cascade', 'Pressure–resonance cascade: cascade pressure plus convergence resonance scores high', () => {
    const report = computePressureResonanceCascadeIndex(48, 50, 42);
    return report.cascadeIndex >= 47;
  });

  check(results, 'a18_stack_synthesis_convergence', 'Stack–synthesis convergence: convergence resonance plus fusion stack scores high', () => {
    const report = computeStackSynthesisConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round37_meta', 'Layer: round-37 meta exposes stack pressure, resonance cascade, synthesis convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionStackPressureIndex === 'number' &&
      typeof m.pressureResonanceCascadeIndex === 'number' &&
      typeof m.stackSynthesisConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_stack_pressure', 'Audit: fusion–stack pressure surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionStackPressureIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–stack pressure/.test(f.message));
  });

  check(results, 'a18_dual_round37_combined', 'Dual team: round-37 combined pressure, cascade, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionStackPressureCombined === 'number' &&
      typeof dual.pressureResonanceCascadeCombined === 'number' &&
      typeof dual.stackSynthesisConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_pressure_cascade_fusion', 'Pressure–cascade fusion: stack pressure plus resonance cascade scores high', () => {
    const report = computePressureCascadeFusionIndex(50, 48, 3);
    return report.fusionIndex >= 48;
  });

  check(results, 'a18_cascade_synthesis_resonance', 'Cascade–synthesis resonance: resonance cascade plus synthesis convergence scores high', () => {
    const report = computeCascadeSynthesisResonanceIndex(48, 50, 42);
    return report.resonanceIndex >= 47;
  });

  check(results, 'a18_convergence_pressure_stack', 'Convergence–pressure stack: synthesis convergence plus stack pressure scores high', () => {
    const report = computeConvergencePressureStackIndex(48, 50, 48);
    return report.stackIndex >= 46;
  });

  check(results, 'a18_eval_round38_meta', 'Layer: round-38 meta exposes cascade fusion, synthesis resonance, pressure stack', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.pressureCascadeFusionIndex === 'number' &&
      typeof m.cascadeSynthesisResonanceIndex === 'number' &&
      typeof m.convergencePressureStackIndex === 'number'
    );
  });

  check(results, 'a18_audit_pressure_cascade_fusion', 'Audit: pressure–cascade fusion surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, pressureCascadeFusionIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Pressure–cascade fusion/.test(f.message));
  });

  check(results, 'a18_dual_round38_combined', 'Dual team: round-38 combined fusion, resonance, stack exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.pressureCascadeFusionCombined === 'number' &&
      typeof dual.cascadeSynthesisResonanceCombined === 'number' &&
      typeof dual.convergencePressureStackCombined === 'number'
    );
  });

  check(results, 'a18_fusion_cascade_resonance', 'Fusion–cascade resonance: cascade fusion plus synthesis resonance scores high', () => {
    const report = computeFusionCascadeResonanceIndex(50, 48, 3);
    return report.resonanceIndex >= 48;
  });

  check(results, 'a18_resonance_pressure_stack', 'Resonance–pressure stack: synthesis resonance plus pressure stack scores high', () => {
    const report = computeResonancePressureStackIndex(48, 50, 42);
    return report.stackIndex >= 47;
  });

  check(results, 'a18_stack_synthesis_fusion', 'Stack–synthesis fusion: pressure stack plus cascade fusion scores high', () => {
    const report = computeStackSynthesisFusionIndex(48, 50, 48);
    return report.fusionIndex >= 46;
  });

  check(results, 'a18_eval_round39_meta', 'Layer: round-39 meta exposes cascade resonance, pressure stack, synthesis fusion', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionCascadeResonanceIndex === 'number' &&
      typeof m.resonancePressureStackIndex === 'number' &&
      typeof m.stackSynthesisFusionIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_cascade_resonance', 'Audit: fusion–cascade resonance surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionCascadeResonanceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–cascade resonance/.test(f.message));
  });

  check(results, 'a18_dual_round39_combined', 'Dual team: round-39 combined resonance, stack, fusion exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionCascadeResonanceCombined === 'number' &&
      typeof dual.resonancePressureStackCombined === 'number' &&
      typeof dual.stackSynthesisFusionCombined === 'number'
    );
  });

  check(results, 'a18_cascade_resonance_stack', 'Cascade–resonance stack: cascade resonance plus pressure stack scores high', () => {
    const report = computeCascadeResonanceStackIndex(50, 48, 3);
    return report.stackIndex >= 48;
  });

  check(results, 'a18_resonance_fusion_pressure', 'Resonance–fusion pressure: pressure stack plus synthesis fusion scores high', () => {
    const report = computeResonanceFusionPressureIndex(48, 50, 42);
    return report.pressureIndex >= 47;
  });

  check(results, 'a18_fusion_convergence_synthesis', 'Fusion–convergence synthesis: synthesis fusion plus cascade resonance scores high', () => {
    const report = computeFusionConvergenceSynthesisIndex(48, 50, 48);
    return report.synthesisIndex >= 46;
  });

  check(results, 'a18_eval_round40_meta', 'Layer: round-40 meta exposes resonance stack, fusion pressure, convergence synthesis', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.cascadeResonanceStackIndex === 'number' &&
      typeof m.resonanceFusionPressureIndex === 'number' &&
      typeof m.fusionConvergenceSynthesisIndex === 'number'
    );
  });

  check(results, 'a18_audit_cascade_resonance_stack', 'Audit: cascade–resonance stack surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, cascadeResonanceStackIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Cascade–resonance stack/.test(f.message));
  });

  check(results, 'a18_dual_round40_combined', 'Dual team: round-40 combined stack, pressure, synthesis exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.cascadeResonanceStackCombined === 'number' &&
      typeof dual.resonanceFusionPressureCombined === 'number' &&
      typeof dual.fusionConvergenceSynthesisCombined === 'number'
    );
  });

  check(results, 'a18_stack_resonance_pressure', 'Stack–resonance pressure: resonance stack plus fusion pressure scores high', () => {
    const report = computeStackResonancePressureIndex(50, 48, 3);
    return report.pressureIndex >= 48;
  });

  check(results, 'a18_pressure_fusion_synthesis', 'Pressure–fusion synthesis: fusion pressure plus convergence synthesis scores high', () => {
    const report = computePressureFusionSynthesisIndex(48, 50, 42);
    return report.synthesisIndex >= 47;
  });

  check(results, 'a18_synthesis_stack_convergence', 'Synthesis–stack convergence: convergence synthesis plus resonance stack scores high', () => {
    const report = computeSynthesisStackConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round41_meta', 'Layer: round-41 meta exposes stack pressure, fusion synthesis, stack convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.stackResonancePressureIndex === 'number' &&
      typeof m.pressureFusionSynthesisIndex === 'number' &&
      typeof m.synthesisStackConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_stack_resonance_pressure', 'Audit: stack–resonance pressure surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, stackResonancePressureIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Stack–resonance pressure/.test(f.message));
  });

  check(results, 'a18_dual_round41_combined', 'Dual team: round-41 combined pressure, synthesis, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.stackResonancePressureCombined === 'number' &&
      typeof dual.pressureFusionSynthesisCombined === 'number' &&
      typeof dual.synthesisStackConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_stack_fusion_resonance', 'Stack–fusion resonance: resonance pressure plus fusion synthesis scores high', () => {
    const report = computeStackFusionResonanceIndex(50, 48, 3);
    return report.resonanceIndex >= 48;
  });

  check(results, 'a18_fusion_synthesis_pressure', 'Fusion–synthesis pressure: fusion synthesis plus stack convergence scores high', () => {
    const report = computeFusionSynthesisPressureIndex(48, 50, 42);
    return report.pressureIndex >= 47;
  });

  check(results, 'a18_synthesis_cascade_convergence', 'Synthesis–cascade convergence: stack convergence plus resonance pressure scores high', () => {
    const report = computeSynthesisCascadeConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round42_meta', 'Layer: round-42 meta exposes fusion resonance, synthesis pressure, cascade convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.stackFusionResonanceIndex === 'number' &&
      typeof m.fusionSynthesisPressureIndex === 'number' &&
      typeof m.synthesisCascadeConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_stack_fusion_resonance', 'Audit: stack–fusion resonance surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, stackFusionResonanceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Stack–fusion resonance/.test(f.message));
  });

  check(results, 'a18_dual_round42_combined', 'Dual team: round-42 combined resonance, pressure, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.stackFusionResonanceCombined === 'number' &&
      typeof dual.fusionSynthesisPressureCombined === 'number' &&
      typeof dual.synthesisCascadeConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_fusion_resonance_synthesis', 'Fusion–resonance synthesis: fusion resonance plus synthesis pressure scores high', () => {
    const report = computeFusionResonanceSynthesisIndex(50, 48, 3);
    return report.synthesisIndex >= 48;
  });

  check(results, 'a18_pressure_cascade_convergence', 'Pressure–cascade convergence: synthesis pressure plus cascade convergence scores high', () => {
    const report = computePressureCascadeConvergenceIndex(48, 50, 42);
    return report.convergenceIndex >= 47;
  });

  check(results, 'a18_cascade_stack_fusion', 'Cascade–stack fusion: cascade convergence plus fusion resonance scores high', () => {
    const report = computeCascadeStackFusionIndex(48, 50, 48);
    return report.fusionIndex >= 46;
  });

  check(results, 'a18_eval_round43_meta', 'Layer: round-43 meta exposes resonance synthesis, cascade convergence, stack fusion', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionResonanceSynthesisIndex === 'number' &&
      typeof m.pressureCascadeConvergenceIndex === 'number' &&
      typeof m.cascadeStackFusionIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_resonance_synthesis', 'Audit: fusion–resonance synthesis surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionResonanceSynthesisIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–resonance synthesis/.test(f.message));
  });

  check(results, 'a18_dual_round43_combined', 'Dual team: round-43 combined synthesis, convergence, fusion exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionResonanceSynthesisCombined === 'number' &&
      typeof dual.pressureCascadeConvergenceCombined === 'number' &&
      typeof dual.cascadeStackFusionCombined === 'number'
    );
  });

  check(results, 'a18_synthesis_resonance_convergence', 'Synthesis–resonance convergence: resonance synthesis plus cascade convergence scores high', () => {
    const report = computeSynthesisResonanceConvergenceIndex(50, 48, 3);
    return report.convergenceIndex >= 48;
  });

  check(results, 'a18_pressure_stack_fusion', 'Pressure–stack fusion: cascade convergence plus stack fusion scores high', () => {
    const report = computePressureStackFusionIndex(48, 50, 42);
    return report.fusionIndex >= 47;
  });

  check(results, 'a18_fusion_stack_synthesis', 'Fusion–stack synthesis: stack fusion plus resonance synthesis scores high', () => {
    const report = computeFusionStackSynthesisIndex(48, 50, 48);
    return report.synthesisIndex >= 46;
  });

  check(results, 'a18_eval_round44_meta', 'Layer: round-44 meta exposes resonance convergence, stack fusion, stack synthesis', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.synthesisResonanceConvergenceIndex === 'number' &&
      typeof m.pressureStackFusionIndex === 'number' &&
      typeof m.fusionStackSynthesisIndex === 'number'
    );
  });

  check(results, 'a18_audit_synthesis_resonance_convergence', 'Audit: synthesis–resonance convergence surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, synthesisResonanceConvergenceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Synthesis–resonance convergence/.test(f.message));
  });

  check(results, 'a18_dual_round44_combined', 'Dual team: round-44 combined convergence, fusion, synthesis exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.synthesisResonanceConvergenceCombined === 'number' &&
      typeof dual.pressureStackFusionCombined === 'number' &&
      typeof dual.fusionStackSynthesisCombined === 'number'
    );
  });

  check(results, 'a18_resonance_convergence_stack', 'Resonance–convergence stack: resonance convergence plus stack fusion scores high', () => {
    const report = computeResonanceConvergenceStackIndex(50, 48, 3);
    return report.stackIndex >= 48;
  });

  check(results, 'a18_pressure_stack_synthesis', 'Pressure–stack synthesis: stack fusion plus stack synthesis scores high', () => {
    const report = computePressureStackSynthesisIndex(48, 50, 42);
    return report.synthesisIndex >= 47;
  });

  check(results, 'a18_fusion_stack_resonance', 'Fusion–stack resonance: stack synthesis plus resonance convergence scores high', () => {
    const report = computeFusionStackResonanceIndex(48, 50, 48);
    return report.resonanceIndex >= 46;
  });

  check(results, 'a18_eval_round45_meta', 'Layer: round-45 meta exposes convergence stack, stack synthesis, stack resonance', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.resonanceConvergenceStackIndex === 'number' &&
      typeof m.pressureStackSynthesisIndex === 'number' &&
      typeof m.fusionStackResonanceIndex === 'number'
    );
  });

  check(results, 'a18_audit_resonance_convergence_stack', 'Audit: resonance–convergence stack surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, resonanceConvergenceStackIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Resonance–convergence stack/.test(f.message));
  });

  check(results, 'a18_dual_round45_combined', 'Dual team: round-45 combined stack, synthesis, resonance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.resonanceConvergenceStackCombined === 'number' &&
      typeof dual.pressureStackSynthesisCombined === 'number' &&
      typeof dual.fusionStackResonanceCombined === 'number'
    );
  });

  check(results, 'a18_convergence_stack_synthesis', 'Convergence–stack synthesis: convergence stack plus stack synthesis scores high', () => {
    const report = computeConvergenceStackSynthesisIndex(50, 48, 3);
    return report.synthesisIndex >= 48;
  });

  check(results, 'a18_stack_synthesis_pressure', 'Stack–synthesis pressure: stack synthesis plus stack resonance scores high', () => {
    const report = computeStackSynthesisPressureIndex(48, 50, 42);
    return report.pressureIndex >= 47;
  });

  check(results, 'a18_fusion_resonance_stack', 'Fusion–resonance stack: stack resonance plus convergence stack scores high', () => {
    const report = computeFusionResonanceStackIndex(48, 50, 48);
    return report.stackIndex >= 46;
  });

  check(results, 'a18_eval_round46_meta', 'Layer: round-46 meta exposes stack synthesis, synthesis pressure, resonance stack', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.convergenceStackSynthesisIndex === 'number' &&
      typeof m.stackSynthesisPressureIndex === 'number' &&
      typeof m.fusionResonanceStackIndex === 'number'
    );
  });

  check(results, 'a18_audit_convergence_stack_synthesis', 'Audit: convergence–stack synthesis surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, convergenceStackSynthesisIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Convergence–stack synthesis/.test(f.message));
  });

  check(results, 'a18_dual_round46_combined', 'Dual team: round-46 combined synthesis, pressure, stack exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.convergenceStackSynthesisCombined === 'number' &&
      typeof dual.stackSynthesisPressureCombined === 'number' &&
      typeof dual.fusionResonanceStackCombined === 'number'
    );
  });

  check(results, 'a18_synthesis_pressure_convergence', 'Synthesis–pressure convergence: stack synthesis plus synthesis pressure scores high', () => {
    const report = computeSynthesisPressureConvergenceIndex(50, 48, 3);
    return report.convergenceIndex >= 48;
  });

  check(results, 'a18_pressure_fusion_stack', 'Pressure–fusion stack: synthesis pressure plus resonance stack scores high', () => {
    const report = computePressureFusionStackIndex(48, 50, 42);
    return report.stackIndex >= 47;
  });

  check(results, 'a18_resonance_synthesis_fusion', 'Resonance–synthesis fusion: resonance stack plus stack synthesis scores high', () => {
    const report = computeResonanceSynthesisFusionIndex(48, 50, 48);
    return report.fusionIndex >= 46;
  });

  check(results, 'a18_eval_round47_meta', 'Layer: round-47 meta exposes pressure convergence, fusion stack, synthesis fusion', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.synthesisPressureConvergenceIndex === 'number' &&
      typeof m.pressureFusionStackIndex === 'number' &&
      typeof m.resonanceSynthesisFusionIndex === 'number'
    );
  });

  check(results, 'a18_audit_synthesis_pressure_convergence', 'Audit: synthesis–pressure convergence surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, synthesisPressureConvergenceIndex: 72 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Synthesis–pressure convergence/.test(f.message));
  });

  check(results, 'a18_dual_round47_combined', 'Dual team: round-47 combined convergence, stack, fusion exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.synthesisPressureConvergenceCombined === 'number' &&
      typeof dual.pressureFusionStackCombined === 'number' &&
      typeof dual.resonanceSynthesisFusionCombined === 'number'
    );
  });

  check(results, 'a18_convergence_pressure_fusion', 'Convergence–pressure fusion: pressure convergence plus fusion stack scores high', () => {
    const report = computeConvergencePressureFusionIndex(50, 48, 3);
    return report.fusionIndex >= 48;
  });

  check(results, 'a18_pressure_resonance_synthesis', 'Pressure–resonance synthesis: fusion stack plus synthesis fusion scores high', () => {
    const report = computePressureResonanceSynthesisIndex(48, 50, 42);
    return report.synthesisIndex >= 47;
  });

  check(results, 'a18_fusion_convergence_pressure', 'Fusion–convergence pressure: synthesis fusion plus pressure convergence scores high', () => {
    const report = computeFusionConvergencePressureIndex(48, 50, 48);
    return report.pressureIndex >= 46;
  });

  check(results, 'a18_eval_round48_meta', 'Layer: round-48 meta exposes pressure fusion, resonance synthesis, convergence pressure', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.convergencePressureFusionIndex === 'number' &&
      typeof m.pressureResonanceSynthesisIndex === 'number' &&
      typeof m.fusionConvergencePressureIndex === 'number'
    );
  });

  check(results, 'a18_audit_convergence_pressure_fusion', 'Audit: convergence–pressure fusion surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, convergencePressureFusionIndex: 74 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Convergence–pressure fusion/.test(f.message));
  });

  check(results, 'a18_dual_round48_combined', 'Dual team: round-48 combined fusion, synthesis, pressure exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.convergencePressureFusionCombined === 'number' &&
      typeof dual.pressureResonanceSynthesisCombined === 'number' &&
      typeof dual.fusionConvergencePressureCombined === 'number'
    );
  });

  check(results, 'a18_fusion_synthesis_resonance', 'Fusion–synthesis resonance: pressure fusion plus resonance synthesis scores high', () => {
    const report = computeFusionSynthesisResonanceIndex(50, 48, 3);
    return report.resonanceIndex >= 48;
  });

  check(results, 'a18_resonance_pressure_convergence', 'Resonance–pressure convergence: resonance synthesis plus convergence pressure scores high', () => {
    const report = computeResonancePressureConvergenceIndex(48, 50, 42);
    return report.convergenceIndex >= 47;
  });

  check(results, 'a18_pressure_fusion_convergence', 'Pressure–fusion convergence: convergence pressure plus pressure fusion scores high', () => {
    const report = computePressureFusionConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round49_meta', 'Layer: round-49 meta exposes synthesis resonance, pressure convergence, fusion convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.fusionSynthesisResonanceIndex === 'number' &&
      typeof m.resonancePressureConvergenceIndex === 'number' &&
      typeof m.pressureFusionConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_fusion_synthesis_resonance', 'Audit: fusion–synthesis resonance surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, fusionSynthesisResonanceIndex: 76 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Fusion–synthesis resonance/.test(f.message));
  });

  check(results, 'a18_dual_round49_combined', 'Dual team: round-49 combined resonance, convergence, fusion exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.fusionSynthesisResonanceCombined === 'number' &&
      typeof dual.resonancePressureConvergenceCombined === 'number' &&
      typeof dual.pressureFusionConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_resonance_convergence_synthesis', 'Resonance–convergence synthesis: fusion resonance plus pressure convergence scores high', () => {
    const report = computeResonanceConvergenceSynthesisIndex(50, 48, 3);
    return report.synthesisIndex >= 48;
  });

  check(results, 'a18_synthesis_pressure_fusion', 'Synthesis–pressure fusion: pressure convergence plus fusion convergence scores high', () => {
    const report = computeSynthesisPressureFusionIndex(48, 50, 42);
    return report.fusionIndex >= 47;
  });

  check(results, 'a18_convergence_synthesis_resonance', 'Convergence–synthesis resonance: fusion convergence plus synthesis resonance scores high', () => {
    const report = computeConvergenceSynthesisResonanceIndex(48, 50, 48);
    return report.resonanceIndex >= 46;
  });

  check(results, 'a18_eval_round50_meta', 'Layer: round-50 meta exposes convergence synthesis, pressure fusion, synthesis resonance', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.resonanceConvergenceSynthesisIndex === 'number' &&
      typeof m.synthesisPressureFusionIndex === 'number' &&
      typeof m.convergenceSynthesisResonanceIndex === 'number'
    );
  });

  check(results, 'a18_audit_resonance_convergence_synthesis', 'Audit: resonance–convergence synthesis surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, resonanceConvergenceSynthesisIndex: 76 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Resonance–convergence synthesis/.test(f.message));
  });

  check(results, 'a18_dual_round50_combined', 'Dual team: round-50 combined synthesis, fusion, resonance exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.resonanceConvergenceSynthesisCombined === 'number' &&
      typeof dual.synthesisPressureFusionCombined === 'number' &&
      typeof dual.convergenceSynthesisResonanceCombined === 'number'
    );
  });

  check(results, 'a18_synthesis_convergence_pressure', 'Synthesis–convergence pressure: convergence synthesis plus pressure fusion scores high', () => {
    const report = computeSynthesisConvergencePressureIndex(50, 48, 3);
    return report.pressureIndex >= 48;
  });

  check(results, 'a18_convergence_pressure_synthesis', 'Convergence–pressure synthesis: pressure fusion plus synthesis resonance scores high', () => {
    const report = computeConvergencePressureSynthesisIndex(48, 50, 42);
    return report.synthesisIndex >= 47;
  });

  check(results, 'a18_pressure_synthesis_convergence', 'Pressure–synthesis convergence: synthesis resonance plus convergence synthesis scores high', () => {
    const report = computePressureSynthesisConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round51_meta', 'Layer: round-51 meta exposes convergence pressure, pressure synthesis, synthesis convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.synthesisConvergencePressureIndex === 'number' &&
      typeof m.convergencePressureSynthesisIndex === 'number' &&
      typeof m.pressureSynthesisConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_synthesis_convergence_pressure', 'Audit: synthesis–convergence pressure surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, synthesisConvergencePressureIndex: 77 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Synthesis–convergence pressure/.test(f.message));
  });

  check(results, 'a18_convergence_synthesis_pressure', 'Convergence–synthesis pressure: pressure synthesis plus synthesis convergence scores high', () => {
    const report = computeConvergenceSynthesisPressureIndex(50, 48, 3);
    return report.pressureIndex >= 48;
  });

  check(results, 'a18_synthesis_pressure_resonance', 'Synthesis–pressure resonance: synthesis convergence plus pressure synthesis scores high', () => {
    const report = computeSynthesisPressureResonanceIndex(48, 50, 3);
    return report.resonanceIndex >= 48;
  });

  check(results, 'a18_pressure_resonance_convergence', 'Pressure–resonance convergence: pressure synthesis plus convergence synthesis scores high', () => {
    const report = computePressureResonanceConvergenceIndex(48, 50, 48);
    return report.convergenceIndex >= 46;
  });

  check(results, 'a18_eval_round52_meta', 'Layer: round-52 meta exposes convergence synthesis pressure, synthesis resonance, pressure convergence', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const m = ev.state.meta;
    return (
      typeof m.convergenceSynthesisPressureIndex === 'number' &&
      typeof m.synthesisPressureResonanceIndex === 'number' &&
      typeof m.pressureResonanceConvergenceIndex === 'number'
    );
  });

  check(results, 'a18_audit_convergence_synthesis_pressure', 'Audit: convergence–synthesis pressure surfaces warning', () => {
    const ev = evaluateTeamMultiAgentLayer(baseInputs(), null);
    const state = { ...ev.state, meta: { ...ev.state.meta, convergenceSynthesisPressureIndex: 77 } };
    const findings = auditTeamMultiAgentLayer(state, baseInputs());
    return findings.some(f => f.severity === 'warning' && /Convergence–synthesis pressure/.test(f.message));
  });

  check(results, 'a18_dual_round52_combined', 'Dual team: round-52 combined pressure, resonance, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.convergenceSynthesisPressureCombined === 'number' &&
      typeof dual.synthesisPressureResonanceCombined === 'number' &&
      typeof dual.pressureResonanceConvergenceCombined === 'number'
    );
  });

  check(results, 'a18_dual_round51_combined', 'Dual team: round-51 combined pressure, synthesis, convergence exposed', () => {
    const friendly = baseInputs({ teamId: 'team_player' });
    const enemy = baseInputs({
      teamId: 'team_opponent',
      actors: [
        { id: 'ai1', name: 'Rival', isHuman: false, inRecovery: false, location: 'QLD', apRemaining: null, brainRole: null },
      ],
      tasks: [],
      command: null,
    });
    const dual = evaluateDualTeamMultiAgentLayers(friendly, enemy);
    return (
      typeof dual.synthesisConvergencePressureCombined === 'number' &&
      typeof dual.convergencePressureSynthesisCombined === 'number' &&
      typeof dual.pressureSynthesisConvergenceCombined === 'number'
    );
  });

  return results;
}

function emptyGuard(turn: number) {
  return { version: 1 as const, committedKeys: [], generationByActor: {}, turn, reservations: {} };
}

export function summarizeAgent18SelfTests(results: Agent18SelfTestResult[]): {
  passed: number;
  failed: number;
  total: number;
} {
  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length };
}


// OP10M_MODULE_END agent-18-team-ai
