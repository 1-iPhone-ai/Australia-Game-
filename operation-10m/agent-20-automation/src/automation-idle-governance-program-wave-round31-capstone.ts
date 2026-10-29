import { compareIdleGovernanceProgramWaveRound30Capstones } from './automation-idle-governance-program-wave-round30-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound30Capstone } from './automation-idle-governance-program-wave-round30-capstone.js';
import { exportIdleGovernanceProgramWaveRound31 } from './automation-idle-governance-program-wave-round31-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound31CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1';
  o10TaskId: 'O10-193';
  waveRound: 31;
  capstoneReady: boolean;
  primaryRound30Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound30Capstone>;
  twinRound30Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound30Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound30Capstones>;
  round31Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound31>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound31Primary(cap: O10IdleGovernanceProgramWaveRound31CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
    .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-31 / wave-31 capstone for O10-193 origin landing. */
export function runIdleGovernanceProgramWaveRound31Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound31CapstoneResult {
  const waveRound = 31;
  const primaryRound30Capstone = runIdleGovernanceProgramWaveRound30Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound30Capstone = runIdleGovernanceProgramWaveRound30Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound30Capstones(
    primaryRound30Capstone,
    twinRound30Capstone
  );
  const round31Export = exportIdleGovernanceProgramWaveRound31(primaryRound30Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound30Capstone.capstoneReady && round31Export.payload.round31Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 31 capstone (O10-193)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round31Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round31_capstone',
    'task=O10-193',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round31Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round31-capstone.v1',
    o10TaskId: 'O10-193',
    waveRound,
    capstoneReady,
    primaryRound30Capstone,
    twinRound30Capstone,
    capstoneCompare,
    round31Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound31CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap31',
    name: 'Round 31 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound31Capstone(calmSpec, sampleRule, 1, 3, 1_760_131);
  push(
    'gov_prog_r31_capstone_calm',
    'O10-193 wave 31 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-193' && cap.waveRound === 31 && cap.capstoneMarkdown.includes('O10-193')
  );

  const cap2 = runIdleGovernanceProgramWaveRound31Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    1_760_131,
    registryFromRound31Primary(cap)
  );
  const rollup =
    cap2.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout
      .primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r31_capstone_chain',
    'chained wave 31 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-193')
  );
  push(
    'gov_prog_r31_capstone_schema',
    'round 31 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round31-capstone.v1'
  );
  return results;
}
