import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalDependencyRatioSnapshot,
  type NationalLaborDemographicsState,
  type NationalParticipationPressureBrief,
  type NationalSeniorWorkforceRetentionOutlook,
  type SeniorRetentionBand
} from './types';

function seniorRetentionBand(index: number): SeniorRetentionBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'stable';
  return 'anchored';
}

export function computeNationalSeniorWorkforceRetentionOutlook(
  state: NationalLaborDemographicsState,
  dependency: NationalDependencyRatioSnapshot | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalSeniorWorkforceRetentionOutlook {
  if (!state.enabled || !dependency || !participation) {
    return {
      turn: state.turn,
      retentionIndex: 50,
      band: 'strained',
      agedPressureDrag: 0,
      summary: 'Senior retention outlook idle — dependency or participation unavailable.',
      stewardNote: 'Compute dependency and participation before senior retention guidance.'
    };
  }

  const agedPressureDrag =
    dependency.nationalBand === 'aged_pressure'
      ? 20
      : dependency.nationalBand === 'aging'
        ? 14
        : dependency.nationalBand === 'balanced'
          ? 6
          : 0;

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const participationLift = participation.participationIndex * 0.28;
  const linkageLift = state.employmentLinkageScore * 0.18;
  const participationDrag =
    participation.band === 'shrinking' ? 12 : participation.band === 'constrained' ? 7 : 0;

  const retentionIndex = v1014laborClamp(
    32 + participationLift + linkageLift + retentionLift * 22 - agedPressureDrag - participationDrag
  );
  const band = seniorRetentionBand(retentionIndex);

  const stewardNote =
    band === 'fragile' || band === 'strained'
      ? 'Strained senior retention — pair retention levers with elder-care relief before automation stacks.'
      : band === 'anchored'
        ? 'Anchored senior retention — avoid hyper-mobility corridors that drain aged-support regions.'
        : 'Stable senior retention — monitor aged-pressure regions for participation drag.';

  return {
    turn: state.turn,
    retentionIndex,
    band,
    agedPressureDrag,
    summary: `Senior workforce retention ${band} (index ${Math.round(retentionIndex)}); aged drag ${Math.round(agedPressureDrag)}.`,
    stewardNote
  };
}
