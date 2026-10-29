import type {
  GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot,
  GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot,
  GTELPersisted,
  GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateBand =
  GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot['band'];

function handoffBand(score: number): GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateBand {
  if (score >= 0.94) return 'cleared';
  if (score >= 0.74) return 'staging';
  if (score >= 0.56) return 'queued';
  return 'blocked';
}

export function sanitizeBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot(): GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot {
  return {
    score: 0.52,
    band: 'staging',
    continuityFeed: 0.1,
    readinessAnchor: 0.08,
    summary:
      'Bilateral certified settled launched cleared forward arc handoff gate is staging settled handoff continuity into certified clearance.',
  };
}

export function advanceBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing(
    persisted.bilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing,
  );
  const next = gtelClamp(prev * 0.17 + gtelClamp(rawScore, 0.16, 0.92) * 0.83, 0.16, 0.92);
  return {
    ...persisted,
    bilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot(input: {
  settledLaunchedClearedForwardArcHandoffContinuity: GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot;
  bilateralSettledLaunchedClearedForwardArcReadinessGate: GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot;
  persisted: GTELPersisted;
}): {
  snapshot: GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot;
  persisted: GTELPersisted;
} {
  const continuityFeed =
    input.settledLaunchedClearedForwardArcHandoffContinuity.band === 'settled'
      ? 0.17
      : input.settledLaunchedClearedForwardArcHandoffContinuity.band === 'holding'
        ? 0.07
        : input.settledLaunchedClearedForwardArcHandoffContinuity.band === 'unsettled'
          ? -0.04
          : -0.12;
  const readinessAnchor =
    input.bilateralSettledLaunchedClearedForwardArcReadinessGate.band === 'ready'
      ? 0.15
      : input.bilateralSettledLaunchedClearedForwardArcReadinessGate.band === 'withheld'
        ? -0.11
        : 0.06;
  const rawScore = gtelClamp(
    input.settledLaunchedClearedForwardArcHandoffContinuity.score * 0.5 +
      input.bilateralSettledLaunchedClearedForwardArcReadinessGate.score * 0.26 +
      continuityFeed +
      readinessAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing(
    input.persisted,
    rawScore,
  );
  const score = sanitizeBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing(
    persisted.bilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSmoothing,
  );
  const band = handoffBand(score);

  const summary =
    band === 'cleared'
      ? 'Certified settled launched cleared forward arc handoff gate cleared — settled handoff continuity and ready readiness gate align.'
      : band === 'blocked'
        ? 'Certified settled launched handoff gate blocked; broken continuity and withheld readiness collapsed clearance.'
        : band === 'queued'
          ? 'Certified settled launched handoff gate queued — unsettled handoff continuity is lagging readiness gate anchor.'
          : 'Bilateral certified settled launched cleared forward arc handoff gate is staging settled handoff continuity into certified clearance.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      readinessAnchor: Math.round(readinessAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateExportScale(
  snapshot: GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp(1 + snapshot.score * 0.0026, 1, 1.0065);
  if (snapshot.band === 'blocked') return gtelClamp(0.937 + snapshot.score * 0.005, 0.931, 0.951);
  if (snapshot.band === 'queued') return gtelClamp(0.976 + snapshot.score * 0.001, 0.971, 0.979);
  return gtelClamp(0.974 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateDomesticStressRelief(
  snapshot: GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp((snapshot.score - 0.55) * 0.015, 0.002, 0.008);
  if (snapshot.band === 'staging') return gtelClamp((snapshot.score - 0.45) * 0.006, 0.001, 0.004);
  return 0;
}

export function bilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateWorldEvent(
  snapshot: GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'queued') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_bcslcfahg_${turn}`,
    turn,
    kind: 'trade',
    title: 'Certified settled launched cleared forward arc handoff gate strain',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'SA'],
  };
}

export function bilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateGiNotes(
  snapshot: GTELBilateralCertifiedSettledLaunchedClearedForwardArcHandoffGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral certified settled launched cleared forward arc handoff gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
