import { v1014laborClamp } from './bands';
import { schedulingEaseForRegion } from './catalog/workforce-scheduling-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalEssentialWorkerParticipationOutlook,
  type NationalLaborDemographicsState,
  type NationalLaborMarketTightnessBrief,
  type SeasonalParticipationSwingBand,
  type NationalSeasonalParticipationSwingOutlook
} from './types';

function swingBand(index: number): SeasonalParticipationSwingBand {
  if (index <= 34) return 'volatile';
  if (index <= 48) return 'uneven';
  if (index <= 62) return 'managed';
  return 'stable';
}

export function computeNationalSeasonalParticipationSwingOutlook(
  state: NationalLaborDemographicsState,
  essential: NationalEssentialWorkerParticipationOutlook | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalSeasonalParticipationSwingOutlook {
  if (!state.enabled || !essential || !tightness) {
    return {
      turn: state.turn,
      swingIndex: 50,
      band: 'uneven',
      seasonalDrag: 0,
      summary: 'Seasonal participation swing idle — essential or tightness unavailable.',
      stewardNote: 'Compute essential-worker and tightness briefs before seasonal swing guidance.'
    };
  }

  let schedulingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    schedulingLift += schedulingEaseForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  schedulingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const seasonalDrag = v1014laborClamp(
    (tightness.band === 'critical_shortage' || tightness.band === 'tight' ? 14 : 6) +
      essential.shockDrag * 0.35
  );
  const essentialLift = essential.essentialIndex * 0.22;
  const swingIndex = v1014laborClamp(26 + essentialLift + schedulingLift * 22 - seasonalDrag);
  const band = swingBand(swingIndex);

  const stewardNote =
    band === 'volatile' || band === 'uneven'
      ? 'Uneven seasonal swing — deploy scheduling levers before corridor-heavy moves.'
      : band === 'stable'
        ? 'Stable seasonal band — avoid stacked shocks that thin crew pools.'
        : 'Managed swing — monitor essential participation during peak windows.';

  return {
    turn: state.turn,
    swingIndex,
    band,
    seasonalDrag,
    summary: `Seasonal participation swing ${band} (index ${Math.round(swingIndex)}); seasonal drag ${Math.round(seasonalDrag)}.`,
    stewardNote
  };
}
