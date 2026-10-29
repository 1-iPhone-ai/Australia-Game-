import type {
  Agent17LineageIndexSnapshot,
  Agent17ProvenanceAccordSnapshot,
  Agent17TestamentAccordSnapshot,
  Agent17WitnessIndexSnapshot,
} from '../types/command-center-types.ts';
import { lineageIndexBlocksProvenance } from './lineage-index.ts';
import { provenanceAccordBlocksWitness } from './provenance-accord.ts';
import { witnessIndexBlocksTestament } from './witness-index.ts';

export interface Agent17TestamentAccordInputs {
  witnessIndex: Agent17WitnessIndexSnapshot;
  provenanceAccord: Agent17ProvenanceAccordSnapshot;
  lineageIndex: Agent17LineageIndexSnapshot;
}

export function buildAgent17TestamentAccord(
  inputs: Agent17TestamentAccordInputs
): Agent17TestamentAccordSnapshot {
  const clauses: Agent17TestamentAccordSnapshot['clauses'] = [];

  clauses.push({
    id: 'witness_affirmed',
    label: 'Witness index witness-affirmed',
    binding:
      inputs.witnessIndex.witnessAffirmed &&
      !witnessIndexBlocksTestament(inputs.witnessIndex),
    weight: 30,
  });

  clauses.push({
    id: 'witness_band',
    label: 'Witness affirmed or pending',
    binding:
      inputs.witnessIndex.band === 'affirmed' || inputs.witnessIndex.band === 'pending',
    weight: 25,
  });

  clauses.push({
    id: 'provenance_authenticated',
    label: 'Provenance accord provenance-ready',
    binding:
      inputs.provenanceAccord.provenanceAuthenticated &&
      !provenanceAccordBlocksWitness(inputs.provenanceAccord),
    weight: 20,
  });

  clauses.push({
    id: 'lineage_clear',
    label: 'Lineage index not blocking provenance',
    binding: !lineageIndexBlocksProvenance(inputs.lineageIndex),
    weight: 15,
  });

  clauses.push({
    id: 'witness_score',
    label: 'Witness score headroom',
    binding: inputs.witnessIndex.witnessScore >= 13,
    weight: 10,
  });

  const weighted = clauses.reduce(
    (n, c) => n + (c.binding ? 100 : 2) * (c.weight / 100),
    0
  );
  const totalWeight = clauses.reduce((n, c) => n + c.weight, 0);
  const testamentScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidedSignals =
    witnessIndexBlocksTestament(inputs.witnessIndex) ||
    provenanceAccordBlocksWitness(inputs.provenanceAccord) ||
    lineageIndexBlocksProvenance(inputs.lineageIndex);

  const band: Agent17TestamentAccordSnapshot['band'] = voidedSignals
    ? 'voided'
    : testamentScore >= 46 &&
        inputs.witnessIndex.band === 'affirmed' &&
        inputs.provenanceAccord.band === 'authenticated'
      ? 'binding'
      : 'draft';

  const testamentBinding =
    band === 'binding' &&
    inputs.witnessIndex.witnessAffirmed &&
    !lineageIndexBlocksProvenance(inputs.lineageIndex);

  return {
    testamentScore,
    band,
    clauses,
    witnessBand: inputs.witnessIndex.band,
    provenanceBand: inputs.provenanceAccord.band,
    testamentBinding,
    headline: `Testament ${band} (${testamentScore}/100) · ${clauses.filter(c => c.binding).length}/${clauses.length} clauses`,
  };
}

export function testamentAccordBlocksWitness(snapshot: Agent17TestamentAccordSnapshot): boolean {
  return snapshot.band === 'voided' || !snapshot.testamentBinding;
}
