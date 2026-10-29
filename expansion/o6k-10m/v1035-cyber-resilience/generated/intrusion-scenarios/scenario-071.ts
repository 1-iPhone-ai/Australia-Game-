import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 071 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_071_META = {
  id: 'intrusion_071',
  regionId: 'ACT' as V1035CyresRegionId,
  primaryChannel: 'primary_access' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'moderate' as V1035CyresCyberResilienceBand,
  seed: 65202,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_071_COEF = {
  k0: 37.9000,
  k1: 77.6000,
  k2: 17.6000,
  k3: 57.3000,
  k4: 97.0000,
  k5: 37.0000,
  k6: 76.7000,
  k7: 16.7000,
  k8: 56.4000,
  k9: 96.1000,
  k10: 36.1000,
  k11: 75.8000,
  k12: 15.8000,
  k13: 55.5000,
  k14: 95.2000,
  k15: 35.2000,
  k16: 74.9000,
  k17: 14.9000,
  k18: 54.6000,
  k19: 94.3000,
  k20: 34.3000,
  k21: 74.0000,
  k22: 14.0000,
  k23: 53.7000,
  k24: 93.4000,
  k25: 33.4000,
  k26: 73.1000,
  k27: 13.1000,
  k28: 52.8000,
  k29: 92.5000,
  k30: 32.5000,
  k31: 72.2000,
  k32: 12.2000,
  k33: 51.9000,
  k34: 91.6000,
  k35: 31.6000,
  k36: 71.3000,
  k37: 11.3000,
  k38: 51.0000,
  k39: 90.7000,
  k40: 30.7000,
  k41: 70.4000,
  k42: 10.4000,
  k43: 50.1000,
  k44: 89.8000,
  k45: 29.8000,
  k46: 69.5000,
  k47: 9.5000,
  k48: 49.2000,
  k49: 88.9000,
  k50: 28.9000,
  k51: 68.6000,
  k52: 8.6000,
  k53: 48.3000,
  k54: 88.0000,
  k55: 28.0000,
  k56: 67.7000,
  k57: 7.7000,
  k58: 47.4000,
  k59: 87.1000,
  k60: 27.1000,
  k61: 66.8000,
  k62: 6.8000,
  k63: 46.5000,
  k64: 86.2000,
  k65: 26.2000,
  k66: 65.9000,
  k67: 5.9000,
  k68: 45.6000,
  k69: 85.3000,
  k70: 25.3000,
  k71: 65.0000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_071_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_071_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_071_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_071_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_071_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_071_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_071_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_071_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_071_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_071_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_071_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
