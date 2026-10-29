import { OP10M_A11_CORE_REGIONS, type OP10M_A11_RegionId, type OP10M_A11_CityGrowthSlice, type OP10M_A11_RegionTransportNeed, type OP10M_A11_RegionalBottleneck, type OP10M_A11_BottleneckSeverity } from './types.ts';
import { op10mA11Clamp, op10mA11Round } from './constants.ts';

const SEV_WEIGHT: Record<OP10M_A11_RegionTransportNeed['severity'], number> = {
  low: 4,
  moderate: 10,
  high: 22,
  critical: 36,
};

function bottleneckSeverity(score: number): OP10M_A11_BottleneckSeverity {
  if (score >= 58) return 'critical';
  if (score >= 34) return 'meaningful';
  if (score >= 18) return 'watch';
  return 'watch';
}

export function op10mA11DetectRegionalBottlenecks(args: {
  cities: OP10M_A11_CityGrowthSlice[];
  transportNeeds: OP10M_A11_RegionTransportNeed[];
  infraByRegion: Partial<Record<OP10M_A11_RegionId, number>>;
}): OP10M_A11_RegionalBottleneck[] {
  const out: OP10M_A11_RegionalBottleneck[] = [];

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const drivers: string[] = [];
    let bindScore = 0;

    const openTransport = args.transportNeeds.filter(
      (n) => n.regionId === rid && n.category === 'transport' && n.status === 'open',
    );
    for (const need of openTransport) {
      bindScore += SEV_WEIGHT[need.severity];
      drivers.push(`open transport need (${need.severity})`);
    }

    const regionCities = args.cities.filter((c) => c.regionId === rid);
    const gateway = regionCities.filter((c) => c.gateway);
    for (const g of gateway) {
      if (g.growthBand === 'fast' || g.growthBand === 'surging') {
        if (g.absorptionHeadroom < 28) {
          bindScore += 16;
          drivers.push(`${g.cityId} growth binding (headroom ${g.absorptionHeadroom})`);
        }
      }
    }

    const infra = args.infraByRegion[rid] ?? 45;
    if (infra < 42) {
      bindScore += op10mA11Clamp(50 - infra, 0, 18);
      drivers.push(`low regional infrastructure (${infra})`);
    }

    bindScore = op10mA11Clamp(bindScore);
    if (bindScore < 18) continue;

    out.push({
      regionId: rid,
      severity: bottleneckSeverity(bindScore),
      bindScore: op10mA11Round(bindScore),
      drivers: drivers.slice(0, 4),
      explanation: `${rid} infrastructure bottleneck (${bottleneckSeverity(bindScore)}): ${drivers.slice(0, 2).join('; ')}`,
    });
  }

  return out.sort((a, b) => b.bindScore - a.bindScore);
}

export function op10mA11SummarizeBottlenecks(rows: OP10M_A11_RegionalBottleneck[]): string {
  if (!rows.length) return 'No regional infrastructure bottlenecks flagged.';
  const critical = rows.filter((r) => r.severity === 'critical').map((r) => r.regionId);
  const meaningful = rows.filter((r) => r.severity === 'meaningful').map((r) => r.regionId);
  return `Bottlenecks — critical: ${critical.join('/') || 'none'}; meaningful: ${meaningful.join('/') || 'none'}.`;
}
