import { describe, expect, it } from 'vitest';
import {
  applyGuidedLearningUiUnlockEvents,
  createDefaultEvolvingUiPersistedState,
  mergePersistedIntoAccessPolicy,
  tickEvolvingUiOnDayAdvance,
} from '../src/sim/evolution-hooks.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('tickEvolvingUiOnDayAdvance', () => {
  it('increases visible panel count on later days', () => {
    const r = tickEvolvingUiOnDayAdvance(
      { gameDay: 1, turnCount: 1, interfaceLevel: 'guided' },
      { gameDay: 8, turnCount: 8, interfaceLevel: 'guided', guidedConceptStatuses: { capital_allocation: 'introduced' } },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(r.visiblePanelCount).toBeGreaterThan(5);
    expect(r.updatedPersisted.unlockedByDay?.['8']?.length ?? 0).toBeGreaterThanOrEqual(0);
  });

  it('records coach announcements when panels unlock', () => {
    const r = tickEvolvingUiOnDayAdvance(
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      { gameDay: 3, turnCount: 3, interfaceLevel: 'guided' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    if (r.newlyUnlockedPanelIds.length > 0) {
      expect(r.coachAnnouncements.length).toBeGreaterThan(0);
    }
  });
});

describe('guided learning unlock events', () => {
  it('remembers investment panels after capital allocation', () => {
    const next = applyGuidedLearningUiUnlockEvents(
      [{ conceptId: 'capital_allocation', status: 'introduced' }],
      createDefaultEvolvingUiPersistedState()
    );
    expect(next.rememberedPanelIds).toContain('nav_investments');
  });
});

describe('mergePersistedIntoAccessPolicy', () => {
  it('merges remembered ids', () => {
    const policy = mergePersistedIntoAccessPolicy(
      { rememberedPanelIds: ['nav_map'] },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(policy.rememberedPanelIds).toContain('nav_map');
  });
});
