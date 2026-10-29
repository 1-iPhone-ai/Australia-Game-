import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroDemographicShiftSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.09 demographic shift spillover (Agent 09 domain; distinct from population layer). */
export function readMacroDemographicShiftSpilloverFromV1009(inputs: MacroEconomyInputs): MacroDemographicShiftSpillover {
  const ds: any =
    inputs.demographicShift ??
    inputs.population?.shift ??
    inputs.demographics?.shift ??
    inputs.nationalPopulation?.shift;
  if (!ds) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const migration = String(ds.migrationBand ?? ds.flowBand ?? '');
  const aging = String(ds.agingBand ?? ds.dependencyBand ?? '');
  const participation = String(ds.participationBand ?? ds.laborParticipation?.band ?? '');

  if (migration === 'surge_out' || migration === 'critical' || migration === 'brain_drain') {
    productivityNudge -= 2;
    cycleNudge -= 1;
    summary = `Adverse demographic migration (${migration}) drags macro productivity read.`;
  } else if (migration === 'balanced' || migration === 'inflow') {
    cycleNudge += 0.5;
    summary = `Balanced migration (${migration}) supports macro cycle interpretation.`;
  }

  if (aging === 'rapid' || aging === 'critical' || aging === 'accelerating') {
    productivityNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Rapid population aging weighs on macro investment/productivity read.';
  }

  if (participation === 'falling' || participation === 'critical' || participation === 'collapsed') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Falling labor participation drags macro cycle spillover.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDemographicShiftSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDemographicShiftSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
