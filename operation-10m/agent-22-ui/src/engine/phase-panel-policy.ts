import type { V94StandardizedGamePhase } from '../adapters/v94-phase-bridge.js';
import type { PanelVisibilityState } from '../types/progression.js';

const PHASE_SUPPRESS_CATEGORIES: Partial<Record<V94StandardizedGamePhase, string[]>> = {
  main_menu: ['economy', 'strategic', 'regional', 'automation'],
  setup: ['strategic', 'diagnostics'],
  save_load: ['economy', 'strategic', 'regional'],
  replay: ['economy', 'regional'],
  post_match: ['economy', 'automation'],
  ai_turn: ['automation'],
};

const PHASE_ESSENTIAL_MODAL_IDS = new Set([
  'modal_guardian_warning',
  'modal_save_migration',
  'modal_save_load',
]);

export function applyPhasePolicyToVisibility(
  phase: V94StandardizedGamePhase,
  panelId: string,
  panelCategory: string,
  baseState: PanelVisibilityState
): { state: PanelVisibilityState; reason: string } {
  if (PHASE_ESSENTIAL_MODAL_IDS.has(panelId)) {
    return { state: baseState === 'hidden' ? 'visible' : baseState, reason: 'phase_essential_modal' };
  }
  const suppressed = PHASE_SUPPRESS_CATEGORIES[phase];
  if (!suppressed || baseState === 'hidden') {
    return { state: baseState, reason: 'phase_no_change' };
  }
  if (suppressed.includes(panelCategory)) {
    if (baseState === 'visible') {
      return { state: 'preview', reason: `phase_${phase}_preview` };
    }
  }
  return { state: baseState, reason: 'phase_no_change' };
}

export function listPhasesThatSuppressCategory(category: string): V94StandardizedGamePhase[] {
  const out: V94StandardizedGamePhase[] = [];
  for (const [phase, cats] of Object.entries(PHASE_SUPPRESS_CATEGORIES)) {
    if (cats?.includes(category)) out.push(phase as V94StandardizedGamePhase);
  }
  return out;
}
