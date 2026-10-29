import { v1014laborClamp } from './bands';
import { upskillingUpliftForRegion } from './catalog/workforce-upskilling-programs';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalResolveUpskillingCouplingBrief,
  type NationalUpskillingVelocityOutlook,
  type NationalWorkforceResolveIndex,
  type ResolveUpskillingCouplingBand
} from './types';

function couplingBand(index: number): ResolveUpskillingCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'aligned';
  return 'accelerated';
}

export function computeNationalResolveUpskillingCouplingBrief(
  state: NationalLaborDemographicsState,
  resolve: NationalWorkforceResolveIndex | null | undefined,
  upskillingVelocity: NationalUpskillingVelocityOutlook | null | undefined
): NationalResolveUpskillingCouplingBrief {
  if (!state.enabled || !resolve || !upskillingVelocity) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      resolveDrag: 0,
      summary: 'Resolve-upskilling coupling idle — workforce resolve or upskilling velocity unavailable.',
      stewardNote: 'Compute workforce resolve and upskilling velocity before coupling guidance.'
    };
  }

  let upskillingLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    upskillingLift += upskillingUpliftForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  upskillingLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const resolveDrag = v1014laborClamp(
    resolve.sealDrag * 0.45 +
      upskillingVelocity.mismatchDrag * 0.35 +
      (resolve.band === 'fragile' || resolve.band === 'thin' ? 10 : 2)
  );
  const resolveLift =
    resolve.band === 'firm' || resolve.band === 'indomitable'
      ? resolve.resolveIndex * 0.22
      : resolve.resolveIndex * 0.11;
  const velocityLift =
    upskillingVelocity.band === 'active' || upskillingVelocity.band === 'accelerating'
      ? upskillingVelocity.velocityIndex * 0.2
      : upskillingVelocity.velocityIndex * 0.1;

  const couplingIndex = v1014laborClamp(22 + upskillingLift * 21 + resolveLift + velocityLift - resolveDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained resolve-upskilling link — deploy program levers before round-24 bind commits.'
      : band === 'accelerated'
        ? 'Accelerated coupling — guard coordination binds that drain upskilling buffers.'
        : 'Aligned coupling — pair upskilling packs with subject bind readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    resolveDrag,
    summary: `Resolve-upskilling coupling ${band} (index ${Math.round(couplingIndex)}); resolve drag ${Math.round(resolveDrag)}.`,
    stewardNote
  };
}
