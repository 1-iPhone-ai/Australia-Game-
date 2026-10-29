import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 133 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_133_META = {
  id: 'lane_133',
  regionId: 'TAS' as V1019MtrdRegionId,
  primarySystem: 'digital' as V1019MtrdSystemDomain,
  laneBand: 'critical' as V1019MtrdLaneBand,
  seed: 116682,
} as const;

const V1019_MTRD_LANE_SCENARIO_133_COEF = {
  k0: 19.0000,
  k1: 92.5000,
  k2: 66.9000,
  k3: 41.3000,
  k4: 15.7000,
  k5: 89.2000,
  k6: 63.6000,
  k7: 38.0000,
  k8: 12.4000,
  k9: 85.9000,
  k10: 60.3000,
  k11: 34.7000,
  k12: 9.1000,
  k13: 82.6000,
  k14: 57.0000,
  k15: 31.4000,
  k16: 5.8000,
  k17: 79.3000,
  k18: 53.7000,
  k19: 28.1000,
  k20: 2.5000,
  k21: 76.0000,
  k22: 50.4000,
  k23: 24.8000,
  k24: 98.3000,
  k25: 72.7000,
  k26: 47.1000,
  k27: 21.5000,
  k28: 95.0000,
  k29: 69.4000,
  k30: 43.8000,
  k31: 18.2000,
  k32: 91.7000,
  k33: 66.1000,
  k34: 40.5000,
  k35: 14.9000,
  k36: 88.4000,
  k37: 62.8000,
  k38: 37.2000,
  k39: 11.6000,
  k40: 85.1000,
  k41: 59.5000,
  k42: 33.9000,
  k43: 8.3000,
  k44: 81.8000,
  k45: 56.2000,
  k46: 30.6000,
  k47: 5.0000,
  k48: 78.5000,
  k49: 52.9000,
  k50: 27.3000,
  k51: 1.7000,
  k52: 75.2000,
  k53: 49.6000,
  k54: 24.0000,
  k55: 97.5000,
  k56: 71.9000,
  k57: 46.3000,
  k58: 20.7000,
  k59: 94.2000,
  k60: 68.6000,
  k61: 43.0000,
  k62: 17.4000,
  k63: 90.9000,
  k64: 65.3000,
  k65: 39.7000,
  k66: 14.1000,
  k67: 87.6000,
  k68: 62.0000,
  k69: 36.4000,
  k70: 10.8000,
  k71: 84.3000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_133_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_133_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_133_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_133_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_133_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_133_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_133_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_133_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_133_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_133_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_133_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_133_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
