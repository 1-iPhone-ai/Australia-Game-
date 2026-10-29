import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroForecastWave36ProjectionSyncSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.21 forecast wave 36 projection sync spillover (Agent 21 wave 36 baseline). */
export function readMacroForecastWave36ProjectionSyncSpilloverFromV1021(
  inputs: MacroEconomyInputs
): MacroForecastWave36ProjectionSyncSpillover {
  const sync: any =
    inputs.forecastWave36ProjectionSync ??
    inputs.forecastingLab?.wave36ProjectionSync ??
    inputs.macroForecasts?.wave36ProjectionSync ??
    inputs.nationalForecasts?.wave36Sync;
  if (!sync) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const status = String(sync.status ?? sync.syncStatus ?? sync.projectionStatus ?? 'unknown').toLowerCase();
  const baselineSha = String(sync.baselineSha ?? sync.baseline ?? '');
  const projectedLoc = Number(sync.projectedFunctionalLoc ?? sync.projectedLoc ?? 0);

  if (status === 'drift') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'Forecast wave 36 projection sync drifted — macro downside transmission amplifies.';
  } else if (status === 'aligned') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Aligned forecast wave 36 projection sync supports macro investment interpretation.';
  } else if (status === 'unknown') {
    productivityNudge -= 1;
    summary = 'Unknown forecast wave 36 projection sync weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('ea2bb03')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-ea2bb03 wave 36 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 1_950_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 36 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroForecastWave36ProjectionSyncSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroForecastWave36ProjectionSyncSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
