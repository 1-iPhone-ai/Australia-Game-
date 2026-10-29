import { compareIdleGovernanceProgramWaveScorecards } from './automation-idle-governance-program-wave-scorecard-compare.js';
import { gateIdleGovernanceProgramWaveAssembly } from './automation-idle-governance-program-wave-assembly-gate.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveAssemblyDigest {
  waveRound: number;
  gateOpen: boolean;
  scorecardBand: string;
  waveRecommendation: string;
  closeoutParityOk: boolean;
  scorecardParityOk: boolean;
  assemblyReady: boolean;
}

export interface O10IdleGovernanceProgramWaveAssemblyRunResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-run.v1';
  waveRound: number;
  primaryGate: ReturnType<typeof gateIdleGovernanceProgramWaveAssembly>;
  twinGate: ReturnType<typeof gateIdleGovernanceProgramWaveAssembly>;
  scorecardCompare: ReturnType<typeof compareIdleGovernanceProgramWaveScorecards>;
  assemblyDigest: O10IdleGovernanceProgramWaveAssemblyDigest;
  runSucceeded: boolean;
  runMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveAssemblyRunMarkdown(
  digest: O10IdleGovernanceProgramWaveAssemblyDigest,
  primaryGate: ReturnType<typeof gateIdleGovernanceProgramWaveAssembly>
): string {
  return [
    '# Agent 20 idle governance wave assembly run',
    '',
    `- wave_round=${digest.waveRound}`,
    `- run_succeeded=${digest.gateOpen && digest.scorecardParityOk}`,
    `- gate_open=${digest.gateOpen}`,
    `- scorecard_parity=${digest.scorecardParityOk}`,
    '',
    primaryGate.gateMarkdown,
  ].join('\n');
}

/** Round-19 orchestrated assembly run: twin gates + scorecard compare + digest. */
export function runIdleGovernanceProgramWaveAssembly(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyRunResult {
  const primaryGate = gateIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinGate = gateIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const scorecardCompare = compareIdleGovernanceProgramWaveScorecards(
    primaryGate.scorecard,
    twinGate.scorecard
  );

  const assemblyDigest: O10IdleGovernanceProgramWaveAssemblyDigest = {
    waveRound,
    gateOpen: primaryGate.gateOpen,
    scorecardBand: primaryGate.scorecard.scorecardBand,
    waveRecommendation: primaryGate.scorecard.waveRecommendation,
    closeoutParityOk: primaryGate.compare.parityOk,
    scorecardParityOk: scorecardCompare.parityOk,
    assemblyReady: primaryGate.scorecard.assemblyReady,
  };

  const runSucceeded =
    primaryGate.gateOpen && scorecardCompare.parityOk && primaryGate.compare.parityOk;

  const runMarkdown = buildIdleGovernanceProgramWaveAssemblyRunMarkdown(assemblyDigest, primaryGate);

  const summaryLine = [
    'gov_program_wave_assembly_run',
    `round=${waveRound}`,
    `ok=${runSucceeded}`,
    scorecardCompare.summaryLine,
    primaryGate.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-run.v1',
    waveRound,
    primaryGate,
    twinGate,
    scorecardCompare,
    assemblyDigest,
    runSucceeded,
    runMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyRunSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'run1',
    name: 'Assembly run',
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

  const run = runIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 19);
  push(
    'gov_prog_asm_run_calm',
    'calm assembly run succeeds with digest',
    run.runSucceeded === true &&
      run.assemblyDigest.scorecardParityOk === true &&
      run.runMarkdown.includes('assembly run')
  );

  const run2 = runIdleGovernanceProgramWaveAssembly(
    calmSpec,
    sampleRule,
    3,
    2,
    19,
    run.primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_asm_run_chain',
    'chained assembly run accumulates registry',
    run2.primaryGate.primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      run2.summaryLine.includes('gov_program_wave_assembly_run')
  );

  push(
    'gov_prog_asm_run_schema',
    'wave assembly run schema marker',
    run.schema === '10m.agent20.idle-governance-program-wave-assembly-run.v1'
  );

  return results;
}
