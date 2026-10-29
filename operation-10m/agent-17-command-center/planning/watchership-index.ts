import type {
  Agent17SentinelAccordSnapshot,
  Agent17SentinelshipIndexSnapshot,
  Agent17WatchershipIndexSnapshot,
} from '../types/command-center-types.ts';
import { sentinelAccordBlocksWarden } from './sentinel-accord.ts';
import { sentinelshipIndexBlocksSentinel } from './sentinelship-index.ts';

export interface Agent17WatchershipIndexInputs {
  sentinelAccord: Agent17SentinelAccordSnapshot;
  sentinelshipIndex: Agent17SentinelshipIndexSnapshot;
}

export function buildAgent17WatchershipIndex(
  inputs: Agent17WatchershipIndexInputs
): Agent17WatchershipIndexSnapshot {
  const mandates: Agent17WatchershipIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'sentinel_seated',
    label: 'Sentinel accord sentinel-seated',
    engaged:
      inputs.sentinelAccord.sentinelSeated &&
      !sentinelshipIndexBlocksSentinel(inputs.sentinelshipIndex),
    weight: 30,
  });

  mandates.push({
    id: 'sentinelship_engaged',
    label: 'Sentinelship index engaged',
    engaged: inputs.sentinelshipIndex.sentinelshipEngaged,
    weight: 25,
  });

  mandates.push({
    id: 'sentinel_band',
    label: 'Sentinel seated or interim',
    engaged:
      inputs.sentinelAccord.band === 'seated' || inputs.sentinelAccord.band === 'interim',
    weight: 20,
  });

  mandates.push({
    id: 'sentinelship_score',
    label: 'Sentinelship score headroom',
    engaged: inputs.sentinelshipIndex.sentinelshipScore >= 40,
    weight: 15,
  });

  mandates.push({
    id: 'sentinel_score',
    label: 'Sentinel score headroom',
    engaged: inputs.sentinelAccord.sentinelScore >= 2,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.engaged ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const watchershipScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    sentinelAccordBlocksWarden(inputs.sentinelAccord) ||
    sentinelshipIndexBlocksSentinel(inputs.sentinelshipIndex);

  const band: Agent17WatchershipIndexSnapshot['band'] = revokedSignals
    ? 'revoked'
    : watchershipScore >= 43 &&
        inputs.sentinelshipIndex.band === 'engaged' &&
        inputs.sentinelAccord.band === 'seated'
      ? 'engaged'
      : 'tentative';

  const watchershipEngaged =
    band === 'engaged' &&
    inputs.sentinelAccord.sentinelSeated &&
    !sentinelshipIndexBlocksSentinel(inputs.sentinelshipIndex);

  return {
    watchershipScore,
    band,
    mandates,
    sentinelBand: inputs.sentinelAccord.band,
    watchershipEngaged,
    headline: `Watchership ${band} (${watchershipScore}/100) · ${mandates.filter(m => m.engaged).length}/${mandates.length} mandates`,
  };
}

export function watchershipIndexBlocksWatch(
  snapshot: Agent17WatchershipIndexSnapshot
): boolean {
  return snapshot.band === 'revoked' || !snapshot.watchershipEngaged;
}
