import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CommuteWedgeRow,
  OP10M_A11_CorridorEquityDriftBand,
  OP10M_A11_CorridorEquityDriftRow,
  OP10M_A11_CorridorFlowRow,
  OP10M_A11_RegionId,
  OP10M_A11_ServiceEquityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function driftBand(score: number): OP10M_A11_CorridorEquityDriftBand {
  if (score < 22) return 'aligned';
  if (score < 40) return 'drifting';
  if (score < 58) return 'polarized';
  return 'fractured';
}

export function op10mA11ComputeInterregionalCorridorEquityDrift(args: {
  corridorFlows: OP10M_A11_CorridorFlowRow[];
  serviceEquity: OP10M_A11_ServiceEquityRow[];
  commuteWedge: OP10M_A11_CommuteWedgeRow[];
}): { rows: OP10M_A11_CorridorEquityDriftRow[]; nationalIndex: number } {
  const equityByRegion = new Map(args.serviceEquity.map((s) => [s.regionId, s]));
  const wedgeByRegion = new Map(args.commuteWedge.map((c) => [c.regionId, c]));

  const corridorLoad = new Map<OP10M_A11_RegionId, number>();
  for (const flow of args.corridorFlows) {
    for (const rid of [flow.fromRegion, flow.toRegion] as OP10M_A11_RegionId[]) {
      const prev = corridorLoad.get(rid) ?? 0;
      corridorLoad.set(rid, Math.max(prev, flow.flowPressure));
    }
  }

  const rows: OP10M_A11_CorridorEquityDriftRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const equity = equityByRegion.get(rid);
    const wedge = wedgeByRegion.get(rid);
    const load = corridorLoad.get(rid) ?? 20;

    const equityDrag = equity
      ? op10mA11Clamp((100 - equity.equityScore) * 0.42 + (equity.band === 'critical_gap' ? 8 : 0))
      : 14;
    const commuteDrag = wedge ? op10mA11Clamp(wedge.wedgeScore * 0.36) : 11;
    const corridorDrag = op10mA11Clamp(load * 0.44);

    const driftScore = op10mA11Clamp(equityDrag + commuteDrag + corridorDrag * 0.58);
    weighted += driftScore;

    const signals: string[] = [];
    if (equity && (equity.band === 'uneven' || equity.band === 'critical_gap')) signals.push('service equity gap');
    if (wedge && (wedge.band === 'severe' || wedge.band === 'unsustainable')) signals.push('commute wedge');
    if (load >= 56) signals.push('corridor load asymmetry');
    if (!signals.length) signals.push('balanced corridor equity');

    rows.push({
      regionId: rid,
      driftScore: op10mA11Round(driftScore),
      band: driftBand(driftScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} corridor equity ${driftBand(driftScore)} (${op10mA11Round(driftScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.driftScore - a.driftScore), nationalIndex };
}

export function op10mA11RegionsWithCorridorEquityFracture(
  rows: OP10M_A11_CorridorEquityDriftRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'polarized' || r.band === 'fractured').map((r) => r.regionId);
}

export function op10mA11CorridorEquityDriftEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 47;
  return currentIndex >= 41 && currentIndex > priorIndex + 5;
}
