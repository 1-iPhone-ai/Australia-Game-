import { v1014laborClamp } from './bands';
import { retentionPullForRegion } from './catalog/workforce-retention-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalRetentionReliabilityCouplingBrief,
  type NationalWorkforceReliabilityIndex,
  type RetentionReliabilityCouplingBand
} from './types';

function couplingBand(index: number): RetentionReliabilityCouplingBand {
  if (index <= 34) return 'fragile';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'anchored';
  return 'reinforced';
}

export function computeNationalRetentionReliabilityCouplingBrief(
  state: NationalLaborDemographicsState,
  reliability: NationalWorkforceReliabilityIndex | null | undefined
): NationalRetentionReliabilityCouplingBrief {
  if (!state.enabled || !reliability) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      reliabilityDrag: 0,
      summary: 'Retention-reliability coupling idle — workforce reliability unavailable.',
      stewardNote: 'Compute workforce reliability before retention coupling guidance.'
    };
  }

  let retentionLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    retentionLift += retentionPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  retentionLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const reliabilityDrag = v1014laborClamp(
    reliability.couplingDrag * 0.5 +
      (reliability.band === 'fragile' || reliability.band === 'patchy' ? 12 : 4)
  );
  const reliabilityLift =
    reliability.band === 'reliable' || reliability.band === 'robust'
      ? reliability.reliabilityIndex * 0.26
      : reliability.reliabilityIndex * 0.14;

  const couplingIndex = v1014laborClamp(24 + retentionLift * 22 + reliabilityLift - reliabilityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'fragile' || band === 'strained'
      ? 'Strained retention-reliability link — stack retention levers before seasonal corridor moves.'
      : band === 'reinforced'
        ? 'Reinforced coupling — protect career ladders when reliability dips patchy.'
        : 'Anchored coupling — pair retention packs with scheduling relief in strain hubs.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    reliabilityDrag,
    summary: `Retention-reliability coupling ${band} (index ${Math.round(couplingIndex)}); reliability drag ${Math.round(reliabilityDrag)}.`,
    stewardNote
  };
}
