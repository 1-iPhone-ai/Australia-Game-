import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 155 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_155_META = {
  id: 'lane_155',
  regionId: 'WA' as V1019MtrdRegionId,
  primarySystem: 'pharma' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 135976,
} as const;

const V1019_MTRD_LANE_SCENARIO_155_COEF = {
  k0: 47.2000,
  k1: 68.1000,
  k2: 89.0000,
  k3: 10.8000,
  k4: 31.7000,
  k5: 52.6000,
  k6: 73.5000,
  k7: 94.4000,
  k8: 16.2000,
  k9: 37.1000,
  k10: 58.0000,
  k11: 78.9000,
  k12: 0.7000,
  k13: 21.6000,
  k14: 42.5000,
  k15: 63.4000,
  k16: 84.3000,
  k17: 6.1000,
  k18: 27.0000,
  k19: 47.9000,
  k20: 68.8000,
  k21: 89.7000,
  k22: 11.5000,
  k23: 32.4000,
  k24: 53.3000,
  k25: 74.2000,
  k26: 95.1000,
  k27: 16.9000,
  k28: 37.8000,
  k29: 58.7000,
  k30: 79.6000,
  k31: 1.4000,
  k32: 22.3000,
  k33: 43.2000,
  k34: 64.1000,
  k35: 85.0000,
  k36: 6.8000,
  k37: 27.7000,
  k38: 48.6000,
  k39: 69.5000,
  k40: 90.4000,
  k41: 12.2000,
  k42: 33.1000,
  k43: 54.0000,
  k44: 74.9000,
  k45: 95.8000,
  k46: 17.6000,
  k47: 38.5000,
  k48: 59.4000,
  k49: 80.3000,
  k50: 2.1000,
  k51: 23.0000,
  k52: 43.9000,
  k53: 64.8000,
  k54: 85.7000,
  k55: 7.5000,
  k56: 28.4000,
  k57: 49.3000,
  k58: 70.2000,
  k59: 91.1000,
  k60: 12.9000,
  k61: 33.8000,
  k62: 54.7000,
  k63: 75.6000,
  k64: 96.5000,
  k65: 18.3000,
  k66: 39.2000,
  k67: 60.1000,
  k68: 81.0000,
  k69: 2.8000,
  k70: 23.7000,
  k71: 44.6000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_155_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_155_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_155_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_155_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_155_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_155_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_155_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_155_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_155_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_155_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_155_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_155_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
