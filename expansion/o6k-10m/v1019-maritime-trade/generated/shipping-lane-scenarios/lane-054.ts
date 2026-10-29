import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 054 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_054_META = {
  id: 'lane_054',
  regionId: 'NT' as V1019MtrdRegionId,
  primarySystem: 'trade' as V1019MtrdSystemDomain,
  laneBand: 'recovering' as V1019MtrdLaneBand,
  seed: 47399,
} as const;

const V1019_MTRD_LANE_SCENARIO_054_COEF = {
  k0: 79.9000,
  k1: 63.0000,
  k2: 46.1000,
  k3: 29.2000,
  k4: 12.3000,
  k5: 94.5000,
  k6: 77.6000,
  k7: 60.7000,
  k8: 43.8000,
  k9: 26.9000,
  k10: 10.0000,
  k11: 92.2000,
  k12: 75.3000,
  k13: 58.4000,
  k14: 41.5000,
  k15: 24.6000,
  k16: 7.7000,
  k17: 89.9000,
  k18: 73.0000,
  k19: 56.1000,
  k20: 39.2000,
  k21: 22.3000,
  k22: 5.4000,
  k23: 87.6000,
  k24: 70.7000,
  k25: 53.8000,
  k26: 36.9000,
  k27: 20.0000,
  k28: 3.1000,
  k29: 85.3000,
  k30: 68.4000,
  k31: 51.5000,
  k32: 34.6000,
  k33: 17.7000,
  k34: 0.8000,
  k35: 83.0000,
  k36: 66.1000,
  k37: 49.2000,
  k38: 32.3000,
  k39: 15.4000,
  k40: 97.6000,
  k41: 80.7000,
  k42: 63.8000,
  k43: 46.9000,
  k44: 30.0000,
  k45: 13.1000,
  k46: 95.3000,
  k47: 78.4000,
  k48: 61.5000,
  k49: 44.6000,
  k50: 27.7000,
  k51: 10.8000,
  k52: 93.0000,
  k53: 76.1000,
  k54: 59.2000,
  k55: 42.3000,
  k56: 25.4000,
  k57: 8.5000,
  k58: 90.7000,
  k59: 73.8000,
  k60: 56.9000,
  k61: 40.0000,
  k62: 23.1000,
  k63: 6.2000,
  k64: 88.4000,
  k65: 71.5000,
  k66: 54.6000,
  k67: 37.7000,
  k68: 20.8000,
  k69: 3.9000,
  k70: 86.1000,
  k71: 69.2000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_054_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_054_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_054_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_054_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_054_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_054_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_054_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_054_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_054_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_054_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_054_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_054_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
