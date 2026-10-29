import { compareIdleGovernanceProgramWaveLandingGates } from './automation-idle-governance-program-wave-landing-gate-compare.js';
import { gateIdleGovernanceProgramWaveLanding } from './automation-idle-governance-program-wave-landing-gate.js';
import { bundleIdleGovernanceProgramWaveLanding } from './automation-idle-governance-program-wave-landing-bundle.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export type O10IdleGovernanceProgramWaveScaleWaveSealVerdict = 'sealed' | 'hold' | 'blocked';

export interface O10IdleGovernanceProgramWaveScaleWaveSealResult {
  schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1';
  waveRound: number;
  sealVerdict: O10IdleGovernanceProgramWaveScaleWaveSealVerdict;
  primaryLanding: ReturnType<typeof gateIdleGovernanceProgramWaveLanding>;
  twinLanding: ReturnType<typeof gateIdleGovernanceProgramWaveLanding>;
  landingCompare: ReturnType<typeof compareIdleGovernanceProgramWaveLandingGates>;
  landingBundle: ReturnType<typeof bundleIdleGovernanceProgramWaveLanding>;
  sealMarkdown: string;
  summaryLine: string;
}

function deriveSealVerdict(
  landingOpen: boolean,
  landingCompareParity: boolean
): O10IdleGovernanceProgramWaveScaleWaveSealVerdict {
  if (landingOpen && landingCompareParity) return 'sealed';
  if (!landingCompareParity) return 'blocked';
  return 'hold';
}

/** Round-24 scale-wave seal: landing gate + twin compare + bundle for wave 24/24 close. */
export function sealIdleGovernanceProgramWaveScaleWave(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  projectedLocHint: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveScaleWaveSealResult {
  const primaryLanding = gateIdleGovernanceProgramWaveLanding(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const twinLanding = gateIdleGovernanceProgramWaveLanding(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    projectedLocHint,
    priorRegistry
  );
  const landingCompare = compareIdleGovernanceProgramWaveLandingGates(primaryLanding, twinLanding);
  const landingBundle = bundleIdleGovernanceProgramWaveLanding(primaryLanding, projectedLocHint);
  const sealVerdict = deriveSealVerdict(primaryLanding.landingOpen, landingCompare.parityOk);

  const sealMarkdown = [
    '# Agent 20 idle governance scale wave seal',
    '',
    `- wave_round=${waveRound}`,
    `- seal_verdict=${sealVerdict}`,
    `- ${landingCompare.summaryLine}`,
    '',
    landingBundle.bundleMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_scale_wave_seal',
    `round=${waveRound}`,
    `verdict=${sealVerdict}`,
    landingBundle.summaryLine,
    landingCompare.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1',
    waveRound,
    sealVerdict,
    primaryLanding,
    twinLanding,
    landingCompare,
    landingBundle,
    sealMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveScaleWaveSealSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'seal1',
    name: 'Scale wave seal',
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

  const seal = sealIdleGovernanceProgramWaveScaleWave(calmSpec, sampleRule, 1, 3, 24, 1_487_095);
  push(
    'gov_prog_wave_seal_calm',
    'calm spec seals wave with landing parity',
    seal.sealVerdict === 'sealed' &&
      seal.landingCompare.parityOk === true &&
      seal.sealMarkdown.includes('scale wave seal')
  );

  const seal2 = sealIdleGovernanceProgramWaveScaleWave(
    calmSpec,
    sampleRule,
    3,
    2,
    24,
    1_487_095,
    seal.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_wave_seal_chain',
    'chained seal accumulates registry',
    seal2.primaryLanding.primaryDispatch.primaryCloseout.primaryGate.primaryExport.run.primaryGate
      .primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      seal2.summaryLine.includes('gov_program_wave_scale_wave_seal')
  );

  push(
    'gov_prog_wave_seal_schema',
    'scale wave seal schema marker',
    seal.schema === '10m.agent20.idle-governance-program-wave-scale-wave-seal.v1'
  );

  return results;
}
