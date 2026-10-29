import type {
  GTELBilateralClearedForwardArcReadinessGateSnapshot,
  GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot,
  GTELPersisted,
  GTELSustainedClearedForwardArcContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralLaunchedClearedForwardArcHandoffGateBand =
  GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot['band'];

function handoffBand(score: number): GTELBilateralLaunchedClearedForwardArcHandoffGateBand {
  if (score >= 0.94) return 'cleared';
  if (score >= 0.74) return 'staging';
  if (score >= 0.56) return 'queued';
  return 'blocked';
}

export function sanitizeBilateralLaunchedClearedForwardArcHandoffGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralLaunchedClearedForwardArcHandoffGateSnapshot(): GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot {
  return {
    score: 0.52,
    band: 'staging',
    continuityFeed: 0.1,
    readinessAnchor: 0.08,
    summary:
      'Bilateral launched cleared forward arc handoff gate is staging sustained continuity into launched handoff.',
  };
}

export function advanceBilateralLaunchedClearedForwardArcHandoffGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralLaunchedClearedForwardArcHandoffGateSmoothing(
    persisted.bilateralLaunchedClearedForwardArcHandoffGateSmoothing,
  );
  const next = gtelClamp(prev * 0.19 + gtelClamp(rawScore, 0.16, 0.92) * 0.81, 0.16, 0.92);
  return {
    ...persisted,
    bilateralLaunchedClearedForwardArcHandoffGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralLaunchedClearedForwardArcHandoffGateSnapshot(input: {
  sustainedClearedForwardArcContinuity: GTELSustainedClearedForwardArcContinuitySnapshot;
  bilateralClearedForwardArcReadinessGate: GTELBilateralClearedForwardArcReadinessGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.sustainedClearedForwardArcContinuity.band === 'anchored'
      ? 0.17
      : input.sustainedClearedForwardArcContinuity.band === 'holding'
        ? 0.07
        : input.sustainedClearedForwardArcContinuity.band === 'slipping'
          ? -0.04
          : -0.12;
  const readinessAnchor =
    input.bilateralClearedForwardArcReadinessGate.band === 'ready'
      ? 0.15
      : input.bilateralClearedForwardArcReadinessGate.band === 'withheld'
        ? -0.11
        : 0.06;
  const rawScore = gtelClamp(
    input.sustainedClearedForwardArcContinuity.score * 0.5 +
      input.bilateralClearedForwardArcReadinessGate.score * 0.26 +
      continuityFeed +
      readinessAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralLaunchedClearedForwardArcHandoffGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralLaunchedClearedForwardArcHandoffGateSmoothing(
    persisted.bilateralLaunchedClearedForwardArcHandoffGateSmoothing,
  );
  const band = handoffBand(score);

  const summary =
    band === 'cleared'
      ? 'Launched cleared forward arc handoff gate cleared — anchored continuity and ready gate align.'
      : band === 'blocked'
        ? 'Launched handoff gate blocked; severed continuity and withheld readiness collapsed clearance.'
        : band === 'queued'
          ? 'Launched handoff gate queued — slipping continuity is lagging readiness gate anchor.'
          : 'Bilateral launched cleared forward arc handoff gate is staging sustained continuity into launched handoff.';

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

export function bilateralLaunchedClearedForwardArcHandoffGateExportScale(
  snapshot: GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp(1 + snapshot.score * 0.0025, 1, 1.0065);
  if (snapshot.band === 'blocked') return gtelClamp(0.938 + snapshot.score * 0.005, 0.932, 0.952);
  if (snapshot.band === 'queued') return gtelClamp(0.977 + snapshot.score * 0.001, 0.972, 0.98);
  return gtelClamp(0.975 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralLaunchedClearedForwardArcHandoffGateDomesticStressRelief(
  snapshot: GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp((snapshot.score - 0.55) * 0.014, 0.002, 0.008);
  if (snapshot.band === 'staging') return gtelClamp((snapshot.score - 0.45) * 0.006, 0.001, 0.004);
  return 0;
}

export function bilateralLaunchedClearedForwardArcHandoffGateWorldEvent(
  snapshot: GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'queued') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_blcfahg_${turn}`,
    turn,
    kind: 'trade',
    title: 'Launched cleared forward arc handoff gate strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NT'],
  };
}

export function bilateralLaunchedClearedForwardArcHandoffGateGiNotes(
  snapshot: GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral launched cleared forward arc handoff gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
