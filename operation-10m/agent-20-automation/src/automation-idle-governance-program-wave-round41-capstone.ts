import { compareIdleGovernanceProgramWaveRound40Capstones } from './automation-idle-governance-program-wave-round40-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound40Capstone } from './automation-idle-governance-program-wave-round40-capstone.js';
import { exportIdleGovernanceProgramWaveRound41 } from './automation-idle-governance-program-wave-round41-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound41CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1';
  o10TaskId: 'O10-213';
  waveRound: 41;
  capstoneReady: boolean;
  primaryRound40Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound40Capstone>;
  twinRound40Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound40Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound40Capstones>;
  round41Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound41>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound41Primary(cap: O10IdleGovernanceProgramWaveRound41CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-41 / wave-41 capstone for O10-213 origin landing. */
export function runIdleGovernanceProgramWaveRound41Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound41CapstoneResult {
  const waveRound = 41;
  const primaryRound40Capstone = runIdleGovernanceProgramWaveRound40Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound40Capstone = runIdleGovernanceProgramWaveRound40Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound40Capstones(
    primaryRound40Capstone,
    twinRound40Capstone
  );
  const round41Export = exportIdleGovernanceProgramWaveRound41(primaryRound40Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound40Capstone.capstoneReady && round41Export.payload.round41Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 41 capstone (O10-213)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round41Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round41_capstone',
    'task=O10-213',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round41Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round41-capstone.v1',
    o10TaskId: 'O10-213',
    waveRound,
    capstoneReady,
    primaryRound40Capstone,
    twinRound40Capstone,
    capstoneCompare,
    round41Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound41CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap41',
    name: 'Round 41 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound41Capstone(calmSpec, sampleRule, 1, 3, 2_165_132);
  push(
    'gov_prog_r41_capstone_calm',
    'O10-213 wave 41 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-213' && cap.waveRound === 41 && cap.capstoneMarkdown.includes('O10-213')
  );

  const cap2 = runIdleGovernanceProgramWaveRound41Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_165_132,
    registryFromRound41Primary(cap)
  );
  const rollup =
    cap2.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r41_capstone_chain',
    'chained wave 41 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-213')
  );
  push(
    'gov_prog_r41_capstone_schema',
    'round 41 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round41-capstone.v1'
  );
  return results;
}
