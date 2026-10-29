import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 053 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_053_META = {
  id: 'intrusion_053',
  regionId: 'TAS' as V1035CyresRegionId,
  primaryChannel: 'telehealth' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'critical' as V1035CyresCyberResilienceBand,
  seed: 48804,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_053_COEF = {
  k0: 45.8000,
  k1: 40.9000,
  k2: 36.0000,
  k3: 31.1000,
  k4: 26.2000,
  k5: 21.3000,
  k6: 16.4000,
  k7: 11.5000,
  k8: 6.6000,
  k9: 1.7000,
  k10: 96.5000,
  k11: 91.6000,
  k12: 86.7000,
  k13: 81.8000,
  k14: 76.9000,
  k15: 72.0000,
  k16: 67.1000,
  k17: 62.2000,
  k18: 57.3000,
  k19: 52.4000,
  k20: 47.5000,
  k21: 42.6000,
  k22: 37.7000,
  k23: 32.8000,
  k24: 27.9000,
  k25: 23.0000,
  k26: 18.1000,
  k27: 13.2000,
  k28: 8.3000,
  k29: 3.4000,
  k30: 98.2000,
  k31: 93.3000,
  k32: 88.4000,
  k33: 83.5000,
  k34: 78.6000,
  k35: 73.7000,
  k36: 68.8000,
  k37: 63.9000,
  k38: 59.0000,
  k39: 54.1000,
  k40: 49.2000,
  k41: 44.3000,
  k42: 39.4000,
  k43: 34.5000,
  k44: 29.6000,
  k45: 24.7000,
  k46: 19.8000,
  k47: 14.9000,
  k48: 10.0000,
  k49: 5.1000,
  k50: 0.2000,
  k51: 95.0000,
  k52: 90.1000,
  k53: 85.2000,
  k54: 80.3000,
  k55: 75.4000,
  k56: 70.5000,
  k57: 65.6000,
  k58: 60.7000,
  k59: 55.8000,
  k60: 50.9000,
  k61: 46.0000,
  k62: 41.1000,
  k63: 36.2000,
  k64: 31.3000,
  k65: 26.4000,
  k66: 21.5000,
  k67: 16.6000,
  k68: 11.7000,
  k69: 6.8000,
  k70: 1.9000,
  k71: 96.7000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_053_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_053_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_053_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_053_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_053_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_053_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_053_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_053_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_053_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_053_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_053_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
