import type {
  Agent17CommandIndexSnapshot,
  Agent17DoctrineAccordSnapshot,
  Agent17MandateWeaveSnapshot,
  Agent17SovereigntyLockSnapshot,
} from '../types/command-center-types.ts';
import { doctrineAccordBlocksCommand } from './doctrine-accord.ts';
import { mandateWeaveBlocksSovereignty } from './mandate-weave.ts';
import { sovereigntyLockBlocksCommand } from './sovereignty-lock.ts';

export interface Agent17CommandIndexInputs {
  doctrineAccord: Agent17DoctrineAccordSnapshot;
  mandateWeave: Agent17MandateWeaveSnapshot;
  sovereigntyLock: Agent17SovereigntyLockSnapshot;
}

export function buildAgent17CommandIndex(
  inputs: Agent17CommandIndexInputs
): Agent17CommandIndexSnapshot {
  const pillars: Agent17CommandIndexSnapshot['pillars'] = [];

  pillars.push({
    id: 'doctrine_ratified',
    label: 'Doctrine accord ratified',
    standing:
      inputs.doctrineAccord.doctrineRatified && !doctrineAccordBlocksCommand(inputs.doctrineAccord),
    weight: 30,
  });

  pillars.push({
    id: 'doctrine_band',
    label: 'Doctrine ratified or provisional',
    standing:
      inputs.doctrineAccord.band === 'ratified' || inputs.doctrineAccord.band === 'provisional',
    weight: 25,
  });

  pillars.push({
    id: 'sovereignty_secured',
    label: 'Sovereignty lock engaged',
    standing:
      inputs.sovereigntyLock.band === 'secured' ||
      inputs.sovereigntyLock.band === 'conditional',
    weight: 20,
  });

  pillars.push({
    id: 'mandate_aligned',
    label: 'Mandate weave not frayed',
    standing:
      inputs.mandateWeave.band === 'aligned' || inputs.mandateWeave.band === 'tensioned',
    weight: 15,
  });

  pillars.push({
    id: 'weave_score',
    label: 'Mandate weave score headroom',
    standing: inputs.mandateWeave.weaveScore >= 40,
    weight: 10,
  });

  const weighted = pillars.reduce(
    (n, p) => n + (p.standing ? 100 : 10) * (p.weight / 100),
    0
  );
  const totalWeight = pillars.reduce((n, p) => n + p.weight, 0);
  const commandScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const degradedSignals =
    doctrineAccordBlocksCommand(inputs.doctrineAccord) ||
    sovereigntyLockBlocksCommand(inputs.sovereigntyLock) ||
    mandateWeaveBlocksSovereignty(inputs.mandateWeave);

  const band: Agent17CommandIndexSnapshot['band'] = degradedSignals
    ? 'degraded'
    : commandScore >= 68 &&
        inputs.doctrineAccord.band === 'ratified' &&
        inputs.sovereigntyLock.commandSovereignty
      ? 'supreme'
      : 'delegated';

  const commandReady =
    band === 'supreme' &&
    inputs.doctrineAccord.doctrineRatified &&
    !doctrineAccordBlocksCommand(inputs.doctrineAccord);

  return {
    commandScore,
    band,
    pillars,
    doctrineBand: inputs.doctrineAccord.band,
    lockBand: inputs.sovereigntyLock.band,
    commandReady,
    headline: `Command ${band} (${commandScore}/100) · ${pillars.filter(p => p.standing).length}/${pillars.length} pillars`,
  };
}

export function commandIndexBlocksFederation(snapshot: Agent17CommandIndexSnapshot): boolean {
  return snapshot.band === 'degraded' || !snapshot.commandReady;
}
