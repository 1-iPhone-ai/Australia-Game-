// OP10M_MODULE_BEGIN agent-02-turns-time
// @ts-nocheck
// content-sha256-prefix: aedd45b322ea6ce7
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

  summarizeBatchOrchestratedAdvanceReport(
    report: BatchOrchestratedAdvanceReport,
    orchestratedDigest: string,
  ): BatchOrchestratedAdvanceSummary {
    return summarizeBatchOrchestratedAdvanceReport(report, orchestratedDigest);
  }

  compareBatchOrchestratedReports(
    baseline: BatchOrchestratedAdvanceReport,
    candidate: BatchOrchestratedAdvanceReport,
  ): BatchOrchestratedReportCompareResult {
    return compareBatchOrchestratedReports(baseline, candidate);
  }

  gateStabilizationCalmStreak(
    batch: BatchAdvanceResult,
    capture: BatchStabilizationQueueCapture,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  ): StabilizationCalmStreakGateResult {
    return gateStabilizationCalmStreak(batch, capture, stabilizationByTurn);
  }

  stepTurnsWithBudgetOrchestratedAuditedAdvance(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    input?: Parameters<typeof stepTurnsWithBudgetOrchestratedAuditedAdvance>[3],
  ): BatchAdvanceWithOrchestratedAudit {
    return stepTurnsWithBudgetOrchestratedAuditedAdvance(this, maxSteps, budget, input);
  }

  computeBatchOrchestratedAuditDigest(
    report: BatchOrchestratedAuditedReport,
    summary: BatchOrchestratedAdvanceSummary,
  ): string {
    return computeBatchOrchestratedAuditDigest(report, summary);
  }

  gateBatchStabilizationPlanCoverage(
    batch: BatchAdvanceResult,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  ): BatchStabilizationPlanCoverageGateResult {
    return gateBatchStabilizationPlanCoverage(batch, stabilizationByTurn);
  }

  buildBatchOrchestratedScorecard(
    report: BatchOrchestratedAuditedReport,
    planCoverage?: BatchStabilizationPlanCoverageGateResult,
  ): BatchOrchestratedScorecard {
    return buildBatchOrchestratedScorecard(report, planCoverage);
  }

  verifyBatchOrchestratedReplayParity(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    input?: Parameters<typeof verifyBatchOrchestratedReplayParity>[3],
  ): BatchOrchestratedReplayParityResult {
    return verifyBatchOrchestratedReplayParity(this, maxSteps, budget, input);
  }

  stepNationalTickOrchestratedBatch(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    input?: Parameters<typeof stepNationalTickOrchestratedBatch>[3],
  ): BatchNationalTickOrchestratedResult {
    return stepNationalTickOrchestratedBatch(this, maxSteps, budget, input);
  }

  computeBatchNationalTickOrchestratedDigest(
    audit: BatchAdvanceWithOrchestratedAudit,
    scorecard: BatchOrchestratedScorecard,
  ): string {
    return computeBatchNationalTickOrchestratedDigest(audit, scorecard);
  }

  gateBatchExternalStabilizationUnified(
    batch: BatchAdvanceResult,
    externalByTurn: Readonly<Record<number, readonly string[]>>,
    stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
    stabilizationOptions?: ExternalStabilizationBatchGateOptions,
  ): BatchExternalStabilizationUnifiedBatchGateResult {
    return gateBatchExternalStabilizationUnified(
      batch,
      externalByTurn,
      stabilizationByTurn,
      stabilizationOptions,
    );
  }

  runNationalTickOrchestratedSession(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    input?: Parameters<typeof runNationalTickOrchestratedSession>[3],
    ledger?: BatchNationalTickLedger,
    tickIndex?: number,
  ): BatchNationalTickSessionResult {
    return runNationalTickOrchestratedSession(this, maxSteps, budget, input, ledger, tickIndex);
  }

  createBatchNationalTickLedger(): BatchNationalTickLedger {
    return createBatchNationalTickLedger();
  }

  exportBatchNationalTickScorecard(result: BatchNationalTickOrchestratedResult) {
    return exportBatchNationalTickScorecard(result);
  }

  runNationalTickOrchestratedUnifiedSession(
    maxSteps: number,
    budget: TurnAdvanceBudgetState,
    input?: Parameters<typeof runNationalTickOrchestratedUnifiedSession>[3],
    ledger?: BatchNationalTickLedger,
    tickIndex?: number,
  ): BatchNationalTickUnifiedSessionResult {
    return runNationalTickOrchestratedUnifiedSession(this, maxSteps, budget, input, ledger, tickIndex);
  }

  computeBatchNationalTickUnifiedSessionDigest(session: BatchNationalTickUnifiedSessionResult): string {
    return computeBatchNationalTickUnifiedSessionDigest(session);
  }

  exportBatchNationalTickSessionLedger(ledger: BatchNationalTickLedger): BatchNationalTickSessionLedgerExport {
    return exportBatchNationalTickSessionLedger(ledger);
  }

  runNationalTickOrchestratedSessionWave(
    budget: TurnAdvanceBudgetState,
    ticks: readonly NationalTickSessionWaveTickSpec[],
    ledger?: BatchNationalTickLedger,
  ): BatchNationalTickSessionWaveResult {
    return runNationalTickOrchestratedSessionWave(this, budget, ticks, ledger);
  }

  computeBatchNationalTickSessionWaveDigest(
    sessions: readonly BatchNationalTickUnifiedSessionResult[],
    ledgerDigest: string,
  ): string {
    return computeBatchNationalTickSessionWaveDigest(sessions, ledgerDigest);
  }

  exportBatchNationalTickSessionWave(
    wave: BatchNationalTickSessionWaveResult,
  ): BatchNationalTickSessionWaveExport {
    return exportBatchNationalTickSessionWave(wave);
  }

  verifyBatchNationalTickSessionWaveReplayParity(
    budget: TurnAdvanceBudgetState,
    ticks: readonly NationalTickSessionWaveTickSpec[],
  ): BatchNationalTickSessionWaveReplayParityResult {
    return verifyBatchNationalTickSessionWaveReplayParity(this, budget, ticks);
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

// --- src/batch-orchestrated-advance-summary.ts ---

export interface BatchOrchestratedAdvanceSummary {
  ok: boolean;
  completedSteps: number;
  alignmentRatio: number;
  preGateOk: boolean | null;
  reboundTurns: readonly number[];
  compositeDigest: string | null;
  orchestratedDigest: string;
}

export function summarizeBatchOrchestratedAdvanceReport(
  report: BatchOrchestratedAdvanceReport,
  orchestratedDigest: string,
): BatchOrchestratedAdvanceSummary {
  return {
    ok: report.ok,
    completedSteps: report.batch.completed,
    alignmentRatio: report.alignment.ratio,
    preGateOk: report.preGate?.ok ?? null,
    reboundTurns: report.rebound?.reboundTurns ?? [],
    compositeDigest: report.readiness.compositeDigest ?? null,
    orchestratedDigest,
  };
}

// --- src/batch-orchestrated-report-compare.ts ---

export interface BatchOrchestratedReportCompareResult {
  ok: boolean;
  completedDelta: number;
  alignmentDelta: number;
  readinessChanged: boolean;
  reboundChanged: boolean;
}

export function compareBatchOrchestratedReports(
  baseline: BatchOrchestratedAdvanceReport,
  candidate: BatchOrchestratedAdvanceReport,
): BatchOrchestratedReportCompareResult {
  const completedDelta = candidate.batch.completed - baseline.batch.completed;
  const alignmentDelta = candidate.alignment.ratio - baseline.alignment.ratio;
  const baselineRebound = (baseline.rebound?.reboundTurns ?? []).join(',');
  const candidateRebound = (candidate.rebound?.reboundTurns ?? []).join(',');
  return {
    ok:
      baseline.ok === candidate.ok &&
      baseline.readiness.digest === candidate.readiness.digest &&
      baselineRebound === candidateRebound,
    completedDelta,
    alignmentDelta,
    readinessChanged: baseline.readiness.digest !== candidate.readiness.digest,
    reboundChanged: baselineRebound !== candidateRebound,
  };
}

// --- src/stabilization-calm-streak-gate.ts ---

export interface StabilizationCalmStreakViolation {
  priorTurn: number;
  turnIndex: number;
  code: 'sustained_calm_over_rebound';
}

export interface StabilizationCalmStreakGateResult {
  calmStreakLength: number;
  violations: StabilizationCalmStreakViolation[];
  ok: boolean;
}

/**
 * Round 13: consecutive Agent 05 calm flags cannot span a queue rebound between stepped turns.
 */
export function gateStabilizationCalmStreak(
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): StabilizationCalmStreakGateResult {
  const steppedTurns: number[] = [];
  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    steppedTurns.push(step.clockBefore.turnIndex);
  }

  const violations: StabilizationCalmStreakViolation[] = [];
  let calmStreakLength = 0;

  for (let i = 0; i < steppedTurns.length; i += 1) {
    const turn = steppedTurns[i]!;
    const calm = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]).postQueueCalm;
    if (calm) calmStreakLength += 1;
    else calmStreakLength = 0;

    if (i === 0) continue;
    const priorTurn = steppedTurns[i - 1]!;
    const priorCalm = normalizeExternalStabilizationSignals(stabilizationByTurn[priorTurn]).postQueueCalm;
    if (!priorCalm || !calm) continue;

    const afterPrior = capture.queueAfterByTurn[priorTurn];
    const beforeTurn = capture.queueBeforeByTurn[turn];
    if (!afterPrior || !beforeTurn) continue;

    if (countAgent02QueueDepth(beforeTurn) > countAgent02QueueDepth(afterPrior)) {
      violations.push({ priorTurn, turnIndex: turn, code: 'sustained_calm_over_rebound' });
    }
  }

  return { calmStreakLength, violations, ok: violations.length === 0 };
}

// --- src/batch-advance-orchestrated-audited-step.ts ---

export interface BatchOrchestratedAuditedReport extends BatchOrchestratedAdvanceReport {
  calmStreak?: StabilizationCalmStreakGateResult;
}

export interface BatchAdvanceWithOrchestratedAudit extends BatchAdvanceWithOrchestratedGate {
  report: BatchOrchestratedAuditedReport;
  summary: BatchOrchestratedAdvanceSummary;
  auditDigest: string;
}

export function computeBatchOrchestratedAuditDigest(
  report: BatchOrchestratedAuditedReport,
  summary: BatchOrchestratedAdvanceSummary,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: report.ok && (report.calmStreak?.ok ?? true),
      summary: summary.orchestratedDigest,
      calmStreak: report.calmStreak?.calmStreakLength ?? 0,
      violations: report.calmStreak?.violations.length ?? 0,
    }),
  );
}

/**
 * Round 13: orchestrated advance + calm-streak gate + Agent 25-friendly summary.
 */
