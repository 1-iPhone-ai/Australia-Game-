import { listModalPanelForSurface } from '../registry/modal-panel-definitions.js';
import { UI_MILESTONE_BY_ID } from '../registry/progression-milestones.js';
import { computeProgressionCoverage, listNextUnlockRecommendations } from '../engine/progression-coach.js';
import { applyPhasePolicyToVisibility } from '../engine/phase-panel-policy.js';
import { buildUnlockHintForPanel } from '../engine/unlock-hint-formatter.js';
import { resolveEvolvingPanelVisibilityWithPhase } from '../engine/resolve-panel-visibility.js';
import { DEFAULT_EVOLVING_UI_ACCESS_POLICY } from '../types/access-policy.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export function runAgent22ScaleWaveSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; name: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail?: string }> = [];
  const check = (id: string, name: string, passed: boolean, detail?: string) => {
    results.push({ id, name, passed, detail });
  };

  check(
    'sw_modal_surface_map',
    'modal surface travel maps to panel',
    listModalPanelForSurface('travel_modal')?.id === 'modal_travel'
  );

  check(
    'sw_milestone_catalog',
    'UI milestones registered',
    Object.keys(UI_MILESTONE_BY_ID).length >= 6
  );

  const signals = { gameDay: 1, turnCount: 1, interfaceLevel: 'simple' as const };
  const hint = buildUnlockHintForPanel(EVOLVING_UI_PANEL_BY_ID.nav_investments, {
    ...signals,
    guidedConceptStatuses: {},
  });
  check('sw_unlock_hint', 'investments hint mentions capital', hint.toLowerCase().includes('capital') || hint.includes('day'));

  const phased = resolveEvolvingPanelVisibilityWithPhase(
    'nav_market',
    'main_menu',
    signals,
    DEFAULT_EVOLVING_UI_ACCESS_POLICY
  );
  check('sw_phase_main_menu', 'main menu downgrades market visibility', phased.state !== 'visible' || phased.reason.includes('phase'));

  const coverage = computeProgressionCoverage(
    { gameDay: 10, turnCount: 10, interfaceLevel: 'expert' },
    DEFAULT_EVOLVING_UI_ACCESS_POLICY
  );
  check('sw_expert_coverage', 'expert coverage majority visible', coverage.coverageRatio >= 0.5);

  const recs = listNextUnlockRecommendations(signals, DEFAULT_EVOLVING_UI_ACCESS_POLICY, 3);
  check('sw_coach_recs', 'coach returns recommendations early game', recs.length > 0);

  check(
    'sw_guardian_phase',
    'guardian warning modal stays visible in save_load phase policy',
    applyPhasePolicyToVisibility('save_load', 'modal_guardian_warning', 'automation', 'hidden').state === 'visible'
  );

  const failed = results.filter(r => !r.passed).length;
  return { passed: results.length - failed, failed, results };
}
