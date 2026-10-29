import { v1014laborClamp } from './bands';
import { schedulingEaseForRegion } from './catalog/workforce-scheduling-levers';
import { safetyEaseForRegion } from './catalog/workforce-safety-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalCohesionCorridorCouplingBrief,
  type NationalLaborDemographicsState,
  type NationalSeasonalParticipationSwingOutlook,
  type NationalWorkforceReliabilityIndex,
  type WorkforceReliabilityBand
} from './types';

function reliabilityBand(index: number): WorkforceReliabilityBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'patchy';
  if (index <= 62) return 'reliable';
  return 'robust';
}

export function computeNationalWorkforceReliabilityIndex(
  state: NationalLaborDemographicsState,
  seasonal: NationalSeasonalParticipationSwingOutlook | null | undefined,
  coupling: NationalCohesionCorridorCouplingBrief | null | undefined
): NationalWorkforceReliabilityIndex {
  if (!state.enabled || !seasonal || !coupling) {
    return {
      turn: state.turn,
      reliabilityIndex: 50,
      band: 'patchy',
      couplingDrag: 0,
      summary: 'Workforce reliability idle — seasonal swing or cohesion-corridor coupling unavailable.',
      stewardNote: 'Compute seasonal swing and cohesion-corridor coupling before reliability guidance.'
    };
  }

  let leverLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    const industry = state.regions[regionId]?.dominantIndustry ?? null;
    leverLift += schedulingEaseForRegion(regionId, industry) * 0.55 + safetyEaseForRegion(regionId, industry) * 0.45;
  });
  leverLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const couplingDrag = v1014laborClamp(
    coupling.corridorDrag * 0.45 + (coupling.band === 'decoupled' || coupling.band === 'strained' ? 10 : 3)
  );
  const seasonalLift =
    seasonal.band === 'stable' || seasonal.band === 'managed' ? seasonal.swingIndex * 0.24 : seasonal.swingIndex * 0.12;
  const reliabilityIndex = v1014laborClamp(22 + seasonalLift + leverLift * 24 - couplingDrag - seasonal.seasonalDrag * 0.2);
  const band = reliabilityBand(reliabilityIndex);

  const stewardNote =
    band === 'fragile' || band === 'patchy'
      ? 'Patchy reliability — stack scheduling and safety levers before automation pushes.'
      : band === 'robust'
        ? 'Robust reliability — protect crew pools when corridor stress rises.'
        : 'Reliable band — monitor cohesion-corridor coupling during seasonal peaks.';

  return {
    turn: state.turn,
    reliabilityIndex,
    band,
    couplingDrag,
    summary: `National workforce reliability ${band} (index ${Math.round(reliabilityIndex)}); coupling drag ${Math.round(couplingDrag)}.`,
    stewardNote
  };
}
