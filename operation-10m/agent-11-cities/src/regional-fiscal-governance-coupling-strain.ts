import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CohesionIntegrityRow,
  OP10M_A11_FiscalCapacityStrainRow,
  OP10M_A11_FiscalGovernanceCouplingBand,
  OP10M_A11_FiscalGovernanceCouplingRow,
  OP10M_A11_GovernanceResilienceRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function couplingBand(score: number): OP10M_A11_FiscalGovernanceCouplingBand {
  if (score < 22) return 'aligned';
  if (score < 40) return 'strained';
  if (score < 58) return 'misaligned';
  return 'ruptured';
}

export function op10mA11ComputeRegionalFiscalGovernanceCouplingStrain(args: {
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
  governanceResilienceDecay: OP10M_A11_GovernanceResilienceRow[];
  cohesionIntegrity: OP10M_A11_CohesionIntegrityRow[];
}): { rows: OP10M_A11_FiscalGovernanceCouplingRow[]; nationalIndex: number } {
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));
  const governanceByRegion = new Map(args.governanceResilienceDecay.map((g) => [g.regionId, g]));
  const integrityByRegion = new Map(args.cohesionIntegrity.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_FiscalGovernanceCouplingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const fiscal = fiscalByRegion.get(rid);
    const governance = governanceByRegion.get(rid);
    const integrity = integrityByRegion.get(rid);

    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.46) : 14;
    const governanceDrag = governance ? op10mA11Clamp(governance.decayScore * 0.4) : 12;
    const cohesionDrag = integrity ? op10mA11Clamp(integrity.pressureScore * 0.32) : 10;

    const strainScore = op10mA11Clamp(fiscalDrag + governanceDrag + cohesionDrag * 0.55);
    weighted += strainScore;

    const tensions: string[] = [];
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) tensions.push('fiscal exhaustion');
    if (governance && (governance.band === 'brittle' || governance.band === 'collapsed')) {
      tensions.push('governance decay');
    }
    if (integrity && (integrity.band === 'fractured' || integrity.band === 'disintegrating')) {
      tensions.push('cohesion fracture');
    }
    if (!tensions.length) tensions.push('fiscal–governance balance');

    rows.push({
      regionId: rid,
      strainScore: op10mA11Round(strainScore),
      band: couplingBand(strainScore),
      tensions: tensions.slice(0, 3),
      narrative: `${rid} fiscal–governance coupling ${couplingBand(strainScore)} (${op10mA11Round(strainScore)}); ${tensions.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.strainScore - a.strainScore), nationalIndex };
}

export function op10mA11RegionsWithFiscalGovernanceRupture(
  rows: OP10M_A11_FiscalGovernanceCouplingRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'misaligned' || r.band === 'ruptured').map((r) => r.regionId);
}

export function op10mA11FiscalGovernanceCouplingEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 5;
}
