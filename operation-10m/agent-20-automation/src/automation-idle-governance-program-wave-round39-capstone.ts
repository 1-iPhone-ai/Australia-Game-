import { compareIdleGovernanceProgramWaveRound38Capstones } from './automation-idle-governance-program-wave-round38-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound38Capstone } from './automation-idle-governance-program-wave-round38-capstone.js';
import { exportIdleGovernanceProgramWaveRound39 } from './automation-idle-governance-program-wave-round39-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound39CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1';
  o10TaskId: 'O10-209';
  waveRound: 39;
  capstoneReady: boolean;
  primaryRound38Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound38Capstone>;
  twinRound38Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound38Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound38Capstones>;
  round39Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound39>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound39Primary(cap: O10IdleGovernanceProgramWaveRound39CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone
    .primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
    .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal
    .primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject
    .executive.director.operations.registry;
}

/** Round-39 / wave-39 capstone for O10-209 origin landing. */
export function runIdleGovernanceProgramWaveRound39Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound39CapstoneResult {
  const waveRound = 39;
  const primaryRound38Capstone = runIdleGovernanceProgramWaveRound38Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound38Capstone = runIdleGovernanceProgramWaveRound38Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound38Capstones(
    primaryRound38Capstone,
    twinRound38Capstone
  );
  const round39Export = exportIdleGovernanceProgramWaveRound39(primaryRound38Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound38Capstone.capstoneReady && round39Export.payload.round39Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 39 capstone (O10-209)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round39Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round39_capstone',
    'task=O10-209',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round39Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round39-capstone.v1',
    o10TaskId: 'O10-209',
    waveRound,
    capstoneReady,
    primaryRound38Capstone,
    twinRound38Capstone,
    capstoneCompare,
    round39Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound39CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap39',
    name: 'Round 39 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound39Capstone(calmSpec, sampleRule, 1, 3, 2_082_720);
  push(
    'gov_prog_r39_capstone_calm',
    'O10-209 wave 39 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-209' && cap.waveRound === 39 && cap.capstoneMarkdown.includes('O10-209')
  );

  const cap2 = runIdleGovernanceProgramWaveRound39Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_082_720,
    registryFromRound39Primary(cap)
  );
  const rollup =
    cap2.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone.primaryRound35Capstone
      .primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone.primaryRound30Capstone
      .primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch.primarySeal
      .primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject
      .executive.director.registryRollup;
  push(
    'gov_prog_r39_capstone_chain',
    'chained wave 39 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-209')
  );
  push(
    'gov_prog_r39_capstone_schema',
    'round 39 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round39-capstone.v1'
  );
  return results;
}
