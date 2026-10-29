import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 100 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_100_META = {
  id: 'lane_100',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'freight' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 87741,
} as const;

const V1019_MTRD_LANE_SCENARIO_100_COEF = {
  k0: 75.8000,
  k1: 30.0000,
  k2: 83.3000,
  k3: 37.5000,
  k4: 90.8000,
  k5: 45.0000,
  k6: 98.3000,
  k7: 52.5000,
  k8: 6.7000,
  k9: 60.0000,
  k10: 14.2000,
  k11: 67.5000,
  k12: 21.7000,
  k13: 75.0000,
  k14: 29.2000,
  k15: 82.5000,
  k16: 36.7000,
  k17: 90.0000,
  k18: 44.2000,
  k19: 97.5000,
  k20: 51.7000,
  k21: 5.9000,
  k22: 59.2000,
  k23: 13.4000,
  k24: 66.7000,
  k25: 20.9000,
  k26: 74.2000,
  k27: 28.4000,
  k28: 81.7000,
  k29: 35.9000,
  k30: 89.2000,
  k31: 43.4000,
  k32: 96.7000,
  k33: 50.9000,
  k34: 5.1000,
  k35: 58.4000,
  k36: 12.6000,
  k37: 65.9000,
  k38: 20.1000,
  k39: 73.4000,
  k40: 27.6000,
  k41: 80.9000,
  k42: 35.1000,
  k43: 88.4000,
  k44: 42.6000,
  k45: 95.9000,
  k46: 50.1000,
  k47: 4.3000,
  k48: 57.6000,
  k49: 11.8000,
  k50: 65.1000,
  k51: 19.3000,
  k52: 72.6000,
  k53: 26.8000,
  k54: 80.1000,
  k55: 34.3000,
  k56: 87.6000,
  k57: 41.8000,
  k58: 95.1000,
  k59: 49.3000,
  k60: 3.5000,
  k61: 56.8000,
  k62: 11.0000,
  k63: 64.3000,
  k64: 18.5000,
  k65: 71.8000,
  k66: 26.0000,
  k67: 79.3000,
  k68: 33.5000,
  k69: 86.8000,
  k70: 41.0000,
  k71: 94.3000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_100_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_100_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_100_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_100_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_100_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_100_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_100_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_100_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_100_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_100_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_100_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_100_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
