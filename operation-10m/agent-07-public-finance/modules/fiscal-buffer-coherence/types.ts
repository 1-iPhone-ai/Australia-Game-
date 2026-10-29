export const FISCAL_BUFFER_COHERENCE_SCHEMA = 'op10m-agent07-fiscal-buffer-coherence-v1';

export interface FiscalBufferCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface FiscalBufferCoherenceReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalBufferCheck[];
  aggregateBufferPoints: number;
  allPassed: boolean;
  alignedWithRevenueForward: boolean;
  narrative: string;
  warnings: string[];
}
