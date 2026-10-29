import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityCoalescenceBand,
  OP10M_A11_CollapseOmniSingularityCoalescenceRow,
  OP10M_A11_CollapseOmniSingularityConsolidationRow,
  OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionDissolutionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function coalescenceBand(score: number): OP10M_A11_CollapseOmniSingularityCoalescenceBand {
  if (score < 24) return 'latent';
  if (score < 40) return 'aligning';
  if (score < 57) return 'total';
  return 'coalescence';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityCoalescence(args: {
  collapseOmniSingularityConsolidation: OP10M_A11_CollapseOmniSingularityConsolidationRow[];
  voidTotalErosionDissolution: OP10M_A11_VoidTotalErosionDissolutionRow[];
  existentialAbsoluteNullityImmutability: OP10M_A11_ExistentialAbsoluteNullityImmutabilityRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityCoalescenceRow[]; nationalIndex: number } {
  const consolidationByRegion = new Map(args.collapseOmniSingularityConsolidation.map((c) => [c.regionId, c]));
  const dissolutionByRegion = new Map(args.voidTotalErosionDissolution.map((d) => [d.regionId, d]));
  const immutabilityByRegion = new Map(args.existentialAbsoluteNullityImmutability.map((i) => [i.regionId, i]));

  const rows: OP10M_A11_CollapseOmniSingularityCoalescenceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const consolidation = consolidationByRegion.get(rid);
    const dissolution = dissolutionByRegion.get(rid);
    const immutability = immutabilityByRegion.get(rid);

    const consolidationDrag = consolidation ? op10mA11Clamp(consolidation.consolidationScore * 0.53) : 19;
    const dissolutionDrag = dissolution ? op10mA11Clamp(dissolution.dissolutionScore * 0.49) : 17;
    const immutabilityDrag = immutability ? op10mA11Clamp(immutability.immutabilityScore * 0.46) : 16;

    const coalescenceScore = op10mA11Clamp(consolidationDrag + dissolutionDrag + immutabilityDrag * 0.57);
    weighted += coalescenceScore;

    const marks: string[] = [];
    if (consolidation && (consolidation.band === 'total' || consolidation.band === 'consolidation')) {
      marks.push('consolidation coalesce');
    }
    if (dissolution && (dissolution.band === 'total' || dissolution.band === 'complete_dissolution')) {
      marks.push('dissolution coalesce');
    }
    if (immutability && (immutability.band === 'absolute' || immutability.band === 'total_immutability')) {
      marks.push('immutability coalesce');
    }
    if (!marks.length) marks.push('coalescence latent');

    rows.push({
      regionId: rid,
      coalescenceScore: op10mA11Round(coalescenceScore),
      band: coalescenceBand(coalescenceScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} collapse omni singularity coalescence ${coalescenceBand(coalescenceScore)} (${op10mA11Round(coalescenceScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.coalescenceScore - a.coalescenceScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityCoalescence(
  rows: OP10M_A11_CollapseOmniSingularityCoalescenceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'coalescence').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityCoalescenceEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 56;
  return currentIndex >= 50 && currentIndex > priorIndex + 6;
}
