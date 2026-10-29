import type {
  GTELAcknowledgedCyclePrimingSnapshot,
  GTELBilateralCycleRestartAcknowledgmentSnapshot,
  GTELCapacityRenewalPrimingSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELAcknowledgedCyclePrimingBand = GTELAcknowledgedCyclePrimingSnapshot['band'];

function primingBand(score: number): GTELAcknowledgedCyclePrimingBand {
  if (score >= 0.93) return 'primed';
  if (score >= 0.73) return 'charging';
  if (score >= 0.55) return 'weak';
  return 'empty';
}

export function sanitizeAcknowledgedCyclePrimingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyAcknowledgedCyclePrimingSnapshot(): GTELAcknowledgedCyclePrimingSnapshot {
  return {
    score: 0.52,
    band: 'charging',
    acknowledgmentSupport: 0.1,
    renewalFeed: 0.08,
    summary: 'Acknowledged cycle priming is charging the next commitment arc.',
  };
}

export function advanceAcknowledgedCyclePrimingSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeAcknowledgedCyclePrimingSmoothing(persisted.acknowledgedCyclePrimingSmoothing);
  const next = gtelClamp(prev * 0.48 + gtelClamp(rawScore, 0.16, 0.92) * 0.52, 0.16, 0.92);
  return { ...persisted, acknowledgedCyclePrimingSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeAcknowledgedCyclePrimingSnapshot(input: {
  bilateralCycleRestartAcknowledgment: GTELBilateralCycleRestartAcknowledgmentSnapshot;
  capacityRenewalPriming: GTELCapacityRenewalPrimingSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELAcknowledgedCyclePrimingSnapshot; persisted: GTELPersisted } {
  const acknowledgmentSupport =
    input.bilateralCycleRestartAcknowledgment.band === 'acknowledged'
      ? 0.17
      : input.bilateralCycleRestartAcknowledgment.band === 'pending'
        ? 0.07
        : input.bilateralCycleRestartAcknowledgment.band === 'deferred'
          ? -0.04
          : -0.09;
  const renewalFeed =
    input.capacityRenewalPriming.band === 'primed'
      ? 0.13
      : input.capacityRenewalPriming.band === 'starved'
        ? -0.08
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralCycleRestartAcknowledgment.score * 0.5 +
      input.capacityRenewalPriming.score * 0.26 +
      acknowledgmentSupport +
      renewalFeed,
    0.16,
    0.92,
  );
  const persisted = advanceAcknowledgedCyclePrimingSmoothing(input.persisted, rawScore);
  const score = sanitizeAcknowledgedCyclePrimingSmoothing(persisted.acknowledgedCyclePrimingSmoothing);
  const band = primingBand(score);

  const summary =
    band === 'primed'
      ? 'Acknowledged cycle priming is complete — restart acknowledgment feeds the next arc.'
      : band === 'empty'
        ? 'Cycle priming is empty; rejected acknowledgment blocked arc charge.'
        : band === 'weak'
          ? 'Priming is weak — renewal feed is lagging acknowledgment support.'
          : 'Acknowledged cycle priming is charging the next commitment arc.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      acknowledgmentSupport: Math.round(acknowledgmentSupport * 1000) / 1000,
      renewalFeed: Math.round(renewalFeed * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function acknowledgedCyclePrimingExportScale(snapshot: GTELAcknowledgedCyclePrimingSnapshot): number {
  if (snapshot.band === 'primed') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'empty') return gtelClamp(0.99 + snapshot.score * 0.004, 0.98, 0.995);
  if (snapshot.band === 'weak') return gtelClamp(0.998 + snapshot.score * 0.001, 0.995, 1.002);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function acknowledgedCyclePrimingDomesticStress(snapshot: GTELAcknowledgedCyclePrimingSnapshot): number {
  if (snapshot.band === 'empty') return gtelClamp((0.27 - snapshot.score) * 0.05, 0.003, 0.025);
  if (snapshot.band === 'weak') return gtelClamp((0.38 - snapshot.score) * 0.025, 0.001, 0.014);
  return 0;
}

export function acknowledgedCyclePrimingWorldEvent(
  snapshot: GTELAcknowledgedCyclePrimingSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'empty' && snapshot.band !== 'weak') return null;
  if (snapshot.acknowledgmentSupport > -0.02) return null;
  return {
    id: `gtel_ack_prim_${turn}`,
    turn,
    kind: 'trade',
    title: 'Acknowledged cycle priming strain',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function acknowledgedCyclePrimingGiNotes(
  snapshot: GTELAcknowledgedCyclePrimingSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Acknowledged cycle priming: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
