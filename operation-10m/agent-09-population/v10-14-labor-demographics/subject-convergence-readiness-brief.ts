import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectConvergenceReadinessBrief,
  type NationalSubjectNexusReadinessBrief,
  type NationalWorkforceNexusIndex,
  type SubjectConvergenceReadinessBand
} from './types';

function convergenceBand(index: number): SubjectConvergenceReadinessBand {
  if (index <= 34) return 'below_convergence';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'convergence_ready';
  return 'nexus_locked';
}

/** Round-33 / wave-33 subject convergence readiness — nexus × workforce nexus (O10-197). */
export function computeNationalSubjectConvergenceReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectNexus: NationalSubjectNexusReadinessBrief | null | undefined,
  workforceNexus: NationalWorkforceNexusIndex | null | undefined
): NationalSubjectConvergenceReadinessBrief {
  if (!state.enabled || !subjectNexus || !workforceNexus) {
    return {
      turn: state.turn,
      convergenceIndex: 50,
      band: 'approaching',
      convergenceDrag: 0,
      summary: 'Subject convergence readiness idle — subject nexus or workforce nexus unavailable.',
      stewardNote: 'Compute subject nexus and workforce nexus before convergence guidance.'
    };
  }

  const convergenceDrag = v1014laborClamp(
    subjectNexus.nexusDrag * 0.38 +
      workforceNexus.nexusDrag * 0.38 +
      (subjectNexus.band === 'below_nexus' || workforceNexus.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectNexus.band === 'nexus_ready' || subjectNexus.band === 'sealed_locked'
      ? subjectNexus.nexusIndex * 0.27
      : subjectNexus.nexusIndex * 0.14;
  const workforceLift =
    workforceNexus.band === 'elevated' || workforceNexus.band === 'nexus'
      ? workforceNexus.nexusIndex * 0.25
      : workforceNexus.nexusIndex * 0.12;

  const convergenceIndex = v1014laborClamp(20 + subjectLift + workforceLift - convergenceDrag);
  const band = convergenceBand(convergenceIndex);

  const stewardNote =
    band === 'below_convergence' || band === 'approaching'
      ? 'Approaching convergence — hold O10-197 wave-33 scale until nexus-scheduling syncs.'
      : band === 'nexus_locked'
        ? 'Nexus-locked convergence — still monitor scheduling resonance during corridor peaks.'
        : 'Convergence-ready — pair with workforce convergence index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    convergenceIndex,
    band,
    convergenceDrag,
    summary: `Subject convergence readiness ${band} (index ${Math.round(convergenceIndex)}); convergence drag ${Math.round(convergenceDrag)}.`,
    stewardNote
  };
}
