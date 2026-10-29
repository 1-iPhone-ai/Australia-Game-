import type {
  Agent17ReleaseAccordSnapshot,
  Agent17SettlementIndexSnapshot,
  Agent17TransferAccordSnapshot,
  Agent17VaultIndexSnapshot,
} from '../types/command-center-types.ts';
import { releaseAccordBlocksVault } from './release-accord.ts';
import { transferAccordBlocksSettlement } from './transfer-accord.ts';
import { vaultIndexBlocksTransfer } from './vault-index.ts';

export interface Agent17SettlementIndexInputs {
  transferAccord: Agent17TransferAccordSnapshot;
  vaultIndex: Agent17VaultIndexSnapshot;
  releaseAccord: Agent17ReleaseAccordSnapshot;
}

export function buildAgent17SettlementIndex(
  inputs: Agent17SettlementIndexInputs
): Agent17SettlementIndexSnapshot {
  const lines: Agent17SettlementIndexSnapshot['lines'] = [];

  lines.push({
    id: 'transfer_settled',
    label: 'Transfer accord settled',
    booked:
      inputs.transferAccord.transferSettled &&
      !transferAccordBlocksSettlement(inputs.transferAccord),
    weight: 30,
  });

  lines.push({
    id: 'transfer_band',
    label: 'Transfer settled or inflight',
    booked:
      inputs.transferAccord.band === 'settled' || inputs.transferAccord.band === 'inflight',
    weight: 25,
  });

  lines.push({
    id: 'vault_sealed',
    label: 'Vault index vault-sealed',
    booked:
      inputs.vaultIndex.vaultSealed && !vaultIndexBlocksTransfer(inputs.vaultIndex),
    weight: 20,
  });

  lines.push({
    id: 'release_clear',
    label: 'Release accord not blocking vault',
    booked: !releaseAccordBlocksVault(inputs.releaseAccord),
    weight: 15,
  });

  lines.push({
    id: 'transfer_score',
    label: 'Transfer score headroom',
    booked: inputs.transferAccord.transferScore >= 22,
    weight: 10,
  });

  const weighted = lines.reduce(
    (n, l) => n + (l.booked ? 100 : 6) * (l.weight / 100),
    0
  );
  const totalWeight = lines.reduce((n, l) => n + l.weight, 0);
  const settlementScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const failedSignals =
    transferAccordBlocksSettlement(inputs.transferAccord) ||
    vaultIndexBlocksTransfer(inputs.vaultIndex) ||
    releaseAccordBlocksVault(inputs.releaseAccord);

  const band: Agent17SettlementIndexSnapshot['band'] = failedSignals
    ? 'failed'
    : settlementScore >= 53 &&
        inputs.transferAccord.band === 'settled' &&
        inputs.vaultIndex.band === 'sealed'
      ? 'posted'
      : 'pending';

  const settlementPosted =
    band === 'posted' &&
    inputs.transferAccord.transferSettled &&
    !transferAccordBlocksSettlement(inputs.transferAccord);

  return {
    settlementScore,
    band,
    lines,
    transferBand: inputs.transferAccord.band,
    vaultBand: inputs.vaultIndex.band,
    settlementPosted,
    headline: `Settlement ${band} (${settlementScore}/100) · ${lines.filter(l => l.booked).length}/${lines.length} lines`,
  };
}

export function settlementIndexBlocksClosure(snapshot: Agent17SettlementIndexSnapshot): boolean {
  return snapshot.band === 'failed' || !snapshot.settlementPosted;
}
