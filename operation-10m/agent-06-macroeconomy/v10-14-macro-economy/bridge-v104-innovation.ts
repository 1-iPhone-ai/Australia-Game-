import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroInnovationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only innovation / R&D spillover (never mutates innovation state). */
export function readMacroInnovationSpilloverFromV104(inputs: MacroEconomyInputs): MacroInnovationSpillover {
  const inn: any = inputs.innovation;
  if (!inn) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  if (inn.nationalProductivityBonus) {
    productivityNudge += 2;
    summary = 'National innovation bonus lifts macro productivity read.';
  }

  const momentum = String(inn.momentum?.band ?? inn.rAndDMomentum ?? inn.pipelineBand ?? '');
  if (momentum === 'accelerating' || momentum === 'strong') {
    productivityNudge += 2;
    investmentNudge += 1;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Accelerating innovation pipeline supports macro cycle interpretation.';
  } else if (momentum === 'stalled' || momentum === 'weak' || momentum === 'contracting') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled innovation pipeline drags macro productivity read.';
  }

  const adoption = String(inn.adoption?.band ?? inn.diffusionBand ?? '');
  if (adoption === 'broad' || adoption === 'leading') {
    productivityNudge += 1.5;
    summary = (summary ? summary + ' ' : '') + 'Broad technology adoption supports productivity.';
  } else if (adoption === 'narrow' || adoption === 'lagging') {
    productivityNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -4, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -2, 4),
    productivityNudge: v1014macroClamp(productivityNudge, -6, 8),
    summary
  };
}

export function applyMacroInnovationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroInnovationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
