import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroForecastWave44ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast wave 44 export spillover (Agent 21 wave 44 baseline). */
export function readMacroForecastWave44ExportSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastWave44ExportSpillover {
  const sync: any =
    inputs.forecastWave44Export ??
    inputs.forecastingLab?.wave44Export ??
    inputs.macroForecasts?.wave44Export ??
    inputs.nationalForecasts?.wave44Sync;
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
    summary = 'Forecast wave 44 export drifted — macro downside transmission amplifies.';
  } else if (status === 'aligned') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Aligned forecast wave 44 export supports macro investment interpretation.';
  } else if (status === 'unknown') {
    productivityNudge -= 1;
    summary = 'Unknown forecast wave 44 export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('bca7e0a3')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-bca7e0a3 wave 44 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_480_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 44 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastWave44ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastWave44ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
