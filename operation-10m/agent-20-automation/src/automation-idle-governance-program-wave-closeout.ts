import { rollupIdleGovernanceProgramScaleWave } from './automation-idle-governance-program-scale-wave-rollup.js';
import { runIdleGovernanceProgramSubjectPass } from './automation-idle-governance-program-subject-pass.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveCloseoutResult {
  schema: '10m.agent20.idle-governance-program-wave-closeout.v1';
  waveRound: number;
  subject: ReturnType<typeof runIdleGovernanceProgramSubjectPass>;
  scaleWaveRollup: ReturnType<typeof rollupIdleGovernanceProgramScaleWave>;
  closeoutMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveCloseoutMarkdown(
  waveRound: number,
  subject: ReturnType<typeof runIdleGovernanceProgramSubjectPass>,
  scaleWaveRollup: ReturnType<typeof rollupIdleGovernanceProgramScaleWave>
): string {
  return [
    '# Agent 20 idle governance scale wave closeout',
    '',
    `- wave_round=${waveRound}`,
    `- ${scaleWaveRollup.summaryLine}`,
    '',
    subject.subjectMarkdown,
  ].join('\n');
}

/** Round-17 wave closeout: subject pass + scale wave rollup for the active wave round. */
export function runIdleGovernanceProgramWaveCloseout(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveCloseoutResult {
  const subject = runIdleGovernanceProgramSubjectPass(spec, rule, startTurn, requestedCycles, priorRegistry);
  const scaleWaveRollup = rollupIdleGovernanceProgramScaleWave(waveRound, [subject]);
  const closeoutMarkdown = buildIdleGovernanceProgramWaveCloseoutMarkdown(waveRound, subject, scaleWaveRollup);

  const summaryLine = [
    'gov_program_wave_closeout',
    `round=${waveRound}`,
    scaleWaveRollup.summaryLine,
    subject.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-closeout.v1',
    waveRound,
    subject,
    scaleWaveRollup,
    closeoutMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCloseoutSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'close1',
    name: 'Wave closeout',
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

  const closeout = runIdleGovernanceProgramWaveCloseout(calmSpec, sampleRule, 1, 3, 17);
  push(
    'gov_prog_closeout_calm',
    'calm wave closeout chains subject and rollup',
    closeout.closeoutMarkdown.includes('scale wave closeout') &&
      closeout.waveRound === 17 &&
      closeout.scaleWaveRollup.subjectPassCount === 1
  );

  const closeout2 = runIdleGovernanceProgramWaveCloseout(
    calmSpec,
    sampleRule,
    3,
    2,
    17,
    closeout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_closeout_chain',
    'chained closeout accumulates registry',
    closeout2.subject.executive.director.registryRollup.entryCount === 2 &&
      closeout2.summaryLine.includes('gov_program_wave_closeout')
  );

  push(
    'gov_prog_closeout_schema',
    'wave closeout schema marker',
    closeout.schema === '10m.agent20.idle-governance-program-wave-closeout.v1'
  );

  return results;
}
