import { v1014macroClamp } from './math.ts';

export function deriveUtilizationIndex(cycleScore: number, investmentScore: number): number {
  return v1014macroClamp(48 + (cycleScore - 50) * 0.6 + (investmentScore - 50) * 0.25, 0, 100);
}

export function deriveGrossOutputIndex(
  productivityScore: number,
  utilizationIndex: number,
  investmentScore: number
): number {
  const productivityComponent = v1014macroClamp(productivityScore / 100, 0.2, 1);
  const utilizationComponent = utilizationIndex / 100;
  const investmentComponent = investmentScore / 100;
  return v1014macroClamp(
    productivityComponent * utilizationComponent * 100 * (0.92 + investmentComponent * 0.16),
    0,
    100
  );
}

export function regionalUtilizationIndex(baseUtilization: number, share: number): number {
  return v1014macroClamp(baseUtilization * (0.9 + share * 0.2), 0, 100);
}