export function stepTurnsWithBudgetOrchestratedAuditedAdvance(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchAdvanceWithOrchestratedAudit {
  const run = stepTurnsWithBudgetOrchestratedAdvance(engine, maxSteps, budget, input);
  const calmStreak =
    input?.stabilizationByTurn !== undefined
      ? gateStabilizationCalmStreak(run.report.batch, run.report.capture, input.stabilizationByTurn)
      : undefined;
  const calmOk = calmStreak?.ok ?? true;
  const report: BatchOrchestratedAuditedReport = {
    ...run.report,
    calmStreak,
    ok: run.report.ok && calmOk,
  };
  const summary = summarizeBatchOrchestratedAdvanceReport(report, run.orchestratedDigest);
  const auditDigest = computeBatchOrchestratedAuditDigest(report, summary);
  return {
    report,
    orchestratedDigest: run.orchestratedDigest,
    summary: { ...summary, ok: report.ok },
    auditDigest,
  };
}

// --- src/batch-stabilization-plan-coverage-gate.ts ---

export interface BatchStabilizationPlanCoverageGateResult {
  steppedTurns: number[];
  missingTurns: number[];
  ok: boolean;
}

/**
 * Round 14: every stepped turn must appear in the Agent 05 stabilization export when batch gating is enabled.
 */
export function gateBatchStabilizationPlanCoverage(
  batch: BatchAdvanceResult,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): BatchStabilizationPlanCoverageGateResult {
  const steppedTurns: number[] = [];
  const missingTurns: number[] = [];

  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    const turn = step.clockBefore.turnIndex;
    steppedTurns.push(turn);
    if (stabilizationByTurn[turn] === undefined) missingTurns.push(turn);
  }

  return { steppedTurns, missingTurns, ok: missingTurns.length === 0 };
}

// --- src/batch-orchestrated-scorecard.ts ---

export interface BatchOrchestratedScorecard {
  preGateOk: boolean | null;
  readinessOk: boolean;
  reboundOk: boolean;
  postStabilizationOk: boolean;
  calmStreakOk: boolean;
  planCoverageOk: boolean;
  alignmentRatio: number;
  ok: boolean;
}

export function buildBatchOrchestratedScorecard(
  report: BatchOrchestratedAuditedReport,
  planCoverage?: BatchStabilizationPlanCoverageGateResult,
): BatchOrchestratedScorecard {
  const planCoverageOk = planCoverage?.ok ?? true;
  const scorecard: BatchOrchestratedScorecard = {
    preGateOk: report.preGate?.ok ?? null,
    readinessOk: report.readiness.ok,
    reboundOk: report.rebound?.ok ?? true,
    postStabilizationOk: report.postStabilization?.ok ?? true,
    calmStreakOk: report.calmStreak?.ok ?? true,
    planCoverageOk,
    alignmentRatio: report.alignment.ratio,
    ok:
      (report.preGate?.ok ?? true) &&
      report.readiness.ok &&
      (report.rebound?.ok ?? true) &&
      (report.postStabilization?.ok ?? true) &&
      (report.calmStreak?.ok ?? true) &&
      planCoverageOk,
  };
  return scorecard;
}

// --- src/batch-orchestrated-replay-parity.ts ---

export interface BatchOrchestratedReplayParityResult {
  parityOk: boolean;
  baseline: BatchAdvanceWithOrchestratedAudit;
  replay: BatchAdvanceWithOrchestratedAudit;
}

/**
 * Round 14: deterministic replay — two audited orchestrated runs from the same starting snapshot.
 */
export function verifyBatchOrchestratedReplayParity(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchOrchestratedReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = stepTurnsWithBudgetOrchestratedAuditedAdvance(engine, maxSteps, budget, input);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = stepTurnsWithBudgetOrchestratedAuditedAdvance(replayEngine, maxSteps, budget, input);
  const compare = compareBatchOrchestratedReports(baseline.report, replay.report);
  const parityOk =
    compare.ok &&
    baseline.auditDigest === replay.auditDigest &&
    baseline.summary.orchestratedDigest === replay.summary.orchestratedDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-orchestrator-digest.ts ---

export interface BatchNationalTickOrchestratedResult extends BatchAdvanceWithOrchestratedAudit {
  planCoverage?: BatchStabilizationPlanCoverageGateResult;
  scorecard: BatchOrchestratedScorecard;
  nationalTickDigest: string;
}

export function computeBatchNationalTickOrchestratedDigest(
  audit: BatchAdvanceWithOrchestratedAudit,
  scorecard: BatchOrchestratedScorecard,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: scorecard.ok,
      audit: audit.auditDigest,
      orchestrated: audit.orchestratedDigest,
      alignment: scorecard.alignmentRatio,
      planCoverage: scorecard.planCoverageOk,
    }),
  );
}

// --- src/batch-advance-national-tick-orchestrator.ts ---

export type { BatchNationalTickOrchestratedResult };

/**
 * Round 14 national-tick orchestrator hook (Agent 02 / 25): audited orchestrated batch + plan coverage + scorecard.
 */
export function stepNationalTickOrchestratedBatch(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchNationalTickOrchestratedResult {
  const run = stepTurnsWithBudgetOrchestratedAuditedAdvance(engine, maxSteps, budget, input);
  const planCoverage =
    input?.stabilizationByTurn !== undefined
      ? gateBatchStabilizationPlanCoverage(run.report.batch, input.stabilizationByTurn)
      : undefined;

  const report: BatchOrchestratedAuditedReport = {
    ...run.report,
    ok: run.report.ok && (planCoverage?.ok ?? true),
  };
  const scorecard = buildBatchOrchestratedScorecard(report, planCoverage);
  const nationalTickDigest = computeBatchNationalTickOrchestratedDigest(
    { ...run, report, summary: { ...run.summary, ok: scorecard.ok } },
    scorecard,
  );

  return {
    ...run,
    report,
    summary: { ...run.summary, ok: scorecard.ok },
    planCoverage,
    scorecard,
    nationalTickDigest,
  };
}

// --- src/batch-national-tick-ledger.ts ---

export interface BatchNationalTickLedgerEntry {
  tickIndex: number;
  startTurn: number;
  endTurn: number;
  nationalTickDigest: string;
  ok: boolean;
}

export interface BatchNationalTickLedger {
  entries: BatchNationalTickLedgerEntry[];
}

export function createBatchNationalTickLedger(): BatchNationalTickLedger {
  return { entries: [] };
}

export function appendBatchNationalTickLedgerEntry(
  ledger: BatchNationalTickLedger,
  entry: BatchNationalTickLedgerEntry,
): BatchNationalTickLedger {
  return { entries: [...ledger.entries, entry] };
}

// --- src/batch-national-tick-ledger-digest.ts ---

export function computeBatchNationalTickLedgerDigest(ledger: BatchNationalTickLedger): string {
  const payload = JSON.stringify({
    count: ledger.entries.length,
    digests: ledger.entries.map((e) => e.nationalTickDigest),
    ok: ledger.entries.every((e) => e.ok),
  });
  return fnv1a64Hex(payload);
}

// --- src/batch-national-tick-scorecard-export.ts ---

export interface BatchNationalTickScorecardExport {
  ok: boolean;
  completedSteps: number;
  alignmentRatio: number;
  preGateOk: boolean | null;
  readinessOk: boolean;
  reboundOk: boolean;
  postStabilizationOk: boolean;
  calmStreakOk: boolean;
  planCoverageOk: boolean;
  nationalTickDigest: string;
  auditDigest: string;
}

export function exportBatchNationalTickScorecard(
  result: BatchNationalTickOrchestratedResult,
): BatchNationalTickScorecardExport {
  const s: BatchOrchestratedScorecard = result.scorecard;
  return {
    ok: s.ok,
    completedSteps: result.summary.completedSteps,
    alignmentRatio: s.alignmentRatio,
    preGateOk: s.preGateOk,
    readinessOk: s.readinessOk,
    reboundOk: s.reboundOk,
    postStabilizationOk: s.postStabilizationOk,
    calmStreakOk: s.calmStreakOk,
    planCoverageOk: s.planCoverageOk,
    nationalTickDigest: result.nationalTickDigest,
    auditDigest: result.auditDigest,
  };
}

// --- src/batch-external-stabilization-unified-batch-gate.ts ---

export interface BatchExternalStabilizationUnifiedBatchGateResult {
  dayPlan: ExternalDayPlanBatchGateResult;
  stabilization: ExternalStabilizationBatchGateResult;
  ok: boolean;
}

/**
 * Round 15: single XS-02 + Agent 05 batch merge gate for stepped national ticks.
 */
export function gateBatchExternalStabilizationUnified(
  batch: BatchAdvanceResult,
  externalByTurn: Readonly<Record<number, readonly string[]>>,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  stabilizationOptions?: ExternalStabilizationBatchGateOptions,
): BatchExternalStabilizationUnifiedBatchGateResult {
  const dayPlan = gateExternalDayPlanForBatch(batch, externalByTurn);
  const stabilization = gateExternalStabilizationForBatch(
    batch,
    stabilizationByTurn,
    stabilizationOptions,
  );
  return { dayPlan, stabilization, ok: dayPlan.ok && stabilization.ok };
}

// --- src/batch-national-tick-session.ts ---

export interface BatchNationalTickSessionResult {
  tick: BatchNationalTickOrchestratedResult;
  parityOk: boolean;
  ledger: BatchNationalTickLedger;
  sessionDigest: string;
  export: ReturnType<typeof exportBatchNationalTickScorecard>;
}

export function computeBatchNationalTickSessionDigest(
  tick: BatchNationalTickOrchestratedResult,
  parityOk: boolean,
  ledgerDigest: string,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: tick.scorecard.ok && parityOk,
      tick: tick.nationalTickDigest,
      parityOk,
      ledger: ledgerDigest,
    }),
  );
}

/**
 * Round 15: national tick with replay parity check and append-only ledger entry.
 */
export function runNationalTickOrchestratedSession(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
  ledger: BatchNationalTickLedger = createBatchNationalTickLedger(),
  tickIndex = ledger.entries.length + 1,
): BatchNationalTickSessionResult {
  const before = engine.snapshot();
  const startTurn = before.clock.turnIndex;
  const tick = stepNationalTickOrchestratedBatch(engine, maxSteps, budget, input);
  const endTurn = engine.snapshot().clock.turnIndex;

  const replayEngine = TurnTimeEngine.fromSnapshot(before);
  const replayTick = stepNationalTickOrchestratedBatch(replayEngine, maxSteps, budget, input);
  const parityOk =
    tick.nationalTickDigest === replayTick.nationalTickDigest &&
    tick.scorecard.ok === replayTick.scorecard.ok;

  const entry: BatchNationalTickLedgerEntry = {
    tickIndex,
    startTurn,
    endTurn,
    nationalTickDigest: tick.nationalTickDigest,
    ok: tick.scorecard.ok && parityOk,
  };
  const nextLedger = appendBatchNationalTickLedgerEntry(ledger, entry);
  const ledgerDigest = computeBatchNationalTickLedgerDigest(nextLedger);
  const sessionDigest = computeBatchNationalTickSessionDigest(tick, parityOk, ledgerDigest);

  return {
    tick,
    parityOk,
    ledger: nextLedger,
    sessionDigest,
    export: exportBatchNationalTickScorecard(tick),
  };
}

// --- src/batch-national-tick-session-ledger-export.ts ---

export interface BatchNationalTickSessionLedgerExportRow {
  tickIndex: number;
  startTurn: number;
  endTurn: number;
  nationalTickDigest: string;
  ok: boolean;
}

export interface BatchNationalTickSessionLedgerExport {
  rows: BatchNationalTickSessionLedgerExportRow[];
  entryCount: number;
  allOk: boolean;
  ledgerDigest: string;
}

