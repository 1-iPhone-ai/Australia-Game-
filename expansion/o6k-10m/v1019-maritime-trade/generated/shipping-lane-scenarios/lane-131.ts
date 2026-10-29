import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 131 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_131_META = {
  id: 'lane_131',
  regionId: 'WA' as V1019MtrdRegionId,
  primarySystem: 'energy' as V1019MtrdSystemDomain,
  laneBand: 'emerging' as V1019MtrdLaneBand,
  seed: 114928,
} as const;

const V1019_MTRD_LANE_SCENARIO_131_COEF = {
  k0: 79.5000,
  k1: 76.7000,
  k2: 73.9000,
  k3: 71.1000,
  k4: 68.3000,
  k5: 65.5000,
  k6: 62.7000,
  k7: 59.9000,
  k8: 57.1000,
  k9: 54.3000,
  k10: 51.5000,
  k11: 48.7000,
  k12: 45.9000,
  k13: 43.1000,
  k14: 40.3000,
  k15: 37.5000,
  k16: 34.7000,
  k17: 31.9000,
  k18: 29.1000,
  k19: 26.3000,
  k20: 23.5000,
  k21: 20.7000,
  k22: 17.9000,
  k23: 15.1000,
  k24: 12.3000,
  k25: 9.5000,
  k26: 6.7000,
  k27: 3.9000,
  k28: 1.1000,
  k29: 97.4000,
  k30: 94.6000,
  k31: 91.8000,
  k32: 89.0000,
  k33: 86.2000,
  k34: 83.4000,
  k35: 80.6000,
  k36: 77.8000,
  k37: 75.0000,
  k38: 72.2000,
  k39: 69.4000,
  k40: 66.6000,
  k41: 63.8000,
  k42: 61.0000,
  k43: 58.2000,
  k44: 55.4000,
  k45: 52.6000,
  k46: 49.8000,
  k47: 47.0000,
  k48: 44.2000,
  k49: 41.4000,
  k50: 38.6000,
  k51: 35.8000,
  k52: 33.0000,
  k53: 30.2000,
  k54: 27.4000,
  k55: 24.6000,
  k56: 21.8000,
  k57: 19.0000,
  k58: 16.2000,
  k59: 13.4000,
  k60: 10.6000,
  k61: 7.8000,
  k62: 5.0000,
  k63: 2.2000,
  k64: 98.5000,
  k65: 95.7000,
  k66: 92.9000,
  k67: 90.1000,
  k68: 87.3000,
  k69: 84.5000,
  k70: 81.7000,
  k71: 78.9000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_131_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_131_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_131_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_131_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_131_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_131_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_131_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_131_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_131_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_131_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_131_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_131_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
