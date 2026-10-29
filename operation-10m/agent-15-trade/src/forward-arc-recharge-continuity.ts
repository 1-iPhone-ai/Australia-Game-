import type {
  GTELBilateralForwardArcRechargeGateSnapshot,
  GTELForwardArcRechargeContinuitySnapshot,
  GTELPersisted,
  GTELReopenedCommitmentLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELForwardArcRechargeContinuityBand = GTELForwardArcRechargeContinuitySnapshot['band'];

function continuityBand(score: number): GTELForwardArcRechargeContinuityBand {
  if (score >= 0.93) return 'held';
  if (score >= 0.73) return 'carrying';
  if (score >= 0.55) return 'thinning';
  return 'lost';
}

export function sanitizeForwardArcRechargeContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyForwardArcRechargeContinuitySnapshot(): GTELForwardArcRechargeContinuitySnapshot {
  return {
    score: 0.52,
    band: 'carrying',
    rechargeSupport: 0.1,
    loopFeed: 0.08,
    summary: 'Forward arc recharge continuity is carrying recharged gate against loop stability.',
  };
}

export function advanceForwardArcRechargeContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeForwardArcRechargeContinuitySmoothing(persisted.forwardArcRechargeContinuitySmoothing);
  const next = gtelClamp(prev * 0.36 + gtelClamp(rawScore, 0.16, 0.92) * 0.64, 0.16, 0.92);
  return { ...persisted, forwardArcRechargeContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeForwardArcRechargeContinuitySnapshot(input: {
  bilateralForwardArcRechargeGate: GTELBilateralForwardArcRechargeGateSnapshot;
  reopenedCommitmentLoopContinuity: GTELReopenedCommitmentLoopContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELForwardArcRechargeContinuitySnapshot; persisted: GTELPersisted } {
  const rechargeSupport =
    input.bilateralForwardArcRechargeGate.band === 'recharged'
      ? 0.18
      : input.bilateralForwardArcRechargeGate.band === 'charging'
        ? 0.08
        : input.bilateralForwardArcRechargeGate.band === 'starved'
          ? -0.04
          : -0.11;
  const loopFeed =
    input.reopenedCommitmentLoopContinuity.band === 'stable'
      ? 0.14
      : input.reopenedCommitmentLoopContinuity.band === 'cut'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralForwardArcRechargeGate.score * 0.52 +
      input.reopenedCommitmentLoopContinuity.score * 0.24 +
      rechargeSupport +
      loopFeed,
    0.16,
    0.92,
  );
  const persisted = advanceForwardArcRechargeContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeForwardArcRechargeContinuitySmoothing(persisted.forwardArcRechargeContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'held'
      ? 'Forward arc recharge continuity is held — recharged gate and stable loop stay coupled.'
      : band === 'lost'
        ? 'Recharge continuity lost; blocked gate and cut loop diverged.'
        : band === 'thinning'
          ? 'Continuity is thinning — loop feed is lagging arc recharge.'
          : 'Forward arc recharge continuity is carrying recharged gate against loop stability.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      rechargeSupport: Math.round(rechargeSupport * 1000) / 1000,
      loopFeed: Math.round(loopFeed * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function forwardArcRechargeContinuityExportScale(snapshot: GTELForwardArcRechargeContinuitySnapshot): number {
  if (snapshot.band === 'held') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'lost') return gtelClamp(0.96 + snapshot.score * 0.005, 0.954, 0.972);
  if (snapshot.band === 'thinning') return gtelClamp(0.992 + snapshot.score * 0.001, 0.987, 0.995);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function forwardArcRechargeContinuityDomesticStress(snapshot: GTELForwardArcRechargeContinuitySnapshot): number {
  if (snapshot.band === 'lost') return gtelClamp((0.26 - snapshot.score) * 0.032, 0.003, 0.016);
  if (snapshot.band === 'thinning') return gtelClamp((0.38 - snapshot.score) * 0.013, 0.001, 0.006);
  return 0;
}

export function forwardArcRechargeContinuityWorldEvent(
  snapshot: GTELForwardArcRechargeContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'lost' && snapshot.band !== 'thinning') return null;
  if (snapshot.rechargeSupport > -0.02) return null;
  return {
    id: `gtel_rech_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Forward arc recharge continuity strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'SA', 'VIC'],
  };
}

export function forwardArcRechargeContinuityGiNotes(
  snapshot: GTELForwardArcRechargeContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Forward arc recharge continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
