import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 098 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_098_META = {
  id: 'compromise_098',
  regionId: 'QLD' as V1034CiresRegionId,
  primaryChannel: 'regional' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'critical' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 89799,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_098_COEF = {
  k0: 75.9000,
  k1: 82.8000,
  k2: 89.7000,
  k3: 96.6000,
  k4: 3.8000,
  k5: 10.7000,
  k6: 17.6000,
  k7: 24.5000,
  k8: 31.4000,
  k9: 38.3000,
  k10: 45.2000,
  k11: 52.1000,
  k12: 59.0000,
  k13: 65.9000,
  k14: 72.8000,
  k15: 79.7000,
  k16: 86.6000,
  k17: 93.5000,
  k18: 0.7000,
  k19: 7.6000,
  k20: 14.5000,
  k21: 21.4000,
  k22: 28.3000,
  k23: 35.2000,
  k24: 42.1000,
  k25: 49.0000,
  k26: 55.9000,
  k27: 62.8000,
  k28: 69.7000,
  k29: 76.6000,
  k30: 83.5000,
  k31: 90.4000,
  k32: 97.3000,
  k33: 4.5000,
  k34: 11.4000,
  k35: 18.3000,
  k36: 25.2000,
  k37: 32.1000,
  k38: 39.0000,
  k39: 45.9000,
  k40: 52.8000,
  k41: 59.7000,
  k42: 66.6000,
  k43: 73.5000,
  k44: 80.4000,
  k45: 87.3000,
  k46: 94.2000,
  k47: 1.4000,
  k48: 8.3000,
  k49: 15.2000,
  k50: 22.1000,
  k51: 29.0000,
  k52: 35.9000,
  k53: 42.8000,
  k54: 49.7000,
  k55: 56.6000,
  k56: 63.5000,
  k57: 70.4000,
  k58: 77.3000,
  k59: 84.2000,
  k60: 91.1000,
  k61: 98.0000,
  k62: 5.2000,
  k63: 12.1000,
  k64: 19.0000,
  k65: 25.9000,
  k66: 32.8000,
  k67: 39.7000,
  k68: 46.6000,
  k69: 53.5000,
  k70: 60.4000,
  k71: 67.3000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_098_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_098_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_098_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_098_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_098_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_098_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_098_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_098_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_098_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_098_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_098_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
