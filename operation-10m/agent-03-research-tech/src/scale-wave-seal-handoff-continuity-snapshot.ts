import type {
  ResearchScaleWaveSealHandoffContinuityOutlook,
  ResearchScaleWaveSealHandoffContinuitySnapshot,
} from './types.ts';
import { RESEARCH_SEAL_HANDOFF_CONTINUITY_BANDS } from './scale-wave-seal-handoff-continuity-band-log.ts';

/** Compact persisted digest of seal handoff continuity (round 32). */
export function computeSealHandoffContinuitySnapshot(
  outlook: ResearchScaleWaveSealHandoffContinuityOutlook,
  turn: number
): ResearchScaleWaveSealHandoffContinuitySnapshot {
  const sealHandoffContinuityScore = Math.round(
    Math.min(100, Math.max(0, outlook.sealHandoffContinuityScore ?? 0))
  );
  const continuityMomentum = Math.round(Math.min(100, Math.max(0, outlook.continuityMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_SEAL_HANDOFF_CONTINUITY_BANDS) {
    if (sealHandoffContinuityScore >= band) peakBand = band;
  }
  const payload = `t${turn}|c${sealHandoffContinuityScore}|w${outlook.waveOrdinal}|p${outlook.projectedFunctionalHint}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    sealHandoffContinuityScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    continuityMomentum,
    projectedFunctionalHint: outlook.projectedFunctionalHint,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchScaleWaveSealHandoffContinuitySnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeSealHandoffContinuitySnapshots(
  local: ResearchScaleWaveSealHandoffContinuitySnapshot | undefined,
  remote: ResearchScaleWaveSealHandoffContinuitySnapshot | undefined
): ResearchScaleWaveSealHandoffContinuitySnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
