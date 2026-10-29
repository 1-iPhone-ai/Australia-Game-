import type {
  Agent17VigilAccordSnapshot,
  Agent17VigilanceIndexSnapshot,
  Agent17WatchAccordSnapshot,
  Agent17WatchershipIndexSnapshot,
} from '../types/command-center-types.ts';
import { vigilanceIndexBlocksVigil } from './vigilance-index.ts';
import { watchAccordBlocksSentinel } from './watch-accord.ts';

export interface Agent17VigilAccordInputs {
  vigilanceIndex: Agent17VigilanceIndexSnapshot;
  watchAccord: Agent17WatchAccordSnapshot;
  watchershipIndex: Agent17WatchershipIndexSnapshot;
}

export function buildAgent17VigilAccord(
  inputs: Agent17VigilAccordInputs
): Agent17VigilAccordSnapshot {
  const directives: Agent17VigilAccordSnapshot['directives'] = [];

  directives.push({
    id: 'vigilance_engaged',
    label: 'Vigilance index vigilance-engaged',
    seated:
      inputs.vigilanceIndex.vigilanceEngaged &&
      !vigilanceIndexBlocksVigil(inputs.vigilanceIndex),
    weight: 30,
  });

  directives.push({
    id: 'vigilance_band',
    label: 'Vigilance engaged or tentative',
    seated:
      inputs.vigilanceIndex.band === 'engaged' ||
      inputs.vigilanceIndex.band === 'tentative',
    weight: 25,
  });

  directives.push({
    id: 'watch_clear',
    label: 'Watch accord not blocking sentinel',
    seated: !watchAccordBlocksSentinel(inputs.watchAccord),
    weight: 20,
  });

  directives.push({
    id: 'watchership_band',
    label: 'Watchership engaged',
    seated: inputs.watchershipIndex.band === 'engaged',
    weight: 15,
  });

  directives.push({
    id: 'vigilance_score',
    label: 'Vigilance score headroom',
    seated: inputs.vigilanceIndex.vigilanceScore >= 2,
    weight: 10,
  });

  const weighted = directives.reduce(
    (n, d) => n + (d.seated ? 100 : 1) * (d.weight / 100),
    0
  );
  const totalWeight = directives.reduce((n, d) => n + d.weight, 0);
  const vigilScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const vacatedSignals =
    vigilanceIndexBlocksVigil(inputs.vigilanceIndex) ||
    watchAccordBlocksSentinel(inputs.watchAccord);

  const band: Agent17VigilAccordSnapshot['band'] = vacatedSignals
    ? 'vacated'
    : vigilScore >= 43 &&
        inputs.vigilanceIndex.band === 'engaged' &&
        inputs.watchAccord.band === 'seated'
      ? 'seated'
      : 'interim';

  const vigilSeated =
    band === 'seated' &&
    inputs.vigilanceIndex.vigilanceEngaged &&
    !vigilanceIndexBlocksVigil(inputs.vigilanceIndex);

  return {
    vigilScore,
    band,
    directives,
    vigilanceBand: inputs.vigilanceIndex.band,
    vigilSeated,
    headline: `Vigil ${band} (${vigilScore}/100) · ${directives.filter(d => d.seated).length}/${directives.length} directives`,
  };
}

export function vigilAccordBlocksWatch(snapshot: Agent17VigilAccordSnapshot): boolean {
  return snapshot.band === 'vacated' || !snapshot.vigilSeated;
}
