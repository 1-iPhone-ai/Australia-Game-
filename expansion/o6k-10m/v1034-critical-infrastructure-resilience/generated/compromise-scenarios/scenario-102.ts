import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 102 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_102_META = {
  id: 'compromise_102',
  regionId: 'NT' as V1034CiresRegionId,
  primaryChannel: 'facility_zone' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'elevated' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 93443,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_102_COEF = {
  k0: 96.3000,
  k1: 68.8000,
  k2: 41.3000,
  k3: 13.8000,
  k4: 86.0000,
  k5: 58.5000,
  k6: 31.0000,
  k7: 3.5000,
  k8: 75.7000,
  k9: 48.2000,
  k10: 20.7000,
  k11: 92.9000,
  k12: 65.4000,
  k13: 37.9000,
  k14: 10.4000,
  k15: 82.6000,
  k16: 55.1000,
  k17: 27.6000,
  k18: 0.1000,
  k19: 72.3000,
  k20: 44.8000,
  k21: 17.3000,
  k22: 89.5000,
  k23: 62.0000,
  k24: 34.5000,
  k25: 7.0000,
  k26: 79.2000,
  k27: 51.7000,
  k28: 24.2000,
  k29: 96.4000,
  k30: 68.9000,
  k31: 41.4000,
  k32: 13.9000,
  k33: 86.1000,
  k34: 58.6000,
  k35: 31.1000,
  k36: 3.6000,
  k37: 75.8000,
  k38: 48.3000,
  k39: 20.8000,
  k40: 93.0000,
  k41: 65.5000,
  k42: 38.0000,
  k43: 10.5000,
  k44: 82.7000,
  k45: 55.2000,
  k46: 27.7000,
  k47: 0.2000,
  k48: 72.4000,
  k49: 44.9000,
  k50: 17.4000,
  k51: 89.6000,
  k52: 62.1000,
  k53: 34.6000,
  k54: 7.1000,
  k55: 79.3000,
  k56: 51.8000,
  k57: 24.3000,
  k58: 96.5000,
  k59: 69.0000,
  k60: 41.5000,
  k61: 14.0000,
  k62: 86.2000,
  k63: 58.7000,
  k64: 31.2000,
  k65: 3.7000,
  k66: 75.9000,
  k67: 48.4000,
  k68: 20.9000,
  k69: 93.1000,
  k70: 65.6000,
  k71: 38.1000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_102_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_102_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_102_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_102_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_102_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_102_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_102_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_102_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_102_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_102_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_102_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
