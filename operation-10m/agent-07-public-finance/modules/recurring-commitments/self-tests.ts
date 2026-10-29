import {
  computeFiscalOutcomesLayer,
  createInitialFiscalOutcomesPersisted
} from '../fiscal-outcomes/compute';
import { scheduleRecurringCommitments, DEFAULT_RECURRING_COMMITMENTS } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export interface RecurringSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 1,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runRecurringCommitmentsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: RecurringSelfTestResult[];
} {
  const results: RecurringSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const { state } = computeFiscalOutcomesLayer(
    { turn: 2, v1012: snap({ turn: 2 }) },
    createInitialFiscalOutcomesPersisted()
  );
  const schedule = scheduleRecurringCommitments(2, snap({ turn: 2 }), state.budget);
  record(
    'RCM01',
    'Every-turn pulses fire on turn 2',
    schedule.pulses.length >= 3 && schedule.totalLoadThisTurn > 0,
    `pulses=${schedule.pulses.length}, load=${schedule.totalLoadThisTurn}`
  );

  const evenTurn = scheduleRecurringCommitments(4, snap({ turn: 4 }), state.budget);
  const oddTurn = scheduleRecurringCommitments(3, snap({ turn: 3 }), state.budget);
  const regionalEven = evenTurn.pulses.some(p => p.commitmentId === 'rc_regional_transfers');
  const regionalOdd = oddTurn.pulses.some(p => p.commitmentId === 'rc_regional_transfers');
  record(
    'RCM02',
    'Biennial regional transfer cadence',
    regionalEven && !regionalOdd,
    `even=${regionalEven}, odd=${regionalOdd}`
  );

  const tight = computeFiscalOutcomesLayer(
    { turn: 1, v1012: snap({ fiscalHeadroom: -15, pressure: 'critical' }) },
    createInitialFiscalOutcomesPersisted()
  ).state;
  const tightSchedule = scheduleRecurringCommitments(1, snap({ fiscalHeadroom: -15, pressure: 'critical' }), tight.budget);
  record(
    'RCM03',
    'Mandatory load tracked separately',
    tightSchedule.mandatoryLoad <= tightSchedule.totalLoadThisTurn,
    `mandatory=${tightSchedule.mandatoryLoad}, total=${tightSchedule.totalLoadThisTurn}`
  );

  record(
    'RCM04',
    'Default catalog size',
    DEFAULT_RECURRING_COMMITMENTS.length >= 4,
    `defs=${DEFAULT_RECURRING_COMMITMENTS.length}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
