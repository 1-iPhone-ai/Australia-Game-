import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroEventCascadeSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.05 dynamic event cascade spillover (Agent 05 domain; distinct from events backlog layer). */
export function readMacroEventCascadeSpilloverFromV1005(inputs: MacroEconomyInputs): MacroEventCascadeSpillover {
  const ec: any =
    inputs.eventCascade ??
    inputs.dynamicEvents?.cascade ??
    inputs.op10mEvents?.cascade ??
    inputs.narrativeEvents?.cascade;
  if (!ec) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const intensity = String(ec.intensityBand ?? ec.cascadeBand ?? ec.severityBand ?? '');
  const propagation = String(ec.propagationBand ?? ec.spreadBand ?? '');
  const duration = String(ec.durationBand ?? ec.persistenceBand ?? '');

  if (intensity === 'extreme' || intensity === 'critical' || intensity === 'runaway') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = `Runaway event cascade (${intensity}) drags macro cycle and investment read.`;
  } else if (intensity === 'contained' || intensity === 'fading') {
    cycleNudge += 0.5;
    summary = `Contained event cascade (${intensity}) eases macro downside transmission.`;
  }

  if (propagation === 'national' || propagation === 'cross_sector' || propagation === 'accelerating') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Accelerating event propagation widens macro spillover read.';
  }

  if (duration === 'persistent' || duration === 'chronic' || duration === 'critical') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Persistent event cascade scarring drags macro productivity interpretation.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroEventCascadeSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroEventCascadeSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
