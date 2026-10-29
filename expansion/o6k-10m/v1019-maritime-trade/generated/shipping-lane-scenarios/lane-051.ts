import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 051 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_051_META = {
  id: 'lane_051',
  regionId: 'WA' as V1019MtrdRegionId,
  primarySystem: 'energy' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 44768,
} as const;

const V1019_MTRD_LANE_SCENARIO_051_COEF = {
  k0: 22.0000,
  k1: 39.3000,
  k2: 56.6000,
  k3: 73.9000,
  k4: 91.2000,
  k5: 9.4000,
  k6: 26.7000,
  k7: 44.0000,
  k8: 61.3000,
  k9: 78.6000,
  k10: 95.9000,
  k11: 14.1000,
  k12: 31.4000,
  k13: 48.7000,
  k14: 66.0000,
  k15: 83.3000,
  k16: 1.5000,
  k17: 18.8000,
  k18: 36.1000,
  k19: 53.4000,
  k20: 70.7000,
  k21: 88.0000,
  k22: 6.2000,
  k23: 23.5000,
  k24: 40.8000,
  k25: 58.1000,
  k26: 75.4000,
  k27: 92.7000,
  k28: 10.9000,
  k29: 28.2000,
  k30: 45.5000,
  k31: 62.8000,
  k32: 80.1000,
  k33: 97.4000,
  k34: 15.6000,
  k35: 32.9000,
  k36: 50.2000,
  k37: 67.5000,
  k38: 84.8000,
  k39: 3.0000,
  k40: 20.3000,
  k41: 37.6000,
  k42: 54.9000,
  k43: 72.2000,
  k44: 89.5000,
  k45: 7.7000,
  k46: 25.0000,
  k47: 42.3000,
  k48: 59.6000,
  k49: 76.9000,
  k50: 94.2000,
  k51: 12.4000,
  k52: 29.7000,
  k53: 47.0000,
  k54: 64.3000,
  k55: 81.6000,
  k56: 98.9000,
  k57: 17.1000,
  k58: 34.4000,
  k59: 51.7000,
  k60: 69.0000,
  k61: 86.3000,
  k62: 4.5000,
  k63: 21.8000,
  k64: 39.1000,
  k65: 56.4000,
  k66: 73.7000,
  k67: 91.0000,
  k68: 9.2000,
  k69: 26.5000,
  k70: 43.8000,
  k71: 61.1000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_051_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_051_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_051_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_051_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_051_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_051_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_051_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_051_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_051_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_051_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_051_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_051_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
