import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CorridorEquityDriftRow,
  OP10M_A11_NetworkErosionRow,
  OP10M_A11_NetworkEquityTensionBand,
  OP10M_A11_NetworkEquityTensionRow,
  OP10M_A11_ReliefEquityGapRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function tensionBand(score: number): OP10M_A11_NetworkEquityTensionBand {
  if (score < 21) return 'balanced';
  if (score < 39) return 'stressed';
  if (score < 57) return 'polarized';
  return 'fractured';
}

export function op10mA11ComputeInterregionalNetworkEquityTension(args: {
  networkResilienceErosion: OP10M_A11_NetworkErosionRow[];
  reliefEquityGap: OP10M_A11_ReliefEquityGapRow[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
}): { rows: OP10M_A11_NetworkEquityTensionRow[]; nationalIndex: number } {
  const erosionByRegion = new Map(args.networkResilienceErosion.map((n) => [n.regionId, n]));
  const reliefByRegion = new Map(args.reliefEquityGap.map((r) => [r.regionId, r]));
  const driftByRegion = new Map(args.corridorEquityDrift.map((d) => [d.regionId, d]));

  const rows: OP10M_A11_NetworkEquityTensionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const erosion = erosionByRegion.get(rid);
    const relief = reliefByRegion.get(rid);
    const drift = driftByRegion.get(rid);

    const networkDrag = erosion ? op10mA11Clamp(erosion.erosionScore * 0.44) : 13;
    const reliefDrag = relief ? op10mA11Clamp(relief.gapScore * 0.38) : 11;
    const corridorDrag = drift ? op10mA11Clamp(drift.driftScore * 0.36) : 10;

    const tensionScore = op10mA11Clamp(networkDrag + reliefDrag + corridorDrag * 0.58);
    weighted += tensionScore;

    const drivers: string[] = [];
    if (erosion && (erosion.band === 'eroding' || erosion.band === 'fracturing')) drivers.push('network erosion');
    if (relief && (relief.band === 'skewed' || relief.band === 'polarized')) drivers.push('relief inequity');
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) drivers.push('corridor drift');
    if (!drivers.length) drivers.push('network equity stable');

    rows.push({
      regionId: rid,
      tensionScore: op10mA11Round(tensionScore),
      band: tensionBand(tensionScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} network equity tension ${tensionBand(tensionScore)} (${op10mA11Round(tensionScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.tensionScore - a.tensionScore), nationalIndex };
}

export function op10mA11RegionsWithNetworkEquityFracture(
  rows: OP10M_A11_NetworkEquityTensionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'polarized' || r.band === 'fractured').map((r) => r.regionId);
}

export function op10mA11NetworkEquityTensionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 45;
  return currentIndex >= 39 && currentIndex > priorIndex + 5;
}
