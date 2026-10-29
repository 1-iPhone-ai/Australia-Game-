import { deriveIdleGovernanceProgramCharter, charterPermitsSustainedWatchCycles } from './automation-idle-governance-program-charter.js';
import { runIdleGovernanceSustainedWatch } from './automation-idle-governance-sustained-watch.js';
import {
  buildIdleGovernanceReplayTapeFromWatch,
  verifyIdleGovernanceReplayTapeDeterminism,
} from './automation-idle-governance-watch-replay-tape.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramPassResult {
  schema: '10m.agent20.idle-governance-program-pass.v1';
  requestedCycles: number;
  effectiveCycles: number;
  charterPolicyLine: string;
  watch: ReturnType<typeof runIdleGovernanceSustainedWatch>;
  replayTape: ReturnType<typeof buildIdleGovernanceReplayTapeFromWatch>;
  replayDeterministic: boolean;
  summaryLine: string;
}

/** Round-13 program pass: charter-gated sustained watch + replay tape export. */
export function runIdleGovernanceProgramPass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number
): O10IdleGovernanceProgramPassResult {
  const bootstrap = runIdleGovernanceSustainedWatch(spec, rule, startTurn, 1);
  const charter = deriveIdleGovernanceProgramCharter(bootstrap.rollup);
  const permit = charterPermitsSustainedWatchCycles(charter, requestedCycles);
  const effective = permit.effectiveCycles;

  const humanSpec =
    charter.requireHumanCommit && spec.humanCommittedEvery === 0
      ? { ...spec, humanCommittedEvery: 1 }
      : spec;

  const watch =
    effective <= 1
      ? bootstrap
      : runIdleGovernanceSustainedWatch(humanSpec, rule, startTurn, effective);

  const replayTape = buildIdleGovernanceReplayTapeFromWatch(watch);
  const replayDeterministic = verifyIdleGovernanceReplayTapeDeterminism(watch, replayTape).ok;

  const summaryLine = [
    'gov_program_pass',
    charter.policyLine,
    `cycles=${watch.cyclesRun}/${requestedCycles}`,
    `replay_frames=${replayTape.frameCount}`,
    `deterministic=${replayDeterministic}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-pass.v1',
    requestedCycles,
    effectiveCycles: watch.cyclesRun,
    charterPolicyLine: charter.policyLine,
    watch,
    replayTape,
    replayDeterministic,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramPassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'pp1',
    name: 'Program pass',
    enabled: true,
    authorityDisabled: false,
    priority: 5,
    activeFromDay: 0,
    activeUntilDay: 99,
    trigger: { type: 'turn_start' },
    conditions: null,
    limits: { maxRunsPerDay: 10, maxRunsTotal: null, cooldownTurns: 0 },
    safety: { maxCostPerRun: null, minCashRemainingAfterRun: null, stopIfNoStateChangeCount: 5 },
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
    spendableCash: 100,
  };

  const calmSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 2,
    humanCommittedEvery: 1,
    idleMsStart: 0,
    idleMsStep: 0,
    consecutiveIdleStart: 0,
  };

  const pass = runIdleGovernanceProgramPass(calmSpec, sampleRule, 1, 4);
  push(
    'gov_program_calm',
    'calm program pass exports replay tape',
    pass.replayTape.frameCount >= 1 && pass.replayDeterministic && pass.summaryLine.includes('gov_program_pass')
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 220_000,
    idleMsStep: 100_000,
    consecutiveIdleStart: 9,
  };
  const stressPass = runIdleGovernanceProgramPass(stressSpec, sampleRule, 5, 6);
  push(
    'gov_program_stress',
    'stressed program pass respects charter cycle cap',
    stressPass.effectiveCycles <= 6 && stressPass.watch.journal.entries.length >= 1
  );

  push('gov_program_schema', 'program pass schema marker', pass.schema === '10m.agent20.idle-governance-program-pass.v1');

  push(
    'gov_program_charter',
    'program pass surfaces charter policy line',
    pass.charterPolicyLine.startsWith('charter')
  );

  return results;
}
