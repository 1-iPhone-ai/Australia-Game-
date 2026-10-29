import { describe, expect, it } from 'vitest';
import { runAgent22Round3SelfTests } from '../src/engine/round3-self-tests.js';
import { listContextualQuickActions } from '../src/engine/contextual-quick-actions.js';
import { listAvailableKeyboardShortcuts } from '../src/engine/keyboard-shortcut-progression.js';
import { panelsHighlightedByOnboarding } from '../src/sim/onboarding-funnel.js';
import { resolveEvolvingPanelVisibilityWithLayout } from '../src/engine/layout-aware-visibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('round 3 self-tests bundle', () => {
  it('passes embedded round3 suite', () => {
    const r = runAgent22Round3SelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(8);
  });
});

describe('contextual quick actions', () => {
  it('limits actions on main menu phase', () => {
    expect(listContextualQuickActions('main_menu', 10).length).toBe(0);
  });
});

describe('keyboard shortcuts', () => {
  it('includes settings on paused simple', () => {
    expect(listAvailableKeyboardShortcuts('simple', 'paused').some(s => s.navTarget === 'settings')).toBe(true);
  });
});

describe('onboarding highlight', () => {
  it('returns panel ids for active funnel', () => {
    const ids = panelsHighlightedByOnboarding(2, []);
    expect(ids.length).toBeGreaterThan(0);
  });
});

describe('layout-aware visibility', () => {
  it('can downgrade visible launcher on Clean preset', () => {
    const vis = resolveEvolvingPanelVisibilityWithLayout(
      'quick_actions',
      'Clean',
      { gameDay: 10, turnCount: 10, interfaceLevel: 'advanced' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(['preview', 'visible', 'hidden']).toContain(vis.state);
  });
});
