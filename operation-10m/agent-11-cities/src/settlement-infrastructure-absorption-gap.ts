import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsorptionGapBand,
  OP10M_A11_AbsorptionGapRow,
  OP10M_A11_AbsorptionStressRow,
  OP10M_A11_InfrastructureBacklogRow,
  OP10M_A11_ReceptionStrainRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function gapBand(score: number): OP10M_A11_AbsorptionGapBand {
  if (score < 22) return 'aligned';
  if (score < 40) return 'widening';
  if (score < 58) return 'critical';
  return 'rupture';
}

export function op10mA11ComputeSettlementInfrastructureAbsorptionGap(args: {
  infrastructureBacklog: OP10M_A11_InfrastructureBacklogRow[];
  receptionStrain: OP10M_A11_ReceptionStrainRow[];
  absorptionStress: OP10M_A11_AbsorptionStressRow[];
}): { rows: OP10M_A11_AbsorptionGapRow[]; nationalIndex: number } {
  const backlogByRegion = new Map(args.infrastructureBacklog.map((b) => [b.regionId, b]));
  const receptionByRegion = new Map(args.receptionStrain.map((r) => [r.regionId, r]));
  const absorptionByRegion = new Map(args.absorptionStress.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_AbsorptionGapRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const backlog = backlogByRegion.get(rid);
    const reception = receptionByRegion.get(rid);
    const absorption = absorptionByRegion.get(rid);

    const backlogDrag = backlog ? op10mA11Clamp(backlog.backlogScore * 0.48) : 14;
    const inflowDrag = reception ? op10mA11Clamp(reception.strainScore * 0.44) : 12;
    const capacityDrag = absorption ? op10mA11Clamp(absorption.stressScore * 0.36) : 10;

    const gapScore = op10mA11Clamp(backlogDrag + inflowDrag + capacityDrag * 0.55);
    weighted += gapScore;

    const gaps: string[] = [];
    if (backlog && (backlog.band === 'severe' || backlog.band === 'critical')) gaps.push('infra backlog');
    if (reception && (reception.band === 'strained' || reception.band === 'saturated')) gaps.push('reception overload');
    if (absorption && (absorption.band === 'strained' || absorption.band === 'breached')) gaps.push('absorption ceiling');
    if (!gaps.length) gaps.push('capacity matched');

    rows.push({
      regionId: rid,
      gapScore: op10mA11Round(gapScore),
      band: gapBand(gapScore),
      gaps: gaps.slice(0, 3),
      narrative: `${rid} infrastructure absorption gap ${gapBand(gapScore)} (${op10mA11Round(gapScore)}); ${gaps.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.gapScore - a.gapScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalAbsorptionGap(rows: OP10M_A11_AbsorptionGapRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'critical' || r.band === 'rupture').map((r) => r.regionId);
}

export function op10mA11AbsorptionGapEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 5;
}
