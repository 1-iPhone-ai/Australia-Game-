import type { MacroTradeSpillover } from './bridge-v1015-trade.ts';
import type { MacroGeographySpillover } from './bridge-economic-geography.ts';
import type { MacroHouseholdSpillover } from './bridge-v1013-households.ts';
import type { MacroIndustrySpillover } from './bridge-v101-industries.ts';
import type { MacroFiscalSpillover } from './bridge-v1012-fiscal.ts';
import type { MacroTransmissionLayer, MacroTransmissionReport } from './types.ts';

export function buildMacroTransmissionReport(params: {
  turn: number;
  fiscal: MacroFiscalSpillover;
  household: MacroHouseholdSpillover;
  industry: MacroIndustrySpillover;
  trade: MacroTradeSpillover;
  geography: MacroGeographySpillover;
}): MacroTransmissionReport {
  const layers: MacroTransmissionLayer[] = [
    layer(
      'v10.12_fiscal',
      'Public finance',
      params.fiscal.cycleNudge,
      params.fiscal.investmentNudge,
      params.fiscal.productivityNudge,
      params.fiscal.summary
    ),
    layer('v10.13_households', 'Household demand', params.household.cycleNudge, params.household.investmentNudge, 0, params.household.summary),
    layer('v10.1_industries', 'Industry utilization', params.industry.cycleNudge, 0, params.industry.productivityNudge, params.industry.summary),
    layer('v10.15_trade', 'Trade & external', params.trade.cycleNudge, 0, params.trade.productivityNudge, params.trade.summary),
    layer('v10.11_geography', 'Economic geography', params.geography.cycleNudge, params.geography.investmentNudge, 0, params.geography.summary)
  ];
  const netCycleNudge = layers.reduce((a, l) => a + l.cycleContribution, 0);
  const netInvestmentNudge = layers.reduce((a, l) => a + l.investmentContribution, 0);
  const netProductivityNudge = layers.reduce((a, l) => a + l.productivityContribution, 0);
  const ranked = [...layers].sort(
    (a, b) =>
      Math.abs(b.cycleContribution) +
      Math.abs(b.investmentContribution) +
      Math.abs(b.productivityContribution) -
      (Math.abs(a.cycleContribution) + Math.abs(a.investmentContribution) + Math.abs(a.productivityContribution))
  );
  return {
    turn: params.turn,
    dominantLayerId: ranked[0] && magnitude(ranked[0]) > 0.01 ? ranked[0].systemId : null,
    layers,
    netCycleNudge,
    netInvestmentNudge,
    netProductivityNudge
  };
}

function layer(
  systemId: string,
  label: string,
  cycleContribution: number,
  investmentContribution: number,
  productivityContribution: number,
  summary: string | null
): MacroTransmissionLayer {
  return { systemId, label, cycleContribution, investmentContribution, productivityContribution, summary };
}

function magnitude(l: MacroTransmissionLayer): number {
  return Math.abs(l.cycleContribution) + Math.abs(l.investmentContribution) + Math.abs(l.productivityContribution);
}
