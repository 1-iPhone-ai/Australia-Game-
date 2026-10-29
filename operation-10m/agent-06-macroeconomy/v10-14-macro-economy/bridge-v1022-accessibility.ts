import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAccessibilitySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI accessibility spillover (Agent 22 domain; never mutates UI state). */
export function readMacroAccessibilitySpilloverFromV1022(inputs: MacroEconomyInputs): MacroAccessibilitySpillover {
  const acc: any =
    inputs.uiAccessibility ??
    inputs.gameUi?.accessibility ??
    inputs.uiShell?.accessibility ??
    inputs.nationalUi?.accessibility;
  if (!acc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const contrast = String(acc.contrastBand ?? acc.contrast?.band ?? acc.visualContrast ?? '');
  const inputLag = String(acc.inputLagBand ?? acc.keyboardLag?.band ?? acc.focusLatencyBand ?? '');
  const coverage = String(acc.coverageBand ?? acc.wcagCoverage?.band ?? '');

  if (contrast === 'failing' || contrast === 'critical' || contrast === 'severe') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Failing UI contrast (${contrast}) slows macro operator comprehension read.`;
  } else if (contrast === 'strong' || contrast === 'aaa') {
    productivityNudge += 0.5;
  }

  if (inputLag === 'severe' || inputLag === 'critical' || inputLag === 'degraded') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Degraded accessibility input latency caps macro throughput interpretation.';
  }

  if (coverage === 'partial' || coverage === 'critical' || coverage === 'gaps') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Incomplete accessibility coverage obscures macro dashboard signals.';
  } else if (coverage === 'full' || coverage === 'complete') {
    cycleNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAccessibilitySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAccessibilitySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
