export const INTERGOVERNMENTAL_GRANTS_SCHEMA = 'op10m-agent07-intergovernmental-grants-v1';

export type GrantProgramKind =
  | 'health_block'
  | 'education_reform'
  | 'roads_partner'
  | 'housing_accelerator'
  | 'disaster_recovery';

export interface GrantAllocationLine {
  programId: GrantProgramKind;
  label: string;
  federalPoints: number;
  stateMatchRequired: number;
  performanceGateMet: boolean;
  clawbackPoints: number;
  netToStates: number;
}

export interface IntergovernmentalGrantsReport {
  schemaVersion: string;
  turn: number;
  allocations: GrantAllocationLine[];
  totalFederal: number;
  totalClawback: number;
  netFederalOutlay: number;
  performancePassRate: number;
  reconciledToIgrPool: boolean;
  warnings: string[];
}
