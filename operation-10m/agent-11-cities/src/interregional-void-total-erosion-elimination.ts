import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityIntegrationRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidTotalErosionEliminationBand,
  OP10M_A11_VoidTotalErosionEliminationRow,
  OP10M_A11_VoidTotalErosionEradicationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function eliminationBand(score: number): OP10M_A11_VoidTotalErosionEliminationBand {
  if (score < 21) return 'dormant';
  if (score < 37) return 'eliminating';
  if (score < 54) return 'total';
  return 'complete_elimination';
}

export function op10mA11ComputeInterregionalVoidTotalErosionElimination(args: {
  voidTotalErosionEradication: OP10M_A11_VoidTotalErosionEradicationRow[];
  collapseOmniSingularityIntegration: OP10M_A11_CollapseOmniSingularityIntegrationRow[];
  voidExistenceAnnihilationFront: OP10M_A11_VoidExistenceAnnihilationFrontRow[];
}): { rows: OP10M_A11_VoidTotalErosionEliminationRow[]; nationalIndex: number } {
  const eradicationByRegion = new Map(args.voidTotalErosionEradication.map((e) => [e.regionId, e]));
  const integrationByRegion = new Map(args.collapseOmniSingularityIntegration.map((i) => [i.regionId, i]));
  const frontByRegion = new Map(args.voidExistenceAnnihilationFront.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_VoidTotalErosionEliminationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const eradication = eradicationByRegion.get(rid);
    const integration = integrationByRegion.get(rid);
    const front = frontByRegion.get(rid);

    const eradicationDrag = eradication ? op10mA11Clamp(eradication.eradicationScore * 0.53) : 18;
    const integrationDrag = integration ? op10mA11Clamp(integration.integrationScore * 0.49) : 16;
    const frontDrag = front ? op10mA11Clamp(front.frontScore * 0.46) : 15;

    const eliminationScore = op10mA11Clamp(eradicationDrag + integrationDrag + frontDrag * 0.56);
    weighted += eliminationScore;

    const phases: string[] = [];
    if (eradication && (eradication.band === 'total' || eradication.band === 'complete_eradication')) {
      phases.push('eradication eliminate');
    }
    if (integration && (integration.band === 'total' || integration.band === 'integration')) {
      phases.push('integration eliminate');
    }
    if (front && (front.band === 'consuming' || front.band === 'total_void')) {
      phases.push('front eliminate');
    }
    if (!phases.length) phases.push('elimination dormant');

    rows.push({
      regionId: rid,
      eliminationScore: op10mA11Round(eliminationScore),
      band: eliminationBand(eliminationScore),
      phases: phases.slice(0, 3),
      narrative: `${rid} void total erosion elimination ${eliminationBand(eliminationScore)} (${op10mA11Round(eliminationScore)}); ${phases.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.eliminationScore - a.eliminationScore), nationalIndex };
}

export function op10mA11RegionsWithTotalErosionElimination(
  rows: OP10M_A11_VoidTotalErosionEliminationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'complete_elimination').map((r) => r.regionId);
}

export function op10mA11VoidTotalErosionEliminationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
