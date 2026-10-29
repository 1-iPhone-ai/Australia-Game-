import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  modalFocusRestoreSkipLabel,
  resolveModalFocusRestorePlan,
} from './modal-focus-restoration.js';

export interface ModalFocusRestoreDayCoach {
  restoreEnabled: boolean;
  trapEnabled: boolean;
  coachCopy: string | null;
}

export function buildModalFocusRestoreDayCoach(input: {
  openModalId: string | null | undefined;
  lastNavTarget: string | null | undefined;
  accessibility: AccessibilitySettingsSnapshot;
  nextGameDay: number;
}): ModalFocusRestoreDayCoach {
  if (!input.openModalId) {
    return { restoreEnabled: false, trapEnabled: false, coachCopy: null };
  }
  const plan = resolveModalFocusRestorePlan({
    modalId: input.openModalId,
    lastNavTarget: input.lastNavTarget,
    accessibility: input.accessibility,
  });
  const coachCopy = `Day ${input.nextGameDay}: ${modalFocusRestoreSkipLabel(plan)}`;
  return {
    restoreEnabled: plan.restoreEnabled,
    trapEnabled: plan.trapEnabled,
    coachCopy,
  };
}
