import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AdaptationLagRow,
  OP10M_A11_ConvergenceVelocityRow,
  OP10M_A11_HorizonRiskBand,
  OP10M_A11_HorizonRiskRow,
  OP10M_A11_MobilityTrapRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function horizonBand(score: number): OP10M_A11_HorizonRiskBand {
  if (score < 23) return 'stable';
  if (score < 41) return 'elevated';
  if (score < 59) return 'acute';
  return 'critical';
}

export function op10mA11ComputeSettlementLongHorizonCapacityRisk(args: {
  climateAdaptationLag: OP10M_A11_AdaptationLagRow[];
  mobilityTrap: OP10M_A11_MobilityTrapRow[];
  convergence: OP10M_A11_ConvergenceVelocityRow;
}): { rows: OP10M_A11_HorizonRiskRow[]; nationalIndex: number } {
  const lagByRegion = new Map(args.climateAdaptationLag.map((a) => [a.regionId, a]));
  const trapByRegion = new Map(args.mobilityTrap.map((m) => [m.regionId, m]));
  const spreadDrag = op10mA11Clamp(args.convergence.standingSpread * 0.28);
  const convergenceDrag =
    args.convergence.band === 'diverging' ? 14 : args.convergence.band === 'stalled' ? 8 : 0;

  const rows: OP10M_A11_HorizonRiskRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const lag = lagByRegion.get(rid);
    const trap = trapByRegion.get(rid);

    const adaptationDrag = lag ? op10mA11Clamp(lag.lagScore * 0.48) : 15;
    const mobilityDrag = trap ? op10mA11Clamp(trap.trapScore * 0.42) : 12;

    const riskScore = op10mA11Clamp(adaptationDrag + mobilityDrag + spreadDrag + convergenceDrag);
    weighted += riskScore;

    const drivers: string[] = [];
    if (lag && (lag.band === 'stalled' || lag.band === 'critical_lag')) drivers.push('adaptation lag');
    if (trap && (trap.band === 'trapped' || trap.band === 'immobilized')) drivers.push('mobility lock-in');
    if (args.convergence.band === 'stalled' || args.convergence.band === 'diverging') {
      drivers.push('convergence stress');
    }
    if (!drivers.length) drivers.push('long-horizon capacity adequate');

    rows.push({
      regionId: rid,
      riskScore: op10mA11Round(riskScore),
      band: horizonBand(riskScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} long-horizon capacity ${horizonBand(riskScore)} (${op10mA11Round(riskScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.riskScore - a.riskScore), nationalIndex };
}

export function op10mA11RegionsWithCriticalHorizonRisk(rows: OP10M_A11_HorizonRiskRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'acute' || r.band === 'critical').map((r) => r.regionId);
}

export function op10mA11HorizonRiskEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}
