import { describe, expect, it } from 'vitest';
import { listModalPanelForSurface, MODAL_PANELS } from '../src/registry/modal-panel-definitions.js';
import { UI_PROGRESSION_MILESTONES } from '../src/registry/progression-milestones.js';
import { buildUnlockHintForPanel } from '../src/engine/unlock-hint-formatter.js';
import { applyPhasePolicyToVisibility } from '../src/engine/phase-panel-policy.js';
import {
  computeProgressionCoverage,
  listNextUnlockRecommendations,
  listMilestonesApproaching,
} from '../src/engine/progression-coach.js';
import { resolveEvolvingPanelVisibilityWithPhase } from '../src/engine/resolve-panel-visibility.js';
import { runAgent22ScaleWaveSelfTests } from '../src/engine/scale-wave-self-tests.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../src/registry/panel-definitions.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../src/types/access-policy.js';

describe('modal panel registry', () => {
  it('maps V9.4 travel_modal surface', () => {
    expect(listModalPanelForSurface('travel_modal')?.label).toBe('Travel');
  });

  it('registers scale-wave modal count', () => {
    expect(MODAL_PANELS.length).toBeGreaterThanOrEqual(20);
  });
});

describe('progression milestones', () => {
  it('links capital allocation to investments panels', () => {
    const m = UI_PROGRESSION_MILESTONES.find(x => x.id === 'capital_allocation_intro');
    expect(m?.unlocksPanelIds).toContain('nav_investments');
  });
});

describe('unlock hints', () => {
  it('formats day requirements', () => {
    const hint = buildUnlockHintForPanel(EVOLVING_UI_PANEL_BY_ID.nav_loans, {
      gameDay: 1,
      turnCount: 1,
      interfaceLevel: 'guided',
    });
    expect(hint).toMatch(/day/i);
  });
});

describe('phase policy', () => {
  it('elevates guardian warning from hidden during save_load', () => {
    const r = applyPhasePolicyToVisibility('save_load', 'modal_guardian_warning', 'automation', 'hidden');
    expect(r.state).toBe('visible');
  });

  it('previews economy panels on main menu when visible', () => {
    const r = applyPhasePolicyToVisibility('main_menu', 'nav_market', 'economy', 'visible');
    expect(r.state).toBe('preview');
  });
});

describe('progression coach', () => {
  it('computes coverage for expert', () => {
    const c = computeProgressionCoverage(
      { gameDay: 5, turnCount: 5, interfaceLevel: 'expert' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(c.visible).toBeGreaterThan(c.hidden);
  });

  it('lists early-game recommendations', () => {
    const recs = listNextUnlockRecommendations(
      { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(recs.length).toBeGreaterThan(0);
  });

  it('finds approaching milestones', () => {
    const ms = listMilestonesApproaching({ gameDay: 2, turnCount: 2, interfaceLevel: 'guided' });
    expect(ms.length).toBeGreaterThan(0);
  });
});

describe('phase-aware visibility', () => {
  it('annotates reason when phase applies', () => {
    const v = resolveEvolvingPanelVisibilityWithPhase(
      'nav_market',
      'main_menu',
      { gameDay: 5, turnCount: 5, interfaceLevel: 'guided' },
      DEFAULT_EVOLVING_UI_ACCESS_POLICY
    );
    expect(v.reason).toContain('phase');
  });
});

describe('scale wave self-tests bundle', () => {
  it('runs embedded scale wave suite', () => {
    const r = runAgent22ScaleWaveSelfTests();
    expect(r.failed).toBe(0);
    expect(r.passed).toBeGreaterThanOrEqual(6);
  });
});
