import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 046 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_046_META = {
  id: 'intrusion_046',
  regionId: 'NT' as V1035CyresRegionId,
  primaryChannel: 'aged_care' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'moderate' as V1035CyresCyberResilienceBand,
  seed: 42427,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_046_COEF = {
  k0: 10.1000,
  k1: 65.4000,
  k2: 21.0000,
  k3: 76.3000,
  k4: 31.9000,
  k5: 87.2000,
  k6: 42.8000,
  k7: 98.1000,
  k8: 53.7000,
  k9: 9.3000,
  k10: 64.6000,
  k11: 20.2000,
  k12: 75.5000,
  k13: 31.1000,
  k14: 86.4000,
  k15: 42.0000,
  k16: 97.3000,
  k17: 52.9000,
  k18: 8.5000,
  k19: 63.8000,
  k20: 19.4000,
  k21: 74.7000,
  k22: 30.3000,
  k23: 85.6000,
  k24: 41.2000,
  k25: 96.5000,
  k26: 52.1000,
  k27: 7.7000,
  k28: 63.0000,
  k29: 18.6000,
  k30: 73.9000,
  k31: 29.5000,
  k32: 84.8000,
  k33: 40.4000,
  k34: 95.7000,
  k35: 51.3000,
  k36: 6.9000,
  k37: 62.2000,
  k38: 17.8000,
  k39: 73.1000,
  k40: 28.7000,
  k41: 84.0000,
  k42: 39.6000,
  k43: 94.9000,
  k44: 50.5000,
  k45: 6.1000,
  k46: 61.4000,
  k47: 17.0000,
  k48: 72.3000,
  k49: 27.9000,
  k50: 83.2000,
  k51: 38.8000,
  k52: 94.1000,
  k53: 49.7000,
  k54: 5.3000,
  k55: 60.6000,
  k56: 16.2000,
  k57: 71.5000,
  k58: 27.1000,
  k59: 82.4000,
  k60: 38.0000,
  k61: 93.3000,
  k62: 48.9000,
  k63: 4.5000,
  k64: 59.8000,
  k65: 15.4000,
  k66: 70.7000,
  k67: 26.3000,
  k68: 81.6000,
  k69: 37.2000,
  k70: 92.5000,
  k71: 48.1000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_046_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_046_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_046_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_046_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_046_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_046_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_046_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_046_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_046_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_046_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_046_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
