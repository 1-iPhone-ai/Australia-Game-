import { v1014laborClamp } from './bands';
import {
  type NationalConvergenceSafetyCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSafetyHarmonyOutlook,
  type NationalSubjectUnificationReadinessBrief,
  type NationalWorkforceUnificationIndex,
  type WorkforceUnificationBand
} from './types';

function unificationBand(index: number): WorkforceUnificationBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'unification';
}

export function computeNationalWorkforceUnificationIndex(
  state: NationalLaborDemographicsState,
  safetyCoupling: NationalConvergenceSafetyCouplingBrief | null | undefined,
  safetyHarmony: NationalSafetyHarmonyOutlook | null | undefined,
  subjectUnification: NationalSubjectUnificationReadinessBrief | null | undefined
): NationalWorkforceUnificationIndex {
  if (!state.enabled || !safetyCoupling || !safetyHarmony || !subjectUnification) {
    return {
      turn: state.turn,
      unificationIndex: 50,
      band: 'thin',
      unificationDrag: 0,
      summary: 'Workforce unification idle — safety coupling, safety harmony, or subject unification unavailable.',
      stewardNote: 'Compute O10-199 wave-34 depth stack before unification guidance.'
    };
  }

  const unificationDrag = v1014laborClamp(
    subjectUnification.unificationDrag * 0.35 +
      safetyCoupling.convergenceDrag * 0.3 +
      safetyHarmony.resonanceDrag * 0.25 +
      (subjectUnification.band === 'below_unification' || safetyCoupling.band === 'decoupled' ? 8 : 2)
  );
  const safetyLift =
    safetyCoupling.band === 'amplified' || safetyCoupling.band === 'elevated'
      ? safetyCoupling.couplingIndex * 0.2
      : safetyCoupling.couplingIndex * 0.1;
  const harmonyLift =
    safetyHarmony.band === 'rising' || safetyHarmony.band === 'harmony'
      ? safetyHarmony.harmonyIndex * 0.18
      : safetyHarmony.harmonyIndex * 0.09;
  const subjectLift =
    subjectUnification.band === 'unification_ready' || subjectUnification.band === 'convergence_locked'
      ? subjectUnification.unificationIndex * 0.22
      : subjectUnification.unificationIndex * 0.11;

  const unificationIndex = v1014laborClamp(18 + safetyLift + harmonyLift + subjectLift - unificationDrag);
  const band = unificationBand(unificationIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce unification — sequence convergence-safety, safety harmony, and subject unification before post-2187b54 tranche.'
      : band === 'unification'
        ? 'Unification band — avoid corridor overload that breaks subject unification bands.'
        : 'Elevated unification — refresh subject unification checks each scale wave.';

  return {
    turn: state.turn,
    unificationIndex,
    band,
    unificationDrag,
    summary: `National workforce unification ${band} (index ${Math.round(unificationIndex)}); unification drag ${Math.round(unificationDrag)}.`,
    stewardNote
  };
}
