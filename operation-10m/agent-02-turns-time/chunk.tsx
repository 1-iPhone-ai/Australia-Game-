// OP10M_MODULE_BEGIN agent-02-turns-time
// @ts-nocheck
// content-sha256-prefix: 0022373bee292353
// Operation 10M — Agent 02 Turns, Time, and Delayed Consequences

// Bundled for Agent 25 assembly (no external imports).

// Host wiring: INTEGRATION.md in operation-10m/agent-02-turns-time/

// --- src/types.ts ---

/** Fixed epoch used in V9.4 deterministic time derivations (read-only reference). */
export const FIXED_EPOCH_MS = Date.UTC(2020, 0, 1, 0, 0, 0, 0);

export const MS_PER_GAME_DAY = 86_400_000;

export type TurnPhase = 'start' | 'main' | 'end';

export const TURN_PHASE_ORDER: readonly TurnPhase[] = ['start', 'main', 'end'] as const;

export type TurnScope = 'global' | 'player' | 'ai';

export interface TurnClock {
  /** 1-based turn index (aligns with game `turn` / leg turn). */
  turnIndex: number;
  /** 1-based calendar day (aligns with game `day`). */
  dayIndex: number;
  /** Monotonic effect counter across the whole session. */
  effectSequence: number;
  /** Current phase within the active turn. */
  phase: TurnPhase;
  /** ISO timestamp derived deterministically from turnIndex. */
  epochIso: string;
  /**
   * Idempotency tokens for side effects keyed by channel, e.g. end-turn co-pilot keys.
   * Maps token -> effectSequence when issued.
   */
  phaseTokens: Record<string, number>;
}

export interface ScheduledObligation {
  id: string;
  dueTurn: number;
  dueDay?: number;
  /** Lower runs first; ties broken by `id` lexicographic. */
  priority: number;
  kind: string;
  payload?: unknown;
  status: 'pending' | 'fired' | 'cancelled';
  firedAtTurn?: number;
  firedAtSequence?: number;
}

export type ConstructionStatus = 'under_construction' | 'completed' | 'cancelled';

export interface ConstructionProject {
  id: string;
  startedTurn: number;
  startedDay: number;
  laborTurnsRequired: number;
  laborTurnsCompleted: number;
  completionTurn: number;
  status: ConstructionStatus;
  lastLaborSequence?: number;
}

export type TraceKind =
  | 'phase_enter'
  | 'obligation_fired'
  | 'event_dispatched'
  | 'follow_up_scheduled'
  | 'construction_labor'
  | 'construction_completed'
  | 'fast_forward_step'
  | 'time_paused'
  | 'time_resumed'
  | 'advance_blocked';

export interface EffectTraceEntry {
  sequence: number;
  turnIndex: number;
  dayIndex: number;
  phase: TurnPhase;
  kind: TraceKind;
  refId?: string;
  detail?: string;
}

export interface IntegrityReport {
  ok: boolean;
  duplicateFired: string[];
  skippedDue: string[];
  orphanPastPending: string[];
  constructionOverLabor: string[];
  duplicateDispatchedEvents: string[];
  skippedDueEvents: string[];
  staleArmedFollowUps: string[];
  messages: string[];
}

export type ScheduledEventStatus = 'queued' | 'dispatched' | 'cancelled';

export interface ScheduledEvent {
  id: string;
  dueTurn: number;
  dueDay?: number;
  /** Defaults to `main` when dispatching. */
  duePhase?: TurnPhase;
  priority: number;
  kind: string;
  payload?: unknown;
  status: ScheduledEventStatus;
  enqueuedAtTurn: number;
  enqueuedAtSequence: number;
  dispatchedAtTurn?: number;
  dispatchedAtSequence?: number;
}

export interface PauseDiagnosticsState {
  paused: boolean;
  reason?: string;
  pausedAtTurn?: number;
  pausedAtDay?: number;
  pausedAtSequence?: number;
  resumeGeneration: number;
  blockedAdvanceCount: number;
}

export type FollowUpTrigger = 'obligation_fired' | 'event_dispatched';

export type FollowUpSpawnKind = 'obligation' | 'event';

export interface FollowUpRule {
  id: string;
  triggerRefId: string;
  trigger: FollowUpTrigger;
  dueTurnOffset: number;
  spawnKind: FollowUpSpawnKind;
  spawnId: string;
  spawnKindLabel: string;
  priority?: number;
  duePhase?: TurnPhase;
  status: 'armed' | 'consumed' | 'cancelled';
}

export interface TurnTimeSnapshot {
  clock: TurnClock;
  obligations: ScheduledObligation[];
  projects: ConstructionProject[];
  events: ScheduledEvent[];
  followUpRules: FollowUpRule[];
  pause: PauseDiagnosticsState;
  trace: EffectTraceEntry[];
}

export interface AdvanceOptions {
  /** Phases to run before rolling to the next turn (default: all three). */
  phases?: TurnPhase[];
  /** When true, increment dayIndex after `end` phase completes. */
  advanceDayOnEnd?: boolean;
  scope?: TurnScope;
}

export interface FastForwardOptions {
  targetTurn: number;
  targetDay?: number;
  scope?: TurnScope;
}

export interface RegisterObligationInput {
  id: string;
  dueTurn: number;
  dueDay?: number;
  priority?: number;
  kind: string;
  payload?: unknown;
}

export interface StartConstructionInput {
  id: string;
  laborTurnsRequired: number;
  startedTurn?: number;
  startedDay?: number;
}

export interface ScheduleEventInput {
  id: string;
  dueTurn: number;
  dueDay?: number;
  duePhase?: TurnPhase;
  priority?: number;
  kind: string;
  payload?: unknown;
}

export function deterministicEpochIso(turnIndex: number): string {
  const safeTurn = Number.isFinite(turnIndex) && turnIndex >= 1 ? turnIndex : 1;
  return new Date(FIXED_EPOCH_MS + (safeTurn - 1) * MS_PER_GAME_DAY).toISOString();
}

export function buildTurnKey(scope: TurnScope, turnIndex: number, dayIndex: number): string {
  return `${scope}:${turnIndex}:d${dayIndex}`;
}

export function buildPhaseToken(turnKey: string, phase: TurnPhase, channel: string): string {
  return `${turnKey}|${phase}|${channel}`;
}

// --- src/turn-sequence.ts ---

export function createInitialClock(turnIndex = 1, dayIndex = 1): TurnClock {
  const turn = Number.isFinite(turnIndex) && turnIndex >= 1 ? Math.floor(turnIndex) : 1;
  const day = Number.isFinite(dayIndex) && dayIndex >= 1 ? Math.floor(dayIndex) : 1;
  return {
    turnIndex: turn,
    dayIndex: day,
    effectSequence: 0,
    phase: 'start',
    epochIso: deterministicEpochIso(turn),
    phaseTokens: {},
  };
}

export function cloneClock(clock: TurnClock): TurnClock {
  return {
    ...clock,
    phaseTokens: { ...clock.phaseTokens },
  };
}

function nextSequence(clock: TurnClock): number {
  return clock.effectSequence + 1;
}

export interface PhaseEnterResult {
  clock: TurnClock;
  sequence: number;
  entered: boolean;
  token: string;
}

/**
 * Enters a phase at most once per (turnKey, phase, channel).
 * Returns `entered: false` when the token already exists (idempotent no-op).
 */
export function enterPhaseOnce(
  clock: TurnClock,
  phase: TurnPhase,
  scope: TurnScope,
  channel: string,
): PhaseEnterResult {
  const turnKey = buildTurnKey(scope, clock.turnIndex, clock.dayIndex);
  const token = buildPhaseToken(turnKey, phase, channel);
  if (clock.phaseTokens[token] !== undefined) {
    return { clock, sequence: clock.effectSequence, entered: false, token };
  }
  const sequence = nextSequence(clock);
  const next: TurnClock = {
    ...clock,
    phase,
    effectSequence: sequence,
    phaseTokens: { ...clock.phaseTokens, [token]: sequence },
  };
  return { clock: next, sequence, entered: true, token };
}

export interface AdvanceTurnResult {
  clock: TurnClock;
  completedPhases: TurnPhase[];
  rolledTurn: boolean;
}

/**
 * Runs the requested phases in order, then rolls turnIndex (+ optional day) after `end`.
 */
export function advanceTurnPhases(
  clock: TurnClock,
  options: AdvanceOptions = {},
): AdvanceTurnResult {
  const scope = options.scope ?? 'global';
  const phases = options.phases ?? [...TURN_PHASE_ORDER];
  const advanceDay = options.advanceDayOnEnd ?? true;

  let current = cloneClock(clock);
  const completed: TurnPhase[] = [];
  let rolled = false;

  for (const phase of phases) {
    const { clock: afterPhase, entered } = enterPhaseOnce(current, phase, scope, 'turn_engine');
    current = afterPhase;
    if (entered) {
      completed.push(phase);
    }
    if (phase === 'end' && entered) {
      const nextTurn = current.turnIndex + 1;
      const nextDay = advanceDay ? current.dayIndex + 1 : current.dayIndex;
      current = {
        ...current,
        turnIndex: nextTurn,
        dayIndex: nextDay,
        phase: 'start',
        epochIso: deterministicEpochIso(nextTurn),
      };
      rolled = true;
    }
  }

  return { clock: current, completedPhases: completed, rolledTurn: rolled };
}

export function compareTurnPhase(a: TurnPhase, b: TurnPhase): number {
  return TURN_PHASE_ORDER.indexOf(a) - TURN_PHASE_ORDER.indexOf(b);
}

// --- src/scheduled-obligations.ts ---

export function sortObligationsForTurn(obligations: ScheduledObligation[]): ScheduledObligation[] {
  return [...obligations].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id.localeCompare(b.id);
  });
}

export function registerObligation(
  obligations: ScheduledObligation[],
  input: RegisterObligationInput,
): ScheduledObligation[] {
  if (!input.id) {
    throw new Error('registerObligation: id is required');
  }
  if (obligations.some((o) => o.id === input.id)) {
    throw new Error(`registerObligation: duplicate id ${input.id}`);
  }
  const dueTurn = Math.floor(input.dueTurn);
  if (!Number.isFinite(dueTurn) || dueTurn < 1) {
    throw new Error(`registerObligation: invalid dueTurn for ${input.id}`);
  }
  const entry: ScheduledObligation = {
    id: input.id,
    dueTurn,
    dueDay: input.dueDay !== undefined ? Math.floor(input.dueDay) : undefined,
    priority: input.priority ?? 100,
    kind: input.kind,
    payload: input.payload,
    status: 'pending',
  };
  return [...obligations, entry];
}

export function cancelObligation(
  obligations: ScheduledObligation[],
  id: string,
): ScheduledObligation[] {
  return obligations.map((o) => (o.id === id && o.status === 'pending' ? { ...o, status: 'cancelled' } : o));
}

export function obligationsDueOnTurn(
  obligations: ScheduledObligation[],
  clock: TurnClock,
): ScheduledObligation[] {
  const pending = obligations.filter((o) => {
    if (o.status !== 'pending') return false;
    if (o.dueTurn !== clock.turnIndex) return false;
    if (o.dueDay !== undefined && o.dueDay !== clock.dayIndex) return false;
    return true;
  });
  return sortObligationsForTurn(pending);
}

export interface FireObligationResult {
  obligations: ScheduledObligation[];
  fired: ScheduledObligation | null;
  sequence: number;
}

/**
 * Marks a single pending obligation as fired. No-op if not pending.
 */
export function fireObligationOnce(
  obligations: ScheduledObligation[],
  id: string,
  clock: TurnClock,
  sequence: number,
): FireObligationResult {
  let fired: ScheduledObligation | null = null;
  const next = obligations.map((o) => {
    if (o.id !== id) return o;
    if (o.status !== 'pending') return o;
    fired = {
      ...o,
      status: 'fired',
      firedAtTurn: clock.turnIndex,
      firedAtSequence: sequence,
    };
    return fired;
  });
  return { obligations: next, fired, sequence };
}

export function pendingBeforeTurn(obligations: ScheduledObligation[], turnIndex: number): ScheduledObligation[] {
  return obligations.filter((o) => o.status === 'pending' && o.dueTurn < turnIndex);
}

export function firedIds(obligations: ScheduledObligation[]): string[] {
  return obligations.filter((o) => o.status === 'fired').map((o) => o.id);
}

// --- src/event-scheduling-queue.ts ---

export function sortEventsForDispatch(events: ScheduledEvent[]): ScheduledEvent[] {
  return [...events].sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id.localeCompare(b.id);
  });
}

export function enqueueScheduledEvent(
  events: ScheduledEvent[],
  clock: TurnClock,
  input: ScheduleEventInput,
): ScheduledEvent[] {
  if (!input.id) throw new Error('enqueueScheduledEvent: id is required');
  if (events.some((e) => e.id === input.id)) {
    throw new Error(`enqueueScheduledEvent: duplicate id ${input.id}`);
  }
  const dueTurn = Math.floor(input.dueTurn);
  if (!Number.isFinite(dueTurn) || dueTurn < 1) {
    throw new Error(`enqueueScheduledEvent: invalid dueTurn for ${input.id}`);
  }
  const entry: ScheduledEvent = {
    id: input.id,
    dueTurn,
    dueDay: input.dueDay !== undefined ? Math.floor(input.dueDay) : undefined,
    duePhase: input.duePhase ?? 'main',
    priority: input.priority ?? 100,
    kind: input.kind,
    payload: input.payload,
    status: 'queued',
    enqueuedAtTurn: clock.turnIndex,
    enqueuedAtSequence: clock.effectSequence,
  };
  return [...events, entry];
}

export function cancelScheduledEvent(events: ScheduledEvent[], id: string): ScheduledEvent[] {
  return events.map((e) => (e.id === id && e.status === 'queued' ? { ...e, status: 'cancelled' } : e));
}

export function eventsDueForDispatch(
  events: ScheduledEvent[],
  clock: TurnClock,
  phase: TurnPhase,
): ScheduledEvent[] {
  const due = events.filter((e) => {
    if (e.status !== 'queued') return false;
    if (e.dueTurn !== clock.turnIndex) return false;
    if (e.dueDay !== undefined && e.dueDay !== clock.dayIndex) return false;
    const duePhase = e.duePhase ?? 'main';
    if (duePhase !== phase) return false;
    return true;
  });
  return sortEventsForDispatch(due);
}

export interface DispatchEventResult {
  events: ScheduledEvent[];
  dispatched: ScheduledEvent | null;
  sequence: number;
}

export function dispatchScheduledEventOnce(
  events: ScheduledEvent[],
  id: string,
  clock: TurnClock,
  sequence: number,
): DispatchEventResult {
  let dispatched: ScheduledEvent | null = null;
  const next = events.map((e) => {
    if (e.id !== id) return e;
    if (e.status !== 'queued') return e;
    dispatched = {
      ...e,
      status: 'dispatched',
      dispatchedAtTurn: clock.turnIndex,
      dispatchedAtSequence: sequence,
    };
    return dispatched;
  });
  return { events: next, dispatched, sequence };
}

export function queuedEventsBeforeTurn(events: ScheduledEvent[], turnIndex: number): ScheduledEvent[] {
  return events.filter((e) => e.status === 'queued' && e.dueTurn < turnIndex);
}

export function dispatchedEventIds(events: ScheduledEvent[]): string[] {
  return events.filter((e) => e.status === 'dispatched').map((e) => e.id);
}

// --- src/multi-turn-construction.ts ---

export function startConstruction(
  projects: ConstructionProject[],
  clock: TurnClock,
  input: StartConstructionInput,
): ConstructionProject[] {
  if (!input.id) throw new Error('startConstruction: id is required');
  if (projects.some((p) => p.id === input.id)) {
    throw new Error(`startConstruction: duplicate id ${input.id}`);
  }
  const labor = Math.floor(input.laborTurnsRequired);
  if (!Number.isFinite(labor) || labor < 1) {
    throw new Error(`startConstruction: invalid laborTurnsRequired for ${input.id}`);
  }
  const startedTurn = input.startedTurn ?? clock.turnIndex;
  const startedDay = input.startedDay ?? clock.dayIndex;
  const project: ConstructionProject = {
    id: input.id,
    startedTurn,
    startedDay,
    laborTurnsRequired: labor,
    laborTurnsCompleted: 0,
    completionTurn: startedTurn + labor,
    status: 'under_construction',
  };
  return [...projects, project];
}

export interface LaborTickResult {
  projects: ConstructionProject[];
  project: ConstructionProject | null;
  sequence: number;
  completed: boolean;
}

/**
 * Applies one labor tick on `end` phase — at most once per turn per project (via lastLaborSequence).
 */
export function tickConstructionLaborOnce(
  projects: ConstructionProject[],
  projectId: string,
  clock: TurnClock,
  sequence: number,
): LaborTickResult {
  let touched: ConstructionProject | null = null;
  let completed = false;
  const next = projects.map((p) => {
    if (p.id !== projectId) return p;
    if (p.status !== 'under_construction') return p;
    if (p.lastLaborSequence !== undefined && p.lastLaborSequence >= sequence) {
      return p;
    }
    const laborTurnsCompleted = p.laborTurnsCompleted + 1;
    const done = laborTurnsCompleted >= p.laborTurnsRequired;
    touched = {
      ...p,
      laborTurnsCompleted,
      status: done ? 'completed' : 'under_construction',
      lastLaborSequence: sequence,
    };
    completed = done;
    return touched;
  });
  return { projects: next, project: touched, sequence, completed };
}

export function activeConstruction(projects: ConstructionProject[]): ConstructionProject[] {
  return projects.filter((p) => p.status === 'under_construction');
}

