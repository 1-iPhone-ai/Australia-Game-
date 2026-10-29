import { runO10IdleAutomationScenario, type O10ScenarioTurnSpec } from './scenario-runner.js';
import type { O10TurnComputeInput } from './turn-compute-engine.js';
import type { O10SelfTestResult } from './types.js';

export interface O10AutomationReplayFrame {
  label: string;
  turn: number;
  day: number;
  digest: string;
}

export interface O10AutomationReplayTape {
  schema: '10m.agent20.replay-tape.v1';
  frameCount: number;
  frames: O10AutomationReplayFrame[];
  violationCount: number;
}

export function buildAutomationReplayTapeFromScenario(
  baseInput: O10TurnComputeInput,
  steps: O10ScenarioTurnSpec[],
  options?: Parameters<typeof runO10IdleAutomationScenario>[2]
): O10AutomationReplayTape {
  const run = runO10IdleAutomationScenario(baseInput, steps, options);
  const frames: O10AutomationReplayFrame[] = run.labels.map((label, idx) => ({
    label,
    turn: steps[idx]?.patch.turn ?? baseInput.turn,
    day: steps[idx]?.patch.day ?? baseInput.day,
    digest: run.digests[idx] ?? '',
  }));
  return {
    schema: '10m.agent20.replay-tape.v1',
    frameCount: frames.length,
    frames,
    violationCount: run.violations.length,
  };
}

export function verifyAutomationReplayTapeDeterminism(
  baseInput: O10TurnComputeInput,
  steps: O10ScenarioTurnSpec[],
  tape: O10AutomationReplayTape,
  options?: Parameters<typeof runO10IdleAutomationScenario>[2]
): { ok: boolean; mismatches: string[] } {
  const rerun = buildAutomationReplayTapeFromScenario(baseInput, steps, options);
  const mismatches: string[] = [];
  if (rerun.frameCount !== tape.frameCount) {
    mismatches.push(`frame_count:${rerun.frameCount}!=${tape.frameCount}`);
  }
  const n = Math.min(rerun.frames.length, tape.frames.length);
  for (let i = 0; i < n; i++) {
    const a = rerun.frames[i];
    const b = tape.frames[i];
    if (a.digest !== b.digest) {
      mismatches.push(`${b.label}:digest`);
    }
  }
  if (rerun.violationCount !== tape.violationCount) {
    mismatches.push(`violations:${rerun.violationCount}!=${tape.violationCount}`);
  }
  return { ok: mismatches.length === 0, mismatches };
}

export function summarizeAutomationReplayTape(tape: O10AutomationReplayTape): string {
  const uniq = new Set(tape.frames.map(f => f.digest)).size;
  return `replay ${tape.frameCount} frames, ${uniq} unique digests, ${tape.violationCount} violations`;
}

export function runO10Agent20ReplayTapeSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const base: O10TurnComputeInput = {
    turn: 0,
    day: 1,
    actorId: 'player',
    gameMode: 'game',
    humanCommittedThisTurn: false,
    msSinceLastHumanInput: 5000,
    msSinceLastCommittedAction: 5000,
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
    automationRules: [
      {
        id: 'auto1',
        name: 'Auto',
        enabled: true,
        authorityDisabled: false,
        priority: 2,
        activeFromDay: 0,
        activeUntilDay: 99,
        trigger: { type: 'turn_start' },
        conditions: null,
        limits: { maxRunsPerDay: 9, maxRunsTotal: null, cooldownTurns: 0 },
        safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 9 },
        stats: {
          totalRuns: 0,
          totalSuccesses: 0,
          totalSkipped: 0,
          totalFailed: 0,
          lastRunDay: null,
          lastRunTurn: null,
          runsToday: 0,
          runsTodayDay: -1,
          consecutiveNoChangeCount: 0,
          lastResultSummary: '',
        },
        actionType: 'wait',
        resolvedCost: 0,
        spendableCash: 200,
      },
    ],
    conditionalCtx: {
      actor: { money: 200, inventory: [], currentRegion: 'NSW' },
      currentDay: 1,
      currentTurn: 1,
      isNewDayForActor: false,
      extendedTriggersEnabled: true,
      settingsFlags: {},
    },
  };

  const steps: O10ScenarioTurnSpec[] = [
    { label: 'r1', patch: { turn: 1, day: 1 } },
    { label: 'r2', patch: { turn: 2, day: 1 } },
  ];

  const tape = buildAutomationReplayTapeFromScenario(base, steps, { queueIntents: true });
  push('tape_frames', 'tape captures scenario frames', tape.frameCount === 2 && tape.frames[0].digest.startsWith('o10tc_'));
  const verify = verifyAutomationReplayTapeDeterminism(base, steps, tape, { queueIntents: true });
  push('tape_deterministic', 'scenario replay is deterministic', verify.ok);
  const summary = summarizeAutomationReplayTape(tape);
  push('tape_summary', 'summary includes frame count', summary.includes('2 frames'));

  return results;
}
