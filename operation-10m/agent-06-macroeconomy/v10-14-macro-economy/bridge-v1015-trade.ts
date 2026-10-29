import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTradeSpillover {
  cycleNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.15 trade / external demand spillover (never mutates trade state). */
export function readMacroTradeSpilloverFromV1015(inputs: MacroEconomyInputs): MacroTradeSpillover {
  const tr: any = inputs.trade;
  if (!tr) return { cycleNudge: 0, productivityNudge: 0, summary: null };
  const terms = String(tr.termsOfTrade?.band ?? tr.termsBand ?? tr.externalDemand?.band ?? 'stable');
  const tension = String(tr.diplomaticTension?.level ?? tr.tensionBand ?? 'calm');
  const exportMomentum = Number(tr.exportMomentum ?? tr.exportGrowthIndex ?? 0);
  let cycleNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;
  if (terms === 'favorable' || terms === 'strong' || exportMomentum > 4) {
    cycleNudge += 2;
    productivityNudge += 1.5;
    summary = 'Favorable external demand supports macro cycle read.';
  }
  if (terms === 'weak' || terms === 'adverse' || exportMomentum < -3) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'Weak terms of trade drag on macro cycle and productivity interpretation.';
  }
  if (tension === 'elevated' || tension === 'critical' || tension === 'sanctions_risk') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Trade/diplomatic tension caps external upside.';
  }
  return {
    cycleNudge: v1014macroClamp(cycleNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -6, 6),
    summary
  };
}

export function applyMacroTradeSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTradeSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
