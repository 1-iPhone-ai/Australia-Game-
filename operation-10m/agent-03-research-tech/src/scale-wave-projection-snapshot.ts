import type { ResearchScaleWaveProjectionOutlook, ResearchScaleWaveProjectionSnapshot } from './types.ts';
import { RESEARCH_SCALE_WAVE_PROJECTION_BANDS } from './scale-wave-projection-band-log.ts';

/** Compact persisted digest of scale-wave projection at seal (round 19). */
export function computeScaleWaveProjectionSnapshot(
  outlook: ResearchScaleWaveProjectionOutlook,
  turn: number
): ResearchScaleWaveProjectionSnapshot {
  const projectionReadinessScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectionReadinessScore ?? 0))
  );
  const integrationBandHeadroom = Math.round(
    Math.min(100, Math.max(0, outlook.integrationBandHeadroom ?? 0))
  );
  const maturityBandHeadroom = Math.round(Math.min(100, Math.max(0, outlook.maturityBandHeadroom ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SCALE_WAVE_PROJECTION_BANDS) {
    if (projectionReadinessScore >= band) peakBand = band;
  }
  const payload = `t${turn}|p${projectionReadinessScore}|h${outlook.horizonTurns}|w${outlook.waveOrdinal}|i${integrationBandHeadroom}|m${maturityBandHeadroom}|d${outlook.dryRunEligible ? 1 : 0}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    projectionReadinessScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    integrationBandHeadroom,
    maturityBandHeadroom,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveProjectionSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeScaleWaveProjectionSnapshots(
  local: ResearchScaleWaveProjectionSnapshot | undefined,
  remote: ResearchScaleWaveProjectionSnapshot | undefined
): ResearchScaleWaveProjectionSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
