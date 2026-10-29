import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalNexusSchedulingCouplingBrief,
  type NationalSchedulingResonanceOutlook,
  type NationalSubjectConvergenceReadinessBrief,
  type NationalWorkforceConvergenceIndex,
  type WorkforceConvergenceBand
} from './types';

function convergenceBand(index: number): WorkforceConvergenceBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'elevated';
  return 'convergence';
}

export function computeNationalWorkforceConvergenceIndex(
  state: NationalLaborDemographicsState,
  schedulingCoupling: NationalNexusSchedulingCouplingBrief | null | undefined,
  schedulingResonance: NationalSchedulingResonanceOutlook | null | undefined,
  subjectConvergence: NationalSubjectConvergenceReadinessBrief | null | undefined
): NationalWorkforceConvergenceIndex {
  if (!state.enabled || !schedulingCoupling || !schedulingResonance || !subjectConvergence) {
    return {
      turn: state.turn,
      convergenceIndex: 50,
      band: 'thin',
      convergenceDrag: 0,
      summary: 'Workforce convergence idle — scheduling coupling, scheduling resonance, or subject convergence unavailable.',
      stewardNote: 'Compute O10-197 wave-33 depth stack before convergence guidance.'
    };
  }

  const convergenceDrag = v1014laborClamp(
    subjectConvergence.convergenceDrag * 0.35 +
      schedulingCoupling.nexusDrag * 0.3 +
      schedulingResonance.equilibriumDrag * 0.25 +
      (subjectConvergence.band === 'below_convergence' || schedulingCoupling.band === 'decoupled' ? 8 : 2)
  );
  const schedulingLift =
    schedulingCoupling.band === 'amplified' || schedulingCoupling.band === 'elevated'
      ? schedulingCoupling.couplingIndex * 0.2
      : schedulingCoupling.couplingIndex * 0.1;
  const resonanceLift =
    schedulingResonance.band === 'rising' || schedulingResonance.band === 'resonance'
      ? schedulingResonance.resonanceIndex * 0.18
      : schedulingResonance.resonanceIndex * 0.09;
  const subjectLift =
    subjectConvergence.band === 'convergence_ready' || subjectConvergence.band === 'nexus_locked'
      ? subjectConvergence.convergenceIndex * 0.22
      : subjectConvergence.convergenceIndex * 0.11;

  const convergenceIndex = v1014laborClamp(18 + schedulingLift + resonanceLift + subjectLift - convergenceDrag);
  const band = convergenceBand(convergenceIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce convergence — sequence nexus-scheduling, scheduling resonance, and subject convergence before post-c5f6d0b tranche.'
      : band === 'convergence'
        ? 'Convergence band — avoid corridor overload that breaks subject convergence bands.'
        : 'Elevated convergence — refresh subject convergence checks each scale wave.';

  return {
    turn: state.turn,
    convergenceIndex,
    band,
    convergenceDrag,
    summary: `National workforce convergence ${band} (index ${Math.round(convergenceIndex)}); convergence drag ${Math.round(convergenceDrag)}.`,
    stewardNote
  };
}
