import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityConvergenceBand,
  OP10M_A11_CollapseOmniSingularityConvergenceRow,
  OP10M_A11_CollapseOmniSingularitySynthesisRow,
  OP10M_A11_ExistentialAbsoluteNullityMandateRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionAnnihilationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function convergenceBand(score: number): OP10M_A11_CollapseOmniSingularityConvergenceBand {
  if (score < 22) return 'dormant';
  if (score < 38) return 'aligning';
  if (score < 55) return 'total';
  return 'convergence';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityConvergence(args: {
  collapseOmniSingularitySynthesis: OP10M_A11_CollapseOmniSingularitySynthesisRow[];
  voidTotalErosionAnnihilation: OP10M_A11_VoidTotalErosionAnnihilationRow[];
  existentialAbsoluteNullityMandate: OP10M_A11_ExistentialAbsoluteNullityMandateRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityConvergenceRow[]; nationalIndex: number } {
  const synthesisByRegion = new Map(args.collapseOmniSingularitySynthesis.map((s) => [s.regionId, s]));
  const annihilationByRegion = new Map(args.voidTotalErosionAnnihilation.map((a) => [a.regionId, a]));
  const mandateByRegion = new Map(args.existentialAbsoluteNullityMandate.map((m) => [m.regionId, m]));

  const rows: OP10M_A11_CollapseOmniSingularityConvergenceRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const synthesis = synthesisByRegion.get(rid);
    const annihilation = annihilationByRegion.get(rid);
    const mandate = mandateByRegion.get(rid);

    const synthesisDrag = synthesis ? op10mA11Clamp(synthesis.synthesisScore * 0.57) : 19;
    const annihilationDrag = annihilation ? op10mA11Clamp(annihilation.annihilationScore * 0.53) : 17;
    const mandateDrag = mandate ? op10mA11Clamp(mandate.mandateScore * 0.5) : 16;

    const convergenceScore = op10mA11Clamp(synthesisDrag + annihilationDrag + mandateDrag * 0.61);
    weighted += convergenceScore;

    const vectors: string[] = [];
    if (synthesis && (synthesis.band === 'total' || synthesis.band === 'synthesis')) {
      vectors.push('synthesis converge');
    }
    if (annihilation && (annihilation.band === 'total' || annihilation.band === 'complete_annihilation')) {
      vectors.push('annihilation converge');
    }
    if (mandate && (mandate.band === 'absolute' || mandate.band === 'total_mandate')) {
      vectors.push('mandate converge');
    }
    if (!vectors.length) vectors.push('convergence dormant');

    rows.push({
      regionId: rid,
      convergenceScore: op10mA11Round(convergenceScore),
      band: convergenceBand(convergenceScore),
      vectors: vectors.slice(0, 3),
      narrative: `${rid} collapse omni singularity convergence ${convergenceBand(convergenceScore)} (${op10mA11Round(convergenceScore)}); ${vectors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.convergenceScore - a.convergenceScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityConvergence(
  rows: OP10M_A11_CollapseOmniSingularityConvergenceRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'convergence').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityConvergenceEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
