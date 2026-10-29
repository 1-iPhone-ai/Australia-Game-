import type { V1014WorkforceAf20Bridge, V1014WorkforceTurnInput } from '../types/core';
import { V1014_WORKFORCE_clamp } from '../engine/workforce-migration-utils';
import { readV1014WorkforceAf20Bridge } from './adapter-20ac-workforce';

export function computeV1014WorkforceAf20HouseholdBridge(
  input: V1014WorkforceTurnInput,
  mismatchIndex: number,
): V1014WorkforceAf20Bridge {
  return readV1014WorkforceAf20Bridge(input.af20, mismatchIndex);
}

export function applyV1014WorkforceAf20DemandOverrides<T extends { consumptionElasticity?: number }>(
  inputs: T,
  bridge: V1014WorkforceAf20Bridge,
): T {
  return {
    ...inputs,
    consumptionElasticity: V1014_WORKFORCE_clamp(
      (inputs.consumptionElasticity ?? 1) * bridge.domesticDemandMultiplier,
      0.5,
      1.25,
    ),
  };
}
