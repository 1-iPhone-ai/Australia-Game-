import { V1027_WSEC_clamp, V1027_WSEC_waterSecurityBandFromScore } from '../../engine/water-security-utils.ts';
import type {
  V1027WsecWaterSecurityBand,
  V1027WsecRegionId,
  V1027WsecBasinSnapshot,
  V1027WsecWaterSecurityChannel,
} from '../../types/core.ts';

/** Generated basin scenario 142 — surface/ground/aquifer handoff matrix. */
export const V1027_WSEC_BASIN_SCENARIO_142_META = {
  id: 'basin_142',
  regionId: 'NT' as V1027WsecRegionId,
  primaryChannel: 'distribution_network' as V1027WsecWaterSecurityChannel,
  waterSecurityBand: 'elevated' as V1027WsecWaterSecurityBand,
  seed: 129883,
} as const;

const V1027_WSEC_BASIN_SCENARIO_142_COEF = {
  k0: 1.2000,
  k1: 28.5000,
  k2: 55.8000,
  k3: 83.1000,
  k4: 10.7000,
  k5: 38.0000,
  k6: 65.3000,
  k7: 92.6000,
  k8: 20.2000,
  k9: 47.5000,
  k10: 74.8000,
  k11: 2.4000,
  k12: 29.7000,
  k13: 57.0000,
  k14: 84.3000,
  k15: 11.9000,
  k16: 39.2000,
  k17: 66.5000,
  k18: 93.8000,
  k19: 21.4000,
  k20: 48.7000,
  k21: 76.0000,
  k22: 3.6000,
  k23: 30.9000,
  k24: 58.2000,
  k25: 85.5000,
  k26: 13.1000,
  k27: 40.4000,
  k28: 67.7000,
  k29: 95.0000,
  k30: 22.6000,
  k31: 49.9000,
  k32: 77.2000,
  k33: 4.8000,
  k34: 32.1000,
  k35: 59.4000,
  k36: 86.7000,
  k37: 14.3000,
  k38: 41.6000,
  k39: 68.9000,
  k40: 96.2000,
  k41: 23.8000,
  k42: 51.1000,
  k43: 78.4000,
  k44: 6.0000,
  k45: 33.3000,
  k46: 60.6000,
  k47: 87.9000,
  k48: 15.5000,
  k49: 42.8000,
  k50: 70.1000,
  k51: 97.4000,
  k52: 25.0000,
  k53: 52.3000,
  k54: 79.6000,
  k55: 7.2000,
  k56: 34.5000,
  k57: 61.8000,
  k58: 89.1000,
  k59: 16.7000,
  k60: 44.0000,
  k61: 71.3000,
  k62: 98.6000,
  k63: 26.2000,
  k64: 53.5000,
  k65: 80.8000,
  k66: 8.4000,
  k67: 35.7000,
  k68: 63.0000,
  k69: 90.3000,
  k70: 17.9000,
  k71: 45.2000,
} as const;

export function V1027_WSEC_BASIN_SCENARIO_142_evaluate(turn: number): {
  waterStressIndex: number;
  aquiferReserveDelayTurns: number;
  waterSecurityScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1027_WSEC_BASIN_SCENARIO_142_COEF) as Array<
    keyof typeof V1027_WSEC_BASIN_SCENARIO_142_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1027_WSEC_BASIN_SCENARIO_142_COEF[keys[j]] * ((turn + j) % 17);
  }
  const waterStressIndex = V1027_WSEC_clamp(16 + (acc % 58) + turn * 0.06, 0, 100);
  const aquiferReserveDelayTurns = V1027_WSEC_clamp(2 + (acc % 11), 1, 18);
  const waterSecurityScore = V1027_WSEC_clamp(90 - waterStressIndex * 0.58 + (turn % 9) * 0.35, 0, 100);
  const stable = V1027_WSEC_waterSecurityBandFromScore(waterSecurityScore) !== 'depleted';
  return { waterStressIndex, aquiferReserveDelayTurns, waterSecurityScore, stable };
}

export function V1027_WSEC_BASIN_SCENARIO_142_snapshot(turn: number): V1027WsecBasinSnapshot {
  const r = V1027_WSEC_BASIN_SCENARIO_142_evaluate(turn);
  return {
    scenarioId: V1027_WSEC_BASIN_SCENARIO_142_META.id,
    regionId: V1027_WSEC_BASIN_SCENARIO_142_META.regionId,
    waterSecurityChannel: V1027_WSEC_BASIN_SCENARIO_142_META.primaryChannel,
    waterSecurityBand: V1027_WSEC_BASIN_SCENARIO_142_META.waterSecurityBand,
    waterStressIndex: r.waterStressIndex,
    aquiferReserveDelayTurns: r.aquiferReserveDelayTurns,
    waterSecurityScore: r.waterSecurityScore,
    waterSecurityBand: V1027_WSEC_waterSecurityBandFromScore(r.waterSecurityScore),
  };
}

export function V1027_WSEC_BASIN_SCENARIO_142_regressionAssert(turn: number): boolean {
  const r = V1027_WSEC_BASIN_SCENARIO_142_evaluate(turn);
  return typeof r.waterStressIndex === 'number' && r.waterSecurityScore <= 100;
}
