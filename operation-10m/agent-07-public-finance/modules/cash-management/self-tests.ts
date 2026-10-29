import { buildCashManagementReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runCashManagementSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildCashManagementReport(11, snap({}));
  record('CM01', 'Operating and capital TGA lines', healthy.lines.length === 2, 'ok');
  record('CM02', 'Healthy within drawdown limit', healthy.withinDrawdownLimit, healthy.narrative);
  record('CM03', 'Runway turns non-negative', healthy.runwayTurns >= 0, `runway=${healthy.runwayTurns}`);

  const prudent = buildCashManagementReport(11, snap({ reservePolicy: 'prudent', fiscalHeadroom: 12 }));
  record(
    'CM04',
    'Prudent reserve lifts closing balance',
    prudent.aggregateClosingBalance >= healthy.aggregateClosingBalance,
    `${prudent.aggregateClosingBalance} vs ${healthy.aggregateClosingBalance}`
  );

  const eoy = buildCashManagementReport(11, snap({ fiscalHeadroom: -2, maintenanceLoad: 16, debtServiceLoad: 14 }));
  record('CM05', 'Stressed fiscal position may fail drawdown', eoy.withinDrawdownLimit === false || eoy.runwayBand !== 'comfortable', eoy.narrative);

  const critical = buildCashManagementReport(11, snap({ pressure: 'critical', fiscalHeadroom: -20 }));
  record('CM06', 'Critical pressure overrides drawdown guard', critical.withinDrawdownLimit, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
