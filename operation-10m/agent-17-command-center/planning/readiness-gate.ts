import type {
  Agent17CadenceLatticeSnapshot,
  Agent17CoordinationBrief,
  Agent17HandoffReadinessSnapshot,
  Agent17ReadinessGateSnapshot,
} from '../types/command-center-types.ts';
import { cadenceLatticeBlocksRun } from './cadence-lattice.ts';
import { handoffReadinessBlocked } from './handoff-readiness.ts';

export interface Agent17ReadinessGateInputs {
  cadenceLattice: Agent17CadenceLatticeSnapshot;
  handoffReadiness: Agent17HandoffReadinessSnapshot;
  coordinationBrief: Agent17CoordinationBrief;
}

export function buildAgent17ReadinessGate(
  inputs: Agent17ReadinessGateInputs
): Agent17ReadinessGateSnapshot {
  const signals: Agent17ReadinessGateSnapshot['signals'] = [];

  signals.push({
    id: 'cadence_index',
    label: 'Cadence lattice index',
    value: inputs.cadenceLattice.cadenceIndex,
    unit: 'index',
  });

  signals.push({
    id: 'handoff_score',
    label: 'Handoff readiness score',
    value: inputs.handoffReadiness.readinessScore,
    unit: 'index',
  });

  signals.push({
    id: 'brief_sections',
    label: 'Coordination brief sections',
    value: inputs.coordinationBrief.sections.length,
    unit: 'index',
  });

  signals.push({
    id: 'blocker_count',
    label: 'Handoff blockers',
    value: inputs.handoffReadiness.blockers.length,
    unit: 'index',
  });

  signals.push({
    id: 'gi_tags',
    label: 'GI handoff tags',
    value: inputs.coordinationBrief.giHandoffTags.length,
    unit: 'index',
  });

  const handoffReady =
    !handoffReadinessBlocked(inputs.handoffReadiness) &&
    inputs.handoffReadiness.readinessScore >= 55;

  const readinessScore = Math.max(
    0,
    Math.min(
      100,
      Math.round(
        inputs.cadenceLattice.cadenceIndex * 0.45 +
          inputs.handoffReadiness.readinessScore * 0.35 +
          Math.min(100, inputs.coordinationBrief.sections.length * 18) * 0.2
      )
    )
  );

  const stopSignals =
    cadenceLatticeBlocksRun(inputs.cadenceLattice) ||
    handoffReadinessBlocked(inputs.handoffReadiness) ||
    inputs.cadenceLattice.band === 'stalled';

  const band: Agent17ReadinessGateSnapshot['band'] = stopSignals
    ? 'stop'
    : readinessScore >= 68 &&
        handoffReady &&
        inputs.cadenceLattice.band !== 'stalled'
      ? 'go'
      : 'caution';

  const runAllowed =
    band === 'go' &&
    handoffReady &&
    !cadenceLatticeBlocksRun(inputs.cadenceLattice);

  return {
    readinessScore,
    band,
    signals,
    handoffReady,
    runAllowed,
    headline: `Readiness ${band} (${readinessScore}/100) · ${signals.length} signals`,
  };
}

export function readinessGateBlocksRun(snapshot: Agent17ReadinessGateSnapshot): boolean {
  return snapshot.band === 'stop' || !snapshot.runAllowed;
}
