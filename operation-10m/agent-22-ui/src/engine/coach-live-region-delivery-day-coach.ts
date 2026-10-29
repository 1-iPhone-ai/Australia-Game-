import type { CoachLiveRegionDeliveryPlan } from './coach-live-region-scheduler.js';
import { coachLiveRegionDeliveryCopy } from './coach-live-region-scheduler.js';

export interface CoachLiveRegionDeliveryDayCoach {
  messageCount: number;
  coachCopy: string | null;
}

export function buildCoachLiveRegionDeliveryDayCoach(input: {
  plan: CoachLiveRegionDeliveryPlan;
  nextGameDay: number;
}): CoachLiveRegionDeliveryDayCoach {
  const base = coachLiveRegionDeliveryCopy(input.plan);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    messageCount: input.plan.messages.length,
    coachCopy,
  };
}
