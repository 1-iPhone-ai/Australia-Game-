import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroDashboardClarityWave37ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.23 dashboard clarity wave 37 export spillover (Agent 23 wave 37 export). */
export function readMacroDashboardClarityWave37ExportSpilloverFromV1023(
  inputs: MacroEconomyInputs
): MacroDashboardClarityWave37ExportSpillover {
  const exportPayload: any =
    inputs.dashboardClarityWave37Export ??
    inputs.dashboardClarity?.wave37Export ??
    inputs.dashboards?.clarityWave37Export ??
    inputs.nationalDashboards?.clarityWave37Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const clarityReady = Boolean(
    exportPayload.clarityReady ??
      exportPayload.round37Ready ??
      exportPayload.payload?.clarityReady ??
      exportPayload.exportReady
  );
  const signalBand = String(exportPayload.signalBand ?? exportPayload.payload?.signalBand ?? '');
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);

  if (!clarityReady) {
    investmentNudge -= 3;
    cycleNudge -= 1;
    summary = 'Dashboard clarity wave 37 export not ready — macro investment read drags.';
  } else if (signalBand === 'clear' || signalBand === 'strong') {
    investmentNudge += 1;
    productivityNudge += 1;
    summary = 'Clear dashboard clarity wave 37 export supports macro investment interpretation.';
  }

  if (signalBand === 'misleading' || signalBand === 'critical') {
    productivityNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Misleading dashboard clarity export weakens macro productivity spillover.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('cfb4603')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-cfb4603 wave 37 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 1_990_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 37 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroDashboardClarityWave37ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroDashboardClarityWave37ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
