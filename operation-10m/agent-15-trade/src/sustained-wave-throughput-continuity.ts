import type {
  GTELBilateralSustainedWaveThroughputGateSnapshot,
  GTELLaunchedWaveSustainContinuitySnapshot,
  GTELPersisted,
  GTELSustainedWaveThroughputContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELSustainedWaveThroughputContinuityBand = GTELSustainedWaveThroughputContinuitySnapshot['band'];

function continuityBand(score: number): GTELSustainedWaveThroughputContinuityBand {
  if (score >= 0.93) return 'steady';
  if (score >= 0.73) return 'aligned';
  if (score >= 0.55) return 'fraying';
  return 'severed';
}

export function sanitizeSustainedWaveThroughputContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptySustainedWaveThroughputContinuitySnapshot(): GTELSustainedWaveThroughputContinuitySnapshot {
  return {
    score: 0.52,
    band: 'aligned',
    throughputGateSupport: 0.1,
    sustainAnchor: 0.08,
    summary: 'Sustained wave throughput continuity is aligning cleared gate against firm sustain anchor.',
  };
}

export function advanceSustainedWaveThroughputContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeSustainedWaveThroughputContinuitySmoothing(
    persisted.sustainedWaveThroughputContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.25 + gtelClamp(rawScore, 0.16, 0.92) * 0.75, 0.16, 0.92);
  return {
    ...persisted,
    sustainedWaveThroughputContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeSustainedWaveThroughputContinuitySnapshot(input: {
  bilateralSustainedWaveThroughputGate: GTELBilateralSustainedWaveThroughputGateSnapshot;
  launchedWaveSustainContinuity: GTELLaunchedWaveSustainContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELSustainedWaveThroughputContinuitySnapshot; persisted: GTELPersisted } {
  const throughputGateSupport =
    input.bilateralSustainedWaveThroughputGate.band === 'cleared'
      ? 0.18
      : input.bilateralSustainedWaveThroughputGate.band === 'building'
        ? 0.08
        : input.bilateralSustainedWaveThroughputGate.band === 'throttled'
          ? -0.04
          : -0.11;
  const sustainAnchor =
    input.launchedWaveSustainContinuity.band === 'firm'
      ? 0.15
      : input.launchedWaveSustainContinuity.band === 'failed'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralSustainedWaveThroughputGate.score * 0.51 +
      input.launchedWaveSustainContinuity.score * 0.25 +
      throughputGateSupport +
      sustainAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceSustainedWaveThroughputContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeSustainedWaveThroughputContinuitySmoothing(
    persisted.sustainedWaveThroughputContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'steady'
      ? 'Sustained wave throughput continuity is steady — cleared gate and firm sustain anchor export scale.'
      : band === 'severed'
        ? 'Throughput continuity severed; blocked gate and failed sustain diverged.'
        : band === 'fraying'
          ? 'Throughput continuity fraying — sustain anchor is lagging cleared gate.'
          : 'Sustained wave throughput continuity is aligning cleared gate against firm sustain anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      throughputGateSupport: Math.round(throughputGateSupport * 1000) / 1000,
      sustainAnchor: Math.round(sustainAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function sustainedWaveThroughputContinuityExportScale(
  snapshot: GTELSustainedWaveThroughputContinuitySnapshot,
): number {
  if (snapshot.band === 'steady') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'severed') return gtelClamp(0.948 + snapshot.score * 0.005, 0.942, 0.96);
  if (snapshot.band === 'fraying') return gtelClamp(0.984 + snapshot.score * 0.001, 0.979, 0.987);
  return gtelClamp(0.982 + snapshot.score * 0.001, 0.95, 1.02);
}

export function sustainedWaveThroughputContinuityDomesticStress(
  snapshot: GTELSustainedWaveThroughputContinuitySnapshot,
): number {
  if (snapshot.band === 'severed') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'fraying') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function sustainedWaveThroughputContinuityWorldEvent(
  snapshot: GTELSustainedWaveThroughputContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severed' && snapshot.band !== 'fraying') return null;
  if (snapshot.throughputGateSupport > -0.02) return null;
  return {
    id: `gtel_swtc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Sustained wave throughput continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'WA', 'SA'],
  };
}

export function sustainedWaveThroughputContinuityGiNotes(
  snapshot: GTELSustainedWaveThroughputContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Sustained wave throughput continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
