import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  coalesceDuplicateLiveRegionText,
  enqueueLiveRegionMessage,
  type QueuedLiveRegionMessage,
} from './live-region-priority-queue.js';

export interface CoachLiveRegionDeliveryPlan {
  messages: QueuedLiveRegionMessage[];
  assertiveCount: number;
  politeCount: number;
}

export function buildCoachLiveRegionDeliveryPlan(
  coachLines: string[],
  accessibility: AccessibilitySettingsSnapshot
): CoachLiveRegionDeliveryPlan {
  if (!accessibility.screenReaderAnnouncements || accessibility.announceVerbosity === 'off') {
    return { messages: [], assertiveCount: 0, politeCount: 0 };
  }

  let queue: QueuedLiveRegionMessage[] = [];
  coachLines.forEach((text, index) => {
    const priority = index === 0 && accessibility.announceVerbosity === 'assertive' ? 'assertive' : 'polite';
    queue = enqueueLiveRegionMessage(queue, {
      id: `coach-lr-${index}`,
      text,
      politeness: priority === 'assertive' ? 'assertive' : 'polite',
      priority,
    });
  });

  const messages = coalesceDuplicateLiveRegionText(queue);
  return {
    messages,
    assertiveCount: messages.filter(m => m.priority === 'assertive').length,
    politeCount: messages.filter(m => m.priority === 'polite').length,
  };
}

export function coachLiveRegionDeliveryCopy(plan: CoachLiveRegionDeliveryPlan): string | null {
  if (!plan.messages.length) return null;
  if (plan.assertiveCount > 0) {
    return `${plan.messages.length} coach lines queued for screen reader (${plan.assertiveCount} priority).`;
  }
  return `${plan.messages.length} coach lines queued for screen reader delivery.`;
}
