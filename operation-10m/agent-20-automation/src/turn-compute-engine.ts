import type { NationalStewardPlanStep, NationalStewardPersisted, O10SelfTestResult, PortableHumanAutomationRule, IdleAutomationBand } from './types.js';

export const O10_TURN_COMPUTE_SCHEMA = '10m.turn-compute.v1';

export interface O10TurnComputeInput {
  turn: number;
  day: number;
  actorId: string;
  gameMode: string;
  humanCommittedThisTurn: boolean;
  msSinceLastHumanInput: number;
  msSinceLastCommittedAction: number;
  playerInTransit: boolean;
  humanAutomationEnabled: boolean;
  humanAutomationExecuting: boolean;
  pendingHumanAutomationApprovals: number;
  pendingGenericApprovals: number;
  copilotTakeoverActive: boolean;
  copilotStepInFlight: boolean;
  autoModeReplayRecording: boolean;
  dialogBlockingTime: boolean;
  matchEnded?: boolean;
  gameState: Record<string, unknown>;
  settings: Record<string, unknown>;
  automationRules: PortableHumanAutomationRule[];
  conditionalCtx: import('./conditional-actions.js').ConditionalActionContext;
}

export interface O10TurnComputeEffects {
  steward: NationalStewardPersisted;
  stewardStep: NationalStewardPlanStep | null;
  selectedRule: PortableHumanAutomationRule | null;
  idleBand: IdleAutomationBand;
  endTurnAllowed: boolean;
  advanceDayAllowed: boolean;
  timeBlockers: string[];
  committedStewardSpend: number;
  hookTrace: string[];
}

export interface O10TurnComputeState {
  schema: string;
  lastTurnKey: string;
  effects: O10TurnComputeEffects | null;
}

export function createDefaultO10TurnComputeState(): O10TurnComputeState {
  return { schema: O10_TURN_COMPUTE_SCHEMA, lastTurnKey: '', effects: null };
}

export function buildO10TurnKey(actorId: string, turn: number): string {
  return `${actorId}:${turn}`;
}

/** Stable digest for replay-safe turn compute snapshots (excludes wall-clock fields). */
export function digestO10TurnComputeEffects(effects: O10TurnComputeEffects): string {
  const payload = {
    band: effects.idleBand,
    endTurnAllowed: effects.endTurnAllowed,
    advanceDayAllowed: effects.advanceDayAllowed,
    committedStewardSpend: effects.committedStewardSpend,
    selectedRuleId: effects.selectedRule?.id ?? null,
    stewardStepId: effects.stewardStep?.stepId ?? null,
    stewardPath: effects.steward.automationPath,
    hookTrace: effects.hookTrace,
  };
  let h = 2166136261;
  const s = JSON.stringify(payload);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return `o10tc_${(h >>> 0).toString(16).padStart(8, '0')}`;
}

export function runO10Agent20TurnComputeSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });
  push('turn_key', 'turn key format', buildO10TurnKey('player', 3) === 'player:3');
  const fx: O10TurnComputeEffects = {
    steward: {
      schemaVersion: '10.14.0-agent20',
      enabled: true,
      operatingMode: 'watch_only',
      automationPath: 'v94_idle_steward_watch',
      categoryLocks: [],
      spendingCap: { perTurnCash: 1, perCycleCash: 1, perActionCash: 1, cycleTurns: 1 },
      playerOverride: {
        latched: false,
        paused: false,
        reason: '',
        sinceTurn: 0,
        sinceTimestampMs: 0,
        frozenCategories: [],
        resumeRequiresExplicitStart: true,
      },
      idleTelemetry: { msSinceLastHumanInput: 0, msSinceLastCommittedAction: 0, consecutiveIdleTurns: 0 },
      turnSpendAccumulator: 0,
      cycleSpendAccumulator: 0,
      cycleStartTurn: 1,
      history: [],
    },
    stewardStep: null,
    selectedRule: null,
    idleBand: 'active',
    endTurnAllowed: true,
    advanceDayAllowed: true,
    timeBlockers: [],
    committedStewardSpend: 0,
    hookTrace: ['init'],
  };
  const d1 = digestO10TurnComputeEffects(fx);
  const d2 = digestO10TurnComputeEffects({ ...fx, hookTrace: ['init'] });
  push('digest_stable', 'effects digest stable', d1 === d2 && d1.startsWith('o10tc_'));
  push('default_state', 'default compute state schema', createDefaultO10TurnComputeState().schema === O10_TURN_COMPUTE_SCHEMA);
  return results;
}
