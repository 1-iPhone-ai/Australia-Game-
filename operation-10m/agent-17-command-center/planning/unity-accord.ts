import type {
  Agent17CoalitionAccordSnapshot,
  Agent17PactIndexSnapshot,
  Agent17StrategicIndexSnapshot,
  Agent17UnityAccordSnapshot,
} from '../types/command-center-types.ts';
import { coalitionAccordBlocksAlliance } from './coalition-accord.ts';
import { pactIndexBlocksUnity } from './pact-index.ts';
import { strategicIndexBlocksDoctrine } from './strategic-index.ts';

export interface Agent17UnityAccordInputs {
  pactIndex: Agent17PactIndexSnapshot;
  coalitionAccord: Agent17CoalitionAccordSnapshot;
  strategicIndex: Agent17StrategicIndexSnapshot;
}

export function buildAgent17UnityAccord(
  inputs: Agent17UnityAccordInputs
): Agent17UnityAccordSnapshot {
  const tenets: Agent17UnityAccordSnapshot['tenets'] = [];

  tenets.push({
    id: 'pact_binding',
    label: 'Pact index pact-binding',
    affirmed:
      inputs.pactIndex.pactBinding && !pactIndexBlocksUnity(inputs.pactIndex),
    weight: 30,
  });

  tenets.push({
    id: 'pact_band',
    label: 'Pact binding or provisional',
    affirmed: inputs.pactIndex.band === 'binding' || inputs.pactIndex.band === 'provisional',
    weight: 25,
  });

  tenets.push({
    id: 'strategic_coherent',
    label: 'Strategic index not fractured',
    affirmed:
      inputs.strategicIndex.band !== 'fractured' &&
      !strategicIndexBlocksDoctrine(inputs.strategicIndex),
    weight: 20,
  });

  tenets.push({
    id: 'coalition_clear',
    label: 'Coalition accord not blocking alliance',
    affirmed: !coalitionAccordBlocksAlliance(inputs.coalitionAccord),
    weight: 15,
  });

  tenets.push({
    id: 'strategic_score',
    label: 'Strategic score headroom',
    affirmed: inputs.strategicIndex.strategicScore >= 41,
    weight: 10,
  });

  const weighted = tenets.reduce(
    (n, t) => n + (t.affirmed ? 100 : 7) * (t.weight / 100),
    0
  );
  const totalWeight = tenets.reduce((n, t) => n + t.weight, 0);
  const unityScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const shatteredSignals =
    pactIndexBlocksUnity(inputs.pactIndex) ||
    coalitionAccordBlocksAlliance(inputs.coalitionAccord) ||
    strategicIndexBlocksDoctrine(inputs.strategicIndex);

  const band: Agent17UnityAccordSnapshot['band'] = shatteredSignals
    ? 'shattered'
    : unityScore >= 64 &&
        inputs.pactIndex.band === 'binding' &&
        inputs.strategicIndex.band === 'coherent'
      ? 'unified'
      : 'partial';

  const unityAchieved =
    band === 'unified' &&
    inputs.pactIndex.pactBinding &&
    !strategicIndexBlocksDoctrine(inputs.strategicIndex);

  return {
    unityScore,
    band,
    tenets,
    pactBand: inputs.pactIndex.band,
    strategicBand: inputs.strategicIndex.band,
    unityAchieved,
    headline: `Unity ${band} (${unityScore}/100) · ${tenets.filter(t => t.affirmed).length}/${tenets.length} tenets`,
  };
}

export function unityAccordBlocksPact(snapshot: Agent17UnityAccordSnapshot): boolean {
  return snapshot.band === 'shattered' || !snapshot.unityAchieved;
}
