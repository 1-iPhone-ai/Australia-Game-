import { TeammateDirectiveProposal, TeamMultiAgentInputs } from './types.ts';

/** Actor ids allowed for this team's coordination slice (defaults to input actors). */
export function teamActorScope(inputs: TeamMultiAgentInputs, explicitIds?: string[]): Set<string> {
  if (explicitIds?.length) return new Set(explicitIds.map(String));
  return new Set(inputs.actors.map(a => a.id));
}

export function filterCrossTeamDirectives(
  proposals: TeammateDirectiveProposal[],
  scope: Set<string>,
): { inTeam: TeammateDirectiveProposal[]; rejected: Array<{ proposal: TeammateDirectiveProposal; reason: string }> } {
  const inTeam: TeammateDirectiveProposal[] = [];
  const rejected: Array<{ proposal: TeammateDirectiveProposal; reason: string }> = [];
  proposals.forEach(p => {
    if (scope.has(p.actorId)) inTeam.push(p);
    else rejected.push({ proposal: p, reason: `cross_team_actor_${p.actorId}` });
  });
  return { inTeam, rejected };
}

export function assertTasksTeamScoped(
  inputs: TeamMultiAgentInputs,
  scope: Set<string>,
): string[] {
  const issues: string[] = [];
  inputs.tasks.forEach(t => {
    t.assignedActorIds.forEach(id => {
      if (!scope.has(id)) {
        issues.push(`Task ${t.id} assigns out-of-team actor ${id}`);
      }
    });
  });
  return issues;
}

export function regionsMutexDisjoint(
  a: Record<string, string>,
  b: Record<string, string>,
): boolean {
  return !Object.keys(a).some(regionId => b[regionId] !== undefined);
}

/** Enemy/friendly plans must not share mutex keys with different holders (isolation). */
export function auditCrossTeamMutexIsolation(
  friendlyMutex: Record<string, string>,
  enemyMutex: Record<string, string>,
): string[] {
  if (regionsMutexDisjoint(friendlyMutex, enemyMutex)) return [];
  const overlaps = Object.keys(friendlyMutex).filter(r => enemyMutex[r] !== undefined);
  return overlaps.map(
    r =>
      `Cross-team mutex overlap on ${r} (friendly ${friendlyMutex[r]}, enemy ${enemyMutex[r]}) — expected disjoint team planning namespaces`,
  );
}
