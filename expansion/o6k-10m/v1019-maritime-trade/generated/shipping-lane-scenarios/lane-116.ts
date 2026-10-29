import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 116 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_116_META = {
  id: 'lane_116',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'food' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 101773,
} as const;

const V1019_MTRD_LANE_SCENARIO_116_COEF = {
  k0: 87.3000,
  k1: 57.3000,
  k2: 27.3000,
  k3: 96.4000,
  k4: 66.4000,
  k5: 36.4000,
  k6: 6.4000,
  k7: 75.5000,
  k8: 45.5000,
  k9: 15.5000,
  k10: 84.6000,
  k11: 54.6000,
  k12: 24.6000,
  k13: 93.7000,
  k14: 63.7000,
  k15: 33.7000,
  k16: 3.7000,
  k17: 72.8000,
  k18: 42.8000,
  k19: 12.8000,
  k20: 81.9000,
  k21: 51.9000,
  k22: 21.9000,
  k23: 91.0000,
  k24: 61.0000,
  k25: 31.0000,
  k26: 1.0000,
  k27: 70.1000,
  k28: 40.1000,
  k29: 10.1000,
  k30: 79.2000,
  k31: 49.2000,
  k32: 19.2000,
  k33: 88.3000,
  k34: 58.3000,
  k35: 28.3000,
  k36: 97.4000,
  k37: 67.4000,
  k38: 37.4000,
  k39: 7.4000,
  k40: 76.5000,
  k41: 46.5000,
  k42: 16.5000,
  k43: 85.6000,
  k44: 55.6000,
  k45: 25.6000,
  k46: 94.7000,
  k47: 64.7000,
  k48: 34.7000,
  k49: 4.7000,
  k50: 73.8000,
  k51: 43.8000,
  k52: 13.8000,
  k53: 82.9000,
  k54: 52.9000,
  k55: 22.9000,
  k56: 92.0000,
  k57: 62.0000,
  k58: 32.0000,
  k59: 2.0000,
  k60: 71.1000,
  k61: 41.1000,
  k62: 11.1000,
  k63: 80.2000,
  k64: 50.2000,
  k65: 20.2000,
  k66: 89.3000,
  k67: 59.3000,
  k68: 29.3000,
  k69: 98.4000,
  k70: 68.4000,
  k71: 38.4000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_116_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_116_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_116_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_116_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_116_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_116_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_116_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_116_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_116_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_116_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_116_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_116_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
