import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalRetentionAnchorOutlook,
  type NationalSafetyCohesionOutlook,
  type RetentionAnchorBand
} from './types';

function anchorBand(index: number): RetentionAnchorBand {
  if (index <= 34) return 'drifting';
  if (index <= 48) return 'loose';
  if (index <= 62) return 'anchored';
  return 'moored';
}

export function computeNationalRetentionAnchorOutlook(
  state: NationalLaborDemographicsState,
  safetyCohesion: NationalSafetyCohesionOutlook | null | undefined
): NationalRetentionAnchorOutlook {
  if (!state.enabled || !safetyCohesion) {
    return {
      turn: state.turn,
      anchorIndex: 50,
      band: 'loose',
      cohesionDrag: 0,
      summary: 'Retention anchor idle — safety cohesion unavailable.',
      stewardNote: 'Compute safety cohesion before retention anchor guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const cohesionDrag = v1014laborClamp(
    safetyCohesion.resilienceDrag * 0.46 +
      (safetyCohesion.band === 'exposed' || safetyCohesion.band === 'uneven' ? 10 : 3)
  );
  const safetyLift =
    safetyCohesion.band === 'guarded' || safetyCohesion.band === 'shielded'
      ? safetyCohesion.cohesionIndex * 0.2
      : safetyCohesion.cohesionIndex * 0.1;

  const anchorIndex = v1014laborClamp(24 + retentionLift * 22 + safetyLift - cohesionDrag);
  const band = anchorBand(anchorIndex);

  const stewardNote =
    band === 'drifting' || band === 'loose'
      ? 'Loose retention anchor — deploy retention levers before subject seal assembly.'
      : band === 'moored'
        ? 'Moored anchor band — verify steadfast-scheduling coupling before auto workforce pushes.'
        : 'Anchored retention — align anchor with seasonal participation swing checks.';

  return {
    turn: state.turn,
    anchorIndex,
    band,
    cohesionDrag,
    summary: `National retention anchor ${band} (index ${Math.round(anchorIndex)}); cohesion drag ${Math.round(cohesionDrag)}.`,
    stewardNote
  };
}
