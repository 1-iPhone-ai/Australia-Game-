import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 014 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_014_META = {
  id: 'intrusion_014',
  regionId: 'NT' as V1035CyresRegionId,
  primaryChannel: 'rural_clinic' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'recovering' as V1035CyresCyberResilienceBand,
  seed: 13275,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_014_COEF = {
  k0: 46.3000,
  k1: 77.7000,
  k2: 9.4000,
  k3: 40.8000,
  k4: 72.2000,
  k5: 3.9000,
  k6: 35.3000,
  k7: 66.7000,
  k8: 98.1000,
  k9: 29.8000,
  k10: 61.2000,
  k11: 92.6000,
  k12: 24.3000,
  k13: 55.7000,
  k14: 87.1000,
  k15: 18.8000,
  k16: 50.2000,
  k17: 81.6000,
  k18: 13.3000,
  k19: 44.7000,
  k20: 76.1000,
  k21: 7.8000,
  k22: 39.2000,
  k23: 70.6000,
  k24: 2.3000,
  k25: 33.7000,
  k26: 65.1000,
  k27: 96.5000,
  k28: 28.2000,
  k29: 59.6000,
  k30: 91.0000,
  k31: 22.7000,
  k32: 54.1000,
  k33: 85.5000,
  k34: 17.2000,
  k35: 48.6000,
  k36: 80.0000,
  k37: 11.7000,
  k38: 43.1000,
  k39: 74.5000,
  k40: 6.2000,
  k41: 37.6000,
  k42: 69.0000,
  k43: 0.7000,
  k44: 32.1000,
  k45: 63.5000,
  k46: 94.9000,
  k47: 26.6000,
  k48: 58.0000,
  k49: 89.4000,
  k50: 21.1000,
  k51: 52.5000,
  k52: 83.9000,
  k53: 15.6000,
  k54: 47.0000,
  k55: 78.4000,
  k56: 10.1000,
  k57: 41.5000,
  k58: 72.9000,
  k59: 4.6000,
  k60: 36.0000,
  k61: 67.4000,
  k62: 98.8000,
  k63: 30.5000,
  k64: 61.9000,
  k65: 93.3000,
  k66: 25.0000,
  k67: 56.4000,
  k68: 87.8000,
  k69: 19.5000,
  k70: 50.9000,
  k71: 82.3000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_014_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_014_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_014_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_014_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_014_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_014_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_014_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_014_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_014_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_014_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_014_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
