import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 052 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_052_META = {
  id: 'lane_052',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'water' as V1019MtrdSystemDomain,
  laneBand: 'active' as V1019MtrdLaneBand,
  seed: 45645,
} as const;

const V1019_MTRD_LANE_SCENARIO_052_COEF = {
  k0: 41.3000,
  k1: 47.2000,
  k2: 53.1000,
  k3: 59.0000,
  k4: 64.9000,
  k5: 70.8000,
  k6: 76.7000,
  k7: 82.6000,
  k8: 88.5000,
  k9: 94.4000,
  k10: 1.2000,
  k11: 7.1000,
  k12: 13.0000,
  k13: 18.9000,
  k14: 24.8000,
  k15: 30.7000,
  k16: 36.6000,
  k17: 42.5000,
  k18: 48.4000,
  k19: 54.3000,
  k20: 60.2000,
  k21: 66.1000,
  k22: 72.0000,
  k23: 77.9000,
  k24: 83.8000,
  k25: 89.7000,
  k26: 95.6000,
  k27: 2.4000,
  k28: 8.3000,
  k29: 14.2000,
  k30: 20.1000,
  k31: 26.0000,
  k32: 31.9000,
  k33: 37.8000,
  k34: 43.7000,
  k35: 49.6000,
  k36: 55.5000,
  k37: 61.4000,
  k38: 67.3000,
  k39: 73.2000,
  k40: 79.1000,
  k41: 85.0000,
  k42: 90.9000,
  k43: 96.8000,
  k44: 3.6000,
  k45: 9.5000,
  k46: 15.4000,
  k47: 21.3000,
  k48: 27.2000,
  k49: 33.1000,
  k50: 39.0000,
  k51: 44.9000,
  k52: 50.8000,
  k53: 56.7000,
  k54: 62.6000,
  k55: 68.5000,
  k56: 74.4000,
  k57: 80.3000,
  k58: 86.2000,
  k59: 92.1000,
  k60: 98.0000,
  k61: 4.8000,
  k62: 10.7000,
  k63: 16.6000,
  k64: 22.5000,
  k65: 28.4000,
  k66: 34.3000,
  k67: 40.2000,
  k68: 46.1000,
  k69: 52.0000,
  k70: 57.9000,
  k71: 63.8000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_052_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_052_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_052_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_052_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_052_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_052_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_052_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_052_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_052_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_052_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_052_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_052_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
