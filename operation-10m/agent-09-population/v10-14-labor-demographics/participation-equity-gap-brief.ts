import { v1014laborClamp } from './bands';
import { flexibilityEaseForRegion } from './catalog/workforce-flexibility-levers';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalParticipationEquityGapBrief,
  type NationalUnderemploymentPressureBrief,
  type ParticipationEquityBand
} from './types';

function equityBand(index: number): ParticipationEquityBand {
  if (index <= 34) return 'wide_gap';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'narrowing';
  return 'inclusive';
}

export function computeNationalParticipationEquityGapBrief(
  state: NationalLaborDemographicsState,
  underemployment: NationalUnderemploymentPressureBrief | null | undefined
): NationalParticipationEquityGapBrief {
  if (!state.enabled || !underemployment) {
    return {
      turn: state.turn,
      equityIndex: 50,
      band: 'uneven',
      inclusionEaseLift: 0,
      summary: 'Participation equity gap idle — underemployment brief unavailable.',
      stewardNote: 'Compute underemployment before participation equity guidance.'
    };
  }

  let inclusionEaseLift = 0;
  let flexibilityLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const industry = state.regions[regionId]?.dominantIndustry ?? null;
    inclusionEaseLift += inclusionEaseForRegion(regionId, industry);
    flexibilityLift += flexibilityEaseForRegion(regionId, industry);
  });
  inclusionEaseLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);
  flexibilityLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const slackDrag =
    underemployment.band === 'severe_underuse'
      ? 18
      : underemployment.band === 'tight_hidden'
        ? 12
        : underemployment.band === 'mixed'
          ? 6
          : 0;
  const linkageDrag = Math.max(0, underemployment.linkageParticipationGap * 0.35);

  const equityIndex = v1014laborClamp(
    28 +
      inclusionEaseLift * 24 +
      flexibilityLift * 16 +
      state.employmentLinkageScore * 0.15 -
      slackDrag -
      linkageDrag
  );
  const band = equityBand(equityIndex);

  const stewardNote =
    band === 'wide_gap' || band === 'uneven'
      ? 'Uneven participation equity — deploy inclusion and flexibility levers before wage competitiveness pushes.'
      : band === 'inclusive'
        ? 'Inclusive equity band — maintain flexibility packs while scaling corridor absorption.'
        : 'Narrowing equity gap — monitor hidden underemployment in strained hubs.';

  return {
    turn: state.turn,
    equityIndex,
    band,
    inclusionEaseLift,
    summary: `Participation equity ${band.replace('_', ' ')} (index ${Math.round(equityIndex)}); inclusion ease ${Math.round(inclusionEaseLift * 100)}%.`,
    stewardNote
  };
}
