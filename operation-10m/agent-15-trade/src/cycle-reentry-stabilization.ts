import type {
  GTELBilateralCycleReentryGateSnapshot,
  GTELCycleReentryStabilizationSnapshot,
  GTELTradeCycleSealVerificationSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCycleReentryStabilizationBand = GTELCycleReentryStabilizationSnapshot['band'];

function stabilizationBand(score: number): GTELCycleReentryStabilizationBand {
  if (score >= 0.89) return 'stable';
  if (score >= 0.69) return 'settling';
  if (score >= 0.51) return 'unsettled';
  return 'volatile';
}

export function sanitizeCycleReentryStabilizationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCycleReentryStabilizationSnapshot(): GTELCycleReentryStabilizationSnapshot {
  return {
    score: 0.52,
    band: 'settling',
    reentrySupport: 0.1,
    sealAnchor: 0.08,
    summary: 'Cycle reentry is settling as the new bilateral loop finds rhythm.',
  };
}

export function advanceCycleReentryStabilizationSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCycleReentryStabilizationSmoothing(persisted.cycleReentryStabilizationSmoothing);
  const next = gtelClamp(prev * 0.52 + gtelClamp(rawScore, 0.16, 0.92) * 0.48, 0.16, 0.92);
  return { ...persisted, cycleReentryStabilizationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCycleReentryStabilizationSnapshot(input: {
  bilateralCycleReentryGate: GTELBilateralCycleReentryGateSnapshot;
  tradeCycleSealVerification: GTELTradeCycleSealVerificationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCycleReentryStabilizationSnapshot; persisted: GTELPersisted } {
  const reentrySupport =
    input.bilateralCycleReentryGate.band === 'entered'
      ? 0.17
      : input.bilateralCycleReentryGate.band === 'approaching'
        ? 0.08
        : input.bilateralCycleReentryGate.band === 'held'
          ? -0.04
          : -0.1;
  const sealAnchor =
    input.tradeCycleSealVerification.band === 'verified'
      ? 0.13
      : input.tradeCycleSealVerification.band === 'failed'
        ? -0.08
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralCycleReentryGate.score * 0.52 +
      input.tradeCycleSealVerification.score * 0.22 +
      reentrySupport +
      sealAnchor +
      input.bilateralCycleReentryGate.primingSupport * 0.1,
    0.16,
    0.92,
  );
  const persisted = advanceCycleReentryStabilizationSmoothing(input.persisted, rawScore);
  const score = sanitizeCycleReentryStabilizationSmoothing(persisted.cycleReentryStabilizationSmoothing);
  const band = stabilizationBand(score);

  const summary =
    band === 'stable'
      ? 'Cycle reentry is stable — the new bilateral loop is holding seal and gate alignment.'
      : band === 'volatile'
        ? 'Reentry stabilization is volatile; denied gate is rocking the reopened cycle.'
        : band === 'unsettled'
          ? 'Stabilization unsettled — seal anchor is lagging reentry momentum.'
          : 'Cycle reentry is settling as the new bilateral loop finds rhythm.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      reentrySupport: Math.round(reentrySupport * 1000) / 1000,
      sealAnchor: Math.round(sealAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function cycleReentryStabilizationExportScale(snapshot: GTELCycleReentryStabilizationSnapshot): number {
  if (snapshot.band === 'stable') return gtelClamp(1 + snapshot.score * 0.005, 1, 1.01);
  if (snapshot.band === 'volatile') return gtelClamp(0.975 + snapshot.score * 0.01, 0.96, 0.985);
  if (snapshot.band === 'unsettled') return gtelClamp(0.993 + snapshot.score * 0.005, 0.985, 0.998);
  return gtelClamp(0.981 + snapshot.score * 0.001, 0.95, 1.02);
}

export function cycleReentryStabilizationDomesticStress(snapshot: GTELCycleReentryStabilizationSnapshot): number {
  if (snapshot.band === 'volatile') return gtelClamp((0.29 - snapshot.score) * 0.06, 0.005, 0.03);
  if (snapshot.band === 'unsettled') return gtelClamp((0.42 - snapshot.score) * 0.032, 0.002, 0.018);
  return 0;
}

export function cycleReentryStabilizationWorldEvent(
  snapshot: GTELCycleReentryStabilizationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'volatile' && snapshot.band !== 'unsettled') return null;
  if (snapshot.reentrySupport > -0.02) return null;
  return {
    id: `gtel_reentry_stab_${turn}`,
    turn,
    kind: 'trade',
    title: 'Cycle reentry stabilization strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function cycleReentryStabilizationGiNotes(
  snapshot: GTELCycleReentryStabilizationSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Cycle reentry stabilization: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
