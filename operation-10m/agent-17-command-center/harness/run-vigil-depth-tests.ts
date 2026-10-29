import { buildAgent17SentinelshipIndex } from '../planning/sentinelship-index.ts';
import { buildAgent17SentinelAccord } from '../planning/sentinel-accord.ts';
import { buildAgent17WatchershipIndex } from '../planning/watchership-index.ts';
import { buildAgent17WatchAccord } from '../planning/watch-accord.ts';
import { buildAgent17VigilanceIndex } from '../planning/vigilance-index.ts';
import { buildAgent17VigilAccord } from '../planning/vigil-accord.ts';
import { buildAgent17Wave56VigilAccordExtension } from '../planning/wave56-vigil-accord-extension.ts';
import { buildAgent17WardenAccord } from '../planning/warden-accord.ts';
import { buildAgent17WardenshipIndex } from '../planning/wardenship-index.ts';
import { buildAgent17OverseerAccord } from '../planning/overseer-accord.ts';
import { buildAgent17OversightIndex } from '../planning/oversight-index.ts';
import { buildAgent17SuperintendentAccord } from '../planning/superintendent-accord.ts';
import { buildAgent17SuperintendenceIndex } from '../planning/superintendence-index.ts';
import { buildAgent17CuratorAccord } from '../planning/curator-accord.ts';

export function runAgent17VigilDepthTests(): { passed: number; failed: number } {
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
  const vigilanceIndex = buildAgent17VigilanceIndex({ watchAccord, watchershipIndex });
  const vigilAccord = buildAgent17VigilAccord({ vigilanceIndex, watchAccord, watchershipIndex });
  ok(vigilanceIndex.mandates.length >= 5);
  ok(!!vigilAccord.headline);
  ok(vigilanceIndex.vigilanceScore >= 0 && vigilanceIndex.vigilanceScore <= 100);
  const wave56Ext = buildAgent17Wave56VigilAccordExtension(vigilAccord);
  ok(wave56Ext.wave56VigilScore >= 0 && wave56Ext.wave56VigilScore <= 100);
  ok(wave56Ext.headline.includes('Wave 56'));
  return { passed, failed };
}
