import type { MacroIndustrySpillover } from './bridge-v101-industries.ts';
import type { MacroWorkforceSpillover } from './bridge-v107-workforce.ts';
import type { MacroCapacityBand, MacroCapacitySnapshot, NationalMacroEconomyState } from './types.ts';
import { v1014macroClamp } from './math.ts';

export type { MacroCapacityBand, MacroCapacitySnapshot };

/** Composite capacity read from utilization, industry, and workforce spillovers. */
export function buildMacroCapacitySnapshot(params: {
  state: Pick<NationalMacroEconomyState, 'utilizationIndex' | 'utilizationBand' | 'investmentClimate'>;
  industry: MacroIndustrySpillover;
  workforce: MacroWorkforceSpillover;
}): MacroCapacitySnapshot {
  const utilComponent = (params.state.utilizationIndex - 50) / 50;
  const industryComponent = params.industry.productivityNudge / 6;
  const workforceComponent = -(params.workforce.productivityNudge / 8);
  const raw = utilComponent * 0.45 + industryComponent * 0.25 + workforceComponent * 0.3;
  const index = v1014macroClamp(Math.round((50 + raw * 35) * 10) / 10, 0, 100);

  let band: MacroCapacityBand = 'balanced';
  if (index >= 78) band = 'binding';
  else if (index >= 62) band = 'tight';
  else if (index <= 28) band = 'deep_slack';
  else if (index <= 42) band = 'slack';

  let summary = `Capacity index ${index.toFixed(0)} (${band}) from utilization and labor/industry reads.`;
  if (band === 'binding' && params.state.investmentClimate === 'active') {
    summary += ' Binding capacity may limit further investment acceleration.';
  }
  if (band === 'deep_slack' && params.state.utilizationBand === 'slack') {
    summary += ' Deep slack suggests substantial macro headroom before constraints bind.';
  }

  return { index, band, summary };
}
