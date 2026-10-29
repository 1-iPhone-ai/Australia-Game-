import type {
  Agent17ArchiveIndexSnapshot,
  Agent17ClosureAccordSnapshot,
  Agent17FinalityAccordSnapshot,
  Agent17ReconciliationIndexSnapshot,
} from '../types/command-center-types.ts';
import { finalityAccordBlocksArchive } from './finality-accord.ts';
import { reconciliationIndexBlocksFinality } from './reconciliation-index.ts';
import { closureAccordBlocksReconciliation } from './closure-accord.ts';

export interface Agent17ArchiveIndexInputs {
  finalityAccord: Agent17FinalityAccordSnapshot;
  reconciliationIndex: Agent17ReconciliationIndexSnapshot;
  closureAccord: Agent17ClosureAccordSnapshot;
}

export function buildAgent17ArchiveIndex(
  inputs: Agent17ArchiveIndexInputs
): Agent17ArchiveIndexSnapshot {
  const volumes: Agent17ArchiveIndexSnapshot['volumes'] = [];

  volumes.push({
    id: 'finality_absolute',
    label: 'Finality accord finality-absolute',
    sealed:
      inputs.finalityAccord.finalityAbsolute &&
      !finalityAccordBlocksArchive(inputs.finalityAccord),
    weight: 30,
  });

  volumes.push({
    id: 'finality_band',
    label: 'Finality absolute or conditional',
    sealed:
      inputs.finalityAccord.band === 'absolute' ||
      inputs.finalityAccord.band === 'conditional',
    weight: 25,
  });

  volumes.push({
    id: 'reconciliation_matched',
    label: 'Reconciliation index reconciliation-matched',
    sealed:
      inputs.reconciliationIndex.reconciliationMatched &&
      !reconciliationIndexBlocksFinality(inputs.reconciliationIndex),
    weight: 20,
  });

  volumes.push({
    id: 'closure_clear',
    label: 'Closure accord not blocking reconciliation',
    sealed: !closureAccordBlocksReconciliation(inputs.closureAccord),
    weight: 15,
  });

  volumes.push({
    id: 'finality_score',
    label: 'Finality score headroom',
    sealed: inputs.finalityAccord.finalityScore >= 18,
    weight: 10,
  });

  const weighted = volumes.reduce(
    (n, v) => n + (v.sealed ? 100 : 4) * (v.weight / 100),
    0
  );
  const totalWeight = volumes.reduce((n, v) => n + v.weight, 0);
  const archiveScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const exposedSignals =
    finalityAccordBlocksArchive(inputs.finalityAccord) ||
    reconciliationIndexBlocksFinality(inputs.reconciliationIndex) ||
    closureAccordBlocksReconciliation(inputs.closureAccord);

  const band: Agent17ArchiveIndexSnapshot['band'] = exposedSignals
    ? 'exposed'
    : archiveScore >= 51 &&
        inputs.finalityAccord.band === 'absolute' &&
        inputs.reconciliationIndex.band === 'matched'
      ? 'archived'
      : 'pending';

  const archiveSealed =
    band === 'archived' &&
    inputs.finalityAccord.finalityAbsolute &&
    !finalityAccordBlocksArchive(inputs.finalityAccord);

  return {
    archiveScore,
    band,
    volumes,
    finalityBand: inputs.finalityAccord.band,
    reconciliationBand: inputs.reconciliationIndex.band,
    archiveSealed,
    headline: `Archive ${band} (${archiveScore}/100) · ${volumes.filter(v => v.sealed).length}/${volumes.length} volumes`,
  };
}

export function archiveIndexBlocksPermanence(snapshot: Agent17ArchiveIndexSnapshot): boolean {
  return snapshot.band === 'exposed' || !snapshot.archiveSealed;
}
