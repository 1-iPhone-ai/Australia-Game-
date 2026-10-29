import { compareIdleGovernanceProgramWaveRound26Capstones } from './automation-idle-governance-program-wave-round26-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound26Capstone } from './automation-idle-governance-program-wave-round26-capstone.js';
import { exportIdleGovernanceProgramWaveRound27 } from './automation-idle-governance-program-wave-round27-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound27CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1';
  o10TaskId: 'O10-185';
  waveRound: 27;
  capstoneReady: boolean;
  primaryRound26Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound26Capstone>;
  twinRound26Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound26Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound26Capstones>;
  round27Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound27>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-27 / wave-27 capstone landing for O10-185 on origin. */
export function runIdleGovernanceProgramWaveRound27Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound27CapstoneResult {
  const waveRound = 27;
  const primaryRound26Capstone = runIdleGovernanceProgramWaveRound26Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound26Capstone = runIdleGovernanceProgramWaveRound26Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound26Capstones(
    primaryRound26Capstone,
    twinRound26Capstone
  );
  const round27Export = exportIdleGovernanceProgramWaveRound27(
    primaryRound26Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound26Capstone.capstoneReady &&
    round27Export.payload.round27Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 27 capstone (O10-185)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round27Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round27_capstone',
    'task=O10-185',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round27Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round27-capstone.v1',
    o10TaskId: 'O10-185',
    waveRound,
    capstoneReady,
    primaryRound26Capstone,
    twinRound26Capstone,
    capstoneCompare,
    round27Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound27CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap27',
    name: 'Round 27 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound27Capstone(calmSpec, sampleRule, 1, 3, 1_601_674);
  push(
    'gov_prog_r27_capstone_calm',
    'O10-185 wave 27 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-185' &&
      cap.waveRound === 27 &&
      cap.capstoneMarkdown.includes('O10-185')
  );

  const cap2 = runIdleGovernanceProgramWaveRound27Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_601_674,
    cap.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.operations.registry
  );
  push(
    'gov_prog_r27_capstone_chain',
    'chained wave 27 capstone accumulates registry',
    cap2.primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
      .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup.entryCount === 2 &&
      cap2.summaryLine.includes('O10-185')
  );

  push(
    'gov_prog_r27_capstone_schema',
    'round 27 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round27-capstone.v1'
  );

  return results;
}
