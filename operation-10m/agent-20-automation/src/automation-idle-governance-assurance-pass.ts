import { createEmptyIdleGovernanceAuditTrail } from './automation-idle-governance-audit-trail.js';
import { analyzeIdleGovernanceAuditTrend } from './automation-idle-governance-audit-trend.js';
import { attestIdleGovernanceComplianceCycle } from './automation-idle-governance-cycle-attestation.js';
import { buildIdleGovernanceCopilotBriefFromCycle } from './automation-idle-governance-copilot-brief.js';
import { evaluateIdleGovernanceEscalationLadder } from './automation-idle-governance-escalation-ladder.js';
import {
  runIdleGovernanceComplianceCycle,
  type O10IdleGovernanceComplianceCycleResult,
} from './automation-idle-governance-reconciliation.js';
import type { O10IdleOpsWindowSpec } from './automation-idle-ops-window.js';
import type { O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleGovernanceWatchSchedule {
  schema: '10m.agent20.idle-governance-watch-schedule.v1';
  turnsUntilNextCycle: number;
  urgency: 'low' | 'medium' | 'high';
  reason: string;
}

export interface O10IdleGovernanceAssurancePassResult {
  schema: '10m.agent20.idle-governance-assurance-pass.v1';
  cycle: O10IdleGovernanceComplianceCycleResult;
  briefMarkdown: string;
  attestationFingerprint: string;
  trendDirection: string;
  watch: O10IdleGovernanceWatchSchedule;
  summaryLine: string;
}

export function planIdleGovernanceWatchSchedule(
  escalationLevel: number,
  trendDirection: string
): O10IdleGovernanceWatchSchedule {
  if (escalationLevel >= 3 || trendDirection === 'degrading') {
    return {
      schema: '10m.agent20.idle-governance-watch-schedule.v1',
      turnsUntilNextCycle: 1,
      urgency: 'high',
      reason: 'escalation_or_degrading_trend',
    };
  }
  if (escalationLevel >= 1 || trendDirection === 'stable') {
    return {
      schema: '10m.agent20.idle-governance-watch-schedule.v1',
      turnsUntilNextCycle: 3,
      urgency: 'medium',
      reason: 'elevated_escalation_or_stable_band',
    };
  }
  return {
    schema: '10m.agent20.idle-governance-watch-schedule.v1',
    turnsUntilNextCycle: 6,
    urgency: 'low',
    reason: 'calm_improving_band',
  };
}

/** Round-11 assurance pass: compliance cycle + brief + attestation + trend + watch cadence. */
export function runIdleGovernanceAssurancePass(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  turn: number
): O10IdleGovernanceAssurancePassResult {
  const priorTrail = createEmptyIdleGovernanceAuditTrail();
  const cycle = runIdleGovernanceComplianceCycle(spec, rule, turn, priorTrail);
  const brief = buildIdleGovernanceCopilotBriefFromCycle(cycle);
  const attestation = attestIdleGovernanceComplianceCycle(cycle, turn);
  const trend = analyzeIdleGovernanceAuditTrend(cycle.pass.auditTrail);
  const ladder = evaluateIdleGovernanceEscalationLadder(cycle.pass.auditTrail);
  const watch = planIdleGovernanceWatchSchedule(ladder.level, trend.direction);

  const summaryLine = [
    'gov_assurance',
    `attest=${attestation.valid}`,
    trend.summaryLine,
    `watch_in=${watch.turnsUntilNextCycle}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-governance-assurance-pass.v1',
    cycle,
    briefMarkdown: brief.markdown,
    attestationFingerprint: attestation.fingerprint,
    trendDirection: trend.direction,
    watch,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceAssurancePassSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'as1',
    name: 'Assurance sample',
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

  const calm = runIdleGovernanceAssurancePass(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 2,
      humanCommittedEvery: 1,
      idleMsStart: 0,
      idleMsStep: 0,
      consecutiveIdleStart: 0,
    },
    sampleRule,
    1
  );
  push(
    'gov_assurance_calm',
    'calm assurance schedules low urgency watch',
    calm.watch.urgency === 'low' && calm.cycle.reconciliation.auditMatchesPass
  );

  const stress = runIdleGovernanceAssurancePass(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 6,
      humanCommittedEvery: 0,
      idleMsStart: 250_000,
      idleMsStep: 100_000,
      consecutiveIdleStart: 10,
    },
    sampleRule,
    2
  );
  push(
    'gov_assurance_stress',
    'stressed assurance yields brief and fingerprint',
    stress.briefMarkdown.includes('co-pilot brief') &&
      stress.attestationFingerprint.startsWith('fnv1a_') &&
      stress.watch.urgency !== 'low'
  );

  push(
    'gov_assurance_schema',
    'assurance pass schema marker',
    calm.schema === '10m.agent20.idle-governance-assurance-pass.v1' &&
      calm.watch.schema === '10m.agent20.idle-governance-watch-schedule.v1'
  );

  push(
    'gov_assurance_summary',
    'summary bundles attestation and watch',
    calm.summaryLine.includes('gov_assurance') && calm.summaryLine.includes('watch_in=')
  );

  return results;
}
