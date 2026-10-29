import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 058 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_058_META = {
  id: 'intrusion_058',
  regionId: 'QLD' as V1035CyresRegionId,
  primaryChannel: 'regional' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'critical' as V1035CyresCyberResilienceBand,
  seed: 53359,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_058_COEF = {
  k0: 71.3000,
  k1: 23.4000,
  k2: 75.2000,
  k3: 27.3000,
  k4: 79.1000,
  k5: 31.2000,
  k6: 83.0000,
  k7: 35.1000,
  k8: 86.9000,
  k9: 39.0000,
  k10: 90.8000,
  k11: 42.9000,
  k12: 94.7000,
  k13: 46.8000,
  k14: 98.6000,
  k15: 50.7000,
  k16: 2.8000,
  k17: 54.6000,
  k18: 6.7000,
  k19: 58.5000,
  k20: 10.6000,
  k21: 62.4000,
  k22: 14.5000,
  k23: 66.3000,
  k24: 18.4000,
  k25: 70.2000,
  k26: 22.3000,
  k27: 74.1000,
  k28: 26.2000,
  k29: 78.0000,
  k30: 30.1000,
  k31: 81.9000,
  k32: 34.0000,
  k33: 85.8000,
  k34: 37.9000,
  k35: 89.7000,
  k36: 41.8000,
  k37: 93.6000,
  k38: 45.7000,
  k39: 97.5000,
  k40: 49.6000,
  k41: 1.7000,
  k42: 53.5000,
  k43: 5.6000,
  k44: 57.4000,
  k45: 9.5000,
  k46: 61.3000,
  k47: 13.4000,
  k48: 65.2000,
  k49: 17.3000,
  k50: 69.1000,
  k51: 21.2000,
  k52: 73.0000,
  k53: 25.1000,
  k54: 76.9000,
  k55: 29.0000,
  k56: 80.8000,
  k57: 32.9000,
  k58: 84.7000,
  k59: 36.8000,
  k60: 88.6000,
  k61: 40.7000,
  k62: 92.5000,
  k63: 44.6000,
  k64: 96.4000,
  k65: 48.5000,
  k66: 0.6000,
  k67: 52.4000,
  k68: 4.5000,
  k69: 56.3000,
  k70: 8.4000,
  k71: 60.2000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_058_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_058_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_058_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_058_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_058_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_058_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_058_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_058_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_058_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_058_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_058_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
