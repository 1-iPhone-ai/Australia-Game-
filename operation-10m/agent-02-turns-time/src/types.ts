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

export interface TurnTimeSnapshot {
  clock: TurnClock;
  obligations: ScheduledObligation[];
  projects: ConstructionProject[];
  events: ScheduledEvent[];
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
