import { v1014macroClamp } from './math.ts';
import type { RegionalDivergenceBand, RegionalDivergenceSnapshot, RegionalMacroContribution } from './types.ts';

function herfindahl(shares: number[]): number {
  return shares.reduce((acc, s) => acc + s * s, 0);
}

export function computeRegionalDivergenceSnapshot(
  contributions: RegionalMacroContribution[]
): RegionalDivergenceSnapshot {
  const productivity = contributions.map(r => r.productivityIndex);
  const shares = contributions.map(r => r.share);
  const minP = Math.min(...productivity);
  const maxP = Math.max(...productivity);
  const productivitySpread = maxP - minP;
  const shareHerfindahl = herfindahl(shares);
  let band: RegionalDivergenceBand = 'moderate_spread';
  if (productivitySpread < 8 && shareHerfindahl < 0.14) band = 'cohesive';
  if (productivitySpread > 18 || shareHerfindahl > 0.2) band = 'wide_spread';
  const sortedProd = [...contributions].sort((a, b) => b.productivityIndex - a.productivityIndex);
  return {
    band,
    productivitySpread: v1014macroClamp(productivitySpread, 0, 100),
    shareHerfindahl: v1014macroClamp(shareHerfindahl, 0, 1),
    leadingRegionId: sortedProd[0]?.regionId ?? 'NSW',
    laggingRegionId: sortedProd[sortedProd.length - 1]?.regionId ?? 'TAS'
  };
}
