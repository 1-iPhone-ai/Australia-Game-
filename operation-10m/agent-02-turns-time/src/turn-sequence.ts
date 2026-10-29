import {
  AdvanceOptions,
  TURN_PHASE_ORDER,
  TurnClock,
  TurnPhase,
  TurnScope,
  buildPhaseToken,
  buildTurnKey,
  deterministicEpochIso,
} from './types.js';

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
