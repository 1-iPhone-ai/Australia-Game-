import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 041 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_041_META = {
  id: 'intrusion_041',
  regionId: 'VIC' as V1035CyresRegionId,
  primaryChannel: 'primary_access' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'moderate' as V1035CyresCyberResilienceBand,
  seed: 37872,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_041_COEF = {
  k0: 84.3000,
  k1: 82.9000,
  k2: 81.5000,
  k3: 80.1000,
  k4: 78.7000,
  k5: 77.3000,
  k6: 75.9000,
  k7: 74.5000,
  k8: 73.1000,
  k9: 71.7000,
  k10: 70.3000,
  k11: 68.9000,
  k12: 67.5000,
  k13: 66.1000,
  k14: 64.7000,
  k15: 63.3000,
  k16: 61.9000,
  k17: 60.5000,
  k18: 59.1000,
  k19: 57.7000,
  k20: 56.3000,
  k21: 54.9000,
  k22: 53.5000,
  k23: 52.1000,
  k24: 50.7000,
  k25: 49.3000,
  k26: 47.9000,
  k27: 46.5000,
  k28: 45.1000,
  k29: 43.7000,
  k30: 42.3000,
  k31: 40.9000,
  k32: 39.5000,
  k33: 38.1000,
  k34: 36.7000,
  k35: 35.3000,
  k36: 33.9000,
  k37: 32.5000,
  k38: 31.1000,
  k39: 29.7000,
  k40: 28.3000,
  k41: 26.9000,
  k42: 25.5000,
  k43: 24.1000,
  k44: 22.7000,
  k45: 21.3000,
  k46: 19.9000,
  k47: 18.5000,
  k48: 17.1000,
  k49: 15.7000,
  k50: 14.3000,
  k51: 12.9000,
  k52: 11.5000,
  k53: 10.1000,
  k54: 8.7000,
  k55: 7.3000,
  k56: 5.9000,
  k57: 4.5000,
  k58: 3.1000,
  k59: 1.7000,
  k60: 0.3000,
  k61: 98.6000,
  k62: 97.2000,
  k63: 95.8000,
  k64: 94.4000,
  k65: 93.0000,
  k66: 91.6000,
  k67: 90.2000,
  k68: 88.8000,
  k69: 87.4000,
  k70: 86.0000,
  k71: 84.6000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_041_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_041_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_041_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_041_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_041_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_041_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_041_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_041_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_041_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_041_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_041_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
