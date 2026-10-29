import { compareIdleGovernanceProgramWaveRound31Capstones } from './automation-idle-governance-program-wave-round31-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound31Capstone } from './automation-idle-governance-program-wave-round31-capstone.js';
import { exportIdleGovernanceProgramWaveRound32 } from './automation-idle-governance-program-wave-round32-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound32CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1';
  o10TaskId: 'O10-195';
  waveRound: 32;
  capstoneReady: boolean;
  primaryRound31Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound31Capstone>;
  twinRound31Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound31Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound31Capstones>;
  round32Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound32>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound32Primary(cap: O10IdleGovernanceProgramWaveRound32CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
    .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
    .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
    .operations.registry;
}

/** Round-32 / wave-32 capstone for O10-195 origin landing. */
export function runIdleGovernanceProgramWaveRound32Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound32CapstoneResult {
  const waveRound = 32;
  const primaryRound31Capstone = runIdleGovernanceProgramWaveRound31Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound31Capstone = runIdleGovernanceProgramWaveRound31Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound31Capstones(
    primaryRound31Capstone,
    twinRound31Capstone
  );
  const round32Export = exportIdleGovernanceProgramWaveRound32(primaryRound31Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound31Capstone.capstoneReady && round32Export.payload.round32Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 32 capstone (O10-195)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round32Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round32_capstone',
    'task=O10-195',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round32Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round32-capstone.v1',
    o10TaskId: 'O10-195',
    waveRound,
    capstoneReady,
    primaryRound31Capstone,
    twinRound31Capstone,
    capstoneCompare,
    round32Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound32CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap32',
    name: 'Round 32 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound32Capstone(calmSpec, sampleRule, 1, 3, 1_798_330);
  push(
    'gov_prog_r32_capstone_calm',
    'O10-195 wave 32 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-195' && cap.waveRound === 32 && cap.capstoneMarkdown.includes('O10-195')
  );

  const cap2 = runIdleGovernanceProgramWaveRound32Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_798_330,
    registryFromRound32Primary(cap)
  );
  const rollup =
    cap2.primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone
      .primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
      .registryRollup;
  push(
    'gov_prog_r32_capstone_chain',
    'chained wave 32 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-195')
  );
  push(
    'gov_prog_r32_capstone_schema',
    'round 32 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round32-capstone.v1'
  );
  return results;
}
