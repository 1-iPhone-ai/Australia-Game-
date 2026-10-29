import { buildMultiYearExpenditureFramework, buildExpenditureCeilingRows } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 8,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runMultiYearFrameworkSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const framework = buildMultiYearExpenditureFramework(snap({}), 3);
  record('MYF01', 'Forward bands cover horizon', framework.forwardBands.length === 4, `n=${framework.forwardBands.length}`);
  record('MYF02', 'Ceiling rows for envelope categories', framework.ceilings.length >= 6, `n=${framework.ceilings.length}`);
  record('MYF03', 'Healthy baseline within ceiling bands', framework.forwardBands.every(b => b.withinCeiling), 'ok');

  const ceilings = buildExpenditureCeilingRows(snap({ fiscalHeadroom: -6, pressure: 'strained' }));
  record('MYF04', 'Negative headroom can bind ceilings', ceilings.some(c => c.binding), `binding=${ceilings.filter(c => c.binding).length}`);

  const tight = buildMultiYearExpenditureFramework(
    snap({ fiscalHeadroom: -12, pressure: 'critical', debtServiceLoad: 19, maintenanceLoad: 16 }),
    2
  );
  record('MYF05', 'Critical path emits warnings', tight.warnings.length >= 1, `w=${tight.warnings.length}`);
  record('MYF06', 'Parameter settings growth bounded', framework.parameterSettingsGrowth > 0 && framework.parameterSettingsGrowth < 6, `g=${framework.parameterSettingsGrowth}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
