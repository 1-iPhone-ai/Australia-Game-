import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 059 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_059_META = {
  id: 'lane_059',
  regionId: 'WA' as V1019MtrdRegionId,
  primarySystem: 'finance' as V1019MtrdSystemDomain,
  laneBand: 'recovering' as V1019MtrdLaneBand,
  seed: 51784,
} as const;

const V1019_MTRD_LANE_SCENARIO_059_COEF = {
  k0: 77.3000,
  k1: 3.4000,
  k2: 28.6000,
  k3: 53.8000,
  k4: 79.0000,
  k5: 5.1000,
  k6: 30.3000,
  k7: 55.5000,
  k8: 80.7000,
  k9: 6.8000,
  k10: 32.0000,
  k11: 57.2000,
  k12: 82.4000,
  k13: 8.5000,
  k14: 33.7000,
  k15: 58.9000,
  k16: 84.1000,
  k17: 10.2000,
  k18: 35.4000,
  k19: 60.6000,
  k20: 85.8000,
  k21: 11.9000,
  k22: 37.1000,
  k23: 62.3000,
  k24: 87.5000,
  k25: 13.6000,
  k26: 38.8000,
  k27: 64.0000,
  k28: 89.2000,
  k29: 15.3000,
  k30: 40.5000,
  k31: 65.7000,
  k32: 90.9000,
  k33: 17.0000,
  k34: 42.2000,
  k35: 67.4000,
  k36: 92.6000,
  k37: 18.7000,
  k38: 43.9000,
  k39: 69.1000,
  k40: 94.3000,
  k41: 20.4000,
  k42: 45.6000,
  k43: 70.8000,
  k44: 96.0000,
  k45: 22.1000,
  k46: 47.3000,
  k47: 72.5000,
  k48: 97.7000,
  k49: 23.8000,
  k50: 49.0000,
  k51: 74.2000,
  k52: 0.3000,
  k53: 25.5000,
  k54: 50.7000,
  k55: 75.9000,
  k56: 2.0000,
  k57: 27.2000,
  k58: 52.4000,
  k59: 77.6000,
  k60: 3.7000,
  k61: 28.9000,
  k62: 54.1000,
  k63: 79.3000,
  k64: 5.4000,
  k65: 30.6000,
  k66: 55.8000,
  k67: 81.0000,
  k68: 7.1000,
  k69: 32.3000,
  k70: 57.5000,
  k71: 82.7000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_059_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_059_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_059_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_059_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_059_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_059_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_059_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_059_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_059_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_059_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_059_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_059_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
