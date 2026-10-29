import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 088 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_088_META = {
  id: 'lane_088',
  regionId: 'NSW' as V1019MtrdRegionId,
  primarySystem: 'telecom' as V1019MtrdSystemDomain,
  laneBand: 'critical' as V1019MtrdLaneBand,
  seed: 77217,
} as const;

const V1019_MTRD_LANE_SCENARIO_088_COEF = {
  k0: 42.4000,
  k1: 34.3000,
  k2: 26.2000,
  k3: 18.1000,
  k4: 10.0000,
  k5: 1.9000,
  k6: 92.9000,
  k7: 84.8000,
  k8: 76.7000,
  k9: 68.6000,
  k10: 60.5000,
  k11: 52.4000,
  k12: 44.3000,
  k13: 36.2000,
  k14: 28.1000,
  k15: 20.0000,
  k16: 11.9000,
  k17: 3.8000,
  k18: 94.8000,
  k19: 86.7000,
  k20: 78.6000,
  k21: 70.5000,
  k22: 62.4000,
  k23: 54.3000,
  k24: 46.2000,
  k25: 38.1000,
  k26: 30.0000,
  k27: 21.9000,
  k28: 13.8000,
  k29: 5.7000,
  k30: 96.7000,
  k31: 88.6000,
  k32: 80.5000,
  k33: 72.4000,
  k34: 64.3000,
  k35: 56.2000,
  k36: 48.1000,
  k37: 40.0000,
  k38: 31.9000,
  k39: 23.8000,
  k40: 15.7000,
  k41: 7.6000,
  k42: 98.6000,
  k43: 90.5000,
  k44: 82.4000,
  k45: 74.3000,
  k46: 66.2000,
  k47: 58.1000,
  k48: 50.0000,
  k49: 41.9000,
  k50: 33.8000,
  k51: 25.7000,
  k52: 17.6000,
  k53: 9.5000,
  k54: 1.4000,
  k55: 92.4000,
  k56: 84.3000,
  k57: 76.2000,
  k58: 68.1000,
  k59: 60.0000,
  k60: 51.9000,
  k61: 43.8000,
  k62: 35.7000,
  k63: 27.6000,
  k64: 19.5000,
  k65: 11.4000,
  k66: 3.3000,
  k67: 94.3000,
  k68: 86.2000,
  k69: 78.1000,
  k70: 70.0000,
  k71: 61.9000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_088_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_088_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_088_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_088_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_088_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_088_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_088_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_088_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_088_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_088_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_088_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_088_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