export function constructionDueForCompletion(projects: ConstructionProject[], turnIndex: number): ConstructionProject[] {
  return projects.filter(
    (p) => p.status === 'under_construction' && p.completionTurn <= turnIndex && p.laborTurnsCompleted < p.laborTurnsRequired,
  );
}

// --- src/defer-schedule.ts ---

export function deferObligationDueTurn(
  obligations: ScheduledObligation[],
  id: string,
  newDueTurn: number,
): ScheduledObligation[] {
  const due = Math.floor(newDueTurn);
  if (!Number.isFinite(due) || due < 1) {
    throw new Error(`deferObligationDueTurn: invalid dueTurn for ${id}`);
  }
  return obligations.map((o) => {
    if (o.id !== id) return o;
    if (o.status !== 'pending') return o;
    return { ...o, dueTurn: due };
  });
}

export function deferEventDueTurn(events: ScheduledEvent[], id: string, newDueTurn: number): ScheduledEvent[] {
  const due = Math.floor(newDueTurn);
  if (!Number.isFinite(due) || due < 1) {
    throw new Error(`deferEventDueTurn: invalid dueTurn for ${id}`);
  }
  return events.map((e) => {
    if (e.id !== id) return e;
    if (e.status !== 'queued') return e;
    return { ...e, dueTurn: due };
  });
}

export function obligationsDueThroughTurn(obligations: ScheduledObligation[], throughTurn: number): ScheduledObligation[] {
  return obligations.filter((o) => o.status === 'pending' && o.dueTurn <= throughTurn);
}

export function eventsDueThroughTurn(events: ScheduledEvent[], throughTurn: number): ScheduledEvent[] {
  return events.filter((e) => e.status === 'queued' && e.dueTurn <= throughTurn);
}

// --- src/delayed-consequences.ts ---

export type { FollowUpRule, FollowUpTrigger, FollowUpSpawnKind } from './types.js';

export interface RegisterFollowUpInput {
  id: string;
  triggerRefId: string;
  trigger: FollowUpTrigger;
  dueTurnOffset: number;
  spawnKind: FollowUpRule['spawnKind'];
  spawnId: string;
  spawnKindLabel: string;
  priority?: number;
  duePhase?: FollowUpRule['duePhase'];
}

export function registerFollowUpRule(rules: FollowUpRule[], input: RegisterFollowUpInput): FollowUpRule[] {
  if (rules.some((r) => r.id === input.id)) {
    throw new Error(`registerFollowUpRule: duplicate id ${input.id}`);
  }
  const offset = Math.floor(input.dueTurnOffset);
  if (!Number.isFinite(offset) || offset < 0) {
    throw new Error(`registerFollowUpRule: invalid dueTurnOffset for ${input.id}`);
  }
  const rule: FollowUpRule = {
    id: input.id,
    triggerRefId: input.triggerRefId,
    trigger: input.trigger,
    dueTurnOffset: offset,
    spawnKind: input.spawnKind,
    spawnId: input.spawnId,
    spawnKindLabel: input.spawnKindLabel,
    priority: input.priority,
    duePhase: input.duePhase,
    status: 'armed',
  };
  return [...rules, rule];
}

export interface ApplyFollowUpResult {
  rules: FollowUpRule[];
  obligations: ScheduledObligation[];
  events: ScheduledEvent[];
  scheduledIds: string[];
}

export function applyFollowUpsForTrigger(
  rules: FollowUpRule[],
  obligations: ScheduledObligation[],
  events: ScheduledEvent[],
  clock: TurnClock,
  trigger: FollowUpTrigger,
  triggerRefId: string,
): ApplyFollowUpResult {
  const scheduledIds: string[] = [];
  let nextRules = rules;
  let nextObligations = obligations;
  let nextEvents = events;

  for (const rule of rules) {
    if (rule.status !== 'armed') continue;
    if (rule.trigger !== trigger || rule.triggerRefId !== triggerRefId) continue;

    const dueTurn = clock.turnIndex + rule.dueTurnOffset;
    if (rule.spawnKind === 'obligation') {
      if (nextObligations.some((o) => o.id === rule.spawnId) || nextEvents.some((e) => e.id === rule.spawnId)) {
        continue;
      }
      const input: RegisterObligationInput = {
        id: rule.spawnId,
        dueTurn,
        priority: rule.priority,
        kind: rule.spawnKindLabel,
      };
      nextObligations = registerObligation(nextObligations, input);
      scheduledIds.push(rule.spawnId);
    } else {
      if (nextEvents.some((e) => e.id === rule.spawnId) || nextObligations.some((o) => o.id === rule.spawnId)) {
        continue;
      }
      const input: ScheduleEventInput = {
        id: rule.spawnId,
        dueTurn,
        duePhase: rule.duePhase,
        priority: rule.priority,
        kind: rule.spawnKindLabel,
      };
      nextEvents = enqueueScheduledEvent(nextEvents, clock, input);
      scheduledIds.push(rule.spawnId);
    }

    nextRules = nextRules.map((r) => (r.id === rule.id ? { ...r, status: 'consumed' } : r));
  }

  return { rules: nextRules, obligations: nextObligations, events: nextEvents, scheduledIds };
}

export function armedFollowUpCount(rules: FollowUpRule[]): number {
  return rules.filter((r) => r.status === 'armed').length;
}

// --- src/construction-pause-slip.ts ---

/** Extends completion turn when time was frozen (UI pause / blocked advances). */
export function slipActiveConstructionCompletion(
  projects: ConstructionProject[],
  slipTurns = 1,
): ConstructionProject[] {
  const slip = Math.max(0, Math.floor(slipTurns));
  if (slip === 0) return projects;
  return projects.map((p) => {
    if (p.status !== 'under_construction') return p;
    return { ...p, completionTurn: p.completionTurn + slip };
  });
}

export function totalPauseSlipApplied(projects: ConstructionProject[], baselineCompletion: number): number {
  const project = projects.find((p) => p.completionTurn > baselineCompletion);
  return project ? project.completionTurn - baselineCompletion : 0;
}

// --- src/cancel-cascade.ts ---

export function cancelArmedFollowUpsForTrigger(rules: FollowUpRule[], triggerRefId: string): FollowUpRule[] {
  return rules.map((r) => {
    if (r.status !== 'armed') return r;
    if (r.triggerRefId !== triggerRefId) return r;
    return { ...r, status: 'cancelled' };
  });
}

export function cancelArmedFollowUpsSpawnedAs(rules: FollowUpRule[], spawnId: string): FollowUpRule[] {
  return rules.map((r) => {
    if (r.status !== 'armed') return r;
    if (r.spawnId !== spawnId) return r;
    return { ...r, status: 'cancelled' };
  });
}

// --- src/turn-horizon.ts ---

export type PlannedEffectKind = 'obligation' | 'event' | 'construction_complete';

export interface PlannedEffect {
  turnIndex: number;
  dayIndex?: number;
  phase?: TurnPhase;
  kind: PlannedEffectKind;
  id: string;
  priority: number;
}

export function planEffectsThroughTurn(snapshot: TurnTimeSnapshot, throughTurn: number): PlannedEffect[] {
  const end = Math.floor(throughTurn);
  if (!Number.isFinite(end) || end < 1) {
    throw new Error('planEffectsThroughTurn: invalid throughTurn');
  }

  const planned: PlannedEffect[] = [];

  for (let turn = snapshot.clock.turnIndex; turn <= end; turn += 1) {
    const clockView = { ...snapshot.clock, turnIndex: turn };

    const obligations = sortObligationsForTurn(
      snapshot.obligations.filter((o) => o.status === 'pending' && o.dueTurn === turn),
    );
    for (const o of obligations) {
      planned.push({
        turnIndex: turn,
        dayIndex: o.dueDay,
        phase: 'main',
        kind: 'obligation',
        id: o.id,
        priority: o.priority,
      });
    }

    const events = sortEventsForDispatch(
      snapshot.events.filter((e) => e.status === 'queued' && e.dueTurn === turn),
    );
    for (const e of events) {
      planned.push({
        turnIndex: turn,
        dayIndex: e.dueDay,
        phase: e.duePhase ?? 'main',
        kind: 'event',
        id: e.id,
        priority: e.priority,
      });
    }

    for (const p of snapshot.projects) {
      if (p.status !== 'under_construction') continue;
      const finishTurn = p.startedTurn + p.laborTurnsRequired - 1;
      if (finishTurn === turn) {
        planned.push({
          turnIndex: turn,
          phase: 'end',
          kind: 'construction_complete',
          id: p.id,
          priority: 500,
        });
      }
    }
  }

  return planned.sort((a, b) => {
    if (a.turnIndex !== b.turnIndex) return a.turnIndex - b.turnIndex;
    if (a.priority !== b.priority) return a.priority - b.priority;
    return a.id.localeCompare(b.id);
  });
}

export function countPlannedThrough(planned: PlannedEffect[], throughTurn: number): number {
  return planned.filter((p) => p.turnIndex <= throughTurn).length;
}

// --- src/replay-compare.ts ---

export interface SnapshotCompareReport {
  digestA: string;
  digestB: string;
  digestMatch: boolean;
  auditDelta: Partial<Record<keyof TurnTimeAuditReport, { before: number | boolean; after: number | boolean }>>;
}

export function compareTurnTimeSnapshots(before: TurnTimeSnapshot, after: TurnTimeSnapshot): SnapshotCompareReport {
  const digestA = snapshotDigest(before);
  const digestB = snapshotDigest(after);
  const auditBefore = buildTurnTimeAuditReport(before);
  const auditAfter = buildTurnTimeAuditReport(after);
  const auditDelta: SnapshotCompareReport['auditDelta'] = {};

  (Object.keys(auditBefore) as (keyof TurnTimeAuditReport)[]).forEach((key) => {
    const b = auditBefore[key];
    const a = auditAfter[key];
    if (b !== a) {
      auditDelta[key] = { before: b, after: a };
    }
  });

  return {
    digestA,
    digestB,
    digestMatch: digestA === digestB,
    auditDelta,
  };
}

// --- src/pipeline-stages.ts ---

/** Stable OP10M stage ids for Agent 25 / cross-system XS-01 visibility. */
export const OP10M_AGENT02_PIPELINE_STAGE_IDS = [
  'ag02:phase.start',
  'ag02:phase.main',
  'ag02:phase.end',
  'ag02:effects.obligations',
  'ag02:effects.events',
  'ag02:effects.construction',
  'ag02:effects.follow_ups',
  'ag02:clock.roll',
  'ag02:advance.blocked',
] as const;

export type Op10mAgent02PipelineStageId = (typeof OP10M_AGENT02_PIPELINE_STAGE_IDS)[number];

export interface Agent02PipelineStageHit {
  stageId: Op10mAgent02PipelineStageId;
  turnIndex: number;
  dayIndex: number;
  sequence: number;
}

const PHASE_STAGE: Record<TurnPhase, Op10mAgent02PipelineStageId> = {
  start: 'ag02:phase.start',
  main: 'ag02:phase.main',
  end: 'ag02:phase.end',
};

function pushHit(
  hits: Agent02PipelineStageHit[],
  stageId: Op10mAgent02PipelineStageId,
  entry: EffectTraceEntry,
): void {
  hits.push({
    stageId,
    turnIndex: entry.turnIndex,
    dayIndex: entry.dayIndex,
    sequence: entry.sequence,
  });
}

export function derivePipelineStageHits(
  trace: EffectTraceEntry[],
  throughSequence?: number,
): Agent02PipelineStageHit[] {
  const hits: Agent02PipelineStageHit[] = [];
  for (const entry of trace) {
    if (throughSequence !== undefined && entry.sequence > throughSequence) break;
    switch (entry.kind) {
      case 'phase_enter':
        pushHit(hits, PHASE_STAGE[entry.phase], entry);
        break;
      case 'obligation_fired':
        pushHit(hits, 'ag02:effects.obligations', entry);
        break;
      case 'event_dispatched':
        pushHit(hits, 'ag02:effects.events', entry);
        break;
      case 'construction_labor':
      case 'construction_completed':
        pushHit(hits, 'ag02:effects.construction', entry);
        break;
      case 'follow_up_scheduled':
        pushHit(hits, 'ag02:effects.follow_ups', entry);
        break;
      case 'advance_blocked':
        pushHit(hits, 'ag02:advance.blocked', entry);
        break;
      default:
        break;
    }
  }
  return hits;
}

export interface Agent02PipelineTurnSummary {
  turnIndex: number;
  stageIds: Op10mAgent02PipelineStageId[];
  blocked: boolean;
  rolled: boolean;
}

export function summarizePipelineByTurn(
  trace: EffectTraceEntry[],
  activeTurnIndex?: number,
): Agent02PipelineTurnSummary[] {
  const byTurn = new Map<number, Agent02PipelineTurnSummary>();

  for (const entry of trace) {
    if (entry.kind === 'phase_enter') {
      const row = byTurn.get(entry.turnIndex) ?? {
        turnIndex: entry.turnIndex,
        stageIds: [],
        blocked: false,
        rolled: false,
      };
      const stage = PHASE_STAGE[entry.phase];
      if (!row.stageIds.includes(stage)) row.stageIds.push(stage);
      byTurn.set(entry.turnIndex, row);
    }
    if (entry.kind === 'advance_blocked') {
      const row = byTurn.get(entry.turnIndex) ?? {
        turnIndex: entry.turnIndex,
        stageIds: [],
        blocked: false,
        rolled: false,
      };
      row.blocked = true;
      if (!row.stageIds.includes('ag02:advance.blocked')) row.stageIds.push('ag02:advance.blocked');
      byTurn.set(entry.turnIndex, row);
    }
  }

  const turns = [...byTurn.keys()].sort((a, b) => a - b);
  for (const turn of turns) {
    const row = byTurn.get(turn)!;
    if (row.blocked) continue;
    const hasEnd = row.stageIds.includes('ag02:phase.end');
    const rolledByClock =
      activeTurnIndex !== undefined && activeTurnIndex > row.turnIndex && hasEnd;
    const next = turns[turns.indexOf(turn) + 1];
    row.rolled = rolledByClock || (hasEnd && next !== undefined && next === turn + 1);
    if (row.rolled && !row.stageIds.includes('ag02:clock.roll')) {
      row.stageIds.push('ag02:clock.roll');
    }
  }

  return [...byTurn.values()].sort((a, b) => a.turnIndex - b.turnIndex);
}

const REQUIRED_PHASE_STAGES: Op10mAgent02PipelineStageId[] = [
  'ag02:phase.start',
  'ag02:phase.main',
  'ag02:phase.end',
];

export function incompletePipelineTurns(trace: EffectTraceEntry[], activeTurnIndex?: number): number[] {
  const summaries = summarizePipelineByTurn(trace, activeTurnIndex);
  const incomplete: number[] = [];
  for (const row of summaries) {
    if (row.blocked) continue;
    const missingPhase = REQUIRED_PHASE_STAGES.some((s) => !row.stageIds.includes(s));
    if (missingPhase || !row.rolled) incomplete.push(row.turnIndex);
  }
  return incomplete;
}

export function listRegisteredPipelineStageIds(): Op10mAgent02PipelineStageId[] {
  return [...OP10M_AGENT02_PIPELINE_STAGE_IDS];
}

// --- src/plan-actual-reconcile.ts ---

export interface HorizonReconcileRow {
  turnIndex: number;
  plannedEffectIds: string[];
  actualEffectIds: string[];
  missing: string[];
  extra: string[];
  ok: boolean;
}

export interface HorizonReconcileReport {
  ok: boolean;
  rows: HorizonReconcileRow[];
}

function plannedIdsForTurn(planned: PlannedEffect[], turnIndex: number): string[] {
  return planned
    .filter((p) => p.turnIndex === turnIndex)
    .map((p) => `${p.kind}:${p.id}`)
    .sort((a, b) => a.localeCompare(b));
}

function actualIdsForTurn(after: TurnTimeSnapshot, turnIndex: number): string[] {
  const ids: string[] = [];
  for (const o of after.obligations) {
    if (o.status === 'fired' && o.firedAtTurn === turnIndex) {
      ids.push(`obligation:${o.id}`);
    }
  }
  for (const e of after.events) {
    if (e.status === 'dispatched' && e.dispatchedAtTurn === turnIndex) {
      ids.push(`event:${e.id}`);
    }
  }
  for (const entry of after.trace) {
    if (entry.turnIndex !== turnIndex) continue;
    if (entry.kind === 'construction_completed' && entry.refId) {
      ids.push(`construction_complete:${entry.refId}`);
    }
  }
  return ids.sort((a, b) => a.localeCompare(b));
}

function diffLists(planned: string[], actual: string[]): { missing: string[]; extra: string[] } {
  const p = new Set(planned);
  const a = new Set(actual);
  const missing = planned.filter((id) => !a.has(id));
  const extra = actual.filter((id) => !p.has(id));
  return { missing, extra };
}

/**
 * Compares horizon plan at `turnIndex` against snapshot delta after one full turn step from `before`.
 */
export function reconcileHorizonForTurn(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
  turnIndex: number,
): HorizonReconcileRow {
  const planned = planEffectsThroughTurn(before, turnIndex);
  const plannedEffectIds = plannedIdsForTurn(planned, turnIndex);
  const actualEffectIds = actualIdsForTurn(after, turnIndex);
  const { missing, extra } = diffLists(plannedEffectIds, actualEffectIds);
  return {
    turnIndex,
    plannedEffectIds,
    actualEffectIds,
    missing,
    extra,
    ok: missing.length === 0 && extra.length === 0,
  };
}

