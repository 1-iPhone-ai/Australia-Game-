import type {
  Agent17SentinelAccordSnapshot,
  Agent17SentinelshipIndexSnapshot,
  Agent17WardenAccordSnapshot,
  Agent17WardenshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { wardenAccordBlocksOverseer } from './warden-accord.ts';
import { sentinelshipIndexBlocksSentinel } from './sentinelship-index.ts';

export interface Agent17SentinelAccordInputs {
  sentinelshipIndex: Agent17SentinelshipIndexSnapshot;
  wardenAccord: Agent17WardenAccordSnapshot;
  wardenshipIndex: Agent17WardenshipIndexSnapshot;
}

export function buildAgent17SentinelAccord(
  inputs: Agent17SentinelAccordInputs
): Agent17SentinelAccordSnapshot {
  const directives: Agent17SentinelAccordSnapshot['directives'] = [];

  directives.push({
    id: 'sentinelship_engaged',
    label: 'Sentinelship index sentinelship-engaged',
    seated:
      inputs.sentinelshipIndex.sentinelshipEngaged &&
      !sentinelshipIndexBlocksSentinel(inputs.sentinelshipIndex),
    weight: 30,
  });

  directives.push({
    id: 'sentinelship_band',
    label: 'Sentinelship engaged or tentative',
    seated:
      inputs.sentinelshipIndex.band === 'engaged' ||
      inputs.sentinelshipIndex.band === 'tentative',
    weight: 25,
  });

  directives.push({
    id: 'warden_clear',
    label: 'Warden accord not blocking overseer',
    seated: !wardenAccordBlocksOverseer(inputs.wardenAccord),
    weight: 20,
  });

  directives.push({
    id: 'wardenship_band',
    label: 'Wardenship engaged',
    seated: inputs.wardenshipIndex.band === 'engaged',
    weight: 15,
  });

  directives.push({
    id: 'sentinelship_score',
    label: 'Sentinelship score headroom',
    seated: inputs.sentinelshipIndex.sentinelshipScore >= 2,
    weight: 10,
  });

  const weighted = directives.reduce(
    (n, d) => n + (d.seated ? 100 : 1) * (d.weight / 100),
    0
  );
  const totalWeight = directives.reduce((n, d) => n + d.weight, 0);
  const sentinelScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const vacatedSignals =
    sentinelshipIndexBlocksSentinel(inputs.sentinelshipIndex) ||
    wardenAccordBlocksOverseer(inputs.wardenAccord);

  const band: Agent17SentinelAccordSnapshot['band'] = vacatedSignals
    ? 'vacated'
    : sentinelScore >= 43 &&
        inputs.sentinelshipIndex.band === 'engaged' &&
        inputs.wardenAccord.band === 'seated'
      ? 'seated'
      : 'interim';

  const sentinelSeated =
    band === 'seated' &&
    inputs.sentinelshipIndex.sentinelshipEngaged &&
    !sentinelshipIndexBlocksSentinel(inputs.sentinelshipIndex);

  return {
    sentinelScore,
    band,
    directives,
    sentinelshipBand: inputs.sentinelshipIndex.band,
    sentinelSeated,
    headline: `Sentinel ${band} (${sentinelScore}/100) · ${directives.filter(d => d.seated).length}/${directives.length} directives`,
  };
}

export function sentinelAccordBlocksWarden(
  snapshot: Agent17SentinelAccordSnapshot
): boolean {
  return snapshot.band === 'vacated' || !snapshot.sentinelSeated;
}
