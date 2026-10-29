import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 060 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_060_META = {
  id: 'lane_060',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'freight' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 52661,
} as const;

const V1019_MTRD_LANE_SCENARIO_060_COEF = {
  k0: 96.6000,
  k1: 11.3000,
  k2: 25.1000,
  k3: 38.9000,
  k4: 52.7000,
  k5: 66.5000,
  k6: 80.3000,
  k7: 94.1000,
  k8: 8.8000,
  k9: 22.6000,
  k10: 36.4000,
  k11: 50.2000,
  k12: 64.0000,
  k13: 77.8000,
  k14: 91.6000,
  k15: 6.3000,
  k16: 20.1000,
  k17: 33.9000,
  k18: 47.7000,
  k19: 61.5000,
  k20: 75.3000,
  k21: 89.1000,
  k22: 3.8000,
  k23: 17.6000,
  k24: 31.4000,
  k25: 45.2000,
  k26: 59.0000,
  k27: 72.8000,
  k28: 86.6000,
  k29: 1.3000,
  k30: 15.1000,
  k31: 28.9000,
  k32: 42.7000,
  k33: 56.5000,
  k34: 70.3000,
  k35: 84.1000,
  k36: 97.9000,
  k37: 12.6000,
  k38: 26.4000,
  k39: 40.2000,
  k40: 54.0000,
  k41: 67.8000,
  k42: 81.6000,
  k43: 95.4000,
  k44: 10.1000,
  k45: 23.9000,
  k46: 37.7000,
  k47: 51.5000,
  k48: 65.3000,
  k49: 79.1000,
  k50: 92.9000,
  k51: 7.6000,
  k52: 21.4000,
  k53: 35.2000,
  k54: 49.0000,
  k55: 62.8000,
  k56: 76.6000,
  k57: 90.4000,
  k58: 5.1000,
  k59: 18.9000,
  k60: 32.7000,
  k61: 46.5000,
  k62: 60.3000,
  k63: 74.1000,
  k64: 87.9000,
  k65: 2.6000,
  k66: 16.4000,
  k67: 30.2000,
  k68: 44.0000,
  k69: 57.8000,
  k70: 71.6000,
  k71: 85.4000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_060_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_060_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_060_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_060_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_060_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_060_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_060_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_060_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_060_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_060_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_060_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_060_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
