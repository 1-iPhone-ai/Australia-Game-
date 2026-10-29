import { MODAL_PANELS } from '../registry/modal-panel-definitions.js';
import type { AccessibilitySettingsSnapshot } from '../types/accessibility.js';
import {
  modalFocusRestoreSkipLabel,
  resolveModalFocusRestorePlan,
} from './modal-focus-restoration.js';

export interface ModalFocusTrapEntry {
  modalId: string;
  panelId: string;
  trapEnabled: boolean;
  restoreEnabled: boolean;
}

export function listRegisteredModalFocusTraps(): ModalFocusTrapEntry[] {
  return MODAL_PANELS.map(panel => ({
    modalId: panel.id.replace(/^modal_/, '') + '_modal',
    panelId: panel.id,
    trapEnabled: true,
    restoreEnabled: true,
  }));
}

export function planModalFocusTrapStatus(input: {
  openModalId: string | null;
  lastNavTarget: string | null;
  accessibility: AccessibilitySettingsSnapshot;
}): {
  plan: ReturnType<typeof resolveModalFocusRestorePlan> | null;
  skipLabel: string | null;
} {
  if (!input.openModalId) {
    return { plan: null, skipLabel: null };
  }
  const plan = resolveModalFocusRestorePlan({
    modalId: input.openModalId,
    lastNavTarget: input.lastNavTarget,
    accessibility: input.accessibility,
  });
  return {
    plan,
    skipLabel: modalFocusRestoreSkipLabel(plan),
  };
}

export function modalFocusTrapCoachCopy(openModalId: string | null): string | null {
  if (!openModalId) return null;
  return `Focus is trapped in ${openModalId} until you dismiss it.`;
}
