import { AGENT18_LIMITS, CoordinationLease } from './types.ts';

export interface LeaseExpiryReport {
  leaseHealthScore: number;
  expiringLeaseIds: string[];
  expiredLeaseIds: string[];
  notes: string[];
}

export interface LeaseExpiryPolicy {
  warnTurnsBeforeExpiry: number;
}

const DEFAULT_POLICY: LeaseExpiryPolicy = {
  warnTurnsBeforeExpiry: 1,
};

/**
 * Score lease portfolio health: expired leases and those expiring within a turn window.
 */
export function evaluateLeaseExpiry(
  turn: number,
  leases: CoordinationLease[],
  policy: Partial<LeaseExpiryPolicy> = {},
): LeaseExpiryReport {
  const warnWindow = policy.warnTurnsBeforeExpiry ?? DEFAULT_POLICY.warnTurnsBeforeExpiry;
  const scoped = leases.slice(0, AGENT18_LIMITS.maxLeases);
  const expiringLeaseIds: string[] = [];
  const expiredLeaseIds: string[] = [];
  const notes: string[] = [];

  scoped.forEach(lease => {
    if (lease.expiresTurn === null) return;
    if (lease.expiresTurn < turn) {
      expiredLeaseIds.push(lease.id);
      notes.push(`Lease ${lease.id} expired at turn ${lease.expiresTurn}`);
      return;
    }
    const remaining = lease.expiresTurn - turn;
    if (remaining <= warnWindow) {
      expiringLeaseIds.push(lease.id);
      notes.push(`Lease ${lease.id} expires in ${remaining} turn(s)`);
    }
  });

  const problemCount = expiredLeaseIds.length + expiringLeaseIds.length;
  const leaseHealthScore =
    scoped.length === 0
      ? 100
      : Math.max(0, Math.round(100 * (1 - problemCount / Math.max(1, scoped.length))));

  return {
    leaseHealthScore,
    expiringLeaseIds: expiringLeaseIds.slice(0, 8),
    expiredLeaseIds: expiredLeaseIds.slice(0, 8),
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamLeaseHealth(
  friendly: LeaseExpiryReport,
  enemy: LeaseExpiryReport | null,
): number {
  if (!enemy) return friendly.leaseHealthScore;
  return Math.round((friendly.leaseHealthScore + enemy.leaseHealthScore) / 2);
}
