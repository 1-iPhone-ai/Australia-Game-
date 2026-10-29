import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 044 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_044_META = {
  id: 'lane_044',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'trade' as V1019MtrdSystemDomain,
  laneBand: 'recovering' as V1019MtrdLaneBand,
  seed: 38629,
} as const;

const V1019_MTRD_LANE_SCENARIO_044_COEF = {
  k0: 85.1000,
  k1: 83.1000,
  k2: 81.1000,
  k3: 79.1000,
  k4: 77.1000,
  k5: 75.1000,
  k6: 73.1000,
  k7: 71.1000,
  k8: 69.1000,
  k9: 67.1000,
  k10: 65.1000,
  k11: 63.1000,
  k12: 61.1000,
  k13: 59.1000,
  k14: 57.1000,
  k15: 55.1000,
  k16: 53.1000,
  k17: 51.1000,
  k18: 49.1000,
  k19: 47.1000,
  k20: 45.1000,
  k21: 43.1000,
  k22: 41.1000,
  k23: 39.1000,
  k24: 37.1000,
  k25: 35.1000,
  k26: 33.1000,
  k27: 31.1000,
  k28: 29.1000,
  k29: 27.1000,
  k30: 25.1000,
  k31: 23.1000,
  k32: 21.1000,
  k33: 19.1000,
  k34: 17.1000,
  k35: 15.1000,
  k36: 13.1000,
  k37: 11.1000,
  k38: 9.1000,
  k39: 7.1000,
  k40: 5.1000,
  k41: 3.1000,
  k42: 1.1000,
  k43: 98.2000,
  k44: 96.2000,
  k45: 94.2000,
  k46: 92.2000,
  k47: 90.2000,
  k48: 88.2000,
  k49: 86.2000,
  k50: 84.2000,
  k51: 82.2000,
  k52: 80.2000,
  k53: 78.2000,
  k54: 76.2000,
  k55: 74.2000,
  k56: 72.2000,
  k57: 70.2000,
  k58: 68.2000,
  k59: 66.2000,
  k60: 64.2000,
  k61: 62.2000,
  k62: 60.2000,
  k63: 58.2000,
  k64: 56.2000,
  k65: 54.2000,
  k66: 52.2000,
  k67: 50.2000,
  k68: 48.2000,
  k69: 46.2000,
  k70: 44.2000,
  k71: 42.2000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_044_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_044_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_044_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_044_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_044_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_044_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_044_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_044_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_044_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_044_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_044_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_044_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