export function reconcileHorizonThroughTurns(
  initial: TurnTimeSnapshot,
  final: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
): HorizonReconcileReport {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  const rows: HorizonReconcileRow[] = [];
  for (let t = from; t <= to; t += 1) {
    rows.push(reconcileHorizonForTurn(initial, final, t));
  }
  const ok = rows.every((r) => r.ok);
  return { ok, rows };
}

/** After stepping, verify due effects on the stepped turn match the pre-step horizon. */
export function reconcileLastStepHorizon(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
): HorizonReconcileRow {
  const steppedTurn = before.clock.turnIndex;
  return reconcileHorizonForTurn(before, after, steppedTurn);
}

// --- src/advance-budget.ts ---

export interface TurnAdvanceBudgetState {
  limit: number;
  consumed: number;
}

export function createTurnAdvanceBudget(limit: number): TurnAdvanceBudgetState {
  const safe = Math.floor(limit);
  if (!Number.isFinite(safe) || safe < 1) {
    throw new Error('createTurnAdvanceBudget: limit must be >= 1');
  }
  return { limit: safe, consumed: 0 };
}

export interface AdvanceBudgetConsumeResult {
  state: TurnAdvanceBudgetState;
  allowed: boolean;
  remaining: number;
  detail?: string;
}

export function tryConsumeTurnAdvanceBudget(
  state: TurnAdvanceBudgetState,
  steps = 1,
): AdvanceBudgetConsumeResult {
  const count = Math.max(1, Math.floor(steps));
  const nextConsumed = state.consumed + count;
  if (nextConsumed > state.limit) {
    return {
      state,
      allowed: false,
      remaining: Math.max(0, state.limit - state.consumed),
      detail: `Turn advance budget exceeded (${nextConsumed}/${state.limit})`,
    };
  }
  return {
    state: { ...state, consumed: nextConsumed },
    allowed: true,
    remaining: state.limit - nextConsumed,
  };
}

export function advanceBudgetRemaining(state: TurnAdvanceBudgetState): number {
  return Math.max(0, state.limit - state.consumed);
}

// --- src/external-day-plan.ts ---

export interface ExternalDayPlanMergeResult {
  turnIndex: number;
  scheduledDueIds: string[];
  externalEventIds: string[];
  /** In Agent 05 plan but not scheduled on Agent 02 engine for this turn. */
  externalOnly: string[];
  /** Scheduled due on turn but absent from external narrative plan. */
  scheduledOnly: string[];
  ok: boolean;
}

function scheduledEventIdsDueOnTurn(snapshot: TurnTimeSnapshot, turnIndex: number): string[] {
  return snapshot.events
    .filter((e) => e.status === 'queued' && e.dueTurn === turnIndex)
    .map((e) => e.id)
    .sort((a, b) => a.localeCompare(b));
}

/**
 * XS-02 prep: reconcile Agent 05 narrative event ids with Agent 02 scheduled queue for one turn.
 * When `strict` is true, both orphan lists must be empty for `ok`.
 */
export function mergeExternalDayPlan(
  snapshot: TurnTimeSnapshot,
  turnIndex: number,
  externalEventIds: string[],
  strict = true,
): ExternalDayPlanMergeResult {
  const scheduledDueIds = scheduledEventIdsDueOnTurn(snapshot, turnIndex);
  const externalSorted = [...new Set(externalEventIds)].sort((a, b) => a.localeCompare(b));
  const scheduledSet = new Set(scheduledDueIds);
  const externalSet = new Set(externalSorted);
  const externalOnly = externalSorted.filter((id) => !scheduledSet.has(id));
  const scheduledOnly = scheduledDueIds.filter((id) => !externalSet.has(id));
  const ok = strict ? externalOnly.length === 0 && scheduledOnly.length === 0 : externalOnly.length === 0;
  return {
    turnIndex,
    scheduledDueIds,
    externalEventIds: externalSorted,
    externalOnly,
    scheduledOnly,
    ok,
  };
}

// --- src/external-day-plan-window.ts ---

export interface ExternalDayPlanWindowMergeResult {
  fromTurn: number;
  toTurn: number;
  turnResults: ExternalDayPlanMergeResult[];
  ok: boolean;
  failingTurns: number[];
}

function normalizeTurnWindow(fromTurn: number, toTurn: number): { from: number; to: number } {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  return { from, to };
}

/**
 * XS-02 extension: reconcile Agent 05 narrative ids across a turn window.
 */
export function mergeExternalDayPlanWindow(
  snapshot: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
  strict = true,
): ExternalDayPlanWindowMergeResult {
  const { from, to } = normalizeTurnWindow(fromTurn, toTurn);
  const turnResults: ExternalDayPlanMergeResult[] = [];
  const failingTurns: number[] = [];

  for (let turn = from; turn <= to; turn += 1) {
    const externalEventIds = externalByTurn[turn] ?? [];
    const row = mergeExternalDayPlan(snapshot, turn, [...externalEventIds], strict);
    turnResults.push(row);
    if (!row.ok) failingTurns.push(turn);
  }

  return {
    fromTurn: from,
    toTurn: to,
    turnResults,
    ok: failingTurns.length === 0,
    failingTurns,
  };
}

// --- src/external-day-plan-window-gate.ts ---

export interface ExternalDayPlanWindowGateResult {
  merge: ExternalDayPlanWindowMergeResult;
  incompletePipelineTurns: number[];
  turnsWithIncompletePipeline: number[];
  pipelineReady: boolean;
  ok: boolean;
}

function turnsInWindow(fromTurn: number, toTurn: number): number[] {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  const turns: number[] = [];
  for (let t = from; t <= to; t += 1) turns.push(t);
  return turns;
}

/**
 * XS-02 gate: narrative window merge must pass and completed turns in the window must have full pipeline rolls.
 */
export function gateExternalDayPlanWindow(
  snapshot: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
  strict = true,
): ExternalDayPlanWindowGateResult {
  const merge = mergeExternalDayPlanWindow(snapshot, fromTurn, toTurn, externalByTurn, strict);
  const incomplete = incompletePipelineTurns(snapshot.trace, snapshot.clock.turnIndex);
  const windowTurns = turnsInWindow(fromTurn, toTurn).filter((t) => t < snapshot.clock.turnIndex);
  const turnsWithIncompletePipeline = windowTurns.filter((t) => incomplete.includes(t));
  const pipelineReady = turnsWithIncompletePipeline.length === 0;
  return {
    merge,
    incompletePipelineTurns: incomplete,
    turnsWithIncompletePipeline,
    pipelineReady,
    ok: merge.ok && pipelineReady,
  };
}

// --- src/pipeline-stage-coverage.ts ---

export interface PipelineStageCoverageReport {
  registeredStageCount: number;
  observedStageIds: Op10mAgent02PipelineStageId[];
  missingStageIds: Op10mAgent02PipelineStageId[];
  hitCounts: Record<Op10mAgent02PipelineStageId, number>;
}

export function computePipelineStageCoverage(snapshot: TurnTimeSnapshot): PipelineStageCoverageReport {
  const registered = listRegisteredPipelineStageIds();
  const hitCounts = Object.fromEntries(
    registered.map((id) => [id, 0]),
  ) as Record<Op10mAgent02PipelineStageId, number>;

  for (const hit of derivePipelineStageHits(snapshot.trace)) {
    hitCounts[hit.stageId] = (hitCounts[hit.stageId] ?? 0) + 1;
  }

  const observedStageIds = registered.filter((id) => (hitCounts[id] ?? 0) > 0);
  const missingStageIds = registered.filter((id) => (hitCounts[id] ?? 0) === 0);

  return {
    registeredStageCount: registered.length,
    observedStageIds,
    missingStageIds,
    hitCounts,
  };
}

// --- src/pipeline-coverage-delta.ts ---

export interface PipelineStageCoverageDelta {
  before: PipelineStageCoverageReport;
  after: PipelineStageCoverageReport;
  newlyObservedStageIds: Op10mAgent02PipelineStageId[];
  hitCountDelta: Partial<Record<Op10mAgent02PipelineStageId, number>>;
}

export function computePipelineStageCoverageDelta(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
): PipelineStageCoverageDelta {
  const beforeReport = computePipelineStageCoverage(before);
  const afterReport = computePipelineStageCoverage(after);
  const beforeObserved = new Set(beforeReport.observedStageIds);
  const newlyObservedStageIds = afterReport.observedStageIds.filter((id) => !beforeObserved.has(id));

  const hitCountDelta: Partial<Record<Op10mAgent02PipelineStageId, number>> = {};
  for (const id of afterReport.observedStageIds) {
    const delta = (afterReport.hitCounts[id] ?? 0) - (beforeReport.hitCounts[id] ?? 0);
    if (delta !== 0) hitCountDelta[id] = delta;
  }

  return {
    before: beforeReport,
    after: afterReport,
    newlyObservedStageIds,
    hitCountDelta,
  };
}

// --- src/turn-pipeline-report.ts ---

export interface Agent02TurnPipelineReport {
  turnIndex: number;
  dayIndex: number;
  registeredStageCount: number;
  stageHitCount: number;
  incompleteTurns: number[];
  pipelineDigest: string;
  reconcileOk: boolean | null;
}

function pipelineDigestPayload(snapshot: TurnTimeSnapshot): string {
  const hits = derivePipelineStageHits(snapshot.trace);
  const summaries = summarizePipelineByTurn(snapshot.trace, snapshot.clock.turnIndex);
  return JSON.stringify({
    turnIndex: snapshot.clock.turnIndex,
    hits: hits.map((h) => [h.stageId, h.turnIndex, h.sequence]),
    summaries: summaries.map((s) => [s.turnIndex, s.blocked, s.rolled, s.stageIds]),
  });
}

export function computeTurnPipelineDigest(snapshot: TurnTimeSnapshot): string {
  return fnv1a64Hex(pipelineDigestPayload(snapshot));
}

export function buildAgent02TurnPipelineReport(
  after: TurnTimeSnapshot,
  before?: TurnTimeSnapshot,
): Agent02TurnPipelineReport {
  const reconcileOk = before ? reconcileLastStepHorizon(before, after).ok : null;
  return {
    turnIndex: after.clock.turnIndex,
    dayIndex: after.clock.dayIndex,
    registeredStageCount: listRegisteredPipelineStageIds().length,
    stageHitCount: derivePipelineStageHits(after.trace).length,
    incompleteTurns: incompletePipelineTurns(after.trace, after.clock.turnIndex),
    pipelineDigest: computeTurnPipelineDigest(after),
    reconcileOk,
  };
}

// --- src/diagnostics.ts ---

export function appendTrace(trace: EffectTraceEntry[], entry: Omit<EffectTraceEntry, 'sequence'> & { sequence: number }): EffectTraceEntry[] {
  return [...trace, entry];
}

export function validateTurnTimeIntegrity(
  clock: TurnClock,
  obligations: ScheduledObligation[],
  projects: ConstructionProject[],
  events: ScheduledEvent[] = [],
  followUpRules: FollowUpRule[] = [],
): IntegrityReport {
  const duplicateFired: string[] = [];
  const seenFired = new Map<string, number>();
  for (const o of obligations) {
    if (o.status !== 'fired') continue;
    const count = (seenFired.get(o.id) ?? 0) + 1;
    seenFired.set(o.id, count);
    if (count > 1) duplicateFired.push(o.id);
  }

  const skippedDue: string[] = [];
  const orphanPastPending: string[] = [];
  for (const o of obligations) {
    if (o.status !== 'pending') continue;
    if (o.dueTurn < clock.turnIndex) {
      orphanPastPending.push(o.id);
      skippedDue.push(o.id);
    }
  }

  const constructionOverLabor: string[] = [];
  for (const p of projects) {
    if (p.laborTurnsCompleted > p.laborTurnsRequired) {
      constructionOverLabor.push(p.id);
    }
    if (p.status === 'under_construction' && p.completionTurn < clock.turnIndex && p.laborTurnsCompleted < p.laborTurnsRequired) {
      skippedDue.push(`construction:${p.id}`);
    }
  }

  const duplicateDispatchedEvents: string[] = [];
  const seenDispatched = new Map<string, number>();
  for (const e of events) {
    if (e.status !== 'dispatched') continue;
    const count = (seenDispatched.get(e.id) ?? 0) + 1;
    seenDispatched.set(e.id, count);
    if (count > 1) duplicateDispatchedEvents.push(e.id);
  }

  const skippedDueEvents: string[] = [];
  for (const e of queuedEventsBeforeTurn(events, clock.turnIndex)) {
    skippedDueEvents.push(e.id);
    skippedDue.push(`event:${e.id}`);
  }

  const staleArmedFollowUps: string[] = [];
  for (const rule of followUpRules) {
    if (rule.status !== 'armed') continue;
    if (rule.trigger === 'obligation_fired') {
      const parent = obligations.find((o) => o.id === rule.triggerRefId);
      if (!parent || parent.status === 'cancelled') {
        staleArmedFollowUps.push(rule.id);
      } else if (parent.status === 'fired') {
        staleArmedFollowUps.push(rule.id);
      }
    } else {
      const parent = events.find((e) => e.id === rule.triggerRefId);
      if (!parent || parent.status === 'cancelled') {
        staleArmedFollowUps.push(rule.id);
      } else if (parent.status === 'dispatched') {
        staleArmedFollowUps.push(rule.id);
      }
    }
  }
  for (const id of staleArmedFollowUps) {
    skippedDue.push(`follow_up:${id}`);
  }

  const messages: string[] = [];
  if (duplicateFired.length) messages.push(`Duplicate fired obligations: ${duplicateFired.join(', ')}`);
  if (duplicateDispatchedEvents.length) {
    messages.push(`Duplicate dispatched events: ${duplicateDispatchedEvents.join(', ')}`);
  }
  if (skippedDue.length) messages.push(`Skipped due effects: ${skippedDue.join(', ')}`);
  if (skippedDueEvents.length) messages.push(`Skipped due events: ${skippedDueEvents.join(', ')}`);
  if (orphanPastPending.length) messages.push(`Past-due pending: ${orphanPastPending.join(', ')}`);
  if (constructionOverLabor.length) messages.push(`Construction over-labor: ${constructionOverLabor.join(', ')}`);
  if (staleArmedFollowUps.length) messages.push(`Stale armed follow-ups: ${staleArmedFollowUps.join(', ')}`);

  const ok =
    duplicateFired.length === 0 &&
    duplicateDispatchedEvents.length === 0 &&
    skippedDue.length === 0 &&
    orphanPastPending.length === 0 &&
    constructionOverLabor.length === 0 &&
    staleArmedFollowUps.length === 0;

  return {
    ok,
    duplicateFired,
    skippedDue,
    orphanPastPending,
    constructionOverLabor,
    duplicateDispatchedEvents,
    skippedDueEvents,
    staleArmedFollowUps,
    messages,
  };
}

export function diffFiredSets(before: string[], after: string[]): string[] {
  const b = new Set(before);
  return after.filter((id) => !b.has(id));
}

export function summarizeTrace(trace: EffectTraceEntry[]): Record<TurnPhase | 'total', number> {
  const summary: Record<TurnPhase | 'total', number> = {
    start: 0,
    main: 0,
    end: 0,
    total: trace.length,
  };
  for (const entry of trace) {
    summary[entry.phase] += 1;
  }
  return summary;
}

export function obligationsScheduledThroughTurn(
  obligations: ScheduledObligation[],
  throughTurn: number,
): ScheduledObligation[] {
  return obligations.filter((o) => o.dueTurn <= throughTurn && o.status !== 'cancelled');
}

export function countPendingDueThroughTurn(obligations: ScheduledObligation[], throughTurn: number): number {
  return obligations.filter((o) => o.status === 'pending' && o.dueTurn <= throughTurn).length;
}

export function assertNoPastPending(clock: TurnClock, obligations: ScheduledObligation[]): void {
  const past = pendingBeforeTurn(obligations, clock.turnIndex);
  if (past.length) {
    throw new Error(`Past pending obligations at turn ${clock.turnIndex}: ${past.map((p) => p.id).join(', ')}`);
  }
}

export function traceObligationFirings(trace: EffectTraceEntry[]): string[] {
  return trace.filter((t) => t.kind === 'obligation_fired').map((t) => t.refId ?? '');
}

export function traceEventDispatches(trace: EffectTraceEntry[]): string[] {
  return trace.filter((t) => t.kind === 'event_dispatched').map((t) => t.refId ?? '');
}

export function traceAdvanceBlocks(trace: EffectTraceEntry[]): number {
  return trace.filter((t) => t.kind === 'advance_blocked').length;
}

export function stableFiredIdList(obligations: ScheduledObligation[]): string[] {
  return firedIds(obligations).sort((a, b) => a.localeCompare(b));
}

export function stableDispatchedEventIds(events: ScheduledEvent[]): string[] {
  return dispatchedEventIds(events).sort((a, b) => a.localeCompare(b));
}

export function projectsBehindSchedule(projects: ConstructionProject[], clock: TurnClock): ConstructionProject[] {
  return constructionDueForCompletion(projects, clock.turnIndex);
}

// --- src/turn-audit.ts ---

export interface TurnTimeAuditReport {
  turnIndex: number;
  dayIndex: number;
  effectSequence: number;
  pendingObligations: number;
  firedObligations: number;
  queuedEvents: number;
  dispatchedEvents: number;
  activeConstruction: number;
  completedConstruction: number;
  armedFollowUps: number;
  paused: boolean;
  blockedAdvanceCount: number;
}

