import type {
  Agent17CustodyIndexSnapshot,
  Agent17EndorsementAccordSnapshot,
  Agent17ReleaseAccordSnapshot,
  Agent17VaultIndexSnapshot,
} from '../types/command-center-types.ts';
import { custodyIndexBlocksRelease } from './custody-index.ts';
import { endorsementAccordBlocksCustody } from './endorsement-accord.ts';
import { releaseAccordBlocksVault } from './release-accord.ts';

export interface Agent17VaultIndexInputs {
  releaseAccord: Agent17ReleaseAccordSnapshot;
  custodyIndex: Agent17CustodyIndexSnapshot;
  endorsementAccord: Agent17EndorsementAccordSnapshot;
}

export function buildAgent17VaultIndex(
  inputs: Agent17VaultIndexInputs
): Agent17VaultIndexSnapshot {
  const slots: Agent17VaultIndexSnapshot['slots'] = [];

  slots.push({
    id: 'release_cleared',
    label: 'Release accord cleared',
    locked:
      inputs.releaseAccord.releaseCleared &&
      !releaseAccordBlocksVault(inputs.releaseAccord),
    weight: 30,
  });

  slots.push({
    id: 'release_band',
    label: 'Release cleared or queued',
    locked:
      inputs.releaseAccord.band === 'cleared' || inputs.releaseAccord.band === 'queued',
    weight: 25,
  });

  slots.push({
    id: 'custody_held',
    label: 'Custody index custody-held',
    locked:
      inputs.custodyIndex.custodyHeld && !custodyIndexBlocksRelease(inputs.custodyIndex),
    weight: 20,
  });

  slots.push({
    id: 'endorsement_clear',
    label: 'Endorsement accord not blocking custody',
    locked: !endorsementAccordBlocksCustody(inputs.endorsementAccord),
    weight: 15,
  });

  slots.push({
    id: 'release_score',
    label: 'Release score headroom',
    locked: inputs.releaseAccord.releaseScore >= 24,
    weight: 10,
  });

  const weighted = slots.reduce(
    (n, s) => n + (s.locked ? 100 : 6) * (s.weight / 100),
    0
  );
  const totalWeight = slots.reduce((n, s) => n + s.weight, 0);
  const vaultScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const compromisedSignals =
    releaseAccordBlocksVault(inputs.releaseAccord) ||
    custodyIndexBlocksRelease(inputs.custodyIndex) ||
    endorsementAccordBlocksCustody(inputs.endorsementAccord);

  const band: Agent17VaultIndexSnapshot['band'] = compromisedSignals
    ? 'compromised'
    : vaultScore >= 54 &&
        inputs.releaseAccord.band === 'cleared' &&
        inputs.custodyIndex.band === 'held'
      ? 'sealed'
      : 'staging';

  const vaultSealed =
    band === 'sealed' &&
    inputs.releaseAccord.releaseCleared &&
    !releaseAccordBlocksVault(inputs.releaseAccord);

  return {
    vaultScore,
    band,
    slots,
    releaseBand: inputs.releaseAccord.band,
    custodyBand: inputs.custodyIndex.band,
    vaultSealed,
    headline: `Vault ${band} (${vaultScore}/100) · ${slots.filter(s => s.locked).length}/${slots.length} slots`,
  };
}

export function vaultIndexBlocksTransfer(snapshot: Agent17VaultIndexSnapshot): boolean {
  return snapshot.band === 'compromised' || !snapshot.vaultSealed;
}
