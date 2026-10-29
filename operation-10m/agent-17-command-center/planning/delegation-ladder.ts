import type {
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Agent17DelegationAnalyticsRow,
  Agent17DelegationLadderRung,
  Agent17DelegationLadderSnapshot,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

const MAX_CONCURRENT_BY_KIND: Record<Acc17DelegateTargetKind, number> = {
  copilot: 2,
  team_os: 2,
  teammate: 3,
  strategy_planner: 2,
  manual: 1,
};

const PREFERRED_AUTHORITY_BY_KIND: Record<
  Acc17DelegateTargetKind,
  Acc17DelegatedProject['authorityCeiling']
> = {
  copilot: 'assisted',
  team_os: 'delegated',
  teammate: 'assisted',
  strategy_planner: 'advisory',
  manual: 'advisory',
};

const ESCALATION_CHAIN: Partial<Record<Acc17DelegateTargetKind, Acc17DelegateTargetKind>> = {
  strategy_planner: 'copilot',
  copilot: 'team_os',
  teammate: 'copilot',
  manual: 'copilot',
};

export function buildAgent17DelegationLadder(
  analytics: Agent17DelegationAnalyticsRow[],
  settings: Agent17SettingsSlice,
  recommendedKind: Acc17DelegateTargetKind
): Agent17DelegationLadderSnapshot {
  const autonomy = settings.aiCommunicationAutonomyLevel ?? 'assisted';
  const rungs: Agent17DelegationLadderRung[] = analytics.map(row => {
    const maxConcurrent = MAX_CONCURRENT_BY_KIND[row.delegateKind];
    const loadScore = row.activeProjects * 10 + row.blockedProjects * 25;
    let preferredAuthority = PREFERRED_AUTHORITY_BY_KIND[row.delegateKind];
    if (autonomy === 'advisory' && preferredAuthority === 'delegated') {
      preferredAuthority = 'assisted';
    }
    if (autonomy === 'delegated' && row.delegateKind === 'team_os') {
      preferredAuthority = 'delegated';
    }
    return {
      delegateKind: row.delegateKind,
      loadScore,
      maxConcurrent,
      slotsRemaining: Math.max(0, maxConcurrent - row.activeProjects),
      preferredAuthority,
      escalationTarget: ESCALATION_CHAIN[row.delegateKind],
    };
  });

  const totalActiveLoad = analytics.reduce((sum, r) => sum + r.activeProjects, 0);
  const recommendedRung =
    rungs.find(r => r.delegateKind === recommendedKind) ??
    rungs.find(r => r.slotsRemaining > 0) ??
    rungs[0];
  let recommendedKindResolved = recommendedKind;
  if (recommendedRung && recommendedRung.slotsRemaining === 0 && recommendedRung.escalationTarget) {
    const esc = rungs.find(r => r.delegateKind === recommendedRung.escalationTarget);
    if (esc && esc.slotsRemaining > 0) recommendedKindResolved = esc.delegateKind;
  }

  const loads = rungs.map(r => r.loadScore);
  const maxLoad = Math.max(...loads, 0);
  const minLoad = Math.min(...loads, 0);
  const imbalanceFlag = maxLoad - minLoad >= 40 && totalActiveLoad >= 2;

  const headline = imbalanceFlag
    ? `Delegation imbalance — favor ${recommendedKindResolved} (${recommendedRung?.slotsRemaining ?? 0} slots)`
    : `Delegation ladder balanced — next ${recommendedKindResolved}`;

  return {
    rungs,
    recommendedKind: recommendedKindResolved,
    totalActiveLoad,
    imbalanceFlag,
    headline,
  };
}

export function pickAuthorityCeilingForDelegateKind(
  kind: Acc17DelegateTargetKind,
  settings: Agent17SettingsSlice
): Acc17DelegatedProject['authorityCeiling'] {
  const ladder = buildAgent17DelegationLadder(
    kind === 'copilot'
      ? [{ delegateKind: 'copilot', activeProjects: 0, completedProjects: 0, blockedProjects: 0, authorityMix: {} }]
      : [{ delegateKind: kind, activeProjects: 0, completedProjects: 0, blockedProjects: 0, authorityMix: {} }],
    settings,
    kind
  );
  return ladder.rungs[0]?.preferredAuthority ?? 'assisted';
}

export function delegationLadderHasCapacity(
  ladder: Agent17DelegationLadderSnapshot,
  kind: Acc17DelegateTargetKind
): boolean {
  const rung = ladder.rungs.find(r => r.delegateKind === kind);
  return (rung?.slotsRemaining ?? 0) > 0;
}
