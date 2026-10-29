import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsorptionStressRow,
  OP10M_A11_InfrastructureBacklogBand,
  OP10M_A11_InfrastructureBacklogRow,
  OP10M_A11_RegionalBottleneck,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function backlogBand(score: number): OP10M_A11_InfrastructureBacklogBand {
  if (score < 28) return 'manageable';
  if (score < 48) return 'elevated';
  if (score < 68) return 'severe';
  return 'critical';
}

export function op10mA11ComputeRegionalInfrastructureBacklog(args: {
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
  corridorStressIndex: number;
}): { rows: OP10M_A11_InfrastructureBacklogRow[]; nationalIndex: number } {
  const bottleneckByRegion = new Map(args.bottlenecks.map((b) => [b.regionId, b]));
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_InfrastructureBacklogRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const bn = bottleneckByRegion.get(rid);
    const abs = absorptionByRegion.get(rid);
    const bottleneckLoad = bn ? op10mA11Clamp(bn.bindScore * 0.72) : 16;
    const absorptionDrag = abs ? op10mA11Clamp(abs.stressScore * 0.38) : 12;
    const networkDrag = op10mA11Clamp(args.corridorStressIndex * 0.22);

    const backlogScore = op10mA11Clamp(bottleneckLoad + absorptionDrag + networkDrag);
    weighted += backlogScore;

    const drivers: string[] = [];
    if (bn && bn.bindScore >= 45) drivers.push('regional bottleneck');
    if (abs && (abs.band === 'strained' || abs.band === 'breached')) drivers.push('absorption strain');
    if (args.corridorStressIndex >= 50) drivers.push('network corridor stress');
    if (!drivers.length) drivers.push('routine maintenance queue');

    rows.push({
      regionId: rid,
      backlogScore: op10mA11Round(backlogScore),
      band: backlogBand(backlogScore),
      estimatedTurnsToClear: op10mA11Round(op10mA11Clamp(backlogScore / 12)),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} infrastructure backlog ${backlogBand(backlogScore)} (${op10mA11Round(backlogScore)}); ~${op10mA11Round(op10mA11Clamp(backlogScore / 12))} turns to clear.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.backlogScore - a.backlogScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalBacklog(rows: OP10M_A11_InfrastructureBacklogRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'critical' || r.band === 'severe').map((r) => r.regionId);
}
