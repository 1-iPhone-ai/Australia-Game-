export const STATUTORY_BALANCES_SCHEMA = 'op10m-agent07-statutory-balances-v1';

export interface StatutoryBalanceBand {
  id: 'operating' | 'fiscal' | 'net_debt_anchor';
  label: string;
  balancePoints: number;
  anchorPoints: number;
  withinAnchor: boolean;
  warnOnly: boolean;
}

export interface StatutoryBalancesReport {
  schemaVersion: string;
  turn: number;
  bands: StatutoryBalanceBand[];
  netOperatingBalance: number;
  fiscalBalance: number;
  netDebtToCapacityRatio: number;
  allWithinSoftAnchors: boolean;
  narrative: string;
  warnings: string[];
}
