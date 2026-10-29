import type {
  GTELBilateralClearedForwardArcReadinessGateSnapshot,
  GTELBilateralSustainedForwardArcHandoffGateSnapshot,
  GTELClearedForwardArcHandoffContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralClearedForwardArcReadinessGateBand =
  GTELBilateralClearedForwardArcReadinessGateSnapshot['band'];

function readinessBand(score: number): GTELBilateralClearedForwardArcReadinessGateBand {
  if (score >= 0.94) return 'ready';
  if (score >= 0.74) return 'arming';
  if (score >= 0.56) return 'pending';
  return 'withheld';
}

export function sanitizeBilateralClearedForwardArcReadinessGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralClearedForwardArcReadinessGateSnapshot(): GTELBilateralClearedForwardArcReadinessGateSnapshot {
  return {
    score: 0.52,
    band: 'arming',
    handoffContinuityFeed: 0.1,
    gateAnchor: 0.08,
    summary:
      'Bilateral cleared forward arc readiness gate is arming settled handoff continuity into cycle readiness.',
  };
}

export function advanceBilateralClearedForwardArcReadinessGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralClearedForwardArcReadinessGateSmoothing(
    persisted.bilateralClearedForwardArcReadinessGateSmoothing,
  );
  const next = gtelClamp(prev * 0.19 + gtelClamp(rawScore, 0.16, 0.92) * 0.81, 0.16, 0.92);
  return {
    ...persisted,
    bilateralClearedForwardArcReadinessGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralClearedForwardArcReadinessGateSnapshot(input: {
  clearedForwardArcHandoffContinuity: GTELClearedForwardArcHandoffContinuitySnapshot;
  bilateralSustainedForwardArcHandoffGate: GTELBilateralSustainedForwardArcHandoffGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralClearedForwardArcReadinessGateSnapshot; persisted: GTELPersisted } {
  const handoffContinuityFeed =
    input.clearedForwardArcHandoffContinuity.band === 'settled'
      ? 0.17
      : input.clearedForwardArcHandoffContinuity.band === 'holding'
        ? 0.07
        : input.clearedForwardArcHandoffContinuity.band === 'unsettled'
          ? -0.04
          : -0.13;
  const gateAnchor =
    input.bilateralSustainedForwardArcHandoffGate.band === 'cleared'
      ? 0.15
      : input.bilateralSustainedForwardArcHandoffGate.band === 'blocked'
        ? -0.11
        : 0.06;
  const rawScore = gtelClamp(
    input.clearedForwardArcHandoffContinuity.score * 0.51 +
      input.bilateralSustainedForwardArcHandoffGate.score * 0.25 +
      handoffContinuityFeed +
      gateAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralClearedForwardArcReadinessGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralClearedForwardArcReadinessGateSmoothing(
    persisted.bilateralClearedForwardArcReadinessGateSmoothing,
  );
  const band = readinessBand(score);

  const summary =
    band === 'ready'
      ? 'Cleared forward arc readiness gate is ready — settled handoff continuity and cleared gate align.'
      : band === 'withheld'
        ? 'Readiness gate withheld; broken continuity and blocked handoff collapsed arming.'
        : band === 'pending'
          ? 'Readiness gate pending — unsettled continuity is lagging cleared handoff gate.'
          : 'Bilateral cleared forward arc readiness gate is arming settled handoff continuity into cycle readiness.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffContinuityFeed: Math.round(handoffContinuityFeed * 1000) / 1000,
      gateAnchor: Math.round(gateAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralClearedForwardArcReadinessGateExportScale(
  snapshot: GTELBilateralClearedForwardArcReadinessGateSnapshot,
): number {
  if (snapshot.band === 'ready') return gtelClamp(1 + snapshot.score * 0.0024, 1, 1.0065);
  if (snapshot.band === 'withheld') return gtelClamp(0.939 + snapshot.score * 0.005, 0.933, 0.952);
  if (snapshot.band === 'pending') return gtelClamp(0.977 + snapshot.score * 0.001, 0.972, 0.98);
  return gtelClamp(0.975 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralClearedForwardArcReadinessGateDomesticStressRelief(
  snapshot: GTELBilateralClearedForwardArcReadinessGateSnapshot,
): number {
  if (snapshot.band === 'ready') return gtelClamp((snapshot.score - 0.55) * 0.013, 0.002, 0.008);
  if (snapshot.band === 'arming') return gtelClamp((snapshot.score - 0.45) * 0.006, 0.001, 0.004);
  return 0;
}

export function bilateralClearedForwardArcReadinessGateWorldEvent(
  snapshot: GTELBilateralClearedForwardArcReadinessGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'withheld' && snapshot.band !== 'pending') return null;
  if (snapshot.handoffContinuityFeed > -0.02) return null;
  return {
    id: `gtel_bcfarg_${turn}`,
    turn,
    kind: 'trade',
    title: 'Cleared forward arc readiness gate strain',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'NT'],
  };
}

export function bilateralClearedForwardArcReadinessGateGiNotes(
  snapshot: GTELBilateralClearedForwardArcReadinessGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral cleared forward arc readiness gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
