import type {
  Agent17ArchiveIndexSnapshot,
  Agent17FinalityAccordSnapshot,
  Agent17LineageIndexSnapshot,
  Agent17PermanenceAccordSnapshot,
} from '../types/command-center-types.ts';
import { archiveIndexBlocksPermanence } from './archive-index.ts';
import { finalityAccordBlocksArchive } from './finality-accord.ts';
import { permanenceAccordBlocksLineage } from './permanence-accord.ts';

export interface Agent17LineageIndexInputs {
  permanenceAccord: Agent17PermanenceAccordSnapshot;
  archiveIndex: Agent17ArchiveIndexSnapshot;
  finalityAccord: Agent17FinalityAccordSnapshot;
}

export function buildAgent17LineageIndex(
  inputs: Agent17LineageIndexInputs
): Agent17LineageIndexSnapshot {
  const strands: Agent17LineageIndexSnapshot['strands'] = [];

  strands.push({
    id: 'permanence_enduring',
    label: 'Permanence accord permanence-enduring',
    rooted:
      inputs.permanenceAccord.permanenceEnduring &&
      !permanenceAccordBlocksLineage(inputs.permanenceAccord),
    weight: 30,
  });

  strands.push({
    id: 'permanence_band',
    label: 'Permanence enduring or provisional',
    rooted:
      inputs.permanenceAccord.band === 'enduring' ||
      inputs.permanenceAccord.band === 'provisional',
    weight: 25,
  });

  strands.push({
    id: 'archive_sealed',
    label: 'Archive index archive-sealed',
    rooted:
      inputs.archiveIndex.archiveSealed && !archiveIndexBlocksPermanence(inputs.archiveIndex),
    weight: 20,
  });

  strands.push({
    id: 'finality_clear',
    label: 'Finality accord not blocking archive',
    rooted: !finalityAccordBlocksArchive(inputs.finalityAccord),
    weight: 15,
  });

  strands.push({
    id: 'permanence_score',
    label: 'Permanence score headroom',
    rooted: inputs.permanenceAccord.permanenceScore >= 16,
    weight: 10,
  });

  const weighted = strands.reduce(
    (n, s) => n + (s.rooted ? 100 : 3) * (s.weight / 100),
    0
  );
  const totalWeight = strands.reduce((n, s) => n + s.weight, 0);
  const lineageScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const fracturedSignals =
    permanenceAccordBlocksLineage(inputs.permanenceAccord) ||
    archiveIndexBlocksPermanence(inputs.archiveIndex) ||
    finalityAccordBlocksArchive(inputs.finalityAccord);

  const band: Agent17LineageIndexSnapshot['band'] = fracturedSignals
    ? 'fractured'
    : lineageScore >= 50 &&
        inputs.permanenceAccord.band === 'enduring' &&
        inputs.archiveIndex.band === 'archived'
      ? 'rooted'
      : 'pending';

  const lineageRooted =
    band === 'rooted' &&
    inputs.permanenceAccord.permanenceEnduring &&
    !permanenceAccordBlocksLineage(inputs.permanenceAccord);

  return {
    lineageScore,
    band,
    strands,
    permanenceBand: inputs.permanenceAccord.band,
    archiveBand: inputs.archiveIndex.band,
    lineageRooted,
    headline: `Lineage ${band} (${lineageScore}/100) · ${strands.filter(s => s.rooted).length}/${strands.length} strands`,
  };
}

export function lineageIndexBlocksProvenance(snapshot: Agent17LineageIndexSnapshot): boolean {
  return snapshot.band === 'fractured' || !snapshot.lineageRooted;
}
