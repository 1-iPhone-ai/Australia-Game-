import { compareIdleGovernanceProgramWaveRound39Capstones } from './automation-idle-governance-program-wave-round39-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound39Capstone } from './automation-idle-governance-program-wave-round39-capstone.js';
import { exportIdleGovernanceProgramWaveRound40 } from './automation-idle-governance-program-wave-round40-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound40CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1';
  o10TaskId: 'O10-211';
  waveRound: 40;
  capstoneReady: boolean;
  primaryRound39Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound39Capstone>;
  twinRound39Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound39Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound39Capstones>;
  round40Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound40>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound40Primary(cap: O10IdleGovernanceProgramWaveRound40CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
    .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
    .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
    .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
    .primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-40 / wave-40 capstone for O10-211 origin landing. */
export function runIdleGovernanceProgramWaveRound40Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound40CapstoneResult {
  const waveRound = 40;
  const primaryRound39Capstone = runIdleGovernanceProgramWaveRound39Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound39Capstone = runIdleGovernanceProgramWaveRound39Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound39Capstones(
    primaryRound39Capstone,
    twinRound39Capstone
  );
  const round40Export = exportIdleGovernanceProgramWaveRound40(primaryRound39Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound39Capstone.capstoneReady && round40Export.payload.round40Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 40 capstone (O10-211)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round40Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round40_capstone',
    'task=O10-211',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round40Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round40-capstone.v1',
    o10TaskId: 'O10-211',
    waveRound,
    capstoneReady,
    primaryRound39Capstone,
    twinRound39Capstone,
    capstoneCompare,
    round40Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound40CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap40',
    name: 'Round 40 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound40Capstone(calmSpec, sampleRule, 1, 3, 2_121_263);
  push(
    'gov_prog_r40_capstone_calm',
    'O10-211 wave 40 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-211' && cap.waveRound === 40 && cap.capstoneMarkdown.includes('O10-211')
  );

  const cap2 = runIdleGovernanceProgramWaveRound40Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_121_263,
    registryFromRound40Primary(cap)
  );
  const rollup =
    cap2.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone.primaryRound36Capstone
      .primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone.primaryRound31Capstone
      .primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r40_capstone_chain',
    'chained wave 40 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-211')
  );
  push(
    'gov_prog_r40_capstone_schema',
    'round 40 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round40-capstone.v1'
  );
  return results;
}
