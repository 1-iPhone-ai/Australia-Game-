import { modalFocusTrapCoachCopy } from './modal-focus-trap-registry.js';

export interface ModalFocusTrapDayCoach {
  trapActive: boolean;
  coachCopy: string | null;
}

export function buildModalFocusTrapDayCoach(input: {
  openModalId: string | null | undefined;
  nextGameDay: number;
}): ModalFocusTrapDayCoach {
  const trapActive = Boolean(input.openModalId);
  const base = modalFocusTrapCoachCopy(input.openModalId ?? null);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return { trapActive, coachCopy };
}
