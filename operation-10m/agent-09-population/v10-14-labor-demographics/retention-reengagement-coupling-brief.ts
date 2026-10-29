import { v1014laborClamp } from './bands';
import { reengagementPullForRegion } from './catalog/workforce-reengagement-levers';
import {
  V1014_LABOR_CORE_REGIONS,
  type NationalLaborDemographicsState,
  type NationalRetentionReengagementCouplingBrief,
  type NationalWorkforceRetentionIndex,
  type RetentionReengagementCouplingBand
} from './types';

function couplingBand(index: number): RetentionReengagementCouplingBand {
  if (index <= 34) return 'decoupled';
  if (index <= 48) return 'strained';
  if (index <= 62) return 'amplified';
  return 'elevated';
}

/** Round-38 / wave-38 retention-reengagement coupling — retention × reengagement (O10-207). */
export function computeNationalRetentionReengagementCouplingBrief(
  state: NationalLaborDemographicsState,
  retention: NationalWorkforceRetentionIndex | null | undefined
): NationalRetentionReengagementCouplingBrief {
  if (!state.enabled || !retention) {
    return {
      turn: state.turn,
      couplingIndex: 50,
      band: 'strained',
      retentionDrag: 0,
      summary: 'Retention-reengagement coupling idle — workforce retention unavailable.',
      stewardNote: 'Compute workforce retention before reengagement coupling guidance.'
    };
  }

  let reengagementLift = 0;
  V1014_LABOR_CORE_REGIONS.forEach(regionId => {
    reengagementLift += reengagementPullForRegion(regionId, state.regions[regionId]?.dominantIndustry ?? null);
  });
  reengagementLift /= Math.max(1, V1014_LABOR_CORE_REGIONS.length);

  const retentionDrag = v1014laborClamp(
    retention.retentionDrag * 0.48 + (retention.band === 'fragile' || retention.band === 'thin' ? 11 : 3)
  );
  const retentionLift =
    retention.band === 'elevated' || retention.band === 'retention'
      ? retention.retentionIndex * 0.24
      : retention.retentionIndex * 0.12;

  const couplingIndex = v1014laborClamp(22 + reengagementLift * 21 + retentionLift - retentionDrag);
  const band = couplingBand(couplingIndex);

  const stewardNote =
    band === 'decoupled' || band === 'strained'
      ? 'Strained retention-reengagement link — deploy reengagement levers before wave-38 reengagement commits.'
      : band === 'elevated'
        ? 'Elevated coupling — guard reengagement alignment spikes that drain retention buffers.'
        : 'Amplified coupling — pair reengagement packs with subject reengagement readiness checks.';

  return {
    turn: state.turn,
    couplingIndex,
    band,
    retentionDrag,
    summary: `Retention-reengagement coupling ${band} (index ${Math.round(couplingIndex)}); retention drag ${Math.round(retentionDrag)}.`,
    stewardNote
  };
}
