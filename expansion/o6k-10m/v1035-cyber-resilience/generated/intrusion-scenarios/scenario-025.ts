import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 025 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_025_META = {
  id: 'intrusion_025',
  regionId: 'VIC' as V1035CyresRegionId,
  primaryChannel: 'specialist_referral' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'minimal' as V1035CyresCyberResilienceBand,
  seed: 23296,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_025_COEF = {
  k0: 2.7000,
  k1: 39.2000,
  k2: 75.7000,
  k3: 12.5000,
  k4: 49.0000,
  k5: 85.5000,
  k6: 22.3000,
  k7: 58.8000,
  k8: 95.3000,
  k9: 32.1000,
  k10: 68.6000,
  k11: 5.4000,
  k12: 41.9000,
  k13: 78.4000,
  k14: 15.2000,
  k15: 51.7000,
  k16: 88.2000,
  k17: 25.0000,
  k18: 61.5000,
  k19: 98.0000,
  k20: 34.8000,
  k21: 71.3000,
  k22: 8.1000,
  k23: 44.6000,
  k24: 81.1000,
  k25: 17.9000,
  k26: 54.4000,
  k27: 90.9000,
  k28: 27.7000,
  k29: 64.2000,
  k30: 1.0000,
  k31: 37.5000,
  k32: 74.0000,
  k33: 10.8000,
  k34: 47.3000,
  k35: 83.8000,
  k36: 20.6000,
  k37: 57.1000,
  k38: 93.6000,
  k39: 30.4000,
  k40: 66.9000,
  k41: 3.7000,
  k42: 40.2000,
  k43: 76.7000,
  k44: 13.5000,
  k45: 50.0000,
  k46: 86.5000,
  k47: 23.3000,
  k48: 59.8000,
  k49: 96.3000,
  k50: 33.1000,
  k51: 69.6000,
  k52: 6.4000,
  k53: 42.9000,
  k54: 79.4000,
  k55: 16.2000,
  k56: 52.7000,
  k57: 89.2000,
  k58: 26.0000,
  k59: 62.5000,
  k60: 99.0000,
  k61: 35.8000,
  k62: 72.3000,
  k63: 9.1000,
  k64: 45.6000,
  k65: 82.1000,
  k66: 18.9000,
  k67: 55.4000,
  k68: 91.9000,
  k69: 28.7000,
  k70: 65.2000,
  k71: 2.0000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_025_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_025_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_025_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_025_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_025_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_025_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_025_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_025_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_025_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_025_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_025_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
