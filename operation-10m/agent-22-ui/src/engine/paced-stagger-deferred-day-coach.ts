import { pacingStatusCopy } from './paced-announcement-scheduler.js';

export interface PacedStaggerDeferredDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacedStaggerDeferredDayCoach(input: {
  deferredCount: number;
  nextGameDay: number;
}): PacedStaggerDeferredDayCoach {
  const base = pacingStatusCopy(input.deferredCount);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    deferredCount: input.deferredCount,
    coachCopy,
  };
}
