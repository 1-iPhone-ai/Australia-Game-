import type {
  GTELBilateralSustainedForwardArcHandoffGateSnapshot,
  GTELClearedForwardArcHandoffContinuitySnapshot,
  GTELPersisted,
  GTELSustainedAdmittedForwardArcContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELClearedForwardArcHandoffContinuityBand =
  GTELClearedForwardArcHandoffContinuitySnapshot['band'];

function continuityBand(score: number): GTELClearedForwardArcHandoffContinuityBand {
  if (score >= 0.93) return 'settled';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'unsettled';
  return 'broken';
}

export function sanitizeClearedForwardArcHandoffContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyClearedForwardArcHandoffContinuitySnapshot(): GTELClearedForwardArcHandoffContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    handoffGateFeed: 0.1,
    sustainedArcAnchor: 0.08,
    summary:
      'Cleared forward arc handoff continuity is holding cleared gate against sustained admitted forward arc.',
  };
}

export function advanceClearedForwardArcHandoffContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeClearedForwardArcHandoffContinuitySmoothing(
    persisted.clearedForwardArcHandoffContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.22 + gtelClamp(rawScore, 0.16, 0.92) * 0.78, 0.16, 0.92);
  return {
    ...persisted,
    clearedForwardArcHandoffContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeClearedForwardArcHandoffContinuitySnapshot(input: {
  bilateralSustainedForwardArcHandoffGate: GTELBilateralSustainedForwardArcHandoffGateSnapshot;
  sustainedAdmittedForwardArcContinuity: GTELSustainedAdmittedForwardArcContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELClearedForwardArcHandoffContinuitySnapshot; persisted: GTELPersisted } {
  const handoffGateFeed =
    input.bilateralSustainedForwardArcHandoffGate.band === 'cleared'
      ? 0.18
      : input.bilateralSustainedForwardArcHandoffGate.band === 'staging'
        ? 0.07
        : input.bilateralSustainedForwardArcHandoffGate.band === 'queued'
          ? -0.04
          : -0.12;
  const sustainedArcAnchor =
    input.sustainedAdmittedForwardArcContinuity.band === 'anchored'
      ? 0.16
      : input.sustainedAdmittedForwardArcContinuity.band === 'severed'
        ? -0.11
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralSustainedForwardArcHandoffGate.score * 0.49 +
      input.sustainedAdmittedForwardArcContinuity.score * 0.25 +
      handoffGateFeed +
      sustainedArcAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceClearedForwardArcHandoffContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeClearedForwardArcHandoffContinuitySmoothing(
    persisted.clearedForwardArcHandoffContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'settled'
      ? 'Cleared forward arc handoff continuity is settled — cleared gate and anchored arc align.'
      : band === 'broken'
        ? 'Handoff continuity broken; blocked gate and severed arc collapsed clearance sustainment.'
        : band === 'unsettled'
          ? 'Handoff continuity unsettled — queued gate is lagging anchored arc sustainment.'
          : 'Cleared forward arc handoff continuity is holding cleared gate against sustained admitted forward arc.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffGateFeed: Math.round(handoffGateFeed * 1000) / 1000,
      sustainedArcAnchor: Math.round(sustainedArcAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function clearedForwardArcHandoffContinuityExportScale(
  snapshot: GTELClearedForwardArcHandoffContinuitySnapshot,
): number {
  if (snapshot.band === 'settled') return gtelClamp(1 + snapshot.score * 0.0022, 1, 1.0065);
  if (snapshot.band === 'broken') return gtelClamp(0.94 + snapshot.score * 0.005, 0.934, 0.953);
  if (snapshot.band === 'unsettled') return gtelClamp(0.977 + snapshot.score * 0.001, 0.972, 0.98);
  return gtelClamp(0.975 + snapshot.score * 0.001, 0.95, 1.02);
}

export function clearedForwardArcHandoffContinuityDomesticStress(
  snapshot: GTELClearedForwardArcHandoffContinuitySnapshot,
): number {
  if (snapshot.band === 'broken') return gtelClamp((0.2 - snapshot.score) * 0.02, 0.003, 0.01);
  if (snapshot.band === 'unsettled') return gtelClamp((0.3 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function clearedForwardArcHandoffContinuityWorldEvent(
  snapshot: GTELClearedForwardArcHandoffContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'unsettled') return null;
  if (snapshot.handoffGateFeed > -0.02) return null;
  return {
    id: `gtel_cfahc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Cleared forward arc handoff continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'SA'],
  };
}

export function clearedForwardArcHandoffContinuityGiNotes(
  snapshot: GTELClearedForwardArcHandoffContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Cleared forward arc handoff continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
