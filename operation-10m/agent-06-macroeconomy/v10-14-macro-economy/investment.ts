import { v1014macroClamp } from './math.ts';

export function regionalInvestmentIntensity(investmentScore: number, share: number): number {
  return v1014macroClamp(investmentScore * (0.85 + share * 0.3), 0, 100);
}

export function clampMacroScores(scores: {
  productivityScore: number;
  investmentScore: number;
  cycleScore: number;
}): typeof scores {
  return {
    productivityScore: v1014macroClamp(scores.productivityScore, 0, 100),
    investmentScore: v1014macroClamp(scores.investmentScore, 0, 100),
    cycleScore: v1014macroClamp(scores.cycleScore, 0, 100)
  };
}
