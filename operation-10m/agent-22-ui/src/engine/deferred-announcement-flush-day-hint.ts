import { deferredFlushStatusCopy } from './deferred-announcement-flush.js';

export interface DeferredAnnouncementFlushDayHint {
  flushedCount: number;
  remainingCount: number;
  coachCopy: string | null;
}

export function buildDeferredAnnouncementFlushDayHint(input: {
  flushedCount: number;
  remainingCount: number;
  nextGameDay: number;
}): DeferredAnnouncementFlushDayHint {
  const base = deferredFlushStatusCopy(input.flushedCount, input.remainingCount);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    flushedCount: input.flushedCount,
    remainingCount: input.remainingCount,
    coachCopy,
  };
}
