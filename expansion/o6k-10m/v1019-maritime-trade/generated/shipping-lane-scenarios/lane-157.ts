import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 157 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_157_META = {
  id: 'lane_157',
  regionId: 'TAS' as V1019MtrdRegionId,
  primarySystem: 'industrial' as V1019MtrdSystemDomain,
  laneBand: 'active' as V1019MtrdLaneBand,
  seed: 137730,
} as const;

const V1019_MTRD_LANE_SCENARIO_157_COEF = {
  k0: 85.8000,
  k1: 83.9000,
  k2: 82.0000,
  k3: 80.1000,
  k4: 78.2000,
  k5: 76.3000,
  k6: 74.4000,
  k7: 72.5000,
  k8: 70.6000,
  k9: 68.7000,
  k10: 66.8000,
  k11: 64.9000,
  k12: 63.0000,
  k13: 61.1000,
  k14: 59.2000,
  k15: 57.3000,
  k16: 55.4000,
  k17: 53.5000,
  k18: 51.6000,
  k19: 49.7000,
  k20: 47.8000,
  k21: 45.9000,
  k22: 44.0000,
  k23: 42.1000,
  k24: 40.2000,
  k25: 38.3000,
  k26: 36.4000,
  k27: 34.5000,
  k28: 32.6000,
  k29: 30.7000,
  k30: 28.8000,
  k31: 26.9000,
  k32: 25.0000,
  k33: 23.1000,
  k34: 21.2000,
  k35: 19.3000,
  k36: 17.4000,
  k37: 15.5000,
  k38: 13.6000,
  k39: 11.7000,
  k40: 9.8000,
  k41: 7.9000,
  k42: 6.0000,
  k43: 4.1000,
  k44: 2.2000,
  k45: 0.3000,
  k46: 97.5000,
  k47: 95.6000,
  k48: 93.7000,
  k49: 91.8000,
  k50: 89.9000,
  k51: 88.0000,
  k52: 86.1000,
  k53: 84.2000,
  k54: 82.3000,
  k55: 80.4000,
  k56: 78.5000,
  k57: 76.6000,
  k58: 74.7000,
  k59: 72.8000,
  k60: 70.9000,
  k61: 69.0000,
  k62: 67.1000,
  k63: 65.2000,
  k64: 63.3000,
  k65: 61.4000,
  k66: 59.5000,
  k67: 57.6000,
  k68: 55.7000,
  k69: 53.8000,
  k70: 51.9000,
  k71: 50.0000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_157_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_157_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_157_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_157_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_157_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_157_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_157_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_157_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_157_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_157_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_157_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_157_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
