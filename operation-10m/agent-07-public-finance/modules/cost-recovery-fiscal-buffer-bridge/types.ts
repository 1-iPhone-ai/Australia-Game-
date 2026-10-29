export const COST_RECOVERY_FISCAL_BUFFER_BRIDGE_SCHEMA =
  'op10m-agent07-cost-recovery-fiscal-buffer-bridge-v1';

export interface RecoveryBufferCheck {
  id: string;
  label: string;
  passed: boolean;
  observed: number;
  tolerance: number;
}

export interface CostRecoveryFiscalBufferBridgeReport {
  schemaVersion: string;
  turn: number;
  checks: RecoveryBufferCheck[];
  bridgeGapPoints: number;
  withinRecoveryBufferBand: boolean;
  alignedWithRecoveryRevenueCoherence: boolean;
  narrative: string;
  warnings: string[];
}
