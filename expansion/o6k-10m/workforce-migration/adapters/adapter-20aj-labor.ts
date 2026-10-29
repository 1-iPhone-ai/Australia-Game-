import type { V1014WorkforceAj20Bridge, V1014WorkforceTurnInput } from '../types/core';
import { V1014_WORKFORCE_clamp } from '../engine/workforce-migration-utils';
import { readV1014WorkforceAj20Bridge } from './adapter-20ac-workforce';

export function computeV1014WorkforceAj20MigrationDelta(
  input: V1014WorkforceTurnInput,
  migrationPressure: number,
): V1014WorkforceAj20Bridge {
  return readV1014WorkforceAj20Bridge(input.aj20, migrationPressure);
}

export function applyV1014WorkforceAj20AttractivenessOverrides<T extends { regionalWeights?: Record<string, number> }>(
  base: T,
  bridge: V1014WorkforceAj20Bridge,
): T {
  const merged = { ...(base.regionalWeights ?? {}) };
  Object.entries(bridge.attractivenessDelta ?? {}).forEach(([region, score]) => {
    merged[region] = V1014_WORKFORCE_clamp((merged[region] ?? 50) + Number(score) * 0.02, 0, 100);
  });
  return { ...base, regionalWeights: merged };
}
