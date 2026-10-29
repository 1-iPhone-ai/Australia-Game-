import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 140 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_140_META = {
  id: 'basin_140',
  regionId: 'SA' as V1027WsecRegionId,
  primaryChannel: 'emergency_care' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'minimal' as V1027WsecWaterSecurityBand,
  seed: 128061,
} as const;

const V1027_WSEC_BASIN_SCENARIO_140_COEF = {
  k0: 90.7000,
  k1: 35.5000,
  k2: 80.0000,
  k3: 24.8000,
  k4: 69.3000,
  k5: 14.1000,
  k6: 58.6000,
  k7: 3.4000,
  k8: 47.9000,
  k9: 92.4000,
  k10: 37.2000,
  k11: 81.7000,
  k12: 26.5000,
  k13: 71.0000,
  k14: 15.8000,
  k15: 60.3000,
  k16: 5.1000,
  k17: 49.6000,
  k18: 94.1000,
  k19: 38.9000,
  k20: 83.4000,
  k21: 28.2000,
  k22: 72.7000,
  k23: 17.5000,
  k24: 62.0000,
  k25: 6.8000,
  k26: 51.3000,
  k27: 95.8000,
  k28: 40.6000,
  k29: 85.1000,
  k30: 29.9000,
  k31: 74.4000,
  k32: 19.2000,
  k33: 63.7000,
  k34: 8.5000,
  k35: 53.0000,
  k36: 97.5000,
  k37: 42.3000,
  k38: 86.8000,
  k39: 31.6000,
  k40: 76.1000,
  k41: 20.9000,
  k42: 65.4000,
  k43: 10.2000,
  k44: 54.7000,
  k45: 99.2000,
  k46: 44.0000,
  k47: 88.5000,
  k48: 33.3000,
  k49: 77.8000,
  k50: 22.6000,
  k51: 67.1000,
  k52: 11.9000,
  k53: 56.4000,
  k54: 1.2000,
  k55: 45.7000,
  k56: 90.2000,
  k57: 35.0000,
  k58: 79.5000,
  k59: 24.3000,
  k60: 68.8000,
  k61: 13.6000,
  k62: 58.1000,
  k63: 2.9000,
  k64: 47.4000,
  k65: 91.9000,
  k66: 36.7000,
  k67: 81.2000,
  k68: 26.0000,
  k69: 70.5000,
  k70: 15.3000,
  k71: 59.8000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_140_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_140_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_140_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_140_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_140_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_140_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_140_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_140_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_140_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_140_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_140_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_140_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
