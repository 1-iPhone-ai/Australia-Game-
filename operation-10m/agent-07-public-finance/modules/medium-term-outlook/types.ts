import type { FiscalOutcomeBand } from '../fiscal-outcomes/types';

export const MEDIUM_TERM_OUTLOOK_SCHEMA = 'op10m-agent07-medium-term-outlook-v1';

export interface OutlookYearProjection {
  label: string;
  turn: number;
  revenueCapacity: number;
  fiscalHeadroom: number;
  debtServiceLoad: number;
  envelopeCapacity: number;
  underlyingCashBalance: number;
  pressure: 'comfortable' | 'healthy' | 'tight' | 'strained' | 'critical';
}

export interface MediumTermFiscalOutlook {
  schemaVersion: string;
  baseTurn: number;
  horizonTurns: number;
  projections: OutlookYearProjection[];
  averageHeadroom: number;
  worstPressure: OutlookYearProjection['pressure'];
  trajectoryBand: FiscalOutcomeBand;
  narrative: string;
  risks: string[];
}
