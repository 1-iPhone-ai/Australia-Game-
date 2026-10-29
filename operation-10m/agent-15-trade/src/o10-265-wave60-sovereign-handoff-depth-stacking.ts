/**
 * Agent 15 scale wave round 60 (O10-265) — sovereign handoff depth stacking stub (stacks wave-56 depth).
 */

import type { GTELWave59SovereignHandoffDepthStackingSnapshot } from './o10-254-wave56-sovereign-handoff-depth-stacking.ts';
import type { GTELPersisted } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface GTELWave60SovereignHandoffDepthStackingSnapshot {
  score: number;
  band: 'stacked' | 'tiered' | 'layering' | 'sparse';
  summary: string;
}

export function sanitizeWave60SovereignHandoffDepthStackingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.57), 0.2, 0.96);
}

export function computeWave60SovereignHandoffDepthStackingSnapshot(input: {
  wave59Stacking: GTELWave57SovereignHandoffDepthStackingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELWave60SovereignHandoffDepthStackingSnapshot; persisted: GTELPersisted } {
  const raw = gtelClamp(input.wave58Stacking.score * 0.94 + 0.08, 0.2, 0.96);
  const prev = sanitizeWave60SovereignHandoffDepthStackingSmoothing(
    input.persisted.wave60SovereignHandoffDepthStackingSmoothing,
  );
  const score = gtelClamp(prev * 0.2 + raw * 0.8, 0.2, 0.96);
  const band: GTELWave60SovereignHandoffDepthStackingSnapshot['band'] =
    score >= 0.91 ? 'stacked' : score >= 0.73 ? 'tiered' : score >= 0.57 ? 'layering' : 'sparse';
  const persisted: GTELPersisted = {
    ...input.persisted,
    wave60SovereignHandoffDepthStackingSmoothing: Math.round(score * 1000) / 1000,
  };
  return {
    snapshot: {
      score,
      band,
      summary: `Wave 60 sovereign handoff depth stacking ${band} (${score.toFixed(2)})`,
    },
    persisted,
  };
}

export function wave60SovereignHandoffDepthStackingExportScale(
  snapshot: GTELWave60SovereignHandoffDepthStackingSnapshot,
): number {
  return gtelClamp(snapshot.score * 1.04, 0.2, 0.98);
}
