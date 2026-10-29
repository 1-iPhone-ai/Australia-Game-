import type {
  GTELAnchoredBookReadinessSnapshot,
  GTELBilateralThroughputCertificationSnapshot,
  GTELLogisticsStress,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralThroughputCertificationBand = GTELBilateralThroughputCertificationSnapshot['band'];

function certificationBand(score: number): GTELBilateralThroughputCertificationBand {
  if (score >= 0.8) return 'certified';
  if (score >= 0.6) return 'pending';
  if (score >= 0.42) return 'conditional';
  return 'rejected';
}

export function sanitizeBilateralThroughputCertificationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralThroughputCertificationSnapshot(): GTELBilateralThroughputCertificationSnapshot {
  return {
    score: 0.52,
    band: 'pending',
    readinessSupport: 0.1,
    logisticsClearance: 0.08,
    summary: 'Bilateral throughput certification is pending anchored book readiness.',
  };
}

export function advanceBilateralThroughputCertificationSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralThroughputCertificationSmoothing(persisted.bilateralThroughputCertificationSmoothing);
  const next = gtelClamp(prev * 0.61 + gtelClamp(rawScore, 0.16, 0.92) * 0.39, 0.16, 0.92);
  return { ...persisted, bilateralThroughputCertificationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralThroughputCertificationSnapshot(input: {
  anchoredBookReadiness: GTELAnchoredBookReadinessSnapshot;
  logistics: GTELLogisticsStress;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralThroughputCertificationSnapshot; persisted: GTELPersisted } {
  const readinessSupport =
    input.anchoredBookReadiness.band === 'ready'
      ? 0.16
      : input.anchoredBookReadiness.band === 'staging'
        ? 0.07
        : input.anchoredBookReadiness.band === 'constrained'
          ? -0.04
          : -0.1;
  const logisticsClearance =
    input.logistics.band === 'fluid'
      ? 0.12
      : input.logistics.band === 'watch'
        ? 0.04
        : input.logistics.band === 'tight'
          ? -0.06
          : -0.12;
  const rawScore = gtelClamp(
    input.anchoredBookReadiness.score * 0.5 +
      (input.logistics.redundancyScore ?? 0.5) * 0.22 +
      readinessSupport +
      logisticsClearance +
      0.06,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralThroughputCertificationSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralThroughputCertificationSmoothing(
    persisted.bilateralThroughputCertificationSmoothing,
  );
  const band = certificationBand(score);

  const summary =
    band === 'certified'
      ? 'Bilateral throughput is certified — readiness and logistics clear export capacity for the turn.'
      : band === 'rejected'
        ? 'Throughput certification rejected; blocked readiness or congested lanes withhold clearance.'
        : band === 'conditional'
          ? 'Certification is conditional — logistics clearance is limiting certified throughput.'
          : 'Bilateral throughput certification is pending anchored book readiness.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      readinessSupport: Math.round(readinessSupport * 1000) / 1000,
      logisticsClearance: Math.round(logisticsClearance * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralThroughputCertificationExportScale(
  snapshot: GTELBilateralThroughputCertificationSnapshot,
): number {
  if (snapshot.band === 'certified') return gtelClamp(1 + snapshot.score * 0.014, 1, 1.02);
  if (snapshot.band === 'rejected') return gtelClamp(0.91 + snapshot.score * 0.04, 0.89, 0.95);
  if (snapshot.band === 'conditional') return gtelClamp(0.96 + snapshot.score * 0.028, 0.93, 0.99);
  return gtelClamp(0.97 + snapshot.score * 0.009, 0.94, 1.02);
}

export function bilateralThroughputCertificationDomesticStressRelief(
  snapshot: GTELBilateralThroughputCertificationSnapshot,
): number {
  if (snapshot.band === 'certified') return gtelClamp(snapshot.score * 0.026, 0.008, 0.032);
  if (snapshot.band === 'pending') return gtelClamp(snapshot.score * 0.012, 0, 0.014);
  return 0;
}

export function bilateralThroughputCertificationWorldEvent(
  snapshot: GTELBilateralThroughputCertificationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'rejected' && snapshot.band !== 'conditional') return null;
  if (snapshot.logisticsClearance > -0.04) return null;
  return {
    id: `gtel_throughput_cert_${turn}`,
    turn,
    kind: 'trade',
    title: 'Throughput certification withheld',
    summary: snapshot.summary,
    regionIds: ['WA', 'VIC', 'SA'],
  };
}

export function bilateralThroughputCertificationGiNotes(
  snapshot: GTELBilateralThroughputCertificationSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral throughput certification: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
