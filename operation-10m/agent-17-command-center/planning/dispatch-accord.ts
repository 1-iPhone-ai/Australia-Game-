import type {
  Agent17AuthorityCharterSnapshot,
  Agent17DelegationLadderSnapshot,
  Agent17DispatchAccordSnapshot,
  Agent17SovereigntyLockSnapshot,
} from '../types/command-center-types.ts';
import { authorityCharterBlocksAccord } from './authority-charter.ts';
import { sovereigntyLockBlocksCommand } from './sovereignty-lock.ts';

export interface Agent17DispatchAccordInputs {
  authorityCharter: Agent17AuthorityCharterSnapshot;
  sovereigntyLock: Agent17SovereigntyLockSnapshot;
  delegationLadder: Agent17DelegationLadderSnapshot;
}

export function buildAgent17DispatchAccord(
  inputs: Agent17DispatchAccordInputs
): Agent17DispatchAccordSnapshot {
  const provisions: Agent17DispatchAccordSnapshot['provisions'] = [];

  provisions.push({
    id: 'charter_chartered',
    label: 'Authority charter chartered',
    active:
      inputs.authorityCharter.band === 'chartered' ||
      inputs.authorityCharter.band === 'provisional',
    weight: 30,
  });

  provisions.push({
    id: 'command_authority',
    label: 'Command authority granted',
    active: inputs.authorityCharter.commandAuthority,
    weight: 25,
  });

  provisions.push({
    id: 'ladder_balance',
    label: 'Delegation ladder balanced',
    active: !inputs.delegationLadder.imbalanceFlag,
    weight: 20,
  });

  provisions.push({
    id: 'ladder_slots',
    label: 'Delegation slots remaining',
    active: inputs.delegationLadder.rungs.some(r => r.slotsRemaining > 0),
    weight: 15,
  });

  provisions.push({
    id: 'sovereignty_lock',
    label: 'Sovereignty lock not released',
    active: !sovereigntyLockBlocksCommand(inputs.sovereigntyLock),
    weight: 10,
  });

  const weighted = provisions.reduce(
    (n, p) => n + (p.active ? 100 : 16) * (p.weight / 100),
    0
  );
  const totalWeight = provisions.reduce((n, p) => n + p.weight, 0);
  const accordScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    authorityCharterBlocksAccord(inputs.authorityCharter) ||
    sovereigntyLockBlocksCommand(inputs.sovereigntyLock);

  const band: Agent17DispatchAccordSnapshot['band'] = voidSignals
    ? 'void'
    : accordScore >= 70 &&
        inputs.authorityCharter.band === 'chartered' &&
        !authorityCharterBlocksAccord(inputs.authorityCharter)
      ? 'ratified'
      : 'provisional';

  const dispatchAllowed =
    band === 'ratified' &&
    inputs.authorityCharter.commandAuthority &&
    !authorityCharterBlocksAccord(inputs.authorityCharter);

  return {
    accordScore,
    band,
    provisions,
    charterBand: inputs.authorityCharter.band,
    dispatchAllowed,
    headline: `Dispatch ${band} (${accordScore}/100) · ${provisions.filter(p => p.active).length}/${provisions.length} provisions`,
  };
}

export function dispatchAccordBlocksDispatch(snapshot: Agent17DispatchAccordSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.dispatchAllowed;
}
