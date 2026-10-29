import { evaluateBackpressureAlertsFromSlices } from './automation-backpressure-alerts.js';
import { planBackpressureRemediation } from './automation-backpressure-remediation.js';
import {
  formatIdleOpsWindowSummaryLine,
  runIdleAutomationOpsWindow,
  type O10IdleOpsWindowResult,
  type O10IdleOpsWindowSpec,
} from './automation-idle-ops-window.js';
import {
  coordinateNationalStewardWithIdleOpsTier,
  type O10StewardIdleCoordinationResult,
} from './automation-steward-idle-coordination.js';
import { createDefaultAutonomousIdleNationalPersisted } from './national-steward.js';
import type { NationalStewardPersisted, O10SelfTestResult, PortableHumanAutomationRule } from './types.js';

export interface O10IdleOpsGovernanceResult {
  schema: '10m.agent20.idle-ops-governance.v1';
  window: O10IdleOpsWindowResult;
  alertLevel: string;
  remediationStepCount: number;
  steward: O10StewardIdleCoordinationResult;
  summaryLine: string;
}

/** Run idle ops window, classify backpressure, plan remediation, and align national steward to peak tier. */
export function runIdleAutomationOpsGovernance(
  spec: O10IdleOpsWindowSpec,
  rule: PortableHumanAutomationRule,
  stewardPersisted: NationalStewardPersisted = createDefaultAutonomousIdleNationalPersisted()
): O10IdleOpsGovernanceResult {
  const window = runIdleAutomationOpsWindow(spec, rule);
  const alert = evaluateBackpressureAlertsFromSlices(window.telemetry);
  const remediation = planBackpressureRemediation(alert);
  const steward = coordinateNationalStewardWithIdleOpsTier(
    stewardPersisted,
    window.summary.peakEffectiveTier,
    spec.startTurn + Math.max(0, spec.turnCount - 1)
  );

  const summaryLine = [
    formatIdleOpsWindowSummaryLine(window.summary),
    `alert=${alert.level}`,
    `remediation=${remediation.steps.length}`,
    `steward_throttle=${steward.throttled}`,
  ].join(' ');

  return {
    schema: '10m.agent20.idle-ops-governance.v1',
    window,
    alertLevel: alert.level,
    remediationStepCount: remediation.steps.length,
    steward,
    summaryLine,
  };
}

export function runO10Agent20IdleOpsGovernanceSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const sampleRule: PortableHumanAutomationRule = {
    id: 'gov1',
    name: 'Gov sample',
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

  const calm = runIdleAutomationOpsGovernance(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 2,
      humanCommittedEvery: 1,
      idleMsStart: 0,
      idleMsStep: 0,
      consecutiveIdleStart: 0,
    },
    sampleRule
  );
  push(
    'ops_gov_calm',
    'human cadence keeps alert none and steward nominal',
    calm.alertLevel === 'none' && calm.steward.throttled === false && calm.window.summary.peakEffectiveTier === 0
  );

  const stressed = runIdleAutomationOpsGovernance(
    {
      startTurn: 1,
      startDay: 1,
      turnCount: 6,
      humanCommittedEvery: 0,
      idleMsStart: 200_000,
      idleMsStep: 150_000,
      consecutiveIdleStart: 8,
    },
    sampleRule,
    { ...createDefaultAutonomousIdleNationalPersisted(), operatingMode: 'autonomous_idle' }
  );
  push(
    'ops_gov_stress',
    'stressed window escalates alert and may throttle steward',
    stressed.window.summary.peakEffectiveTier >= 2 &&
      (stressed.alertLevel === 'warn' || stressed.alertLevel === 'critical') &&
      stressed.remediationStepCount >= 2
  );

  push(
    'ops_gov_schema',
    'governance schema marker',
    calm.schema === '10m.agent20.idle-ops-governance.v1' && calm.summaryLine.includes('alert=')
  );

  push(
    'ops_gov_remediation',
    'critical alert yields more remediation steps than none',
    stressed.remediationStepCount > calm.remediationStepCount
  );

  return results;
}
