export interface LiveRegionAssertiveBatchDayCoach {
  assertiveCount: number;
  messageCount: number;
  coachCopy: string | null;
}

export function buildLiveRegionAssertiveBatchDayCoach(input: {
  assertiveCount: number;
  messageCount: number;
  nextGameDay: number;
}): LiveRegionAssertiveBatchDayCoach {
  if (input.assertiveCount <= 0 || input.messageCount <= 0) {
    return {
      assertiveCount: input.assertiveCount,
      messageCount: input.messageCount,
      coachCopy: null,
    };
  }
  return {
    assertiveCount: input.assertiveCount,
    messageCount: input.messageCount,
    coachCopy: `Day ${input.nextGameDay}: ${input.assertiveCount} assertive live-region coach ${input.assertiveCount === 1 ? 'message' : 'messages'} queued for immediate delivery.`,
  };
}
