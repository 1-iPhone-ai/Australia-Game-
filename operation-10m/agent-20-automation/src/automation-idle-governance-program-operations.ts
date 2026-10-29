import { attestIdleGovernanceProgramPass } from './automation-idle-governance-program-attestation.js';
import {
  appendIdleGovernanceProgramRegistryEntry,
  createEmptyIdleGovernanceProgramRegistry,
  formatIdleGovernanceProgramRegistryDigest,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import { runIdleGovernanceProgramPass } from './automation-idle-governance-program-pass.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramOperationsResult {
  schema: '10m.agent20.idle-governance-program-operations.v1';
  pass: ReturnType<typeof runIdleGovernanceProgramPass>;
  attestation: ReturnType<typeof attestIdleGovernanceProgramPass>;
  registry: O10IdleGovernanceProgramRegistry;
  registryDigest: string;
  operationsMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramOperationsMarkdown(
  pass: ReturnType<typeof runIdleGovernanceProgramPass>,
  attestation: ReturnType<typeof attestIdleGovernanceProgramPass>,
  registryDigest: string
): string {
  return [
    '## Agent 20 idle governance program operations',
    '',
    `- ${pass.summaryLine}`,
    `- attest_ok=${attestation.ok} digest=${attestation.digestChain}`,
    `- ${registryDigest}`,
    `- rollup=${attestation.rollupRecommendation}`,
    '',
  ].join('\n');
}

/** Round-14 operations bundle: program pass + attestation + registry append. */
export function runIdleGovernanceProgramOperations(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramOperationsResult {
  const pass = runIdleGovernanceProgramPass(spec, rule, startTurn, requestedCycles);
  const attestation = attestIdleGovernanceProgramPass(pass);
  const registry = appendIdleGovernanceProgramRegistryEntry(priorRegistry, pass, attestation, startTurn);
  const registryDigest = formatIdleGovernanceProgramRegistryDigest(registry);
  const operationsMarkdown = buildIdleGovernanceProgramOperationsMarkdown(pass, attestation, registryDigest);

  const summaryLine = [
    'gov_program_ops',
    `attest_ok=${attestation.ok}`,
    registryDigest,
    `frames=${attestation.replayFrameCount}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-operations.v1',
    pass,
    attestation,
    registry,
    registryDigest,
    operationsMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramOperationsSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'ops1',
    name: 'Program ops',
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

  const ops = runIdleGovernanceProgramOperations(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_ops_calm',
    'calm operations attests and registers',
    ops.attestation.ok && ops.registry.entries.length === 1 && ops.operationsMarkdown.includes('program operations')
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 5,
    humanCommittedEvery: 0,
    idleMsStart: 200_000,
    idleMsStep: 120_000,
    consecutiveIdleStart: 7,
  };
  const ops2 = runIdleGovernanceProgramOperations(stressSpec, sampleRule, 4, 4, ops.registry);
  push(
    'gov_prog_ops_chain',
    'chained registry accumulates entries',
    ops2.registry.entries.length === 2 && ops2.summaryLine.includes('gov_program_ops')
  );

  push('gov_prog_ops_schema', 'operations schema marker', ops.schema === '10m.agent20.idle-governance-program-operations.v1');

  push(
    'gov_prog_ops_digest',
    'registry digest on operations result',
    ops.registryDigest.includes('entries=1') && ops2.registryDigest.includes('entries=2')
  );

  return results;
}
