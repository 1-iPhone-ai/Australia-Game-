import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralCapacityHandoffGateSnapshot,
  GTELCertifiedThroughputSustainmentSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCapacityHandoffGateBand = GTELBilateralCapacityHandoffGateSnapshot['band'];

function handoffBand(score: number): GTELBilateralCapacityHandoffGateBand {
  if (score >= 0.82) return 'open';
  if (score >= 0.62) return 'queued';
  if (score >= 0.44) return 'throttled';
  return 'closed';
}

export function sanitizeBilateralCapacityHandoffGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCapacityHandoffGateSnapshot(): GTELBilateralCapacityHandoffGateSnapshot {
  return {
    score: 0.52,
    band: 'queued',
    sustainmentSupport: 0.1,
    readinessLift: 0.08,
    summary: 'Capacity handoff is queued pending sustained certification.',
  };
}

export function advanceBilateralCapacityHandoffGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCapacityHandoffGateSmoothing(persisted.bilateralCapacityHandoffGateSmoothing);
  const next = gtelClamp(prev * 0.59 + gtelClamp(rawScore, 0.16, 0.92) * 0.41, 0.16, 0.92);
  return { ...persisted, bilateralCapacityHandoffGateSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralCapacityHandoffGateSnapshot(input: {
  certifiedThroughputSustainment: GTELCertifiedThroughputSustainmentSnapshot;
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCapacityHandoffGateSnapshot; persisted: GTELPersisted } {
  const sustainmentSupport =
    input.certifiedThroughputSustainment.band === 'sustained'
      ? 0.16
      : input.certifiedThroughputSustainment.band === 'holding'
        ? 0.08
        : input.certifiedThroughputSustainment.band === 'fading'
          ? -0.04
          : -0.1;
  const readinessLift =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.14
      : input.anchoredBookReadiness.band === 'blocked'
        ? -0.1
        : 0.05;
  const rawScore = gtelClamp(
    input.certifiedThroughputSustainment.score * 0.46 +
      input.anchoredBookReadiness.score * 0.3 +
      sustainmentSupport +
      readinessLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCapacityHandoffGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCapacityHandoffGateSmoothing(persisted.bilateralCapacityHandoffGateSmoothing);
  const band = handoffBand(score);

  const summary =
    band === 'open'
      ? 'Capacity handoff gate is open — sustained certification and ready books clear the next window.'
      : band === 'closed'
        ? 'Handoff gate is closed; sustainment exhaustion is blocking capacity transfer.'
        : band === 'throttled'
          ? 'Handoff is throttled — readiness or sustainment is limiting capacity transfer.'
          : 'Capacity handoff is queued pending sustained certification.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      sustainmentSupport: Math.round(sustainmentSupport * 1000) / 1000,
      readinessLift: Math.round(readinessLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCapacityHandoffGateExportScale(
  snapshot: GTELBilateralCapacityHandoffGateSnapshot,
): number {
  if (snapshot.band === 'open') return gtelClamp(1 + snapshot.score * 0.012, 1, 1.018);
  if (snapshot.band === 'closed') return gtelClamp(0.93 + snapshot.score * 0.032, 0.91, 0.96);
  if (snapshot.band === 'throttled') return gtelClamp(0.965 + snapshot.score * 0.022, 0.94, 0.99);
  return gtelClamp(0.97 + snapshot.score * 0.007, 0.94, 1.02);
}

export function bilateralCapacityHandoffGateDomesticStressRelief(
  snapshot: GTELBilateralCapacityHandoffGateSnapshot,
): number {
  if (snapshot.band === 'open') return gtelClamp(snapshot.score * 0.024, 0.008, 0.03);
  if (snapshot.band === 'queued') return gtelClamp(snapshot.score * 0.01, 0, 0.012);
  return 0;
}

export function bilateralCapacityHandoffGateWorldEvent(
  snapshot: GTELBilateralCapacityHandoffGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'closed' && snapshot.band !== 'throttled') return null;
  if (snapshot.sustainmentSupport > -0.02) return null;
  return {
    id: `gtel_handoff_${turn}`,
    turn,
    kind: 'trade',
    title: 'Capacity handoff gate constrained',
    summary: snapshot.summary,
    regionIds: ['VIC', 'SA', 'NSW'],
  };
}

export function bilateralCapacityHandoffGateGiNotes(
  snapshot: GTELBilateralCapacityHandoffGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral capacity handoff gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
