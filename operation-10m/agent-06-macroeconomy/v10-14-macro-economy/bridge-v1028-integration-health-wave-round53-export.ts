import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroIntegrationHealthWave52ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.25 integration health wave 51 export spillover (Agent 25 wave 51 export). */
export function readMacroIntegrationHealthWave52ExportSpilloverFromV1027(
  inputs: MacroEconomyInputs
): MacroIntegrationHealthWave52ExportSpillover {
  const exportPayload: any =
    inputs.integrationHealthWave52Export ??
    inputs.integrationHealth?.wave52Export ??
    inputs.assembly?.integrationHealthWave52Export ??
    inputs.nationalIntegration?.healthWave52Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const healthReady = Boolean(
    exportPayload.healthReady ??
      exportPayload.round53Ready ??
      exportPayload.payload?.healthReady ??
      exportPayload.exportReady
  );
  const baselineSha = String(exportPayload.baselineSha ?? exportPayload.payload?.baselineSha ?? '');
  const projectedLoc = Number(exportPayload.projectedFunctionalLoc ?? exportPayload.projectedLoc ?? 0);
  const slotBand = String(exportPayload.slotBand ?? exportPayload.payload?.slotBand ?? '');

  if (!healthReady) {
    investmentNudge -= 3;
    productivityNudge -= 1;
    summary = 'Integration health wave 51 export not ready — macro investment read drags.';
  } else if (slotBand === 'green' || slotBand === 'latched') {
    investmentNudge += 1;
    cycleNudge += 1;
    summary = 'Latched integration health wave 51 export supports macro cycle interpretation.';
  }

  if (baselineSha && !baselineSha.toLowerCase().startsWith('a32b2b15')) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Non-a32b2b15 wave 50 baseline SHA misaligns macro cycle read.';
  }

  if (projectedLoc > 0 && projectedLoc < 2_700_000) {
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Under-projected wave 51 functional LOC drags macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroIntegrationHealthWave52ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroIntegrationHealthWave52ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
