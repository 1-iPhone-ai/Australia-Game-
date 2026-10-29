import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_FiscalPanicContagionRow,
  OP10M_A11_GovernanceVacuumEscalationRow,
  OP10M_A11_HollowRegionContagionBand,
  OP10M_A11_HollowRegionContagionRow,
  OP10M_A11_RegionId,
  OP10M_A11_SettlementAbandonmentSpiralRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function hollowBand(score: number): OP10M_A11_HollowRegionContagionBand {
  if (score < 25) return 'contained';
  if (score < 43) return 'hollowing';
  if (score < 60) return 'contagion';
  return 'voided';
}

export function op10mA11ComputeInterregionalHollowRegionContagion(args: {
  settlementAbandonmentSpiral: OP10M_A11_SettlementAbandonmentSpiralRow[];
  fiscalPanicContagion: OP10M_A11_FiscalPanicContagionRow[];
  governanceVacuumEscalation: OP10M_A11_GovernanceVacuumEscalationRow[];
}): { rows: OP10M_A11_HollowRegionContagionRow[]; nationalIndex: number } {
  const spiralByRegion = new Map(args.settlementAbandonmentSpiral.map((s) => [s.regionId, s]));
  const fiscalByRegion = new Map(args.fiscalPanicContagion.map((f) => [f.regionId, f]));
  const vacuumByRegion = new Map(args.governanceVacuumEscalation.map((g) => [g.regionId, g]));

  const rows: OP10M_A11_HollowRegionContagionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const spiral = spiralByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);
    const vacuum = vacuumByRegion.get(rid);

    const spiralDrag = spiral ? op10mA11Clamp(spiral.spiralScore * 0.44) : 13;
    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.contagionScore * 0.39) : 11;
    const vacuumDrag = vacuum ? op10mA11Clamp(vacuum.vacuumScore * 0.37) : 10;

    const contagionScore = op10mA11Clamp(spiralDrag + fiscalDrag + vacuumDrag * 0.47);
    weighted += contagionScore;

    const channels: string[] = [];
    if (spiral && (spiral.band === 'exodus' || spiral.band === 'abandoned')) {
      channels.push('depopulation channel');
    }
    if (fiscal && (fiscal.band === 'contagion' || fiscal.band === 'systemic')) {
      channels.push('fiscal hollow-out');
    }
    if (vacuum && (vacuum.band === 'hollow' || vacuum.band === 'vacuum')) {
      channels.push('governance void');
    }
    if (!channels.length) channels.push('regional cohesion');

    rows.push({
      regionId: rid,
      contagionScore: op10mA11Round(contagionScore),
      band: hollowBand(contagionScore),
      channels: channels.slice(0, 3),
      narrative: `${rid} hollow region contagion ${hollowBand(contagionScore)} (${op10mA11Round(contagionScore)}); ${channels.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.contagionScore - a.contagionScore), nationalIndex };
}

export function op10mA11RegionsWithVoidedHollowContagion(
  rows: OP10M_A11_HollowRegionContagionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'contagion' || r.band === 'voided').map((r) => r.regionId);
}

export function op10mA11HollowRegionContagionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 53;
  return currentIndex >= 47 && currentIndex > priorIndex + 6;
}
