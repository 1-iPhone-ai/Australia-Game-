import { V1019_MTRD_clamp, V1019_MTRD_portFromScore } from '../../engine/maritime-trade-utils.ts';
import type {
  V1019MtrdLaneBand,
  V1019MtrdRegionId,
  V1019MtrdShippingLaneSnapshot,
  V1019MtrdSystemDomain,
} from '../../types/core.ts';

/** Generated freight-route scenario 057 — maritime trade / hub matrix. */
export const V1019_MTRD_LANE_SCENARIO_057_META = {
  id: 'lane_057',
  regionId: 'VIC' as V1019MtrdRegionId,
  primarySystem: 'industrial' as V1019MtrdSystemDomain,
  laneBand: 'active' as V1019MtrdLaneBand,
  seed: 50030,
} as const;

const V1019_MTRD_LANE_SCENARIO_057_COEF = {
  k0: 38.7000,
  k1: 86.7000,
  k2: 35.6000,
  k3: 83.6000,
  k4: 32.5000,
  k5: 80.5000,
  k6: 29.4000,
  k7: 77.4000,
  k8: 26.3000,
  k9: 74.3000,
  k10: 23.2000,
  k11: 71.2000,
  k12: 20.1000,
  k13: 68.1000,
  k14: 17.0000,
  k15: 65.0000,
  k16: 13.9000,
  k17: 61.9000,
  k18: 10.8000,
  k19: 58.8000,
  k20: 7.7000,
  k21: 55.7000,
  k22: 4.6000,
  k23: 52.6000,
  k24: 1.5000,
  k25: 49.5000,
  k26: 97.5000,
  k27: 46.4000,
  k28: 94.4000,
  k29: 43.3000,
  k30: 91.3000,
  k31: 40.2000,
  k32: 88.2000,
  k33: 37.1000,
  k34: 85.1000,
  k35: 34.0000,
  k36: 82.0000,
  k37: 30.9000,
  k38: 78.9000,
  k39: 27.8000,
  k40: 75.8000,
  k41: 24.7000,
  k42: 72.7000,
  k43: 21.6000,
  k44: 69.6000,
  k45: 18.5000,
  k46: 66.5000,
  k47: 15.4000,
  k48: 63.4000,
  k49: 12.3000,
  k50: 60.3000,
  k51: 9.2000,
  k52: 57.2000,
  k53: 6.1000,
  k54: 54.1000,
  k55: 3.0000,
  k56: 51.0000,
  k57: 99.0000,
  k58: 47.9000,
  k59: 95.9000,
  k60: 44.8000,
  k61: 92.8000,
  k62: 41.7000,
  k63: 89.7000,
  k64: 38.6000,
  k65: 86.6000,
  k66: 35.5000,
  k67: 83.5000,
  k68: 32.4000,
  k69: 80.4000,
  k70: 29.3000,
  k71: 77.3000,
} as const;

export function V1019_MTRD_LANE_SCENARIO_057_evaluate(turn: number): {
  severityIndex: number;
  transitDelayTurns: number;
  portScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1019_MTRD_LANE_SCENARIO_057_COEF) as Array<
    keyof typeof V1019_MTRD_LANE_SCENARIO_057_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1019_MTRD_LANE_SCENARIO_057_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1019_MTRD_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const transitDelayTurns = V1019_MTRD_clamp(2 + (acc % 9), 1, 16);
  const portScore = V1019_MTRD_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1019_MTRD_portFromScore(portScore) !== 'fragile';
  return { severityIndex, transitDelayTurns, portScore, stable };
}

export function V1019_MTRD_LANE_SCENARIO_057_snapshot(turn: number): V1019MtrdShippingLaneSnapshot {
  const r = V1019_MTRD_LANE_SCENARIO_057_evaluate(turn);
  return {
    scenarioId: V1019_MTRD_LANE_SCENARIO_057_META.id,
    regionId: V1019_MTRD_LANE_SCENARIO_057_META.regionId,
    systemDomain: V1019_MTRD_LANE_SCENARIO_057_META.primarySystem,
    laneBand: V1019_MTRD_LANE_SCENARIO_057_META.laneBand,
    severityIndex: r.severityIndex,
    transitDelayTurns: r.transitDelayTurns,
    portScore: r.portScore,
    portBand: V1019_MTRD_portFromScore(r.portScore),
  };
}

export function V1019_MTRD_LANE_SCENARIO_057_regressionAssert(turn: number): boolean {
  const r = V1019_MTRD_LANE_SCENARIO_057_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.portScore <= 100;
}
