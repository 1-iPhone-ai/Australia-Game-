import type {
  GTELBilateralForwardArcRechargeGateSnapshot,
  GTELCapacityRenewalPrimingSnapshot,
  GTELPersisted,
  GTELReopenedCommitmentLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralForwardArcRechargeGateBand = GTELBilateralForwardArcRechargeGateSnapshot['band'];

function rechargeBand(score: number): GTELBilateralForwardArcRechargeGateBand {
  if (score >= 0.94) return 'recharged';
  if (score >= 0.74) return 'charging';
  if (score >= 0.56) return 'starved';
  return 'blocked';
}

export function sanitizeBilateralForwardArcRechargeGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralForwardArcRechargeGateSnapshot(): GTELBilateralForwardArcRechargeGateSnapshot {
  return {
    score: 0.52,
    band: 'charging',
    loopContinuityFeed: 0.1,
    renewalLift: 0.08,
    summary: 'Forward arc recharge gate is charging stable loop continuity into renewal priming.',
  };
}

export function advanceBilateralForwardArcRechargeGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralForwardArcRechargeGateSmoothing(persisted.bilateralForwardArcRechargeGateSmoothing);
  const next = gtelClamp(prev * 0.37 + gtelClamp(rawScore, 0.16, 0.92) * 0.63, 0.16, 0.92);
  return {
    ...persisted,
    bilateralForwardArcRechargeGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralForwardArcRechargeGateSnapshot(input: {
  reopenedCommitmentLoopContinuity: GTELReopenedCommitmentLoopContinuitySnapshot;
  capacityRenewalPriming: GTELCapacityRenewalPrimingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralForwardArcRechargeGateSnapshot; persisted: GTELPersisted } {
  const loopContinuityFeed =
    input.reopenedCommitmentLoopContinuity.band === 'stable'
      ? 0.17
      : input.reopenedCommitmentLoopContinuity.band === 'linked'
        ? 0.08
        : input.reopenedCommitmentLoopContinuity.band === 'fraying'
          ? -0.04
          : -0.1;
  const renewalLift =
    input.capacityRenewalPriming.band === 'primed'
      ? 0.16
      : input.capacityRenewalPriming.band === 'starved'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.reopenedCommitmentLoopContinuity.score * 0.5 +
      input.capacityRenewalPriming.score * 0.26 +
      loopContinuityFeed +
      renewalLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralForwardArcRechargeGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralForwardArcRechargeGateSmoothing(persisted.bilateralForwardArcRechargeGateSmoothing);
  const band = rechargeBand(score);

  const summary =
    band === 'recharged'
      ? 'Forward arc recharge gate is recharged — stable loop continuity feeds the next commitment arc.'
      : band === 'blocked'
        ? 'Arc recharge blocked; cut loop continuity and starved renewal withheld charge.'
        : band === 'starved'
          ? 'Recharge starved — renewal priming is lagging stable loop continuity.'
          : 'Forward arc recharge gate is charging stable loop continuity into renewal priming.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      loopContinuityFeed: Math.round(loopContinuityFeed * 1000) / 1000,
      renewalLift: Math.round(renewalLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralForwardArcRechargeGateExportScale(
  snapshot: GTELBilateralForwardArcRechargeGateSnapshot,
): number {
  if (snapshot.band === 'recharged') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'blocked') return gtelClamp(0.961 + snapshot.score * 0.006, 0.955, 0.973);
  if (snapshot.band === 'starved') return gtelClamp(0.992 + snapshot.score * 0.001, 0.987, 0.995);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralForwardArcRechargeGateDomesticStressRelief(
  snapshot: GTELBilateralForwardArcRechargeGateSnapshot,
): number {
  if (snapshot.band === 'recharged') return gtelClamp(snapshot.score * 0.017, 0.004, 0.021);
  if (snapshot.band === 'charging') return gtelClamp(snapshot.score * 0.006, 0, 0.007);
  return 0;
}

export function bilateralForwardArcRechargeGateWorldEvent(
  snapshot: GTELBilateralForwardArcRechargeGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'blocked' && snapshot.band !== 'starved') return null;
  if (snapshot.loopContinuityFeed > -0.02) return null;
  return {
    id: `gtel_arc_recharge_${turn}`,
    turn,
    kind: 'trade',
    title: 'Forward arc recharge constrained',
    summary: snapshot.summary,
    regionIds: ['WA', 'SA', 'NSW'],
  };
}

export function bilateralForwardArcRechargeGateGiNotes(
  snapshot: GTELBilateralForwardArcRechargeGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral forward arc recharge gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