export function buildTurnTimeAuditReport(snapshot: TurnTimeSnapshot): TurnTimeAuditReport {
  const { clock, obligations, projects, events, pause, followUpRules } = snapshot;
  return {
    turnIndex: clock.turnIndex,
    dayIndex: clock.dayIndex,
    effectSequence: clock.effectSequence,
    pendingObligations: obligations.filter((o) => o.status === 'pending').length,
    firedObligations: obligations.filter((o) => o.status === 'fired').length,
    queuedEvents: events.filter((e) => e.status === 'queued').length,
    dispatchedEvents: events.filter((e) => e.status === 'dispatched').length,
    activeConstruction: projects.filter((p) => p.status === 'under_construction').length,
    completedConstruction: projects.filter((p) => p.status === 'completed').length,
    armedFollowUps: armedFollowUpCount(followUpRules),
    paused: pause.paused,
    blockedAdvanceCount: pause.blockedAdvanceCount,
  };
}

function stableSnapshotPayload(snapshot: TurnTimeSnapshot): string {
  const normalized = {
    clock: {
      turnIndex: snapshot.clock.turnIndex,
      dayIndex: snapshot.clock.dayIndex,
      effectSequence: snapshot.clock.effectSequence,
      phase: snapshot.clock.phase,
      epochIso: snapshot.clock.epochIso,
      phaseTokens: snapshot.clock.phaseTokens,
    },
    obligations: [...snapshot.obligations].sort((a, b) => a.id.localeCompare(b.id)),
    events: [...snapshot.events].sort((a, b) => a.id.localeCompare(b.id)),
    projects: [...snapshot.projects].sort((a, b) => a.id.localeCompare(b.id)),
    followUpRules: [...snapshot.followUpRules].sort((a, b) => a.id.localeCompare(b.id)),
    pause: snapshot.pause,
  };
  return JSON.stringify(normalized);
}

/** Browser-safe deterministic fingerprint (FNV-1a 64-bit). */
export function fnv1a64Hex(input: string): string {
  let hash = 0xcbf29ce484222325n;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= BigInt(input.charCodeAt(i));
    hash = (hash * 0x100000001b3n) & 0xffffffffffffffffn;
  }
  return hash.toString(16).padStart(16, '0');
}

export function snapshotDigest(snapshot: TurnTimeSnapshot): string {
  return fnv1a64Hex(stableSnapshotPayload(snapshot));
}

export function clockAtLeast(clock: TurnClock, turnIndex: number, dayIndex?: number): boolean {
  if (clock.turnIndex < turnIndex) return false;
  if (dayIndex !== undefined && clock.dayIndex < dayIndex) return false;
  return true;
}

// --- src/pause-resume.ts ---

export function createInitialPauseState(): PauseDiagnosticsState {
  return {
    paused: false,
    resumeGeneration: 0,
    blockedAdvanceCount: 0,
  };
}

export function clonePauseState(state: PauseDiagnosticsState): PauseDiagnosticsState {
  return { ...state };
}

export interface PauseTimeResult {
  pause: PauseDiagnosticsState;
  traceEntry: Omit<EffectTraceEntry, 'sequence'> & { sequence: number };
}

export function pauseTime(
  pause: PauseDiagnosticsState,
  clock: TurnClock,
  reason: string,
  sequence: number,
): PauseTimeResult {
  const next: PauseDiagnosticsState = {
    ...pause,
    paused: true,
    reason: reason || 'unspecified',
    pausedAtTurn: clock.turnIndex,
    pausedAtDay: clock.dayIndex,
    pausedAtSequence: sequence,
  };
  return {
    pause: next,
    traceEntry: {
      sequence,
      turnIndex: clock.turnIndex,
      dayIndex: clock.dayIndex,
      phase: clock.phase,
      kind: 'time_paused',
      detail: next.reason,
    },
  };
}

export interface ResumeTimeResult {
  pause: PauseDiagnosticsState;
  traceEntry: Omit<EffectTraceEntry, 'sequence'> & { sequence: number };
}

export function resumeTime(pause: PauseDiagnosticsState, clock: TurnClock, sequence: number): ResumeTimeResult {
  const next: PauseDiagnosticsState = {
    ...pause,
    paused: false,
    reason: undefined,
    pausedAtTurn: undefined,
    pausedAtDay: undefined,
    pausedAtSequence: undefined,
    resumeGeneration: pause.resumeGeneration + 1,
  };
  return {
    pause: next,
    traceEntry: {
      sequence,
      turnIndex: clock.turnIndex,
      dayIndex: clock.dayIndex,
      phase: clock.phase,
      kind: 'time_resumed',
      detail: String(next.resumeGeneration),
    },
  };
}

export function recordBlockedAdvance(
  pause: PauseDiagnosticsState,
  clock: TurnClock,
  sequence: number,
): { pause: PauseDiagnosticsState; traceEntry: Omit<EffectTraceEntry, 'sequence'> & { sequence: number } } {
  const next: PauseDiagnosticsState = {
    ...pause,
    blockedAdvanceCount: pause.blockedAdvanceCount + 1,
  };
  return {
    pause: next,
    traceEntry: {
      sequence,
      turnIndex: clock.turnIndex,
      dayIndex: clock.dayIndex,
      phase: clock.phase,
      kind: 'advance_blocked',
      detail: next.reason ?? 'paused',
    },
  };
}

export function appendPauseTrace(
  trace: EffectTraceEntry[],
  entry: Omit<EffectTraceEntry, 'sequence'> & { sequence: number },
): EffectTraceEntry[] {
  return appendTrace(trace, entry);
}

export function isTimePaused(pause: PauseDiagnosticsState): boolean {
  return pause.paused === true;
}

// --- src/engine.ts ---

export interface StepTurnResult {
  clockBefore: TurnClock;
  clockAfter: TurnClock;
  firedObligationIds: string[];
  dispatchedEventIds: string[];
  completedProjects: string[];
  traceEntries: EffectTraceEntry[];
  blockedByPause: boolean;
}

export class TurnTimeEngine {
  private clock: TurnClock;
  private obligations: ScheduledObligation[];
  private projects: ConstructionProject[];
  private events: ScheduledEvent[];
  private followUpRules: FollowUpRule[];
  private pauseState: PauseDiagnosticsState;
  private trace: EffectTraceEntry[];
  private traceConsumedThrough: number;

  constructor(snapshot?: Partial<TurnTimeSnapshot>) {
    this.clock = snapshot?.clock ? cloneClock(snapshot.clock) : createInitialClock();
    this.obligations = snapshot?.obligations ? snapshot.obligations.map((o) => ({ ...o })) : [];
    this.projects = snapshot?.projects ? snapshot.projects.map((p) => ({ ...p })) : [];
    this.events = snapshot?.events ? snapshot.events.map((e) => ({ ...e })) : [];
    this.followUpRules = snapshot?.followUpRules ? snapshot.followUpRules.map((r) => ({ ...r })) : [];
    this.pauseState = snapshot?.pause ? clonePauseState(snapshot.pause) : createInitialPauseState();
    this.trace = snapshot?.trace ? [...snapshot.trace] : [];
    this.traceConsumedThrough = this.trace.length;
  }

  static fromSnapshot(snapshot: TurnTimeSnapshot): TurnTimeEngine {
    return new TurnTimeEngine(snapshot);
  }

  snapshot(): TurnTimeSnapshot {
    return {
      clock: cloneClock(this.clock),
      obligations: this.obligations.map((o) => ({ ...o })),
      projects: this.projects.map((p) => ({ ...p })),
      events: this.events.map((e) => ({ ...e })),
      followUpRules: this.followUpRules.map((r) => ({ ...r })),
      pause: clonePauseState(this.pauseState),
      trace: [...this.trace],
    };
  }

  registerObligation(input: RegisterObligationInput): void {
    this.obligations = registerObligation(this.obligations, input);
  }

  cancelObligation(id: string): void {
    this.obligations = cancelObligation(this.obligations, id);
    this.followUpRules = cancelArmedFollowUpsForTrigger(this.followUpRules, id);
    this.followUpRules = cancelArmedFollowUpsSpawnedAs(this.followUpRules, id);
  }

  scheduleEvent(input: ScheduleEventInput): void {
    this.events = enqueueScheduledEvent(this.events, this.clock, input);
  }

  cancelEvent(id: string): void {
    this.events = cancelScheduledEvent(this.events, id);
    this.followUpRules = cancelArmedFollowUpsForTrigger(this.followUpRules, id);
    this.followUpRules = cancelArmedFollowUpsSpawnedAs(this.followUpRules, id);
  }

  cancelFollowUpsFor(triggerRefId: string): void {
    this.followUpRules = cancelArmedFollowUpsForTrigger(this.followUpRules, triggerRefId);
  }

  planThroughTurn(throughTurn: number): PlannedEffect[] {
    return planEffectsThroughTurn(this.snapshot(), throughTurn);
  }

  compareToSnapshot(other: TurnTimeSnapshot): SnapshotCompareReport {
    return compareTurnTimeSnapshots(this.snapshot(), other);
  }

  getPipelineStageHits(): Agent02PipelineStageHit[] {
    return derivePipelineStageHits(this.snapshot().trace);
  }

  getPipelineTurnSummaries(): Agent02PipelineTurnSummary[] {
    const snap = this.snapshot();
    return summarizePipelineByTurn(snap.trace, snap.clock.turnIndex);
  }

  getIncompletePipelineTurns(): number[] {
    const snap = this.snapshot();
    return incompletePipelineTurns(snap.trace, snap.clock.turnIndex);
  }

  listRegisteredPipelineStageIds(): Op10mAgent02PipelineStageId[] {
    return listRegisteredPipelineStageIds();
  }

  reconcileLastStepHorizon(before: TurnTimeSnapshot): HorizonReconcileRow {
    return reconcileLastStepHorizon(before, this.snapshot());
  }

  mergeExternalDayPlan(
    turnIndex: number,
    externalEventIds: string[],
    strict = true,
  ): ExternalDayPlanMergeResult {
    return mergeExternalDayPlan(this.snapshot(), turnIndex, externalEventIds, strict);
  }

  mergeExternalDayPlanWindow(
    fromTurn: number,
    toTurn: number,
    externalByTurn: Readonly<Record<number, readonly string[]>>,
    strict = true,
  ): ExternalDayPlanWindowMergeResult {
    return mergeExternalDayPlanWindow(this.snapshot(), fromTurn, toTurn, externalByTurn, strict);
  }

  getPipelineStageCoverage(): PipelineStageCoverageReport {
    return computePipelineStageCoverage(this.snapshot());
  }

  buildBatchAdvancePipelineReport(
    before: TurnTimeSnapshot,
    batch: BatchAdvanceResult,
  ): BatchAdvancePipelineReport {
    return buildBatchAdvancePipelineReport(before, this.snapshot(), batch);
  }

  stepTurnsWithBudgetPipelineReport(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
  ): BatchAdvanceWithPipelineReport {
    return stepTurnsWithBudgetPipelineReport(this, maxSteps, budget);
  }

  stepTurnsWithBudget(maxSteps: number, budget: TurnAdvanceBudgetState): BatchAdvanceResult {
    return stepTurnsWithBudget(this, maxSteps, budget);
  }

  gateExternalDayPlanWindow(
    fromTurn: number,
    toTurn: number,
    externalByTurn: Readonly<Record<number, readonly string[]>>,
    strict = true,
  ): ExternalDayPlanWindowGateResult {
    return gateExternalDayPlanWindow(this.snapshot(), fromTurn, toTurn, externalByTurn, strict);
  }

  getPipelineStageCoverageDelta(before: TurnTimeSnapshot): PipelineStageCoverageDelta {
    return computePipelineStageCoverageDelta(before, this.snapshot());
  }

  buildBatchHorizonReconcileReport(
    before: TurnTimeSnapshot,
    batch: BatchAdvanceResult,
  ): BatchHorizonReconcileReport {
    return buildBatchHorizonReconcileReport(before, this.snapshot(), batch);
  }

  buildBatchStepPipelineReports(before: TurnTimeSnapshot, batch: BatchAdvanceResult): BatchStepPipelineReportRow[] {
    return buildBatchStepPipelineReports(before, batch);
  }

  buildBatchAdvanceObservabilityRollup(
    before: TurnTimeSnapshot,
    batch: BatchAdvanceResult,
  ): BatchAdvanceObservabilityRollup {
    return buildBatchAdvanceObservabilityRollup(before, this.snapshot(), batch);
  }

  stepTurnsWithBudgetObservability(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
  ): BatchAdvanceWithObservability {
    return stepTurnsWithBudgetObservability(this, maxSteps, budget);
  }

  buildPipelineCoverageGapReport(): PipelineCoverageGapReport {
    return buildPipelineCoverageGapReport(this.snapshot());
  }

  computeBatchObservabilityDigest(rollup: BatchAdvanceObservabilityRollup): string {
    return computeBatchObservabilityDigest(rollup);
  }

  gateExternalDayPlanForBatch(
    batch: BatchAdvanceResult,
    externalByTurn: Readonly<Record<number, readonly string[]>>,
  ): ExternalDayPlanBatchGateResult {
    return gateExternalDayPlanForBatch(batch, externalByTurn);
  }

  buildAdvanceBudgetBatchReport(batch: BatchAdvanceResult): AdvanceBudgetBatchReport {
    return buildAdvanceBudgetBatchReport(batch);
  }

  gateBatchAdvanceReadiness(
    rollup: BatchAdvanceObservabilityRollup,
    externalByTurn?: Readonly<Record<number, readonly string[]>>,
    stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
    options?: BatchAdvanceReadinessGateOptions,
  ): BatchAdvanceReadinessGateResult {
    return gateBatchAdvanceReadiness(
      this.snapshot(),
      rollup,
      externalByTurn,
      stabilizationByTurn,
      options,
    );
  }

  stepTurnsWithBudgetReadinessGate(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    externalByTurn?: Readonly<Record<number, readonly string[]>>,
    stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
    options?: BatchAdvanceReadinessGateOptions,
  ): BatchAdvanceWithReadinessGate {
    return stepTurnsWithBudgetReadinessGate(
      this,
      maxSteps,
      budget,
      externalByTurn,
      stabilizationByTurn,
      options,
    );
  }

  buildBatchStabilizationReconcileReport(
    batch: BatchAdvanceResult,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
    options?: ExternalStabilizationBatchGateOptions,
  ): BatchStabilizationReconcileReport {
    return buildBatchStabilizationReconcileReport(batch, stabilizationByTurn, options);
  }

  gateExternalStabilizationForBatch(
    batch: BatchAdvanceResult,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
    options?: ExternalStabilizationBatchGateOptions,
  ): ExternalStabilizationBatchGateResult {
    return gateExternalStabilizationForBatch(batch, stabilizationByTurn, options);
  }

  computeBatchStabilizationDigest(report: BatchStabilizationReconcileReport): string {
    return computeBatchStabilizationDigest(report);
  }

  getQueueDepthSnapshot(): ReturnType<typeof queueDepthFromSnapshot> {
    return queueDepthFromSnapshot(this.snapshot());
  }

  stepTurnsWithBudgetStabilizationCapture(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
  ): ReturnType<typeof stepTurnsWithBudgetStabilizationCapture> {
    return stepTurnsWithBudgetStabilizationCapture(this, maxSteps, budget);
  }

  gateExternalStabilizationWindow(
    fromTurn: number,
    toTurn: number,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  ): ExternalStabilizationWindowGateResult {
    return gateExternalStabilizationWindow(this.snapshot(), fromTurn, toTurn, stabilizationByTurn);
  }

  mergeExternalStabilizationWindow(
    fromTurn: number,
    toTurn: number,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  ): ExternalStabilizationWindowMergeResult {
    return mergeExternalStabilizationWindow(fromTurn, toTurn, stabilizationByTurn);
  }

  gateStabilizationLatticeSequence(
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  ): StabilizationLatticeSequenceGateResult {
    return gateStabilizationLatticeSequence(stabilizationByTurn);
  }

  stepTurnsWithBudgetInstrumentedCompositeGate(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    composite?: Parameters<typeof stepTurnsWithBudgetInstrumentedCompositeGate>[3],
  ): BatchAdvanceWithInstrumentedCompositeGate {
    return stepTurnsWithBudgetInstrumentedCompositeGate(this, maxSteps, budget, composite);
  }

  computeBatchCompositeReadinessDigest(readiness: BatchAdvanceReadinessGateResult): string {
    return computeBatchCompositeReadinessDigest(readiness);
  }

  gateBatchAdvanceUnifiedPreconditions(
    input: BatchAdvanceUnifiedPreGateInput,
  ): BatchAdvanceUnifiedPreGateResult {
    return gateBatchAdvanceUnifiedPreconditions(this.snapshot(), input);
  }

  gateStabilizationBacklogRebound(
    batch: BatchAdvanceResult,
    capture: BatchStabilizationQueueCapture,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  ): StabilizationBacklogReboundGateResult {
    return gateStabilizationBacklogRebound(batch, capture, stabilizationByTurn);
  }

  buildBatchInstrumentedAdvanceReport(
    preGate: BatchAdvanceUnifiedPreGateResult | undefined,
    batch: BatchAdvanceResult,
    capture: BatchStabilizationQueueCapture,
    rollup: BatchAdvanceObservabilityRollup,
    readiness: BatchAdvanceReadinessGateResult,
    rebound?: StabilizationBacklogReboundGateResult,
  ): BatchInstrumentedAdvanceReport {
    return buildBatchInstrumentedAdvanceReport(
      preGate,
      batch,
      capture,
      rollup,
      readiness,
      rebound,
    );
  }

  stepTurnsWithBudgetFullInstrumentedGate(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    input?: Parameters<typeof stepTurnsWithBudgetFullInstrumentedGate>[3],
  ): BatchAdvanceWithFullInstrumentedGate {
    return stepTurnsWithBudgetFullInstrumentedGate(this, maxSteps, budget, input);
  }

  computeBatchInstrumentedAdvanceDigest(report: BatchInstrumentedAdvanceReport): string {
    return computeBatchInstrumentedAdvanceDigest(report);
  }

