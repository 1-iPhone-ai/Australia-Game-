import type {
  Agent17ClosureAccordSnapshot,
  Agent17ReconciliationIndexSnapshot,
  Agent17SettlementIndexSnapshot,
  Agent17TransferAccordSnapshot,
} from '../types/command-center-types.ts';
import { closureAccordBlocksReconciliation } from './closure-accord.ts';
import { settlementIndexBlocksClosure } from './settlement-index.ts';
import { transferAccordBlocksSettlement } from './transfer-accord.ts';

export interface Agent17ReconciliationIndexInputs {
  closureAccord: Agent17ClosureAccordSnapshot;
  settlementIndex: Agent17SettlementIndexSnapshot;
  transferAccord: Agent17TransferAccordSnapshot;
}

export function buildAgent17ReconciliationIndex(
  inputs: Agent17ReconciliationIndexInputs
): Agent17ReconciliationIndexSnapshot {
  const entries: Agent17ReconciliationIndexSnapshot['entries'] = [];

  entries.push({
    id: 'closure_final',
    label: 'Closure accord closure-final',
    matched:
      inputs.closureAccord.closureFinal &&
      !closureAccordBlocksReconciliation(inputs.closureAccord),
    weight: 30,
  });

  entries.push({
    id: 'closure_band',
    label: 'Closure final or provisional',
    matched:
      inputs.closureAccord.band === 'final' || inputs.closureAccord.band === 'provisional',
    weight: 25,
  });

  entries.push({
    id: 'settlement_posted',
    label: 'Settlement index settlement-posted',
    matched:
      inputs.settlementIndex.settlementPosted &&
      !settlementIndexBlocksClosure(inputs.settlementIndex),
    weight: 20,
  });

  entries.push({
    id: 'transfer_clear',
    label: 'Transfer accord not blocking settlement',
    matched: !transferAccordBlocksSettlement(inputs.transferAccord),
    weight: 15,
  });

  entries.push({
    id: 'closure_score',
    label: 'Closure score headroom',
    matched: inputs.closureAccord.closureScore >= 20,
    weight: 10,
  });

  const weighted = entries.reduce(
    (n, e) => n + (e.matched ? 100 : 5) * (e.weight / 100),
    0
  );
  const totalWeight = entries.reduce((n, e) => n + e.weight, 0);
  const reconciliationScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const disputedSignals =
    closureAccordBlocksReconciliation(inputs.closureAccord) ||
    settlementIndexBlocksClosure(inputs.settlementIndex) ||
    transferAccordBlocksSettlement(inputs.transferAccord);

  const band: Agent17ReconciliationIndexSnapshot['band'] = disputedSignals
    ? 'disputed'
    : reconciliationScore >= 52 &&
        inputs.closureAccord.band === 'final' &&
        inputs.settlementIndex.band === 'posted'
      ? 'matched'
      : 'pending';

  const reconciliationMatched =
    band === 'matched' &&
    inputs.closureAccord.closureFinal &&
    !closureAccordBlocksReconciliation(inputs.closureAccord);

  return {
    reconciliationScore,
    band,
    entries,
    closureBand: inputs.closureAccord.band,
    settlementBand: inputs.settlementIndex.band,
    reconciliationMatched,
    headline: `Reconciliation ${band} (${reconciliationScore}/100) · ${entries.filter(e => e.matched).length}/${entries.length} entries`,
  };
}

export function reconciliationIndexBlocksFinality(
  snapshot: Agent17ReconciliationIndexSnapshot
): boolean {
  return snapshot.band === 'disputed' || !snapshot.reconciliationMatched;
}
