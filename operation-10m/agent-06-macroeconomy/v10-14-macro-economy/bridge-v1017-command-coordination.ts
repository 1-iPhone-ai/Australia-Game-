import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroCommandCoordinationSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.17 command coordination spillover (Agent 17 domain; distinct from command layer). */
export function readMacroCommandCoordinationSpilloverFromV1017(inputs: MacroEconomyInputs): MacroCommandCoordinationSpillover {
  const cc: any =
    inputs.commandCoordination ??
    inputs.commandCenter?.coordination ??
    inputs.nationalCommand?.coordination ??
    inputs.aiCommandCenter?.coordination;
  if (!cc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const sync = String(cc.syncBand ?? cc.coordinationBand ?? cc.alignmentBand ?? '');
  const latency = String(cc.latencyBand ?? cc.responseBand ?? '');
  const load = String(cc.loadBand ?? cc.capacityBand ?? '');

  if (sync === 'fragmented' || sync === 'critical' || sync === 'broken') {
    cycleNudge -= 3;
    productivityNudge -= 1;
    summary = `Fragmented command coordination (${sync}) drags macro cycle read.`;
  } else if (sync === 'aligned' || sync === 'tight') {
    productivityNudge += 1;
    summary = `Aligned command coordination (${sync}) supports macro productivity interpretation.`;
  }

  if (latency === 'severe' || latency === 'critical' || latency === 'unbounded') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Severe command latency caps macro investment spillover.';
  }

  if (load === 'overloaded' || load === 'critical' || load === 'saturated') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Overloaded command center weakens macro cycle/investment signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCommandCoordinationSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCommandCoordinationSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
