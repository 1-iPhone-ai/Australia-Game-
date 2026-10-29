export interface CoordinationRecoveryInputs {
  escalationTier: number;
  coordinationCompositeScore: number;
  coordinationWeakestDimension?: string;
  directiveCollisionIndex?: number;
  handoffIntegrityScore?: number;
}

export interface CoordinationRecoveryPlaybook {
  recoveryUrgency: number;
  recommendedActions: string[];
  notes: string[];
}

const DIMENSION_ACTIONS: Record<string, string[]> = {
  handoffSla: ['flush_overdue_handoffs', 'reassign_handoff_targets'],
  handoffReadiness: ['defer_not_ready_handoffs', 'boost_target_ap'],
  mutexStability: ['freeze_mutex_reassign', 'extend_region_leases'],
  workstreamBarriers: ['split_stalled_workstreams', 'drop_barrier_dependencies'],
  capacityBalance: ['rebalance_task_load', 'idle_actor_pickup'],
  leaseHealth: ['renew_expiring_leases', 'revoke_expired_leases'],
  roleChurn: ['extend_role_locks', 'stabilize_primary_assignments'],
};

/**
 * Operator recovery playbook from escalation tier and weakest composite dimension.
 */
export function buildCoordinationRecoveryPlaybook(
  inputs: CoordinationRecoveryInputs,
): CoordinationRecoveryPlaybook {
  const notes: string[] = [];
  const actions: string[] = [];
  const tier = Math.max(0, Math.min(3, inputs.escalationTier));
  const collision = inputs.directiveCollisionIndex ?? 0;
  const integrity = inputs.handoffIntegrityScore ?? 100;

  if (tier >= 3) {
    actions.push('halt_noncritical_directives', 'operator_review_required');
    notes.push('Critical escalation — halt discretionary teammate directives');
  } else if (tier >= 2) {
    actions.push('reduce_directive_quota', 'serialize_region_mutex');
    notes.push('Elevated escalation — throttle parallel directives');
  } else if (tier >= 1) {
    actions.push('monitor_coordination_dashboard');
    notes.push('Watch-tier escalation — increase observation cadence');
  }

  const weakest = inputs.coordinationWeakestDimension;
  if (weakest && DIMENSION_ACTIONS[weakest]) {
    actions.push(...DIMENSION_ACTIONS[weakest].slice(0, 2));
    notes.push(`Weakest dimension ${weakest} — targeted recovery steps appended`);
  }

  if (collision >= 40) {
    actions.push('dedupe_colliding_directives');
    notes.push('High directive collision — dedupe before commit');
  }
  if (integrity < 70) {
    actions.push('repair_handoff_chain');
    notes.push('Low handoff integrity — repair pending chain');
  }

  const compositeGap = Math.max(0, 100 - inputs.coordinationCompositeScore);
  const tierBoost = tier * 18;
  const signalBoost = Math.round(collision * 0.25 + Math.max(0, 70 - integrity) * 0.5);
  const recoveryUrgency = Math.round(Math.min(100, compositeGap * 0.45 + tierBoost + signalBoost));

  return {
    recoveryUrgency,
    recommendedActions: [...new Set(actions)].slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamRecoveryUrgency(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
