import { GTEL_ACCESS_RANK, GTEL_BASE_COMMODITY_INDEX } from './constants.ts';
import type {
  GTELCommodityQuote,
  GTELLogisticsStress,
  GTELPartnerMarket,
  GTELTradeBalanceSnapshot,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export function computeTradeBalanceSnapshot(params: {
  commodities: GTELCommodityQuote[];
  partners: GTELPartnerMarket[];
  logistics: GTELLogisticsStress;
  exportThroughput: number;
}): GTELTradeBalanceSnapshot {
  const exportWeighted = params.commodities.reduce((acc, c) => {
    const w = gtelNum(GTEL_BASE_COMMODITY_INDEX[c.commodity], 90) / 100;
    return acc + (c.effectiveIndex - c.baseIndex) * w;
  }, 0);
  const exportValueIndex = Math.round((100 + exportWeighted * 0.85) * 10) / 10;
  const externalPartners = params.partners.filter(p => p.id !== 'domestic_premium');
  const accessAvg =
    externalPartners.reduce((a, p) => a + GTEL_ACCESS_RANK[p.access] / 4, 0) / Math.max(1, externalPartners.length);
  const importPressureIndex = Math.round((100 + (0.55 - accessAvg) * 40 + params.logistics.freightPressure * 18) * 10) / 10;
  const netExportPulse = Math.round((exportValueIndex - importPressureIndex) * 10) / 10;
  let currentAccountTone: GTELTradeBalanceSnapshot['currentAccountTone'] = 'balanced';
  if (netExportPulse > 8) currentAccountTone = 'surplus';
  else if (netExportPulse > 3) currentAccountTone = 'mild_surplus';
  else if (netExportPulse < -8) currentAccountTone = 'deficit';
  else if (netExportPulse < -3) currentAccountTone = 'mild_deficit';
  const narrative =
    currentAccountTone === 'surplus'
      ? 'Export values are outpacing import-linked price pressure.'
      : currentAccountTone === 'deficit'
        ? 'Import pressure and logistics costs dominate export receipts.'
        : 'External trade flows are broadly balanced this turn.';
  return {
    exportValueIndex,
    importPressureIndex,
    netExportPulse,
    currentAccountTone,
    effectiveThroughput: params.logistics.effectiveExportThroughput,
    narrative,
  };
}

export function tradeBalanceGiNotes(balance: GTELTradeBalanceSnapshot | null | undefined): string[] {
  if (!balance) return [];
  return [`Trade balance: ${balance.currentAccountTone.replace(/_/g, ' ')} (net pulse ${balance.netExportPulse}).`, balance.narrative];
}
