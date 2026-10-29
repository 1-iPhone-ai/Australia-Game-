import type {
  Agent17CoalitionAccordSnapshot,
  Agent17ExecutionSummonsSnapshot,
  Agent17PactIndexSnapshot,
  Agent17TheaterCommitmentSnapshot,
} from '../types/command-center-types.ts';
import { coalitionAccordBlocksAlliance } from './coalition-accord.ts';
import { executionSummonsBlocksField } from './execution-summons.ts';
import { theaterCommitmentBlocksTheater } from './theater-commitment.ts';

export interface Agent17PactIndexInputs {
  coalitionAccord: Agent17CoalitionAccordSnapshot;
  theaterCommitment: Agent17TheaterCommitmentSnapshot;
  executionSummons: Agent17ExecutionSummonsSnapshot;
}

export function buildAgent17PactIndex(inputs: Agent17PactIndexInputs): Agent17PactIndexSnapshot {
  const clauses: Agent17PactIndexSnapshot['clauses'] = [];

  clauses.push({
    id: 'coalition_sealed',
    label: 'Coalition accord sealed',
    binding:
      inputs.coalitionAccord.coalitionSealed &&
      !coalitionAccordBlocksAlliance(inputs.coalitionAccord),
    weight: 30,
  });

  clauses.push({
    id: 'coalition_band',
    label: 'Coalition sealed or draft',
    binding:
      inputs.coalitionAccord.band === 'sealed' || inputs.coalitionAccord.band === 'draft',
    weight: 25,
  });

  clauses.push({
    id: 'theater_bound',
    label: 'Theater commitment bound',
    binding:
      inputs.theaterCommitment.theaterBound && !theaterCommitmentBlocksTheater(inputs.theaterCommitment),
    weight: 20,
  });

  clauses.push({
    id: 'summons_clear',
    label: 'Execution summons not blocking field',
    binding: !executionSummonsBlocksField(inputs.executionSummons),
    weight: 15,
  });

  clauses.push({
    id: 'coalition_score',
    label: 'Coalition score headroom',
    binding: inputs.coalitionAccord.coalitionScore >= 36,
    weight: 10,
  });

  const weighted = clauses.reduce(
    (n, c) => n + (c.binding ? 100 : 8) * (c.weight / 100),
    0
  );
  const totalWeight = clauses.reduce((n, c) => n + c.weight, 0);
  const pactScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const voidSignals =
    coalitionAccordBlocksAlliance(inputs.coalitionAccord) ||
    theaterCommitmentBlocksTheater(inputs.theaterCommitment) ||
    executionSummonsBlocksField(inputs.executionSummons);

  const band: Agent17PactIndexSnapshot['band'] = voidSignals
    ? 'void'
    : pactScore >= 66 &&
        inputs.coalitionAccord.band === 'sealed' &&
        !coalitionAccordBlocksAlliance(inputs.coalitionAccord)
      ? 'binding'
      : 'provisional';

  const pactBinding =
    band === 'binding' &&
    inputs.coalitionAccord.coalitionSealed &&
    !coalitionAccordBlocksAlliance(inputs.coalitionAccord);

  return {
    pactScore,
    band,
    clauses,
    coalitionBand: inputs.coalitionAccord.band,
    theaterBand: inputs.theaterCommitment.band,
    pactBinding,
    headline: `Pact ${band} (${pactScore}/100) · ${clauses.filter(c => c.binding).length}/${clauses.length} clauses`,
  };
}

export function pactIndexBlocksUnity(snapshot: Agent17PactIndexSnapshot): boolean {
  return snapshot.band === 'void' || !snapshot.pactBinding;
}
