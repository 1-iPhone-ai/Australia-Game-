import type {
  Agent17CadenceLatticeSnapshot,
  Agent17DirectiveSynthesisSnapshot,
  Agent17ExecutionClosureSnapshot,
  Agent17ExecutionPacingSnapshot,
} from '../types/command-center-types.ts';
import { directiveSynthesisBlocksAdvance } from './directive-synthesis.ts';

export interface Agent17CadenceLatticeInputs {
  executionClosure: Agent17ExecutionClosureSnapshot;
  directiveSynthesis: Agent17DirectiveSynthesisSnapshot;
  executionPacing: Agent17ExecutionPacingSnapshot;
}

export function buildAgent17CadenceLattice(
  inputs: Agent17CadenceLatticeInputs
): Agent17CadenceLatticeSnapshot {
  const factors: Agent17CadenceLatticeSnapshot['factors'] = [];

  factors.push({
    id: 'closure_score',
    label: 'Execution closure',
    score: inputs.executionClosure.closureScore,
    weight: 35,
  });

  factors.push({
    id: 'synthesis_index',
    label: 'Directive synthesis',
    score: inputs.directiveSynthesis.synthesisIndex,
    weight: 30,
  });

  const pacingScore =
    inputs.executionPacing.pacingBand === 'urgent'
      ? 88
      : inputs.executionPacing.pacingBand === 'steady'
        ? 72
        : 38;
  factors.push({
    id: 'pacing_band',
    label: 'Execution pacing band',
    score: pacingScore,
    weight: 20,
  });

  const budgetScore = Math.max(
    0,
    Math.min(100, inputs.executionPacing.turnBudgetRemaining * 12)
  );
  factors.push({
    id: 'turn_budget',
    label: 'Turn budget headroom',
    score: budgetScore,
    weight: 15,
  });

  const weighted = factors.reduce((n, f) => n + f.score * (f.weight / 100), 0);
  const totalWeight = factors.reduce((n, f) => n + f.weight, 0);
  const cadenceIndex = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const stalledSignals =
    inputs.executionClosure.band === 'sealed' ||
    inputs.directiveSynthesis.band === 'locked' ||
    directiveSynthesisBlocksAdvance(inputs.directiveSynthesis);

  const band: Agent17CadenceLatticeSnapshot['band'] = stalledSignals
    ? 'stalled'
    : cadenceIndex >= 62 &&
        (inputs.executionClosure.band === 'open' ||
          inputs.executionClosure.band === 'narrow') &&
        (inputs.directiveSynthesis.band === 'ready' ||
          inputs.directiveSynthesis.band === 'pending')
      ? 'flowing'
      : 'steady';

  return {
    cadenceIndex,
    band,
    factors,
    closureBand: inputs.executionClosure.band,
    synthesisBand: inputs.directiveSynthesis.band,
    headline: `Cadence ${band} (${cadenceIndex}/100) · closure ${inputs.executionClosure.band}`,
  };
}

export function cadenceLatticeBlocksRun(snapshot: Agent17CadenceLatticeSnapshot): boolean {
  return snapshot.band === 'stalled' || snapshot.cadenceIndex < 34;
}
