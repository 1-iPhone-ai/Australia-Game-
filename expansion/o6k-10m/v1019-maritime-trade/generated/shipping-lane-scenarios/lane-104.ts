import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 104 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_104_META = {
  id: 'lane_104',
  regionId: 'NSW' as V1019MtrdRegionId,
  primarySystem: 'trade' as V1019MtrdSystemDomain,
  laneBand: 'recovering' as V1019MtrdLaneBand,
  seed: 91249,
} as const;

const V1019_MTRD_LANE_SCENARIO_104_COEF = {
  k0: 53.9000,
  k1: 61.6000,
  k2: 69.3000,
  k3: 77.0000,
  k4: 84.7000,
  k5: 92.4000,
  k6: 1.0000,
  k7: 8.7000,
  k8: 16.4000,
  k9: 24.1000,
  k10: 31.8000,
  k11: 39.5000,
  k12: 47.2000,
  k13: 54.9000,
  k14: 62.6000,
  k15: 70.3000,
  k16: 78.0000,
  k17: 85.7000,
  k18: 93.4000,
  k19: 2.0000,
  k20: 9.7000,
  k21: 17.4000,
  k22: 25.1000,
  k23: 32.8000,
  k24: 40.5000,
  k25: 48.2000,
  k26: 55.9000,
  k27: 63.6000,
  k28: 71.3000,
  k29: 79.0000,
  k30: 86.7000,
  k31: 94.4000,
  k32: 3.0000,
  k33: 10.7000,
  k34: 18.4000,
  k35: 26.1000,
  k36: 33.8000,
  k37: 41.5000,
  k38: 49.2000,
  k39: 56.9000,
  k40: 64.6000,
  k41: 72.3000,
  k42: 80.0000,
  k43: 87.7000,
  k44: 95.4000,
  k45: 4.0000,
  k46: 11.7000,
  k47: 19.4000,
  k48: 27.1000,
  k49: 34.8000,
  k50: 42.5000,
  k51: 50.2000,
  k52: 57.9000,
  k53: 65.6000,
  k54: 73.3000,
  k55: 81.0000,
  k56: 88.7000,
  k57: 96.4000,
  k58: 5.0000,
  k59: 12.7000,
  k60: 20.4000,
  k61: 28.1000,
  k62: 35.8000,
  k63: 43.5000,
  k64: 51.2000,
  k65: 58.9000,
  k66: 66.6000,
  k67: 74.3000,
  k68: 82.0000,
  k69: 89.7000,
  k70: 97.4000,
  k71: 6.0000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_104_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_104_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_104_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_104_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_104_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_104_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_104_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_104_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_104_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_104_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_104_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_104_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
