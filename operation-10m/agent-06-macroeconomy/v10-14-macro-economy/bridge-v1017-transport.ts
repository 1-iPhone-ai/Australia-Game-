import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTransportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.17 transport / infrastructure spillover (never mutates infrastructure state). */
export function readMacroTransportSpilloverFromV1017(inputs: MacroEconomyInputs): MacroTransportSpillover {
  const tr: any =
    inputs.transportInfrastructure ??
    inputs.infrastructure ??
    inputs.nationalInfrastructure ??
    inputs.nationalSystems?.transport ??
    inputs.nationalSystems?.infrastructure;
  if (!tr) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const connectivity = String(tr.connectivityBand ?? tr.freightConnectivity?.band ?? tr.networkBand ?? tr.connectivity?.band ?? '');
  const backlog = String(tr.maintenanceBacklog?.band ?? tr.backlogBand ?? tr.deferredProjects?.band ?? '');
  const throughput = String(tr.throughputBand ?? tr.capacityBand ?? tr.utilization?.band ?? '');
  const investmentPipeline = String(tr.investmentPipeline?.band ?? tr.capexPipeline?.band ?? '');

  if (connectivity === 'fragmented' || connectivity === 'critical' || connectivity === 'degraded') {
    cycleNudge -= connectivity === 'critical' ? 3 : 2;
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = `Transport connectivity (${connectivity}) drags macro productivity and cycle read.`;
  } else if (connectivity === 'robust' || connectivity === 'integrated' || connectivity === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = 'Integrated transport network supports macro productivity interpretation.';
  }

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'elevated') {
    investmentNudge += 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Infrastructure maintenance backlog lifts capex need but near-term cycle drag.';
  }

  if (throughput === 'constrained' || throughput === 'bottlenecked') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Logistics throughput constraints bind macro cycle read.';
  } else if (throughput === 'surplus' || throughput === 'ample') {
    cycleNudge += 1;
  }

  if (investmentPipeline === 'surging' || investmentPipeline === 'active') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'Active infrastructure pipeline supports macro investment read.';
  } else if (investmentPipeline === 'stalled' || investmentPipeline === 'frozen') {
    investmentNudge -= 2;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTransportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTransportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
