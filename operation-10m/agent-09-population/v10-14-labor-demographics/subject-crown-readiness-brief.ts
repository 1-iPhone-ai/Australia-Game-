import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectBindReadinessBrief,
  type NationalSubjectCrownReadinessBrief,
  type NationalWorkforceFortitudeIndex,
  type SubjectCrownReadinessBand
} from './types';

function crownBand(index: number): SubjectCrownReadinessBand {
  if (index <= 34) return 'uncrowned';
  if (index <= 48) return 'pending';
  if (index <= 62) return 'crowned';
  return 'sealed';
}

/** Round-25 subject crown readiness — bind × fortitude gate for wave-25 culmination. */
export function computeNationalSubjectCrownReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectBind: NationalSubjectBindReadinessBrief | null | undefined,
  fortitude: NationalWorkforceFortitudeIndex | null | undefined
): NationalSubjectCrownReadinessBrief {
  if (!state.enabled || !subjectBind || !fortitude) {
    return {
      turn: state.turn,
      crownIndex: 50,
      band: 'pending',
      crownDrag: 0,
      summary: 'Subject crown readiness idle — subject bind or fortitude unavailable.',
      stewardNote: 'Compute subject bind readiness and workforce fortitude before crown guidance.'
    };
  }

  const crownDrag = v1014laborClamp(
    subjectBind.bindDrag * 0.38 +
      fortitude.bindDrag * 0.38 +
      (subjectBind.band === 'unbound' || fortitude.band === 'fragile' ? 12 : 3)
  );
  const bindLift =
    subjectBind.band === 'bound' || subjectBind.band === 'locked'
      ? subjectBind.bindIndex * 0.27
      : subjectBind.bindIndex * 0.14;
  const fortitudeLift =
    fortitude.band === 'solid' || fortitude.band === 'unshakable'
      ? fortitude.fortitudeIndex * 0.25
      : fortitude.fortitudeIndex * 0.12;

  const crownIndex = v1014laborClamp(20 + bindLift + fortitudeLift - crownDrag);
  const band = crownBand(crownIndex);

  const stewardNote =
    band === 'uncrowned' || band === 'pending'
      ? 'Pending subject crown — hold O10-181 scale crown until fortitude-inclusion syncs.'
      : band === 'sealed'
        ? 'Sealed crown band — still monitor hybrid anchor during corridor peaks.'
        : 'Crowned band — pair with workforce culmination index for Agent 25 merge tranche.';

  return {
    turn: state.turn,
    crownIndex,
    band,
    crownDrag,
    summary: `Subject crown readiness ${band} (index ${Math.round(crownIndex)}); crown drag ${Math.round(crownDrag)}.`,
    stewardNote
  };
}
