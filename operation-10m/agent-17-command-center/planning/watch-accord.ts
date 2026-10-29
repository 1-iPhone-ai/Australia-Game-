import type {
  Agent17SentinelAccordSnapshot,
  Agent17SentinelshipIndexSnapshot,
  Agent17WatchAccordSnapshot,
  Agent17WatchershipIndexSnapshot,
} from '../types/command-center-types.ts';
import { sentinelAccordBlocksWarden } from './sentinel-accord.ts';
import { watchershipIndexBlocksWatch } from './watchership-index.ts';

export interface Agent17WatchAccordInputs {
  watchershipIndex: Agent17WatchershipIndexSnapshot;
  sentinelAccord: Agent17SentinelAccordSnapshot;
  sentinelshipIndex: Agent17SentinelshipIndexSnapshot;
}

export function buildAgent17WatchAccord(
  inputs: Agent17WatchAccordInputs
): Agent17WatchAccordSnapshot {
  const directives: Agent17WatchAccordSnapshot['directives'] = [];

  directives.push({
    id: 'watchership_engaged',
    label: 'Watchership index watchership-engaged',
    seated:
      inputs.watchershipIndex.watchershipEngaged &&
      !watchershipIndexBlocksWatch(inputs.watchershipIndex),
    weight: 30,
  });

  directives.push({
    id: 'watchership_band',
    label: 'Watchership engaged or tentative',
    seated:
      inputs.watchershipIndex.band === 'engaged' ||
      inputs.watchershipIndex.band === 'tentative',
    weight: 25,
  });

  directives.push({
    id: 'sentinel_clear',
    label: 'Sentinel accord not blocking warden',
    seated: !sentinelAccordBlocksWarden(inputs.sentinelAccord),
    weight: 20,
  });

  directives.push({
    id: 'sentinelship_band',
    label: 'Sentinelship engaged',
    seated: inputs.sentinelshipIndex.band === 'engaged',
    weight: 15,
  });

  directives.push({
    id: 'watchership_score',
    label: 'Watchership score headroom',
    seated: inputs.watchershipIndex.watchershipScore >= 2,
    weight: 10,
  });

  const weighted = directives.reduce(
    (n, d) => n + (d.seated ? 100 : 1) * (d.weight / 100),
    0
  );
  const totalWeight = directives.reduce((n, d) => n + d.weight, 0);
  const watchScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const vacatedSignals =
    watchershipIndexBlocksWatch(inputs.watchershipIndex) ||
    sentinelAccordBlocksWarden(inputs.sentinelAccord);

  const band: Agent17WatchAccordSnapshot['band'] = vacatedSignals
    ? 'vacated'
    : watchScore >= 43 &&
        inputs.watchershipIndex.band === 'engaged' &&
        inputs.sentinelAccord.band === 'seated'
      ? 'seated'
      : 'interim';

  const watchSeated =
    band === 'seated' &&
    inputs.watchershipIndex.watchershipEngaged &&
    !watchershipIndexBlocksWatch(inputs.watchershipIndex);

  return {
    watchScore,
    band,
    directives,
    watchershipBand: inputs.watchershipIndex.band,
    watchSeated,
    headline: `Watch ${band} (${watchScore}/100) · ${directives.filter(d => d.seated).length}/${directives.length} directives`,
  };
}

export function watchAccordBlocksSentinel(snapshot: Agent17WatchAccordSnapshot): boolean {
  return snapshot.band === 'vacated' || !snapshot.watchSeated;
}
