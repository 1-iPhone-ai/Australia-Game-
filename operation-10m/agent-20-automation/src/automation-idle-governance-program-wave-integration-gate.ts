import { compareIdleGovernanceProgramWaveAssemblyExports } from './automation-idle-governance-program-wave-assembly-export-compare.js';
import { runAndExportIdleGovernanceProgramWaveAssembly } from './automation-idle-governance-program-wave-assembly-export.js';
import { verifyIdleGovernanceProgramWaveAssemblyReplayParity } from './automation-idle-governance-program-wave-assembly-replay-parity.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveIntegrationGateResult {
  schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1';
  waveRound: number;
  gateOpen: boolean;
  primaryExport: ReturnType<typeof runAndExportIdleGovernanceProgramWaveAssembly>;
  twinExport: ReturnType<typeof runAndExportIdleGovernanceProgramWaveAssembly>;
  exportCompare: ReturnType<typeof compareIdleGovernanceProgramWaveAssemblyExports>;
  replayParity: ReturnType<typeof verifyIdleGovernanceProgramWaveAssemblyReplayParity>;
  gateMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramWaveIntegrationGateMarkdown(
  gateOpen: boolean,
  primaryExport: ReturnType<typeof runAndExportIdleGovernanceProgramWaveAssembly>,
  replayParity: ReturnType<typeof verifyIdleGovernanceProgramWaveAssemblyReplayParity>
): string {
  return [
    '# Agent 20 idle governance wave integration gate',
    '',
    `- gate_open=${gateOpen}`,
    `- ${replayParity.summaryLine}`,
    '',
    primaryExport.exportMarkdown,
  ].join('\n');
}

/** Round-20 integration gate: twin exports + export compare + assembly replay parity. */
export function gateIdleGovernanceProgramWaveIntegration(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveIntegrationGateResult {
  const primaryExport = runAndExportIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const twinExport = runAndExportIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  const exportCompare = compareIdleGovernanceProgramWaveAssemblyExports(primaryExport, twinExport);
  const replayParity = verifyIdleGovernanceProgramWaveAssemblyReplayParity(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    primaryExport,
    priorRegistry
  );

  const gateOpen =
    primaryExport.payload.runSucceeded &&
    exportCompare.parityOk &&
    replayParity.replayParityOk;

  const gateMarkdown = buildIdleGovernanceProgramWaveIntegrationGateMarkdown(
    gateOpen,
    primaryExport,
    replayParity
  );

  const summaryLine = [
    'gov_program_wave_integration_gate',
    `round=${waveRound}`,
    `open=${gateOpen}`,
    exportCompare.summaryLine,
    replayParity.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-integration-gate.v1',
    waveRound,
    gateOpen,
    primaryExport,
    twinExport,
    exportCompare,
    replayParity,
    gateMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramWaveIntegrationGateSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'int1',
    name: 'Integration gate',
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

  const gate = gateIdleGovernanceProgramWaveIntegration(calmSpec, sampleRule, 1, 3, 20);
  push(
    'gov_prog_int_gate_calm',
    'calm integration gate opens with export and replay parity',
    gate.gateOpen === true &&
      gate.exportCompare.parityOk === true &&
      gate.replayParity.replayParityOk === true
  );

  const gate2 = gateIdleGovernanceProgramWaveIntegration(
    calmSpec,
    sampleRule,
    3,
    2,
    20,
    gate.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.operations.registry
  );
  push(
    'gov_prog_int_gate_chain',
    'chained integration gate accumulates registry',
    gate2.primaryExport.run.primaryGate.primaryCloseout.subject.executive.director.registryRollup.entryCount ===
      2 && gate2.gateMarkdown.includes('integration gate')
  );

  push(
    'gov_prog_int_gate_schema',
    'integration gate schema marker',
    gate.schema === '10m.agent20.idle-governance-program-wave-integration-gate.v1'
  );

  return results;
}
