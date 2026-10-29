import { compareIdleGovernanceProgramWaveCycleCloseouts } from './automation-idle-governance-program-wave-cycle-closeout-compare.js';
import { runIdleGovernanceProgramWaveCycleCloseout } from './automation-idle-governance-program-wave-cycle-closeout.js';
import { rollupIdleGovernanceProgramWaveProjection } from './automation-idle-governance-program-wave-projection-rollup.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveScaleDispatchResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-dispatch.v1';
  waveRound: number;
  dispatchReady: boolean;
  primaryCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCycleCloseout>;
  twinCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCycleCloseout>;
  closeoutCompare: ReturnType<typeof compareIdleGovernanceProgramWaveCycleCloseouts>;
  projectionRollup: ReturnType<typeof rollupIdleGovernanceProgramWaveProjection>;
  dispatchMarkdown: string;
  summaryLine: string;
}

/** Round-22 scale dispatch: cycle closeout + parity + projection rollup for wave landing. */
export function dispatchIdleGovernanceProgramWaveScale(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveScaleDispatchResult {
  const primaryCloseout = runIdleGovernanceProgramWaveCycleCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinCloseout = runIdleGovernanceProgramWaveCycleCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const closeoutCompare = compareIdleGovernanceProgramWaveCycleCloseouts(primaryCloseout, twinCloseout);
  const projectionRollup = rollupIdleGovernanceProgramWaveProjection(primaryCloseout, projectedLocHint);

  const dispatchReady =
    closeoutCompare.parityOk &&
    primaryCloseout.cycleRecommendation === 'advance_scale_wave_cycle' &&
    primaryCloseout.primaryGate.gateOpen;

  const dispatchMarkdown = [
    '# Agent 20 idle governance wave scale dispatch',
    '',
    `- dispatch_ready=${dispatchReady}`,
    `- ${closeoutCompare.summaryLine}`,
    '',
    ...projectionRollup.projectionHookLines.map(line => `- ${line}`),
    '',
    primaryCloseout.cycleCloseoutMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_scale_dispatch',
    `round=${waveRound}`,
    `ready=${dispatchReady}`,
    projectionRollup.summaryLine,
    closeoutCompare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-dispatch.v1',
    waveRound,
    dispatchReady,
    primaryCloseout,
    twinCloseout,
    closeoutCompare,
    projectionRollup,
    dispatchMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleDispatchSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'dsp1',
    name: 'Scale dispatch',
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

  const dispatch = dispatchIdleGovernanceProgramWaveScale(calmSpec, sampleRule, 1, 3, 22, 1_401_419);
  push(
    'gov_prog_scale_dispatch_calm',
    'calm dispatch ready with closeout parity',
    dispatch.dispatchReady === true &&
      dispatch.closeoutCompare.parityOk === true &&
      dispatch.dispatchMarkdown.includes('1_401_419') === false &&
      dispatch.projectionRollup.projectionHookLines.some(l => l.includes('1401419'))
  );

  const dispatch2 = dispatchIdleGovernanceProgramWaveScale(
    calmSpec,
    sampleRule,
    3,
    2,
    22,
    1_401_419,
    dispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.operations.registry
  );
  push(
    'gov_prog_scale_dispatch_chain',
    'chained dispatch accumulates registry',
    dispatch2.primaryCloseout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive
      .director.registryRollup.entryCount === 2 &&
      dispatch2.summaryLine.includes('gov_program_wave_scale_dispatch')
  );

  push(
    'gov_prog_scale_dispatch_schema',
    'scale dispatch schema marker',
    dispatch.schema === '10m.agent20.idle-governance-program-wave-scale-dispatch.v1'
  );

  return results;
}
