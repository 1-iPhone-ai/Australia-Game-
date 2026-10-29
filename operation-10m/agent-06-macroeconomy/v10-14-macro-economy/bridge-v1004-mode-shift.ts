import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroModeShiftSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.04 modes scenario shift spillover (Agent 04 domain; distinct from modes layer). */
export function readMacroModeShiftSpilloverFromV1004(inputs: MacroEconomyInputs): MacroModeShiftSpillover {
  const ms: any =
    inputs.modeShift ??
    inputs.modesScenarios?.shift ??
    inputs.scenarioRuntime?.modeShift ??
    inputs.gameModes?.shift;
  if (!ms) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const volatility = String(ms.volatilityBand ?? ms.shiftBand ?? ms.regimeBand ?? '');
  const alignment = String(ms.alignmentBand ?? ms.scenarioFit?.band ?? '');
  const handoff = String(ms.handoffBand ?? ms.transitionBand ?? '');

  if (volatility === 'disruptive' || volatility === 'critical' || volatility === 'chaotic') {
    cycleNudge -= 3;
    investmentNudge -= 1;
    summary = `Disruptive mode shift (${volatility}) unsettles macro cycle read.`;
  } else if (volatility === 'stable' || volatility === 'anchored') {
    cycleNudge += 0.5;
    summary = `Stable mode shift (${volatility}) anchors macro cycle read.`;
  }

  if (alignment === 'misaligned' || alignment === 'critical' || alignment === 'contradictory') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Misaligned scenario modes distort macro productivity interpretation.';
  }

  if (handoff === 'failed' || handoff === 'critical' || handoff === 'stalled') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Failed mode handoff drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroModeShiftSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroModeShiftSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
