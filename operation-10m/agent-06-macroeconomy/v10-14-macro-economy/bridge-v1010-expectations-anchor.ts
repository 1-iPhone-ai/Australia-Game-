import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroExpectationsAnchorSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.10 inflation expectations anchor spillover (Agent 10 domain; distinct from inflation layer). */
export function readMacroExpectationsAnchorSpilloverFromV1010(inputs: MacroEconomyInputs): MacroExpectationsAnchorSpillover {
  const ex: any =
    inputs.inflationExpectationsAnchor ??
    inputs.nationalFinance?.expectationsAnchor ??
    inputs.monetaryPolicy?.expectationsAnchor ??
    inputs.nationalFinance?.inflationExpectations;
  if (!ex) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const anchor = String(ex.anchorBand ?? ex.stabilityBand ?? ex.beliefBand ?? '');
  const drift = String(ex.driftBand ?? ex.deanchoringBand ?? '');
  const credibility = String(ex.credibilityBand ?? ex.policyCredibility?.band ?? '');

  if (anchor === 'unmoored' || anchor === 'critical' || anchor === 'deanchored') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Deanchored inflation expectations (${anchor}) unsettle macro cycle read.`;
  } else if (anchor === 'firm' || anchor === 'well_anchored') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = `Well-anchored expectations (${anchor}) support macro investment interpretation.`;
  }

  if (drift === 'upward' || drift === 'runaway' || drift === 'critical') {
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Upward expectation drift tightens macro investment read.';
  }

  if (credibility === 'weak' || credibility === 'critical' || credibility === 'lost') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Weak policy credibility amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroExpectationsAnchorSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroExpectationsAnchorSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
