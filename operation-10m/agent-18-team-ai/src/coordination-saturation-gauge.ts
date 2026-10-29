import { AGENT18_LIMITS } from './types.ts';

export interface CoordinationSaturationInputs {
  directiveProposalCount: number;
  pendingHandoffCount: number;
  activeLeaseCount: number;
  activeWorkstreamCount: number;
  suppressedDirectiveCount?: number;
}

export interface CoordinationSaturationReport {
  saturationIndex: number;
  notes: string[];
}

function ratio(numerator: number, limit: number): number {
  if (limit <= 0) return 0;
  return Math.min(1, numerator / limit);
}

/**
 * Measure how close the team is to coordination resource limits (directives, handoffs, leases, workstreams).
 */
export function measureCoordinationSaturation(
  inputs: CoordinationSaturationInputs,
): CoordinationSaturationReport {
  const notes: string[] = [];
  const directiveLoad =
    inputs.directiveProposalCount + (inputs.suppressedDirectiveCount ?? 0);
  const ratios = [
    { label: 'directives', value: ratio(directiveLoad, AGENT18_LIMITS.maxDirectivesPerTeamPerTurn) },
    { label: 'handoffs', value: ratio(inputs.pendingHandoffCount, AGENT18_LIMITS.maxHandoffs) },
    { label: 'leases', value: ratio(inputs.activeLeaseCount, AGENT18_LIMITS.maxLeases) },
    { label: 'workstreams', value: ratio(inputs.activeWorkstreamCount, AGENT18_LIMITS.maxWorkstreams) },
  ];

  ratios
    .filter(r => r.value >= 0.75)
    .forEach(r => notes.push(`Coordination ${r.label} at ${Math.round(r.value * 100)}% of limit`));

  const peak = Math.max(...ratios.map(r => r.value));
  const average = ratios.reduce((s, r) => s + r.value, 0) / ratios.length;
  const saturationIndex = Math.round(Math.min(100, peak * 70 + average * 30));

  return {
    saturationIndex,
    notes: notes.slice(0, 6),
  };
}

export function combineDualTeamCoordinationSaturation(friendly: number, enemy: number | null): number {
  if (enemy === null) return friendly;
  return Math.max(friendly, enemy);
}
