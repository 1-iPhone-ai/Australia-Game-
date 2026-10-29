import type {
  GTELBilateralClearedForwardArcReadinessGateSnapshot,
  GTELClearedForwardArcHandoffContinuitySnapshot,
  GTELPersisted,
  GTELSustainedClearedForwardArcContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELSustainedClearedForwardArcContinuityBand =
  GTELSustainedClearedForwardArcContinuitySnapshot['band'];

function continuityBand(score: number): GTELSustainedClearedForwardArcContinuityBand {
  if (score >= 0.93) return 'anchored';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'slipping';
  return 'severed';
}

export function sanitizeSustainedClearedForwardArcContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptySustainedClearedForwardArcContinuitySnapshot(): GTELSustainedClearedForwardArcContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    readinessGateFeed: 0.1,
    handoffContinuityAnchor: 0.08,
    summary:
      'Sustained cleared forward arc continuity is holding readiness gate against settled handoff continuity.',
  };
}

export function advanceSustainedClearedForwardArcContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeSustainedClearedForwardArcContinuitySmoothing(
    persisted.sustainedClearedForwardArcContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.2 + gtelClamp(rawScore, 0.16, 0.92) * 0.8, 0.16, 0.92);
  return {
    ...persisted,
    sustainedClearedForwardArcContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeSustainedClearedForwardArcContinuitySnapshot(input: {
  bilateralClearedForwardArcReadinessGate: GTELBilateralClearedForwardArcReadinessGateSnapshot;
  clearedForwardArcHandoffContinuity: GTELClearedForwardArcHandoffContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELSustainedClearedForwardArcContinuitySnapshot; persisted: GTELPersisted } {
  const readinessGateFeed =
    input.bilateralClearedForwardArcReadinessGate.band === 'ready'
      ? 0.18
      : input.bilateralClearedForwardArcReadinessGate.band === 'arming'
        ? 0.08
        : input.bilateralClearedForwardArcReadinessGate.band === 'pending'
          ? -0.05
          : -0.13;
  const handoffContinuityAnchor =
    input.clearedForwardArcHandoffContinuity.band === 'settled'
      ? 0.16
      : input.clearedForwardArcHandoffContinuity.band === 'broken'
        ? -0.11
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralClearedForwardArcReadinessGate.score * 0.49 +
      input.clearedForwardArcHandoffContinuity.score * 0.27 +
      readinessGateFeed +
      handoffContinuityAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceSustainedClearedForwardArcContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeSustainedClearedForwardArcContinuitySmoothing(
    persisted.sustainedClearedForwardArcContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'anchored'
      ? 'Sustained cleared forward arc continuity is anchored — readiness gate and handoff continuity align.'
      : band === 'severed'
        ? 'Cleared forward arc continuity severed; withheld readiness and broken handoff collapsed sustainment.'
        : band === 'slipping'
          ? 'Continuity slipping — pending readiness gate is lagging settled handoff continuity.'
          : 'Sustained cleared forward arc continuity is holding readiness gate against settled handoff continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      readinessGateFeed: Math.round(readinessGateFeed * 1000) / 1000,
      handoffContinuityAnchor: Math.round(handoffContinuityAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function sustainedClearedForwardArcContinuityExportScale(
  snapshot: GTELSustainedClearedForwardArcContinuitySnapshot,
): number {
  if (snapshot.band === 'anchored') return gtelClamp(1 + snapshot.score * 0.0022, 1, 1.0065);
  if (snapshot.band === 'severed') return gtelClamp(0.94 + snapshot.score * 0.005, 0.934, 0.953);
  if (snapshot.band === 'slipping') return gtelClamp(0.978 + snapshot.score * 0.001, 0.973, 0.981);
  return gtelClamp(0.976 + snapshot.score * 0.001, 0.95, 1.02);
}

export function sustainedClearedForwardArcContinuityDomesticStress(
  snapshot: GTELSustainedClearedForwardArcContinuitySnapshot,
): number {
  if (snapshot.band === 'severed') return gtelClamp((0.2 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'slipping') return gtelClamp((0.31 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function sustainedClearedForwardArcContinuityWorldEvent(
  snapshot: GTELSustainedClearedForwardArcContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severed' && snapshot.band !== 'slipping') return null;
  if (snapshot.readinessGateFeed > -0.03) return null;
  return {
    id: `gtel_scfac_${turn}`,
    turn,
    kind: 'trade',
    title: 'Sustained cleared forward arc continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'SA'],
  };
}

export function sustainedClearedForwardArcContinuityGiNotes(
  snapshot: GTELSustainedClearedForwardArcContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Sustained cleared forward arc continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
