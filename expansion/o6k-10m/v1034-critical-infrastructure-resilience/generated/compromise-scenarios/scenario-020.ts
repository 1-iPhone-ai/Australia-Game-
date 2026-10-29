import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 020 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_020_META = {
  id: 'compromise_020',
  regionId: 'SA' as V1034CiresRegionId,
  primaryChannel: 'emergency_care' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'minimal' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 18741,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_020_COEF = {
  k0: 76.9000,
  k1: 56.7000,
  k2: 36.5000,
  k3: 16.3000,
  k4: 95.8000,
  k5: 75.6000,
  k6: 55.4000,
  k7: 35.2000,
  k8: 15.0000,
  k9: 94.5000,
  k10: 74.3000,
  k11: 54.1000,
  k12: 33.9000,
  k13: 13.7000,
  k14: 93.2000,
  k15: 73.0000,
  k16: 52.8000,
  k17: 32.6000,
  k18: 12.4000,
  k19: 91.9000,
  k20: 71.7000,
  k21: 51.5000,
  k22: 31.3000,
  k23: 11.1000,
  k24: 90.6000,
  k25: 70.4000,
  k26: 50.2000,
  k27: 30.0000,
  k28: 9.8000,
  k29: 89.3000,
  k30: 69.1000,
  k31: 48.9000,
  k32: 28.7000,
  k33: 8.5000,
  k34: 88.0000,
  k35: 67.8000,
  k36: 47.6000,
  k37: 27.4000,
  k38: 7.2000,
  k39: 86.7000,
  k40: 66.5000,
  k41: 46.3000,
  k42: 26.1000,
  k43: 5.9000,
  k44: 85.4000,
  k45: 65.2000,
  k46: 45.0000,
  k47: 24.8000,
  k48: 4.6000,
  k49: 84.1000,
  k50: 63.9000,
  k51: 43.7000,
  k52: 23.5000,
  k53: 3.3000,
  k54: 82.8000,
  k55: 62.6000,
  k56: 42.4000,
  k57: 22.2000,
  k58: 2.0000,
  k59: 81.5000,
  k60: 61.3000,
  k61: 41.1000,
  k62: 20.9000,
  k63: 0.7000,
  k64: 80.2000,
  k65: 60.0000,
  k66: 39.8000,
  k67: 19.6000,
  k68: 99.1000,
  k69: 78.9000,
  k70: 58.7000,
  k71: 38.5000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_020_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_020_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_020_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_020_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_020_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_020_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_020_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_020_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_020_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_020_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_020_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
