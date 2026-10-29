import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectConvergenceReadinessBrief,
  type NationalSubjectUnificationReadinessBrief,
  type NationalWorkforceConvergenceIndex,
  type SubjectUnificationReadinessBand
} from './types';

function unificationBand(index: number): SubjectUnificationReadinessBand {
  if (index <= 34) return 'below_unification';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'unification_ready';
  return 'convergence_locked';
}

/** Round-34 / wave-34 subject unification readiness — convergence × workforce convergence (O10-199). */
export function computeNationalSubjectUnificationReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectConvergence: NationalSubjectConvergenceReadinessBrief | null | undefined,
  workforceConvergence: NationalWorkforceConvergenceIndex | null | undefined
): NationalSubjectUnificationReadinessBrief {
  if (!state.enabled || !subjectConvergence || !workforceConvergence) {
    return {
      turn: state.turn,
      unificationIndex: 50,
      band: 'approaching',
      unificationDrag: 0,
      summary: 'Subject unification readiness idle — subject convergence or workforce convergence unavailable.',
      stewardNote: 'Compute subject convergence and workforce convergence before unification guidance.'
    };
  }

  const unificationDrag = v1014laborClamp(
    subjectConvergence.convergenceDrag * 0.38 +
      workforceConvergence.convergenceDrag * 0.38 +
      (subjectConvergence.band === 'below_convergence' || workforceConvergence.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectConvergence.band === 'convergence_ready' || subjectConvergence.band === 'nexus_locked'
      ? subjectConvergence.convergenceIndex * 0.27
      : subjectConvergence.convergenceIndex * 0.14;
  const workforceLift =
    workforceConvergence.band === 'elevated' || workforceConvergence.band === 'convergence'
      ? workforceConvergence.convergenceIndex * 0.25
      : workforceConvergence.convergenceIndex * 0.12;

  const unificationIndex = v1014laborClamp(20 + subjectLift + workforceLift - unificationDrag);
  const band = unificationBand(unificationIndex);

  const stewardNote =
    band === 'below_unification' || band === 'approaching'
      ? 'Approaching unification — hold O10-199 wave-34 scale until convergence-safety syncs.'
      : band === 'convergence_locked'
        ? 'Convergence-locked unification — still monitor safety harmony during corridor peaks.'
        : 'Unification-ready — pair with workforce unification index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    unificationIndex,
    band,
    unificationDrag,
    summary: `Subject unification readiness ${band} (index ${Math.round(unificationIndex)}); unification drag ${Math.round(unificationDrag)}.`,
    stewardNote
  };
}
