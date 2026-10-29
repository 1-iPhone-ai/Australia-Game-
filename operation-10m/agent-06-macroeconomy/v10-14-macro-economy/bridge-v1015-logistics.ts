import { v1014macroClamp } from './math.ts';
import type { MacroEconomyInputs } from './types.ts';

export interface MacroTradeLogisticsSpillover {
  cycleNudge: number;
  investmentNudge: number;
  productivityNudge: number;
  summary: string | null;
}

/** Read-only V10.15 trade logistics / supply-chain spillover (Agent 15 domain; never mutates trade state). */
export function readMacroTradeLogisticsSpilloverFromV1015(inputs: MacroEconomyInputs): MacroTradeLogisticsSpillover {
  const tr: any = inputs.trade;
  const logistics: any =
    tr?.logistics ??
    tr?.supplyChain ??
    inputs.nationalSystems?.tradeLogistics ??
    inputs.nationalSystems?.trade?.logistics;
  if (!logistics && !tr) return { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null };

  let cycleNudge = 0;
  let investmentNudge = 0;
  let productivityNudge = 0;
  let summary: string | null = null;

  const backlog = String(
    logistics?.portBacklogBand ??
      logistics?.backlogBand ??
      tr?.logisticsBacklogBand ??
      logistics?.congestionBand ??
      ''
  );
  const reliability = String(
    logistics?.routeReliability?.band ??
      logistics?.reliabilityBand ??
      tr?.shippingReliabilityBand ??
      ''
  );
  const leadTime = String(logistics?.leadTimeBand ?? logistics?.transitBand ?? tr?.leadTimeBand ?? '');

  if (backlog === 'severe' || backlog === 'critical' || backlog === 'gridlocked') {
    cycleNudge -= 3;
    investmentNudge -= 2;
    productivityNudge -= 2;
    summary = `Severe trade logistics backlog (${backlog}) drags macro cycle and throughput read.`;
  } else if (backlog === 'elevated' || backlog === 'stressed') {
    cycleNudge -= 2;
    investmentNudge -= 1;
    summary = `Elevated logistics congestion (${backlog}) weighs on macro cycle interpretation.`;
  } else if (backlog === 'clear' || backlog === 'fluid') {
    cycleNudge += 0.5;
    productivityNudge += 0.5;
  }

  if (reliability === 'fragile' || reliability === 'disrupted' || reliability === 'critical') {
    cycleNudge -= 2;
    productivityNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Fragile shipping reliability caps external productivity spillover.';
  } else if (reliability === 'robust' || reliability === 'high') {
    productivityNudge += 1;
    investmentNudge += 0.5;
  }

  if (leadTime === 'extended' || leadTime === 'critical' || leadTime === 'severe') {
    investmentNudge -= 2;
    cycleNudge -= 1;
    summary = (summary ? summary + ' ' : '') + 'Extended trade lead times defer macro investment timing read.';
  }

  return {
    cycleNudge: v1014macroClamp(cycleNudge, -5, 5),
    investmentNudge: v1014macroClamp(investmentNudge, -5, 5),
    productivityNudge: v1014macroClamp(productivityNudge, -4, 4),
    summary
  };
}

export function applyMacroTradeLogisticsSpillover(
  scores: { productivityScore: number; investmentScore: number; cycleScore: number },
  spillover: MacroTradeLogisticsSpillover
): typeof scores {
  return {
    productivityScore: scores.productivityScore + spillover.productivityNudge,
    investmentScore: scores.investmentScore + spillover.investmentNudge,
    cycleScore: scores.cycleScore + spillover.cycleNudge
  };
}
