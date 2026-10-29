import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_ClimateDisplacementBand,
  OP10M_A11_ClimateDisplacementRow,
  OP10M_A11_RegionalBottleneck,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementVulnerabilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function displacementBand(score: number): OP10M_A11_ClimateDisplacementBand {
  if (score < 26) return 'low';
  if (score < 46) return 'elevated';
  if (score < 64) return 'acute';
  return 'critical';
}

export function op10mA11ComputeClimateSettlementDisplacementRisk(args: {
  settlementVulnerability: OP10M_A11_SettlementVulnerabilityRow[];
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  networkDigital: number;
  corridorStressIndex: number;
}): { rows: OP10M_A11_ClimateDisplacementRow[]; nationalIndex: number } {
  const settlementByRegion = new Map(args.settlementVulnerability.map((s) => [s.regionId, s]));
  const bottleneckByRegion = new Map(args.bottlenecks.map((b) => [b.regionId, b]));
  const resilienceGap = op10mA11Clamp(78 - args.networkDigital * 0.65);
  const networkStress = op10mA11Clamp(args.corridorStressIndex * 0.28);

  const rows: OP10M_A11_ClimateDisplacementRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const settlement = settlementByRegion.get(rid);
    const bottleneck = bottleneckByRegion.get(rid);

    const exposureBase = settlement ? op10mA11Clamp(settlement.vulnerabilityScore * 0.62) : 18;
    const evacDrag = bottleneck ? op10mA11Clamp(bottleneck.bindScore * 0.38) : 12;
    const displacementScore = op10mA11Clamp(exposureBase + evacDrag + resilienceGap * 0.35 + networkStress);

    weighted += displacementScore;

    const hazards: string[] = [];
    if (settlement && (settlement.band === 'fragile' || settlement.band === 'critical')) {
      hazards.push('settlement exposure');
    }
    if (bottleneck && bottleneck.bindScore >= 42) hazards.push('evacuation corridor bind');
    if (resilienceGap >= 28) hazards.push('digital resilience gap');
    if (args.corridorStressIndex >= 52) hazards.push('network stress amplification');
    if (!hazards.length) hazards.push('routine hazard monitoring');

    rows.push({
      regionId: rid,
      displacementScore: op10mA11Round(displacementScore),
      band: displacementBand(displacementScore),
      hazards: hazards.slice(0, 3),
      narrative: `${rid} climate displacement ${displacementBand(displacementScore)} (${op10mA11Round(displacementScore)}); ${hazards.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.displacementScore - a.displacementScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalClimateDisplacement(rows: OP10M_A11_ClimateDisplacementRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'acute' || r.band === 'critical').map((r) => r.regionId);
}
