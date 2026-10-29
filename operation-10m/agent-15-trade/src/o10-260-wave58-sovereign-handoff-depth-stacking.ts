/**
 * Agent 15 scale wave round 58 (O10-260) — sovereign handoff depth stacking stub (stacks wave-56 depth).
 */

import type { GTELWave57SovereignHandoffDepthStackingSnapshot } from './o10-254-wave56-sovereign-handoff-depth-stacking.ts';
import type { GTELPersisted } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface GTELWave58SovereignHandoffDepthStackingSnapshot {
  score: number;
  band: 'stacked' | 'tiered' | 'layering' | 'sparse';
  summary: string;
}

export function sanitizeWave58SovereignHandoffDepthStackingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.57), 0.2, 0.96);
}

export function computeWave58SovereignHandoffDepthStackingSnapshot(input: {
  wave57Stacking: GTELWave57SovereignHandoffDepthStackingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELWave58SovereignHandoffDepthStackingSnapshot; persisted: GTELPersisted } {
  const raw = gtelClamp(input.wave57Stacking.score * 0.94 + 0.08, 0.2, 0.96);
  const prev = sanitizeWave58SovereignHandoffDepthStackingSmoothing(
    input.persisted.wave58SovereignHandoffDepthStackingSmoothing,
  );
  const score = gtelClamp(prev * 0.2 + raw * 0.8, 0.2, 0.96);
  const band: GTELWave58SovereignHandoffDepthStackingSnapshot['band'] =
    score >= 0.91 ? 'stacked' : score >= 0.73 ? 'tiered' : score >= 0.57 ? 'layering' : 'sparse';
  const persisted: GTELPersisted = {
    ...input.persisted,
    wave58SovereignHandoffDepthStackingSmoothing: Math.round(score * 1000) / 1000,
  };
  return {
    snapshot: {
      score,
      band,
      summary: `Wave 58 sovereign handoff depth stacking ${band} (${score.toFixed(2)})`,
    },
    persisted,
  };
}

export function wave58SovereignHandoffDepthStackingExportScale(
  snapshot: GTELWave58SovereignHandoffDepthStackingSnapshot,
): number {
  return gtelClamp(snapshot.score * 1.04, 0.2, 0.98);
}
