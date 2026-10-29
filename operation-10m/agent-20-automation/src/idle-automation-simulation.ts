import {
  buildO10TurnKey,
  createDefaultO10TurnComputeState,
  digestO10TurnComputeEffects,
  type O10TurnComputeInput,
  type O10TurnComputeState,
} from './turn-compute-engine.js';
import { executeO10TurnHooks, O10_DEFAULT_TURN_HOOKS, type O10TurnHookRegistration } from './turn-hooks.js';
import type { NationalStewardPersisted, O10SelfTestResult } from './types.js';
import { createDefaultAutonomousIdleNationalPersisted } from './national-steward.js';

export interface O10IdleAutomationTurnResult {
  turnKey: string;
  digest: string;
  effects: NonNullable<O10TurnComputeState['effects']>;
  state: O10TurnComputeState;
}

/** Full turn simulation: telemetry → steward plan → automation select → safe time → steward commit. */
export function simulateO10IdleAutomationTurn(
  input: O10TurnComputeInput,
  prior?: O10TurnComputeState | null,
  hooks: O10TurnHookRegistration[] = O10_DEFAULT_TURN_HOOKS
): O10IdleAutomationTurnResult {
  const stewardSeed: NationalStewardPersisted | undefined =
    prior?.effects?.steward || createDefaultAutonomousIdleNationalPersisted();
  const effects = executeO10TurnHooks(hooks, input, stewardSeed);
  const turnKey = buildO10TurnKey(input.actorId, input.turn);
  const state: O10TurnComputeState = {
    schema: createDefaultO10TurnComputeState().schema,
    lastTurnKey: turnKey,
    effects,
  };
  return {
    turnKey,
    digest: digestO10TurnComputeEffects(effects),
    effects,
    state,
  };
}

export function runO10Agent20SimulationSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const baseInput: O10TurnComputeInput = {
    turn: 2,
    day: 1,
    actorId: 'player',
    gameMode: 'game',
    humanCommittedThisTurn: false,
    msSinceLastHumanInput: 190_000,
    msSinceLastCommittedAction: 190_000,
    playerInTransit: false,
    humanAutomationEnabled: false,
    humanAutomationExecuting: false,
    pendingHumanAutomationApprovals: 0,
    pendingGenericApprovals: 0,
    copilotTakeoverActive: false,
    copilotStepInFlight: false,
    autoModeReplayRecording: false,
    dialogBlockingTime: false,
    gameState: { turnCounter: 2 },
    settings: { playerControlMode: 'manual' },
    automationRules: [],
    conditionalCtx: {
      actor: { money: 500, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 2,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      consecutiveIdleTurns: 3,
      settingsFlags: {},
    },
  };

  const seed = createDefaultO10TurnComputeState();
  seed.effects = createEmptyEffects();
  seed.effects.steward.idleTelemetry.consecutiveIdleTurns = 3;

  const t1 = simulateO10IdleAutomationTurn(
    { ...baseInput, turn: 1, msSinceLastHumanInput: 200_000 },
    seed
  );
  push('sim_turn_digest', 'simulation yields digest', t1.digest.startsWith('o10tc_'));
  push(
    'sim_steward_tick_step',
    'deep idle simulation reaches national tick planning',
    t1.effects.stewardStep?.automationPath === 'v94_idle_steward_national_tick' ||
      t1.effects.idleBand === 'steward_tick'
  );

  const t2 = simulateO10IdleAutomationTurn({ ...baseInput, turn: 2 }, t1.state);
  push('sim_chain_turns', 'chained turns advance turn key', t1.turnKey === 'player:1' && t2.turnKey === 'player:2');

  return results;
}

function createEmptyEffects(): NonNullable<O10TurnComputeState['effects']> {
  return {
    steward: createDefaultAutonomousIdleNationalPersisted(),
    stewardStep: null,
    selectedRule: null,
    idleBand: 'active',
    endTurnAllowed: true,
    advanceDayAllowed: true,
    timeBlockers: [],
    committedStewardSpend: 0,
    hookTrace: [],
  };
}
