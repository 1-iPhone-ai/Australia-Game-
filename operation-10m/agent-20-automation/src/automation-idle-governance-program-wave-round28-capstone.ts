import { compareIdleGovernanceProgramWaveRound27Capstones } from './automation-idle-governance-program-wave-round27-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound27Capstone } from './automation-idle-governance-program-wave-round27-capstone.js';
import { exportIdleGovernanceProgramWaveRound28 } from './automation-idle-governance-program-wave-round28-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound28CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1';
  o10TaskId: 'O10-187';
  waveRound: 28;
  capstoneReady: boolean;
  primaryRound27Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound27Capstone>;
  twinRound27Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound27Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound27Capstones>;
  round28Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound28>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-28 / wave-28 capstone for O10-187 origin landing. */
export function runIdleGovernanceProgramWaveRound28Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound28CapstoneResult {
  const waveRound = 28;
  const primaryRound27Capstone = runIdleGovernanceProgramWaveRound27Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound27Capstone = runIdleGovernanceProgramWaveRound27Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound27Capstones(
    primaryRound27Capstone,
    twinRound27Capstone
  );
  const round28Export = exportIdleGovernanceProgramWaveRound28(
    primaryRound27Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound27Capstone.capstoneReady &&
    round28Export.payload.round28Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 28 capstone (O10-187)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round28Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round28_capstone',
    'task=O10-187',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round28Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round28-capstone.v1',
    o10TaskId: 'O10-187',
    waveRound,
    capstoneReady,
    primaryRound27Capstone,
    twinRound27Capstone,
    capstoneCompare,
    round28Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound28CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap28',
    name: 'Round 28 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound28Capstone(calmSpec, sampleRule, 1, 3, 1_645_538);
  push(
    'gov_prog_r28_capstone_calm',
    'O10-187 wave 28 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-187' &&
      cap.waveRound === 28 &&
      cap.capstoneMarkdown.includes('O10-187')
  );

  const cap2 = runIdleGovernanceProgramWaveRound28Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_645_538,
    cap.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.operations.registry
  );
  push(
    'gov_prog_r28_capstone_chain',
    'chained wave 28 capstone accumulates registry',
    cap2.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.registryRollup.entryCount === 2 &&
      cap2.summaryLine.includes('O10-187')
  );

  push(
    'gov_prog_r28_capstone_schema',
    'round 28 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round28-capstone.v1'
  );

  return results;
}
