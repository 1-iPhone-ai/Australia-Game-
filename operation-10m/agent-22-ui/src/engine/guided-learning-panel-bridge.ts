import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export interface GuidedLearningPanelHint {
  conceptId: string;
  status: 'introduced' | 'mastered' | 'locked';
  panelIds: string[];
  coachCopy: string;
}

const CONCEPT_PANEL_MAP: Record<string, string[]> = {
  capital_allocation: ['nav_investments', 'modal_investments'],
  opportunity_cost: ['nav_contracts', 'modal_regional_contracts'],
  liquidity: ['nav_loans', 'nav_market', 'modal_loans'],
};

export function buildGuidedLearningPanelHints(signals: ProgressionSignalSnapshot): GuidedLearningPanelHint[] {
  const hints: GuidedLearningPanelHint[] = [];
  const statuses = signals.guidedConceptStatuses ?? {};

  for (const [conceptId, panelIds] of Object.entries(CONCEPT_PANEL_MAP)) {
    const status = statuses[conceptId] ?? 'locked';
    if (status === 'locked') continue;

    const labels = panelIds
      .map(id => EVOLVING_UI_PANEL_BY_ID[id]?.label)
      .filter(Boolean)
      .join(', ');

    hints.push({
      conceptId,
      status,
      panelIds,
      coachCopy:
        status === 'mastered'
          ? `${conceptId} mastered — ${labels || 'related panels'} stay unlocked.`
          : `${conceptId} introduced — preview ${labels || 'related panels'} as you practice.`,
    });
  }

  return hints;
}

export function guidedLearningPanelCoachCopy(hints: GuidedLearningPanelHint[]): string | null {
  if (!hints.length) return null;
  return hints[0].coachCopy;
}

export function countIntroducedGuidedConcepts(signals: ProgressionSignalSnapshot): number {
  const statuses = signals.guidedConceptStatuses ?? {};
  return Object.values(statuses).filter(s => s === 'introduced' || s === 'mastered').length;
}
