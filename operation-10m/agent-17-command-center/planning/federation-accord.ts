import type {
  Agent17CommandIndexSnapshot,
  Agent17CommitLatticeSnapshot,
  Agent17DoctrineAccordSnapshot,
  Agent17FederationAccordSnapshot,
} from '../types/command-center-types.ts';
import { commitLatticeBlocksCovenant } from './commit-lattice.ts';
import { commandIndexBlocksFederation } from './command-index.ts';
import { doctrineAccordBlocksCommand } from './doctrine-accord.ts';

export interface Agent17FederationAccordInputs {
  commandIndex: Agent17CommandIndexSnapshot;
  doctrineAccord: Agent17DoctrineAccordSnapshot;
  commitLattice: Agent17CommitLatticeSnapshot;
}

export function buildAgent17FederationAccord(
  inputs: Agent17FederationAccordInputs
): Agent17FederationAccordSnapshot {
  const covenants: Agent17FederationAccordSnapshot['covenants'] = [];

  covenants.push({
    id: 'command_supreme',
    label: 'Command index command-ready',
    bound:
      inputs.commandIndex.commandReady && !commandIndexBlocksFederation(inputs.commandIndex),
    weight: 30,
  });

  covenants.push({
    id: 'command_band',
    label: 'Command supreme or delegated',
    bound:
      inputs.commandIndex.band === 'supreme' || inputs.commandIndex.band === 'delegated',
    weight: 25,
  });

  covenants.push({
    id: 'lattice_committed',
    label: 'Commit lattice not fragmented',
    bound:
      inputs.commitLattice.band !== 'fragmented' && !commitLatticeBlocksCovenant(inputs.commitLattice),
    weight: 20,
  });

  covenants.push({
    id: 'doctrine_clear',
    label: 'Doctrine accord not blocking command',
    bound: !doctrineAccordBlocksCommand(inputs.doctrineAccord),
    weight: 15,
  });

  covenants.push({
    id: 'lattice_score',
    label: 'Commit lattice score headroom',
    bound: inputs.commitLattice.latticeScore >= 37,
    weight: 10,
  });

  const weighted = covenants.reduce(
    (n, c) => n + (c.bound ? 100 : 9) * (c.weight / 100),
    0
  );
  const totalWeight = covenants.reduce((n, c) => n + c.weight, 0);
  const federationScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const dissolvedSignals =
    commandIndexBlocksFederation(inputs.commandIndex) ||
    commitLatticeBlocksCovenant(inputs.commitLattice) ||
    doctrineAccordBlocksCommand(inputs.doctrineAccord);

  const band: Agent17FederationAccordSnapshot['band'] = dissolvedSignals
    ? 'dissolved'
    : federationScore >= 66 &&
        inputs.commandIndex.band === 'supreme' &&
        inputs.commitLattice.band === 'bound'
      ? 'unified'
      : 'partial';

  const federationUnified =
    band === 'unified' &&
    inputs.commandIndex.commandReady &&
    !commitLatticeBlocksCovenant(inputs.commitLattice);

  return {
    federationScore,
    band,
    covenants,
    commandBand: inputs.commandIndex.band,
    latticeBand: inputs.commitLattice.band,
    federationUnified,
    headline: `Federation ${band} (${federationScore}/100) · ${covenants.filter(c => c.bound).length}/${covenants.length} covenants`,
  };
}

export function federationAccordBlocksOps(snapshot: Agent17FederationAccordSnapshot): boolean {
  return snapshot.band === 'dissolved' || !snapshot.federationUnified;
}
