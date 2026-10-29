import { compareIdleGovernanceProgramWaveRound50Capstones } from './automation-idle-governance-program-wave-round50-capstone-compare.js';
import { runIdleGovernanceProgramWaveRound50Capstone } from './automation-idle-governance-program-wave-round50-capstone.js';
import { exportIdleGovernanceProgramWaveRound51 } from './automation-idle-governance-program-wave-round51-export.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveRound51CapstoneResult {
  schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1';
  o10TaskId: 'O10-233';
  waveRound: 51;
  capstoneReady: boolean;
  primaryRound50Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound50Capstone>;
  twinRound50Capstone: ReturnType<typeof runIdleGovernanceProgramWaveRound50Capstone>;
  capstoneCompare: ReturnType<typeof compareIdleGovernanceProgramWaveRound50Capstones>;
  round51Export: ReturnType<typeof exportIdleGovernanceProgramWaveRound51>;
  capstoneMarkdown: string;
  summaryLine: string;
}

function registryFromRound51Primary(cap: O10IdleGovernanceProgramWaveRound51CapstoneResult): O10IdleGovernanceProgramRegistry {
  return cap.primaryRound50Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
    .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
    .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
    .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
    .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
    .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry;
}

/** Round-51 / wave-51 capstone for O10-233 origin landing. */
export function runIdleGovernanceProgramWaveRound51Capstone(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveRound51CapstoneResult {
  const waveRound = 51;
  const primaryRound50Capstone = runIdleGovernanceProgramWaveRound50Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const twinRound50Capstone = runIdleGovernanceProgramWaveRound50Capstone(
    spec,
    rule,
    startTurn,
    requestedCycles,
    projectedLocHint,
    priorRegistry
  );
  const capstoneCompare = compareIdleGovernanceProgramWaveRound50Capstones(
    primaryRound50Capstone,
    twinRound50Capstone
  );
  const round51Export = exportIdleGovernanceProgramWaveRound51(primaryRound50Capstone, projectedLocHint);
  const capstoneReady =
    capstoneCompare.parityOk && primaryRound50Capstone.capstoneReady && round51Export.payload.round51Ready;
  const capstoneMarkdown = [
    '# Agent 20 scale wave round 51 capstone (O10-233)',
    '',
    `- capstone_ready=${capstoneReady}`,
    `- wave_round=${waveRound}`,
    `- baseline_hint=${projectedLocHint}`,
    `- integration_baseline=a32b2b15`,
    `- ${capstoneCompare.summaryLine}`,
    '',
    round51Export.exportMarkdown,
  ].join('\n');
  const summaryLine = [
    'gov_program_wave_round51_capstone',
    'task=O10-233',
    `round=${waveRound}`,
    `ready=${capstoneReady}`,
    round51Export.summaryLine,
  ].join(' | ');
  return {
    schema: '10m.agent20.idle-governance-program-wave-round51-capstone.v1',
    o10TaskId: 'O10-233',
    waveRound,
    capstoneReady,
    primaryRound50Capstone,
    twinRound50Capstone,
    capstoneCompare,
    round51Export,
    capstoneMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveRound51CapstoneSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean) => results.push({ id, name, passed });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cap51',
    name: 'Round 51 capstone',
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

  const cap = runIdleGovernanceProgramWaveRound51Capstone(calmSpec, sampleRule, 1, 3, 2_887_600);
  push(
    'gov_prog_r51_capstone_calm',
    'O10-233 wave 51 capstone ready on calm spec',
    cap.capstoneReady && cap.o10TaskId === 'O10-233' && cap.waveRound === 51 && cap.capstoneMarkdown.includes('O10-233')
  );

  const cap2 = runIdleGovernanceProgramWaveRound51Capstone(
    calmSpec,
    sampleRule,
    3,
    2,
    2_887_600,
    registryFromRound51Primary(cap)
  );
  const rollup =
    cap2.primaryRound50Capstone.primaryRound49Capstone.primaryRound48Capstone.primaryRound47Capstone.primaryRound46Capstone.primaryRound45Capstone.primaryRound44Capstone.primaryRound43Capstone.primaryRound42Capstone
      .primaryRound41Capstone.primaryRound40Capstone.primaryRound39Capstone.primaryRound38Capstone.primaryRound37Capstone
      .primaryRound36Capstone.primaryRound35Capstone.primaryRound34Capstone.primaryRound33Capstone.primaryRound32Capstone
      .primaryRound31Capstone.primaryRound30Capstone.primaryRound29Capstone.primaryRound28Capstone.primaryRound27Capstone
      .primaryRound26Capstone.primaryEpoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate
      .primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup;
  push(
    'gov_prog_r51_capstone_chain',
    'chained wave 51 capstone accumulates registry',
    rollup.entryCount === 2 && cap2.summaryLine.includes('O10-233')
  );
  push(
    'gov_prog_r51_capstone_schema',
    'round 51 capstone schema marker',
    cap.schema === '10m.agent20.idle-governance-program-wave-round51-capstone.v1'
  );
  return results;
}
