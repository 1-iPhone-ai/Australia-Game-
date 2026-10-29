import type {
  GTELBilateralForwardCycleAdvanceGateSnapshot,
  GTELCommitmentWindowSustainmentSnapshot,
  GTELPersisted,
  GTELTradeCycleSealVerificationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralForwardCycleAdvanceGateBand = GTELBilateralForwardCycleAdvanceGateSnapshot['band'];

function advanceBand(score: number): GTELBilateralForwardCycleAdvanceGateBand {
  if (score >= 0.94) return 'advanced';
  if (score >= 0.74) return 'clearing';
  if (score >= 0.56) return 'held';
  return 'denied';
}

export function sanitizeBilateralForwardCycleAdvanceGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralForwardCycleAdvanceGateSnapshot(): GTELBilateralForwardCycleAdvanceGateSnapshot {
  return {
    score: 0.52,
    band: 'clearing',
    sustainmentFeed: 0.1,
    sealLift: 0.08,
    summary: 'Forward cycle advance gate is clearing sustained window handoff.',
  };
}

export function advanceBilateralForwardCycleAdvanceGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralForwardCycleAdvanceGateSmoothing(
    persisted.bilateralForwardCycleAdvanceGateSmoothing,
  );
  const next = gtelClamp(prev * 0.41 + gtelClamp(rawScore, 0.16, 0.92) * 0.59, 0.16, 0.92);
  return {
    ...persisted,
    bilateralForwardCycleAdvanceGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralForwardCycleAdvanceGateSnapshot(input: {
  commitmentWindowSustainment: GTELCommitmentWindowSustainmentSnapshot;
  tradeCycleSealVerification: GTELTradeCycleSealVerificationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralForwardCycleAdvanceGateSnapshot; persisted: GTELPersisted } {
  const sustainmentFeed =
    input.commitmentWindowSustainment.band === 'sustained'
      ? 0.17
      : input.commitmentWindowSustainment.band === 'carrying'
        ? 0.08
        : input.commitmentWindowSustainment.band === 'fading'
          ? -0.04
          : -0.1;
  const sealLift =
    input.tradeCycleSealVerification.band === 'verified'
      ? 0.15
      : input.tradeCycleSealVerification.band === 'failed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.commitmentWindowSustainment.score * 0.51 +
      input.tradeCycleSealVerification.score * 0.25 +
      sustainmentFeed +
      sealLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralForwardCycleAdvanceGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralForwardCycleAdvanceGateSmoothing(
    persisted.bilateralForwardCycleAdvanceGateSmoothing,
  );
  const band = advanceBand(score);

  const summary =
    band === 'advanced'
      ? 'Forward cycle advance gate is open — sustained window and verified seal advance the next loop.'
      : band === 'denied'
        ? 'Cycle advance denied; dropped sustainment and failed seal blocked progression.'
        : band === 'held'
          ? 'Advance held — seal verification is lagging window sustainment.'
          : 'Forward cycle advance gate is clearing sustained window handoff.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      sustainmentFeed: Math.round(sustainmentFeed * 1000) / 1000,
      sealLift: Math.round(sealLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralForwardCycleAdvanceGateExportScale(
  snapshot: GTELBilateralForwardCycleAdvanceGateSnapshot,
): number {
  if (snapshot.band === 'advanced') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'denied') return gtelClamp(0.965 + snapshot.score * 0.006, 0.959, 0.977);
  if (snapshot.band === 'held') return gtelClamp(0.993 + snapshot.score * 0.001, 0.988, 0.996);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralForwardCycleAdvanceGateDomesticStressRelief(
  snapshot: GTELBilateralForwardCycleAdvanceGateSnapshot,
): number {
  if (snapshot.band === 'advanced') return gtelClamp(snapshot.score * 0.015, 0.003, 0.019);
  if (snapshot.band === 'clearing') return gtelClamp(snapshot.score * 0.005, 0, 0.006);
  return 0;
}

export function bilateralForwardCycleAdvanceGateWorldEvent(
  snapshot: GTELBilateralForwardCycleAdvanceGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'denied' && snapshot.band !== 'held') return null;
  if (snapshot.sustainmentFeed > -0.02) return null;
  return {
    id: `gtel_cycle_adv_${turn}`,
    turn,
    kind: 'trade',
    title: 'Forward cycle advance constrained',
    summary: snapshot.summary,
    regionIds: ['SA', 'NSW', 'WA'],
  };
}

export function bilateralForwardCycleAdvanceGateGiNotes(
  snapshot: GTELBilateralForwardCycleAdvanceGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral forward cycle advance gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
