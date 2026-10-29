import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CorridorFlowRow,
  OP10M_A11_LinkageHubProfile,
  OP10M_A11_MigrationPressureBand,
  OP10M_A11_MigrationPressureRow,
  OP10M_A11_RegionId,
  OP10M_A11_RegionInequalityRow,
  OP10M_A11_RegionalBottleneck,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function migrationBand(score: number): OP10M_A11_MigrationPressureBand {
  if (score < 22) return 'stable';
  if (score < 42) return 'elevated';
  if (score < 62) return 'high';
  return 'surge';
}

export function op10mA11ComputeMigrationPressure(args: {
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
  bottlenecks: OP10M_A11_RegionalBottleneck[];
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  corridorFlows: OP10M_A11_CorridorFlowRow[];
}): OP10M_A11_MigrationPressureRow[] {
  const bottleneckByRegion = new Map(args.bottlenecks.map((b) => [b.regionId, b]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));

  const inboundFlow = new Map<OP10M_A11_RegionId, number>();
  for (const rid of OP10M_A11_CORE_REGIONS) inboundFlow.set(rid, 0);
  for (const f of args.corridorFlows) {
    if (f.band === 'heavy' || f.band === 'surge') {
      inboundFlow.set(f.toRegion, (inboundFlow.get(f.toRegion) ?? 0) + f.flowPressure * 0.35);
    }
  }

  const rows: OP10M_A11_MigrationPressureRow[] = [];
  for (const rid of OP10M_A11_CORE_REGIONS) {
    const row = args.regions[rid];
    const hub = hubByRegion.get(rid);
    const bn = bottleneckByRegion.get(rid);

    const pull =
      row.leading && row.band !== 'contracting'
        ? op10mA11Clamp(row.urbanGrowthIndex * 0.45 + (row.relativeStanding - 50) * 0.25)
        : op10mA11Clamp(Math.max(0, 62 - row.urbanGrowthIndex) * 0.2);

    const push =
      (row.lagging ? 18 : 0) +
      (bn?.severity === 'critical' ? 22 : bn?.severity === 'meaningful' ? 12 : 0) +
      (hub ? hub.isolationScore * 0.28 : 0);

    const corridorPull = op10mA11Clamp((inboundFlow.get(rid) ?? 0) * 0.4);
    const netPressure = op10mA11Clamp(pull + corridorPull + push * 0.55 - (row.spilloverBand === 'integrated' ? 8 : 0));

    const primaryDirection: OP10M_A11_MigrationPressureRow['primaryDirection'] =
      pull + corridorPull > push + 12
        ? 'inbound'
        : push > pull + 10
          ? 'outbound'
          : 'balanced';

    rows.push({
      regionId: rid,
      pullScore: op10mA11Round(pull + corridorPull),
      pushScore: op10mA11Round(push),
      netPressure: op10mA11Round(netPressure),
      band: migrationBand(netPressure),
      primaryDirection,
      narrative: `${rid} migration ${migrationBand(netPressure)} (${primaryDirection}); pull ${op10mA11Round(pull + corridorPull)} vs push ${op10mA11Round(push)}.`,
    });
  }

  return rows.sort((a, b) => b.netPressure - a.netPressure);
}

export function op10mA11RegionsWithMigrationSurge(rows: OP10M_A11_MigrationPressureRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'surge' || r.band === 'high').map((r) => r.regionId);
}
