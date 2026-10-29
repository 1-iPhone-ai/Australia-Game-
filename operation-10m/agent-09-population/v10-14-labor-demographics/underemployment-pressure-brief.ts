import { v1014laborClamp } from './bands';
import { inclusionEaseForRegion } from './catalog/workforce-inclusion-levers';
import { V1014_LABOR_CORE_REGIONS, type NationalUnderemploymentPressureBrief, type UnderemploymentPressureBand } from './types';
import type {
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalParticipationPressureBrief
} from './types';

function underemploymentBand(index: number): UnderemploymentPressureBand {
  if (index <= 32) return 'slack';
  if (index <= 48) return 'mixed';
  if (index <= 62) return 'tight_hidden';
  return 'severe_underuse';
}

export function computeNationalUnderemploymentPressureBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  participation: NationalParticipationPressureBrief | null | undefined
): NationalUnderemploymentPressureBrief {
  if (!state.enabled || !brief || !participation) {
    return {
      turn: state.turn,
      underemploymentIndex: 50,
      band: 'mixed',
      linkageParticipationGap: 0,
      summary: 'Underemployment outlook idle — labor layer off.',
      stewardNote: 'Enable labor demographics before underemployment guidance.'
    };
  }

  const linkageParticipationGap = v1014laborClamp(
    state.employmentLinkageScore - participation.participationIndex + brief.compositePressureIndex * 0.15
  );

  let inclusionEase = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    inclusionEase += inclusionEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  inclusionEase /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const hiddenSlackDrag =
    linkageParticipationGap >= 18 && participation.band !== 'expansionary' ? linkageParticipationGap * 0.55 : 0;
  const strainDrag = brief.pressureBand === 'critical' ? 12 : brief.pressureBand === 'elevated' ? 6 : 0;

  const underemploymentIndex = v1014laborClamp(
    28 + hiddenSlackDrag + strainDrag - inclusionEase * 22 - participation.participationIndex * 0.12
  );
  const band = underemploymentBand(underemploymentIndex);

  const stewardNote =
    band === 'severe_underuse' || band === 'tight_hidden'
      ? 'Hidden underemployment — deploy inclusion levers before forcing interregional rebalancing.'
      : band === 'slack'
        ? 'Participation slack — monitor linkage gaps before automation stacks.'
        : 'Mixed underemployment signals — align upskilling with participation bands.';

  return {
    turn: state.turn,
    underemploymentIndex,
    band,
    linkageParticipationGap,
    summary: `Underemployment ${band.replace('_', ' ')} (index ${Math.round(underemploymentIndex)}); linkage-participation gap ${Math.round(linkageParticipationGap)}.`,
    stewardNote
  };
}
