import type {
  GTELBilateralCapacityHandoffGateSnapshot,
  GTELCapacityHandoffAbsorptionSnapshot,
  GTELCertifiedThroughputSustainmentSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCapacityHandoffAbsorptionBand = GTELCapacityHandoffAbsorptionSnapshot['band'];

function absorptionBand(score: number): GTELCapacityHandoffAbsorptionBand {
  if (score >= 0.83) return 'absorbed';
  if (score >= 0.63) return 'integrating';
  if (score >= 0.45) return 'leaking';
  return 'rejected';
}

export function sanitizeCapacityHandoffAbsorptionSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCapacityHandoffAbsorptionSnapshot(): GTELCapacityHandoffAbsorptionSnapshot {
  return {
    score: 0.52,
    band: 'integrating',
    handoffSupport: 0.1,
    sustainmentLift: 0.08,
    summary: 'Handoff capacity is integrating into the active export window.',
  };
}

export function advanceCapacityHandoffAbsorptionSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCapacityHandoffAbsorptionSmoothing(persisted.capacityHandoffAbsorptionSmoothing);
  const next = gtelClamp(prev * 0.58 + gtelClamp(rawScore, 0.16, 0.92) * 0.42, 0.16, 0.92);
  return { ...persisted, capacityHandoffAbsorptionSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCapacityHandoffAbsorptionSnapshot(input: {
  bilateralCapacityHandoffGate: GTELBilateralCapacityHandoffGateSnapshot;
  certifiedThroughputSustainment: GTELCertifiedThroughputSustainmentSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCapacityHandoffAbsorptionSnapshot; persisted: GTELPersisted } {
  const handoffSupport =
    input.bilateralCapacityHandoffGate.band === 'open'
      ? 0.17
      : input.bilateralCapacityHandoffGate.band === 'queued'
        ? 0.08
        : input.bilateralCapacityHandoffGate.band === 'throttled'
          ? -0.04
          : -0.11;
  const sustainmentLift =
    input.certifiedThroughputSustainment.band === 'sustained'
      ? 0.14
      : input.certifiedThroughputSustainment.band === 'exhausted'
        ? -0.1
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralCapacityHandoffGate.score * 0.46 +
      input.certifiedThroughputSustainment.score * 0.28 +
      handoffSupport +
      sustainmentLift +
      input.bilateralCapacityHandoffGate.readinessLift * 0.1,
    0.16,
    0.92,
  );
  const persisted = advanceCapacityHandoffAbsorptionSmoothing(input.persisted, rawScore);
  const score = sanitizeCapacityHandoffAbsorptionSmoothing(persisted.capacityHandoffAbsorptionSmoothing);
  const band = absorptionBand(score);

  const summary =
    band === 'absorbed'
      ? 'Handoff capacity is fully absorbed into the active export window.'
      : band === 'rejected'
        ? 'Capacity absorption rejected — the handoff gate closed before transfer completed.'
        : band === 'leaking'
          ? 'Absorption is leaking — sustainment cannot hold transferred capacity.'
          : 'Handoff capacity is integrating into the active export window.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      handoffSupport: Math.round(handoffSupport * 1000) / 1000,
      sustainmentLift: Math.round(sustainmentLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function capacityHandoffAbsorptionExportScale(snapshot: GTELCapacityHandoffAbsorptionSnapshot): number {
  if (snapshot.band === 'absorbed') return gtelClamp(1 + snapshot.score * 0.011, 1, 1.017);
  if (snapshot.band === 'rejected') return gtelClamp(0.94 + snapshot.score * 0.028, 0.92, 0.97);
  if (snapshot.band === 'leaking') return gtelClamp(0.97 + snapshot.score * 0.018, 0.94, 0.99);
  return gtelClamp(0.975 + snapshot.score * 0.006, 0.95, 1.02);
}

export function capacityHandoffAbsorptionDomesticStress(snapshot: GTELCapacityHandoffAbsorptionSnapshot): number {
  if (snapshot.band === 'rejected') return gtelClamp((0.32 - snapshot.score) * 0.075, 0.01, 0.045);
  if (snapshot.band === 'leaking') return gtelClamp((0.46 - snapshot.score) * 0.04, 0.005, 0.025);
  return 0;
}

export function capacityHandoffAbsorptionWorldEvent(
  snapshot: GTELCapacityHandoffAbsorptionSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'rejected' && snapshot.band !== 'leaking') return null;
  if (snapshot.handoffSupport > -0.03) return null;
  return {
    id: `gtel_absorb_${turn}`,
    turn,
    kind: 'trade',
    title: 'Capacity handoff absorption strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'VIC'],
  };
}

export function capacityHandoffAbsorptionGiNotes(
  snapshot: GTELCapacityHandoffAbsorptionSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Capacity handoff absorption: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
