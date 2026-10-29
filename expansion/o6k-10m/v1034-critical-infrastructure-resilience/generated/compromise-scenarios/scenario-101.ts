import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 101 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_101_META = {
  id: 'compromise_101',
  regionId: 'TAS' as V1034CiresRegionId,
  primaryChannel: 'primary_access' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'moderate' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 92532,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_101_COEF = {
  k0: 91.2000,
  k1: 72.3000,
  k2: 53.4000,
  k3: 34.5000,
  k4: 15.6000,
  k5: 96.4000,
  k6: 77.5000,
  k7: 58.6000,
  k8: 39.7000,
  k9: 20.8000,
  k10: 1.9000,
  k11: 82.7000,
  k12: 63.8000,
  k13: 44.9000,
  k14: 26.0000,
  k15: 7.1000,
  k16: 87.9000,
  k17: 69.0000,
  k18: 50.1000,
  k19: 31.2000,
  k20: 12.3000,
  k21: 93.1000,
  k22: 74.2000,
  k23: 55.3000,
  k24: 36.4000,
  k25: 17.5000,
  k26: 98.3000,
  k27: 79.4000,
  k28: 60.5000,
  k29: 41.6000,
  k30: 22.7000,
  k31: 3.8000,
  k32: 84.6000,
  k33: 65.7000,
  k34: 46.8000,
  k35: 27.9000,
  k36: 9.0000,
  k37: 89.8000,
  k38: 70.9000,
  k39: 52.0000,
  k40: 33.1000,
  k41: 14.2000,
  k42: 95.0000,
  k43: 76.1000,
  k44: 57.2000,
  k45: 38.3000,
  k46: 19.4000,
  k47: 0.5000,
  k48: 81.3000,
  k49: 62.4000,
  k50: 43.5000,
  k51: 24.6000,
  k52: 5.7000,
  k53: 86.5000,
  k54: 67.6000,
  k55: 48.7000,
  k56: 29.8000,
  k57: 10.9000,
  k58: 91.7000,
  k59: 72.8000,
  k60: 53.9000,
  k61: 35.0000,
  k62: 16.1000,
  k63: 96.9000,
  k64: 78.0000,
  k65: 59.1000,
  k66: 40.2000,
  k67: 21.3000,
  k68: 2.4000,
  k69: 83.2000,
  k70: 64.3000,
  k71: 45.4000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_101_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_101_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_101_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_101_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_101_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_101_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_101_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_101_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_101_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_101_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_101_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
