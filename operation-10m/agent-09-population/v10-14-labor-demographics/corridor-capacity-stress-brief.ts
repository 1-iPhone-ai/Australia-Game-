import { v1014laborClamp } from './bands';
import type {
  CorridorCapacityStressBand,
  InterregionalLaborRebalancingPlan,
  NationalCorridorCapacityStressBrief,
  NationalLaborDemographicsState,
  NationalLaborMarketTightnessBrief,
  NationalLaborRebalancingStressBrief,
  NationalRegionalLaborAbsorptionBrief
} from './types';

function stressBand(index: number): CorridorCapacityStressBand {
  if (index <= 32) return 'relief';
  if (index <= 48) return 'balanced';
  if (index <= 64) return 'stressed';
  return 'overloaded';
}

export function computeNationalCorridorCapacityStressBrief(
  state: NationalLaborDemographicsState,
  plan: InterregionalLaborRebalancingPlan | null | undefined,
  absorption: NationalRegionalLaborAbsorptionBrief | null | undefined,
  rebalancingStress: NationalLaborRebalancingStressBrief | null | undefined,
  tightness: NationalLaborMarketTightnessBrief | null | undefined
): NationalCorridorCapacityStressBrief {
  if (!state.enabled || !plan || !absorption || !rebalancingStress || !tightness) {
    return {
      turn: state.turn,
      stressIndex: 50,
      band: 'balanced',
      corridorMoveDrag: 0,
      summary: 'Corridor capacity stress idle — plan, absorption, stress, or tightness unavailable.',
      stewardNote: 'Compute rebalancing plan and absorption before corridor stress guidance.'
    };
  }

  const corridorMoveDrag = v1014laborClamp(plan.moves.length * 2.2 + rebalancingStress.highPriorityMoves * 5);
  const absorptionDrag =
    absorption.band === 'saturated'
      ? 16
      : absorption.band === 'constrained'
        ? 10
        : 0;
  const tightnessDrag =
    tightness.band === 'critical_shortage' ? 14 : tightness.band === 'tight' ? 8 : 0;
  const stressLift = rebalancingStress.stressIndex * 0.18;

  const stressIndex = v1014laborClamp(26 + corridorMoveDrag + absorptionDrag + tightnessDrag + stressLift * 0.35);
  const band = stressBand(stressIndex);

  const stewardNote =
    band === 'overloaded' || band === 'stressed'
      ? 'Stressed corridor capacity — pause high-priority moves until absorption headroom returns.'
      : band === 'relief'
        ? 'Corridor relief band — align mentorship levers before scaling remote participation.'
        : 'Balanced corridor stress — monitor tightness in inbound shock regions.';

  return {
    turn: state.turn,
    stressIndex,
    band,
    corridorMoveDrag,
    summary: `Corridor capacity stress ${band} (index ${Math.round(stressIndex)}); move drag ${Math.round(corridorMoveDrag)}.`,
    stewardNote
  };
}
