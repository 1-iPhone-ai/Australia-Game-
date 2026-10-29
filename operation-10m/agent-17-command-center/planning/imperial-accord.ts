import type {
  Agent17CompactIndexSnapshot,
  Agent17CrownIndexSnapshot,
  Agent17ImperialAccordSnapshot,
  Agent17SovereignAccordSnapshot,
} from '../types/command-center-types.ts';
import { compactIndexBlocksSovereign } from './compact-index.ts';
import { crownIndexBlocksImperial } from './crown-index.ts';
import { sovereignAccordBlocksCompact } from './sovereign-accord.ts';

export interface Agent17ImperialAccordInputs {
  crownIndex: Agent17CrownIndexSnapshot;
  sovereignAccord: Agent17SovereignAccordSnapshot;
  compactIndex: Agent17CompactIndexSnapshot;
}

export function buildAgent17ImperialAccord(
  inputs: Agent17ImperialAccordInputs
): Agent17ImperialAccordSnapshot {
  const edicts: Agent17ImperialAccordSnapshot['edicts'] = [];

  edicts.push({
    id: 'crown_invested',
    label: 'Crown index crown-invested',
    proclaimed:
      inputs.crownIndex.crownInvested && !crownIndexBlocksImperial(inputs.crownIndex),
    weight: 30,
  });

  edicts.push({
    id: 'crown_band',
    label: 'Crown invested or pending',
    proclaimed:
      inputs.crownIndex.band === 'invested' || inputs.crownIndex.band === 'pending',
    weight: 25,
  });

  edicts.push({
    id: 'compact_locked',
    label: 'Compact index compact-locked',
    proclaimed:
      inputs.compactIndex.compactLocked && !compactIndexBlocksSovereign(inputs.compactIndex),
    weight: 20,
  });

  edicts.push({
    id: 'sovereign_clear',
    label: 'Sovereign accord not blocking compact',
    proclaimed: !sovereignAccordBlocksCompact(inputs.sovereignAccord),
    weight: 15,
  });

  edicts.push({
    id: 'compact_score',
    label: 'Compact score headroom',
    proclaimed: inputs.compactIndex.compactScore >= 42,
    weight: 10,
  });

  const weighted = edicts.reduce(
    (n, e) => n + (e.proclaimed ? 100 : 5) * (e.weight / 100),
    0
  );
  const totalWeight = edicts.reduce((n, e) => n + e.weight, 0);
  const imperialScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const dissolvedSignals =
    crownIndexBlocksImperial(inputs.crownIndex) ||
    sovereignAccordBlocksCompact(inputs.sovereignAccord) ||
    compactIndexBlocksSovereign(inputs.compactIndex);

  const band: Agent17ImperialAccordSnapshot['band'] = dissolvedSignals
    ? 'dissolved'
    : imperialScore >= 61 &&
        inputs.crownIndex.band === 'invested' &&
        inputs.sovereignAccord.band === 'crowned'
      ? 'empire'
      : 'domain';

  const empireProclaimed =
    band === 'empire' &&
    inputs.crownIndex.crownInvested &&
    !compactIndexBlocksSovereign(inputs.compactIndex);

  return {
    imperialScore,
    band,
    edicts,
    crownBand: inputs.crownIndex.band,
    compactBand: inputs.compactIndex.band,
    empireProclaimed,
    headline: `Imperial ${band} (${imperialScore}/100) · ${edicts.filter(e => e.proclaimed).length}/${edicts.length} edicts`,
  };
}

export function imperialAccordBlocksCrown(snapshot: Agent17ImperialAccordSnapshot): boolean {
  return snapshot.band === 'dissolved' || !snapshot.empireProclaimed;
}

export function imperialAccordBlocksThrone(snapshot: Agent17ImperialAccordSnapshot): boolean {
  return snapshot.band === 'dissolved' || !snapshot.empireProclaimed;
}
