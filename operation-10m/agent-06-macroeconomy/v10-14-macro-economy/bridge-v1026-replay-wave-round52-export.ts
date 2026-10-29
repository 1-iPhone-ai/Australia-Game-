import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroReplayWave52ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 51 export spillover (Agent 24 wave 51 export). */
export function readMacroReplayWave52ExportSpilloverFromV1026(
  inputs: MacroEconomyInputs
): MacroReplayWave52ExportSpillover {
  const exportPayload: any =
    inputs.replayWave52Export ??
    inputs.historyReplay?.wave52Export ??
    inputs.replay?.wave52Export ??
    inputs.nationalHistory?.replayWave52Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round52Ready = Boolean(
    exportPayload.round52Ready ??
      exportPayload.payload?.round52Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round52Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 51 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-235' || waveRound === 52) {
    productivityNudge += 1;
    summary = `Wave 51 replay export latched (${o10Task || 'O10-235'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 2_700_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 50 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave52ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave52ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
