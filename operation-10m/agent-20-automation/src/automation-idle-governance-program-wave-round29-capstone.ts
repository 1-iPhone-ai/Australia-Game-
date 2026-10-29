import { compareIdleGovernanceProgramWaveRound28Capstones } from './automation-idle-governance-program-wave-round28-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound28Capstone } from './automation-idle-governance-program-wave-round28-capstone.js';
import { exportIdleGovernanceProgramWaveRound29 } from './automation-idle-governance-program-wave-round29-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound29CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1';
  o10TaskId: 'O10-189';
  waveRound: 29;
  capstoneReady: boolean;
  primaryRound28Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound28Capstone>;
  twinRound28Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound28Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound28Capstones>;
  round29Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound29>;
  capstoneMarkdown: string;
  summaryLine: string;
}

/** Round-29 / wave-29 capstone for O10-189 origin landing. */
export function runIdleGovernanceProgramWaveRound29Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound29CapstoneResult {
  const waveRound = 29;
  const primaryRound28Capstone = runIdleGovernanceProgramWaveRound28Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound28Capstone = runIdleGovernanceProgramWaveRound28Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound28Capstones(
    primaryRound28Capstone,
    twinRound28Capstone
  );
  const round29Export = exportIdleGovernanceProgramWaveRound29(
    primaryRound28Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound28Capstone.capstoneReady &&
    round29Export.payload.round29Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 29 capstone (O10-189)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round29Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round29_capstone',
    'task=O10-189',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round29Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round29-capstone.v1',
    o10TaskId: 'O10-189',
    waveRound,
    capstoneReady,
    primaryRound28Capstone,
    twinRound28Capstone,
    capstoneCompare,
    round29Export,
    capstoneMarkdown,
    summaryLine,
  };
}

function registryFromRound29Capstone(
  cap: O10IdleGovernanceProgramWaveRound29CapstoneResult
): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch
    .primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
    .primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

export function runO10Agent20IdleGovernanceProgramWaveRound29CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap29',
    name: 'Round 29 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound29Capstone(calmSpec, sampleRule, 1, 3, 1_683_733);
  push(
    'gov_prog_r29_capstone_calm',
    'O10-189 wave 29 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-189' &&
      cap.waveRound === 29 &&
      cap.capstoneMarkdown.includes('O10-189')
  );

  const cap2 = runIdleGovernanceProgramWaveRound29Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_683_733,
    registryFromRound29Capstone(cap)
  );
  const rollup =
    cap2.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone.primaryEpoch
      .primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
      .primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r29_capstone_chain',
    'chained wave 29 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-189')
  );

  push(
    'gov_prog_r29_capstone_schema',
    'round 29 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round29-capstone.v1'
  );

  return results;
}
