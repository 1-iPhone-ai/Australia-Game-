import type { ResearchStrategicDeliveryOutlook, ResearchStrategicDeliverySnapshot } from './types.ts';
import { RESEARCH_STRATEGIC_DELIVERY_BANDS } from './strategic-delivery-band-log.ts';

/** Compact persisted digest of strategic delivery at seal (round 16). */
export function computeStrategicDeliverySnapshot(
  outlook: ResearchStrategicDeliveryOutlook,
  turn: number
): ResearchStrategicDeliverySnapshot {
  const nationalDeliveryScore = Math.round(
    Math.min(100, Math.max(0, outlook.nationalDeliveryScore ?? 0))
  );
  const projectedDeliveryScore = Math.round(
    Math.min(100, Math.max(0, outlook.projectedDeliveryScore ?? 0))
  );
  const executionMomentum = Math.round(Math.min(100, Math.max(0, outlook.executionMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_STRATEGIC_DELIVERY_BANDS) {
    if (nationalDeliveryScore >= band) peakBand = band;
  }
  const payload = `t${turn}|n${nationalDeliveryScore}|p${projectedDeliveryScore}|h${outlook.horizonTurns}|m${executionMomentum}`;
  let h = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    h ^= payload.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    nationalDeliveryScore,
    projectedDeliveryScore,
    horizonTurns: outlook.horizonTurns,
    executionMomentum,
    peakBand: peakBand as ResearchStrategicDeliverySnapshot['peakBand'],
    digest: h.toString(36),
  };
}

export function mergeStrategicDeliverySnapshots(
  local: ResearchStrategicDeliverySnapshot | undefined,
  remote: ResearchStrategicDeliverySnapshot | undefined
): ResearchStrategicDeliverySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
