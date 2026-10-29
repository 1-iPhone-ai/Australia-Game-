import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroReplayWave55ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 54 export spillover (Agent 24 wave 54 export). */
export function readMacroReplayWave55ExportSpilloverFromV1033(
  inputs: MacroEconomyInputs
): MacroReplayWave55ExportSpillover {
  const exportPayload: any =
    inputs.replayWave55Export ??
    inputs.historyReplay?.wave55Export ??
    inputs.replay?.wave55Export ??
    inputs.nationalHistory?.replayWave55Export ??
    inputs.replayWave53Export ??
    inputs.historyReplay?.wave53Export ??
    inputs.replay?.wave53Export ??
    inputs.nationalHistory?.replayWave53Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round56Ready = Boolean(
    exportPayload.round56Ready ??
      exportPayload.payload?.round56Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round56Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 54 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-254' || waveRound === 55) {
    productivityNudge += 1;
    summary = `Wave 54 replay export latched (${o10Task || 'O10-254'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 3_050_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 54 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave55ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave55ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
