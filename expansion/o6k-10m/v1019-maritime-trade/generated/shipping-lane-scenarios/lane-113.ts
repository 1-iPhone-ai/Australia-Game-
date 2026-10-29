import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 113 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_113_META = {
  id: 'lane_113',
  regionId: 'VIC' as V1019MtrdRegionId,
  primarySystem: 'digital' as V1019MtrdSystemDomain,
  laneBand: 'critical' as V1019MtrdLaneBand,
  seed: 99142,
} as const;

const V1019_MTRD_LANE_SCENARIO_113_COEF = {
  k0: 29.4000,
  k1: 33.6000,
  k2: 37.8000,
  k3: 42.0000,
  k4: 46.2000,
  k5: 50.4000,
  k6: 54.6000,
  k7: 58.8000,
  k8: 63.0000,
  k9: 67.2000,
  k10: 71.4000,
  k11: 75.6000,
  k12: 79.8000,
  k13: 84.0000,
  k14: 88.2000,
  k15: 92.4000,
  k16: 96.6000,
  k17: 1.7000,
  k18: 5.9000,
  k19: 10.1000,
  k20: 14.3000,
  k21: 18.5000,
  k22: 22.7000,
  k23: 26.9000,
  k24: 31.1000,
  k25: 35.3000,
  k26: 39.5000,
  k27: 43.7000,
  k28: 47.9000,
  k29: 52.1000,
  k30: 56.3000,
  k31: 60.5000,
  k32: 64.7000,
  k33: 68.9000,
  k34: 73.1000,
  k35: 77.3000,
  k36: 81.5000,
  k37: 85.7000,
  k38: 89.9000,
  k39: 94.1000,
  k40: 98.3000,
  k41: 3.4000,
  k42: 7.6000,
  k43: 11.8000,
  k44: 16.0000,
  k45: 20.2000,
  k46: 24.4000,
  k47: 28.6000,
  k48: 32.8000,
  k49: 37.0000,
  k50: 41.2000,
  k51: 45.4000,
  k52: 49.6000,
  k53: 53.8000,
  k54: 58.0000,
  k55: 62.2000,
  k56: 66.4000,
  k57: 70.6000,
  k58: 74.8000,
  k59: 79.0000,
  k60: 83.2000,
  k61: 87.4000,
  k62: 91.6000,
  k63: 95.8000,
  k64: 0.9000,
  k65: 5.1000,
  k66: 9.3000,
  k67: 13.5000,
  k68: 17.7000,
  k69: 21.9000,
  k70: 26.1000,
  k71: 30.3000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_113_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_113_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_113_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_113_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_113_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_113_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_113_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_113_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_113_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_113_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_113_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_113_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
