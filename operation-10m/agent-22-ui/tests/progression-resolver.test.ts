import { describe, expect, it } from 'vitest';
import { EVOLVING_UI_PANEL_BY_ID, NAV_TARGET_PANELS } from '../src/registry/panel-definitions.js';
import { resolveEvolvingPanelVisibility, sortPanelsForRail } from '../src/engine/resolve-panel-visibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('resolveEvolvingPanelVisibility', () => {
  it('shows essential panels on day 1 simple mode', () => {
    const vis = resolveEvolvingPanelVisibility(
      'nav_map',
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(vis.state).toBe('visible');
    expect(vis.reason).toBe('essential_panel');
  });

  it('hides or previews advanced loans early in simple mode', () => {
    const vis = resolveEvolvingPanelVisibility(
      'nav_loans',
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(['hidden', 'preview']).toContain(vis.state);
  });

  it('shows all panels for expert implicit policy', () => {
    const vis = resolveEvolvingPanelVisibility(
      'nav_loans',
      { gameDay: 1, turnCount: 1, interfaceLevel: 'expert' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(vis.state).toBe('visible');
  });

  it('honors showAllPanelsOverride', () => {
    const vis = resolveEvolvingPanelVisibility(
      'nav_sabotage',
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      { ...DEFAULT_EVOLVING_UI_ACCESS_POLICY, showAllPanelsOverride: true }
    );
    expect(vis.state).toBe('visible');
    expect(vis.reason).toBe('show_all_override');
  });

  it('requires capital_allocation concept for investments', () => {
    const without = resolveEvolvingPanelVisibility(
      'nav_investments',
      { gameDay: 10, turnCount: 10, interfaceLevel: 'guided', guidedConceptStatuses: {} },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(without.satisfiesUnlock).toBe(false);
    const withConcept = resolveEvolvingPanelVisibility(
      'nav_investments',
      {
        gameDay: 10,
        turnCount: 10,
        interfaceLevel: 'guided',
        guidedConceptStatuses: { capital_allocation: 'introduced' },
      },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(withConcept.satisfiesUnlock).toBe(true);
  });
});

describe('sortPanelsForRail', () => {
  it('orders visible before preview before hidden', () => {
    const ids = NAV_TARGET_PANELS.slice(0, 6).map(p => p.id);
    const sorted = sortPanelsForRail(
      ids,
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(sorted.length).toBe(ids.length);
    const states = sorted.map(id => resolveEvolvingPanelVisibility(id, { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' }, DEFAULT_EVOLVING_UI_ACCESS_POLICY).state);
    const rank = (s: string) => (s === 'visible' ? 0 : s === 'preview' ? 1 : 2);
    for (let i = 1; i < states.length; i++) {
      expect(rank(states[i])).toBeGreaterThanOrEqual(rank(states[i - 1]));
    }
  });
});

describe('panel registry', () => {
  it('has unique panel ids', () => {
    const ids = Object.keys(EVOLVING_UI_PANEL_BY_ID);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
