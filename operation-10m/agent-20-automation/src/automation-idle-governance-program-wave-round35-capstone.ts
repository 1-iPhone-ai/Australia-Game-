import { compareIdleGovernanceProgramWaveRound34Capstones } from './automation-idle-governance-program-wave-round34-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound34Capstone } from './automation-idle-governance-program-wave-round34-capstone.js';
import { exportIdleGovernanceProgramWaveRound35 } from './automation-idle-governance-program-wave-round35-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound35CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1';
  o10TaskId: 'O10-201';
  waveRound: 35;
  capstoneReady: boolean;
  primaryRound34Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound34Capstone>;
  twinRound34Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound34Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound34Capstones>;
  round35Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound35>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound35Primary(cap: O10IdleGovernanceProgramWaveRound35CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
    .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
    .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
    .primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-35 / wave-35 capstone for O10-201 origin landing. */
export function runIdleGovernanceProgramWaveRound35Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound35CapstoneResult {
  const waveRound = 35;
  const primaryRound34Capstone = runIdleGovernanceProgramWaveRound34Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound34Capstone = runIdleGovernanceProgramWaveRound34Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound34Capstones(
    primaryRound34Capstone,
    twinRound34Capstone
  );
  const round35Export = exportIdleGovernanceProgramWaveRound35(primaryRound34Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound34Capstone.capstoneReady && round35Export.payload.round35Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 35 capstone (O10-201)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round35Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round35_capstone',
    'task=O10-201',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round35Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round35-capstone.v1',
    o10TaskId: 'O10-201',
    waveRound,
    capstoneReady,
    primaryRound34Capstone,
    twinRound34Capstone,
    capstoneCompare,
    round35Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound35CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap35',
    name: 'Round 35 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound35Capstone(calmSpec, sampleRule, 1, 3, 1_924_628);
  push(
    'gov_prog_r35_capstone_calm',
    'O10-201 wave 35 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-201' && cap.waveRound === 35 && cap.capstoneMarkdown.includes('O10-201')
  );

  const cap2 = runIdleGovernanceProgramWaveRound35Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_924_628,
    registryFromRound35Primary(cap)
  );
  const rollup =
    cap2.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
      .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r35_capstone_chain',
    'chained wave 35 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-201')
  );
  push(
    'gov_prog_r35_capstone_schema',
    'round 35 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round35-capstone.v1'
  );
  return results;
}
