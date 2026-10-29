import { compareIdleGovernanceProgramWaveRound36Capstones } from './automation-idle-governance-program-wave-round36-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound36Capstone } from './automation-idle-governance-program-wave-round36-capstone.js';
import { exportIdleGovernanceProgramWaveRound37 } from './automation-idle-governance-program-wave-round37-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound37CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1';
  o10TaskId: 'O10-205';
  waveRound: 37;
  capstoneReady: boolean;
  primaryRound36Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound36Capstone>;
  twinRound36Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound36Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound36Capstones>;
  round37Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound37>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound37Primary(cap: O10IdleGovernanceProgramWaveRound37CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
    .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
    .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
    .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-37 / wave-37 capstone for O10-205 origin landing. */
export function runIdleGovernanceProgramWaveRound37Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound37CapstoneResult {
  const waveRound = 37;
  const primaryRound36Capstone = runIdleGovernanceProgramWaveRound36Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound36Capstone = runIdleGovernanceProgramWaveRound36Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound36Capstones(
    primaryRound36Capstone,
    twinRound36Capstone
  );
  const round37Export = exportIdleGovernanceProgramWaveRound37(primaryRound36Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound36Capstone.capstoneReady && round37Export.payload.round37Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 37 capstone (O10-205)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round37Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round37_capstone',
    'task=O10-205',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round37Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round37-capstone.v1',
    o10TaskId: 'O10-205',
    waveRound,
    capstoneReady,
    primaryRound36Capstone,
    twinRound36Capstone,
    capstoneCompare,
    round37Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound37CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap37',
    name: 'Round 37 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound37Capstone(calmSpec, sampleRule, 1, 3, 2_001_028);
  push(
    'gov_prog_r37_capstone_calm',
    'O10-205 wave 37 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-205' && cap.waveRound === 37 && cap.capstoneMarkdown.includes('O10-205')
  );

  const cap2 = runIdleGovernanceProgramWaveRound37Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_001_028,
    registryFromRound37Primary(cap)
  );
  const rollup =
    cap2.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
      .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
      .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r37_capstone_chain',
    'chained wave 37 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-205')
  );
  push(
    'gov_prog_r37_capstone_schema',
    'round 37 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round37-capstone.v1'
  );
  return results;
}
