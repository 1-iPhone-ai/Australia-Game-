import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 096 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_096_META = {
  id: 'intrusion_096',
  regionId: 'NSW' as V1035CyresRegionId,
  primaryChannel: 'aged_care' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'moderate' as V1035CyresCyberResilienceBand,
  seed: 87977,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_096_COEF = {
  k0: 65.7000,
  k1: 89.8000,
  k2: 14.2000,
  k3: 38.3000,
  k4: 62.4000,
  k5: 86.5000,
  k6: 10.9000,
  k7: 35.0000,
  k8: 59.1000,
  k9: 83.2000,
  k10: 7.6000,
  k11: 31.7000,
  k12: 55.8000,
  k13: 79.9000,
  k14: 4.3000,
  k15: 28.4000,
  k16: 52.5000,
  k17: 76.6000,
  k18: 1.0000,
  k19: 25.1000,
  k20: 49.2000,
  k21: 73.3000,
  k22: 97.4000,
  k23: 21.8000,
  k24: 45.9000,
  k25: 70.0000,
  k26: 94.1000,
  k27: 18.5000,
  k28: 42.6000,
  k29: 66.7000,
  k30: 90.8000,
  k31: 15.2000,
  k32: 39.3000,
  k33: 63.4000,
  k34: 87.5000,
  k35: 11.9000,
  k36: 36.0000,
  k37: 60.1000,
  k38: 84.2000,
  k39: 8.6000,
  k40: 32.7000,
  k41: 56.8000,
  k42: 80.9000,
  k43: 5.3000,
  k44: 29.4000,
  k45: 53.5000,
  k46: 77.6000,
  k47: 2.0000,
  k48: 26.1000,
  k49: 50.2000,
  k50: 74.3000,
  k51: 98.4000,
  k52: 22.8000,
  k53: 46.9000,
  k54: 71.0000,
  k55: 95.1000,
  k56: 19.5000,
  k57: 43.6000,
  k58: 67.7000,
  k59: 91.8000,
  k60: 16.2000,
  k61: 40.3000,
  k62: 64.4000,
  k63: 88.5000,
  k64: 12.9000,
  k65: 37.0000,
  k66: 61.1000,
  k67: 85.2000,
  k68: 9.6000,
  k69: 33.7000,
  k70: 57.8000,
  k71: 81.9000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_096_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_096_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_096_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_096_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_096_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_096_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_096_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_096_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_096_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_096_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_096_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
