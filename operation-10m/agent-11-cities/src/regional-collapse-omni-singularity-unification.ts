import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CollapseOmniSingularityIntegrationRow,
  OP10M_A11_CollapseOmniSingularityUnificationBand,
  OP10M_A11_CollapseOmniSingularityUnificationRow,
  OP10M_A11_ExistentialAbsoluteNullityContinuityRow,
  OP10M_A11_RegionId,
  OP10M_A11_VoidTotalErosionEradicationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function unificationBand(score: number): OP10M_A11_CollapseOmniSingularityUnificationBand {
  if (score < 22) return 'dormant';
  if (score < 38) return 'aligning';
  if (score < 55) return 'total';
  return 'unification';
}

export function op10mA11ComputeRegionalCollapseOmniSingularityUnification(args: {
  collapseOmniSingularityIntegration: OP10M_A11_CollapseOmniSingularityIntegrationRow[];
  voidTotalErosionEradication: OP10M_A11_VoidTotalErosionEradicationRow[];
  existentialAbsoluteNullityContinuity: OP10M_A11_ExistentialAbsoluteNullityContinuityRow[];
}): { rows: OP10M_A11_CollapseOmniSingularityUnificationRow[]; nationalIndex: number } {
  const integrationByRegion = new Map(args.collapseOmniSingularityIntegration.map((i) => [i.regionId, i]));
  const eradicationByRegion = new Map(args.voidTotalErosionEradication.map((e) => [e.regionId, e]));
  const continuityByRegion = new Map(args.existentialAbsoluteNullityContinuity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CollapseOmniSingularityUnificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const integration = integrationByRegion.get(rid);
    const eradication = eradicationByRegion.get(rid);
    const continuity = continuityByRegion.get(rid);

    const integrationDrag = integration ? op10mA11Clamp(integration.integrationScore * 0.55) : 19;
    const eradicationDrag = eradication ? op10mA11Clamp(eradication.eradicationScore * 0.51) : 17;
    const continuityDrag = continuity ? op10mA11Clamp(continuity.continuityScore * 0.48) : 16;

    const unificationScore = op10mA11Clamp(integrationDrag + eradicationDrag + continuityDrag * 0.59);
    weighted += unificationScore;

    const vectors: string[] = [];
    if (integration && (integration.band === 'total' || integration.band === 'integration')) {
      vectors.push('integration unify');
    }
    if (eradication && (eradication.band === 'total' || eradication.band === 'complete_eradication')) {
      vectors.push('eradication unify');
    }
    if (continuity && (continuity.band === 'absolute' || continuity.band === 'total_continuity')) {
      vectors.push('continuity unify');
    }
    if (!vectors.length) vectors.push('unification dormant');

    rows.push({
      regionId: rid,
      unificationScore: op10mA11Round(unificationScore),
      band: unificationBand(unificationScore),
      vectors: vectors.slice(0, 3),
      narrative: `${rid} collapse omni singularity unification ${unificationBand(unificationScore)} (${op10mA11Round(unificationScore)}); ${vectors.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.unificationScore - a.unificationScore), nationalIndex };
}

export function op10mA11RegionsWithCollapseSingularityUnification(
  rows: OP10M_A11_CollapseOmniSingularityUnificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'total' || r.band === 'unification').map((r) => r.regionId);
}

export function op10mA11CollapseOmniSingularityUnificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
