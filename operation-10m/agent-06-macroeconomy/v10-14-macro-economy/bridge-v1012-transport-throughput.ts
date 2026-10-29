import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTransportThroughputSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.12 transport throughput spillover (Agent 12 domain; distinct from transport layer). */
export function readMacroTransportThroughputSpilloverFromV1012(inputs: MacroEconomyInputs): MacroTransportThroughputSpillover {
  const tt: any =
    inputs.transportThroughput ??
    inputs.transportInfrastructure?.throughput ??
    inputs.infrastructure?.freightThroughput ??
    inputs.nationalInfrastructure?.throughput;
  if (!tt) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const flow = String(tt.flowBand ?? tt.throughputBand ?? tt.capacityBand ?? '');
  const backlog = String(tt.backlogBand ?? tt.maintenanceBacklog?.band ?? '');
  const reliability = String(tt.reliabilityBand ?? tt.serviceReliability?.band ?? '');

  if (flow === 'congested' || flow === 'critical' || flow === 'collapsed') {
    productivityNudge -= 3;
    cycleNudge -= 2;
    summary = `Collapsed transport throughput (${flow}) drags macro productivity read.`;
  } else if (flow === 'fluid' || flow === 'strong') {
    productivityNudge += 1;
    investmentNudge += 0.5;
    summary = `Strong transport throughput (${flow}) supports macro productivity interpretation.`;
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'unbounded') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Severe infrastructure backlog caps macro investment spillover read.';
  }

  if (reliability === 'fragile' || reliability === 'critical' || reliability === 'failing') {
    cycleNudge -= 1;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragile transport reliability weakens macro cycle/investment signal.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTransportThroughputSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTransportThroughputSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
