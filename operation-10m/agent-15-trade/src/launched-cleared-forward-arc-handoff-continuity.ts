import type {
  GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot,
  GTELLaunchedClearedForwardArcHandoffContinuitySnapshot,
  GTELPersisted,
  GTELSustainedClearedForwardArcContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELLaunchedClearedForwardArcHandoffContinuityBand =
  GTELLaunchedClearedForwardArcHandoffContinuitySnapshot['band'];

function continuityBand(score: number): GTELLaunchedClearedForwardArcHandoffContinuityBand {
  if (score >= 0.93) return 'settled';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'unsettled';
  return 'broken';
}

export function sanitizeLaunchedClearedForwardArcHandoffContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyLaunchedClearedForwardArcHandoffContinuitySnapshot(): GTELLaunchedClearedForwardArcHandoffContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    handoffGateFeed: 0.1,
    sustainedClearedArcAnchor: 0.08,
    summary:
      'Launched cleared forward arc handoff continuity is holding launched gate against sustained cleared arc.',
  };
}

export function advanceLaunchedClearedForwardArcHandoffContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeLaunchedClearedForwardArcHandoffContinuitySmoothing(
    persisted.launchedClearedForwardArcHandoffContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.21 + gtelClamp(rawScore, 0.16, 0.92) * 0.79, 0.16, 0.92);
  return {
    ...persisted,
    launchedClearedForwardArcHandoffContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeLaunchedClearedForwardArcHandoffContinuitySnapshot(input: {
  bilateralLaunchedClearedForwardArcHandoffGate: GTELBilateralLaunchedClearedForwardArcHandoffGateSnapshot;
  sustainedClearedForwardArcContinuity: GTELSustainedClearedForwardArcContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELLaunchedClearedForwardArcHandoffContinuitySnapshot; persisted: GTELPersisted } {
  const handoffGateFeed =
    input.bilateralLaunchedClearedForwardArcHandoffGate.band === 'cleared'
      ? 0.18
      : input.bilateralLaunchedClearedForwardArcHandoffGate.band === 'staging'
        ? 0.07
        : input.bilateralLaunchedClearedForwardArcHandoffGate.band === 'queued'
          ? -0.04
          : -0.12;
  const sustainedClearedArcAnchor =
    input.sustainedClearedForwardArcContinuity.band === 'anchored'
      ? 0.16
      : input.sustainedClearedForwardArcContinuity.band === 'severed'
        ? -0.11
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralLaunchedClearedForwardArcHandoffGate.score * 0.48 +
      input.sustainedClearedForwardArcContinuity.score * 0.26 +
      handoffGateFeed +
      sustainedClearedArcAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceLaunchedClearedForwardArcHandoffContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeLaunchedClearedForwardArcHandoffContinuitySmoothing(
    persisted.launchedClearedForwardArcHandoffContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'settled'
      ? 'Launched cleared forward arc handoff continuity is settled — launched gate and anchored cleared arc align.'
      : band === 'broken'
        ? 'Launched handoff continuity broken; blocked gate and severed cleared arc collapsed sustainment.'
        : band === 'unsettled'
          ? 'Launched handoff continuity unsettled — queued gate is lagging anchored cleared arc sustainment.'
          : 'Launched cleared forward arc handoff continuity is holding launched gate against sustained cleared arc.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffGateFeed: Math.round(handoffGateFeed * 1000) / 1000,
      sustainedClearedArcAnchor: Math.round(sustainedClearedArcAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function launchedClearedForwardArcHandoffContinuityExportScale(
  snapshot: GTELLaunchedClearedForwardArcHandoffContinuitySnapshot,
): number {
  if (snapshot.band === 'settled') return gtelClamp(1 + snapshot.score * 0.0021, 1, 1.0065);
  if (snapshot.band === 'broken') return gtelClamp(0.941 + snapshot.score * 0.005, 0.935, 0.953);
  if (snapshot.band === 'unsettled') return gtelClamp(0.977 + snapshot.score * 0.001, 0.972, 0.98);
  return gtelClamp(0.975 + snapshot.score * 0.001, 0.95, 1.02);
}

export function launchedClearedForwardArcHandoffContinuityDomesticStress(
  snapshot: GTELLaunchedClearedForwardArcHandoffContinuitySnapshot,
): number {
  if (snapshot.band === 'broken') return gtelClamp((0.2 - snapshot.score) * 0.019, 0.003, 0.01);
  if (snapshot.band === 'unsettled') return gtelClamp((0.3 - snapshot.score) * 0.007, 0.001, 0.003);
  return 0;
}

export function launchedClearedForwardArcHandoffContinuityWorldEvent(
  snapshot: GTELLaunchedClearedForwardArcHandoffContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'unsettled') return null;
  if (snapshot.handoffGateFeed > -0.02) return null;
  return {
    id: `gtel_lcfahc_${turn}`,
    turn,
    kind: 'trade',
    title: 'Launched cleared forward arc handoff continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'VIC', 'TAS'],
  };
}

export function launchedClearedForwardArcHandoffContinuityGiNotes(
  snapshot: GTELLaunchedClearedForwardArcHandoffContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Launched cleared forward arc handoff continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
