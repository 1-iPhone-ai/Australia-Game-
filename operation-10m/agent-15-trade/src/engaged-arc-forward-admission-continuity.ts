import type {
  GTELBilateralEngagedArcForwardAdmissionGateSnapshot,
  GTELEngagedArcForwardAdmissionContinuitySnapshot,
  GTELPersisted,
  GTELPrimedHandoffArcOpeningContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELEngagedArcForwardAdmissionContinuityBand =
  GTELEngagedArcForwardAdmissionContinuitySnapshot['band'];

function continuityBand(score: number): GTELEngagedArcForwardAdmissionContinuityBand {
  if (score >= 0.93) return 'stable';
  if (score >= 0.73) return 'holding';
  if (score >= 0.55) return 'drifting';
  return 'broken';
}

export function sanitizeEngagedArcForwardAdmissionContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyEngagedArcForwardAdmissionContinuitySnapshot(): GTELEngagedArcForwardAdmissionContinuitySnapshot {
  return {
    score: 0.52,
    band: 'holding',
    admissionGateSupport: 0.1,
    openingContinuityAnchor: 0.08,
    summary:
      'Engaged arc forward admission continuity is holding admitted gate against engaged opening continuity.',
  };
}

export function advanceEngagedArcForwardAdmissionContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeEngagedArcForwardAdmissionContinuitySmoothing(
    persisted.engagedArcForwardAdmissionContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.28 + gtelClamp(rawScore, 0.16, 0.92) * 0.72, 0.16, 0.92);
  return {
    ...persisted,
    engagedArcForwardAdmissionContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeEngagedArcForwardAdmissionContinuitySnapshot(input: {
  bilateralEngagedArcForwardAdmissionGate: GTELBilateralEngagedArcForwardAdmissionGateSnapshot;
  primedHandoffArcOpeningContinuity: GTELPrimedHandoffArcOpeningContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELEngagedArcForwardAdmissionContinuitySnapshot; persisted: GTELPersisted } {
  const admissionGateSupport =
    input.bilateralEngagedArcForwardAdmissionGate.band === 'admitted'
      ? 0.17
      : input.bilateralEngagedArcForwardAdmissionGate.band === 'ramping'
        ? 0.08
        : input.bilateralEngagedArcForwardAdmissionGate.band === 'queued'
          ? -0.04
          : -0.11;
  const openingContinuityAnchor =
    input.primedHandoffArcOpeningContinuity.band === 'engaged'
      ? 0.16
      : input.primedHandoffArcOpeningContinuity.band === 'broken'
        ? -0.1
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralEngagedArcForwardAdmissionGate.score * 0.5 +
      input.primedHandoffArcOpeningContinuity.score * 0.24 +
      admissionGateSupport +
      openingContinuityAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceEngagedArcForwardAdmissionContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeEngagedArcForwardAdmissionContinuitySmoothing(
    persisted.engagedArcForwardAdmissionContinuitySmoothing,
  );
  const band = continuityBand(score);

  const summary =
    band === 'stable'
      ? 'Engaged arc forward admission continuity is stable — admitted gate and engaged opening continuity align.'
      : band === 'broken'
        ? 'Admission continuity broken; blocked gate and broken opening continuity collapsed sustainment.'
        : band === 'drifting'
          ? 'Admission continuity drifting — queued gate is lagging engaged opening continuity.'
          : 'Engaged arc forward admission continuity is holding admitted gate against engaged opening continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      admissionGateSupport: Math.round(admissionGateSupport * 1000) / 1000,
      openingContinuityAnchor: Math.round(openingContinuityAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function engagedArcForwardAdmissionContinuityExportScale(
  snapshot: GTELEngagedArcForwardAdmissionContinuitySnapshot,
): number {
  if (snapshot.band === 'stable') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'broken') return gtelClamp(0.944 + snapshot.score * 0.005, 0.938, 0.956);
  if (snapshot.band === 'drifting') return gtelClamp(0.98 + snapshot.score * 0.001, 0.975, 0.983);
  return gtelClamp(0.978 + snapshot.score * 0.001, 0.95, 1.02);
}

export function engagedArcForwardAdmissionContinuityDomesticStress(
  snapshot: GTELEngagedArcForwardAdmissionContinuitySnapshot,
): number {
  if (snapshot.band === 'broken') return gtelClamp((0.2 - snapshot.score) * 0.022, 0.003, 0.01);
  if (snapshot.band === 'drifting') return gtelClamp((0.32 - snapshot.score) * 0.008, 0.001, 0.003);
  return 0;
}

export function engagedArcForwardAdmissionContinuityWorldEvent(
  snapshot: GTELEngagedArcForwardAdmissionContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'drifting') return null;
  if (snapshot.admissionGateSupport > -0.02) return null;
  return {
    id: `gtel_eafac_${turn}`,
    turn,
    kind: 'trade',
    title: 'Engaged arc forward admission continuity strain',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'VIC'],
  };
}

export function engagedArcForwardAdmissionContinuityGiNotes(
  snapshot: GTELEngagedArcForwardAdmissionContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Engaged arc forward admission continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
