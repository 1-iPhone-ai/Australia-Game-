import type {
  Agent17AuthorityCharterSnapshot,
  Agent17CommandPostureSnapshot,
  Agent17MandateWeaveSnapshot,
  Agent17SovereigntyLockSnapshot,
} from '../types/command-center-types.ts';
import { sovereigntyLockBlocksCommand } from './sovereignty-lock.ts';

export interface Agent17AuthorityCharterInputs {
  sovereigntyLock: Agent17SovereigntyLockSnapshot;
  mandateWeave: Agent17MandateWeaveSnapshot;
  commandPosture: Agent17CommandPostureSnapshot;
}

export function buildAgent17AuthorityCharter(
  inputs: Agent17AuthorityCharterInputs
): Agent17AuthorityCharterSnapshot {
  const articles: Agent17AuthorityCharterSnapshot['articles'] = [];

  articles.push({
    id: 'sovereignty_secured',
    label: 'Sovereignty lock engaged',
    ratified:
      inputs.sovereigntyLock.band === 'secured' ||
      inputs.sovereigntyLock.band === 'conditional',
    weight: 30,
  });

  articles.push({
    id: 'command_sovereignty',
    label: 'Command sovereignty asserted',
    ratified: inputs.sovereigntyLock.commandSovereignty,
    weight: 25,
  });

  articles.push({
    id: 'mandate_aligned',
    label: 'Mandate weave not frayed',
    ratified:
      inputs.mandateWeave.band === 'aligned' || inputs.mandateWeave.band === 'tensioned',
    weight: 20,
  });

  articles.push({
    id: 'posture_commanding',
    label: 'Command posture headroom',
    ratified:
      inputs.commandPosture.band === 'commanding' ||
      inputs.commandPosture.band === 'contested',
    weight: 15,
  });

  articles.push({
    id: 'posture_index',
    label: 'Posture index threshold',
    ratified: inputs.commandPosture.postureIndex >= 45,
    weight: 10,
  });

  const weighted = articles.reduce(
    (n, a) => n + (a.ratified ? 100 : 18) * (a.weight / 100),
    0
  );
  const totalWeight = articles.reduce((n, a) => n + a.weight, 0);
  const charterScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    sovereigntyLockBlocksCommand(inputs.sovereigntyLock) ||
    inputs.mandateWeave.band === 'frayed' ||
    inputs.commandPosture.band === 'degraded';

  const band: Agent17AuthorityCharterSnapshot['band'] = revokedSignals
    ? 'revoked'
    : charterScore >= 68 &&
        inputs.sovereigntyLock.band === 'secured' &&
        inputs.sovereigntyLock.commandSovereignty
      ? 'chartered'
      : 'provisional';

  const commandAuthority =
    band === 'chartered' &&
    inputs.sovereigntyLock.commandSovereignty &&
    !sovereigntyLockBlocksCommand(inputs.sovereigntyLock);

  return {
    charterScore,
    band,
    articles,
    lockBand: inputs.sovereigntyLock.band,
    weaveBand: inputs.mandateWeave.band,
    commandAuthority,
    headline: `Authority ${band} (${charterScore}/100) · ${articles.filter(a => a.ratified).length}/${articles.length} articles`,
  };
}

export function authorityCharterBlocksAccord(snapshot: Agent17AuthorityCharterSnapshot): boolean {
  return snapshot.band === 'revoked' || !snapshot.commandAuthority;
}
