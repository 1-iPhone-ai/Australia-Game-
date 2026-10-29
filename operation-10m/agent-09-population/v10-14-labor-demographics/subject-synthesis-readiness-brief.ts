import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectSynthesisReadinessBrief,
  type NationalSubjectUnificationReadinessBrief,
  type NationalWorkforceUnificationIndex,
  type SubjectSynthesisReadinessBand
} from './types';

function synthesisBand(index: number): SubjectSynthesisReadinessBand {
  if (index <= 34) return 'below_synthesis';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'synthesis_ready';
  return 'unification_locked';
}

/** Round-35 / wave-35 subject synthesis readiness — unification × workforce unification (O10-201). */
export function computeNationalSubjectSynthesisReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectUnification: NationalSubjectUnificationReadinessBrief | null | undefined,
  workforceUnification: NationalWorkforceUnificationIndex | null | undefined
): NationalSubjectSynthesisReadinessBrief {
  if (!state.enabled || !subjectUnification || !workforceUnification) {
    return {
      turn: state.turn,
      synthesisIndex: 50,
      band: 'approaching',
      synthesisDrag: 0,
      summary: 'Subject synthesis readiness idle — subject unification or workforce unification unavailable.',
      stewardNote: 'Compute subject unification and workforce unification before synthesis guidance.'
    };
  }

  const synthesisDrag = v1014laborClamp(
    subjectUnification.unificationDrag * 0.38 +
      workforceUnification.unificationDrag * 0.38 +
      (subjectUnification.band === 'below_unification' || workforceUnification.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectUnification.band === 'unification_ready' || subjectUnification.band === 'convergence_locked'
      ? subjectUnification.unificationIndex * 0.27
      : subjectUnification.unificationIndex * 0.14;
  const workforceLift =
    workforceUnification.band === 'elevated' || workforceUnification.band === 'unification'
      ? workforceUnification.unificationIndex * 0.25
      : workforceUnification.unificationIndex * 0.12;

  const synthesisIndex = v1014laborClamp(20 + subjectLift + workforceLift - synthesisDrag);
  const band = synthesisBand(synthesisIndex);

  const stewardNote =
    band === 'below_synthesis' || band === 'approaching'
      ? 'Approaching synthesis — hold O10-201 wave-35 scale until unification-upskilling syncs.'
      : band === 'unification_locked'
        ? 'Unification-locked synthesis — still monitor upskilling synthesis during corridor peaks.'
        : 'Synthesis-ready — pair with workforce synthesis index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    synthesisIndex,
    band,
    synthesisDrag,
    summary: `Subject synthesis readiness ${band} (index ${Math.round(synthesisIndex)}); synthesis drag ${Math.round(synthesisDrag)}.`,
    stewardNote
  };
}
