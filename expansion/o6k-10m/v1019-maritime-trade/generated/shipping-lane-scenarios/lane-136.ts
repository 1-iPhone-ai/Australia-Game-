import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 136 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_136_META = {
  id: 'lane_136',
  regionId: 'NSW' as V1019MtrdRegionId,
  primarySystem: 'food' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 119313,
} as const;

const V1019_MTRD_LANE_SCENARIO_136_COEF = {
  k0: 76.9000,
  k1: 17.1000,
  k2: 56.4000,
  k3: 95.7000,
  k4: 35.9000,
  k5: 75.2000,
  k6: 15.4000,
  k7: 54.7000,
  k8: 94.0000,
  k9: 34.2000,
  k10: 73.5000,
  k11: 13.7000,
  k12: 53.0000,
  k13: 92.3000,
  k14: 32.5000,
  k15: 71.8000,
  k16: 12.0000,
  k17: 51.3000,
  k18: 90.6000,
  k19: 30.8000,
  k20: 70.1000,
  k21: 10.3000,
  k22: 49.6000,
  k23: 88.9000,
  k24: 29.1000,
  k25: 68.4000,
  k26: 8.6000,
  k27: 47.9000,
  k28: 87.2000,
  k29: 27.4000,
  k30: 66.7000,
  k31: 6.9000,
  k32: 46.2000,
  k33: 85.5000,
  k34: 25.7000,
  k35: 65.0000,
  k36: 5.2000,
  k37: 44.5000,
  k38: 83.8000,
  k39: 24.0000,
  k40: 63.3000,
  k41: 3.5000,
  k42: 42.8000,
  k43: 82.1000,
  k44: 22.3000,
  k45: 61.6000,
  k46: 1.8000,
  k47: 41.1000,
  k48: 80.4000,
  k49: 20.6000,
  k50: 59.9000,
  k51: 0.1000,
  k52: 39.4000,
  k53: 78.7000,
  k54: 18.9000,
  k55: 58.2000,
  k56: 97.5000,
  k57: 37.7000,
  k58: 77.0000,
  k59: 17.2000,
  k60: 56.5000,
  k61: 95.8000,
  k62: 36.0000,
  k63: 75.3000,
  k64: 15.5000,
  k65: 54.8000,
  k66: 94.1000,
  k67: 34.3000,
  k68: 73.6000,
  k69: 13.8000,
  k70: 53.1000,
  k71: 92.4000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_136_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_136_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_136_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_136_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_136_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_136_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_136_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_136_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_136_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_136_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_136_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_136_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
