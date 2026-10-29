import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroBudgetOutlookSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.07 public budget outlook spillover (Agent 07 domain; distinct from fiscal flow layer). */
export function readMacroBudgetOutlookSpilloverFromV1007(inputs: MacroEconomyInputs): MacroBudgetOutlookSpillover {
  const bo: any =
    inputs.budgetOutlook ??
    inputs.publicFinance?.outlook ??
    inputs.publicFinance?.budgetOutlook ??
    inputs.nationalFinance?.budgetOutlook;
  if (!bo) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const trajectory = String(bo.trajectoryBand ?? bo.pathBand ?? bo.fiscalPath?.band ?? '');
  const consolidation = String(bo.consolidationBand ?? bo.austerityBand ?? '');
  const capexRoom = String(bo.capexRoomBand ?? bo.capitalHeadroom?.band ?? '');

  if (trajectory === 'deteriorating' || trajectory === 'critical' || trajectory === 'unsustainable') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = `Deteriorating budget outlook (${trajectory}) tightens macro cycle and investment read.`;
  } else if (trajectory === 'improving' || trajectory === 'stable') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = `Stable budget outlook (${trajectory}) supports macro investment interpretation.`;
  }

  if (consolidation === 'severe' || consolidation === 'front_loaded' || consolidation === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Front-loaded consolidation drags macro cycle read.';
  }

  if (capexRoom === 'exhausted' || capexRoom === 'critical' || capexRoom === 'none') {
    investmentNudge -= 3;
    summary = (summary ? summary + ' ' : '') + 'Exhausted public capex room caps macro investment spillover.';
  } else if (capexRoom === 'ample' || capexRoom === 'expansionary') {
    investmentNudge += 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroBudgetOutlookSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroBudgetOutlookSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
