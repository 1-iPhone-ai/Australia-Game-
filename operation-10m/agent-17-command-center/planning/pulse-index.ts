import type {
  Agent17CadenceLatticeSnapshot,
  Agent17CommandPostureSnapshot,
  Agent17PulseIndexSnapshot,
  Agent17ReadinessGateSnapshot,
} from '../types/command-center-types.ts';
import { cadenceLatticeBlocksRun } from './cadence-lattice.ts';
import { readinessGateBlocksRun } from './readiness-gate.ts';

export interface Agent17PulseIndexInputs {
  readinessGate: Agent17ReadinessGateSnapshot;
  cadenceLattice: Agent17CadenceLatticeSnapshot;
  commandPosture: Agent17CommandPostureSnapshot;
}

export function buildAgent17PulseIndex(
  inputs: Agent17PulseIndexInputs
): Agent17PulseIndexSnapshot {
  const factors: Agent17PulseIndexSnapshot['factors'] = [];

  factors.push({
    id: 'readiness_score',
    label: 'Readiness gate score',
    score: inputs.readinessGate.readinessScore,
    weight: 35,
  });

  factors.push({
    id: 'cadence_index',
    label: 'Cadence lattice index',
    score: inputs.cadenceLattice.cadenceIndex,
    weight: 30,
  });

  factors.push({
    id: 'posture_index',
    label: 'Command posture index',
    score: inputs.commandPosture.postureIndex,
    weight: 25,
  });

  const runBonus = inputs.readinessGate.runAllowed ? 85 : 45;
  factors.push({
    id: 'run_clearance',
    label: 'Run clearance',
    score: runBonus,
    weight: 10,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const pulseIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const flatSignals =
    inputs.readinessGate.band === 'stop' ||
    inputs.cadenceLattice.band === 'stalled' ||
    readinessGateBlocksRun(inputs.readinessGate) ||
    cadenceLatticeBlocksRun(inputs.cadenceLattice);

  const band: Agent17PulseIndexSnapshot['band'] = flatSignals
    ? 'flat'
    : pulseIndex >= 68 &&
        inputs.readinessGate.band === 'go' &&
        inputs.cadenceLattice.band === 'flowing'
      ? 'strong'
      : 'moderate';

  return {
    pulseIndex,
    band,
    factors,
    readinessBand: inputs.readinessGate.band,
    cadenceBand: inputs.cadenceLattice.cadenceBand,
    headline: `Pulse ${band} (${pulseIndex}/100) · ready ${inputs.readinessGate.band}`,
  };
}

export function pulseIndexBlocksContinuity(snapshot: Agent17PulseIndexSnapshot): boolean {
  return snapshot.band === 'flat' || snapshot.pulseIndex < 35;
}
