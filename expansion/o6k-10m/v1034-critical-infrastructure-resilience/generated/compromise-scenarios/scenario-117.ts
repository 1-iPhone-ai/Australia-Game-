import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 117 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_117_META = {
  id: 'compromise_117',
  regionId: 'TAS' as V1034CiresRegionId,
  primaryChannel: 'mental_health' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'elevated' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 107108,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_117_COEF = {
  k0: 73.1000,
  k1: 16.3000,
  k2: 59.2000,
  k3: 2.4000,
  k4: 45.3000,
  k5: 88.2000,
  k6: 31.4000,
  k7: 74.3000,
  k8: 17.5000,
  k9: 60.4000,
  k10: 3.6000,
  k11: 46.5000,
  k12: 89.4000,
  k13: 32.6000,
  k14: 75.5000,
  k15: 18.7000,
  k16: 61.6000,
  k17: 4.8000,
  k18: 47.7000,
  k19: 90.6000,
  k20: 33.8000,
  k21: 76.7000,
  k22: 19.9000,
  k23: 62.8000,
  k24: 6.0000,
  k25: 48.9000,
  k26: 91.8000,
  k27: 35.0000,
  k28: 77.9000,
  k29: 21.1000,
  k30: 64.0000,
  k31: 7.2000,
  k32: 50.1000,
  k33: 93.0000,
  k34: 36.2000,
  k35: 79.1000,
  k36: 22.3000,
  k37: 65.2000,
  k38: 8.4000,
  k39: 51.3000,
  k40: 94.2000,
  k41: 37.4000,
  k42: 80.3000,
  k43: 23.5000,
  k44: 66.4000,
  k45: 9.6000,
  k46: 52.5000,
  k47: 95.4000,
  k48: 38.6000,
  k49: 81.5000,
  k50: 24.7000,
  k51: 67.6000,
  k52: 10.8000,
  k53: 53.7000,
  k54: 96.6000,
  k55: 39.8000,
  k56: 82.7000,
  k57: 25.9000,
  k58: 68.8000,
  k59: 12.0000,
  k60: 54.9000,
  k61: 97.8000,
  k62: 41.0000,
  k63: 83.9000,
  k64: 27.1000,
  k65: 70.0000,
  k66: 13.2000,
  k67: 56.1000,
  k68: 99.0000,
  k69: 42.2000,
  k70: 85.1000,
  k71: 28.3000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_117_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_117_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_117_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_117_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_117_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_117_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_117_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_117_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_117_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_117_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_117_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
