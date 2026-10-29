export const PUBLIC_SECTOR_BALANCE_SHEET_SCHEMA = 'op10m-agent07-public-sector-balance-sheet-v1';

export interface BalanceSheetLine {
  id: string;
  category: 'financial_asset' | 'non_financial_asset' | 'liability' | 'net_worth';
  label: string;
  points: number;
  shareOfTotal: number;
}

export interface PublicSectorBalanceSheetReport {
  schemaVersion: string;
  turn: number;
  lines: BalanceSheetLine[];
  totalAssetsPoints: number;
  totalLiabilitiesPoints: number;
  netWorthPoints: number;
  netWorthRatio: number;
  liquidAssetSlice: number;
  withinNetWorthFloor: boolean;
  liquidSliceCoherentWithCash: boolean;
  narrative: string;
  warnings: string[];
}
