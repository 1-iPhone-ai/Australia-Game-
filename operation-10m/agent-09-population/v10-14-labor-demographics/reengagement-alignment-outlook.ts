import { v1014laborClamp } from './bands';
import { reengagementPullForRegion } from './catalog/workforce-reengagement-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalReengagementAlignmentOutlook,
  type NationalRetentionCohesionOutlook,
  type ReengagementAlignmentBand
} from './types';

function alignmentBand(index: number): ReengagementAlignmentBand {
  if (index <= 34) return 'ebbing';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'rising';
  return 'aligned';
}

export function computeNationalReengagementAlignmentOutlook(
  state: NationalLaborDemographicsState,
  retentionCohesion: NationalRetentionCohesionOutlook | null | undefined
): NationalReengagementAlignmentOutlook {
  if (!state.enabled || !retentionCohesion) {
    return {
      turn: state.turn,
      alignmentIndex: 50,
      band: 'patchy',
      retentionDrag: 0,
      summary: 'Reengagement alignment idle — retention cohesion unavailable.',
      stewardNote: 'Compute retention cohesion before reengagement alignment guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const retentionDrag = v1014laborClamp(
    retentionCohesion.integrationDrag * 0.46 +
      (retentionCohesion.band === 'ebbing' || retentionCohesion.band === 'patchy' ? 10 : 3)
  );
  const cohesionLift =
    retentionCohesion.band === 'rising' || retentionCohesion.band === 'cohesion'
      ? retentionCohesion.cohesionIndex * 0.2
      : retentionCohesion.cohesionIndex * 0.1;

  const alignmentIndex = v1014laborClamp(24 + reengagementLift * 22 + cohesionLift - retentionDrag);
  const band = alignmentBand(alignmentIndex);

  const stewardNote =
    band === 'ebbing' || band === 'patchy'
      ? 'Patchy reengagement alignment — deploy reengagement levers before subject reengagement assembly.'
      : band === 'aligned'
        ? 'Aligned band — verify retention-reengagement coupling before auto workforce pushes.'
        : 'Rising alignment — align with retention cohesion outlook checks.';

  return {
    turn: state.turn,
    alignmentIndex,
    band,
    retentionDrag,
    summary: `National reengagement alignment ${band} (index ${Math.round(alignmentIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}
