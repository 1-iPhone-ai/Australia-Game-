import { V1034_CIRES_clamp, V1034_CIRES_criticalInfrastructureResilienceBandFromScore } from '../../engine/critical-infrastructure-resilience-utils.ts';
import type {
  V1034CiresCriticalInfrastructureResilienceBand,
  V1034CiresRegionId,
  V1034CiresCompromiseSnapshot,
  V1034CiresCriticalInfrastructureResilienceChannel,
} from '../../types/core.ts';

/** Generated compromise incident scenario 050 — extreme_heat/drought/dust handoff matrix. */
export const V1034_CIRES_COMPROMISE_SCENARIO_050_META = {
  id: 'compromise_050',
  regionId: 'QLD' as V1034CiresRegionId,
  primaryChannel: 'emergency_care' as V1034CiresCriticalInfrastructureResilienceChannel,
  criticalInfrastructureResilienceBand: 'minimal' as V1034CiresCriticalInfrastructureResilienceBand,
  seed: 46071,
} as const;

const V1034_CIRES_COMPROMISE_SCENARIO_050_COEF = {
  k0: 30.5000,
  k1: 51.4000,
  k2: 72.3000,
  k3: 93.2000,
  k4: 14.4000,
  k5: 35.3000,
  k6: 56.2000,
  k7: 77.1000,
  k8: 98.0000,
  k9: 19.2000,
  k10: 40.1000,
  k11: 61.0000,
  k12: 81.9000,
  k13: 3.1000,
  k14: 24.0000,
  k15: 44.9000,
  k16: 65.8000,
  k17: 86.7000,
  k18: 7.9000,
  k19: 28.8000,
  k20: 49.7000,
  k21: 70.6000,
  k22: 91.5000,
  k23: 12.7000,
  k24: 33.6000,
  k25: 54.5000,
  k26: 75.4000,
  k27: 96.3000,
  k28: 17.5000,
  k29: 38.4000,
  k30: 59.3000,
  k31: 80.2000,
  k32: 1.4000,
  k33: 22.3000,
  k34: 43.2000,
  k35: 64.1000,
  k36: 85.0000,
  k37: 6.2000,
  k38: 27.1000,
  k39: 48.0000,
  k40: 68.9000,
  k41: 89.8000,
  k42: 11.0000,
  k43: 31.9000,
  k44: 52.8000,
  k45: 73.7000,
  k46: 94.6000,
  k47: 15.8000,
  k48: 36.7000,
  k49: 57.6000,
  k50: 78.5000,
  k51: 99.4000,
  k52: 20.6000,
  k53: 41.5000,
  k54: 62.4000,
  k55: 83.3000,
  k56: 4.5000,
  k57: 25.4000,
  k58: 46.3000,
  k59: 67.2000,
  k60: 88.1000,
  k61: 9.3000,
  k62: 30.2000,
  k63: 51.1000,
  k64: 72.0000,
  k65: 92.9000,
  k66: 14.1000,
  k67: 35.0000,
  k68: 55.9000,
  k69: 76.8000,
  k70: 97.7000,
  k71: 18.9000,
} as const;

export function V1034_CIRES_COMPROMISE_SCENARIO_050_evaluate(turn: number): {
  cyberPhysicalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  criticalInfrastructureResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1034_CIRES_COMPROMISE_SCENARIO_050_COEF) as Array<
    keyof typeof V1034_CIRES_COMPROMISE_SCENARIO_050_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1034_CIRES_COMPROMISE_SCENARIO_050_COEF[keys[j]] * ((turn + j) % 17);
  }
  const cyberPhysicalStressExposureIndex = V1034_CIRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1034_CIRES_clamp(2 + (acc % 11), 1, 18);
  const criticalInfrastructureResilienceScore = V1034_CIRES_clamp(90 - cyberPhysicalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1034_CIRES_criticalInfrastructureResilienceBandFromScore(criticalInfrastructureResilienceScore) !== 'depleted';
  return { cyberPhysicalStressExposureIndex, segmentBufferDelayTurns, criticalInfrastructureResilienceScore, stable };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_050_snapshot(turn: number): V1034CiresCompromiseSnapshot {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_050_evaluate(turn);
  return {
    scenarioId: V1034_CIRES_COMPROMISE_SCENARIO_050_META.id,
    regionId: V1034_CIRES_COMPROMISE_SCENARIO_050_META.regionId,
    criticalInfrastructureResilienceChannel: V1034_CIRES_COMPROMISE_SCENARIO_050_META.primaryChannel,
    cyberPhysicalStressExposureIndex: r.cyberPhysicalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    criticalInfrastructureResilienceScore: r.criticalInfrastructureResilienceScore,
    criticalInfrastructureResilienceBand: V1034_CIRES_criticalInfrastructureResilienceBandFromScore(r.criticalInfrastructureResilienceScore),
  };
}

export function V1034_CIRES_COMPROMISE_SCENARIO_050_regressionAssert(turn: number): boolean {
  const r = V1034_CIRES_COMPROMISE_SCENARIO_050_evaluate(turn);
  return typeof r.cyberPhysicalStressExposureIndex === 'number' && r.criticalInfrastructureResilienceScore <= 100;
}
