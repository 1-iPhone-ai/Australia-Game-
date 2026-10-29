import { compareIdleGovernanceProgramWaveRound35Capstones } from './automation-idle-governance-program-wave-round35-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound35Capstone } from './automation-idle-governance-program-wave-round35-capstone.js';
import { exportIdleGovernanceProgramWaveRound36 } from './automation-idle-governance-program-wave-round36-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound36CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1';
  o10TaskId: 'O10-203';
  waveRound: 36;
  capstoneReady: boolean;
  primaryRound35Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound35Capstone>;
  twinRound35Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound35Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound35Capstones>;
  round36Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound36>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound36Primary(cap: O10IdleGovernanceProgramWaveRound36CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-36 / wave-36 capstone for O10-203 origin landing. */
export function runIdleGovernanceProgramWaveRound36Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound36CapstoneResult {
  const waveRound = 36;
  const primaryRound35Capstone = runIdleGovernanceProgramWaveRound35Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound35Capstone = runIdleGovernanceProgramWaveRound35Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound35Capstones(
    primaryRound35Capstone,
    twinRound35Capstone
  );
  const round36Export = exportIdleGovernanceProgramWaveRound36(primaryRound35Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound35Capstone.capstoneReady && round36Export.payload.round36Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 36 capstone (O10-203)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round36Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round36_capstone',
    'task=O10-203',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round36Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round36-capstone.v1',
    o10TaskId: 'O10-203',
    waveRound,
    capstoneReady,
    primaryRound35Capstone,
    twinRound35Capstone,
    capstoneCompare,
    round36Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound36CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap36',
    name: 'Round 36 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound36Capstone(calmSpec, sampleRule, 1, 3, 1_962_828);
  push(
    'gov_prog_r36_capstone_calm',
    'O10-203 wave 36 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-203' && cap.waveRound === 36 && cap.capstoneMarkdown.includes('O10-203')
  );

  const cap2 = runIdleGovernanceProgramWaveRound36Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_962_828,
    registryFromRound36Primary(cap)
  );
  const rollup =
    cap2.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r36_capstone_chain',
    'chained wave 36 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-203')
  );
  push(
    'gov_prog_r36_capstone_schema',
    'round 36 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round36-capstone.v1'
  );
  return results;
}
