import type {
  CouplingStressBand,
  CrossPillarCouplingSnapshot,
  NationalHousingWellbeingSnapshot,
  NationalServiceAccessLens,
  PublicServiceCapacitySnapshot,
  PublicServicePillar,
} from './types.ts';

function clamp(n: number, lo = 0, hi = 100): number {
  if (!Number.isFinite(n)) return lo;
  return Math.max(lo, Math.min(hi, Math.round(n * 10) / 10));
}

function bandFromCoupling(index: number): CouplingStressBand {
  if (index >= 72) return 'stable';
  if (index >= 55) return 'watch';
  if (index >= 38) return 'strained';
  return 'critical';
}

function housingSpillover(
  pillar: PublicServicePillar,
  housing: NationalHousingWellbeingSnapshot,
  capacity: PublicServiceCapacitySnapshot
): number {
  const backlog = housing.averagePlanningBacklogMonths;
  const equity = housing.regionalEquityGap;
  const delivery = capacity.deliveryCapacityIndex;
  let spill = 0;
  if (pillar === 'healthcare') {
    spill -= backlog * 0.35;
    spill -= equity * 0.12;
    spill += (delivery - 50) * 0.15;
  } else if (pillar === 'education') {
    spill -= backlog * 0.28;
    spill -= equity * 0.1;
    spill += (delivery - 50) * 0.12;
  } else {
    spill += (100 - housing.nationalAffordabilityIndex) * 0.08;
  }
  return spill;
}

function capacitySpillover(pillar: PublicServicePillar, capacity: PublicServiceCapacitySnapshot): number {
  const slice = capacity.byPillar[pillar];
  let spill = (slice.capacityIndex - 50) * 0.2;
  if (capacity.bindingConstraint === 'workforce') spill -= 8;
  if (capacity.bindingConstraint === 'fiscal_absorption') spill -= 6;
  if (slice.loadRatio > 1) spill -= (slice.loadRatio - 1) * 10;
  return spill;
}

export function computeCrossPillarCoupling(
  turn: number,
  capacity: PublicServiceCapacitySnapshot,
  housing: NationalHousingWellbeingSnapshot,
  access: NationalServiceAccessLens
): CrossPillarCouplingSnapshot {
  const evidence: string[] = [];
  const byPillar = {} as CrossPillarCouplingSnapshot['byPillar'];

  for (const pillar of ['housing', 'healthcare', 'education'] as const) {
    const fromHousing = housingSpillover(pillar, housing, capacity);
    const fromCapacity = capacitySpillover(pillar, capacity);
    const accessDrag = 50 - access.pillarNational[pillar].accessIndex;
    const net = clamp(58 + fromHousing + fromCapacity - accessDrag * 0.25);
    byPillar[pillar] = {
      pillar,
      spilloverFromHousing: Math.round(fromHousing * 10) / 10,
      spilloverFromCapacity: Math.round(fromCapacity * 10) / 10,
      netCouplingIndex: net,
      band: bandFromCoupling(net),
    };
    if (byPillar[pillar].band === 'strained' || byPillar[pillar].band === 'critical') {
      evidence.push(`${pillar} coupling ${net} (${byPillar[pillar].band})`);
    }
  }

  const nationalCouplingIndex = clamp(
    (byPillar.housing.netCouplingIndex +
      byPillar.healthcare.netCouplingIndex +
      byPillar.education.netCouplingIndex) /
      3
  );

  if (housing.affordabilityStress === 'severe' || housing.affordabilityStress === 'elevated') {
    evidence.push(`Affordability ${housing.affordabilityStress} amplifies cross-pillar spillover`);
  }

  return {
    turn,
    nationalCouplingIndex,
    band: bandFromCoupling(nationalCouplingIndex),
    byPillar,
    evidence,
  };
}
