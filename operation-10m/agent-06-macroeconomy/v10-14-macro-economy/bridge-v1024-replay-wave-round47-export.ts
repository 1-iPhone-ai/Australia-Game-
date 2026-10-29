import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroReplayWave47ExportSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.24 history replay wave 47 export spillover (Agent 24 wave 47 export). */
export function readMacroReplayWave47ExportSpilloverFromV1024(
  inputs: MacroEconomyInputs
): MacroReplayWave47ExportSpillover {
  const exportPayload: any =
    inputs.replayWave47Export ??
    inputs.historyReplay?.wave47Export ??
    inputs.replay?.wave47Export ??
    inputs.nationalHistory?.replayWave47Export;
  if (!exportPayload) {
    return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };
  }

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const round47Ready = Boolean(
    exportPayload.round47Ready ??
      exportPayload.payload?.round47Ready ??
      exportPayload.exportReady ??
      exportPayload.ready
  );
  const o10Task = String(exportPayload.o10TaskId ?? exportPayload.taskId ?? exportPayload.payload?.o10TaskId ?? '');
  const waveRound = Number(exportPayload.waveRound ?? exportPayload.payload?.waveRound ?? 0);
  const locHint = Number(
    exportPayload.projectedLocHint ?? exportPayload.payload?.projectedLocHint ?? exportPayload.locHint ?? 0
  );
  const integrityBand = String(exportPayload.integrityBand ?? exportPayload.payload?.integrityBand ?? '');

  if (!round47Ready) {
    cycleNudge -= 3;
    investmentNudge -= 2;
    summary = 'History replay wave 47 export not ready — macro cycle read drags.';
  } else if (o10Task === 'O10-225' || waveRound === 47) {
    productivityNudge += 1;
    summary = `Wave 47 replay export latched (${o10Task || 'O10-225'}) supports macro productivity read.`;
  }

  if (integrityBand === 'corrupt' || integrityBand === 'broken') {
    investmentNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Corrupt replay integrity band strains macro investment spillover.';
  }

  if (locHint > 0 && locHint < 2_600_000) {
    cycleNudge -= 2;
    summary = (summary ? summary + ' ' : '') + 'Stale wave 47 projected LOC hint misaligns macro cycle transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroReplayWave47ExportSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroReplayWave47ExportSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
