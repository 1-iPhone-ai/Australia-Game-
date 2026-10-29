import type {
  Agent17LineageIndexSnapshot,
  Agent17PermanenceAccordSnapshot,
  Agent17ProvenanceAccordSnapshot,
  Agent17WitnessIndexSnapshot,
} from '../types/command-center-types.ts';
import { lineageIndexBlocksProvenance } from './lineage-index.ts';
import { permanenceAccordBlocksLineage } from './permanence-accord.ts';
import { provenanceAccordBlocksWitness } from './provenance-accord.ts';

export interface Agent17WitnessIndexInputs {
  provenanceAccord: Agent17ProvenanceAccordSnapshot;
  lineageIndex: Agent17LineageIndexSnapshot;
  permanenceAccord: Agent17PermanenceAccordSnapshot;
}

export function buildAgent17WitnessIndex(
  inputs: Agent17WitnessIndexInputs
): Agent17WitnessIndexSnapshot {
  const depositions: Agent17WitnessIndexSnapshot['depositions'] = [];

  depositions.push({
    id: 'provenance_authenticated',
    label: 'Provenance accord provenance-authenticated',
    affirmed:
      inputs.provenanceAccord.provenanceAuthenticated &&
      !provenanceAccordBlocksWitness(inputs.provenanceAccord),
    weight: 30,
  });

  depositions.push({
    id: 'provenance_band',
    label: 'Provenance authenticated or tentative',
    affirmed:
      inputs.provenanceAccord.band === 'authenticated' ||
      inputs.provenanceAccord.band === 'tentative',
    weight: 25,
  });

  depositions.push({
    id: 'lineage_rooted',
    label: 'Lineage index lineage-rooted',
    affirmed:
      inputs.lineageIndex.lineageRooted &&
      !lineageIndexBlocksProvenance(inputs.lineageIndex),
    weight: 20,
  });

  depositions.push({
    id: 'permanence_clear',
    label: 'Permanence accord not blocking lineage',
    affirmed: !permanenceAccordBlocksLineage(inputs.permanenceAccord),
    weight: 15,
  });

  depositions.push({
    id: 'provenance_score',
    label: 'Provenance score headroom',
    affirmed: inputs.provenanceAccord.provenanceScore >= 14,
    weight: 10,
  });

  const weighted = depositions.reduce(
    (n, d) => n + (d.affirmed ? 100 : 2) * (d.weight / 100),
    0
  );
  const totalWeight = depositions.reduce((n, d) => n + d.weight, 0);
  const witnessScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const contradictedSignals =
    provenanceAccordBlocksWitness(inputs.provenanceAccord) ||
    lineageIndexBlocksProvenance(inputs.lineageIndex) ||
    permanenceAccordBlocksLineage(inputs.permanenceAccord);

  const band: Agent17WitnessIndexSnapshot['band'] = contradictedSignals
    ? 'contradicted'
    : witnessScore >= 49 &&
        inputs.provenanceAccord.band === 'authenticated' &&
        inputs.lineageIndex.band === 'rooted'
      ? 'affirmed'
      : 'pending';

  const witnessAffirmed =
    band === 'affirmed' &&
    inputs.provenanceAccord.provenanceAuthenticated &&
    !provenanceAccordBlocksWitness(inputs.provenanceAccord);

  return {
    witnessScore,
    band,
    depositions,
    provenanceBand: inputs.provenanceAccord.band,
    lineageBand: inputs.lineageIndex.band,
    witnessAffirmed,
    headline: `Witness ${band} (${witnessScore}/100) · ${depositions.filter(d => d.affirmed).length}/${depositions.length} depositions`,
  };
}

export function witnessIndexBlocksTestament(snapshot: Agent17WitnessIndexSnapshot): boolean {
  return snapshot.band === 'contradicted' || !snapshot.witnessAffirmed;
}
