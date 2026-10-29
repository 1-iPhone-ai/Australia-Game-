import type {
  Agent17ExecutionSummonsSnapshot,
  Agent17FieldIndexSnapshot,
  Agent17ReadinessGateSnapshot,
  Agent17TheaterCommitmentSnapshot,
} from '../types/command-center-types.ts';
import { fieldIndexBlocksCommitment } from './field-index.ts';
import { executionSummonsBlocksField } from './execution-summons.ts';
import { readinessGateBlocksRun } from './readiness-gate.ts';

export interface Agent17TheaterCommitmentInputs {
  fieldIndex: Agent17FieldIndexSnapshot;
  executionSummons: Agent17ExecutionSummonsSnapshot;
  readinessGate: Agent17ReadinessGateSnapshot;
}

export function buildAgent17TheaterCommitment(
  inputs: Agent17TheaterCommitmentInputs
): Agent17TheaterCommitmentSnapshot {
  const pledges: Agent17TheaterCommitmentSnapshot['pledges'] = [];

  pledges.push({
    id: 'field_engaged',
    label: 'Field index theater-ready',
    pledged: inputs.fieldIndex.theaterReady && !fieldIndexBlocksCommitment(inputs.fieldIndex),
    weight: 30,
  });

  pledges.push({
    id: 'field_band',
    label: 'Field engaged or staging',
    pledged:
      inputs.fieldIndex.band === 'engaged' || inputs.fieldIndex.band === 'staging',
    weight: 25,
  });

  pledges.push({
    id: 'readiness_run',
    label: 'Readiness gate allows run',
    pledged: !readinessGateBlocksRun(inputs.readinessGate),
    weight: 20,
  });

  pledges.push({
    id: 'summons_clear',
    label: 'Execution summons not blocking field',
    pledged: !executionSummonsBlocksField(inputs.executionSummons),
    weight: 15,
  });

  pledges.push({
    id: 'gate_score',
    label: 'Readiness gate score headroom',
    pledged: inputs.readinessGate.readinessScore >= 38,
    weight: 10,
  });

  const weighted = pledges.reduce(
    (n, p) => n + (p.pledged ? 100 : 11) * (p.weight / 100),
    0
  );
  const totalWeight = pledges.reduce((n, p) => n + p.weight, 0);
  const commitmentScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const withdrawnSignals =
    fieldIndexBlocksCommitment(inputs.fieldIndex) ||
    executionSummonsBlocksField(inputs.executionSummons) ||
    readinessGateBlocksRun(inputs.readinessGate);

  const band: Agent17TheaterCommitmentSnapshot['band'] = withdrawnSignals
    ? 'withdrawn'
    : commitmentScore >= 69 &&
        inputs.fieldIndex.band === 'engaged' &&
        !fieldIndexBlocksCommitment(inputs.fieldIndex)
      ? 'bound'
      : 'provisional';

  const theaterBound =
    band === 'bound' &&
    inputs.fieldIndex.theaterReady &&
    !readinessGateBlocksRun(inputs.readinessGate);

  return {
    commitmentScore,
    band,
    pledges,
    fieldBand: inputs.fieldIndex.band,
    theaterBound,
    headline: `Theater ${band} (${commitmentScore}/100) · ${pledges.filter(p => p.pledged).length}/${pledges.length} pledges`,
  };
}

export function theaterCommitmentBlocksTheater(snapshot: Agent17TheaterCommitmentSnapshot): boolean {
  return snapshot.band === 'withdrawn' || !snapshot.theaterBound;
}
