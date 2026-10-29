import { certifyIdleGovernanceProgramBoard } from './automation-idle-governance-program-board-certification.js';
import { buildIdleGovernanceProgramRemediationPlan } from './automation-idle-governance-program-remediation-plan.js';
import { runIdleGovernanceProgramDirectorPass } from './automation-idle-governance-program-director-pass.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceProgramExecutivePassResult {
  schema: '10m.agent20.idle-governance-program-executive-pass.v1';
  director: ReturnType<typeof runIdleGovernanceProgramDirectorPass>;
  remediation: ReturnType<typeof buildIdleGovernanceProgramRemediationPlan>;
  board: ReturnType<typeof certifyIdleGovernanceProgramBoard>;
  executiveMarkdown: string;
  summaryLine: string;
}

export function buildIdleGovernanceProgramExecutiveMarkdown(
  director: ReturnType<typeof runIdleGovernanceProgramDirectorPass>,
  remediation: ReturnType<typeof buildIdleGovernanceProgramRemediationPlan>,
  board: ReturnType<typeof certifyIdleGovernanceProgramBoard>
): string {
  return [
    '# Agent 20 idle governance executive pass',
    '',
    director.directorMarkdown,
    '',
    remediation.planMarkdown,
    '',
    board.certificationMarkdown,
  ].join('\n');
}

/** Round-16 executive pass: director + remediation plan + board certification. */
export function runIdleGovernanceProgramExecutivePass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramExecutivePassResult {
  const director = runIdleGovernanceProgramDirectorPass(spec, rule, startTurn, requestedCycles, priorRegistry);
  const remediation = buildIdleGovernanceProgramRemediationPlan(director.complianceScore, director.registryRollup);
  const board = certifyIdleGovernanceProgramBoard(director, remediation);
  const executiveMarkdown = buildIdleGovernanceProgramExecutiveMarkdown(director, remediation, board);

  const summaryLine = [
    'gov_program_executive',
    board.summaryLine,
    remediation.summaryLine,
    director.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-executive-pass.v1',
    director,
    remediation,
    board,
    executiveMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramExecutivePassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'exec1',
    name: 'Executive pass',
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

  const executive = runIdleGovernanceProgramExecutivePass(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_exec_calm',
    'calm executive pass chains director remediation board',
    executive.executiveMarkdown.includes('executive pass') &&
      executive.director.registryRollup.entryCount === 1 &&
      executive.remediation.items.length >= 1 &&
      executive.board.decision.length > 0
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
  const executive2 = runIdleGovernanceProgramExecutivePass(
    stressSpec,
    sampleRule,
    5,
    4,
    executive.director.operations.registry
  );
  push(
    'gov_prog_exec_chain',
    'chained executive pass accumulates registry',
    executive2.director.registryRollup.entryCount === 2 && executive2.summaryLine.includes('gov_program_executive')
  );

  push(
    'gov_prog_exec_schema',
    'executive pass schema marker',
    executive.schema === '10m.agent20.idle-governance-program-executive-pass.v1'
  );

  return results;
}
