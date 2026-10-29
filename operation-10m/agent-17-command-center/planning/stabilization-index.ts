import type {
  Agent17EscalationMatrixSnapshot,
  Agent17RollbackAssuranceSnapshot,
  Agent17StabilizationIndexSnapshot,
} from '../types/command-center-types.ts';
import { escalationMatrixBlocksAutomation } from './escalation-matrix.ts';
import { rollbackAssuranceNeedsRestore } from './rollback-assurance.ts';

export interface Agent17StabilizationIndexInputs {
  escalationMatrix: Agent17EscalationMatrixSnapshot;
  rollbackAssurance: Agent17RollbackAssuranceSnapshot;
}

export function buildAgent17StabilizationIndex(
  inputs: Agent17StabilizationIndexInputs
): Agent17StabilizationIndexSnapshot {
  const factors: Agent17StabilizationIndexSnapshot['factors'] = [];

  const escalationHeadroom = Math.max(0, 100 - inputs.escalationMatrix.escalationIndex);
  factors.push({
    id: 'escalation_headroom',
    label: 'Escalation headroom',
    score: escalationHeadroom,
    weight: 35,
  });

  const assuranceScore = inputs.rollbackAssurance.assuranceScore;
  factors.push({
    id: 'rollback_assurance',
    label: 'Rollback assurance',
    score: assuranceScore,
    weight: 35,
  });

  const rungPenalty = Math.min(40, inputs.escalationMatrix.triggeredCount * 12);
  const rungScore = Math.max(0, 100 - rungPenalty);
  factors.push({
    id: 'rung_calm',
    label: 'Escalation rung calm',
    score: rungScore,
    weight: 15,
  });

  const restorePenalty = inputs.rollbackAssurance.restoreRecommended ? 35 : 0;
  const restoreScore = Math.max(0, 100 - restorePenalty);
  factors.push({
    id: 'restore_clear',
    label: 'Restore signal clear',
    score: restoreScore,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const stabilizationIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const volatileSignals =
    inputs.escalationMatrix.band === 'urgent' ||
    escalationMatrixBlocksAutomation(inputs.escalationMatrix) ||
    rollbackAssuranceNeedsRestore(inputs.rollbackAssurance);

  const band: Agent17StabilizationIndexSnapshot['band'] =
    volatileSignals || stabilizationIndex < 42
      ? 'volatile'
      : stabilizationIndex >= 70
        ? 'stable'
        : 'adjusting';

  return {
    stabilizationIndex,
    band,
    factors,
    escalationBand: inputs.escalationMatrix.band,
    assuranceBand: inputs.rollbackAssurance.band,
    headline: `Stabilization ${band} (${stabilizationIndex}/100) · esc ${inputs.escalationMatrix.band}`,
  };
}

export function stabilizationIndexBlocksAutomation(
  snapshot: Agent17StabilizationIndexSnapshot
): boolean {
  return snapshot.band === 'volatile' || snapshot.stabilizationIndex < 35;
}
