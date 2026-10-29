import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';
import type { EvolvingUiAccessPolicy } from '../types/access-policy.js';
import type { ProgressionSignalSnapshot } from '../types/progression.js';
import { buildUnlockHintForPanel } from './unlock-hint-formatter.js';
import { resolveEvolvingPanelVisibility } from './resolve-panel-visibility.js';

export interface PreviewPanelUnlockHintDayCoach {
  previewPanelId: string | null;
  coachCopy: string | null;
}

export function buildPreviewPanelUnlockHintDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  policy: EvolvingUiAccessPolicy;
  nextGameDay: number;
}): PreviewPanelUnlockHintDayCoach {
  for (const panel of Object.values(EVOLVING_UI_PANEL_BY_ID)) {
    const vis = resolveEvolvingPanelVisibility(panel.id, input.signals, input.policy);
    if (vis.state !== 'preview') continue;
    const hint = buildUnlockHintForPanel(panel, input.signals);
    if (hint === 'Unlocked') continue;
    return {
      previewPanelId: panel.id,
      coachCopy: `Day ${input.nextGameDay}: Preview — ${panel.label} unlocks when ${hint}.`,
    };
  }
  return { previewPanelId: null, coachCopy: null };
}
