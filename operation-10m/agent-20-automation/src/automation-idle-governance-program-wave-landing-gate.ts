import { compareIdleGovernanceProgramWaveScaleDispatches } from './automation-idle-governance-program-wave-scale-dispatch-compare.js';
import { dispatchIdleGovernanceProgramWaveScale } from './automation-idle-governance-program-wave-scale-dispatch.js';
import { verifyIdleGovernanceProgramWaveScaleDispatchReplayParity } from './automation-idle-governance-program-wave-scale-dispatch-replay-parity.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveLandingGateResult {
  schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1';
  waveRound: number;
  landingOpen: boolean;
  primaryDispatch: ReturnType<typeof dispatchIdleGovernanceProgramWaveScale>;
  twinDispatch: ReturnType<typeof dispatchIdleGovernanceProgramWaveScale>;
  dispatchCompare: ReturnType<typeof compareIdleGovernanceProgramWaveScaleDispatches>;
  replayParity: ReturnType<typeof verifyIdleGovernanceProgramWaveScaleDispatchReplayParity>;
  landingMarkdown: string;
  summaryLine: string;
}

/** Round-23 landing gate: twin dispatch + compare + replay parity for origin landing. */
export function gateIdleGovernanceProgramWaveLanding(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveLandingGateResult {
  const primaryDispatch = dispatchIdleGovernanceProgramWaveScale(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinDispatch = dispatchIdleGovernanceProgramWaveScale(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const dispatchCompare = compareIdleGovernanceProgramWaveScaleDispatches(
    primaryDispatch,
    twinDispatch
  );
  const replayParity = verifyIdleGovernanceProgramWaveScaleDispatchReplayParity(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    primaryDispatch,
    priorRegistry
  );

  const landingOpen =
    primaryDispatch.dispatchReady && dispatchCompare.parityOk && replayParity.replayParityOk;

  const landingMarkdown = [
    '# Agent 20 idle governance wave landing gate',
    '',
    `- landing_open=${landingOpen}`,
    `- ${dispatchCompare.summaryLine}`,
    `- ${replayParity.summaryLine}`,
    '',
    primaryDispatch.dispatchMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_landing_gate',
    `round=${waveRound}`,
    `open=${landingOpen}`,
    dispatchCompare.summaryLine,
    replayParity.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-landing-gate.v1',
    waveRound,
    landingOpen,
    primaryDispatch,
    twinDispatch,
    dispatchCompare,
    replayParity,
    landingMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveLandingGateSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'land1',
    name: 'Landing gate',
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

  const gate = gateIdleGovernanceProgramWaveLanding(calmSpec, sampleRule, 1, 3, 23, 1_448_902);
  push(
    'gov_prog_land_gate_calm',
    'calm landing gate opens with dispatch parity',
    gate.landingOpen === true &&
      gate.dispatchCompare.parityOk === true &&
      gate.replayParity.replayParityOk === true
  );

  const gate2 = gateIdleGovernanceProgramWaveLanding(
    calmSpec,
    sampleRule,
    3,
    2,
    23,
    1_448_902,
    gate.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.operations.registry
  );
  push(
    'gov_prog_land_gate_chain',
    'chained landing gate accumulates registry',
    gate2.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout
      .subject.executive.director.registryRollup.entryCount === 2 &&
      gate2.landingMarkdown.includes('landing gate')
  );

  push(
    'gov_prog_land_gate_schema',
    'landing gate schema marker',
    gate.schema === '10m.agent20.idle-governance-program-wave-landing-gate.v1'
  );

  return results;
}
