import type {
  GTELBilateralClearedWaveHandoffGateSnapshot,
  GTELClearedWaveHandoffContinuitySnapshot,
  GTELPersisted,
  GTELSustainedWaveThroughputContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELClearedWaveHandoffContinuityBand = GTELClearedWaveHandoffContinuitySnapshot['band'];

function continuityBand(score: number): GTELClearedWaveHandoffContinuityBand {
  if (score >= 0.93) return 'secured';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'slipping';
  return 'broken';
}

export function sanitizeClearedWaveHandoffContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyClearedWaveHandoffContinuitySnapshot(): GTELClearedWaveHandoffContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    handoffGateSupport: 0.1,
    throughputAnchor: 0.08,
    summary: 'Cleared wave handoff continuity is holding handed gate against steady throughput anchor.',
  };
}

export function advanceClearedWaveHandoffContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeClearedWaveHandoffContinuitySmoothing(persisted.clearedWaveHandoffContinuitySmoothing);
  const next = gtelClamp(prev * 0.24 + gtelClamp(rawScore, 0.16, 0.92) * 0.76, 0.16, 0.92);
  return { ...persisted, clearedWaveHandoffContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeClearedWaveHandoffContinuitySnapshot(input: {
  bilateralClearedWaveHandoffGate: GTELBilateralClearedWaveHandoffGateSnapshot;
  sustainedWaveThroughputContinuity: GTELSustainedWaveThroughputContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELClearedWaveHandoffContinuitySnapshot; persisted: GTELPersisted } {
  const handoffGateSupport =
    input.bilateralClearedWaveHandoffGate.band === 'handed'
      ? 0.18
      : input.bilateralClearedWaveHandoffGate.band === 'staging'
        ? 0.08
        : input.bilateralClearedWaveHandoffGate.band === 'deferred'
          ? -0.04
          : -0.11;
  const throughputAnchor =
    input.sustainedWaveThroughputContinuity.band === 'steady'
      ? 0.15
      : input.sustainedWaveThroughputContinuity.band === 'severed'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralClearedWaveHandoffGate.score * 0.51 +
      input.sustainedWaveThroughputContinuity.score * 0.25 +
      handoffGateSupport +
      throughputAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceClearedWaveHandoffContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeClearedWaveHandoffContinuitySmoothing(persisted.clearedWaveHandoffContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'secured'
      ? 'Cleared wave handoff continuity is secured — handed gate and steady throughput anchor the next cycle.'
      : band === 'broken'
        ? 'Handoff continuity broken; blocked gate and severed throughput diverged.'
        : band === 'slipping'
          ? 'Handoff continuity slipping — throughput anchor is lagging handed gate.'
          : 'Cleared wave handoff continuity is holding handed gate against steady throughput anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffGateSupport: Math.round(handoffGateSupport * 1000) / 1000,
      throughputAnchor: Math.round(throughputAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function clearedWaveHandoffContinuityExportScale(snapshot: GTELClearedWaveHandoffContinuitySnapshot): number {
  if (snapshot.band === 'secured') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'broken') return gtelClamp(0.947 + snapshot.score * 0.005, 0.941, 0.959);
  if (snapshot.band === 'slipping') return gtelClamp(0.983 + snapshot.score * 0.001, 0.978, 0.986);
  return gtelClamp(0.981 + snapshot.score * 0.001, 0.95, 1.02);
}

export function clearedWaveHandoffContinuityDomesticStress(snapshot: GTELClearedWaveHandoffContinuitySnapshot): number {
  if (snapshot.band === 'broken') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'slipping') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function clearedWaveHandoffContinuityWorldEvent(
  snapshot: GTELClearedWaveHandoffContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'slipping') return null;
  if (snapshot.handoffGateSupport > -0.02) return null;
  return {
    id: `gtel_cwhc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Cleared wave handoff continuity strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'VIC', 'NSW'],
  };
}

export function clearedWaveHandoffContinuityGiNotes(
  snapshot: GTELClearedWaveHandoffContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Cleared wave handoff continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
