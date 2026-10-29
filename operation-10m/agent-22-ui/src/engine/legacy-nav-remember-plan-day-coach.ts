import type { LegacyNavAutoRememberPlan } from './legacy-nav-auto-remember-bridge.js';

export interface LegacyNavRememberPlanDayCoach {
  panelCount: number;
  coachCopy: string | null;
}

export function buildLegacyNavRememberPlanDayCoach(input: {
  plan: LegacyNavAutoRememberPlan;
  nextGameDay: number;
}): LegacyNavRememberPlanDayCoach {
  if (!input.plan.panelIdsToRemember.length || !input.plan.coachCopy) {
    return { panelCount: 0, coachCopy: null };
  }
  return {
    panelCount: input.plan.panelIdsToRemember.length,
    coachCopy: `Day ${input.nextGameDay}: ${input.plan.coachCopy}`,
  };
}
