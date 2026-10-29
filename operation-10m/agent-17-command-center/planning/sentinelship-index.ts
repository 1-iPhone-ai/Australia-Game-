import type {
  Agent17SentinelshipIndexSnapshot,
  Agent17WardenAccordSnapshot,
  Agent17WardenshipIndexSnapshot,
} from '../types/command-center-types.ts';
import { wardenAccordBlocksOverseer } from './warden-accord.ts';
import { wardenshipIndexBlocksWarden } from './wardenship-index.ts';

export interface Agent17SentinelshipIndexInputs {
  wardenAccord: Agent17WardenAccordSnapshot;
  wardenshipIndex: Agent17WardenshipIndexSnapshot;
}

export function buildAgent17SentinelshipIndex(
  inputs: Agent17SentinelshipIndexInputs
): Agent17SentinelshipIndexSnapshot {
  const mandates: Agent17SentinelshipIndexSnapshot['mandates'] = [];

  mandates.push({
    id: 'warden_seated',
    label: 'Warden accord warden-seated',
    engaged:
      inputs.wardenAccord.wardenSeated &&
      !wardenshipIndexBlocksWarden(inputs.wardenshipIndex),
    weight: 30,
  });

  mandates.push({
    id: 'wardenship_engaged',
    label: 'Wardenship index engaged',
    engaged: inputs.wardenshipIndex.wardenshipEngaged,
    weight: 25,
  });

  mandates.push({
    id: 'warden_band',
    label: 'Warden seated or interim',
    engaged:
      inputs.wardenAccord.band === 'seated' || inputs.wardenAccord.band === 'interim',
    weight: 20,
  });

  mandates.push({
    id: 'wardenship_score',
    label: 'Wardenship score headroom',
    engaged: inputs.wardenshipIndex.wardenshipScore >= 40,
    weight: 15,
  });

  mandates.push({
    id: 'warden_score',
    label: 'Warden score headroom',
    engaged: inputs.wardenAccord.wardenScore >= 2,
    weight: 10,
  });

  const weighted = mandates.reduce(
    (n, m) => n + (m.engaged ? 100 : 1) * (m.weight / 100),
    0
  );
  const totalWeight = mandates.reduce((n, m) => n + m.weight, 0);
  const sentinelshipScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const revokedSignals =
    wardenAccordBlocksOverseer(inputs.wardenAccord) ||
    wardenshipIndexBlocksWarden(inputs.wardenshipIndex);

  const band: Agent17SentinelshipIndexSnapshot['band'] = revokedSignals
    ? 'revoked'
    : sentinelshipScore >= 43 &&
        inputs.wardenshipIndex.band === 'engaged' &&
        inputs.wardenAccord.band === 'seated'
      ? 'engaged'
      : 'tentative';

  const sentinelshipEngaged =
    band === 'engaged' &&
    inputs.wardenAccord.wardenSeated &&
    !wardenshipIndexBlocksWarden(inputs.wardenshipIndex);

  return {
    sentinelshipScore,
    band,
    mandates,
    wardenBand: inputs.wardenAccord.band,
    sentinelshipEngaged,
    headline: `Sentinelship ${band} (${sentinelshipScore}/100) · ${mandates.filter(m => m.engaged).length}/${mandates.length} mandates`,
  };
}

export function sentinelshipIndexBlocksSentinel(
  snapshot: Agent17SentinelshipIndexSnapshot
): boolean {
  return snapshot.band === 'revoked' || !snapshot.sentinelshipEngaged;
}
