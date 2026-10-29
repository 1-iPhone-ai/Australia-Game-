/**
 * Agent 15 scale wave round 56 (O10-254) — sovereign handoff depth stacking stub (stacks wave-55 depth).
 */

import type { GTELWave55SovereignHandoffDepthStackingSnapshot } from './o10-247-wave55-sovereign-handoff-depth-stacking.ts';
import type { GTELPersisted } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface GTELWave56SovereignHandoffDepthStackingSnapshot {
  score: number;
  band: 'stacked' | 'tiered' | 'layering' | 'sparse';
  summary: string;
}

export function sanitizeWave56SovereignHandoffDepthStackingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.57), 0.2, 0.96);
}

export function computeWave56SovereignHandoffDepthStackingSnapshot(input: {
  wave55Stacking: GTELWave55SovereignHandoffDepthStackingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELWave56SovereignHandoffDepthStackingSnapshot; persisted: GTELPersisted } {
  const raw = gtelClamp(input.wave55Stacking.score * 0.94 + 0.08, 0.2, 0.96);
  const prev = sanitizeWave56SovereignHandoffDepthStackingSmoothing(
    input.persisted.wave56SovereignHandoffDepthStackingSmoothing,
  );
  const score = gtelClamp(prev * 0.2 + raw * 0.8, 0.2, 0.96);
  const band: GTELWave56SovereignHandoffDepthStackingSnapshot['band'] =
    score >= 0.91 ? 'stacked' : score >= 0.73 ? 'tiered' : score >= 0.57 ? 'layering' : 'sparse';
  const persisted: GTELPersisted = {
    ...input.persisted,
    wave56SovereignHandoffDepthStackingSmoothing: Math.round(score * 1000) / 1000,
  };
  return {
    snapshot: {
      score,
      band,
      summary: `Wave 56 sovereign handoff depth stacking ${band} (${score.toFixed(2)})`,
    },
    persisted,
  };
}

export function wave56SovereignHandoffDepthStackingExportScale(
  snapshot: GTELWave56SovereignHandoffDepthStackingSnapshot,
): number {
  return gtelClamp(snapshot.score * 1.04, 0.2, 0.98);
}
