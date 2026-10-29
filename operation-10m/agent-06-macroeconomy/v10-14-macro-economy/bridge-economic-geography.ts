import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroGeographySpillover {
  investmentNudge: number;
  cycleNudge: number;
  summary: string | null;
}

/** Read-only V10.11 economic geography / urbanization spillover. */
export function readMacroGeographySpillover(inputs: MacroEconomyInputs): MacroGeographySpillover {
  const geo: any = inputs.economicGeography;
  if (!geo) return { investmentNudge: 0, cycleNudge: 0, summary: null };
  const connectivity = String(geo.connectivity?.band ?? geo.infrastructureConnectivity ?? 'moderate');
  const urbanization = Number(geo.urbanizationIndex ?? geo.metroConcentration ?? 50);
  const dispersion = String(geo.regionalDispersion?.band ?? geo.dispersionBand ?? 'balanced');
  let investmentNudge = 0;
  let cycleNudge = 0;
  let summary: string | null = null;
  if (connectivity === 'strong' || connectivity === 'leading') {
    investmentNudge += 2;
    cycleNudge += 1;
    summary = 'Strong economic geography connectivity lifts investment interpretation.';
  }
  if (connectivity === 'weak' || connectivity === 'fragmented') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = 'Fragmented geography weighs on national investment climate read.';
  }
  if (urbanization > 68) {
    investmentNudge += 1;
    summary = (summary ? summary + ' ' : '') + 'High urban concentration supports services-led macro mix.';
  }
  if (dispersion === 'wide' || dispersion === 'polarized') {
    cycleNudge -= 1.5;
    summary = (summary ? summary + ' ' : '') + 'Polarized regional geography reinforces divergence risk.';
  }
  return {
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    summary
  };
}

export function applyMacroGeographySpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroGeographySpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
