import type {
  Agent17DynastyAccordSnapshot,
  Agent17RealmIndexSnapshot,
  Agent17SuccessionAccordSnapshot,
  Agent17ThroneIndexSnapshot,
} from '../types/command-center-types.ts';
import { dynastyAccordBlocksRealm } from './dynasty-accord.ts';
import { realmIndexBlocksSuccession } from './realm-index.ts';
import { throneIndexBlocksDynasty } from './throne-index.ts';

export interface Agent17SuccessionAccordInputs {
  realmIndex: Agent17RealmIndexSnapshot;
  dynastyAccord: Agent17DynastyAccordSnapshot;
  throneIndex: Agent17ThroneIndexSnapshot;
}

export function buildAgent17SuccessionAccord(
  inputs: Agent17SuccessionAccordInputs
): Agent17SuccessionAccordSnapshot {
  const clauses: Agent17SuccessionAccordSnapshot['clauses'] = [];

  clauses.push({
    id: 'realm_unified',
    label: 'Realm index realm-unified',
    anchored:
      inputs.realmIndex.realmUnified && !realmIndexBlocksSuccession(inputs.realmIndex),
    weight: 30,
  });

  clauses.push({
    id: 'realm_band',
    label: 'Realm unified or fractured',
    anchored:
      inputs.realmIndex.band === 'unified' || inputs.realmIndex.band === 'fractured',
    weight: 25,
  });

  clauses.push({
    id: 'dynasty_lineage',
    label: 'Dynasty accord lineage-ready',
    anchored:
      inputs.dynastyAccord.dynastyProclaimed && !dynastyAccordBlocksRealm(inputs.dynastyAccord),
    weight: 20,
  });

  clauses.push({
    id: 'throne_clear',
    label: 'Throne index not blocking dynasty',
    anchored: !throneIndexBlocksDynasty(inputs.throneIndex),
    weight: 15,
  });

  clauses.push({
    id: 'realm_score',
    label: 'Realm score headroom',
    anchored: inputs.realmIndex.realmScore >= 39,
    weight: 10,
  });

  const weighted = clauses.reduce(
    (n, c) => n + (c.anchored ? 100 : 5) * (c.weight / 100),
    0
  );
  const totalWeight = clauses.reduce((n, c) => n + c.weight, 0);
  const successionScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    realmIndexBlocksSuccession(inputs.realmIndex) ||
    dynastyAccordBlocksRealm(inputs.dynastyAccord) ||
    throneIndexBlocksDynasty(inputs.throneIndex);

  const band: Agent17SuccessionAccordSnapshot['band'] = voidSignals
    ? 'void'
    : successionScore >= 59 &&
        inputs.realmIndex.band === 'unified' &&
        inputs.dynastyAccord.band === 'lineage'
      ? 'anchored'
      : 'contested';

  const successionAnchored =
    band === 'anchored' &&
    inputs.realmIndex.realmUnified &&
    !throneIndexBlocksDynasty(inputs.throneIndex);

  return {
    successionScore,
    band,
    clauses,
    realmBand: inputs.realmIndex.band,
    dynastyBand: inputs.dynastyAccord.band,
    successionAnchored,
    headline: `Succession ${band} (${successionScore}/100) · ${clauses.filter(c => c.anchored).length}/${clauses.length} clauses`,
  };
}

export function successionAccordBlocksRealm(snapshot: Agent17SuccessionAccordSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.successionAnchored;
}
