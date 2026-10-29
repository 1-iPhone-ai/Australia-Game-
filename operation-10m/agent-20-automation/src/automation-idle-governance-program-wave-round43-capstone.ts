import { compareIdleGovernanceProgramWaveRound42Capstones } from './automation-idle-governance-program-wave-round42-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound42Capstone } from './automation-idle-governance-program-wave-round42-capstone.js';
import { exportIdleGovernanceProgramWaveRound43 } from './automation-idle-governance-program-wave-round43-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound43CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1';
  o10TaskId: 'O10-217';
  waveRound: 43;
  capstoneReady: boolean;
  primaryRound42Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound42Capstone>;
  twinRound42Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound42Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound42Capstones>;
  round43Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound43>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound43Primary(cap: O10IdleGovernanceProgramWaveRound43CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound42Capstone.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone
    .primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
    .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
    .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
    .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
    .director.operations.registry;
}

/** Round-43 / wave-43 capstone for O10-217 origin landing. */
export function runIdleGovernanceProgramWaveRound43Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound43CapstoneResult {
  const waveRound = 43;
  const primaryRound42Capstone = runIdleGovernanceProgramWaveRound42Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound42Capstone = runIdleGovernanceProgramWaveRound42Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound42Capstones(
    primaryRound42Capstone,
    twinRound42Capstone
  );
  const round43Export = exportIdleGovernanceProgramWaveRound43(primaryRound42Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound42Capstone.capstoneReady && round43Export.payload.round43Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 43 capstone (O10-217)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round43Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round43_capstone',
    'task=O10-217',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round43Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round43-capstone.v1',
    o10TaskId: 'O10-217',
    waveRound,
    capstoneReady,
    primaryRound42Capstone,
    twinRound42Capstone,
    capstoneCompare,
    round43Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound43CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap43',
    name: 'Round 43 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound43Capstone(calmSpec, sampleRule, 1, 3, 2_253_960);
  push(
    'gov_prog_r43_capstone_calm',
    'O10-217 wave 43 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-217' && cap.waveRound === 43 && cap.capstoneMarkdown.includes('O10-217')
  );

  const cap2 = runIdleGovernanceProgramWaveRound43Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_253_960,
    registryFromRound43Primary(cap)
  );
  const rollup =
    cap2.primaryRound42Capstone.primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone
      .primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone
      .primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone
      .primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding
      .primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup;
  push(
    'gov_prog_r43_capstone_chain',
    'chained wave 43 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-217')
  );
  push(
    'gov_prog_r43_capstone_schema',
    'round 43 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round43-capstone.v1'
  );
  return results;
}
