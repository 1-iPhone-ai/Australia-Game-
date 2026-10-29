import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTimelineSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history timeline spillover (Agent 24 domain; never mutates replay state). */
export function readMacroTimelineSpilloverFromV1024(inputs: MacroEconomyInputs): MacroTimelineSpillover {
  const tl: any =
    inputs.historyTimeline ??
    inputs.historyReplay?.timeline ??
    inputs.replayArchive?.timeline ??
    inputs.nationalHistory?.timeline;
  if (!tl) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const gap = String(tl.gapBand ?? tl.recordGap?.band ?? tl.continuityBand ?? '');
  const drift = String(tl.narrativeDriftBand ?? tl.driftBand ?? '');
  const shockMemory = String(tl.shockMemoryBand ?? tl.stressMemory?.band ?? '');

  if (gap === 'broken' || gap === 'critical' || gap === 'discontinuous') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = `Broken history timeline (${gap}) undermines macro cycle confidence read.`;
  } else if (gap === 'coherent' || gap === 'continuous') {
    cycleNudge += 0.5;
  }

  if (drift === 'severe' || drift === 'runaway' || drift === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Runaway narrative drift distorts productivity interpretation.';
  }

  if (shockMemory === 'scarring' || shockMemory === 'persistent' || shockMemory === 'deep') {
    cycleNudge -= 2;
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Persistent timeline shock memory drags macro investment read.';
  } else if (shockMemory === 'fading' || shockMemory === 'cleared') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTimelineSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTimelineSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
