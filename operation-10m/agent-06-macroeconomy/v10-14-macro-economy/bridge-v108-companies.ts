import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroCompaniesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.8 companies / production spillover (never mutates firm state). */
export function readMacroCompaniesSpilloverFromV108(inputs: MacroEconomyInputs): MacroCompaniesSpillover {
  const co: any =
    inputs.companies ??
    inputs.privateSector ??
    inputs.nationalPrivateSector ??
    inputs.nationalSystems?.privateSector ??
    inputs.nationalSystems?.companies;
  if (!co) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const utilization = String(
    co.nationalUtilizationBand ??
      co.utilization?.band ??
      co.productionUtilization?.band ??
      co.capacityUtilization?.band ??
      ''
  );
  const capacityGap = Number(co.capacityGap ?? co.nationalCapacityGap ?? co.aggregateCapacityGap ?? NaN);
  const overloaded = Math.max(
    0,
    Math.floor(Number(co.overloadedFirmCount ?? co.overloadedCount ?? co.overloadCount ?? 0))
  );
  const alignment = Number(co.nationalAlignmentScore ?? co.alignmentScore ?? co.sectorAlignment ?? NaN);
  const productionMomentum = String(co.productionMomentum?.band ?? co.outputMomentum?.band ?? co.momentumBand ?? '');

  if (utilization === 'overextended' || utilization === 'saturated') {
    cycleNudge += 1;
    productivityNudge += 1;
    summary = `High private-sector utilization (${utilization}) supports macro cycle read.`;
  } else if (utilization === 'slack' || utilization === 'depressed' || utilization === 'critical') {
    cycleNudge -= utilization === 'critical' ? 3 : 2;
    investmentNudge -= 1;
    summary = `Slack production utilization (${utilization}) drags macro cycle and investment read.`;
  }

  if (Number.isFinite(capacityGap) && capacityGap > 0.25) {
    investmentNudge += 2;
    cycleNudge += 0.5;
    summary = (summary ? summary + ' ' : '') + 'Positive national capacity gap lifts capex-heavy investment interpretation.';
  } else if (Number.isFinite(capacityGap) && capacityGap < -0.15) {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Negative capacity gap signals binding production constraints.';
  }

  if (overloaded >= 4) {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + `${overloaded} overloaded firms weigh on productivity read.`;
  } else if (overloaded >= 2) {
    productivityNudge -= 1;
  }

  if (Number.isFinite(alignment) && alignment < 45) {
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Weak sector alignment reduces macro productivity confidence.';
  } else if (Number.isFinite(alignment) && alignment > 72) {
    productivityNudge += 1;
  }

  if (productionMomentum === 'surging' || productionMomentum === 'strong') {
    cycleNudge += 1;
    investmentNudge += 1;
  } else if (productionMomentum === 'contracting' || productionMomentum === 'stalled') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Contracting production momentum drags macro cycle read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCompaniesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCompaniesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
