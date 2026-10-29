import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroCapexSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.8 private capex cycle spillover (Agent 08 domain; never mutates company state). */
export function readMacroCapexSpilloverFromV1008(inputs: MacroEconomyInputs): MacroCapexSpillover {
  const co: any =
    inputs.companies ??
    inputs.privateSector ??
    inputs.nationalPrivateSector ??
    inputs.nationalSystems?.privateSector;
  const capex: any = co?.capexCycle ?? co?.capitalExpenditure ?? co?.investmentCycle ?? inputs.privateCapex;
  if (!capex && !co) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pipeline = String(
    capex?.pipelineBand ?? capex?.backlogBand ?? co?.capexPipelineBand ?? co?.investmentPipeline?.band ?? ''
  );
  const freeze = String(capex?.freezeBand ?? capex?.haltBand ?? co?.capexFreezeBand ?? '');
  const payback = String(capex?.paybackBand ?? capex?.roiBand ?? co?.expectedPaybackBand ?? '');

  if (pipeline === 'surging' || pipeline === 'strong' || pipeline === 'expansionary') {
    investmentNudge += 3;
    cycleNudge += 1;
    productivityNudge += 1;
    summary = `Strong private capex pipeline (${pipeline}) lifts macro investment read.`;
  } else if (pipeline === 'frozen' || pipeline === 'collapsed' || pipeline === 'critical') {
    investmentNudge -= 3;
    cycleNudge -= 2;
    summary = `Frozen private capex pipeline (${pipeline}) drags macro investment and cycle read.`;
  } else if (pipeline === 'weak' || pipeline === 'cautious') {
    investmentNudge -= 1;
    cycleNudge -= 1;
  }

  if (freeze === 'binding' || freeze === 'severe' || freeze === 'total') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Binding capex freeze caps macro investment upside.';
  }

  if (payback === 'stretched' || payback === 'unfavorable' || payback === 'critical') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Unfavorable capex payback expectations weigh on productivity spillover.';
  } else if (payback === 'attractive' || payback === 'strong') {
    investmentNudge += 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCapexSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCapexSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
