import { OP10M_A11_THRESHOLDS, op10mA11Clamp, op10mA11GrowthBandFromScore, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_NationalSlice,
  OP10M_A11_RegionId,
  OP10M_A11_RegionInequalityRow,
  OP10M_A11_SpilloverBand,
} from './types.ts';

const NATIONAL_GROWTH_MOD: Record<OP10M_A11_NationalSlice['nationalGrowthBand'], number> = {
  contraction: -8,
  slow: -3,
  steady: 0,
  strong: 5,
  overheating: 8,
};

const DISTRIBUTION_DRAG: Record<OP10M_A11_NationalSlice['distributionBand'], number> = {
  broad_based: -4,
  mixed: 0,
  uneven: 5,
  highly_uneven: 10,
};

export function op10mA11NationalLocalCoupling(national: OP10M_A11_NationalSlice): number {
  const network = (national.networkFreight + national.networkDigital) / 2;
  const biasPenalty = op10mA11Clamp(national.capitalCityBias * 0.35, 0, 18);
  return op10mA11Clamp(network * 0.72 + NATIONAL_GROWTH_MOD[national.nationalGrowthBand] - biasPenalty);
}

export function op10mA11SpilloverBand(coupling: number, relativeStanding: number): OP10M_A11_SpilloverBand {
  const adjusted = coupling + (relativeStanding < 45 ? 8 : relativeStanding > 62 ? -4 : 0);
  if (adjusted < OP10M_A11_THRESHOLDS.spilloverWeak) return 'isolated';
  if (adjusted < OP10M_A11_THRESHOLDS.spilloverConnected) return 'weak';
  if (adjusted < OP10M_A11_THRESHOLDS.spilloverIntegrated) return 'connected';
  return 'integrated';
}

export function op10mA11ApplyNationalSpilloverToStanding(
  urbanIndex: number,
  regionId: OP10M_A11_RegionId,
  national: OP10M_A11_NationalSlice,
  coupling: number,
): number {
  const distDrag = DISTRIBUTION_DRAG[national.distributionBand];
  const lagBonus =
    urbanIndex < 48 ? op10mA11Clamp(coupling * 0.22, 0, 12) : op10mA11Clamp(coupling * 0.08, 0, 6);
  const hotspotTax =
    urbanIndex > 68 && national.distributionBand !== 'broad_based'
      ? op10mA11Clamp(distDrag * 0.6 + national.capitalCityBias * 0.08, 0, 10)
      : 0;
  const remote =
    regionId === 'NT' || regionId === 'TAS' ? op10mA11Clamp(coupling * 0.05, 0, 4) : 0;
  return op10mA11Clamp(urbanIndex + lagBonus - hotspotTax + remote - distDrag * 0.35);
}

export function op10mA11BuildRegionInequalityRow(args: {
  regionId: OP10M_A11_RegionId;
  urbanIndex: number;
  relativeStanding: number;
  coupling: number;
  national: OP10M_A11_NationalSlice;
  leading: boolean;
  lagging: boolean;
}): OP10M_A11_RegionInequalityRow {
  const adjusted = op10mA11ApplyNationalSpilloverToStanding(
    args.urbanIndex,
    args.regionId,
    args.national,
    args.coupling,
  );
  const band = op10mA11GrowthBandFromScore(adjusted);
  const spilloverBand = op10mA11SpilloverBand(args.coupling, args.relativeStanding);
  const narrativeParts = [
    `${args.regionId} urban index ${op10mA11Round(adjusted)} (${band})`,
    spilloverBand !== 'isolated'
      ? `national–local link ${spilloverBand}`
      : 'limited national spillover',
  ];
  if (args.lagging) narrativeParts.push('lagging vs national peers');
  if (args.leading) narrativeParts.push('leading peer regions');
  return {
    regionId: args.regionId,
    urbanGrowthIndex: op10mA11Round(adjusted),
    relativeStanding: op10mA11Round(args.relativeStanding),
    band,
    lagging: args.lagging,
    leading: args.leading,
    spilloverBand,
    narrative: narrativeParts.join('; '),
  };
}
