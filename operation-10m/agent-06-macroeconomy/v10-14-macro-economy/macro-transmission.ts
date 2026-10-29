import type { MacroTradeSpillover } from './bridge-v1015-trade.ts';
import type { MacroGeographySpillover } from './bridge-economic-geography.ts';
import type { MacroHouseholdSpillover } from './bridge-v1013-households.ts';
import type { MacroIndustrySpillover } from './bridge-v101-industries.ts';
import type { MacroFiscalSpillover } from './bridge-v1012-fiscal.ts';
import type { MacroCreditSpillover } from './bridge-v1016-credit.ts';
import type { MacroInnovationSpillover } from './bridge-v104-innovation.ts';
import type { MacroWorkforceSpillover } from './bridge-v107-workforce.ts';
import type { MacroStrategicSpillover } from './bridge-v109-strategic.ts';
import type { MacroHousingSpillover } from './bridge-v1014-housing.ts';
import type { MacroInflationSpillover } from './bridge-v1010-inflation.ts';
import type { MacroEnergySpillover } from './bridge-v1018-energy.ts';
import type { MacroEventsSpillover } from './bridge-v105-events.ts';
import type { MacroCompaniesSpillover } from './bridge-v108-companies.ts';
import type { MacroTurnsSpillover } from './bridge-v102-turns.ts';
import type { MacroTransportSpillover } from './bridge-v1017-transport.ts';
import type { MacroTransmissionLayer, MacroTransmissionReport } from './types.ts';

const ZERO_SPILLOVER = { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null as string | null };

export function buildMacroTransmissionReport(params: {
  turn: number;
  fiscal: MacroFiscalSpillover;
  household: MacroHouseholdSpillover;
  industry: MacroIndustrySpillover;
  trade: MacroTradeSpillover;
  geography: MacroGeographySpillover;
  credit: MacroCreditSpillover;
  innovation: MacroInnovationSpillover;
  workforce: MacroWorkforceSpillover;
  strategic: MacroStrategicSpillover;
  housing: MacroHousingSpillover;
  inflation?: MacroInflationSpillover;
  energy?: MacroEnergySpillover;
  events?: MacroEventsSpillover;
  companies?: MacroCompaniesSpillover;
  turns?: MacroTurnsSpillover;
  transport?: MacroTransportSpillover;
}): MacroTransmissionReport {
  const inflation = params.inflation ?? ZERO_SPILLOVER;
  const energy = params.energy ?? ZERO_SPILLOVER;
  const events = params.events ?? ZERO_SPILLOVER;
  const companies = params.companies ?? ZERO_SPILLOVER;
  const turns = params.turns ?? ZERO_SPILLOVER;
  const transport = params.transport ?? ZERO_SPILLOVER;
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
    layer('v10.11_geography', 'Economic geography', params.geography.cycleNudge, params.geography.investmentNudge, 0, params.geography.summary),
    layer(
      'v10.16_credit',
      'Credit & financial conditions',
      params.credit.cycleNudge,
      params.credit.investmentNudge,
      params.credit.productivityNudge,
      params.credit.summary
    ),
    layer(
      'v10.4_innovation',
      'Innovation & productivity',
      params.innovation.cycleNudge,
      params.innovation.investmentNudge,
      params.innovation.productivityNudge,
      params.innovation.summary
    ),
    layer(
      'v10.7_workforce',
      'Workforce & labor market',
      params.workforce.cycleNudge,
      params.workforce.investmentNudge,
      params.workforce.productivityNudge,
      params.workforce.summary
    ),
    layer(
      'v10.9_strategic',
      'Strategic capital allocation',
      params.strategic.cycleNudge,
      params.strategic.investmentNudge,
      params.strategic.productivityNudge,
      params.strategic.summary
    ),
    layer(
      'v10.14_housing',
      'Housing & wellbeing',
      params.housing.cycleNudge,
      params.housing.investmentNudge,
      params.housing.productivityNudge,
      params.housing.summary
    ),
    layer(
      'v10.10_inflation',
      'Finance & inflation',
      inflation.cycleNudge,
      inflation.investmentNudge,
      inflation.productivityNudge,
      inflation.summary
    ),
    layer(
      'v10.18_energy',
      'Energy & environment',
      energy.cycleNudge,
      energy.investmentNudge,
      energy.productivityNudge,
      energy.summary
    ),
    layer(
      'v10.5_events',
      'Dynamic events & narrative',
      events.cycleNudge,
      events.investmentNudge,
      events.productivityNudge,
      events.summary
    ),
    layer(
      'v10.8_companies',
      'Companies & production',
      companies.cycleNudge,
      companies.investmentNudge,
      companies.productivityNudge,
      companies.summary
    ),
    layer(
      'v10.2_turns',
      'Turns & temporal cadence',
      turns.cycleNudge,
      turns.investmentNudge,
      turns.productivityNudge,
      turns.summary
    ),
    layer(
      'v10.17_transport',
      'Transport & infrastructure',
      transport.cycleNudge,
      transport.investmentNudge,
      transport.productivityNudge,
      transport.summary
    )
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
