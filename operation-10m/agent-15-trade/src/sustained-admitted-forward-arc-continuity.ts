import type {
  GTELBilateralAdmittedForwardArcSustainGateSnapshot,
  GTELEngagedArcForwardAdmissionContinuitySnapshot,
  GTELPersisted,
  GTELSustainedAdmittedForwardArcContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELSustainedAdmittedForwardArcContinuityBand =
  GTELSustainedAdmittedForwardArcContinuitySnapshot['band'];

function continuityBand(score: number): GTELSustainedAdmittedForwardArcContinuityBand {
  if (score >= 0.93) return 'anchored';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'slipping';
  return 'severed';
}

export function sanitizeSustainedAdmittedForwardArcContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptySustainedAdmittedForwardArcContinuitySnapshot(): GTELSustainedAdmittedForwardArcContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    sustainGateFeed: 0.1,
    admissionContinuityAnchor: 0.08,
    summary:
      'Sustained admitted forward arc continuity is holding sustain gate against engaged admission continuity.',
  };
}

export function advanceSustainedAdmittedForwardArcContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeSustainedAdmittedForwardArcContinuitySmoothing(
    persisted.sustainedAdmittedForwardArcContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.21 + gtelClamp(rawScore, 0.16, 0.92) * 0.79, 0.16, 0.92);
  return {
    ...persisted,
    sustainedAdmittedForwardArcContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeSustainedAdmittedForwardArcContinuitySnapshot(input: {
  bilateralAdmittedForwardArcSustainGate: GTELBilateralAdmittedForwardArcSustainGateSnapshot;
  engagedArcForwardAdmissionContinuity: GTELEngagedArcForwardAdmissionContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELSustainedAdmittedForwardArcContinuitySnapshot; persisted: GTELPersisted } {
  const sustainGateFeed =
    input.bilateralAdmittedForwardArcSustainGate.band === 'sustained'
      ? 0.18
      : input.bilateralAdmittedForwardArcSustainGate.band === 'stabilizing'
        ? 0.08
        : input.bilateralAdmittedForwardArcSustainGate.band === 'fading'
          ? -0.05
          : -0.13;
  const admissionContinuityAnchor =
    input.engagedArcForwardAdmissionContinuity.band === 'stable'
      ? 0.16
      : input.engagedArcForwardAdmissionContinuity.band === 'broken'
        ? -0.11
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralAdmittedForwardArcSustainGate.score * 0.48 +
      input.engagedArcForwardAdmissionContinuity.score * 0.26 +
      sustainGateFeed +
      admissionContinuityAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceSustainedAdmittedForwardArcContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeSustainedAdmittedForwardArcContinuitySmoothing(
    persisted.sustainedAdmittedForwardArcContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'anchored'
      ? 'Sustained admitted forward arc continuity is anchored — sustain gate and admission continuity align.'
      : band === 'severed'
        ? 'Forward arc continuity severed; lost sustain gate and broken admission continuity collapsed handoff.'
        : band === 'slipping'
          ? 'Continuity slipping — fading sustain gate is lagging stable admission continuity.'
          : 'Sustained admitted forward arc continuity is holding sustain gate against engaged admission continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      sustainGateFeed: Math.round(sustainGateFeed * 1000) / 1000,
      admissionContinuityAnchor: Math.round(admissionContinuityAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function sustainedAdmittedForwardArcContinuityExportScale(
  snapshot: GTELSustainedAdmittedForwardArcContinuitySnapshot,
): number {
  if (snapshot.band === 'anchored') return gtelClamp(1 + snapshot.score * 0.0021, 1, 1.0065);
  if (snapshot.band === 'severed') return gtelClamp(0.941 + snapshot.score * 0.005, 0.935, 0.954);
  if (snapshot.band === 'slipping') return gtelClamp(0.978 + snapshot.score * 0.001, 0.973, 0.981);
  return gtelClamp(0.976 + snapshot.score * 0.001, 0.95, 1.02);
}

export function sustainedAdmittedForwardArcContinuityDomesticStress(
  snapshot: GTELSustainedAdmittedForwardArcContinuitySnapshot,
): number {
  if (snapshot.band === 'severed') return gtelClamp((0.2 - snapshot.score) * 0.021, 0.003, 0.01);
  if (snapshot.band === 'slipping') return gtelClamp((0.31 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function sustainedAdmittedForwardArcContinuityWorldEvent(
  snapshot: GTELSustainedAdmittedForwardArcContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'severed' && snapshot.band !== 'slipping') return null;
  if (snapshot.sustainGateFeed > -0.03) return null;
  return {
    id: `gtel_safac_${turn}`,
    turn,
    kind: 'trade',
    title: 'Sustained admitted forward arc continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'VIC'],
  };
}

export function sustainedAdmittedForwardArcContinuityGiNotes(
  snapshot: GTELSustainedAdmittedForwardArcContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Sustained admitted forward arc continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
