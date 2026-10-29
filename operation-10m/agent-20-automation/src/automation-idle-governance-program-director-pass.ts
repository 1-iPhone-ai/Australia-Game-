import { scoreIdleGovernanceProgramCompliance } from './automation-idle-governance-program-compliance-score.js';
import { rollupIdleGovernanceProgramRegistry } from './automation-idle-governance-program-registry-rollup.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import { runIdleGovernanceProgramOperations } from './automation-idle-governance-program-operations.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramDirectorPassResult {
  schema: '10m.agent20.idle-governance-program-director-pass.v1';
  operations: ReturnType<typeof runIdleGovernanceProgramOperations>;
  registryRollup: ReturnType<typeof rollupIdleGovernanceProgramRegistry>;
  complianceScore: ReturnType<typeof scoreIdleGovernanceProgramCompliance>;
  directorMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramDirectorMarkdown(
  ops: ReturnType<typeof runIdleGovernanceProgramOperations>,
  rollup: ReturnType<typeof rollupIdleGovernanceProgramRegistry>,
  score: ReturnType<typeof scoreIdleGovernanceProgramCompliance>
): string {
  return [
    '## Agent 20 idle governance program director brief',
    '',
    `- ${score.summaryLine}`,
    `- ${rollup.summaryLine} recommendation=${rollup.recommendation}`,
    `- ${ops.summaryLine}`,
    '',
    ops.operationsMarkdown,
  ].join('\n');
}

/** Round-15 director pass: operations + registry rollup + compliance score. */
export function runIdleGovernanceProgramDirectorPass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramDirectorPassResult {
  const operations = runIdleGovernanceProgramOperations(spec, rule, startTurn, requestedCycles, priorRegistry);
  const registryRollup = rollupIdleGovernanceProgramRegistry(operations.registry);
  const complianceScore = scoreIdleGovernanceProgramCompliance(registryRollup, operations.attestation);
  const directorMarkdown = buildIdleGovernanceProgramDirectorMarkdown(operations, registryRollup, complianceScore);

  const summaryLine = [
    'gov_program_director',
    complianceScore.summaryLine,
    registryRollup.recommendation,
    `registry_entries=${registryRollup.entryCount}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-program-director-pass.v1',
    operations,
    registryRollup,
    complianceScore,
    directorMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramDirectorPassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'dir1',
    name: 'Director pass',
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

  const director = runIdleGovernanceProgramDirectorPass(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_director_calm',
    'calm director pass produces markdown and score',
    director.directorMarkdown.includes('director brief') &&
      director.registryRollup.entryCount === 1 &&
      director.summaryLine.includes('gov_program_director')
  );

  const stressSpec: O10IdleOpsWindowSpec = {
    startTurn: 1,
    startDay: 1,
    turnCount: 6,
    humanCommittedEvery: 0,
    idleMsStart: 240_000,
    idleMsStep: 110_000,
    consecutiveIdleStart: 10,
  };
  const director2 = runIdleGovernanceProgramDirectorPass(stressSpec, sampleRule, 5, 4, director.operations.registry);
  push(
    'gov_prog_director_chain',
    'chained director pass rolls up registry',
    director2.registryRollup.entryCount === 2 && director2.complianceScore.score >= 0
  );

  push('gov_prog_director_schema', 'director pass schema marker', director.schema === '10m.agent20.idle-governance-program-director-pass.v1');

  push(
    'gov_prog_director_rollup',
    'rollup recommendation present',
    director2.registryRollup.recommendation.length > 0 && director2.registryRollup.summaryLine.includes('gov_program_registry_rollup')
  );

  return results;
}
