import type { MacroCreditSpillover } from './bridge-v1016-credit.ts';
import type { MacroFiscalSpillover } from './bridge-v1012-fiscal.ts';
import type { MacroEconomyInputs, MacroPolicyStanceLabel, MacroPolicyStanceSnapshot, NationalMacroEconomyState } from './types.ts';

export type { MacroPolicyStanceLabel, MacroPolicyStanceSnapshot };

/** Read-only synthesis of fiscal + credit spillovers vs realized macro climate. */
export function buildMacroPolicyStanceSnapshot(params: {
  inputs: MacroEconomyInputs;
  state: Pick<NationalMacroEconomyState, 'investmentClimate' | 'cyclePhase'>;
  fiscal: MacroFiscalSpillover;
  credit: MacroCreditSpillover;
}): MacroPolicyStanceSnapshot {
  const fiscalTilt = params.fiscal.investmentNudge + params.fiscal.cycleNudge * 0.5;
  const creditTilt = params.credit.investmentNudge + params.credit.cycleNudge * 0.5;
  const net = fiscalTilt + creditTilt;
  let stance: MacroPolicyStanceLabel = 'neutral';
  if (net >= 2) stance = 'accommodative';
  else if (net <= -4) stance = 'restrictive';
  if (fiscalTilt <= -2 && creditTilt <= -2) stance = 'conflicted';

  const pf: any = params.inputs.publicFinance;
  const pressure = String(pf?.pressure ?? pf?.fiscalPosition?.pressure ?? '');
  let summary = `Policy read: ${stance} (fiscal tilt ${fiscalTilt.toFixed(1)}, credit tilt ${creditTilt.toFixed(1)}).`;
  if (stance === 'conflicted' && pressure === 'strained') {
    summary += ' Simultaneous fiscal and credit tightening — macro stabilizers may bind.';
  }
  if (params.state.investmentClimate === 'frozen' && stance === 'restrictive') {
    summary += ' Investment climate frozen under restrictive composite stance.';
  }
  return { stance, fiscalTilt, creditTilt, summary };
}
