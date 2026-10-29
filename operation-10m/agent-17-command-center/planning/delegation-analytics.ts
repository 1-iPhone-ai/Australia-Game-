import type {
  Acc17CommandCenterOpsState,
  Acc17DelegateTargetKind,
  Acc17DelegatedProject,
  Agent17DelegationAnalyticsRow,
  Agent17SettingsSlice,
} from '../types/command-center-types.ts';

const DELEGATE_KINDS: Acc17DelegateTargetKind[] = [
  'copilot',
  'team_os',
  'teammate',
  'strategy_planner',
  'manual',
];

export function buildAgent17DelegationAnalytics(
  ops: Acc17CommandCenterOpsState,
  settings: Agent17SettingsSlice
): Agent17DelegationAnalyticsRow[] {
  const projects = ops.delegatedProjects || [];
  return DELEGATE_KINDS.map(delegateKind => {
    const rows = projects.filter(p => p.delegateKind === delegateKind);
    const authorityMix: Record<string, number> = {};
    for (const p of rows) {
      authorityMix[p.authorityCeiling] = (authorityMix[p.authorityCeiling] || 0) + 1;
    }
    const activeProjects = rows.filter(p =>
      ['delegated', 'executing', 'awaiting_verification'].includes(p.status)
    ).length;
    const completedProjects = rows.filter(p => p.status === 'completed').length;
    const blockedProjects = rows.filter(p => p.status === 'blocked').length;
    let recommendedAdjustment: string | undefined;
    const autonomy = settings.aiCommunicationAutonomyLevel;
    if (delegateKind === 'copilot' && autonomy === 'advisory' && activeProjects > 0) {
      recommendedAdjustment = 'Reduce copilot load while autonomy is advisory.';
    }
    if (delegateKind === 'team_os' && autonomy === 'delegated' && activeProjects === 0) {
      recommendedAdjustment = 'Consider team_os delegation under delegated autonomy.';
    }
    if (blockedProjects >= 2) {
      recommendedAdjustment = 'Multiple blocked delegations — replan or downgrade authority ceiling.';
    }
    return {
      delegateKind,
      activeProjects,
      completedProjects,
      blockedProjects,
      authorityMix,
      recommendedAdjustment,
    };
  });
}

export function pickAgent17DelegateKindFromAnalytics(
  rows: Agent17DelegationAnalyticsRow[],
  recommended: Acc17DelegateTargetKind
): Acc17DelegateTargetKind {
  const overloaded = rows.find(r => r.activeProjects >= 3 && r.delegateKind === recommended);
  if (overloaded) {
    const alt = rows.find(r => r.activeProjects === 0 && r.delegateKind !== 'manual');
    return alt?.delegateKind ?? recommended;
  }
  return recommended;
}

export function countAgent17ActiveDelegations(projects: Acc17DelegatedProject[]): number {
  return projects.filter(p =>
    ['delegated', 'executing', 'awaiting_verification'].includes(p.status)
  ).length;
}
