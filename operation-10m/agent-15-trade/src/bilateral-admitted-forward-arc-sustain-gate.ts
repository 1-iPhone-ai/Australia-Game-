import type {
  GTELBilateralAdmittedForwardArcSustainGateSnapshot,
  GTELBilateralEngagedArcForwardAdmissionGateSnapshot,
  GTELEngagedArcForwardAdmissionContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralAdmittedForwardArcSustainGateBand =
  GTELBilateralAdmittedForwardArcSustainGateSnapshot['band'];

function sustainBand(score: number): GTELBilateralAdmittedForwardArcSustainGateBand {
  if (score >= 0.94) return 'sustained';
  if (score >= 0.74) return 'stabilizing';
  if (score >= 0.56) return 'fading';
  return 'lost';
}

export function sanitizeBilateralAdmittedForwardArcSustainGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralAdmittedForwardArcSustainGateSnapshot(): GTELBilateralAdmittedForwardArcSustainGateSnapshot {
  return {
    score: 0.52,
    band: 'stabilizing',
    admissionContinuityFeed: 0.1,
    gateAnchor: 0.08,
    summary:
      'Bilateral admitted forward arc sustain gate is stabilizing admission continuity into forward arc sustainment.',
  };
}

export function advanceBilateralAdmittedForwardArcSustainGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralAdmittedForwardArcSustainGateSmoothing(
    persisted.bilateralAdmittedForwardArcSustainGateSmoothing,
  );
  const next = gtelClamp(prev * 0.19 + gtelClamp(rawScore, 0.16, 0.92) * 0.81, 0.16, 0.92);
  return {
    ...persisted,
    bilateralAdmittedForwardArcSustainGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralAdmittedForwardArcSustainGateSnapshot(input: {
  engagedArcForwardAdmissionContinuity: GTELEngagedArcForwardAdmissionContinuitySnapshot;
  bilateralEngagedArcForwardAdmissionGate: GTELBilateralEngagedArcForwardAdmissionGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralAdmittedForwardArcSustainGateSnapshot; persisted: GTELPersisted } {
  const admissionContinuityFeed =
    input.engagedArcForwardAdmissionContinuity.band === 'stable'
      ? 0.18
      : input.engagedArcForwardAdmissionContinuity.band === 'holding'
        ? 0.08
        : input.engagedArcForwardAdmissionContinuity.band === 'drifting'
          ? -0.05
          : -0.12;
  const gateAnchor =
    input.bilateralEngagedArcForwardAdmissionGate.band === 'admitted'
      ? 0.15
      : input.bilateralEngagedArcForwardAdmissionGate.band === 'blocked'
        ? -0.1
        : 0.06;
  const rawScore = gtelClamp(
    input.engagedArcForwardAdmissionContinuity.score * 0.49 +
      input.bilateralEngagedArcForwardAdmissionGate.score * 0.27 +
      admissionContinuityFeed +
      gateAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralAdmittedForwardArcSustainGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralAdmittedForwardArcSustainGateSmoothing(
    persisted.bilateralAdmittedForwardArcSustainGateSmoothing,
  );
  const band = sustainBand(score);

  const summary =
    band === 'sustained'
      ? 'Admitted forward arc sustain gate is sustained — stable admission continuity holds forward arc throughput.'
      : band === 'lost'
        ? 'Forward arc sustain lost; broken continuity and blocked admission collapsed sustainment.'
        : band === 'fading'
          ? 'Sustain gate fading — admission continuity is drifting against admitted gate anchor.'
          : 'Bilateral admitted forward arc sustain gate is stabilizing admission continuity into forward arc sustainment.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      admissionContinuityFeed: Math.round(admissionContinuityFeed * 1000) / 1000,
      gateAnchor: Math.round(gateAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralAdmittedForwardArcSustainGateExportScale(
  snapshot: GTELBilateralAdmittedForwardArcSustainGateSnapshot,
): number {
  if (snapshot.band === 'sustained') return gtelClamp(1 + snapshot.score * 0.0022, 1, 1.0065);
  if (snapshot.band === 'lost') return gtelClamp(0.942 + snapshot.score * 0.005, 0.936, 0.955);
  if (snapshot.band === 'fading') return gtelClamp(0.979 + snapshot.score * 0.001, 0.974, 0.982);
  return gtelClamp(0.977 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralAdmittedForwardArcSustainGateDomesticStressRelief(
  snapshot: GTELBilateralAdmittedForwardArcSustainGateSnapshot,
): number {
  if (snapshot.band === 'sustained') return gtelClamp((snapshot.score - 0.55) * 0.012, 0.002, 0.008);
  if (snapshot.band === 'stabilizing') return gtelClamp((snapshot.score - 0.45) * 0.006, 0.001, 0.004);
  return 0;
}

export function bilateralAdmittedForwardArcSustainGateWorldEvent(
  snapshot: GTELBilateralAdmittedForwardArcSustainGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'lost' && snapshot.band !== 'fading') return null;
  if (snapshot.admissionContinuityFeed > -0.03) return null;
  return {
    id: `gtel_bafasg_${turn}`,
    turn,
    kind: 'trade',
    title: 'Admitted forward arc sustain gate strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'WA', 'SA'],
  };
}

export function bilateralAdmittedForwardArcSustainGateGiNotes(
  snapshot: GTELBilateralAdmittedForwardArcSustainGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral admitted forward arc sustain gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
