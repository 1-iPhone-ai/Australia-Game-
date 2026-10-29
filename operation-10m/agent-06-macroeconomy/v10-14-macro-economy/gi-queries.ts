import { BUSINESS_CYCLE_LABEL, V1014_MACRO_INVESTMENT_LABEL, V1014_MACRO_PRODUCTIVITY_LABEL } from './constants.ts';
import type { NationalMacroEconomyState } from './types.ts';

export type MacroGiTopic =
  | 'business_cycle'
  | 'productivity'
  | 'investment_climate'
  | 'regional_contribution'
  | 'accounting_identity'
  | 'sector_mix';

export interface MacroGiMatch {
  topic: MacroGiTopic;
  regionId?: string;
}

export function detectMacroEconomyQuestion(text: string): MacroGiMatch | null {
  const q = text.toLowerCase();
  if (!q.includes('macro') && !q.includes('business cycle') && !q.includes('productivity') && !q.includes('investment climate')) {
    if (!q.includes('regional share') && !q.includes('gross output')) return null;
  }
  const regionMatch = q.match(/\b(nsw|vic|qld|wa|sa|tas|nt|act)\b/i);
  const regionId = regionMatch ? regionMatch[1].toUpperCase() : undefined;
  if (q.includes('business cycle') || q.includes('cycle phase')) return { topic: 'business_cycle', regionId };
  if (q.includes('productivity')) return { topic: 'productivity', regionId };
  if (q.includes('investment climate') || q.includes('gross investment')) return { topic: 'investment_climate', regionId };
  if (q.includes('regional share') || (q.includes('contribution') && regionId)) {
    return { topic: 'regional_contribution', regionId };
  }
  if (q.includes('accounting') || q.includes('identity')) return { topic: 'accounting_identity', regionId };
  if (q.includes('sector mix') || q.includes('dominant sector')) return { topic: 'sector_mix', regionId };
  if (q.includes('macro economy') || q.includes('macroeconomy')) return { topic: 'business_cycle', regionId };
  return null;
}

export function composeMacroEconomyGiAnswer(state: NationalMacroEconomyState, match: MacroGiMatch): string {
  switch (match.topic) {
    case 'business_cycle':
      return `National business cycle: ${BUSINESS_CYCLE_LABEL[state.cyclePhase]} (momentum ${state.cycleMomentum.toFixed(2)}, duration ${state.cycleDurationTurns} turns).`;
    case 'productivity':
      return `Macro productivity: ${V1014_MACRO_PRODUCTIVITY_LABEL[state.productivityBand]} (index ${state.productivityIndex.toFixed(1)}).`;
    case 'investment_climate':
      return `Macro investment climate: ${V1014_MACRO_INVESTMENT_LABEL[state.investmentClimate]} (gross investment index ${state.grossInvestmentIndex.toFixed(1)}).`;
    case 'regional_contribution': {
      const row = match.regionId
        ? state.regionalContributions.find(r => r.regionId === match.regionId)
        : state.regionalContributions[0];
      if (!row) return 'No regional macro contribution row available.';
      return `${row.regionId} contributes ${(row.share * 100).toFixed(1)}% of national output mix (${row.role}, primary ${row.primarySector}).`;
    }
    case 'accounting_identity':
      return state.accounting.identityOk
        ? `Macro accounting identity holds (residual ${state.accounting.identityResidual.toExponential(2)}). Gross output index ${state.accounting.grossOutputIndex.toFixed(1)}.`
        : `Macro accounting identity drift detected (residual ${state.accounting.identityResidual.toFixed(6)}). Review regional share normalization.`;
    case 'sector_mix': {
      const top = Object.entries(state.sectorOutputMix).sort((a, b) => b[1] - a[1])[0];
      return top
        ? `National sector mix is led by ${top[0]} (${(top[1] * 100).toFixed(1)}% share-weighted).`
        : 'Sector mix unavailable.';
    }
    default:
      return 'Macro economy state is active.';
  }
}