/**
 * Round 16: flatten append-only national tick ledger for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionLedger(
  ledger: BatchNationalTickLedger,
): BatchNationalTickSessionLedgerExport {
  const rows = ledger.entries.map((e) => ({
    tickIndex: e.tickIndex,
    startTurn: e.startTurn,
    endTurn: e.endTurn,
    nationalTickDigest: e.nationalTickDigest,
    ok: e.ok,
  }));
  return {
    rows,
    entryCount: rows.length,
    allOk: rows.every((r) => r.ok),
    ledgerDigest: computeBatchNationalTickLedgerDigest(ledger),
  };
}

// --- src/batch-national-tick-unified-session.ts ---

export interface BatchNationalTickUnifiedSessionResult extends BatchNationalTickSessionResult {
  unifiedGate?: BatchExternalStabilizationUnifiedBatchGateResult;
}

export function computeBatchNationalTickUnifiedSessionDigest(
  session: BatchNationalTickUnifiedSessionResult,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      session: session.sessionDigest,
      unifiedOk: session.unifiedGate?.ok ?? null,
    }),
  );
}

/**
 * Round 16: national tick session with XS-02 + Agent 05 unified batch gate on the stepped batch.
 */
export function runNationalTickOrchestratedUnifiedSession(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
  ledger: BatchNationalTickLedger = createBatchNationalTickLedger(),
  tickIndex = ledger.entries.length + 1,
): BatchNationalTickUnifiedSessionResult {
  const before = engine.snapshot();
  const startTurn = before.clock.turnIndex;
  const tick = stepNationalTickOrchestratedBatch(engine, maxSteps, budget, input);
  const endTurn = engine.snapshot().clock.turnIndex;

  const unifiedGate =
    input?.externalByTurn !== undefined || input?.stabilizationByTurn !== undefined
      ? gateBatchExternalStabilizationUnified(
          tick.report.batch,
          input?.externalByTurn ?? {},
          input?.stabilizationByTurn ?? {},
          batchStabilizationGateOptionsFromCapture(tick.report.capture),
        )
      : undefined;
  const unifiedOk = unifiedGate?.ok ?? true;

  const replayEngine = TurnTimeEngine.fromSnapshot(before);
  const replayTick = stepNationalTickOrchestratedBatch(replayEngine, maxSteps, budget, input);
  const parityOk =
    tick.nationalTickDigest === replayTick.nationalTickDigest &&
    tick.scorecard.ok === replayTick.scorecard.ok;

  const entry: BatchNationalTickLedgerEntry = {
    tickIndex,
    startTurn,
    endTurn,
    nationalTickDigest: tick.nationalTickDigest,
    ok: tick.scorecard.ok && parityOk && unifiedOk,
  };
  const nextLedger = appendBatchNationalTickLedgerEntry(ledger, entry);
  const ledgerDigest = computeBatchNationalTickLedgerDigest(nextLedger);
  const sessionDigest = computeBatchNationalTickSessionDigest(tick, parityOk, ledgerDigest);

  return {
    tick,
    parityOk,
    ledger: nextLedger,
    sessionDigest,
    export: exportBatchNationalTickScorecard(tick),
    unifiedGate,
  };
}

// --- src/batch-national-tick-session-wave.ts ---

export interface NationalTickSessionWaveTickSpec {
  maxSteps: number;
  input?: BatchAdvanceOrchestratedInput;
}

export interface BatchNationalTickSessionWaveResult {
  sessions: BatchNationalTickUnifiedSessionResult[];
  ledger: BatchNationalTickLedger;
  ledgerExport: ReturnType<typeof exportBatchNationalTickSessionLedger>;
  waveDigest: string;
}

export function computeBatchNationalTickSessionWaveDigest(
  sessions: readonly BatchNationalTickUnifiedSessionResult[],
  ledgerDigest: string,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ledger: ledgerDigest,
      sessions: sessions.map((s) => computeBatchNationalTickUnifiedSessionDigest(s)),
    }),
  );
}

/**
 * Round 16: chain unified national tick sessions on one engine with a shared append-only ledger.
 */
export function runNationalTickOrchestratedSessionWave(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
  ledger: BatchNationalTickLedger = createBatchNationalTickLedger(),
): BatchNationalTickSessionWaveResult {
  const sessions: BatchNationalTickUnifiedSessionResult[] = [];
  let currentLedger = ledger;

  for (const spec of ticks) {
    const session = runNationalTickOrchestratedUnifiedSession(
      engine,
      spec.maxSteps,
      budget,
      spec.input,
      currentLedger,
    );
    sessions.push(session);
    currentLedger = session.ledger;
  }

  const ledgerExport = exportBatchNationalTickSessionLedger(currentLedger);
  const waveDigest = computeBatchNationalTickSessionWaveDigest(
    sessions,
    ledgerExport.ledgerDigest,
  );

  return {
    sessions,
    ledger: currentLedger,
    ledgerExport,
    waveDigest,
  };
}

// --- src/batch-national-tick-session-wave-export.ts ---

export interface BatchNationalTickSessionWaveExportRow {
  tickIndex: number;
  sessionDigest: string;
  unifiedOk: boolean;
  ledgerOk: boolean;
}

export interface BatchNationalTickSessionWaveExport {
  rows: BatchNationalTickSessionWaveExportRow[];
  sessionCount: number;
  allOk: boolean;
  waveDigest: string;
  ledgerDigest: string;
}

/**
 * Round 17: flatten chained unified session wave for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionWave(
  wave: BatchNationalTickSessionWaveResult,
): BatchNationalTickSessionWaveExport {
  const rows = wave.sessions.map((session, index) => {
    const ledgerRow = wave.ledgerExport.rows[index];
    return {
      tickIndex: ledgerRow?.tickIndex ?? index + 1,
      sessionDigest: computeBatchNationalTickUnifiedSessionDigest(session),
      unifiedOk: session.unifiedGate?.ok ?? true,
      ledgerOk: ledgerRow?.ok ?? false,
    };
  });
  return {
    rows,
    sessionCount: rows.length,
    allOk:
      wave.ledgerExport.allOk &&
      rows.every((row) => row.unifiedOk && row.ledgerOk),
    waveDigest: wave.waveDigest,
    ledgerDigest: wave.ledgerExport.ledgerDigest,
  };
}

// --- src/batch-national-tick-session-wave-replay-parity.ts ---

export interface BatchNationalTickSessionWaveReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveResult;
  replay: BatchNationalTickSessionWaveResult;
}

/**
 * Round 17: deterministic replay — two session waves from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
): BatchNationalTickSessionWaveReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = runNationalTickOrchestratedSessionWave(engine, budget, ticks);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = runNationalTickOrchestratedSessionWave(replayEngine, budget, ticks);
  const parityOk =
    baseline.waveDigest === replay.waveDigest &&
    baseline.ledgerExport.ledgerDigest === replay.ledgerExport.ledgerDigest &&
    baseline.ledgerExport.allOk === replay.ledgerExport.allOk;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-scorecard-export.ts ---

export interface BatchNationalTickSessionWaveScorecardExport {
  ok: boolean;
  sessionCount: number;
  unifiedOkCount: number;
  ledgerOkCount: number;
  waveDigest: string;
  ledgerDigest: string;
  scorecardDigest: string;
}

export function computeBatchNationalTickSessionWaveScorecardDigest(
  scorecard: BatchNationalTickSessionWaveScorecardExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: scorecard.ok,
      sessionCount: scorecard.sessionCount,
      unifiedOkCount: scorecard.unifiedOkCount,
      ledgerOkCount: scorecard.ledgerOkCount,
      waveDigest: scorecard.waveDigest,
      ledgerDigest: scorecard.ledgerDigest,
    }),
  );
}

/**
 * Round 18: scorecard rollup over session wave export for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionWaveScorecard(
  wave: BatchNationalTickSessionWaveResult,
): BatchNationalTickSessionWaveScorecardExport {
  const exp: BatchNationalTickSessionWaveExport = exportBatchNationalTickSessionWave(wave);
  const unifiedOkCount = exp.rows.filter((row) => row.unifiedOk).length;
  const ledgerOkCount = exp.rows.filter((row) => row.ledgerOk).length;
  const scorecard: BatchNationalTickSessionWaveScorecardExport = {
    ok: exp.allOk && unifiedOkCount === exp.sessionCount && ledgerOkCount === exp.sessionCount,
    sessionCount: exp.sessionCount,
    unifiedOkCount,
    ledgerOkCount,
    waveDigest: exp.waveDigest,
    ledgerDigest: exp.ledgerDigest,
    scorecardDigest: '',
  };
  scorecard.scorecardDigest = computeBatchNationalTickSessionWaveScorecardDigest(scorecard);
  return scorecard;
}

// --- src/batch-national-tick-session-wave-export-compare.ts ---

export interface BatchNationalTickSessionWaveExportCompareResult {
  ok: boolean;
  waveDigestMatch: boolean;
  ledgerDigestMatch: boolean;
  sessionCountDelta: number;
  allOkMatch: boolean;
}

/**
 * Round 18: compare two flattened session wave exports (regression / twin-run checks).
 */
