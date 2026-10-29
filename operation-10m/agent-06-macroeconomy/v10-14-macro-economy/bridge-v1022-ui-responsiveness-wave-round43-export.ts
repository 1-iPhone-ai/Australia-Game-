import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroUiResponsivenessWave43ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.22 UI responsiveness wave 43 export spillover (Agent 22 wave 43 export). */
export function readMacroUiResponsivenessWave43ExportSpilloverFromV1022(
  inputs: MacroEconomyInputs
): MacroUiResponsivenessWave43ExportSpillover {
  const exportPayload: any =
    inputs.uiResponsivenessWave43Export ??
    inputs.uiResponsiveness?.wave43Export ??
    inputs.gameUi?.responsivenessWave43Export ??
    inputs.nationalUi?.responsivenessWave43Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round43Ready = Boolean(
    exportPayload.round43Ready ??
      exportPayload.payload?.round43Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const latencyBand = String(exportPayload.latencyBand ?? exportPayload.payload?.latencyBand ?? '');

  if (!round43Ready) {
    cycleNudge -= 3;
    productivityNudge -= 2;
    summary = 'UI responsiveness wave 43 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-217' || waveRound === 43) {
    productivityNudge += 1;
    investmentNudge += 1;
    summary = `Wave 43 UI responsiveness export latched (${o10Task || 'O10-217'}) supports macro productivity read.`;
  }

  if (latencyBand === 'critical' || latencyBand === 'unresponsive') {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Critical UI latency band strains macro cycle transmission.';
  }

  if (locHint > 0 && locHint < 2_240_000) {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 43 projected LOC hint misaligns macro investment read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroUiResponsivenessWave43ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroUiResponsivenessWave43ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
