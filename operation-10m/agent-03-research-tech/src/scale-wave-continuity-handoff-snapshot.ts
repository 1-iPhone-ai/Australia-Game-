import type {
  ResearchScaleWaveContinuityHandoffOutlook,
  ResearchScaleWaveContinuityHandoffSnapshot,
} from './types.ts';
import { RESEARCH_CONTINUITY_HANDOFF_BANDS } from './scale-wave-continuity-handoff-band-log.ts';

/** Compact persisted digest of continuity handoff at seal (round 28). */
export function computeContinuityHandoffSnapshot(
  outlook: ResearchScaleWaveContinuityHandoffOutlook,
  turn: number
): ResearchScaleWaveContinuityHandoffSnapshot {
  const continuityHandoffScore = Math.round(
    Math.min(100, Math.max(0, outlook.continuityHandoffScore ?? 0))
  );
  const handoffMomentum = Math.round(Math.min(100, Math.max(0, outlook.handoffMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_CONTINUITY_HANDOFF_BANDS) {
    if (continuityHandoffScore >= band) peakBand = band;
  }
  const payload = `t${turn}|h${continuityHandoffScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    continuityHandoffScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    handoffMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveContinuityHandoffSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeContinuityHandoffSnapshots(
  local: ResearchScaleWaveContinuityHandoffSnapshot | undefined,
  remote: ResearchScaleWaveContinuityHandoffSnapshot | undefined
): ResearchScaleWaveContinuityHandoffSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
