import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AdaptiveCeilingRow,
  OP10M_A11_CascadingFailureBand,
  OP10M_A11_CascadingFailureRiskRow,
  OP10M_A11_CompoundShockSaturationRow,
  OP10M_A11_RegionId,
  OP10M_A11_SystemicFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function cascadeBand(score: number): OP10M_A11_CascadingFailureBand {
  if (score < 26) return 'contained';
  if (score < 44) return 'spreading';
  if (score < 61) return 'cascade_risk';
  return 'systemic';
}

export function op10mA11ComputeSettlementCascadingFailureRisk(args: {
  compoundShockSaturation: OP10M_A11_CompoundShockSaturationRow[];
  systemicFragility: OP10M_A11_SystemicFragilityRow[];
  adaptiveCapacityCeiling: OP10M_A11_AdaptiveCeilingRow[];
}): { rows: OP10M_A11_CascadingFailureRiskRow[]; nationalIndex: number } {
  const shockByRegion = new Map(args.compoundShockSaturation.map((s) => [s.regionId, s]));
  const systemicByRegion = new Map(args.systemicFragility.map((s) => [s.regionId, s]));
  const ceilingByRegion = new Map(args.adaptiveCapacityCeiling.map((a) => [a.regionId, a]));

  const rows: OP10M_A11_CascadingFailureRiskRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const shock = shockByRegion.get(rid);
    const systemic = systemicByRegion.get(rid);
    const ceiling = ceilingByRegion.get(rid);

    const shockDrag = shock ? op10mA11Clamp(shock.saturationScore * 0.45) : 14;
    const systemicDrag = systemic ? op10mA11Clamp(systemic.fragilityScore * 0.42) : 12;
    const ceilingDrag = ceiling ? op10mA11Clamp(ceiling.ceilingScore * 0.36) : 10;

    const cascadeScore = op10mA11Clamp(shockDrag + systemicDrag + ceilingDrag * 0.5);
    weighted += cascadeScore;

    const triggers: string[] = [];
    if (shock && (shock.band === 'saturated' || shock.band === 'overwhelmed')) {
      triggers.push('shock saturation');
    }
    if (systemic && (systemic.band === 'systemic' || systemic.band === 'cascade_risk')) {
      triggers.push('fragility cascade');
    }
    if (ceiling && (ceiling.band === 'capped' || ceiling.band === 'breached')) {
      triggers.push('adaptive ceiling breach');
    }
    if (!triggers.length) triggers.push('failure containment');

    rows.push({
      regionId: rid,
      cascadeScore: op10mA11Round(cascadeScore),
      band: cascadeBand(cascadeScore),
      triggers: triggers.slice(0, 3),
      narrative: `${rid} cascading failure risk ${cascadeBand(cascadeScore)} (${op10mA11Round(cascadeScore)}); ${triggers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.cascadeScore - a.cascadeScore), nationalIndex };
}

export function op10mA11RegionsWithSystemicCascadeRisk(
  rows: OP10M_A11_CascadingFailureRiskRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'cascade_risk' || r.band === 'systemic').map((r) => r.regionId);
}

export function op10mA11CascadingFailureRiskEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
