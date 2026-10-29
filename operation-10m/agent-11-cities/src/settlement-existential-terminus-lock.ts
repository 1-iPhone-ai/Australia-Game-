import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_ExistentialContinuityFractureRow,
  OP10M_A11_ExistentialTerminusLockBand,
  OP10M_A11_ExistentialTerminusLockRow,
  OP10M_A11_PermanentDepopulationLockRow,
  OP10M_A11_RegionId,
  OP10M_A11_TotalCollapseSingularityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function terminusBand(score: number): OP10M_A11_ExistentialTerminusLockBand {
  if (score < 26) return 'open';
  if (score < 43) return 'closing';
  if (score < 60) return 'sealed';
  return 'terminal';
}

export function op10mA11ComputeSettlementExistentialTerminusLock(args: {
  existentialContinuityFracture: OP10M_A11_ExistentialContinuityFractureRow[];
  totalCollapseSingularity: OP10M_A11_TotalCollapseSingularityRow[];
  permanentDepopulationLock: OP10M_A11_PermanentDepopulationLockRow[];
}): { rows: OP10M_A11_ExistentialTerminusLockRow[]; nationalIndex: number } {
  const fractureByRegion = new Map(args.existentialContinuityFracture.map((e) => [e.regionId, e]));
  const singularityByRegion = new Map(args.totalCollapseSingularity.map((s) => [s.regionId, s]));
  const lockByRegion = new Map(args.permanentDepopulationLock.map((p) => [p.regionId, p]));

  const rows: OP10M_A11_ExistentialTerminusLockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const fracture = fractureByRegion.get(rid);
    const singularity = singularityByRegion.get(rid);
    const lock = lockByRegion.get(rid);

    const fractureDrag = fracture ? op10mA11Clamp(fracture.fractureScore * 0.46) : 14;
    const singularityDrag = singularity ? op10mA11Clamp(singularity.singularityScore * 0.41) : 12;
    const lockDrag = lock ? op10mA11Clamp(lock.lockScore * 0.38) : 10;

    const terminusScore = op10mA11Clamp(fractureDrag + singularityDrag + lockDrag * 0.5);
    weighted += terminusScore;

    const seals: string[] = [];
    if (fracture && (fracture.band === 'shattered' || fracture.band === 'extinguished')) {
      seals.push('continuity sealed');
    }
    if (singularity && (singularity.band === 'singular' || singularity.band === 'total')) {
      seals.push('singularity terminus');
    }
    if (lock && (lock.band === 'locked' || lock.band === 'permanent')) {
      seals.push('depopulation seal');
    }
    if (!seals.length) seals.push('terminus open');

    rows.push({
      regionId: rid,
      terminusScore: op10mA11Round(terminusScore),
      band: terminusBand(terminusScore),
      seals: seals.slice(0, 3),
      narrative: `${rid} existential terminus lock ${terminusBand(terminusScore)} (${op10mA11Round(terminusScore)}); ${seals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.terminusScore - a.terminusScore), nationalIndex };
}

export function op10mA11RegionsWithTerminalExistentialLock(
  rows: OP10M_A11_ExistentialTerminusLockRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'sealed' || r.band === 'terminal').map((r) => r.regionId);
}

export function op10mA11ExistentialTerminusLockEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
