import type {
  Agent17MemorialIndexSnapshot,
  Agent17ProvenanceAccordSnapshot,
  Agent17TestamentAccordSnapshot,
  Agent17WitnessIndexSnapshot,
} from '../types/command-center-types.ts';
import { provenanceAccordBlocksWitness } from './provenance-accord.ts';
import { testamentAccordBlocksMemorial } from './testament-accord.ts';
import { witnessIndexBlocksTestament } from './witness-index.ts';

export interface Agent17MemorialIndexInputs {
  testamentAccord: Agent17TestamentAccordSnapshot;
  witnessIndex: Agent17WitnessIndexSnapshot;
  provenanceAccord: Agent17ProvenanceAccordSnapshot;
}

export function buildAgent17MemorialIndex(
  inputs: Agent17MemorialIndexInputs
): Agent17MemorialIndexSnapshot {
  const inscriptions: Agent17MemorialIndexSnapshot['inscriptions'] = [];

  inscriptions.push({
    id: 'testament_binding',
    label: 'Testament accord testament-binding',
    enshrined:
      inputs.testamentAccord.testamentBinding &&
      !testamentAccordBlocksMemorial(inputs.testamentAccord),
    weight: 30,
  });

  inscriptions.push({
    id: 'testament_band',
    label: 'Testament binding or draft',
    enshrined:
      inputs.testamentAccord.band === 'binding' || inputs.testamentAccord.band === 'draft',
    weight: 25,
  });

  inscriptions.push({
    id: 'witness_affirmed',
    label: 'Witness index witness-affirmed',
    enshrined:
      inputs.witnessIndex.witnessAffirmed &&
      !witnessIndexBlocksTestament(inputs.witnessIndex),
    weight: 20,
  });

  inscriptions.push({
    id: 'provenance_clear',
    label: 'Provenance accord not blocking witness',
    enshrined: !provenanceAccordBlocksWitness(inputs.provenanceAccord),
    weight: 15,
  });

  inscriptions.push({
    id: 'testament_score',
    label: 'Testament score headroom',
    enshrined: inputs.testamentAccord.testamentScore >= 12,
    weight: 10,
  });

  const weighted = inscriptions.reduce(
    (n, i) => n + (i.enshrined ? 100 : 2) * (i.weight / 100),
    0
  );
  const totalWeight = inscriptions.reduce((n, i) => n + i.weight, 0);
  const memorialScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const desecratedSignals =
    testamentAccordBlocksMemorial(inputs.testamentAccord) ||
    witnessIndexBlocksTestament(inputs.witnessIndex) ||
    provenanceAccordBlocksWitness(inputs.provenanceAccord);

  const band: Agent17MemorialIndexSnapshot['band'] = desecratedSignals
    ? 'desecrated'
    : memorialScore >= 48 &&
        inputs.testamentAccord.band === 'binding' &&
        inputs.witnessIndex.band === 'affirmed'
      ? 'enshrined'
      : 'pending';

  const memorialEnshrined =
    band === 'enshrined' &&
    inputs.testamentAccord.testamentBinding &&
    !testamentAccordBlocksMemorial(inputs.testamentAccord);

  return {
    memorialScore,
    band,
    inscriptions,
    testamentBand: inputs.testamentAccord.band,
    witnessBand: inputs.witnessIndex.band,
    memorialEnshrined,
    headline: `Memorial ${band} (${memorialScore}/100) · ${inscriptions.filter(i => i.enshrined).length}/${inscriptions.length} inscriptions`,
  };
}

export function memorialIndexBlocksRemembrance(snapshot: Agent17MemorialIndexSnapshot): boolean {
  return snapshot.band === 'desecrated' || !snapshot.memorialEnshrined;
}
