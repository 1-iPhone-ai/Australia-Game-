import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_HorizonRiskRow,
  OP10M_A11_LandUseGridlockRow,
  OP10M_A11_RelocationBurdenRow,
  OP10M_A11_RegionId,
  OP10M_A11_SystemicFragilityBand,
  OP10M_A11_SystemicFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function fragilityBand(score: number): OP10M_A11_SystemicFragilityBand {
  if (score < 24) return 'contained';
  if (score < 42) return 'elevated';
  if (score < 60) return 'systemic';
  return 'cascade_risk';
}

export function op10mA11ComputeSettlementSystemicFragilityComposite(args: {
  longHorizonCapacityRisk: OP10M_A11_HorizonRiskRow[];
  landUseGridlock: OP10M_A11_LandUseGridlockRow[];
  relocationBurden: OP10M_A11_RelocationBurdenRow[];
}): { rows: OP10M_A11_SystemicFragilityRow[]; nationalIndex: number } {
  const horizonByRegion = new Map(args.longHorizonCapacityRisk.map((h) => [h.regionId, h]));
  const gridlockByRegion = new Map(args.landUseGridlock.map((l) => [l.regionId, l]));
  const relocationByRegion = new Map(args.relocationBurden.map((r) => [r.regionId, r]));

  const rows: OP10M_A11_SystemicFragilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const horizon = horizonByRegion.get(rid);
    const gridlock = gridlockByRegion.get(rid);
    const relocation = relocationByRegion.get(rid);

    const horizonDrag = horizon ? op10mA11Clamp(horizon.riskScore * 0.46) : 15;
    const regulatoryDrag = gridlock ? op10mA11Clamp(gridlock.gridlockScore * 0.36) : 12;
    const displacementDrag = relocation ? op10mA11Clamp(relocation.burdenScore * 0.38) : 11;

    const fragilityScore = op10mA11Clamp(horizonDrag + regulatoryDrag + displacementDrag);
    weighted += fragilityScore;

    const cascades: string[] = [];
    if (horizon && (horizon.band === 'acute' || horizon.band === 'critical')) cascades.push('horizon risk');
    if (gridlock && (gridlock.band === 'gridlocked' || gridlock.band === 'paralyzed')) cascades.push('regulatory gridlock');
    if (relocation && (relocation.band === 'severe' || relocation.band === 'overwhelming')) {
      cascades.push('relocation overload');
    }
    if (!cascades.length) cascades.push('systemic buffers intact');

    rows.push({
      regionId: rid,
      fragilityScore: op10mA11Round(fragilityScore),
      band: fragilityBand(fragilityScore),
      cascades: cascades.slice(0, 3),
      narrative: `${rid} systemic fragility ${fragilityBand(fragilityScore)} (${op10mA11Round(fragilityScore)}); ${cascades.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fragilityScore - a.fragilityScore), nationalIndex };
}

export function op10mA11RegionsWithSystemicCascadeRisk(rows: OP10M_A11_SystemicFragilityRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'systemic' || r.band === 'cascade_risk').map((r) => r.regionId);
}

export function op10mA11SystemicFragilityEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
