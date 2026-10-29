import type {
  Agent17ArchiveIndexSnapshot,
  Agent17LineageIndexSnapshot,
  Agent17PermanenceAccordSnapshot,
  Agent17ProvenanceAccordSnapshot,
} from '../types/command-center-types.ts';
import { archiveIndexBlocksPermanence } from './archive-index.ts';
import { lineageIndexBlocksProvenance } from './lineage-index.ts';
import { permanenceAccordBlocksLineage } from './permanence-accord.ts';

export interface Agent17ProvenanceAccordInputs {
  lineageIndex: Agent17LineageIndexSnapshot;
  permanenceAccord: Agent17PermanenceAccordSnapshot;
  archiveIndex: Agent17ArchiveIndexSnapshot;
}

export function buildAgent17ProvenanceAccord(
  inputs: Agent17ProvenanceAccordInputs
): Agent17ProvenanceAccordSnapshot {
  const proofs: Agent17ProvenanceAccordSnapshot['proofs'] = [];

  proofs.push({
    id: 'lineage_rooted',
    label: 'Lineage index lineage-rooted',
    verified:
      inputs.lineageIndex.lineageRooted &&
      !lineageIndexBlocksProvenance(inputs.lineageIndex),
    weight: 30,
  });

  proofs.push({
    id: 'lineage_band',
    label: 'Lineage rooted or pending',
    verified:
      inputs.lineageIndex.band === 'rooted' || inputs.lineageIndex.band === 'pending',
    weight: 25,
  });

  proofs.push({
    id: 'permanence_enduring',
    label: 'Permanence accord permanence-ready',
    verified:
      inputs.permanenceAccord.permanenceEnduring &&
      !permanenceAccordBlocksLineage(inputs.permanenceAccord),
    weight: 20,
  });

  proofs.push({
    id: 'archive_clear',
    label: 'Archive index not blocking permanence',
    verified: !archiveIndexBlocksPermanence(inputs.archiveIndex),
    weight: 15,
  });

  proofs.push({
    id: 'lineage_score',
    label: 'Lineage score headroom',
    verified: inputs.lineageIndex.lineageScore >= 15,
    weight: 10,
  });

  const weighted = proofs.reduce(
    (n, p) => n + (p.verified ? 100 : 2) * (p.weight / 100),
    0
  );
  const totalWeight = proofs.reduce((n, p) => n + p.weight, 0);
  const provenanceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const repudiatedSignals =
    lineageIndexBlocksProvenance(inputs.lineageIndex) ||
    permanenceAccordBlocksLineage(inputs.permanenceAccord) ||
    archiveIndexBlocksPermanence(inputs.archiveIndex);

  const band: Agent17ProvenanceAccordSnapshot['band'] = repudiatedSignals
    ? 'repudiated'
    : provenanceScore >= 47 &&
        inputs.lineageIndex.band === 'rooted' &&
        inputs.permanenceAccord.band === 'enduring'
      ? 'authenticated'
      : 'tentative';

  const provenanceAuthenticated =
    band === 'authenticated' &&
    inputs.lineageIndex.lineageRooted &&
    !archiveIndexBlocksPermanence(inputs.archiveIndex);

  return {
    provenanceScore,
    band,
    proofs,
    lineageBand: inputs.lineageIndex.band,
    permanenceBand: inputs.permanenceAccord.band,
    provenanceAuthenticated,
    headline: `Provenance ${band} (${provenanceScore}/100) · ${proofs.filter(p => p.verified).length}/${proofs.length} proofs`,
  };
}

export function provenanceAccordBlocksLineage(snapshot: Agent17ProvenanceAccordSnapshot): boolean {
  return snapshot.band === 'repudiated' || !snapshot.provenanceAuthenticated;
}
