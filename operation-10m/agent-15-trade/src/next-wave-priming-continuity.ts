import type {
  GTELBilateralNextWavePrimingGateSnapshot,
  GTELNextWavePrimingContinuitySnapshot,
  GTELPersisted,
  GTELScaleWaveReentryContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELNextWavePrimingContinuityBand = GTELNextWavePrimingContinuitySnapshot['band'];

function continuityBand(score: number): GTELNextWavePrimingContinuityBand {
  if (score >= 0.93) return 'settled';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'unsettled';
  return 'void';
}

export function sanitizeNextWavePrimingContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyNextWavePrimingContinuitySnapshot(): GTELNextWavePrimingContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    primingGateSupport: 0.1,
    reentryAnchor: 0.08,
    summary: 'Next wave priming continuity is holding primed gate against reentry anchor.',
  };
}

export function advanceNextWavePrimingContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeNextWavePrimingContinuitySmoothing(persisted.nextWavePrimingContinuitySmoothing);
  const next = gtelClamp(prev * 0.27 + gtelClamp(rawScore, 0.16, 0.92) * 0.73, 0.16, 0.92);
  return { ...persisted, nextWavePrimingContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeNextWavePrimingContinuitySnapshot(input: {
  bilateralNextWavePrimingGate: GTELBilateralNextWavePrimingGateSnapshot;
  scaleWaveReentryContinuity: GTELScaleWaveReentryContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELNextWavePrimingContinuitySnapshot; persisted: GTELPersisted } {
  const primingGateSupport =
    input.bilateralNextWavePrimingGate.band === 'primed'
      ? 0.18
      : input.bilateralNextWavePrimingGate.band === 'charging'
        ? 0.08
        : input.bilateralNextWavePrimingGate.band === 'idle'
          ? -0.04
          : -0.11;
  const reentryAnchor =
    input.scaleWaveReentryContinuity.band === 'established'
      ? 0.15
      : input.scaleWaveReentryContinuity.band === 'lost'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralNextWavePrimingGate.score * 0.51 +
      input.scaleWaveReentryContinuity.score * 0.25 +
      primingGateSupport +
      reentryAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceNextWavePrimingContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeNextWavePrimingContinuitySmoothing(persisted.nextWavePrimingContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'settled'
      ? 'Next wave priming continuity is settled — primed gate and established reentry anchor the launch window.'
      : band === 'void'
        ? 'Priming continuity void; blocked gate and lost reentry diverged.'
        : band === 'unsettled'
          ? 'Priming continuity unsettled — reentry anchor is lagging primed gate charge.'
          : 'Next wave priming continuity is holding primed gate against reentry anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      primingGateSupport: Math.round(primingGateSupport * 1000) / 1000,
      reentryAnchor: Math.round(reentryAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function nextWavePrimingContinuityExportScale(snapshot: GTELNextWavePrimingContinuitySnapshot): number {
  if (snapshot.band === 'settled') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'void') return gtelClamp(0.951 + snapshot.score * 0.005, 0.945, 0.963);
  if (snapshot.band === 'unsettled') return gtelClamp(0.987 + snapshot.score * 0.001, 0.982, 0.99);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function nextWavePrimingContinuityDomesticStress(snapshot: GTELNextWavePrimingContinuitySnapshot): number {
  if (snapshot.band === 'void') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'unsettled') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function nextWavePrimingContinuityWorldEvent(
  snapshot: GTELNextWavePrimingContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'void' && snapshot.band !== 'unsettled') return null;
  if (snapshot.primingGateSupport > -0.02) return null;
  return {
    id: `gtel_nwpc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Next wave priming continuity strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'QLD'],
  };
}

export function nextWavePrimingContinuityGiNotes(
  snapshot: GTELNextWavePrimingContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Next wave priming continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