  computeBatchStabilizationAlignmentScore(
    ...args: Parameters<typeof computeBatchStabilizationAlignmentScore>
  ) {
    return computeBatchStabilizationAlignmentScore(...args);
  }

  gateBatchAdvancePostStabilization(
    batch: BatchAdvanceResult,
    capture: BatchStabilizationQueueCapture,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  ): BatchAdvancePostStabilizationGateResult {
    return gateBatchAdvancePostStabilization(this.snapshot(), batch, capture, stabilizationByTurn);
  }

  stepTurnsWithBudgetOrchestratedAdvance(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    input?: Parameters<typeof stepTurnsWithBudgetOrchestratedAdvance>[3],
  ): BatchAdvanceWithOrchestratedGate {
    return stepTurnsWithBudgetOrchestratedAdvance(this, maxSteps, budget, input);
  }

  computeBatchOrchestratedAdvanceDigest(report: BatchOrchestratedAdvanceReport): string {
    return computeBatchOrchestratedAdvanceDigest(report);
  }

  buildTurnPipelineReport(before?: TurnTimeSnapshot): Agent02TurnPipelineReport {
    return buildAgent02TurnPipelineReport(this.snapshot(), before);
  }

  getTurnPipelineDigest(): string {
    return computeTurnPipelineDigest(this.snapshot());
  }

  registerFollowUp(input: RegisterFollowUpInput): void {
    this.followUpRules = registerFollowUpRule(this.followUpRules, input);
  }

  deferObligation(id: string, newDueTurn: number): void {
    this.obligations = deferObligationDueTurn(this.obligations, id, newDueTurn);
  }

  deferEvent(id: string, newDueTurn: number): void {
    this.events = deferEventDueTurn(this.events, id, newDueTurn);
  }

  getAuditReport(): TurnTimeAuditReport {
    return buildTurnTimeAuditReport(this.snapshot());
  }

  getSnapshotDigest(): string {
    return snapshotDigest(this.snapshot());
  }

  startConstruction(input: StartConstructionInput): void {
    this.projects = startConstruction(this.projects, this.clock, input);
  }

  setPaused(reason: string): void {
    if (isTimePaused(this.pauseState)) return;
    const seq = this.clock.effectSequence + 1;
    const result = pauseTime(this.pauseState, this.clock, reason, seq);
    this.pauseState = result.pause;
    this.clock = { ...this.clock, effectSequence: seq };
    this.trace = appendTrace(this.trace, result.traceEntry);
  }

  clearPaused(): void {
    if (!isTimePaused(this.pauseState)) return;
    const seq = this.clock.effectSequence + 1;
    const result = resumeTime(this.pauseState, this.clock, seq);
    this.pauseState = result.pause;
    this.clock = { ...this.clock, effectSequence: seq };
    this.trace = appendTrace(this.trace, result.traceEntry);
  }

  getPauseDiagnostics(): PauseDiagnosticsState {
    return clonePauseState(this.pauseState);
  }

  validate(): IntegrityReport {
    return validateTurnTimeIntegrity(
      this.clock,
      this.obligations,
      this.projects,
      this.events,
      this.followUpRules,
    );
  }

  consumeTrace(): EffectTraceEntry[] {
    const out = this.trace.slice(this.traceConsumedThrough);
    this.traceConsumedThrough = this.trace.length;
    return out;
  }

  /**
   * Runs start → main → end for the current turn, firing due obligations and construction labor.
   */
  stepFullTurn(options: AdvanceOptions = {}): StepTurnResult {
    const clockBefore = cloneClock(this.clock);

    if (isTimePaused(this.pauseState)) {
      const seq = this.clock.effectSequence + 1;
      const blocked = recordBlockedAdvance(this.pauseState, this.clock, seq);
      this.pauseState = blocked.pause;
      this.clock = { ...this.clock, effectSequence: seq };
      this.projects = slipActiveConstructionCompletion(this.projects, 1);
      const blockedTrace = blocked.traceEntry;
      this.trace = appendTrace(this.trace, blockedTrace);
      return {
        clockBefore,
        clockAfter: cloneClock(this.clock),
        firedObligationIds: [],
        dispatchedEventIds: [],
        completedProjects: [],
        traceEntries: [blockedTrace],
        blockedByPause: true,
      };
    }

    const firedObligationIds: string[] = [];
    const dispatchedEventIds: string[] = [];
    const completedProjects: string[] = [];
    const traceEntries: EffectTraceEntry[] = [];
    const scope = options.scope ?? 'global';
    const phases = options.phases ?? [...TURN_PHASE_ORDER];
    const advanceDay = options.advanceDayOnEnd ?? true;

    for (const phase of phases) {
      const enter = enterPhaseOnce(this.clock, phase, scope, 'turn_engine');
      this.clock = enter.clock;
      if (!enter.entered) continue;

      const phaseTrace = {
        sequence: enter.sequence,
        turnIndex: clockBefore.turnIndex,
        dayIndex: clockBefore.dayIndex,
        phase,
        kind: 'phase_enter' as const,
        detail: enter.token,
      };
      this.trace = appendTrace(this.trace, phaseTrace);
      traceEntries.push(phaseTrace);

      if (phase === 'main') {
        this.runDueObligations(clockBefore, phase, firedObligationIds, traceEntries);
      }

      this.runDueEvents(clockBefore, phase, dispatchedEventIds, traceEntries);

      if (phase === 'end') {
        this.runConstructionLabor(clockBefore, phase, completedProjects, traceEntries);
        const nextTurn = clockBefore.turnIndex + 1;
        const nextDay = advanceDay ? clockBefore.dayIndex + 1 : clockBefore.dayIndex;
        this.clock = {
          ...this.clock,
          turnIndex: nextTurn,
          dayIndex: nextDay,
          phase: 'start',
          epochIso: deterministicEpochIso(nextTurn),
        };
      }
    }

    return {
      clockBefore,
      clockAfter: cloneClock(this.clock),
      firedObligationIds,
      dispatchedEventIds,
      completedProjects,
      traceEntries,
      blockedByPause: false,
    };
  }

  advance(options: AdvanceOptions = {}): StepTurnResult {
    return this.stepFullTurn(options);
  }

  private runDueObligations(
    turnView: TurnClock,
    phase: TurnPhase,
    firedObligationIds: string[],
    traceEntries: EffectTraceEntry[],
  ): void {
    const due = obligationsDueOnTurn(this.obligations, turnView);
    for (const obligation of due) {
      const seq = this.clock.effectSequence + 1;
      const fired = fireObligationOnce(this.obligations, obligation.id, turnView, seq);
      this.obligations = fired.obligations;
      if (!fired.fired) continue;
      this.clock = { ...this.clock, effectSequence: seq };
      firedObligationIds.push(obligation.id);
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: 'obligation_fired' as const,
        refId: obligation.id,
        detail: obligation.kind,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
      this.processFollowUps('obligation_fired', obligation.id, turnView, phase, traceEntries);
    }
  }

  private processFollowUps(
    trigger: 'obligation_fired' | 'event_dispatched',
    triggerRefId: string,
    turnView: TurnClock,
    phase: TurnPhase,
    traceEntries: EffectTraceEntry[],
  ): void {
    const applied = applyFollowUpsForTrigger(
      this.followUpRules,
      this.obligations,
      this.events,
      turnView,
      trigger,
      triggerRefId,
    );
    this.followUpRules = applied.rules;
    this.obligations = applied.obligations;
    this.events = applied.events;
    for (const spawnId of applied.scheduledIds) {
      const seq = this.clock.effectSequence + 1;
      this.clock = { ...this.clock, effectSequence: seq };
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: 'follow_up_scheduled' as const,
        refId: spawnId,
        detail: triggerRefId,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
    }
  }

  private runDueEvents(
    turnView: TurnClock,
    phase: TurnPhase,
    dispatchedEventIds: string[],
    traceEntries: EffectTraceEntry[],
  ): void {
    const due = eventsDueForDispatch(this.events, turnView, phase);
    for (const event of due) {
      const seq = this.clock.effectSequence + 1;
      const result = dispatchScheduledEventOnce(this.events, event.id, turnView, seq);
      this.events = result.events;
      if (!result.dispatched) continue;
      this.clock = { ...this.clock, effectSequence: seq };
      dispatchedEventIds.push(event.id);
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: 'event_dispatched' as const,
        refId: event.id,
        detail: event.kind,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
      this.processFollowUps('event_dispatched', event.id, turnView, phase, traceEntries);
    }
  }

  private runConstructionLabor(
    turnView: TurnClock,
    phase: TurnPhase,
    completedProjects: string[],
    traceEntries: EffectTraceEntry[],
  ): void {
    for (const project of activeConstruction(this.projects)) {
      const seq = this.clock.effectSequence + 1;
      const tick = tickConstructionLaborOnce(this.projects, project.id, turnView, seq);
      this.projects = tick.projects;
      if (!tick.project || tick.project.lastLaborSequence !== seq) continue;
      this.clock = { ...this.clock, effectSequence: seq };
      const t = {
        sequence: seq,
        turnIndex: turnView.turnIndex,
        dayIndex: turnView.dayIndex,
        phase,
        kind: tick.completed ? ('construction_completed' as const) : ('construction_labor' as const),
        refId: project.id,
      };
      this.trace = appendTrace(this.trace, t);
      traceEntries.push(t);
      if (tick.completed) completedProjects.push(project.id);
    }
  }
}

// --- src/batch-advance.ts ---

export interface BatchAdvanceResult {
  steps: StepTurnResult[];
  budget: TurnAdvanceBudgetState;
  completed: number;
  stoppedReason?: string;
  /** Per successful stepFullTurn, horizon plan vs actual for that turn. */
  horizonReconcileOk: boolean[];
}

/**
 * Steps up to `maxSteps` full turns, consuming advance budget per successful step.
 * Stops early on pause block or budget exhaustion.
 */
