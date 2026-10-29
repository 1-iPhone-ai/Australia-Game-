import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectGritReadinessBrief,
  type NationalSubjectPerseveranceReadinessBrief,
  type NationalWorkforcePerseveranceDepthIndex,
  type SubjectGritReadinessBand
} from './types';

function gritBand(index: number): SubjectGritReadinessBand {
  if (index <= 34) return 'below_grit';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'grit_ready';
  return 'perseverance_locked';
}

/** Round-49 / wave-49 subject grit readiness — subject perseverance × perseverance depth (O10-229). */
export function computeNationalSubjectGritReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectPerseverance: NationalSubjectPerseveranceReadinessBrief | null | undefined,
  perseveranceDepth: NationalWorkforcePerseveranceDepthIndex | null | undefined
): NationalSubjectGritReadinessBrief {
  if (!state.enabled || !subjectPerseverance || !perseveranceDepth) {
    return {
      turn: state.turn,
      gritIndex: 50,
      band: 'approaching',
      gritDrag: 0,
      summary: 'Subject grit readiness idle — subject perseverance or perseverance depth unavailable.',
      stewardNote: 'Compute subject perseverance and perseverance depth before grit guidance.'
    };
  }

  const gritDrag = v1014laborClamp(
    subjectPerseverance.perseveranceDrag * 0.36 +
      perseveranceDepth.perseveranceDrag * 0.36 +
      (subjectPerseverance.band === 'below_perseverance' || perseveranceDepth.band === 'fragile' ? 12 : 3)
  );
  const subjectLift =
    subjectPerseverance.band === 'perseverance_ready' || subjectPerseverance.band === 'tenacity_locked'
      ? subjectPerseverance.perseveranceIndex * 0.25
      : subjectPerseverance.perseveranceIndex * 0.13;
  const depthLift =
    perseveranceDepth.band === 'elevated' || perseveranceDepth.band === 'perseverance'
      ? perseveranceDepth.perseveranceIndex * 0.23
      : perseveranceDepth.perseveranceIndex * 0.12;

  const gritIndex = v1014laborClamp(20 + subjectLift + depthLift - gritDrag);
  const band = gritBand(gritIndex);

  const stewardNote =
    band === 'below_grit' || band === 'approaching'
      ? 'Approaching grit — hold O10-229 wave-49 scale until perseverance-grit syncs.'
      : band === 'perseverance_locked'
        ? 'Perseverance-locked grit — still monitor grit resilience during corridor peaks.'
        : 'Grit-ready — pair with workforce grit depth index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    gritIndex,
    band,
    gritDrag,
    summary: `Subject grit readiness ${band} (index ${Math.round(gritIndex)}); grit drag ${Math.round(gritDrag)}.`,
    stewardNote
  };
}
