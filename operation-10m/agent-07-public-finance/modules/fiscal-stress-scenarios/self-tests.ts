import { buildFiscalStressScenariosReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 71,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 26,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalStressScenariosSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildFiscalStressScenariosReport(10, snap({}));
  record('FSS01', 'Three fiscal stress scenarios', healthy.scenarios.length === 3, 'ok');
  record('FSS02', 'Healthy within stress appetite', healthy.withinStressAppetite, healthy.narrative);
  record(
    'FSS03',
    'Worst delta is most negative scenario',
    healthy.worstHeadroomDelta === Math.min(...healthy.scenarios.map(s => s.headroomDeltaPoints)),
    `worst=${healthy.worstHeadroomDelta}`
  );

  const heavy = buildFiscalStressScenariosReport(10, snap({ debtLevel: 58, debtServiceLoad: 19, maintenanceLoad: 17 }));
  record(
    'FSS04',
    'Heavy debt/demand raises aggregate breaches',
    heavy.aggregateBreaches >= healthy.aggregateBreaches,
    `${heavy.aggregateBreaches} vs ${healthy.aggregateBreaches}`
  );

  const critical = buildFiscalStressScenariosReport(10, snap({ pressure: 'critical', fiscalHeadroom: -24 }));
  record('FSS05', 'Critical pressure overrides appetite guard', critical.withinStressAppetite, 'ok');

  const prudent = buildFiscalStressScenariosReport(10, snap({ reservePolicy: 'prudent' }));
  record(
    'FSS06',
    'Prudent reserve shaves breach count',
    prudent.aggregateBreaches <= healthy.aggregateBreaches,
    `${prudent.aggregateBreaches} vs ${healthy.aggregateBreaches}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
