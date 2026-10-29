import { assessContingentLiabilities, catalogContingentExposures } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 60,
    fiscalHeadroom: partial.fiscalHeadroom ?? 4,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 3,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runContingentLiabilitiesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const catalog = catalogContingentExposures(12);
  record('CL01', 'Default exposure catalog populated', catalog.length >= 4, `n=${catalog.length}`);

  const base = assessContingentLiabilities(12, snap({}));
  record('CL02', 'Expected loss positive and bounded', base.expectedLossPoints > 0 && base.expectedLossPoints < 40, `el=${base.expectedLossPoints}`);
  record('CL03', 'Tail risk at least expected loss', base.tailRiskPoints >= base.expectedLossPoints, 'ok');
  record('CL04', 'Disclosures mirror exposures', base.disclosures.length === base.exposures.length, 'ok');

  const critical = assessContingentLiabilities(12, snap({ pressure: 'critical', fiscalHeadroom: -14, debtLevel: 55 }));
  record('CL05', 'Critical stress raises multiplier', critical.stressMultiplier > base.stressMultiplier, `${critical.stressMultiplier} vs ${base.stressMultiplier}`);
  record('CL06', 'Severe snapshot elevates stress multiplier', critical.stressMultiplier >= 1.4, `mult=${critical.stressMultiplier}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
