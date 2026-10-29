import type { CoachLiveRegionDeliveryPlan } from './coach-live-region-scheduler.js';
import { coachLiveRegionDeliveryCopy } from './coach-live-region-scheduler.js';

export interface CoachLiveRegionDayCoach {
  messageCount: number;
  coachCopy: string | null;
}

export function buildCoachLiveRegionDayCoach(input: {
  plan: CoachLiveRegionDeliveryPlan;
  nextGameDay: number;
}): CoachLiveRegionDayCoach {
  const base = coachLiveRegionDeliveryCopy(input.plan);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;

  return {
    messageCount: input.plan.messages.length,
    coachCopy,
  };
}
