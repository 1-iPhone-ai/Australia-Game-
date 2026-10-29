import { V1035_CYRES_clamp, V1035_CYRES_cyberResilienceBandFromScore } from '../../engine/cyber-resilience-utils.ts';
import type {
  V1035CyresCyberResilienceBand,
  V1035CyresRegionId,
  V1035CyresIntrusionSnapshot,
  V1035CyresCyberResilienceChannel,
} from '../../types/core.ts';

/** Generated intrusion incident scenario 122 — extreme_heat/drought/dust handoff matrix. */
export const V1035_CYRES_INTRUSION_SCENARIO_122_META = {
  id: 'intrusion_122',
  regionId: 'QLD' as V1035CyresRegionId,
  primaryChannel: 'facility_zone' as V1035CyresCyberResilienceChannel,
  cyberResilienceBand: 'elevated' as V1035CyresCyberResilienceBand,
  seed: 111663,
} as const;

const V1035_CYRES_INTRUSION_SCENARIO_122_COEF = {
  k0: 98.6000,
  k1: 98.5000,
  k2: 98.4000,
  k3: 98.3000,
  k4: 98.2000,
  k5: 98.1000,
  k6: 98.0000,
  k7: 97.9000,
  k8: 97.8000,
  k9: 97.7000,
  k10: 97.6000,
  k11: 97.5000,
  k12: 97.4000,
  k13: 97.3000,
  k14: 97.2000,
  k15: 97.1000,
  k16: 97.0000,
  k17: 96.9000,
  k18: 96.8000,
  k19: 96.7000,
  k20: 96.6000,
  k21: 96.5000,
  k22: 96.4000,
  k23: 96.3000,
  k24: 96.2000,
  k25: 96.1000,
  k26: 96.0000,
  k27: 95.9000,
  k28: 95.8000,
  k29: 95.7000,
  k30: 95.6000,
  k31: 95.5000,
  k32: 95.4000,
  k33: 95.3000,
  k34: 95.2000,
  k35: 95.1000,
  k36: 95.0000,
  k37: 94.9000,
  k38: 94.8000,
  k39: 94.7000,
  k40: 94.6000,
  k41: 94.5000,
  k42: 94.4000,
  k43: 94.3000,
  k44: 94.2000,
  k45: 94.1000,
  k46: 94.0000,
  k47: 93.9000,
  k48: 93.8000,
  k49: 93.7000,
  k50: 93.6000,
  k51: 93.5000,
  k52: 93.4000,
  k53: 93.3000,
  k54: 93.2000,
  k55: 93.1000,
  k56: 93.0000,
  k57: 92.9000,
  k58: 92.8000,
  k59: 92.7000,
  k60: 92.6000,
  k61: 92.5000,
  k62: 92.4000,
  k63: 92.3000,
  k64: 92.2000,
  k65: 92.1000,
  k66: 92.0000,
  k67: 91.9000,
  k68: 91.8000,
  k69: 91.7000,
  k70: 91.6000,
  k71: 91.5000,
} as const;

export function V1035_CYRES_INTRUSION_SCENARIO_122_evaluate(turn: number): {
  sovereignDigitalStressExposureIndex: number;
  segmentBufferDelayTurns: number;
  cyberResilienceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1035_CYRES_INTRUSION_SCENARIO_122_COEF) as Array<
    keyof typeof V1035_CYRES_INTRUSION_SCENARIO_122_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1035_CYRES_INTRUSION_SCENARIO_122_COEF[keys[j]] * ((turn + j) % 17);
  }
  const sovereignDigitalStressExposureIndex = V1035_CYRES_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const segmentBufferDelayTurns = V1035_CYRES_clamp(2 + (acc % 11), 1, 18);
  const cyberResilienceScore = V1035_CYRES_clamp(90 - sovereignDigitalStressExposureIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1035_CYRES_cyberResilienceBandFromScore(cyberResilienceScore) !== 'depleted';
  return { sovereignDigitalStressExposureIndex, segmentBufferDelayTurns, cyberResilienceScore, stable };
}

export function V1035_CYRES_INTRUSION_SCENARIO_122_snapshot(turn: number): V1035CyresIntrusionSnapshot {
  const r = V1035_CYRES_INTRUSION_SCENARIO_122_evaluate(turn);
  return {
    scenarioId: V1035_CYRES_INTRUSION_SCENARIO_122_META.id,
    regionId: V1035_CYRES_INTRUSION_SCENARIO_122_META.regionId,
    cyberResilienceChannel: V1035_CYRES_INTRUSION_SCENARIO_122_META.primaryChannel,
    sovereignDigitalStressExposureIndex: r.sovereignDigitalStressExposureIndex,
    segmentBufferDelayTurns: r.segmentBufferDelayTurns,
    cyberResilienceScore: r.cyberResilienceScore,
    cyberResilienceBand: V1035_CYRES_cyberResilienceBandFromScore(r.cyberResilienceScore),
  };
}

export function V1035_CYRES_INTRUSION_SCENARIO_122_regressionAssert(turn: number): boolean {
  const r = V1035_CYRES_INTRUSION_SCENARIO_122_evaluate(turn);
  return typeof r.sovereignDigitalStressExposureIndex === 'number' && r.cyberResilienceScore <= 100;
}
