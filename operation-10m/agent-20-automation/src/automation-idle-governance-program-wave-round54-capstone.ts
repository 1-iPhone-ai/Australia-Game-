import { compareIdleGovernanceProgramWaveRound54Capstones } from './automation-idle-governance-program-wave-round54-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound54Capstone } from './automation-idle-governance-program-wave-round54-capstone.js';
import { exportIdleGovernanceProgramWaveRound54 } from './automation-idle-governance-program-wave-round54-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound54CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round54-capstone.v1';
  o10TaskId: 'O10-240';
  waveRound: 52;
  capstoneReady: boolean;
  primaryRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound54Capstone>;
  twinRound52Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound54Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound54Capstones>;
  round54Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound54>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound54Primary(cap: O10IdleGovernanceProgramWaveRound54CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-54 / wave-54 capstone for O10-240 origin landing. */
export function runIdleGovernanceProgramWaveRound54Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound54CapstoneResult {
  const waveRound = 54;
  const primaryRound52Capstone = runIdleGovernanceProgramWaveRound54Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound52Capstone = runIdleGovernanceProgramWaveRound54Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound54Capstones(
    primaryRound52Capstone,
    twinRound52Capstone
  );
  const round54Export = exportIdleGovernanceProgramWaveRound54(primaryRound52Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound52Capstone.capstoneReady && round54Export.payload.round54Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 54 capstone (O10-240)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=5bd043ad`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round54Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round54_capstone',
    'task=O10-240',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round54Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round54-capstone.v1',
    o10TaskId: 'O10-240',
    waveRound,
    capstoneReady,
    primaryRound52Capstone,
    twinRound52Capstone,
    capstoneCompare,
    round54Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound54CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap54',
    name: 'Round 54 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound54Capstone(calmSpec, sampleRule, 1, 3, 3_022_056);
  push(
    'gov_prog_r54_capstone_calm',
    'O10-240 wave 52 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-240' && cap.waveRound === 54 && cap.capstoneMarkdown.includes('O10-240')
  );

  const cap2 = runIdleGovernanceProgramWaveRound54Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    3_022_056,
    registryFromRound54Primary(cap)
  );
  const rollup =
    cap2.primaryRound52Capstone.primaryRound51Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r54_capstone_chain',
    'chained wave 52 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-240')
  );
  push(
    'gov_prog_r54_capstone_schema',
    'round 54 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round54-capstone.v1'
  );
  return results;
}
