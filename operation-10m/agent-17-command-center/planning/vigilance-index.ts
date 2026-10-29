import type {
  Agent17VigilanceIndexSnapshot,
  Agent17WatchAccordSnapshot,
  Agent17WatchershipIndexSnapshot,
} from '../types/command-center-types.ts';
import { watchAccordBlocksSentinel } from './watch-accord.ts';
import { watchershipIndexBlocksWatch } from './watchership-index.ts';

export interface Agent17VigilanceIndexInputs {
  watchAccord: Agent17WatchAccordSnapshot;
  watchershipIndex: Agent17WatchershipIndexSnapshot;
}

export function buildAgent17VigilanceIndex(
  inputs: Agent17VigilanceIndexInputs
): Agent17VigilanceIndexSnapshot {
  const mandates: Agent17VigilanceIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'watch_seated',
    label: 'Watch accord watch-seated',
    engaged:
      inputs.watchAccord.watchSeated && !watchAccordBlocksSentinel(inputs.watchAccord),
    weight: 30,
  });

  mandates.push({
    id: 'watchership_engaged',
    label: 'Watchership index engaged',
    engaged: inputs.watchershipIndex.watchershipEngaged,
    weight: 25,
  });

  mandates.push({
    id: 'watch_band',
    label: 'Watch seated or interim',
    engaged:
      inputs.watchAccord.band === 'seated' || inputs.watchAccord.band === 'interim',
    weight: 20,
  });

  mandates.push({
    id: 'watchership_score',
    label: 'Watchership score headroom',
    engaged: inputs.watchershipIndex.watchershipScore >= 40,
    weight: 15,
  });

  mandates.push({
    id: 'watch_score',
    label: 'Watch score headroom',
    engaged: inputs.watchAccord.watchScore >= 2,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.engaged ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const vigilanceScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    watchAccordBlocksSentinel(inputs.watchAccord) ||
    watchershipIndexBlocksWatch(inputs.watchershipIndex);

  const band: Agent17VigilanceIndexSnapshot['band'] = revokedSignals
    ? 'revoked'
    : vigilanceScore >= 43 &&
        inputs.watchershipIndex.band === 'engaged' &&
        inputs.watchAccord.band === 'seated'
      ? 'engaged'
      : 'tentative';

  const vigilanceEngaged =
    band === 'engaged' &&
    inputs.watchAccord.watchSeated &&
    !watchAccordBlocksSentinel(inputs.watchAccord);

  return {
    vigilanceScore,
    band,
    mandates,
    watchBand: inputs.watchAccord.band,
    vigilanceEngaged,
    headline: `Vigilance ${band} (${vigilanceScore}/100) · ${mandates.filter(m => m.engaged).length}/${mandates.length} mandates`,
  };
}

export function vigilanceIndexBlocksVigil(
  snapshot: Agent17VigilanceIndexSnapshot
): boolean {
  return snapshot.band === 'revoked' || !snapshot.vigilanceEngaged;
}
