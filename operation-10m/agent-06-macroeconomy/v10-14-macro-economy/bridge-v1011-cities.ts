import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroCitiesSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.11 cities / regions urban spillover (distinct from economic geography bridge). */
export function readMacroCitiesSpilloverFromV1011Cities(inputs: MacroEconomyInputs): MacroCitiesSpillover {
  const ct: any =
    inputs.citiesRegions ??
    inputs.urbanRegions ??
    inputs.metropolitanSystems ??
    inputs.nationalSystems?.cities ??
    inputs.nationalSystems?.urban;
  if (!ct) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const urbanization = String(ct.urbanizationBand ?? ct.urbanGrowth?.band ?? ct.metroMomentum?.band ?? '');
  const housingPressure = String(ct.housingPressure?.band ?? ct.metroHousing?.band ?? '');
  const hubStrength = String(ct.hubStrength?.band ?? ct.primateCity?.band ?? ct.metroCluster?.band ?? '');

  if (urbanization === 'surging' || urbanization === 'rapid') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = `Rapid urbanization (${urbanization}) lifts macro investment and cycle read.`;
  } else if (urbanization === 'stagnant' || urbanization === 'declining') {
    cycleNudge -= 1;
    productivityNudge -= 1;
    summary = `Weak urban momentum (${urbanization}) drags macro cycle interpretation.`;
  }

  if (housingPressure === 'severe' || housingPressure === 'critical' || housingPressure === 'elevated') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Metro housing pressure weighs on macro cycle read.';
  }

  if (hubStrength === 'leading' || hubStrength === 'global' || hubStrength === 'strong') {
    productivityNudge += 1;
    cycleNudge += 0.5;
    summary = (summary ? summary + ' ' : '') + 'Strong metro hubs support macro productivity interpretation.';
  } else if (hubStrength === 'fragmented' || hubStrength === 'weak') {
    productivityNudge -= 1;
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -6, 6),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroCitiesSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroCitiesSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
