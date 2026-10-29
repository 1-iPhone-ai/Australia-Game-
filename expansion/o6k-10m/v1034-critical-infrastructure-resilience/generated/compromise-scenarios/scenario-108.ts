import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 108 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_108_META = {
  id: 'compromise_108',
  regionId: 'SA' as V1034CiresRegionId,
  primaryChannel: 'regional' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'critical' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 98909,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_108_COEF = {
  k0: 27.2000,
  k1: 47.8000,
  k2: 68.4000,
  k3: 89.0000,
  k4: 9.9000,
  k5: 30.5000,
  k6: 51.1000,
  k7: 71.7000,
  k8: 92.3000,
  k9: 13.2000,
  k10: 33.8000,
  k11: 54.4000,
  k12: 75.0000,
  k13: 95.6000,
  k14: 16.5000,
  k15: 37.1000,
  k16: 57.7000,
  k17: 78.3000,
  k18: 98.9000,
  k19: 19.8000,
  k20: 40.4000,
  k21: 61.0000,
  k22: 81.6000,
  k23: 2.5000,
  k24: 23.1000,
  k25: 43.7000,
  k26: 64.3000,
  k27: 84.9000,
  k28: 5.8000,
  k29: 26.4000,
  k30: 47.0000,
  k31: 67.6000,
  k32: 88.2000,
  k33: 9.1000,
  k34: 29.7000,
  k35: 50.3000,
  k36: 70.9000,
  k37: 91.5000,
  k38: 12.4000,
  k39: 33.0000,
  k40: 53.6000,
  k41: 74.2000,
  k42: 94.8000,
  k43: 15.7000,
  k44: 36.3000,
  k45: 56.9000,
  k46: 77.5000,
  k47: 98.1000,
  k48: 19.0000,
  k49: 39.6000,
  k50: 60.2000,
  k51: 80.8000,
  k52: 1.7000,
  k53: 22.3000,
  k54: 42.9000,
  k55: 63.5000,
  k56: 84.1000,
  k57: 5.0000,
  k58: 25.6000,
  k59: 46.2000,
  k60: 66.8000,
  k61: 87.4000,
  k62: 8.3000,
  k63: 28.9000,
  k64: 49.5000,
  k65: 70.1000,
  k66: 90.7000,
  k67: 11.6000,
  k68: 32.2000,
  k69: 52.8000,
  k70: 73.4000,
  k71: 94.0000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_108_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_108_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_108_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_108_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_108_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_108_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_108_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_108_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_108_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_108_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_108_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
