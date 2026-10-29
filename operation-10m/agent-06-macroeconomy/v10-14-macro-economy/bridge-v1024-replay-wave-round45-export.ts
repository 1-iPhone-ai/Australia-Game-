import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroReplayWave45ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 45 export spillover (Agent 24 wave 45 export). */
export function readMacroReplayWave45ExportSpilloverFromV1024(
  inputs: MacroEconomyInputs
): MacroReplayWave45ExportSpillover {
  const exportPayload: any =
    inputs.replayWave45Export ??
    inputs.historyReplay?.wave45Export ??
    inputs.replay?.wave45Export ??
    inputs.nationalHistory?.replayWave45Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round45Ready = Boolean(
    exportPayload.round45Ready ??
      exportPayload.payload?.round45Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round45Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 45 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-221' || waveRound === 45) {
    productivityNudge += 1;
    summary = `Wave 45 replay export latched (${o10Task || 'O10-221'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 2_520_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 45 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave45ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave45ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