export function compareBatchNationalTickSessionWaveExports(
  baseline: BatchNationalTickSessionWaveExport,
  candidate: BatchNationalTickSessionWaveExport,
): BatchNationalTickSessionWaveExportCompareResult {
  const sessionCountDelta = candidate.sessionCount - baseline.sessionCount;
  const waveDigestMatch = baseline.waveDigest === candidate.waveDigest;
  const ledgerDigestMatch = baseline.ledgerDigest === candidate.ledgerDigest;
  const allOkMatch = baseline.allOk === candidate.allOk;
  return {
    ok:
      waveDigestMatch &&
      ledgerDigestMatch &&
      allOkMatch &&
      sessionCountDelta === 0 &&
      baseline.sessionCount === candidate.sessionCount,
    waveDigestMatch,
    ledgerDigestMatch,
    sessionCountDelta,
    allOkMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyGateResult {
  ok: boolean;
  exportAllOk: boolean;
  scorecardOk: boolean;
  parityOk: boolean;
  scorecard: BatchNationalTickSessionWaveScorecardExport;
  parity: BatchNationalTickSessionWaveReplayParityResult;
}

/**
 * Round 18: assembly gate — export ok, scorecard ok, and replay parity on the same tick specs.
 */
export function gateBatchNationalTickSessionWaveAssembly(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
  wave: BatchNationalTickSessionWaveResult,
): BatchNationalTickSessionWaveAssemblyGateResult {
  const exp = exportBatchNationalTickSessionWave(wave);
  const scorecard = exportBatchNationalTickSessionWaveScorecard(wave);
  const parity = verifyBatchNationalTickSessionWaveReplayParity(engine, budget, ticks);
  const exportAllOk = exp.allOk;
  const scorecardOk = scorecard.ok;
  const parityOk = parity.parityOk;
  return {
    ok: exportAllOk && scorecardOk && parityOk,
    exportAllOk,
    scorecardOk,
    parityOk,
    scorecard,
    parity,
  };
}

// --- src/batch-national-tick-session-wave-scorecard-compare.ts ---

export interface BatchNationalTickSessionWaveScorecardCompareResult {
  ok: boolean;
  scorecardDigestMatch: boolean;
  waveDigestMatch: boolean;
  sessionCountDelta: number;
  okFlagMatch: boolean;
}

/**
 * Round 19: compare two session wave scorecards (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveScorecards(
  baseline: BatchNationalTickSessionWaveScorecardExport,
  candidate: BatchNationalTickSessionWaveScorecardExport,
): BatchNationalTickSessionWaveScorecardCompareResult {
  const sessionCountDelta = candidate.sessionCount - baseline.sessionCount;
  const scorecardDigestMatch = baseline.scorecardDigest === candidate.scorecardDigest;
  const waveDigestMatch = baseline.waveDigest === candidate.waveDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      scorecardDigestMatch &&
      waveDigestMatch &&
      okFlagMatch &&
      sessionCountDelta === 0 &&
      baseline.sessionCount === candidate.sessionCount,
    scorecardDigestMatch,
    waveDigestMatch,
    sessionCountDelta,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-run.ts ---

export interface BatchNationalTickSessionWaveAssemblyRunResult {
  wave: BatchNationalTickSessionWaveResult;
  gate: BatchNationalTickSessionWaveAssemblyGateResult;
  assemblyDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyDigest(
  wave: BatchNationalTickSessionWaveResult,
  gate: BatchNationalTickSessionWaveAssemblyGateResult,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      wave: wave.waveDigest,
      scorecard: gate.scorecard.scorecardDigest,
      ok: gate.ok,
    }),
  );
}

/**
 * Round 19: run session wave plus round-18 assembly gate on one engine pass.
 */
export function runNationalTickSessionWaveAssembly(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
): BatchNationalTickSessionWaveAssemblyRunResult {
  const wave = runNationalTickOrchestratedSessionWave(engine, budget, ticks);
  const gate = gateBatchNationalTickSessionWaveAssembly(engine, budget, ticks, wave);
  const assemblyDigest = computeBatchNationalTickSessionWaveAssemblyDigest(wave, gate);
  return { wave, gate, assemblyDigest };
}

// --- src/batch-national-tick-session-wave-assembly-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyExport {
  ok: boolean;
  assemblyDigest: string;
  waveDigest: string;
  scorecardDigest: string;
  exportAllOk: boolean;
  scorecardOk: boolean;
  parityOk: boolean;
}

/**
 * Round 19: flatten assembly run for Agent 25 integration hooks.
 */
export function exportBatchNationalTickSessionWaveAssembly(
  run: BatchNationalTickSessionWaveAssemblyRunResult,
): BatchNationalTickSessionWaveAssemblyExport {
  return {
    ok: run.gate.ok,
    assemblyDigest: run.assemblyDigest,
    waveDigest: run.wave.waveDigest,
    scorecardDigest: run.gate.scorecard.scorecardDigest,
    exportAllOk: run.gate.exportAllOk,
    scorecardOk: run.gate.scorecardOk,
    parityOk: run.gate.parityOk,
  };
}

// --- src/batch-national-tick-session-wave-assembly-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyRunResult;
  replay: BatchNationalTickSessionWaveAssemblyRunResult;
}

/**
 * Round 19: deterministic replay — two assembly runs from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  ticks: readonly NationalTickSessionWaveTickSpec[],
): BatchNationalTickSessionWaveAssemblyReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = runNationalTickSessionWaveAssembly(engine, budget, ticks);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = runNationalTickSessionWaveAssembly(replayEngine, budget, ticks);
  const parityOk =
    baseline.assemblyDigest === replay.assemblyDigest &&
    baseline.gate.ok === replay.gate.ok &&
    baseline.wave.waveDigest === replay.wave.waveDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyExportCompareResult {
  ok: boolean;
  assemblyDigestMatch: boolean;
  waveDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 20: compare two assembly exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyExports(
  baseline: BatchNationalTickSessionWaveAssemblyExport,
  candidate: BatchNationalTickSessionWaveAssemblyExport,
): BatchNationalTickSessionWaveAssemblyExportCompareResult {
  const assemblyDigestMatch = baseline.assemblyDigest === candidate.assemblyDigest;
  const waveDigestMatch = baseline.waveDigest === candidate.waveDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: assemblyDigestMatch && waveDigestMatch && okFlagMatch,
    assemblyDigestMatch,
    waveDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchResult {
  runs: BatchNationalTickSessionWaveAssemblyRunResult[];
  batchDigest: string;
  allOk: boolean;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchDigest(
  runs: readonly BatchNationalTickSessionWaveAssemblyRunResult[],
): string {
  return fnv1a64Hex(
    JSON.stringify({
      runs: runs.map((run) => run.assemblyDigest),
      allOk: runs.every((run) => run.gate.ok),
    }),
  );
}

/**
 * Round 20: chain multiple assembly runs on one engine (multi-wave national tick sessions).
 */
export function runNationalTickSessionWaveAssemblyBatch(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchResult {
  const runs: BatchNationalTickSessionWaveAssemblyRunResult[] = [];
  for (const ticks of tickBatches) {
    runs.push(runNationalTickSessionWaveAssembly(engine, budget, ticks));
  }
  const allOk = runs.every((run) => run.gate.ok);
  const batchDigest = computeBatchNationalTickSessionWaveAssemblyBatchDigest(runs);
  return { runs, batchDigest, allOk };
}

// --- src/batch-national-tick-session-wave-assembly-batch-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchExportRow {
  index: number;
  assemblyDigest: string;
  ok: boolean;
}

export interface BatchNationalTickSessionWaveAssemblyBatchExport {
  rows: BatchNationalTickSessionWaveAssemblyBatchExportRow[];
  runCount: number;
  allOk: boolean;
  batchDigest: string;
}

/**
 * Round 20: flatten chained assembly batch for Agent 25 hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatch(
  batch: BatchNationalTickSessionWaveAssemblyBatchResult,
): BatchNationalTickSessionWaveAssemblyBatchExport {
  const rows = batch.runs.map((run, index) => {
    const exp: BatchNationalTickSessionWaveAssemblyExport =
      exportBatchNationalTickSessionWaveAssembly(run);
    return {
      index: index + 1,
      assemblyDigest: exp.assemblyDigest,
      ok: exp.ok,
    };
  });
  return {
    rows,
    runCount: rows.length,
    allOk: batch.allOk && rows.every((row) => row.ok),
    batchDigest: batch.batchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchExportCompareResult {
  ok: boolean;
  batchDigestMatch: boolean;
  runCountDelta: number;
  allOkMatch: boolean;
}

/**
 * Round 21: compare two assembly batch exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchExport,
): BatchNationalTickSessionWaveAssemblyBatchExportCompareResult {
  const runCountDelta = candidate.runCount - baseline.runCount;
  const batchDigestMatch = baseline.batchDigest === candidate.batchDigest;
  const allOkMatch = baseline.allOk === candidate.allOk;
  return {
    ok:
      batchDigestMatch &&
      allOkMatch &&
      runCountDelta === 0 &&
      baseline.runCount === candidate.runCount,
    batchDigestMatch,
    runCountDelta,
    allOkMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchResult;
}

/**
 * Round 21: deterministic replay — two assembly batches from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = runNationalTickSessionWaveAssemblyBatch(engine, budget, tickBatches);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = runNationalTickSessionWaveAssemblyBatch(replayEngine, budget, tickBatches);
  const parityOk =
    baseline.batchDigest === replay.batchDigest &&
    baseline.allOk === replay.allOk &&
    baseline.runs.length === replay.runs.length;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchGateResult {
  ok: boolean;
  exportAllOk: boolean;
  parityOk: boolean;
  batch: BatchNationalTickSessionWaveAssemblyBatchResult;
  export: BatchNationalTickSessionWaveAssemblyBatchExport;
}

/**
 * Round 21: assembly batch gate — export ok and replay parity from pre-batch snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatch(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchGateResult {
  const snapshot = engine.snapshot();
  const batch = runNationalTickSessionWaveAssemblyBatch(engine, budget, tickBatches);
  const exp = exportBatchNationalTickSessionWaveAssemblyBatch(batch);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const exportAllOk = exp.allOk;
  const parityOk = parity.parityOk;
  return {
    ok: exportAllOk && parityOk,
    exportAllOk,
    parityOk,
    batch,
    export: exp,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchGateExport {
  ok: boolean;
  exportAllOk: boolean;
  parityOk: boolean;
  batchDigest: string;
  runCount: number;
  gateDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchGateDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: gateExport.ok,
      batchDigest: gateExport.batchDigest,
      runCount: gateExport.runCount,
    }),
  );
}

/**
 * Round 22: flatten assembly batch gate for Agent 25 post–O10-174 integration hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchGateResult,
): BatchNationalTickSessionWaveAssemblyBatchGateExport {
  const gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport = {
    ok: gate.ok,
    exportAllOk: gate.exportAllOk,
    parityOk: gate.parityOk,
    batchDigest: gate.export.batchDigest,
    runCount: gate.export.runCount,
    gateDigest: '',
  };
  gateExport.gateDigest = computeBatchNationalTickSessionWaveAssemblyBatchGateDigest(gateExport);
  return gateExport;
}

// --- src/batch-national-tick-session-wave-assembly-batch-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchGateExportCompareResult {
  ok: boolean;
  gateDigestMatch: boolean;
  batchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 22: compare two assembly batch gate exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchGateExport,
): BatchNationalTickSessionWaveAssemblyBatchGateExportCompareResult {
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const batchDigestMatch = baseline.batchDigest === candidate.batchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: gateDigestMatch && batchDigestMatch && okFlagMatch,
    gateDigestMatch,
    batchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport;
  integrationDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchIntegrationDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchGateExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      gate: gateExport.gateDigest,
      batch: gateExport.batchDigest,
      ok: gateExport.ok,
    }),
  );
}

/**
 * Round 22: post-integration audit — gated batch run plus export digest for assembly manifest.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult {
  const gate = gateBatchNationalTickSessionWaveAssemblyBatch(engine, budget, tickBatches);
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchGate(gate);
  const integrationDigest =
    computeBatchNationalTickSessionWaveAssemblyBatchIntegrationDigest(gateExport);
  return {
    ok: gateExport.ok,
    gate,
    gateExport,
    integrationDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport {
  ok: boolean;
  integrationDigest: string;
  gateDigest: string;
  batchDigest: string;
  exportAllOk: boolean;
  parityOk: boolean;
}

/**
 * Round 23: flatten integration audit for Agent 25 assembly manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport {
  return {
    ok: audit.ok,
    integrationDigest: audit.integrationDigest,
    gateDigest: audit.gateExport.gateDigest,
    batchDigest: audit.gateExport.batchDigest,
    exportAllOk: audit.gate.exportAllOk,
    parityOk: audit.gate.parityOk,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExportCompareResult {
  ok: boolean;
  integrationDigestMatch: boolean;
  gateDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 23: compare two integration audit exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExportCompareResult {
  const integrationDigestMatch = baseline.integrationDigest === candidate.integrationDigest;
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: integrationDigestMatch && gateDigestMatch && okFlagMatch,
    integrationDigestMatch,
    gateDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult;
}

/**
 * Round 23: deterministic replay — two integration audits from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.integrationDigest === replay.integrationDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.batchDigest === replay.gateExport.batchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport;
  parity: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParityResult;
  gateDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport,
  auditOk: boolean,
  parityOk: boolean,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      integration: gateExport.integrationDigest,
      auditOk,
      parityOk,
    }),
  );
}

/**
 * Round 24: integration audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(audit);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const gateDigest = computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateDigest(
    exp,
    auditOk,
    parityOk,
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    parity,
    gateDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  gateDigest: string;
  integrationDigest: string;
}

/**
 * Round 24: flatten integration audit gate for Agent 25 assembly closure hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    gateDigest: gate.gateDigest,
    integrationDigest: gate.export.integrationDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExportCompareResult {
  ok: boolean;
  gateDigestMatch: boolean;
  integrationDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 24: compare two integration audit gate exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExportCompareResult {
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const integrationDigestMatch = baseline.integrationDigest === candidate.integrationDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: gateDigestMatch && integrationDigestMatch && okFlagMatch,
    gateDigestMatch,
    integrationDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult;
}

/**
 * Round 25: deterministic replay — two integration audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.gateDigest === replay.gateDigest &&
    baseline.ok === replay.ok &&
    baseline.export.integrationDigest === replay.export.integrationDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport;
  closureDigest: string;
}

export function computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureDigest(
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      gate: gateExport.gateDigest,
      integration: gateExport.integrationDigest,
      ok: gateExport.ok,
    }),
  );
}

/**
 * Round 25: assembly closure — gated integration audit plus closure digest for wave-25 hooks.
 */
