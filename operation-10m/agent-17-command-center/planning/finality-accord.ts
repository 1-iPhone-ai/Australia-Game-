import type {
  Agent17ClosureAccordSnapshot,
  Agent17FinalityAccordSnapshot,
  Agent17ReconciliationIndexSnapshot,
  Agent17SettlementIndexSnapshot,
} from '../types/command-center-types.ts';
import { closureAccordBlocksReconciliation } from './closure-accord.ts';
import { reconciliationIndexBlocksFinality } from './reconciliation-index.ts';
import { settlementIndexBlocksClosure } from './settlement-index.ts';

export interface Agent17FinalityAccordInputs {
  reconciliationIndex: Agent17ReconciliationIndexSnapshot;
  closureAccord: Agent17ClosureAccordSnapshot;
  settlementIndex: Agent17SettlementIndexSnapshot;
}

export function buildAgent17FinalityAccord(
  inputs: Agent17FinalityAccordInputs
): Agent17FinalityAccordSnapshot {
  const attestations: Agent17FinalityAccordSnapshot['attestations'] = [];

  attestations.push({
    id: 'reconciliation_matched',
    label: 'Reconciliation index reconciliation-matched',
    attested:
      inputs.reconciliationIndex.reconciliationMatched &&
      !reconciliationIndexBlocksFinality(inputs.reconciliationIndex),
    weight: 30,
  });

  attestations.push({
    id: 'reconciliation_band',
    label: 'Reconciliation matched or pending',
    attested:
      inputs.reconciliationIndex.band === 'matched' ||
      inputs.reconciliationIndex.band === 'pending',
    weight: 25,
  });

  attestations.push({
    id: 'closure_final',
    label: 'Closure accord closure-ready',
    attested:
      inputs.closureAccord.closureFinal &&
      !closureAccordBlocksReconciliation(inputs.closureAccord),
    weight: 20,
  });

  attestations.push({
    id: 'settlement_clear',
    label: 'Settlement index not blocking closure',
    attested: !settlementIndexBlocksClosure(inputs.settlementIndex),
    weight: 15,
  });

  attestations.push({
    id: 'reconciliation_score',
    label: 'Reconciliation score headroom',
    attested: inputs.reconciliationIndex.reconciliationScore >= 19,
    weight: 10,
  });

  const weighted = attestations.reduce(
    (n, a) => n + (a.attested ? 100 : 4) * (a.weight / 100),
    0
  );
  const totalWeight = attestations.reduce((n, a) => n + a.weight, 0);
  const finalityScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    reconciliationIndexBlocksFinality(inputs.reconciliationIndex) ||
    closureAccordBlocksReconciliation(inputs.closureAccord) ||
    settlementIndexBlocksClosure(inputs.settlementIndex);

  const band: Agent17FinalityAccordSnapshot['band'] = revokedSignals
    ? 'revoked'
    : finalityScore >= 49 &&
        inputs.reconciliationIndex.band === 'matched' &&
        inputs.closureAccord.band === 'final'
      ? 'absolute'
      : 'conditional';

  const finalityAbsolute =
    band === 'absolute' &&
    inputs.reconciliationIndex.reconciliationMatched &&
    !settlementIndexBlocksClosure(inputs.settlementIndex);

  return {
    finalityScore,
    band,
    attestations,
    reconciliationBand: inputs.reconciliationIndex.band,
    closureBand: inputs.closureAccord.band,
    finalityAbsolute,
    headline: `Finality ${band} (${finalityScore}/100) · ${attestations.filter(a => a.attested).length}/${attestations.length} attestations`,
  };
}

export function finalityAccordBlocksReconciliation(
  snapshot: Agent17FinalityAccordSnapshot
): boolean {
  return snapshot.band === 'revoked' || !snapshot.finalityAbsolute;
}

export function finalityAccordBlocksArchive(snapshot: Agent17FinalityAccordSnapshot): boolean {
  return finalityAccordBlocksReconciliation(snapshot);
}
