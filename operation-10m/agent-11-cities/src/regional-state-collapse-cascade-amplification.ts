import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_GovernanceVacuumEscalationRow,
  OP10M_A11_PostCollapseRecoveryImpossibilityRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementAbandonmentSpiralRow,
  OP10M_A11_StateCollapseCascadeAmplificationBand,
  OP10M_A11_StateCollapseCascadeAmplificationRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function cascadeBand(score: number): OP10M_A11_StateCollapseCascadeAmplificationBand {
  if (score < 24) return 'damped';
  if (score < 42) return 'amplifying';
  if (score < 59) return 'runaway';
  return 'total';
}

export function op10mA11ComputeRegionalStateCollapseCascadeAmplification(args: {
  governanceVacuumEscalation: OP10M_A11_GovernanceVacuumEscalationRow[];
  settlementAbandonmentSpiral: OP10M_A11_SettlementAbandonmentSpiralRow[];
  postCollapseRecoveryImpossibility: OP10M_A11_PostCollapseRecoveryImpossibilityRow[];
}): { rows: OP10M_A11_StateCollapseCascadeAmplificationRow[]; nationalIndex: number } {
  const vacuumByRegion = new Map(args.governanceVacuumEscalation.map((g) => [g.regionId, g]));
  const spiralByRegion = new Map(args.settlementAbandonmentSpiral.map((s) => [s.regionId, s]));
  const recoveryByRegion = new Map(args.postCollapseRecoveryImpossibility.map((p) => [p.regionId, p]));

  const rows: OP10M_A11_StateCollapseCascadeAmplificationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const vacuum = vacuumByRegion.get(rid);
    const spiral = spiralByRegion.get(rid);
    const recovery = recoveryByRegion.get(rid);

    const vacuumDrag = vacuum ? op10mA11Clamp(vacuum.vacuumScore * 0.42) : 12;
    const spiralDrag = spiral ? op10mA11Clamp(spiral.spiralScore * 0.41) : 11;
    const recoveryDrag = recovery ? op10mA11Clamp(recovery.impossibilityScore * 0.39) : 10;

    const amplificationScore = op10mA11Clamp(vacuumDrag + spiralDrag + recoveryDrag * 0.5);
    weighted += amplificationScore;

    const drivers: string[] = [];
    if (vacuum && (vacuum.band === 'hollow' || vacuum.band === 'vacuum')) {
      drivers.push('governance vacuum');
    }
    if (spiral && (spiral.band === 'exodus' || spiral.band === 'abandoned')) {
      drivers.push('abandonment spiral');
    }
    if (recovery && (recovery.band === 'blocked' || recovery.band === 'impossible')) {
      drivers.push('recovery blocked');
    }
    if (!drivers.length) drivers.push('collapse damping');

    rows.push({
      regionId: rid,
      amplificationScore: op10mA11Round(amplificationScore),
      band: cascadeBand(amplificationScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} state collapse cascade amplification ${cascadeBand(amplificationScore)} (${op10mA11Round(amplificationScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.amplificationScore - a.amplificationScore), nationalIndex };
}

export function op10mA11RegionsWithRunawayCollapseCascade(
  rows: OP10M_A11_StateCollapseCascadeAmplificationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'runaway' || r.band === 'total').map((r) => r.regionId);
}

export function op10mA11StateCollapseCascadeAmplificationEscalating(
  currentIndex: number,
  priorIndex: number | null,
): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 6;
}
