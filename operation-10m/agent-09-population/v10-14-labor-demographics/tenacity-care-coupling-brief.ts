import { v1014laborClamp } from './bands';
import { careReliefForRegion } from './catalog/workforce-care-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalTenacityCareCouplingBrief,
  type NationalWorkforceTenacityIndex,
  type TenacityCareCouplingBand
} from './types';

function couplingBand(index: number): TenacityCareCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'supported';
  return 'nurtured';
}

export function computeNationalTenacityCareCouplingBrief(
  state: NationalLaborDemographicsState,
  tenacity: NationalWorkforceTenacityIndex | null | undefined
): NationalTenacityCareCouplingBrief {
  if (!state.enabled || !tenacity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      tenacityDrag: 0,
      summary: 'Tenacity-care coupling idle — workforce tenacity unavailable.',
      stewardNote: 'Compute workforce tenacity before care coupling guidance.'
    };
  }

  let careLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    careLift += careReliefForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  careLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const tenacityDrag = v1014laborClamp(
    tenacity.commitDrag * 0.48 +
      (tenacity.band === 'brittle' || tenacity.band === 'thin' ? 11 : 3)
  );
  const tenacityLift =
    tenacity.band === 'firm' || tenacity.band === 'fortified'
      ? tenacity.tenacityIndex * 0.24
      : tenacity.tenacityIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + careLift * 21 + tenacityLift - tenacityDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained tenacity-care link — ease care levers before round-22 release commits.'
      : band === 'nurtured'
        ? 'Nurtured coupling — guard safety spikes that drain care buffers.'
        : 'Supported coupling — pair care packs with subject release readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    tenacityDrag,
    summary: `Tenacity-care coupling ${band} (index ${Math.round(couplingIndex)}); tenacity drag ${Math.round(tenacityDrag)}.`,
    stewardNote
  };
}
