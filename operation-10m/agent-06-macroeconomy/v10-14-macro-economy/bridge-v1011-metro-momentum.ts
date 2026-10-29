import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroMetroMomentumSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.11 metro growth momentum spillover (Agent 11 domain; distinct from cities layer). */
export function readMacroMetroMomentumSpilloverFromV1011(inputs: MacroEconomyInputs): MacroMetroMomentumSpillover {
  const metro: any =
    inputs.metroMomentum ??
    inputs.citiesRegions?.momentum ??
    inputs.metropolitanSystems?.growthMomentum ??
    inputs.urbanRegions?.momentum;
  if (!metro) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const growth = String(metro.growthBand ?? metro.momentumBand ?? metro.expansionBand ?? '');
  const congestion = String(metro.congestionBand ?? metro.capacityBand ?? '');
  const spread = String(metro.spreadBand ?? metro.regionalSpread?.band ?? '');

  if (growth === 'stalled' || growth === 'critical' || growth === 'contracting') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Stalled metro growth (${growth}) drags macro cycle and investment read.`;
  } else if (growth === 'surging' || growth === 'strong') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = `Strong metro momentum (${growth}) lifts macro cycle/investment interpretation.`;
  }

  if (congestion === 'severe' || congestion === 'critical' || congestion === 'gridlocked') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Gridlocked metro congestion suppresses macro productivity read.';
  }

  if (spread === 'polarized' || spread === 'critical' || spread === 'wide') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Wide metro-regional spread reinforces macro divergence read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMetroMomentumSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMetroMomentumSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
