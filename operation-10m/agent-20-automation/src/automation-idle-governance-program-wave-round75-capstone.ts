import { compareIdleGovernanceProgramWaveRound75Capstones } from './automation-idle-governance-program-wave-round75-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound75Capstone } from './automation-idle-governance-program-wave-round75-capstone.js';
import { exportIdleGovernanceProgramWaveRound75 } from './automation-idle-governance-program-wave-round75-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound75CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round75-capstone.v1';
  o10TaskId: 'O10-351';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound75Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound75Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound75Capstones>;
  round75Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound75>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound75Primary(cap: O10IdleGovernanceProgramWaveRound75CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-75 capstone for O10-351 origin landing. */
export function runIdleGovernanceProgramWaveRound75Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound75CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound75Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound75Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound75Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round75Export = exportIdleGovernanceProgramWaveRound75(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round75Export.payload.round75Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 75 capstone (O10-351)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=4ede8fed`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round75Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round75_capstone',
    'task=O10-351',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round75Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round75-capstone.v1',
    o10TaskId: 'O10-351',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round75Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound75CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 75 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound75Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-351 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-351' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-351')
  );

  const cap2 = runIdleGovernanceProgramWaveRound75Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound75Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r55_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-351')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 75 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round75-capstone.v1'
  );
  return results;
}
