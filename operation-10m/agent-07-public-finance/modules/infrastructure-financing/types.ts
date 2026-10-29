export const INFRA_FINANCING_SCHEMA = 'op10m-agent07-infra-financing-v1';

export type InfrastructureFinancingVehicle =
  | 'paygo_appropriation'
  | 'sovereign_bond_series'
  | 'state_borrowing_facility'
  | 'ppp_availability'
  | 'grant_match_federal'
  | 'off_budget_entity'
  | 'debt_funded_acceleration';

export interface InfrastructureProjectFundingRequest {
  projectId: string;
  title: string;
  regionIds: string[];
  capitalPoints: number;
  maintenancePointsPerTurn: number;
  strategicWeight: number;
  preferredVehicle: InfrastructureFinancingVehicle;
}

export interface InfrastructureFundingStackLine {
  vehicle: InfrastructureFinancingVehicle;
  capitalPoints: number;
  serviceLoadDelta: number;
  envelopeCategory: 'infrastructure_capital' | 'maintenance_backlog' | 'debt_service_reserve';
  warnOnly: boolean;
  explanation: string;
}

export interface InfrastructureFundingPlan {
  projectId: string;
  totalCapitalPoints: number;
  stack: InfrastructureFundingStackLine[];
  fiscalHeadroomAfter: number;
  debtServiceAfter: number;
  feasible: boolean;
  warnings: string[];
}

export interface InfrastructureFinancingSummary {
  schemaVersion: string;
  turn: number;
  plans: InfrastructureFundingPlan[];
  aggregateCapital: number;
  aggregateServiceLoad: number;
  bindingWarnings: string[];
}
