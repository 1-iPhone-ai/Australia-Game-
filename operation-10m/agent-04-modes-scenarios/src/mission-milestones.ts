import type { O10mMissionMilestone, O10mMilestoneProgress, O10mRunSummary } from './types.js';

export const O10M_MISSION_MILESTONES: O10mMissionMilestone[] = [
  {
    id: 'o10m_milestone_first_o10m_scenario',
    title: 'Operation Briefing',
    description: 'Complete any Operation 10M scenario with a primary victory.',
    category: 'scenario',
    badgeId: 'badge_o10m_milestone_first_scenario',
  },
  {
    id: 'o10m_milestone_challenge_stack',
    title: 'Stacked Discipline',
    description: 'Win an O10M scenario with two challenge overlays active.',
    category: 'challenge',
    badgeId: 'badge_o10m_milestone_challenge_stack',
  },
  {
    id: 'o10m_milestone_grand_tour_bridge',
    title: 'Tour Bridge',
    description: 'Complete Grand Tour Prologue in grand_tour or scenario base mode.',
    category: 'mode',
    badgeId: 'badge_o10m_milestone_grand_tour_bridge',
  },
  {
    id: 'o10m_milestone_alt_victory',
    title: 'Alternate Mandate',
    description: 'Secure an alternate victory rule on an O10M scenario.',
    category: 'victory',
    badgeId: 'badge_o10m_milestone_alt_victory',
  },
  {
    id: 'o10m_milestone_team_ledger',
    title: 'Team Ledger Clear',
    description: 'Primary-clear Team Ledger in team_human_ai_vs_ai_ai mode.',
    category: 'mode',
    badgeId: 'badge_o10m_milestone_team_ledger',
  },
  {
    id: 'o10m_milestone_silent_perfection',
    title: 'Silent Perfection',
    description: 'Complete Silent Diplomat with optional Clean Hands objective.',
    category: 'scenario',
    badgeId: 'badge_o10m_milestone_silent_perfection',
  },
];

function checkMilestone(m: O10mMissionMilestone, run: O10mRunSummary): boolean {
  switch (m.id) {
    case 'o10m_milestone_first_o10m_scenario':
      return Boolean(run.scenarioId?.startsWith('o10m_')) && run.primaryVictory;
    case 'o10m_milestone_challenge_stack':
      return run.primaryVictory && run.challengeModeIds.length >= 2;
    case 'o10m_milestone_grand_tour_bridge':
      return (
        run.scenarioId === 'o10m_grand_tour_prologue' &&
        run.primaryVictory &&
        (run.baseMode === 'grand_tour' || run.baseMode === 'scenario')
      );
    case 'o10m_milestone_alt_victory':
      return run.altVictoryRuleId !== null;
    case 'o10m_milestone_team_ledger':
      return (
        run.scenarioId === 'o10m_team_ledger' &&
        run.baseMode === 'team_human_ai_vs_ai_ai' &&
        run.primaryVictory
      );
    case 'o10m_milestone_silent_perfection':
      return run.scenarioId === 'o10m_silent_diplomat' && run.optionalObjectivesCompleted >= 1 && run.primaryVictory;
    default:
      return false;
  }
}

export function evaluateMissionMilestones(
  runs: O10mRunSummary[],
  existing: O10mMilestoneProgress[] = [],
): O10mMilestoneProgress[] {
  const byId = new Map(existing.map(p => [p.milestoneId, p]));
  for (const milestone of O10M_MISSION_MILESTONES) {
    const prev = byId.get(milestone.id) ?? {
      milestoneId: milestone.id,
      unlocked: false,
      unlockedAtRunCount: 0,
    };
    if (prev.unlocked) {
      byId.set(milestone.id, prev);
      continue;
    }
    const unlockRunIndex = runs.findIndex(r => checkMilestone(milestone, r));
    if (unlockRunIndex >= 0) {
      byId.set(milestone.id, {
        milestoneId: milestone.id,
        unlocked: true,
        unlockedAtRunCount: unlockRunIndex + 1,
      });
    } else {
      byId.set(milestone.id, prev);
    }
  }
  return O10M_MISSION_MILESTONES.map(m => byId.get(m.id)!);
}

export function countUnlockedMilestones(progress: O10mMilestoneProgress[]): number {
  return progress.filter(p => p.unlocked).length;
}
