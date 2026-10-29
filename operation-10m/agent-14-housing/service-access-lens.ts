import { AGENT14_CORE_REGIONS } from './constants.ts';
import type {
  DelayedSpendingTurnEffects,
  NationalServiceAccessLens,
  PillarAccessSlice,
  PublicServiceCapacitySnapshot,
  PublicServicePillar,
  RegionalServiceAccessState,
  ServiceAccessBand,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function bandFromIndex(index: number): ServiceAccessBand {
  if (index >= 72) return 'strong';
  if (index >= 55) return 'adequate';
  if (index >= 38) return 'weak';
  return 'critical';
}

function pillarSlice(
  pillar: PublicServicePillar,
  base: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  regionalDelta: number
): PillarAccessSlice {
  const capSlice = capacity.byPillar[pillar];
  const boost = spending.completedProjectBoost[pillar];
  let accessIndex = base;
  accessIndex += boost * 8;
  accessIndex += (capSlice.capacityIndex - 50) * 0.25;
  accessIndex += regionalDelta * 1.5;
  accessIndex -= capSlice.loadRatio > 1 ? (capSlice.loadRatio - 1) * 12 : 0;
  accessIndex = clamp(accessIndex);
  const backlogPressure = clamp(100 - accessIndex + capSlice.loadRatio * 15);
  return { pillar, accessIndex, band: bandFromIndex(accessIndex), backlogPressure };
}

export function computeRegionalServiceAccess(
  regionId: string,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  remoteShare: number
): RegionalServiceAccessState {
  const delta = spending.regionalKpiDelta[regionId] ?? {};
  const remotePenalty = remoteShare * 18;
  const housing = pillarSlice(
    'housing',
    58 - remotePenalty,
    capacity,
    spending,
    delta.housing ?? 0
  );
  const healthcare = pillarSlice(
    'healthcare',
    62 - remotePenalty * 0.9,
    capacity,
    spending,
    delta.healthcare ?? 0
  );
  const education = pillarSlice(
    'education',
    60 - remotePenalty * 0.85,
    capacity,
    spending,
    delta.education ?? 0
  );
  const compositeIndex = clamp((housing.accessIndex + healthcare.accessIndex + education.accessIndex) / 3);
  return {
    regionId,
    pillars: { housing, healthcare, education },
    compositeIndex,
  };
}

export function computeNationalServiceAccessLens(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  spending: DelayedSpendingTurnEffects,
  remoteShareByRegion: Record<string, number>
): NationalServiceAccessLens {
  const regions: Record<string, RegionalServiceAccessState> = {};
  const composites: number[] = [];
  for (const r of AGENT14_CORE_REGIONS) {
    const st = computeRegionalServiceAccess(
      r,
      capacity,
      spending,
      remoteShareByRegion[r] ?? 0.1
    );
    regions[r] = st;
    composites.push(st.compositeIndex);
  }
  const nationalComposite =
    composites.length > 0 ? clamp(composites.reduce((a, b) => a + b, 0) / composites.length) : 50;
  const equityGap = clamp(Math.max(...composites) - Math.min(...composites));

  const pillarNational = {} as Record<PublicServicePillar, PillarAccessSlice>;
  for (const pillar of ['housing', 'healthcare', 'education'] as PublicServicePillar[]) {
    const avg =
      AGENT14_CORE_REGIONS.reduce((s, rid) => s + regions[rid]!.pillars[pillar].accessIndex, 0) /
      AGENT14_CORE_REGIONS.length;
    pillarNational[pillar] = {
      pillar,
      accessIndex: clamp(avg),
      band: bandFromIndex(avg),
      backlogPressure: clamp(100 - avg),
    };
  }

  return {
    turn,
    nationalComposite,
    nationalBand: bandFromIndex(nationalComposite),
    pillarNational,
    regions,
    equityGap,
  };
}
