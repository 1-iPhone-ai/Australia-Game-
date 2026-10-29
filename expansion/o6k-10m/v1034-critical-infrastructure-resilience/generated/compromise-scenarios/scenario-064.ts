import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 064 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_064_META = {
  id: 'compromise_064',
  regionId: 'NSW' as V1034CiresRegionId,
  primaryChannel: 'rural_clinic' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'recovering' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 58825,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_064_COEF = {
  k0: 2.2000,
  k1: 2.4000,
  k2: 2.6000,
  k3: 2.8000,
  k4: 3.0000,
  k5: 3.2000,
  k6: 3.4000,
  k7: 3.6000,
  k8: 3.8000,
  k9: 4.0000,
  k10: 4.2000,
  k11: 4.4000,
  k12: 4.6000,
  k13: 4.8000,
  k14: 5.0000,
  k15: 5.2000,
  k16: 5.4000,
  k17: 5.6000,
  k18: 5.8000,
  k19: 6.0000,
  k20: 6.2000,
  k21: 6.4000,
  k22: 6.6000,
  k23: 6.8000,
  k24: 7.0000,
  k25: 7.2000,
  k26: 7.4000,
  k27: 7.6000,
  k28: 7.8000,
  k29: 8.0000,
  k30: 8.2000,
  k31: 8.4000,
  k32: 8.6000,
  k33: 8.8000,
  k34: 9.0000,
  k35: 9.2000,
  k36: 9.4000,
  k37: 9.6000,
  k38: 9.8000,
  k39: 10.0000,
  k40: 10.2000,
  k41: 10.4000,
  k42: 10.6000,
  k43: 10.8000,
  k44: 11.0000,
  k45: 11.2000,
  k46: 11.4000,
  k47: 11.6000,
  k48: 11.8000,
  k49: 12.0000,
  k50: 12.2000,
  k51: 12.4000,
  k52: 12.6000,
  k53: 12.8000,
  k54: 13.0000,
  k55: 13.2000,
  k56: 13.4000,
  k57: 13.6000,
  k58: 13.8000,
  k59: 14.0000,
  k60: 14.2000,
  k61: 14.4000,
  k62: 14.6000,
  k63: 14.8000,
  k64: 15.0000,
  k65: 15.2000,
  k66: 15.4000,
  k67: 15.6000,
  k68: 15.8000,
  k69: 16.0000,
  k70: 16.2000,
  k71: 16.4000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_064_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_064_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_064_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_064_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_064_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_064_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_064_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_064_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_064_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_064_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_064_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
