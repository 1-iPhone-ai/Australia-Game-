import { dedupStatusCopy } from './announcement-dedup-ledger.js';

export interface AnnouncementDedupDayHint {
  suppressedCount: number;
  coachCopy: string | null;
}

export function buildAnnouncementDedupDayHint(input: {
  suppressedCount: number;
  nextGameDay: number;
}): AnnouncementDedupDayHint {
  const base = dedupStatusCopy(input.suppressedCount);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    suppressedCount: input.suppressedCount,
    coachCopy,
  };
}
