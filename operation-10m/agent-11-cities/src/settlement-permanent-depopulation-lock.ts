import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_PermanentDepopulationLockBand,
  OP10M_A11_PermanentDepopulationLockRow,
  OP10M_A11_PostCollapseRecoveryImpossibilityRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementAbandonmentSpiralRow,
  OP10M_A11_TerminalStateLockInRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function lockBand(score: number): OP10M_A11_PermanentDepopulationLockBand {
  if (score < 27) return 'fluid';
  if (score < 45) return 'sticky';
  if (score < 62) return 'locked';
  return 'permanent';
}

export function op10mA11ComputeSettlementPermanentDepopulationLock(args: {
  postCollapseRecoveryImpossibility: OP10M_A11_PostCollapseRecoveryImpossibilityRow[];
  settlementAbandonmentSpiral: OP10M_A11_SettlementAbandonmentSpiralRow[];
  terminalStateLockIn: OP10M_A11_TerminalStateLockInRow[];
}): { rows: OP10M_A11_PermanentDepopulationLockRow[]; nationalIndex: number } {
  const recoveryByRegion = new Map(args.postCollapseRecoveryImpossibility.map((p) => [p.regionId, p]));
  const spiralByRegion = new Map(args.settlementAbandonmentSpiral.map((s) => [s.regionId, s]));
  const lockInByRegion = new Map(args.terminalStateLockIn.map((t) => [t.regionId, t]));

  const rows: OP10M_A11_PermanentDepopulationLockRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const recovery = recoveryByRegion.get(rid);
    const spiral = spiralByRegion.get(rid);
    const lockIn = lockInByRegion.get(rid);

    const recoveryDrag = recovery ? op10mA11Clamp(recovery.impossibilityScore * 0.45) : 14;
    const spiralDrag = spiral ? op10mA11Clamp(spiral.spiralScore * 0.43) : 12;
    const lockInDrag = lockIn ? op10mA11Clamp(lockIn.lockInScore * 0.36) : 10;

    const lockScore = op10mA11Clamp(recoveryDrag + spiralDrag + lockInDrag * 0.48);
    weighted += lockScore;

    const markers: string[] = [];
    if (recovery && (recovery.band === 'blocked' || recovery.band === 'impossible')) {
      markers.push('recovery sealed');
    }
    if (spiral && (spiral.band === 'exodus' || spiral.band === 'abandoned')) {
      markers.push('outflow locked');
    }
    if (lockIn && (lockIn.band === 'locked' || lockIn.band === 'terminal')) {
      markers.push('terminal depopulation');
    }
    if (!markers.length) markers.push('population mobility');

    rows.push({
      regionId: rid,
      lockScore: op10mA11Round(lockScore),
      band: lockBand(lockScore),
      markers: markers.slice(0, 3),
      narrative: `${rid} permanent depopulation lock ${lockBand(lockScore)} (${op10mA11Round(lockScore)}); ${markers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.lockScore - a.lockScore), nationalIndex };
}

export function op10mA11RegionsWithPermanentDepopulationLock(
  rows: OP10M_A11_PermanentDepopulationLockRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'locked' || r.band === 'permanent').map((r) => r.regionId);
}

export function op10mA11PermanentDepopulationLockEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 55;
  return currentIndex >= 49 && currentIndex > priorIndex + 6;
}
