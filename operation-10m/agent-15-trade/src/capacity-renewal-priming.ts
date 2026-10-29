import type {
  GTELBilateralCapacityRenewalGateSnapshot,
  GTELCapacityRenewalPrimingSnapshot,
  GTELCertifiedThroughputSustainmentSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCapacityRenewalPrimingBand = GTELCapacityRenewalPrimingSnapshot['band'];

function primingBand(score: number): GTELCapacityRenewalPrimingBand {
  if (score >= 0.87) return 'primed';
  if (score >= 0.67) return 'charging';
  if (score >= 0.49) return 'underfed';
  return 'starved';
}

export function sanitizeCapacityRenewalPrimingSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCapacityRenewalPrimingSnapshot(): GTELCapacityRenewalPrimingSnapshot {
  return {
    score: 0.52,
    band: 'charging',
    renewalSupport: 0.1,
    sustainmentFeed: 0.08,
    summary: 'Renewed capacity is charging into the next bilateral cycle.',
  };
}

export function advanceCapacityRenewalPrimingSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCapacityRenewalPrimingSmoothing(persisted.capacityRenewalPrimingSmoothing);
  const next = gtelClamp(prev * 0.54 + gtelClamp(rawScore, 0.16, 0.92) * 0.46, 0.16, 0.92);
  return { ...persisted, capacityRenewalPrimingSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCapacityRenewalPrimingSnapshot(input: {
  bilateralCapacityRenewalGate: GTELBilateralCapacityRenewalGateSnapshot;
  certifiedThroughputSustainment: GTELCertifiedThroughputSustainmentSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCapacityRenewalPrimingSnapshot; persisted: GTELPersisted } {
  const renewalSupport =
    input.bilateralCapacityRenewalGate.band === 'renewed'
      ? 0.17
      : input.bilateralCapacityRenewalGate.band === 'pending'
        ? 0.08
        : input.bilateralCapacityRenewalGate.band === 'deferred'
          ? -0.04
          : -0.1;
  const sustainmentFeed =
    input.certifiedThroughputSustainment.band === 'sustained'
      ? 0.13
      : input.certifiedThroughputSustainment.band === 'exhausted'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralCapacityRenewalGate.score * 0.5 +
      input.certifiedThroughputSustainment.score * 0.26 +
      renewalSupport +
      sustainmentFeed +
      input.bilateralCapacityRenewalGate.readinessLift * 0.1,
    0.16,
    0.92,
  );
  const persisted = advanceCapacityRenewalPrimingSmoothing(input.persisted, rawScore);
  const score = sanitizeCapacityRenewalPrimingSmoothing(persisted.capacityRenewalPrimingSmoothing);
  const band = primingBand(score);

  const summary =
    band === 'primed'
      ? 'Renewed capacity is primed — renewal gate and sustainment feed the next cycle.'
      : band === 'starved'
        ? 'Capacity priming is starved; renewal gate closed before charge completed.'
        : band === 'underfed'
          ? 'Priming is underfed — sustainment cannot keep pace with renewal demand.'
          : 'Renewed capacity is charging into the next bilateral cycle.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      renewalSupport: Math.round(renewalSupport * 1000) / 1000,
      sustainmentFeed: Math.round(sustainmentFeed * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function capacityRenewalPrimingExportScale(snapshot: GTELCapacityRenewalPrimingSnapshot): number {
  if (snapshot.band === 'primed') return gtelClamp(1 + snapshot.score * 0.007, 1, 1.013);
  if (snapshot.band === 'starved') return gtelClamp(0.965 + snapshot.score * 0.015, 0.95, 0.98);
  if (snapshot.band === 'underfed') return gtelClamp(0.99 + snapshot.score * 0.008, 0.975, 0.995);
  return gtelClamp(0.979 + snapshot.score * 0.002, 0.95, 1.02);
}

export function capacityRenewalPrimingDomesticStress(snapshot: GTELCapacityRenewalPrimingSnapshot): number {
  if (snapshot.band === 'starved') return gtelClamp((0.3 - snapshot.score) * 0.065, 0.006, 0.035);
  if (snapshot.band === 'underfed') return gtelClamp((0.43 - snapshot.score) * 0.035, 0.003, 0.02);
  return 0;
}

export function capacityRenewalPrimingWorldEvent(
  snapshot: GTELCapacityRenewalPrimingSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'starved' && snapshot.band !== 'underfed') return null;
  if (snapshot.renewalSupport > -0.02) return null;
  return {
    id: `gtel_priming_${turn}`,
    turn,
    kind: 'trade',
    title: 'Capacity renewal priming strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'QLD'],
  };
}

export function capacityRenewalPrimingGiNotes(
  snapshot: GTELCapacityRenewalPrimingSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Capacity renewal priming: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
