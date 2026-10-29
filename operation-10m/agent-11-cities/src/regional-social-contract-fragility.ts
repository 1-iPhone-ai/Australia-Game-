import { op10mA11Clamp, op10mA11Round } from './constants.ts';
import type {
  OP10M_A11_CascadingFailureRiskRow,
  OP10M_A11_InstitutionalTrustErosionRow,
  OP10M_A11_LiquidityFragmentationRow,
  OP10M_A11_RegionId,
  OP10M_A11_SocialContractFragilityBand,
  OP10M_A11_SocialContractFragilityRow,
} from './types.ts';
import { OP10M_A11_CORE_REGIONS } from './types.ts';

function contractBand(score: number): OP10M_A11_SocialContractFragilityBand {
  if (score < 24) return 'honored';
  if (score < 42) return 'strained';
  if (score < 59) return 'fraying';
  return 'ruptured';
}

export function op10mA11ComputeRegionalSocialContractFragility(args: {
  institutionalTrustErosion: OP10M_A11_InstitutionalTrustErosionRow[];
  liquidityFragmentation: OP10M_A11_LiquidityFragmentationRow[];
  cascadingFailureRisk: OP10M_A11_CascadingFailureRiskRow[];
}): { rows: OP10M_A11_SocialContractFragilityRow[]; nationalIndex: number } {
  const trustByRegion = new Map(args.institutionalTrustErosion.map((t) => [t.regionId, t]));
  const liquidityByRegion = new Map(args.liquidityFragmentation.map((l) => [l.regionId, l]));
  const cascadeByRegion = new Map(args.cascadingFailureRisk.map((c) => [c.regionId, c]));

  const rows: OP10M_A11_SocialContractFragilityRow[] = [];
  let weighted = 0;

  for (const rid of OP10M_A11_CORE_REGIONS) {
    const trust = trustByRegion.get(rid);
    const liquidity = liquidityByRegion.get(rid);
    const cascade = cascadeByRegion.get(rid);

    const trustDrag = trust ? op10mA11Clamp(trust.erosionScore * 0.41) : 12;
    const liquidityDrag = liquidity ? op10mA11Clamp(liquidity.fragmentationScore * 0.39) : 11;
    const cascadeDrag = cascade ? op10mA11Clamp(cascade.cascadeScore * 0.38) : 10;

    const fragilityScore = op10mA11Clamp(trustDrag + liquidityDrag + cascadeDrag * 0.52);
    weighted += fragilityScore;

    const signals: string[] = [];
    if (trust && (trust.band === 'brittle' || trust.band === 'breakdown')) {
      signals.push('institutional trust breakdown');
    }
    if (liquidity && (liquidity.band === 'fractured' || liquidity.band === 'frozen')) {
      signals.push('liquidity freeze');
    }
    if (cascade && (cascade.band === 'cascade_risk' || cascade.band === 'systemic')) {
      signals.push('cascade exposure');
    }
    if (!signals.length) signals.push('social contract');

    rows.push({
      regionId: rid,
      fragilityScore: op10mA11Round(fragilityScore),
      band: contractBand(fragilityScore),
      signals: signals.slice(0, 3),
      narrative: `${rid} social contract fragility ${contractBand(fragilityScore)} (${op10mA11Round(fragilityScore)}); ${signals.slice(0, 2).join('; ')}.`,
    });
  }

  const nationalIndex = op10mA11Round(weighted / OP10M_A11_CORE_REGIONS.length);
  return { rows: rows.sort((a, b) => b.fragilityScore - a.fragilityScore), nationalIndex };
}

export function op10mA11RegionsWithRupturedSocialContract(
  rows: OP10M_A11_SocialContractFragilityRow[],
): OP10M_A11_RegionId[] {
  return rows.filter((r) => r.band === 'fraying' || r.band === 'ruptured').map((r) => r.regionId);
}

export function op10mA11SocialContractFragilityEscalating(currentIndex: number, priorIndex: number | null): boolean {
  if (priorIndex === null) return currentIndex >= 49;
  return currentIndex >= 43 && currentIndex > priorIndex + 5;
}
