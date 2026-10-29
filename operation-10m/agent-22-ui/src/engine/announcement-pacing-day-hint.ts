import { pacingStatusCopy } from './paced-announcement-scheduler.js';

export interface AnnouncementPacingDayHint {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildAnnouncementPacingDayHint(input: {
  deferredCount: number;
  nextGameDay: number;
}): AnnouncementPacingDayHint {
  const base = pacingStatusCopy(input.deferredCount);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    deferredCount: input.deferredCount,
    coachCopy,
  };
}
