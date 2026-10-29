import type {
  ResearchScaleWavePostSealHandoffOutlook,
  ResearchScaleWavePostSealHandoffSnapshot,
} from './types.ts';
import { RESEARCH_POST_SEAL_HANDOFF_BANDS } from './scale-wave-post-seal-handoff-band-log.ts';

/** Compact persisted digest of post-seal handoff at seal (round 26). */
export function computePostSealHandoffSnapshot(
  outlook: ResearchScaleWavePostSealHandoffOutlook,
  turn: number
): ResearchScaleWavePostSealHandoffSnapshot {
  const postSealHandoffScore = Math.round(
    Math.min(100, Math.max(0, outlook.postSealHandoffScore ?? 0))
  );
  const handoffMomentum = Math.round(Math.min(100, Math.max(0, outlook.handoffMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_POST_SEAL_HANDOFF_BANDS) {
    if (postSealHandoffScore >= band) peakBand = band;
  }
  const payload = `t${turn}|h${postSealHandoffScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    postSealHandoffScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    handoffMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWavePostSealHandoffSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergePostSealHandoffSnapshots(
  local: ResearchScaleWavePostSealHandoffSnapshot | undefined,
  remote: ResearchScaleWavePostSealHandoffSnapshot | undefined
): ResearchScaleWavePostSealHandoffSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
