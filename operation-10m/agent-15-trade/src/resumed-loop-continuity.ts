import type {
  GTELBilateralLoopResumptionGateSnapshot,
  GTELCycleReentryStabilizationSnapshot,
  GTELPersisted,
  GTELResumedLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELResumedLoopContinuityBand = GTELResumedLoopContinuitySnapshot['band'];

function continuityBand(score: number): GTELResumedLoopContinuityBand {
  if (score >= 0.91) return 'continuous';
  if (score >= 0.71) return 'linked';
  if (score >= 0.53) return 'fragile';
  return 'broken';
}

export function sanitizeResumedLoopContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyResumedLoopContinuitySnapshot(): GTELResumedLoopContinuitySnapshot {
  return {
    score: 0.52,
    band: 'linked',
    resumptionSupport: 0.1,
    stabilizationAnchor: 0.08,
    summary: 'Resumed loop continuity is linked across the restarted bilateral cycle.',
  };
}

export function advanceResumedLoopContinuitySmoothing(persisted: GTELPersisted, rawScore: number): GTELPersisted {
  const prev = sanitizeResumedLoopContinuitySmoothing(persisted.resumedLoopContinuitySmoothing);
  const next = gtelClamp(prev * 0.5 + gtelClamp(rawScore, 0.16, 0.92) * 0.5, 0.16, 0.92);
  return { ...persisted, resumedLoopContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeResumedLoopContinuitySnapshot(input: {
  bilateralLoopResumptionGate: GTELBilateralLoopResumptionGateSnapshot;
  cycleReentryStabilization: GTELCycleReentryStabilizationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELResumedLoopContinuitySnapshot; persisted: GTELPersisted } {
  const resumptionSupport =
    input.bilateralLoopResumptionGate.band === 'resumed'
      ? 0.17
      : input.bilateralLoopResumptionGate.band === 'opening'
        ? 0.08
        : input.bilateralLoopResumptionGate.band === 'stalled'
          ? -0.04
          : -0.09;
  const stabilizationAnchor =
    input.cycleReentryStabilization.band === 'stable'
      ? 0.14
      : input.cycleReentryStabilization.band === 'volatile'
        ? -0.08
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralLoopResumptionGate.score * 0.5 +
      input.cycleReentryStabilization.score * 0.28 +
      resumptionSupport +
      stabilizationAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceResumedLoopContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeResumedLoopContinuitySmoothing(persisted.resumedLoopContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'continuous'
      ? 'Resumed loop continuity is continuous — stabilization and resumption hold the restarted cycle.'
      : band === 'broken'
        ? 'Loop continuity is broken; closed resumption gate severed the bilateral link.'
        : band === 'fragile'
          ? 'Continuity is fragile — stabilization anchor is slipping on the resumed loop.'
          : 'Resumed loop continuity is linked across the restarted bilateral cycle.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      resumptionSupport: Math.round(resumptionSupport * 1000) / 1000,
      stabilizationAnchor: Math.round(stabilizationAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function resumedLoopContinuityExportScale(snapshot: GTELResumedLoopContinuitySnapshot): number {
  if (snapshot.band === 'continuous') return gtelClamp(1 + snapshot.score * 0.003, 1, 1.008);
  if (snapshot.band === 'broken') return gtelClamp(0.98 + snapshot.score * 0.006, 0.97, 0.985);
  if (snapshot.band === 'fragile') return gtelClamp(0.996 + snapshot.score * 0.003, 0.99, 0.999);
  return gtelClamp(0.983 + snapshot.score * 0.001, 0.95, 1.02);
}

export function resumedLoopContinuityDomesticStress(snapshot: GTELResumedLoopContinuitySnapshot): number {
  if (snapshot.band === 'broken') return gtelClamp((0.28 - snapshot.score) * 0.055, 0.004, 0.028);
  if (snapshot.band === 'fragile') return gtelClamp((0.4 - snapshot.score) * 0.028, 0.002, 0.016);
  return 0;
}

export function resumedLoopContinuityWorldEvent(
  snapshot: GTELResumedLoopContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'fragile') return null;
  if (snapshot.resumptionSupport > -0.02) return null;
  return {
    id: `gtel_loop_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Resumed loop continuity strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'QLD'],
  };
}

export function resumedLoopContinuityGiNotes(snapshot: GTELResumedLoopContinuitySnapshot | null | undefined): string[] {
  if (!snapshot) return [];
  return [
    `Resumed loop continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
