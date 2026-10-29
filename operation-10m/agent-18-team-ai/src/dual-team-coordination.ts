import { evaluateTeamMultiAgentLayer } from './multi-agent-state.ts';
import {
  auditCrossTeamMutexIsolation,
  assertTasksTeamScoped,
  teamActorScope,
} from './team-boundary-guard.ts';
import {
  TeamMultiAgentEvaluation,
  TeamMultiAgentInputs,
  TeamMultiAgentLayerState,
} from './types.ts';

export interface DualTeamMultiAgentResult {
  friendly: TeamMultiAgentEvaluation;
  enemy: TeamMultiAgentEvaluation | null;
  isolationIssues: string[];
  byTeam: Record<string, TeamMultiAgentLayerState>;
}

/**
 * Evaluate friendly + optional enemy team layers with cross-team isolation checks.
 * Planning-only: each team keeps its own mutex namespace (no shared state mutation).
 */
export function evaluateDualTeamMultiAgentLayers(
  friendlyInputs: TeamMultiAgentInputs,
  enemyInputs: TeamMultiAgentInputs | null,
  storedByTeam: Record<string, TeamMultiAgentLayerState | null> = {},
): DualTeamMultiAgentResult {
  const friendlyScope = teamActorScope(friendlyInputs);
  const boundaryIssues = assertTasksTeamScoped(friendlyInputs, friendlyScope);
  const friendlyProposals = friendlyInputs.directiveProposals || [];
  const friendly = evaluateTeamMultiAgentLayer(
    {
      ...friendlyInputs,
      directiveProposals: friendlyProposals,
    },
    storedByTeam[friendlyInputs.teamId] ?? null,
  );
  friendly.coordinationIssues.push(...boundaryIssues);

  if (!enemyInputs) {
    return {
      friendly,
      enemy: null,
      isolationIssues: boundaryIssues,
      byTeam: { [friendlyInputs.teamId]: friendly.state },
    };
  }

  const enemyScope = teamActorScope(enemyInputs);
  const enemyBoundary = assertTasksTeamScoped(enemyInputs, enemyScope);
  const enemy = evaluateTeamMultiAgentLayer(enemyInputs, storedByTeam[enemyInputs.teamId] ?? null);
  enemy.coordinationIssues.push(...enemyBoundary);

  const mutexIssues = auditCrossTeamMutexIsolation(
    friendly.state.coordination.mutexRegions,
    enemy.state.coordination.mutexRegions,
  );

  const crossActorIssues: string[] = [];
  if ([...friendlyScope].some(id => enemyScope.has(id))) {
    crossActorIssues.push('Friendly and enemy teams share actor ids — invalid isolation');
  }

  const isolationIssues = [...boundaryIssues, ...enemyBoundary, ...mutexIssues, ...crossActorIssues];

  return {
    friendly,
    enemy,
    isolationIssues,
    byTeam: {
      [friendlyInputs.teamId]: friendly.state,
      [enemyInputs.teamId]: enemy.state,
    },
  };
}
