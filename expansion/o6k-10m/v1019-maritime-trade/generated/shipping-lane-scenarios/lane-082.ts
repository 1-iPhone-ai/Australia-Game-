import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 082 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_082_META = {
  id: 'lane_082',
  regionId: 'QLD' as V1019MtrdRegionId,
  primarySystem: 'water' as V1019MtrdSystemDomain,
  laneBand: 'active' as V1019MtrdLaneBand,
  seed: 71955,
} as const;

const V1019_MTRD_LANE_SCENARIO_082_COEF = {
  k0: 25.7000,
  k1: 86.0000,
  k2: 47.2000,
  k3: 8.4000,
  k4: 68.7000,
  k5: 29.9000,
  k6: 90.2000,
  k7: 51.4000,
  k8: 12.6000,
  k9: 72.9000,
  k10: 34.1000,
  k11: 94.4000,
  k12: 55.6000,
  k13: 16.8000,
  k14: 77.1000,
  k15: 38.3000,
  k16: 98.6000,
  k17: 59.8000,
  k18: 21.0000,
  k19: 81.3000,
  k20: 42.5000,
  k21: 3.7000,
  k22: 64.0000,
  k23: 25.2000,
  k24: 85.5000,
  k25: 46.7000,
  k26: 7.9000,
  k27: 68.2000,
  k28: 29.4000,
  k29: 89.7000,
  k30: 50.9000,
  k31: 12.1000,
  k32: 72.4000,
  k33: 33.6000,
  k34: 93.9000,
  k35: 55.1000,
  k36: 16.3000,
  k37: 76.6000,
  k38: 37.8000,
  k39: 98.1000,
  k40: 59.3000,
  k41: 20.5000,
  k42: 80.8000,
  k43: 42.0000,
  k44: 3.2000,
  k45: 63.5000,
  k46: 24.7000,
  k47: 85.0000,
  k48: 46.2000,
  k49: 7.4000,
  k50: 67.7000,
  k51: 28.9000,
  k52: 89.2000,
  k53: 50.4000,
  k54: 11.6000,
  k55: 71.9000,
  k56: 33.1000,
  k57: 93.4000,
  k58: 54.6000,
  k59: 15.8000,
  k60: 76.1000,
  k61: 37.3000,
  k62: 97.6000,
  k63: 58.8000,
  k64: 20.0000,
  k65: 80.3000,
  k66: 41.5000,
  k67: 2.7000,
  k68: 63.0000,
  k69: 24.2000,
  k70: 84.5000,
  k71: 45.7000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_082_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_082_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_082_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_082_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_082_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_082_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_082_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_082_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_082_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_082_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_082_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_082_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
