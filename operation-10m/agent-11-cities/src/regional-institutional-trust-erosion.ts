import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CohesionIntegrityRow,
  OP10M_A11_GovernanceResilienceRow,
  OP10M_A11_InstitutionalTrustErosionBand,
  OP10M_A11_InstitutionalTrustErosionRow,
  OP10M_A11_MetaGovernanceFatigueRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function trustBand(score: number): OP10M_A11_InstitutionalTrustErosionBand {
  if (score < 23) return 'trusted';
  if (score < 41) return 'thinning';
  if (score < 58) return 'brittle';
  return 'breakdown';
}

export function op10mA11ComputeRegionalInstitutionalTrustErosion(args: {
  metaGovernanceFatigue: OP10M_A11_MetaGovernanceFatigueRow[];
  governanceResilienceDecay: OP10M_A11_GovernanceResilienceRow[];
  cohesionIntegrity: OP10M_A11_CohesionIntegrityRow[];
}): { rows: OP10M_A11_InstitutionalTrustErosionRow[]; nationalIndex: number } {
  const fatigueByRegion = new Map(args.metaGovernanceFatigue.map((m) => [m.regionId, m]));
  const decayByRegion = new Map(args.governanceResilienceDecay.map((g) => [g.regionId, g]));
  const cohesionByRegion = new Map(args.cohesionIntegrity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_InstitutionalTrustErosionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const fatigue = fatigueByRegion.get(rid);
    const decay = decayByRegion.get(rid);
    const cohesion = cohesionByRegion.get(rid);

    const fatigueDrag = fatigue ? op10mA11Clamp(fatigue.fatigueScore * 0.43) : 13;
    const decayDrag = decay ? op10mA11Clamp(decay.decayScore * 0.4) : 11;
    const cohesionDrag = cohesion ? op10mA11Clamp(cohesion.pressureScore * 0.35) : 10;

    const erosionScore = op10mA11Clamp(fatigueDrag + decayDrag + cohesionDrag * 0.54);
    weighted += erosionScore;

    const signals: string[] = [];
    if (fatigue && (fatigue.band === 'fatigued' || fatigue.band === 'exhausted')) {
      signals.push('coordination exhaustion');
    }
    if (decay && (decay.band === 'brittle' || decay.band === 'collapsed')) {
      signals.push('governance collapse risk');
    }
    if (cohesion && (cohesion.band === 'fractured' || cohesion.band === 'disintegrating')) {
      signals.push('cohesion fracture');
    }
    if (!signals.length) signals.push('institutional trust');

    rows.push({
      regionId: rid,
      erosionScore: op10mA11Round(erosionScore),
      band: trustBand(erosionScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} institutional trust erosion ${trustBand(erosionScore)} (${op10mA11Round(erosionScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.erosionScore - a.erosionScore), nationalIndex };
}

export function op10mA11RegionsWithInstitutionalTrustBreakdown(
  rows: OP10M_A11_InstitutionalTrustErosionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'brittle' || r.band === 'breakdown').map((r) => r.regionId);
}

export function op10mA11InstitutionalTrustErosionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 48;
  return currentIndex >= 42 && currentIndex > priorIndex + 5;
}