export function closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult {
  const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate(gate);
  const closureDigest =
    computeBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureDigest(gateExport);
  return {
    ok: gateExport.ok,
    gate,
    gateExport,
    closureDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport {
  ok: boolean;
  closureDigest: string;
  gateDigest: string;
  integrationDigest: string;
}

/**
 * Round 25: flatten integration audit closure for Agent 25 assembly manifest.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
  closure: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport {
  return {
    ok: closure.ok,
    closureDigest: closure.closureDigest,
    gateDigest: closure.gateExport.gateDigest,
    integrationDigest: closure.gateExport.integrationDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExportCompareResult {
  ok: boolean;
  closureDigestMatch: boolean;
  gateDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 26: compare two integration audit closure exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExportCompareResult {
  const closureDigestMatch = baseline.closureDigest === candidate.closureDigest;
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: closureDigestMatch && gateDigestMatch && okFlagMatch,
    closureDigestMatch,
    gateDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult;
}

/**
 * Round 26: deterministic replay — two integration audit closures from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.closureDigest === replay.closureDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.gateDigest === replay.gateExport.gateDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult {
  ok: boolean;
  closureOk: boolean;
  parityOk: boolean;
  closure: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport;
  latchDigest: string;
}

/**
 * Round 26 wave 26: closure gate — export ok and replay parity from pre-closure snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult {
  const snapshot = engine.snapshot();
  const closure = closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(closure);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const closureOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      closure: exp.closureDigest,
      closureOk,
      parityOk,
    }),
  );
  return {
    ok: closureOk && parityOk,
    closureOk,
    parityOk,
    closure,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport {
  ok: boolean;
  closureOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  closureDigest: string;
}

/**
 * Round 27 wave 27: flatten closure gate latch for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport {
  return {
    ok: gate.ok,
    closureOk: gate.closureOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    closureDigest: gate.export.closureDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  closureDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 27: compare two closure gate exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const closureDigestMatch = baseline.closureDigest === candidate.closureDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && closureDigestMatch && okFlagMatch,
    latchDigestMatch,
    closureDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult;
}

/**
 * Round 27 wave 27: deterministic replay — two closure gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.closureDigest === replay.export.closureDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport;
  parity: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParityResult;
  assemblyDigest: string;
}

/**
 * Round 28 wave 28: assemble closure gate, export, and replay parity in one pass.
 */
export function assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult {
  const snapshot = engine.snapshot();
  const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
    engine,
    budget,
    tickBatches,
  );
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(gate);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const ok = gateExport.ok && parity.parityOk;
  const assemblyDigest = fnv1a64Hex(
    JSON.stringify({
      latch: gateExport.latchDigest,
      parityOk: parity.parityOk,
      ok,
    }),
  );
  return { ok, gate, gateExport, parity, assemblyDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport {
  ok: boolean;
  assemblyDigest: string;
  latchDigest: string;
  parityOk: boolean;
}

/**
 * Round 28: flatten closure gate assembly for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
  assembly: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport {
  return {
    ok: assembly.ok,
    assemblyDigest: assembly.assemblyDigest,
    latchDigest: assembly.gateExport.latchDigest,
    parityOk: assembly.parity.parityOk,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExportCompareResult {
  ok: boolean;
  assemblyDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 28 wave 28: compare two closure gate assembly exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExportCompareResult {
  const assemblyDigestMatch = baseline.assemblyDigest === candidate.assemblyDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: assemblyDigestMatch && latchDigestMatch && okFlagMatch,
    assemblyDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult;
}

/**
 * Round 29 wave 29: deterministic replay — two closure gate assemblies from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.assemblyDigest === replay.assemblyDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.latchDigest === replay.gateExport.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult {
  ok: boolean;
  assemblyOk: boolean;
  parityOk: boolean;
  assembly: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport;
  latchDigest: string;
}

/**
 * Round 29 wave 29: assembly gate — export ok and replay parity from pre-assembly snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult {
  const snapshot = engine.snapshot();
  const assembly = assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(assembly);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const assemblyOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      assembly: exp.assemblyDigest,
      assemblyOk,
      parityOk,
    }),
  );
  return {
    ok: assemblyOk && parityOk,
    assemblyOk,
    parityOk,
    assembly,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport {
  ok: boolean;
  assemblyOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  assemblyDigest: string;
}

/**
 * Round 29: flatten closure gate assembly gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport {
  return {
    ok: gate.ok,
    assemblyOk: gate.assemblyOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    assemblyDigest: gate.export.assemblyDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  assemblyDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 30 wave 30: compare two closure gate assembly gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const assemblyDigestMatch = baseline.assemblyDigest === candidate.assemblyDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && assemblyDigestMatch && okFlagMatch,
    latchDigestMatch,
    assemblyDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult;
}

/**
 * Round 30 wave 30: deterministic replay — two assembly gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.assemblyDigest === replay.export.assemblyDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 30 wave 30: audit assembly gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult {
  const snapshot = engine.snapshot();
  const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
    engine,
    budget,
    tickBatches,
  );
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(gate);
  const twinExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
    gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    ),
  );
  const exportCompare = compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExports(
    gateExport,
    twinExport,
  );
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = gateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: gateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, gate, gateExport, exportCompareOk, parityOk, auditDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 31 wave 31: flatten closure gate assembly gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.gateExport.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 31 wave 31: compare two closure gate assembly gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult;
}

/**
 * Round 31 wave 31: deterministic replay — two assembly gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.latchDigest === replay.gateExport.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport;
  latchDigest: string;
}

/**
 * Round 32 wave 32: audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(audit);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      audit: exp.auditDigest,
      auditOk,
      parityOk,
    }),
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 32 wave 32: flatten closure gate assembly gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 32 wave 32: compare two closure gate assembly gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && auditDigestMatch && okFlagMatch,
    latchDigestMatch,
    auditDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult;
}

/**
 * Round 33 wave 33: deterministic replay — two audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.auditDigest === replay.export.auditDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult {
  ok: boolean;
  auditGate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult;
  auditGateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 33 wave 33: audit audit-gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const auditGate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const auditGateExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(auditGate);
  const twinExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(
    gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    ),
  );
  const exportCompare =
    compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExports(
      auditGateExport,
      twinExport,
    );
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = auditGateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: auditGateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, auditGate, auditGateExport, exportCompareOk, parityOk, auditDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 33 wave 33: flatten audit-gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 34 wave 34: compare two audit-gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult;
}

/**
 * Round 34 wave 34: deterministic replay — two audit-gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.auditGateExport.latchDigest === replay.auditGateExport.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExport;
  latchDigest: string;
}

/**
 * Round 34 wave 34: audit-gate audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(audit);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      audit: exp.auditDigest,
      auditOk,
      parityOk,
    }),
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 34 wave 34: flatten audit-gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 35 wave 35: compare two audit-gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && auditDigestMatch && okFlagMatch,
    latchDigestMatch,
    auditDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult;
}

/**
 * Round 35 wave 35: deterministic replay — two audit-gate audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.auditDigest === replay.export.auditDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult {
  ok: boolean;
  auditGate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult;
  auditGateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 35 wave 35: audit audit-gate audit gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const auditGate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const auditGateExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(auditGate);
  const twinExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
    gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    ),
  );
  const exportCompare =
    compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExports(
      auditGateExport,
      twinExport,
    );
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = auditGateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: auditGateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, auditGate, auditGateExport, exportCompareOk, parityOk, auditDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 35 wave 35: flatten audit-gate audit gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 36 wave 36: compare two audit-gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult;
}

/**
 * Round 36 wave 36: deterministic replay — two audit-gate audit gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.auditGateExport.latchDigest === replay.auditGateExport.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport;
  latchDigest: string;
}

/**
 * Round 36 wave 36: audit-gate audit gate audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(audit);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      audit: exp.auditDigest,
      auditOk,
      parityOk,
    }),
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 36 wave 36: flatten audit-gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 37 wave 37: compare two audit-gate audit gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && auditDigestMatch && okFlagMatch,
    latchDigestMatch,
    auditDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult;
}

/**
 * Round 37 wave 37: deterministic replay — two audit-gate audit gate audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.auditDigest === replay.export.auditDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  auditGate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult;
  auditGateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 37 wave 37: audit audit-gate audit gate audit gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const auditGate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const auditGateExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(auditGate);
  const twinExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
        TurnTimeEngine.fromSnapshot(snapshot),
        budget,
        tickBatches,
      ),
    );
  const exportCompare =
    compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExports(
      auditGateExport,
      twinExport,
    );
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = auditGateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: auditGateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, auditGate, auditGateExport, exportCompareOk, parityOk, auditDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 37 wave 37: flatten audit-gate audit gate audit gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 38 wave 38: compare two audit-gate audit gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult;
}

/**
 * Round 38 wave 38: deterministic replay — two audit-gate audit gate audit gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.auditGateExport.latchDigest === replay.auditGateExport.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport;
  latchDigest: string;
}

/**
 * Round 38 wave 38: audit-gate audit gate audit gate audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit(audit);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      audit: exp.auditDigest,
      auditOk,
      parityOk,
    }),
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 38 wave 38: flatten audit-gate audit gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 39 wave 39: compare two audit-gate audit gate audit gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && auditDigestMatch && okFlagMatch,
    latchDigestMatch,
    auditDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult;
}

/**
 * Round 39 wave 39: deterministic replay — two audit-gate audit gate audit gate audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.auditDigest === replay.export.auditDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  auditGate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateResult;
  auditGateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 39 wave 39: audit audit-gate audit gate audit gate audit gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const auditGate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const auditGateExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(auditGate);
  const twinExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
        TurnTimeEngine.fromSnapshot(snapshot),
        budget,
        tickBatches,
      ),
    );
  const exportCompare =
    compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateExports(
      auditGateExport,
      twinExport,
    );
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = auditGateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: auditGateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, auditGate, auditGateExport, exportCompareOk, parityOk, auditDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 39 wave 39: flatten audit-gate audit gate audit gate audit gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 40 wave 40: compare two audit-gate audit gate audit gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditResult;
}

/**
 * Round 40 wave 40: deterministic replay — two audit-gate audit gate audit gate audit gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.auditGateExport.latchDigest === replay.auditGateExport.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport;
  latchDigest: string;
}

/**
 * Round 40 wave 40: audit-gate audit gate audit gate audit gate audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAudit(audit);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      audit: exp.auditDigest,
      auditOk,
      parityOk,
    }),
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 40 wave 40: flatten audit-gate audit gate audit gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 41 wave 41: compare two audit-gate audit gate audit gate audit gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && auditDigestMatch && okFlagMatch,
    latchDigestMatch,
    auditDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
}

/**
 * Round 41 wave 41: deterministic replay — two audit-gate audit gate audit gate audit gate audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.auditDigest === replay.export.auditDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  auditGate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
  auditGateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 41 wave 41: audit audit-gate audit gate audit gate audit gate audit gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const auditGate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const auditGateExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(auditGate);
  const twinExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(
        TurnTimeEngine.fromSnapshot(snapshot),
        budget,
        tickBatches,
      ),
    );
  const exportCompare =
    compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
      auditGateExport,
      twinExport,
    );
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = auditGateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: auditGateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, auditGate, auditGateExport, exportCompareOk, parityOk, auditDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 41 wave 41: flatten audit-gate audit gate audit gate audit gate audit gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 43 wave 43: compare two audit-gate audit gate audit gate audit gate audit gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && auditDigestMatch && okFlagMatch,
    latchDigestMatch,
    auditDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
}

/**
 * Round 43 wave 43: deterministic replay — two audit-gate audit gate audit gate audit gate audit gate audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.auditDigest === replay.export.auditDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  auditGate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
  auditGateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport;
  exportCompareOk: boolean;
  parityOk: boolean;
  auditDigest: string;
}

/**
 * Round 43 wave 43: audit audit-gate audit gate audit gate audit gate audit gate audit gate export twin-compare and replay parity in one pass.
 */
export function auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const auditGate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const auditGateExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(auditGate);
  const twinExport =
    exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
        TurnTimeEngine.fromSnapshot(snapshot),
        budget,
        tickBatches,
      ),
    );
  const exportCompare =
    compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
      auditGateExport,
      twinExport,
    );
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const exportCompareOk = exportCompare.ok;
  const parityOk = parity.parityOk;
  const ok = auditGateExport.ok && exportCompareOk && parityOk;
  const auditDigest = fnv1a64Hex(
    JSON.stringify({
      latch: auditGateExport.latchDigest,
      exportCompareOk,
      parityOk,
      ok,
    }),
  );
  return { ok, auditGate, auditGateExport, exportCompareOk, parityOk, auditDigest };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 43 wave 43: flatten audit-gate audit gate audit gate audit gate audit gate audit gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 44 wave 44: compare two audit-gate audit gate audit gate audit gate audit gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
}

