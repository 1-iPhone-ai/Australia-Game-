import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroReplaySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history / replay spillover (never mutates replay state). */
export function readMacroReplaySpilloverFromV1024(inputs: MacroEconomyInputs): MacroReplaySpillover {
  const rp: any =
    inputs.historyReplay ??
    inputs.replayArchive ??
    inputs.nationalHistory ??
    inputs.nationalSystems?.historyReplay;
  if (!rp) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const volatility = String(rp.volatilityBand ?? rp.historicalVolatility?.band ?? '');
  const stressMemory = String(rp.stressMemory?.band ?? rp.priorShockMemory?.band ?? '');
  const recovery = String(rp.recoveryArc?.band ?? rp.reboundBand ?? '');

  if (volatility === 'high' || volatility === 'extreme') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Elevated historical volatility (${volatility}) increases macro uncertainty read.`;
  } else if (volatility === 'low' || volatility === 'stable') {
    cycleNudge += 0.5;
  }

  if (stressMemory === 'persistent' || stressMemory === 'scarring' || stressMemory === 'deep') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Persistent stress memory from replay archive drags productivity read.';
  }

  if (recovery === 'strong' || recovery === 'v-shaped') {
    cycleNudge += 1;
    investmentNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Strong historical recovery arc supports macro cycle interpretation.';
  } else if (recovery === 'weak' || recovery === 'l-shaped') {
    cycleNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplaySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplaySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
