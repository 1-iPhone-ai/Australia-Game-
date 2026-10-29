import { formatBackpressureRemediationLine } from './automation-backpressure-remediation.js';
import { evaluateBackpressureAlertsFromSlices } from './automation-backpressure-alerts.js';
import { planBackpressureRemediation } from './automation-backpressure-remediation.js';
import { createDefaultIdleDeescalationState } from './automation-idle-deescalation.js';
import type { O10IdleOpsGovernanceResult } from './automation-idle-ops-governance.js';
import { createEmptyAutomationIntentQueue } from './automation-intent-queue.js';
import { formatStewardIdleCoordinationLine } from './automation-steward-idle-coordination.js';
import { formatIdleOpsWindowSummaryLine } from './automation-idle-ops-window.js';
import { createDefaultAutonomousIdleNationalPersisted } from './national-steward.js';
import type { O10SelfTestResult } from './types.js';

export interface O10IdleGovernanceReportSections {
  schema: '10m.agent20.idle-governance-report.v1';
  headline: string;
  markdown: string;
}

/** Build co-pilot / dashboard markdown for an idle ops governance pass. */
export function buildIdleGovernanceReport(
  governance: O10IdleOpsGovernanceResult
): O10IdleGovernanceReportSections {
  const alert = evaluateBackpressureAlertsFromSlices(governance.window.telemetry);
  const remediation = planBackpressureRemediation(alert);
  const headline = `idle_governance alert=${governance.alertLevel} peak=t${governance.window.summary.peakEffectiveTier}`;

  const lines = [
    '## Agent 20 idle ops governance',
    '',
    `- ${formatIdleOpsWindowSummaryLine(governance.window.summary)}`,
    `- alert=${alert.level} defer=${alert.deferRatio.toFixed(2)}`,
    `- ${formatBackpressureRemediationLine(remediation)}`,
    `- ${formatStewardIdleCoordinationLine(governance.steward)}`,
    '',
    governance.summaryLine,
    '',
  ];

  return {
    schema: '10m.agent20.idle-governance-report.v1',
    headline,
    markdown: lines.join('\n'),
  };
}

export function runO10Agent20IdleGovernanceReportSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const stewardBase = createDefaultAutonomousIdleNationalPersisted();
  const mock: O10IdleOpsGovernanceResult = {
    schema: '10m.agent20.idle-ops-governance.v1',
    alertLevel: 'warn',
    remediationStepCount: 2,
    summaryLine: 'ops_window turns=3 alert=warn remediation=2 steward_throttle=true',
    steward: {
      persisted: {
        ...stewardBase,
        operatingMode: 'recommend',
        automationPath: 'v94_idle_steward_soft_nudge',
      },
      throttled: true,
      reason: 'idle_ops_tier2_throttle_autonomy',
    },
    window: {
      queue: createEmptyAutomationIntentQueue(8),
      deescalationState: createDefaultIdleDeescalationState(),
      telemetry: [
        {
          turn: 1,
          day: 1,
          tier: 2,
          effectiveMaxDepth: 6,
          deferLowPriorityBelow: 4,
          decision: 'defer',
          droppedLowPriority: 0,
        },
      ],
      summary: {
        schema: '10m.agent20.idle-ops-window.v1',
        turnsRun: 3,
        humanCommitCount: 0,
        peakEffectiveTier: 2,
        finalScheduleAction: 'defer',
        digestSummary: 'defer=1/1',
      },
      lastTurn: {
        queue: createEmptyAutomationIntentQueue(8),
        deescalationState: createDefaultIdleDeescalationState(),
        telemetry: [],
        effectiveTier: 2,
        scheduleAction: 'defer',
        digestSummary: 'defer=1/1',
      },
    },
  };

  const report = buildIdleGovernanceReport(mock);
  push('gov_report_md', 'markdown includes governance header', report.markdown.includes('## Agent 20 idle ops governance'));
  push('gov_report_headline', 'headline encodes alert and peak tier', report.headline.includes('alert=warn') && report.headline.includes('peak=t2'));
  push('gov_report_schema', 'report schema marker', report.schema === '10m.agent20.idle-governance-report.v1');
  push('gov_report_steward', 'markdown includes steward coordination line', report.markdown.includes('steward_idle throttle=true'));

  return results;
}
