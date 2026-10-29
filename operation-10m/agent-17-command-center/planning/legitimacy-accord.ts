import type {
  Agent17CanonIndexSnapshot,
  Agent17LegitimacyAccordSnapshot,
  Agent17RealmIndexSnapshot,
  Agent17SuccessionAccordSnapshot,
} from '../types/command-center-types.ts';
import { canonIndexBlocksLegitimacy } from './canon-index.ts';
import { realmIndexBlocksSuccession } from './realm-index.ts';
import { successionAccordBlocksCanon } from './succession-accord.ts';

export interface Agent17LegitimacyAccordInputs {
  canonIndex: Agent17CanonIndexSnapshot;
  successionAccord: Agent17SuccessionAccordSnapshot;
  realmIndex: Agent17RealmIndexSnapshot;
}

export function buildAgent17LegitimacyAccord(
  inputs: Agent17LegitimacyAccordInputs
): Agent17LegitimacyAccordSnapshot {
  const proofs: Agent17LegitimacyAccordSnapshot['proofs'] = [];

  proofs.push({
    id: 'canon_ratified',
    label: 'Canon index canon-ratified',
    settled:
      inputs.canonIndex.canonRatified && !canonIndexBlocksLegitimacy(inputs.canonIndex),
    weight: 30,
  });

  proofs.push({
    id: 'canon_band',
    label: 'Canon ratified or draft',
    settled:
      inputs.canonIndex.band === 'ratified' || inputs.canonIndex.band === 'draft',
    weight: 25,
  });

  proofs.push({
    id: 'succession_anchored',
    label: 'Succession accord anchored-ready',
    settled:
      inputs.successionAccord.successionAnchored &&
      !successionAccordBlocksCanon(inputs.successionAccord),
    weight: 20,
  });

  proofs.push({
    id: 'realm_clear',
    label: 'Realm index not blocking succession',
    settled: !realmIndexBlocksSuccession(inputs.realmIndex),
    weight: 15,
  });

  proofs.push({
    id: 'canon_score',
    label: 'Canon score headroom',
    settled: inputs.canonIndex.canonScore >= 37,
    weight: 10,
  });

  const weighted = proofs.reduce(
    (n, p) => n + (p.settled ? 100 : 5) * (p.weight / 100),
    0
  );
  const totalWeight = proofs.reduce((n, p) => n + p.weight, 0);
  const legitimacyScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const forfeitSignals =
    canonIndexBlocksLegitimacy(inputs.canonIndex) ||
    successionAccordBlocksCanon(inputs.successionAccord) ||
    realmIndexBlocksSuccession(inputs.realmIndex);

  const band: Agent17LegitimacyAccordSnapshot['band'] = forfeitSignals
    ? 'forfeit'
    : legitimacyScore >= 58 &&
        inputs.canonIndex.band === 'ratified' &&
        inputs.successionAccord.band === 'anchored'
      ? 'settled'
      : 'disputed';

  const legitimacySettled =
    band === 'settled' &&
    inputs.canonIndex.canonRatified &&
    !realmIndexBlocksSuccession(inputs.realmIndex);

  return {
    legitimacyScore,
    band,
    proofs,
    canonBand: inputs.canonIndex.band,
    successionBand: inputs.successionAccord.band,
    legitimacySettled,
    headline: `Legitimacy ${band} (${legitimacyScore}/100) · ${proofs.filter(p => p.settled).length}/${proofs.length} proofs`,
  };
}

export function legitimacyAccordBlocksCanon(snapshot: Agent17LegitimacyAccordSnapshot): boolean {
  return snapshot.band === 'forfeit' || !snapshot.legitimacySettled;
}

export function legitimacyAccordBlocksCharter(snapshot: Agent17LegitimacyAccordSnapshot): boolean {
  return snapshot.band === 'forfeit' || !snapshot.legitimacySettled;
}
