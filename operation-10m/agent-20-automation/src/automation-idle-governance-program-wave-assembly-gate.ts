import { compareIdleGovernanceProgramWaveCloseouts } from './automation-idle-governance-program-wave-closeout-compare.js';
import { runIdleGovernanceProgramWaveCloseout } from './automation-idle-governance-program-wave-closeout.js';
import { exportIdleGovernanceProgramWaveScorecard } from './automation-idle-governance-program-wave-scorecard.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveAssemblyGateResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-gate.v1';
  waveRound: number;
  gateOpen: boolean;
  primaryCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCloseout>;
  twinCloseout: ReturnType<typeof runIdleGovernanceProgramWaveCloseout>;
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveCloseouts>;
  scorecard: ReturnType<typeof exportIdleGovernanceProgramWaveScorecard>;
  gateMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveAssemblyGateMarkdown(
  gateOpen: boolean,
  scorecard: ReturnType<typeof exportIdleGovernanceProgramWaveScorecard>,
  compare: ReturnType<typeof compareIdleGovernanceProgramWaveCloseouts>
): string {
  return [
    '# Agent 20 idle governance wave assembly gate',
    '',
    `- gate_open=${gateOpen}`,
    `- ${compare.summaryLine}`,
    '',
    scorecard.scorecardMarkdown,
  ].join('\n');
}

/** Round-18 assembly gate: twin closeout parity + scorecard readiness for the wave round. */
export function gateIdleGovernanceProgramWaveAssembly(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyGateResult {
  const primaryCloseout = runIdleGovernanceProgramWaveCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinCloseout = runIdleGovernanceProgramWaveCloseout(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const compare = compareIdleGovernanceProgramWaveCloseouts(primaryCloseout, twinCloseout);
  const scorecard = exportIdleGovernanceProgramWaveScorecard(primaryCloseout);

  const gateOpen = compare.parityOk && scorecard.assemblyReady;
  const gateMarkdown = buildIdleGovernanceProgramWaveAssemblyGateMarkdown(gateOpen, scorecard, compare);

  const summaryLine = [
    'gov_program_wave_assembly_gate',
    `round=${waveRound}`,
    `open=${gateOpen}`,
    compare.summaryLine,
    scorecard.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-gate.v1',
    waveRound,
    gateOpen,
    primaryCloseout,
    twinCloseout,
    compare,
    scorecard,
    gateMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyGateSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'gate1',
    name: 'Wave assembly gate',
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

  const gate = gateIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 18);
  push(
    'gov_prog_asm_gate_calm',
    'calm spec opens assembly gate with twin parity',
    gate.gateOpen === true &&
      gate.compare.parityOk === true &&
      gate.waveRound === 18 &&
      gate.gateMarkdown.includes('assembly gate')
  );

  const gate2 = gateIdleGovernanceProgramWaveAssembly(
    calmSpec,
    sampleRule,
    3,
    2,
    18,
    gate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_asm_gate_chain',
    'chained gate accumulates registry on primary closeout',
    gate2.primaryCloseout.subject.executive.director.registryRollup.entryCount === 2 &&
      gate2.summaryLine.includes('gov_program_wave_assembly_gate')
  );

  push(
    'gov_prog_asm_gate_schema',
    'wave assembly gate schema marker',
    gate.schema === '10m.agent20.idle-governance-program-wave-assembly-gate.v1'
  );

  return results;
}
