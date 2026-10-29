import { EffectTraceEntry, PauseDiagnosticsState, TurnClock } from './types.js';
import { appendTrace } from './diagnostics.js';

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
