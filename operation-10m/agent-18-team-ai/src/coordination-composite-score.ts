export interface CoordinationCompositeInputs {
  handoffSlaCompliance: number;
  handoffReadinessAverage: number;
  mutexStabilityIndex: number;
  workstreamBarrierCompliance: number;
  capacityBalanceScore?: number;
  leaseHealthScore?: number;
  roleChurnIndex?: number;
}

export interface CoordinationCompositeReport {
  compositeScore: number;
  weakestDimension: string;
  notes: string[];
}

const WEIGHTS = {
  handoffSla: 0.18,
  handoffReadiness: 0.16,
  mutexStability: 0.2,
  workstreamBarrier: 0.16,
  capacityBalance: 0.12,
  leaseHealth: 0.1,
  roleChurn: 0.08,
} as const;

function clampScore(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return fallback;
  return Math.max(0, Math.min(100, value));
}

/**
 * Weighted rollup of round-4/5/6 coordination metrics for dashboards and dual-team summaries.
 */
export function computeCoordinationComposite(
  inputs: CoordinationCompositeInputs,
): CoordinationCompositeReport {
  const sla = clampScore(inputs.handoffSlaCompliance, 100);
  const readiness = clampScore(inputs.handoffReadinessAverage, 100);
  const mutex = clampScore(inputs.mutexStabilityIndex, 100);
  const barrier = clampScore(inputs.workstreamBarrierCompliance, 100);
  const capacity = clampScore(inputs.capacityBalanceScore, 100);
  const lease = clampScore(inputs.leaseHealthScore, 100);
  const churnPenalty = clampScore(inputs.roleChurnIndex, 0);
  const roleStability = 100 - churnPenalty;

  const dimensions: Array<{ key: string; score: number; weight: number }> = [
    { key: 'handoff_sla', score: sla, weight: WEIGHTS.handoffSla },
    { key: 'handoff_readiness', score: readiness, weight: WEIGHTS.handoffReadiness },
    { key: 'mutex_stability', score: mutex, weight: WEIGHTS.mutexStability },
    { key: 'workstream_barrier', score: barrier, weight: WEIGHTS.workstreamBarrier },
    { key: 'capacity_balance', score: capacity, weight: WEIGHTS.capacityBalance },
    { key: 'lease_health', score: lease, weight: WEIGHTS.leaseHealth },
    { key: 'role_stability', score: roleStability, weight: WEIGHTS.roleChurn },
  ];

  const compositeScore = Math.round(
    dimensions.reduce((sum, d) => sum + d.score * d.weight, 0),
  );

  const weakest = dimensions.reduce((min, d) => (d.score < min.score ? d : min), dimensions[0]);
  const notes: string[] = [];
  if (weakest.score < 60) {
    notes.push(`Weakest coordination dimension: ${weakest.key} (${weakest.score})`);
  }
  if (compositeScore < 70) {
    notes.push(`Coordination composite below target (${compositeScore}/100)`);
  }

  return {
    compositeScore,
    weakestDimension: weakest.key,
    notes: notes.slice(0, 4),
  };
}

export function combineDualTeamCoordinationComposite(
  friendly: number,
  enemy: number | null,
): number {
  if (enemy === null) return friendly;
  return Math.round((friendly + enemy) / 2);
}
