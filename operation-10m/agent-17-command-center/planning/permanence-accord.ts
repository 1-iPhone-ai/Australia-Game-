import type {
  Agent17ArchiveIndexSnapshot,
  Agent17FinalityAccordSnapshot,
  Agent17PermanenceAccordSnapshot,
  Agent17ReconciliationIndexSnapshot,
} from '../types/command-center-types.ts';
import { archiveIndexBlocksPermanence } from './archive-index.ts';
import { finalityAccordBlocksArchive } from './finality-accord.ts';
import { reconciliationIndexBlocksFinality } from './reconciliation-index.ts';

export interface Agent17PermanenceAccordInputs {
  archiveIndex: Agent17ArchiveIndexSnapshot;
  finalityAccord: Agent17FinalityAccordSnapshot;
  reconciliationIndex: Agent17ReconciliationIndexSnapshot;
}

export function buildAgent17PermanenceAccord(
  inputs: Agent17PermanenceAccordInputs
): Agent17PermanenceAccordSnapshot {
  const seals: Agent17PermanenceAccordSnapshot['seals'] = [];

  seals.push({
    id: 'archive_sealed',
    label: 'Archive index archive-sealed',
    bound:
      inputs.archiveIndex.archiveSealed &&
      !archiveIndexBlocksPermanence(inputs.archiveIndex),
    weight: 30,
  });

  seals.push({
    id: 'archive_band',
    label: 'Archive archived or pending',
    bound:
      inputs.archiveIndex.band === 'archived' || inputs.archiveIndex.band === 'pending',
    weight: 25,
  });

  seals.push({
    id: 'finality_absolute',
    label: 'Finality accord finality-ready',
    bound:
      inputs.finalityAccord.finalityAbsolute &&
      !finalityAccordBlocksArchive(inputs.finalityAccord),
    weight: 20,
  });

  seals.push({
    id: 'reconciliation_clear',
    label: 'Reconciliation index not blocking finality',
    bound: !reconciliationIndexBlocksFinality(inputs.reconciliationIndex),
    weight: 15,
  });

  seals.push({
    id: 'archive_score',
    label: 'Archive score headroom',
    bound: inputs.archiveIndex.archiveScore >= 17,
    weight: 10,
  });

  const weighted = seals.reduce((n, s) => n + (s.bound ? 100 : 3) * (s.weight / 100), 0);
  const totalWeight = seals.reduce((n, s) => n + s.weight, 0);
  const permanenceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const dissolvedSignals =
    archiveIndexBlocksPermanence(inputs.archiveIndex) ||
    finalityAccordBlocksArchive(inputs.finalityAccord) ||
    reconciliationIndexBlocksFinality(inputs.reconciliationIndex);

  const band: Agent17PermanenceAccordSnapshot['band'] = dissolvedSignals
    ? 'dissolved'
    : permanenceScore >= 48 &&
        inputs.archiveIndex.band === 'archived' &&
        inputs.finalityAccord.band === 'absolute'
      ? 'enduring'
      : 'provisional';

  const permanenceEnduring =
    band === 'enduring' &&
    inputs.archiveIndex.archiveSealed &&
    !reconciliationIndexBlocksFinality(inputs.reconciliationIndex);

  return {
    permanenceScore,
    band,
    seals,
    archiveBand: inputs.archiveIndex.band,
    finalityBand: inputs.finalityAccord.band,
    permanenceEnduring,
    headline: `Permanence ${band} (${permanenceScore}/100) · ${seals.filter(s => s.bound).length}/${seals.length} seals`,
  };
}

export function permanenceAccordBlocksArchive(snapshot: Agent17PermanenceAccordSnapshot): boolean {
  return snapshot.band === 'dissolved' || !snapshot.permanenceEnduring;
}
