import { V1018_FFED_clamp, V1018_FFED_complianceFromScore } from '../../engine/fiscal-federalism-utils.ts';
import type {
  V1018FfedTransferBand,
  V1018FfedRegionId,
  V1018FfedTransferSnapshot,
  V1018FfedSystemDomain,
} from '../../types/core.ts';

/** Generated transfer scenario 122 — fiscal federalism / compliance matrix. */
export const V1018_FFED_TRANSFER_SCENARIO_122_META = {
  id: 'transfer_122',
  regionId: 'QLD' as V1018FfedRegionId,
  primarySystem: 'water' as V1018FfedSystemDomain,
  transferBand: 'active' as V1018FfedTransferBand,
  seed: 107035,
} as const;

const V1018_FFED_TRANSFER_SCENARIO_122_COEF = {
  k0: 4.9000,
  k1: 5.6000,
  k2: 6.3000,
  k3: 7.0000,
  k4: 7.7000,
  k5: 8.4000,
  k6: 9.1000,
  k7: 9.8000,
  k8: 10.5000,
  k9: 11.2000,
  k10: 11.9000,
  k11: 12.6000,
  k12: 13.3000,
  k13: 14.0000,
  k14: 14.7000,
  k15: 15.4000,
  k16: 16.1000,
  k17: 16.8000,
  k18: 17.5000,
  k19: 18.2000,
  k20: 18.9000,
  k21: 19.6000,
  k22: 20.3000,
  k23: 21.0000,
  k24: 21.7000,
  k25: 22.4000,
  k26: 23.1000,
  k27: 23.8000,
  k28: 24.5000,
  k29: 25.2000,
  k30: 25.9000,
  k31: 26.6000,
  k32: 27.3000,
  k33: 28.0000,
  k34: 28.7000,
  k35: 29.4000,
  k36: 30.1000,
  k37: 30.8000,
  k38: 31.5000,
  k39: 32.2000,
  k40: 32.9000,
  k41: 33.6000,
  k42: 34.3000,
  k43: 35.0000,
  k44: 35.7000,
  k45: 36.4000,
  k46: 37.1000,
  k47: 37.8000,
  k48: 38.5000,
  k49: 39.2000,
  k50: 39.9000,
  k51: 40.6000,
  k52: 41.3000,
  k53: 42.0000,
  k54: 42.7000,
  k55: 43.4000,
  k56: 44.1000,
  k57: 44.8000,
  k58: 45.5000,
  k59: 46.2000,
  k60: 46.9000,
  k61: 47.6000,
  k62: 48.3000,
  k63: 49.0000,
  k64: 49.7000,
  k65: 50.4000,
  k66: 51.1000,
  k67: 51.8000,
  k68: 52.5000,
  k69: 53.2000,
  k70: 53.9000,
  k71: 54.6000,
} as const;

export function V1018_FFED_TRANSFER_SCENARIO_122_evaluate(turn: number): {
  severityIndex: number;
  grantStackDelayTurns: number;
  complianceScore: number;
  stable: boolean;
} {
  let acc = 0;
  const keys = Object.keys(V1018_FFED_TRANSFER_SCENARIO_122_COEF) as Array<
    keyof typeof V1018_FFED_TRANSFER_SCENARIO_122_COEF
  >;
  for (let j = 0; j < keys.length; j++) {
    acc += V1018_FFED_TRANSFER_SCENARIO_122_COEF[keys[j]] * ((turn + j) % 13);
  }
  const severityIndex = V1018_FFED_clamp(18 + (acc % 62) + turn * 0.05, 0, 100);
  const grantStackDelayTurns = V1018_FFED_clamp(2 + (acc % 9), 1, 16);
  const complianceScore = V1018_FFED_clamp(88 - severityIndex * 0.62 + (turn % 7) * 0.4, 0, 100);
  const stable = V1018_FFED_complianceFromScore(complianceScore) !== 'fragile';
  return { severityIndex, grantStackDelayTurns, complianceScore, stable };
}

export function V1018_FFED_TRANSFER_SCENARIO_122_snapshot(turn: number): V1018FfedTransferSnapshot {
  const r = V1018_FFED_TRANSFER_SCENARIO_122_evaluate(turn);
  return {
    scenarioId: V1018_FFED_TRANSFER_SCENARIO_122_META.id,
    regionId: V1018_FFED_TRANSFER_SCENARIO_122_META.regionId,
    systemDomain: V1018_FFED_TRANSFER_SCENARIO_122_META.primarySystem,
    transferBand: V1018_FFED_TRANSFER_SCENARIO_122_META.transferBand,
    severityIndex: r.severityIndex,
    grantStackDelayTurns: r.grantStackDelayTurns,
    complianceScore: r.complianceScore,
    complianceBand: V1018_FFED_complianceFromScore(r.complianceScore),
  };
}

export function V1018_FFED_TRANSFER_SCENARIO_122_regressionAssert(turn: number): boolean {
  const r = V1018_FFED_TRANSFER_SCENARIO_122_evaluate(turn);
  return typeof r.severityIndex === 'number' && r.complianceScore <= 100;
}
