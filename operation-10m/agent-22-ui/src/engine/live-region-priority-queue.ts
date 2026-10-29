import type { LiveRegionMessage } from '../types/accessibility.js';

export type LiveRegionPriority = 'assertive' | 'polite';

export interface QueuedLiveRegionMessage extends LiveRegionMessage {
  priority: LiveRegionPriority;
}

const PRIORITY_RANK: Record<LiveRegionPriority, number> = {
  assertive: 0,
  polite: 1,
};

export function enqueueLiveRegionMessage(
  queue: QueuedLiveRegionMessage[],
  message: Omit<QueuedLiveRegionMessage, 'createdAt'> & { createdAt?: number }
): QueuedLiveRegionMessage[] {
  const entry: QueuedLiveRegionMessage = {
    ...message,
    createdAt: message.createdAt ?? Date.now(),
  };
  const next = [...queue, entry];
  next.sort((a, b) => {
    const rank = PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
    if (rank !== 0) return rank;
    return a.createdAt - b.createdAt;
  });
  return next;
}

export function drainLiveRegionQueue(queue: QueuedLiveRegionMessage[], max = 3): {
  drained: QueuedLiveRegionMessage[];
  remaining: QueuedLiveRegionMessage[];
} {
  const drained = queue.slice(0, max);
  const remaining = queue.slice(max);
  return { drained, remaining };
}

export function coalesceDuplicateLiveRegionText(queue: QueuedLiveRegionMessage[]): QueuedLiveRegionMessage[] {
  const seen = new Set<string>();
  const out: QueuedLiveRegionMessage[] = [];
  for (const msg of queue) {
    const key = `${msg.priority}:${msg.text.trim().toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(msg);
  }
  return out;
}

export function liveRegionQueueSummaryCopy(queue: QueuedLiveRegionMessage[]): string | null {
  if (!queue.length) return null;
  const assertive = queue.filter(q => q.priority === 'assertive').length;
  if (assertive > 0) {
    return `${queue.length} screen reader messages queued (${assertive} priority).`;
  }
  return `${queue.length} screen reader messages queued.`;
}
