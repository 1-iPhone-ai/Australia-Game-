import type {
  Agent17CompactIndexSnapshot,
  Agent17DoctrineAccordSnapshot,
  Agent17FederationAccordSnapshot,
  Agent17UnityAccordSnapshot,
} from '../types/command-center-types.ts';
import { doctrineAccordBlocksCommand } from './doctrine-accord.ts';
import { federationAccordBlocksOps } from './federation-accord.ts';
import { unityAccordBlocksPact } from './unity-accord.ts';

export interface Agent17CompactIndexInputs {
  unityAccord: Agent17UnityAccordSnapshot;
  federationAccord: Agent17FederationAccordSnapshot;
  doctrineAccord: Agent17DoctrineAccordSnapshot;
}

export function buildAgent17CompactIndex(
  inputs: Agent17CompactIndexInputs
): Agent17CompactIndexSnapshot {
  const facets: Agent17CompactIndexSnapshot['facets'] = [];

  facets.push({
    id: 'unity_achieved',
    label: 'Unity accord achieved',
    locked:
      inputs.unityAccord.unityAchieved && !unityAccordBlocksPact(inputs.unityAccord),
    weight: 30,
  });

  facets.push({
    id: 'unity_band',
    label: 'Unity unified or partial',
    locked:
      inputs.unityAccord.band === 'unified' || inputs.unityAccord.band === 'partial',
    weight: 25,
  });

  facets.push({
    id: 'federation_unified',
    label: 'Federation accord unified',
    locked:
      inputs.federationAccord.federationUnified &&
      !federationAccordBlocksOps(inputs.federationAccord),
    weight: 20,
  });

  facets.push({
    id: 'doctrine_ratified',
    label: 'Doctrine accord ratified path',
    locked: !doctrineAccordBlocksCommand(inputs.doctrineAccord),
    weight: 15,
  });

  facets.push({
    id: 'unity_score',
    label: 'Unity score headroom',
    locked: inputs.unityAccord.unityScore >= 43,
    weight: 10,
  });

  const weighted = facets.reduce(
    (n, f) => n + (f.locked ? 100 : 7) * (f.weight / 100),
    0
  );
  const totalWeight = facets.reduce((n, f) => n + f.weight, 0);
  const compactScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const looseSignals =
    unityAccordBlocksPact(inputs.unityAccord) ||
    federationAccordBlocksOps(inputs.federationAccord) ||
    doctrineAccordBlocksCommand(inputs.doctrineAccord);

  const band: Agent17CompactIndexSnapshot['band'] = looseSignals
    ? 'loose'
    : compactScore >= 65 &&
        inputs.unityAccord.band === 'unified' &&
        !unityAccordBlocksPact(inputs.unityAccord)
      ? 'tight'
      : 'forming';

  const compactLocked =
    band === 'tight' &&
    inputs.unityAccord.unityAchieved &&
    !federationAccordBlocksOps(inputs.federationAccord);

  return {
    compactScore,
    band,
    facets,
    unityBand: inputs.unityAccord.band,
    federationBand: inputs.federationAccord.band,
    compactLocked,
    headline: `Compact ${band} (${compactScore}/100) · ${facets.filter(f => f.locked).length}/${facets.length} facets`,
  };
}

export function compactIndexBlocksSovereign(snapshot: Agent17CompactIndexSnapshot): boolean {
  return snapshot.band === 'loose' || !snapshot.compactLocked;
}
