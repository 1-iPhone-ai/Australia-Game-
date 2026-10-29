import { v1014laborClamp } from './bands';
import type {
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalRegionalLaborAbsorptionBrief,
  NationalWorkforceCapacityBridge,
  RegionalAbsorptionBand
} from './types';

function absorptionBand(index: number): RegionalAbsorptionBand {
  if (index <= 32) return 'saturated';
  if (index <= 48) return 'constrained';
  if (index <= 64) return 'absorbing';
  return 'headroom';
}

export function computeNationalRegionalLaborAbsorptionBrief(
  state: NationalLaborDemographicsState,
  capacity: NationalWorkforceCapacityBridge | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalRegionalLaborAbsorptionBrief {
  if (!state.enabled || !capacity || !tightness) {
    return {
      turn: state.turn,
      absorptionIndex: 50,
      band: 'constrained',
      migrationLoadDrag: 0,
      summary: 'Regional labor absorption idle — capacity or tightness unavailable.',
      stewardNote: 'Compute capacity bridge and tightness before absorption guidance.'
    };
  }

  const migrationLoadDrag =
    state.nationalMigrationFlow === 'strong_inflow'
      ? 18
      : state.nationalMigrationFlow === 'inflow'
        ? 12
        : state.nationalMigrationFlow === 'outflow' || state.nationalMigrationFlow === 'slight_outflow'
          ? 4
          : 8;
  const capacityEase =
    capacity.nationalBand === 'surplus'
      ? 16
      : capacity.nationalBand === 'balanced'
        ? 8
        : capacity.nationalBand === 'tight'
          ? 2
          : 0;
  const tightnessDrag =
    tightness.band === 'critical_shortage'
      ? 16
      : tightness.band === 'tight'
        ? 10
        : tightness.band === 'slack'
          ? -6
          : 0;

  const absorptionIndex = v1014laborClamp(
    36 + capacityEase + state.migrationFlowScore * 0.22 - migrationLoadDrag - tightnessDrag
  );
  const band = absorptionBand(absorptionIndex);

  const stewardNote =
    band === 'saturated' || band === 'constrained'
      ? 'Constrained absorption — sequence corridor moves and upskilling before stacking migration shocks.'
      : band === 'headroom'
        ? 'Absorption headroom — align inclusion levers with inbound corridor flows.'
        : 'Absorbing band — watch tightness before wage surges in inbound hubs.';

  return {
    turn: state.turn,
    absorptionIndex,
    band,
    migrationLoadDrag,
    summary: `Regional labor absorption ${band} (index ${Math.round(absorptionIndex)}); migration load drag ${Math.round(migrationLoadDrag)}.`,
    stewardNote
  };
}
