import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 054 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_054_META = {
  id: 'compromise_054',
  regionId: 'NT' as V1034CiresRegionId,
  primaryChannel: 'rural_clinic' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'recovering' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 49715,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_054_COEF = {
  k0: 50.9000,
  k1: 37.4000,
  k2: 23.9000,
  k3: 10.4000,
  k4: 96.6000,
  k5: 83.1000,
  k6: 69.6000,
  k7: 56.1000,
  k8: 42.6000,
  k9: 29.1000,
  k10: 15.6000,
  k11: 2.1000,
  k12: 88.3000,
  k13: 74.8000,
  k14: 61.3000,
  k15: 47.8000,
  k16: 34.3000,
  k17: 20.8000,
  k18: 7.3000,
  k19: 93.5000,
  k20: 80.0000,
  k21: 66.5000,
  k22: 53.0000,
  k23: 39.5000,
  k24: 26.0000,
  k25: 12.5000,
  k26: 98.7000,
  k27: 85.2000,
  k28: 71.7000,
  k29: 58.2000,
  k30: 44.7000,
  k31: 31.2000,
  k32: 17.7000,
  k33: 4.2000,
  k34: 90.4000,
  k35: 76.9000,
  k36: 63.4000,
  k37: 49.9000,
  k38: 36.4000,
  k39: 22.9000,
  k40: 9.4000,
  k41: 95.6000,
  k42: 82.1000,
  k43: 68.6000,
  k44: 55.1000,
  k45: 41.6000,
  k46: 28.1000,
  k47: 14.6000,
  k48: 1.1000,
  k49: 87.3000,
  k50: 73.8000,
  k51: 60.3000,
  k52: 46.8000,
  k53: 33.3000,
  k54: 19.8000,
  k55: 6.3000,
  k56: 92.5000,
  k57: 79.0000,
  k58: 65.5000,
  k59: 52.0000,
  k60: 38.5000,
  k61: 25.0000,
  k62: 11.5000,
  k63: 97.7000,
  k64: 84.2000,
  k65: 70.7000,
  k66: 57.2000,
  k67: 43.7000,
  k68: 30.2000,
  k69: 16.7000,
  k70: 3.2000,
  k71: 89.4000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_054_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_054_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_054_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_054_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_054_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_054_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_054_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_054_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_054_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_054_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_054_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
