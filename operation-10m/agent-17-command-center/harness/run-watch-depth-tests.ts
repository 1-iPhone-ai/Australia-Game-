import { buildAgent17SentinelshipIndex } from '../planning/sentinelship-index.ts';
import { buildAgent17SentinelAccord } from '../planning/sentinel-accord.ts';
import { buildAgent17WatchershipIndex } from '../planning/watchership-index.ts';
import { buildAgent17WatchAccord } from '../planning/watch-accord.ts';
import { buildAgent17WardenAccord } from '../planning/warden-accord.ts';
import { buildAgent17WardenshipIndex } from '../planning/wardenship-index.ts';
import { buildAgent17OverseerAccord } from '../planning/overseer-accord.ts';
import { buildAgent17OversightIndex } from '../planning/oversight-index.ts';
import { buildAgent17SuperintendentAccord } from '../planning/superintendent-accord.ts';
import { buildAgent17SuperintendenceIndex } from '../planning/superintendence-index.ts';
import { buildAgent17CuratorAccord } from '../planning/curator-accord.ts';

export function runAgent17WatchDepthTests(): { passed: number; failed: number } {
  let passed = 0;
  let failed = 0;
  const ok = (c: boolean) => {
    if (c) passed += 1;
    else failed += 1;
  };
  const curatorAccord = buildAgent17CuratorAccord({});
  const superintendenceIndex = buildAgent17SuperintendenceIndex({ curatorAccord });
  const superintendentAccord = buildAgent17SuperintendentAccord({ superintendenceIndex });
  const oversightIndex = buildAgent17OversightIndex({
    superintendentAccord,
    superintendenceIndex,
    curatorAccord,
  });
  const overseerAccord = buildAgent17OverseerAccord({
    oversightIndex,
    superintendentAccord,
    superintendenceIndex,
  });
  const wardenshipIndex = buildAgent17WardenshipIndex({
    overseerAccord,
    oversightIndex,
    superintendentAccord,
  });
  const wardenAccord = buildAgent17WardenAccord({ wardenshipIndex, overseerAccord, oversightIndex });
  const sentinelshipIndex = buildAgent17SentinelshipIndex({ wardenAccord, wardenshipIndex });
  const sentinelAccord = buildAgent17SentinelAccord({ sentinelshipIndex, wardenAccord, wardenshipIndex });
  const watchershipIndex = buildAgent17WatchershipIndex({ sentinelAccord, sentinelshipIndex });
  const watchAccord = buildAgent17WatchAccord({ watchershipIndex, sentinelAccord, sentinelshipIndex });
  ok(watchershipIndex.mandates.length >= 5);
  ok(!!watchAccord.headline);
  ok(watchershipIndex.watchershipScore >= 0 && watchershipIndex.watchershipScore <= 100);
  return { passed, failed };
}
