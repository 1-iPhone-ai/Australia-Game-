import type {
  GTELBilateralForwardCycleAdvanceGateSnapshot,
  GTELCommitmentWindowSustainmentSnapshot,
  GTELForwardCycleAdvanceContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELForwardCycleAdvanceContinuityBand = GTELForwardCycleAdvanceContinuitySnapshot['band'];

function continuityBand(score: number): GTELForwardCycleAdvanceContinuityBand {
  if (score >= 0.93) return 'locked_in';
  if (score >= 0.73) return 'tracking';
  if (score >= 0.55) return 'wavering';
  return 'broken';
}

export function sanitizeForwardCycleAdvanceContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyForwardCycleAdvanceContinuitySnapshot(): GTELForwardCycleAdvanceContinuitySnapshot {
  return {
    score: 0.52,
    band: 'tracking',
    advanceSupport: 0.1,
    sustainmentFeed: 0.08,
    summary: 'Forward cycle advance continuity is tracking cleared gate against window sustainment.',
  };
}

export function advanceForwardCycleAdvanceContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeForwardCycleAdvanceContinuitySmoothing(persisted.forwardCycleAdvanceContinuitySmoothing);
  const next = gtelClamp(prev * 0.4 + gtelClamp(rawScore, 0.16, 0.92) * 0.6, 0.16, 0.92);
  return { ...persisted, forwardCycleAdvanceContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeForwardCycleAdvanceContinuitySnapshot(input: {
  bilateralForwardCycleAdvanceGate: GTELBilateralForwardCycleAdvanceGateSnapshot;
  commitmentWindowSustainment: GTELCommitmentWindowSustainmentSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELForwardCycleAdvanceContinuitySnapshot; persisted: GTELPersisted } {
  const advanceSupport =
    input.bilateralForwardCycleAdvanceGate.band === 'advanced'
      ? 0.18
      : input.bilateralForwardCycleAdvanceGate.band === 'clearing'
        ? 0.08
        : input.bilateralForwardCycleAdvanceGate.band === 'held'
          ? -0.04
          : -0.1;
  const sustainmentFeed =
    input.commitmentWindowSustainment.band === 'sustained'
      ? 0.14
      : input.commitmentWindowSustainment.band === 'dropped'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralForwardCycleAdvanceGate.score * 0.52 +
      input.commitmentWindowSustainment.score * 0.24 +
      advanceSupport +
      sustainmentFeed,
    0.16,
    0.92,
  );
  const persisted = advanceForwardCycleAdvanceContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeForwardCycleAdvanceContinuitySmoothing(persisted.forwardCycleAdvanceContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'locked_in'
      ? 'Forward cycle advance continuity is locked in — advanced gate and sustained window hold.'
      : band === 'broken'
        ? 'Advance continuity broken; denied gate and dropped sustainment diverged.'
        : band === 'wavering'
          ? 'Continuity is wavering — sustainment feed is lagging advance gate.'
          : 'Forward cycle advance continuity is tracking cleared gate against window sustainment.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      advanceSupport: Math.round(advanceSupport * 1000) / 1000,
      sustainmentFeed: Math.round(sustainmentFeed * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function forwardCycleAdvanceContinuityExportScale(snapshot: GTELForwardCycleAdvanceContinuitySnapshot): number {
  if (snapshot.band === 'locked_in') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'broken') return gtelClamp(0.964 + snapshot.score * 0.005, 0.958, 0.976);
  if (snapshot.band === 'wavering') return gtelClamp(0.994 + snapshot.score * 0.001, 0.989, 0.997);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function forwardCycleAdvanceContinuityDomesticStress(
  snapshot: GTELForwardCycleAdvanceContinuitySnapshot,
): number {
  if (snapshot.band === 'broken') return gtelClamp((0.28 - snapshot.score) * 0.036, 0.003, 0.018);
  if (snapshot.band === 'wavering') return gtelClamp((0.4 - snapshot.score) * 0.015, 0.001, 0.008);
  return 0;
}

export function forwardCycleAdvanceContinuityWorldEvent(
  snapshot: GTELForwardCycleAdvanceContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'wavering') return null;
  if (snapshot.advanceSupport > -0.02) return null;
  return {
    id: `gtel_adv_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Forward cycle advance continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'WA'],
  };
}

export function forwardCycleAdvanceContinuityGiNotes(
  snapshot: GTELForwardCycleAdvanceContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Forward cycle advance continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
