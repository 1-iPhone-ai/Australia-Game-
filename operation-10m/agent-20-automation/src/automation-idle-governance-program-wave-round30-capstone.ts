import { compareIdleGovernanceProgramWaveRound29Capstones } from './automation-idle-governance-program-wave-round29-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound29Capstone } from './automation-idle-governance-program-wave-round29-capstone.js';
import { exportIdleGovernanceProgramWaveRound30 } from './automation-idle-governance-program-wave-round30-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound30CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1';
  o10TaskId: 'O10-191';
  waveRound: 30;
  capstoneReady: boolean;
  primaryRound29Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound29Capstone>;
  twinRound29Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound29Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound29Capstones>;
  round30Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound30>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound30Primary(
  cap: O10IdleGovernanceProgramWaveRound30CapstoneResult
): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch
    .primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
    .director.operations.registry;
}

/** Round-30 / wave-30 capstone for O10-191 origin landing. */
export function runIdleGovernanceProgramWaveRound30Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound30CapstoneResult {
  const waveRound = 30;
  const primaryRound29Capstone = runIdleGovernanceProgramWaveRound29Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound29Capstone = runIdleGovernanceProgramWaveRound29Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound29Capstones(
    primaryRound29Capstone,
    twinRound29Capstone
  );
  const round30Export = exportIdleGovernanceProgramWaveRound30(
    primaryRound29Capstone,
    projectedLocHint
  );

  const capstoneReady =
    capstoneCompare.parityOk &&
    primaryRound29Capstone.capstoneReady &&
    round30Export.payload.round30Ready;

  const capstoneMarkdown = [
    '# Agent 20 scale wave round 30 capstone (O10-191)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round30Export.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_round30_capstone',
    'task=O10-191',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round30Export.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-round30-capstone.v1',
    o10TaskId: 'O10-191',
    waveRound,
    capstoneReady,
    primaryRound29Capstone,
    twinRound29Capstone,
    capstoneCompare,
    round30Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound30CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap30',
    name: 'Round 30 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound30Capstone(calmSpec, sampleRule, 1, 3, 1_721_932);
  push(
    'gov_prog_r30_capstone_calm',
    'O10-191 wave 30 capstone ready on calm spec',
    cap.capstoneReady === true &&
      cap.o10TaskId === 'O10-191' &&
      cap.waveRound === 30 &&
      cap.capstoneMarkdown.includes('O10-191')
  );

  const cap2 = runIdleGovernanceProgramWaveRound30Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_721_932,
    registryFromRound30Primary(cap)
  );
  const rollup =
    cap2.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone.primaryRound26Capstone
      .primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport
      .run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r30_capstone_chain',
    'chained wave 30 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-191')
  );

  push(
    'gov_prog_r30_capstone_schema',
    'round 30 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round30-capstone.v1'
  );

  return results;
}
