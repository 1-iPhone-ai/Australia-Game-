import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAutomationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 idle automation spillover (never mutates automation state). */
export function readMacroAutomationSpilloverFromV1020(inputs: MacroEconomyInputs): MacroAutomationSpillover {
  const au: any =
    inputs.idleAutomation ??
    inputs.automation ??
    inputs.nationalAutomation ??
    inputs.nationalSystems?.automation;
  if (!au) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const throughput = String(au.throughputBand ?? au.automationThroughput?.band ?? '');
  const reliability = String(au.reliabilityBand ?? au.uptime?.band ?? '');
  const adoption = String(au.adoptionBand ?? au.coverageBand ?? '');

  if (throughput === 'surging' || throughput === 'high') {
    productivityNudge += 2;
    cycleNudge += 1;
    summary = `Strong automation throughput (${throughput}) lifts macro productivity read.`;
  } else if (throughput === 'stalled' || throughput === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Stalled automation (${throughput}) drags macro productivity interpretation.`;
  }

  if (reliability === 'degraded' || reliability === 'fragile') {
    investmentNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragile automation reliability caps macro upside.';
  } else if (reliability === 'robust' || reliability === 'strong') {
    investmentNudge += 0.5;
  }

  if (adoption === 'broad' || adoption === 'deep') {
    productivityNudge += 1;
  } else if (adoption === 'minimal' || adoption === 'nascent') {
    productivityNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
