import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CorridorEquityDriftRow,
  OP10M_A11_ReliefEquityGapBand,
  OP10M_A11_ReliefEquityGapRow,
  OP10M_A11_ReliefOverheadRow,
  OP10M_A11_RegionId,
  OP10M_A11_ServiceEquityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function gapBand(score: number): OP10M_A11_ReliefEquityGapBand {
  if (score < 21) return 'aligned';
  if (score < 39) return 'uneven';
  if (score < 57) return 'skewed';
  return 'polarized';
}

export function op10mA11ComputeInterregionalReliefDeliveryEquityGap(args: {
  reliefOverhead: OP10M_A11_ReliefOverheadRow[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
}): { rows: OP10M_A11_ReliefEquityGapRow[]; nationalIndex: number } {
  const reliefByRegion = new Map(args.reliefOverhead.map((r) => [r.regionId, r]));
  const driftByRegion = new Map(args.corridorEquityDrift.map((d) => [d.regionId, d]));
  const equityByRegion = new Map(args.serviceEquity.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_ReliefEquityGapRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const relief = reliefByRegion.get(rid);
    const drift = driftByRegion.get(rid);
    const equity = equityByRegion.get(rid);

    const deliveryDrag = relief ? op10mA11Clamp(relief.overheadScore * 0.46) : 14;
    const corridorDrag = drift ? op10mA11Clamp(drift.driftScore * 0.4) : 12;
    const serviceDrag = equity
      ? op10mA11Clamp((100 - equity.equityScore) * 0.3 + (equity.band === 'critical_gap' ? 8 : 0))
      : 10;

    const gapScore = op10mA11Clamp(deliveryDrag + corridorDrag + serviceDrag * 0.55);
    weighted += gapScore;

    const gaps: string[] = [];
    if (relief && (relief.band === 'overloaded' || relief.band === 'paralytic')) gaps.push('relief delivery load');
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) gaps.push('corridor inequity');
    if (equity && (equity.band === 'uneven' || equity.band === 'critical_gap')) gaps.push('service equity gap');
    if (!gaps.length) gaps.push('balanced relief reach');

    rows.push({
      regionId: rid,
      gapScore: op10mA11Round(gapScore),
      band: gapBand(gapScore),
      gaps: gaps.slice(0, 3),
      narrative: `${rid} relief delivery equity ${gapBand(gapScore)} (${op10mA11Round(gapScore)}); ${gaps.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.gapScore - a.gapScore), nationalIndex };
}

export function op10mA11RegionsWithPolarizedReliefEquity(rows: OP10M_A11_ReliefEquityGapRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'skewed' || r.band === 'polarized').map((r) => r.regionId);
}

export function op10mA11ReliefEquityGapEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 45;
  return currentIndex >= 39 && currentIndex > priorIndex + 5;
}
