import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 069 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_069_META = {
  id: 'compromise_069',
  regionId: 'TAS' as V1034CiresRegionId,
  primaryChannel: 'remote' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'recovering' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 63380,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_069_COEF = {
  k0: 27.7000,
  k1: 84.6000,
  k2: 41.8000,
  k3: 98.7000,
  k4: 55.9000,
  k5: 13.1000,
  k6: 70.0000,
  k7: 27.2000,
  k8: 84.1000,
  k9: 41.3000,
  k10: 98.2000,
  k11: 55.4000,
  k12: 12.6000,
  k13: 69.5000,
  k14: 26.7000,
  k15: 83.6000,
  k16: 40.8000,
  k17: 97.7000,
  k18: 54.9000,
  k19: 12.1000,
  k20: 69.0000,
  k21: 26.2000,
  k22: 83.1000,
  k23: 40.3000,
  k24: 97.2000,
  k25: 54.4000,
  k26: 11.6000,
  k27: 68.5000,
  k28: 25.7000,
  k29: 82.6000,
  k30: 39.8000,
  k31: 96.7000,
  k32: 53.9000,
  k33: 11.1000,
  k34: 68.0000,
  k35: 25.2000,
  k36: 82.1000,
  k37: 39.3000,
  k38: 96.2000,
  k39: 53.4000,
  k40: 10.6000,
  k41: 67.5000,
  k42: 24.7000,
  k43: 81.6000,
  k44: 38.8000,
  k45: 95.7000,
  k46: 52.9000,
  k47: 10.1000,
  k48: 67.0000,
  k49: 24.2000,
  k50: 81.1000,
  k51: 38.3000,
  k52: 95.2000,
  k53: 52.4000,
  k54: 9.6000,
  k55: 66.5000,
  k56: 23.7000,
  k57: 80.6000,
  k58: 37.8000,
  k59: 94.7000,
  k60: 51.9000,
  k61: 9.1000,
  k62: 66.0000,
  k63: 23.2000,
  k64: 80.1000,
  k65: 37.3000,
  k66: 94.2000,
  k67: 51.4000,
  k68: 8.6000,
  k69: 65.5000,
  k70: 22.7000,
  k71: 79.6000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_069_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_069_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_069_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_069_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_069_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_069_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_069_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_069_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_069_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_069_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_069_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
