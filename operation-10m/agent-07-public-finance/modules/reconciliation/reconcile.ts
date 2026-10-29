import { V1014_BOUNDARY_RULES } from '../fiscal-outcomes/boundaries';
import type { NationalBudgetEnvelope, V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { NationalRevenueLedger } from '../revenue-ledger/types';
import type { InfrastructureFinancingSummary } from '../infrastructure-financing/types';

export const RECONCILIATION_SCHEMA = 'op10m-agent07-reconciliation-v1';

export interface FiscalReconciliationCheck {
  id: string;
  label: string;
  passed: boolean;
  severity: 'info' | 'caution' | 'major';
  detail: string;
}

export interface FiscalReconciliationReport {
  schemaVersion: string;
  turn: number;
  checks: FiscalReconciliationCheck[];
  allPassed: boolean;
  boundaryRuleCount: number;
}

export interface FiscalReconciliationInputs {
  turn: number;
  v1012: V1012FiscalSnapshot;
  envelope: NationalBudgetEnvelope;
  revenueLedger: NationalRevenueLedger;
  infraSummary: InfrastructureFinancingSummary | null;
  /** Actor-side cash that must never appear in national revenue (sanity fixture). */
  actorCashProbe?: number;
}

export function runFiscalReconciliation(inputs: FiscalReconciliationInputs): FiscalReconciliationReport {
  const checks: FiscalReconciliationCheck[] = [];
  const { envelope, v1012, revenueLedger, infraSummary } = inputs;

  checks.push({
    id: 'R01',
    label: 'Envelope allocation does not exceed total capacity',
    passed: envelope.allocatedPoints <= envelope.totalCapacityPoints + 1,
    severity: 'major',
    detail: `allocated=${envelope.allocatedPoints}, capacity=${envelope.totalCapacityPoints}`
  });

  checks.push({
    id: 'R02',
    label: 'Negative headroom triggers rebalance flag',
    passed: v1012.fiscalHeadroom < 0 ? envelope.rebalanceNeeded : true,
    severity: 'caution',
    detail: `headroom=${v1012.fiscalHeadroom}, rebalance=${envelope.rebalanceNeeded}`
  });

  checks.push({
    id: 'R03',
    label: 'Revenue ledger reconciled to V10.12 structural capacity',
    passed: revenueLedger.reconciledToV1012,
    severity: 'major',
    detail: revenueLedger.reconciliationNotes.join(' ')
  });

  checks.push({
    id: 'R04',
    label: 'Debt service reserve line tracks service load',
    passed: (() => {
      const line = envelope.lines.find(l => l.category === 'debt_service_reserve');
      if (!line) return false;
      return line.committedPoints >= v1012.debtServiceLoad * 0.3;
    })(),
    severity: 'caution',
    detail: `debtServiceLoad=${v1012.debtServiceLoad}`
  });

  if (infraSummary) {
    checks.push({
      id: 'R05',
      label: 'Infrastructure aggregate service within soft ceiling',
      passed: infraSummary.aggregateServiceLoad <= 28,
      severity: 'caution',
      detail: `aggregateService=${infraSummary.aggregateServiceLoad}`
    });
  }

  checks.push({
    id: 'R06',
    label: 'Actor cash probe excluded from revenue streams',
    passed: (() => {
      const probe = inputs.actorCashProbe ?? 0;
      if (probe <= 0) return true;
      return !revenueLedger.streams.some(s => s.deltaPoints === probe && s.kind === 'tax_instrument');
    })(),
    severity: 'major',
    detail: `probe=${inputs.actorCashProbe ?? 0} (boundary audit)`
  });

  checks.push({
    id: 'R07',
    label: 'Boundary rules catalog present',
    passed: V1014_BOUNDARY_RULES.length >= 6,
    severity: 'info',
    detail: `rules=${V1014_BOUNDARY_RULES.length}`
  });

  const allPassed = checks.every(c => c.passed);
  return {
    schemaVersion: RECONCILIATION_SCHEMA,
    turn: inputs.turn,
    checks,
    allPassed,
    boundaryRuleCount: V1014_BOUNDARY_RULES.length
  };
}
