import { shouldRestoreFocusOnClose, shouldTrapFocusInModal } from '../a11y/focus-management.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import { EVOLVING_UI_PANEL_BY_ID } from '../registry/panel-definitions.js';

export interface ModalFocusRestorePlan {
  restoreSelector: string;
  restoreLabel: string;
  trapEnabled: boolean;
  restoreEnabled: boolean;
  announceOnClose: string;
}

const DEFAULT_RESTORE_SELECTOR = '[data-evolving-ui-nav-focus="primary"]';

export function navSelectorForTarget(navTarget: string | null | undefined): string {
  if (!navTarget) return DEFAULT_RESTORE_SELECTOR;
  return `[data-nav-target="${navTarget}"]`;
}

export function resolveModalFocusRestorePlan(input: {
  modalId: string;
  lastNavTarget?: string | null;
  accessibility: AccessibilitySettingsSnapshot;
}): ModalFocusRestorePlan {
  const trapEnabled = shouldTrapFocusInModal(input.accessibility);
  const restoreEnabled = shouldRestoreFocusOnClose(input.accessibility);
  const navTarget = input.lastNavTarget ?? null;
  const panel = navTarget
    ? Object.values(EVOLVING_UI_PANEL_BY_ID).find(p => p.navTarget === navTarget)
    : undefined;
  const restoreLabel = panel?.label ?? (navTarget ? `Return to ${navTarget}` : 'Return to primary navigation');
  const restoreSelector = navSelectorForTarget(navTarget);

  const announceOnClose = restoreEnabled
    ? `Closing ${input.modalId}. Focus returns to ${restoreLabel}.`
    : `Closing ${input.modalId}.`;

  return {
    restoreSelector,
    restoreLabel,
    trapEnabled,
    restoreEnabled,
    announceOnClose,
  };
}

export function modalFocusRestoreSkipLabel(plan: ModalFocusRestorePlan): string {
  return `After closing, focus returns to ${plan.restoreLabel}`;
}
