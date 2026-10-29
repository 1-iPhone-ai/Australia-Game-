import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroForecastWave39ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast wave 39 export spillover (Agent 21 wave 39 baseline). */
export function readMacroForecastWave39ExportSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastWave39ExportSpillover {
  const sync: any =
    inputs.forecastWave39Export ??
    inputs.forecastingLab?.wave39Export ??
    inputs.macroForecasts?.wave39Export ??
    inputs.nationalForecasts?.wave39Sync;
  if (!sync) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const status = String(sync.status ?? sync.syncStatus ?? sync.exportStatus ?? 'unknown').toLowerCase();
  const baselineSha = String(sync.baselineSha ?? sync.baseline ?? '');
  const projectedLoc = Number(sync.projectedFunctionalLoc ?? sync.projectedLoc ?? 0);

  if (status === 'drift') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Forecast wave 39 export drifted — macro downside transmission amplifies.';
  } else if (status === 'aligned') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Aligned forecast wave 39 export supports macro investment interpretation.';
  } else if (status === 'unknown') {
    productivityNudge -= 1;
    summary = 'Unknown forecast wave 39 export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('6134c6a')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-6134c6a wave 39 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_070_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 39 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastWave39ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastWave39ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
