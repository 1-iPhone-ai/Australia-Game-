import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroModesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.6 modes / scenarios read-only spillover (never mutates mode state). */
export function readMacroModesSpilloverFromV1006(inputs: MacroEconomyInputs): MacroModesSpillover {
  const md: any =
    inputs.modesScenarios ??
    inputs.gameModes ??
    inputs.scenarioRuntime ??
    inputs.nationalSystems?.modes ??
    inputs.nationalSystems?.scenarios;
  if (!md) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const difficulty = String(md.difficultyBand ?? md.scenarioDifficulty?.band ?? md.pressureBand ?? '');
  const campaign = String(md.campaignMomentum?.band ?? md.campaignPhase?.band ?? md.progressBand ?? '');
  const volatility = String(md.scenarioVolatility?.band ?? md.modeVolatility?.band ?? '');

  if (difficulty === 'extreme' || difficulty === 'crisis' || difficulty === 'hardcore') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = `Elevated scenario difficulty (${difficulty}) drags macro cycle read.`;
  } else if (difficulty === 'sandbox' || difficulty === 'relaxed' || difficulty === 'tutorial') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = 'Relaxed scenario difficulty supports stable macro interpretation.';
  }

  if (campaign === 'summit_push' || campaign === 'ascent' || campaign === 'breakout') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong campaign momentum lifts macro investment read.';
  } else if (campaign === 'stalled' || campaign === 'regression' || campaign === 'retreat') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stalled campaign momentum weighs on macro cycle.';
  }

  if (volatility === 'high' || volatility === 'chaotic') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'High scenario volatility increases macro uncertainty read.';
  } else if (volatility === 'low' || volatility === 'stable') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroModesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroModesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
