import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CorridorEquityDriftRow,
  OP10M_A11_InfrastructureBacklogRow,
  OP10M_A11_LinkageHubProfile,
  OP10M_A11_NetworkErosionBand,
  OP10M_A11_NetworkErosionRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function erosionBand(score: number): OP10M_A11_NetworkErosionBand {
  if (score < 21) return 'robust';
  if (score < 39) return 'thinning';
  if (score < 57) return 'eroding';
  return 'fracturing';
}

export function op10mA11ComputeInterregionalNetworkResilienceErosion(args: {
  linkageHubs: OP10M_A11_LinkageHubProfile[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
  infrastructureBacklog: OP10M_A11_InfrastructureBacklogRow[];
  fragilityIndex: number;
}): { rows: OP10M_A11_NetworkErosionRow[]; nationalIndex: number } {
  const driftByRegion = new Map(args.corridorEquityDrift.map((d) => [d.regionId, d]));
  const backlogByRegion = new Map(args.infrastructureBacklog.map((b) => [b.regionId, b]));
  const hubByRegion = new Map(args.linkageHubs.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_NetworkErosionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const hub = hubByRegion.get(rid);
    const drift = driftByRegion.get(rid);
    const backlog = backlogByRegion.get(rid);

    const isolationDrag = hub
      ? op10mA11Clamp(hub.isolationScore * 0.46 + (hub.role === 'peripheral' ? 12 : 0))
      : 14;
    const equityDrag = drift ? op10mA11Clamp(drift.driftScore * 0.4) : 11;
    const infraDrag = backlog ? op10mA11Clamp(backlog.backlogScore * 0.34) : 10;
    const nationalDrag = op10mA11Clamp(args.fragilityIndex * 0.12);

    const erosionScore = op10mA11Clamp(isolationDrag + equityDrag + infraDrag + nationalDrag * 0.45);
    weighted += erosionScore;

    const signals: string[] = [];
    if (hub && (hub.role === 'peripheral' || hub.isolationScore >= 50)) signals.push('hub isolation');
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) signals.push('corridor inequity');
    if (backlog && (backlog.band === 'severe' || backlog.band === 'critical')) signals.push('network backlog');
    if (!signals.length) signals.push('linkage resilience holding');

    rows.push({
      regionId: rid,
      erosionScore: op10mA11Round(erosionScore),
      band: erosionBand(erosionScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} network resilience ${erosionBand(erosionScore)} (${op10mA11Round(erosionScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.erosionScore - a.erosionScore), nationalIndex };
}

export function op10mA11RegionsWithNetworkFracture(rows: OP10M_A11_NetworkErosionRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'eroding' || r.band === 'fracturing').map((r) => r.regionId);
}

export function op10mA11NetworkErosionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}
