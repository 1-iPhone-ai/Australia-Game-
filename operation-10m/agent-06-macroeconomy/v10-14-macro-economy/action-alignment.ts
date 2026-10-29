import { v1014macroClamp } from './math.ts';
import type { NationalMacroEconomyState } from './types.ts';

export interface MacroActionAlignment {
  category: string;
  scoreDelta: number;
  rationale: string;
}

const CATEGORY_WEIGHT: Record<string, { cycle: number; investment: number; productivity: number }> = {
  investments: { cycle: 0.2, investment: 0.55, productivity: 0.25 },
  infrastructure: { cycle: 0.25, investment: 0.45, productivity: 0.3 },
  industry: { cycle: 0.15, investment: 0.35, productivity: 0.5 },
  austerity: { cycle: -0.35, investment: -0.45, productivity: -0.2 },
  stimulus: { cycle: 0.4, investment: 0.35, productivity: 0.25 }
};

export function macroEconomyActionAlignment(
  state: NationalMacroEconomyState | null | undefined,
  action: { category?: string; regionId?: string | null }
): MacroActionAlignment | null {
  if (!state) return null;
  const cat = String(action.category ?? '').toLowerCase();
  const weights = CATEGORY_WEIGHT[cat];
  if (!weights) return null;
  const cycleNorm = (state.cycleMomentum + 1) / 2;
  const invNorm = state.grossInvestmentIndex / 100;
  const prodNorm = state.productivityIndex / 100;
  let scoreDelta =
    weights.cycle * (cycleNorm - 0.5) * 10 +
    weights.investment * (invNorm - 0.5) * 10 +
    weights.productivity * (prodNorm - 0.5) * 10;
  if (cat === 'austerity') {
    scoreDelta -= 1.25;
    if (state.cyclePhase === 'contraction' || state.cyclePhase === 'trough' || state.investmentClimate === 'frozen') {
      scoreDelta -= 1.5;
    }
  }
  if (action.regionId) {
    const row = state.regionalContributions.find(r => r.regionId === action.regionId);
    if (row && row.role === 'lagging') scoreDelta -= 1.2;
    if (row && row.role === 'anchor') scoreDelta += 0.6;
  }
  if (state.regionalDivergence?.band === 'wide_spread' && cat === 'investments') scoreDelta -= 0.8;
  scoreDelta = v1014macroClamp(scoreDelta, -6, 6);
  return {
    category: cat,
    scoreDelta,
    rationale: `Macro alignment vs ${state.cyclePhase}/${state.investmentClimate}/${state.productivityBand}.`
  };
}
