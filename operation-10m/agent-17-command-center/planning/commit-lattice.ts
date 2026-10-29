import type {
  Agent17CommitLatticeSnapshot,
  Agent17EscalationMatrixSnapshot,
  Agent17FluxIndexSnapshot,
  Agent17IntegritySealSnapshot,
} from '../types/command-center-types.ts';
import { fluxIndexBlocksSeal } from './flux-index.ts';
import { integritySealBlocksCommit } from './integrity-seal.ts';

export interface Agent17CommitLatticeInputs {
  integritySeal: Agent17IntegritySealSnapshot;
  fluxIndex: Agent17FluxIndexSnapshot;
  escalationMatrix: Agent17EscalationMatrixSnapshot;
}

export function buildAgent17CommitLattice(
  inputs: Agent17CommitLatticeInputs
): Agent17CommitLatticeSnapshot {
  const strands: Agent17CommitLatticeSnapshot['strands'] = [];

  strands.push({
    id: 'seal_score',
    label: 'Integrity seal score',
    tension: Math.max(0, 100 - inputs.integritySeal.sealScore),
    weight: 35,
  });

  strands.push({
    id: 'flux_index',
    label: 'Operational flux index',
    tension: Math.max(0, 100 - inputs.fluxIndex.fluxIndex),
    weight: 30,
  });

  const escalationTension = Math.min(100, inputs.escalationMatrix.escalationIndex);
  strands.push({
    id: 'escalation_index',
    label: 'Escalation index tension',
    tension: escalationTension,
    weight: 20,
  });

  const rungTension = Math.min(100, inputs.escalationMatrix.triggeredCount * 18);
  strands.push({
    id: 'rung_load',
    label: 'Escalation rung load',
    tension: rungTension,
    weight: 15,
  });

  const weighted = strands.reduce(
    (n, s) => n + Math.max(0, 100 - s.tension) * (s.weight / 100),
    0
  );
  const totalWeight = strands.reduce((n, s) => n + s.weight, 0);
  const latticeScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const fragmentedSignals =
    inputs.integritySeal.band === 'breached' ||
    inputs.fluxIndex.band === 'disrupted' ||
    inputs.escalationMatrix.band === 'urgent' ||
    integritySealBlocksCommit(inputs.integritySeal) ||
    fluxIndexBlocksSeal(inputs.fluxIndex);

  const band: Agent17CommitLatticeSnapshot['band'] = fragmentedSignals
    ? 'fragmented'
    : latticeScore >= 60 &&
        (inputs.integritySeal.band === 'trusted' ||
          inputs.integritySeal.band === 'conditional') &&
        inputs.fluxIndex.band !== 'disrupted'
      ? 'bound'
      : 'flex';

  return {
    latticeScore,
    band,
    strands,
    sealBand: inputs.integritySeal.band,
    escalationBand: inputs.escalationMatrix.band,
    headline: `Lattice ${band} (${latticeScore}/100) · seal ${inputs.integritySeal.band}`,
  };
}

export function commitLatticeBlocksCovenant(snapshot: Agent17CommitLatticeSnapshot): boolean {
  return snapshot.band === 'fragmented' || snapshot.latticeScore < 32;
}
