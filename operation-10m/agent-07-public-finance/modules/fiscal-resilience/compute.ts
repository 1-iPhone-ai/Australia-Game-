import type { FiscalOutcomeBand, V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { AppliedFiscalShock, FiscalResilienceAssessment, FiscalShockDefinition } from './types';
import { FISCAL_RESILIENCE_SCHEMA } from './types';

export const FISCAL_SHOCK_CATALOG: Record<string, FiscalShockDefinition> = {
  commodity_drop: {
    id: 'commodity_drop',
    kind: 'commodity_revenue_drop',
    label: 'Commodity revenue shortfall',
    revenueCapacityDelta: -8,
    headroomDelta: -4,
    maintenanceLoadDelta: 0,
    durationTurns: 4,
    warnOnly: true
  },
  disaster_surge: {
    id: 'disaster_surge',
    kind: 'disaster_recovery_surge',
    label: 'Disaster recovery expenditure surge',
    revenueCapacityDelta: -2,
    headroomDelta: -10,
    maintenanceLoadDelta: 6,
    durationTurns: 6,
    warnOnly: true
  },
  rate_shock: {
    id: 'rate_shock',
    kind: 'rate_shock_debt_service',
    label: 'Global rate shock on debt service',
    revenueCapacityDelta: 0,
    headroomDelta: -6,
    maintenanceLoadDelta: 0,
    durationTurns: 3,
    warnOnly: true
  },
  migration_dividend: {
    id: 'migration_dividend',
    kind: 'migration_dividend',
    label: 'Migration-driven revenue dividend',
    revenueCapacityDelta: 4,
    headroomDelta: 3,
    maintenanceLoadDelta: 1,
    durationTurns: 5,
    warnOnly: false
  }
};

function pressureFromHeadroom(headroom: number): V1012FiscalSnapshot['pressure'] {
  if (headroom >= 12) return 'comfortable';
  if (headroom >= 5) return 'healthy';
  if (headroom >= 0) return 'tight';
  if (headroom >= -8) return 'strained';
  return 'critical';
}

function bandFromStress(score: number): FiscalOutcomeBand {
  if (score >= 72) return 'strong';
  if (score >= 55) return 'healthy';
  if (score >= 40) return 'mixed';
  if (score >= 22) return 'weak';
  return 'critical';
}

function applyShock(base: V1012FiscalSnapshot, shock: FiscalShockDefinition, turn: number): AppliedFiscalShock {
  const revenueCapacity = Math.max(0, Math.min(100, base.revenueCapacity + shock.revenueCapacityDelta));
  const fiscalHeadroom = base.fiscalHeadroom + shock.headroomDelta;
  const maintenanceLoad = Math.max(0, base.maintenanceLoad + shock.maintenanceLoadDelta);
  let debtServiceLoad = base.debtServiceLoad;
  if (shock.kind === 'rate_shock_debt_service' && base.debtEnabled) {
    debtServiceLoad = Math.round((debtServiceLoad + base.debtLevel * 0.06) * 10) / 10;
  }
  const adjusted: V1012FiscalSnapshot = {
    ...base,
    turn,
    revenueCapacity,
    fiscalHeadroom,
    maintenanceLoad,
    debtServiceLoad,
    pressure: pressureFromHeadroom(fiscalHeadroom)
  };
  return {
    shockId: shock.id,
    turnApplied: turn,
    turnsRemaining: shock.durationTurns,
    adjustedSnapshot: adjusted,
    pressureAfter: adjusted.pressure,
    narrative: `${shock.label}: revenue ${shock.revenueCapacityDelta >= 0 ? '+' : ''}${shock.revenueCapacityDelta}, headroom ${shock.headroomDelta >= 0 ? '+' : ''}${shock.headroomDelta}.`
  };
}

export function assessFiscalResilience(
  turn: number,
  baseline: V1012FiscalSnapshot,
  shockIds: string[]
): FiscalResilienceAssessment {
  const warnings: string[] = [];
  let working = { ...baseline, turn };
  const shocksApplied: AppliedFiscalShock[] = [];

  for (const id of shockIds) {
    const def = FISCAL_SHOCK_CATALOG[id];
    if (!def) {
      warnings.push(`Unknown shock id: ${id}`);
      continue;
    }
    const applied = applyShock(working, def, turn);
    shocksApplied.push(applied);
    working = applied.adjustedSnapshot;
  }

  const reservePolicy = baseline.reservePolicy ?? 'standard';
  let reserveAdequacy: FiscalResilienceAssessment['reserveAdequacy'] = 'adequate';
  if (working.fiscalHeadroom >= 10 && reservePolicy === 'prudent') reserveAdequacy = 'strong';
  else if (working.fiscalHeadroom < 0) reserveAdequacy = 'depleted';
  else if (working.fiscalHeadroom < 4) reserveAdequacy = 'thin';

  const stressScore = Math.max(
    0,
    Math.min(
      100,
      70 +
        working.fiscalHeadroom * 1.5 +
        working.revenueCapacity * 0.2 -
        working.debtServiceLoad * 2 -
        working.maintenanceLoad * 0.8
    )
  );

  let recoveryTurnsEstimate: number | null = null;
  if (working.pressure === 'strained' || working.pressure === 'critical') {
    recoveryTurnsEstimate = working.pressure === 'critical' ? 8 : 4;
    warnings.push('Shock stack elevated fiscal pressure — staged recovery recommended.');
  }

  if (shocksApplied.some(s => FISCAL_SHOCK_CATALOG[s.shockId]?.kind === 'disaster_recovery_surge')) {
    warnings.push('Disaster recovery shock increases maintenance load — check recurring commitments.');
  }

  return {
    schemaVersion: FISCAL_RESILIENCE_SCHEMA,
    turn,
    baselinePressure: baseline.pressure,
    shocksApplied,
    compositeStressBand: bandFromStress(stressScore),
    reserveAdequacy,
    recoveryTurnsEstimate,
    warnings
  };
}
