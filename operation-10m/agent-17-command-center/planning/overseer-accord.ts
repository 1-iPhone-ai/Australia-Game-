import type {
  Agent17OverseerAccordSnapshot,
  Agent17OversightIndexSnapshot,
  Agent17SuperintendenceIndexSnapshot,
  Agent17SuperintendentAccordSnapshot,
} from '../types/command-center-types.ts';
import { oversightIndexBlocksOverseer } from './oversight-index.ts';
import { superintendenceIndexBlocksSuperintendent } from './superintendence-index.ts';
import { superintendentAccordBlocksCurator } from './superintendent-accord.ts';

export interface Agent17OverseerAccordInputs {
  oversightIndex: Agent17OversightIndexSnapshot;
  superintendentAccord: Agent17SuperintendentAccordSnapshot;
  superintendenceIndex: Agent17SuperintendenceIndexSnapshot;
}

export function buildAgent17OverseerAccord(
  inputs: Agent17OverseerAccordInputs
): Agent17OverseerAccordSnapshot {
  const directives: Agent17OverseerAccordSnapshot['directives'] = [];

  directives.push({
    id: 'oversight_engaged',
    label: 'Oversight index oversight-engaged',
    seated:
      inputs.oversightIndex.oversightEngaged &&
      !oversightIndexBlocksOverseer(inputs.oversightIndex),
    weight: 30,
  });

  directives.push({
    id: 'oversight_band',
    label: 'Oversight engaged or tentative',
    seated:
      inputs.oversightIndex.band === 'engaged' ||
      inputs.oversightIndex.band === 'tentative',
    weight: 25,
  });

  directives.push({
    id: 'superintendent_chartered',
    label: 'Superintendent accord superintendent-ready',
    seated:
      inputs.superintendentAccord.superintendentChartered &&
      !superintendentAccordBlocksCurator(inputs.superintendentAccord),
    weight: 20,
  });

  directives.push({
    id: 'superintendence_clear',
    label: 'Superintendence index not blocking superintendent',
    seated: !superintendenceIndexBlocksSuperintendent(inputs.superintendenceIndex),
    weight: 15,
  });

  directives.push({
    id: 'oversight_score',
    label: 'Oversight score headroom',
    seated: inputs.oversightIndex.oversightScore >= 2,
    weight: 10,
  });

  const weighted = directives.reduce(
    (n, d) => n + (d.seated ? 100 : 1) * (d.weight / 100),
    0
  );
  const totalWeight = directives.reduce((n, d) => n + d.weight, 0);
  const overseerScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const vacatedSignals =
    oversightIndexBlocksOverseer(inputs.oversightIndex) ||
    superintendentAccordBlocksCurator(inputs.superintendentAccord) ||
    superintendenceIndexBlocksSuperintendent(inputs.superintendenceIndex);

  const band: Agent17OverseerAccordSnapshot['band'] = vacatedSignals
    ? 'vacated'
    : overseerScore >= 40 &&
        inputs.oversightIndex.band === 'engaged' &&
        inputs.superintendentAccord.band === 'chartered'
      ? 'seated'
      : 'interim';

  const overseerSeated =
    band === 'seated' &&
    inputs.oversightIndex.oversightEngaged &&
    !oversightIndexBlocksOverseer(inputs.oversightIndex);

  return {
    overseerScore,
    band,
    directives,
    oversightBand: inputs.oversightIndex.band,
    superintendentBand: inputs.superintendentAccord.band,
    overseerSeated,
    headline: `Overseer ${band} (${overseerScore}/100) · ${directives.filter(d => d.seated).length}/${directives.length} directives`,
  };
}

export function overseerAccordBlocksSuperintendent(
  snapshot: Agent17OverseerAccordSnapshot
): boolean {
  return snapshot.band === 'vacated' || !snapshot.overseerSeated;
}
