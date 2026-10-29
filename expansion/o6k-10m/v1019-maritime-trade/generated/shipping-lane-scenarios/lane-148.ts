import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 148 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_148_META = {
  id: 'lane_148',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'telecom' as V1019MtrdSystemDomain,
  laneBand: 'critical' as V1019MtrdLaneBand,
  seed: 129837,
} as const;

const V1019_MTRD_LANE_SCENARIO_148_COEF = {
  k0: 11.2000,
  k1: 12.8000,
  k2: 14.4000,
  k3: 16.0000,
  k4: 17.6000,
  k5: 19.2000,
  k6: 20.8000,
  k7: 22.4000,
  k8: 24.0000,
  k9: 25.6000,
  k10: 27.2000,
  k11: 28.8000,
  k12: 30.4000,
  k13: 32.0000,
  k14: 33.6000,
  k15: 35.2000,
  k16: 36.8000,
  k17: 38.4000,
  k18: 40.0000,
  k19: 41.6000,
  k20: 43.2000,
  k21: 44.8000,
  k22: 46.4000,
  k23: 48.0000,
  k24: 49.6000,
  k25: 51.2000,
  k26: 52.8000,
  k27: 54.4000,
  k28: 56.0000,
  k29: 57.6000,
  k30: 59.2000,
  k31: 60.8000,
  k32: 62.4000,
  k33: 64.0000,
  k34: 65.6000,
  k35: 67.2000,
  k36: 68.8000,
  k37: 70.4000,
  k38: 72.0000,
  k39: 73.6000,
  k40: 75.2000,
  k41: 76.8000,
  k42: 78.4000,
  k43: 80.0000,
  k44: 81.6000,
  k45: 83.2000,
  k46: 84.8000,
  k47: 86.4000,
  k48: 88.0000,
  k49: 89.6000,
  k50: 91.2000,
  k51: 92.8000,
  k52: 94.4000,
  k53: 96.0000,
  k54: 97.6000,
  k55: 0.1000,
  k56: 1.7000,
  k57: 3.3000,
  k58: 4.9000,
  k59: 6.5000,
  k60: 8.1000,
  k61: 9.7000,
  k62: 11.3000,
  k63: 12.9000,
  k64: 14.5000,
  k65: 16.1000,
  k66: 17.7000,
  k67: 19.3000,
  k68: 20.9000,
  k69: 22.5000,
  k70: 24.1000,
  k71: 25.7000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_148_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_148_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_148_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_148_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_148_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_148_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_148_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_148_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_148_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_148_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_148_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_148_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
