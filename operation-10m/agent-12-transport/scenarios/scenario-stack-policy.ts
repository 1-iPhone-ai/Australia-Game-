import type { TransportStressScenario } from '../types.ts';

/** Additional utilization when multiple scenarios overlap (cap applied downstream). */
export function computeScenarioStackFactor(scenarios: TransportStressScenario[]): number {
  if (scenarios.length <= 1) return 1;
  return 1 + Math.min(0.35, (scenarios.length - 1) * 0.08);
}

export function applyScenarioStackToUtilization(
  utilization: Partial<Record<'freight' | 'trade' | 'mobility', number>> | undefined,
  stackFactor: number,
): Partial<Record<'freight' | 'trade' | 'mobility', number>> {
  if (stackFactor <= 1 || !utilization) return utilization ?? {};
  const out = { ...utilization };
  for (const key of ['freight', 'trade', 'mobility'] as const) {
    if (out[key] != null) out[key] = Math.min(1.25, out[key]! * stackFactor);
  }
  return out;
}
