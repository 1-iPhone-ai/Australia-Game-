import type {
  GTELBilateralScaleLoopSealGateSnapshot,
  GTELPersisted,
  GTELPreparedArcHandoffContinuitySnapshot,
  GTELSealedScaleLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELSealedScaleLoopContinuityBand = GTELSealedScaleLoopContinuitySnapshot['band'];

function continuityBand(score: number): GTELSealedScaleLoopContinuityBand {
  if (score >= 0.93) return 'anchored';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'loosening';
  return 'broken';
}

export function sanitizeSealedScaleLoopContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptySealedScaleLoopContinuitySnapshot(): GTELSealedScaleLoopContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    sealSupport: 0.1,
    handoffAnchor: 0.08,
    summary: 'Sealed scale loop continuity is holding loop seal against locked handoff.',
  };
}

export function advanceSealedScaleLoopContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeSealedScaleLoopContinuitySmoothing(persisted.sealedScaleLoopContinuitySmoothing);
  const next = gtelClamp(prev * 0.28 + gtelClamp(rawScore, 0.16, 0.92) * 0.72, 0.16, 0.92);
  return { ...persisted, sealedScaleLoopContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeSealedScaleLoopContinuitySnapshot(input: {
  bilateralScaleLoopSealGate: GTELBilateralScaleLoopSealGateSnapshot;
  preparedArcHandoffContinuity: GTELPreparedArcHandoffContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELSealedScaleLoopContinuitySnapshot; persisted: GTELPersisted } {
  const sealSupport =
    input.bilateralScaleLoopSealGate.band === 'sealed'
      ? 0.18
      : input.bilateralScaleLoopSealGate.band === 'tightening'
        ? 0.08
        : input.bilateralScaleLoopSealGate.band === 'pending'
          ? -0.04
          : -0.11;
  const handoffAnchor =
    input.preparedArcHandoffContinuity.band === 'locked'
      ? 0.15
      : input.preparedArcHandoffContinuity.band === 'broken'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralScaleLoopSealGate.score * 0.51 +
      input.preparedArcHandoffContinuity.score * 0.25 +
      sealSupport +
      handoffAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceSealedScaleLoopContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeSealedScaleLoopContinuitySmoothing(persisted.sealedScaleLoopContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'anchored'
      ? 'Sealed scale loop continuity is anchored — loop seal and locked handoff stay coupled.'
      : band === 'broken'
        ? 'Sealed loop continuity broken; open seal and broken handoff diverged.'
        : band === 'loosening'
          ? 'Continuity loosening — handoff anchor is lagging loop seal.'
          : 'Sealed scale loop continuity is holding loop seal against locked handoff.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      sealSupport: Math.round(sealSupport * 1000) / 1000,
      handoffAnchor: Math.round(handoffAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function sealedScaleLoopContinuityExportScale(snapshot: GTELSealedScaleLoopContinuitySnapshot): number {
  if (snapshot.band === 'anchored') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'broken') return gtelClamp(0.952 + snapshot.score * 0.005, 0.946, 0.964);
  if (snapshot.band === 'loosening') return gtelClamp(0.987 + snapshot.score * 0.001, 0.982, 0.99);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function sealedScaleLoopContinuityDomesticStress(snapshot: GTELSealedScaleLoopContinuitySnapshot): number {
  if (snapshot.band === 'broken') return gtelClamp((0.22 - snapshot.score) * 0.024, 0.003, 0.011);
  if (snapshot.band === 'loosening') return gtelClamp((0.34 - snapshot.score) * 0.009, 0.001, 0.003);
  return 0;
}

export function sealedScaleLoopContinuityWorldEvent(
  snapshot: GTELSealedScaleLoopContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'loosening') return null;
  if (snapshot.sealSupport > -0.02) return null;
  return {
    id: `gtel_sealed_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Sealed scale loop continuity strain',
    summary: snapshot.summary,
    regionIds: ['VIC', 'NSW', 'QLD'],
  };
}

export function sealedScaleLoopContinuityGiNotes(
  snapshot: GTELSealedScaleLoopContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Sealed scale loop continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
