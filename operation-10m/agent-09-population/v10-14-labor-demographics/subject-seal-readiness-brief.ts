import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSubjectReleaseReadinessBrief,
  type NationalSubjectSealReadinessBrief,
  type NationalWorkforceSteadfastIndex,
  type SubjectSealReadinessBand
} from './types';

function sealBand(index: number): SubjectSealReadinessBand {
  if (index <= 34) return 'open';
  if (index <= 48) return 'pending';
  if (index <= 62) return 'sealed';
  return 'locked';
}

/** Round-23 subject seal readiness — release × steadfast gate for wave seal. */
export function computeNationalSubjectSealReadinessBrief(
  state: NationalLaborDemographicsState,
  subjectRelease: NationalSubjectReleaseReadinessBrief | null | undefined,
  steadfast: NationalWorkforceSteadfastIndex | null | undefined
): NationalSubjectSealReadinessBrief {
  if (!state.enabled || !subjectRelease || !steadfast) {
    return {
      turn: state.turn,
      sealIndex: 50,
      band: 'pending',
      sealDrag: 0,
      summary: 'Subject seal readiness idle — subject release or steadfast unavailable.',
      stewardNote: 'Compute subject release readiness and workforce steadfast before seal guidance.'
    };
  }

  const sealDrag = v1014laborClamp(
    subjectRelease.releaseDrag * 0.38 +
      steadfast.releaseDrag * 0.38 +
      (subjectRelease.band === 'held' || steadfast.band === 'fragile' ? 12 : 3)
  );
  const releaseLift =
    subjectRelease.band === 'release_ready' || subjectRelease.band === 'cleared'
      ? subjectRelease.releaseIndex * 0.27
      : subjectRelease.releaseIndex * 0.14;
  const steadfastLift =
    steadfast.band === 'steady' || steadfast.band === 'anchored'
      ? steadfast.steadfastIndex * 0.25
      : steadfast.steadfastIndex * 0.12;

  const sealIndex = v1014laborClamp(20 + releaseLift + steadfastLift - sealDrag);
  const band = sealBand(sealIndex);

  const stewardNote =
    band === 'open' || band === 'pending'
      ? 'Pending subject seal — hold O10-177 scale seal until steadfast-scheduling syncs.'
      : band === 'locked'
        ? 'Locked seal band — still monitor retention anchor during corridor peaks.'
        : 'Sealed band — pair with workforce resolve index each assembly tranche.';

  return {
    turn: state.turn,
    sealIndex,
    band,
    sealDrag,
    summary: `Subject seal readiness ${band} (index ${Math.round(sealIndex)}); seal drag ${Math.round(sealDrag)}.`,
    stewardNote
  };
}
