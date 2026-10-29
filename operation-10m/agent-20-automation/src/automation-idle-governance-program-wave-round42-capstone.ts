import { compareIdleGovernanceProgramWaveRound41Capstones } from './automation-idle-governance-program-wave-round41-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound41Capstone } from './automation-idle-governance-program-wave-round41-capstone.js';
import { exportIdleGovernanceProgramWaveRound42 } from './automation-idle-governance-program-wave-round42-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound42CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1';
  o10TaskId: 'O10-215';
  waveRound: 42;
  capstoneReady: boolean;
  primaryRound41Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound41Capstone>;
  twinRound41Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound41Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound41Capstones>;
  round42Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound42>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound42Primary(cap: O10IdleGovernanceProgramWaveRound42CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone
    .primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
    .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
    .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
    .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-42 / wave-42 capstone for O10-215 origin landing. */
export function runIdleGovernanceProgramWaveRound42Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound42CapstoneResult {
  const waveRound = 42;
  const primaryRound41Capstone = runIdleGovernanceProgramWaveRound41Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound41Capstone = runIdleGovernanceProgramWaveRound41Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound41Capstones(
    primaryRound41Capstone,
    twinRound41Capstone
  );
  const round42Export = exportIdleGovernanceProgramWaveRound42(primaryRound41Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound41Capstone.capstoneReady && round42Export.payload.round42Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 42 capstone (O10-215)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round42Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round42_capstone',
    'task=O10-215',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round42Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round42-capstone.v1',
    o10TaskId: 'O10-215',
    waveRound,
    capstoneReady,
    primaryRound41Capstone,
    twinRound41Capstone,
    capstoneCompare,
    round42Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound42CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap42',
    name: 'Round 42 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound42Capstone(calmSpec, sampleRule, 1, 3, 2_207_543);
  push(
    'gov_prog_r42_capstone_calm',
    'O10-215 wave 42 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-215' && cap.waveRound === 42 && cap.capstoneMarkdown.includes('O10-215')
  );

  const cap2 = runIdleGovernanceProgramWaveRound42Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_207_543,
    registryFromRound42Primary(cap)
  );
  const rollup =
    cap2.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone
      .primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone
      .primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
      .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r42_capstone_chain',
    'chained wave 42 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-215')
  );
  push(
    'gov_prog_r42_capstone_schema',
    'round 42 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round42-capstone.v1'
  );
  return results;
}
