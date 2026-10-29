import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroSupplyChainSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.08 corporate supply-chain spillover (Agent 08 domain; distinct from companies production layer). */
export function readMacroSupplyChainSpilloverFromV1008(inputs: MacroEconomyInputs): MacroSupplyChainSpillover {
  const sc: any =
    inputs.supplyChainStress ??
    inputs.companies?.supplyChain ??
    inputs.privateSector?.supplyChain ??
    inputs.nationalPrivateSector?.logisticsStress;
  if (!sc) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const fragility = String(sc.fragilityBand ?? sc.stressBand ?? sc.disruptionBand ?? '');
  const leadTime = String(sc.leadTimeBand ?? sc.delayBand ?? '');
  const inventory = String(sc.inventoryBand ?? sc.stockBand ?? '');

  if (fragility === 'severe' || fragility === 'critical' || fragility === 'broken') {
    productivityNudge -= 3;
    cycleNudge -= 2;
    summary = `Severe supply-chain fragility (${fragility}) drags macro productivity read.`;
  } else if (fragility === 'resilient' || fragility === 'robust') {
    productivityNudge += 1;
    summary = `Resilient supply chain (${fragility}) supports macro productivity read.`;
  }

  if (leadTime === 'extended' || leadTime === 'critical' || leadTime === 'extreme') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Extended supply lead times weaken macro investment signal.';
  }

  if (inventory === 'depleted' || inventory === 'critical' || inventory === 'empty') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Depleted corporate inventories amplify macro downside transmission.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroSupplyChainSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroSupplyChainSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
