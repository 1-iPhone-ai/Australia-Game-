import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroUtilitiesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.12 utilities grid spillover (Agent 12; distinct from transport corridors). */
export function readMacroUtilitiesSpilloverFromV1012Utilities(inputs: MacroEconomyInputs): MacroUtilitiesSpillover {
  const util: any =
    inputs.utilitiesGrid ??
    inputs.publicUtilities ??
    inputs.nationalUtilities ??
    inputs.nationalSystems?.utilities ??
    inputs.infrastructure?.utilities;
  if (!util) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const serviceReliability = String(
    util.serviceReliability?.band ?? util.reliabilityBand ?? util.gridReliability?.band ?? ''
  );
  const outageBand = String(util.outageBand ?? util.outageRisk?.band ?? util.disruptionBand ?? '');
  const capacityMargin = String(util.capacityMargin?.band ?? util.reserveMargin?.band ?? util.spareCapacity?.band ?? '');

  if (serviceReliability === 'fragile' || serviceReliability === 'critical' || serviceReliability === 'degraded') {
    cycleNudge -= 2;
    productivityNudge -= 2;
    summary = `Utilities service reliability (${serviceReliability}) drags macro productivity read.`;
  } else if (serviceReliability === 'robust' || serviceReliability === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
  }

  if (outageBand === 'frequent' || outageBand === 'severe' || outageBand === 'rolling') {
    cycleNudge -= 3;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Rolling utility outages bind macro cycle interpretation.';
  }

  if (capacityMargin === 'thin' || capacityMargin === 'critical' || capacityMargin === 'negative') {
    investmentNudge += 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Thin utilities capacity margin lifts capex need with near-term cycle drag.';
  } else if (capacityMargin === 'ample' || capacityMargin === 'surplus') {
    investmentNudge += 0.5;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUtilitiesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUtilitiesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
