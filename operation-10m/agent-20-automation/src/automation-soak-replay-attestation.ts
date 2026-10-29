import { projectO10IdleAutomationSoak, type O10SoakProjectionResult } from './automation-soak-projection.js';
import {
  buildAutomationReplayTapeFromScenario,
  type O10AutomationReplayTape,
} from './automation-replay-tape.js';
import type { O10ScenarioOptions, O10ScenarioTurnSpec } from './scenario-runner.js';
import type { O10TurnComputeInput } from './turn-compute-engine.js';
import type { O10SelfTestResult } from './types.js';

export interface O10SoakReplayAttestation {
  schema: '10m.agent20.soak-replay-attestation.v1';
  soakTurnCount: number;
  replayFrameCount: number;
  digestChainMatch: boolean;
  violationAligned: boolean;
  ok: boolean;
  notes: string[];
}

function fnv1aHex(text: string): string {
  let chain = 2166136261;
  for (let i = 0; i < text.length; i++) {
    chain ^= text.charCodeAt(i);
    chain = Math.imul(chain, 16777619);
  }
  return `o10soak_${(chain >>> 0).toString(16).padStart(8, '0')}`;
}

/** Compare soak projection metrics against a scenario replay tape built from the same turn count. */
export function attestSoakAgainstReplayTape(
  soak: O10SoakProjectionResult,
  tape: O10AutomationReplayTape
): O10SoakReplayAttestation {
  const notes: string[] = [];
  const digestChainMatch = tape.frameCount > 0 && soak.turnCount === tape.frameCount;
  if (!digestChainMatch) {
    notes.push(`turn_mismatch:${soak.turnCount}!=${tape.frameCount}`);
  }

  const replayChain = fnv1aHex(tape.frames.map(f => f.digest).join('|'));
  if (replayChain !== soak.digestChain) {
    notes.push('digest_chain_mismatch');
  }

  const violationAligned = soak.blockedEndTurns >= 0 && tape.violationCount >= 0;
  if (tape.violationCount > soak.blockedEndTurns + soak.blockedAdvanceDays + 2) {
    notes.push('violation_skew');
  }

  const ok = digestChainMatch && replayChain === soak.digestChain && violationAligned && notes.length === 0;

  return {
    schema: '10m.agent20.soak-replay-attestation.v1',
    soakTurnCount: soak.turnCount,
    replayFrameCount: tape.frameCount,
    digestChainMatch: replayChain === soak.digestChain,
    violationAligned,
    ok,
    notes,
  };
}

export function buildSoakReplayAttestationFromInput(
  baseInput: O10TurnComputeInput,
  turnCount: number,
  soakOptions?: Omit<Parameters<typeof projectO10IdleAutomationSoak>[1], 'turnCount'>,
  scenarioOptions?: O10ScenarioOptions
): O10SoakReplayAttestation {
  const soak = projectO10IdleAutomationSoak(baseInput, {
    turnCount,
    ...soakOptions,
  });
  const steps: O10ScenarioTurnSpec[] = [];
  for (let i = 1; i <= turnCount; i++) {
    const idleMs = (soakOptions?.idleMsStart ?? 30_000) + (soakOptions?.idleMsStep ?? 25_000) * (i - 1);
    const humanEvery = soakOptions?.humanCommittedEvery ?? 0;
    steps.push({
      label: `s${i}`,
      patch: {
        turn: i,
        day: baseInput.day + Math.floor((i - 1) / 8),
        humanCommittedThisTurn: humanEvery > 0 && i % humanEvery === 0,
        msSinceLastHumanInput: idleMs,
        msSinceLastCommittedAction: idleMs,
      },
    });
  }
  const tape = buildAutomationReplayTapeFromScenario(baseInput, steps, scenarioOptions);
  return attestSoakAgainstReplayTape(soak, tape);
}

export function runO10Agent20SoakReplayAttestationSelfTests(): O10SelfTestResult[] {
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

  const att = buildSoakReplayAttestationFromInput(base, 5, {
    idleMsStart: 20_000,
    idleMsStep: 15_000,
  });
  push('att_ok', 'soak and replay chains align', att.ok && att.schema.endsWith('.v1'));
  push('att_frames', 'frame counts match soak turns', att.soakTurnCount === 5 && att.replayFrameCount === 5);

  const soakOnly = projectO10IdleAutomationSoak(base, { turnCount: 3, idleMsStart: 10_000, idleMsStep: 0 });
  const badTape = buildAutomationReplayTapeFromScenario(base, [{ label: 'x', patch: { turn: 1 } }]);
  const fail = attestSoakAgainstReplayTape(soakOnly, badTape);
  push('att_fail_mismatch', 'detects frame count mismatch', !fail.ok && fail.notes.length > 0);

  return results;
}
