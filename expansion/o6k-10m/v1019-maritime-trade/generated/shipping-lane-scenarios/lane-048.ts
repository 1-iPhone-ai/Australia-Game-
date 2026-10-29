import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 048 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_048_META = {
  id: 'lane_048',
  regionId: 'NSW' as V1019MtrdRegionId,
  primarySystem: 'telecom' as V1019MtrdSystemDomain,
  laneBand: 'critical' as V1019MtrdLaneBand,
  seed: 42137,
} as const;

const V1019_MTRD_LANE_SCENARIO_048_COEF = {
  k0: 63.2000,
  k1: 15.6000,
  k2: 67.1000,
  k3: 19.5000,
  k4: 71.0000,
  k5: 23.4000,
  k6: 74.9000,
  k7: 27.3000,
  k8: 78.8000,
  k9: 31.2000,
  k10: 82.7000,
  k11: 35.1000,
  k12: 86.6000,
  k13: 39.0000,
  k14: 90.5000,
  k15: 42.9000,
  k16: 94.4000,
  k17: 46.8000,
  k18: 98.3000,
  k19: 50.7000,
  k20: 3.1000,
  k21: 54.6000,
  k22: 7.0000,
  k23: 58.5000,
  k24: 10.9000,
  k25: 62.4000,
  k26: 14.8000,
  k27: 66.3000,
  k28: 18.7000,
  k29: 70.2000,
  k30: 22.6000,
  k31: 74.1000,
  k32: 26.5000,
  k33: 78.0000,
  k34: 30.4000,
  k35: 81.9000,
  k36: 34.3000,
  k37: 85.8000,
  k38: 38.2000,
  k39: 89.7000,
  k40: 42.1000,
  k41: 93.6000,
  k42: 46.0000,
  k43: 97.5000,
  k44: 49.9000,
  k45: 2.3000,
  k46: 53.8000,
  k47: 6.2000,
  k48: 57.7000,
  k49: 10.1000,
  k50: 61.6000,
  k51: 14.0000,
  k52: 65.5000,
  k53: 17.9000,
  k54: 69.4000,
  k55: 21.8000,
  k56: 73.3000,
  k57: 25.7000,
  k58: 77.2000,
  k59: 29.6000,
  k60: 81.1000,
  k61: 33.5000,
  k62: 85.0000,
  k63: 37.4000,
  k64: 88.9000,
  k65: 41.3000,
  k66: 92.8000,
  k67: 45.2000,
  k68: 96.7000,
  k69: 49.1000,
  k70: 1.5000,
  k71: 53.0000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_048_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_048_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_048_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_048_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_048_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_048_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_048_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_048_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_048_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_048_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_048_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_048_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
