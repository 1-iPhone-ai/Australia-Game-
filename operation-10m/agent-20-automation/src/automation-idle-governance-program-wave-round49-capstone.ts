import { compareIdleGovernanceProgramWaveRound48Capstones } from './automation-idle-governance-program-wave-round48-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound48Capstone } from './automation-idle-governance-program-wave-round48-capstone.js';
import { exportIdleGovernanceProgramWaveRound49 } from './automation-idle-governance-program-wave-round49-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound49CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1';
  o10TaskId: 'O10-229';
  waveRound: 49;
  capstoneReady: boolean;
  primaryRound48Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound48Capstone>;
  twinRound48Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound48Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound48Capstones>;
  round49Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound49>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound49Primary(cap: O10IdleGovernanceProgramWaveRound49CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-49 / wave-49 capstone for O10-229 origin landing. */
export function runIdleGovernanceProgramWaveRound49Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound49CapstoneResult {
  const waveRound = 49;
  const primaryRound48Capstone = runIdleGovernanceProgramWaveRound48Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound48Capstone = runIdleGovernanceProgramWaveRound48Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound48Capstones(
    primaryRound48Capstone,
    twinRound48Capstone
  );
  const round49Export = exportIdleGovernanceProgramWaveRound49(primaryRound48Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound48Capstone.capstoneReady && round49Export.payload.round49Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 49 capstone (O10-229)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round49Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round49_capstone',
    'task=O10-229',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round49Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round49-capstone.v1',
    o10TaskId: 'O10-229',
    waveRound,
    capstoneReady,
    primaryRound48Capstone,
    twinRound48Capstone,
    capstoneCompare,
    round49Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound49CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap49',
    name: 'Round 49 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound49Capstone(calmSpec, sampleRule, 1, 3, 2_727_364);
  push(
    'gov_prog_r49_capstone_calm',
    'O10-229 wave 49 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-229' && cap.waveRound === 49 && cap.capstoneMarkdown.includes('O10-229')
  );

  const cap2 = runIdleGovernanceProgramWaveRound49Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_727_364,
    registryFromRound49Primary(cap)
  );
  const rollup =
    cap2.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r49_capstone_chain',
    'chained wave 49 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-229')
  );
  push(
    'gov_prog_r49_capstone_schema',
    'round 49 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round49-capstone.v1'
  );
  return results;
}
