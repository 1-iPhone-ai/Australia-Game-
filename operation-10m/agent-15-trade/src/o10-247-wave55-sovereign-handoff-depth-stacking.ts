/**
 * Agent 15 scale wave round 55 (O10-247) — sovereign handoff depth stacking stub.
 */

import type { GTELWave54SovereignHandoffLatticeSnapshot } from './o10-240-wave54-sovereign-handoff-lattice.ts';
import type { GTELPersisted } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface GTELWave55SovereignHandoffDepthStackingSnapshot {
  score: number;
  band: 'stacked' | 'tiered' | 'layering' | 'sparse';
  summary: string;
}

export function sanitizeWave55SovereignHandoffDepthStackingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.56), 0.2, 0.96);
}

export function computeWave55SovereignHandoffDepthStackingSnapshot(input: {
  wave54Lattice: GTELWave54SovereignHandoffLatticeSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELWave55SovereignHandoffDepthStackingSnapshot; persisted: GTELPersisted } {
  const raw = gtelClamp(input.wave54Lattice.score * 0.93 + 0.09, 0.2, 0.96);
  const prev = sanitizeWave55SovereignHandoffDepthStackingSmoothing(
    input.persisted.wave55SovereignHandoffDepthStackingSmoothing,
  );
  const score = gtelClamp(prev * 0.2 + raw * 0.8, 0.2, 0.96);
  const band: GTELWave55SovereignHandoffDepthStackingSnapshot['band'] =
    score >= 0.9 ? 'stacked' : score >= 0.72 ? 'tiered' : score >= 0.56 ? 'layering' : 'sparse';
  const persisted: GTELPersisted = {
    ...input.persisted,
    wave55SovereignHandoffDepthStackingSmoothing: Math.round(score * 1000) / 1000,
  };
  return {
    snapshot: {
      score,
      band,
      summary: `Wave 55 sovereign handoff depth stacking ${band} (${score.toFixed(2)})`,
    },
    persisted,
  };
}

export function wave55SovereignHandoffDepthStackingExportScale(
  snapshot: GTELWave55SovereignHandoffDepthStackingSnapshot,
): number {
  return gtelClamp(snapshot.score * 1.03, 0.2, 0.98);
}
