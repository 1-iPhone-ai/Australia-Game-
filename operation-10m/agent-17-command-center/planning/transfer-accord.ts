import type {
  Agent17CustodyIndexSnapshot,
  Agent17ReleaseAccordSnapshot,
  Agent17TransferAccordSnapshot,
  Agent17VaultIndexSnapshot,
} from '../types/command-center-types.ts';
import { custodyIndexBlocksRelease } from './custody-index.ts';
import { releaseAccordBlocksVault } from './release-accord.ts';
import { vaultIndexBlocksTransfer } from './vault-index.ts';

export interface Agent17TransferAccordInputs {
  vaultIndex: Agent17VaultIndexSnapshot;
  releaseAccord: Agent17ReleaseAccordSnapshot;
  custodyIndex: Agent17CustodyIndexSnapshot;
}

export function buildAgent17TransferAccord(
  inputs: Agent17TransferAccordInputs
): Agent17TransferAccordSnapshot {
  const legs: Agent17TransferAccordSnapshot['legs'] = [];

  legs.push({
    id: 'vault_sealed',
    label: 'Vault index vault-sealed',
    completed:
      inputs.vaultIndex.vaultSealed && !vaultIndexBlocksTransfer(inputs.vaultIndex),
    weight: 30,
  });

  legs.push({
    id: 'vault_band',
    label: 'Vault sealed or staging',
    completed:
      inputs.vaultIndex.band === 'sealed' || inputs.vaultIndex.band === 'staging',
    weight: 25,
  });

  legs.push({
    id: 'release_cleared',
    label: 'Release accord cleared-ready',
    completed:
      inputs.releaseAccord.releaseCleared &&
      !releaseAccordBlocksVault(inputs.releaseAccord),
    weight: 20,
  });

  legs.push({
    id: 'custody_clear',
    label: 'Custody index not blocking release',
    completed: !custodyIndexBlocksRelease(inputs.custodyIndex),
    weight: 15,
  });

  legs.push({
    id: 'vault_score',
    label: 'Vault score headroom',
    completed: inputs.vaultIndex.vaultScore >= 23,
    weight: 10,
  });

  const weighted = legs.reduce(
    (n, l) => n + (l.completed ? 100 : 5) * (l.weight / 100),
    0
  );
  const totalWeight = legs.reduce((n, l) => n + l.weight, 0);
  const transferScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const haltedSignals =
    vaultIndexBlocksTransfer(inputs.vaultIndex) ||
    releaseAccordBlocksVault(inputs.releaseAccord) ||
    custodyIndexBlocksRelease(inputs.custodyIndex);

  const band: Agent17TransferAccordSnapshot['band'] = haltedSignals
    ? 'halted'
    : transferScore >= 51 &&
        inputs.vaultIndex.band === 'sealed' &&
        inputs.releaseAccord.band === 'cleared'
      ? 'settled'
      : 'inflight';

  const transferSettled =
    band === 'settled' &&
    inputs.vaultIndex.vaultSealed &&
    !custodyIndexBlocksRelease(inputs.custodyIndex);

  return {
    transferScore,
    band,
    legs,
    vaultBand: inputs.vaultIndex.band,
    releaseBand: inputs.releaseAccord.band,
    transferSettled,
    headline: `Transfer ${band} (${transferScore}/100) · ${legs.filter(l => l.completed).length}/${legs.length} legs`,
  };
}

export function transferAccordBlocksVault(snapshot: Agent17TransferAccordSnapshot): boolean {
  return snapshot.band === 'halted' || !snapshot.transferSettled;
}
