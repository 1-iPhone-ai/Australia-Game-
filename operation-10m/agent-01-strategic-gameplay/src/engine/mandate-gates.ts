import type { MandateProgress } from '../types/coalition-mandate.ts';
import type {
  StrategicActionDefinition,
  StrategicGameplayState,
  StrategicValidationIssue,
} from '../types/strategic-action.ts';

function trackHasMilestone(
  progress: MandateProgress,
  priorityId: string,
  milestoneId: string,
): boolean {
  const track = progress[priorityId as keyof MandateProgress];
  if (!track) return false;
  return track.milestonesUnlocked.includes(
    milestoneId as (typeof track.milestonesUnlocked)[number],
  );
}

export function mandateMilestoneIssues(
  action: StrategicActionDefinition,
  state: StrategicGameplayState,
): StrategicValidationIssue[] {
  const required = action.requiredMandateMilestones;
  if (!required?.length) return [];

  const progress = state.mandateProgress ?? {};
  const issues: StrategicValidationIssue[] = [];

  for (const gate of required) {
    if (trackHasMilestone(progress, gate.priorityId, gate.milestoneId)) continue;
    issues.push({
      code: 'MANDATE_MILESTONE_REQUIRED',
      message: `Requires ${gate.milestoneId} on ${gate.priorityId} mandate track.`,
      requirement: {
        kind: 'mandate_milestone',
        priorityId: gate.priorityId,
        milestoneId: gate.milestoneId,
      },
    });
  }

  return issues;
}
