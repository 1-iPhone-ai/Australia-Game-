// OP10M_MODULE_BEGIN agent-02-turns-time
// content-sha256-prefix: 19c0b2e16a622752
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

// --- src/diagnostics.ts ---

export function appendTrace(trace: EffectTraceEntry[], entry: Omit<EffectTraceEntry, 'sequence'> & { sequence: number }): EffectTraceEntry[] {
  return [...trace, entry];
}

export function validateTurnTimeIntegrity(
  clock: TurnClock,
  obligations: ScheduledObligation[],
  projects: ConstructionProject[],
  events: ScheduledEvent[] = [],
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

  const messages: string[] = [];
  if (duplicateFired.length) messages.push(`Duplicate fired obligations: ${duplicateFired.join(', ')}`);
  if (duplicateDispatchedEvents.length) {
    messages.push(`Duplicate dispatched events: ${duplicateDispatchedEvents.join(', ')}`);
  }
  if (skippedDue.length) messages.push(`Skipped due effects: ${skippedDue.join(', ')}`);
  if (skippedDueEvents.length) messages.push(`Skipped due events: ${skippedDueEvents.join(', ')}`);
  if (orphanPastPending.length) messages.push(`Past-due pending: ${orphanPastPending.join(', ')}`);
  if (constructionOverLabor.length) messages.push(`Construction over-labor: ${constructionOverLabor.join(', ')}`);

  const ok =
    duplicateFired.length === 0 &&
    duplicateDispatchedEvents.length === 0 &&
    skippedDue.length === 0 &&
    orphanPastPending.length === 0 &&
    constructionOverLabor.length === 0;

  return {
    ok,
    duplicateFired,
    skippedDue,
    orphanPastPending,
    constructionOverLabor,
    duplicateDispatchedEvents,
    skippedDueEvents,
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

export type { RegisterFollowUpInput, TurnTimeAuditReport };

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
  }

  scheduleEvent(input: ScheduleEventInput): void {
    this.events = enqueueScheduledEvent(this.events, this.clock, input);
  }

  cancelEvent(id: string): void {
    this.events = cancelScheduledEvent(this.events, id);
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
    return validateTurnTimeIntegrity(this.clock, this.obligations, this.projects, this.events);
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

  while (current.clock.turnIndex < targetTurn) {
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

export const AGENT_02_MODULE_VERSION = '1.2.0';



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

  const failed = results.filter((r) => !r.passed).length;

  return { passed: results.length - failed, failed, results };

}
// OP10M_MODULE_END agent-02-turns-time
