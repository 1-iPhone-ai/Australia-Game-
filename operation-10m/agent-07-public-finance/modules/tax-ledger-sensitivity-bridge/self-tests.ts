import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildNationalRevenueLedger } from '../revenue-ledger/compute';
import { buildTaxExpenditureStatement } from '../tax-expenditure/compute';
import { buildTaxPolicySensitivityReport } from '../tax-policy-sensitivity/compute';
import { buildTaxLedgerSensitivityBridgeReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runTaxLedgerSensitivityBridgeSelfTests(): {
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
  const persisted = createInitialFiscalOutcomesPersisted(9);
  const { state } = computeFiscalOutcomesLayer({ turn: 9, v1012: v }, persisted);
  const ledger = buildNationalRevenueLedger({ turn: 9, v1012: v, taxInstruments: state.taxInstruments });
  const taxExp = buildTaxExpenditureStatement(9, v);
  const taxSensitivity = buildTaxPolicySensitivityReport(9, v, ledger);
  const healthy = buildTaxLedgerSensitivityBridgeReport(9, v, taxExp, ledger, taxSensitivity);

  record('TLSB-T01', 'Three tax ledger sensitivity checks', healthy.checks.length === 3, 'ok');
  record(
    'TLSB-T02',
    'Within tax ledger band',
    healthy.withinTaxLedgerBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'TLSB-T03',
    'Aligned with tax sensitivity',
    healthy.alignedWithTaxSensitivity,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
