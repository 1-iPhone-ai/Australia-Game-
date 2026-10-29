import { compareIdleGovernanceProgramWaveRound44Capstones } from './automation-idle-governance-program-wave-round44-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound44Capstone } from './automation-idle-governance-program-wave-round44-capstone.js';
import { exportIdleGovernanceProgramWaveRound45 } from './automation-idle-governance-program-wave-round45-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound45CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1';
  o10TaskId: 'O10-221';
  waveRound: 45;
  capstoneReady: boolean;
  primaryRound44Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound44Capstone>;
  twinRound44Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound44Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound44Capstones>;
  round45Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound45>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound45Primary(cap: O10IdleGovernanceProgramWaveRound45CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone.primaryRound41Capstone
    .primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
    .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
    .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
    .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
    .primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-45 / wave-45 capstone for O10-221 origin landing. */
export function runIdleGovernanceProgramWaveRound45Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound45CapstoneResult {
  const waveRound = 45;
  const primaryRound44Capstone = runIdleGovernanceProgramWaveRound44Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound44Capstone = runIdleGovernanceProgramWaveRound44Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound44Capstones(
    primaryRound44Capstone,
    twinRound44Capstone
  );
  const round45Export = exportIdleGovernanceProgramWaveRound45(primaryRound44Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound44Capstone.capstoneReady && round45Export.payload.round45Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 45 capstone (O10-221)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round45Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round45_capstone',
    'task=O10-221',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round45Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round45-capstone.v1',
    o10TaskId: 'O10-221',
    waveRound,
    capstoneReady,
    primaryRound44Capstone,
    twinRound44Capstone,
    capstoneCompare,
    round45Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound45CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap45',
    name: 'Round 45 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound45Capstone(calmSpec, sampleRule, 1, 3, 2_548_579);
  push(
    'gov_prog_r45_capstone_calm',
    'O10-221 wave 45 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-221' && cap.waveRound === 45 && cap.capstoneMarkdown.includes('O10-221')
  );

  const cap2 = runIdleGovernanceProgramWaveRound45Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_548_579,
    registryFromRound45Primary(cap)
  );
  const rollup =
    cap2.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone.primaryRound41Capstone
      .primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
      .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
      .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r45_capstone_chain',
    'chained wave 45 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-221')
  );
  push(
    'gov_prog_r45_capstone_schema',
    'round 45 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round45-capstone.v1'
  );
  return results;
}
