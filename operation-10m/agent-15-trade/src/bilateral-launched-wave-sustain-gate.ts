import type {
  GTELBilateralLaunchedWaveSustainGateSnapshot,
  GTELCycleReentryStabilizationSnapshot,
  GTELPersisted,
  GTELPrimedWaveLaunchContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralLaunchedWaveSustainGateBand = GTELBilateralLaunchedWaveSustainGateSnapshot['band'];

function sustainBand(score: number): GTELBilateralLaunchedWaveSustainGateBand {
  if (score >= 0.94) return 'sustaining';
  if (score >= 0.74) return 'ramping';
  if (score >= 0.56) return 'paused';
  return 'blocked';
}

export function sanitizeBilateralLaunchedWaveSustainGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralLaunchedWaveSustainGateSnapshot(): GTELBilateralLaunchedWaveSustainGateSnapshot {
  return {
    score: 0.52,
    band: 'ramping',
    continuityFeed: 0.1,
    stabilizationLift: 0.08,
    summary: 'Launched wave sustain gate is ramping sustained launch continuity into cycle stabilization.',
  };
}

export function advanceBilateralLaunchedWaveSustainGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralLaunchedWaveSustainGateSmoothing(
    persisted.bilateralLaunchedWaveSustainGateSmoothing,
  );
  const next = gtelClamp(prev * 0.23 + gtelClamp(rawScore, 0.16, 0.92) * 0.77, 0.16, 0.92);
  return {
    ...persisted,
    bilateralLaunchedWaveSustainGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralLaunchedWaveSustainGateSnapshot(input: {
  primedWaveLaunchContinuity: GTELPrimedWaveLaunchContinuitySnapshot;
  cycleReentryStabilization: GTELCycleReentryStabilizationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralLaunchedWaveSustainGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.primedWaveLaunchContinuity.band === 'sustained'
      ? 0.17
      : input.primedWaveLaunchContinuity.band === 'tracking'
        ? 0.08
        : input.primedWaveLaunchContinuity.band === 'drifting'
          ? -0.04
          : -0.1;
  const stabilizationLift =
    input.cycleReentryStabilization.band === 'stable'
      ? 0.16
      : input.cycleReentryStabilization.band === 'volatile'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.primedWaveLaunchContinuity.score * 0.5 +
      input.cycleReentryStabilization.score * 0.26 +
      continuityFeed +
      stabilizationLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralLaunchedWaveSustainGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralLaunchedWaveSustainGateSmoothing(
    persisted.bilateralLaunchedWaveSustainGateSmoothing,
  );
  const band = sustainBand(score);

  const summary =
    band === 'sustaining'
      ? 'Launched wave sustain gate is sustaining — sustained launch continuity and stable cycle hold throughput.'
      : band === 'blocked'
        ? 'Wave sustain blocked; collapsed continuity and volatile stabilization withheld ramp.'
        : band === 'paused'
          ? 'Sustain paused — cycle stabilization is lagging sustained launch continuity.'
          : 'Launched wave sustain gate is ramping sustained launch continuity into cycle stabilization.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      stabilizationLift: Math.round(stabilizationLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralLaunchedWaveSustainGateExportScale(
  snapshot: GTELBilateralLaunchedWaveSustainGateSnapshot,
): number {
  if (snapshot.band === 'sustaining') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.947 + snapshot.score * 0.006, 0.941, 0.959);
  if (snapshot.band === 'paused') return gtelClamp(0.983 + snapshot.score * 0.001, 0.978, 0.986);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralLaunchedWaveSustainGateDomesticStressRelief(
  snapshot: GTELBilateralLaunchedWaveSustainGateSnapshot,
): number {
  if (snapshot.band === 'sustaining') return gtelClamp(snapshot.score * 0.025, 0.005, 0.029);
  if (snapshot.band === 'ramping') return gtelClamp(snapshot.score * 0.008, 0, 0.009);
  return 0;
}

export function bilateralLaunchedWaveSustainGateWorldEvent(
  snapshot: GTELBilateralLaunchedWaveSustainGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'paused') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_wave_sustain_${turn}`,
    turn,
    kind: 'trade',
    title: 'Launched wave sustain constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function bilateralLaunchedWaveSustainGateGiNotes(
  snapshot: GTELBilateralLaunchedWaveSustainGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral launched wave sustain gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
