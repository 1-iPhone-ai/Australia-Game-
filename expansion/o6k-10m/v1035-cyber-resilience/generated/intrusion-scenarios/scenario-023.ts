import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 023 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_023_META = {
  id: 'intrusion_023',
  regionId: 'ACT' as V1035CyresRegionId,
  primaryChannel: 'telehealth' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'critical' as V1035CyresCyberResilienceBand,
  seed: 21474,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_023_COEF = {
  k0: 92.2000,
  k1: 46.2000,
  k2: 0.2000,
  k3: 53.9000,
  k4: 7.9000,
  k5: 61.6000,
  k6: 15.6000,
  k7: 69.3000,
  k8: 23.3000,
  k9: 77.0000,
  k10: 31.0000,
  k11: 84.7000,
  k12: 38.7000,
  k13: 92.4000,
  k14: 46.4000,
  k15: 0.4000,
  k16: 54.1000,
  k17: 8.1000,
  k18: 61.8000,
  k19: 15.8000,
  k20: 69.5000,
  k21: 23.5000,
  k22: 77.2000,
  k23: 31.2000,
  k24: 84.9000,
  k25: 38.9000,
  k26: 92.6000,
  k27: 46.6000,
  k28: 0.6000,
  k29: 54.3000,
  k30: 8.3000,
  k31: 62.0000,
  k32: 16.0000,
  k33: 69.7000,
  k34: 23.7000,
  k35: 77.4000,
  k36: 31.4000,
  k37: 85.1000,
  k38: 39.1000,
  k39: 92.8000,
  k40: 46.8000,
  k41: 0.8000,
  k42: 54.5000,
  k43: 8.5000,
  k44: 62.2000,
  k45: 16.2000,
  k46: 69.9000,
  k47: 23.9000,
  k48: 77.6000,
  k49: 31.6000,
  k50: 85.3000,
  k51: 39.3000,
  k52: 93.0000,
  k53: 47.0000,
  k54: 1.0000,
  k55: 54.7000,
  k56: 8.7000,
  k57: 62.4000,
  k58: 16.4000,
  k59: 70.1000,
  k60: 24.1000,
  k61: 77.8000,
  k62: 31.8000,
  k63: 85.5000,
  k64: 39.5000,
  k65: 93.2000,
  k66: 47.2000,
  k67: 1.2000,
  k68: 54.9000,
  k69: 8.9000,
  k70: 62.6000,
  k71: 16.6000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_023_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_023_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_023_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_023_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_023_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_023_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_023_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_023_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_023_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_023_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_023_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
