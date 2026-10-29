import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 016 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_016_META = {
  id: 'compromise_016',
  regionId: 'NSW' as V1034CiresRegionId,
  primaryChannel: 'aged_care' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'moderate' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 15097,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_016_COEF = {
  k0: 56.5000,
  k1: 70.7000,
  k2: 84.9000,
  k3: 99.1000,
  k4: 13.6000,
  k5: 27.8000,
  k6: 42.0000,
  k7: 56.2000,
  k8: 70.4000,
  k9: 84.6000,
  k10: 98.8000,
  k11: 13.3000,
  k12: 27.5000,
  k13: 41.7000,
  k14: 55.9000,
  k15: 70.1000,
  k16: 84.3000,
  k17: 98.5000,
  k18: 13.0000,
  k19: 27.2000,
  k20: 41.4000,
  k21: 55.6000,
  k22: 69.8000,
  k23: 84.0000,
  k24: 98.2000,
  k25: 12.7000,
  k26: 26.9000,
  k27: 41.1000,
  k28: 55.3000,
  k29: 69.5000,
  k30: 83.7000,
  k31: 97.9000,
  k32: 12.4000,
  k33: 26.6000,
  k34: 40.8000,
  k35: 55.0000,
  k36: 69.2000,
  k37: 83.4000,
  k38: 97.6000,
  k39: 12.1000,
  k40: 26.3000,
  k41: 40.5000,
  k42: 54.7000,
  k43: 68.9000,
  k44: 83.1000,
  k45: 97.3000,
  k46: 11.8000,
  k47: 26.0000,
  k48: 40.2000,
  k49: 54.4000,
  k50: 68.6000,
  k51: 82.8000,
  k52: 97.0000,
  k53: 11.5000,
  k54: 25.7000,
  k55: 39.9000,
  k56: 54.1000,
  k57: 68.3000,
  k58: 82.5000,
  k59: 96.7000,
  k60: 11.2000,
  k61: 25.4000,
  k62: 39.6000,
  k63: 53.8000,
  k64: 68.0000,
  k65: 82.2000,
  k66: 96.4000,
  k67: 10.9000,
  k68: 25.1000,
  k69: 39.3000,
  k70: 53.5000,
  k71: 67.7000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_016_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_016_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_016_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_016_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_016_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_016_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_016_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_016_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_016_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_016_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_016_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
