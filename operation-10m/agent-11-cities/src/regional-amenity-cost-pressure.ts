import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_AmenityCostBand,
  OP10M_A11_AmenityCostRow,
  OP10M_A11_FiscalUrbanCouplingRow,
  OP10M_A11_HousingSpilloverRow,
  OP10M_A11_RegionId,
  OP10M_A11_TalentRetentionRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function amenityBand(score: number): OP10M_A11_AmenityCostBand {
  if (score < 26) return 'affordable';
  if (score < 44) return 'stretching';
  if (score < 62) return 'strained';
  return 'crisis';
}

export function op10mA11ComputeRegionalAmenityCostPressure(args: {
  housingSpillover: OP10M_A11_HousingSpilloverRow[];
  talentRetention: OP10M_A11_TalentRetentionRow[];
  fiscalUrbanCoupling: OP10M_A11_FiscalUrbanCouplingRow[];
}): { rows: OP10M_A11_AmenityCostRow[]; nationalIndex: number } {
  const spillByRegion = new Map(args.housingSpillover.map((h) => [h.regionId, h]));
  const talentByRegion = new Map(args.talentRetention.map((t) => [t.regionId, t]));
  const fiscalByRegion = new Map(args.fiscalUrbanCoupling.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_AmenityCostRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const spill = spillByRegion.get(rid);
    const talent = talentByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const housingDrag = spill ? op10mA11Clamp(spill.spilloverScore * 0.52) : 14;
    const workforceDrag = talent ? op10mA11Clamp(talent.drainScore * 0.38) : 10;
    const fiscalDrag = fiscal
      ? op10mA11Clamp((100 - fiscal.couplingScore) * 0.22 + (fiscal.band === 'misaligned' ? 12 : 0))
      : 8;

    const amenityScore = op10mA11Clamp(housingDrag + workforceDrag * 0.58 + fiscalDrag);
    weighted += amenityScore;

    const pressures: string[] = [];
    if (spill && (spill.band === 'cascade' || spill.band === 'systemic')) pressures.push('housing spillover');
    if (talent && (talent.band === 'draining' || talent.band === 'collapse')) pressures.push('talent cost spiral');
    if (fiscal && (fiscal.band === 'strained' || fiscal.band === 'misaligned')) pressures.push('fiscal mismatch');
    if (!pressures.length) pressures.push('contained amenity load');

    rows.push({
      regionId: rid,
      amenityScore: op10mA11Round(amenityScore),
      band: amenityBand(amenityScore),
      pressures: pressures.slice(0, 3),
      narrative: `${rid} amenity cost ${amenityBand(amenityScore)} (${op10mA11Round(amenityScore)}); ${pressures.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.amenityScore - a.amenityScore), nationalIndex };
}

export function op10mA11RegionsWithAmenityCostCrisis(rows: OP10M_A11_AmenityCostRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'strained' || r.band === 'crisis').map((r) => r.regionId);
}

export function op10mA11AmenityCostEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 52;
  return currentIndex >= 46 && currentIndex > priorIndex + 5;
}
