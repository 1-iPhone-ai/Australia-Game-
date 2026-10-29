export const INFRASTRUCTURE_FISCAL_LOAD_SCHEMA = 'op10m-agent07-infrastructure-fiscal-load-v1';

export interface InfrastructureFiscalLoadLine {
  projectId: string;
  capitalPoints: number;
  serviceLoadPoints: number;
  envelopeShare: number;
  withinLoadBand: boolean;
}

export interface InfrastructureFiscalLoadReport {
  schemaVersion: string;
  turn: number;
  lines: InfrastructureFiscalLoadLine[];
  aggregateCapital: number;
  aggregateServiceLoad: number;
  envelopeCapacityPoints: number;
  loadToCapacityRatio: number;
  withinPortfolioLoadCap: boolean;
  feasibleUnderEnvelope: boolean;
  narrative: string;
  warnings: string[];
}
