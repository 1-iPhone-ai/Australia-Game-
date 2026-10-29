/**
 * Agent 15 scale wave round 53 (O10-237) — sovereign settlement forward-arc handoff depth stub.
 */

import type { GTELPersisted } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface GTELWave53SovereignHandoffDepthSnapshot {
  score: number;
  band: 'cleared' | 'staging' | 'queued' | 'blocked';
  summary: string;
}

export function sanitizeWave53SovereignHandoffDepthSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function computeWave53SovereignHandoffDepthSnapshot(input: {
  certifiedHandoffScore: number;
  persisted: GTELPersisted;
}): { snapshot: GTELWave53SovereignHandoffDepthSnapshot; persisted: GTELPersisted } {
  const raw = gtelClamp(input.certifiedHandoffScore * 0.88 + 0.08, 0.16, 0.92);
  const prev = sanitizeWave53SovereignHandoffDepthSmoothing(input.persisted.wave53SovereignHandoffDepthSmoothing);
  const score = gtelClamp(prev * 0.25 + raw * 0.75, 0.16, 0.92);
  const band: GTELWave53SovereignHandoffDepthSnapshot['band'] =
    score >= 0.9 ? 'cleared' : score >= 0.7 ? 'staging' : score >= 0.55 ? 'queued' : 'blocked';
  const persisted: GTELPersisted = {
    ...input.persisted,
    wave53SovereignHandoffDepthSmoothing: Math.round(score * 1000) / 1000,
  };
  return {
    snapshot: {
      score,
      band,
      summary: `Wave 53 sovereign handoff depth ${band} (${score.toFixed(2)})`,
    },
    persisted,
  };
}

export function wave53SovereignHandoffDepthExportScale(snapshot: GTELWave53SovereignHandoffDepthSnapshot): number {
  return gtelClamp(snapshot.score * 1.05, 0.16, 0.95);
}
