import type {
  Agent17CanonIndexSnapshot,
  Agent17DynastyAccordSnapshot,
  Agent17RealmIndexSnapshot,
  Agent17SuccessionAccordSnapshot,
} from '../types/command-center-types.ts';
import { dynastyAccordBlocksRealm } from './dynasty-accord.ts';
import { realmIndexBlocksSuccession } from './realm-index.ts';
import { successionAccordBlocksCanon } from './succession-accord.ts';

export interface Agent17CanonIndexInputs {
  successionAccord: Agent17SuccessionAccordSnapshot;
  realmIndex: Agent17RealmIndexSnapshot;
  dynastyAccord: Agent17DynastyAccordSnapshot;
}

export function buildAgent17CanonIndex(
  inputs: Agent17CanonIndexInputs
): Agent17CanonIndexSnapshot {
  const verses: Agent17CanonIndexSnapshot['verses'] = [];

  verses.push({
    id: 'succession_anchored',
    label: 'Succession accord anchored',
    inscribed:
      inputs.successionAccord.successionAnchored &&
      !successionAccordBlocksCanon(inputs.successionAccord),
    weight: 30,
  });

  verses.push({
    id: 'succession_band',
    label: 'Succession anchored or contested',
    inscribed:
      inputs.successionAccord.band === 'anchored' ||
      inputs.successionAccord.band === 'contested',
    weight: 25,
  });

  verses.push({
    id: 'realm_unified',
    label: 'Realm index realm-unified',
    inscribed:
      inputs.realmIndex.realmUnified && !realmIndexBlocksSuccession(inputs.realmIndex),
    weight: 20,
  });

  verses.push({
    id: 'dynasty_clear',
    label: 'Dynasty accord not blocking realm',
    inscribed: !dynastyAccordBlocksRealm(inputs.dynastyAccord),
    weight: 15,
  });

  verses.push({
    id: 'succession_score',
    label: 'Succession score headroom',
    inscribed: inputs.successionAccord.successionScore >= 38,
    weight: 10,
  });

  const weighted = verses.reduce(
    (n, v) => n + (v.inscribed ? 100 : 6) * (v.weight / 100),
    0
  );
  const totalWeight = verses.reduce((n, v) => n + v.weight, 0);
  const canonScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    successionAccordBlocksCanon(inputs.successionAccord) ||
    realmIndexBlocksSuccession(inputs.realmIndex) ||
    dynastyAccordBlocksRealm(inputs.dynastyAccord);

  const band: Agent17CanonIndexSnapshot['band'] = revokedSignals
    ? 'revoked'
    : canonScore >= 61 &&
        inputs.successionAccord.band === 'anchored' &&
        inputs.realmIndex.band === 'unified'
      ? 'ratified'
      : 'draft';

  const canonRatified =
    band === 'ratified' &&
    inputs.successionAccord.successionAnchored &&
    !successionAccordBlocksCanon(inputs.successionAccord);

  return {
    canonScore,
    band,
    verses,
    successionBand: inputs.successionAccord.band,
    realmBand: inputs.realmIndex.band,
    canonRatified,
    headline: `Canon ${band} (${canonScore}/100) · ${verses.filter(v => v.inscribed).length}/${verses.length} verses`,
  };
}

export function canonIndexBlocksLegitimacy(snapshot: Agent17CanonIndexSnapshot): boolean {
  return snapshot.band === 'revoked' || !snapshot.canonRatified;
}
