import { compareIdleGovernanceProgramWaveRound49Capstones } from './automation-idle-governance-program-wave-round49-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound49Capstone } from './automation-idle-governance-program-wave-round49-capstone.js';
import { exportIdleGovernanceProgramWaveRound50 } from './automation-idle-governance-program-wave-round50-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound50CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1';
  o10TaskId: 'O10-231';
  waveRound: 50;
  capstoneReady: boolean;
  primaryRound49Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound49Capstone>;
  twinRound49Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound49Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound49Capstones>;
  round50Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound50>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound50Primary(cap: O10IdleGovernanceProgramWaveRound50CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-50 / wave-50 capstone for O10-231 origin landing. */
export function runIdleGovernanceProgramWaveRound50Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound50CapstoneResult {
  const waveRound = 50;
  const primaryRound49Capstone = runIdleGovernanceProgramWaveRound49Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound49Capstone = runIdleGovernanceProgramWaveRound49Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound49Capstones(
    primaryRound49Capstone,
    twinRound49Capstone
  );
  const round50Export = exportIdleGovernanceProgramWaveRound50(primaryRound49Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound49Capstone.capstoneReady && round50Export.payload.round50Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 50 capstone (O10-231)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=8aaaf700`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round50Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round50_capstone',
    'task=O10-231',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round50Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round50-capstone.v1',
    o10TaskId: 'O10-231',
    waveRound,
    capstoneReady,
    primaryRound49Capstone,
    twinRound49Capstone,
    capstoneCompare,
    round50Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound50CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap50',
    name: 'Round 50 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound50Capstone(calmSpec, sampleRule, 1, 3, 2_771_207);
  push(
    'gov_prog_r50_capstone_calm',
    'O10-231 wave 50 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-231' && cap.waveRound === 50 && cap.capstoneMarkdown.includes('O10-231')
  );

  const cap2 = runIdleGovernanceProgramWaveRound50Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_771_207,
    registryFromRound50Primary(cap)
  );
  const rollup =
    cap2.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r50_capstone_chain',
    'chained wave 50 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-231')
  );
  push(
    'gov_prog_r50_capstone_schema',
    'round 50 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round50-capstone.v1'
  );
  return results;
}
