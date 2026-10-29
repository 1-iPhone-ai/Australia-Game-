import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroMemoryRetentionSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.19 memory retention spillover (Agent 19 domain; distinct from memory layer). */
export function readMacroMemoryRetentionSpilloverFromV1019(inputs: MacroEconomyInputs): MacroMemoryRetentionSpillover {
  const mr: any =
    inputs.memoryRetention ??
    inputs.aiMemory?.retention ??
    inputs.explainability?.retention ??
    inputs.nationalAiMemory?.retention;
  if (!mr) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const retention = String(mr.retentionBand ?? mr.holdBand ?? mr.persistenceBand ?? '');
  const decay = String(mr.decayBand ?? mr.erosionBand ?? '');
  const recall = String(mr.recallBand ?? mr.accuracyBand ?? '');

  if (retention === 'volatile' || retention === 'critical' || retention === 'lost') {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = `Volatile AI memory retention (${retention}) drags macro investment read.`;
  } else if (retention === 'durable' || retention === 'stable') {
    investmentNudge += 1;
    summary = `Durable memory retention (${retention}) supports macro investment interpretation.`;
  }

  if (decay === 'accelerating' || decay === 'critical' || decay === 'runaway') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Accelerating memory decay weakens macro productivity spillover.';
  }

  if (recall === 'noisy' || recall === 'critical' || recall === 'corrupted') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Noisy memory recall amplifies macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMemoryRetentionSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMemoryRetentionSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
