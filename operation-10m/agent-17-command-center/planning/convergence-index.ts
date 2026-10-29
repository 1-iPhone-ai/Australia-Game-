import type {
  Agent17CommandEnvelopeSnapshot,
  Agent17ConvergenceIndexSnapshot,
  Agent17StabilizationIndexSnapshot,
  Agent17StrategicAlignmentSnapshot,
} from '../types/command-center-types.ts';
import { stabilizationIndexBlocksAutomation } from './stabilization-index.ts';

export interface Agent17ConvergenceIndexInputs {
  commandEnvelope: Agent17CommandEnvelopeSnapshot;
  stabilizationIndex: Agent17StabilizationIndexSnapshot;
  strategicAlignment: Agent17StrategicAlignmentSnapshot;
}

export function buildAgent17ConvergenceIndex(
  inputs: Agent17ConvergenceIndexInputs
): Agent17ConvergenceIndexSnapshot {
  const factors: Agent17ConvergenceIndexSnapshot['factors'] = [];

  factors.push({
    id: 'strategic_alignment',
    label: 'Strategic alignment',
    score: inputs.strategicAlignment.alignmentIndex,
    weight: 35,
  });

  const stabilizationScore =
    inputs.stabilizationIndex.band === 'stable'
      ? inputs.stabilizationIndex.stabilizationIndex
      : inputs.stabilizationIndex.band === 'adjusting'
        ? Math.max(0, inputs.stabilizationIndex.stabilizationIndex - 8)
        : Math.max(0, inputs.stabilizationIndex.stabilizationIndex - 28);
  factors.push({
    id: 'stabilization',
    label: 'Ops stabilization',
    score: stabilizationScore,
    weight: 30,
  });

  const envelopeScore =
    inputs.commandEnvelope.capacityBand === 'nominal'
      ? 88
      : inputs.commandEnvelope.capacityBand === 'constrained'
        ? 58
        : 28;
  factors.push({
    id: 'envelope_capacity',
    label: 'Command envelope capacity',
    score: envelopeScore,
    weight: 20,
  });

  const horizonHeadroom = Math.max(
    0,
    Math.min(100, 100 - Math.max(0, inputs.commandEnvelope.horizonTurns - 6) * 8)
  );
  factors.push({
    id: 'horizon_headroom',
    label: 'Planning horizon headroom',
    score: horizonHeadroom,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const convergenceIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const divergingSignals =
    inputs.stabilizationIndex.band === 'volatile' ||
    inputs.commandEnvelope.capacityBand === 'saturated' ||
    stabilizationIndexBlocksAutomation(inputs.stabilizationIndex) ||
    inputs.strategicAlignment.band === 'divergent';

  const band: Agent17ConvergenceIndexSnapshot['band'] =
    divergingSignals || convergenceIndex < 40
      ? 'diverging'
      : convergenceIndex >= 72
        ? 'aligned'
        : 'adjusting';

  return {
    convergenceIndex,
    band,
    factors,
    envelopeBand: inputs.commandEnvelope.capacityBand,
    stabilizationBand: inputs.stabilizationIndex.band,
    headline: `Convergence ${band} (${convergenceIndex}/100) · env ${inputs.commandEnvelope.capacityBand}`,
  };
}

export function convergenceIndexBlocksDirective(
  snapshot: Agent17ConvergenceIndexSnapshot
): boolean {
  return snapshot.band === 'diverging' || snapshot.convergenceIndex < 38;
}
