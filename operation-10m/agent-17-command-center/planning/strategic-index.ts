import type {
  Agent17CommandEnvelopeSnapshot,
  Agent17ConvergenceIndexSnapshot,
  Agent17MissionLatticeSnapshot,
  Agent17StrategicIndexSnapshot,
} from '../types/command-center-types.ts';
import { commandEnvelopeNeedsThrottle } from './command-envelope.ts';
import { convergenceIndexBlocksDirective } from './convergence-index.ts';
import { missionLatticeBlocksCampaign } from './mission-lattice.ts';

export interface Agent17StrategicIndexInputs {
  missionLattice: Agent17MissionLatticeSnapshot;
  convergenceIndex: Agent17ConvergenceIndexSnapshot;
  commandEnvelope: Agent17CommandEnvelopeSnapshot;
}

export function buildAgent17StrategicIndex(
  inputs: Agent17StrategicIndexInputs
): Agent17StrategicIndexSnapshot {
  const signals: Agent17StrategicIndexSnapshot['signals'] = [];

  signals.push({
    id: 'lattice_locked',
    label: 'Mission lattice locked',
    engaged:
      inputs.missionLattice.missionLocked && !missionLatticeBlocksCampaign(inputs.missionLattice),
    weight: 30,
  });

  signals.push({
    id: 'lattice_band',
    label: 'Lattice locked or flexible',
    engaged:
      inputs.missionLattice.band === 'locked' || inputs.missionLattice.band === 'flexible',
    weight: 25,
  });

  signals.push({
    id: 'convergence_aligned',
    label: 'Convergence not diverging',
    engaged:
      inputs.convergenceIndex.band !== 'diverging' &&
      !convergenceIndexBlocksDirective(inputs.convergenceIndex),
    weight: 20,
  });

  signals.push({
    id: 'envelope_nominal',
    label: 'Command envelope not saturated',
    engaged:
      inputs.commandEnvelope.capacityBand !== 'saturated' &&
      !commandEnvelopeNeedsThrottle(inputs.commandEnvelope),
    weight: 15,
  });

  signals.push({
    id: 'convergence_score',
    label: 'Convergence index headroom',
    engaged: inputs.convergenceIndex.convergenceIndex >= 42,
    weight: 10,
  });

  const weighted = signals.reduce(
    (n, s) => n + (s.engaged ? 100 : 11) * (s.weight / 100),
    0
  );
  const totalWeight = signals.reduce((n, s) => n + s.weight, 0);
  const strategicScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const fracturedSignals =
    missionLatticeBlocksCampaign(inputs.missionLattice) ||
    inputs.missionLattice.band === 'collapsed' ||
    convergenceIndexBlocksDirective(inputs.convergenceIndex);

  const band: Agent17StrategicIndexSnapshot['band'] = fracturedSignals
    ? 'fractured'
    : strategicScore >= 69 &&
        inputs.missionLattice.band === 'locked' &&
        !missionLatticeBlocksCampaign(inputs.missionLattice)
      ? 'coherent'
      : 'forming';

  const strategicReady =
    band === 'coherent' &&
    inputs.missionLattice.missionLocked &&
    !convergenceIndexBlocksDirective(inputs.convergenceIndex);

  return {
    strategicScore,
    band,
    signals,
    latticeBand: inputs.missionLattice.band,
    convergenceBand: inputs.convergenceIndex.band,
    strategicReady,
    headline: `Strategic ${band} (${strategicScore}/100) · ${signals.filter(s => s.engaged).length}/${signals.length} signals`,
  };
}

export function strategicIndexBlocksDoctrine(snapshot: Agent17StrategicIndexSnapshot): boolean {
  return snapshot.band === 'fractured' || !snapshot.strategicReady;
}
