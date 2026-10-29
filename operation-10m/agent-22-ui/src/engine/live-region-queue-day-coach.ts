import type { CoachLiveRegionDeliveryPlan } from './coach-live-region-scheduler.js';
import { liveRegionQueueSummaryCopy } from './live-region-priority-queue.js';

export interface LiveRegionQueueDayCoach {
  queuedMessageCount: number;
  assertiveCount: number;
  coachCopy: string | null;
}

export function buildLiveRegionQueueDayCoach(input: {
  plan: CoachLiveRegionDeliveryPlan;
  nextGameDay: number;
}): LiveRegionQueueDayCoach {
  const base = liveRegionQueueSummaryCopy(input.plan.messages);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    queuedMessageCount: input.plan.messages.length,
    assertiveCount: input.plan.assertiveCount,
    coachCopy,
  };
}
