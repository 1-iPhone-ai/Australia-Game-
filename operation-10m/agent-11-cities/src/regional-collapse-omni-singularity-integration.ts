import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityConvergenceRow,
  OP10M_A11_CollapseOmniSingularityIntegrationBand,
  OP10M_A11_CollapseOmniSingularityIntegrationRow,
  OP10M_A11_ExistentialAbsoluteNullityBindingRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionObliterationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function integrationBand(score: number): OP10M_A11_CollapseOmniSingularityIntegrationBand {
  if (score < 22) return 'dormant';
  if (score < 38) return 'aligning';
  if (score < 55) return 'total';
  return 'integration';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityIntegration(args: {
  collapseOmniSingularityConvergence: OP10M_A11_CollapseOmniSingularityConvergenceRow[];
  voidTotalErosionObliteration: OP10M_A11_VoidTotalErosionObliterationRow[];
  existentialAbsoluteNullityBinding: OP10M_A11_ExistentialAbsoluteNullityBindingRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityIntegrationRow[]; nationalIndex: number } {
  const convergenceByRegion = new Map(args.collapseOmniSingularityConvergence.map((c) => [c.regionId, c]));
  const obliterationByRegion = new Map(args.voidTotalErosionObliteration.map((o) => [o.regionId, o]));
  const bindingByRegion = new Map(args.existentialAbsoluteNullityBinding.map((b) => [b.regionId, b]));

  const rows: OP10M_A11_CollapseOmniSingularityIntegrationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const convergence = convergenceByRegion.get(rid);
    const obliteration = obliterationByRegion.get(rid);
    const binding = bindingByRegion.get(rid);

    const convergenceDrag = convergence ? op10mA11Clamp(convergence.convergenceScore * 0.56) : 19;
    const obliterationDrag = obliteration ? op10mA11Clamp(obliteration.obliterationScore * 0.52) : 17;
    const bindingDrag = binding ? op10mA11Clamp(binding.bindingScore * 0.49) : 16;

    const integrationScore = op10mA11Clamp(convergenceDrag + obliterationDrag + bindingDrag * 0.6);
    weighted += integrationScore;

    const vectors: string[] = [];
    if (convergence && (convergence.band === 'total' || convergence.band === 'convergence')) {
      vectors.push('convergence integrate');
    }
    if (obliteration && (obliteration.band === 'total' || obliteration.band === 'complete_obliteration')) {
      vectors.push('obliteration integrate');
    }
    if (binding && (binding.band === 'absolute' || binding.band === 'total_binding')) {
      vectors.push('binding integrate');
    }
    if (!vectors.length) vectors.push('integration dormant');

    rows.push({
      regionId: rid,
      integrationScore: op10mA11Round(integrationScore),
      band: integrationBand(integrationScore),
      vectors: vectors.slice(0, 3),
      narrative: `${rid} collapse omni singularity integration ${integrationBand(integrationScore)} (${op10mA11Round(integrationScore)}); ${vectors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.integrationScore - a.integrationScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityIntegration(
  rows: OP10M_A11_CollapseOmniSingularityIntegrationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'integration').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityIntegrationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
