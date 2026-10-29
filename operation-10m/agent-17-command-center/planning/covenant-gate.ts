import type {
  Agent17CommitLatticeSnapshot,
  Agent17CovenantGateSnapshot,
  Agent17PlanHealthBand,
  Agent17RollbackAssuranceSnapshot,
} from '../types/command-center-types.ts';
import { commitLatticeBlocksCovenant } from './commit-lattice.ts';
import { rollbackAssuranceNeedsRestore } from './rollback-assurance.ts';

export interface Agent17CovenantGateInputs {
  commitLattice: Agent17CommitLatticeSnapshot;
  planHealth: Agent17PlanHealthBand;
  rollbackAssurance: Agent17RollbackAssuranceSnapshot;
}

export function buildAgent17CovenantGate(
  inputs: Agent17CovenantGateInputs
): Agent17CovenantGateSnapshot {
  const clauses: Agent17CovenantGateSnapshot['clauses'] = [];

  clauses.push({
    id: 'lattice_bound',
    label: 'Commit lattice bound',
    upheld: inputs.commitLattice.band === 'bound' || inputs.commitLattice.band === 'flex',
    weight: 30,
  });

  clauses.push({
    id: 'plan_health',
    label: 'Plan health steady',
    upheld: inputs.planHealth.band === 'steady' || inputs.planHealth.band === 'strong',
    weight: 25,
  });

  clauses.push({
    id: 'assurance_score',
    label: 'Rollback assurance score',
    upheld: inputs.rollbackAssurance.assuranceScore >= 50,
    weight: 20,
  });

  clauses.push({
    id: 'restore_clear',
    label: 'Restore signal clear',
    upheld: !inputs.rollbackAssurance.restoreRecommended,
    weight: 15,
  });

  clauses.push({
    id: 'on_track',
    label: 'Plan on track flag',
    upheld: inputs.planHealth.onTrack,
    weight: 10,
  });

  const weighted = clauses.reduce(
    (n, c) => n + (c.upheld ? 100 : 16) * (c.weight / 100),
    0
  );
  const totalWeight = clauses.reduce((n, c) => n + c.weight, 0);
  const covenantScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    commitLatticeBlocksCovenant(inputs.commitLattice) ||
    inputs.rollbackAssurance.band === 'exposed' ||
    rollbackAssuranceNeedsRestore(inputs.rollbackAssurance);

  const band: Agent17CovenantGateSnapshot['band'] = voidSignals
    ? 'void'
    : covenantScore >= 70 &&
        inputs.commitLattice.band === 'bound' &&
        !commitLatticeBlocksCovenant(inputs.commitLattice)
      ? 'upheld'
      : 'conditional';

  const opsAllowed =
    band === 'upheld' &&
    inputs.planHealth.band !== 'critical' &&
    !commitLatticeBlocksCovenant(inputs.commitLattice);

  return {
    covenantScore,
    band,
    clauses,
    latticeBand: inputs.commitLattice.band,
    opsAllowed,
    headline: `Covenant ${band} (${covenantScore}/100) · ${clauses.filter(c => c.upheld).length}/${clauses.length} clauses`,
  };
}

export function covenantGateBlocksOps(snapshot: Agent17CovenantGateSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.opsAllowed;
}
