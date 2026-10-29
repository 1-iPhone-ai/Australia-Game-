import type {
  GTELBilateralLoopResumptionGateSnapshot,
  GTELCapacityRenewalPrimingSnapshot,
  GTELCycleReentryStabilizationSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralLoopResumptionGateBand = GTELBilateralLoopResumptionGateSnapshot['band'];

function resumptionBand(score: number): GTELBilateralLoopResumptionGateBand {
  if (score >= 0.9) return 'resumed';
  if (score >= 0.7) return 'opening';
  if (score >= 0.52) return 'stalled';
  return 'closed';
}

export function sanitizeBilateralLoopResumptionGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralLoopResumptionGateSnapshot(): GTELBilateralLoopResumptionGateSnapshot {
  return {
    score: 0.52,
    band: 'opening',
    stabilizationSupport: 0.1,
    primingLift: 0.08,
    summary: 'Bilateral loop resumption is opening as reentry stabilizes.',
  };
}

export function advanceBilateralLoopResumptionGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralLoopResumptionGateSmoothing(persisted.bilateralLoopResumptionGateSmoothing);
  const next = gtelClamp(prev * 0.51 + gtelClamp(rawScore, 0.16, 0.92) * 0.49, 0.16, 0.92);
  return { ...persisted, bilateralLoopResumptionGateSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralLoopResumptionGateSnapshot(input: {
  cycleReentryStabilization: GTELCycleReentryStabilizationSnapshot;
  capacityRenewalPriming: GTELCapacityRenewalPrimingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralLoopResumptionGateSnapshot; persisted: GTELPersisted } {
  const stabilizationSupport =
    input.cycleReentryStabilization.band === 'stable'
      ? 0.16
      : input.cycleReentryStabilization.band === 'settling'
        ? 0.08
        : input.cycleReentryStabilization.band === 'unsettled'
          ? -0.04
          : -0.09;
  const primingLift =
    input.capacityRenewalPriming.band === 'primed'
      ? 0.13
      : input.capacityRenewalPriming.band === 'starved'
        ? -0.08
        : 0.05;
  const rawScore = gtelClamp(
    input.cycleReentryStabilization.score * 0.54 +
      input.capacityRenewalPriming.score * 0.24 +
      stabilizationSupport +
      primingLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralLoopResumptionGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralLoopResumptionGateSmoothing(persisted.bilateralLoopResumptionGateSmoothing);
  const band = resumptionBand(score);

  const summary =
    band === 'resumed'
      ? 'Bilateral loop resumption gate is open — stabilized reentry and primed capacity restart the trade cycle.'
      : band === 'closed'
        ? 'Loop resumption closed; volatile reentry blocked full cycle restart.'
        : band === 'stalled'
          ? 'Resumption stalled — priming lift faded before stabilization completed.'
          : 'Bilateral loop resumption is opening as reentry stabilizes.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      stabilizationSupport: Math.round(stabilizationSupport * 1000) / 1000,
      primingLift: Math.round(primingLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralLoopResumptionGateExportScale(snapshot: GTELBilateralLoopResumptionGateSnapshot): number {
  if (snapshot.band === 'resumed') return gtelClamp(1 + snapshot.score * 0.004, 1, 1.009);
  if (snapshot.band === 'closed') return gtelClamp(0.978 + snapshot.score * 0.008, 0.965, 0.98);
  if (snapshot.band === 'stalled') return gtelClamp(0.995 + snapshot.score * 0.004, 0.988, 0.999);
  return gtelClamp(0.982 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralLoopResumptionGateDomesticStressRelief(
  snapshot: GTELBilateralLoopResumptionGateSnapshot,
): number {
  if (snapshot.band === 'resumed') return gtelClamp(snapshot.score * 0.016, 0.004, 0.02);
  if (snapshot.band === 'opening') return gtelClamp(snapshot.score * 0.006, 0, 0.007);
  return 0;
}

export function bilateralLoopResumptionGateWorldEvent(
  snapshot: GTELBilateralLoopResumptionGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'closed' && snapshot.band !== 'stalled') return null;
  if (snapshot.stabilizationSupport > -0.02) return null;
  return {
    id: `gtel_loop_resume_${turn}`,
    turn,
    kind: 'trade',
    title: 'Bilateral loop resumption constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function bilateralLoopResumptionGateGiNotes(
  snapshot: GTELBilateralLoopResumptionGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral loop resumption gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
