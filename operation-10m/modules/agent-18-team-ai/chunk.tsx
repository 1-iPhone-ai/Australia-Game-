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
  const quota = applyDirectiveQuotaGuard(scoped.inTeam, {
    maxPerActorPerTurn: AGENT18_LIMITS.maxDirectivesPerActorPerTurn,
    maxPerTeamPerTurn: AGENT18_LIMITS.maxDirectivesPerTeamPerTurn,
  });
  quota.dropped.forEach(d =>
    diagnostics.push(`Dropped directive ${d.proposal.id}: ${d.reason}`),
  );
  const proposals = quota.allowed;
  const directiveResult = coordinateTeammateDirectives(proposals, coordination, roles);
  const handoffSla = evaluateHandoffSla(inputs.turn, coordination.handoffs, {
    maxPendingTurns: AGENT18_LIMITS.handoffSlaMaxPendingTurns,
  });
  handoffSla.notes.forEach(n => diagnostics.push(n));
  const capacityLedger = buildActorCapacityLedger(inputs.actors, inputs.tasks, roles);
  suggestCapacityRebalanceNotes(capacityLedger).forEach(n => diagnostics.push(n));
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

  const mutexHistory = [...(previous?.meta.mutexHistory || []), coordination.mutexRegions].slice(-5);
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
    },
  };

  const auditFindings = auditTeamMultiAgentLayer(state, inputs);
  state = attachAuditToState(state, auditFindings, {});

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


// --- source: dual-team-coordination.ts ---
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
