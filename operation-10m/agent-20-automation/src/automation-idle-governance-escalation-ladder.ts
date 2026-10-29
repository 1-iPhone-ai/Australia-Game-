import type { O10IdleGovernanceAuditTrail } from './automation-idle-governance-audit-trail.js';
import type { O10SelfTestResult } from './types.js';

export type O10IdleGovernanceEscalationLevel = 0 | 1 | 2 | 3;

export interface O10IdleGovernanceEscalationLadderResult {
  schema: '10m.agent20.idle-governance-escalation-ladder.v1';
  level: O10IdleGovernanceEscalationLevel;
  blockedStreak: number;
  criticalStreak: number;
  recommendedAction: string;
  summaryLine: string;
}

function isStressEntry(alertLevel: string, pendingHumanCommit: boolean): boolean {
  return alertLevel === 'critical' || (alertLevel === 'warn' && pendingHumanCommit);
}

/** Derive co-pilot escalation level from trailing audit entries. */
export function evaluateIdleGovernanceEscalationLadder(
  trail: O10IdleGovernanceAuditTrail
): O10IdleGovernanceEscalationLadderResult {
  let blockedStreak = 0;
  let criticalStreak = 0;

  for (let i = trail.entries.length - 1; i >= 0; i--) {
    const e = trail.entries[i];
    if (e.pendingHumanCommit && e.alertLevel !== 'none') {
      blockedStreak += 1;
    } else {
      break;
    }
  }

  for (let i = trail.entries.length - 1; i >= 0; i--) {
    const e = trail.entries[i];
    if (isStressEntry(e.alertLevel, e.pendingHumanCommit)) {
      criticalStreak += 1;
    } else {
      break;
    }
  }

  let level: O10IdleGovernanceEscalationLevel = 0;
  let recommendedAction = 'monitor';

  if (criticalStreak >= 3 || blockedStreak >= 3) {
    level = 3;
    recommendedAction = 'hard_pause_automation';
  } else if (blockedStreak >= 2 || criticalStreak >= 2) {
    level = 2;
    recommendedAction = 'surface_takeover_banner';
  } else if (blockedStreak >= 1 || criticalStreak >= 1) {
    level = 1;
    recommendedAction = 'nudge_human_commit';
  }

  const summaryLine = `gov_escalation level=${level} blocked_streak=${blockedStreak} critical_streak=${criticalStreak}`;

  return {
    schema: '10m.agent20.idle-governance-escalation-ladder.v1',
    level,
    blockedStreak,
    criticalStreak,
    recommendedAction,
    summaryLine,
  };
}

export function runO10Agent20IdleGovernanceEscalationLadderSelfTests(): O10SelfTestResult[] {
  const results: O10SelfTestResult[] = [];
  const push = (id: string, name: string, passed: boolean, detail?: string) =>
    results.push({ id, name, passed, detail });

  const empty = evaluateIdleGovernanceEscalationLadder({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [],
  });
  push('gov_esc_empty', 'empty trail is level 0', empty.level === 0 && empty.recommendedAction === 'monitor');

  const mk = (alert: string, pending: boolean, turn: number) => ({
    schema: '10m.agent20.idle-governance-audit.v1' as const,
    turn,
    alertLevel: alert,
    peakTier: 3 as const,
    appliedStepCount: 2,
    pendingHumanCommit: pending,
    fingerprint: `${alert}-${turn}`,
  });

  const oneBlocked = evaluateIdleGovernanceEscalationLadder({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk('critical', true, 1)],
  });
  push('gov_esc_nudge', 'single blocked entry nudges human', oneBlocked.level === 1);

  const streak = evaluateIdleGovernanceEscalationLadder({
    schema: '10m.agent20.idle-governance-audit-trail.v1',
    entries: [mk('warn', true, 1), mk('critical', true, 2), mk('critical', true, 3)],
  });
  push('gov_esc_hard', 'triple blocked streak hits level 3', streak.level === 3 && streak.blockedStreak === 3);

  push(
    'gov_esc_schema',
    'escalation ladder schema marker',
    streak.schema === '10m.agent20.idle-governance-escalation-ladder.v1' && streak.summaryLine.includes('level=3')
  );

  return results;
}
