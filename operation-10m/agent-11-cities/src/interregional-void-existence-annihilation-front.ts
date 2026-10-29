import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_RegionId,
  OP10M_A11_UltimateCollapseSingularitySealRow,
  OP10M_A11_VoidAnnihilationConvergenceRow,
  OP10M_A11_VoidExistenceAnnihilationFrontBand,
  OP10M_A11_VoidExistenceAnnihilationFrontRow,
  OP10M_A11_VoidFinalizationCascadeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function frontBand(score: number): OP10M_A11_VoidExistenceAnnihilationFrontBand {
  if (score < 19) return 'dormant';
  if (score < 35) return 'advancing';
  if (score < 52) return 'consuming';
  return 'total_void';
}

export function op10mA11ComputeInterregionalVoidExistenceAnnihilationFront(args: {
  voidAnnihilationConvergence: OP10M_A11_VoidAnnihilationConvergenceRow[];
  ultimateCollapseSingularitySeal: OP10M_A11_UltimateCollapseSingularitySealRow[];
  voidFinalizationCascade: OP10M_A11_VoidFinalizationCascadeRow[];
}): { rows: OP10M_A11_VoidExistenceAnnihilationFrontRow[]; nationalIndex: number } {
  const annihilationByRegion = new Map(args.voidAnnihilationConvergence.map((v) => [v.regionId, v]));
  const sealByRegion = new Map(args.ultimateCollapseSingularitySeal.map((s) => [s.regionId, s]));
  const cascadeByRegion = new Map(args.voidFinalizationCascade.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_VoidExistenceAnnihilationFrontRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const annihilation = annihilationByRegion.get(rid);
    const seal = sealByRegion.get(rid);
    const cascade = cascadeByRegion.get(rid);

    const annihilationDrag = annihilation ? op10mA11Clamp(annihilation.convergenceScore * 0.5) : 13;
    const sealDrag = seal ? op10mA11Clamp(seal.sealScore * 0.44) : 12;
    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.4) : 10;

    const frontScore = op10mA11Clamp(annihilationDrag + sealDrag + cascadeDrag * 0.5);
    weighted += frontScore;

    const waves: string[] = [];
    if (annihilation && (annihilation.band === 'annihilating' || annihilation.band === 'total')) {
      waves.push('annihilation wave');
    }
    if (seal && (seal.band === 'sealed' || seal.band === 'ultimate')) {
      waves.push('seal compression');
    }
    if (cascade && (cascade.band === 'finalizing' || cascade.band === 'complete')) {
      waves.push('finalization surge');
    }
    if (!waves.length) waves.push('front latent');

    rows.push({
      regionId: rid,
      frontScore: op10mA11Round(frontScore),
      band: frontBand(frontScore),
      waves: waves.slice(0, 3),
      narrative: `${rid} void existence annihilation front ${frontBand(frontScore)} (${op10mA11Round(frontScore)}); ${waves.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.frontScore - a.frontScore), nationalIndex };
}

export function op10mA11RegionsWithTotalVoidExistenceFront(
  rows: OP10M_A11_VoidExistenceAnnihilationFrontRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'consuming' || r.band === 'total_void').map((r) => r.regionId);
}

export function op10mA11VoidExistenceAnnihilationFrontEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
