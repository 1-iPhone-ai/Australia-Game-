import type {
  GTELBilateralThroughputCertificationSnapshot,
  GTELCertifiedThroughputSustainmentSnapshot,
  GTELForwardBookAnchorStabilizationSnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELCertifiedThroughputSustainmentBand = GTELCertifiedThroughputSustainmentSnapshot['band'];

function sustainmentBand(score: number): GTELCertifiedThroughputSustainmentBand {
  if (score >= 0.81) return 'sustained';
  if (score >= 0.61) return 'holding';
  if (score >= 0.43) return 'fading';
  return 'exhausted';
}

export function sanitizeCertifiedThroughputSustainmentSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyCertifiedThroughputSustainmentSnapshot(): GTELCertifiedThroughputSustainmentSnapshot {
  return {
    score: 0.52,
    band: 'holding',
    certificationSupport: 0.1,
    anchorLift: 0.08,
    summary: 'Certified throughput is holding across the turn boundary.',
  };
}

export function advanceCertifiedThroughputSustainmentSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeCertifiedThroughputSustainmentSmoothing(persisted.certifiedThroughputSustainmentSmoothing);
  const next = gtelClamp(prev * 0.6 + gtelClamp(rawScore, 0.16, 0.92) * 0.4, 0.16, 0.92);
  return { ...persisted, certifiedThroughputSustainmentSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeCertifiedThroughputSustainmentSnapshot(input: {
  bilateralThroughputCertification: GTELBilateralThroughputCertificationSnapshot;
  forwardBookAnchorStabilization: GTELForwardBookAnchorStabilizationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELCertifiedThroughputSustainmentSnapshot; persisted: GTELPersisted } {
  const certificationSupport =
    input.bilateralThroughputCertification.band === 'certified'
      ? 0.17
      : input.bilateralThroughputCertification.band === 'pending'
        ? 0.07
        : input.bilateralThroughputCertification.band === 'conditional'
          ? -0.04
          : -0.11;
  const anchorLift =
    input.forwardBookAnchorStabilization.band === 'locked'
      ? 0.13
      : input.forwardBookAnchorStabilization.band === 'unmoored'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralThroughputCertification.score * 0.48 +
      input.forwardBookAnchorStabilization.score * 0.26 +
      certificationSupport +
      anchorLift +
      input.bilateralThroughputCertification.readinessSupport * 0.12,
    0.16,
    0.92,
  );
  const persisted = advanceCertifiedThroughputSustainmentSmoothing(input.persisted, rawScore);
  const score = sanitizeCertifiedThroughputSustainmentSmoothing(persisted.certifiedThroughputSustainmentSmoothing);
  const band = sustainmentBand(score);

  const summary =
    band === 'sustained'
      ? 'Certified throughput is sustained — certification and anchors hold export capacity steady.'
      : band === 'exhausted'
        ? 'Throughput sustainment is exhausted; certification clearance cannot hold through the turn.'
        : band === 'fading'
          ? 'Sustainment is fading — certified throughput is slipping against anchor support.'
          : 'Certified throughput is holding across the turn boundary.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      certificationSupport: Math.round(certificationSupport * 1000) / 1000,
      anchorLift: Math.round(anchorLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function certifiedThroughputSustainmentExportScale(
  snapshot: GTELCertifiedThroughputSustainmentSnapshot,
): number {
  if (snapshot.band === 'sustained') return gtelClamp(1 + snapshot.score * 0.013, 1, 1.019);
  if (snapshot.band === 'exhausted') return gtelClamp(0.92 + snapshot.score * 0.035, 0.9, 0.96);
  if (snapshot.band === 'fading') return gtelClamp(0.96 + snapshot.score * 0.025, 0.93, 0.99);
  return gtelClamp(0.97 + snapshot.score * 0.008, 0.94, 1.02);
}

export function certifiedThroughputSustainmentDomesticStress(
  snapshot: GTELCertifiedThroughputSustainmentSnapshot,
): number {
  if (snapshot.band === 'exhausted') return gtelClamp((0.33 - snapshot.score) * 0.08, 0.012, 0.05);
  if (snapshot.band === 'fading') return gtelClamp((0.47 - snapshot.score) * 0.045, 0.006, 0.028);
  return 0;
}

export function certifiedThroughputSustainmentWorldEvent(
  snapshot: GTELCertifiedThroughputSustainmentSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'exhausted' && snapshot.band !== 'fading') return null;
  if (snapshot.certificationSupport > -0.03) return null;
  return {
    id: `gtel_sustain_${turn}`,
    turn,
    kind: 'trade',
    title: 'Certified throughput sustainment strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function certifiedThroughputSustainmentGiNotes(
  snapshot: GTELCertifiedThroughputSustainmentSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Certified throughput sustainment: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
