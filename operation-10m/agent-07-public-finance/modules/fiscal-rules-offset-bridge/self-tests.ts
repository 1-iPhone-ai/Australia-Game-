import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { buildEfficiencyDividendRegisterReport } from '../efficiency-dividend-register/compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildFiscalRulesOffsetBridgeReport } from './compute';
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

export function runFiscalRulesOffsetBridgeSelfTests(): {
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
  const offsets = buildSpendingOffsetsReport(9, v);
  const rules = assessFiscalRulesFramework({
    turn: 9,
    v1012: v,
    envelopeContingencyPoints: 2,
    forwardSpendingGrowth: 2
  });
  const efficiency = buildEfficiencyDividendRegisterReport(9, v, offsets, rules);
  const healthy = buildFiscalRulesOffsetBridgeReport(9, v, rules, offsets, efficiency);

  record('FROB-T01', 'Three rules offset checks', healthy.checks.length === 3, 'ok');
  record(
    'FROB-T02',
    'Within rules offset band',
    healthy.withinRulesOffsetBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'FROB-T03',
    'Aligned with efficiency register',
    healthy.alignedWithEfficiencyRegister,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
