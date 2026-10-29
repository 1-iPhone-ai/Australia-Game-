import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroNegotiationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.5 negotiation / diplomacy spillover (Agent 05 domain; never mutates event state). */
export function readMacroNegotiationSpilloverFromV1005(inputs: MacroEconomyInputs): MacroNegotiationSpillover {
  const neg: any =
    inputs.negotiationState ??
    inputs.diplomacy ??
    inputs.dynamicEvents?.negotiation ??
    inputs.narrativeEvents?.negotiation ??
    inputs.op10mEvents?.negotiation ??
    inputs.nationalSystems?.negotiation;
  if (!neg) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const deadlock = String(neg.deadlockBand ?? neg.stalemateBand ?? neg.impasseBand ?? '');
  const trust = String(neg.trustBand ?? neg.coalitionTrust?.band ?? neg.trustLevel ?? '');
  const claimPressure = String(neg.claimPressureBand ?? neg.claimBacklogBand ?? neg.pendingClaimsBand ?? '');

  if (deadlock === 'critical' || deadlock === 'severe' || deadlock === 'entrenched') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Negotiation deadlock (${deadlock}) suppresses macro cycle and policy investment read.`;
  } else if (deadlock === 'elevated' || deadlock === 'fragile') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = `Fragile negotiation posture (${deadlock}) weighs on macro investment timing.`;
  } else if (deadlock === 'resolved' || deadlock === 'clear') {
    cycleNudge += 0.5;
    investmentNudge += 0.5;
  }

  if (trust === 'collapsed' || trust === 'critical' || trust === 'broken') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Collapsed negotiation trust erodes macro productivity confidence.';
  } else if (trust === 'strong' || trust === 'robust') {
    cycleNudge += 1;
    productivityNudge += 0.5;
  }

  if (claimPressure === 'surging' || claimPressure === 'critical' || claimPressure === 'flooded') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Surging unresolved claims create macro policy paralysis read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroNegotiationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroNegotiationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
