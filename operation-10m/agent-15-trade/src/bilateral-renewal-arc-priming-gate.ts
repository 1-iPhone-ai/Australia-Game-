import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralRenewalArcPrimingGateSnapshot,
  GTELForwardArcRechargeContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralRenewalArcPrimingGateBand = GTELBilateralRenewalArcPrimingGateSnapshot['band'];

function primingGateBand(score: number): GTELBilateralRenewalArcPrimingGateBand {
  if (score >= 0.94) return 'primed';
  if (score >= 0.74) return 'arming';
  if (score >= 0.56) return 'idle';
  return 'blocked';
}

export function sanitizeBilateralRenewalArcPrimingGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralRenewalArcPrimingGateSnapshot(): GTELBilateralRenewalArcPrimingGateSnapshot {
  return {
    score: 0.52,
    band: 'arming',
    rechargeContinuityFeed: 0.1,
    readinessLift: 0.08,
    summary: 'Renewal arc priming gate is arming held recharge continuity into book readiness.',
  };
}

export function advanceBilateralRenewalArcPrimingGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralRenewalArcPrimingGateSmoothing(persisted.bilateralRenewalArcPrimingGateSmoothing);
  const next = gtelClamp(prev * 0.35 + gtelClamp(rawScore, 0.16, 0.92) * 0.65, 0.16, 0.92);
  return {
    ...persisted,
    bilateralRenewalArcPrimingGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralRenewalArcPrimingGateSnapshot(input: {
  forwardArcRechargeContinuity: GTELForwardArcRechargeContinuitySnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralRenewalArcPrimingGateSnapshot; persisted: GTELPersisted } {
  const rechargeContinuityFeed =
    input.forwardArcRechargeContinuity.band === 'held'
      ? 0.17
      : input.forwardArcRechargeContinuity.band === 'carrying'
        ? 0.08
        : input.forwardArcRechargeContinuity.band === 'thinning'
          ? -0.04
          : -0.1;
  const readinessLift =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.15
      : input.anchoredBookReadiness.band === 'blocked'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.forwardArcRechargeContinuity.score * 0.51 +
      input.anchoredBookReadiness.score * 0.25 +
      rechargeContinuityFeed +
      readinessLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralRenewalArcPrimingGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralRenewalArcPrimingGateSmoothing(persisted.bilateralRenewalArcPrimingGateSmoothing);
  const band = primingGateBand(score);

  const summary =
    band === 'primed'
      ? 'Renewal arc priming gate is primed — held recharge continuity and ready books open the next arc.'
      : band === 'blocked'
        ? 'Arc priming blocked; lost recharge continuity and blocked readiness withheld charge.'
        : band === 'idle'
          ? 'Priming idle — book readiness is lagging recharge continuity.'
          : 'Renewal arc priming gate is arming held recharge continuity into book readiness.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      rechargeContinuityFeed: Math.round(rechargeContinuityFeed * 1000) / 1000,
      readinessLift: Math.round(readinessLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralRenewalArcPrimingGateExportScale(
  snapshot: GTELBilateralRenewalArcPrimingGateSnapshot,
): number {
  if (snapshot.band === 'primed') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.959 + snapshot.score * 0.006, 0.953, 0.971);
  if (snapshot.band === 'idle') return gtelClamp(0.991 + snapshot.score * 0.001, 0.986, 0.994);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralRenewalArcPrimingGateDomesticStressRelief(
  snapshot: GTELBilateralRenewalArcPrimingGateSnapshot,
): number {
  if (snapshot.band === 'primed') return gtelClamp(snapshot.score * 0.018, 0.004, 0.022);
  if (snapshot.band === 'arming') return gtelClamp(snapshot.score * 0.006, 0, 0.007);
  return 0;
}

export function bilateralRenewalArcPrimingGateWorldEvent(
  snapshot: GTELBilateralRenewalArcPrimingGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'idle') return null;
  if (snapshot.rechargeContinuityFeed > -0.02) return null;
  return {
    id: `gtel_renew_prim_${turn}`,
    turn,
    kind: 'trade',
    title: 'Renewal arc priming constrained',
    summary: snapshot.summary,
    regionIds: ['QLD', 'WA', 'NSW'],
  };
}

export function bilateralRenewalArcPrimingGateGiNotes(
  snapshot: GTELBilateralRenewalArcPrimingGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral renewal arc priming gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
