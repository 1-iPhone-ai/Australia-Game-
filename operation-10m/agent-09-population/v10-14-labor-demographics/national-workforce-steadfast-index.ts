import { v1014laborClamp } from './bands';
import {
  type NationalLaborDemographicsState,
  type NationalSafetyCohesionOutlook,
  type NationalSubjectReleaseReadinessBrief,
  type NationalTenacityCareCouplingBrief,
  type NationalWorkforceSteadfastIndex,
  type WorkforceSteadfastBand
} from './types';

function steadfastBand(index: number): WorkforceSteadfastBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'thin';
  if (index <= 62) return 'steady';
  return 'anchored';
}

export function computeNationalWorkforceSteadfastIndex(
  state: NationalLaborDemographicsState,
  careCoupling: NationalTenacityCareCouplingBrief | null | undefined,
  safetyCohesion: NationalSafetyCohesionOutlook | null | undefined,
  subjectRelease: NationalSubjectReleaseReadinessBrief | null | undefined
): NationalWorkforceSteadfastIndex {
  if (!state.enabled || !careCoupling || !safetyCohesion || !subjectRelease) {
    return {
      turn: state.turn,
      steadfastIndex: 50,
      band: 'thin',
      releaseDrag: 0,
      summary: 'Workforce steadfast idle — care coupling, safety cohesion, or subject release unavailable.',
      stewardNote: 'Compute round-22 depth stack before steadfast guidance.'
    };
  }

  const releaseDrag = v1014laborClamp(
    subjectRelease.releaseDrag * 0.35 +
      careCoupling.tenacityDrag * 0.3 +
      safetyCohesion.resilienceDrag * 0.25 +
      (subjectRelease.band === 'held' || careCoupling.band === 'decoupled' ? 8 : 2)
  );
  const careLift =
    careCoupling.band === 'supported' || careCoupling.band === 'nurtured'
      ? careCoupling.couplingIndex * 0.2
      : careCoupling.couplingIndex * 0.1;
  const safetyLift =
    safetyCohesion.band === 'guarded' || safetyCohesion.band === 'shielded'
      ? safetyCohesion.cohesionIndex * 0.18
      : safetyCohesion.cohesionIndex * 0.09;
  const releaseLift =
    subjectRelease.band === 'release_ready' || subjectRelease.band === 'cleared'
      ? subjectRelease.releaseIndex * 0.22
      : subjectRelease.releaseIndex * 0.11;

  const steadfastIndex = v1014laborClamp(18 + careLift + safetyLift + releaseLift - releaseDrag);
  const band = steadfastBand(steadfastIndex);

  const stewardNote =
    band === 'fragile' || band === 'thin'
      ? 'Thin workforce steadfast — sequence tenacity-care, safety cohesion, and subject release before post-634656bb tranche.'
      : band === 'anchored'
        ? 'Anchored steadfast — avoid corridor overload that breaks subject release bands.'
        : 'Steady steadfast — refresh subject release checks each scale wave.';

  return {
    turn: state.turn,
    steadfastIndex,
    band,
    releaseDrag,
    summary: `National workforce steadfast ${band} (index ${Math.round(steadfastIndex)}); release drag ${Math.round(releaseDrag)}.`,
    stewardNote
  };
}
