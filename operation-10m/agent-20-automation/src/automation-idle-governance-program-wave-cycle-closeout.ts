import { compareIdleGovernanceProgramWaveIntegrationGates } from './automation-idle-governance-program-wave-integration-gate-compare.js';
import { gateIdleGovernanceProgramWaveIntegration } from './automation-idle-governance-program-wave-integration-gate.js';
import { bundleIdleGovernanceProgramWaveHandoff } from './automation-idle-governance-program-wave-handoff-bundle.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export type O10IdleGovernanceProgramWaveCycleRecommendation =
  | 'advance_scale_wave_cycle'
  | 'hold_scale_wave_cycle'
  | 'escalate_scale_wave_cycle';

export interface O10IdleGovernanceProgramWaveCycleCloseoutResult {
  schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1';
  waveRound: number;
  primaryGate: ReturnType<typeof gateIdleGovernanceProgramWaveIntegration>;
  twinGate: ReturnType<typeof gateIdleGovernanceProgramWaveIntegration>;
  gateCompare: ReturnType<typeof compareIdleGovernanceProgramWaveIntegrationGates>;
  handoffBundle: ReturnType<typeof bundleIdleGovernanceProgramWaveHandoff>;
  cycleRecommendation: O10IdleGovernanceProgramWaveCycleRecommendation;
  cycleCloseoutMarkdown: string;
  summaryLine: string;
}

function deriveCycleRecommendation(
  gateOpen: boolean,
  gateCompareParity: boolean
): O10IdleGovernanceProgramWaveCycleRecommendation {
  if (gateOpen && gateCompareParity) return 'advance_scale_wave_cycle';
  if (!gateCompareParity) return 'escalate_scale_wave_cycle';
  return 'hold_scale_wave_cycle';
}

export function buildIdleGovernanceProgramWaveCycleCloseoutMarkdown(
  waveRound: number,
  recommendation: O10IdleGovernanceProgramWaveCycleRecommendation,
  handoffBundle: ReturnType<typeof bundleIdleGovernanceProgramWaveHandoff>
): string {
  return [
    '# Agent 20 idle governance wave cycle closeout',
    '',
    `- wave_round=${waveRound}`,
    `- cycle_recommendation=${recommendation}`,
    '',
    handoffBundle.bundleMarkdown,
  ].join('\n');
}

/** Round-21 cycle closeout: integration gate, twin compare, handoff bundle, cycle recommendation. */
export function runIdleGovernanceProgramWaveCycleCloseout(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveCycleCloseoutResult {
  const primaryGate = gateIdleGovernanceProgramWaveIntegration(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinGate = gateIdleGovernanceProgramWaveIntegration(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const gateCompare = compareIdleGovernanceProgramWaveIntegrationGates(primaryGate, twinGate);
  const handoffBundle = bundleIdleGovernanceProgramWaveHandoff(primaryGate);
  const cycleRecommendation = deriveCycleRecommendation(primaryGate.gateOpen, gateCompare.parityOk);
  const cycleCloseoutMarkdown = buildIdleGovernanceProgramWaveCycleCloseoutMarkdown(
    waveRound,
    cycleRecommendation,
    handoffBundle
  );

  const summaryLine = [
    'gov_program_wave_cycle_closeout',
    `round=${waveRound}`,
    `rec=${cycleRecommendation}`,
    gateCompare.summaryLine,
    handoffBundle.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-cycle-closeout.v1',
    waveRound,
    primaryGate,
    twinGate,
    gateCompare,
    handoffBundle,
    cycleRecommendation,
    cycleCloseoutMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveCycleCloseoutSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'cyc1',
    name: 'Cycle closeout',
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

  const closeout = runIdleGovernanceProgramWaveCycleCloseout(calmSpec, sampleRule, 1, 3, 21);
  push(
    'gov_prog_cycle_closeout_calm',
    'calm cycle closeout advances with gate parity',
    closeout.cycleRecommendation === 'advance_scale_wave_cycle' &&
      closeout.gateCompare.parityOk === true &&
      closeout.cycleCloseoutMarkdown.includes('cycle closeout')
  );

  const closeout2 = runIdleGovernanceProgramWaveCycleCloseout(
    calmSpec,
    sampleRule,
    3,
    2,
    21,
    closeout.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
      .operations.registry
  );
  push(
    'gov_prog_cycle_closeout_chain',
    'chained cycle closeout accumulates registry',
    closeout2.primaryGate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director
      .registryRollup.entryCount === 2 &&
      closeout2.summaryLine.includes('gov_program_wave_cycle_closeout')
  );

  push(
    'gov_prog_cycle_closeout_schema',
    'cycle closeout schema marker',
    closeout.schema === '10m.agent20.idle-governance-program-wave-cycle-closeout.v1'
  );

  return results;
}
