import { dispatchIdleGovernanceProgramWaveScale } from './automation-idle-governance-program-wave-scale-dispatch.js';
import type { O10IdleGovernanceProgramWaveScaleDispatchResult } from './automation-idle-governance-program-wave-scale-dispatch.js';
import { compareIdleGovernanceProgramWaveScaleDispatches } from './automation-idle-governance-program-wave-scale-dispatch-compare.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveScaleDispatchReplayParityResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-replay-parity.v1';
  waveRound: number;
  replayParityOk: boolean;
  baselineDispatch: O10IdleGovernanceProgramWaveScaleDispatchResult;
  replayDispatch: O10IdleGovernanceProgramWaveScaleDispatchResult;
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveScaleDispatches>;
  summaryLine: string;
}

/** Round-23 replay parity: re-run scale dispatch and compare to baseline. */
export function verifyIdleGovernanceProgramWaveScaleDispatchReplayParity(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  baselineDispatch: O10IdleGovernanceProgramWaveScaleDispatchResult,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveScaleDispatchReplayParityResult {
  const replayDispatch = dispatchIdleGovernanceProgramWaveScale(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const compare = compareIdleGovernanceProgramWaveScaleDispatches(baselineDispatch, replayDispatch);
  const replayParityOk =
    compare.parityOk &&
    baselineDispatch.dispatchReady === replayDispatch.dispatchReady;

  const summaryLine = [
    'gov_program_wave_scale_dispatch_replay_parity',
    `round=${waveRound}`,
    `parity=${replayParityOk}`,
    compare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch-replay-parity.v1',
    waveRound,
    replayParityOk,
    baselineDispatch,
    replayDispatch,
    compare,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleDispatchReplayParitySelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'drpl1',
    name: 'Dispatch replay',
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

  const baseline = dispatchIdleGovernanceProgramWaveScale(calmSpec, sampleRule, 1, 3, 23, 1_448_902);
  const parity = verifyIdleGovernanceProgramWaveScaleDispatchReplayParity(
    calmSpec,
    sampleRule,
    1,
    3,
    23,
    1_448_902,
    baseline,
    createEmptyIdleGovernanceProgramRegistry()
  );
  push(
    'gov_prog_dsp_rpl_parity',
    'replay dispatch matches baseline',
    parity.replayParityOk === true && parity.compare.parityOk === true
  );

  push(
    'gov_prog_dsp_rpl_schema',
    'dispatch replay parity schema marker',
    parity.schema === '10m.agent20.idle-governance-program-wave-scale-dispatch-replay-parity.v1'
  );

  return results;
}
