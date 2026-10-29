import { v1014laborClamp } from './bands';
import type {
  InterregionalLaborRebalancingPlan,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalLaborRebalancingStressBrief,
  NationalRegionalLaborAbsorptionBrief,
  RebalancingStressBand
} from './types';

function stressBand(index: number): RebalancingStressBand {
  if (index <= 32) return 'manageable';
  if (index <= 48) return 'elevated';
  if (index <= 64) return 'acute';
  return 'critical';
}

export function computeNationalLaborRebalancingStressBrief(
  state: NationalLaborDemographicsState,
  plan: InterregionalLaborRebalancingPlan | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalLaborRebalancingStressBrief {
  if (!state.enabled || !plan || !absorption || !tightness) {
    return {
      turn: state.turn,
      stressIndex: 50,
      band: 'elevated',
      highPriorityMoves: 0,
      summary: 'Rebalancing stress idle — plan, absorption, or tightness unavailable.',
      stewardNote: 'Compute rebalancing plan and absorption before stress guidance.'
    };
  }

  const highPriorityMoves = plan.moves.filter(m => m.priority === 'high').length;
  const moveDrag = highPriorityMoves * 6 + plan.moves.length * 1.5;
  const absorptionDrag =
    absorption.band === 'saturated'
      ? 16
      : absorption.band === 'constrained'
        ? 10
        : absorption.band === 'absorbing'
          ? 4
          : 0;
  const tightnessDrag =
    tightness.band === 'critical_shortage' ? 14 : tightness.band === 'tight' ? 8 : 0;

  const stressIndex = v1014laborClamp(26 + moveDrag + absorptionDrag + tightnessDrag);
  const band = stressBand(stressIndex);

  const stewardNote =
    band === 'critical' || band === 'acute'
      ? 'Acute rebalancing stress — pause stacked corridor moves until absorption headroom returns.'
      : band === 'manageable'
        ? 'Manageable stress — align high-priority moves with upskilling before wage surges.'
        : 'Elevated stress — sequence retention levers before interregional auto commits.';

  return {
    turn: state.turn,
    stressIndex,
    band,
    highPriorityMoves,
    summary: `Labor rebalancing stress ${band} (index ${Math.round(stressIndex)}); ${highPriorityMoves} high-priority move(s).`,
    stewardNote
  };
}
