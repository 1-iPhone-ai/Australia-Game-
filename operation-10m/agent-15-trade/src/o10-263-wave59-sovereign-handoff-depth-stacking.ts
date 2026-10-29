/**
 * Agent 15 scale wave round 59 (O10-263) — sovereign handoff depth stacking stub (stacks wave-56 depth).
 */

import type { GTELWave58SovereignHandoffDepthStackingSnapshot } from './o10-254-wave56-sovereign-handoff-depth-stacking.ts';
import type { GTELPersisted } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface GTELWave59SovereignHandoffDepthStackingSnapshot {
  score: number;
  band: 'stacked' | 'tiered' | 'layering' | 'sparse';
  summary: string;
}

export function sanitizeWave59SovereignHandoffDepthStackingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.57), 0.2, 0.96);
}

export function computeWave59SovereignHandoffDepthStackingSnapshot(input: {
  wave58Stacking: GTELWave57SovereignHandoffDepthStackingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELWave59SovereignHandoffDepthStackingSnapshot; persisted: GTELPersisted } {
  const raw = gtelClamp(input.wave58Stacking.score * 0.94 + 0.08, 0.2, 0.96);
  const prev = sanitizeWave59SovereignHandoffDepthStackingSmoothing(
    input.persisted.wave59SovereignHandoffDepthStackingSmoothing,
  );
  const score = gtelClamp(prev * 0.2 + raw * 0.8, 0.2, 0.96);
  const band: GTELWave59SovereignHandoffDepthStackingSnapshot['band'] =
    score >= 0.91 ? 'stacked' : score >= 0.73 ? 'tiered' : score >= 0.57 ? 'layering' : 'sparse';
  const persisted: GTELPersisted = {
    ...input.persisted,
    wave59SovereignHandoffDepthStackingSmoothing: Math.round(score * 1000) / 1000,
  };
  return {
    snapshot: {
      score,
      band,
      summary: `Wave 59 sovereign handoff depth stacking ${band} (${score.toFixed(2)})`,
    },
    persisted,
  };
}

export function wave59SovereignHandoffDepthStackingExportScale(
  snapshot: GTELWave59SovereignHandoffDepthStackingSnapshot,
): number {
  return gtelClamp(snapshot.score * 1.04, 0.2, 0.98);
}
