import type {
  Agent17OverseerAccordSnapshot,
  Agent17OversightIndexSnapshot,
  Agent17WardenAccordSnapshot,
  Agent17WardenshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { oversightIndexBlocksOverseer } from './oversight-index.ts';
import { overseerAccordBlocksSuperintendent } from './overseer-accord.ts';
import { wardenshipIndexBlocksWarden } from './wardenship-index.ts';

export interface Agent17WardenAccordInputs {
  wardenshipIndex: Agent17WardenshipIndexSnapshot;
  overseerAccord: Agent17OverseerAccordSnapshot;
  oversightIndex: Agent17OversightIndexSnapshot;
}

export function buildAgent17WardenAccord(
  inputs: Agent17WardenAccordInputs
): Agent17WardenAccordSnapshot {
  const directives: Agent17WardenAccordSnapshot['directives'] = [];

  directives.push({
    id: 'wardenship_engaged',
    label: 'Wardenship index wardenship-engaged',
    seated:
      inputs.wardenshipIndex.wardenshipEngaged &&
      !wardenshipIndexBlocksWarden(inputs.wardenshipIndex),
    weight: 30,
  });

  directives.push({
    id: 'wardenship_band',
    label: 'Wardenship engaged or tentative',
    seated:
      inputs.wardenshipIndex.band === 'engaged' ||
      inputs.wardenshipIndex.band === 'tentative',
    weight: 25,
  });

  directives.push({
    id: 'overseer_seated',
    label: 'Overseer accord overseer-ready',
    seated:
      inputs.overseerAccord.overseerSeated &&
      !overseerAccordBlocksSuperintendent(inputs.overseerAccord),
    weight: 20,
  });

  directives.push({
    id: 'oversight_clear',
    label: 'Oversight index not blocking overseer',
    seated: !oversightIndexBlocksOverseer(inputs.oversightIndex),
    weight: 15,
  });

  directives.push({
    id: 'wardenship_score',
    label: 'Wardenship score headroom',
    seated: inputs.wardenshipIndex.wardenshipScore >= 2,
    weight: 10,
  });

  const weighted = directives.reduce(
    (n, d) => n + (d.seated ? 100 : 1) * (d.weight / 100),
    0
  );
  const totalWeight = directives.reduce((n, d) => n + d.weight, 0);
  const wardenScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const vacatedSignals =
    wardenshipIndexBlocksWarden(inputs.wardenshipIndex) ||
    overseerAccordBlocksSuperintendent(inputs.overseerAccord) ||
    oversightIndexBlocksOverseer(inputs.oversightIndex);

  const band: Agent17WardenAccordSnapshot['band'] = vacatedSignals
    ? 'vacated'
    : wardenScore >= 40 &&
        inputs.wardenshipIndex.band === 'engaged' &&
        inputs.overseerAccord.band === 'seated'
      ? 'seated'
      : 'interim';

  const wardenSeated =
    band === 'seated' &&
    inputs.wardenshipIndex.wardenshipEngaged &&
    !wardenshipIndexBlocksWarden(inputs.wardenshipIndex);

  return {
    wardenScore,
    band,
    directives,
    wardenshipBand: inputs.wardenshipIndex.band,
    overseerBand: inputs.overseerAccord.band,
    wardenSeated,
    headline: `Warden ${band} (${wardenScore}/100) · ${directives.filter(d => d.seated).length}/${directives.length} directives`,
  };
}

export function wardenAccordBlocksOverseer(snapshot: Agent17WardenAccordSnapshot): boolean {
  return snapshot.band === 'vacated' || !snapshot.wardenSeated;
}