export function stepTurnsWithBudget(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceResult {
  const cap = Math.max(0, Math.floor(maxSteps));
  const steps: StepTurnResult[] = [];
  const horizonReconcileOk: boolean[] = [];
  let currentBudget = budget;
  let completed = 0;

  for (let i = 0; i < cap; i += 1) {
    const consume = tryConsumeTurnAdvanceBudget(currentBudget, 1);
    if (!consume.allowed) {
      return {
        steps,
        budget: currentBudget,
        completed,
        stoppedReason: consume.detail,
        horizonReconcileOk,
      };
    }
    const snapBefore = engine.snapshot();
    const step = engine.stepFullTurn();
    steps.push(step);
    currentBudget = consume.state;
    completed += 1;
    if (!step.blockedByPause) {
      horizonReconcileOk.push(reconcileLastStepHorizon(snapBefore, engine.snapshot()).ok);
    }
    if (step.blockedByPause) {
      return {
        steps,
        budget: currentBudget,
        completed,
        stoppedReason: 'paused',
        horizonReconcileOk,
      };
    }
  }

  return { steps, budget: currentBudget, completed, horizonReconcileOk };
}

// --- src/batch-pipeline-report.ts ---

export interface BatchAdvancePipelineReport {
  startedTurnIndex: number;
  endedTurnIndex: number;
  stepsCompleted: number;
  stoppedReason?: string;
  finalPipelineDigest: string;
  incompleteTurns: number[];
  horizonReconcileOk: boolean[];
  newStageIdsByStep: Op10mAgent02PipelineStageId[][];
  allHorizonReconcileOk: boolean;
}

export function buildBatchAdvancePipelineReport(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchAdvancePipelineReport {
  const finalReport = buildAgent02TurnPipelineReport(after, before);
  const newStageIdsByStep = batch.steps.map((step) => {
    const hits = derivePipelineStageHits(step.traceEntries);
    const unique = [...new Set(hits.map((h) => h.stageId))];
    return unique.sort((a, b) => a.localeCompare(b));
  });

  return {
    startedTurnIndex: before.clock.turnIndex,
    endedTurnIndex: after.clock.turnIndex,
    stepsCompleted: batch.completed,
    stoppedReason: batch.stoppedReason,
    finalPipelineDigest: finalReport.pipelineDigest,
    incompleteTurns: finalReport.incompleteTurns,
    horizonReconcileOk: batch.horizonReconcileOk ?? [],
    newStageIdsByStep,
    allHorizonReconcileOk: (batch.horizonReconcileOk ?? []).every(Boolean),
  };
}

export interface BatchAdvanceWithPipelineReport {
  batch: BatchAdvanceResult;
  report: BatchAdvancePipelineReport;
}

export function stepTurnsWithBudgetPipelineReport(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceWithPipelineReport {
  const before = engine.snapshot();
  const batch = stepTurnsWithBudget(engine, maxSteps, budget);
  const after = engine.snapshot();
  const report = buildBatchAdvancePipelineReport(before, after, batch);
  return { batch, report };
}

// --- src/batch-horizon-reconcile-report.ts ---

export interface BatchHorizonReconcileReport {
  steppedTurnCount: number;
  stepHorizonOk: boolean[];
  rangeReport: HorizonReconcileReport;
  allStepHorizonOk: boolean;
  ok: boolean;
}

export function buildBatchHorizonReconcileReport(
  initial: TurnTimeSnapshot,
  final: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchHorizonReconcileReport {
  const stepHorizonOk = batch.horizonReconcileOk ?? [];
  const steppedTurns = batch.steps
    .filter((s) => !s.blockedByPause)
    .map((s) => s.clockBefore.turnIndex);
  const fromTurn = steppedTurns[0] ?? initial.clock.turnIndex;
  const toTurn = steppedTurns[steppedTurns.length - 1] ?? fromTurn;
  const rangeReport =
    steppedTurns.length > 0
      ? reconcileHorizonThroughTurns(initial, final, fromTurn, toTurn)
      : { ok: true, rows: [] };
  const allStepHorizonOk = stepHorizonOk.every(Boolean);
  return {
    steppedTurnCount: steppedTurns.length,
    stepHorizonOk,
    rangeReport,
    allStepHorizonOk,
    ok: allStepHorizonOk && rangeReport.ok,
  };
}

// --- src/batch-step-pipeline-reports.ts ---

export interface BatchStepPipelineReportRow {
  turnIndex: number;
  report: Agent02TurnPipelineReport;
  coverageDelta: PipelineStageCoverageDelta;
}

function syntheticSnapshotAfterStep(
  base: TurnTimeSnapshot,
  clock: TurnClock,
  trace: TurnTimeSnapshot['trace'],
): TurnTimeSnapshot {
  return {
    ...base,
    clock,
    trace,
  };
}

export function buildBatchStepPipelineReports(
  before: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchStepPipelineReportRow[] {
  const rows: BatchStepPipelineReportRow[] = [];
  let trace = [...before.trace];
  let prev = before;

  for (const step of batch.steps) {
    trace = [...trace, ...step.traceEntries];
    const afterStep = syntheticSnapshotAfterStep(before, step.clockAfter, trace);
    const report = buildAgent02TurnPipelineReport(afterStep, prev);
    const coverageDelta = computePipelineStageCoverageDelta(prev, afterStep);
    rows.push({
      turnIndex: step.clockBefore.turnIndex,
      report,
      coverageDelta,
    });
    prev = afterStep;
  }

  return rows;
}

// --- src/batch-advance-observability.ts ---

export interface BatchAdvanceObservabilityRollup {
  batch: BatchAdvanceResult;
  pipeline: BatchAdvancePipelineReport;
  horizon: BatchHorizonReconcileReport;
  stepRows: BatchStepPipelineReportRow[];
  finalCoverageDelta: PipelineStageCoverageDelta;
  ok: boolean;
}

export function buildBatchAdvanceObservabilityRollup(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchAdvanceObservabilityRollup {
  const pipeline = buildBatchAdvancePipelineReport(before, after, batch);
  const horizon = buildBatchHorizonReconcileReport(before, after, batch);
  const stepRows = buildBatchStepPipelineReports(before, batch);
  const finalCoverageDelta = computePipelineStageCoverageDelta(before, after);
  return {
    batch,
    pipeline,
    horizon,
    stepRows,
    finalCoverageDelta,
    ok: pipeline.allHorizonReconcileOk && horizon.ok && pipeline.incompleteTurns.length === 0,
  };
}

export interface BatchAdvanceWithObservability {
  batch: BatchAdvanceResult;
  rollup: BatchAdvanceObservabilityRollup;
}

export function stepTurnsWithBudgetObservability(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceWithObservability {
  const before = engine.snapshot();
  const batch = stepTurnsWithBudget(engine, maxSteps, budget);
  const after = engine.snapshot();
  const rollup = buildBatchAdvanceObservabilityRollup(before, after, batch);
  return { batch, rollup };
}

// --- src/pipeline-coverage-gap-report.ts ---

export interface PipelineCoverageGapReport {
  coverage: PipelineStageCoverageReport;
  observedCount: number;
  missingStageIds: Op10mAgent02PipelineStageId[];
  coverageRatio: number;
  ok: boolean;
}

/** Lists registered pipeline stages not yet seen in the snapshot trace (Agent 25 gap export). */
export function buildPipelineCoverageGapReport(snapshot: TurnTimeSnapshot): PipelineCoverageGapReport {
  const coverage = computePipelineStageCoverage(snapshot);
  const observedCount = coverage.observedStageIds.length;
  const coverageRatio =
    coverage.registeredStageCount === 0 ? 1 : observedCount / coverage.registeredStageCount;
  return {
    coverage,
    observedCount,
    missingStageIds: coverage.missingStageIds,
    coverageRatio,
    ok: coverage.missingStageIds.length === 0,
  };
}

// --- src/batch-observability-digest.ts ---

export function computeBatchObservabilityDigest(rollup: BatchAdvanceObservabilityRollup): string {
  const payload = JSON.stringify({
    completed: rollup.batch.completed,
    stoppedReason: rollup.batch.stoppedReason ?? null,
    pipelineDigest: rollup.pipeline.finalPipelineDigest,
    horizonOk: rollup.horizon.ok,
    observabilityOk: rollup.ok,
    stepDigests: rollup.stepRows.map((row) => row.report.pipelineDigest),
    newStages: rollup.finalCoverageDelta.newlyObservedStageIds,
  });
  return fnv1a64Hex(payload);
}

// --- src/external-day-plan-batch-gate.ts ---

export interface ExternalDayPlanBatchGateResult {
  steppedTurns: number[];
  mergeResults: ExternalDayPlanMergeResult[];
  failingTurns: number[];
  ok: boolean;
}

/**
 * XS-02 batch gate: each stepped turn's narrative ids must match events dispatched during that step.
 */
export function gateExternalDayPlanForBatch(
  batch: BatchAdvanceResult,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
): ExternalDayPlanBatchGateResult {
  const steppedTurns: number[] = [];
  const mergeResults: ExternalDayPlanMergeResult[] = [];
  const failingTurns: number[] = [];

  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    const turn = step.clockBefore.turnIndex;
    steppedTurns.push(turn);
    const externalSorted = [...new Set(externalByTurn[turn] ?? [])].sort((a, b) => a.localeCompare(b));
    const dispatchedSorted = [...step.dispatchedEventIds].sort((a, b) => a.localeCompare(b));
    const externalSet = new Set(externalSorted);
    const dispatchedSet = new Set(dispatchedSorted);
    const externalOnly = externalSorted.filter((id) => !dispatchedSet.has(id));
    const scheduledOnly = dispatchedSorted.filter((id) => !externalSet.has(id));
    const ok = externalOnly.length === 0 && scheduledOnly.length === 0;
    mergeResults.push({
      turnIndex: turn,
      scheduledDueIds: dispatchedSorted,
      externalEventIds: externalSorted,
      externalOnly,
      scheduledOnly,
      ok,
    });
    if (!ok) failingTurns.push(turn);
  }

  return {
    steppedTurns,
    mergeResults,
    failingTurns,
    ok: failingTurns.length === 0,
  };
}

// --- src/external-stabilization-signals.ts ---

/** Agent 05 pending-response stabilization export (round 8+). */
export interface ExternalStabilizationTurnSignals {
  postQueueCalm: boolean;
  pendingStabilizationWave: boolean;
}

export function normalizeExternalStabilizationSignals(
  raw: ExternalStabilizationTurnSignals | undefined,
): ExternalStabilizationTurnSignals {
  return {
    postQueueCalm: raw?.postQueueCalm ?? false,
    pendingStabilizationWave: raw?.pendingStabilizationWave ?? false,
  };
}

export function externalStabilizationSignalsEqual(
  a: ExternalStabilizationTurnSignals,
  b: ExternalStabilizationTurnSignals,
): boolean {
  const left = normalizeExternalStabilizationSignals(a);
  const right = normalizeExternalStabilizationSignals(b);
  return (
    left.postQueueCalm === right.postQueueCalm &&
    left.pendingStabilizationWave === right.pendingStabilizationWave
  );
}

// --- src/agent02-stabilization-inference.ts ---

export interface Agent02QueueDepthSnapshot {
  pendingEventDueCount: number;
  pendingObligationDueCount: number;
}

export function queueDepthFromSnapshot(snapshot: TurnTimeSnapshot): Agent02QueueDepthSnapshot {
  const turn = snapshot.clock.turnIndex;
  const pendingEventDueCount = snapshot.events.filter(
    (e) => e.status === 'queued' && e.dueTurn <= turn,
  ).length;
  const pendingObligationDueCount = snapshot.obligations.filter(
    (o) => o.status === 'pending' && o.dueTurn <= turn,
  ).length;
  return { pendingEventDueCount, pendingObligationDueCount };
}

export function countAgent02QueueDepth(snapshot: Agent02QueueDepthSnapshot): number {
  return snapshot.pendingEventDueCount + snapshot.pendingObligationDueCount;
}

export function stepActivityCount(step: StepTurnResult): number {
  return step.dispatchedEventIds.length + step.firedObligationIds.length;
}

/**
 * Infer Agent 02-side stabilization flags from a batch step and due-queue depth after the step.
 */
export function inferAgent02StabilizationSignals(
  step: StepTurnResult,
  queueAfter: Agent02QueueDepthSnapshot,
): ExternalStabilizationTurnSignals {
  const backlogAfter = countAgent02QueueDepth(queueAfter);
  return {
    postQueueCalm: backlogAfter === 0,
    pendingStabilizationWave: false,
  };
}

/**
 * Stabilization wave: backlog drained on a turn with dispatch/fire activity (Agent 05 tranche9 lattice).
 */
export function inferPendingStabilizationWave(
  step: StepTurnResult,
  queueBefore: Agent02QueueDepthSnapshot,
  queueAfter: Agent02QueueDepthSnapshot,
): boolean {
  const before = countAgent02QueueDepth(queueBefore);
  const after = countAgent02QueueDepth(queueAfter);
  return before > 0 && after === 0 && stepActivityCount(step) > 0;
}

export function inferFullAgent02StabilizationSignals(
  step: StepTurnResult,
  queueBefore: Agent02QueueDepthSnapshot,
  queueAfter: Agent02QueueDepthSnapshot,
): ExternalStabilizationTurnSignals {
  const base = inferAgent02StabilizationSignals(step, queueAfter);
  return {
    postQueueCalm: base.postQueueCalm,
    pendingStabilizationWave: inferPendingStabilizationWave(step, queueBefore, queueAfter),
  };
}

// --- src/external-stabilization-batch-gate.ts ---

export interface ExternalStabilizationBatchTurnRow {
  turnIndex: number;
  external: ExternalStabilizationTurnSignals;
  inferred: ExternalStabilizationTurnSignals;
  ok: boolean;
}

export interface ExternalStabilizationBatchGateResult {
  steppedTurns: number[];
  rows: ExternalStabilizationBatchTurnRow[];
  failingTurns: number[];
  ok: boolean;
}

export interface ExternalStabilizationBatchGateOptions {
  /** Due counts at end of each stepped turn (enables wave inference). */
  queueAfterByTurn?: Readonly<Record<number, Agent02QueueDepthSnapshot>>;
  /** Due counts at start of each stepped turn (required for wave when queueAfter provided). */
  queueBeforeByTurn?: Readonly<Record<number, Agent02QueueDepthSnapshot>>;
}

function inferForStep(
  step: StepTurnResult,
  turn: number,
  options?: ExternalStabilizationBatchGateOptions,
): ExternalStabilizationTurnSignals {
  const after = options?.queueAfterByTurn?.[turn];
  if (!after) {
    return {
      postQueueCalm: stepActivityCount(step) === 0 || step.blockedByPause,
      pendingStabilizationWave: false,
    };
  }
  const before = options.queueBeforeByTurn?.[turn] ?? {
    pendingEventDueCount: 0,
    pendingObligationDueCount: 0,
  };
  return inferFullAgent02StabilizationSignals(step, before, after);
}

/**
 * XS-02 stabilization batch gate: Agent 05 calm/wave flags must match Agent 02 inferred signals per stepped turn.
 */
export function gateExternalStabilizationForBatch(
  batch: BatchAdvanceResult,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  options?: ExternalStabilizationBatchGateOptions,
): ExternalStabilizationBatchGateResult {
  const steppedTurns: number[] = [];
  const rows: ExternalStabilizationBatchTurnRow[] = [];
  const failingTurns: number[] = [];

  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    const turn = step.clockBefore.turnIndex;
    steppedTurns.push(turn);
    const external = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    const inferred = inferForStep(step, turn, options);
    const ok = externalStabilizationSignalsEqual(external, inferred);
    rows.push({ turnIndex: turn, external, inferred, ok });
    if (!ok) failingTurns.push(turn);
  }

  return {
    steppedTurns,
    rows,
    failingTurns,
    ok: failingTurns.length === 0,
  };
}

// --- src/batch-stabilization-reconcile-report.ts ---

export interface BatchStabilizationReconcileReport {
  steppedTurns: number[];
  externalCalmTurns: number;
  externalWaveTurns: number;
  inferredCalmTurns: number;
  inferredWaveTurns: number;
  alignedTurns: number;
  gate: ExternalStabilizationBatchGateResult;
  ok: boolean;
}

export function buildBatchStabilizationReconcileReport(
  batch: BatchAdvanceResult,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  options?: ExternalStabilizationBatchGateOptions,
): BatchStabilizationReconcileReport {
  const gate = gateExternalStabilizationForBatch(batch, stabilizationByTurn, options);
  let externalCalmTurns = 0;
  let externalWaveTurns = 0;
  let inferredCalmTurns = 0;
  let inferredWaveTurns = 0;
  let alignedTurns = 0;

  for (const row of gate.rows) {
    if (row.external.postQueueCalm) externalCalmTurns += 1;
    if (row.external.pendingStabilizationWave) externalWaveTurns += 1;
    if (row.inferred.postQueueCalm) inferredCalmTurns += 1;
    if (row.inferred.pendingStabilizationWave) inferredWaveTurns += 1;
    if (row.ok) alignedTurns += 1;
  }

  return {
    steppedTurns: gate.steppedTurns,
    externalCalmTurns,
    externalWaveTurns,
    inferredCalmTurns,
    inferredWaveTurns,
    alignedTurns,
    gate,
    ok: gate.ok,
  };
}

// --- src/batch-stabilization-digest.ts ---

export function computeBatchStabilizationDigest(report: BatchStabilizationReconcileReport): string {
  const payload = JSON.stringify({
    ok: report.ok,
    aligned: report.alignedTurns,
    externalCalm: report.externalCalmTurns,
    externalWave: report.externalWaveTurns,
    inferredCalm: report.inferredCalmTurns,
    inferredWave: report.inferredWaveTurns,
    failing: report.gate.failingTurns,
    turns: report.steppedTurns,
  });
  return fnv1a64Hex(payload);
}

// --- src/stabilization-lattice-sequence-gate.ts ---

export interface StabilizationLatticeSequenceViolation {
  turnIndex: number;
  code: 'wave_without_calm' | 'double_wave_without_backlog';
}

export interface StabilizationLatticeSequenceGateResult {
  orderedTurns: number[];
  violations: StabilizationLatticeSequenceViolation[];
  ok: boolean;
}

function orderedTurnKeys(
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): number[] {
  return Object.keys(stabilizationByTurn)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

/**
 * Agent 05 tranche9 lattice: stabilization waves must co-occur with post-queue calm on the same turn.
 */
export function gateStabilizationLatticeSequence(
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): StabilizationLatticeSequenceGateResult {
  const orderedTurns = orderedTurnKeys(stabilizationByTurn);
  const violations: StabilizationLatticeSequenceViolation[] = [];

  for (const turn of orderedTurns) {
    const signals = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    if (signals.pendingStabilizationWave && !signals.postQueueCalm) {
      violations.push({ turnIndex: turn, code: 'wave_without_calm' });
    }
  }

  for (let i = 1; i < orderedTurns.length; i += 1) {
    const prev = normalizeExternalStabilizationSignals(stabilizationByTurn[orderedTurns[i - 1]!]!);
    const curr = normalizeExternalStabilizationSignals(stabilizationByTurn[orderedTurns[i]!]!);
    if (prev.pendingStabilizationWave && curr.pendingStabilizationWave) {
      violations.push({ turnIndex: orderedTurns[i]!, code: 'double_wave_without_backlog' });
    }
  }

  return { orderedTurns, violations, ok: violations.length === 0 };
}

// --- src/external-stabilization-window.ts ---

export interface ExternalStabilizationWindowTurnRow {
  turnIndex: number;
  signals: ExternalStabilizationTurnSignals;
}

export interface ExternalStabilizationWindowMergeResult {
  fromTurn: number;
  toTurn: number;
  rows: ExternalStabilizationWindowTurnRow[];
  missingTurns: number[];
  lattice: StabilizationLatticeSequenceGateResult;
  ok: boolean;
}

export function listTurnsInStabilizationWindow(fromTurn: number, toTurn: number): number[] {
  const from = Math.max(1, Math.floor(fromTurn));
  const to = Math.max(from, Math.floor(toTurn));
  const turns: number[] = [];
  for (let t = from; t <= to; t += 1) turns.push(t);
  return turns;
}

/**
 * Validates Agent 05 stabilization export across a turn window (pre-batch plan check).
 */
export function mergeExternalStabilizationWindow(
  fromTurn: number,
  toTurn: number,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): ExternalStabilizationWindowMergeResult {
  const windowTurns = listTurnsInStabilizationWindow(fromTurn, toTurn);
  const rows: ExternalStabilizationWindowTurnRow[] = [];
  const missingTurns: number[] = [];
  const slice: Record<number, ExternalStabilizationTurnSignals> = {};

  for (const turn of windowTurns) {
    if (stabilizationByTurn[turn] === undefined) {
      missingTurns.push(turn);
      continue;
    }
    const signals = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    rows.push({ turnIndex: turn, signals });
    slice[turn] = signals;
  }

  const lattice = gateStabilizationLatticeSequence(slice);
  return {
    fromTurn: windowTurns[0] ?? fromTurn,
    toTurn: windowTurns[windowTurns.length - 1] ?? toTurn,
    rows,
    missingTurns,
    lattice,
    ok: missingTurns.length === 0 && lattice.ok,
  };
}

// --- src/external-stabilization-window-gate.ts ---

export interface ExternalStabilizationWindowGateResult {
  merge: ExternalStabilizationWindowMergeResult;
  incompletePipelineTurns: number[];
  turnsWithIncompletePipeline: number[];
  pipelineReady: boolean;
  ok: boolean;
}

/**
 * Pre-advance gate: stabilization window lattice + pipeline completeness for completed turns in range.
 */
export function gateExternalStabilizationWindow(
  snapshot: TurnTimeSnapshot,
  fromTurn: number,
  toTurn: number,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): ExternalStabilizationWindowGateResult {
  const merge = mergeExternalStabilizationWindow(fromTurn, toTurn, stabilizationByTurn);
  const incomplete = incompletePipelineTurns(snapshot.trace, snapshot.clock.turnIndex);
  const windowTurns = listTurnsInStabilizationWindow(fromTurn, toTurn).filter((t) => t < snapshot.clock.turnIndex);
  const turnsWithIncompletePipeline = windowTurns.filter((t) => incomplete.includes(t));
  const pipelineReady = turnsWithIncompletePipeline.length === 0;
  return {
    merge,
    incompletePipelineTurns: incomplete,
    turnsWithIncompletePipeline,
    pipelineReady,
    ok: merge.ok && pipelineReady,
  };
}

// --- src/batch-stabilization-queue-capture.ts ---

export interface BatchStabilizationQueueCapture {
  queueBeforeByTurn: Record<number, Agent02QueueDepthSnapshot>;
  queueAfterByTurn: Record<number, Agent02QueueDepthSnapshot>;
}

export interface BatchAdvanceWithStabilizationCapture {
  batch: BatchAdvanceResult;
  capture: BatchStabilizationQueueCapture;
}

export function batchStabilizationGateOptionsFromCapture(
  capture: BatchStabilizationQueueCapture,
): ExternalStabilizationBatchGateOptions {
  return {
    queueBeforeByTurn: capture.queueBeforeByTurn,
    queueAfterByTurn: capture.queueAfterByTurn,
  };
}

/**
 * Steps a batch while recording per-turn queue depth for Agent 05 stabilization inference.
 */
export function stepTurnsWithBudgetStabilizationCapture(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceWithStabilizationCapture {
  const cap = Math.max(0, Math.floor(maxSteps));
  const steps: BatchAdvanceResult['steps'] = [];
  const horizonReconcileOk: boolean[] = [];
  const queueBeforeByTurn: Record<number, Agent02QueueDepthSnapshot> = {};
  const queueAfterByTurn: Record<number, Agent02QueueDepthSnapshot> = {};
  let currentBudget = budget;
  let completed = 0;

  for (let i = 0; i < cap; i += 1) {
    const consume = tryConsumeTurnAdvanceBudget(currentBudget, 1);
    if (!consume.allowed) {
      return {
        batch: {
          steps,
          budget: currentBudget,
          completed,
          stoppedReason: consume.detail,
          horizonReconcileOk,
        },
        capture: { queueBeforeByTurn, queueAfterByTurn },
      };
    }
    const snapBefore = engine.snapshot();
    const turn = snapBefore.clock.turnIndex;
    queueBeforeByTurn[turn] = queueDepthFromSnapshot(snapBefore);
    const step = engine.stepFullTurn();
    steps.push(step);
    currentBudget = consume.state;
    completed += 1;
    if (!step.blockedByPause) {
      horizonReconcileOk.push(reconcileLastStepHorizon(snapBefore, engine.snapshot()).ok);
      queueAfterByTurn[turn] = queueDepthFromSnapshot(engine.snapshot());
    }
    if (step.blockedByPause) {
      return {
        batch: {
          steps,
          budget: currentBudget,
          completed,
          stoppedReason: 'paused',
          horizonReconcileOk,
        },
        capture: { queueBeforeByTurn, queueAfterByTurn },
      };
    }
  }

  return {
    batch: { steps, budget: currentBudget, completed, horizonReconcileOk },
    capture: { queueBeforeByTurn, queueAfterByTurn },
  };
}

/** Convenience: capture options from an already-run batch (single before/after only — prefer stepped capture). */
export function approximateQueueCaptureFromEndpoints(
  beforeTurn: number,
  afterSnapshot: TurnTimeSnapshot,
  beforeSnapshot: TurnTimeSnapshot,
): BatchStabilizationQueueCapture {
  return {
    queueBeforeByTurn: { [beforeTurn]: queueDepthFromSnapshot(beforeSnapshot) },
    queueAfterByTurn: { [beforeTurn]: queueDepthFromSnapshot(afterSnapshot) },
  };
}

// --- src/batch-composite-readiness-digest.ts ---

export function computeBatchCompositeReadinessDigest(
  readiness: BatchAdvanceReadinessGateResult,
): string {
  const payload = JSON.stringify({
    ok: readiness.ok,
    observability: readiness.digest,
    stabilization: readiness.stabilizationDigest ?? null,
    externalBatchOk: readiness.externalBatchOk,
    stabilizationBatchOk: readiness.stabilizationBatchOk,
    latticeOk: readiness.latticeSequenceOk,
  });
  return fnv1a64Hex(payload);
}

// --- src/advance-budget-batch-report.ts ---

export interface AdvanceBudgetBatchReport {
  limit: number;
  consumed: number;
  remaining: number;
  exhausted: boolean;
  stoppedForBudget: boolean;
}

export function buildAdvanceBudgetBatchReport(batch: BatchAdvanceResult): AdvanceBudgetBatchReport {
  const budget: TurnAdvanceBudgetState = batch.budget;
  const remaining = advanceBudgetRemaining(budget);
  return {
    limit: budget.limit,
    consumed: budget.consumed,
    remaining,
    exhausted: remaining === 0,
    stoppedForBudget: Boolean(batch.stoppedReason?.includes('budget')),
  };
}

// --- src/batch-advance-readiness-gate.ts ---

export interface BatchAdvanceReadinessGateResult {
  observabilityOk: boolean;
  externalBatchOk: boolean;
  stabilizationBatchOk: boolean;
  latticeSequenceOk: boolean;
  pipelineTurnsOk: boolean;
  budgetOk: boolean;
  coverageGap: PipelineCoverageGapReport;
  externalBatch?: ExternalDayPlanBatchGateResult;
  stabilizationBatch?: ExternalStabilizationBatchGateResult;
  stabilizationReconcile?: BatchStabilizationReconcileReport;
  latticeSequence?: StabilizationLatticeSequenceGateResult;
  budget: AdvanceBudgetBatchReport;
  digest: string;
  stabilizationDigest?: string;
  compositeDigest?: string;
  ok: boolean;
}

export interface BatchAdvanceReadinessGateOptions {
  stabilization?: ExternalStabilizationBatchGateOptions;
}

export function gateBatchAdvanceReadiness(
  finalSnapshot: TurnTimeSnapshot,
  rollup: BatchAdvanceObservabilityRollup,
  externalByTurn?: Readonly<Record<number, readonly string[]>>,
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  options?: BatchAdvanceReadinessGateOptions,
): BatchAdvanceReadinessGateResult {
  const coverageGap = buildPipelineCoverageGapReport(finalSnapshot);
  const externalBatch = externalByTurn
    ? gateExternalDayPlanForBatch(rollup.batch, externalByTurn)
    : undefined;
  const stabilizationReconcile = stabilizationByTurn
    ? buildBatchStabilizationReconcileReport(rollup.batch, stabilizationByTurn, options?.stabilization)
    : undefined;
  const stabilizationBatch = stabilizationReconcile?.gate;
  const latticeSequence = stabilizationByTurn
    ? gateStabilizationLatticeSequence(stabilizationByTurn)
    : undefined;
  const budget = buildAdvanceBudgetBatchReport(rollup.batch);
  const digest = computeBatchObservabilityDigest(rollup);
  const stabilizationDigest = stabilizationReconcile
    ? computeBatchStabilizationDigest(stabilizationReconcile)
    : undefined;

  const observabilityOk = rollup.ok;
  const externalBatchOk = externalBatch?.ok ?? true;
  const stabilizationBatchOk = stabilizationBatch?.ok ?? true;
  const latticeSequenceOk = latticeSequence?.ok ?? true;
  const pipelineTurnsOk = rollup.pipeline.incompleteTurns.length === 0;
  const budgetOk = !budget.stoppedForBudget || rollup.batch.completed > 0;

  const partial: BatchAdvanceReadinessGateResult = {
    observabilityOk,
    externalBatchOk,
    stabilizationBatchOk,
    latticeSequenceOk,
    pipelineTurnsOk,
    budgetOk,
    coverageGap,
    externalBatch,
    stabilizationBatch,
    stabilizationReconcile,
    latticeSequence,
    budget,
    digest,
    stabilizationDigest,
    ok:
      observabilityOk &&
      externalBatchOk &&
      stabilizationBatchOk &&
      latticeSequenceOk &&
      pipelineTurnsOk &&
      budgetOk,
  };

  return {
    ...partial,
    compositeDigest: computeBatchCompositeReadinessDigest(partial),
  };
}

// --- src/batch-advance-gated-step.ts ---

export interface BatchAdvanceWithReadinessGate {
  batch: BatchAdvanceResult;
  rollup: BatchAdvanceObservabilityRollup;
  readiness: BatchAdvanceReadinessGateResult;
}

export function stepTurnsWithBudgetReadinessGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  externalByTurn?: Readonly<Record<number, readonly string[]>>,
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  options?: BatchAdvanceReadinessGateOptions,
): BatchAdvanceWithReadinessGate {
  const { batch, rollup } = stepTurnsWithBudgetObservability(engine, maxSteps, budget);
  const readiness = gateBatchAdvanceReadiness(
    engine.snapshot(),
    rollup,
    externalByTurn,
    stabilizationByTurn,
    options,
  );
  return { batch, rollup, readiness };
}

// --- src/batch-advance-composite-gated-step.ts ---

export interface BatchAdvanceCompositeReadinessInput {
  externalByTurn?: Readonly<Record<number, readonly string[]>>;
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>;
  stabilization?: ExternalStabilizationBatchGateOptions;
}

export interface BatchAdvanceWithCompositeReadinessGate extends BatchAdvanceWithReadinessGate {
  readiness: BatchAdvanceReadinessGateResult;
}

/**
 * Round 9: XS-02 narrative batch plan + Agent 05 stabilization lattice on one stepped batch.
 */
export function stepTurnsWithBudgetCompositeReadinessGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  composite?: BatchAdvanceCompositeReadinessInput,
): BatchAdvanceWithCompositeReadinessGate {
  const gateOptions: BatchAdvanceReadinessGateOptions | undefined = composite?.stabilization
    ? { stabilization: composite.stabilization }
    : undefined;
  const { batch, rollup, readiness } = stepTurnsWithBudgetReadinessGate(
    engine,
    maxSteps,
    budget,
    composite?.externalByTurn,
    composite?.stabilizationByTurn,
    gateOptions,
  );
  return { batch, rollup, readiness };
}

// --- src/batch-advance-instrumented-composite-step.ts ---

export interface BatchAdvanceWithInstrumentedCompositeGate {
  batch: BatchAdvanceResult;
  rollup: BatchAdvanceObservabilityRollup;
  readiness: BatchAdvanceReadinessGateResult;
}

/**
 * Round 10: stepped batch with auto queue capture + composite readiness (XS-02 + Agent 05 lattice).
 */
export function stepTurnsWithBudgetInstrumentedCompositeGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  composite?: BatchAdvanceCompositeReadinessInput,
): BatchAdvanceWithInstrumentedCompositeGate {
  const before = engine.snapshot();
  const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, maxSteps, budget);
  const after = engine.snapshot();
  const rollup = buildBatchAdvanceObservabilityRollup(before, after, batch);
  const stabilizationOptions = composite?.stabilization ?? batchStabilizationGateOptionsFromCapture(capture);
  const readiness = gateBatchAdvanceReadiness(
    after,
    rollup,
    composite?.externalByTurn,
    composite?.stabilizationByTurn,
    { stabilization: stabilizationOptions },
  );
  return { batch, rollup, readiness };
}

export type InstrumentedCompositeInput = Omit<BatchAdvanceCompositeReadinessInput, 'stabilization'> & {
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>;
};

// --- src/batch-advance-unified-pregate.ts ---

export interface BatchAdvanceUnifiedPreGateInput {
  fromTurn: number;
  toTurn: number;
  externalByTurn?: Readonly<Record<number, readonly string[]>>;
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>;
}

export interface BatchAdvanceUnifiedPreGateResult {
  fromTurn: number;
  toTurn: number;
  dayPlan?: ExternalDayPlanWindowGateResult;
  stabilization?: ExternalStabilizationWindowGateResult;
  ok: boolean;
}

/**
 * Round 11: single pre-batch gate for XS-02 narrative window + Agent 05 stabilization window.
 */
export function gateBatchAdvanceUnifiedPreconditions(
  snapshot: TurnTimeSnapshot,
  input: BatchAdvanceUnifiedPreGateInput,
): BatchAdvanceUnifiedPreGateResult {
  const dayPlan = input.externalByTurn
    ? gateExternalDayPlanWindow(snapshot, input.fromTurn, input.toTurn, input.externalByTurn)
    : undefined;
  const stabilization = input.stabilizationByTurn
    ? gateExternalStabilizationWindow(snapshot, input.fromTurn, input.toTurn, input.stabilizationByTurn)
    : undefined;
  const dayOk = dayPlan?.ok ?? true;
  const stabOk = stabilization?.ok ?? true;
  return {
    fromTurn: input.fromTurn,
    toTurn: input.toTurn,
    dayPlan,
    stabilization,
    ok: dayOk && stabOk,
  };
}

// --- src/stabilization-backlog-rebound-gate.ts ---

export interface StabilizationBacklogReboundRow {
  priorTurn: number;
  turnIndex: number;
  backlogAfterPrior: number;
  backlogBeforeTurn: number;
  externalCalmOnTurn: boolean;
}

export interface StabilizationBacklogReboundGateResult {
  rows: StabilizationBacklogReboundRow[];
  reboundTurns: number[];
  ok: boolean;
}

/**
 * Agent 05 clears post-queue calm when backlog returns — calm must not persist on a rebound turn.
 */
export function gateStabilizationBacklogRebound(
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): StabilizationBacklogReboundGateResult {
  const steppedTurns: number[] = [];
  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    steppedTurns.push(step.clockBefore.turnIndex);
  }

  const rows: StabilizationBacklogReboundRow[] = [];
  const reboundTurns: number[] = [];

  for (let i = 1; i < steppedTurns.length; i += 1) {
    const priorTurn = steppedTurns[i - 1]!;
    const turn = steppedTurns[i]!;
    const afterPrior = capture.queueAfterByTurn[priorTurn];
    const beforeTurn = capture.queueBeforeByTurn[turn];
    if (!afterPrior || !beforeTurn) continue;

    const backlogAfterPrior = countAgent02QueueDepth(afterPrior);
    const backlogBeforeTurn = countAgent02QueueDepth(beforeTurn);
    const external = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    const rebound = backlogBeforeTurn > backlogAfterPrior;
    rows.push({
      priorTurn,
      turnIndex: turn,
      backlogAfterPrior,
      backlogBeforeTurn,
      externalCalmOnTurn: external.postQueueCalm,
    });
    if (rebound && external.postQueueCalm) {
      reboundTurns.push(turn);
    }
  }

  return { rows, reboundTurns, ok: reboundTurns.length === 0 };
}

// --- src/batch-instrumented-advance-report.ts ---

export interface BatchInstrumentedAdvanceReport {
  preGate?: BatchAdvanceUnifiedPreGateResult;
  batch: BatchAdvanceResult;
  capture: BatchStabilizationQueueCapture;
  rollup: BatchAdvanceObservabilityRollup;
  readiness: BatchAdvanceReadinessGateResult;
  rebound?: StabilizationBacklogReboundGateResult;
  ok: boolean;
}

export function buildBatchInstrumentedAdvanceReport(
  preGate: BatchAdvanceUnifiedPreGateResult | undefined,
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  rollup: BatchAdvanceObservabilityRollup,
  readiness: BatchAdvanceReadinessGateResult,
  rebound?: StabilizationBacklogReboundGateResult,
): BatchInstrumentedAdvanceReport {
  const reboundOk = rebound?.ok ?? true;
  const preOk = preGate?.ok ?? true;
  return {
    preGate,
    batch,
    capture,
    rollup,
    readiness,
    rebound,
    ok: preOk && readiness.ok && reboundOk,
  };
}

export function computeBatchInstrumentedAdvanceDigest(report: BatchInstrumentedAdvanceReport): string {
  const payload = JSON.stringify({
    ok: report.ok,
    pre: report.preGate?.ok ?? null,
    readiness: report.readiness.compositeDigest ?? report.readiness.digest,
    rebound: report.rebound?.reboundTurns ?? [],
    completed: report.batch.completed,
  });
  return fnv1a64Hex(payload);
}

// --- src/batch-advance-full-instrumented-step.ts ---

export interface BatchAdvanceFullInstrumentedInput extends BatchAdvanceCompositeReadinessInput {
  preGate?: BatchAdvanceUnifiedPreGateInput;
}

export interface BatchAdvanceWithFullInstrumentedGate {
  report: BatchInstrumentedAdvanceReport;
  instrumentedDigest: string;
}

/**
 * Round 11: unified pre-gate + instrumented batch + rebound gate + consolidated report.
 */
export function stepTurnsWithBudgetFullInstrumentedGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceFullInstrumentedInput,
): BatchAdvanceWithFullInstrumentedGate {
  const before = engine.snapshot();
  const preGate: BatchAdvanceUnifiedPreGateResult | undefined = input?.preGate
    ? gateBatchAdvanceUnifiedPreconditions(before, input.preGate)
    : undefined;

  const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, maxSteps, budget);
  const after = engine.snapshot();
  const rollup = buildBatchAdvanceObservabilityRollup(before, after, batch);
  const stabilizationOptions = input?.stabilization ?? batchStabilizationGateOptionsFromCapture(capture);
  const readiness = gateBatchAdvanceReadiness(
    after,
    rollup,
    input?.externalByTurn,
    input?.stabilizationByTurn,
    { stabilization: stabilizationOptions },
  );
  const rebound =
    input?.stabilizationByTurn !== undefined
      ? gateStabilizationBacklogRebound(batch, capture, input.stabilizationByTurn)
      : undefined;

  const report = buildBatchInstrumentedAdvanceReport(
    preGate,
    batch,
    capture,
    rollup,
    readiness,
    rebound,
  );
  return {
    report,
    instrumentedDigest: computeBatchInstrumentedAdvanceDigest(report),
  };
}

