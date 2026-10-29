import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 115 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_115_META = {
  id: 'intrusion_115',
  regionId: 'WA' as V1035CyresRegionId,
  primaryChannel: 'specialist_referral' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'minimal' as V1035CyresCyberResilienceBand,
  seed: 105286,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_115_COEF = {
  k0: 62.9000,
  k1: 23.3000,
  k2: 83.4000,
  k3: 43.8000,
  k4: 4.2000,
  k5: 64.3000,
  k6: 24.7000,
  k7: 84.8000,
  k8: 45.2000,
  k9: 5.6000,
  k10: 65.7000,
  k11: 26.1000,
  k12: 86.2000,
  k13: 46.6000,
  k14: 7.0000,
  k15: 67.1000,
  k16: 27.5000,
  k17: 87.6000,
  k18: 48.0000,
  k19: 8.4000,
  k20: 68.5000,
  k21: 28.9000,
  k22: 89.0000,
  k23: 49.4000,
  k24: 9.8000,
  k25: 69.9000,
  k26: 30.3000,
  k27: 90.4000,
  k28: 50.8000,
  k29: 11.2000,
  k30: 71.3000,
  k31: 31.7000,
  k32: 91.8000,
  k33: 52.2000,
  k34: 12.6000,
  k35: 72.7000,
  k36: 33.1000,
  k37: 93.2000,
  k38: 53.6000,
  k39: 14.0000,
  k40: 74.1000,
  k41: 34.5000,
  k42: 94.6000,
  k43: 55.0000,
  k44: 15.4000,
  k45: 75.5000,
  k46: 35.9000,
  k47: 96.0000,
  k48: 56.4000,
  k49: 16.8000,
  k50: 76.9000,
  k51: 37.3000,
  k52: 97.4000,
  k53: 57.8000,
  k54: 18.2000,
  k55: 78.3000,
  k56: 38.7000,
  k57: 98.8000,
  k58: 59.2000,
  k59: 19.6000,
  k60: 79.7000,
  k61: 40.1000,
  k62: 0.5000,
  k63: 60.6000,
  k64: 21.0000,
  k65: 81.1000,
  k66: 41.5000,
  k67: 1.9000,
  k68: 62.0000,
  k69: 22.4000,
  k70: 82.5000,
  k71: 42.9000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_115_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_115_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_115_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_115_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_115_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_115_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_115_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_115_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_115_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_115_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_115_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
