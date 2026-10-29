import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 065 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_065_META = {
  id: 'compromise_065',
  regionId: 'VIC' as V1034CiresRegionId,
  primaryChannel: 'specialist_referral' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'minimal' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 59736,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_065_COEF = {
  k0: 7.3000,
  k1: 98.6000,
  k2: 90.2000,
  k3: 81.8000,
  k4: 73.4000,
  k5: 65.0000,
  k6: 56.6000,
  k7: 48.2000,
  k8: 39.8000,
  k9: 31.4000,
  k10: 23.0000,
  k11: 14.6000,
  k12: 6.2000,
  k13: 97.5000,
  k14: 89.1000,
  k15: 80.7000,
  k16: 72.3000,
  k17: 63.9000,
  k18: 55.5000,
  k19: 47.1000,
  k20: 38.7000,
  k21: 30.3000,
  k22: 21.9000,
  k23: 13.5000,
  k24: 5.1000,
  k25: 96.4000,
  k26: 88.0000,
  k27: 79.6000,
  k28: 71.2000,
  k29: 62.8000,
  k30: 54.4000,
  k31: 46.0000,
  k32: 37.6000,
  k33: 29.2000,
  k34: 20.8000,
  k35: 12.4000,
  k36: 4.0000,
  k37: 95.3000,
  k38: 86.9000,
  k39: 78.5000,
  k40: 70.1000,
  k41: 61.7000,
  k42: 53.3000,
  k43: 44.9000,
  k44: 36.5000,
  k45: 28.1000,
  k46: 19.7000,
  k47: 11.3000,
  k48: 2.9000,
  k49: 94.2000,
  k50: 85.8000,
  k51: 77.4000,
  k52: 69.0000,
  k53: 60.6000,
  k54: 52.2000,
  k55: 43.8000,
  k56: 35.4000,
  k57: 27.0000,
  k58: 18.6000,
  k59: 10.2000,
  k60: 1.8000,
  k61: 93.1000,
  k62: 84.7000,
  k63: 76.3000,
  k64: 67.9000,
  k65: 59.5000,
  k66: 51.1000,
  k67: 42.7000,
  k68: 34.3000,
  k69: 25.9000,
  k70: 17.5000,
  k71: 9.1000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_065_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_065_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_065_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_065_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_065_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_065_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_065_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_065_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_065_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_065_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_065_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
