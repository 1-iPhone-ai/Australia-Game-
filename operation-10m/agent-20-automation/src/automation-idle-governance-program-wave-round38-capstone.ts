import { compareIdleGovernanceProgramWaveRound37Capstones } from './automation-idle-governance-program-wave-round37-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound37Capstone } from './automation-idle-governance-program-wave-round37-capstone.js';
import { exportIdleGovernanceProgramWaveRound38 } from './automation-idle-governance-program-wave-round38-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound38CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1';
  o10TaskId: 'O10-207';
  waveRound: 38;
  capstoneReady: boolean;
  primaryRound37Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound37Capstone>;
  twinRound37Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound37Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound37Capstones>;
  round38Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound38>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound38Primary(cap: O10IdleGovernanceProgramWaveRound38CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
    .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
    .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
    .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
    .director.operations.registry;
}

/** Round-38 / wave-38 capstone for O10-207 origin landing. */
export function runIdleGovernanceProgramWaveRound38Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound38CapstoneResult {
  const waveRound = 38;
  const primaryRound37Capstone = runIdleGovernanceProgramWaveRound37Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound37Capstone = runIdleGovernanceProgramWaveRound37Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound37Capstones(
    primaryRound37Capstone,
    twinRound37Capstone
  );
  const round38Export = exportIdleGovernanceProgramWaveRound38(primaryRound37Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound37Capstone.capstoneReady && round38Export.payload.round38Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 38 capstone (O10-207)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round38Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round38_capstone',
    'task=O10-207',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round38Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round38-capstone.v1',
    o10TaskId: 'O10-207',
    waveRound,
    capstoneReady,
    primaryRound37Capstone,
    twinRound37Capstone,
    capstoneCompare,
    round38Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound38CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap38',
    name: 'Round 38 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound38Capstone(calmSpec, sampleRule, 1, 3, 2_039_227);
  push(
    'gov_prog_r38_capstone_calm',
    'O10-207 wave 38 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-207' && cap.waveRound === 38 && cap.capstoneMarkdown.includes('O10-207')
  );

  const cap2 = runIdleGovernanceProgramWaveRound38Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_039_227,
    registryFromRound38Primary(cap)
  );
  const rollup =
    cap2.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
      .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
      .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup;
  push(
    'gov_prog_r38_capstone_chain',
    'chained wave 38 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-207')
  );
  push(
    'gov_prog_r38_capstone_schema',
    'round 38 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round38-capstone.v1'
  );
  return results;
}
