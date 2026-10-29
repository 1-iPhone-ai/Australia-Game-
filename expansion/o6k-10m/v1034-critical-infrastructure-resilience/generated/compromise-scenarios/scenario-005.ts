import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 005 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_005_META = {
  id: 'compromise_005',
  regionId: 'TAS' as V1034CiresRegionId,
  primaryChannel: 'specialist_referral' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'minimal' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 5076,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_005_COEF = {
  k0: 0.4000,
  k1: 9.5000,
  k2: 18.6000,
  k3: 27.7000,
  k4: 36.8000,
  k5: 45.9000,
  k6: 55.0000,
  k7: 64.1000,
  k8: 73.2000,
  k9: 82.3000,
  k10: 91.4000,
  k11: 0.8000,
  k12: 9.9000,
  k13: 19.0000,
  k14: 28.1000,
  k15: 37.2000,
  k16: 46.3000,
  k17: 55.4000,
  k18: 64.5000,
  k19: 73.6000,
  k20: 82.7000,
  k21: 91.8000,
  k22: 1.2000,
  k23: 10.3000,
  k24: 19.4000,
  k25: 28.5000,
  k26: 37.6000,
  k27: 46.7000,
  k28: 55.8000,
  k29: 64.9000,
  k30: 74.0000,
  k31: 83.1000,
  k32: 92.2000,
  k33: 1.6000,
  k34: 10.7000,
  k35: 19.8000,
  k36: 28.9000,
  k37: 38.0000,
  k38: 47.1000,
  k39: 56.2000,
  k40: 65.3000,
  k41: 74.4000,
  k42: 83.5000,
  k43: 92.6000,
  k44: 2.0000,
  k45: 11.1000,
  k46: 20.2000,
  k47: 29.3000,
  k48: 38.4000,
  k49: 47.5000,
  k50: 56.6000,
  k51: 65.7000,
  k52: 74.8000,
  k53: 83.9000,
  k54: 93.0000,
  k55: 2.4000,
  k56: 11.5000,
  k57: 20.6000,
  k58: 29.7000,
  k59: 38.8000,
  k60: 47.9000,
  k61: 57.0000,
  k62: 66.1000,
  k63: 75.2000,
  k64: 84.3000,
  k65: 93.4000,
  k66: 2.8000,
  k67: 11.9000,
  k68: 21.0000,
  k69: 30.1000,
  k70: 39.2000,
  k71: 48.3000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_005_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_005_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_005_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_005_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_005_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_005_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_005_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_005_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_005_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_005_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_005_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
