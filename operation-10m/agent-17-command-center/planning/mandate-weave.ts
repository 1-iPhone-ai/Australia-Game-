import type {
  Agent17CommitLatticeSnapshot,
  Agent17CovenantGateSnapshot,
  Agent17MandateWeaveSnapshot,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';
import { commitLatticeBlocksCovenant } from './commit-lattice.ts';

export interface Agent17MandateWeaveInputs {
  covenantGate: Agent17CovenantGateSnapshot;
  commitLattice: Agent17CommitLatticeSnapshot;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

export function buildAgent17MandateWeave(
  inputs: Agent17MandateWeaveInputs
): Agent17MandateWeaveSnapshot {
  const threads: Agent17MandateWeaveSnapshot['threads'] = [];

  threads.push({
    id: 'covenant_score',
    label: 'Covenant gate score',
    strength: inputs.covenantGate.covenantScore,
    weight: 35,
  });

  threads.push({
    id: 'lattice_score',
    label: 'Commit lattice score',
    strength: inputs.commitLattice.latticeScore,
    weight: 30,
  });

  threads.push({
    id: 'alignment_index',
    label: 'Strategic alignment index',
    strength: inputs.strategicAlignment.alignmentIndex,
    weight: 25,
  });

  const clauseRatio = Math.round(
    (inputs.covenantGate.clauses.filter(c => c.upheld).length /
      Math.max(1, inputs.covenantGate.clauses.length)) *
      100
  );
  threads.push({
    id: 'clause_ratio',
    label: 'Covenant clause ratio',
    strength: clauseRatio,
    weight: 10,
  });

  const weighted = threads.reduce((n, t) => n + t.strength * (t.weight / 100), 0);
  const totalWeight = threads.reduce((n, t) => n + t.weight, 0);
  const weaveScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const frayedSignals =
    inputs.covenantGate.band === 'void' ||
    inputs.commitLattice.band === 'fragmented' ||
    inputs.strategicAlignment.band === 'divergent' ||
    commitLatticeBlocksCovenant(inputs.commitLattice);

  const band: Agent17MandateWeaveSnapshot['band'] = frayedSignals
    ? 'frayed'
    : weaveScore >= 65 &&
        (inputs.covenantGate.band === 'upheld' ||
          inputs.covenantGate.band === 'conditional') &&
        inputs.strategicAlignment.band !== 'divergent'
      ? 'aligned'
      : 'tensioned';

  return {
    weaveScore,
    band,
    threads,
    covenantBand: inputs.covenantGate.band,
    alignmentBand: inputs.strategicAlignment.band,
    headline: `Mandate ${band} (${weaveScore}/100) · covenant ${inputs.covenantGate.band}`,
  };
}

export function mandateWeaveBlocksSovereignty(snapshot: Agent17MandateWeaveSnapshot): boolean {
  return snapshot.band === 'frayed' || snapshot.weaveScore < 34;
}
