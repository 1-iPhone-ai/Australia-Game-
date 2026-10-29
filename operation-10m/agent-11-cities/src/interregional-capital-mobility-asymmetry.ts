import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CapitalMobilityAsymmetryBand,
  OP10M_A11_CapitalMobilityAsymmetryRow,
  OP10M_A11_CorridorEquityDriftRow,
  OP10M_A11_FiscalGovernanceCouplingRow,
  OP10M_A11_NetworkEquityTensionRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function asymmetryBand(score: number): OP10M_A11_CapitalMobilityAsymmetryBand {
  if (score < 22) return 'balanced';
  if (score < 40) return 'skewed';
  if (score < 57) return 'polarized';
  return 'locked';
}

export function op10mA11ComputeInterregionalCapitalMobilityAsymmetry(args: {
  networkEquityTension: OP10M_A11_NetworkEquityTensionRow[];
  fiscalGovernanceCoupling: OP10M_A11_FiscalGovernanceCouplingRow[];
  corridorEquityDrift: OP10M_A11_CorridorEquityDriftRow[];
}): { rows: OP10M_A11_CapitalMobilityAsymmetryRow[]; nationalIndex: number } {
  const equityByRegion = new Map(args.networkEquityTension.map((n) => [n.regionId, n]));
  const couplingByRegion = new Map(args.fiscalGovernanceCoupling.map((f) => [f.regionId, f]));
  const driftByRegion = new Map(args.corridorEquityDrift.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CapitalMobilityAsymmetryRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const equity = equityByRegion.get(rid);
    const coupling = couplingByRegion.get(rid);
    const drift = driftByRegion.get(rid);

    const equityDrag = equity ? op10mA11Clamp(equity.tensionScore * 0.42) : 13;
    const couplingDrag = coupling ? op10mA11Clamp(coupling.strainScore * 0.36) : 11;
    const driftDrag = drift ? op10mA11Clamp(drift.driftScore * 0.4) : 10;

    const asymmetryScore = op10mA11Clamp(equityDrag + couplingDrag + driftDrag * 0.55);
    weighted += asymmetryScore;

    const drivers: string[] = [];
    if (equity && (equity.band === 'polarized' || equity.band === 'fractured')) drivers.push('network equity fracture');
    if (coupling && (coupling.band === 'misaligned' || coupling.band === 'ruptured')) {
      drivers.push('fiscal lock-in');
    }
    if (drift && (drift.band === 'polarized' || drift.band === 'fractured')) drivers.push('corridor drift');
    if (!drivers.length) drivers.push('mobility balance');

    rows.push({
      regionId: rid,
      asymmetryScore: op10mA11Round(asymmetryScore),
      band: asymmetryBand(asymmetryScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} capital mobility asymmetry ${asymmetryBand(asymmetryScore)} (${op10mA11Round(asymmetryScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.asymmetryScore - a.asymmetryScore), nationalIndex };
}

export function op10mA11RegionsWithLockedCapitalMobility(
  rows: OP10M_A11_CapitalMobilityAsymmetryRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'polarized' || r.band === 'locked').map((r) => r.regionId);
}

export function op10mA11CapitalMobilityAsymmetryEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 45;
  return currentIndex >= 39 && currentIndex > priorIndex + 6;
}
