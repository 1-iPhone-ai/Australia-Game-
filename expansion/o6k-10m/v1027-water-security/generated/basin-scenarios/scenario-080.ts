import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 080 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_080_META = {
  id: 'basin_080',
  regionId: 'NSW' as V1027WsecRegionId,
  primaryChannel: 'emergency_care' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'minimal' as V1027WsecWaterSecurityBand,
  seed: 73401,
} as const;

const V1027_WSEC_BASIN_SCENARIO_080_COEF = {
  k0: 83.8000,
  k1: 46.1000,
  k2: 8.4000,
  k3: 70.4000,
  k4: 32.7000,
  k5: 94.7000,
  k6: 57.0000,
  k7: 19.3000,
  k8: 81.3000,
  k9: 43.6000,
  k10: 5.9000,
  k11: 67.9000,
  k12: 30.2000,
  k13: 92.2000,
  k14: 54.5000,
  k15: 16.8000,
  k16: 78.8000,
  k17: 41.1000,
  k18: 3.4000,
  k19: 65.4000,
  k20: 27.7000,
  k21: 89.7000,
  k22: 52.0000,
  k23: 14.3000,
  k24: 76.3000,
  k25: 38.6000,
  k26: 0.9000,
  k27: 62.9000,
  k28: 25.2000,
  k29: 87.2000,
  k30: 49.5000,
  k31: 11.8000,
  k32: 73.8000,
  k33: 36.1000,
  k34: 98.1000,
  k35: 60.4000,
  k36: 22.7000,
  k37: 84.7000,
  k38: 47.0000,
  k39: 9.3000,
  k40: 71.3000,
  k41: 33.6000,
  k42: 95.6000,
  k43: 57.9000,
  k44: 20.2000,
  k45: 82.2000,
  k46: 44.5000,
  k47: 6.8000,
  k48: 68.8000,
  k49: 31.1000,
  k50: 93.1000,
  k51: 55.4000,
  k52: 17.7000,
  k53: 79.7000,
  k54: 42.0000,
  k55: 4.3000,
  k56: 66.3000,
  k57: 28.6000,
  k58: 90.6000,
  k59: 52.9000,
  k60: 15.2000,
  k61: 77.2000,
  k62: 39.5000,
  k63: 1.8000,
  k64: 63.8000,
  k65: 26.1000,
  k66: 88.1000,
  k67: 50.4000,
  k68: 12.7000,
  k69: 74.7000,
  k70: 37.0000,
  k71: 99.0000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_080_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_080_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_080_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_080_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_080_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_080_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_080_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_080_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_080_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_080_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_080_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_080_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
