import { classifyIdleAutomationBand } from './idle-automation-depth.js';
import {
  createDefaultO10TurnComputeState,
  type O10TurnComputeInput,
} from './turn-compute-engine.js';
import { simulateO10IdleAutomationTurn } from './idle-automation-simulation.js';
import type { IdleAutomationBand, O10SelfTestResult } from './types.js';

export interface O10SoakProjectionOptions {
  turnCount: number;
  idleMsStart?: number;
  idleMsStep?: number;
  humanCommittedEvery?: number;
}

export interface O10SoakProjectionResult {
  turnCount: number;
  bandCounts: Record<IdleAutomationBand, number>;
  stewardTickTurns: number;
  blockedEndTurns: number;
  blockedAdvanceDays: number;
  digestChain: string;
  lastTurnKey: string;
}

/** Synthetic multi-turn soak: ramps idle telemetry and aggregates band / gate metrics. */
export function projectO10IdleAutomationSoak(
  baseInput: O10TurnComputeInput,
  options: O10SoakProjectionOptions
): O10SoakProjectionResult {
  const turnCount = Math.max(1, Math.min(options.turnCount, 64));
  const idleMsStart = options.idleMsStart ?? 30_000;
  const idleMsStep = options.idleMsStep ?? 25_000;
  const humanEvery = options.humanCommittedEvery ?? 0;

  const bandCounts: Record<IdleAutomationBand, number> = {
    active: 0,
    drifting: 0,
    idle: 0,
    deep_idle: 0,
    steward_tick: 0,
  };

  let state = createDefaultO10TurnComputeState();
  let stewardTickTurns = 0;
  let blockedEndTurns = 0;
  let blockedAdvanceDays = 0;
  const digests: string[] = [];

  for (let i = 1; i <= turnCount; i++) {
    const idleMs = idleMsStart + idleMsStep * (i - 1);
    const consecutiveIdleTurns = humanEvery > 0 && i % humanEvery === 0 ? 0 : i - 1;
    const input: O10TurnComputeInput = {
      ...baseInput,
      turn: i,
      day: baseInput.day + Math.floor((i - 1) / 8),
      humanCommittedThisTurn: humanEvery > 0 && i % humanEvery === 0,
      msSinceLastHumanInput: idleMs,
      msSinceLastCommittedAction: idleMs,
      conditionalCtx: {
        ...baseInput.conditionalCtx,
        currentTurn: i,
        currentDay: baseInput.conditionalCtx.currentDay + Math.floor((i - 1) / 8),
        consecutiveIdleTurns,
      },
    };

    const band = classifyIdleAutomationBand({
      idleMs,
      consecutiveIdleTurns,
      stewardEnabled: true,
      playerPaused: false,
    });
    bandCounts[band] += 1;

    const turn = simulateO10IdleAutomationTurn(input, state);
    digests.push(turn.digest);
    state = turn.state;

    if (turn.effects.stewardStep?.automationPath === 'v94_idle_steward_national_tick') {
      stewardTickTurns += 1;
    }
    if (!turn.effects.endTurnAllowed) blockedEndTurns += 1;
    if (!turn.effects.advanceDayAllowed) blockedAdvanceDays += 1;
  }

  let chain = 2166136261;
  const joined = digests.join('|');
  for (let i = 0; i < joined.length; i++) {
    chain ^= joined.charCodeAt(i);
    chain = Math.imul(chain, 16777619);
  }

  return {
    turnCount,
    bandCounts,
    stewardTickTurns,
    blockedEndTurns,
    blockedAdvanceDays,
    digestChain: `o10soak_${(chain >>> 0).toString(16).padStart(8, '0')}`,
    lastTurnKey: state.lastTurnKey,
  };
}

export function runO10Agent20SoakProjectionSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const base: O10TurnComputeInput = {
    turn: 0,
    day: 1,
    actorId: 'player',
    gameMode: 'game',
    humanCommittedThisTurn: false,
    msSinceLastHumanInput: 0,
    msSinceLastCommittedAction: 0,
    playerInTransit: false,
    humanAutomationEnabled: true,
    humanAutomationExecuting: false,
    pendingHumanAutomationApprovals: 0,
    pendingGenericApprovals: 0,
    copilotTakeoverActive: false,
    copilotStepInFlight: false,
    autoModeReplayRecording: false,
    dialogBlockingTime: false,
    gameState: { turnCounter: 1 },
    settings: { playerControlMode: 'manual' },
    automationRules: [],
    conditionalCtx: {
      actor: { money: 500, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 1,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      settingsFlags: {},
    },
  };

  const soak = projectO10IdleAutomationSoak(base, { turnCount: 6, idleMsStart: 50_000, idleMsStep: 40_000 });
  const bandTotal = Object.values(soak.bandCounts).reduce((a, b) => a + b, 0);
  push('soak_turns', 'soak runs requested turns', soak.turnCount === 6 && bandTotal === 6);
  push('soak_digest', 'soak yields stable chain id', soak.digestChain.startsWith('o10soak_'));
  push(
    'soak_deep_bands',
    'ramping idle reaches deep bands',
    soak.bandCounts.steward_tick + soak.bandCounts.deep_idle >= 2
  );

  const reset = projectO10IdleAutomationSoak(base, {
    turnCount: 4,
    idleMsStart: 10_000,
    idleMsStep: 0,
    humanCommittedEvery: 2,
  });
  push(
    'soak_human_reset',
    'periodic human commit keeps bands shallow',
    reset.bandCounts.active + reset.bandCounts.drifting >= 2
  );

  return results;
}
