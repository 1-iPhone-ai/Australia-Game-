import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  flattenPacedAnnouncements,
  paceUnlockAnnouncements,
  type PacedAnnouncementBatch,
} from './announcement-pacing-policy.js';
import { resolveMotionTimingProfile } from './motion-timing-profile.js';
import type { UiDensityProfile } from './ui-density-progression.js';

export interface PacedAnnouncementSchedule {
  /** Announcements safe to fire immediately (first batch). */
  immediateAnnouncements: string[];
  /** Remaining lines deferred to later ticks / host scheduler. */
  deferredAnnouncements: string[];
  deferredCount: number;
  batches: PacedAnnouncementBatch[];
}

export function buildPacedAnnouncementSchedule(
  announcements: string[],
  accessibility: AccessibilitySettingsSnapshot,
  density: UiDensityProfile
): PacedAnnouncementSchedule {
  const motion = resolveMotionTimingProfile(accessibility, density);
  const batches = paceUnlockAnnouncements(announcements, {
    reducedMotion: accessibility.reducedMotion,
    announceVerbosity: accessibility.announceVerbosity,
    motionTiming: motion,
    allowAssertiveLead: accessibility.announceVerbosity === 'assertive',
  });

  if (!batches.length) {
    return {
      immediateAnnouncements: [],
      deferredAnnouncements: [],
      deferredCount: announcements.length,
      batches: [],
    };
  }

  const immediateAnnouncements = [...batches[0].items];
  const deferredAnnouncements = flattenPacedAnnouncements(batches.slice(1));

  return {
    immediateAnnouncements,
    deferredAnnouncements,
    deferredCount: deferredAnnouncements.length,
    batches,
  };
}

export function pacingStatusCopy(deferredCount: number): string | null {
  if (deferredCount <= 0) return null;
  const noun = deferredCount === 1 ? 'announcement' : 'announcements';
  return `${deferredCount} coach ${noun} queued for staggered screen reader delivery.`;
}

export function mergePacingDeferredIntoPersisted<T extends { announcementPacingDeferredCount?: number }>(
  persisted: T,
  deferredCount: number
): T {
  return {
    ...persisted,
    announcementPacingDeferredCount: Math.max(0, deferredCount),
  };
}
