import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 092 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_092_META = {
  id: 'lane_092',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'water' as V1019MtrdSystemDomain,
  laneBand: 'active' as V1019MtrdLaneBand,
  seed: 80725,
} as const;

const V1019_MTRD_LANE_SCENARIO_092_COEF = {
  k0: 20.5000,
  k1: 65.9000,
  k2: 12.2000,
  k3: 57.6000,
  k4: 3.9000,
  k5: 49.3000,
  k6: 94.7000,
  k7: 41.0000,
  k8: 86.4000,
  k9: 32.7000,
  k10: 78.1000,
  k11: 24.4000,
  k12: 69.8000,
  k13: 16.1000,
  k14: 61.5000,
  k15: 7.8000,
  k16: 53.2000,
  k17: 98.6000,
  k18: 44.9000,
  k19: 90.3000,
  k20: 36.6000,
  k21: 82.0000,
  k22: 28.3000,
  k23: 73.7000,
  k24: 20.0000,
  k25: 65.4000,
  k26: 11.7000,
  k27: 57.1000,
  k28: 3.4000,
  k29: 48.8000,
  k30: 94.2000,
  k31: 40.5000,
  k32: 85.9000,
  k33: 32.2000,
  k34: 77.6000,
  k35: 23.9000,
  k36: 69.3000,
  k37: 15.6000,
  k38: 61.0000,
  k39: 7.3000,
  k40: 52.7000,
  k41: 98.1000,
  k42: 44.4000,
  k43: 89.8000,
  k44: 36.1000,
  k45: 81.5000,
  k46: 27.8000,
  k47: 73.2000,
  k48: 19.5000,
  k49: 64.9000,
  k50: 11.2000,
  k51: 56.6000,
  k52: 2.9000,
  k53: 48.3000,
  k54: 93.7000,
  k55: 40.0000,
  k56: 85.4000,
  k57: 31.7000,
  k58: 77.1000,
  k59: 23.4000,
  k60: 68.8000,
  k61: 15.1000,
  k62: 60.5000,
  k63: 6.8000,
  k64: 52.2000,
  k65: 97.6000,
  k66: 43.9000,
  k67: 89.3000,
  k68: 35.6000,
  k69: 81.0000,
  k70: 27.3000,
  k71: 72.7000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_092_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_092_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_092_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_092_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_092_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_092_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_092_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_092_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_092_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_092_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_092_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_092_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
