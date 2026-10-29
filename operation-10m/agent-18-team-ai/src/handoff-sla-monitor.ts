import { AGENT18_LIMITS, CoordinationPlan, HandoffRequest } from './types.ts';

export interface HandoffSlaPolicy {
  maxPendingTurns: number;
}

export interface HandoffSlaReport {
  pendingCount: number;
  overdueHandoffIds: string[];
  complianceScore: number;
  notes: string[];
}

const DEFAULT_HANDOFF_SLA: HandoffSlaPolicy = {
  maxPendingTurns: 2,
};

/**
 * Score pending handoffs against a turn budget; overdue ids can drive audit/diagnostics.
 */
export function evaluateHandoffSla(
  turn: number,
  handoffs: HandoffRequest[],
  policy: Partial<HandoffSlaPolicy> = {},
): HandoffSlaReport {
  const maxPending = policy.maxPendingTurns ?? DEFAULT_HANDOFF_SLA.maxPendingTurns;
  const pending = handoffs.filter(h => h.status === 'pending').slice(0, AGENT18_LIMITS.maxHandoffs);
  const overdueHandoffIds: string[] = [];
  const notes: string[] = [];

  pending.forEach(h => {
    const age = turn - h.requestedTurn;
    if (age > maxPending) {
      overdueHandoffIds.push(h.id);
      notes.push(`Handoff ${h.id} overdue (${age} turns pending, max ${maxPending})`);
    }
  });

  const complianceScore =
    pending.length === 0
      ? 100
      : Math.max(0, Math.round(100 * (1 - overdueHandoffIds.length / pending.length)));

  return {
    pendingCount: pending.length,
    overdueHandoffIds,
    complianceScore,
    notes,
  };
}

export function handoffSlaAuditMessages(report: HandoffSlaReport): string[] {
  return report.overdueHandoffIds.map(id => `Handoff SLA breach: ${id} exceeded pending turn budget`);
}

export function summarizeDualTeamHandoffSla(
  friendlyTeamId: string,
  friendly: HandoffSlaReport,
  enemyTeamId: string | null,
  enemy: HandoffSlaReport | null,
): { combinedCompliance: number; teamReports: Record<string, HandoffSlaReport> } {
  if (!enemy || !enemyTeamId) {
    return {
      combinedCompliance: friendly.complianceScore,
      teamReports: { [friendlyTeamId]: friendly },
    };
  }
  const combinedCompliance = Math.round((friendly.complianceScore + enemy.complianceScore) / 2);
  return {
    combinedCompliance,
    teamReports: { [friendlyTeamId]: friendly, [enemyTeamId]: enemy },
  };
}

export function handoffsFromPlan(plan: CoordinationPlan): HandoffRequest[] {
  return plan.handoffs;
}
