import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 048 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_048_META = {
  id: 'compromise_048',
  regionId: 'NSW' as V1034CiresRegionId,
  primaryChannel: 'regional' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'critical' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 44249,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_048_COEF = {
  k0: 20.3000,
  k1: 58.4000,
  k2: 96.5000,
  k3: 34.9000,
  k4: 73.0000,
  k5: 11.4000,
  k6: 49.5000,
  k7: 87.6000,
  k8: 26.0000,
  k9: 64.1000,
  k10: 2.5000,
  k11: 40.6000,
  k12: 78.7000,
  k13: 17.1000,
  k14: 55.2000,
  k15: 93.3000,
  k16: 31.7000,
  k17: 69.8000,
  k18: 8.2000,
  k19: 46.3000,
  k20: 84.4000,
  k21: 22.8000,
  k22: 60.9000,
  k23: 99.0000,
  k24: 37.4000,
  k25: 75.5000,
  k26: 13.9000,
  k27: 52.0000,
  k28: 90.1000,
  k29: 28.5000,
  k30: 66.6000,
  k31: 5.0000,
  k32: 43.1000,
  k33: 81.2000,
  k34: 19.6000,
  k35: 57.7000,
  k36: 95.8000,
  k37: 34.2000,
  k38: 72.3000,
  k39: 10.7000,
  k40: 48.8000,
  k41: 86.9000,
  k42: 25.3000,
  k43: 63.4000,
  k44: 1.8000,
  k45: 39.9000,
  k46: 78.0000,
  k47: 16.4000,
  k48: 54.5000,
  k49: 92.6000,
  k50: 31.0000,
  k51: 69.1000,
  k52: 7.5000,
  k53: 45.6000,
  k54: 83.7000,
  k55: 22.1000,
  k56: 60.2000,
  k57: 98.3000,
  k58: 36.7000,
  k59: 74.8000,
  k60: 13.2000,
  k61: 51.3000,
  k62: 89.4000,
  k63: 27.8000,
  k64: 65.9000,
  k65: 4.3000,
  k66: 42.4000,
  k67: 80.5000,
  k68: 18.9000,
  k69: 57.0000,
  k70: 95.1000,
  k71: 33.5000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_048_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_048_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_048_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_048_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_048_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_048_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_048_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_048_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_048_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_048_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_048_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
