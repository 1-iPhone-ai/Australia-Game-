import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroResearchMomentumSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.03 research momentum spillover (Agent 03 domain; distinct from research backlog layer). */
export function readMacroResearchMomentumSpilloverFromV1003(inputs: MacroEconomyInputs): MacroResearchMomentumSpillover {
  const rm: any =
    inputs.researchMomentum ??
    inputs.researchTech?.momentum ??
    inputs.nationalResearch?.momentum ??
    inputs.research?.pipelineMomentum;
  if (!rm) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const velocity = String(rm.velocityBand ?? rm.momentumBand ?? rm.paceBand ?? '');
  const diffusion = String(rm.diffusionBand ?? rm.spilloverBand ?? '');
  const funding = String(rm.fundingBand ?? rm.grantBand ?? '');

  if (velocity === 'stalled' || velocity === 'critical' || velocity === 'collapsed') {
    productivityNudge -= 3;
    cycleNudge -= 1;
    summary = `Stalled research momentum (${velocity}) drags macro productivity read.`;
  } else if (velocity === 'accelerating' || velocity === 'surging') {
    productivityNudge += 2;
    investmentNudge += 1;
    summary = `Accelerating research momentum (${velocity}) lifts macro productivity interpretation.`;
  }

  if (diffusion === 'bottlenecked' || diffusion === 'critical' || diffusion === 'siloed') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Bottlenecked research diffusion caps macro spillover benefits.';
  }

  if (funding === 'starved' || funding === 'critical' || funding === 'frozen') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Starved research funding drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroResearchMomentumSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroResearchMomentumSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
