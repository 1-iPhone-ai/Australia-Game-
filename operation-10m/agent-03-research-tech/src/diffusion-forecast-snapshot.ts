import type { ResearchDiffusionForecast, ResearchDiffusionForecastSnapshot } from './types.ts';
import { RESEARCH_DIFFUSION_FORECAST_BANDS } from './diffusion-forecast-band-log.ts';

/** Compact persisted digest of diffusion forecast at seal (round 13). */
export function computeDiffusionForecastSnapshot(
  forecast: ResearchDiffusionForecast,
  turn: number
): ResearchDiffusionForecastSnapshot {
  const peakProjectedPercent = Math.round(Math.min(100, Math.max(0, (forecast.peakProjectedScore ?? 0) * 100)));
  const projectionCount = forecast.projections.length;
  let peakBand = 0;
  for (const band of RESEARCH_DIFFUSION_FORECAST_BANDS) {
    if (peakProjectedPercent >= band) peakBand = band;
  }
  const payload = `t${turn}|p${peakProjectedPercent}|h${forecast.horizonTurns}|n${projectionCount}|${forecast.peakRegionId ?? 'none'}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    peakProjectedPercent,
    horizonTurns: forecast.horizonTurns,
    projectionCount,
    peakRegionId: forecast.peakRegionId,
    peakBand: peakBand as ResearchDiffusionForecastSnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeDiffusionForecastSnapshots(
  local: ResearchDiffusionForecastSnapshot | undefined,
  remote: ResearchDiffusionForecastSnapshot | undefined
): ResearchDiffusionForecastSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
