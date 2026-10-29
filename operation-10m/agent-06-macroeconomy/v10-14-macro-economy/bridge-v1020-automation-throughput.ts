import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroAutomationThroughputSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.20 automation throughput spillover (Agent 20 domain; distinct from automation layer). */
export function readMacroAutomationThroughputSpilloverFromV1020(inputs: MacroEconomyInputs): MacroAutomationThroughputSpillover {
  const at: any =
    inputs.automationThroughput ??
    inputs.idleAutomation?.throughput ??
    inputs.automation?.throughput ??
    inputs.nationalAutomation?.throughput;
  if (!at) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pace = String(at.paceBand ?? at.throughputBand ?? at.cadenceBand ?? '');
  const reliability = String(at.reliabilityBand ?? at.uptimeBand ?? '');
  const backlog = String(at.backlogBand ?? at.queueBand ?? '');

  if (pace === 'stalled' || pace === 'critical' || pace === 'collapsed') {
    productivityNudge -= 3;
    cycleNudge -= 2;
    summary = `Stalled automation throughput (${pace}) drags macro productivity read.`;
  } else if (pace === 'fluid' || pace === 'strong') {
    productivityNudge += 1;
    investmentNudge += 0.5;
    summary = `Strong automation throughput (${pace}) supports macro productivity interpretation.`;
  }

  if (reliability === 'fragile' || reliability === 'critical' || reliability === 'failing') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Fragile automation reliability caps macro investment spillover.';
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'unbounded') {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Severe automation backlog weakens macro cycle signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroAutomationThroughputSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroAutomationThroughputSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
