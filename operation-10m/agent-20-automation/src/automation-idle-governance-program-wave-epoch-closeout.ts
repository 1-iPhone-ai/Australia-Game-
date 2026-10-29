import { compareIdleGovernanceProgramWaveScaleWaveSeals } from './automation-idle-governance-program-wave-scale-wave-seal-compare.js';
import { exportIdleGovernanceProgramWaveScaleWaveSeal } from './automation-idle-governance-program-wave-scale-wave-seal-export.js';
import { sealIdleGovernanceProgramWaveScaleWave } from './automation-idle-governance-program-wave-scale-wave-seal.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveEpochCloseoutResult {
  schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1';
  waveRound: number;
  epochReady: boolean;
  primarySeal: ReturnType<typeof sealIdleGovernanceProgramWaveScaleWave>;
  twinSeal: ReturnType<typeof sealIdleGovernanceProgramWaveScaleWave>;
  sealCompare: ReturnType<typeof compareIdleGovernanceProgramWaveScaleWaveSeals>;
  sealExport: ReturnType<typeof exportIdleGovernanceProgramWaveScaleWaveSeal>;
  epochCloseoutMarkdown: string;
  summaryLine: string;
}

/** Round-25 epoch closeout: seal + twin compare + capstone export for wave round 25 landing. */
export function runIdleGovernanceProgramWaveEpochCloseout(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveEpochCloseoutResult {
  const primarySeal = sealIdleGovernanceProgramWaveScaleWave(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinSeal = sealIdleGovernanceProgramWaveScaleWave(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const sealCompare = compareIdleGovernanceProgramWaveScaleWaveSeals(primarySeal, twinSeal);
  const sealExport = exportIdleGovernanceProgramWaveScaleWaveSeal(primarySeal);

  const epochReady =
    primarySeal.sealVerdict === 'sealed' &&
    sealCompare.parityOk &&
    primarySeal.primaryLanding.landingOpen;

  const epochCloseoutMarkdown = [
    '# Agent 20 idle governance wave epoch closeout',
    '',
    `- wave_round=${waveRound}`,
    `- epoch_ready=${epochReady}`,
    `- ${sealCompare.summaryLine}`,
    '',
    sealExport.exportMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_epoch_closeout',
    `round=${waveRound}`,
    `ready=${epochReady}`,
    sealExport.summaryLine,
    sealCompare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-epoch-closeout.v1',
    waveRound,
    epochReady,
    primarySeal,
    twinSeal,
    sealCompare,
    sealExport,
    epochCloseoutMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveEpochCloseoutSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'ep1',
    name: 'Epoch closeout',
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

  const epoch = runIdleGovernanceProgramWaveEpochCloseout(calmSpec, sampleRule, 1, 3, 25, 1_525_288);
  push(
    'gov_prog_epoch_closeout_calm',
    'calm epoch closeout ready with seal parity',
    epoch.epochReady === true &&
      epoch.sealCompare.parityOk === true &&
      epoch.epochCloseoutMarkdown.includes('epoch closeout')
  );

  const epoch2 = runIdleGovernanceProgramWaveEpochCloseout(
    calmSpec,
    sampleRule,
    3,
    2,
    25,
    1_525_288,
    epoch.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
      .primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_epoch_closeout_chain',
    'chained epoch closeout accumulates registry',
    epoch2.primarySeal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run
      .primaryGate.primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      epoch2.summaryLine.includes('gov_program_wave_epoch_closeout')
  );

  push(
    'gov_prog_epoch_closeout_schema',
    'epoch closeout schema marker',
    epoch.schema === '10m.agent20.idle-governance-program-wave-epoch-closeout.v1'
  );

  return results;
}