// --- src/batch-stabilization-alignment-score.ts ---

export interface BatchStabilizationAlignmentScore {
  steppedTurns: number;
  alignedTurns: number;
  ratio: number;
  ok: boolean;
}

export function computeBatchStabilizationAlignmentScore(
  reconcile: BatchStabilizationReconcileReport | undefined,
): BatchStabilizationAlignmentScore {
  if (!reconcile) {
    return { steppedTurns: 0, alignedTurns: 0, ratio: 1, ok: true };
  }
  const steppedTurns = reconcile.gate.rows.length;
  const alignedTurns = reconcile.alignedTurns;
  const ratio = steppedTurns === 0 ? 1 : alignedTurns / steppedTurns;
  return {
    steppedTurns,
    alignedTurns,
    ratio,
    ok: reconcile.ok && ratio === 1,
  };
}

// --- src/batch-advance-post-stabilization-gate.ts ---

export interface BatchAdvancePostStabilizationGateResult {
  lastSteppedTurn?: number;
  external?: ExternalStabilizationTurnSignals;
  inferred?: ExternalStabilizationTurnSignals;
  ok: boolean;
}

/**
 * Round 12: after batch, last stepped turn's Agent 05 flags must match final queue snapshot.
 */
export function gateBatchAdvancePostStabilization(
  finalSnapshot: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): BatchAdvancePostStabilizationGateResult {
  let lastStep: (typeof batch.steps)[number] | undefined;
  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    lastStep = step;
  }
  if (!lastStep) {
    return { ok: true };
  }

  const turn = lastStep.clockBefore.turnIndex;
  const external = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
  const before = capture.queueBeforeByTurn[turn] ?? queueDepthFromSnapshot(finalSnapshot);
  const after = queueDepthFromSnapshot(finalSnapshot);
  const inferred = inferFullAgent02StabilizationSignals(lastStep, before, after);
  const ok = externalStabilizationSignalsEqual(external, inferred);
  return { lastSteppedTurn: turn, external, inferred, ok };
}

// --- src/batch-orchestrated-advance-report.ts ---

export interface BatchOrchestratedAdvanceReport extends BatchInstrumentedAdvanceReport {
  alignment: BatchStabilizationAlignmentScore;
  postStabilization?: BatchAdvancePostStabilizationGateResult;
}

export function buildBatchOrchestratedAdvanceReport(
  instrumented: BatchInstrumentedAdvanceReport,
  alignment: BatchStabilizationAlignmentScore,
  postStabilization?: BatchAdvancePostStabilizationGateResult,
): BatchOrchestratedAdvanceReport {
  const postOk = postStabilization?.ok ?? true;
  return {
    ...instrumented,
    alignment,
    postStabilization,
    ok: instrumented.ok && alignment.ok && postOk,
  };
}

export function computeBatchOrchestratedAdvanceDigest(report: BatchOrchestratedAdvanceReport): string {
  const payload = JSON.stringify({
    ok: report.ok,
    instrumented: report.readiness.compositeDigest ?? report.readiness.digest,
    alignment: report.alignment.ratio,
    post: report.postStabilization?.lastSteppedTurn ?? null,
    completed: report.batch.completed,
  });
  return fnv1a64Hex(payload);
}

// --- src/batch-advance-orchestrated-step.ts ---

