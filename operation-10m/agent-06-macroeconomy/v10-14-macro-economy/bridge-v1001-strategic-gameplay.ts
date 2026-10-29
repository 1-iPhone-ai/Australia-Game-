import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroStrategicGameplaySpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.01 strategic gameplay cadence spillover (Agent 01 domain). */
export function readMacroStrategicGameplaySpilloverFromV1001(inputs: MacroEconomyInputs): MacroStrategicGameplaySpillover {
  const gp: any =
    inputs.strategicGameplay ??
    inputs.strategicCapital?.gameplayCadence ??
    inputs.nationalStrategic?.gameplay ??
    inputs.gameModes?.macroCadence;
  if (!gp) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const pacing = String(gp.pacingBand ?? gp.cadenceBand ?? gp.tempoBand ?? '');
  const coherence = String(gp.coherenceBand ?? gp.planningCoherence?.band ?? '');
  const friction = String(gp.frictionBand ?? gp.decisionFriction?.band ?? '');

  if (pacing === 'stalled' || pacing === 'critical' || pacing === 'gridlocked') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = `Stalled strategic gameplay pacing (${pacing}) drags macro cycle read.`;
  } else if (pacing === 'decisive' || pacing === 'fluid') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
    summary = `Fluid strategic pacing (${pacing}) supports macro investment interpretation.`;
  }

  if (coherence === 'fragmented' || coherence === 'critical' || coherence === 'contradictory') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragmented strategic coherence weakens macro investment signal.';
  }

  if (friction === 'severe' || friction === 'critical' || friction === 'paralyzed') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'High decision friction suppresses macro productivity spillover read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroStrategicGameplaySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroStrategicGameplaySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
