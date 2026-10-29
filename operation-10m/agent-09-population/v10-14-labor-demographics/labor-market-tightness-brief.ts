import { v1014laborClamp } from './bands';
import type {
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalUnderemploymentPressureBrief,
  NationalWorkforceCapacityBridge,
  TightnessBand
} from './types';

function tightnessBand(index: number): TightnessBand {
  if (index <= 32) return 'slack';
  if (index <= 48) return 'balanced';
  if (index <= 64) return 'tight';
  return 'critical_shortage';
}

export function computeNationalLaborMarketTightnessBrief(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  capacity: NationalWorkforceCapacityBridge | null | undefined,
  underemployment: NationalUnderemploymentPressureBrief | null | undefined
): NationalLaborMarketTightnessBrief {
  if (!state.enabled || !brief || !capacity) {
    return {
      turn: state.turn,
      tightnessIndex: 50,
      band: 'balanced',
      capacityGapDrag: 0,
      summary: 'Labor market tightness idle — integrated brief or capacity bridge unavailable.',
      stewardNote: 'Enable labor demographics before tightness guidance.'
    };
  }

  const capacityGapDrag =
    capacity.nationalBand === 'critical_gap'
      ? 22
      : capacity.nationalBand === 'tight'
        ? 14
        : capacity.nationalBand === 'balanced'
          ? 4
          : 0;
  const pressureLift = brief.compositePressureIndex * 0.35 + state.wagePressureScore * 0.25;
  const slackEase =
    underemployment?.band === 'slack' || underemployment?.band === 'mixed'
      ? (underemployment?.underemploymentIndex ?? 50) * 0.18
      : 0;

  const tightnessIndex = v1014laborClamp(28 + capacityGapDrag + pressureLift - slackEase);
  const band = tightnessBand(tightnessIndex);

  const stewardNote =
    band === 'critical_shortage' || band === 'tight'
      ? 'Tight labor market — sequence upskilling and corridor moves before wage surges.'
      : band === 'slack'
        ? 'Slack tightness — monitor hidden underemployment before cutting inclusion levers.'
        : 'Balanced tightness — align capacity bridge with participation bands.';

  return {
    turn: state.turn,
    tightnessIndex,
    band,
    capacityGapDrag,
    summary: `Labor market tightness ${band.replace('_', ' ')} (index ${Math.round(tightnessIndex)}); capacity drag ${Math.round(capacityGapDrag)}.`,
    stewardNote
  };
}
