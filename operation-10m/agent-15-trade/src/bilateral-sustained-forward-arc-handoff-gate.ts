import type {
  GTELBilateralAdmittedForwardArcSustainGateSnapshot,
  GTELBilateralSustainedForwardArcHandoffGateSnapshot,
  GTELPersisted,
  GTELSustainedAdmittedForwardArcContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralSustainedForwardArcHandoffGateBand =
  GTELBilateralSustainedForwardArcHandoffGateSnapshot['band'];

function handoffBand(score: number): GTELBilateralSustainedForwardArcHandoffGateBand {
  if (score >= 0.94) return 'cleared';
  if (score >= 0.74) return 'staging';
  if (score >= 0.56) return 'queued';
  return 'blocked';
}

export function sanitizeBilateralSustainedForwardArcHandoffGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralSustainedForwardArcHandoffGateSnapshot(): GTELBilateralSustainedForwardArcHandoffGateSnapshot {
  return {
    score: 0.52,
    band: 'staging',
    continuityFeed: 0.1,
    sustainAnchor: 0.08,
    summary:
      'Bilateral sustained forward arc handoff gate is staging continuity into cleared forward arc handoff.',
  };
}

export function advanceBilateralSustainedForwardArcHandoffGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralSustainedForwardArcHandoffGateSmoothing(
    persisted.bilateralSustainedForwardArcHandoffGateSmoothing,
  );
  const next = gtelClamp(prev * 0.2 + gtelClamp(rawScore, 0.16, 0.92) * 0.8, 0.16, 0.92);
  return {
    ...persisted,
    bilateralSustainedForwardArcHandoffGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralSustainedForwardArcHandoffGateSnapshot(input: {
  sustainedAdmittedForwardArcContinuity: GTELSustainedAdmittedForwardArcContinuitySnapshot;
  bilateralAdmittedForwardArcSustainGate: GTELBilateralAdmittedForwardArcSustainGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralSustainedForwardArcHandoffGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.sustainedAdmittedForwardArcContinuity.band === 'anchored'
      ? 0.17
      : input.sustainedAdmittedForwardArcContinuity.band === 'holding'
        ? 0.07
        : input.sustainedAdmittedForwardArcContinuity.band === 'slipping'
          ? -0.04
          : -0.12;
  const sustainAnchor =
    input.bilateralAdmittedForwardArcSustainGate.band === 'sustained'
      ? 0.15
      : input.bilateralAdmittedForwardArcSustainGate.band === 'lost'
        ? -0.11
        : 0.06;
  const rawScore = gtelClamp(
    input.sustainedAdmittedForwardArcContinuity.score * 0.5 +
      input.bilateralAdmittedForwardArcSustainGate.score * 0.26 +
      continuityFeed +
      sustainAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralSustainedForwardArcHandoffGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralSustainedForwardArcHandoffGateSmoothing(
    persisted.bilateralSustainedForwardArcHandoffGateSmoothing,
  );
  const band = handoffBand(score);

  const summary =
    band === 'cleared'
      ? 'Sustained forward arc handoff gate cleared — anchored continuity and sustained gate align.'
      : band === 'blocked'
        ? 'Handoff gate blocked; severed continuity and lost sustain gate collapsed clearance.'
        : band === 'queued'
          ? 'Handoff gate queued — slipping continuity is lagging sustain gate anchor.'
          : 'Bilateral sustained forward arc handoff gate is staging continuity into cleared forward arc handoff.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      sustainAnchor: Math.round(sustainAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralSustainedForwardArcHandoffGateExportScale(
  snapshot: GTELBilateralSustainedForwardArcHandoffGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp(1 + snapshot.score * 0.0023, 1, 1.0065);
  if (snapshot.band === 'blocked') return gtelClamp(0.94 + snapshot.score * 0.005, 0.934, 0.953);
  if (snapshot.band === 'queued') return gtelClamp(0.978 + snapshot.score * 0.001, 0.973, 0.981);
  return gtelClamp(0.976 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralSustainedForwardArcHandoffGateDomesticStressRelief(
  snapshot: GTELBilateralSustainedForwardArcHandoffGateSnapshot,
): number {
  if (snapshot.band === 'cleared') return gtelClamp((snapshot.score - 0.55) * 0.012, 0.002, 0.008);
  if (snapshot.band === 'staging') return gtelClamp((snapshot.score - 0.45) * 0.006, 0.001, 0.004);
  return 0;
}

export function bilateralSustainedForwardArcHandoffGateWorldEvent(
  snapshot: GTELBilateralSustainedForwardArcHandoffGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'queued') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_bsfahg_${turn}`,
    turn,
    kind: 'trade',
    title: 'Sustained forward arc handoff gate strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'SA', 'TAS'],
  };
}

export function bilateralSustainedForwardArcHandoffGateGiNotes(
  snapshot: GTELBilateralSustainedForwardArcHandoffGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral sustained forward arc handoff gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
