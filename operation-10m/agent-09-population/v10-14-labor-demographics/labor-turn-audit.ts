import type { IntegratedLaborMarketBrief, LaborTurnAuditEntry, NationalLaborDemographicsState } from './types';

export function buildLaborTurnAuditEntry(
  state: NationalLaborDemographicsState,
  brief: IntegratedLaborMarketBrief
): LaborTurnAuditEntry {
  return {
    turn: state.turn,
    inputHash: state.inputHash,
    revision: state.revision,
    shockCount: state.activeMigrationShocks?.length ?? 0,
    compositePressureIndex: brief.compositePressureIndex,
    bandLine: `emp=${state.nationalEmploymentLinkage}, wage=${state.nationalWagePressure}, mig=${state.nationalMigrationFlow}, p=${brief.pressureBand}`
  };
}

export function appendLaborAuditHistory(
  history: LaborTurnAuditEntry[] | undefined,
  entry: LaborTurnAuditEntry,
  max = 16
): LaborTurnAuditEntry[] {
  const next = [...(history || []), entry];
  return next.slice(-max);
}
