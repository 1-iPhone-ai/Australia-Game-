import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CapitalFlightPanicRow,
  OP10M_A11_FiscalPanicContagionBand,
  OP10M_A11_FiscalPanicContagionRow,
  OP10M_A11_LiquidityFragmentationRow,
  OP10M_A11_RegionId,
  OP10M_A11_SocialContractFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function contagionBand(score: number): OP10M_A11_FiscalPanicContagionBand {
  if (score < 24) return 'isolated';
  if (score < 42) return 'spreading';
  if (score < 59) return 'contagion';
  return 'systemic';
}

export function op10mA11ComputeInterregionalFiscalPanicContagion(args: {
  capitalFlightPanic: OP10M_A11_CapitalFlightPanicRow[];
  liquidityFragmentation: OP10M_A11_LiquidityFragmentationRow[];
  socialContractFragility: OP10M_A11_SocialContractFragilityRow[];
}): { rows: OP10M_A11_FiscalPanicContagionRow[]; nationalIndex: number } {
  const flightByRegion = new Map(args.capitalFlightPanic.map((c) => [c.regionId, c]));
  const liquidityByRegion = new Map(args.liquidityFragmentation.map((l) => [l.regionId, l]));
  const contractByRegion = new Map(args.socialContractFragility.map((s) => [s.regionId, s]));

  const rows: OP10M_A11_FiscalPanicContagionRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const flight = flightByRegion.get(rid);
    const liquidity = liquidityByRegion.get(rid);
    const contract = contractByRegion.get(rid);

    const flightDrag = flight ? op10mA11Clamp(flight.panicScore * 0.43) : 13;
    const liquidityDrag = liquidity ? op10mA11Clamp(liquidity.fragmentationScore * 0.41) : 11;
    const contractDrag = contract ? op10mA11Clamp(contract.fragilityScore * 0.36) : 10;

    const contagionScore = op10mA11Clamp(flightDrag + liquidityDrag + contractDrag * 0.49);
    weighted += contagionScore;

    const channels: string[] = [];
    if (flight && (flight.band === 'panicked' || flight.band === 'stampede')) {
      channels.push('flight panic channel');
    }
    if (liquidity && (liquidity.band === 'fractured' || liquidity.band === 'frozen')) {
      channels.push('liquidity fracture');
    }
    if (contract && (contract.band === 'fraying' || contract.band === 'ruptured')) {
      channels.push('contract stress spillover');
    }
    if (!channels.length) channels.push('fiscal stability');

    rows.push({
      regionId: rid,
      contagionScore: op10mA11Round(contagionScore),
      band: contagionBand(contagionScore),
      channels: channels.slice(0, 3),
      narrative: `${rid} fiscal panic contagion ${contagionBand(contagionScore)} (${op10mA11Round(contagionScore)}); ${channels.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.contagionScore - a.contagionScore), nationalIndex };
}

export function op10mA11RegionsWithSystemicFiscalPanicContagion(
  rows: OP10M_A11_FiscalPanicContagionRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'contagion' || r.band === 'systemic').map((r) => r.regionId);
}

export function op10mA11FiscalPanicContagionEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 51;
  return currentIndex >= 45 && currentIndex > priorIndex + 6;
}
