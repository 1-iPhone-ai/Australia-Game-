import type {
  GTELBilateralEngagedArcForwardAdmissionGateSnapshot,
  GTELBilateralForwardCommitmentAdmissionSnapshot,
  GTELPersisted,
  GTELPrimedHandoffArcOpeningContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralEngagedArcForwardAdmissionGateBand =
  GTELBilateralEngagedArcForwardAdmissionGateSnapshot['band'];

function admissionBand(score: number): GTELBilateralEngagedArcForwardAdmissionGateBand {
  if (score >= 0.94) return 'admitted';
  if (score >= 0.74) return 'ramping';
  if (score >= 0.56) return 'queued';
  return 'blocked';
}

export function sanitizeBilateralEngagedArcForwardAdmissionGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralEngagedArcForwardAdmissionGateSnapshot(): GTELBilateralEngagedArcForwardAdmissionGateSnapshot {
  return {
    score: 0.52,
    band: 'ramping',
    continuityFeed: 0.1,
    forwardAdmissionLift: 0.08,
    summary: 'Engaged arc forward admission gate is ramping engaged opening continuity into forward commitments.',
  };
}

export function advanceBilateralEngagedArcForwardAdmissionGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralEngagedArcForwardAdmissionGateSmoothing(
    persisted.bilateralEngagedArcForwardAdmissionGateSmoothing,
  );
  const next = gtelClamp(prev * 0.18 + gtelClamp(rawScore, 0.16, 0.92) * 0.82, 0.16, 0.92);
  return {
    ...persisted,
    bilateralEngagedArcForwardAdmissionGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralEngagedArcForwardAdmissionGateSnapshot(input: {
  primedHandoffArcOpeningContinuity: GTELPrimedHandoffArcOpeningContinuitySnapshot;
  bilateralForwardCommitmentAdmission: GTELBilateralForwardCommitmentAdmissionSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralEngagedArcForwardAdmissionGateSnapshot; persisted: GTELPersisted } {
  const continuityFeed =
    input.primedHandoffArcOpeningContinuity.band === 'engaged'
      ? 0.17
      : input.primedHandoffArcOpeningContinuity.band === 'holding'
        ? 0.08
        : input.primedHandoffArcOpeningContinuity.band === 'slipping'
          ? -0.04
          : -0.1;
  const forwardAdmissionLift =
    input.bilateralForwardCommitmentAdmission.band === 'admitted'
      ? 0.16
      : input.bilateralForwardCommitmentAdmission.band === 'closed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.primedHandoffArcOpeningContinuity.score * 0.5 +
      input.bilateralForwardCommitmentAdmission.score * 0.26 +
      continuityFeed +
      forwardAdmissionLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralEngagedArcForwardAdmissionGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralEngagedArcForwardAdmissionGateSmoothing(
    persisted.bilateralEngagedArcForwardAdmissionGateSmoothing,
  );
  const band = admissionBand(score);

  const summary =
    band === 'admitted'
      ? 'Engaged arc forward admission gate is admitted — engaged continuity and admitted forward commitments hold throughput.'
      : band === 'blocked'
        ? 'Forward admission blocked; broken opening continuity and closed admission withheld ramp.'
        : band === 'queued'
          ? 'Admission queued — forward commitment staging is lagging engaged continuity.'
          : 'Engaged arc forward admission gate is ramping engaged opening continuity into forward commitments.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityFeed: Math.round(continuityFeed * 1000) / 1000,
      forwardAdmissionLift: Math.round(forwardAdmissionLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralEngagedArcForwardAdmissionGateExportScale(
  snapshot: GTELBilateralEngagedArcForwardAdmissionGateSnapshot,
): number {
  if (snapshot.band === 'admitted') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.942 + snapshot.score * 0.006, 0.936, 0.954);
  if (snapshot.band === 'queued') return gtelClamp(0.978 + snapshot.score * 0.001, 0.973, 0.981);
  return gtelClamp(0.98 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralEngagedArcForwardAdmissionGateDomesticStressRelief(
  snapshot: GTELBilateralEngagedArcForwardAdmissionGateSnapshot,
): number {
  if (snapshot.band === 'admitted') return gtelClamp(snapshot.score * 0.03, 0.005, 0.034);
  if (snapshot.band === 'ramping') return gtelClamp(snapshot.score * 0.01, 0, 0.011);
  return 0;
}

export function bilateralEngagedArcForwardAdmissionGateWorldEvent(
  snapshot: GTELBilateralEngagedArcForwardAdmissionGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'queued') return null;
  if (snapshot.continuityFeed > -0.02) return null;
  return {
    id: `gtel_eafa_${turn}`,
    turn,
    kind: 'trade',
    title: 'Engaged arc forward admission constrained',
    summary: snapshot.summary,
    regionIds: ['SA', 'NSW', 'VIC'],
  };
}

export function bilateralEngagedArcForwardAdmissionGateGiNotes(
  snapshot: GTELBilateralEngagedArcForwardAdmissionGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral engaged arc forward admission gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
