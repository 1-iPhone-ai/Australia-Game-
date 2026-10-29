import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AbsoluteCollapseHorizonLockRow,
  OP10M_A11_ExistentialObliterationThresholdRow,
  OP10M_A11_RegionId,
  OP10M_A11_UltimateCollapseSingularitySealBand,
  OP10M_A11_UltimateCollapseSingularitySealRow,
  OP10M_A11_VoidFinalizationCascadeRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function sealBand(score: number): OP10M_A11_UltimateCollapseSingularitySealBand {
  if (score < 22) return 'open';
  if (score < 38) return 'closing';
  if (score < 55) return 'sealed';
  return 'ultimate';
}

export function op10mA11ComputeRegionalUltimateCollapseSingularitySeal(args: {
  absoluteCollapseHorizonLock: OP10M_A11_AbsoluteCollapseHorizonLockRow[];
  voidFinalizationCascade: OP10M_A11_VoidFinalizationCascadeRow[];
  existentialObliterationThreshold: OP10M_A11_ExistentialObliterationThresholdRow[];
}): { rows: OP10M_A11_UltimateCollapseSingularitySealRow[]; nationalIndex: number } {
  const lockByRegion = new Map(args.absoluteCollapseHorizonLock.map((a) => [a.regionId, a]));
  const cascadeByRegion = new Map(args.voidFinalizationCascade.map((v) => [v.regionId, v]));
  const thresholdByRegion = new Map(args.existentialObliterationThreshold.map((e) => [e.regionId, e]));

  const rows: OP10M_A11_UltimateCollapseSingularitySealRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lock = lockByRegion.get(rid);
    const cascade = cascadeByRegion.get(rid);
    const threshold = thresholdByRegion.get(rid);

    const lockDrag = lock ? op10mA11Clamp(lock.lockScore * 0.47) : 14;
    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.44) : 12;
    const thresholdDrag = threshold ? op10mA11Clamp(threshold.thresholdScore * 0.41) : 11;

    const sealScore = op10mA11Clamp(lockDrag + cascadeDrag + thresholdDrag * 0.5);
    weighted += sealScore;

    const marks: string[] = [];
    if (lock && (lock.band === 'sealed' || lock.band === 'absolute')) {
      marks.push('horizon absolute');
    }
    if (cascade && (cascade.band === 'finalizing' || cascade.band === 'complete')) {
      marks.push('void finalized');
    }
    if (threshold && (threshold.band === 'breached' || threshold.band === 'obliterated')) {
      marks.push('obliteration breach');
    }
    if (!marks.length) marks.push('seal latent');

    rows.push({
      regionId: rid,
      sealScore: op10mA11Round(sealScore),
      band: sealBand(sealScore),
      marks: marks.slice(0, 3),
      narrative: `${rid} ultimate collapse singularity seal ${sealBand(sealScore)} (${op10mA11Round(sealScore)}); ${marks.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.sealScore - a.sealScore), nationalIndex };
}

export function op10mA11RegionsWithUltimateCollapseSeal(
  rows: OP10M_A11_UltimateCollapseSingularitySealRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'sealed' || r.band === 'ultimate').map((r) => r.regionId);
}

export function op10mA11UltimateCollapseSingularitySealEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
