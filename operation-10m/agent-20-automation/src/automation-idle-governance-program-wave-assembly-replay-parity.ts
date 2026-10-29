import { runAndExportIdleGovernanceProgramWaveAssembly } from './automation-idle-governance-program-wave-assembly-export.js';
import type { O10IdleGovernanceProgramWaveAssemblyExportResult } from './automation-idle-governance-program-wave-assembly-export.js';
import { compareIdleGovernanceProgramWaveAssemblyExports } from './automation-idle-governance-program-wave-assembly-export-compare.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveAssemblyReplayParityResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-replay-parity.v1';
  waveRound: number;
  replayParityOk: boolean;
  baselineExport: O10IdleGovernanceProgramWaveAssemblyExportResult;
  replayExport: O10IdleGovernanceProgramWaveAssemblyExportResult;
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveAssemblyExports>;
  summaryLine: string;
}

/** Round-20 replay parity: re-run assembly export and compare to baseline export. */
export function verifyIdleGovernanceProgramWaveAssemblyReplayParity(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  baselineExport: O10IdleGovernanceProgramWaveAssemblyExportResult,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyReplayParityResult {
  const replayExport = runAndExportIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const compare = compareIdleGovernanceProgramWaveAssemblyExports(baselineExport, replayExport);
  const replayParityOk = compare.parityOk && baselineExport.payload.runSucceeded === replayExport.payload.runSucceeded;

  const summaryLine = [
    'gov_program_wave_assembly_replay_parity',
    `round=${waveRound}`,
    `parity=${replayParityOk}`,
    compare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-replay-parity.v1',
    waveRound,
    replayParityOk,
    baselineExport,
    replayExport,
    compare,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyReplayParitySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'rpl1',
    name: 'Replay parity',
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

  const baseline = runAndExportIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 20);
  const parity = verifyIdleGovernanceProgramWaveAssemblyReplayParity(
    calmSpec,
    sampleRule,
    1,
    3,
    20,
    baseline,
    createEmptyIdleGovernanceProgramRegistry()
  );
  push(
    'gov_prog_rpl_parity_calm',
    'replay export matches baseline on calm spec',
    parity.replayParityOk === true && parity.compare.parityOk === true
  );

  push(
    'gov_prog_rpl_parity_schema',
    'replay parity schema marker',
    parity.schema === '10m.agent20.idle-governance-program-wave-assembly-replay-parity.v1'
  );

  return results;
}
