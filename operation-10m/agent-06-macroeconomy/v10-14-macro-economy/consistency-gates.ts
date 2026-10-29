import type { MacroConsistencyGate, MacroEconomyInputs, NationalMacroEconomyState } from './types.ts';

export function evaluateMacroConsistencyGates(
  state: NationalMacroEconomyState,
  inputs: MacroEconomyInputs
): MacroConsistencyGate[] {
  const gates: MacroConsistencyGate[] = [];
  if (!state.accounting.identityOk) {
    gates.push({
      id: 'accounting_identity',
      triggered: true,
      severity: 'warn',
      summary: `Regional share accounting residual ${state.accounting.identityResidual.toFixed(6)}`
    });
  }
  const pf: any = inputs.publicFinance;
  const hh: any = inputs.households;
  const fiscalPressure = String(pf?.pressure ?? pf?.fiscalPosition?.pressure ?? '');
  const demand = String(hh?.domesticDemand?.level ?? hh?.domesticDemand?.band ?? '');
  if (fiscalPressure === 'critical' && (demand === 'strong' || demand === 'surging' || demand === 'very_strong')) {
    gates.push({
      id: 'fiscal_household_tension',
      triggered: true,
      severity: 'info',
      summary: 'Critical fiscal capacity coexists with strong household demand — interpret macro signals carefully.'
    });
  }
  if (state.investmentClimate === 'frozen' && state.utilizationBand === 'tight') {
    gates.push({
      id: 'investment_utilization_mismatch',
      triggered: true,
      severity: 'info',
      summary: 'Frozen investment climate despite tight utilization — binding constraint may be financial, not capacity.'
    });
  }
  if (state.regionalDivergence.band === 'wide_spread' && state.cyclePhase === 'expansion') {
    gates.push({
      id: 'regional_divergence_expansion',
      triggered: true,
      severity: 'info',
      summary: 'National expansion masks wide regional productivity dispersion.'
    });
  }
  const tr: any = inputs.trade;
  const terms = String(tr?.termsOfTrade?.band ?? tr?.termsBand ?? '');
  if (terms === 'weak' && (fiscalPressure === 'critical' || fiscalPressure === 'strained')) {
    gates.push({
      id: 'trade_fiscal_stress',
      triggered: true,
      severity: 'warn',
      summary: 'Weak external terms coincide with strained fiscal capacity — macro downside risk elevated.'
    });
  }
  if (state.transmissionReport?.dominantLayerId === 'v10.15_trade' && state.cyclePhase === 'contraction') {
    gates.push({
      id: 'external_led_contraction',
      triggered: true,
      severity: 'info',
      summary: 'External demand layer dominates transmission while cycle is in contraction.'
    });
  }
  return gates;
}
