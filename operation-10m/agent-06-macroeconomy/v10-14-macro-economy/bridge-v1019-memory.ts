import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroMemorySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.19 AI memory / explainability spillover (never mutates memory state). */
export function readMacroMemorySpilloverFromV1019(inputs: MacroEconomyInputs): MacroMemorySpillover {
  const mem: any =
    inputs.aiMemory ??
    inputs.explainability ??
    inputs.nationalAiMemory ??
    inputs.nationalSystems?.aiMemory;
  if (!mem) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const drift = String(mem.driftBand ?? mem.memoryDrift?.band ?? mem.recallDrift?.band ?? '');
  const fidelity = String(mem.recallFidelity?.band ?? mem.fidelityBand ?? '');
  const auditGap = String(mem.auditGap?.band ?? mem.explainabilityGap?.band ?? '');

  if (drift === 'runaway' || drift === 'severe' || drift === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Runaway AI memory drift (${drift}) clouds macro cycle interpretation.`;
  } else if (drift === 'stable' || drift === 'anchored') {
    productivityNudge += 0.5;
  }

  if (fidelity === 'degraded' || fidelity === 'fragmented' || fidelity === 'low') {
    investmentNudge -= 1;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Degraded recall fidelity weakens macro investment read.';
  } else if (fidelity === 'high' || fidelity === 'verified') {
    productivityNudge += 1;
  }

  if (auditGap === 'wide' || auditGap === 'critical' || auditGap === 'unresolved') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Wide explainability audit gap adds macro policy uncertainty.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroMemorySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroMemorySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
