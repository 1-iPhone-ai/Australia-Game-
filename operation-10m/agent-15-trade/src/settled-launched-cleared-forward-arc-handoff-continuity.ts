import type {
  GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot,
  GTELLaunchedClearedForwardArcHandoffContinuitySnapshot,
  GTELPersisted,
  GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELSettledLaunchedClearedForwardArcHandoffContinuityBand =
  GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot['band'];

function continuityBand(score: number): GTELSettledLaunchedClearedForwardArcHandoffContinuityBand {
  if (score >= 0.93) return 'settled';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'unsettled';
  return 'broken';
}

export function sanitizeSettledLaunchedClearedForwardArcHandoffContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptySettledLaunchedClearedForwardArcHandoffContinuitySnapshot(): GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    readinessGateFeed: 0.1,
    launchedHandoffContinuityAnchor: 0.08,
    summary:
      'Settled launched cleared forward arc handoff continuity is holding settled readiness against launched handoff continuity.',
  };
}

export function advanceSettledLaunchedClearedForwardArcHandoffContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeSettledLaunchedClearedForwardArcHandoffContinuitySmoothing(
    persisted.settledLaunchedClearedForwardArcHandoffContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.2 + gtelClamp(rawScore, 0.16, 0.92) * 0.8, 0.16, 0.92);
  return {
    ...persisted,
    settledLaunchedClearedForwardArcHandoffContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeSettledLaunchedClearedForwardArcHandoffContinuitySnapshot(input: {
  bilateralSettledLaunchedClearedForwardArcReadinessGate: GTELBilateralSettledLaunchedClearedForwardArcReadinessGateSnapshot;
  launchedClearedForwardArcHandoffContinuity: GTELLaunchedClearedForwardArcHandoffContinuitySnapshot;
  persisted: GTELPersisted;
}): {
  snapshot: GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot;
  persisted: GTELPersisted;
} {
  const readinessGateFeed =
    input.bilateralSettledLaunchedClearedForwardArcReadinessGate.band === 'ready'
      ? 0.18
      : input.bilateralSettledLaunchedClearedForwardArcReadinessGate.band === 'arming'
        ? 0.08
        : input.bilateralSettledLaunchedClearedForwardArcReadinessGate.band === 'pending'
          ? -0.05
          : -0.13;
  const launchedHandoffContinuityAnchor =
    input.launchedClearedForwardArcHandoffContinuity.band === 'settled'
      ? 0.16
      : input.launchedClearedForwardArcHandoffContinuity.band === 'broken'
        ? -0.11
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralSettledLaunchedClearedForwardArcReadinessGate.score * 0.49 +
      input.launchedClearedForwardArcHandoffContinuity.score * 0.27 +
      readinessGateFeed +
      launchedHandoffContinuityAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceSettledLaunchedClearedForwardArcHandoffContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeSettledLaunchedClearedForwardArcHandoffContinuitySmoothing(
    persisted.settledLaunchedClearedForwardArcHandoffContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'settled'
      ? 'Settled launched cleared forward arc handoff continuity is settled — readiness gate and launched handoff continuity align.'
      : band === 'broken'
        ? 'Settled launched handoff continuity broken; withheld readiness and broken launched handoff collapsed sustainment.'
        : band === 'unsettled'
          ? 'Settled launched handoff continuity unsettled — pending readiness gate is lagging launched handoff continuity.'
          : 'Settled launched cleared forward arc handoff continuity is holding settled readiness against launched handoff continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      readinessGateFeed: Math.round(readinessGateFeed * 1000) / 1000,
      launchedHandoffContinuityAnchor: Math.round(launchedHandoffContinuityAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function settledLaunchedClearedForwardArcHandoffContinuityExportScale(
  snapshot: GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot,
): number {
  if (snapshot.band === 'settled') return gtelClamp(1 + snapshot.score * 0.0022, 1, 1.0065);
  if (snapshot.band === 'broken') return gtelClamp(0.939 + snapshot.score * 0.005, 0.933, 0.952);
  if (snapshot.band === 'unsettled') return gtelClamp(0.977 + snapshot.score * 0.001, 0.972, 0.98);
  return gtelClamp(0.975 + snapshot.score * 0.001, 0.95, 1.02);
}

export function settledLaunchedClearedForwardArcHandoffContinuityDomesticStress(
  snapshot: GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot,
): number {
  if (snapshot.band === 'broken') return gtelClamp((0.2 - snapshot.score) * 0.02, 0.003, 0.01);
  if (snapshot.band === 'unsettled') return gtelClamp((0.3 - snapshot.score) * 0.007, 0.001, 0.003);
  return 0;
}

export function settledLaunchedClearedForwardArcHandoffContinuityWorldEvent(
  snapshot: GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'unsettled') return null;
  if (snapshot.readinessGateFeed > -0.03) return null;
  return {
    id: `gtel_slcfahc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Settled launched cleared forward arc handoff continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'TAS'],
  };
}

export function settledLaunchedClearedForwardArcHandoffContinuityGiNotes(
  snapshot: GTELSettledLaunchedClearedForwardArcHandoffContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Settled launched cleared forward arc handoff continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
