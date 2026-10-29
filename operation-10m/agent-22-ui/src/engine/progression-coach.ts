import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import { UI_PROGRESSION_MILESTONES } from '../registry/progression-milestones.js';
import { buildCoachHeadline, buildUnlockHintForPanel } from './unlock-hint-formatter.js';
import { resolveEvolvingPanelVisibility } from './resolve-panel-visibility.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { EvolvingPanelDefinition, ProgressionSignalSnapshot } from '../types/progression.js';
import { evaluateUnlockRule } from '../types/progression.js';

export interface NextUnlockRecommendation {
  panelId: string;
  label: string;
  hint: string;
  headline: string;
  progressionTier: number;
  priority: number;
}

export function listNextUnlockRecommendations(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy,
  limit = 5
): NextUnlockRecommendation[] {
  const candidates: NextUnlockRecommendation[] = [];
  for (const panel of Object.values(EVOLVING_UI_PANEL_BY_ID)) {
    const vis = resolveEvolvingPanelVisibility(panel.id, signals, policy);
    if (vis.state === 'visible') continue;
    const unlock = evaluateUnlockRule(panel.unlock, signals);
    const missingRules = unlock.reasons.length;
    const priority = panel.progressionTier * 10 + missingRules;
    candidates.push({
      panelId: panel.id,
      label: panel.label,
      hint: buildUnlockHintForPanel(panel, signals),
      headline: buildCoachHeadline(panel, signals),
      progressionTier: panel.progressionTier,
      priority,
    });
  }
  return candidates.sort((a, b) => a.priority - b.priority || a.label.localeCompare(b.label)).slice(0, limit);
}

export function listMilestonesApproaching(
  signals: ProgressionSignalSnapshot,
  limit = 3
): Array<{ milestoneId: string; title: string; coachCopy: string; panels: string[] }> {
  const approaching = UI_PROGRESSION_MILESTONES.filter(m => {
    const ev = evaluateUnlockRule(m.rule, signals);
    return !ev.ok && ev.reasons.length <= 2;
  });
  return approaching.slice(0, limit).map(m => ({
    milestoneId: m.id,
    title: m.title,
    coachCopy: m.coachCopy,
    panels: m.unlocksPanelIds,
  }));
}

export function computeProgressionCoverage(
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): { visible: number; preview: number; hidden: number; total: number; coverageRatio: number } {
  let visible = 0;
  let preview = 0;
  let hidden = 0;
  const total = Object.keys(EVOLVING_UI_PANEL_BY_ID).length;
  for (const id of Object.keys(EVOLVING_UI_PANEL_BY_ID)) {
    const st = resolveEvolvingPanelVisibility(id, signals, policy).state;
    if (st === 'visible') visible++;
    else if (st === 'preview') preview++;
    else hidden++;
  }
  return {
    visible,
    preview,
    hidden,
    total,
    coverageRatio: total > 0 ? visible / total : 0,
  };
}

export function pickCoachPanelForCategory(
  category: EvolvingPanelDefinition['category'],
  signals: ProgressionSignalSnapshot,
  policy: EvolvingUiAccessPolicy
): NextUnlockRecommendation | null {
  const recs = listNextUnlockRecommendations(signals, policy, 50);
  return recs.find(r => EVOLVING_UI_PANEL_BY_ID[r.panelId]?.category === category) ?? null;
}