export interface BatchAdvanceOrchestratedInput extends BatchAdvanceFullInstrumentedInput {
  /** When true (default), do not step if unified pre-gate fails. */
  blockOnFailedPreGate?: boolean;
}

export interface BatchAdvanceWithOrchestratedGate {
  report: BatchOrchestratedAdvanceReport;
  orchestratedDigest: string;
}

function emptyBatch(budget: TurnAdvanceBudgetState): BatchAdvanceResult {
  return { steps: [], budget, completed: 0, horizonReconcileOk: [] };
}

function emptyCapture(): BatchStabilizationQueueCapture {
  return { queueBeforeByTurn: {}, queueAfterByTurn: {} };
}

function buildBlockedPreGateReport(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  preGate: BatchAdvanceUnifiedPreGateResult,
): BatchInstrumentedAdvanceReport {
  const before = engine.snapshot();
  const batch = emptyBatch(budget);
  const rollup = buildBatchAdvanceObservabilityRollup(before, before, batch);
  const readiness = gateBatchAdvanceReadiness(before, rollup);
  return buildBatchInstrumentedAdvanceReport(preGate, batch, emptyCapture(), rollup, {
    ...readiness,
    ok: false,
  });
}

/**
 * Round 12: orchestrated XS-02 + Agent 05 path — optional pre-gate block, alignment score, post-stabilization verify.
 */
export function stepTurnsWithBudgetOrchestratedAdvance(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchAdvanceWithOrchestratedGate {
  const blockOnFailedPreGate = input?.blockOnFailedPreGate !== false;
  const preGateResult = input?.preGate
    ? gateBatchAdvanceUnifiedPreconditions(engine.snapshot(), input.preGate)
    : undefined;

  if (preGateResult && !preGateResult.ok && blockOnFailedPreGate) {
    const instrumented = buildBlockedPreGateReport(engine, budget, preGateResult);
    const alignment = computeBatchStabilizationAlignmentScore(undefined);
    const report = buildBatchOrchestratedAdvanceReport(instrumented, alignment);
    return { report, orchestratedDigest: computeBatchOrchestratedAdvanceDigest(report) };
  }

  const run = stepTurnsWithBudgetFullInstrumentedGate(engine, maxSteps, budget, input);
  const alignment = computeBatchStabilizationAlignmentScore(
    run.report.readiness.stabilizationReconcile,
  );
  const postStabilization =
    input?.stabilizationByTurn !== undefined
      ? gateBatchAdvancePostStabilization(
          engine.snapshot(),
          run.report.batch,
          run.report.capture,
          input.stabilizationByTurn,
        )
      : undefined;
  const report = buildBatchOrchestratedAdvanceReport(run.report, alignment, postStabilization);
  return {
    report,
    orchestratedDigest: computeBatchOrchestratedAdvanceDigest(report),
  };
}

// --- src/fast-forward.ts ---

export interface FastForwardResult {
  snapshot: TurnTimeSnapshot;
  steps: StepTurnResult[];
  parityOk: boolean;
  parityDetail?: string;
}

/**
 * Advances deterministically to `targetTurn` by repeated single-turn steps.
 * Optionally verifies parity against a reference stepped engine (same initial state).
 */
export interface FastForwardBudgetResult {
  result: FastForwardResult;
  budget: TurnAdvanceBudgetState;
}

export function fastForwardToWithBudget(
  engine: TurnTimeEngine,
  options: FastForwardOptions,
  budget: TurnAdvanceBudgetState,
): FastForwardBudgetResult {
  let currentBudget = budget;
  const startTurn = engine.snapshot().clock.turnIndex;
  const targetTurn = Math.floor(options.targetTurn);
  const stepsNeeded = Math.max(0, targetTurn - startTurn);
  const consume = tryConsumeTurnAdvanceBudget(currentBudget, stepsNeeded);
  if (!consume.allowed) {
    return {
      budget: currentBudget,
      result: {
        snapshot: engine.snapshot(),
        steps: [],
        parityOk: false,
        parityDetail: consume.detail,
      },
    };
  }
  currentBudget = consume.state;
  return { budget: currentBudget, result: fastForwardTo(engine, options) };
}

export function fastForwardTo(
  engine: TurnTimeEngine,
  options: FastForwardOptions,
): FastForwardResult {
  const targetTurn = Math.floor(options.targetTurn);
  if (!Number.isFinite(targetTurn) || targetTurn < 1) {
    throw new Error('fastForwardTo: invalid targetTurn');
  }

  const steps: StepTurnResult[] = [];
  let current = engine.snapshot();

  if (current.pause.paused) {
    return {
      snapshot: current,
      steps,
      parityOk: false,
      parityDetail: 'fastForwardTo: engine is paused',
    };
  }

  let guard = 0;
  while (current.clock.turnIndex < targetTurn) {
    if (guard++ > 50_000) {
      throw new Error('fastForwardTo: step guard exceeded (possible pause loop)');
    }
    const step = engine.stepFullTurn({ scope: options.scope });
    steps.push(step);
    current = engine.snapshot();
  }

  if (options.targetDay !== undefined) {
    const targetDay = Math.floor(options.targetDay);
    while (current.clock.dayIndex < targetDay) {
      const step = engine.stepFullTurn({ scope: options.scope, advanceDayOnEnd: true });
      steps.push(step);
      current = engine.snapshot();
    }
  }

  const report = engine.validate();
  return {
    snapshot: current,
    steps,
    parityOk: report.ok,
    parityDetail: report.ok ? undefined : report.messages.join('; '),
  };
}

export interface FastForwardParityReport {
  ok: boolean;
  steppedFired: string[];
  fastFired: string[];
  steppedTrace: string[];
  fastTrace: string[];
}

/**
 * Proves fast-forward matches naive stepping from the same seed state.
 */
export function proveFastForwardParity(
  seed: TurnTimeSnapshot,
  targetTurn: number,
): FastForwardParityReport {
  const stepped = TurnTimeEngine.fromSnapshot(seed);
  while (stepped.snapshot().clock.turnIndex < targetTurn) {
    stepped.stepFullTurn();
  }

  const fast = TurnTimeEngine.fromSnapshot(seed);
  fastForwardTo(fast, { targetTurn });

  const steppedFired = stableFiredIdList(stepped.snapshot().obligations);
  const fastFired = stableFiredIdList(fast.snapshot().obligations);
  const steppedEvents = stableDispatchedEventIds(stepped.snapshot().events);
  const fastEvents = stableDispatchedEventIds(fast.snapshot().events);
  const steppedTrace = traceObligationFirings(stepped.snapshot().trace);
  const fastTrace = traceObligationFirings(fast.snapshot().trace);
  const steppedEventTrace = traceEventDispatches(stepped.snapshot().trace);
  const fastEventTrace = traceEventDispatches(fast.snapshot().trace);

  const ok =
    steppedFired.length === fastFired.length &&
    steppedFired.every((id, i) => id === fastFired[i]) &&
    steppedEvents.length === fastEvents.length &&
    steppedEvents.every((id, i) => id === fastEvents[i]) &&
    steppedTrace.length === fastTrace.length &&
    steppedTrace.every((id, i) => id === fastTrace[i]) &&
    steppedEventTrace.length === fastEventTrace.length &&
    steppedEventTrace.every((id, i) => id === fastEventTrace[i]);

  return { ok, steppedFired, fastFired, steppedTrace, fastTrace };
}

export function phasesThrough(phase: TurnPhase): TurnPhase[] {
  const idx = TURN_PHASE_ORDER.indexOf(phase);
  return TURN_PHASE_ORDER.slice(0, idx + 1) as TurnPhase[];
}

export function turnsBetweenInclusive(fromTurn: number, toTurn: number): number[] {
  const out: number[] = [];
  for (let t = fromTurn; t <= toTurn; t += 1) out.push(t);
  return out;
}

export const AGENT_02_MODULE_ID = 'operation-10m/agent-02-turns-time';

export const AGENT_02_MODULE_VERSION = '2.2.0';



export function runOp10mAgent02TurnsTimeSelfTests(): {

  passed: number;

  failed: number;

  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;

} {

  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];

  const engine = new TurnTimeEngine();

  engine.registerObligation({ id: 'self_ob', dueTurn: 1, kind: 'self_test' });

  const step = engine.stepFullTurn();

  results.push({

    id: 'agent02_obligation_once',

    name: 'obligation fires once on turn 1',

    passed:

      step.firedObligationIds.length === 1 &&

      step.firedObligationIds[0] === 'self_ob' &&

      engine.snapshot().obligations[0]?.status === 'fired',

  });

  const paused = new TurnTimeEngine();

  paused.scheduleEvent({ id: 'self_ev', dueTurn: 1, kind: 'tick' });

  paused.setPaused('self_test');

  const blocked = paused.stepFullTurn();

  results.push({

    id: 'agent02_pause_blocks',

    name: 'pause blocks turn advance',

    passed:

      blocked.blockedByPause === true &&

      blocked.clockBefore.turnIndex === blocked.clockAfter.turnIndex,

  });

  paused.clearPaused();

  paused.stepFullTurn();

  results.push({

    id: 'agent02_integrity',

    name: 'validate() ok after resume step',

    passed: paused.validate().ok,

  });

  const chain = new TurnTimeEngine();

  chain.registerObligation({ id: 'parent', dueTurn: 1, kind: 'seed' });

  chain.registerFollowUp({

    id: 'fu1',

    triggerRefId: 'parent',

    trigger: 'obligation_fired',

    dueTurnOffset: 1,

    spawnKind: 'obligation',

    spawnId: 'child',

    spawnKindLabel: 'ripple',

  });

  chain.stepFullTurn();

  chain.stepFullTurn();

  results.push({

    id: 'agent02_follow_up',

    name: 'follow-up obligation fires on schedule',

    passed: chain.snapshot().obligations.find((o) => o.id === 'child')?.status === 'fired',

  });

  const horizon = new TurnTimeEngine();

  horizon.registerObligation({ id: 'h1', dueTurn: 2, kind: 'h' });

  results.push({

    id: 'agent02_horizon',

    name: 'turn horizon lists pending obligation',

    passed: horizon.planThroughTurn(2).some((p) => p.id === 'h1'),

  });

  const pipeline = new TurnTimeEngine();

  pipeline.registerObligation({ id: 'pipe', dueTurn: 1, kind: 'pipe' });

  const pipeBefore = pipeline.snapshot();

  pipeline.stepFullTurn();

  results.push({

    id: 'agent02_pipeline',

    name: 'pipeline stages recorded for full turn',

    passed:

      pipeline.listRegisteredPipelineStageIds().length === 9 &&

      pipeline.getPipelineStageHits().some((h) => h.stageId === 'ag02:phase.end') &&

      pipeline.reconcileLastStepHorizon(pipeBefore).ok,

  });

  const dayPlan = new TurnTimeEngine();

  dayPlan.scheduleEvent({ id: 'xs_ev', dueTurn: 1, kind: 'xs' });

  results.push({

    id: 'agent02_day_plan',

    name: 'external day plan merge ok when aligned',

    passed: dayPlan.mergeExternalDayPlan(1, ['xs_ev']).ok,

  });

  const windowPlan = new TurnTimeEngine();

  windowPlan.scheduleEvent({ id: 'w1', dueTurn: 1, kind: 'w' });

  windowPlan.scheduleEvent({ id: 'w2', dueTurn: 2, kind: 'w' });

  results.push({

    id: 'agent02_day_plan_window',

    name: 'external day plan window merge ok when aligned',

    passed: windowPlan.mergeExternalDayPlanWindow(1, 2, { 1: ['w1'], 2: ['w2'] }).ok,

  });

  const gatePlan = new TurnTimeEngine();

  gatePlan.scheduleEvent({ id: 'g1', dueTurn: 1, kind: 'g' });

  results.push({

    id: 'agent02_day_plan_gate',

    name: 'XS-02 window gate ok before turn advance',

    passed: gatePlan.gateExternalDayPlanWindow(1, 1, { 1: ['g1'] }).ok,

  });

  const obs = new TurnTimeEngine();

  obs.registerObligation({ id: 'obs1', dueTurn: 1, kind: 'k' });

  const obsRun = obs.stepTurnsWithBudgetObservability(1, createTurnAdvanceBudget(2));

  results.push({

    id: 'agent02_batch_observability',

    name: 'batch observability rollup ok after one step',

    passed: obsRun.rollup.ok && obsRun.rollup.stepRows.length === 1,

  });

  const gap = new TurnTimeEngine();

  gap.registerObligation({ id: 'gap1', dueTurn: 1, kind: 'k' });

  gap.stepFullTurn();

  results.push({

    id: 'agent02_coverage_gap',

    name: 'pipeline coverage gap report lists observed stages',

    passed:

      gap.buildPipelineCoverageGapReport().observedCount >= 1 &&

      gap.buildPipelineCoverageGapReport().coverage.registeredStageCount === 9,

  });

  const ready = new TurnTimeEngine();

  ready.scheduleEvent({ id: 'rb1', dueTurn: 1, kind: 'n' });

  ready.registerObligation({ id: 'rb2', dueTurn: 1, kind: 'k' });

  const readyRun = ready.stepTurnsWithBudgetReadinessGate(1, createTurnAdvanceBudget(2), { 1: ['rb1'] });

  results.push({

    id: 'agent02_batch_readiness_gate',

    name: 'batch readiness gate ok with aligned XS-02 batch plan',

    passed:

      readyRun.readiness.ok &&

      readyRun.readiness.digest.length === 16 &&

      readyRun.readiness.externalBatch?.ok === true,

  });

  const stab = new TurnTimeEngine();

  stab.scheduleEvent({ id: 'st1', dueTurn: 1, kind: 'n' });

  const stabBatch = stab.stepTurnsWithBudget(1, createTurnAdvanceBudget(2));

  results.push({

    id: 'agent02_stabilization_batch_gate',

    name: 'stabilization batch gate ok when wave aligns with queue drain',

    passed: stab.gateExternalStabilizationForBatch(stabBatch, {

      1: { postQueueCalm: true, pendingStabilizationWave: true },

    }, {

      queueBeforeByTurn: { 1: { pendingEventDueCount: 1, pendingObligationDueCount: 0 } },

      queueAfterByTurn: { 1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 } },

    }).ok,

  });

  const composite = new TurnTimeEngine();

  const compositeRun = stepTurnsWithBudgetCompositeReadinessGate(composite, 1, createTurnAdvanceBudget(2), {

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },

  });

  results.push({

    id: 'agent02_composite_readiness',

    name: 'composite readiness gate ok on calm idle batch step',

    passed:

      compositeRun.readiness.ok &&

      compositeRun.readiness.stabilizationBatchOk === true,

  });

  const lattice = new TurnTimeEngine();

  results.push({

    id: 'agent02_stabilization_lattice',

    name: 'stabilization lattice rejects wave without calm',

    passed:

      !lattice.gateStabilizationLatticeSequence({

        1: { postQueueCalm: false, pendingStabilizationWave: true },

      }).ok,

  });

  const instrumented = new TurnTimeEngine();

  instrumented.scheduleEvent({ id: 'inst', dueTurn: 1, kind: 'n' });

  const instRun = stepTurnsWithBudgetInstrumentedCompositeGate(instrumented, 1, createTurnAdvanceBudget(2), {

    externalByTurn: { 1: ['inst'] },

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },

  });

  results.push({

    id: 'agent02_instrumented_composite',

    name: 'instrumented composite gate with auto queue capture',

    passed:

      instRun.readiness.ok &&

      (instRun.readiness.compositeDigest?.length ?? 0) === 16,

  });

  const unified = new TurnTimeEngine();

  unified.scheduleEvent({ id: 'un', dueTurn: 1, kind: 'n' });

  results.push({

    id: 'agent02_unified_pregate',

    name: 'unified pre-gate ok for aligned XS-02 and stabilization window',

    passed: unified.gateBatchAdvanceUnifiedPreconditions({

      fromTurn: 1,

      toTurn: 1,

      externalByTurn: { 1: ['un'] },

      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },

    }).ok,

  });

  const full = new TurnTimeEngine();

  full.scheduleEvent({ id: 'full', dueTurn: 1, kind: 'n' });

  const fullRun = stepTurnsWithBudgetFullInstrumentedGate(full, 1, createTurnAdvanceBudget(2), {

    externalByTurn: { 1: ['full'] },

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },

  });

  results.push({

    id: 'agent02_full_instrumented',

    name: 'full instrumented gate report ok with auto capture',

    passed: fullRun.report.ok && fullRun.instrumentedDigest.length === 16,

  });

  const orch = new TurnTimeEngine();

  orch.scheduleEvent({ id: 'orch', dueTurn: 1, kind: 'n' });

  const orchRun = stepTurnsWithBudgetOrchestratedAdvance(orch, 1, createTurnAdvanceBudget(2), {

    externalByTurn: { 1: ['orch'] },

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },

  });

  results.push({

    id: 'agent02_orchestrated_advance',

    name: 'orchestrated advance ok with alignment and post gate',

    passed: orchRun.report.ok && orchRun.orchestratedDigest.length === 16,

  });

  results.push({

    id: 'agent02_orchestrated_pregate_block',

    name: 'orchestrated advance blocks on failed pre-gate',

    passed:

      !stepTurnsWithBudgetOrchestratedAdvance(new TurnTimeEngine(), 1, createTurnAdvanceBudget(2), {

        preGate: {

          fromTurn: 1,

          toTurn: 1,

          stabilizationByTurn: { 1: { postQueueCalm: false, pendingStabilizationWave: true } },

        },

      }).report.ok,

  });

  const failed = results.filter((r) => !r.passed).length;

  return { passed: results.length - failed, failed, results };

}
// OP10M_MODULE_END agent-02-turns-time
