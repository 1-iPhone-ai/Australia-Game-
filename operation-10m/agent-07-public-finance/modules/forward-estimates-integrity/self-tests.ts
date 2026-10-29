import { buildForwardEstimatesIntegrityReport } from './compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 69,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runForwardEstimatesIntegritySelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const supp = buildSupplementaryEstimatesReport(9, v);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const healthy = buildForwardEstimatesIntegrityReport(9, v, myefo, supp, outlook);

  record('FEI-T01', 'Four integrity sub-checks', healthy.checks.length === 4, 'ok');
  record('FEI-T02', 'Healthy forward integrity passes', healthy.allPassed, healthy.narrative);
  record('FEI-T03', 'Coherent with supplementary under healthy', healthy.coherentWithSupplementary, 'ok');

  const strained = buildForwardEstimatesIntegrityReport(
    9,
    snap({ fiscalHeadroom: -5, pressure: 'strained' }),
    buildMultiYearExpenditureFramework(snap({ fiscalHeadroom: -5, pressure: 'strained' }), 3),
    buildSupplementaryEstimatesReport(9, snap({ fiscalHeadroom: -5, pressure: 'strained' })),
    buildMediumTermFiscalOutlook(snap({ fiscalHeadroom: -5, pressure: 'strained' }), 3)
  );
  record(
    'FEI-T04',
    'Strained snapshot runs integrity suite',
    strained.checks.length === 4,
    `allPassed=${strained.allPassed}`
  );

  const critical = buildForwardEstimatesIntegrityReport(
    9,
    snap({ pressure: 'critical', fiscalHeadroom: -20 }),
    myefo,
    supp,
    outlook
  );
  record('FEI-T05', 'Critical pressure override path', critical.allPassed || critical.coherentWithSupplementary, 'ok');

  record(
    'FEI-T06',
    'Band drift non-negative',
    healthy.bandDriftPoints >= 0,
    `drift=${healthy.bandDriftPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
