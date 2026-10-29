import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 119 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_119_META = {
  id: 'lane_119',
  regionId: 'ACT' as V1019MtrdRegionId,
  primarySystem: 'finance' as V1019MtrdSystemDomain,
  laneBand: 'recovering' as V1019MtrdLaneBand,
  seed: 104404,
} as const;

const V1019_MTRD_LANE_SCENARIO_119_COEF = {
  k0: 46.1000,
  k1: 81.0000,
  k2: 16.8000,
  k3: 51.7000,
  k4: 86.6000,
  k5: 22.4000,
  k6: 57.3000,
  k7: 92.2000,
  k8: 28.0000,
  k9: 62.9000,
  k10: 97.8000,
  k11: 33.6000,
  k12: 68.5000,
  k13: 4.3000,
  k14: 39.2000,
  k15: 74.1000,
  k16: 9.9000,
  k17: 44.8000,
  k18: 79.7000,
  k19: 15.5000,
  k20: 50.4000,
  k21: 85.3000,
  k22: 21.1000,
  k23: 56.0000,
  k24: 90.9000,
  k25: 26.7000,
  k26: 61.6000,
  k27: 96.5000,
  k28: 32.3000,
  k29: 67.2000,
  k30: 3.0000,
  k31: 37.9000,
  k32: 72.8000,
  k33: 8.6000,
  k34: 43.5000,
  k35: 78.4000,
  k36: 14.2000,
  k37: 49.1000,
  k38: 84.0000,
  k39: 19.8000,
  k40: 54.7000,
  k41: 89.6000,
  k42: 25.4000,
  k43: 60.3000,
  k44: 95.2000,
  k45: 31.0000,
  k46: 65.9000,
  k47: 1.7000,
  k48: 36.6000,
  k49: 71.5000,
  k50: 7.3000,
  k51: 42.2000,
  k52: 77.1000,
  k53: 12.9000,
  k54: 47.8000,
  k55: 82.7000,
  k56: 18.5000,
  k57: 53.4000,
  k58: 88.3000,
  k59: 24.1000,
  k60: 59.0000,
  k61: 93.9000,
  k62: 29.7000,
  k63: 64.6000,
  k64: 0.4000,
  k65: 35.3000,
  k66: 70.2000,
  k67: 6.0000,
  k68: 40.9000,
  k69: 75.8000,
  k70: 11.6000,
  k71: 46.5000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_119_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_119_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_119_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_119_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_119_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_119_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_119_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_119_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_119_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_119_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_119_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_119_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
