import { scoreFiscalTransparencyIndex } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 58,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 15,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalTransparencySelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const minimal = scoreFiscalTransparencyIndex({
    turn: 8,
    v1012: snap({}),
    publishesTaxExpenditure: false,
    publishesMultiYearEstimates: false,
    publishesContingentRegister: false,
    publishesProgramOutcomes: false,
    auditLagTurns: 4
  });
  record('FTI01', 'Five transparency dimensions scored', minimal.dimensions.length === 5, `n=${minimal.dimensions.length}`);
  record('FTI02', 'Minimal disclosure stays basic tier', minimal.compositeTier === 'basic', minimal.compositeTier);

  const full = scoreFiscalTransparencyIndex({
    turn: 8,
    v1012: snap({ fiscalHeadroom: 10 }),
    publishesTaxExpenditure: true,
    publishesMultiYearEstimates: true,
    publishesContingentRegister: true,
    publishesProgramOutcomes: true,
    auditLagTurns: 1
  });
  record('FTI03', 'Full disclosure improves composite', full.compositeScore > minimal.compositeScore, `${full.compositeScore} vs ${minimal.compositeScore}`);
  record('FTI04', 'Open data ready when MYEFO + low lag', full.openDataReady === true, String(full.openDataReady));
  record('FTI05', 'Basic tier lists improvements', minimal.improvementActions.length >= 2, `n=${minimal.improvementActions.length}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