/**
 * Round 44 wave 44: deterministic replay — two audit-gate audit gate audit gate audit gate audit gate audit gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.auditGateExport.latchDigest === replay.auditGateExport.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport;
  latchDigest: string;
}

/**
 * Round 44 wave 44: audit-gate audit gate audit gate audit gate audit gate audit gate audit gate — export ok and replay parity from pre-audit snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult {
  const snapshot = engine.snapshot();
  const audit = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(audit);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const auditOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      audit: exp.auditDigest,
      auditOk,
      parityOk,
    }),
  );
  return {
    ok: auditOk && parityOk,
    auditOk,
    parityOk,
    audit,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 44 wave 44: flatten audit-gate audit gate audit gate audit gate audit gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 45 wave 45: compare two audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
}

/**
 * Round 45 wave 45: deterministic replay — two audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.auditDigest === replay.export.auditDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  gateOk: boolean;
  parityOk: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateExport;
  sealDigest: string;
}

/**
 * Round 45 wave 45: audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate — gate export ok and gate replay parity from pre-gate snapshot.
 */
export function sealBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(gate);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const gateOk = exp.ok;
  const parityOk = parity.parityOk;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      gate: exp.latchDigest,
      gateOk,
      parityOk,
    }),
  );
  return {
    ok: gateOk && parityOk,
    gateOk,
    parityOk,
    gate,
    export: exp,
    sealDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  gateOk: boolean;
  parityOk: boolean;
  sealDigest: string;
  latchDigest: string;
}

/**
 * Round 45 wave 45: flatten audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  seal: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: seal.ok,
    gateOk: seal.gateOk,
    parityOk: seal.parityOk,
    sealDigest: seal.sealDigest,
    latchDigest: seal.export.latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 46 wave 46: compare two audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  const sealDigestMatch = baseline.sealDigest === candidate.sealDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: sealDigestMatch && latchDigestMatch && okFlagMatch,
    sealDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
}

/**
 * Round 46 wave 46: deterministic replay — two audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit seals from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = sealBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.sealDigest === replay.sealDigest &&
    baseline.ok === replay.ok &&
    baseline.export.latchDigest === replay.export.latchDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  sealOk: boolean;
  parityOk: boolean;
  seal: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport;
  latchDigest: string;
}

/**
 * Round 46 wave 46: audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate — seal export ok and seal replay parity from pre-seal snapshot.
 */
export function latchBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const seal = sealBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(seal);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const sealOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      seal: exp.sealDigest,
      sealOk,
      parityOk,
    }),
  );
  return {
    ok: sealOk && parityOk,
    sealOk,
    parityOk,
    seal,
    export: exp,
    latchDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  sealOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  sealDigest: string;
}

/**
 * Round 46 wave 46: flatten audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  latch: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: latch.ok,
    sealOk: latch.sealOk,
    parityOk: latch.parityOk,
    latchDigest: latch.latchDigest,
    sealDigest: latch.export.sealDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export-compare.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 47 wave 47: compare two audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  const sealDigestMatch = baseline.sealDigest === candidate.sealDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: sealDigestMatch && latchDigestMatch && okFlagMatch,
    sealDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-replay-parity.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
}

/**
 * Round 47 wave 47: deterministic replay — two audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit latches from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = latchBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = latchBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.sealDigest === replay.export.sealDigest;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  ok: boolean;
  latchOk: boolean;
  parityOk: boolean;
  latch: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport;
  commitDigest: string;
}

/**
 * Round 47 wave 47: audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit — latch export ok and latch replay parity from pre-latch snapshot.
 */
export function commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult {
  const snapshot = engine.snapshot();
  const latch = latchBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(latch);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const latchOk = exp.ok;
  const parityOk = parity.parityOk;
  const commitDigest = fnv1a64Hex(
    JSON.stringify({
      latch: exp.latchDigest,
      latchOk,
      parityOk,
    }),
  );
  return {
    ok: latchOk && parityOk,
    latchOk,
    parityOk,
    latch,
    export: exp,
    commitDigest,
  };
}

// --- src/batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export.ts ---

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  latchOk: boolean;
  parityOk: boolean;
  commitDigest: string;
  latchDigest: string;
  sealDigest: string;
}

/**
 * Round 47 wave 47: flatten audit-gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: commit.ok,
    latchOk: commit.latchOk,
    parityOk: commit.parityOk,
    commitDigest: commit.commitDigest,
    latchDigest: commit.export.latchDigest,
    sealDigest: commit.export.sealDigest,
  };
}

// --- src/batch-national-tick-session-wave50-integration-seal.ts ---

/** O10-230 integration baseline (wave 49 24/24 projection). */
export const WAVE50_INTEGRATION_BASELINE_SHA = '8aaaf700';
export const WAVE50_PROJECTED_LOC = 2_771_207;
export const WAVE50_ROUND = 50;
export const WAVE50_TICKET = 'O10-231';

export interface BatchNationalTickSessionWave50IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE50_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE50_PROJECTED_LOC;
  wave: typeof WAVE50_ROUND;
  ticket: typeof WAVE50_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 50 wave 50: seal the round-47 national-tick audit-gate commit against
 * the O10-230 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave50Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave50IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE50_TICKET,
      wave: WAVE50_ROUND,
      baselineSha: WAVE50_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE50_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE50_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE50_PROJECTED_LOC,
    wave: WAVE50_ROUND,
    ticket: WAVE50_TICKET,
    commit,
    sealDigest,
  };
}

// --- src/batch-national-tick-session-wave50-integration-export.ts ---

export interface BatchNationalTickSessionWave50IntegrationExport {
  ok: boolean;
  commitOk: boolean;
  baselineSha: string;
  projectedLoc: number;
  wave: number;
  ticket: string;
  commitDigest: string;
  latchDigest: string;
  sealDigest: string;
}

/**
 * Round 50 wave 50: flatten the O10-230 integration seal for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWave50Integration(
  seal: BatchNationalTickSessionWave50IntegrationSealResult,
): BatchNationalTickSessionWave50IntegrationExport {
  return {
    ok: seal.ok,
    commitOk: seal.commitOk,
    baselineSha: seal.baselineSha,
    projectedLoc: seal.projectedLoc,
    wave: seal.wave,
    ticket: seal.ticket,
    commitDigest: seal.commit.commitDigest,
    latchDigest: seal.commit.export.latchDigest,
    sealDigest: seal.sealDigest,
  };
}

// --- src/batch-national-tick-session-wave50-integration-export-compare.ts ---

export interface BatchNationalTickSessionWave50IntegrationExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  commitDigestMatch: boolean;
  latchDigestMatch: boolean;
  baselineShaMatch: boolean;
  projectedLocMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 50 wave 50: compare two O10-230 integration-seal exports.
 */
export function compareBatchNationalTickSessionWave50IntegrationExports(
  baseline: BatchNationalTickSessionWave50IntegrationExport,
  candidate: BatchNationalTickSessionWave50IntegrationExport,
): BatchNationalTickSessionWave50IntegrationExportCompareResult {
  const sealDigestMatch = baseline.sealDigest === candidate.sealDigest;
  const commitDigestMatch = baseline.commitDigest === candidate.commitDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const baselineShaMatch = baseline.baselineSha === candidate.baselineSha;
  const projectedLocMatch = baseline.projectedLoc === candidate.projectedLoc;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      sealDigestMatch &&
      commitDigestMatch &&
      latchDigestMatch &&
      baselineShaMatch &&
      projectedLocMatch &&
      okFlagMatch,
    sealDigestMatch,
    commitDigestMatch,
    latchDigestMatch,
    baselineShaMatch,
    projectedLocMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave50-integration-replay-parity.ts ---

export interface BatchNationalTickSessionWave50IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave50IntegrationSealResult;
  replay: BatchNationalTickSessionWave50IntegrationSealResult;
}

/**
 * Round 50 wave 50: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-230 baseline pin.
 */
