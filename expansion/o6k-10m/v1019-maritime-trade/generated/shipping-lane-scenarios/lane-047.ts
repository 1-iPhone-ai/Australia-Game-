import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 047 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_047_META = {
  id: 'lane_047',
  regionId: 'ACT' as V1019MtrdRegionId,
  primarySystem: 'industrial' as V1019MtrdSystemDomain,
  laneBand: 'active' as V1019MtrdLaneBand,
  seed: 41260,
} as const;

const V1019_MTRD_LANE_SCENARIO_047_COEF = {
  k0: 43.9000,
  k1: 7.7000,
  k2: 70.6000,
  k3: 34.4000,
  k4: 97.3000,
  k5: 61.1000,
  k6: 24.9000,
  k7: 87.8000,
  k8: 51.6000,
  k9: 15.4000,
  k10: 78.3000,
  k11: 42.1000,
  k12: 5.9000,
  k13: 68.8000,
  k14: 32.6000,
  k15: 95.5000,
  k16: 59.3000,
  k17: 23.1000,
  k18: 86.0000,
  k19: 49.8000,
  k20: 13.6000,
  k21: 76.5000,
  k22: 40.3000,
  k23: 4.1000,
  k24: 67.0000,
  k25: 30.8000,
  k26: 93.7000,
  k27: 57.5000,
  k28: 21.3000,
  k29: 84.2000,
  k30: 48.0000,
  k31: 11.8000,
  k32: 74.7000,
  k33: 38.5000,
  k34: 2.3000,
  k35: 65.2000,
  k36: 29.0000,
  k37: 91.9000,
  k38: 55.7000,
  k39: 19.5000,
  k40: 82.4000,
  k41: 46.2000,
  k42: 10.0000,
  k43: 72.9000,
  k44: 36.7000,
  k45: 0.5000,
  k46: 63.4000,
  k47: 27.2000,
  k48: 90.1000,
  k49: 53.9000,
  k50: 17.7000,
  k51: 80.6000,
  k52: 44.4000,
  k53: 8.2000,
  k54: 71.1000,
  k55: 34.9000,
  k56: 97.8000,
  k57: 61.6000,
  k58: 25.4000,
  k59: 88.3000,
  k60: 52.1000,
  k61: 15.9000,
  k62: 78.8000,
  k63: 42.6000,
  k64: 6.4000,
  k65: 69.3000,
  k66: 33.1000,
  k67: 96.0000,
  k68: 59.8000,
  k69: 23.6000,
  k70: 86.5000,
  k71: 50.3000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_047_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_047_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_047_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_047_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_047_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_047_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_047_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_047_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_047_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_047_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_047_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_047_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
