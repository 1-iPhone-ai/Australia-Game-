import { compareIdleGovernanceProgramWaveEpochCloseouts } from './automation-idle-governance-program-wave-epoch-closeout-compare.js';
import { runIdleGovernanceProgramWaveEpochCloseout } from './automation-idle-governance-program-wave-epoch-closeout.js';
import { exportIdleGovernanceProgramWaveEpoch } from './automation-idle-governance-program-wave-epoch-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound26CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1';
  o10TaskId: 'O10-183';
  waveRound: 26;
  capstoneReady: boolean;
  primaryEpoch: ReturnType<typeof runIdleGovernanceProgramWaveEpochCloseout>;
  twinEpoch: ReturnType<typeof runIdleGovernanceProgramWaveEpochCloseout>;
  epochCompare: ReturnType<typeof compareIdleGovernanceProgramWaveEpochCloseouts>;
  epochExport: ReturnType<typeof exportIdleGovernanceProgramWaveEpoch>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-26 / wave-26 capstone gate for O10-183 origin landing. */
export function runIdleGovernanceProgramWaveRound26Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound26CapstoneResult {
  const waveRound = 26;
  const primaryEpoch = runIdleGovernanceProgramWaveEpochCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinEpoch = runIdleGovernanceProgramWaveEpochCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const epochCompare = compareIdleGovernanceProgramWaveEpochCloseouts(primaryEpoch, twinEpoch);
  const epochExport = exportIdleGovernanceProgramWaveEpoch(primaryEpoch, projectedLocHint);

  const capstoneReady =
    primaryEpoch.epochReady && epochCompare.parityOk && epochExport.payload.epochReady;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 26 capstone (O10-183)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${epochCompare.summaryLine}`,
    '',
    epochExport.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round26_capstone',
    'task=O10-183',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    epochExport.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round26-capstone.v1',
    o10TaskId: 'O10-183',
    waveRound,
    capstoneReady,
    primaryEpoch,
    twinEpoch,
    epochCompare,
    epochExport,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound26CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap26',
    name: 'Round 26 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound26Capstone(calmSpec, sampleRule, 1, 3, 1_563_481);
  push(
    'gov_prog_r26_capstone_calm',
    'O10-183 wave 26 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-183' &&
      cap.waveRound === 26 &&
      cap.capstoneMarkdown.includes('O10-183')
  );

  const cap2 = runIdleGovernanceProgramWaveRound26Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_563_481,
    cap.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_r26_capstone_chain',
    'chained capstone accumulates registry',
    cap2.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup
      .entryCount === 2 && cap2.summaryLine.includes('O10-183')
  );

  push(
    'gov_prog_r26_capstone_schema',
    'round 26 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round26-capstone.v1'
  );

  return results;
}
