/**
 * Agent 15 scale wave round 54 (O10-240) — sovereign handoff lattice depth stub.
 */

import type { GTELWave53SovereignHandoffDepthSnapshot } from './o10-237-wave53-sovereign-handoff-depth.ts';
import type { GTELPersisted } from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export interface GTELWave54SovereignHandoffLatticeSnapshot {
  score: number;
  band: 'latched' | 'aligned' | 'forming' | 'open';
  summary: string;
}

export function sanitizeWave54SovereignHandoffLatticeSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.54), 0.18, 0.94);
}

export function computeWave54SovereignHandoffLatticeSnapshot(input: {
  wave53Depth: GTELWave53SovereignHandoffDepthSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELWave54SovereignHandoffLatticeSnapshot; persisted: GTELPersisted } {
  const raw = gtelClamp(input.wave53Depth.score * 0.91 + 0.1, 0.18, 0.94);
  const prev = sanitizeWave54SovereignHandoffLatticeSmoothing(
    input.persisted.wave54SovereignHandoffLatticeSmoothing,
  );
  const score = gtelClamp(prev * 0.22 + raw * 0.78, 0.18, 0.94);
  const band: GTELWave54SovereignHandoffLatticeSnapshot['band'] =
    score >= 0.88 ? 'latched' : score >= 0.68 ? 'aligned' : score >= 0.52 ? 'forming' : 'open';
  const persisted: GTELPersisted = {
    ...input.persisted,
    wave54SovereignHandoffLatticeSmoothing: Math.round(score * 1000) / 1000,
  };
  return {
    snapshot: {
      score,
      band,
      summary: `Wave 54 sovereign handoff lattice ${band} (${score.toFixed(2)})`,
    },
    persisted,
  };
}

export function wave54SovereignHandoffLatticeExportScale(
  snapshot: GTELWave54SovereignHandoffLatticeSnapshot,
): number {
  return gtelClamp(snapshot.score * 1.04, 0.18, 0.96);
}
