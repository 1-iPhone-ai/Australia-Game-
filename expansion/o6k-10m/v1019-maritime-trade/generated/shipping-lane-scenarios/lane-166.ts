import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 166 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_166_META = {
  id: 'lane_166',
  regionId: 'NT' as V1019MtrdRegionId,
  primarySystem: 'food' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 145623,
} as const;

const V1019_MTRD_LANE_SCENARIO_166_COEF = {
  k0: 61.3000,
  k1: 55.9000,
  k2: 50.5000,
  k3: 45.1000,
  k4: 39.7000,
  k5: 34.3000,
  k6: 28.9000,
  k7: 23.5000,
  k8: 18.1000,
  k9: 12.7000,
  k10: 7.3000,
  k11: 1.9000,
  k12: 95.6000,
  k13: 90.2000,
  k14: 84.8000,
  k15: 79.4000,
  k16: 74.0000,
  k17: 68.6000,
  k18: 63.2000,
  k19: 57.8000,
  k20: 52.4000,
  k21: 47.0000,
  k22: 41.6000,
  k23: 36.2000,
  k24: 30.8000,
  k25: 25.4000,
  k26: 20.0000,
  k27: 14.6000,
  k28: 9.2000,
  k29: 3.8000,
  k30: 97.5000,
  k31: 92.1000,
  k32: 86.7000,
  k33: 81.3000,
  k34: 75.9000,
  k35: 70.5000,
  k36: 65.1000,
  k37: 59.7000,
  k38: 54.3000,
  k39: 48.9000,
  k40: 43.5000,
  k41: 38.1000,
  k42: 32.7000,
  k43: 27.3000,
  k44: 21.9000,
  k45: 16.5000,
  k46: 11.1000,
  k47: 5.7000,
  k48: 0.3000,
  k49: 94.0000,
  k50: 88.6000,
  k51: 83.2000,
  k52: 77.8000,
  k53: 72.4000,
  k54: 67.0000,
  k55: 61.6000,
  k56: 56.2000,
  k57: 50.8000,
  k58: 45.4000,
  k59: 40.0000,
  k60: 34.6000,
  k61: 29.2000,
  k62: 23.8000,
  k63: 18.4000,
  k64: 13.0000,
  k65: 7.6000,
  k66: 2.2000,
  k67: 95.9000,
  k68: 90.5000,
  k69: 85.1000,
  k70: 79.7000,
  k71: 74.3000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_166_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_166_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_166_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_166_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_166_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_166_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_166_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_166_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_166_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_166_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_166_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_166_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