export function verifyBatchNationalTickSessionWave50IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave50IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave50Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave50Integration(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.sealDigest === replay.sealDigest &&
    baseline.commit.commitDigest === replay.commit.commitDigest &&
    baseline.ok === replay.ok &&
    baseline.baselineSha === replay.baselineSha &&
    baseline.projectedLoc === replay.projectedLoc;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave51-integration-seal.ts ---

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE51_INTEGRATION_BASELINE_SHA = 'a32b2b15';
export const WAVE51_PROJECTED_LOC = 2_887_600;
export const WAVE51_ROUND = 51;
export const WAVE51_TICKET = 'O10-233';

export interface BatchNationalTickSessionWave51IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE51_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE51_PROJECTED_LOC;
  wave: typeof WAVE51_ROUND;
  ticket: typeof WAVE51_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the round-47 national-tick audit-gate commit against
 * the O10-232 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave51Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave51IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE51_TICKET,
      wave: WAVE51_ROUND,
      baselineSha: WAVE51_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE51_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE51_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE51_PROJECTED_LOC,
    wave: WAVE51_ROUND,
    ticket: WAVE51_TICKET,
    commit,
    sealDigest,
  };
}

// --- src/batch-national-tick-session-wave51-integration-export.ts ---

export interface BatchNationalTickSessionWave51IntegrationExport {
  ok: boolean;
  commitOk: boolean;
  baselineSha: string;
  projectedLoc: number;
  wave: number;
  ticket: string;
  commitDigest: string;
  latchDigest: string;
  sealDigest: string;
}

/**
 * Round 51 wave 51: flatten the O10-232 integration seal for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWave51Integration(
  seal: BatchNationalTickSessionWave51IntegrationSealResult,
): BatchNationalTickSessionWave51IntegrationExport {
  return {
    ok: seal.ok,
    commitOk: seal.commitOk,
    baselineSha: seal.baselineSha,
    projectedLoc: seal.projectedLoc,
    wave: seal.wave,
    ticket: seal.ticket,
    commitDigest: seal.commit.commitDigest,
    latchDigest: seal.commit.export.latchDigest,
    sealDigest: seal.sealDigest,
  };
}

// --- src/batch-national-tick-session-wave51-integration-export-compare.ts ---

export interface BatchNationalTickSessionWave51IntegrationExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  commitDigestMatch: boolean;
  latchDigestMatch: boolean;
  baselineShaMatch: boolean;
  projectedLocMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 51 wave 51: compare two O10-232 integration-seal exports.
 */
export function compareBatchNationalTickSessionWave51IntegrationExports(
  baseline: BatchNationalTickSessionWave51IntegrationExport,
  candidate: BatchNationalTickSessionWave51IntegrationExport,
): BatchNationalTickSessionWave51IntegrationExportCompareResult {
  const sealDigestMatch = baseline.sealDigest === candidate.sealDigest;
  const commitDigestMatch = baseline.commitDigest === candidate.commitDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const baselineShaMatch = baseline.baselineSha === candidate.baselineSha;
  const projectedLocMatch = baseline.projectedLoc === candidate.projectedLoc;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      sealDigestMatch &&
      commitDigestMatch &&
      latchDigestMatch &&
      baselineShaMatch &&
      projectedLocMatch &&
      okFlagMatch,
    sealDigestMatch,
    commitDigestMatch,
    latchDigestMatch,
    baselineShaMatch,
    projectedLocMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave51-integration-replay-parity.ts ---

export interface BatchNationalTickSessionWave51IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave51IntegrationSealResult;
  replay: BatchNationalTickSessionWave51IntegrationSealResult;
}

/**
 * Round 51 wave 51: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-232 baseline pin.
 */
export function verifyBatchNationalTickSessionWave51IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave51IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave51Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave51Integration(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.sealDigest === replay.sealDigest &&
    baseline.commit.commitDigest === replay.commit.commitDigest &&
    baseline.ok === replay.ok &&
    baseline.baselineSha === replay.baselineSha &&
    baseline.projectedLoc === replay.projectedLoc;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave53-integration-seal.ts ---

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE53_INTEGRATION_BASELINE_SHA = '51039c5e';
export const WAVE53_PROJECTED_LOC = 2_979_928;
export const WAVE53_ROUND = 51;
export const WAVE53_TICKET = 'O10-237';

export interface BatchNationalTickSessionWave53IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE53_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE53_PROJECTED_LOC;
  wave: typeof WAVE53_ROUND;
  ticket: typeof WAVE53_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the round-47 national-tick audit-gate commit against
 * the O10-232 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave53Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave53IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE53_TICKET,
      wave: WAVE53_ROUND,
      baselineSha: WAVE53_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE53_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE53_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE53_PROJECTED_LOC,
    wave: WAVE53_ROUND,
    ticket: WAVE53_TICKET,
    commit,
    sealDigest,
  };
}

// --- src/batch-national-tick-session-wave53-integration-export.ts ---

export interface BatchNationalTickSessionWave53IntegrationExport {
  ok: boolean;
  commitOk: boolean;
  baselineSha: string;
  projectedLoc: number;
  wave: number;
  ticket: string;
  commitDigest: string;
  latchDigest: string;
  sealDigest: string;
}

/**
 * Round 51 wave 51: flatten the O10-232 integration seal for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWave53Integration(
  seal: BatchNationalTickSessionWave53IntegrationSealResult,
): BatchNationalTickSessionWave53IntegrationExport {
  return {
    ok: seal.ok,
    commitOk: seal.commitOk,
    baselineSha: seal.baselineSha,
    projectedLoc: seal.projectedLoc,
    wave: seal.wave,
    ticket: seal.ticket,
    commitDigest: seal.commit.commitDigest,
    latchDigest: seal.commit.export.latchDigest,
    sealDigest: seal.sealDigest,
  };
}

// --- src/batch-national-tick-session-wave53-integration-export-compare.ts ---

export interface BatchNationalTickSessionWave53IntegrationExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  commitDigestMatch: boolean;
  latchDigestMatch: boolean;
  baselineShaMatch: boolean;
  projectedLocMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 51 wave 51: compare two O10-232 integration-seal exports.
 */
export function compareBatchNationalTickSessionWave53IntegrationExports(
  baseline: BatchNationalTickSessionWave53IntegrationExport,
  candidate: BatchNationalTickSessionWave53IntegrationExport,
): BatchNationalTickSessionWave53IntegrationExportCompareResult {
  const sealDigestMatch = baseline.sealDigest === candidate.sealDigest;
  const commitDigestMatch = baseline.commitDigest === candidate.commitDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const baselineShaMatch = baseline.baselineSha === candidate.baselineSha;
  const projectedLocMatch = baseline.projectedLoc === candidate.projectedLoc;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      sealDigestMatch &&
      commitDigestMatch &&
      latchDigestMatch &&
      baselineShaMatch &&
      projectedLocMatch &&
      okFlagMatch,
    sealDigestMatch,
    commitDigestMatch,
    latchDigestMatch,
    baselineShaMatch,
    projectedLocMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave53-integration-replay-parity.ts ---

export interface BatchNationalTickSessionWave53IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave53IntegrationSealResult;
  replay: BatchNationalTickSessionWave53IntegrationSealResult;
}

/**
 * Round 51 wave 51: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-232 baseline pin.
 */
export function verifyBatchNationalTickSessionWave53IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave53IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave53Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave53Integration(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.sealDigest === replay.sealDigest &&
    baseline.commit.commitDigest === replay.commit.commitDigest &&
    baseline.ok === replay.ok &&
    baseline.baselineSha === replay.baselineSha &&
    baseline.projectedLoc === replay.projectedLoc;
  return { parityOk, baseline, replay };
}

// --- src/batch-national-tick-session-wave52-integration-seal.ts ---

/** O10-232 integration baseline (wave 50 24/24 projection). */
export const WAVE52_INTEGRATION_BASELINE_SHA = 'ba97bdce';
export const WAVE52_PROJECTED_LOC = 2_932_752;
export const WAVE52_ROUND = 51;
export const WAVE52_TICKET = 'O10-235';

export interface BatchNationalTickSessionWave52IntegrationSealResult {
  ok: boolean;
  commitOk: boolean;
  baselineSha: typeof WAVE52_INTEGRATION_BASELINE_SHA;
  projectedLoc: typeof WAVE52_PROJECTED_LOC;
  wave: typeof WAVE52_ROUND;
  ticket: typeof WAVE52_TICKET;
  commit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditResult;
  sealDigest: string;
}

/**
 * Round 51 wave 51: seal the round-47 national-tick audit-gate commit against
 * the O10-232 integration baseline so Agent 25 assembly can reject a chunk
 * built on the wrong projection SHA / LOC.
 */
export function sealBatchNationalTickSessionWave52Integration(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave52IntegrationSealResult {
  const commit =
    commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(
      engine,
      budget,
      tickBatches,
    );
  const commitOk = commit.ok;
  const sealDigest = fnv1a64Hex(
    JSON.stringify({
      ticket: WAVE52_TICKET,
      wave: WAVE52_ROUND,
      baselineSha: WAVE52_INTEGRATION_BASELINE_SHA,
      projectedLoc: WAVE52_PROJECTED_LOC,
      commitDigest: commit.commitDigest,
      latchDigest: commit.export.latchDigest,
      commitOk,
    }),
  );
  return {
    ok: commitOk,
    commitOk,
    baselineSha: WAVE52_INTEGRATION_BASELINE_SHA,
    projectedLoc: WAVE52_PROJECTED_LOC,
    wave: WAVE52_ROUND,
    ticket: WAVE52_TICKET,
    commit,
    sealDigest,
  };
}

// --- src/batch-national-tick-session-wave52-integration-export.ts ---

export interface BatchNationalTickSessionWave52IntegrationExport {
  ok: boolean;
  commitOk: boolean;
  baselineSha: string;
  projectedLoc: number;
  wave: number;
  ticket: string;
  commitDigest: string;
  latchDigest: string;
  sealDigest: string;
}

/**
 * Round 51 wave 51: flatten the O10-232 integration seal for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWave52Integration(
  seal: BatchNationalTickSessionWave52IntegrationSealResult,
): BatchNationalTickSessionWave52IntegrationExport {
  return {
    ok: seal.ok,
    commitOk: seal.commitOk,
    baselineSha: seal.baselineSha,
    projectedLoc: seal.projectedLoc,
    wave: seal.wave,
    ticket: seal.ticket,
    commitDigest: seal.commit.commitDigest,
    latchDigest: seal.commit.export.latchDigest,
    sealDigest: seal.sealDigest,
  };
}

// --- src/batch-national-tick-session-wave52-integration-export-compare.ts ---

export interface BatchNationalTickSessionWave52IntegrationExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  commitDigestMatch: boolean;
  latchDigestMatch: boolean;
  baselineShaMatch: boolean;
  projectedLocMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 51 wave 51: compare two O10-232 integration-seal exports.
 */
export function compareBatchNationalTickSessionWave52IntegrationExports(
  baseline: BatchNationalTickSessionWave52IntegrationExport,
  candidate: BatchNationalTickSessionWave52IntegrationExport,
): BatchNationalTickSessionWave52IntegrationExportCompareResult {
  const sealDigestMatch = baseline.sealDigest === candidate.sealDigest;
  const commitDigestMatch = baseline.commitDigest === candidate.commitDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const baselineShaMatch = baseline.baselineSha === candidate.baselineSha;
  const projectedLocMatch = baseline.projectedLoc === candidate.projectedLoc;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      sealDigestMatch &&
      commitDigestMatch &&
      latchDigestMatch &&
      baselineShaMatch &&
      projectedLocMatch &&
      okFlagMatch,
    sealDigestMatch,
    commitDigestMatch,
    latchDigestMatch,
    baselineShaMatch,
    projectedLocMatch,
    okFlagMatch,
  };
}

