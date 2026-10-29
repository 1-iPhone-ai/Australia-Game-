import type { ResearchTrancheDryRunHandoffOutlook, ResearchTrancheDryRunHandoffSnapshot } from './types.ts';
import { RESEARCH_DRY_RUN_HANDOFF_BANDS } from './tranche-dry-run-handoff-band-log.ts';

/** Compact persisted digest of dry-run handoff at seal (round 22). */
export function computeDryRunHandoffSnapshot(
  outlook: ResearchTrancheDryRunHandoffOutlook,
  turn: number
): ResearchTrancheDryRunHandoffSnapshot {
  const handoffReadinessScore = Math.round(
    Math.min(100, Math.max(0, outlook.handoffReadinessScore ?? 0))
  );
  const handoffMomentum = Math.round(Math.min(100, Math.max(0, outlook.handoffMomentum ?? 0)));
  let peakBand = 0;
  for (const band of RESEARCH_DRY_RUN_HANDOFF_BANDS) {
    if (handoffReadinessScore >= band) peakBand = band;
  }
  const payload = `t${turn}|h${handoffReadinessScore}|m${handoffMomentum}|w${outlook.waveOrdinal}|d${outlook.dryRunEligible ? 1 : 0}`;
  let hash = 2166136261 >>> 0;
  for (let i = 0; i < payload.length; i++) {
    hash ^= payload.charCodeAt(i);
    hash = Math.imul(hash, 16777619) >>> 0;
  }
  return {
    capturedAtTurn: turn,
    handoffReadinessScore,
    horizonTurns: outlook.horizonTurns,
    waveOrdinal: outlook.waveOrdinal,
    handoffMomentum,
    dryRunEligible: outlook.dryRunEligible,
    peakBand: peakBand as ResearchTrancheDryRunHandoffSnapshot['peakBand'],
    digest: hash.toString(36),
  };
}

export function mergeDryRunHandoffSnapshots(
  local: ResearchTrancheDryRunHandoffSnapshot | undefined,
  remote: ResearchTrancheDryRunHandoffSnapshot | undefined
): ResearchTrancheDryRunHandoffSnapshot | undefined {
  if (!local && !remote) return undefined;
  if (!local) return remote;
  if (!remote) return local;
  return local.capturedAtTurn >= remote.capturedAtTurn ? local : remote;
}
