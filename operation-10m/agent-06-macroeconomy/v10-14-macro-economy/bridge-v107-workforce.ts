import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroWorkforceSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only workforce / labor market spillover (never mutates workforce state). */
export function readMacroWorkforceSpilloverFromV107(inputs: MacroEconomyInputs): MacroWorkforceSpillover {
  const wf: any = inputs.workforce;
  if (!wf) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const readiness = String(wf.nationalReadinessBand ?? wf.readiness?.band ?? wf.skillsBand ?? '');
  if (readiness === 'strong' || readiness === 'leading') {
    productivityNudge += 3;
    cycleNudge += 1;
    summary = 'Strong national workforce readiness lifts macro productivity read.';
  } else if (readiness === 'weak' || readiness === 'strained') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = 'Weak workforce readiness weighs on macro productivity interpretation.';
  } else if (readiness === 'critical' || readiness === 'shortage') {
    productivityNudge -= 4;
    investmentNudge -= 2;
    cycleNudge -= 2;
    summary = 'Critical labor shortages bind macro capacity and investment upside.';
  }

  const slack = String(wf.laborMarket?.slack ?? wf.marketSlack ?? wf.tightnessBand ?? '');
  if (slack === 'tight' || slack === 'very_tight' || slack === 'shortage') {
    cycleNudge += 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Tight labor markets support cycle but can cap investment scaling.';
  } else if (slack === 'slack' || slack === 'deep_slack' || slack === 'surplus') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Slack labor markets signal macro underutilization.';
  }

  const mismatch = Boolean(wf.skillsMismatch ?? wf.structuralMismatch);
  if (mismatch) {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Skills mismatch reduces effective macro productivity.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -6, 4),
    investmentNudge: v1014macroClamp(investmentNudge, -4, 2),
    productivityNudge: v1014macroClamp(productivityNudge, -8, 6),
    summary
  };
}

export function applyMacroWorkforceSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroWorkforceSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
