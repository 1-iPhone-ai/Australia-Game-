import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CapitalFlightPanicBand,
  OP10M_A11_CapitalFlightPanicRow,
  OP10M_A11_CapitalMobilityAsymmetryRow,
  OP10M_A11_InstitutionalTrustErosionRow,
  OP10M_A11_LiquidityFragmentationRow,
  OP10M_A11_RegionId,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function panicBand(score: number): OP10M_A11_CapitalFlightPanicBand {
  if (score < 25) return 'stable';
  if (score < 43) return 'nervous';
  if (score < 60) return 'panicked';
  return 'stampede';
}

export function op10mA11ComputeInterregionalCapitalFlightPanic(args: {
  liquidityFragmentation: OP10M_A11_LiquidityFragmentationRow[];
  institutionalTrustErosion: OP10M_A11_InstitutionalTrustErosionRow[];
  capitalMobilityAsymmetry: OP10M_A11_CapitalMobilityAsymmetryRow[];
}): { rows: OP10M_A11_CapitalFlightPanicRow[]; nationalIndex: number } {
  const liquidityByRegion = new Map(args.liquidityFragmentation.map((l) => [l.regionId, l]));
  const trustByRegion = new Map(args.institutionalTrustErosion.map((t) => [t.regionId, t]));
  const mobilityByRegion = new Map(args.capitalMobilityAsymmetry.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_CapitalFlightPanicRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const liquidity = liquidityByRegion.get(rid);
    const trust = trustByRegion.get(rid);
    const mobility = mobilityByRegion.get(rid);

    const liquidityDrag = liquidity ? op10mA11Clamp(liquidity.fragmentationScore * 0.44) : 13;
    const trustDrag = trust ? op10mA11Clamp(trust.erosionScore * 0.37) : 11;
    const mobilityDrag = mobility ? op10mA11Clamp(mobility.asymmetryScore * 0.4) : 10;

    const panicScore = op10mA11Clamp(liquidityDrag + trustDrag + mobilityDrag * 0.48);
    weighted += panicScore;

    const drivers: string[] = [];
    if (liquidity && (liquidity.band === 'fractured' || liquidity.band === 'frozen')) {
      drivers.push('fragmented liquidity');
    }
    if (trust && (trust.band === 'brittle' || trust.band === 'breakdown')) {
      drivers.push('trust collapse');
    }
    if (mobility && (mobility.band === 'polarized' || mobility.band === 'locked')) {
      drivers.push('locked capital lanes');
    }
    if (!drivers.length) drivers.push('capital stability');

    rows.push({
      regionId: rid,
      panicScore: op10mA11Round(panicScore),
      band: panicBand(panicScore),
      drivers: drivers.slice(0, 3),
      narrative: `${rid} capital flight panic ${panicBand(panicScore)} (${op10mA11Round(panicScore)}); ${drivers.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.panicScore - a.panicScore), nationalIndex };
}

export function op10mA11RegionsWithCapitalFlightStampede(
  rows: OP10M_A11_CapitalFlightPanicRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'panicked' || r.band === 'stampede').map((r) => r.regionId);
}

export function op10mA11CapitalFlightPanicEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 50;
  return currentIndex >= 44 && currentIndex > priorIndex + 6;
}
