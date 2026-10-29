import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_FiscalCouplingBand,
  OP10M_A11_FiscalUrbanCouplingRow,
  OP10M_A11_NationalSlice,
  OP10M_A11_RegionId,
  OP10M_A11_RegionInequalityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

const DISTRIBUTION_FISCAL_WEIGHT: Record<OP10M_A11_NationalSlice['distributionBand'], number> = {
  broad_based: 78,
  mixed: 58,
  uneven: 38,
  highly_uneven: 22,
};

function fiscalBand(score: number): OP10M_A11_FiscalCouplingBand {
  if (score >= 68) return 'aligned';
  if (score >= 48) return 'partial';
  if (score >= 28) return 'strained';
  return 'misaligned';
}

export function op10mA11ComputeFiscalUrbanCoupling(args: {
  national: OP10M_A11_NationalSlice;
  regions: Record<OP10M_A11_RegionId, OP10M_A11_RegionInequalityRow>;
}): { rows: OP10M_A11_FiscalUrbanCouplingRow[]; nationalIndex: number } {
  const baseFiscal = DISTRIBUTION_FISCAL_WEIGHT[args.national.distributionBand];
  const biasDrag = op10mA11Clamp(args.national.capitalCityBias * 0.42, 0, 24);

  const rows: OP10M_A11_FiscalUrbanCouplingRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const region = args.regions[rid];
    const lagNeed = region.lagging ? 18 : region.leading ? -6 : 4;
    const spilloverBoost =
      region.spilloverBand === 'integrated' ? 10 : region.spilloverBand === 'connected' ? 5 : 0;

    const couplingScore = op10mA11Clamp(
      baseFiscal + spilloverBoost + lagNeed - biasDrag - (region.leading ? biasDrag * 0.25 : 0),
    );

    weighted += couplingScore;

    rows.push({
      regionId: rid,
      couplingScore: op10mA11Round(couplingScore),
      band: fiscalBand(couplingScore),
      catchUpPotential: op10mA11Clamp(couplingScore * 0.65 + (region.lagging ? 12 : 0)),
      narrative: `${rid} fiscal–urban ${fiscalBand(couplingScore)} (${op10mA11Round(couplingScore)}); catch-up potential ${op10mA11Round(op10mA11Clamp(couplingScore * 0.65 + (region.lagging ? 12 : 0)))}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows, nationalIndex };
}

export function op10mA11RegionalCohesionIndex(args: {
  inequalityIndex: number;
  fragilityIndex: number;
  fiscalNationalIndex: number;
  maxMigrationPressure: number;
}): number {
  const inequalityDrag = op10mA11Clamp(args.inequalityIndex * 0.35);
  const fragilityDrag = op10mA11Clamp(args.fragilityIndex * 0.28);
  const fiscalLift = op10mA11Clamp(args.fiscalNationalIndex * 0.45);
  const migrationDrag = op10mA11Clamp(args.maxMigrationPressure * 0.22);
  return op10mA11Clamp(72 + fiscalLift - inequalityDrag - fragilityDrag - migrationDrag);
}

export function op10mA11MisalignedFiscalRegions(rows: OP10M_A11_FiscalUrbanCouplingRow[]): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'misaligned' || r.band === 'strained').map((r) => r.regionId);
}
