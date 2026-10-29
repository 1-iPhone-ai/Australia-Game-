import { compareIdleGovernanceProgramWaveRound61Capstones } from './automation-idle-governance-program-wave-round61-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound61Capstone } from './automation-idle-governance-program-wave-round61-capstone.js';
import { exportIdleGovernanceProgramWaveRound61 } from './automation-idle-governance-program-wave-round61-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound61CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round61-capstone.v1';
  o10TaskId: 'O10-267';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound61Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound61Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound61Capstones>;
  round61Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound61>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound61Primary(cap: O10IdleGovernanceProgramWaveRound61CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-55 / wave-61 capstone for O10-267 origin landing. */
export function runIdleGovernanceProgramWaveRound61Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound61CapstoneResult {
  const waveRound = 55;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound61Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound61Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound61Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round61Export = exportIdleGovernanceProgramWaveRound61(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round61Export.payload.round61Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 61 capstone (O10-267)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=7f862be0`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round61Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round61_capstone',
    'task=O10-267',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round61Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round61-capstone.v1',
    o10TaskId: 'O10-267',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round61Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound61CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap55',
    name: 'Round 61 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound61Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r55_capstone_calm',
    'O10-267 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-267' && cap.waveRound === 55 && cap.capstoneMarkdown.includes('O10-267')
  );

  const cap2 = runIdleGovernanceProgramWaveRound61Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound61Primary(cap)
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
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-267')
  );
  push(
    'gov_prog_r55_capstone_schema',
    'round 61 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round61-capstone.v1'
  );
  return results;
}
