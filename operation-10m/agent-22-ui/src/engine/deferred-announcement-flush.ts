import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import type { UiDensityProfile } from './ui-density-progression.js';
import { buildPacedAnnouncementSchedule } from './paced-announcement-scheduler.js';

export interface DeferredAnnouncementFlushResult {
  flushedAnnouncements: string[];
  remainingQueue: string[];
  remainingCount: number;
}

export function flushDeferredAnnouncementQueue(
  queue: string[],
  accessibility: AccessibilitySettingsSnapshot,
  density: UiDensityProfile
): DeferredAnnouncementFlushResult {
  if (!queue.length) {
    return { flushedAnnouncements: [], remainingQueue: [], remainingCount: 0 };
  }

  const schedule = buildPacedAnnouncementSchedule(queue, accessibility, density);
  return {
    flushedAnnouncements: schedule.immediateAnnouncements,
    remainingQueue: schedule.deferredAnnouncements,
    remainingCount: schedule.deferredAnnouncements.length,
  };
}

export function mergeAnnouncementPacingQueueIntoPersisted<
  T extends { announcementPacingQueue?: string[]; announcementPacingDeferredCount?: number },
>(persisted: T, queue: string[]): T {
  return {
    ...persisted,
    announcementPacingQueue: [...queue],
    announcementPacingDeferredCount: queue.length,
  };
}

export function deferredFlushStatusCopy(flushedCount: number, remainingCount: number): string | null {
  if (flushedCount <= 0 && remainingCount <= 0) return null;
  if (flushedCount > 0 && remainingCount > 0) {
    return `Delivered ${flushedCount} queued coach announcements; ${remainingCount} still waiting.`;
  }
  if (flushedCount > 0) {
    return `Delivered ${flushedCount} queued coach announcements.`;
  }
  return `${remainingCount} coach announcements remain in the delivery queue.`;
}

export function appendToAnnouncementPacingQueue(queue: string[], lines: string[]): string[] {
  if (!lines.length) return queue;
  return [...queue, ...lines];
}
