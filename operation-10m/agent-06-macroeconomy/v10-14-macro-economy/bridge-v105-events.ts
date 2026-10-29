import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroEventsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.5 dynamic events / narrative spillover (never mutates event state). */
export function readMacroEventsSpilloverFromV105(inputs: MacroEconomyInputs): MacroEventsSpillover {
  const ev: any =
    inputs.dynamicEvents ??
    inputs.narrativeEvents ??
    inputs.op10mEvents ??
    inputs.nationalSystems?.dynamicEvents ??
    inputs.nationalSystems?.narrative;
  if (!ev) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const stability = String(
    ev.nationalStabilityBand ??
      ev.stabilityBand ??
      ev.nationalStability?.band ??
      (typeof ev.nationalStability === 'number' && ev.nationalStability < 35
        ? 'critical'
        : typeof ev.nationalStability === 'number' && ev.nationalStability < 50
          ? 'fragile'
          : '')
  );
  const backlog = String(ev.pendingBacklogBand ?? ev.backlogBand ?? ev.queuePressure?.band ?? '');
  const crisisCount = Math.max(
    0,
    Math.floor(Number(ev.activeCrisisCount ?? ev.crisisCount ?? ev.activeCrises ?? 0))
  );
  const pendingCount = Math.max(
    0,
    Math.floor(Number(ev.pendingResponseCount ?? ev.pendingResponses?.length ?? ev.pendingCount ?? 0))
  );

  if (stability === 'critical' || stability === 'collapsing') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 1;
    summary = `National stability band (${stability}) drags macro cycle read via event layer.`;
  } else if (stability === 'fragile' || stability === 'stressed') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = `Fragile national stability (${stability}) weighs on macro cycle interpretation.`;
  } else if (stability === 'robust' || stability === 'stable' || stability === 'strong') {
    cycleNudge += 0.5;
    summary = 'Stable national narrative backdrop supports macro cycle read.';
  }

  if (backlog === 'surging' || backlog === 'critical' || backlog === 'elevated') {
    cycleNudge -= backlog === 'critical' ? 2 : 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Elevated pending event backlog caps investment upside.';
  } else if (backlog === 'clear' || backlog === 'calm') {
    investmentNudge += 0.5;
  }

  if (crisisCount >= 3) {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + `${crisisCount} concurrent crises amplify macro downside risk.`;
  } else if (crisisCount === 2) {
    cycleNudge -= 1;
  }

  if (pendingCount >= 6) {
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Heavy pending player-response queue signals policy paralysis read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEventsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEventsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
