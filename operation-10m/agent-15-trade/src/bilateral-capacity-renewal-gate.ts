import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralCapacityRenewalGateSnapshot,
  GTELPersisted,
  GTELTradeCycleSealVerificationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCapacityRenewalGateBand = GTELBilateralCapacityRenewalGateSnapshot['band'];

function renewalBand(score: number): GTELBilateralCapacityRenewalGateBand {
  if (score >= 0.86) return 'renewed';
  if (score >= 0.66) return 'pending';
  if (score >= 0.48) return 'deferred';
  return 'blocked';
}

export function sanitizeBilateralCapacityRenewalGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCapacityRenewalGateSnapshot(): GTELBilateralCapacityRenewalGateSnapshot {
  return {
    score: 0.52,
    band: 'pending',
    sealSupport: 0.1,
    readinessLift: 0.08,
    summary: 'Capacity renewal is pending verified cycle seal and book readiness.',
  };
}

export function advanceBilateralCapacityRenewalGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCapacityRenewalGateSmoothing(persisted.bilateralCapacityRenewalGateSmoothing);
  const next = gtelClamp(prev * 0.55 + gtelClamp(rawScore, 0.16, 0.92) * 0.45, 0.16, 0.92);
  return { ...persisted, bilateralCapacityRenewalGateSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralCapacityRenewalGateSnapshot(input: {
  tradeCycleSealVerification: GTELTradeCycleSealVerificationSnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCapacityRenewalGateSnapshot; persisted: GTELPersisted } {
  const sealSupport =
    input.tradeCycleSealVerification.band === 'verified'
      ? 0.16
      : input.tradeCycleSealVerification.band === 'provisional'
        ? 0.07
        : input.tradeCycleSealVerification.band === 'contested'
          ? -0.04
          : -0.1;
  const readinessLift =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.14
      : input.anchoredBookReadiness.band === 'blocked'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.tradeCycleSealVerification.score * 0.5 +
      input.anchoredBookReadiness.score * 0.28 +
      sealSupport +
      readinessLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCapacityRenewalGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCapacityRenewalGateSmoothing(persisted.bilateralCapacityRenewalGateSmoothing);
  const band = renewalBand(score);

  const summary =
    band === 'renewed'
      ? 'Capacity renewal gate is open — verified seal and ready books clear the next cycle.'
      : band === 'blocked'
        ? 'Renewal is blocked; failed cycle seal withholds the next capacity window.'
        : band === 'deferred'
          ? 'Renewal deferred — readiness or seal support is not yet sufficient.'
          : 'Capacity renewal is pending verified cycle seal and book readiness.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      sealSupport: Math.round(sealSupport * 1000) / 1000,
      readinessLift: Math.round(readinessLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCapacityRenewalGateExportScale(snapshot: GTELBilateralCapacityRenewalGateSnapshot): number {
  if (snapshot.band === 'renewed') return gtelClamp(1 + snapshot.score * 0.008, 1, 1.014);
  if (snapshot.band === 'blocked') return gtelClamp(0.96 + snapshot.score * 0.018, 0.94, 0.98);
  if (snapshot.band === 'deferred') return gtelClamp(0.985 + snapshot.score * 0.01, 0.97, 0.995);
  return gtelClamp(0.978 + snapshot.score * 0.003, 0.95, 1.02);
}

export function bilateralCapacityRenewalGateDomesticStressRelief(
  snapshot: GTELBilateralCapacityRenewalGateSnapshot,
): number {
  if (snapshot.band === 'renewed') return gtelClamp(snapshot.score * 0.02, 0.006, 0.024);
  if (snapshot.band === 'pending') return gtelClamp(snapshot.score * 0.008, 0, 0.009);
  return 0;
}

export function bilateralCapacityRenewalGateWorldEvent(
  snapshot: GTELBilateralCapacityRenewalGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'deferred') return null;
  if (snapshot.sealSupport > -0.02) return null;
  return {
    id: `gtel_renewal_${turn}`,
    turn,
    kind: 'trade',
    title: 'Capacity renewal gate constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function bilateralCapacityRenewalGateGiNotes(
  snapshot: GTELBilateralCapacityRenewalGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral capacity renewal gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
