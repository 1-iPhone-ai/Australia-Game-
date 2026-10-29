import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 040 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_040_META = {
  id: 'lane_040',
  regionId: 'NSW' as V1019MtrdRegionId,
  primarySystem: 'freight' as V1019MtrdSystemDomain,
  laneBand: 'latent' as V1019MtrdLaneBand,
  seed: 35121,
} as const;

const V1019_MTRD_LANE_SCENARIO_040_COEF = {
  k0: 7.9000,
  k1: 51.5000,
  k2: 95.1000,
  k3: 39.6000,
  k4: 83.2000,
  k5: 27.7000,
  k6: 71.3000,
  k7: 15.8000,
  k8: 59.4000,
  k9: 3.9000,
  k10: 47.5000,
  k11: 91.1000,
  k12: 35.6000,
  k13: 79.2000,
  k14: 23.7000,
  k15: 67.3000,
  k16: 11.8000,
  k17: 55.4000,
  k18: 99.0000,
  k19: 43.5000,
  k20: 87.1000,
  k21: 31.6000,
  k22: 75.2000,
  k23: 19.7000,
  k24: 63.3000,
  k25: 7.8000,
  k26: 51.4000,
  k27: 95.0000,
  k28: 39.5000,
  k29: 83.1000,
  k30: 27.6000,
  k31: 71.2000,
  k32: 15.7000,
  k33: 59.3000,
  k34: 3.8000,
  k35: 47.4000,
  k36: 91.0000,
  k37: 35.5000,
  k38: 79.1000,
  k39: 23.6000,
  k40: 67.2000,
  k41: 11.7000,
  k42: 55.3000,
  k43: 98.9000,
  k44: 43.4000,
  k45: 87.0000,
  k46: 31.5000,
  k47: 75.1000,
  k48: 19.6000,
  k49: 63.2000,
  k50: 7.7000,
  k51: 51.3000,
  k52: 94.9000,
  k53: 39.4000,
  k54: 83.0000,
  k55: 27.5000,
  k56: 71.1000,
  k57: 15.6000,
  k58: 59.2000,
  k59: 3.7000,
  k60: 47.3000,
  k61: 90.9000,
  k62: 35.4000,
  k63: 79.0000,
  k64: 23.5000,
  k65: 67.1000,
  k66: 11.6000,
  k67: 55.2000,
  k68: 98.8000,
  k69: 43.3000,
  k70: 86.9000,
  k71: 31.4000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_040_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_040_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_040_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_040_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_040_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_040_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_040_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_040_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_040_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_040_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_040_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_040_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
