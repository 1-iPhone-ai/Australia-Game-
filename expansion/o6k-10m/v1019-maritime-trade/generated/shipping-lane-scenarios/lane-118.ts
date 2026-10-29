import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 118 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_118_META = {
  id: 'lane_118',
  regionId: 'NT' as V1019MtrdRegionId,
  primarySystem: 'telecom' as V1019MtrdSystemDomain,
  laneBand: 'critical' as V1019MtrdLaneBand,
  seed: 103527,
} as const;

const V1019_MTRD_LANE_SCENARIO_118_COEF = {
  k0: 26.8000,
  k1: 73.1000,
  k2: 20.3000,
  k3: 66.6000,
  k4: 13.8000,
  k5: 60.1000,
  k6: 7.3000,
  k7: 53.6000,
  k8: 0.8000,
  k9: 47.1000,
  k10: 93.4000,
  k11: 40.6000,
  k12: 86.9000,
  k13: 34.1000,
  k14: 80.4000,
  k15: 27.6000,
  k16: 73.9000,
  k17: 21.1000,
  k18: 67.4000,
  k19: 14.6000,
  k20: 60.9000,
  k21: 8.1000,
  k22: 54.4000,
  k23: 1.6000,
  k24: 47.9000,
  k25: 94.2000,
  k26: 41.4000,
  k27: 87.7000,
  k28: 34.9000,
  k29: 81.2000,
  k30: 28.4000,
  k31: 74.7000,
  k32: 21.9000,
  k33: 68.2000,
  k34: 15.4000,
  k35: 61.7000,
  k36: 8.9000,
  k37: 55.2000,
  k38: 2.4000,
  k39: 48.7000,
  k40: 95.0000,
  k41: 42.2000,
  k42: 88.5000,
  k43: 35.7000,
  k44: 82.0000,
  k45: 29.2000,
  k46: 75.5000,
  k47: 22.7000,
  k48: 69.0000,
  k49: 16.2000,
  k50: 62.5000,
  k51: 9.7000,
  k52: 56.0000,
  k53: 3.2000,
  k54: 49.5000,
  k55: 95.8000,
  k56: 43.0000,
  k57: 89.3000,
  k58: 36.5000,
  k59: 82.8000,
  k60: 30.0000,
  k61: 76.3000,
  k62: 23.5000,
  k63: 69.8000,
  k64: 17.0000,
  k65: 63.3000,
  k66: 10.5000,
  k67: 56.8000,
  k68: 4.0000,
  k69: 50.3000,
  k70: 96.6000,
  k71: 43.8000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_118_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_118_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_118_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_118_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_118_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_118_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_118_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_118_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_118_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_118_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_118_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_118_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
