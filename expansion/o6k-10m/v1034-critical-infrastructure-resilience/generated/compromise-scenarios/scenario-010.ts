import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 010 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_010_META = {
  id: 'compromise_010',
  regionId: 'QLD' as V1034CiresRegionId,
  primaryChannel: 'emergency_care' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'minimal' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 9631,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_010_COEF = {
  k0: 25.9000,
  k1: 91.7000,
  k2: 57.8000,
  k3: 23.9000,
  k4: 89.7000,
  k5: 55.8000,
  k6: 21.9000,
  k7: 87.7000,
  k8: 53.8000,
  k9: 19.9000,
  k10: 85.7000,
  k11: 51.8000,
  k12: 17.9000,
  k13: 83.7000,
  k14: 49.8000,
  k15: 15.9000,
  k16: 81.7000,
  k17: 47.8000,
  k18: 13.9000,
  k19: 79.7000,
  k20: 45.8000,
  k21: 11.9000,
  k22: 77.7000,
  k23: 43.8000,
  k24: 9.9000,
  k25: 75.7000,
  k26: 41.8000,
  k27: 7.9000,
  k28: 73.7000,
  k29: 39.8000,
  k30: 5.9000,
  k31: 71.7000,
  k32: 37.8000,
  k33: 3.9000,
  k34: 69.7000,
  k35: 35.8000,
  k36: 1.9000,
  k37: 67.7000,
  k38: 33.8000,
  k39: 99.6000,
  k40: 65.7000,
  k41: 31.8000,
  k42: 97.6000,
  k43: 63.7000,
  k44: 29.8000,
  k45: 95.6000,
  k46: 61.7000,
  k47: 27.8000,
  k48: 93.6000,
  k49: 59.7000,
  k50: 25.8000,
  k51: 91.6000,
  k52: 57.7000,
  k53: 23.8000,
  k54: 89.6000,
  k55: 55.7000,
  k56: 21.8000,
  k57: 87.6000,
  k58: 53.7000,
  k59: 19.8000,
  k60: 85.6000,
  k61: 51.7000,
  k62: 17.8000,
  k63: 83.6000,
  k64: 49.7000,
  k65: 15.8000,
  k66: 81.6000,
  k67: 47.7000,
  k68: 13.8000,
  k69: 79.6000,
  k70: 45.7000,
  k71: 11.8000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_010_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_010_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_010_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_010_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_010_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_010_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_010_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_010_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_010_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_010_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_010_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
