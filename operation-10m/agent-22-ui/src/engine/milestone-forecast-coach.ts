import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { evaluateUnlockRule } from '../types/progression.js';
import { UI_PROGRESSION_MILESTONES, type UiProgressionMilestone } from '../registry/progression-milestones.js';

export interface MilestoneForecastEntry {
  milestoneId: string;
  title: string;
  coachCopy: string;
  missingReasonCount: number;
  estimatedDaysAway: number | null;
}

export function forecastUpcomingMilestones(
  signals: ProgressionSignalSnapshot,
  limit = 3
): MilestoneForecastEntry[] {
  const entries: MilestoneForecastEntry[] = [];

  for (const milestone of UI_PROGRESSION_MILESTONES) {
    const evaluation = evaluateUnlockRule(milestone.rule, signals);
    if (evaluation.ok) continue;

    const minDay = milestone.rule.minDay ?? 1;
    const estimatedDaysAway =
      signals.gameDay < minDay ? minDay - signals.gameDay : evaluation.reasons.length <= 1 ? 1 : null;

    entries.push({
      milestoneId: milestone.id,
      title: milestone.title,
      coachCopy: milestone.coachCopy,
      missingReasonCount: evaluation.reasons.length,
      estimatedDaysAway,
    });
  }

  return entries
    .sort(
      (a, b) =>
        (a.estimatedDaysAway ?? 99) - (b.estimatedDaysAway ?? 99) ||
        a.missingReasonCount - b.missingReasonCount
    )
    .slice(0, limit);
}

export function milestoneForecastCoachCopy(entries: MilestoneForecastEntry[]): string | null {
  if (!entries.length) return null;
  const next = entries[0];
  if (next.estimatedDaysAway != null && next.estimatedDaysAway <= 1) {
    return `Next milestone soon: ${next.title}. ${next.coachCopy}`;
  }
  return `Up next: ${next.title} — ${next.coachCopy}`;
}

export function findMilestoneById(id: string): UiProgressionMilestone | undefined {
  return UI_PROGRESSION_MILESTONES.find(m => m.id === id);
}
