import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CascadingFailureRiskRow,
  OP10M_A11_FiscalPanicContagionRow,
  OP10M_A11_PostCollapseRecoveryImpossibilityBand,
  OP10M_A11_PostCollapseRecoveryImpossibilityRow,
  OP10M_A11_RegionId,
  OP10M_A11_TerminalStateLockInRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function recoveryBand(score: number): OP10M_A11_PostCollapseRecoveryImpossibilityBand {
  if (score < 27) return 'recoverable';
  if (score < 45) return 'constrained';
  if (score < 62) return 'blocked';
  return 'impossible';
}

export function op10mA11ComputeSettlementPostCollapseRecoveryImpossibility(args: {
  terminalStateLockIn: OP10M_A11_TerminalStateLockInRow[];
  fiscalPanicContagion: OP10M_A11_FiscalPanicContagionRow[];
  cascadingFailureRisk: OP10M_A11_CascadingFailureRiskRow[];
}): { rows: OP10M_A11_PostCollapseRecoveryImpossibilityRow[]; nationalIndex: number } {
  const lockInByRegion = new Map(args.terminalStateLockIn.map((t) => [t.regionId, t]));
  const contagionByRegion = new Map(args.fiscalPanicContagion.map((f) => [f.regionId, f]));
  const cascadeByRegion = new Map(args.cascadingFailureRisk.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_PostCollapseRecoveryImpossibilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lockIn = lockInByRegion.get(rid);
    const contagion = contagionByRegion.get(rid);
    const cascade = cascadeByRegion.get(rid);

    const lockInDrag = lockIn ? op10mA11Clamp(lockIn.lockInScore * 0.46) : 14;
    const contagionDrag = contagion ? op10mA11Clamp(contagion.contagionScore * 0.4) : 12;
    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.36) : 10;

    const impossibilityScore = op10mA11Clamp(lockInDrag + contagionDrag + cascadeDrag * 0.47);
    weighted += impossibilityScore;

    const blockers: string[] = [];
    if (lockIn && (lockIn.band === 'locked' || lockIn.band === 'terminal')) {
      blockers.push('terminal rigidity');
    }
    if (contagion && (contagion.band === 'contagion' || contagion.band === 'systemic')) {
      blockers.push('fiscal contagion');
    }
    if (cascade && (cascade.band === 'cascade_risk' || cascade.band === 'systemic')) {
      blockers.push('cascade persistence');
    }
    if (!blockers.length) blockers.push('recovery pathway');

    rows.push({
      regionId: rid,
      impossibilityScore: op10mA11Round(impossibilityScore),
      band: recoveryBand(impossibilityScore),
      blockers: blockers.slice(0, 3),
      narrative: `${rid} post-collapse recovery impossibility ${recoveryBand(impossibilityScore)} (${op10mA11Round(impossibilityScore)}); ${blockers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.impossibilityScore - a.impossibilityScore), nationalIndex };
}

export function op10mA11RegionsWithImpossibleRecovery(
  rows: OP10M_A11_PostCollapseRecoveryImpossibilityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'blocked' || r.band === 'impossible').map((r) => r.regionId);
}

export function op10mA11PostCollapseRecoveryImpossibilityEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 54;
  return currentIndex >= 48 && currentIndex > priorIndex + 6;
}
