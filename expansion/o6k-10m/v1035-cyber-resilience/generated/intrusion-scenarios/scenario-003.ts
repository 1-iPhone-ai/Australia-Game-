import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 003 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_003_META = {
  id: 'intrusion_003',
  regionId: 'WA' as V1035CyresRegionId,
  primaryChannel: 'telehealth' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'critical' as V1035CyresCyberResilienceBand,
  seed: 3254,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_003_COEF = {
  k0: 89.9000,
  k1: 16.5000,
  k2: 42.8000,
  k3: 69.1000,
  k4: 95.4000,
  k5: 22.0000,
  k6: 48.3000,
  k7: 74.6000,
  k8: 1.2000,
  k9: 27.5000,
  k10: 53.8000,
  k11: 80.1000,
  k12: 6.7000,
  k13: 33.0000,
  k14: 59.3000,
  k15: 85.6000,
  k16: 12.2000,
  k17: 38.5000,
  k18: 64.8000,
  k19: 91.1000,
  k20: 17.7000,
  k21: 44.0000,
  k22: 70.3000,
  k23: 96.6000,
  k24: 23.2000,
  k25: 49.5000,
  k26: 75.8000,
  k27: 2.4000,
  k28: 28.7000,
  k29: 55.0000,
  k30: 81.3000,
  k31: 7.9000,
  k32: 34.2000,
  k33: 60.5000,
  k34: 86.8000,
  k35: 13.4000,
  k36: 39.7000,
  k37: 66.0000,
  k38: 92.3000,
  k39: 18.9000,
  k40: 45.2000,
  k41: 71.5000,
  k42: 97.8000,
  k43: 24.4000,
  k44: 50.7000,
  k45: 77.0000,
  k46: 3.6000,
  k47: 29.9000,
  k48: 56.2000,
  k49: 82.5000,
  k50: 9.1000,
  k51: 35.4000,
  k52: 61.7000,
  k53: 88.0000,
  k54: 14.6000,
  k55: 40.9000,
  k56: 67.2000,
  k57: 93.5000,
  k58: 20.1000,
  k59: 46.4000,
  k60: 72.7000,
  k61: 99.0000,
  k62: 25.6000,
  k63: 51.9000,
  k64: 78.2000,
  k65: 4.8000,
  k66: 31.1000,
  k67: 57.4000,
  k68: 83.7000,
  k69: 10.3000,
  k70: 36.6000,
  k71: 62.9000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_003_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_003_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_003_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_003_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_003_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_003_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_003_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_003_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_003_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_003_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_003_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
