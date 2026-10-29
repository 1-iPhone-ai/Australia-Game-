import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroResearchSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.3 research / tech pipeline spillover (never mutates research state). */
export function readMacroResearchSpilloverFromV103(inputs: MacroEconomyInputs): MacroResearchSpillover {
  const rs: any =
    inputs.researchTech ??
    inputs.research ??
    inputs.nationalResearch ??
    inputs.nationalSystems?.research ??
    inputs.nationalSystems?.researchTech;
  if (!rs) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pipeline = String(rs.pipelineBand ?? rs.techPipeline?.band ?? rs.readiness?.band ?? '');
  const adoption = String(rs.adoptionBand ?? rs.commercialization?.band ?? rs.diffusion?.band ?? '');
  const funding = String(rs.fundingBand ?? rs.rAndDFunding?.band ?? rs.budgetBand ?? '');

  if (pipeline === 'breakthrough' || pipeline === 'accelerating' || pipeline === 'strong') {
    productivityNudge += 2;
    cycleNudge += 1;
    investmentNudge += 1;
    summary = `Research pipeline (${pipeline}) lifts macro productivity and investment read.`;
  } else if (pipeline === 'stalled' || pipeline === 'blocked' || pipeline === 'weak') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Weak research pipeline (${pipeline}) drags macro productivity interpretation.`;
  }

  if (adoption === 'rapid' || adoption === 'scaling') {
    productivityNudge += 1;
    cycleNudge += 0.5;
  } else if (adoption === 'stalled' || adoption === 'fragmented') {
    productivityNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Stalled tech adoption caps macro upside.';
  }

  if (funding === 'surging' || funding === 'expansionary') {
    investmentNudge += 2;
  } else if (funding === 'cut' || funding === 'critical' || funding === 'frozen') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Research funding squeeze weighs on macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroResearchSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroResearchSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
