import type {
  Agent17CommandIndexSnapshot,
  Agent17CompactIndexSnapshot,
  Agent17SovereignAccordSnapshot,
  Agent17UnityAccordSnapshot,
} from '../types/command-center-types.ts';
import { commandIndexBlocksFederation } from './command-index.ts';
import { compactIndexBlocksSovereign } from './compact-index.ts';
import { unityAccordBlocksPact } from './unity-accord.ts';

export interface Agent17SovereignAccordInputs {
  compactIndex: Agent17CompactIndexSnapshot;
  unityAccord: Agent17UnityAccordSnapshot;
  commandIndex: Agent17CommandIndexSnapshot;
}

export function buildAgent17SovereignAccord(
  inputs: Agent17SovereignAccordInputs
): Agent17SovereignAccordSnapshot {
  const seals: Agent17SovereignAccordSnapshot['seals'] = [];

  seals.push({
    id: 'compact_locked',
    label: 'Compact index compact-locked',
    affixed:
      inputs.compactIndex.compactLocked && !compactIndexBlocksSovereign(inputs.compactIndex),
    weight: 30,
  });

  seals.push({
    id: 'compact_band',
    label: 'Compact tight or forming',
    affixed: inputs.compactIndex.band === 'tight' || inputs.compactIndex.band === 'forming',
    weight: 25,
  });

  seals.push({
    id: 'command_ready',
    label: 'Command index command-ready',
    affixed:
      inputs.commandIndex.commandReady && !commandIndexBlocksFederation(inputs.commandIndex),
    weight: 20,
  });

  seals.push({
    id: 'unity_clear',
    label: 'Unity accord not blocking pact',
    affixed: !unityAccordBlocksPact(inputs.unityAccord),
    weight: 15,
  });

  seals.push({
    id: 'command_score',
    label: 'Command score headroom',
    affixed: inputs.commandIndex.commandScore >= 46,
    weight: 10,
  });

  const weighted = seals.reduce(
    (n, s) => n + (s.affixed ? 100 : 6) * (s.weight / 100),
    0
  );
  const totalWeight = seals.reduce((n, s) => n + s.weight, 0);
  const sovereignScore = Math.max(
    0,
    Math.min(100, Math.round((weighted / Math.max(1, totalWeight)) * 100))
  );

  const abdicatedSignals =
    compactIndexBlocksSovereign(inputs.compactIndex) ||
    commandIndexBlocksFederation(inputs.commandIndex) ||
    unityAccordBlocksPact(inputs.unityAccord);

  const band: Agent17SovereignAccordSnapshot['band'] = abdicatedSignals
    ? 'abdicated'
    : sovereignScore >= 63 &&
        inputs.compactIndex.band === 'tight' &&
        inputs.commandIndex.band === 'supreme'
      ? 'crowned'
      : 'regent';

  const sovereigntyCrowned =
    band === 'crowned' &&
    inputs.compactIndex.compactLocked &&
    !commandIndexBlocksFederation(inputs.commandIndex);

  return {
    sovereignScore,
    band,
    seals,
    compactBand: inputs.compactIndex.band,
    commandBand: inputs.commandIndex.band,
    sovereigntyCrowned,
    headline: `Sovereign ${band} (${sovereignScore}/100) · ${seals.filter(s => s.affixed).length}/${seals.length} seals`,
  };
}

export function sovereignAccordBlocksCompact(snapshot: Agent17SovereignAccordSnapshot): boolean {
  return snapshot.band === 'abdicated' || !snapshot.sovereigntyCrowned;
}
