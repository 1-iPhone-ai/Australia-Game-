import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralCycleRestartAcknowledgmentSnapshot,
  GTELPersisted,
  GTELResumedLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCycleRestartAcknowledgmentBand = GTELBilateralCycleRestartAcknowledgmentSnapshot['band'];

function acknowledgmentBand(score: number): GTELBilateralCycleRestartAcknowledgmentBand {
  if (score >= 0.92) return 'acknowledged';
  if (score >= 0.72) return 'pending';
  if (score >= 0.54) return 'deferred';
  return 'rejected';
}

export function sanitizeBilateralCycleRestartAcknowledgmentSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCycleRestartAcknowledgmentSnapshot(): GTELBilateralCycleRestartAcknowledgmentSnapshot {
  return {
    score: 0.52,
    band: 'pending',
    continuitySupport: 0.1,
    readinessLift: 0.08,
    summary: 'Cycle restart acknowledgment is pending continuous loop and book readiness.',
  };
}

export function advanceBilateralCycleRestartAcknowledgmentSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCycleRestartAcknowledgmentSmoothing(
    persisted.bilateralCycleRestartAcknowledgmentSmoothing,
  );
  const next = gtelClamp(prev * 0.49 + gtelClamp(rawScore, 0.16, 0.92) * 0.51, 0.16, 0.92);
  return { ...persisted, bilateralCycleRestartAcknowledgmentSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralCycleRestartAcknowledgmentSnapshot(input: {
  resumedLoopContinuity: GTELResumedLoopContinuitySnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCycleRestartAcknowledgmentSnapshot; persisted: GTELPersisted } {
  const continuitySupport =
    input.resumedLoopContinuity.band === 'continuous'
      ? 0.16
      : input.resumedLoopContinuity.band === 'linked'
        ? 0.07
        : input.resumedLoopContinuity.band === 'fragile'
          ? -0.04
          : -0.09;
  const readinessLift =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.14
      : input.anchoredBookReadiness.band === 'blocked'
        ? -0.08
        : 0.05;
  const rawScore = gtelClamp(
    input.resumedLoopContinuity.score * 0.52 +
      input.anchoredBookReadiness.score * 0.26 +
      continuitySupport +
      readinessLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCycleRestartAcknowledgmentSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCycleRestartAcknowledgmentSmoothing(
    persisted.bilateralCycleRestartAcknowledgmentSmoothing,
  );
  const band = acknowledgmentBand(score);

  const summary =
    band === 'acknowledged'
      ? 'Bilateral cycle restart is acknowledged — continuous loop and ready books open the next commitment arc.'
      : band === 'rejected'
        ? 'Restart acknowledgment rejected; broken loop continuity blocked cycle recognition.'
        : band === 'deferred'
          ? 'Acknowledgment deferred — book readiness is lagging resumed loop continuity.'
          : 'Cycle restart acknowledgment is pending continuous loop and book readiness.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuitySupport: Math.round(continuitySupport * 1000) / 1000,
      readinessLift: Math.round(readinessLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCycleRestartAcknowledgmentExportScale(
  snapshot: GTELBilateralCycleRestartAcknowledgmentSnapshot,
): number {
  if (snapshot.band === 'acknowledged') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'rejected') return gtelClamp(0.985 + snapshot.score * 0.005, 0.975, 0.99);
  if (snapshot.band === 'deferred') return gtelClamp(0.997 + snapshot.score * 0.002, 0.992, 0.999);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralCycleRestartAcknowledgmentDomesticStressRelief(
  snapshot: GTELBilateralCycleRestartAcknowledgmentSnapshot,
): number {
  if (snapshot.band === 'acknowledged') return gtelClamp(snapshot.score * 0.014, 0.003, 0.018);
  if (snapshot.band === 'pending') return gtelClamp(snapshot.score * 0.005, 0, 0.006);
  return 0;
}

export function bilateralCycleRestartAcknowledgmentWorldEvent(
  snapshot: GTELBilateralCycleRestartAcknowledgmentSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'rejected' && snapshot.band !== 'deferred') return null;
  if (snapshot.continuitySupport > -0.02) return null;
  return {
    id: `gtel_restart_ack_${turn}`,
    turn,
    kind: 'trade',
    title: 'Cycle restart acknowledgment withheld',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function bilateralCycleRestartAcknowledgmentGiNotes(
  snapshot: GTELBilateralCycleRestartAcknowledgmentSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral cycle restart acknowledgment: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
