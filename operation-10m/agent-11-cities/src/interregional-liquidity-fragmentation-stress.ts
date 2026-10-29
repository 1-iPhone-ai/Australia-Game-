import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CapitalMobilityAsymmetryRow,
  OP10M_A11_FiscalCapacityStrainRow,
  OP10M_A11_LiquidityFragmentationBand,
  OP10M_A11_LiquidityFragmentationRow,
  OP10M_A11_NetworkEquityTensionRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function fragmentationBand(score: number): OP10M_A11_LiquidityFragmentationBand {
  if (score < 24) return 'integrated';
  if (score < 42) return 'segmented';
  if (score < 59) return 'fractured';
  return 'frozen';
}

export function op10mA11ComputeInterregionalLiquidityFragmentationStress(args: {
  capitalMobilityAsymmetry: OP10M_A11_CapitalMobilityAsymmetryRow[];
  networkEquityTension: OP10M_A11_NetworkEquityTensionRow[];
  fiscalCapacityStrain: OP10M_A11_FiscalCapacityStrainRow[];
}): { rows: OP10M_A11_LiquidityFragmentationRow[]; nationalIndex: number } {
  const mobilityByRegion = new Map(args.capitalMobilityAsymmetry.map((c) => [c.regionId, c]));
  const equityByRegion = new Map(args.networkEquityTension.map((n) => [n.regionId, n]));
  const fiscalByRegion = new Map(args.fiscalCapacityStrain.map((f) => [f.regionId, f]));

  const rows: OP10M_A11_LiquidityFragmentationRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const mobility = mobilityByRegion.get(rid);
    const equity = equityByRegion.get(rid);
    const fiscal = fiscalByRegion.get(rid);

    const mobilityDrag = mobility ? op10mA11Clamp(mobility.asymmetryScore * 0.41) : 12;
    const equityDrag = equity ? op10mA11Clamp(equity.tensionScore * 0.38) : 11;
    const fiscalDrag = fiscal ? op10mA11Clamp(fiscal.strainScore * 0.37) : 10;

    const fragmentationScore = op10mA11Clamp(mobilityDrag + equityDrag + fiscalDrag * 0.53);
    weighted += fragmentationScore;

    const drivers: string[] = [];
    if (mobility && (mobility.band === 'polarized' || mobility.band === 'locked')) {
      drivers.push('capital lock-in');
    }
    if (equity && (equity.band === 'polarized' || equity.band === 'fractured')) {
      drivers.push('network equity fracture');
    }
    if (fiscal && (fiscal.band === 'fragile' || fiscal.band === 'exhausted')) {
      drivers.push('fiscal drought');
    }
    if (!drivers.length) drivers.push('liquidity integration');

    rows.push({
      regionId: rid,
      fragmentationScore: op10mA11Round(fragmentationScore),
      band: fragmentationBand(fragmentationScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} liquidity fragmentation ${fragmentationBand(fragmentationScore)} (${op10mA11Round(fragmentationScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fragmentationScore - a.fragmentationScore), nationalIndex };
}

export function op10mA11RegionsWithFrozenLiquidity(
  rows: OP10M_A11_LiquidityFragmentationRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fractured' || r.band === 'frozen').map((r) => r.regionId);
}

export function op10mA11LiquidityFragmentationEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 46;
  return currentIndex >= 40 && currentIndex > priorIndex + 6;
}
