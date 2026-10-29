import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroReplayWave41ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 41 export spillover (Agent 24 wave 41 export). */
export function readMacroReplayWave41ExportSpilloverFromV1024(
  inputs: MacroEconomyInputs
): MacroReplayWave41ExportSpillover {
  const exportPayload: any =
    inputs.replayWave41Export ??
    inputs.historyReplay?.wave41Export ??
    inputs.replay?.wave41Export ??
    inputs.nationalHistory?.replayWave41Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round41Ready = Boolean(
    exportPayload.round41Ready ??
      exportPayload.payload?.round41Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round41Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 41 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-213' || waveRound === 41) {
    productivityNudge += 1;
    summary = `Wave 41 replay export latched (${o10Task || 'O10-213'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 2_140_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 41 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave41ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave41ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
