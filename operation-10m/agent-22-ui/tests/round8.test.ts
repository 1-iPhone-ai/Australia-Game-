import { describe, expect, it } from 'vitest';
import { runAgent22Round8SelfTests } from '../src/engine/round8-self-tests.js';
import {
  filterDedupedAnnouncements,
  hashAnnouncementText,
} from '../src/engine/announcement-dedup-ledger.js';
import { resolveModalFocusRestorePlan } from '../src/engine/modal-focus-restoration.js';
import { planAttentionSurfaceGate } from '../src/engine/attention-surface-gate.js';
import { DEFAULT_ACCESSIBILITY_SNAPSHOT } from '../src/types/accessibility.js';

describe('round 8 self-tests bundle', () => {
  it('passes embedded round8 suite', () => {
    const r = runAgent22Round8SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(12);
  });
});

describe('announcement dedup ledger', () => {
  it('hashes and filters repeats', () => {
    const h = hashAnnouncementText('hello');
    expect(h.startsWith('a')).toBe(true);
    const filtered = filterDedupedAnnouncements(['hello', 'hello'], 3, { [h]: 2 });
    expect(filtered.suppressedCount).toBeGreaterThanOrEqual(1);
  });
});

describe('modal focus restoration', () => {
  it('builds restore plan for modals', () => {
    const plan = resolveModalFocusRestorePlan({
      modalId: 'trade_modal',
      lastNavTarget: 'trade',
      accessibility: DEFAULT_ACCESSIBILITY_SNAPSHOT,
    });
    expect(plan.trapEnabled).toBe(true);
  });
});

describe('attention surface gate', () => {
  it('defers lower-priority coaches under heavy load', () => {
    const plan = planAttentionSurfaceGate({
      band: 'heavy',
      phase: 'save_load',
      focusSessionBannerRequested: true,
      cognitiveLoadCoachRequested: true,
      panelUnlockCoachRequested: true,
    });
    expect(plan.maxConcurrentSurfaces).toBeLessThanOrEqual(2);
  });
});
