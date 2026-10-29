import type {
  Agent17ClosureAccordSnapshot,
  Agent17SettlementIndexSnapshot,
  Agent17TransferAccordSnapshot,
  Agent17VaultIndexSnapshot,
} from '../types/command-center-types.ts';
import { settlementIndexBlocksClosure } from './settlement-index.ts';
import { transferAccordBlocksSettlement } from './transfer-accord.ts';
import { vaultIndexBlocksTransfer } from './vault-index.ts';

export interface Agent17ClosureAccordInputs {
  settlementIndex: Agent17SettlementIndexSnapshot;
  transferAccord: Agent17TransferAccordSnapshot;
  vaultIndex: Agent17VaultIndexSnapshot;
}

export function buildAgent17ClosureAccord(
  inputs: Agent17ClosureAccordInputs
): Agent17ClosureAccordSnapshot {
  const filings: Agent17ClosureAccordSnapshot['filings'] = [];

  filings.push({
    id: 'settlement_posted',
    label: 'Settlement index settlement-posted',
    filed:
      inputs.settlementIndex.settlementPosted &&
      !settlementIndexBlocksClosure(inputs.settlementIndex),
    weight: 30,
  });

  filings.push({
    id: 'settlement_band',
    label: 'Settlement posted or pending',
    filed:
      inputs.settlementIndex.band === 'posted' || inputs.settlementIndex.band === 'pending',
    weight: 25,
  });

  filings.push({
    id: 'transfer_settled',
    label: 'Transfer accord settled-ready',
    filed:
      inputs.transferAccord.transferSettled &&
      !transferAccordBlocksSettlement(inputs.transferAccord),
    weight: 20,
  });

  filings.push({
    id: 'vault_clear',
    label: 'Vault index not blocking transfer',
    filed: !vaultIndexBlocksTransfer(inputs.vaultIndex),
    weight: 15,
  });

  filings.push({
    id: 'settlement_score',
    label: 'Settlement score headroom',
    filed: inputs.settlementIndex.settlementScore >= 21,
    weight: 10,
  });

  const weighted = filings.reduce(
    (n, f) => n + (f.filed ? 100 : 5) * (f.weight / 100),
    0
  );
  const totalWeight = filings.reduce((n, f) => n + f.weight, 0);
  const closureScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const reopenedSignals =
    settlementIndexBlocksClosure(inputs.settlementIndex) ||
    transferAccordBlocksSettlement(inputs.transferAccord) ||
    vaultIndexBlocksTransfer(inputs.vaultIndex);

  const band: Agent17ClosureAccordSnapshot['band'] = reopenedSignals
    ? 'reopened'
    : closureScore >= 50 &&
        inputs.settlementIndex.band === 'posted' &&
        inputs.transferAccord.band === 'settled'
      ? 'final'
      : 'provisional';

  const closureFinal =
    band === 'final' &&
    inputs.settlementIndex.settlementPosted &&
    !vaultIndexBlocksTransfer(inputs.vaultIndex);

  return {
    closureScore,
    band,
    filings,
    settlementBand: inputs.settlementIndex.band,
    transferBand: inputs.transferAccord.band,
    closureFinal,
    headline: `Closure ${band} (${closureScore}/100) · ${filings.filter(f => f.filed).length}/${filings.length} filings`,
  };
}

export function closureAccordBlocksSettlement(snapshot: Agent17ClosureAccordSnapshot): boolean {
  return snapshot.band === 'reopened' || !snapshot.closureFinal;
}
