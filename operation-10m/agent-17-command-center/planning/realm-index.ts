import type {
  Agent17DynastyAccordSnapshot,
  Agent17ImperialAccordSnapshot,
  Agent17RealmIndexSnapshot,
  Agent17ThroneIndexSnapshot,
} from '../types/command-center-types.ts';
import { dynastyAccordBlocksRealm } from './dynasty-accord.ts';
import { imperialAccordBlocksThrone } from './imperial-accord.ts';
import { throneIndexBlocksDynasty } from './throne-index.ts';

export interface Agent17RealmIndexInputs {
  dynastyAccord: Agent17DynastyAccordSnapshot;
  throneIndex: Agent17ThroneIndexSnapshot;
  imperialAccord: Agent17ImperialAccordSnapshot;
}

export function buildAgent17RealmIndex(
  inputs: Agent17RealmIndexInputs
): Agent17RealmIndexSnapshot {
  const banners: Agent17RealmIndexSnapshot['banners'] = [];

  banners.push({
    id: 'dynasty_proclaimed',
    label: 'Dynasty accord proclaimed',
    raised:
      inputs.dynastyAccord.dynastyProclaimed &&
      !dynastyAccordBlocksRealm(inputs.dynastyAccord),
    weight: 30,
  });

  banners.push({
    id: 'dynasty_band',
    label: 'Dynasty lineage or branch',
    raised:
      inputs.dynastyAccord.band === 'lineage' || inputs.dynastyAccord.band === 'branch',
    weight: 25,
  });

  banners.push({
    id: 'throne_seated',
    label: 'Throne index throne-seated',
    raised:
      inputs.throneIndex.throneSeated && !throneIndexBlocksDynasty(inputs.throneIndex),
    weight: 20,
  });

  banners.push({
    id: 'imperial_clear',
    label: 'Imperial accord not blocking throne',
    raised: !imperialAccordBlocksThrone(inputs.imperialAccord),
    weight: 15,
  });

  banners.push({
    id: 'dynasty_score',
    label: 'Dynasty score headroom',
    raised: inputs.dynastyAccord.dynastyScore >= 40,
    weight: 10,
  });

  const weighted = banners.reduce(
    (n, b) => n + (b.raised ? 100 : 6) * (b.weight / 100),
    0
  );
  const totalWeight = banners.reduce((n, b) => n + b.weight, 0);
  const realmScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const fallenSignals =
    dynastyAccordBlocksRealm(inputs.dynastyAccord) ||
    throneIndexBlocksDynasty(inputs.throneIndex) ||
    imperialAccordBlocksThrone(inputs.imperialAccord);

  const band: Agent17RealmIndexSnapshot['band'] = fallenSignals
    ? 'fallen'
    : realmScore >= 62 &&
        inputs.dynastyAccord.band === 'lineage' &&
        inputs.throneIndex.band === 'seated'
      ? 'unified'
      : 'fractured';

  const realmUnified =
    band === 'unified' &&
    inputs.dynastyAccord.dynastyProclaimed &&
    !dynastyAccordBlocksRealm(inputs.dynastyAccord);

  return {
    realmScore,
    band,
    banners,
    dynastyBand: inputs.dynastyAccord.band,
    throneBand: inputs.throneIndex.band,
    realmUnified,
    headline: `Realm ${band} (${realmScore}/100) · ${banners.filter(b => b.raised).length}/${banners.length} banners`,
  };
}

export function realmIndexBlocksSuccession(snapshot: Agent17RealmIndexSnapshot): boolean {
  return snapshot.band === 'fallen' || !snapshot.realmUnified;
}
