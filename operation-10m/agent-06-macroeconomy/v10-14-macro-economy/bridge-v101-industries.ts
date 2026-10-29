import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroIndustrySpillover {
  productivityNudge: number;
  cycleNudge: number;
  summary: string | null;
}

/** Read-only V10.1 industries / supply utilization spillover. */
export function readMacroIndustrySpilloverFromV101(inputs: MacroEconomyInputs): MacroIndustrySpillover {
  const ind: any = inputs.industries;
  if (!ind) return { productivityNudge: 0, cycleNudge: 0, summary: null };
  const utilization = Number(ind.nationalUtilization ?? ind.utilizationIndex ?? ind.supplyPressure ?? 55);
  const constrained = Boolean(ind.supplyConstrained ?? ind.hasCriticalConstraint);
  let productivityNudge = 0;
  let cycleNudge = 0;
  let summary: string | null = null;
  if (utilization > 72) {
    productivityNudge += 2;
    cycleNudge += 1;
    summary = 'Tight industrial utilization lifts productivity interpretation.';
  }
  if (utilization < 42) {
    productivityNudge -= 2;
    cycleNudge -= 2;
    summary = 'Slack industrial utilization signals macro slack.';
  }
  if (constrained) {
    productivityNudge -= 3;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Critical supply constraint weighs on macro productivity.';
  }
  return {
    productivityNudge: v1014macroClamp(productivityNudge, -6, 6),
    cycleNudge: v1014macroClamp(cycleNudge, -6, 4),
    summary
  };
}

export function applyMacroIndustrySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIndustrySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
