import type {
  GTELBilateralHandedWaveCyclePrimingGateSnapshot,
  GTELClearedWaveHandoffContinuitySnapshot,
  GTELHandedWaveCyclePrimingContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELHandedWaveCyclePrimingContinuityBand = GTELHandedWaveCyclePrimingContinuitySnapshot['band'];

function continuityBand(score: number): GTELHandedWaveCyclePrimingContinuityBand {
  if (score >= 0.93) return 'settled';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'unsettled';
  return 'void';
}

export function sanitizeHandedWaveCyclePrimingContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyHandedWaveCyclePrimingContinuitySnapshot(): GTELHandedWaveCyclePrimingContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    primingGateSupport: 0.1,
    handoffAnchor: 0.08,
    summary: 'Handed wave cycle priming continuity is holding primed gate against secured handoff anchor.',
  };
}

export function advanceHandedWaveCyclePrimingContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeHandedWaveCyclePrimingContinuitySmoothing(
    persisted.handedWaveCyclePrimingContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.29 + gtelClamp(rawScore, 0.16, 0.92) * 0.71, 0.16, 0.92);
  return {
    ...persisted,
    handedWaveCyclePrimingContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeHandedWaveCyclePrimingContinuitySnapshot(input: {
  bilateralHandedWaveCyclePrimingGate: GTELBilateralHandedWaveCyclePrimingGateSnapshot;
  clearedWaveHandoffContinuity: GTELClearedWaveHandoffContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELHandedWaveCyclePrimingContinuitySnapshot; persisted: GTELPersisted } {
  const primingGateSupport =
    input.bilateralHandedWaveCyclePrimingGate.band === 'primed'
      ? 0.18
      : input.bilateralHandedWaveCyclePrimingGate.band === 'charging'
        ? 0.08
        : input.bilateralHandedWaveCyclePrimingGate.band === 'deferred'
          ? -0.04
          : -0.11;
  const handoffAnchor =
    input.clearedWaveHandoffContinuity.band === 'secured'
      ? 0.15
      : input.clearedWaveHandoffContinuity.band === 'broken'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralHandedWaveCyclePrimingGate.score * 0.51 +
      input.clearedWaveHandoffContinuity.score * 0.25 +
      primingGateSupport +
      handoffAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceHandedWaveCyclePrimingContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeHandedWaveCyclePrimingContinuitySmoothing(
    persisted.handedWaveCyclePrimingContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'settled'
      ? 'Handed wave cycle priming continuity is settled — primed gate and secured handoff anchor the arc opening.'
      : band === 'void'
        ? 'Cycle priming continuity void; blocked gate and broken handoff diverged.'
        : band === 'unsettled'
          ? 'Priming continuity unsettled — handoff anchor is lagging primed gate charge.'
          : 'Handed wave cycle priming continuity is holding primed gate against secured handoff anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      primingGateSupport: Math.round(primingGateSupport * 1000) / 1000,
      handoffAnchor: Math.round(handoffAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function handedWaveCyclePrimingContinuityExportScale(
  snapshot: GTELHandedWaveCyclePrimingContinuitySnapshot,
): number {
  if (snapshot.band === 'settled') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'void') return gtelClamp(0.946 + snapshot.score * 0.005, 0.94, 0.958);
  if (snapshot.band === 'unsettled') return gtelClamp(0.982 + snapshot.score * 0.001, 0.977, 0.985);
  return gtelClamp(0.98 + snapshot.score * 0.001, 0.95, 1.02);
}

export function handedWaveCyclePrimingContinuityDomesticStress(
  snapshot: GTELHandedWaveCyclePrimingContinuitySnapshot,
): number {
  if (snapshot.band === 'void') return gtelClamp((0.21 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'unsettled') return gtelClamp((0.33 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function handedWaveCyclePrimingContinuityWorldEvent(
  snapshot: GTELHandedWaveCyclePrimingContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'void' && snapshot.band !== 'unsettled') return null;
  if (snapshot.primingGateSupport > -0.02) return null;
  return {
    id: `gtel_hwpc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Handed wave cycle priming continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function handedWaveCyclePrimingContinuityGiNotes(
  snapshot: GTELHandedWaveCyclePrimingContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Handed wave cycle priming continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
