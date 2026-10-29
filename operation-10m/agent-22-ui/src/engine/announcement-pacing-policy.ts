import type { ScreenReaderAnnounceVerbosity } from '../types/accessibility.js';
import type { MotionTimingProfile } from './motion-timing-profile.js';

export interface PacedAnnouncementBatch {
  items: string[];
  delayMs: number;
  politeness: 'polite' | 'assertive';
}

export interface AnnouncementPacingOptions {
  reducedMotion: boolean;
  announceVerbosity: ScreenReaderAnnounceVerbosity;
  motionTiming?: Pick<MotionTimingProfile, 'staggerStepMs'>;
  /** When true, first batch may use assertive politeness for safety-critical copy. */
  allowAssertiveLead?: boolean;
}

const DEFAULT_BATCH_SIZE = 2;

export function paceUnlockAnnouncements(
  announcements: string[],
  options: AnnouncementPacingOptions
): PacedAnnouncementBatch[] {
  if (!announcements.length) return [];
  if (options.announceVerbosity === 'off') return [];

  const stagger = options.motionTiming?.staggerStepMs ?? (options.reducedMotion ? 0 : 110);
  const batchSize =
    options.announceVerbosity === 'minimal' ? 1 : options.announceVerbosity === 'assertive' ? 3 : DEFAULT_BATCH_SIZE;

  const batches: PacedAnnouncementBatch[] = [];
  let delayMs = 0;
  for (let i = 0; i < announcements.length; i += batchSize) {
    const slice = announcements.slice(i, i + batchSize);
    const politeness: 'polite' | 'assertive' =
      i === 0 && options.allowAssertiveLead && options.announceVerbosity === 'assertive'
        ? 'assertive'
        : 'polite';
    batches.push({ items: slice, delayMs, politeness });
    delayMs += stagger * Math.max(1, slice.length);
  }
  return batches;
}

export function countDeferredAnnouncements(
  totalAnnouncements: number,
  options: AnnouncementPacingOptions
): number {
  if (options.announceVerbosity === 'off') return totalAnnouncements;
  const batches = paceUnlockAnnouncements(
    Array.from({ length: totalAnnouncements }, (_, i) => `placeholder-${i}`),
    options
  );
  const scheduled = batches.reduce((sum, b) => sum + b.items.length, 0);
  return Math.max(0, totalAnnouncements - scheduled);
}

export function flattenPacedAnnouncements(batches: PacedAnnouncementBatch[]): string[] {
  return batches.flatMap(b => b.items);
}
