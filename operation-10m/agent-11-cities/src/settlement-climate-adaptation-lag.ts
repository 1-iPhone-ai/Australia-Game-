import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsorptionGapRow,
  OP10M_A11_AdaptationLagBand,
  OP10M_A11_AdaptationLagRow,
  OP10M_A11_ClimateDisplacementRow,
  OP10M_A11_InfrastructureBacklogRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function lagBand(score: number): OP10M_A11_AdaptationLagBand {
  if (score < 23) return 'responsive';
  if (score < 41) return 'lagging';
  if (score < 59) return 'stalled';
  return 'critical_lag';
}

export function op10mA11ComputeSettlementClimateAdaptationLag(args: {
  climateDisplacement: OP10M_A11_ClimateDisplacementRow[];
  absorptionGap: OP10M_A11_AbsorptionGapRow[];
  infrastructureBacklog: OP10M_A11_InfrastructureBacklogRow[];
}): { rows: OP10M_A11_AdaptationLagRow[]; nationalIndex: number } {
  const climateByRegion = new Map(args.climateDisplacement.map((c) => [c.regionId, c]));
  const gapByRegion = new Map(args.absorptionGap.map((g) => [g.regionId, g]));
  const backlogByRegion = new Map(args.infrastructureBacklog.map((b) => [b.regionId, b]));

  const rows: OP10M_A11_AdaptationLagRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const climate = climateByRegion.get(rid);
    const gap = gapByRegion.get(rid);
    const backlog = backlogByRegion.get(rid);

    const exposureDrag = climate ? op10mA11Clamp(climate.displacementScore * 0.5) : 16;
    const capacityDrag = gap ? op10mA11Clamp(gap.gapScore * 0.4) : 12;
    const infraDrag = backlog ? op10mA11Clamp(backlog.backlogScore * 0.34) : 10;

    const lagScore = op10mA11Clamp(exposureDrag + capacityDrag + infraDrag * 0.55);
    weighted += lagScore;

    const drivers: string[] = [];
    if (climate && (climate.band === 'acute' || climate.band === 'critical')) drivers.push('climate exposure');
    if (gap && (gap.band === 'critical' || gap.band === 'rupture')) drivers.push('absorption mismatch');
    if (backlog && (backlog.band === 'severe' || backlog.band === 'critical')) drivers.push('adaptation backlog');
    if (!drivers.length) drivers.push('adaptation on track');

    rows.push({
      regionId: rid,
      lagScore: op10mA11Round(lagScore),
      band: lagBand(lagScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} climate adaptation ${lagBand(lagScore)} (${op10mA11Round(lagScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.lagScore - a.lagScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalAdaptationLag(rows: OP10M_A11_AdaptationLagRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'stalled' || r.band === 'critical_lag').map((r) => r.regionId);
}

export function op10mA11AdaptationLagEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
