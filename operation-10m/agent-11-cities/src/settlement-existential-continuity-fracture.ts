import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_ExistentialContinuityFractureBand,
  OP10M_A11_ExistentialContinuityFractureRow,
  OP10M_A11_PermanentDepopulationLockRow,
  OP10M_A11_PostCollapseRecoveryImpossibilityRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementLegitimacyCollapseRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function fractureBand(score: number): OP10M_A11_ExistentialContinuityFractureBand {
  if (score < 27) return 'intact';
  if (score < 45) return 'fraying';
  if (score < 62) return 'shattered';
  return 'extinguished';
}

export function op10mA11ComputeSettlementExistentialContinuityFracture(args: {
  permanentDepopulationLock: OP10M_A11_PermanentDepopulationLockRow[];
  postCollapseRecoveryImpossibility: OP10M_A11_PostCollapseRecoveryImpossibilityRow[];
  settlementLegitimacyCollapse: OP10M_A11_SettlementLegitimacyCollapseRow[];
}): { rows: OP10M_A11_ExistentialContinuityFractureRow[]; nationalIndex: number } {
  const lockByRegion = new Map(args.permanentDepopulationLock.map((p) => [p.regionId, p]));
  const recoveryByRegion = new Map(args.postCollapseRecoveryImpossibility.map((r) => [r.regionId, r]));
  const legitimacyByRegion = new Map(args.settlementLegitimacyCollapse.map((l) => [l.regionId, l]));

  const rows: OP10M_A11_ExistentialContinuityFractureRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lock = lockByRegion.get(rid);
    const recovery = recoveryByRegion.get(rid);
    const legitimacy = legitimacyByRegion.get(rid);

    const lockDrag = lock ? op10mA11Clamp(lock.lockScore * 0.45) : 14;
    const recoveryDrag = recovery ? op10mA11Clamp(recovery.impossibilityScore * 0.42) : 12;
    const legitimacyDrag = legitimacy ? op10mA11Clamp(legitimacy.collapseScore * 0.35) : 10;

    const fractureScore = op10mA11Clamp(lockDrag + recoveryDrag + legitimacyDrag * 0.47);
    weighted += fractureScore;

    const ruptures: string[] = [];
    if (lock && (lock.band === 'locked' || lock.band === 'permanent')) {
      ruptures.push('population continuity break');
    }
    if (recovery && (recovery.band === 'blocked' || recovery.band === 'impossible')) {
      ruptures.push('recovery path severed');
    }
    if (legitimacy && (legitimacy.band === 'delegitimized' || legitimacy.band === 'collapsed')) {
      ruptures.push('legitimacy void');
    }
    if (!ruptures.length) ruptures.push('continuity preserved');

    rows.push({
      regionId: rid,
      fractureScore: op10mA11Round(fractureScore),
      band: fractureBand(fractureScore),
      ruptures: ruptures.slice(0, 3),
      narrative: `${rid} existential continuity fracture ${fractureBand(fractureScore)} (${op10mA11Round(fractureScore)}); ${ruptures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fractureScore - a.fractureScore), nationalIndex };
}

export function op10mA11RegionsWithExtinguishedContinuity(
  rows: OP10M_A11_ExistentialContinuityFractureRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'shattered' || r.band === 'extinguished').map((r) => r.regionId);
}

export function op10mA11ExistentialContinuityFractureEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 56;
  return currentIndex >= 50 && currentIndex > priorIndex + 6;
}
