import type { O10IdleGovernanceProgramWaveAssemblyRunResult } from './automation-idle-governance-program-wave-assembly-run.js';
import { runIdleGovernanceProgramWaveAssembly } from './automation-idle-governance-program-wave-assembly-run.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramWaveAssemblyExportPayload {
  schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1';
  waveRound: number;
  runSucceeded: boolean;
  assemblyDigest: O10IdleGovernanceProgramWaveAssemblyRunResult['assemblyDigest'];
  integrationHookLines: string[];
}

export interface O10IdleGovernanceProgramWaveAssemblyExportResult {
  schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1';
  waveRound: number;
  run: O10IdleGovernanceProgramWaveAssemblyRunResult;
  payload: O10IdleGovernanceProgramWaveAssemblyExportPayload;
  exportMarkdown: string;
  summaryLine: string;
}

function buildIntegrationHookLines(
  run: O10IdleGovernanceProgramWaveAssemblyRunResult
): string[] {
  const d = run.assemblyDigest;
  return [
    `O10_AGENT20_WAVE_ASSEMBLY round=${d.waveRound}`,
    `O10_AGENT20_WAVE_GATE open=${d.gateOpen}`,
    `O10_AGENT20_WAVE_SCORECARD band=${d.scorecardBand} rec=${d.waveRecommendation}`,
    `O10_AGENT20_WAVE_PARITY closeout=${d.closeoutParityOk} scorecard=${d.scorecardParityOk}`,
    `O10_AGENT20_WAVE_RUN ok=${run.runSucceeded}`,
  ];
}

/** Round-19 flattened assembly export for Agent 25 integration hooks. */
export function exportIdleGovernanceProgramWaveAssembly(
  run: O10IdleGovernanceProgramWaveAssemblyRunResult
): O10IdleGovernanceProgramWaveAssemblyExportResult {
  const integrationHookLines = buildIntegrationHookLines(run);
  const payload: O10IdleGovernanceProgramWaveAssemblyExportPayload = {
    schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
    waveRound: run.waveRound,
    runSucceeded: run.runSucceeded,
    assemblyDigest: run.assemblyDigest,
    integrationHookLines,
  };

  const exportMarkdown = [
    '# Agent 20 idle governance wave assembly export',
    '',
    ...integrationHookLines.map(line => `- ${line}`),
    '',
    run.runMarkdown,
  ].join('\n');

  const summaryLine = [
    'gov_program_wave_assembly_export',
    `round=${run.waveRound}`,
    `ok=${run.runSucceeded}`,
    `hooks=${integrationHookLines.length}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-wave-assembly-export.v1',
    waveRound: run.waveRound,
    run,
    payload,
    exportMarkdown,
    summaryLine,
  };
}

/** Convenience entry: run assembly then export in one call. */
export function runAndExportIdleGovernanceProgramWaveAssembly(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  waveRound: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramWaveAssemblyExportResult {
  const run = runIdleGovernanceProgramWaveAssembly(
    spec,
    rule,
    startTurn,
    requestedCycles,
    waveRound,
    priorRegistry
  );
  return exportIdleGovernanceProgramWaveAssembly(run);
}

export function runO10Agent20IdleGovernanceProgramWaveAssemblyExportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'exp1',
    name: 'Assembly export',
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

  const exported = runAndExportIdleGovernanceProgramWaveAssembly(calmSpec, sampleRule, 1, 3, 19);
  push(
    'gov_prog_asm_export_calm',
    'export includes integration hook lines',
    exported.payload.integrationHookLines.length === 5 &&
      exported.exportMarkdown.includes('O10_AGENT20_WAVE_RUN') &&
      exported.payload.runSucceeded === true
  );

  push(
    'gov_prog_asm_export_schema',
    'assembly export schema marker',
    exported.schema === '10m.agent20.idle-governance-program-wave-assembly-export.v1'
  );

  push(
    'gov_prog_asm_export_payload',
    'payload schema marker',
    exported.payload.schema === '10m.agent20.idle-governance-program-wave-assembly-export.v1'
  );

  return results;
}
