import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroDashboardClarityWave46ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboard clarity wave 46 export spillover (Agent 23 wave 46 export). */
export function readMacroDashboardClarityWave46ExportSpilloverFromV1023(
  inputs: MacroEconomyInputs
): MacroDashboardClarityWave46ExportSpillover {
  const exportPayload: any =
    inputs.dashboardClarityWave46Export ??
    inputs.dashboardClarity?.wave46Export ??
    inputs.dashboards?.clarityWave46Export ??
    inputs.nationalDashboards?.clarityWave46Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const clarityReady = Boolean(
    exportPayload.clarityReady ??
      exportPayload.round46Ready ??
      exportPayload.payload?.clarityReady ??
      exportPayload.exportReady
  );
  const signalBand = String(exportPayload.signalBand ?? exportPayload.payload?.signalBand ?? '');
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);

  if (!clarityReady) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Dashboard clarity wave 46 export not ready — macro investment read drags.';
  } else if (signalBand === 'clear' || signalBand === 'strong') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Clear dashboard clarity wave 46 export supports macro investment interpretation.';
  }

  if (signalBand === 'misleading' || signalBand === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misleading dashboard clarity export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('a9bb07e5')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-a9bb07e5 wave 46 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_560_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 46 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardClarityWave46ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardClarityWave46ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
