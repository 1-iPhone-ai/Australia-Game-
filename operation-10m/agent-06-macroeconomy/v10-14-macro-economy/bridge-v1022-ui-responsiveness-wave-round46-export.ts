import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroUiResponsivenessWave46ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI responsiveness wave 46 export spillover (Agent 22 wave 46 export). */
export function readMacroUiResponsivenessWave46ExportSpilloverFromV1022(
  inputs: MacroEconomyInputs
): MacroUiResponsivenessWave46ExportSpillover {
  const exportPayload: any =
    inputs.uiResponsivenessWave46Export ??
    inputs.uiResponsiveness?.wave46Export ??
    inputs.gameUi?.responsivenessWave46Export ??
    inputs.nationalUi?.responsivenessWave46Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round46Ready = Boolean(
    exportPayload.round46Ready ??
      exportPayload.payload?.round46Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const latencyBand = String(exportPayload.latencyBand ?? exportPayload.payload?.latencyBand ?? '');

  if (!round46Ready) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'UI responsiveness wave 46 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-223' || waveRound === 46) {
    productivityNudge += 1;
    investmentNudge += 1;
    summary = `Wave 46 UI responsiveness export latched (${o10Task || 'O10-223'}) supports macro productivity read.`;
  }

  if (latencyBand === 'critical' || latencyBand === 'unresponsive') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Critical UI latency band strains macro cycle transmission.';
  }

  if (locHint > 0 && locHint < 2_560_000) {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 46 projected LOC hint misaligns macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiResponsivenessWave46ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiResponsivenessWave46ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
