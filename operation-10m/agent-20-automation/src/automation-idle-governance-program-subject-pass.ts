import { runIdleGovernanceProgramExecutivePass } from './automation-idle-governance-program-executive-pass.js';
import {
  createEmptyIdleGovernanceProgramRegistry,
  type O10IdleGovernanceProgramRegistry,
} from './automation-idle-governance-program-registry.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export type O10IdleGovernanceProgramSubjectClearance = 'cleared' | 'conditional' | 'blocked';

export interface O10IdleGovernanceProgramSubjectPassResult {
  schema: '10m.agent20.idle-governance-program-subject-pass.v1';
  executive: ReturnType<typeof runIdleGovernanceProgramExecutivePass>;
  clearance: O10IdleGovernanceProgramSubjectClearance;
  subjectMarkdown: string;
  summaryLine: string;
}

function mapBoardDecisionToSubjectClearance(
  decision: ReturnType<typeof runIdleGovernanceProgramExecutivePass>['board']['decision']
): O10IdleGovernanceProgramSubjectClearance {
  if (decision === 'certify') return 'cleared';
  if (decision === 'hold') return 'conditional';
  return 'blocked';
}

export function buildIdleGovernanceProgramSubjectMarkdown(
  executive: ReturnType<typeof runIdleGovernanceProgramExecutivePass>,
  clearance: O10IdleGovernanceProgramSubjectClearance
): string {
  return [
    '# Agent 20 idle governance subject pass',
    '',
    `- clearance=${clearance}`,
    `- board_decision=${executive.board.decision}`,
    '',
    executive.executiveMarkdown,
  ].join('\n');
}

/** Round-17 subject pass: executive stack mapped to subject clearance lanes. */
export function runIdleGovernanceProgramSubjectPass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  startTurn: number,
  requestedCycles: number,
  priorRegistry: O10IdleGovernanceProgramRegistry = createEmptyIdleGovernanceProgramRegistry()
): O10IdleGovernanceProgramSubjectPassResult {
  const executive = runIdleGovernanceProgramExecutivePass(spec, rule, startTurn, requestedCycles, priorRegistry);
  const clearance = mapBoardDecisionToSubjectClearance(executive.board.decision);
  const subjectMarkdown = buildIdleGovernanceProgramSubjectMarkdown(executive, clearance);

  const summaryLine = [
    'gov_program_subject',
    `clearance=${clearance}`,
    executive.board.summaryLine,
    executive.summaryLine,
  ].join(' | ');

  return {
    schema: '10m.agent20.idle-governance-program-subject-pass.v1',
    executive,
    clearance,
    subjectMarkdown,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceProgramSubjectPassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'subj1',
    name: 'Subject pass',
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

  const subject = runIdleGovernanceProgramSubjectPass(calmSpec, sampleRule, 1, 3);
  push(
    'gov_prog_subject_calm',
    'calm subject pass chains executive and markdown',
    subject.subjectMarkdown.includes('subject pass') &&
      subject.executive.director.registryRollup.entryCount === 1 &&
      subject.clearance.length > 0
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
  const subject2 = runIdleGovernanceProgramSubjectPass(
    stressSpec,
    sampleRule,
    5,
    4,
    subject.executive.director.operations.registry
  );
  push(
    'gov_prog_subject_chain',
    'chained subject pass accumulates registry',
    subject2.executive.director.registryRollup.entryCount === 2 &&
      subject2.summaryLine.includes('gov_program_subject')
  );

  push(
    'gov_prog_subject_schema',
    'subject pass schema marker',
    subject.schema === '10m.agent20.idle-governance-program-subject-pass.v1'
  );

  return results;
}
