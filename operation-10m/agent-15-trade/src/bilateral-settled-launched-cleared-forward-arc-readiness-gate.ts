import type {
  GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot,
  GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot,
  GTELLaunchedClearedForwardArcHandoffContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralSettledLaunchedClearedForwardArcReadinessGateBand =
  GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot['band'];

function readinessBand(score: number): GTELBilateralSettledLaunchedClearedForwardArcReadinessGateBand {
  if (score >= 0.94) return 'ready';
  if (score >= 0.74) return 'arming';
  if (score >= 0.56) return 'pending';
  return 'withheld';
}

export function sanitizeBilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot(): GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot {
  return {
    score: 0.52,
    band: 'arming',
    handoffContinuityFeed: 0.1,
    gateAnchor: 0.08,
    summary:
      'Bilateral settled launched cleared forward arc readiness gate is arming settled launched handoff into cycle readiness.',
  };
}

export function advanceBilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing(
    persisted.bilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing,
  );
  const next = gtelClamp(prev * 0.18 + gtelClamp(rawScore, 0.16, 0.92) * 0.82, 0.16, 0.92);
  return {
    ...persisted,
    bilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot(input: {
  launchedClearedForwardArcHandoffContinuity: GTELLaunchedClearedForwardArcHandoffContinuitySnapshot;
  bilateralLaunchedClearedForwardArcHandoffGate: GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot;
  persisted: GTELPersisted;
}): {
  snapshot: GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot;
  persisted: GTELPersisted;
} {
  const handoffContinuityFeed =
    input.launchedClearedForwardArcHandoffContinuity.band === 'settled'
      ? 0.17
      : input.launchedClearedForwardArcHandoffContinuity.band === 'holding'
        ? 0.07
        : input.launchedClearedForwardArcHandoffContinuity.band === 'unsettled'
          ? -0.04
          : -0.13;
  const gateAnchor =
    input.bilateralLaunchedClearedForwardArcHandoffGate.band === 'cleared'
      ? 0.15
      : input.bilateralLaunchedClearedForwardArcHandoffGate.band === 'blocked'
        ? -0.11
        : 0.06;
  const rawScore = gtelClamp(
    input.launchedClearedForwardArcHandoffContinuity.score * 0.5 +
      input.bilateralLaunchedClearedForwardArcHandoffGate.score * 0.26 +
      handoffContinuityFeed +
      gateAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing(
    input.persisted,
    rawScore,
  );
  const score = sanitizeBilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing(
    persisted.bilateralSettledLaunchedClearedForwardArcReadinessGateSmoothing,
  );
  const band = readinessBand(score);

  const summary =
    band === 'ready'
      ? 'Settled launched cleared forward arc readiness gate is ready — settled launched handoff and cleared gate align.'
      : band === 'withheld'
        ? 'Settled launched readiness withheld; broken continuity and blocked launched gate collapsed arming.'
        : band === 'pending'
          ? 'Settled launched readiness pending — unsettled handoff continuity is lagging launched gate.'
          : 'Bilateral settled launched cleared forward arc readiness gate is arming settled launched handoff into cycle readiness.';

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

export function bilateralSettledLaunchedClearedForwardArcReadinessGateExportScale(
  snapshot: GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot,
): number {
  if (snapshot.band === 'ready') return gtelClamp(1 + snapshot.score * 0.0023, 1, 1.0065);
  if (snapshot.band === 'withheld') return gtelClamp(0.94 + snapshot.score * 0.005, 0.934, 0.952);
  if (snapshot.band === 'pending') return gtelClamp(0.977 + snapshot.score * 0.001, 0.972, 0.98);
  return gtelClamp(0.975 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralSettledLaunchedClearedForwardArcReadinessGateDomesticStressRelief(
  snapshot: GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot,
): number {
  if (snapshot.band === 'ready') return gtelClamp((snapshot.score - 0.55) * 0.012, 0.002, 0.008);
  if (snapshot.band === 'arming') return gtelClamp((snapshot.score - 0.45) * 0.005, 0.001, 0.004);
  return 0;
}

export function bilateralSettledLaunchedClearedForwardArcReadinessGateWorldEvent(
  snapshot: GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'withheld' && snapshot.band !== 'pending') return null;
  if (snapshot.handoffContinuityFeed > -0.02) return null;
  return {
    id: `gtel_bslcfarg_${turn}`,
    turn,
    kind: 'trade',
    title: 'Settled launched cleared forward arc readiness gate strain',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'SA'],
  };
}

export function bilateralSettledLaunchedClearedForwardArcReadinessGateGiNotes(
  snapshot: GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral settled launched cleared forward arc readiness gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
