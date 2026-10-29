import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AdaptiveCeilingRow,
  OP10M_A11_HorizonRiskRow,
  OP10M_A11_RegionId,
  OP10M_A11_ResilienceFrontierBand,
  OP10M_A11_ResilienceFrontierRow,
  OP10M_A11_SystemicFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function frontierBand(score: number): OP10M_A11_ResilienceFrontierBand {
  if (score < 23) return 'within';
  if (score < 41) return 'approaching';
  if (score < 59) return 'at_limit';
  return 'breached';
}

export function op10mA11ComputeSettlementResilienceFrontierPressure(args: {
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  adaptiveCapacityCeiling: OP10M_A11_AdaptiveCeilingRow[];
  longHorizonCapacityRisk: OP10M_A11_HorizonRiskRow[];
}): { rows: OP10M_A11_ResilienceFrontierRow[]; nationalIndex: number } {
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const ceilingByRegion = new Map(args.adaptiveCapacityCeiling.map((a) => [a.regionId, a]));
  const horizonByRegion = new Map(args.longHorizonCapacityRisk.map((h) => [h.regionId, h]));

  const rows: OP10M_A11_ResilienceFrontierRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const systemic = systemicByRegion.get(rid);
    const ceiling = ceilingByRegion.get(rid);
    const horizon = horizonByRegion.get(rid);

    const cascadeDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.48) : 15;
    const capacityDrag = ceiling ? op10mA11Clamp(ceiling.ceilingScore * 0.4) : 12;
    const horizonDrag = horizon ? op10mA11Clamp(horizon.riskScore * 0.34) : 10;

    const pressureScore = op10mA11Clamp(cascadeDrag + capacityDrag + horizonDrag * 0.52);
    weighted += pressureScore;

    const pressures: string[] = [];
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      pressures.push('systemic cascade');
    }
    if (ceiling && (ceiling.band === 'capped' || ceiling.band === 'breached')) pressures.push('adaptive ceiling');
    if (horizon && (horizon.band === 'acute' || horizon.band === 'critical')) pressures.push('horizon risk');
    if (!pressures.length) pressures.push('frontier headroom');

    rows.push({
      regionId: rid,
      pressureScore: op10mA11Round(pressureScore),
      band: frontierBand(pressureScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} resilience frontier ${frontierBand(pressureScore)} (${op10mA11Round(pressureScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.pressureScore - a.pressureScore), nationalIndex };
}

export function op10mA11RegionsWithBreachedResilienceFrontier(
  rows: OP10M_A11_ResilienceFrontierRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'at_limit' || r.band === 'breached').map((r) => r.regionId);
}

export function op10mA11ResilienceFrontierEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 6;
}
