import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 056 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_056_META = {
  id: 'intrusion_056',
  regionId: 'NSW' as V1035CyresRegionId,
  primaryChannel: 'aged_care' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'moderate' as V1035CyresCyberResilienceBand,
  seed: 51537,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_056_COEF = {
  k0: 61.1000,
  k1: 30.4000,
  k2: 99.4000,
  k3: 68.7000,
  k4: 38.0000,
  k5: 7.3000,
  k6: 76.3000,
  k7: 45.6000,
  k8: 14.9000,
  k9: 83.9000,
  k10: 53.2000,
  k11: 22.5000,
  k12: 91.5000,
  k13: 60.8000,
  k14: 30.1000,
  k15: 99.1000,
  k16: 68.4000,
  k17: 37.7000,
  k18: 7.0000,
  k19: 76.0000,
  k20: 45.3000,
  k21: 14.6000,
  k22: 83.6000,
  k23: 52.9000,
  k24: 22.2000,
  k25: 91.2000,
  k26: 60.5000,
  k27: 29.8000,
  k28: 98.8000,
  k29: 68.1000,
  k30: 37.4000,
  k31: 6.7000,
  k32: 75.7000,
  k33: 45.0000,
  k34: 14.3000,
  k35: 83.3000,
  k36: 52.6000,
  k37: 21.9000,
  k38: 90.9000,
  k39: 60.2000,
  k40: 29.5000,
  k41: 98.5000,
  k42: 67.8000,
  k43: 37.1000,
  k44: 6.4000,
  k45: 75.4000,
  k46: 44.7000,
  k47: 14.0000,
  k48: 83.0000,
  k49: 52.3000,
  k50: 21.6000,
  k51: 90.6000,
  k52: 59.9000,
  k53: 29.2000,
  k54: 98.2000,
  k55: 67.5000,
  k56: 36.8000,
  k57: 6.1000,
  k58: 75.1000,
  k59: 44.4000,
  k60: 13.7000,
  k61: 82.7000,
  k62: 52.0000,
  k63: 21.3000,
  k64: 90.3000,
  k65: 59.6000,
  k66: 28.9000,
  k67: 97.9000,
  k68: 67.2000,
  k69: 36.5000,
  k70: 5.8000,
  k71: 74.8000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_056_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_056_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_056_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_056_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_056_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_056_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_056_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_056_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_056_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_056_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_056_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
