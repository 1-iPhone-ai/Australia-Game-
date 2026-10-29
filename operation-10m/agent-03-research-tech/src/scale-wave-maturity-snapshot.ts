import type { ResearchScaleWaveMaturityOutlook, ResearchScaleWaveMaturitySnapshot } from './types.ts';
import { RESEARCH_SCALE_WAVE_MATURITY_BANDS } from './scale-wave-maturity-band-log.ts';

/** Compact persisted digest of scale-wave maturity at seal (round 17). */
export function computeScaleWaveMaturitySnapshot(
  outlook: ResearchScaleWaveMaturityOutlook,
  turn: number
): ResearchScaleWaveMaturitySnapshot {
  const nationalMaturityScore = Math.round(
    Math.min(100, Math.max(0, outlook.nationalMaturityScore ?? 0))
  );
  const projectedMaturityScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectedMaturityScore ?? 0))
  );
  const deliveryMomentum = Math.round(Math.min(100, Math.max(0, outlook.deliveryMomentum ?? 0)));
  const tierFiveUnlockedCount = Math.max(0, outlook.tierFiveUnlockedCount ?? 0);
  let peakBand = 0;
  for (const band of RESEARCH_SCALE_WAVE_MATURITY_BANDS) {
    if (nationalMaturityScore >= band) peakBand = band;
  }
  const payload = `t${turn}|n${nationalMaturityScore}|p${projectedMaturityScore}|h${outlook.horizonTurns}|d${deliveryMomentum}|t5${tierFiveUnlockedCount}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalMaturityScore,
    projectedMaturityScore,
    horizonTurns: outlook.horizonTurns,
    deliveryMomentum,
    tierFiveUnlockedCount,
    peakBand: peakBand as ResearchScaleWaveMaturitySnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeScaleWaveMaturitySnapshots(
  local: ResearchScaleWaveMaturitySnapshot | undefined,
  remote: ResearchScaleWaveMaturitySnapshot | undefined
): ResearchScaleWaveMaturitySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