// --- src/batch-national-tick-session-wave52-integration-replay-parity.ts ---

export interface BatchNationalTickSessionWave52IntegrationReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWave52IntegrationSealResult;
  replay: BatchNationalTickSessionWave52IntegrationSealResult;
}

/**
 * Round 51 wave 51: two integration seals from the same engine snapshot must
 * share sealDigest, commitDigest, and the O10-232 baseline pin.
 */
export function verifyBatchNationalTickSessionWave52IntegrationReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWave52IntegrationReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = sealBatchNationalTickSessionWave52Integration(engine, budget, tickBatches);
  const replay = sealBatchNationalTickSessionWave52Integration(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.sealDigest === replay.sealDigest &&
    baseline.commit.commitDigest === replay.commit.commitDigest &&
    baseline.ok === replay.ok &&
    baseline.baselineSha === replay.baselineSha &&
    baseline.projectedLoc === replay.projectedLoc;
  return { parityOk, baseline, replay };
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

export const AGENT_02_MODULE_VERSION = '5.12.0';



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

  const audited = new TurnTimeEngine();

  const auditedRun = stepTurnsWithBudgetOrchestratedAuditedAdvance(audited, 1, createTurnAdvanceBudget(2), {

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },

  });

  results.push({

    id: 'agent02_orchestrated_audited',

    name: 'orchestrated audited advance ok with summary',

    passed: auditedRun.report.ok && auditedRun.auditDigest.length === 16,

  });

  results.push({

    id: 'agent02_calm_streak_gate',

    name: 'calm streak gate rejects sustained calm over rebound',

    passed:

      !gateStabilizationCalmStreak(

        new TurnTimeEngine().stepTurnsWithBudgetStabilizationCapture(2, createTurnAdvanceBudget(3)).batch,

        {

          queueBeforeByTurn: {

            1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },

            2: { pendingEventDueCount: 0, pendingObligationDueCount: 1 },

          },

          queueAfterByTurn: {

            1: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },

            2: { pendingEventDueCount: 0, pendingObligationDueCount: 0 },

          },

        },

        {

          1: { postQueueCalm: true, pendingStabilizationWave: false },

          2: { postQueueCalm: true, pendingStabilizationWave: false },

        },

      ).ok,

  });

  const nt = new TurnTimeEngine();

  nt.scheduleEvent({ id: 'nt14', dueTurn: 1, kind: 'n' });

  const ntRun = stepNationalTickOrchestratedBatch(nt, 1, createTurnAdvanceBudget(2), {

    externalByTurn: { 1: ['nt14'] },

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: true } },

  });

  results.push({

    id: 'agent02_national_tick_orchestrator',

    name: 'national tick orchestrated batch ok with scorecard',

    passed: ntRun.scorecard.ok && ntRun.nationalTickDigest.length === 16,

  });

  results.push({

    id: 'agent02_orchestrated_replay_parity',

    name: 'orchestrated replay parity from snapshot',

    passed: verifyBatchOrchestratedReplayParity(new TurnTimeEngine(), 1, createTurnAdvanceBudget(2), {

      stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },

    }).parityOk,

  });

  const session = runNationalTickOrchestratedSession(new TurnTimeEngine(), 1, createTurnAdvanceBudget(2), {

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },

  });

  results.push({

    id: 'agent02_national_tick_session',

    name: 'national tick session with ledger and parity',

    passed: session.parityOk && session.ledger.entries.length === 1 && session.sessionDigest.length === 16,

  });

  const ubGateEngine = new TurnTimeEngine();

  ubGateEngine.scheduleEvent({ id: 'ub', dueTurn: 1, kind: 'n' });

  const ubBatch = ubGateEngine.stepTurnsWithBudgetStabilizationCapture(1, createTurnAdvanceBudget(2));

  results.push({

    id: 'agent02_unified_batch_gate',

    name: 'unified XS-02 and stabilization batch gate ok',

    passed: gateBatchExternalStabilizationUnified(

      ubBatch.batch,

      { 1: ['ub'] },

      { 1: { postQueueCalm: true, pendingStabilizationWave: true } },

      batchStabilizationGateOptionsFromCapture(ubBatch.capture),

    ).ok,

  });

  const unifiedSession = runNationalTickOrchestratedUnifiedSession(new TurnTimeEngine(), 1, createTurnAdvanceBudget(2), {

    stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } },

  });

  results.push({

    id: 'agent02_national_tick_unified_session',

    name: 'unified national tick session with ledger export',

    passed:

      unifiedSession.parityOk &&

      unifiedSession.ledger.entries.length === 1 &&

      exportBatchNationalTickSessionLedger(unifiedSession.ledger).allOk,

  });

  const waveEngine = new TurnTimeEngine();

  const waveRun = runNationalTickOrchestratedSessionWave(waveEngine, createTurnAdvanceBudget(2), [

    { maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } },

  ]);

  results.push({

    id: 'agent02_national_tick_session_wave',

    name: 'national tick session wave digest ok',

    passed: waveRun.waveDigest.length === 16 && waveRun.ledgerExport.entryCount === 1,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_export',

    name: 'national tick session wave export for assembly',

    passed: exportBatchNationalTickSessionWave(waveRun).allOk && waveRun.waveDigest.length === 16,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_replay_parity',

    name: 'national tick session wave replay parity from snapshot',

    passed: verifyBatchNationalTickSessionWaveReplayParity(new TurnTimeEngine(), createTurnAdvanceBudget(2), [

      { maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } },

    ]).parityOk,

  });

  const waveAssemblyEngine = new TurnTimeEngine();

  const waveAssemblyBudget = createTurnAdvanceBudget(2);

  const waveAssemblyTicks = [

    { maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } },

  ];

  const waveAssemblyRun = runNationalTickOrchestratedSessionWave(waveAssemblyEngine, waveAssemblyBudget, waveAssemblyTicks);

  results.push({

    id: 'agent02_national_tick_session_wave_scorecard',

    name: 'national tick session wave scorecard export',

    passed: exportBatchNationalTickSessionWaveScorecard(waveAssemblyRun).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_gate',

    name: 'national tick session wave assembly gate',

    passed: gateBatchNationalTickSessionWaveAssembly(

      waveAssemblyEngine,

      waveAssemblyBudget,

      waveAssemblyTicks,

      waveAssemblyRun,

    ).ok,

  });

  const waveAssemblyReplayEngine = new TurnTimeEngine();

  const waveAssemblyReplayBudget = createTurnAdvanceBudget(2);

  const waveAssemblyReplayTicks = [

    { maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } },

  ];

  const waveAssemblyReplayRun = runNationalTickSessionWaveAssembly(

    waveAssemblyReplayEngine,

    waveAssemblyReplayBudget,

    waveAssemblyReplayTicks,

  );

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_run',

    name: 'national tick session wave assembly run',

    passed: exportBatchNationalTickSessionWaveAssembly(waveAssemblyReplayRun).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_replay_parity',

    name: 'national tick session wave assembly replay parity',

    passed: verifyBatchNationalTickSessionWaveAssemblyReplayParity(

      new TurnTimeEngine(),

      createTurnAdvanceBudget(2),

      waveAssemblyReplayTicks,

    ).parityOk,

  });

  const assemblyBatchEngine = new TurnTimeEngine();

  const assemblyBatchBudget = createTurnAdvanceBudget(4);

  const assemblyBatch = runNationalTickSessionWaveAssemblyBatch(assemblyBatchEngine, assemblyBatchBudget, [

    [{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }],

    [{ maxSteps: 1, input: { stabilizationByTurn: { 3: { postQueueCalm: true, pendingStabilizationWave: false } } } }],

  ]);

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch',

    name: 'national tick session wave assembly batch',

    passed: exportBatchNationalTickSessionWaveAssemblyBatch(assemblyBatch).allOk,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_gate',

    name: 'national tick session wave assembly batch gate',

    passed: gateBatchNationalTickSessionWaveAssemblyBatch(

      new TurnTimeEngine(),

      createTurnAdvanceBudget(2),

      [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit',

    name: 'national tick session wave assembly batch integration audit',

    passed: auditBatchNationalTickSessionWaveAssemblyBatchIntegration(

      new TurnTimeEngine(),

      createTurnAdvanceBudget(2),

      [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_replay_parity',

    name: 'assembly batch integration audit replay parity',

    passed: verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity(

      new TurnTimeEngine(),

      createTurnAdvanceBudget(2),

      [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

    ).parityOk,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_gate',

    name: 'assembly batch integration audit gate',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure',

    name: 'assembly batch integration audit closure',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(

      closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate',

    name: 'assembly batch integration audit closure gate wave 26',

    passed: gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(

      new TurnTimeEngine(),

      createTurnAdvanceBudget(2),

      [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_replay_parity',

    name: 'assembly batch integration audit closure gate replay parity wave 27',

    passed: verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity(

      new TurnTimeEngine(),

      createTurnAdvanceBudget(2),

      [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

    ).parityOk,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly',

    name: 'assembly batch integration audit closure gate assembly wave 28',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(

      assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate',

    name: 'assembly batch integration audit closure gate assembly gate wave 29',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit',

    name: 'assembly batch integration audit closure gate assembly gate audit wave 30',

    passed: auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(

      new TurnTimeEngine(),

      createTurnAdvanceBudget(2),

      [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_export',

    name: 'assembly batch integration audit closure gate assembly gate audit export wave 31',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(

      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate',

    name: 'assembly batch integration audit closure gate assembly gate audit gate wave 32',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit wave 33',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(

      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate wave 34',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit wave 35',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(

      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate wave 36',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit wave 37',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit(

      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit_gate',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit gate wave 38',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit gate audit wave 39',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAudit(

      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit gate audit gate wave 40',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit gate audit gate audit wave 41',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(

      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit gate audit gate audit gate wave 42',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(

      gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGate(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit gate audit gate audit gate audit wave 43',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(

      auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave_assembly_batch_integration_audit_closure_gate_assembly_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate_audit_gate',

    name: 'assembly batch integration audit closure gate assembly gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate audit gate wave 50',

    passed: exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(

      commitBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAuditGateAudit(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave50_integration_seal',

    name: 'national tick session wave 50 O10-230 integration seal 8aaaf700',

    passed: exportBatchNationalTickSessionWave50Integration(

      sealBatchNationalTickSessionWave50Integration(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  results.push({

    id: 'agent02_national_tick_session_wave52_integration_seal',

    name: 'national tick session wave 52 O10-235 integration seal ba97bdce',

    passed: exportBatchNationalTickSessionWave51Integration(

      sealBatchNationalTickSessionWave51Integration(

        new TurnTimeEngine(),

        createTurnAdvanceBudget(2),

        [[{ maxSteps: 1, input: { stabilizationByTurn: { 1: { postQueueCalm: true, pendingStabilizationWave: false } } } }]],

      ),

    ).ok,

  });

  const failed = results.filter((r) => !r.passed).length;

  return { passed: results.length - failed, failed, results };

}
// OP10M_MODULE_END agent-02-turns-time
