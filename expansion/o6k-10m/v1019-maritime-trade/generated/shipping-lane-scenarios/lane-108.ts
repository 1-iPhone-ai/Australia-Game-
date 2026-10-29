import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 108 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_108_META = {
  id: 'lane_108',
  regionId: 'SA' as V1019MtrdRegionId,
  primarySystem: 'telecom' as V1019MtrdSystemDomain,
  laneBand: 'critical' as V1019MtrdLaneBand,
  seed: 94757,
} as const;

const V1019_MTRD_LANE_SCENARIO_108_COEF = {
  k0: 32.0000,
  k1: 93.2000,
  k2: 55.3000,
  k3: 17.4000,
  k4: 78.6000,
  k5: 40.7000,
  k6: 2.8000,
  k7: 64.0000,
  k8: 26.1000,
  k9: 87.3000,
  k10: 49.4000,
  k11: 11.5000,
  k12: 72.7000,
  k13: 34.8000,
  k14: 96.0000,
  k15: 58.1000,
  k16: 20.2000,
  k17: 81.4000,
  k18: 43.5000,
  k19: 5.6000,
  k20: 66.8000,
  k21: 28.9000,
  k22: 90.1000,
  k23: 52.2000,
  k24: 14.3000,
  k25: 75.5000,
  k26: 37.6000,
  k27: 98.8000,
  k28: 60.9000,
  k29: 23.0000,
  k30: 84.2000,
  k31: 46.3000,
  k32: 8.4000,
  k33: 69.6000,
  k34: 31.7000,
  k35: 92.9000,
  k36: 55.0000,
  k37: 17.1000,
  k38: 78.3000,
  k39: 40.4000,
  k40: 2.5000,
  k41: 63.7000,
  k42: 25.8000,
  k43: 87.0000,
  k44: 49.1000,
  k45: 11.2000,
  k46: 72.4000,
  k47: 34.5000,
  k48: 95.7000,
  k49: 57.8000,
  k50: 19.9000,
  k51: 81.1000,
  k52: 43.2000,
  k53: 5.3000,
  k54: 66.5000,
  k55: 28.6000,
  k56: 89.8000,
  k57: 51.9000,
  k58: 14.0000,
  k59: 75.2000,
  k60: 37.3000,
  k61: 98.5000,
  k62: 60.6000,
  k63: 22.7000,
  k64: 83.9000,
  k65: 46.0000,
  k66: 8.1000,
  k67: 69.3000,
  k68: 31.4000,
  k69: 92.6000,
  k70: 54.7000,
  k71: 16.8000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_108_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_108_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_108_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_108_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_108_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_108_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_108_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_108_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_108_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_108_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_108_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_108_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
