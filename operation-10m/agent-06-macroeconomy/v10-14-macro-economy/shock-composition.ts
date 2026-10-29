import type { CyclicalMacroShockDefinition } from './catalog/cyclical-shocks.ts';

/** Diminishing stacking when multiple negative shocks hit the same turn. */
export function composeStackedShockDeltas(
  activeIds: string[],
  catalog: Record<string, CyclicalMacroShockDefinition>
): { productivityDelta: number; investmentDelta: number; cycleDelta: number } {
  let productivityDelta = 0;
  let investmentDelta = 0;
  let cycleDelta = 0;
  let negativeStack = 0;
  for (const id of activeIds) {
    const shock = catalog[id];
    if (!shock) continue;
    const neg =
      (shock.productivityDelta < 0 ? 1 : 0) +
      (shock.investmentDelta < 0 ? 1 : 0) +
      (shock.cycleDelta < 0 ? 1 : 0);
    const stackFactor = neg > 0 ? Math.max(0.55, 1 - negativeStack * 0.12) : 1;
    if (neg > 0) negativeStack += 1;
    productivityDelta += shock.productivityDelta * (shock.productivityDelta < 0 ? stackFactor : 1);
    investmentDelta += shock.investmentDelta * (shock.investmentDelta < 0 ? stackFactor : 1);
    cycleDelta += shock.cycleDelta * (shock.cycleDelta < 0 ? stackFactor : 1);
  }
  return { productivityDelta, investmentDelta, cycleDelta };
}
