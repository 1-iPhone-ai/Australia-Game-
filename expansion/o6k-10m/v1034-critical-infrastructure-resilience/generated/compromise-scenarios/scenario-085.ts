import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 085 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_085_META = {
  id: 'compromise_085',
  regionId: 'TAS' as V1034CiresRegionId,
  primaryChannel: 'specialist_referral' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'minimal' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 77956,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_085_COEF = {
  k0: 9.6000,
  k1: 28.6000,
  k2: 47.6000,
  k3: 66.6000,
  k4: 85.6000,
  k5: 4.9000,
  k6: 23.9000,
  k7: 42.9000,
  k8: 61.9000,
  k9: 80.9000,
  k10: 0.2000,
  k11: 19.2000,
  k12: 38.2000,
  k13: 57.2000,
  k14: 76.2000,
  k15: 95.2000,
  k16: 14.5000,
  k17: 33.5000,
  k18: 52.5000,
  k19: 71.5000,
  k20: 90.5000,
  k21: 9.8000,
  k22: 28.8000,
  k23: 47.8000,
  k24: 66.8000,
  k25: 85.8000,
  k26: 5.1000,
  k27: 24.1000,
  k28: 43.1000,
  k29: 62.1000,
  k30: 81.1000,
  k31: 0.4000,
  k32: 19.4000,
  k33: 38.4000,
  k34: 57.4000,
  k35: 76.4000,
  k36: 95.4000,
  k37: 14.7000,
  k38: 33.7000,
  k39: 52.7000,
  k40: 71.7000,
  k41: 90.7000,
  k42: 10.0000,
  k43: 29.0000,
  k44: 48.0000,
  k45: 67.0000,
  k46: 86.0000,
  k47: 5.3000,
  k48: 24.3000,
  k49: 43.3000,
  k50: 62.3000,
  k51: 81.3000,
  k52: 0.6000,
  k53: 19.6000,
  k54: 38.6000,
  k55: 57.6000,
  k56: 76.6000,
  k57: 95.6000,
  k58: 14.9000,
  k59: 33.9000,
  k60: 52.9000,
  k61: 71.9000,
  k62: 90.9000,
  k63: 10.2000,
  k64: 29.2000,
  k65: 48.2000,
  k66: 67.2000,
  k67: 86.2000,
  k68: 5.5000,
  k69: 24.5000,
  k70: 43.5000,
  k71: 62.5000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_085_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_085_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_085_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_085_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_085_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_085_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_085_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_085_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_085_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_085_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_085_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
