export const FEDERAL_STATE_SCHEMA = 'op10m-agent07-federal-state-v1';

export type AustralianStateCode = 'NSW' | 'VIC' | 'QLD' | 'WA' | 'SA' | 'TAS' | 'ACT' | 'NT';

export type TransferInstrumentKind =
  | 'gst_igr'
  | 'health_specific'
  | 'education_specific'
  | 'infrastructure_partner'
  | 'general_purpose';

export interface StateFiscalProfile {
  stateCode: AustralianStateCode;
  populationWeight: number;
  fiscalCapacityIndex: number;
  remoteLoadFactor: number;
}

export interface IntergovernmentalTransferLine {
  stateCode: AustralianStateCode;
  instrument: TransferInstrumentKind;
  entitlementPoints: number;
  adjustmentPoints: number;
  netPoints: number;
  explanation: string;
}

export interface FederalStateReconciliation {
  schemaVersion: string;
  turn: number;
  federalRevenuePool: number;
  totalEntitlements: number;
  totalAdjustments: number;
  residualFederal: number;
  reconciled: boolean;
  tolerancePoints: number;
  transfers: IntergovernmentalTransferLine[];
  verticalImbalanceIndex: number;
  warnings: string[];
}
