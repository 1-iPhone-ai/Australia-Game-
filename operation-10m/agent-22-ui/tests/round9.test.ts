import { describe, expect, it } from 'vitest';
import { runAgent22Round9SelfTests } from '../src/engine/round9-self-tests.js';
import { buildPacedAnnouncementSchedule } from '../src/engine/paced-announcement-scheduler.js';
import { planKeyboardShortcutConflicts } from '../src/engine/keyboard-shortcut-conflict-guard.js';
import { enqueueLiveRegionMessage } from '../src/engine/live-region-priority-queue.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../src/types/accessibility.js';
import { resolveUiDensityProfile } from '../src/engine/ui-density-progression.js';

describe('round 9 self-tests bundle', () => {
  it('passes embedded round9 suite', () => {
    const r = runAgent22Round9SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('paced announcement scheduler', () => {
  it('schedules stagger batches', () => {
    const density = resolveUiDensityProfile({ interfaceLevel: 'advanced' });
    const schedule = buildPacedAnnouncementSchedule(
      ['a', 'b', 'c', 'd', 'e'],
      DEFAULT_ACCESSIBILITY_SNAPSHOT,
      density
    );
    expect(schedule.batches.length).toBeGreaterThan(0);
  });
});

describe('keyboard shortcut conflict guard', () => {
  it('returns stable plan for expert phase', () => {
    const conflicts = planKeyboardShortcutConflicts('expert', 'human_turn');
    expect(Array.isArray(conflicts)).toBe(true);
  });
});

describe('live region priority queue', () => {
  it('orders assertive ahead of polite', () => {
    const q = enqueueLiveRegionMessage([], {
      id: 'p',
      text: 'later',
      politeness: 'polite',
      priority: 'polite',
    });
    const q2 = enqueueLiveRegionMessage(q, {
      id: 'a',
      text: 'now',
      politeness: 'assertive',
      priority: 'assertive',
    });
    expect(q2[0].priority).toBe('assertive');
  });
});
