import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectApexReadinessBrief,
  type NationalSubjectCrownReadinessBrief,
  type NationalWorkforceCulminationIndex,
  type SubjectApexReadinessBand
} from './types';

function apexBand(index: number): SubjectApexReadinessBand {
  if (index <= 34) return 'below_apex';
  if (index <= 48) return 'approaching';
  if (index <= 62) return 'apex_ready';
  return 'summit_locked';
}

/** Round-26 / wave-26 subject apex readiness — crown × culmination gate (O10-183). */
export function computeNationalSubjectApexReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectCrown: NationalSubjectCrownReadinessBrief | null | undefined,
  culmination: NationalWorkforceCulminationIndex | null | undefined
): NationalSubjectApexReadinessBrief {
  if (!state.enabled || !subjectCrown || !culmination) {
    return {
      turn: state.turn,
      apexIndex: 50,
      band: 'approaching',
      apexDrag: 0,
      summary: 'Subject apex readiness idle — subject crown or culmination unavailable.',
      stewardNote: 'Compute subject crown readiness and workforce culmination before apex guidance.'
    };
  }

  const apexDrag = v1014laborClamp(
    subjectCrown.crownDrag * 0.38 +
      culmination.crownDrag * 0.38 +
      (subjectCrown.band === 'uncrowned' || culmination.band === 'fragile' ? 12 : 3)
  );
  const crownLift =
    subjectCrown.band === 'crowned' || subjectCrown.band === 'sealed'
      ? subjectCrown.crownIndex * 0.27
      : subjectCrown.crownIndex * 0.14;
  const culminationLift =
    culmination.band === 'ready' || culmination.band === 'summit'
      ? culmination.culminationIndex * 0.25
      : culmination.culminationIndex * 0.12;

  const apexIndex = v1014laborClamp(20 + crownLift + culminationLift - apexDrag);
  const band = apexBand(apexIndex);

  const stewardNote =
    band === 'below_apex' || band === 'approaching'
      ? 'Approaching apex — hold O10-183 wave-26 scale until culmination-mentorship syncs.'
      : band === 'summit_locked'
        ? 'Summit-locked apex — still monitor onboarding sustain during corridor peaks.'
        : 'Apex-ready — pair with workforce apex index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    apexIndex,
    band,
    apexDrag,
    summary: `Subject apex readiness ${band} (index ${Math.round(apexIndex)}); apex drag ${Math.round(apexDrag)}.`,
    stewardNote
  };
}
