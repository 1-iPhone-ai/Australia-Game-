import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_GovernanceFrictionRow,
  OP10M_A11_RegionId,
  OP10M_A11_ReliefOverheadBand,
  OP10M_A11_ReliefOverheadRow,
  OP10M_A11_ReliefPlaybookItem,
  OP10M_A11_ReceptionStrainRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function overheadBand(score: number): OP10M_A11_ReliefOverheadBand {
  if (score < 21) return 'lean';
  if (score < 39) return 'elevated';
  if (score < 57) return 'overloaded';
  return 'paralytic';
}

const priorityWeight: Record<OP10M_A11_ReliefPlaybookItem['priority'], number> = {
  low: 4,
  medium: 10,
  high: 18,
  urgent: 28,
};

export function op10mA11ComputeRegionalReliefCoordinationOverhead(args: {
  reliefPlaybook: OP10M_A11_ReliefPlaybookItem[];
  governanceFriction: OP10M_A11_GovernanceFrictionRow[];
  receptionStrain: OP10M_A11_ReceptionStrainRow[];
}): { rows: OP10M_A11_ReliefOverheadRow[]; nationalIndex: number } {
  const governanceByRegion = new Map(args.governanceFriction.map((g) => [g.regionId, g]));
  const receptionByRegion = new Map(args.receptionStrain.map((r) => [r.regionId, r]));

  const reliefLoadByRegion = new Map<OP10M_A11_RegionId, number>();
  for (const item of args.reliefPlaybook) {
    const prev = reliefLoadByRegion.get(item.regionId) ?? 0;
    reliefLoadByRegion.set(item.regionId, prev + priorityWeight[item.priority]);
  }

  const rows: OP10M_A11_ReliefOverheadRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const governance = governanceByRegion.get(rid);
    const reception = receptionByRegion.get(rid);
    const reliefLoad = reliefLoadByRegion.get(rid) ?? 8;

    const queueDrag = op10mA11Clamp(reliefLoad * 0.72);
    const coordinationDrag = governance ? op10mA11Clamp(governance.frictionScore * 0.38) : 12;
    const intakeDrag = reception ? op10mA11Clamp(reception.strainScore * 0.34) : 10;

    const overheadScore = op10mA11Clamp(queueDrag + coordinationDrag + intakeDrag * 0.55);
    weighted += overheadScore;

    const stressors: string[] = [];
    if (reliefLoad >= 26) stressors.push('relief queue depth');
    if (governance && (governance.band === 'fragmented' || governance.band === 'breakdown')) {
      stressors.push('coordination friction');
    }
    if (reception && (reception.band === 'strained' || reception.band === 'saturated')) {
      stressors.push('intake saturation');
    }
    if (!stressors.length) stressors.push('routine relief cadence');

    rows.push({
      regionId: rid,
      overheadScore: op10mA11Round(overheadScore),
      band: overheadBand(overheadScore),
      stressors: stressors.slice(0, 3),
      narrative: `${rid} relief coordination ${overheadBand(overheadScore)} (${op10mA11Round(overheadScore)}); ${stressors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.overheadScore - a.overheadScore), nationalIndex };
}

export function op10mA11RegionsWithReliefOverheadCritical(
  rows: OP10M_A11_ReliefOverheadRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'overloaded' || r.band === 'paralytic').map((r) => r.regionId);
}

export function op10mA11ReliefOverheadEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}
