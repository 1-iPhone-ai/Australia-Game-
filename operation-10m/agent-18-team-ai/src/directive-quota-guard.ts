import { AGENT18_LIMITS, TeammateDirectiveProposal } from './types.ts';

export interface DirectiveQuotaPolicy {
  maxPerActorPerTurn: number;
  maxPerTeamPerTurn: number;
}

export interface DirectiveQuotaReport {
  allowed: TeammateDirectiveProposal[];
  dropped: Array<{ proposal: TeammateDirectiveProposal; reason: string }>;
  remainingByActor: Record<string, number>;
}

const DEFAULT_QUOTA: DirectiveQuotaPolicy = {
  maxPerActorPerTurn: 3,
  maxPerTeamPerTurn: 8,
};

/**
 * Enforce per-actor and team-wide directive proposal caps before coordination filtering.
 */
export function applyDirectiveQuotaGuard(
  proposals: TeammateDirectiveProposal[],
  policy: Partial<DirectiveQuotaPolicy> = {},
): DirectiveQuotaReport {
  const maxActor = policy.maxPerActorPerTurn ?? DEFAULT_QUOTA.maxPerActorPerTurn;
  const maxTeam = policy.maxPerTeamPerTurn ?? DEFAULT_QUOTA.maxPerTeamPerTurn;
  const sorted = [...proposals].sort((a, b) => a.priority - b.priority || a.id.localeCompare(b.id));
  const allowed: TeammateDirectiveProposal[] = [];
  const dropped: DirectiveQuotaReport['dropped'] = [];
  const perActor: Record<string, number> = {};
  const remainingByActor: Record<string, number> = {};

  sorted.forEach(p => {
    perActor[p.actorId] = perActor[p.actorId] ?? 0;
    if (allowed.length >= maxTeam) {
      dropped.push({ proposal: p, reason: 'team_quota_exceeded' });
      return;
    }
    if (perActor[p.actorId] >= maxActor) {
      dropped.push({ proposal: p, reason: 'actor_quota_exceeded' });
      return;
    }
    allowed.push(p);
    perActor[p.actorId] += 1;
  });

  Object.keys(perActor).forEach(actorId => {
    remainingByActor[actorId] = Math.max(0, maxActor - perActor[actorId]);
  });

  return {
    allowed: allowed.slice(0, AGENT18_LIMITS.maxSuppressedDirectives),
    dropped: dropped.slice(0, AGENT18_LIMITS.maxSuppressedDirectives),
    remainingByActor,
  };
}

export function mergeQuotaDroppedIntoSuppressed(
  quota: DirectiveQuotaReport,
): string[] {
  return quota.dropped.map(d => d.proposal.id);
}
