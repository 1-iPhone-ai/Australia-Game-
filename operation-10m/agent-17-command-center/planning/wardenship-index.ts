import type {
  Agent17OverseerAccordSnapshot,
  Agent17OversightIndexSnapshot,
  Agent17SuperintendentAccordSnapshot,
  Agent17WardenshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { overseerAccordBlocksSuperintendent } from './overseer-accord.ts';
import { oversightIndexBlocksOverseer } from './oversight-index.ts';
import { superintendentAccordBlocksCurator } from './superintendent-accord.ts';

export interface Agent17WardenshipIndexInputs {
  overseerAccord: Agent17OverseerAccordSnapshot;
  oversightIndex: Agent17OversightIndexSnapshot;
  superintendentAccord: Agent17SuperintendentAccordSnapshot;
}

export function buildAgent17WardenshipIndex(
  inputs: Agent17WardenshipIndexInputs
): Agent17WardenshipIndexSnapshot {
  const mandates: Agent17WardenshipIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'overseer_seated',
    label: 'Overseer accord overseer-seated',
    engaged:
      inputs.overseerAccord.overseerSeated &&
      !overseerAccordBlocksSuperintendent(inputs.overseerAccord),
    weight: 30,
  });

  mandates.push({
    id: 'overseer_band',
    label: 'Overseer seated or interim',
    engaged:
      inputs.overseerAccord.band === 'seated' || inputs.overseerAccord.band === 'interim',
    weight: 25,
  });

  mandates.push({
    id: 'oversight_engaged',
    label: 'Oversight index oversight-engaged',
    engaged:
      inputs.oversightIndex.oversightEngaged &&
      !oversightIndexBlocksOverseer(inputs.oversightIndex),
    weight: 20,
  });

  mandates.push({
    id: 'superintendent_clear',
    label: 'Superintendent accord not blocking curator',
    engaged: !superintendentAccordBlocksCurator(inputs.superintendentAccord),
    weight: 15,
  });

  mandates.push({
    id: 'oversight_score',
    label: 'Oversight score headroom',
    engaged: inputs.oversightIndex.oversightScore >= 2,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.engaged ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const wardenshipScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    overseerAccordBlocksSuperintendent(inputs.overseerAccord) ||
    oversightIndexBlocksOverseer(inputs.oversightIndex) ||
    superintendentAccordBlocksCurator(inputs.superintendentAccord);

  const band: Agent17WardenshipIndexSnapshot['band'] = revokedSignals
    ? 'revoked'
    : wardenshipScore >= 43 &&
        inputs.oversightIndex.band === 'engaged' &&
        inputs.overseerAccord.band === 'seated'
      ? 'engaged'
      : 'tentative';

  const wardenshipEngaged =
    band === 'engaged' &&
    inputs.overseerAccord.overseerSeated &&
    !overseerAccordBlocksSuperintendent(inputs.overseerAccord);

  return {
    wardenshipScore,
    band,
    mandates,
    overseerBand: inputs.overseerAccord.band,
    oversightBand: inputs.oversightIndex.band,
    wardenshipEngaged,
    headline: `Wardenship ${band} (${wardenshipScore}/100) · ${mandates.filter(m => m.engaged).length}/${mandates.length} mandates`,
  };
}

export function wardenshipIndexBlocksWarden(
  snapshot: Agent17WardenshipIndexSnapshot
): boolean {
  return snapshot.band === 'revoked' || !snapshot.wardenshipEngaged;
}
