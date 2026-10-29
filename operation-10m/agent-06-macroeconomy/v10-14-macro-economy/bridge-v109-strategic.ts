import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroStrategicSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.9 strategic capital allocation spillover (never mutates strategic state). */
export function readMacroStrategicSpilloverFromV109(inputs: MacroEconomyInputs): MacroStrategicSpillover {
  const sc: any = inputs.strategicCapital ?? inputs.nationalSystems?.strategicCapital;
  if (!sc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const allocation = String(sc.allocationBand ?? sc.capitalBand ?? sc.investmentClimateBand ?? '');
  if (allocation === 'expansionary' || allocation === 'growth' || allocation === 'active') {
    investmentNudge += 3;
    cycleNudge += 1;
    summary = 'Expansionary strategic capital allocation lifts macro investment read.';
  } else if (allocation === 'austerity' || allocation === 'conservation' || allocation === 'drawdown') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Conservative strategic capital stance weighs on macro investment interpretation.';
  } else if (allocation === 'frozen' || allocation === 'blocked') {
    investmentNudge -= 4;
    productivityNudge -= 1;
    summary = 'Frozen strategic capital pipeline caps macro investment upside.';
  }

  const priority = String(sc.nationalPriority ?? sc.priorityTheme ?? sc.focusBand ?? '');
  if (priority === 'productivity' || priority === 'innovation_led') {
    productivityNudge += 2;
    summary = (summary ? summary + ' ' : '') + 'Productivity-led strategic priority supports macro productivity read.';
  } else if (priority === 'infrastructure' || priority === 'capex') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Infrastructure priority channels strategic capital toward investment.';
  } else if (priority === 'stabilization' || priority === 'fiscal_repair') {
    investmentNudge -= 1;
    cycleNudge -= 1;
  }

  const momentum = String(sc.momentum?.band ?? sc.pipelineMomentum ?? sc.executionBand ?? '');
  if (momentum === 'accelerating' || momentum === 'strong') {
    investmentNudge += 1;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong strategic execution momentum supports macro cycle read.';
  } else if (momentum === 'stalled' || momentum === 'weak') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stalled strategic execution drags investment interpretation.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroStrategicSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroStrategicSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
