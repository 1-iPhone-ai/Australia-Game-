import { v1014laborClamp } from './bands';
import type {
  IntegratedLaborMarketBrief,
  NationalLaborDemographicsState,
  NationalSkillMismatchIndex,
  NationalWageCompetitivenessIndex,
  WageCompetitivenessBand
} from './types';

function competitivenessBand(index: number): WageCompetitivenessBand {
  if (index >= 68) return 'premium';
  if (index >= 52) return 'balanced';
  if (index >= 38) return 'stretched';
  return 'cost_burden';
}

export function computeNationalWageCompetitivenessIndex(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief | null | undefined,
  mismatch: NationalSkillMismatchIndex | null | undefined
): NationalWageCompetitivenessIndex {
  if (!state.enabled || !brief) {
    return {
      turn: state.turn,
      competitivenessIndex: 50,
      band: 'balanced',
      wagePressureDrag: 0,
      summary: 'Wage competitiveness idle — labor layer off.',
      stewardNote: 'Enable labor demographics before wage competitiveness guidance.'
    };
  }

  const wagePressureDrag = v1014laborClamp(state.wagePressureScore * 0.65 + brief.compositePressureIndex * 0.25);
  const mismatchDrag =
    mismatch?.nationalBand === 'critical_mismatch'
      ? 18
      : mismatch?.nationalBand === 'elevated_gap'
        ? 10
        : mismatch?.nationalBand === 'moderate_gap'
          ? 4
          : 0;
  const capacityLift =
    state.workforceCapacityBridge?.nationalBand === 'surplus'
      ? 14
      : state.workforceCapacityBridge?.nationalBand === 'balanced'
        ? 6
        : 0;
  const linkageLift = state.employmentLinkageScore * 0.28;

  const competitivenessIndex = v1014laborClamp(
    42 + linkageLift + capacityLift - wagePressureDrag * 0.55 - mismatchDrag
  );
  const band = competitivenessBand(competitivenessIndex);

  const stewardNote =
    band === 'cost_burden' || band === 'stretched'
      ? 'Wage competitiveness stretched — ease mismatch and capacity gaps before export-facing automation.'
      : band === 'premium'
        ? 'Premium competitiveness — avoid wage surges that erode participation cushions.'
        : 'Balanced wage competitiveness — monitor pressure hubs.';

  return {
    turn: state.turn,
    competitivenessIndex,
    band,
    wagePressureDrag,
    summary: `Wage competitiveness ${band.replace('_', ' ')} (index ${Math.round(competitivenessIndex)}); wage drag ${Math.round(wagePressureDrag)}.`,
    stewardNote
  };
}
